export type VectorTileProperties =
  | {
      layer: "road_label";
      class:
        | "street"
        | "primary"
        | "secondary"
        | "tertiary"
        | "trunk"
        | "motorway";
      ref?: string;
      name?: string;
    }
  | {
      layer: "landuse";
      class:
        | "park"
        | "scrub"
        | "agriculture"
        | "rock"
        | "wood"
        | "industrial"
        | "school";
    }
  | {
      layer:
        | "admin"
        | "landuse_overlay"
        | "marine_label"
        | "place_label"
        | "poi_label"
        | "road"
        | "water"
        | "waterway";
      class: string | undefined;
    };
