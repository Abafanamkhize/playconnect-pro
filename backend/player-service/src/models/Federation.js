import mongoose from 'mongoose';

const federationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Only export if not already registered
try {
  mongoose.model('Federation');
} catch {
  mongoose.model('Federation', federationSchema);
}

export default mongoose.model('Federation');
