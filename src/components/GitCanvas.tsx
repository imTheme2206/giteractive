import { useCallback, useMemo } from 'react';
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

interface GitCanvasProps {
  gitState: GitState;
  mode: Mode;
  doAddCommit: () => void;
  doCherryPick: (sourceId: string, targetBranch: string) => void;
  doRebase: (branchToRebase: string, ontoBranch: string) => void;
  doCreateBranch: (commitId: string) => void;
  setGhostCommand: (cmd: string) => void;
}

const nodeTypes: NodeTypes = {
  commit: CommitGraphNode,
  branchLabel: BranchLabelNode,
  addCommit: AddCommitNode,
};

interface LayoutNode {
  id: string;
  x: number;
  y: number;
  branch: string;
}

function computeLayout(gitState: GitState): Map<string, LayoutNode> {
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

  const roots = allIds.filter(id => {
    const commit = commits[id];
    return commit && commit.parentIds.length === 0;
  });

  const visited = new Set<string>();
  const queue: string[] = [...roots];
  const topoOrder: string[] = [];

  while (queue.length > 0) {
    const id = queue.shift();
    if (!id || visited.has(id)) continue;
    visited.add(id);
    topoOrder.push(id);
    const kids = children.get(id) ?? [];
    queue.push(...kids);
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
}

export function GitCanvas({
  gitState,
  mode,
  doAddCommit,
  doCherryPick,
  doRebase,
  doCreateBranch,
  setGhostCommand,
}: GitCanvasProps) {
  const layout = useMemo(() => computeLayout(gitState), [gitState]);

  const headCommitId =
    gitState.branches[gitState.HEAD] !== undefined
      ? (gitState.branches[gitState.HEAD] ?? gitState.HEAD)
      : gitState.HEAD;

  const headLayout = layout.get(headCommitId);

  const canBranch = mode !== 'module1';

  const nodes: Node[] = useMemo(() => {
    const result: Node[] = [];

    for (const [id, pos] of layout.entries()) {
      const commit = gitState.commits[id];
      if (!commit) continue;
      result.push({
        id,
        type: 'commit',
        position: { x: pos.x, y: pos.y },
        data: {
          label: id.slice(0, 4),
          branch: pos.branch,
          isHead: id === headCommitId,
          showBranchBadge: canBranch && id === headCommitId,
        },
        draggable: mode === 'sandbox' || mode === 'module3',
      });
    }

    for (const [branchName, tipId] of Object.entries(gitState.branches)) {
      const pos = layout.get(tipId);
      if (!pos) continue;
      result.push({
        id: `branch-${branchName}`,
        type: 'branchLabel',
        position: { x: pos.x + 50, y: pos.y - 44 },
        data: { label: branchName, branch: branchName },
        draggable: mode === 'sandbox' || mode === 'module3',
      });
    }

    if (headLayout) {
      result.push({
        id: 'label-HEAD',
        type: 'branchLabel',
        position: { x: headLayout.x + 50, y: headLayout.y + 44 },
        data: { label: 'HEAD', branch: 'HEAD' },
        draggable: false,
      });
    }

    if (headLayout) {
      result.push({
        id: 'addCommit',
        type: 'addCommit',
        position: { x: headLayout.x + 140, y: headLayout.y + 3 },
        data: {},
        draggable: false,
      });
    }

    return result;
  }, [layout, gitState.commits, gitState.branches, headCommitId, headLayout, mode, canBranch]);

  const edges: Edge[] = useMemo(() => {
    const result: Edge[] = [];
    for (const [id, commit] of Object.entries(gitState.commits)) {
      for (const parentId of commit.parentIds) {
        const pos = layout.get(id);
        const branch = pos?.branch ?? 'main';
        const edgeColor =
          branch === 'main'
            ? 'var(--main)'
            : branch === 'feature'
              ? 'var(--feat)'
              : 'var(--ink)';
        result.push({
          id: `e-${parentId}-${id}`,
          source: parentId,
          target: id,
          type: 'smoothstep',
          style: { stroke: edgeColor, strokeWidth: 2.2 },
        });
      }
    }
    return result;
  }, [gitState.commits, layout]);

  const canDrag = mode === 'sandbox' || mode === 'module3';

  type DragTarget =
    | { type: 'cherry-pick'; sourceId: string; targetBranch: string }
    | { type: 'rebase'; branchToRebase: string; ontoBranch: string };

  const SNAP_DISTANCE_PX = 80;

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

      if (node.type === 'branchLabel' && mode === 'sandbox') {
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

  const onNodeDragStop: OnNodeDrag = useCallback(
    (_event, node) => {
      if (!canDrag) return;
      const target = findDragTarget(node);
      if (target?.type === 'cherry-pick') {
        doCherryPick(target.sourceId, target.targetBranch);
      } else if (target?.type === 'rebase') {
        doRebase(target.branchToRebase, target.ontoBranch);
      }
      setGhostCommand('');
    },
    [canDrag, findDragTarget, doCherryPick, doRebase, setGhostCommand]
  );

  const onNodeDrag: OnNodeDrag = useCallback(
    (_event, node) => {
      if (!canDrag) return;
      const target = findDragTarget(node);
      if (target?.type === 'cherry-pick') {
        setGhostCommand(`git cherry-pick ${target.sourceId}`);
      } else if (target?.type === 'rebase') {
        setGhostCommand(`git rebase ${target.ontoBranch}`);
      } else {
        setGhostCommand('');
      }
    },
    [canDrag, findDragTarget, setGhostCommand]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
      if (node.id === 'addCommit') {
        doAddCommit();
        return;
      }
      if (canBranch && node.id === headCommitId) {
        const target = event.target as HTMLElement;
        if (target.closest('[data-branch-badge]')) {
          doCreateBranch(node.id);
        }
      }
    },
    [canBranch, headCommitId, doAddCommit, doCreateBranch]
  );


  return (
    <div className="absolute inset-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={mode === 'sandbox' || mode === 'module3'}
        nodesConnectable={false}
        elementsSelectable={true}
        onNodeClick={onNodeClick}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.4} color="var(--grid)" />
      </ReactFlow>
    </div>
  );
}
