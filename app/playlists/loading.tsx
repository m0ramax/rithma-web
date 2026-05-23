export default function PlaylistsLoading() {
  return (
    <div className="px-6 py-10 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="h-2.5 w-16 rounded shimmer mb-3" />
        <div className="h-7 w-44 rounded shimmer" />
      </div>

      {/* 2×2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {[0, 1, 2, 3].map((col) => (
          <div key={col} className="flex flex-col">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#252532]">
              <div className="size-3 rounded-full shimmer" />
              <div className="h-2.5 w-20 rounded shimmer" />
              <div className="h-2.5 w-14 rounded shimmer ml-auto" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5 border-b border-[#252532] last:border-0"
              >
                <div className="w-[3px] h-9 rounded-full shimmer shrink-0" />
                <div className="size-10 rounded shrink-0 shimmer" />
                <div className="flex flex-col gap-2 flex-1">
                  <div
                    className="h-3 rounded shimmer"
                    style={{ width: `${55 + ((i * 17) % 35)}%` }}
                  />
                  <div className="h-2.5 w-10 rounded shimmer" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
