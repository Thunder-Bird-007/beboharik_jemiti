import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallbackTitle: string;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(prevProps: Props) {
    // reset once children swap (e.g. inputs corrected back to a valid range)
    if (this.state.error && prevProps.children !== this.props.children) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="w-full h-full flex items-center justify-center p-6 text-center" style={{ color: "var(--danger)" }}>
          <div>
            <p className="font-semibold mb-1">{this.props.fallbackTitle}</p>
            <p className="text-[12px]" style={{ color: "var(--muted)" }}>
              {this.state.error.message}
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
