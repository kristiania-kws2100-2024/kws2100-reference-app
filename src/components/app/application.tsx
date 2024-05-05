import * as React from "react";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { Map, View } from "ol";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import { usePointerMove } from "../map/usePointerMove";
import { useMapboxStyleLayer } from "../map/mapboxStyleLayer";

useGeographic();
const map = new Map({
  view: new View({ center: [10, 60], zoom: 9 }),
});

export function Application() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);

  const { vectorTileLayer, setActiveFeature } = useMapboxStyleLayer();

  const layers = useMemo(() => [vectorTileLayer], []);
  useEffect(() => map.setLayers(layers), []);

  usePointerMove(map, (e) => {
    const features = map.getFeaturesAtPixel(e.pixel);
    setActiveFeature(features.length === 1 ? features[0] : undefined);
  });

  return <div ref={mapRef} />;
}
