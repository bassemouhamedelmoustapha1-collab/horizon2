// Squelette instantané du tableau de bord candidat.
export default function CandidateLoading() {
  return (
    <div className="container-x py-10">
      <div className="h-8 w-64 rounded-lg shimmer-bg mb-8" />
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl shimmer-bg" />
          ))}
        </div>
        <div className="h-72 rounded-2xl shimmer-bg" />
      </div>
    </div>
  );
}
