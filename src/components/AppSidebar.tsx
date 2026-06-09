import { Inbox, ShieldCheck, FileSearch, Info, Sparkles } from "lucide-react";

interface AppSidebarProps {
  view: "inbox" | "scan" | "about";
  onChange: (view: "inbox" | "scan" | "about") => void;
}

const items = [
  { id: "inbox" as const, label: "History inbox", icon: Inbox },
  { id: "scan" as const, label: "Scan an email", icon: FileSearch },
  { id: "about" as const, label: "About", icon: Info },
];

export function AppSidebar({ view, onChange }: AppSidebarProps) {
  return (
    <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-5">
      <div className="flex items-center gap-3 px-2 py-2">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground shadow-[0_8px_24px_-8px_var(--primary)]"
          style={{ background: "var(--gradient-primary)" }}
        >
          <ShieldCheck className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-base font-bold tracking-tight leading-none">LegitMail</p>
          <p className="text-[11px] text-muted-foreground mt-1 tracking-wide uppercase">Trust your inbox</p>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
          Navigation
        </p>
        {items.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={
                "group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all relative " +
                (active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground")
              }
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full"
                  style={{ background: "var(--gradient-primary)" }}
                />
              )}
              <Icon
                className={"h-4 w-4 transition-colors " + (active ? "text-primary" : "")}
                strokeWidth={active ? 2.5 : 2}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div
        className="mt-auto rounded-2xl border border-border/60 p-4 text-xs relative overflow-hidden"
        style={{ background: "var(--gradient-surface)" }}
      >
        <div
          className="absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-20 blur-2xl"
          style={{ background: "var(--gradient-primary)" }}
        />
        <div className="flex items-center gap-2 mb-2 relative">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <p className="font-semibold text-foreground text-[11px] uppercase tracking-wider">Safety tip</p>
        </div>
        <p className="text-muted-foreground leading-relaxed relative">
          Real employers will never ask for a fee, gift card, or bank details before you start.
        </p>
      </div>
    </aside>
  );
}
