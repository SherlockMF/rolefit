import { cn } from "@/lib/utils";

export type WizardStep = "input" | "diagnose" | "followup" | "done";

const steps: { id: WizardStep; label: string }[] = [
  { id: "input", label: "输入" },
  { id: "diagnose", label: "诊断" },
  { id: "followup", label: "追问" },
  { id: "done", label: "终稿" },
];

const order: WizardStep[] = ["input", "diagnose", "followup", "done"];

export function WizardSteps({ current }: { current: WizardStep }) {
  const currentIdx = order.indexOf(current);

  return (
    <ol className="flex flex-wrap items-center gap-2 text-sm">
      {steps.map((step, i) => {
        const idx = order.indexOf(step.id);
        const active = idx === currentIdx;
        const done = idx < currentIdx;

        return (
          <li key={step.id} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-muted-foreground/50" aria-hidden>
                →
              </span>
            )}
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
                active && "border-foreground bg-foreground text-background",
                done && !active && "border-emerald-200 bg-emerald-50 text-emerald-800",
                !active && !done && "border-border text-muted-foreground",
              )}
            >
              <span className="text-xs tabular-nums">{i + 1}</span>
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
