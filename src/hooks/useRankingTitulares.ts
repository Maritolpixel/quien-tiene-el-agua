import { useMemo } from "react";
import type { AnexosPunto, Visibility } from "../types";

// [oeste, sur, este, norte], como lo devuelve WebMercatorViewport.getBounds()
export type Bounds = [number, number, number, number];

export type RankingTitular = {
  titular: string;
  vol: number;
  concesiones: number;
};

export const RANKING_TOP_N = 15;

type AnexosData = {
  filteredSub: AnexosPunto[];
  filteredSup: AnexosPunto[];
  filteredDes: AnexosPunto[];
};

export function useRankingTitulares(
  data: AnexosData,
  visibility: Visibility,
  bounds: Bounds | null,
): RankingTitular[] {
  const { filteredSub, filteredSup, filteredDes } = data;
  const { sub, sup, des } = visibility;

  return useMemo(() => {
    if (!bounds) return [];
    const [oeste, sur, este, norte] = bounds;

    // fed se excluye siempre: su VOL es superficie en m², no volumen en m³
    const fuentes = [
      sub ? filteredSub : [],
      sup ? filteredSup : [],
      des ? filteredDes : [],
    ];

    const acumulado = new Map<string, { vol: number; concesiones: number }>();
    for (const puntos of fuentes) {
      for (const d of puntos) {
        if (d.LON < oeste || d.LON > este || d.LAT < sur || d.LAT > norte)
          continue;
        const titular = d.TITULAR || "(SIN TITULAR)";
        const prev = acumulado.get(titular);
        if (prev) {
          prev.vol += d.VOL || 0;
          prev.concesiones += 1;
        } else {
          acumulado.set(titular, { vol: d.VOL || 0, concesiones: 1 });
        }
      }
    }

    return Array.from(acumulado, ([titular, v]) => ({ titular, ...v }))
      .sort((a, b) => b.vol - a.vol)
      .slice(0, RANKING_TOP_N);
  }, [filteredSub, filteredSup, filteredDes, sub, sup, des, bounds]);
}
