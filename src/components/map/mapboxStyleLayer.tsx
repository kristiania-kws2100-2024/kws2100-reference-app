import { MapboxVectorLayer } from "ol-mapbox-style";
import { useEffect, useState } from "react";
import { FeatureLike } from "ol/Feature.js";

const accessToken =
  "pk.eyJ1Ijoiamhhbm5lcyIsImEiOiJjbHV0dThuaDkwMzN3MmpsaW16dHltZGtnIn0.qUyFwcqanRPBh1O4SF9kQA";

const vectorTileLayer = new MapboxVectorLayer({
  styleUrl: "mapbox://styles/mapbox/bright-v9",
  accessToken,
});

export function useMapboxStyleLayer() {
  const [activeFeature, setActiveFeature] = useState<FeatureLike>();

  useEffect(() => {
    console.log(activeFeature?.getProperties());
  }, [activeFeature]);

  return { vectorTileLayer, setActiveFeature };
}
