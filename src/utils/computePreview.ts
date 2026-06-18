import type { Edge, Node } from '@xyflow/react'
import type { GitState } from '../types'
import type { LayoutNode } from './computeLayout'

export const computePreview = (
  command: string,
  gitState: GitState,
  layout: Map<string, LayoutNode>
): { nodes: Node[]; edges: Edge[] } => {
  const { branches, commits, HEAD } = gitState
  const headTip = branches[HEAD]

  const rebaseMatch = command.match(/^git rebase (?!-i)(\S+)$/)
  if (rebaseMatch) {
    const onto = rebaseMatch[1]!
    const ontoTip = branches[onto]
    const rebaseTip = headTip
    if (!ontoTip || !rebaseTip) return { nodes: [], edges: [] }

    const ontoAncestors = new Set<string>()
    const walkOnto = (id: string) => {
      if (ontoAncestors.has(id)) return
      ontoAncestors.add(id)
      commits[id]?.parentIds.forEach(walkOnto)
    }
    walkOnto(ontoTip)

    const movingCommits: string[] = []
    const walk = (id: string) => {
      if (ontoAncestors.has(id)) return
      movingCommits.unshift(id)
      const parent = commits[id]?.parentIds[0]
      if (parent) walk(parent)
    }
    walk(rebaseTip)

    const ontoPos = layout.get(ontoTip)
    if (!ontoPos || movingCommits.length === 0) return { nodes: [], edges: [] }

    const ghostNodes: Node[] = []
    const ghostEdges: Edge[] = []

    movingCommits.forEach((commitId, i) => {
      const ghostId = `ghost-rebase-${commitId}`
      const commit = commits[commitId]
      ghostNodes.push({
        id: ghostId,
        type: 'commit',
        position: { x: ontoPos.x + 130 * (i + 1), y: ontoPos.y },
        data: { label: commitId.slice(0, 4), hash: commitId, message: commit?.message, branch: onto, isGhost: true, isHead: false },
        draggable: false,
        selectable: false,
      })
      const sourceId = i === 0 ? ontoTip : `ghost-rebase-${movingCommits[i - 1]}`
      ghostEdges.push({
        id: `e-ghost-rebase-${i}`,
        source: sourceId,
        target: ghostId,
        type: 'smoothstep',
        style: { stroke: 'var(--main)', strokeWidth: 1.5, strokeDasharray: '5 4', opacity: 0.4 },
        selectable: false,
      })
    })

    return { nodes: ghostNodes, edges: ghostEdges }
  }

  const mergeMatch = command.match(/^git merge (\S+)$/)
  if (mergeMatch) {
    const source = mergeMatch[1]!
    const sourceTip = branches[source]
    const targetTip = headTip
    if (!sourceTip || !targetTip) return { nodes: [], edges: [] }

    const targetPos = layout.get(targetTip)
    if (!targetPos) return { nodes: [], edges: [] }

    return {
      nodes: [
        {
          id: 'ghost-merge-commit',
          type: 'commit',
          position: { x: targetPos.x + 130, y: targetPos.y },
          data: { label: '⊕', branch: HEAD, isGhost: true, isHead: false, isMerge: true },
          draggable: false,
          selectable: false,
        },
      ],
      edges: [
        {
          id: 'e-ghost-merge-target',
          source: targetTip,
          target: 'ghost-merge-commit',
          type: 'smoothstep',
          style: { stroke: 'var(--ok)', strokeWidth: 1.5, strokeDasharray: '5 4', opacity: 0.4 },
          selectable: false,
        },
        {
          id: 'e-ghost-merge-source',
          source: sourceTip,
          target: 'ghost-merge-commit',
          type: 'smoothstep',
          style: { stroke: 'var(--ok)', strokeWidth: 1.5, strokeDasharray: '5 4', opacity: 0.4 },
          selectable: false,
        },
      ],
    }
  }

  const cherryPickMatch = command.match(/^git cherry-pick (\S+)$/)
  if (cherryPickMatch) {
    const prefix = cherryPickMatch[1]!
    const sourceId = Object.keys(commits).find((id) => id.startsWith(prefix))
    if (!sourceId || !headTip) return { nodes: [], edges: [] }

    const headPos = layout.get(headTip)
    if (!headPos) return { nodes: [], edges: [] }

    return {
      nodes: [
        {
          id: 'ghost-cherry-pick',
          type: 'commit',
          position: { x: headPos.x + 130, y: headPos.y },
          data: { label: sourceId.slice(0, 4), hash: sourceId, message: commits[sourceId]?.message, branch: HEAD, isGhost: true, isHead: false },
          draggable: false,
          selectable: false,
        },
      ],
      edges: [
        {
          id: 'e-ghost-cherry-pick',
          source: headTip,
          target: 'ghost-cherry-pick',
          type: 'smoothstep',
          style: { stroke: 'var(--feat)', strokeWidth: 1.5, strokeDasharray: '5 4', opacity: 0.4 },
          selectable: false,
        },
      ],
    }
  }

  const checkoutBMatch = command.match(/^git checkout -b (\S+)$/)
  if (checkoutBMatch) {
    const name = checkoutBMatch[1]!
    if (!headTip) return { nodes: [], edges: [] }
    const headPos = layout.get(headTip)
    if (!headPos) return { nodes: [], edges: [] }

    return {
      nodes: [
        {
          id: 'ghost-new-branch',
          type: 'branchLabel',
          position: { x: headPos.x + 50, y: headPos.y - 44 },
          data: { label: name, branch: name, isGhost: true, canDrag: false, isCurrentHead: false },
          draggable: false,
          selectable: false,
        },
      ],
      edges: [],
    }
  }

  const checkoutMatch = command.match(/^git checkout (?!-b)(\S+)$/)
  if (checkoutMatch) {
    const target = checkoutMatch[1]!
    const targetTip = branches[target]
    if (!targetTip) return { nodes: [], edges: [] }
    const targetPos = layout.get(targetTip)
    if (!targetPos) return { nodes: [], edges: [] }

    return {
      nodes: [
        {
          id: 'ghost-head-label',
          type: 'branchLabel',
          position: { x: targetPos.x + 50, y: targetPos.y + 44 },
          data: { label: 'HEAD', branch: 'HEAD', isGhost: true, attachedBranch: target, canDrag: false },
          draggable: false,
          selectable: false,
        },
      ],
      edges: [],
    }
  }

  const resetMatch = command.match(/^git reset --hard (\S+)$/)
  if (resetMatch) {
    const prefix = resetMatch[1]!
    const targetId = Object.keys(commits).find((id) => id.startsWith(prefix))
    if (!targetId) return { nodes: [], edges: [] }
    const targetPos = layout.get(targetId)
    if (!targetPos) return { nodes: [], edges: [] }

    return {
      nodes: [
        {
          id: 'ghost-reset-head',
          type: 'branchLabel',
          position: { x: targetPos.x + 50, y: targetPos.y + 44 },
          data: { label: HEAD, branch: HEAD, isGhost: true, canDrag: false },
          draggable: false,
          selectable: false,
        },
      ],
      edges: [],
    }
  }

  return { nodes: [], edges: [] }
}
