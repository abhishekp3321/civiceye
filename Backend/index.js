import express from "express";
import { connectDB } from "./config/Db.js";
import 'dotenv/config';
import path from "path";
import userrouter from "./router/router.js";
import cors from 'cors';
import comrouter from "./router/comrouter.js";
import feedbackrouter from "./router/feedbackrouter.js";

const PORT = process.env.PORT || 6901;
const app = express();
// app.use("/uploads", express.static(path.resolve("uploads")));

app.use(express.json());
app.use(cors())

app.use('/proofs', express.static('proofs'));
app.use('/user', userrouter)
app.use('/proof', comrouter)
app.use('/feedback',feedbackrouter)


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('server started ' + PORT);
  });
});