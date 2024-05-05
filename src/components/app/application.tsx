import * as React from "react";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { Feature, Map, View } from "ol";
import { useGeographic } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "ol/ol.css";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import { MVT } from "ol/format";
import { Fill, Stroke, Style } from "ol/style";
import { unByKey } from "ol/Observable";
import { FeatureLike } from "ol/Feature";

useGeographic();
const map = new Map({
  view: new View({ center: [10, 60], zoom: 5 }),
});

const osmLayer = new TileLayer({ source: new OSM() });

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

export function Application() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);

  const layers = useMemo(() => [vectorTileLayer], []);
  useEffect(() => map.setLayers(layers), []);

  const [activeFeature, setActiveFeature] = useState<FeatureLike>();

  useEffect(() => {
    const key = map.on("pointermove", (e) => {
      const features = map.getFeaturesAtPixel(e.pixel);
      setActiveFeature(features.length === 1 ? features[0] : undefined);
    });
    return () => unByKey(key);
  }, []);

  useEffect(() => {
    console.log(activeFeature?.getProperties());
    const admin = activeFeature?.getProperties().admin;
    function styleFunction(f: FeatureLike) {
      if (f.getProperties().admin === admin) {
        return activeStyle;
      } else {
        return nonActiveStyle;
      }
    }
    vectorTileLayer.setStyle(styleFunction);
  }, [activeFeature]);

  return <div ref={mapRef} />;
}
