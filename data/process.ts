import * as fs from "fs";
import * as path from "path";
import * as sax from "sax";
import pg from "pg";

const pool = new pg.Pool({
  user: "postgres",
  database: "postgres",
});

const ROAD_FIELDS = [
  "lokalId",
  "lineString",
  "kommunenummer",
  "typeVeg",
  "adressekode",
  "adressenavn",
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

async function process(file: string) {
  var stream = fs.createReadStream(path.join(FILES, file));
  const parser = sax.createStream(true, {
    normalize: false,
  });

  const roads: Road[] = [];

  const stack: string[] = [];
  let road: Partial<Road> | undefined = undefined;
  let nodeText = "";
  let srsName: string | undefined;
  parser.on("opentag", (tag) => {
    nodeText = "";
    stack.push(tag.name);
    if (tag.name === "Veglenke") {
      road = {};
    }
    if (tag.name === "gml:LineString") {
      srsName = tag.attributes["srsName"] as string;
    }
  });

  parser.on("text", (text) => {
    nodeText += text;
  });
  parser.on("closetag", (tagName) => {
    stack.pop();
    if (tagName === "Veglenke") {
      roads.push(road as Road);
      road = undefined;
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
      } else if (tagName === "fraMeter") {
        road.fraMeter = nodeText;
      } else if (tagName === "tilMeter") {
        road.tilMeter = nodeText;
      } else if (tagName === "strekningNummer") {
        road.strekningNummer = nodeText;
      } else if (tagName === "delStrekningNummer") {
        road.delStrekningNummer = nodeText;
      } else if (tagName === "sluttposisjon") {
        road.sluttposisjon = nodeText;
      }
    }
  });

  parser.on("end", async () => {
    const batchSize = 100;
    for (let i = 0; i < roads.length; i += batchSize) {
      const parameterLines: string[] = [];
      const values: unknown[] = [];
      for (let j = 0; j < batchSize && j + i < roads.length; j++) {
        const offset = j * ROAD_FIELDS.length;
        parameterLines.push(
          "(" +
            ROAD_FIELDS.map((_, index) => `$${index + offset + 1}`).join(", ") +
            ")",
        );
        for (const field of ROAD_FIELDS) {
          values.push(roads[i + j][field]);
        }
      }
      const text = `insert into norway_roads (${ROAD_FIELDS.join(", ")})
      values
      ${parameterLines.join(",\n")}
      `;
      await pool.query({ text, values });
    }
  });

  stream.pipe(parser);
}

const files = fs.readdirSync(FILES);
for (const file of files) {
  process(file).then();
}
