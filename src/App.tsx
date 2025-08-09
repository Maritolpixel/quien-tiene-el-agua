import { useEffect, useState, useMemo } from "react";

import { createRoot } from "react-dom/client";
import Map from "react-map-gl/mapbox";

import { DeckGL } from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";

import { CSVLoader } from "@loaders.gl/csv";
import { load } from "@loaders.gl/core";
import type { MapViewState } from "@deck.gl/core";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import "mapbox-gl/dist/mapbox-gl.css";

import BrushTemporal from "./componentes/BrushTemporal";

// Permitiendo scatter cuadrado

class SquareScatterplotLayer extends ScatterplotLayer {
  getShaders() {
    const shaders = super.getShaders();
    shaders.fs = shaders.fs.replace(
      "if (dist > 1.0) discard;",
      "if (max(abs(unitPosition.x), abs(unitPosition.y)) > 1.0) discard;"
    );
    return shaders;
  }
}
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const MAP_STYLE = "mapbox://styles/jdangoh/cmdzkidno009i01ryatoc33ex";

const dict_color = {
  AGRÍCOLA: [163, 229, 104],
  "PÚBLICO URBANO": [177, 180, 181],
  "DIFERENTES USOS": [242, 203, 88],
  PECUARIO: [255, 106, 77],
  SERVICIOS: [247, 135, 204],
  DOMÉSTICO: [126, 186, 217],
  INDUSTRIAL: [188, 149, 88],
  ACUACULTURA: [110, 120, 255],
  OTROS: [247, 247, 247],
  "GENERACIÓN DE ENERGÍA": [247, 247, 247],
  "CONSERVACIÓN ECOLÓGICA": [247, 247, 247],
  AGROINDUSTIAL: [247, 247, 247],
  COMERCIO: [247, 247, 247],
};
type AnexosPunto = {
  USO: keyof typeof dict_color;
  LON: number;
  LAT: number;
  VOL: number;
};

// Source data CSV
const url_anexos_sub =
  "https://tirandocodigo.mx/quien-tiene-el-agua/datos/anexos_sub.csv"; // eslint-disable-line
const url_anexos_sup =
  "https://tirandocodigo.mx/quien-tiene-el-agua/datos/anexos_sup.csv"; // eslint-disable-line
const url_anexos_des =
  "https://tirandocodigo.mx/quien-tiene-el-agua/datos/anexos_des.csv"; // eslint-disable-line
const url_anexos_fed =
  "https://tirandocodigo.mx/quien-tiene-el-agua/datos/anexos_fed.csv"; // eslint-disable-line

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -100,
  latitude: 20.7,
  zoom: 11,
  maxZoom: 16,
  pitch: 0,
  bearing: 0,
};

