import * as React from "react";
import { KommunePropertiesDto } from "../../../lib/norway";
import { Dispatch, SetStateAction } from "react";

export function RightSidebar({
  focusKommune,
  kommuneList,
  setSelectedKommune,
}: {
  focusKommune?: KommunePropertiesDto;
  kommuneList: KommunePropertiesDto[];
  setSelectedKommune: Dispatch<
    SetStateAction<KommunePropertiesDto | undefined>
  >;
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
          {kommuneList.map((k) => (
            <div
              key={k.kommunenummer}
              onMouseEnter={() => setSelectedKommune(k)}
              className={
                focusKommune?.kommunenummer === k.kommunenummer ? "focus" : ""
              }
            >
              {k.navn.find((n) => n.sprak === "nor")?.navn}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
