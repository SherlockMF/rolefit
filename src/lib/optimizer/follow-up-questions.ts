import type { DiagnoseResponse } from "@/lib/types/diagnose";

export interface FollowUpField {
  id: string;
  label: string;
  bulletId?: string;
  group: string;
}

export function buildFollowUpFields(
  diagnose: DiagnoseResponse,
): FollowUpField[] {
  const fields: FollowUpField[] = [];

  diagnose.rewriteSuggestions.forEach((bullet, bi) => {
    bullet.followUpQuestions.forEach((q, qi) => {
      fields.push({
        id: `${bullet.id}-q${qi}`,
        label: q,
        bulletId: bullet.id,
        group: `经历 ${bi + 1}：${bullet.original.slice(0, 40)}…`,
      });
    });
  });

  diagnose.followUpQuestionsGlobal.forEach((q, i) => {
    fields.push({
      id: `global-q${i}`,
      label: q,
      group: "全局补充",
    });
  });

  return fields;
}
