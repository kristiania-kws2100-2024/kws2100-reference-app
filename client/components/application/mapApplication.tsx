import * as React from "react";
import { Link } from "react-router-dom";

import "./application.css";
import { AppMainSection } from "./appMainSection";
import { useState } from "react";
import { KommunePropertiesDto } from "../../../lib/norway";

export function MapApplication() {
  const [focusKommune, setFocusKommune] = useState<KommunePropertiesDto>();

  return (
    <>
      <header>
        <h1>Kristiania mapping</h1>
      </header>
      <nav>
        <Link to={"/"}>Menu Item 1</Link>
        <Link to={"/"}>Menu Item 2</Link>
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
      <AppMainSection
        focusKommune={focusKommune}
        setFocusKommune={setFocusKommune}
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
