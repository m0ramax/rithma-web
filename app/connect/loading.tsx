export default function ConnectLoading() {
  return (
    <div className="min-h-[calc(100dvh-57px)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="h-2.5 w-20 rounded shimmer mb-3" />
          <div className="h-9 w-60 rounded shimmer mb-3" />
          <div className="h-3 w-72 rounded shimmer" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="bg-[#1A1A24] border border-[#252532] rounded-xl p-6 flex flex-col gap-5"
            >
              <div className="flex items-start justify-between">
                <div className="size-[52px] rounded-lg shimmer" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-5 w-28 rounded shimmer" />
                <div className="h-3 w-44 rounded shimmer" />
              </div>
              <div className="h-9 rounded-md shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
