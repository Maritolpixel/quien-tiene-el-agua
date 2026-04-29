import { useState, useEffect, useRef } from "react";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import type { Fechas } from "../types";

const MIN = new Date("1990-01-01").getTime();
const MAX = new Date("2026-01-01").getTime();
const MONTH_MS = 30 * 24 * 3600 * 1000;
const FRAME_MS = 50;

const MARKS = [1990, 2000, 2010, 2020].map((y) => ({
  value: new Date(`${y}-01-01`).getTime(),
  label: `${y}`,
}));

const fmtYear = (ts: number) => new Date(ts).getFullYear().toString();
const fmtFecha = (ts: number) =>
  new Date(ts).toLocaleDateString("es-MX", { year: "numeric", month: "short" });

type Props = { onChange: (f: Fechas) => void };

export function FiltroTemporal({ onChange }: Props) {
  const [value, setValue] = useState<[number, number]>([
    new Date("1993-01-01").getTime(),
    MAX,
  ]);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    onChange({
      fecha_inicio: new Date(value[0]),
      fecha_final: new Date(value[1]),
    });
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setValue(([s, e]) => {
          const windowSize = e - s;
          const newS = e;
          const newE = e + windowSize;
          if (newE >= MAX) {
            setPlaying(false);
            return [newS, MAX];
          }
          return [newS, newE];
        });
      }, FRAME_MS);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]);

  function handleSliderChange(_: Event, newValue: number | number[]) {
    if (playing) setPlaying(false);
    setValue(newValue as [number, number]);
  }

  function togglePlay() {
    if (!playing) {
      if (value[1] >= MAX) {
        const windowSize = value[1] - value[0];
        setValue([MIN, MIN + windowSize]);
      }
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }

  return (
    <div className="filtro-temporal">
      <div className="filtro-header">
        <span className="filtro-label">
          Periodo de otorgamiento de concesión
        </span>
        <span className="filtro-rango">
          {fmtFecha(value[0])} — {fmtFecha(value[1])}
        </span>
      </div>
      <div className="filtro-controles">
        <IconButton
          size="small"
          onClick={togglePlay}
          title={playing ? "Pausar" : "Animar"}
          sx={{
            color: "#3da5c5",
            p: 0,
            width: 28,
            height: 28,
            border: "1px solid rgba(61,165,197,0.3)",
            borderRadius: "6px",
            flexShrink: 0,
            "&:hover": {
              backgroundColor: "rgba(61,165,197,0.1)",
              borderColor: "rgba(61,165,197,0.6)",
            },
          }}
        >
          {playing
            ? <PauseIcon sx={{ fontSize: 16 }} />
            : <PlayArrowIcon sx={{ fontSize: 16 }} />}
        </IconButton>
        <div style={{ flex: 1, minWidth: 0, paddingInline: 6 }}>
          <Slider
            value={value}
            min={MIN}
            max={MAX}
            step={MONTH_MS}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            valueLabelFormat={fmtYear}
            marks={MARKS}
            sx={{
              color: "#3da5c5",
              display: "block",
              "& .MuiSlider-track": { border: "none" },
              "& .MuiSlider-rail": {
                opacity: 0.18,
                backgroundColor: "#7a8599",
              },
              "& .MuiSlider-mark": {
                backgroundColor: "rgba(255,255,255,0.2)",
                width: 1,
                height: 8,
              },
              "& .MuiSlider-markLabel": {
                color: "#8a9ab8",
                fontSize: 10,
                letterSpacing: "0.04em",
              },
              "& .MuiSlider-valueLabel": {
                backgroundColor: "rgba(8,12,24,0.96)",
                border: "1px solid rgba(255,255,255,0.14)",
                fontSize: 11,
                fontFamily: "'Source Code Pro', monospace",
              },
              "& .MuiSlider-thumb": {
                width: 13,
                height: 13,
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: "0 0 0 8px rgba(61,165,197,0.14)",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
