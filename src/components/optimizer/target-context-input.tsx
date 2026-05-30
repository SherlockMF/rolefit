"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CURRENT_ROLE_PRESETS = ["城市规划师", "产品经理", "运营", "设计师"] as const;

interface TargetContextInputProps {
  currentRole: string;
  targetRole: string;
  targetCompany: string;
  targetIndustry: string;
  onCurrentRoleChange: (v: string) => void;
  onTargetRoleChange: (v: string) => void;
  onTargetCompanyChange: (v: string) => void;
  onTargetIndustryChange: (v: string) => void;
  disabled?: boolean;
}

export function TargetContextInput(props: TargetContextInputProps) {
  const { disabled } = props;
  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">转行与投递目标</CardTitle>
        <CardDescription>
          填写当前身份与目标岗位，AI 会按你的转行路径做诊断与话术
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-role">当前身份 / 岗位</Label>
          <Input
            id="current-role"
            placeholder="如：城市规划师"
            value={props.currentRole}
            onChange={(e) => props.onCurrentRoleChange(e.target.value)}
            disabled={disabled}
          />
          <div className="flex flex-wrap gap-1.5">
            {CURRENT_ROLE_PRESETS.map((preset) => (
              <Badge
                key={preset}
                variant={props.currentRole === preset ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => !disabled && props.onCurrentRoleChange(preset)}
              >
                {preset}
              </Badge>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            id="target-role"
            label="目标岗位"
            placeholder="AI 产品经理"
            value={props.targetRole}
            onChange={props.onTargetRoleChange}
            disabled={disabled}
          />
          <Field
            id="target-company"
            label="目标公司（选填）"
            placeholder="如：字节跳动"
            value={props.targetCompany}
            onChange={props.onTargetCompanyChange}
            disabled={disabled}
          />
          <Field
            id="target-industry"
            label="目标行业（选填）"
            placeholder="如：互联网 / 智慧城市"
            value={props.targetIndustry}
            onChange={props.onTargetIndustryChange}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
