import type { MapViewState } from "@deck.gl/core";

export const dict_color: Record<string, [number, number, number]> = {
  AGRÍCOLA: [68, 196, 108],
  "PÚBLICO URBANO": [70, 130, 220],
  "DIFERENTES USOS": [248, 188, 36],
  PECUARIO: [248, 102, 56],
  SERVICIOS: [228, 65, 150],
  DOMÉSTICO: [50, 210, 195],
  INDUSTRIAL: [190, 148, 68],
  ACUACULTURA: [132, 108, 245],
  OTROS: [112, 124, 140],
  "GENERACIÓN DE ENERGÍA": [112, 124, 140],
  "CONSERVACIÓN ECOLÓGICA": [112, 124, 140],
  AGROINDUSTIAL: [112, 124, 140],
  COMERCIO: [112, 124, 140],
};

export const DATA_URLS = {
  sub: "https://tirandocodigo.mx/quien-tiene-el-agua/datos/anexos_sub.csv",
  sup: "https://tirandocodigo.mx/quien-tiene-el-agua/datos/anexos_sup.csv",
  des: "https://tirandocodigo.mx/quien-tiene-el-agua/datos/anexos_des.csv",
  fed: "https://tirandocodigo.mx/quien-tiene-el-agua/datos/anexos_fed.csv",
};

export const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export const OTROS_AGRUPADOS = new Set([
  "OTROS",
  "GENERACIÓN DE ENERGÍA",
  "CONSERVACIÓN ECOLÓGICA",
  "AGROINDUSTIAL",
  "COMERCIO",
]);

export const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -100,
  latitude: 20.7,
  zoom: 11,
  maxZoom: 16,
  pitch: 0,
  bearing: 0,
};
