import * as fs from "fs";
import * as path from "path";
import * as sax from "sax";
import * as pg from "pg";

const pool = new pg.Pool({
  user: "postgres",
  database: "postgres",
});

const ROAD_FIELDS = [
  "id",
  "lokalId",
  "lineString",
  "kommunenummer",
  "typeVeg",
  "adressekode",
  "adressenavn",
  "vegnummer",
  "startposisjon",
  "sluttposisjon",
  "fraMeter",
  "tilMeter",
  "strekningNummer",
  "delStrekningNummer",
  "srsName",
] as const;
type RoadFieldType = (typeof ROAD_FIELDS)[number];

type Road = Record<RoadFieldType, string | undefined>;

const FILES =
  "../../../../../Downloads/Samferdsel_0000_Norge_5973_Elveg2-0_GML";

function chunks<T>(arr: T[], size: number): T[][] {
  let chunks = [],
    i = 0,
    n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, (i += size)));
  }

  return chunks;
}

async function insertRoads(rows: Road[]) {
  const tableName = "norway_roads";
  const columns = ROAD_FIELDS;
  if (rows.length == 0) {
    return;
  }
  console.log("bulk inserting", rows.length, tableName);
  const paramLines: string[] = [];
  const values: unknown[] = [];
  for (let i = 0; i < rows.length; i++) {
    const offset = i * (columns.length + 2);
    paramLines.push(
      "(" +
        columns.map((_, i) => `$${i + offset + 1}`).join(", ") +
        ", st_setsrid($" +
        (offset + columns.length + 1) +
        "::geometry, $" +
        (offset + columns.length + 2) +
        "))",
    );
    for (const field of columns) {
      values.push(rows[i][field]);
    }
    values.push(
      "linestring z(" +
        chunks(rows[i].lineString!.split(" "), 3)
          .map((chunk) => chunk.join(" "))
          .join(", ") +
        ")",
    );
    values.push(
      parseInt(
        rows[i].srsName!.substring(rows[i].srsName!.lastIndexOf("/") + 1),
      ),
    );
  }
  const text = `insert into ${tableName}
    (${columns.join(", ")}, geom)
values
${paramLines.join(",\n")}`;
  await pool.query({ text, values });
}

async function process(file: string) {
  console.log("importing", file);

  await pool.query("BEGIN");

  const stream = fs.createReadStream(path.join(FILES, file));
  const parser = sax.createStream(true, {
    normalize: false,
  });

  let roads: Road[] = [];

  const stack: string[] = [];
  let road: Partial<Road> | undefined = undefined;
  let nodeText = "";
  let srsName: string | undefined;
  parser.on("opentag", (tag) => {
    nodeText = "";
    stack.push(tag.name);
    if (tag.name === "Veglenke") {
      road = {
        id: tag.attributes["gml:id"] as string,
      };
    }
    if (tag.name === "gml:LineString") {
      srsName = tag.attributes["srsName"] as string;
    }
  });

  parser.on("text", (text) => {
    nodeText += text;
  });
  parser.on("closetag", async (tagName) => {
    stack.pop();
    if (tagName === "Veglenke") {
      roads.push(road as Road);
      road = undefined;
      if (roads.length === 1000) {
        await insertRoads(roads);
        roads = [];
      }
    }
    if (road) {
      if (tagName === "lokalId") {
        road.lokalId = nodeText;
      } else if (tagName === "gml:LineString") {
        road.lineString = nodeText.trim();
        road.srsName = srsName;
      } else if (tagName === "kommunenummer") {
        road.kommunenummer = nodeText;
      } else if (tagName === "typeVeg") {
        road.typeVeg = nodeText;
      } else if (tagName === "adressekode") {
        road.adressekode = nodeText;
      } else if (tagName === "adressenavn") {
        road.adressenavn = nodeText;
      } else if (tagName === "vegnummer") {
        road.vegnummer = nodeText;
      } else if (tagName === "fraMeter") {
        road.fraMeter = nodeText;
      } else if (tagName === "tilMeter") {
        road.tilMeter = nodeText;
      } else if (tagName === "strekningNummer") {
        road.strekningNummer = nodeText;
      } else if (tagName === "delstrekningNummer") {
        road.delStrekningNummer = nodeText;
      } else if (tagName === "startposisjon") {
        road.startposisjon = nodeText;
      } else if (tagName === "sluttposisjon") {
        road.sluttposisjon = nodeText;
      }
    }
  });

  const promise = new Promise((resolve) => {
    parser.on("end", async () => {
      await insertRoads(roads);
      await pool.query("COMMIT");
      resolve(null);
    });
  });

  stream.pipe(parser);
  return promise;
}

async function readFiles() {
  const files = fs.readdirSync(FILES);
  const result = (
    await pool.query(
      "select kommunenummer, count(*) from norway_roads group by kommunenummer",
    )
  ).rows;
  const alreadyImportedFiles = result
    .map((r) => r["kommunenummer"])
    .flatMap((k) => files.filter((f) => f.startsWith(k)));
  console.log("Skipping", alreadyImportedFiles);
  for (const file of files) {
    if (!alreadyImportedFiles.includes(file)) {
      await process(file);
    }
  }
}

const createTable = `
create table norway_roads
(
    id                 varchar(20),
    kommunenummer      varchar(4),
    lokalid            integer,
    geom               geometry,
    linestring         text,
    typeveg            varchar,
    adressekode        varchar,
    adressenavn        varchar,
    vegnummer          integer,
    startposisjon      double precision,
    sluttposisjon      double precision,
    frameter           numeric,
    tilmeter           numeric,
    strekningnummer    integer,
    delstrekningnummer integer,
    srsname            varchar,
    primary key (id, kommunenummer)
);
  
`;

readFiles().then();
//process("5442Elveg2.0.gml").then();
//process("1111Elveg2.0.gml").then();
