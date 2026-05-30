"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Trash2 } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  listApplications,
  moveApplication,
  removeApplication,
  updateApplication,
  STATUS_LABELS,
  STATUS_ORDER,
  type Application,
  type ApplicationStatus,
} from "@/lib/storage/applications";

interface ApplicationKanbanProps {
  refreshKey?: number;
  onChanged?: () => void;
}

export function ApplicationKanban({ refreshKey = 0, onChanged }: ApplicationKanbanProps) {
  const [apps, setApps] = useState<Application[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileStatus, setMobileStatus] = useState<ApplicationStatus>("wishlist");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApps(listApplications());
  }, [refreshKey]);

  const refresh = () => {
    setApps(listApplications());
    onChanged?.();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const appId = String(active.id);
    const newStatus = String(over.id) as ApplicationStatus;
    if (STATUS_ORDER.includes(newStatus)) {
      moveApplication(appId, newStatus);
      refresh();
    }
  };

  const activeApp = activeId ? apps.find((a) => a.id === activeId) : null;

  return (
    <>
      <div className="hidden lg:block">
        <DndContext
          sensors={sensors}
          onDragStart={(e) => setActiveId(String(e.active.id))}
          onDragEnd={handleDragEnd}
        >
          <div className="grid gap-4 lg:grid-cols-5">
            {STATUS_ORDER.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                label={STATUS_LABELS[status]}
                items={apps.filter((a) => a.status === status)}
                expandedId={expandedId}
                onExpand={setExpandedId}
                onRefresh={refresh}
              />
            ))}
          </div>
          <DragOverlay>
            {activeApp ? (
              <Card className="border-border shadow-md opacity-90">
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-sm">{activeApp.company}</CardTitle>
                </CardHeader>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <div className="lg:hidden">
        <Tabs
          value={mobileStatus}
          onValueChange={(v) => setMobileStatus(v as ApplicationStatus)}
        >
          <TabsList className="flex h-auto w-full flex-wrap">
            {STATUS_ORDER.map((s) => (
              <TabsTrigger key={s} value={s} className="text-xs">
                {STATUS_LABELS[s]}
              </TabsTrigger>
            ))}
          </TabsList>
          {STATUS_ORDER.map((status) => (
            <TabsContent key={status} value={status} className="mt-4 space-y-2">
              {apps
                .filter((a) => a.status === status)
                .map((app) => (
                  <AppCard
                    key={app.id}
                    app={app}
                    expanded={expandedId === app.id}
                    onToggle={() =>
                      setExpandedId(expandedId === app.id ? null : app.id)
                    }
                    onRefresh={refresh}
                  />
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
}

function KanbanColumn({
  status,
  label,
  items,
  expandedId,
  onExpand,
  onRefresh,
}: {
  status: ApplicationStatus;
  label: string;
  items: Application[];
  expandedId: string | null;
  onExpand: (id: string | null) => void;
  onRefresh: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className="min-w-0">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium">{label}</h3>
        <span className="text-xs text-muted-foreground">{items.length}</span>
      </div>
      <div
        className={`min-h-[120px] space-y-2 rounded-lg border border-dashed p-2 transition-colors ${
          isOver ? "border-primary/50 bg-primary/5" : "border-border/60"
        }`}
      >
        {items.map((app) => (
          <DraggableAppCard
            key={app.id}
            app={app}
            expanded={expandedId === app.id}
            onToggle={() => onExpand(expandedId === app.id ? null : app.id)}
            onRefresh={onRefresh}
          />
        ))}
        {items.length === 0 && (
          <p className="py-6 text-center text-xs text-muted-foreground">拖入卡片</p>
        )}
      </div>
    </div>
  );
}

function DraggableAppCard(props: {
  app: Application;
  expanded: boolean;
  onToggle: () => void;
  onRefresh: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: props.app.id });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-40" : undefined}
      {...listeners}
      {...attributes}
    >
      <AppCard {...props} />
    </div>
  );
}

function AppCard({
  app,
  expanded,
  onToggle,
  onRefresh,
}: {
  app: Application;
  expanded: boolean;
  onToggle: () => void;
  onRefresh: () => void;
}) {
  const handleStatusChange = (status: ApplicationStatus) => {
    moveApplication(app.id, status);
    onRefresh();
  };

  const handleNotesBlur = (notes: string) => {
    updateApplication(app.id, { notes });
    onRefresh();
  };

  const handleRemove = () => {
    removeApplication(app.id);
    onRefresh();
  };

  return (
    <Card
      className="cursor-pointer border-border/80 shadow-none"
      onClick={onToggle}
    >
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-sm font-medium leading-snug">{app.company}</CardTitle>
        <CardDescription className="text-xs">{app.role}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-3 pt-1" onClick={(e) => e.stopPropagation()}>
        {app.matchScore != null && (
          <p className="text-xs text-muted-foreground">匹配分 {app.matchScore}</p>
        )}
        <Select value={app.status} onValueChange={(v) => handleStatusChange(v as ApplicationStatus)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_ORDER.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {app.historyId && (
          <ButtonLink
            variant="outline"
            size="sm"
            className="h-7 w-full text-xs"
            render={<Link href={`/optimizer?historyId=${app.historyId}`} />}
          >
            <ExternalLink className="size-3" />
            打开优化记录
          </ButtonLink>
        )}
        {expanded && (
          <div className="space-y-2 pt-1">
            <Textarea
              placeholder="备注：HR 反馈、下一轮时间…"
              defaultValue={app.notes ?? ""}
              className="min-h-[72px] text-xs"
              onBlur={(e) => handleNotesBlur(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-destructive"
              onClick={handleRemove}
            >
              <Trash2 className="size-3" />
              删除
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
