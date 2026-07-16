import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export function GlossaryTooltip({
  term,
  def,
  children,
}: {
  term: string;
  def: string;
  children: React.ReactNode;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="cursor-help underline decoration-primary/50 decoration-dashed underline-offset-4 transition-colors hover:text-primary">
          {children}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-display text-sm font-semibold text-foreground">{term}</h4>
          <p className="text-sm text-muted-foreground">{def}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
