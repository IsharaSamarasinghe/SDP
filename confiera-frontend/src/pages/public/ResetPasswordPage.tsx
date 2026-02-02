import { useState } from "react";
import { ArrowLeft, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "sonner";

interface ResetPasswordPageProps {
    onNavigate: (page: string) => void;
}

export function ResetPasswordPage({ onNavigate }: ResetPasswordPageProps) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { resetPassword } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            if (!token) throw new Error("Missing reset token");

            await resetPassword({ token, newPassword: password });
            setIsSuccess(true);
            toast.success("Password reset successfully!");
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to reset password. The link may have expired.";
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
                <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-primary">Success!</CardTitle>
                        <CardDescription className="text-gray-600 mt-2">
                            Your password has been successfully reset.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => onNavigate('login')}
                            className="w-full bg-primary hover:bg-primary/90 text-white py-6"
                        >
                            Return to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
            <div className="w-full max-w-md">
                <Button
                    variant="ghost"
                    className="mb-6 hover:bg-gray-100 text-primary"
                    onClick={() => onNavigate("login")}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                </Button>

                <Card className="shadow-xl border-t-4 border-t-primary">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-primary">Reset Password</CardTitle>
                        <CardDescription className="text-gray-600">
                            Almost there! Please enter your new password below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-10 border-gray-300 focus:ring-primary focus:border-primary shadow-sm"
                                        placeholder="Min. 8 characters"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        className="pl-10 border-gray-300 focus:ring-primary focus:border-primary shadow-sm"
                                        placeholder="Repeat new password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 text-red-800 text-sm border border-red-100">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg py-6"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Resetting...' : 'Update Password'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
