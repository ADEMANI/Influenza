const mongoose = require('mongoose');
const ConversationSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, unique: true },
  brandEmail: { type: String, required: true },
  brandName: { type: String, required: true },
  creatorEmail: { type: String, required: true },
  creatorName: { type: String, required: true },
  creatorUsername: { type: String, required: true },
  lastMessage: { type: String, default: "" },
  dealStatus: { type: String, default: "chatting" },
  budget: { type: String, default: "" },
}, { timestamps: true });
mongoose.models = {};
export default mongoose.model('Conversation', ConversationSchema);
