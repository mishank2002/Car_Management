import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    images: {
      type: [String], // Array of URLs
      required: true,
      validate: [arrayLimit, '{PATH} exceeds the limit of 10'],
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
  },
  { timestamps: true }
);

// Custom validator for image limit
function arrayLimit(val) {
  return val.length <= 10;
}

const Car = mongoose.model('Car', carSchema);

export default Car;
