import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db-store";

// GET /api/medications - Listar catálogo de medicamentos disponíveis no SUS
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("categoria") || undefined;

  const medications = db.getMedications(category);

  return NextResponse.json({
    success: true,
    total: medications.length,
    data: medications,
  });
}
