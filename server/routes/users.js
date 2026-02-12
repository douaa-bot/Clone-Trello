import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(protect);

// @route   GET /api/users/search
// @desc    Rechercher des utilisateurs
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json([]);
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ],
      _id: { $ne: req.user._id }
    })
      .select('name email avatar')
      .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// @route   PUT /api/users/notifications/read
// @desc    Marquer les notifications comme lues
router.put('/notifications/read', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.notifications.forEach(notification => {
      notification.read = true;
    });

    await user.save();

    res.json({ message: 'Notifications marquées comme lues' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// @route   PUT /api/users/notifications/:id/read
// @desc    Marquer une notification comme lue
router.put('/notifications/:id/read', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const notification = user.notifications.id(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    notification.read = true;
    await user.save();

    res.json({ message: 'Notification marquée comme lue' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

export default router;
