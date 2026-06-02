import { Handle, NodeToolbar, Position } from "@xyflow/react";
import { useState } from "react";

type CommitNodeData = {
  label: string;
  branch?: string;
  isHead?: boolean;
  isMerge?: boolean;
  isGhost?: boolean;
  isWip?: boolean;
  wipMessage?: string;
  message?: string;
  hash?: string;
  showBranchBadge?: boolean;
  showCheckout?: boolean;
  showReset?: boolean;
  [key: string]: unknown;
};

export const CommitGraphNode = ({ data }: { data: CommitNodeData }) => {
  const [hovered, setHovered] = useState(false);

  const branchColor = data.isMerge
    ? "var(--ok)"
    : data.branch === "main"
      ? "var(--main)"
      : data.branch === "feature"
        ? "var(--feat)"
        : "var(--ink)";
  const borderStyle = data.isGhost ? "dashed" : "solid";
  const bg = data.isGhost
    ? hovered && data.isWip
      ? `color-mix(in srgb, ${branchColor} 8%, var(--panel))`
      : "transparent"
    : data.isMerge
      ? "color-mix(in srgb, var(--ok) 12%, var(--panel))"
      : "var(--panel)";

  return (
    <div
      className="commit-node-body grid place-items-center select-none font-mono font-bold relative"
      style={{
        width: 46,
        height: 46,
        borderRadius: "50%",
        border: `2.2px ${borderStyle} ${branchColor}`,
        background: bg,
        fontSize: data.isMerge ? 18 : 12,
        color: branchColor,
        boxShadow: data.isHead ? `0 0 0 3px var(--head)` : undefined,
        opacity: data.isGhost ? (hovered && data.isWip ? 0.85 : 0.5) : 1,
        cursor:
          data.showCheckout || data.showReset || data.isWip
            ? "pointer"
            : undefined,
        transition: "opacity 0.15s, background 0.15s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={data.isWip ? "Click to commit (git commit)" : undefined}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      {data.label}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      {data.isWip && (
        <div
          className="absolute whitespace-nowrap font-mono select-none pointer-events-none"
          style={{
            bottom: -18,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 9,
            color: branchColor,
            letterSpacing: "0.04em",
            opacity: hovered ? 1 : 0.55,
            transition: "opacity 0.15s",
          }}
        >
          {hovered
            ? "click to commit"
            : data.wipMessage
              ? data.wipMessage.length > 18
                ? data.wipMessage.slice(0, 16) + "…"
                : data.wipMessage
              : "click to commit"}
        </div>
      )}
      {/* Commit detail popup — rendered via NodeToolbar portal to escape node stacking context */}
      {!data.isGhost && data.message && (
        <NodeToolbar isVisible={hovered} position={Position.Right} offset={14}>
          <div
            className="pointer-events-none"
            style={{
              width: 180,
              background: "var(--panel)",
              border: `1.5px solid ${branchColor}`,
              borderRadius: "12px 4px 12px 4px/4px 12px 4px 12px",
              padding: "6px 10px",
              boxShadow: "0 4px 16px color-mix(in srgb, var(--ink) 12%, transparent)",
            }}
          >
            <div className="font-mono text-[10px] mb-1" style={{ color: "var(--muted)" }}>
              {data.hash ? (data.hash as string).slice(0, 7) : ""} · {data.branch}
            </div>
            <div className="font-mono text-[11px] leading-snug" style={{ color: "var(--ink)", wordBreak: "break-word" }}>
              {data.message as string}
            </div>
          </div>
        </NodeToolbar>
      )}
      {data.isMerge && (
        <div
          className="absolute whitespace-nowrap font-mono select-none pointer-events-none"
          style={{
            bottom: -18,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 9,
            color: "var(--ok)",
            letterSpacing: "0.05em",
          }}
        >
          merge
        </div>
      )}
      {data.showBranchBadge && (
        <div
          data-branch-badge="true"
          className="absolute -top-1 -right-1 text-[8px] leading-none font-bold rounded-full grid place-items-center nodrag"
          style={{
            width: 14,
            height: 14,
            background: "var(--feat)",
            color: "var(--panel)",
            cursor: "pointer",
          }}
        >
          ⎇
        </div>
      )}
      {data.showCheckout && (
        <div
          data-checkout-commit="true"
          title="Checkout this commit"
          className="absolute -bottom-1 -right-1 text-[8px] leading-none font-bold rounded-full grid place-items-center nodrag"
          style={{
            width: 14,
            height: 14,
            background: hovered
              ? "var(--muted)"
              : "color-mix(in srgb, var(--muted) 55%, transparent)",
            color: "var(--panel)",
            cursor: "pointer",
            transition: "background 0.15s",
          }}
        >
          ↩
        </div>
      )}
      {data.showReset && (
        <div
          data-reset-commit="true"
          title="git reset --hard to here"
          className="absolute -bottom-1 -right-1 text-[8px] leading-none font-bold rounded-full grid place-items-center nodrag"
          style={{
            width: 14,
            height: 14,
            background: hovered
              ? "var(--head)"
              : "color-mix(in srgb, var(--head) 50%, transparent)",
            color: "var(--panel)",
            cursor: "pointer",
            transition: "background 0.15s",
          }}
        >
          ↺
        </div>
      )}
    </div>
  );
};
