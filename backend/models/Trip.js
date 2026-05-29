import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  days: { type: Number, required: true },
  budgetType: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  interests: [String],
  itinerary: [{
    day: Number,
    activities: [String],
    notes: String   // custom creative feature
  }],
  budget: {
    flights: Number,
    accommodation: Number,
    food: Number,
    activities: Number,
    total: Number
  },
  hotels: [{
    name: String,
    description: String
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Trip', tripSchema);