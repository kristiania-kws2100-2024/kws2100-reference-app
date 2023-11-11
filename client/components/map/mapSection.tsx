import * as React from "react";
import { MutableRefObject, useRef } from "react";

export function MapSection() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  return <main ref={mapRef}>I'm a great map</main>;
}
