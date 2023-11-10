import express from "express";
import pg from "pg";

const pool = new pg.Pool({
  user: "postgres",
  database: "postgres",
});

export const nycDataRouter = express.Router();

nycDataRouter.get("/api/neighbourhoods", async (req, res) => {
  const result = await pool.query(
    "SELECT gid, boroname, name, ST_AsText(geom) FROM nyc_neighborhoods",
  );
  res.json(result.rows);
});

nycDataRouter.get("/api/subway_stations", async (req, res) => {
  const result = await pool.query("select * from nyc_subway_stations");
  res.json(result.rows);
});

nycDataRouter.get("/api/streets", async (req, res) => {
  const result = await pool.query(
    "select name, st_astext(geom) from nyc_streets",
  );
  res.json(result.rows);
});

function sql(sql: TemplateStringsArray, ...values: unknown[]) {
  let text = sql[0];
  for (let i = 1; i < sql.length; i++) {
    text += `$${i}` + sql[i];
  }

  return { text, values };
}

nycDataRouter.get("/api/station_to_street", async (req, res) => {
  const stationName = "Marcy Ave";
  const result = await pool.query(
    sql`select station.name,
               st_astext(street.geom),
               street.name as street_name,
               st_distance(station.geom, street.geom)
        from nyc_subway_stations station
                 inner join public.nyc_streets street
                            on st_distance(station.geom, street.geom) < 100
        where station.name = ${stationName}
        order by station.name`,
  );
  res.json(result.rows);
});

nycDataRouter.get("/api/murders", async (req, res) => {
  const result = await pool.query(sql`
        select n.name, h.incident_d, st_astext(h.geom), h.primary_mo, h.weapon, h.num_victim, light_dark, year
        from nyc_homicides h
        inner join nyc_neighborhoods n on st_contains(n.geom, h.geom)
        order by n.name
      `);
  res.json(result.rows);
});
