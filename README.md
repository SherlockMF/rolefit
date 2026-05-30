# 转行简历 AI

面向转行求职者的中文 AI 简历匹配与面试转化工具。v0.4 起支持任意转行起点（默认场景示例：**城市规划师 → AI 产品经理**）。

**[更新日志（CHANGELOG）](./CHANGELOG.md)** · 当前版本 **v0.4**

## 产品定位

**不是把简历写得更漂亮，而是提高拿面试的概率。**

- 岗位匹配诊断（多维度评分 + JD 关键词 + 能力缺口）
- **自定义当前 / 目标角色**，内置转行模板可一键填充
- 目标公司 / 行业语境输入
- 量化追问向导（补充真实数据后再生成终稿）
- ATS 兼容性清单检测
- 逐条经历优化（问题 / 追问 / 面试风险 / 修改理由）
- 面试追问预测与回答提纲
- 人工阅读版 + ATS 投递版双简历
- **多岗位版本管理**与**投递进度看板**（看板可拖拽改状态）
- Boss / LinkedIn / 邮件投递话术、英文简历、作品集 Markdown
- Word / 打印预览 PDF 导出
- 浏览器本地历史记录（侧栏 5 条，可置顶 / 备份 / 导入）

## 技术栈

- Next.js App Router、TypeScript、Tailwind CSS、shadcn/ui
- React Hook Form + Zod
- 可替换 LLM：`src/lib/ai/client.ts`
- 本地存储：`src/lib/storage/`（history / versions / applications，未来可替换为云端实现）

## 快速开始

```bash
npm install
cp .env.example .env.local
npm run dev
```

启动时会从 **3000** 起自动找空端口（至 3010），并在终端打印最终访问地址，避免 3000/3001/3002 被占用时手动改端口。

| 命令 | 说明 |
|------|------|
| `npm run dev` | 首选 3000，占用则自动递增 |
| `npm run dev:3002` | 固定从 3002 起找空端口 |
| `npm run dev:kill` | 结束 3000–3010 上的残留 Node/Next 进程（Windows 可用） |

- 首页：http://localhost:3000（以终端打印为准）
- 优化器：http://localhost:3000/optimizer
- 岗位版本：http://localhost:3000/versions
- 投递看板：http://localhost:3000/applications

### 智谱 GLM-5.1

```env
LLM_PROVIDER=compatible
LLM_API_KEY=你的智谱API密钥
LLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
LLM_MODEL=glm-5.1
```

未配置 Key 时使用 mock 模式，可完整走通诊断 → 追问 → 终稿流程。

## 使用流程

1. 粘贴或上传简历 + 目标 JD，填写目标岗位 / 公司 / 行业（选填）
2. **开始匹配诊断** → 查看诊断 / JD 匹配 / ATS 等 Tab
3. 回答 **量化追问**（可跳过生成保守版）
4. 生成终稿 → 编辑双版本简历、导出 Word/PDF、按需打开投递辅助 / 英文 / 作品集 Tab
5. **加入投递看板** 或在 **岗位版本** 页对比不同 JD 的终稿

## API

| 路由 | 说明 |
|------|------|
| `POST /api/diagnose-resume` | Step1 诊断 |
| `POST /api/refine-resume` | Step2 终稿（含 `diagnose` + `followUpAnswers`） |
| `POST /api/generate-outreach` | Boss / LinkedIn / 邮件话术（lazy） |
| `POST /api/translate-resume` | 英文简历 + LinkedIn（lazy） |
| `POST /api/generate-portfolio` | 作品集 Markdown（lazy） |
| `POST /api/optimize-resume` | 已废弃，内部转发 diagnose |

## 原则

- 不编造经历，只做转译与结构化
- 对过度包装给出面试风险提示
- 用户需确认所有数据真实性后再投递
