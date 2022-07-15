import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./router/userRouter.js";
import heroRouter from "./router/heroRouter.js";

const PORT = 5000;
const DB_URL =
  "mongodb+srv://user:user@cluster0.tgdjp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const app = express();

app.use(express.json());
app.use(cors());
app.use("/user", userRouter);
app.use("/hero", heroRouter);

async function startApp() {
  try {
    await mongoose.connect(DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    app.listen(PORT, () => console.log("listening on port"));
  } catch (e) {
    console.log(e);
  }
}

startApp();
