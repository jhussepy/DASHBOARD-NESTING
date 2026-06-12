import { NextResponse } from "next/server";
import { readOnboardingWorkbook } from "@/lib/excel/onboardingWorkbook";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(readOnboardingWorkbook(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: "No se pudo leer data/vodafone_onboarding_base_dinamica.xlsx", detail: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
