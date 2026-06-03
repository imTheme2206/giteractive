import { useCallback, useMemo, useState } from 'react';
import type { Edge, Node, OnNodeDrag } from '@xyflow/react';
import type { GitState, Mode } from '../types';
import type { LayoutNode } from '../utils/computeLayout';

type DragTarget =
  | { type: 'cherry-pick'; sourceId: string; targetBranch: string }
  | { type: 'rebase'; branchToRebase: string; ontoBranch: string }
  | { type: 'merge'; sourceBranch: string; targetBranch: string };

export type PendingDragOp =
  | { type: 'rebase'; branchToRebase: string; ontoBranch: string }
  | { type: 'merge'; sourceBranch: string; targetBranch: string };

type Params = {
  canDrag: boolean;
  layout: Map<string, LayoutNode>;
  gitState: GitState;
  mode: Mode;
  doCherryPick: (sourceId: string, targetBranch: string) => void;
  doRebase: (branchToRebase: string, ontoBranch: string) => void;
  doMerge: (sourceBranch: string, targetBranch: string) => void;
  setGhostCommand: (cmd: string, subtitle?: string) => void;
  t: (key: string) => string;
};

const SNAP_DISTANCE_PX = 80;
const MERGE_SNAP_PX = 60;

export const useDragHandlers = ({
  canDrag,
  layout,
  gitState,
  mode,
  doCherryPick,
  doRebase,
  doMerge,
  setGhostCommand,
  t,
}: Params) => {
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

  return {
    pendingDragOp,
    onNodeDrag,
    onNodeDragStop,
    handleModalConfirm,
    handleModalCancel,
    ghostElements,
  };
};
