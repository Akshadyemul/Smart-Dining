import express from 'express';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
const router = express.Router();

// Get all restaurants (public)
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({}, { menu: 0, tables: 0 }); // Exclude menu/tables for list
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get specific restaurant detail (public)
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get restaurant profile by user ID
router.get('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(401).json({ message: 'User ID required' });
        
        const restaurant = await Restaurant.findOne({ ownerId: userId });
        res.json(restaurant || null);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get restaurant profile (with header auth)
router.get('/profile', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(401).json({ message: 'User ID required' });
        const restaurant = await Restaurant.findOne({ ownerId: userId });
        res.json(restaurant || null);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Save/Update restaurant profile
router.post('/profile', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(401).json({ message: 'User ID required' });
        
        // Get user details - handle both string IDs and ObjectIds
        let user;
        if (mongoose.Types.ObjectId.isValid(userId)) {
            user = await User.findById(userId);
        } else {
            user = await User.findOne({ _id: userId });
        }
        
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Prepare restaurant data with owner information
        // Use the owner data from request if provided, otherwise use user data
        const ownerData = {
            userId: userId,
            name: req.body.owner?.name || user.name,
            email: req.body.owner?.email || user.email,
            phone: req.body.owner?.phone || user.phone,
            photo: req.body.owner?.photo || ''
        };

        const profileData = {
            ...req.body,
            ownerId: userId,
            owner: ownerData,
            registeredAt: new Date(),
            updatedAt: new Date()
        };

        // Save/Update restaurant - store user details in the restaurant document
        const restaurant = await Restaurant.findOneAndUpdate(
            { ownerId: userId },
            profileData,
            { new: true, upsert: true }
        );

        // Update user to mark as restaurant owner
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                isRestaurantOwner: true,
                restaurantId: restaurant._id,
                role: 'owner',
                updatedAt: new Date()
            },
            { new: true }
        );

        // Return the complete restaurant document with owner details already stored
        res.json(restaurant);
    } catch (error) {
        console.error('Error saving restaurant profile:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get restaurant by owner name
router.get('/owner/:ownerName', async (req, res) => {
    try {
        const { ownerName } = req.params;
        const restaurant = await Restaurant.findOne({ 'owner.name': ownerName });
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
