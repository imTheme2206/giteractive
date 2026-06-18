import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="flex h-screen items-center justify-center" style={{ background: 'var(--bg, #fff)' }}>
        <div
          className="mx-4 flex w-full max-w-md flex-col gap-3 p-6"
          style={{ borderRadius: '12px', border: '1.5px solid var(--conflict, #e55)', background: 'var(--panel, #f9f9f9)' }}
        >
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--conflict, #e55)' }}>
            Something went wrong
          </span>
          <pre
            className="m-0 font-mono text-xs break-all whitespace-pre-wrap text-soft"
            style={{ background: 'var(--panel2, #f0f0f0)', borderRadius: 6, padding: '8px 10px' }}
          >
            {error.message}
          </pre>
          <button
            type="button"
            className="cursor-pointer self-start px-4 py-1.5 font-hand text-sm"
            style={{ borderRadius: 8, background: 'var(--ink, #333)', color: '#fff', border: 'none' }}
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }
}
