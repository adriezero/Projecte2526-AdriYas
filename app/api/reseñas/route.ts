import { NextResponse } from "next/server";

export async function GET() {
  const reviews = [
    { id: 1, name: "Maria Garcia", comment: "Buen servicio, aunque un poco lento." },
    { id: 2, name: "Carlos Perez", comment: "Excelente atención y calidad." },
    { id: 3, name: "Ana Lopez", comment: "Muy recomendable." },
  ];

  return NextResponse.json(reviews);
}