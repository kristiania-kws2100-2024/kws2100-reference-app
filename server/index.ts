import express from "express";
import compress from "compression";
import cors from "cors";
import { nycDataRouter } from "./nycRouter";

const app = express();
app.use(express.json());
app.use(cors());
app.use(nycDataRouter);

app.use(compress());
app.use("/geojson", express.static("geojson"));

app.listen(9000, () => {
  console.log("Started on port 9000");
});
