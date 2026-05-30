import type { OutreachRequest } from "@/lib/types/extras";
import type { PortfolioRequest } from "@/lib/types/extras";
import type { TranslateRequest } from "@/lib/types/extras";
import { formatTargetContext } from "@/lib/ai/context";

const CORE = `不编造经历。话术真实、简洁、可复制。输出合法 JSON，无 markdown 包裹。`;

export function buildOutreachPrompt(input: OutreachRequest) {
  return {
    system: `你是转行求职投递顾问。${CORE}

JSON schema:
{
  "bossGreeting": string,
  "linkedinMessage": string,
  "emailSubject": string,
  "emailBody": string,
  "tips": string[]
}`,
    user: `${formatTargetContext(input)}

【JD 摘要】
${input.targetJobDescription.slice(0, 1500)}

【简历摘要】
${input.resumeSummary}

【生成平台】${input.platform}

请生成适合 Boss 直聘打招呼、LinkedIn 私信、邮件正文的话术（各 80-200 字），并给 2-3 条平台注意事项。`,
  };
}

export function buildTranslatePrompt(input: TranslateRequest) {
  return {
    system: `你是英文简历顾问。${CORE}

将中文简历本地化为美式 English resume：
- 避免 "Responsible for"，用 accomplishment 句式
- 保留可验证事实，不夸大

JSON schema:
{
  "englishResume": string,
  "linkedinHeadline": string,
  "linkedinAbout": string,
  "actionVerbsUsed": string[]
}`,
    user: `【目标岗位】${input.targetRole}
${input.targetCompany ? `【目标公司】${input.targetCompany}` : ""}

【JD】
${input.targetJobDescription.slice(0, 1200)}

【中文优化简历】
${input.optimizedResumeHuman}

请返回 JSON。`,
  };
}

export function buildPortfolioPrompt(input: PortfolioRequest) {
  return {
    system: `你是项目作品集顾问。${CORE}

基于真实经历写 2-3 个项目 case（Markdown），每项目含：背景、问题、行动、结果、个人贡献。
不虚构项目名与数据。

JSON schema:
{
  "portfolioMarkdown": string,
  "projectTitles": string[]
}`,
    user: `【目标岗位】${input.targetRole}

【原始简历】
${input.originalResumeText.slice(0, 2000)}

【重点经历片段】
${JSON.stringify(input.rewriteSuggestions.slice(0, 3))}

【用户补充数据】
${JSON.stringify(input.followUpAnswers ?? {})}

请返回 JSON。`,
  };
}
