import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeTypes,
  type OnNodeDrag,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { GitState, Mode } from '../types';
import { getNextBranchName } from '../gitState';
import { CommitGraphNode } from './CommitGraphNode';
import { BranchLabelNode } from './BranchLabelNode';
import { AddCommitNode } from './AddCommitNode';
import { DragConfirmModal } from './modal/DragConfirmModal';

type GitCanvasProps = {
  gitState: GitState;
  mode: Mode;
  doAddCommit: () => void;
  doStartWip: () => void;
  doCherryPick: (sourceId: string, targetBranch: string) => void;
  doRebase: (branchToRebase: string, ontoBranch: string) => void;
  doMerge: (sourceBranch: string, targetBranch: string) => void;
  doCreateBranch: (commitId: string) => void;
  doCheckout: (target: string) => void;
  doResetHard: (commitId: string) => void;
  doSquash: (branchName: string, count: number, message: string) => void;
  setGhostCommand: (cmd: string, subtitle?: string) => void;
  wip?: string | null;
  highlightNodeIds?: string[];
};

const nodeTypes: NodeTypes = {
  commit: CommitGraphNode,
  branchLabel: BranchLabelNode,
  addCommit: AddCommitNode,
};

type DragTarget =
  | { type: 'cherry-pick'; sourceId: string; targetBranch: string }
  | { type: 'rebase'; branchToRebase: string; ontoBranch: string }
  | { type: 'merge'; sourceBranch: string; targetBranch: string };

type PendingDragOp =
  | { type: 'rebase'; branchToRebase: string; ontoBranch: string }
  | { type: 'merge'; sourceBranch: string; targetBranch: string };

type LayoutNode = {
  id: string;
  x: number;
  y: number;
  branch: string;
};

const computeLayout = (gitState: GitState): Map<string, LayoutNode> => {
  const { commits } = gitState;
  const result = new Map<string, LayoutNode>();

  const children = new Map<string, string[]>();
  const allIds = Object.keys(commits);

  for (const id of allIds) {
    const commit = commits[id];
    if (!commit) continue;
    for (const parentId of commit.parentIds) {
      const existing = children.get(parentId) ?? [];
      existing.push(id);
      children.set(parentId, existing);
    }
  }

  // Kahn's algorithm: ensures all parents are processed before children (handles merge commits)
  const inDegree = new Map<string, number>();
  for (const id of allIds) {
    inDegree.set(id, commits[id]?.parentIds.length ?? 0);
  }
  const queue: string[] = allIds.filter(id => (inDegree.get(id) ?? 0) === 0);
  const topoOrder: string[] = [];

  while (queue.length > 0) {
    const id = queue.shift()!;
    topoOrder.push(id);
    for (const childId of (children.get(id) ?? [])) {
      const newDeg = (inDegree.get(childId) ?? 1) - 1;
      inDegree.set(childId, newDeg);
      if (newDeg === 0) queue.push(childId);
    }
  }

  const depth = new Map<string, number>();
  for (const id of topoOrder) {
    const commit = commits[id];
    if (!commit) continue;
    let maxParentDepth = -1;
    for (const pid of commit.parentIds) {
      maxParentDepth = Math.max(maxParentDepth, depth.get(pid) ?? 0);
    }
    depth.set(id, maxParentDepth + 1);
  }

  const laneMap = new Map<string, number>();
  laneMap.set('main', 0);
  let nextLane = 1;

  for (const id of topoOrder) {
    const commit = commits[id];
    if (!commit) continue;
    const br = commit.branch ?? 'main';
    if (!laneMap.has(br)) {
      laneMap.set(br, nextLane++);
    }
  }

  for (const id of topoOrder) {
    const commit = commits[id];
    if (!commit) continue;
    const br = commit.branch ?? 'main';
    const lane = laneMap.get(br) ?? 0;
    const d = depth.get(id) ?? 0;
    result.set(id, {
      id,
      x: 60 + d * 130,
      y: 60 + lane * 120,
      branch: br,
    });
  }

  return result;
};

