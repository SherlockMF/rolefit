import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-muted text-xs font-semibold">
            转
          </span>
          <span className="text-foreground">转行简历 AI</span>
          <span className="hidden text-[10px] text-muted-foreground sm:inline">
            v0.4
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <ButtonLink variant="ghost" size="sm" render={<Link href="/" />}>
            首页
          </ButtonLink>
          <ButtonLink variant="ghost" size="sm" render={<Link href="/versions" />}>
            岗位版本
          </ButtonLink>
          <ButtonLink variant="ghost" size="sm" render={<Link href="/applications" />}>
            投递看板
          </ButtonLink>
          <ButtonLink variant="ghost" size="sm" render={<Link href="/changelog" />}>
            更新说明
          </ButtonLink>
          <ButtonLink size="sm" render={<Link href="/optimizer" />}>
            开始优化
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
