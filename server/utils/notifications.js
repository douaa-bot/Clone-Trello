import User from '../models/User.js';
import { io } from '../server.js';

export const createNotification = async (userId, type, message, projectId = null, taskId = null) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const notification = {
      type,
      message,
      projectId,
      taskId,
      read: false
    };

    user.notifications.push(notification);
    await user.save();

    const savedNotification = user.notifications[user.notifications.length - 1];

    // Émettre l'événement Socket.io pour notifier l'utilisateur en temps réel
    io.emit('notification-created', {
      userId: userId.toString(),
      notification: savedNotification
    });

    return savedNotification;
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
  }
};

export const notifyTaskAssigned = async (assignedUsers, taskTitle, projectName, taskId, projectId) => {
  if (!assignedUsers || assignedUsers.length === 0) return;

  const promises = assignedUsers.map(userId =>
    createNotification(
      userId,
      'task-assigned',
      `Une nouvelle tâche "${taskTitle}" vous a été assignée dans le projet "${projectName}"`,
      projectId,
      taskId
    )
  );

  await Promise.all(promises);
};

export const notifyTaskComment = async (taskAssignedUsers, commenterName, taskTitle, taskId, projectId) => {
  if (!taskAssignedUsers || taskAssignedUsers.length === 0) return;

  const promises = taskAssignedUsers.map(userId =>
    createNotification(
      userId,
      'task-comment',
      `${commenterName} a commenté sur la tâche "${taskTitle}"`,
      projectId,
      taskId
    )
  );

  await Promise.all(promises);
};

export const notifyTaskUpdated = async (assignedUsers, taskTitle, projectName, taskId, projectId) => {
  if (!assignedUsers || assignedUsers.length === 0) return;

  const promises = assignedUsers.map(userId =>
    createNotification(
      userId,
      'task-updated',
      `La tâche "${taskTitle}" a été mise à jour dans le projet "${projectName}"`,
      projectId,
      taskId
    )
  );

  await Promise.all(promises);
};
