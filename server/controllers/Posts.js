import Replicate from "replicate";
import * as dotenv from "dotenv";
import { createError } from "../error.js";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import fs from "fs";
import path from "path";


dotenv.config();

// Replicate config
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const createPost = async (req, res, next) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json({ message: "Post created successfully" });
  } catch (err) {
    next(err);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Step 1: Generate image using Replicate
    const output = await replicate.run(
      "stability-ai/sdxl:2f8a1cfcb3e7cbfbad29561e58ed76821a6e58298acb9307c7db577c3ed3685b",
      { input: { prompt } }
    );

    const imageUrl = output[0];

    // Step 2: Download image locally
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const tempPath = path.join("temp_image.jpg");
    fs.writeFileSync(tempPath, response.data);

    // Step 3: Upload to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(tempPath, {
      folder: "replicate_generated_images",
    });

    // Step 4: Delete temp image
    fs.unlinkSync(tempPath);

    return res.status(200).json({ photo: cloudinaryResponse.secure_url });
  } catch (error) {
    console.error("Image generation/upload failed:", error);
    next(
      createError(
        error.status || 500,
        error?.message || "Image generation failed"
      )
    );
  }
};
