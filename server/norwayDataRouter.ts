import express from "express";
import pg from "pg";

const pool = new pg.Pool({
  user: "postgres",
  database: "postgres",
});

export const norwayDataRouter = express.Router();

norwayDataRouter.get("/api/norway/roads", async (req, res) => {
  const { longitude, latitude } = req.query;

  const result = await pool.query(
    "select st_distance(st_transform(st_setsrid($1::geometry, 4326), 5973), geom), kommunenummer, vegnummer, adressenavn, id  from norway_roads where st_distance(st_transform(st_setsrid($1::geometry, 4326), 5973), geom) < 500 order by st_distance(st_transform(st_setsrid($1::geometry, 4326), 5973), geom) limit 100",
    [`point(${longitude} ${latitude})`],
  );

  res.json({ latitude, longitude, rows: result.rows });
});
