import { useState } from "react";
import { ControlConcesiones } from "./ControlConcesiones";
import { LeyendaUsos } from "./LeyendaUsos";
import { BuscadorTitular } from "./BuscadorTitular";
import type { Visibility } from "../types";

type Props = {
  visibility: Visibility;
  onVisibilityChange: (v: Visibility) => void;
  activeUsos: Set<string>;
  onActiveUsosChange: (usos: Set<string>) => void;
  titulares: string[];
  onBusqueda: (b: string) => void;
};

export function PanelLateral({
  visibility,
  onVisibilityChange,
  activeUsos,
  onActiveUsosChange,
  titulares,
  onBusqueda,
}: Props) {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button
        className={`panel-toggle-btn${abierto ? " activo" : ""}`}
        onClick={() => setAbierto((v) => !v)}
        aria-label={abierto ? "Cerrar panel" : "Abrir panel"}
      >
        {abierto ? "✕" : "≡"}
      </button>

      {abierto && (
        <div className="panel-backdrop" onClick={() => setAbierto(false)} />
      )}

      <div className={`panel-lateral${abierto ? " panel-abierto" : ""}`}>
        <div className="panel-titulo">
          <h1 className="app-titulo">¿Quién tiene el agua?</h1>
          <p className="app-subtitulo">Concesiones de agua en México</p>
        </div>
        <div className="panel-seccion">
          <span className="seccion-label">Buscar titular</span>
          <BuscadorTitular titulares={titulares} onBusqueda={onBusqueda} />
        </div>
        <div className="panel-seccion">
          <span className="seccion-label">Tipo de concesión</span>
          <ControlConcesiones
            visibility={visibility}
            onChange={onVisibilityChange}
          />
        </div>
        <div className="panel-seccion">
          <span className="seccion-label">Uso de la concesión</span>
          <LeyendaUsos activeUsos={activeUsos} onChange={onActiveUsosChange} />
        </div>
        <div className="panel-seccion fuente">
          <p>
            Fuente:_
            <a href="https://historico.datos.gob.mx/busca/dataset/concesiones-asignaciones-permisos-otorgados-y-registros-de-obras-situadas-en-zonas-de-libre-alu/resource/1eceb049-bcf4-41a9-a77b-7e1d6d0080c3">
              Otorgamiento de concesiones, asignaciones y permisos para el uso
              explotación y/o aprovehcamiento de las aguas nacionales...
            </a>{" "}
            | CONAGUA | Corte a junio de 2025
          </p>
        </div>

        <a
          href="https://github.com/jdanielgoh/quien-tiene-el-agua"
          target="_blank"
          rel="noopener noreferrer"
          className="panel-github-link"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="github-icon">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Repositorio en GitHub
        </a>
      </div>
    </>
  );
}
