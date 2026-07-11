import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, AlertCircle } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useAuth } from "../../lib/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="glass-card rounded-2xl p-8 w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-lg bg-primary glow-primary flex items-center justify-center">
            <Sparkles size={17} className="text-white" />
          </div>
          <span className="text-xl font-semibold text-text-primary tracking-tight">VertexIQ</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-text-muted mb-1.5 block">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@vertexiq.com"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-muted mb-1.5 block">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-danger">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full justify-center mt-2">
            Sign In
          </Button>
        </form>

        <p className="text-xs text-text-muted text-center mt-6">
          Demo account: mal@vertexiq.com / VertexIQ2026!
        </p>
      </div>
    </div>
  );
}