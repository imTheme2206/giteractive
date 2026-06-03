import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ background: 'var(--bg, #fff)' }}
      >
        <div
          className="max-w-md w-full mx-4 p-6 flex flex-col gap-3"
          style={{ borderRadius: '12px', border: '1.5px solid var(--conflict, #e55)', background: 'var(--panel, #f9f9f9)' }}
        >
          <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--conflict, #e55)' }}>
            Something went wrong
          </span>
          <pre
            className="font-mono text-xs text-[var(--soft)] whitespace-pre-wrap break-all m-0"
            style={{ background: 'var(--panel2, #f0f0f0)', borderRadius: 6, padding: '8px 10px' }}
          >
            {error.message}
          </pre>
          <button
            type="button"
            className="self-start font-hand text-sm px-4 py-1.5 cursor-pointer"
            style={{ borderRadius: 8, background: 'var(--ink, #333)', color: '#fff', border: 'none' }}
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
}