export default function App() {
  // Temporal
  const [fechas, setFechas] = useState({
    fecha_inicio: new Date("1993-01-01"),
    fecha_final: new Date("2026-01-01"),
  });
  // modal
  localStorage.removeItem("agua_modal_shown");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const modalShown = localStorage.getItem("agua_modal_shown");
    if (!modalShown) {
      setOpen(true);
    }
  }, []);

  // mapa
  const [dataSub, setDataSub] = useState([]);
  const [dataSup, setDataSup] = useState([]);
  const [dataDes, setDataDes] = useState([]);
  const [dataFed, setDataFed] = useState([]);

  const [showSub, setShowSub] = useState(true);
  const [showSup, setShowSup] = useState(false);
  const [showDes, setShowDes] = useState(false);
  const [showFed, setShowFed] = useState(false);
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const pixelRatio = window.devicePixelRatio || 1;

  useEffect(() => {
    // @ts-expect-error: los datos deben venir bien
    load(url_anexos_sub, CSVLoader, { csv: { header: true } }).then(setDataSub);
    // @ts-expect-error: los datos deben venir bien
    load(url_anexos_sup, CSVLoader, { csv: { header: true } }).then(setDataSup);
    // @ts-expect-error: los datos deben venir bien
    load(url_anexos_des, CSVLoader, { csv: { header: true } }).then(setDataDes);
    // @ts-expect-error: los datos deben venir bien
    load(url_anexos_fed, CSVLoader, { csv: { header: true } }).then(setDataFed);
  }, []);

  const filteredSubData = useMemo(() => {
    if (!dataSub || dataSub.length === 0) return [];
    // @ts-expect-error: los datos deben venir bien
    return dataSub.data.filter((d) => {
      const pointDate = new Date(d.FECHA);
      return (
        pointDate >= fechas.fecha_inicio && pointDate <= fechas.fecha_final
      );
    });
  }, [dataSub, fechas]);
  const filteredSupData = useMemo(() => {
    if (!dataSup || dataSup.length === 0) return [];
    // @ts-expect-error: los datos deben venir bien

    return dataSup.data.filter((d) => {
      const pointDate = new Date(d.FECHA);
      return (
        pointDate >= fechas.fecha_inicio && pointDate <= fechas.fecha_final
      );
    });
  }, [dataSup, fechas]);
  const filteredDesData = useMemo(() => {
    if (!dataDes || dataDes.length === 0) return [];
    // @ts-expect-error: los datos deben venir bien

    return dataDes.data.filter((d) => {
      const pointDate = new Date(d.FECHA);
      return (
        pointDate >= fechas.fecha_inicio && pointDate <= fechas.fecha_final
      );
    });
  }, [dataDes, fechas]);
  const filteredFedData = useMemo(() => {
    if (!dataFed || dataFed.length === 0) return [];
    // @ts-expect-error: los datos deben venir bien

    return dataFed.data.filter((d) => {
      const pointDate = new Date(d.FECHA);
      return (
        pointDate >= fechas.fecha_inicio && pointDate <= fechas.fecha_final
      );
    });
  }, [dataFed, fechas]);

  const layersSub = useMemo(() => {
    if (filteredSubData.length === 0) return null;

    return new ScatterplotLayer<AnexosPunto>({
      id: "sub",
      data: filteredSubData,
      radiusMinPixels: 1,
      radiusMaxPixels: 60,
      getPosition: (d) => [d.LON, d.LAT, 0] as [number, number, number],
      getFillColor: (d: AnexosPunto) => {
        const base = dict_color[d.USO];
        if (!base) {
          console.warn(`Color no definido para uso: ${d.USO}`);
          return [128, 128, 128, 80];
        }
        return [...base, 200] as [number, number, number, number];
      },
      getRadius: (d: AnexosPunto) => Math.sqrt(d.VOL || 1) / 50,
      radiusScale: isMac ? 10 * pixelRatio : 10,
      filled: true,
      stroked: false,
      pickable: true,
    });
  }, [filteredSubData, showSub]);
  const layersSup = useMemo(() => {
    if (filteredSupData.length === 0) return null;

    return new ScatterplotLayer<AnexosPunto>({
      id: "sup",
      data: filteredSupData,
      radiusMinPixels: 1,
      radiusMaxPixels: 60,
      getPosition: (d) => [d.LON, d.LAT, 0] as [number, number, number],
      getFillColor: (d: AnexosPunto) => {
        const base = dict_color[d.USO];
        if (!base) {
          console.warn(`Color no definido para uso: ${d.USO}`);
          return [128, 128, 128, 80];
        }
        return [...base, 200] as [number, number, number, number];
      },
      getRadius: (d: AnexosPunto) => Math.sqrt(d.VOL || 1) / 50,
      radiusScale: isMac ? 10 * pixelRatio : 10,
      filled: true,
      stroked: false,
      pickable: true,
    });
  }, [filteredSupData, showSup]);
  const layersDes = useMemo(() => {
    if (filteredDesData.length === 0) return null;

    return new ScatterplotLayer<AnexosPunto>({
      id: "des",
      data: filteredDesData,
      radiusMinPixels: 1,
      radiusMaxPixels: 60,
      getPosition: (d) => [d.LON, d.LAT, 0] as [number, number, number],
      getFillColor: (d: AnexosPunto) => {
        const base = dict_color[d.USO];
        if (!base) {
          console.warn(`Color no definido para uso: ${d.USO}`);
          return [128, 128, 128, 80];
        }
        return [...base, 200] as [number, number, number, number];
      },
      getRadius: (d: AnexosPunto) => Math.sqrt(d.VOL || 1) / 50,
      radiusScale: isMac ? 10 * pixelRatio : 10,
      filled: true,
      stroked: false,
      pickable: true,
    });
  }, [filteredDesData, showDes]);
  const layersFed = useMemo(() => {
    if (filteredFedData.length === 0) return null;
    // @ts-expect-error: los datos deben venir bien

    return new SquareScatterplotLayer<AnexosPunto>({
      id: "fed",
      data: filteredFedData,
      radiusMinPixels: 1,
      radiusMaxPixels: 60,
      getPosition: (d) => [d.LON, d.LAT, 0] as [number, number, number],
      getFillColor: (d: AnexosPunto) => {
        const base = dict_color[d.USO];
        if (!base) {
          console.warn(`Color no definido para uso: ${d.USO}`);
          return [128, 128, 128, 80];
        }
        return [...base, 200] as [number, number, number, number];
      },
      getRadius: (d: AnexosPunto) => Math.sqrt(d.VOL || 1) / 50,
      radiusScale: isMac ? 10 * pixelRatio : 10,
      filled: true,
      stroked: false,
      pickable: true,
    });
  }, [filteredFedData, showFed]);
  const layers = [
    showSub && layersSub,
    showSup && layersSup,
    showDes && layersDes,
    showFed && layersFed,
  ].filter(Boolean); // Quita los false
  return (
    <>
      <div className="panel-lateral">
        <BrushTemporal onChange={setFechas}></BrushTemporal>

        <h3>Tipo de concesión</h3>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={showSub}
                onChange={(e) => setShowSub(e.target.checked)}
              />
            }
            label="Subterráneos"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showSup}
                onChange={(e) => setShowSup(e.target.checked)}
              />
            }
            label="Superficiales"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showDes}
                onChange={(e) => setShowDes(e.target.checked)}
              />
            }
            label="Descargas"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showFed}
                onChange={(e) => setShowFed(e.target.checked)}
              />
            }
            label="Federales"
          />
        </FormGroup>
        <h3>Uso de la concesión</h3>

        <ul>
          {Object.entries(dict_color).map(([key, item]) => (
            <li key={key}>
              {" "}
              <span
                className="nomenclatura"
                style={{ background: `rgb(${item[0]},${item[1]},${item[2]})` }}
              ></span>
              {key}
            </li>
          ))}
        </ul>
      </div>
      <DeckGL
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        getTooltip={({ object }) =>
          object &&
          [object.TITULO, object.TITULAR, object.USO, object.VOL].join("\n")
        }
      >
        <Map reuseMaps mapStyle={MAP_STYLE} mapboxAccessToken={MAPBOX_TOKEN} />
      </DeckGL>
    </>
  );
}

export function renderToDOM(container: HTMLDivElement) {
  createRoot(container).render(<App />);
}
