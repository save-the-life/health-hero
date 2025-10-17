export function generateStaticParams() {
  return [
    { phase: '1' },
    { phase: '2' },
    { phase: '3' },
  ];
}

export default function PhasePage() {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-3xl font-bold mb-4 drop-shadow-lg">
          Phase Page
        </h1>
        <p className="text-white text-lg drop-shadow-lg">
          This page is under development
        </p>
      </div>
    </div>
  );
}

