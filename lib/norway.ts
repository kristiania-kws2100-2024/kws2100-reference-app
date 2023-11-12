import { FeatureCollection, PolygonDto } from "../client/lib/geoJson";

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
