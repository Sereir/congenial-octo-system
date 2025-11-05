import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: String,
    default: '0'
  },
  deliveryTime: {
    type: String,
    default: '30 min'
  },
  deliveryFee: {
    type: Number,
    default: 2.50
  },
  badge: {
    type: String,
    default: ''
  },
  badgeColor: {
    type: String,
    default: 'red'
  },
  category: {
    type: String,
    enum: ['Fast food', 'Sushis', 'Pizzas', 'Burgers', 'Asiatique', 'Indien', 'Halal', 'Desserts', 'Autres'],
    default: 'Autres'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
