import { Fill, Stroke, Style, Text } from "ol/style";
import { FeatureLike } from "ol/Feature";
import {
  kommuneAsFeature,
  KommuneFeatureCollectionDto,
  KommunePropertiesDto,
} from "../../lib/norway";
import { Map } from "ol";
import { useEffect, useMemo, useState } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { sortBy } from "../../lib/sortBy";
import { useFeatureSelector } from "../map/useFeatureSelector";
import { useHoveredFeature } from "../map/useHoveredFeature";

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

export function useKommuneLayer(
  map: Map,
  path: string,
  selected?: KommunePropertiesDto,
) {
  const [kommuneFeatures, setKommuneFeatures] =
    useState<KommuneFeatureCollectionDto>();
  const source = useMemo(() => new VectorSource(), []);
  const layer = useMemo(
    () => new VectorLayer({ source, style: kommuneStyleFn }),
    [source],
  );

  async function loadKommuneList() {
    const res = await fetch(path);
    const kommuneFeatures = (await res.json()) as KommuneFeatureCollectionDto;
    kommuneFeatures.features.sort(
      sortBy((p) => p.properties.navn.find((n) => n.sprak === "nor")?.navn!),
    );
    setKommuneFeatures(kommuneFeatures);
    for (const featureDto of kommuneFeatures.features) {
      source.addFeature(kommuneAsFeature(featureDto));
    }
  }

  useFeatureSelector(source, selected?.kommunenummer);
  const hoveredFeature = useHoveredFeature(map, source);
  const hoveredKommune = useMemo(
    () => hoveredFeature?.getProperties() as KommunePropertiesDto,
    [hoveredFeature],
  );

  useEffect(() => {
    loadKommuneList().then();
  }, []);

  return { kommuneFeatures, layer, hoveredKommune };
}
