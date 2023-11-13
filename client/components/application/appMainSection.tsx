import * as React from "react";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MapSection } from "../map/mapSection";
import { RightSidebar } from "./rightSidebar";
import { LeftSidebar } from "./leftSidebar";
import { Map, MapBrowserEvent } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import { KommunePropertiesDto } from "../../lib/norway";
import { useKommuneLayer } from "./useKommuneLayer";

useGeographic();

export function AppMainSection({
  map,
  focusKommune,
  setFocusKommune,
  selectionModeState: [selectionMode, setSelectionMode],
}: {
  map: Map;
  focusKommune?: KommunePropertiesDto;
  setFocusKommune: Dispatch<SetStateAction<KommunePropertiesDto | undefined>>;
  selectionModeState: [
    "Roads" | undefined,
    Dispatch<SetStateAction<"Roads" | undefined>>,
  ];
}) {
  const dialogRef = useRef() as MutableRefObject<HTMLDialogElement>;
  const [selectedKommune, setSelectedKommune] =
    useState<KommunePropertiesDto>();

  const [showDialog, setShowDialog] = useState(false);
  useEffect(() => {
    if (showDialog) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [showDialog]);
  useEffect(() => {
    dialogRef.current.addEventListener("close", () => {
      setShowDialog(false);
      setSearchResults(undefined);
    });
  }, []);

  const backgroundLayer = useMemo(
    () => new TileLayer({ source: new OSM() }),
    [],
  );

  useEffect(() => {
    function handleClick(e: MapBrowserEvent<any>) {
      setSelectionMode(undefined);
      setShowDialog(true);
      loadSearchResults(e.coordinate);
    }

    if (selectionMode) {
      map.on("click", handleClick);
      return () => map.un("click", handleClick);
    }
  }, [selectionMode]);

  const {
    kommuneList,
    layer: kommuneLayer,
    hoveredKommune,
  } = useKommuneLayer(map, "/geojson/kommuner.geojson", selectedKommune);
  useEffect(() => setFocusKommune(hoveredKommune), [hoveredKommune]);

  const layers = useMemo(() => [backgroundLayer, kommuneLayer], [kommuneLayer]);
  useEffect(() => map.setLayers(layers), [layers]);

  const [searchResults, setSearchResults] = useState<unknown>();

  async function loadSearchResults([longitude, latitude]: number[]) {
    const res = await fetch(
      `/api/norway/roads?longitude=${longitude}&latitude=${latitude}`,
    );
    setSearchResults(await res.json());
  }

  return (
    <section id={"content"}>
      <LeftSidebar />
      <MapSection
        map={map}
        className={selectionMode === "Roads" ? "select" : undefined}
      />
      <dialog ref={dialogRef}>
        <h2>Search results</h2>
        <pre>{JSON.stringify(searchResults, null, 2)}</pre>
      </dialog>
      <RightSidebar
        focusKommune={focusKommune}
        kommuneList={kommuneList}
        setSelectedKommune={setSelectedKommune}
      />
    </section>
  );
}
