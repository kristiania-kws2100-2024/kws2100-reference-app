import * as React from "react";
import { Map, View } from "ol";
import { useGeographic } from "ol/proj";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "ol/ol.css";

useGeographic();
const map = new Map({
  view: new View({ center: [10, 60], zoom: 8 }),
});

const osmLayer = new TileLayer({ source: new OSM() });

export function Application() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);

  const layers = useMemo(() => [osmLayer], []);
  useEffect(() => map.setLayers(layers), []);

  return <div ref={mapRef} />;
}
