import * as React from "react";
import { MapSection } from "../map/mapSection";
import { RightSidebar } from "./rightSidebar";
import { LeftSidebar } from "./leftSidebar";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Stroke, Style } from "ol/style";
import { useMemo } from "react";

export function AppMainSection() {
  const kommuneLayer = useMemo(
    () =>
      new VectorLayer({
        source: new VectorSource({
          url: "/geojson/kommuner.geojson",
          format: new GeoJSON(),
        }),
        style: new Style({
          stroke: new Stroke({
            color: "blue",
            width: 0.2,
          }),
        }),
      }),
    [],
  );

  return (
    <section id={"content"}>
      <LeftSidebar />
      <MapSection kommuneLayer={kommuneLayer} />
      <RightSidebar />
    </section>
  );
}
