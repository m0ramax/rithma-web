import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
      <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#E8A020] mb-6">
        Error 404
      </span>
      <h1
        className="font-display font-extrabold tracking-tighter leading-none text-[#F2F0EA] mb-4"
        style={{ fontSize: "clamp(3.5rem, 10vw, 7rem)" }}
      >
        No encontrado
      </h1>
      <p className="text-[#52525E] text-sm font-mono max-w-[38ch] mb-10 leading-relaxed">
        Esta página no existe o fue movida a otra dirección.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E8A020] text-[#0C0C0F] text-sm font-semibold rounded-md transition-all hover:bg-[#d49218] active:scale-[0.98]"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
