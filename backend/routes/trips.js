import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Trip from '../models/Trip.js';
import { generateTripPlan, regenerateDay } from '../services/aiService.js';

const router = express.Router();

// All routes protected
router.use(authMiddleware);

// Get all trips for logged-in user
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.userId }).sort('-createdAt');
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new trip (AI generation)
router.post('/', async (req, res) => {
  try {
    const { destination, days, budgetType, interests } = req.body;
    const aiData = await generateTripPlan(destination, days, budgetType, interests);
    
    const trip = new Trip({
      userId: req.userId,
      destination,
      days,
      budgetType,
      interests,
      itinerary: aiData.itinerary.map(day => ({ ...day, notes: '' })),
      budget: aiData.budget,
      hotels: aiData.hotels
    });
    await trip.save();
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single trip
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update itinerary (add/remove activities, notes)
router.put('/:id', async (req, res) => {
  try {
    const { itinerary } = req.body;
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    
    trip.itinerary = itinerary;
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Regenerate a specific day
router.post('/:id/regenerate-day', async (req, res) => {
  try {
    const { dayIndex, instruction } = req.body;
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    
    const dayObj = trip.itinerary.find(d => d.day === dayIndex);
    if (!dayObj) return res.status(400).json({ error: 'Invalid day' });
    
    const newActivities = await regenerateDay(
      trip.destination,
      trip.days,
      dayObj.activities,
      dayIndex,
      instruction
    );
    
    dayObj.activities = newActivities;
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete trip
router.delete('/:id', async (req, res) => {
  try {
    await Trip.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;