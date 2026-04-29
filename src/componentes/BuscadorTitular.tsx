import { useState, useMemo, useRef, useEffect } from "react";

type Props = {
  titulares: string[];
  onBusqueda: (b: string) => void;
};

export function BuscadorTitular({ titulares, onBusqueda }: Props) {
  const [input, setInput] = useState("");
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const [indexActivo, setIndexActivo] = useState(-1);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sugerencias = useMemo(() => {
    if (!input.trim()) return [];
    const q = input.toLowerCase();
    return titulares.filter((t) => t.toLowerCase().includes(q)).slice(0, 8);
  }, [input, titulares]);

  useEffect(() => {
    onBusqueda(input.trim());
    setIndexActivo(-1);
  }, [input]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function cerrarAlClick(e: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setDropdownAbierto(false);
      }
    }
    document.addEventListener("mousedown", cerrarAlClick);
    return () => document.removeEventListener("mousedown", cerrarAlClick);
  }, []);

  function seleccionar(titular: string) {
    setInput(titular);
    setDropdownAbierto(false);
    inputRef.current?.blur();
  }

  function limpiar() {
    setInput("");
    setDropdownAbierto(false);
    onBusqueda("");
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!dropdownAbierto || sugerencias.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndexActivo((i) => Math.min(i + 1, sugerencias.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndexActivo((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && indexActivo >= 0) {
      e.preventDefault();
      seleccionar(sugerencias[indexActivo]);
    } else if (e.key === "Escape") {
      setDropdownAbierto(false);
    }
  }

  const mostrarDropdown = dropdownAbierto && sugerencias.length > 0;

  return (
    <div className="buscador" ref={contenedorRef}>
      <div className="buscador-campo">
        <SearchIcon className="buscador-icono" />
        <input
          ref={inputRef}
          className="buscador-input"
          type="text"
          placeholder="Buscar titular..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setDropdownAbierto(true);
          }}
          onFocus={() => setDropdownAbierto(true)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
        />
        {input && (
          <button
            className="buscador-limpiar"
            onClick={limpiar}
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>

      {mostrarDropdown && (
        <ul className="buscador-lista" role="listbox">
          {sugerencias.map((t, i) => (
            <li
              key={t}
              className={`buscador-sugerencia${i === indexActivo ? " activa" : ""}`}
              onMouseDown={() => seleccionar(t)}
              role="option"
              aria-selected={i === indexActivo}
            >
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.4" />
      <line
        x1="8.5"
        y1="8.5"
        x2="12"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
