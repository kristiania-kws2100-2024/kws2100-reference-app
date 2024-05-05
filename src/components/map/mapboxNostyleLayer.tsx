import { useEffect, useState } from "react";
import { FeatureLike } from "ol/Feature.js";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import { MVT } from "ol/format";
import { Fill, Stroke, Style, Text } from "ol/style";
import { StyleLike } from "ol/style/Style";
import { VectorTileProperties } from "./vectorTileProperties";

const accessToken =
  "pk.eyJ1Ijoiamhhbm5lcyIsImEiOiJjbHV0dThuaDkwMzN3MmpsaW16dHltZGtnIn0.qUyFwcqanRPBh1O4SF9kQA";

const mapboxPath = "mapbox.mapbox-streets-v7";
const url = `https://{a-d}.tiles.mapbox.com/v4/${mapboxPath}/{z}/{x}/{y}.vector.pbf?access_token=${accessToken}`;

const vectorTileLayer = new VectorTileLayer({
  source: new VectorTileSource({ url, format: new MVT() }),
});

const roadStyle = new Style({
  stroke: new Stroke({ color: "yellow", width: 3 }),
});

const waterStyle = new Style({
  fill: new Fill({ color: "blue" }),
});

const woodStyle = new Style({
  fill: new Fill({ color: "green" }),
});

export function useMapboxNostyleLayer() {
  const [activeFeature, setActiveFeature] = useState<FeatureLike>();

  useEffect(() => {
    const styleFunction: StyleLike = (f: FeatureLike) => {
      const properties = f.getProperties() as VectorTileProperties;
      if (properties.layer === "water") return waterStyle;
      if (properties.layer === "road") return roadStyle;
      if (properties.layer === "landuse" && properties.class === "wood") {
        return woodStyle;
      }
      if (properties.layer === "road_label") {
        return new Style({
          text: new Text({
            text: properties.name || properties.ref,
          }),
        });
      }
    };
    vectorTileLayer.setStyle(styleFunction);
  }, [activeFeature]);

  return { vectorTileLayer, setActiveFeature };
}
