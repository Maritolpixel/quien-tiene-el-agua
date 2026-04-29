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
      </div>
    </>
  );
}
