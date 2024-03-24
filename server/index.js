import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});

dotenv.config({
  path: "./.env",
});

const app = express();
const connect = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );
    console.log(`MongoDB connected !!`);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

connect();

app.use(cors({}));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

const dataSchema = new mongoose.Schema({
  notification: [
    {
      label: String,
      value: Boolean,
    },
  ],
  url: String,
});

const Data = mongoose.model("Data", dataSchema);

app.post(
  "/upload-data",
  upload.fields([
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    try {
      const { notification } = req.body;
      const file = req.files.file && req.files?.file[0];

      const data = await Data.create({
        notification: JSON.parse(notification),
        url: file.path || "",
      });

      res.status(200).json({
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

app.listen(process.env.PORT || 8000, () => {
  console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
});