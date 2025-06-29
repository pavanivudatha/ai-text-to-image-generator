import Replicate from "replicate";
import * as dotenv from "dotenv";
import { createError } from "../error.js";

dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const output = await replicate.run(
      "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",  // updated model
      { input: { prompt } }
    );

    const imageUrl = output[0];
    if (!imageUrl) throw new Error("Image URL not returned from Replicate");

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const tempPath = path.join("temp_image.jpg");
    fs.writeFileSync(tempPath, response.data);

    const cloudinaryResponse = await cloudinary.uploader.upload(tempPath, {
      folder: "replicate_generated_images",
    });

    fs.unlinkSync(tempPath);

    return res.status(200).json({ photo: cloudinaryResponse.secure_url });
  } catch (error) {
    console.error("Image generation/upload failed:", error?.response?.data || error);
    next(
      createError(
        error.status || 500,
        error?.message || "Image generation failed"
      )
    );
  }
};
