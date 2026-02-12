import express from 'express';
import { body, validationResult } from 'express-validator';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(protect);

// @route   GET /api/projects
// @desc    Obtenir tous les projets de l'utilisateur
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    })
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .sort({ updatedAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// @route   GET /api/projects/:id
// @desc    Obtenir un projet spécifique
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    })
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// @route   POST /api/projects
// @desc    Créer un nouveau projet
router.post('/', [
  body('name').trim().notEmpty().withMessage('Le nom du projet est requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, color, background } = req.body;

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      color: color || '#6366f1',
      background,
      members: [{
        user: req.user._id,
        role: 'admin'
      }]
    });

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// @route   PUT /api/projects/:id
// @desc    Modifier un projet
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id, 'members.role': 'admin' }
      ]
    });

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé ou accès refusé' });
    }

    const { name, description, color, background } = req.body;

    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (color) project.color = color;
    if (background !== undefined) project.background = background;

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Supprimer un projet
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé ou accès refusé' });
    }

    // Supprimer toutes les tâches du projet
    await Task.deleteMany({ project: project._id });

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// @route   POST /api/projects/:id/members
// @desc    Ajouter un membre au projet
router.post('/:id/members', [
  body('email').isEmail().withMessage('Email invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id, 'members.role': 'admin' }
      ]
    }).populate('members.user', 'name email avatar');

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé ou accès refusé' });
    }

    const User = (await import('../models/User.js')).default;
    const userToAdd = await User.findOne({ email: req.body.email });

    if (!userToAdd) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'utilisateur est déjà membre
    const isMember = project.members.some(
      member => member.user._id.toString() === userToAdd._id.toString()
    );

    if (isMember) {
      return res.status(400).json({ message: 'Cet utilisateur est déjà membre du projet' });
    }

    project.members.push({
      user: userToAdd._id,
      role: req.body.role || 'member'
    });

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// @route   DELETE /api/projects/:id/members/:memberId
// @desc    Retirer un membre du projet
router.delete('/:id/members/:memberId', async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id, 'members.role': 'admin' }
      ]
    });

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé ou accès refusé' });
    }

    project.members = project.members.filter(
      member => member.user.toString() !== req.params.memberId
    );

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

export default router;
