import * as React from "react";
import { MutableRefObject, useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

useGeographic();

export function MapSection() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource({
            url: "/geojson/kommuner.geojson",
            format: new GeoJSON(),
          }),
        }),
      ],
      target: mapRef.current,
      view: new View({ center: [11, 60], zoom: 10 }),
    });
  }, []);
  return <main ref={mapRef}></main>;
}
