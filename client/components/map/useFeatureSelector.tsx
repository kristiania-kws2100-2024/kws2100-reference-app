import VectorSource from "ol/source/Vector";
import { useEffect, useState } from "react";
import { Feature } from "ol";
import { Geometry } from "ol/geom";

export function useFeatureSelector(source: VectorSource, id?: string | number) {
  const [_, setSelectedFeature] = useState<Feature<Geometry>>();
  useEffect(() => {
    const feature = id ? source.getFeatureById(id) : undefined;
    if (feature) {
      feature.setProperties({ ...feature.getProperties(), selected: true });
    }
    setSelectedFeature((old) => {
      if (old && old.getId() !== feature?.getId()) {
        old.setProperties({ ...old.getProperties(), selected: false });
      }
      return feature || undefined;
    });
  }, [source, id]);
}
