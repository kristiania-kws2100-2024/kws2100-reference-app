import * as React from "react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { MapSection } from "../map/mapSection";
import { RightSidebar } from "./rightSidebar";
import { LeftSidebar } from "./leftSidebar";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style, Text } from "ol/style";
import { Map, View } from "ol";
import { sortBy } from "../../lib/sortBy";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import { FeatureLike } from "ol/Feature";
import { useFeatureSelector } from "../map/useFeatureSelector";
import { useHoveredFeature } from "../map/useHoveredFeature";
import {
  kommuneAsFeature,
  KommuneFeatureCollectionDto,
  KommunePropertiesDto,
} from "../../lib/norway";

useGeographic();

const kommuneStyle = new Style({
  stroke: new Stroke({ color: "blue", width: 0.2 }),
});
const kommuneStyleHighlight = {
  stroke: new Stroke({ color: "blue", width: 2 }),
  fill: new Fill({ color: [0xff, 0xff, 0xff, 0.1] }),
};
const kommuneStyleTextHighlight = {
  font: "18px Calibri,sans-serif,bold",
  fill: new Fill({ color: "black" }),
  stroke: new Stroke({ color: "white", width: 1 }),
};

function kommuneStyleFn(feature: FeatureLike): Style {
  const properties = feature.getProperties() as KommunePropertiesDto & {
    selected?: boolean;
  };
  return !properties.selected
    ? kommuneStyle
    : new Style({
        ...kommuneStyleHighlight,
        text: new Text({
          ...kommuneStyleTextHighlight,
          text: properties.navn.find((n) => n.sprak === "nor")?.navn,
        }),
      });
}

export function AppMainSection({
  focusKommune,
  setFocusKommune,
}: {
  focusKommune?: KommunePropertiesDto;
  setFocusKommune: Dispatch<SetStateAction<KommunePropertiesDto | undefined>>;
}) {
  const map = useMemo(() => {
    return new Map({
      view: new View({ center: [11, 60], zoom: 10, constrainResolution: true }),
    });
  }, []);

  const [kommuneList, setKommuneList] = useState<KommunePropertiesDto[]>([]);
  const [selectedKommune, setSelectedKommune] =
    useState<KommunePropertiesDto>();

  const backgroundLayer = useMemo(
    () => new TileLayer({ source: new OSM() }),
    [],
  );

  const kommuneSource = useMemo(() => new VectorSource(), []);
  const kommuneLayer = useMemo(
    () => new VectorLayer({ source: kommuneSource, style: kommuneStyleFn }),
    [kommuneSource],
  );
  useFeatureSelector(kommuneSource, selectedKommune?.kommunenummer);
  const hoverKommuneFeature = useHoveredFeature(map, kommuneSource);
  useEffect(() => {
    setFocusKommune(
      hoverKommuneFeature?.getProperties() as KommunePropertiesDto,
    );
  }, [hoverKommuneFeature]);

  const layers = useMemo(() => [backgroundLayer, kommuneLayer], [kommuneLayer]);
  useEffect(() => map.setLayers(layers), [layers]);

  async function loadKommuneList() {
    setFocusKommune(undefined);
    const res = await fetch("/geojson/kommuner.geojson");
    const kommuneFeatures = (await res.json()) as KommuneFeatureCollectionDto;
    setKommuneList(
      kommuneFeatures.features
        .map((f) => f.properties)
        .sort(sortBy((p) => p.navn.find((n) => n.sprak === "nor")?.navn!)),
    );
    for (const featureDto of kommuneFeatures.features) {
      kommuneSource.addFeature(kommuneAsFeature(featureDto));
    }
  }

  useEffect(() => {
    loadKommuneList().then();
  }, []);

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
