import { cn } from "@/lib/utils";

/**
 * Default paint is Unicode Coptic. Optional manuscript mode
 * (`html[data-coptic-font="athanasius"]`) shows `mapped` keystrokes through
 * Athanasius Plain. Unicode stays in the tree for copy and AT.
 */
export function CopticPaint({
  unicode,
  mapped,
  className,
}: {
  unicode: string;
  mapped?: string | null;
  className?: string;
}) {
  const key = mapped && mapped.length > 0 ? mapped : null;

  return (
    <span dir="ltr" className="coptic-paint">
      <span translate="no" className={cn("coptic-uni font-coptic", className)}>
        {unicode}
      </span>
      {key ? (
        <span aria-hidden="true" className={cn("coptic-key", className)}>
          {key}
        </span>
      ) : null}
    </span>
  );
}
