interface Props {
  average: number;
}

export default function RatingsSummary({ average }: Props) {
  const ratings = [
    { stars: 5, percent: 70 },
    { stars: 4, percent: 15 },
    { stars: 3, percent: 5 },
    { stars: 2, percent: 3 },
    { stars: 1, percent: 2 },
  ];

  return (
    <div className="bg-gray-100 p-8 rounded">
      <h2 className="text-lg font-semibold mb-6">
        Valoraciones y Comentarios de Usuarios
      </h2>

      <div className="flex items-center gap-6">
        <div>
          <p className="text-4xl font-bold">{average}</p>
          <div className="text-yellow-500">★★★★★</div>
        </div>

        <div className="flex-1 space-y-2">
          {ratings.map((r) => (
            <div key={r.stars} className="flex items-center gap-3">
              <span className="text-sm w-12">{r.stars}★</span>
              <div className="flex-1 bg-gray-300 h-2 rounded">
                <div
                  className="bg-blue-500 h-2 rounded"
                  style={{ width: `${r.percent}%` }}
                />
              </div>
              <span className="text-sm">{r.percent}%</span>
            </div>
          ))}
        </div>

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Escribir tu valoración
        </button>
      </div>
    </div>
  );
}