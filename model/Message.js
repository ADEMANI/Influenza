const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  conversationId: { type: String, required: true },
  from: { type: String, required: true },
  fromName: { type: String, required: true },
  fromRole: { type: String, required: true },
  to: { type: String, required: true },
  toName: { type: String, required: true },
  body: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });
mongoose.models = {};
export default mongoose.model('Message', MessageSchema);