export const GitCanvas = ({
  gitState,
  mode,
  doAddCommit,
  doStartWip,
  doCherryPick,
  doRebase,
  doMerge,
  doCreateBranch,
  doCheckout,
  doResetHard,
  doSquash,
  setGhostCommand,
  wip,
  highlightNodeIds,
}: GitCanvasProps) => {
  const { t } = useTranslation();
  const layout = useMemo(() => computeLayout(gitState), [gitState]);

  const isEmpty = Object.keys(gitState.commits).length === 0;
  const EMPTY_POS = { x: 260, y: 180 };

  const headCommitId =
    gitState.branches[gitState.HEAD] !== undefined
      ? (gitState.branches[gitState.HEAD] ?? gitState.HEAD)
      : gitState.HEAD;

  const headLayout = isEmpty ? EMPTY_POS : layout.get(headCommitId);

  const canBranch = mode !== 'module1';
  const canCheckout = mode === 'sandbox' || mode === 'module8' || mode === 'module10';
  const canDrag = mode === 'sandbox' || mode === 'module3' || mode === 'module4' || mode === 'module5' || mode === 'module6';
  const canReset = mode === 'sandbox' || mode === 'module7' || mode === 'module11';
  const canSquash = mode === 'module9';
  const isDetachedHead = gitState.branches[gitState.HEAD] === undefined;

  const headAncestors = useMemo(() => {
    if (!canReset) return new Set<string>();
    const ancestors = new Set<string>();
    const walk = (id: string) => {
      if (ancestors.has(id)) return;
      ancestors.add(id);
      gitState.commits[id]?.parentIds.forEach(walk);
    };
    gitState.commits[headCommitId]?.parentIds.forEach(walk);
    return ancestors;
  }, [canReset, headCommitId, gitState.commits]);

  const nodes: Node[] = useMemo(() => {
    const result: Node[] = [];

    for (const [id, pos] of layout.entries()) {
      const commit = gitState.commits[id];
      if (!commit) continue;
      const isMerge = commit.parentIds.length > 1;
      const isFeatureTip = canSquash && gitState.branches['feature'] === id;
      result.push({
        id,
        type: 'commit',
        position: { x: pos.x, y: pos.y },
        data: {
          label: isMerge ? '⊕' : id.slice(0, 4),
          hash: id,
          message: commit.message,
          branch: pos.branch,
          parentIds: commit.parentIds,
          isHead: id === headCommitId,
          isMerge,
          showBranchBadge: canBranch && id === headCommitId,
          showCheckout: canCheckout && id !== headCommitId && !headAncestors.has(id),
          showReset: canReset && headAncestors.has(id),
          showSquash: isFeatureTip,
          highlighted: highlightNodeIds?.includes(id) ?? false,
        },
        draggable: canDrag,
      });
    }

    for (const [branchName, tipId] of Object.entries(gitState.branches)) {
      const pos = tipId ? layout.get(tipId) : (isEmpty ? EMPTY_POS : undefined);
      if (!pos) continue;
      result.push({
        id: `branch-${branchName}`,
        type: 'branchLabel',
        position: { x: pos.x + 50, y: pos.y - 44 },
        data: { label: branchName, branch: branchName, showCheckout: canCheckout, canDrag, tipHash: tipId, isCurrentHead: gitState.HEAD === branchName, highlighted: highlightNodeIds?.includes(`branch-${branchName}`) ?? false },
        draggable: canDrag,
      });
    }

    if (headLayout) {
      result.push({
        id: 'label-HEAD',
        type: 'branchLabel',
        position: { x: headLayout.x + 50, y: headLayout.y + 44 },
        data: { label: 'HEAD', branch: 'HEAD', isDetached: isDetachedHead, attachedBranch: isDetachedHead ? undefined : gitState.HEAD, canDrag: false, highlighted: highlightNodeIds?.includes('label-HEAD') ?? false },
        draggable: false,
      });
    }

    if (headLayout && !isDetachedHead) {
      if (wip !== null) {
        // State 2: WIP active — show ghost node, clicking commits it
        result.push({
          id: 'ghost-wip',
          type: 'commit',
          position: { x: headLayout.x + 130, y: headLayout.y },
          data: {
            label: 'WIP',
            branch: gitState.commits[headCommitId]?.branch ?? 'main',
            isGhost: true,
            isHead: false,
            isWip: true,
            wipMessage: wip,
          },
          draggable: false,
        });
      } else {
        // State 1: no WIP — show + button, clicking enters WIP state
        result.push({
          id: 'addCommit',
          type: 'addCommit',
          position: { x: headLayout.x + 130, y: headLayout.y + 3 },
          data: {},
          draggable: false,
        });
      }
    }

    if (headLayout && isDetachedHead) {
      result.push({
        id: 'addCommit',
        type: 'addCommit',
        position: { x: headLayout.x, y: headLayout.y - 80 },
        data: { disabled: true },
        draggable: false,
      });
    }

    return result;
  }, [layout, gitState.commits, gitState.branches, headCommitId, headLayout, mode, canBranch, canCheckout, canReset, headAncestors, isDetachedHead, wip, highlightNodeIds]);

  const branchColor = (branch: string) =>
    branch === 'main' ? 'var(--main)' : branch === 'feature' ? 'var(--feat)' : 'var(--ink)';

  const edges: Edge[] = useMemo(() => {
    const result: Edge[] = [];
    for (const [id, commit] of Object.entries(gitState.commits)) {
      const isMerge = commit.parentIds.length > 1;
      commit.parentIds.forEach((parentId, idx) => {
        // For merge commits, secondary parent edge inherits the parent's branch color
        const edgeColor = isMerge && idx > 0
          ? branchColor(layout.get(parentId)?.branch ?? 'main')
          : branchColor(layout.get(id)?.branch ?? 'main');
        result.push({
          id: `e-${parentId}-${id}`,
          source: parentId,
          target: id,
          type: 'smoothstep',
          style: {
            stroke: isMerge ? 'var(--ok)' : edgeColor,
            strokeWidth: isMerge ? 2.2 : 2.2,
            strokeDasharray: isMerge ? '5 3' : undefined,
          },
        });
      });
    }
    if (headCommitId && !isDetachedHead && wip !== null) {
      result.push({
        id: 'e-wip',
        source: headCommitId,
        target: 'ghost-wip',
        type: 'smoothstep',
        style: { stroke: 'var(--ghost)', strokeWidth: 2, strokeDasharray: '4 3' },
      });
    }

    return result;
  }, [gitState.commits, layout, wip, headCommitId, isDetachedHead, mode]);

  const [pendingDragOp, setPendingDragOp] = useState<PendingDragOp | null>(null);
  const [dragPreview, setDragPreview] = useState<DragTarget | null>(null);

  const ancestorSet = useCallback((tipId: string): Set<string> => {
    const visited = new Set<string>();
    const walk = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      gitState.commits[id]?.parentIds.forEach(walk);
    };
    walk(tipId);
    return visited;
  }, [gitState.commits]);

  const ghostElements = useMemo((): { nodes: Node[]; edges: Edge[] } => {
    if (!dragPreview || dragPreview.type === 'cherry-pick') return { nodes: [], edges: [] };

    const ghostNodes: Node[] = [];
    const ghostEdges: Edge[] = [];

    if (dragPreview.type === 'rebase') {
      const { branchToRebase, ontoBranch } = dragPreview;
      const rebaseTip = gitState.branches[branchToRebase];
      const ontoTip = gitState.branches[ontoBranch];
      if (!rebaseTip || !ontoTip) return { nodes: [], edges: [] };

      const ontoAncestors = ancestorSet(ontoTip);
      const movingCommits: string[] = [];
      const walk = (id: string) => {
        if (ontoAncestors.has(id)) return;
        movingCommits.unshift(id);
        const parents = gitState.commits[id]?.parentIds ?? [];
        if (parents[0]) walk(parents[0]);
      };
      walk(rebaseTip);

      const ontoPos = layout.get(ontoTip);
      if (!ontoPos) return { nodes: [], edges: [] };

      movingCommits.forEach((commitId, i) => {
        const ghostId = `ghost-rebase-${commitId}`;
        const commit = gitState.commits[commitId];
        ghostNodes.push({
          id: ghostId,
          type: 'commit',
          position: { x: ontoPos.x + 130 * (i + 1), y: ontoPos.y },
          data: {
            label: commitId.slice(0, 4),
            hash: commitId,
            message: commit?.message,
            branch: ontoBranch,
            isGhost: true,
            isHead: false,
          },
          draggable: false,
          selectable: false,
        });

        const sourceId = i === 0 ? ontoTip : `ghost-rebase-${movingCommits[i - 1]}`;
        ghostEdges.push({
          id: `e-ghost-rebase-${i}`,
          source: sourceId,
          target: ghostId,
          type: 'smoothstep',
          style: { stroke: 'var(--main)', strokeWidth: 1.5, strokeDasharray: '5 4', opacity: 0.4 },
          selectable: false,
        });
      });
    }

    if (dragPreview.type === 'merge') {
      const { sourceBranch, targetBranch } = dragPreview;
      const sourceTip = gitState.branches[sourceBranch];
      const targetTip = gitState.branches[targetBranch];
      if (!sourceTip || !targetTip) return { nodes: [], edges: [] };

      const targetPos = layout.get(targetTip);
      if (!targetPos) return { nodes: [], edges: [] };

      const ghostId = 'ghost-merge-commit';
      ghostNodes.push({
        id: ghostId,
        type: 'commit',
        position: { x: targetPos.x + 130, y: targetPos.y },
        data: {
          label: '⊕',
          branch: targetBranch,
          isGhost: true,
          isHead: false,
          isMerge: true,
        },
        draggable: false,
        selectable: false,
      });

      ghostEdges.push({
        id: 'e-ghost-merge-target',
        source: targetTip,
        target: ghostId,
        type: 'smoothstep',
        style: { stroke: 'var(--ok)', strokeWidth: 1.5, strokeDasharray: '5 4', opacity: 0.4 },
        selectable: false,
      });
      ghostEdges.push({
        id: 'e-ghost-merge-source',
        source: sourceTip,
        target: ghostId,
        type: 'smoothstep',
        style: { stroke: 'var(--ok)', strokeWidth: 1.5, strokeDasharray: '5 4', opacity: 0.4 },
        selectable: false,
      });
    }

    return { nodes: ghostNodes, edges: ghostEdges };
  }, [dragPreview, gitState.branches, gitState.commits, layout, ancestorSet]);

  const SNAP_DISTANCE_PX = 80;
  const MERGE_SNAP_PX = 60;

  const findDragTarget = useCallback(
    (node: { id: string; type?: string; position: { x: number; y: number } }): DragTarget | null => {
      const { x: dragX, y: dragY } = node.position;

      if (node.type === 'commit') {
        for (const [otherId, otherPos] of layout.entries()) {
          if (otherId === node.id) continue;
          const dx = dragX - otherPos.x;
          const dy = dragY - otherPos.y;
          if (Math.sqrt(dx * dx + dy * dy) < SNAP_DISTANCE_PX) {
            const dragBranch = gitState.commits[node.id]?.branch ?? 'main';
            const otherBranch = gitState.commits[otherId]?.branch ?? 'main';
            if (dragBranch !== otherBranch && gitState.branches[otherBranch] === otherId) {
              return { type: 'cherry-pick', sourceId: node.id, targetBranch: otherBranch };
            }
          }
        }
      }

      if (node.type === 'branchLabel' && (mode === 'sandbox' || mode === 'module5' || mode === 'module6')) {
        const branchName = node.id.replace(/^branch-/, '');
        for (const [otherBranch, tipId] of Object.entries(gitState.branches)) {
          if (otherBranch === branchName) continue;
          const tipPos = layout.get(tipId);
          if (!tipPos) continue;
          // Merge: snap to the OTHER branch's label position (offset from commit)
          const labelX = tipPos.x + 50;
          const labelY = tipPos.y - 44;
          const dx = dragX - labelX;
          const dy = dragY - labelY;
          if (Math.sqrt(dx * dx + dy * dy) < MERGE_SNAP_PX) {
            return { type: 'merge', sourceBranch: branchName, targetBranch: otherBranch };
          }
        }
      }

      if (node.type === 'branchLabel' && (mode === 'sandbox' || mode === 'module4')) {
        const branchName = node.id.replace(/^branch-/, '');
        for (const [otherBranch, tipId] of Object.entries(gitState.branches)) {
          if (otherBranch === branchName) continue;
          const tipPos = layout.get(tipId);
          if (!tipPos) continue;
          // Rebase: snap to the OTHER branch's commit node position
          const dx = dragX - tipPos.x;
          const dy = dragY - tipPos.y;
          if (Math.sqrt(dx * dx + dy * dy) < SNAP_DISTANCE_PX) {
            return { type: 'rebase', branchToRebase: branchName, ontoBranch: otherBranch };
          }
        }
      }

      return null;
    },
    [mode, layout, gitState.commits, gitState.branches]
  );

  const onNodeDragStop: OnNodeDrag = useCallback(
    (_event, node) => {
      if (!canDrag) return;
      setDragPreview(null);
      const target = findDragTarget(node);
      if (target?.type === 'cherry-pick') {
        doCherryPick(target.sourceId, target.targetBranch);
        setGhostCommand('');
      } else if (target?.type === 'rebase') {
        setPendingDragOp({ type: 'rebase', branchToRebase: target.branchToRebase, ontoBranch: target.ontoBranch });
      } else if (target?.type === 'merge') {
        setPendingDragOp({ type: 'merge', sourceBranch: target.sourceBranch, targetBranch: target.targetBranch });
      } else {
        setGhostCommand('');
      }
    },
    [canDrag, findDragTarget, doCherryPick, setGhostCommand]
  );

  const onNodeDrag: OnNodeDrag = useCallback(
    (_event, node) => {
      if (!canDrag) return;
      const target = findDragTarget(node);
      if (target?.type === 'cherry-pick') {
        setDragPreview(null);
        setGhostCommand(`git cherry-pick ${target.sourceId}`, t('tickerSubtitles.cherryPick'));
      } else if (target?.type === 'rebase') {
        setDragPreview(target);
        setGhostCommand(`git rebase ${target.ontoBranch}`, t('tickerSubtitles.rebase'));
      } else if (target?.type === 'merge') {
        setDragPreview(target);
        setGhostCommand(`git merge ${target.sourceBranch}`, t('tickerSubtitles.merge'));
      } else {
        setDragPreview(null);
        setGhostCommand('');
      }
    },
    [canDrag, findDragTarget, setGhostCommand, t]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
      const target = event.target as HTMLElement;

      if (node.id === 'addCommit') {
        doStartWip();
        return;
      }

      if (node.id === 'ghost-wip') {
        doAddCommit();
        return;
      }

      if (canBranch && node.id === headCommitId && target.closest('[data-branch-badge]')) {
        doCreateBranch(node.id);
        return;
      }

      if (canReset && node.type === 'commit' && headAncestors.has(node.id)) {
        if (target.closest('[data-reset-commit]')) {
          doResetHard(node.id);
        }
        return;
      }

      if (canCheckout && node.type === 'commit' && node.id !== headCommitId) {
        if (target.closest('[data-checkout-commit]')) {
          const branchAtCommit = Object.entries(gitState.branches)
            .find(([, tipId]) => tipId === node.id)?.[0];
          doCheckout(branchAtCommit ?? node.id);
        }
        return;
      }

      if (canSquash && node.type === 'commit' && gitState.branches['feature'] === node.id) {
        if (target.closest('[data-squash-commit]')) {
          doSquash('feature', 3, 'feat: login page (squash)');
        }
        return;
      }

      if (canCheckout && node.type === 'branchLabel' && node.id !== 'label-HEAD') {
        const branchName = node.id.replace(/^branch-/, '');
        doCheckout(branchName);
      }
    },
    [canBranch, canCheckout, canReset, canSquash, headCommitId, headAncestors, gitState.branches, doAddCommit, doCreateBranch, doCheckout, doResetHard, doSquash]
  );

  const handleModalConfirm = useCallback(
    (choice: 'rebase' | 'merge') => {
      if (!pendingDragOp) return;
      const op = pendingDragOp;
      setPendingDragOp(null);
      setGhostCommand('');
      if (choice === 'rebase') {
        const branchToRebase = op.type === 'rebase' ? op.branchToRebase : op.sourceBranch;
        const ontoBranch = op.type === 'rebase' ? op.ontoBranch : op.targetBranch;
        doRebase(branchToRebase, ontoBranch);
      } else {
        const sourceBranch = op.type === 'merge' ? op.sourceBranch : op.branchToRebase;
        const targetBranch = op.type === 'merge' ? op.targetBranch : op.ontoBranch;
        doMerge(sourceBranch, targetBranch);
      }
    },
    [pendingDragOp, doRebase, doMerge, setGhostCommand]
  );

  const handleModalCancel = useCallback(() => {
    setPendingDragOp(null);
    setGhostCommand('');
  }, [setGhostCommand]);

  return (
    <div className="absolute inset-0">
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div
            className="flex flex-col items-center gap-3 px-6 py-5 text-center"
            style={{
              borderRadius: '16px',
              border: '1.5px dashed var(--hair)',
              background: 'color-mix(in srgb, var(--panel) 80%, transparent)',
              maxWidth: '320px',
            }}
          >
            <span className="font-mono text-[11px] text-[var(--ok)] uppercase tracking-widest">
              git init ✓
            </span>
            <p className="font-hand text-[13px] text-[var(--soft)] m-0 leading-relaxed">
              Repository initialized — <code className="font-mono text-[11px] bg-[var(--panel2)] px-1 rounded">main</code> branch created, no commits yet.
            </p>
            <p className="font-hand text-[12px] text-[var(--muted)] m-0">
              Click <strong>+</strong> to stage your changes and make your first commit.
            </p>
          </div>
        </div>
      )}
      <ReactFlow
        key={mode}
        nodes={[...nodes, ...ghostElements.nodes]}
        edges={[...edges, ...ghostElements.edges]}
        nodeTypes={nodeTypes}
        nodesDraggable={canDrag}
        nodesConnectable={false}
        elementsSelectable={true}
        onNodeClick={onNodeClick}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.4} color="var(--grid)" />
      </ReactFlow>
      {pendingDragOp && (
        <DragConfirmModal
          op={pendingDragOp}
          headBranch={gitState.HEAD}
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
        />
      )}
    </div>
  );
};

