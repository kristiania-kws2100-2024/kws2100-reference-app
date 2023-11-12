import * as React from "react";
import { KommunePropertiesDto } from "../../../lib/norway";

export function RightSidebar({
  kommuneList,
}: {
  kommuneList: KommunePropertiesDto[];
}) {
  return (
    <aside className="right-sidebar">
      <div className={"content"}>
        <label>
          <input type="checkbox" />
          &raquo;
        </label>
        <h2>Right sidebar</h2>
        <ul>
          {kommuneList.map((k) => (
            <div key={k.kommunenummer}>
              {k.navn.find((n) => n.sprak === "nor")?.navn}
            </div>
          ))}
        </ul>
      </div>
    </aside>
  );
}
