import * as React from "react";
import { MutableRefObject, useEffect, useRef } from "react";
import { Map } from "ol";

export function MapSection({ map }: { map: Map }) {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);
  return <main ref={mapRef}></main>;
}
