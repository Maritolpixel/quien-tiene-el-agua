import { useEffect, useMemo, useState } from "react";
import { load } from "@loaders.gl/core";
import { CSVLoader } from "@loaders.gl/csv";
import type { AnexosPunto, Fechas } from "../types";
import { DATA_URLS } from "../constants";

function filterData(
  data: AnexosPunto[],
  { fecha_inicio, fecha_final }: Fechas,
  activeUsos: Set<string>
): AnexosPunto[] {
  return data.filter((d) => {
    const pointDate = new Date(d.FECHA);
    return (
      pointDate >= fecha_inicio &&
      pointDate <= fecha_final &&
      activeUsos.has(d.USO)
    );
  });
}

export function useAnexosData(fechas: Fechas, activeUsos: Set<string>) {
  const [rawSub, setRawSub] = useState<AnexosPunto[]>([]);
  const [rawSup, setRawSup] = useState<AnexosPunto[]>([]);
  const [rawDes, setRawDes] = useState<AnexosPunto[]>([]);
  const [rawFed, setRawFed] = useState<AnexosPunto[]>([]);
  const [pendientes, setPendientes] = useState(4);

  useEffect(() => {
    const fin = () => setPendientes((p) => p - 1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    load(DATA_URLS.sub, CSVLoader, { csv: { header: true } }).then((res: any) => setRawSub(res.data)).finally(fin);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    load(DATA_URLS.sup, CSVLoader, { csv: { header: true } }).then((res: any) => setRawSup(res.data)).finally(fin);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    load(DATA_URLS.des, CSVLoader, { csv: { header: true } }).then((res: any) => setRawDes(res.data)).finally(fin);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    load(DATA_URLS.fed, CSVLoader, { csv: { header: true } }).then((res: any) => setRawFed(res.data)).finally(fin);
  }, []);

  const filteredSub = useMemo(() => filterData(rawSub, fechas, activeUsos), [rawSub, fechas, activeUsos]);
  const filteredSup = useMemo(() => filterData(rawSup, fechas, activeUsos), [rawSup, fechas, activeUsos]);
  const filteredDes = useMemo(() => filterData(rawDes, fechas, activeUsos), [rawDes, fechas, activeUsos]);
  const filteredFed = useMemo(() => filterData(rawFed, fechas, activeUsos), [rawFed, fechas, activeUsos]);

  const titulares = useMemo(() => {
    const seen = new Set<string>();
    for (const d of rawSub) if (d.TITULAR) seen.add(d.TITULAR);
    for (const d of rawSup) if (d.TITULAR) seen.add(d.TITULAR);
    for (const d of rawDes) if (d.TITULAR) seen.add(d.TITULAR);
    for (const d of rawFed) if (d.TITULAR) seen.add(d.TITULAR);
    return Array.from(seen).sort();
  }, [rawSub, rawSup, rawDes, rawFed]);

  return {
    filteredSub,
    filteredSup,
    filteredDes,
    filteredFed,
    titulares,
    cargando: pendientes > 0,
  };
}
