import * as React from "react";
import { Map, View } from "ol";
import { useGeographic } from "ol/proj";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "ol/ol.css";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import { MVT } from "ol/format";

useGeographic();
const map = new Map({
  view: new View({ center: [10, 60], zoom: 8 }),
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

export function Application() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);

  const layers = useMemo(() => [vectorTileLayer], []);
  useEffect(() => map.setLayers(layers), []);

  return <div ref={mapRef} />;
}
