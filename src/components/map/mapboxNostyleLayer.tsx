import { useEffect, useState } from "react";
import { FeatureLike } from "ol/Feature.js";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import { MVT } from "ol/format";

const accessToken =
  "pk.eyJ1Ijoiamhhbm5lcyIsImEiOiJjbHV0dThuaDkwMzN3MmpsaW16dHltZGtnIn0.qUyFwcqanRPBh1O4SF9kQA";

const mapboxPath = "mapbox.mapbox-streets-v7";
const url = `https://{a-d}.tiles.mapbox.com/v4/${mapboxPath}/{z}/{x}/{y}.vector.pbf?access_token=${accessToken}`;

const vectorTileLayer = new VectorTileLayer({
  source: new VectorTileSource({
    url,
    format: new MVT(),
  }),
});

export function useMapboxNostyleLayer() {
  const [activeFeature, setActiveFeature] = useState<FeatureLike>();

  useEffect(() => {
    console.log(activeFeature?.getProperties());
  }, [activeFeature]);

  return { vectorTileLayer, setActiveFeature };
}
