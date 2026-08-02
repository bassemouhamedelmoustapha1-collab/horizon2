// Squelette affiché INSTANTANÉMENT pendant le rendu serveur de la liste
// des offres — le tap sur l'onglet « Offres » répond immédiatement.
export default function JobsLoading() {
  return (
    <div className="container-x py-6 lg:py-10">
      <div className="h-8 w-56 rounded-lg shimmer-bg mb-2" />
      <div className="h-4 w-32 rounded shimmer-bg mb-8" />
      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <div className="hidden lg:block h-80 rounded-2xl shimmer-bg" />
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl shimmer-bg" />
          ))}
        </div>
      </div>
    </div>
  );
}
