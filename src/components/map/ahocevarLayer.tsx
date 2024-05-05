import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import { MVT } from "ol/format";
import { Fill, Stroke, Style } from "ol/style";
import { useEffect, useState } from "react";
import { FeatureLike } from "ol/Feature";

const vectorTileUrl =
  "https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf";
const vectorTileLayer = new VectorTileLayer({
  source: new VectorTileSource({
    format: new MVT(),
    url: vectorTileUrl,
    maxZoom: 14,
  }),
});

const nonActiveStyle = new Style({
  stroke: new Stroke({
    color: "red",
    width: 2,
  }),
  fill: new Fill({
    color: "white",
  }),
});
const activeStyle = new Style({
  stroke: new Stroke({
    color: "red",
    width: 2,
  }),
  fill: new Fill({
    color: "pink",
  }),
});

export function useAhocevarLayer() {
  const [activeFeature, setActiveFeature] = useState<FeatureLike>();

  useEffect(() => {
    console.log(activeFeature?.getProperties());
    const admin = activeFeature?.getProperties().admin;
    function styleFunction(f: FeatureLike) {
      return f.getProperties().admin === admin ? activeStyle : nonActiveStyle;
    }
    vectorTileLayer.setStyle(styleFunction);
  }, [activeFeature]);

  return { vectorTileLayer, setActiveFeature };
}
