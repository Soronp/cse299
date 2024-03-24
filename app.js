const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use("/files", express.static("files"));

// MONGODB connection
const mongoURL =
  "mongodb+srv://soronp:soronpass123@cluster0.aqrefet.mongodb.net/";

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Adding this option for avoiding deprecation warnings
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((e) => console.log(e));

// Multer
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

require("./pdfDetails");
const PdfSchema = mongoose.model("PdfDetails");
const upload = multer({ storage: storage });

app.post("/upload-files", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const { title } = req.body; // Destructure the title from req.body
  const { filename } = req.file; // Destructure the filename from req.file
  try {
    await PdfSchema.create({ title, pdf: filename }); // Use the destructured variables
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error.message }); // Send error message
  }
});

app.get("/get-files", async (req, res) => {
  try {
    const data = await PdfSchema.find({}); // Wait for the data retrieval
    res.send({ status: "ok", data: data });
  } catch (error) {
    res.json({ status: error.message }); // Send error message
  }
});

// APIs
app.get("/", async (req, res) => {
  res.send("Success");
});

app.listen(5000, () => {
  console.log("Server Started");
});
