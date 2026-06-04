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
  sub: `${import.meta.env.BASE_URL}datos/anexos_sub_06_2025.csv`,
  sup: `${import.meta.env.BASE_URL}datos/anexos_sup_06_2025.csv`,
  des: `${import.meta.env.BASE_URL}datos/anexos_des_06_2025.csv`,
  fed: `${import.meta.env.BASE_URL}datos/anexos_fed_06_2025.csv`,
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
