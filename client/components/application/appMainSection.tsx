import * as React from "react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { MapSection } from "../map/mapSection";
import { RightSidebar } from "./rightSidebar";
import { LeftSidebar } from "./leftSidebar";
import { Map } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import { KommunePropertiesDto } from "../../lib/norway";
import { useKommuneLayer } from "./useKommuneLayer";

useGeographic();

export function AppMainSection({
  map,
  focusKommune,
  setFocusKommune,
}: {
  map: Map;
  focusKommune?: KommunePropertiesDto;
  setFocusKommune: Dispatch<SetStateAction<KommunePropertiesDto | undefined>>;
}) {
  const [selectedKommune, setSelectedKommune] =
    useState<KommunePropertiesDto>();

  const backgroundLayer = useMemo(
    () => new TileLayer({ source: new OSM() }),
    [],
  );

  const {
    kommuneList,
    layer: kommuneLayer,
    hoveredKommune,
  } = useKommuneLayer(map, "/geojson/kommuner.geojson", selectedKommune);
  useEffect(() => setFocusKommune(hoveredKommune), [hoveredKommune]);

  const layers = useMemo(() => [backgroundLayer, kommuneLayer], [kommuneLayer]);
  useEffect(() => map.setLayers(layers), [layers]);

  return (
    <section id={"content"}>
      <LeftSidebar />
      <MapSection map={map} />
      <RightSidebar
        focusKommune={focusKommune}
        kommuneList={kommuneList}
        setSelectedKommune={setSelectedKommune}
      />
    </section>
  );
}
