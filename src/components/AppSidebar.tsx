import { Inbox, ShieldCheck, FileSearch, Info } from "lucide-react";

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
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-sidebar p-4">
      <div className="flex items-center gap-2 px-2 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">LegitMail</p>
        </div>
      </div>

      <nav className="mt-6 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={
                "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors " +
                (active
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border bg-muted/50 p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Student safety tip</p>
        <p>Real employers will never ask for a fee, gift card, or bank details before you start.</p>
      </div>
    </aside>
  );
}
