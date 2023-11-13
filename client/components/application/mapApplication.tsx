import * as React from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import "./application.css";
import { AppMainSection } from "./appMainSection";
import { KommunePropertiesDto } from "../../lib/norway";
import { Map, View } from "ol";

function AppMenu({
  onFindMe,
  setSelectionMode,
}: {
  onFindMe(): void;
  setSelectionMode(selection?: "Roads"): void;
}) {
  return (
    <nav>
      <a href={"#"} onClick={onFindMe}>
        Find me
      </a>
      <a href={"#"} onClick={() => setSelectionMode("Roads")}>
        Find nearby roads
      </a>
      <Link to={"/"}>Menu Item 3</Link>
      <Link to={"/"}>Menu Item 3</Link>
      <Link to={"/"}>Menu Item 3</Link>
      <Link to={"/"}>Menu Item 3</Link>
      <Link to={"/"}>Menu Item 3</Link>
      <Link to={"/"}>Menu Item 3</Link>
      <div style={{ flex: 1 }}></div>
      <Link to={"/"}>Menu Item 3</Link>
      <Link to={"/"}>Menu Item 3</Link>
    </nav>
  );
}

export function MapApplication() {
  const [focusKommune, setFocusKommune] = useState<KommunePropertiesDto>();
  const [selectionMode, setSelectionMode] = useState<"Roads">();
  const view = useMemo(
    () => new View({ center: [11, 60], zoom: 10, constrainResolution: true }),
    [],
  );
  const map = useMemo(() => new Map({ view }), [view]);

  function handleFindMe() {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const { longitude, latitude } = position.coords;
        view.animate({ center: [longitude, latitude], zoom: 14 });
      },
    );
  }

  return (
    <>
      <header>
        <h1>Kristiania mapping</h1>
      </header>
      <AppMenu onFindMe={handleFindMe} setSelectionMode={setSelectionMode} />
      <AppMainSection
        map={map}
        focusKommune={focusKommune}
        setFocusKommune={setFocusKommune}
        selectionModeState={[selectionMode, setSelectionMode]}
      />
      <footer>
        <div>
          Kommune:
          {focusKommune &&
            focusKommune.navn.find((n) => n.sprak === "nor")?.navn}
        </div>
        <div className={"divider"}></div>
        <div>Status</div>
      </footer>
    </>
  );
}
