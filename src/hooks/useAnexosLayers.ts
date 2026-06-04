import { useCallback, useMemo } from "react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { SquareScatterplotLayer } from "../layers/SquareScatterplotLayer";
import type { AnexosPunto, Visibility } from "../types";
import { dict_color } from "../constants";

const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
const pixelRatio = window.devicePixelRatio || 1;
const radiusScale = isMac ? 10 * pixelRatio : 10;

const BASE_LAYER_PROPS = {
  radiusMinPixels: 1,
  radiusMaxPixels: 60,
  getPosition: (d: AnexosPunto) =>
    [d.LON, d.LAT, 0] as [number, number, number],
  radiusScale,
  filled: true,
  stroked: true,
  lineWidthUnits: "pixels" as const,
  pickable: true,
};

type AnexosData = {
  filteredSub: AnexosPunto[];
  filteredSup: AnexosPunto[];
  filteredDes: AnexosPunto[];
  filteredFed: AnexosPunto[];
};

export function useAnexosLayers(
  data: AnexosData,
  visibility: Visibility,
  hoveredObject: AnexosPunto | null,
  busqueda: string,
) {
  const getFillColor = useCallback(
    (d: AnexosPunto): [number, number, number, number] => {
      const base = dict_color[d.USO];
      const color = base ?? [128, 128, 128];
      if (!busqueda) return [...color, 200] as [number, number, number, number];
      const match =
        d.TITULAR?.toLowerCase().includes(busqueda.toLowerCase()) ?? false;
      return [...color, match ? 230 : 0] as [number, number, number, number];
    },
    [busqueda],
  );

  const getLineColor = useCallback(
    (d: AnexosPunto): [number, number, number, number] => {
      const base = dict_color[d.USO];
      const color = base ?? [128, 128, 128];
      if (!busqueda) return [255, 255, 255, d === hoveredObject ? 255 : 0];
      const match =
        d.TITULAR?.toLowerCase().includes(busqueda.toLowerCase()) ?? false;
      if (!match) return [255, 255, 255, 0];
      return [...color, d === hoveredObject ? 255 : 180] as [
        number,
        number,
        number,
        number,
      ];
    },
    [busqueda, hoveredObject],
  );

  const getLineWidth = useCallback(
    (d: AnexosPunto) => {
      if (d === hoveredObject) return 2;
      if (
        busqueda &&
        (d.TITULAR?.toLowerCase().includes(busqueda.toLowerCase()) ?? false)
      )
        return 1;
      return 0;
    },
    [hoveredObject, busqueda],
  );

  const layerSub = useMemo(() => {
    if (!data.filteredSub.length) return null;
    return new ScatterplotLayer<AnexosPunto>({
      ...BASE_LAYER_PROPS,
      id: "sub",
      data: data.filteredSub,
      getRadius: (d) => Math.sqrt(d.VOL || 1) / 50,
      getFillColor,
      getLineColor,
      getLineWidth,
      updateTriggers: {
        getFillColor: busqueda,
        getLineColor: [busqueda, hoveredObject],
        getLineWidth: [hoveredObject, busqueda],
      },
    });
  }, [
    data.filteredSub,
    getFillColor,
    getLineColor,
    getLineWidth,
    hoveredObject,
    busqueda,
  ]);

  const layerSup = useMemo(() => {
    if (!data.filteredSup.length) return null;
    return new ScatterplotLayer<AnexosPunto>({
      ...BASE_LAYER_PROPS,
      id: "sup",
      data: data.filteredSup,
      getRadius: (d) => Math.sqrt(d.VOL || 1) / 50,
      getFillColor,
      getLineColor,
      getLineWidth,
      updateTriggers: {
        getFillColor: busqueda,
        getLineColor: [busqueda, hoveredObject],
        getLineWidth: [hoveredObject, busqueda],
      },
    });
  }, [
    data.filteredSup,
    getFillColor,
    getLineColor,
    getLineWidth,
    hoveredObject,
    busqueda,
  ]);

  const layerDes = useMemo(() => {
    if (!data.filteredDes.length) return null;
    return new ScatterplotLayer<AnexosPunto>({
      ...BASE_LAYER_PROPS,
      id: "des",
      data: data.filteredDes,
      getRadius: (d) => Math.sqrt(d.VOL || 1) / 50,
      getFillColor,
      getLineColor,
      getLineWidth,
      updateTriggers: {
        getFillColor: busqueda,
        getLineColor: [busqueda, hoveredObject],
        getLineWidth: [hoveredObject, busqueda],
      },
    });
  }, [
    data.filteredDes,
    getFillColor,
    getLineColor,
    getLineWidth,
    hoveredObject,
    busqueda,
  ]);

  const layerFed = useMemo(() => {
    if (!data.filteredFed.length) return null;
    // @ts-expect-error: SquareScatterplotLayer extiende ScatterplotLayer
    return new SquareScatterplotLayer<AnexosPunto>({
      ...BASE_LAYER_PROPS,
      id: "fed",
      data: data.filteredFed,
      getRadius: (d) => Math.sqrt(d.VOL || 1) / 20,
      getFillColor,
      getLineColor,
      getLineWidth,
      updateTriggers: {
        getFillColor: busqueda,
        getLineColor: [busqueda, hoveredObject],
        getLineWidth: [hoveredObject, busqueda],
      },
    });
  }, [
    data.filteredFed,
    getFillColor,
    getLineColor,
    getLineWidth,
    hoveredObject,
    busqueda,
  ]);

  return [
    visibility.sub && layerSub,
    visibility.sup && layerSup,
    visibility.des && layerDes,
    visibility.fed && layerFed,
  ].filter(Boolean);
}
