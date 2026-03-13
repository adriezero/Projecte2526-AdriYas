// app/componentes/reviewCard.tsx
import { Props } from '@interfaces/interfaces';

export default function Reseñas({ name, comment, isPositive, date, route }: Props) {
  return (
    <div className="border border-gray-200 p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col items-center text-center mb-4">
        <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md mb-3">
          {name[0]}
        </div>
        <p className="font-bold text-lg text-gray-800">{name}</p>
        {date && <p className="text-sm text-gray-500 mt-1">{new Date(date).toLocaleDateString('es-ES')}</p>}
      </div>

      <div className="text-5xl mb-4 text-center text-black">
        {isPositive ? '👍' : '👎'}
      </div>

      <p className="text-center text-gray-700 leading-relaxed mb-3 italic"><q>{comment}</q></p>
      
      {route && <p className="text-center text-sm text-gray-500 font-medium mt-4 pt-3 border-t border-gray-100">📍 {route}</p>}
    </div>
  );
}
