import { cn } from "@/lib/cn";

export function SectionHeading({
  kicker,
  title,
  sub,
  align = "left",
  id,
}: {
  kicker?: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
  id?: string;
}) {
  // Editorial default: left-aligned over centered symmetry.
  // Kicker is sentence case with an accent rule (not all-caps shouting).
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      {kicker && (
        <p className={cn("kicker", align === "center" && "justify-center")}>{kicker}</p>
      )}
      <h2 id={id} className="mt-2 text-[1.7rem] font-bold leading-[1.12] sm:text-4xl">
        {title}
      </h2>
      {sub && (
        <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          {sub}
        </p>
      )}
    </div>
  );
}
