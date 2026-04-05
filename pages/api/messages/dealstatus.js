import Conversation from "@/model/Conversation";
import connectDB from "@/middleware/mongoose";

const dealstatus = async (req, res) => {
  if (req.method !== "POST") return res.status(400).json({ success: false });
  const base64 = req.headers.authorization?.split(" ")[1];
  const creds = Buffer.from(base64, "base64").toString("ascii");
  if (creds !== process.env.USER_ID + ":" + process.env.PASSWORD)
    return res.status(401).json({ success: false });
  try {
    const { conversationId, status } = req.body;
    await Conversation.findOneAndUpdate({ conversationId }, { dealStatus: status });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(200).json({ success: false });
  }
};
export default connectDB(dealstatus);
