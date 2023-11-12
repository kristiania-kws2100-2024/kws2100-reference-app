import * as React from "react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { MapSection } from "../map/mapSection";
import { RightSidebar } from "./rightSidebar";
import { LeftSidebar } from "./leftSidebar";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style, Text } from "ol/style";
import { Feature, Map, MapBrowserEvent, View } from "ol";
import { Geometry, Polygon } from "ol/geom";
import {
  KommuneFeatureCollectionDto,
  KommunePropertiesDto,
} from "../../../lib/norway";
import { sortBy } from "../../lib/sortBy";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import { FeatureLike } from "ol/Feature";

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
  const [kommuneList, setKommuneList] = useState<KommunePropertiesDto[]>([]);
  const [selectedKommune, setSelectedKommune] =
    useState<KommunePropertiesDto>();
  const [_, setSelectedKommuneFeature] = useState<Feature<Geometry>>();

  useEffect(() => {
    const id = selectedKommune?.kommunenummer;
    const feature = id ? kommuneSource.getFeatureById(id) : undefined;
    if (feature) {
      feature.setProperties({ ...feature.getProperties(), selected: true });
    }
    setSelectedKommuneFeature((old) => {
      if (old && old.getId() !== feature?.getId()) {
        old.setProperties({ ...old.getProperties(), selected: false });
      }
      return feature || undefined;
    });
  }, [selectedKommune]);

  const backgroundLayer = useMemo(
    () => new TileLayer({ source: new OSM() }),
    [],
  );

  const kommuneSource = useMemo(() => new VectorSource(), []);
  const kommuneLayer = useMemo(
    () => new VectorLayer({ source: kommuneSource, style: kommuneStyleFn }),
    [kommuneSource],
  );

  const layers = useMemo(() => [backgroundLayer, kommuneLayer], [kommuneLayer]);
  const map = useMemo(() => {
    return new Map({
      view: new View({ center: [11, 60], zoom: 10, constrainResolution: true }),
    });
  }, []);
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
      const feature = new Feature({
        ...featureDto.properties,
        geometry: new Polygon(featureDto.geometry.coordinates),
      });
      feature.setId(featureDto.properties.kommunenummer);
      kommuneSource.addFeature(feature);
    }
  }

  useEffect(() => {
    function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
      const hoverKommune = kommuneSource
        .getFeaturesAtCoordinate(e.coordinate)[0]
        ?.getProperties() as KommunePropertiesDto;

      setFocusKommune((old) =>
        old?.kommunenummer === hoverKommune?.kommunenummer ? old : hoverKommune,
      );
    }

    map.on("pointermove", handlePointerMove);
    return () => map.un("pointermove", handlePointerMove);
  }, [map]);

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
