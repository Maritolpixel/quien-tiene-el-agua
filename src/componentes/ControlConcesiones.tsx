import type { Visibility } from "../types";

const CONCESIONES: { key: keyof Visibility; label: string }[] = [
  { key: "sub", label: "Subterráneos" },
  { key: "sup", label: "Superficiales" },
  { key: "des", label: "Descargas" },
  { key: "fed", label: "Zonas federales" },
];

type Props = {
  visibility: Visibility;
  onChange: (v: Visibility) => void;
};

export function ControlConcesiones({ visibility, onChange }: Props) {
  return (
    <div className="concesiones-grupo">
      {CONCESIONES.map(({ key, label }) => (
        <label key={key} className="concesion-item">
          <input
            type="checkbox"
            checked={visibility[key]}
            onChange={(e) => onChange({ ...visibility, [key]: e.target.checked })}
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
}
