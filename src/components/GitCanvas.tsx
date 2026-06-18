import { Background, BackgroundVariant, ReactFlow, type Node, type NodeMouseHandler, type NodeTypes } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCallback, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useCanvasCapabilities } from '../hooks/useCanvasCapabilities'
import type { GitState, Mode } from '../types'
import { computeLayout } from '../utils/computeLayout'
import { computePreview } from '../utils/computePreview'
import { AddCommitNode } from './AddCommitNode'
import { BranchLabelNode } from './BranchLabelNode'
import { CommitGraphNode } from './CommitGraphNode'

type GitCanvasProps = {
  gitState: GitState
  mode: Mode
  doAddCommit: () => void
  doStartWip: () => void
  doCreateBranch: (commitId: string) => void
  doCheckout: (target: string) => void
  doResetHard: (commitId: string) => void
  doSquash: (branchName: string, count: number, message: string) => void
  doStageChanges: () => void
  staged: string | null
  wip?: string | null
  highlightNodeIds?: string[]
  previewCommand?: string | null
}

const nodeTypes: NodeTypes = {
  commit: CommitGraphNode,
  branchLabel: BranchLabelNode,
  addCommit: AddCommitNode,
}

const branchColor = (branch: string) => (branch === 'main' ? 'var(--main)' : branch === 'feature' ? 'var(--feat)' : 'var(--ink)')

