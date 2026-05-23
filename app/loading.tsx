export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-end gap-[3px] h-8">
          {[55, 80, 100, 70, 90, 60, 75].map((h, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full bg-[#E8A020] animate-pulse"
              style={{
                height: `${h}%`,
                animationDelay: `${i * 90}ms`,
                animationDuration: "1.4s",
              }}
            />
          ))}
        </div>
        <span className="font-mono text-[10px] text-[#52525E] tracking-[0.2em] uppercase">
          Cargando
        </span>
      </div>
    </div>
  );
}
