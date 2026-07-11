import { Component, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "../ui/Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("VertexIQ caught an error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="glass-card rounded-2xl p-8 max-w-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-danger" />
            </div>
            <h2 className="text-base font-semibold text-text-primary mb-1.5">Something went wrong</h2>
            <p className="text-sm text-text-muted mb-5">
              An unexpected error occurred. Try reloading the page.
            </p>
            <Button variant="primary" onClick={() => window.location.reload()} className="w-full justify-center">
              Reload
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}