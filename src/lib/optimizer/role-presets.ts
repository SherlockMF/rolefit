export interface RolePreset {
  id: string;
  label: string;
  currentRole: string;
  targetRole: string;
  sampleJd: string;
}

export const ROLE_PRESETS: RolePreset[] = [
  {
    id: "planner-pm",
    label: "城市规划师 → AI 产品经理",
    currentRole: "城市规划师",
    targetRole: "AI产品经理",
    sampleJd: `岗位：AI 产品经理
1. 负责 AI 产品需求分析、规划与迭代
2. 协同算法、研发推进落地
3. 熟悉用户研究、数据分析
4. 对 LLM、AIGC 有了解者优先`,
  },
  {
    id: "ops-pm",
    label: "运营 → 产品经理",
    currentRole: "运营",
    targetRole: "产品经理",
    sampleJd: `岗位：产品经理
1. 负责 B 端/平台型产品规划与迭代
2. 数据驱动决策，撰写 PRD
3. 跨部门推进项目落地`,
  },
  {
    id: "design-ux",
    label: "设计师 → UX 设计师",
    currentRole: "设计师",
    targetRole: "UX设计师",
    sampleJd: `岗位：UX 设计师
1. 用户研究与体验设计
2. 原型与可用性测试
3. 与设计、研发紧密协作`,
  },
];