export const GitCanvas = ({
  gitState,
  mode,
  doAddCommit,
  doStartWip,
  doCreateBranch,
  doCheckout,
  doResetHard,
  doSquash,
  wip,
  staged,
  doStageChanges,
  highlightNodeIds,
  previewCommand,
}: GitCanvasProps) => {
  const { t } = useTranslation()
  const layout = useMemo(() => computeLayout(gitState), [gitState])
  const { canBranch, canCheckout, canReset, canSquash } = useCanvasCapabilities(mode)

  const isEmpty = Object.keys(gitState.commits).length === 0
  const EMPTY_POS = useMemo(() => ({ x: 260, y: 180 }), [])
  const headCommitId = gitState.branches[gitState.HEAD] !== undefined ? (gitState.branches[gitState.HEAD] ?? gitState.HEAD) : gitState.HEAD

  const headLayout = isEmpty ? EMPTY_POS : layout.get(headCommitId)
  const isDetachedHead = gitState.branches[gitState.HEAD] === undefined

  const headAncestors = useMemo(() => {
    if (!canReset) return new Set<string>()
    const ancestors = new Set<string>()
    const walk = (id: string) => {
      if (ancestors.has(id)) return
      ancestors.add(id)
      gitState.commits[id]?.parentIds.forEach(walk)
    }
    gitState.commits[headCommitId]?.parentIds.forEach(walk)
    return ancestors
  }, [canReset, headCommitId, gitState.commits])

  const previewElements = useMemo(
    () => (previewCommand ? computePreview(previewCommand, gitState, layout) : { nodes: [], edges: [] }),
    [previewCommand, gitState, layout]
  )

  const nodes: Node[] = useMemo(() => {
    const result: Node[] = []

    for (const [id, pos] of layout.entries()) {
      const commit = gitState.commits[id]
      if (!commit) continue
      const isMerge = commit.parentIds.length > 1
      const isFeatureTip = canSquash && gitState.branches['feature'] === id
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
        draggable: false,
      })
    }

    for (const [branchName, tipId] of Object.entries(gitState.branches)) {
      const pos = tipId ? layout.get(tipId) : isEmpty ? EMPTY_POS : undefined
      if (!pos) continue
      result.push({
        id: `branch-${branchName}`,
        type: 'branchLabel',
        position: { x: pos.x + 50, y: pos.y - 44 },
        data: {
          label: branchName,
          branch: branchName,
          showCheckout: canCheckout,
          canDrag: false,
          tipHash: tipId,
          isCurrentHead: gitState.HEAD === branchName,
          highlighted: highlightNodeIds?.includes(`branch-${branchName}`) ?? false,
        },
        draggable: false,
      })
    }

    if (headLayout) {
      result.push({
        id: 'label-HEAD',
        type: 'branchLabel',
        position: { x: headLayout.x + 50, y: headLayout.y + 44 },
        data: {
          label: 'HEAD',
          branch: 'HEAD',
          isDetached: isDetachedHead,
          attachedBranch: isDetachedHead ? undefined : gitState.HEAD,
          canDrag: false,
          highlighted: highlightNodeIds?.includes('label-HEAD') ?? false,
        },
        draggable: false,
      })
    }

    if (headLayout && !isDetachedHead) {
      if (wip !== null) {
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
        })
      } else if (staged !== null) {
        result.push({
          id: 'staged-changes',
          type: 'commit',
          position: { x: headLayout.x + 130, y: headLayout.y },
          data: {
            label: 'IDX',
            branch: gitState.commits[headCommitId]?.branch ?? 'main',
            isGhost: false,
            isHead: false,
            isWip: false,
            isStaged: true,
            wipMessage: staged,
          },
          draggable: false,
        })
      } else {
        result.push({
          id: 'addCommit',
          type: 'addCommit',
          position: { x: headLayout.x + 130, y: headLayout.y + 3 },
          data: {},
          draggable: false,
        })
      }
    }

    if (headLayout && isDetachedHead) {
      result.push({
        id: 'addCommit',
        type: 'addCommit',
        position: { x: headLayout.x, y: headLayout.y - 80 },
        data: { disabled: true },
        draggable: false,
      })
    }

    return result
  }, [
    layout,
    gitState.commits,
    gitState.branches,
    headCommitId,
    headLayout,
    canBranch,
    canCheckout,
    canReset,
    canSquash,
    headAncestors,
    isDetachedHead,
    wip,
    staged,
    highlightNodeIds,
    isEmpty,
    gitState.HEAD,
    EMPTY_POS,
  ])

  const edges = useMemo(() => {
    const result = []
    for (const [id, commit] of Object.entries(gitState.commits)) {
      const isMerge = commit.parentIds.length > 1
      commit.parentIds.forEach((parentId, idx) => {
        const edgeColor =
          isMerge && idx > 0 ? branchColor(layout.get(parentId)?.branch ?? 'main') : branchColor(layout.get(id)?.branch ?? 'main')
        result.push({
          id: `e-${parentId}-${id}`,
          source: parentId,
          target: id,
          type: 'smoothstep',
          style: {
            stroke: isMerge ? 'var(--ok)' : edgeColor,
            strokeWidth: 2.2,
            strokeDasharray: isMerge ? '5 3' : undefined,
          },
        })
      })
    }
    if (headCommitId && !isDetachedHead && wip !== null) {
      result.push({
        id: 'e-wip',
        source: headCommitId,
        target: 'ghost-wip',
        type: 'smoothstep',
        style: { stroke: 'var(--ghost)', strokeWidth: 2, strokeDasharray: '4 3' },
      })
    } else if (headCommitId && !isDetachedHead && staged !== null) {
      result.push({
        id: 'e-staged',
        source: headCommitId,
        target: 'staged-changes',
        type: 'smoothstep',
        style: { stroke: 'var(--ghost)', strokeWidth: 2, strokeDasharray: '4 3' },
      })
    }
    return result
  }, [gitState.commits, layout, wip, staged, headCommitId, isDetachedHead])

  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
      const target = event.target as HTMLElement

      if (node.id === 'addCommit') {
        doStartWip()
        return
      }

      if (node.id === 'ghost-wip') {
        doStageChanges()
        return
      }

      if (node.id === 'staged-changes') {
        doAddCommit()
        return
      }

      if (canBranch && node.id === headCommitId && target.closest('[data-branch-badge]')) {
        doCreateBranch(node.id)
        return
      }

      if (canReset && node.type === 'commit' && headAncestors.has(node.id)) {
        if (target.closest('[data-reset-commit]')) {
          doResetHard(node.id)
        }
        return
      }

      if (canCheckout && node.type === 'commit' && node.id !== headCommitId) {
        if (target.closest('[data-checkout-commit]')) {
          const branchAtCommit = Object.entries(gitState.branches).find(([, tipId]) => tipId === node.id)?.[0]
          doCheckout(branchAtCommit ?? node.id)
        }
        return
      }

      if (canSquash && node.type === 'commit' && gitState.branches['feature'] === node.id) {
        if (target.closest('[data-squash-commit]')) {
          doSquash('feature', 3, 'feat: login page (squash)')
        }
        return
      }

      if (canCheckout && node.type === 'branchLabel' && node.id !== 'label-HEAD') {
        const branchName = node.id.replace(/^branch-/, '')
        doCheckout(branchName)
      }
    },
    [canBranch, canCheckout, canReset, canSquash, headCommitId, headAncestors, gitState.branches, doAddCommit, doStartWip, doCreateBranch, doCheckout, doResetHard, doSquash, doStageChanges]
  )

  return (
    <div className="absolute inset-0">
      {isEmpty && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center pt-8">
          <div
            className="flex flex-col items-center gap-3 px-6 py-5 text-center"
            style={{
              borderRadius: '16px',
              border: '1.5px dashed var(--hair)',
              background: 'color-mix(in srgb, var(--panel) 80%, transparent)',
              maxWidth: '320px',
            }}
          >
            <span className="font-mono text-xs tracking-widest text-ok uppercase">{t('canvas.emptyInit')}</span>
            <p className="m-0 font-hand text-sm leading-relaxed text-soft">
              <Trans
                i18nKey="canvas.emptyBranch"
                values={{ branch: 'main' }}
                components={{ code: <code className="rounded bg-panel2 px-1 font-mono text-xs" /> }}
              />
            </p>
            <p className="m-0 font-hand text-sm text-muted">
              {t('canvas.emptyAction')}
            </p>
          </div>
        </div>
      )}
      <ReactFlow
        key={mode}
        nodes={[...nodes, ...previewElements.nodes]}
        edges={[...edges, ...previewElements.edges]}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.4} color="var(--grid)" />
      </ReactFlow>
    </div>
  )
}
