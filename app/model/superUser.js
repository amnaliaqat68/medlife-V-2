import mongoose from "mongoose";
const superUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },

  maxUsers: {
    type: Number,
    default: 10, 
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const superUser = mongoose.model.superUser || mongoose.model('superUser', superUserSchema);
export default superUser;