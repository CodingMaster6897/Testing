const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const connectDB = require("../backend/utils/db");
const mongoose = require("mongoose");
const axios = require("axios");
const Grid = require("gridfs-stream");
const userRoutes = require("../backend/routes/userRoutes");
const imageRoutes = require("./routes/imageRoutes");
dotenv.config();
let gfs;

const conn = mongoose.connection;
conn.once("open", function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("photos");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
// console.log(process.env.SMS_API_KEY)

app.use("/user", userRoutes);
app.use("/file", imageRoutes);
app.get("/file/:filename", async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } catch (error) {
    console.log(error)
    res.send("not found");
  }
});

app.delete("/file/:filename", async (req, res) => {
  try {
    await gfs.files.deleteOne({ filename: req.params.filename });
    res.send("success");
  } catch (error) {
    console.log(error);
    res.send("An error occured.");
  }
});
connectDB();
