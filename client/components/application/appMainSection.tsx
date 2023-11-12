import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { MapSection } from "../map/mapSection";
import { RightSidebar } from "./rightSidebar";
import { LeftSidebar } from "./leftSidebar";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Stroke, Style } from "ol/style";
import { Feature } from "ol";
import { Polygon } from "ol/geom";
import {
  KommuneFeatureCollectionDto,
  KommunePropertiesDto,
} from "../../../lib/norway";
import { sortBy } from "../../lib/sortBy";

const kommuneStyle = new Style({
  stroke: new Stroke({ color: "blue", width: 0.2 }),
});

export function AppMainSection() {
  const [kommuneList, setKommuneList] = useState<KommunePropertiesDto[]>([]);
  const kommuneSource = useMemo(() => new VectorSource(), []);
  const kommuneLayer = useMemo(
    () => new VectorLayer({ source: kommuneSource, style: kommuneStyle }),
    [kommuneSource],
  );

  async function loadKommuneList() {
    const res = await fetch("/geojson/kommuner.geojson");
    const kommuneFeatures = (await res.json()) as KommuneFeatureCollectionDto;
    setKommuneList(
      kommuneFeatures.features
        .map((f) => f.properties)
        .sort(sortBy((p) => p.navn.find((n) => n.sprak === "nor")?.navn!)),
    );
    for (const {
      geometry: { coordinates },
      properties,
    } of kommuneFeatures.features) {
      const feature = new Feature({
        ...properties,
        geometry: new Polygon(coordinates),
      });
      feature.setId(properties.kommunenummer);
      kommuneSource.addFeature(feature);
    }
  }

  useEffect(() => {
    loadKommuneList().then();
  }, []);

  return (
    <section id={"content"}>
      <LeftSidebar />
      <MapSection kommuneLayer={kommuneLayer} />
      <RightSidebar kommuneList={kommuneList} />
    </section>
  );
}
