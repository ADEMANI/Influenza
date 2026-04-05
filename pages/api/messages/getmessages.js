import Message from "@/model/Message";
import connectDB from "@/middleware/mongoose";

const getmessages = async (req, res) => {
  if (req.method !== "POST") return res.status(400).json({ success: false });
  const base64 = req.headers.authorization?.split(" ")[1];
  const creds = Buffer.from(base64, "base64").toString("ascii");
  if (creds !== process.env.USER_ID + ":" + process.env.PASSWORD)
    return res.status(401).json({ success: false });
  try {
    const { conversationId } = req.body;
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    await Message.updateMany({ conversationId, read: false }, { read: true });
    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(200).json({ success: false, error: err.message });
  }
};
export default connectDB(getmessages);
