import type { CSSProperties, ReactNode } from "react";
import { useInView } from "../lib/hooks";
import type { Media } from "../data/media";

/* Ahmed's own AY mark, traced off the source artwork — one continuous
   self-intersecting outline, not two letterforms, which is why it is a single
   filled path rather than the stroked A + Y it reads as. Identical geometry
   ships in public/favicon.svg and the PNG icons; edit all four together. */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 423 385" fill="currentColor" aria-hidden="true">
      <path d="M163 0L172 11L315 261L292 181L347 85L350 82L423 82L249 385L134 385L169 321L212 320L243 264L129 67L127 69L143 165L78 279L74 284L0 284Z" />
    </svg>
  );
}

/** Wipe-in wrapper — the plot head sweeping across a sheet. */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  mode = "reveal",
  style,
}: {
  children: ReactNode;
  as?: "div" | "section" | "figure" | "li" | "header";
  className?: string;
  delay?: number;
  mode?: "reveal" | "rise";
  style?: CSSProperties;
}) {
  const { ref, shown } = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      className={`${mode} ${className}`.trim()}
      data-shown={shown}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined, ...style }}
    >
      {children}
    </Tag>
  );
}

export function Rule({ soft = false }: { soft?: boolean }) {
  return <div className={`scale-rule${soft ? " scale-rule--soft" : ""}`} aria-hidden="true" />;
}

export function Shot({
  image,
  alt,
  ratio,
  marks = false,
  zoom = true,
  eager = false,
  className = "",
}: {
  image: Media;
  alt: string;
  ratio?: string;
  marks?: boolean;
  zoom?: boolean;
  eager?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`frame${zoom ? " frame--zoom" : ""}${marks ? " marks" : ""} ${className}`.trim()}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <img
        src={image.src}
        width={image.w}
        height={image.h}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        {...(eager ? { fetchPriority: "high" as const } : {})}
      />
    </span>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
