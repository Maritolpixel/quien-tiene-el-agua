import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import type { RankingTitular } from "../hooks/useRankingTitulares";

const fmtVol = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 });

type Props = {
  ranking: RankingTitular[];
  cargando: boolean;
};

export function RankingTitulares({ ranking, cargando }: Props) {
  const [abierto, setAbierto] = useState(false);

  if (!abierto) {
    return (
      <button
        className="ranking-toggle-btn"
        onClick={() => setAbierto(true)}
        aria-label="Abrir ranking de titulares"
      >
        <LeaderboardIcon sx={{ fontSize: 14 }} />
        Ranking
      </button>
    );
  }

  return (
    <div className="ranking-panel">
      <div className="ranking-header">
        <span className="ranking-titulo">Top titulares en vista</span>
        <button
          className="ranking-cerrar"
          onClick={() => setAbierto(false)}
          aria-label="Cerrar ranking"
        >
          ✕
        </button>
      </div>

      {ranking.length === 0 ? (
        <p className="ranking-vacio">
          {cargando
            ? "Cargando datos…"
            : "Sin concesiones visibles en el área actual."}
        </p>
      ) : (
        <ol className="ranking-lista">
          {ranking.map((r, i) => (
            <li key={r.titular} className="ranking-fila">
              <span className="ranking-pos">{i + 1}</span>
              <div className="ranking-datos">
                <Tooltip title={r.titular} placement="left" enterDelay={400}>
                  <span className="ranking-nombre">{r.titular}</span>
                </Tooltip>
                <span className="ranking-detalle">
                  {fmtVol.format(r.vol)} m³ · {r.concesiones}{" "}
                  {r.concesiones === 1 ? "concesión" : "concesiones"}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="ranking-nota">
        <InfoOutlinedIcon sx={{ fontSize: 13 }} />
        <span>
          Excluye zonas federales: su valor es superficie (m²), no volumen.
        </span>
      </div>
    </div>
  );
}
