import express from "express";
import cors from "cors";
import { nycDataRouter } from "./nycRouter";

const app = express();
app.use(express.json());
app.use(cors());
app.use(nycDataRouter);

app.listen(9000, () => {
  console.log("Started on port 9000");
});
