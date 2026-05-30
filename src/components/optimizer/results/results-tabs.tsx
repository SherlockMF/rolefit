"use client";

import { useCallback, useState } from "react";
import type { DiagnoseResponse } from "@/lib/types/diagnose";
import type { RefineResponse } from "@/lib/types/refine";
import type { OptimizeResumeRequest } from "@/lib/types/resume-optimization";
import type { HistoryExtras } from "@/lib/storage/helpers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DiagnosisReportPanel } from "./diagnosis-report-panel";
import { JdMatchPanel } from "./jd-match-panel";
import { AtsChecklistPanel } from "./ats-checklist-panel";
import { BulletOptimizePanel } from "./bullet-optimize-panel";
import { InterviewPrepPanel } from "./interview-prep-panel";
import { ResumeVersionsPanel } from "./resume-versions-panel";
import { OutreachPanel } from "./outreach-panel";
import { EnglishResumePanel } from "./english-resume-panel";
import { PortfolioPanel } from "./portfolio-panel";
import { DownloadButton } from "@/components/optimizer/download-button";

interface ResultsTabsProps {
  diagnose: DiagnoseResponse;
  refine: RefineResponse | null;
  humanResume: string;
  atsResume: string;
  onHumanChange: (v: string) => void;
  onAtsChange: (v: string) => void;
  formData: OptimizeResumeRequest;
  followUpAnswers?: Record<string, string>;
  extras?: HistoryExtras;
  onExtrasUpdate: (patch: Partial<HistoryExtras>) => void;
  /** 未完成终稿时仅展示诊断相关 Tab */
  diagnoseOnly?: boolean;
}

export function ResultsTabs({
  diagnose,
  refine,
  humanResume,
  atsResume,
  onHumanChange,
  onAtsChange,
  formData,
  followUpAnswers,
  extras,
  onExtrasUpdate,
  diagnoseOnly = false,
}: ResultsTabsProps) {
  const [extrasLoading, setExtrasLoading] = useState<string | null>(null);

  const acquireExtras = useCallback(
    (key: string) => {
      if (extrasLoading && extrasLoading !== key) return false;
      setExtrasLoading(key);
      return true;
    },
    [extrasLoading],
  );

  const releaseExtras = useCallback(() => setExtrasLoading(null), []);

  const downloadContent = humanResume || atsResume;
  const resumeSummary = humanResume.slice(0, 500);
  const extrasBlocked = extrasLoading !== null;

  const exportMeta = {
    targetRole: formData.targetRole,
    targetCompany: formData.targetCompany,
    targetIndustry: formData.targetIndustry,
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="diagnosis">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="diagnosis">诊断报告</TabsTrigger>
          <TabsTrigger value="jd">JD 匹配</TabsTrigger>
          <TabsTrigger value="ats">ATS 检测</TabsTrigger>
          <TabsTrigger value="bullets">逐条优化</TabsTrigger>
          {!diagnoseOnly && (
            <>
              <TabsTrigger value="interview" disabled={!refine}>
                面试追问
              </TabsTrigger>
              <TabsTrigger value="resume" disabled={!refine}>
                优化简历
              </TabsTrigger>
              <TabsTrigger value="outreach" disabled={!refine}>
                投递辅助
              </TabsTrigger>
              <TabsTrigger value="english" disabled={!refine}>
                英文 & LinkedIn
              </TabsTrigger>
              <TabsTrigger value="portfolio" disabled={!refine}>
                作品集
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="diagnosis" className="mt-6">
          <DiagnosisReportPanel data={diagnose} />
        </TabsContent>
        <TabsContent value="jd" className="mt-6">
          <JdMatchPanel data={diagnose} />
        </TabsContent>
        <TabsContent value="ats" className="mt-6">
          <AtsChecklistPanel data={diagnose} />
        </TabsContent>
        <TabsContent value="bullets" className="mt-6">
          <BulletOptimizePanel diagnose={diagnose} refine={refine} />
        </TabsContent>
        {!diagnoseOnly && (
          <>
            <TabsContent value="interview" className="mt-6">
              <InterviewPrepPanel refine={refine} />
            </TabsContent>
            <TabsContent value="resume" className="mt-6 space-y-6">
              <ResumeVersionsPanel
                humanVersion={humanResume}
                atsVersion={atsResume}
                onHumanChange={onHumanChange}
                onAtsChange={onAtsChange}
              />
              {downloadContent && (
                <DownloadButton
                  content={downloadContent}
                  atsContent={atsResume}
                  meta={exportMeta}
                />
              )}
            </TabsContent>
            <TabsContent value="outreach" className="mt-6">
              <OutreachPanel
                formData={formData}
                resumeSummary={resumeSummary}
                cached={extras?.outreach}
                onCached={(data) => onExtrasUpdate({ outreach: data })}
                extrasBlocked={extrasBlocked && extrasLoading !== "outreach"}
                onAcquire={() => acquireExtras("outreach")}
                onRelease={releaseExtras}
              />
            </TabsContent>
            <TabsContent value="english" className="mt-6">
              <EnglishResumePanel
                optimizedResumeHuman={humanResume}
                targetRole={formData.targetRole}
                targetJobDescription={formData.targetJobDescription}
                targetCompany={formData.targetCompany}
                cached={extras?.english}
                onCached={(data) => onExtrasUpdate({ english: data })}
                extrasBlocked={extrasBlocked && extrasLoading !== "english"}
                onAcquire={() => acquireExtras("english")}
                onRelease={releaseExtras}
              />
            </TabsContent>
            <TabsContent value="portfolio" className="mt-6">
              <PortfolioPanel
                originalResumeText={formData.originalResumeText}
                targetRole={formData.targetRole}
                diagnose={diagnose}
                followUpAnswers={followUpAnswers}
                cached={extras?.portfolio}
                onCached={(data) => onExtrasUpdate({ portfolio: data })}
                extrasBlocked={extrasBlocked && extrasLoading !== "portfolio"}
                onAcquire={() => acquireExtras("portfolio")}
                onRelease={releaseExtras}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
