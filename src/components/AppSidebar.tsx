import { ScrollText, ShieldCheck, FeatherIcon, BookOpen } from "lucide-react";

interface AppSidebarProps {
  view: "inbox" | "scan" | "about";
  onChange: (view: "inbox" | "scan" | "about") => void;
}

const items = [
  { id: "inbox" as const, label: "History inbox", icon: ScrollText },
  { id: "scan" as const, label: "Scan an email", icon: FeatherIcon },
  { id: "about" as const, label: "About", icon: BookOpen },
];

export function AppSidebar({ view, onChange }: AppSidebarProps) {
  return (
    <aside
      className="hidden md:flex w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-6 relative"
      style={{ backgroundImage: "var(--parchment-texture)" }}
    >
      {/* Ornamental top rule */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[var(--bronze)]/40 to-transparent" />

      <div className="flex items-center gap-3 px-1 py-2">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-md text-primary-foreground shadow-md border border-[var(--bronze)]/40"
          style={{ background: "var(--gradient-primary)" }}
        >
          <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div>
          <p className="serif-display text-2xl leading-none text-foreground">LegitMail</p>
          <p className="small-caps text-[10px] text-muted-foreground mt-1.5">Veritas in epistulis</p>
        </div>
      </div>

      {/* Divider with diamond ornament */}
      <div className="flex items-center gap-3 my-7">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[var(--bronze)] text-[10px]">◆</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <nav className="space-y-1.5">
        <p className="px-3 mb-3 small-caps text-[10px] text-muted-foreground/80">Navigation</p>
        {items.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={
                "group w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all relative border " +
                (active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-[var(--bronze)]/30 shadow-sm"
                  : "border-transparent text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:border-border")
              }
            >
              <Icon
                className={"h-4 w-4 " + (active ? "text-[var(--bronze)]" : "")}
                strokeWidth={1.75}
              />
              <span className="tracking-wide">{item.label}</span>
              {active && <span className="ml-auto text-[var(--bronze)] text-[10px]">◆</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer mark */}
      <div className="mt-auto pt-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[var(--bronze)] text-[10px]">✦</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <p className="text-center small-caps text-[10px] text-muted-foreground">
          Anno · MMXXVI
        </p>
      </div>
    </aside>
  );
}
