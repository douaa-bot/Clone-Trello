import express from 'express';
import { body, validationResult } from 'express-validator';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';
import { io } from '../server.js';
import { notifyTaskAssigned, notifyTaskUpdated, notifyTaskComment } from '../utils/notifications.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(protect);

// @route   GET /api/tasks/project/:projectId
// @desc    Obtenir toutes les tâches d'un projet
router.get('/project/:projectId', async (req, res) => {
  try {
    // Vérifier que l'utilisateur a accès au projet
    const project = await Project.findOne({
      _id: req.params.projectId,
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    });

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé ou accès refusé' });
    }

    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name email avatar')
      .sort({ position: 1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// @route   POST /api/tasks
// @desc    Créer une nouvelle tâche
router.post('/', [
  body('title').trim().notEmpty().withMessage('Le titre est requis'),
  body('project').notEmpty().withMessage('Le projet est requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Vérifier l'accès au projet
    const project = await Project.findOne({
      _id: req.body.project,
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    });

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé ou accès refusé' });
    }

    // Obtenir la position maximale dans la colonne
    const maxPosition = await Task.findOne(
      { project: req.body.project, column: req.body.column || 'todo' },
      {},
      { sort: { position: -1 } }
    );

    const task = await Task.create({
      ...req.body,
      createdBy: req.user._id,
      position: maxPosition ? maxPosition.position + 1 : 0
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name email avatar');

    // Créer des notifications pour les utilisateurs assignés
    if (req.body.assignedTo && req.body.assignedTo.length > 0) {
      await notifyTaskAssigned(
        req.body.assignedTo,
        populatedTask.title,
        project.name,
        populatedTask._id,
        project._id
      );
    }

    // Émettre l'événement Socket.io
    io.to(`project-${project._id}`).emit('task-created', {
      projectId: project._id,
      task: populatedTask
    });

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Modifier une tâche
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'owner members');

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    // Vérifier l'accès au projet
    const project = task.project;
    const hasAccess = project.owner.toString() === req.user._id.toString() ||
      project.members.some(m => m.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { title, description, column, priority, dueDate, assignedTo, position } = req.body;
    const oldAssignedTo = task.assignedTo.map((id) => id.toString());
    const newAssignedTo = assignedTo ? assignedTo.map((id) => id.toString()) : oldAssignedTo;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (column !== undefined) task.column = column;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (position !== undefined) task.position = position;

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name email avatar');

    // Créer des notifications pour les nouveaux utilisateurs assignés
    if (assignedTo !== undefined) {
      const newlyAssigned = newAssignedTo.filter((id) => !oldAssignedTo.includes(id));
      if (newlyAssigned.length > 0) {
        await notifyTaskAssigned(
          newlyAssigned,
          populatedTask.title,
          project.name,
          populatedTask._id,
          project._id
        );
      }
      
      // Notifier les utilisateurs assignés si la tâche a été mise à jour
      if (newlyAssigned.length === 0 && newAssignedTo.length > 0) {
        await notifyTaskUpdated(
          newAssignedTo,
          populatedTask.title,
          project.name,
          populatedTask._id,
          project._id
        );
      }
    }

    // Émettre l'événement Socket.io
    io.to(`project-${project._id}`).emit('task-updated', {
      projectId: project._id,
      task: populatedTask
    });

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// @route   PUT /api/tasks/:id/move
// @desc    Déplacer une tâche (drag & drop)
router.put('/:id/move', [
  body('column').isIn(['todo', 'doing', 'done']).withMessage('Colonne invalide'),
  body('position').isInt().withMessage('Position invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findById(req.params.id)
      .populate('project', 'owner members');

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    const project = task.project;
    const hasAccess = project.owner.toString() === req.user._id.toString() ||
      project.members.some(m => m.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { column, position } = req.body;
    const oldColumn = task.column;

    // Réorganiser les positions dans l'ancienne colonne
    if (oldColumn !== column) {
      await Task.updateMany(
        {
          project: task.project,
          column: oldColumn,
          position: { $gt: task.position }
        },
        { $inc: { position: -1 } }
      );
    }

    // Réorganiser les positions dans la nouvelle colonne
    await Task.updateMany(
      {
        project: task.project,
        column: column,
        position: { $gte: position },
        _id: { $ne: task._id }
      },
      { $inc: { position: 1 } }
    );

    task.column = column;
    task.position = position;
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name email avatar');

    // Émettre l'événement Socket.io
    io.to(`project-${project._id}`).emit('task-updated', {
      projectId: project._id,
      task: populatedTask
    });

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Supprimer une tâche
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'owner members');

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    const project = task.project;
    const hasAccess = project.owner.toString() === req.user._id.toString() ||
      project.members.some(m => m.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Réorganiser les positions
    await Task.updateMany(
      {
        project: task.project,
        column: task.column,
        position: { $gt: task.position }
      },
      { $inc: { position: -1 } }
    );

    await Task.findByIdAndDelete(req.params.id);

    // Émettre l'événement Socket.io
    io.to(`project-${project._id}`).emit('task-deleted', {
      projectId: project._id,
      taskId: task._id
    });

    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// @route   POST /api/tasks/:id/comments
// @desc    Ajouter un commentaire à une tâche
router.post('/:id/comments', [
  body('text').trim().notEmpty().withMessage('Le texte du commentaire est requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findById(req.params.id)
      .populate('project', 'owner members');

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    const project = task.project;
    const hasAccess = project.owner.toString() === req.user._id.toString() ||
      project.members.some(m => m.user.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    task.comments.push({
      user: req.user._id,
      text: req.body.text
    });

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name email avatar');

    // Créer des notifications pour les utilisateurs assignés (sauf celui qui a commenté)
    if (task.assignedTo && task.assignedTo.length > 0) {
      const assignedUserIds = task.assignedTo
        .map((id) => id.toString())
        .filter((id) => id !== req.user._id.toString());
      
      if (assignedUserIds.length > 0) {
        await notifyTaskComment(
          assignedUserIds,
          req.user.name,
          task.title,
          task._id,
          project._id
        );
      }
    }

    // Émettre l'événement Socket.io
    io.to(`project-${project._id}`).emit('task-updated', {
      projectId: project._id,
      task: populatedTask
    });

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

export default router;
