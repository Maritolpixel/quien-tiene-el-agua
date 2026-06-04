import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import { dict_color, OTROS_AGRUPADOS } from "../constants";

const OTROS_TITLE = [...OTROS_AGRUPADOS]
  .map((u) => u.charAt(0) + u.slice(1).toLowerCase())
  .join(", ");

function formatUso(uso: string): string {
  return uso.charAt(0) + uso.slice(1).toLowerCase();
}

type Props = {
  activeUsos: Set<string>;
  onChange: (usos: Set<string>) => void;
};

export function LeyendaUsos({ activeUsos, onChange }: Props) {
  const individualUsos = Object.entries(dict_color).filter(
    ([key]) => !OTROS_AGRUPADOS.has(key)
  );

  const otrosChecked = [...OTROS_AGRUPADOS].every((u) => activeUsos.has(u));

  function toggle(uso: string) {
    const next = new Set(activeUsos);
    if (next.has(uso)) next.delete(uso);
    else next.add(uso);
    onChange(next);
  }

  function toggleOtros() {
    const next = new Set(activeUsos);
    if (otrosChecked) {
      OTROS_AGRUPADOS.forEach((u) => next.delete(u));
    } else {
      OTROS_AGRUPADOS.forEach((u) => next.add(u));
    }
    onChange(next);
  }

  return (
    <div className="usos-grupo">
      {individualUsos.map(([key, color]) => {
        const cssColor = `rgb(${color[0]},${color[1]},${color[2]})`;
        const isActive = activeUsos.has(key);
        return (
          <label key={key} className={`uso-item${isActive ? "" : " uso-inactivo"}`}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => toggle(key)}
            />
            <span className="uso-dot" style={{ backgroundColor: cssColor }} />
            <span className="uso-nombre">{formatUso(key)}</span>
          </label>
        );
      })}
      <label className={`uso-item${otrosChecked ? "" : " uso-inactivo"}`}>
        <input
          type="checkbox"
          checked={otrosChecked}
          onChange={toggleOtros}
        />
        <span
          className="uso-dot"
          style={{ backgroundColor: `rgb(${dict_color["OTROS"].join(",")})` }}
        />
        <span className="uso-nombre">Otros</span>
        <Tooltip
          title={OTROS_TITLE}
          placement="right"
          arrow
          slotProps={{
            tooltip: {
              sx: {
                bgcolor: "rgba(8,12,24,0.97)",
                border: "1px solid rgba(61,165,197,0.2)",
                fontSize: 11,
                fontFamily: "'Source Code Pro', monospace",
                letterSpacing: "0.01em",
                maxWidth: 220,
                lineHeight: 1.6,
              },
            },
            arrow: { sx: { color: "rgba(8,12,24,0.97)" } },
          }}
        >
          <span
            className="uso-otros-info"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <InfoOutlinedIcon sx={{ fontSize: 13, display: "block" }} />
          </span>
        </Tooltip>
      </label>
    </div>
  );
}
