import { FeatureCollection, FeatureDto, PolygonDto } from "./geoJson";
import { Feature } from "ol";
import { Polygon } from "ol/geom";

export interface KommunePropertiesDto {
  kommunenummer: string;
  navn: {
    sprak:
      | "nor" // norwegian
      | "sma" // south sami
      | "sme" // north sami
      | "fkv" // kven
      | "smj"; // lule sami
    navn: string;
  }[];
}

export interface KommuneFeatureCollectionDto
  extends FeatureCollection<PolygonDto, KommunePropertiesDto> {}

export function kommuneAsFeature(
  featureDto: FeatureDto<PolygonDto, KommunePropertiesDto>,
) {
  const feature = new Feature({
    ...featureDto.properties,
    geometry: new Polygon(featureDto.geometry.coordinates),
  });
  feature.setId(featureDto.properties.kommunenummer);
  return feature;
}
