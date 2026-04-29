import Message from "@/model/Message";
import Conversation from "@/model/Conversation";
import connectDB from "@/middleware/mongoose";

const send = async (req, res) => {
  if (req.method !== "POST") return res.status(400).json({ success: false });
  const base64 = req.headers.authorization?.split(" ")[1];
  const creds = Buffer.from(base64, "base64").toString("ascii");
  if (creds !== process.env.USER_ID + ":" + process.env.PASSWORD)
    return res.status(401).json({ success: false });
  try {
    const { from, fromName, fromRole, to, toName, toUsername, body, budget } = req.body;
    const brandEmail = fromRole === "brand" ? from : to;
    const brandName = fromRole === "brand" ? fromName : toName;
    const creatorEmail = fromRole === "creator" ? from : to;
    const creatorName = fromRole === "creator" ? fromName : toName;
    const creatorUsername = toUsername || "";
    const conversationId = `${brandEmail}__${creatorEmail}`;

    let conv = await Conversation.findOne({ conversationId });
    if (!conv) {
      conv = await Conversation.create({ conversationId, brandEmail, brandName, creatorEmail, creatorName, creatorUsername, lastMessage: body, budget: budget || "" });
    } else {
      conv.lastMessage = body;
      if (budget) conv.budget = budget;
      await conv.save();
    }
    await Message.create({ conversationId, from, fromName, fromRole, to, toName, body });
    res.status(200).json({ success: true, conversationId });
  } catch (err) {
    res.status(200).json({ success: false, error: err.message });
  }
};
export default connectDB(send);
