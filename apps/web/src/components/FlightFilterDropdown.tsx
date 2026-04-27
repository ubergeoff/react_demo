import { useEffect, useRef, useState } from 'react';
import type { Flight } from '@flight-booking/models';

interface Props {
  value: string;
  onChange: (flightId: string) => void;
  options: Flight[];
}

export function FlightFilterDropdown({ value, onChange, options }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((f) => f.id === value);

  function select(id: string) {
    onChange(id);
    setOpen(false);
  }

  return (
    <div className="ffd" ref={ref}>
      <button
        type="button"
        className={`ffd__trigger${open ? ' ffd__trigger--open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected ? (
          <span className="ffd__trigger-content">
            <span className="ffd__flight-number">{selected.flightNumber}</span>
            <span className="ffd__route">{selected.origin} → {selected.destination}</span>
          </span>
        ) : (
          <span className="ffd__placeholder">All flights</span>
        )}
        <span className="ffd__chevron" aria-hidden>▾</span>
      </button>

      {open && (
        <ul className="ffd__list" role="listbox">
          <li
            className={`ffd__option ffd__option--all${!value ? ' ffd__option--selected' : ''}`}
            role="option"
            aria-selected={!value}
            onMouseDown={() => select('')}
          >
            All flights
          </li>
          {options.map((f) => (
            <li
              key={f.id}
              className={`ffd__option${f.id === value ? ' ffd__option--selected' : ''}`}
              role="option"
              aria-selected={f.id === value}
              onMouseDown={() => select(f.id)}
            >
              <span className="ffd__flight-number">{f.flightNumber}</span>
              <span className="ffd__route">{f.origin} → {f.destination}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
