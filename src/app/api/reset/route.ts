import { NextResponse } from "next/server";
import { db } from "@/lib/db-store";

export async function POST() {
  db.resetToDefault();
  return NextResponse.json({
    success: true,
    message: "Banco de dados e pedidos resetados para o padrão de demonstração!",
  });
}
