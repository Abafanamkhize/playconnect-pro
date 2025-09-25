import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['player', 'federation', 'scout', 'admin'],
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // Federation-specific fields
  federationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Federation'
  },
  // Player-specific fields  
  playerProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlayerProfile'
  }
}, {
  timestamps: true
});

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model('User', userSchema);
