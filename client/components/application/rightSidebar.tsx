import * as React from "react";
import { Dispatch, SetStateAction } from "react";
import {
  KommuneFeatureCollectionDto,
  KommunePropertiesDto,
} from "../../lib/norway";
import { View } from "ol";
import { Polygon } from "ol/geom";

export function RightSidebar({
  focusKommune,
  kommuneFeatures,
  setSelectedKommune,
  view,
}: {
  focusKommune?: KommunePropertiesDto;
  kommuneFeatures?: KommuneFeatureCollectionDto;
  setSelectedKommune: Dispatch<
    SetStateAction<KommunePropertiesDto | undefined>
  >;
  view: View;
}) {
  return (
    <aside className="right-sidebar">
      <div className={"content"}>
        <label>
          <input type="checkbox" defaultChecked />
          &raquo;
        </label>
        <h2>Right sidebar</h2>
        <div
          onMouseLeave={() => setSelectedKommune(undefined)}
          className={"kommune-list"}
        >
          {kommuneFeatures?.features?.map((f) => {
            const k = f.properties;
            return (
              <div
                onClick={(e) => {
                  view.fit(new Polygon(f.geometry.coordinates));
                }}
                key={k.kommunenummer}
                onMouseEnter={() => setSelectedKommune(k)}
                className={
                  focusKommune?.kommunenummer === k.kommunenummer ? "focus" : ""
                }
              >
                {k.navn.find((n) => n.sprak === "nor")?.navn}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
