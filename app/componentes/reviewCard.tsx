interface Props {
  name: string;
  comment: string;
}

export default function ReviewCard({ name, comment }: Props) {
  return (
    <div className="border p-4 rounded bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gray-300"></div>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-xs text-gray-500">16 de Octubre, 2023</p>
        </div>
      </div>

      <div className="text-yellow-500 mb-2">★★★★☆</div>

      <p className="text-sm text-gray-700">
        {comment}
      </p>
    </div>
  );
}