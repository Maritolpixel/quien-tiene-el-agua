import { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Map from "react-map-gl/maplibre";
import { DeckGL } from "@deck.gl/react";
import { WebMercatorViewport } from "@deck.gl/core";
import type { MapViewState } from "@deck.gl/core";
import "maplibre-gl/dist/maplibre-gl.css";

import { useAnexosData } from "./hooks/useAnexosData";
import { useAnexosLayers } from "./hooks/useAnexosLayers";
import { useRankingTitulares } from "./hooks/useRankingTitulares";
import type { Bounds } from "./hooks/useRankingTitulares";
import { Header } from "./componentes/Header";
import { PanelLateral } from "./componentes/PanelLateral";
import { FiltroTemporal } from "./componentes/FiltroTemporal";
import { RankingTitulares } from "./componentes/RankingTitulares";
import { INITIAL_VIEW_STATE, MAP_STYLE, dict_color } from "./constants";
import type { AnexosPunto, Fechas, Visibility } from "./types";

const BOUNDS_DEBOUNCE_MS = 250;

export default function App() {
  const [fechas, setFechas] = useState<Fechas>({
    fecha_inicio: new Date("1988-01-01"),
    fecha_final: new Date("2026-01-01"),
  });
  const [visibility, setVisibility] = useState<Visibility>({
    sub: true,
    sup: false,
    des: false,
    fed: false,
  });
  const [activeUsos, setActiveUsos] = useState<Set<string>>(
    new Set(Object.keys(dict_color)),
  );
  const [hoveredObject, setHoveredObject] = useState<AnexosPunto | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const boundsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const actualizarBounds = useCallback((viewState: MapViewState) => {
    if (boundsTimer.current) clearTimeout(boundsTimer.current);
    boundsTimer.current = setTimeout(() => {
      const { width, height } = viewState as MapViewState & {
        width?: number;
        height?: number;
      };
      const viewport = new WebMercatorViewport({
        ...viewState,
        width: width || window.innerWidth,
        height: height || window.innerHeight,
      });
      setBounds(viewport.getBounds() as Bounds);
    }, BOUNDS_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    actualizarBounds(INITIAL_VIEW_STATE);
    return () => {
      if (boundsTimer.current) clearTimeout(boundsTimer.current);
    };
  }, [actualizarBounds]);

  const data = useAnexosData(fechas, activeUsos);
  const layers = useAnexosLayers(data, visibility, hoveredObject, busqueda);
  const ranking = useRankingTitulares(data, visibility, bounds);

  return (
    <>
      <Header />
      <div className="mapa-contenedor">
        <PanelLateral
          visibility={visibility}
          onVisibilityChange={setVisibility}
          activeUsos={activeUsos}
          onActiveUsosChange={setActiveUsos}
          titulares={data.titulares}
          onBusqueda={setBusqueda}
        />
        <div className="control-temporal">
          <FiltroTemporal onChange={setFechas} />
        </div>
        <RankingTitulares ranking={ranking} cargando={data.cargando} />
        <DeckGL
          layers={layers}
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          onViewStateChange={({ viewState }) =>
            actualizarBounds(viewState as MapViewState)
          }
          onHover={({ object }) => setHoveredObject(object ?? null)}
          getTooltip={({ object, layer }) => {
            if (!object) return null;
            if (
              busqueda &&
              !(
                object.TITULAR?.toLowerCase().includes(busqueda.toLowerCase()) ??
                false
              )
            )
              return null;
            const esFed = layer?.id === "fed";
            return {
              html: [
                `<div style="font-weight:500;margin-bottom:5px;font-size:12px;color:#e2e8f4">${object.TITULO}</div>`,
                `<div style="color:#8a9ab8;font-size:11px;margin-bottom:2px">${object.TITULAR}</div>`,
                `<div style="color:#3da5c5;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:7px;font-weight:500">${object.USO}</div>`,
                `<div style="color:#bdc5d5;font-size:11px">${esFed ? "Superficie" : "Volumen"}: ${object.VOL.toLocaleString("es-MX")} ${esFed ? "m²" : "m³"}</div>`,
              ].join(""),
              style: {
                backgroundColor: "rgba(8,12,24,0.96)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "12px 14px",
                fontFamily: "'Source Code Pro', monospace",
                maxWidth: "260px",
                lineHeight: "1.5",
              },
            };
          }}
        >
          <Map reuseMaps mapStyle={MAP_STYLE} />
        </DeckGL>
      </div>
    </>
  );
}

export function renderToDOM(container: HTMLDivElement) {
  createRoot(container).render(<App />);
}
