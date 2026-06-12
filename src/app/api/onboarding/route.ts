import { NextResponse } from "next/server";
import { fallbackWarning, getFallbackOnboardingData, readOnboardingWorkbook } from "@/lib/excel/onboardingWorkbook";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(readOnboardingWorkbook(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(getFallbackOnboardingData(`${fallbackWarning} Detalle: ${detail}`), { headers: { "Cache-Control": "no-store" } });
  }
}
