import express from 'express';
import { Order, Reservation } from '../models/Transaction.js';
import Restaurant from '../models/Restaurant.js';
const router = express.Router();
// Helper to get restaurant ID for the current owner
const getRestaurantId = async (userId) => {
    const restaurant = await Restaurant.findOne({ ownerId: userId });
    return restaurant ? restaurant._id : null;
};
// Orders
router.get('/orders', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(401).json({ message: 'User ID required' });
        const restaurantId = await getRestaurantId(userId);
        if (!restaurantId) return res.json([]);
        const orders = await Order.find({ restaurantId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/orders', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const restaurantId = await getRestaurantId(userId);
        const orderData = { ...req.body, restaurantId };
        const order = new Order(orderData);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.put('/orders/:id', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const restaurantId = await getRestaurantId(userId);
        const order = await Order.findOneAndUpdate(
            { id: req.params.id, restaurantId },
            req.body,
            { new: true }
        );
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Reservations
router.get('/reservations', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(401).json({ message: 'User ID required' });
        const restaurantId = await getRestaurantId(userId);
        if (!restaurantId) return res.json([]);
        const reservations = await Reservation.find({ restaurantId }).sort({ createdAt: -1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/reservations', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const restaurantId = await getRestaurantId(userId);
        const resData = { ...req.body, restaurantId };
        const reservation = new Reservation(resData);
        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.put('/reservations/:id', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const restaurantId = await getRestaurantId(userId);
        const reservation = await Reservation.findOneAndUpdate(
            { id: req.params.id, restaurantId },
            req.body,
            { new: true }
        );
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export default router;
