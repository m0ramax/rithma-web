"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
      <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-red-400 mb-6">
        Error inesperado
      </span>
      <h1 className="font-display font-bold text-[#F2F0EA] text-2xl mb-3">
        Algo salió mal
      </h1>
      <p className="text-[#52525E] text-sm font-mono max-w-[38ch] mb-10 leading-relaxed">
        Ocurrió un error al cargar esta página. Intenta de nuevo o vuelve al inicio.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E8A020] text-[#0C0C0F] text-sm font-semibold rounded-md transition-all hover:bg-[#d49218] active:scale-[0.98]"
        >
          Reintentar
        </button>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#252532] text-[#8A8A9E] text-sm rounded-md transition-all hover:border-[#3A3A4E] hover:text-[#F2F0EA]"
        >
          Inicio
        </a>
      </div>
    </div>
  );
}
