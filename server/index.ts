import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(9000, () => {
  console.log("Started on port 9000");
});
