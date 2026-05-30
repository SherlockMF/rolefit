import type { OptimizeResumeRequest } from "@/lib/types/resume-optimization";

export function formatTargetContext(input: Pick<
  OptimizeResumeRequest,
  "targetRole" | "targetCompany" | "targetIndustry" | "currentRole"
>): string {
  const lines = [
    `【当前身份】${input.currentRole}`,
    `【目标岗位】${input.targetRole}`,
  ];
  if (input.targetCompany?.trim()) {
    lines.push(`【目标公司】${input.targetCompany.trim()}`);
  }
  if (input.targetIndustry?.trim()) {
    lines.push(`【目标行业】${input.targetIndustry.trim()}`);
  }
  return lines.join("\n");
}
