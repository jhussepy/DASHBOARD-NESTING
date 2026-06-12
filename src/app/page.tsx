import { CommandCenter } from "@/components/dashboard/CommandCenter";
import { readOnboardingWorkbook } from "@/lib/excel/onboardingWorkbook";

export const dynamic = "force-dynamic";

export default function Page() {
  const data = readOnboardingWorkbook();
  return <CommandCenter initialData={data} />;
}
