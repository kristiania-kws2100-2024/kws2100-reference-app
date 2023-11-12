import * as React from "react";
import { MapSection } from "../map/mapSection";
import { RightSidebar } from "./rightSidebar";
import { LeftSidebar } from "./leftSidebar";

export function AppMainSection() {
  return (
    <section id={"content"}>
      <LeftSidebar />
      <MapSection />
      <RightSidebar />
    </section>
  );
}
