import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { MapSection } from "../map/mapSection";
import { RightSidebar } from "./rightSidebar";
import { LeftSidebar } from "./leftSidebar";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Stroke, Style } from "ol/style";
import { Feature, Map, View } from "ol";
import { Polygon } from "ol/geom";
import {
  KommuneFeatureCollectionDto,
  KommunePropertiesDto,
} from "../../../lib/norway";
import { sortBy } from "../../lib/sortBy";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

import "ol/ol.css";

useGeographic();

const kommuneStyle = new Style({
  stroke: new Stroke({ color: "blue", width: 0.2 }),
});

export function AppMainSection() {
  const [kommuneList, setKommuneList] = useState<KommunePropertiesDto[]>([]);

  const backgroundLayer = useMemo(
    () => new TileLayer({ source: new OSM() }),
    [],
  );

  const kommuneSource = useMemo(() => new VectorSource(), []);
  const kommuneLayer = useMemo(
    () => new VectorLayer({ source: kommuneSource, style: kommuneStyle }),
    [kommuneSource],
  );

  const layers = useMemo(() => [backgroundLayer, kommuneLayer], [kommuneLayer]);
  const map = useMemo(() => {
    return new Map({
      view: new View({ center: [11, 60], zoom: 10 }),
    });
  }, []);
  useEffect(() => map.setLayers(layers), [layers]);

  async function loadKommuneList() {
    const res = await fetch("/geojson/kommuner.geojson");
    const kommuneFeatures = (await res.json()) as KommuneFeatureCollectionDto;
    setKommuneList(
      kommuneFeatures.features
        .map((f) => f.properties)
        .sort(sortBy((p) => p.navn.find((n) => n.sprak === "nor")?.navn!)),
    );
    for (const featureDto of kommuneFeatures.features) {
      const feature = new Feature({
        ...featureDto.properties,
        geometry: new Polygon(featureDto.geometry.coordinates),
      });
      feature.setId(featureDto.properties.kommunenummer);
      kommuneSource.addFeature(feature);
    }
  }

  useEffect(() => {
    loadKommuneList().then();
  }, []);

  return (
    <section id={"content"}>
      <LeftSidebar />
      <MapSection map={map} />
      <RightSidebar kommuneList={kommuneList} />
    </section>
  );
}
