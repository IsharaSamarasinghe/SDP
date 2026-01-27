import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import uokLogo from "../../assets/uok-logo.png";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "sonner";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await login({ email, password });
      toast.success("Login successful");

      // Role-based redirection
      if (user.roles.includes('Admin')) {
        onNavigate("admin-dashboard");
      } else if (user.roles.includes('Organizer')) {
        onNavigate("organizer-dashboard");
      } else if (user.roles.includes('PanelEvaluator')) {
        onNavigate("evaluator-dashboard");
      } else {
        onNavigate("participant-dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left Side - Branding */}
      <div
        className="hidden md:flex flex-col justify-center items-center p-12 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4B0101 0%, #660000 100%)' }}
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6TTI0IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0xMiAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
        </div>
        <div className="relative z-10 max-w-md text-center">
          <div className="w-32 h-32 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl p-4 overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
            <img src={uokLogo} alt="University of Kelaniya" className="w-full h-full object-contain" />
          </div>
          <h1 className="mb-3" style={{ fontSize: "2rem", fontWeight: 600, color: '#FFFFFF' }}>
            University of Kelaniya
          </h1>
          <h2 className="mb-4 text-2xl" style={{ fontWeight: 600, color: '#F5C518' }}>Confiera</h2>
          <p className="text-lg mb-2" style={{ color: '#FFFFFF' }}>
            University of Kelaniya
          </p>
          <p className="leading-relaxed" style={{ color: '#E0E0E0' }}>
            Streamlining academic conferences through digital innovation and collaboration.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col justify-center items-center p-6 md:p-12" style={{ background: '#FAFAFA' }}>
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            className="mb-6 hover:bg-gray-100"
            style={{ color: '#4B0101' }}
            onClick={() => onNavigate("home")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <Card className="shadow-lg border" style={{ background: '#FFFFFF', borderColor: '#E5E5E5' }}>
            <CardHeader className="space-y-2">
              <CardTitle style={{ color: '#4B0101' }}>Welcome Back</CardTitle>
              <CardDescription style={{ color: '#737373' }}>
                Sign in to access your Confiera account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: '#1E1E1E' }}>Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border"
                    style={{ background: '#FFFFFF', borderColor: '#E5E5E5', color: '#1E1E1E' }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" style={{ color: '#1E1E1E' }}>Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border"
                    style={{ background: '#FFFFFF', borderColor: '#E5E5E5', color: '#1E1E1E' }}
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: '#4B0101' }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full shadow-md transition-all hover:opacity-90"
                  style={{ background: '#4B0101', color: '#FFFFFF' }}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                <div className="text-center text-sm pt-2">
                  <span style={{ color: '#737373' }}>Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => onNavigate("register")}
                    className="transition-colors hover:opacity-80"
                    style={{ fontWeight: 500, color: '#4B0101' }}
                  >
                    Register Now
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
