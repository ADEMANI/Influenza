import Brand from "@/model/Brand";
import connectDB from "@/middleware/mongoose";

const profileupdate = async (req, res) => {
  if (req.method === "POST" && req.headers.authorization) {
    const base64Credentials = req.headers.authorization?.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
    if (credentials === process.env.USER_ID + ":" + process.env.PASSWORD) {
      try {
        const brand = await Brand.findOne({ email: req.body.email });
        if (brand) {
          brand.name = req.body.name || brand.name;
          brand.location = req.body.location || brand.location;
          brand.description = req.body.description || brand.description;
          brand.category = req.body.category || brand.category;
          await brand.save();
          res.status(200).json({ success: true, message: "Brand profile updated" });
        } else {
          await Brand.create({
            name: req.body.name,
            email: req.body.email,
            location: req.body.location || "",
            description: req.body.description || "",
            category: req.body.category || [],
            role: "brand",
          });
          res.status(200).json({ success: true, message: "Brand profile created" });
        }
      } catch (err) {
        res.status(200).json({ success: false, message: "Error updating profile" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    res.status(400).json({ message: "Bad request" });
  }
};

export default connectDB(profileupdate);
