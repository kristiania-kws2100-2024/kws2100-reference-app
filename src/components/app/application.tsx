import * as React from "react";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { Map, View } from "ol";
import { useGeographic } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "ol/ol.css";
import { useAhocevarLayer } from "../map/ahocevar";
import { usePointerMove } from "../map/usePointerMove";

useGeographic();
const map = new Map({
  view: new View({ center: [10, 60], zoom: 5 }),
});

const osmLayer = new TileLayer({ source: new OSM() });

export function Application() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);

  const { ahocevarLayer, setActiveFeature } = useAhocevarLayer();

  const layers = useMemo(() => [ahocevarLayer], []);
  useEffect(() => map.setLayers(layers), []);

  usePointerMove(map, (e) => {
    const features = map.getFeaturesAtPixel(e.pixel);
    setActiveFeature(features.length === 1 ? features[0] : undefined);
  });

  return <div ref={mapRef} />;
}
