export interface FeatureCollection<GEO extends GeometryDto, PROPS> {
  type: "FeatureCollection";
  features: FeatureDto<GEO, PROPS>[];
}

export interface FeatureDto<GEO extends GeometryDto, PROPS> {
  type: "Feature";
  geometry: GEO;
  properties: PROPS;
}

export interface PolygonDto {
  type: "Polygon";
  coordinates: number[][][];
}

interface PointDto {
  type: "Point";
  coordinates: number[][];
}

type GeometryDto = PolygonDto | PointDto;
