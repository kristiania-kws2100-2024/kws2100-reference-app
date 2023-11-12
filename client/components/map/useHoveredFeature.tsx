import { Feature, Map, MapBrowserEvent } from "ol";
import VectorSource from "ol/source/Vector";
import { useEffect, useState } from "react";

export function useHoveredFeature(map: Map, source: VectorSource) {
  const [hoveredFeature, setHoveredFeature] = useState<Feature>();
  useEffect(() => {
    function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
      const featureAtCoordinate = source.getFeaturesAtCoordinate(
        e.coordinate,
      )[0];

      setHoveredFeature((old) =>
        old?.getId() === featureAtCoordinate?.getId()
          ? old
          : featureAtCoordinate,
      );
    }

    map.on("pointermove", handlePointerMove);
    return () => map.un("pointermove", handlePointerMove);
  }, [map, source]);
  return hoveredFeature;
}
