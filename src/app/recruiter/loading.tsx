// Squelette instantané du tableau de bord recruteur.
export default function RecruiterLoading() {
  return (
    <div className="container-x py-10">
      <div className="h-8 w-64 rounded-lg shimmer-bg mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl shimmer-bg" />
        ))}
      </div>
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl shimmer-bg" />
          ))}
        </div>
        <div className="h-72 rounded-2xl shimmer-bg" />
      </div>
    </div>
  );
}
