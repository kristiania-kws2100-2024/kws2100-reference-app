import { Map, MapBrowserEvent } from "ol";
import { DependencyList, useEffect } from "react";
import { unByKey } from "ol/Observable";

export function usePointerMove(
  map: Map,
  event: (event: MapBrowserEvent<MouseEvent>) => void,
  deps: DependencyList = [],
) {
  useEffect(() => {
    const key = map.on("pointermove", event);
    return () => unByKey(key);
  }, deps);
}
