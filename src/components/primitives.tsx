import type { CSSProperties, ReactNode } from "react";
import { useInView } from "../lib/hooks";
import type { Media } from "../data/media";

export function Monogram({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 92 104"
      fill="none"
      stroke="currentColor"
      strokeWidth="11"
      strokeLinejoin="miter"
      strokeLinecap="butt"
      aria-hidden="true"
    >
      {/* A */}
      <path d="M6 86 L28 14 L50 86" />
      {/* Y, with the descender Ahmed draws into his own mark */}
      <path d="M56 14 L76 46" />
      <path d="M78 14 L78 68 L59 98" />
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
