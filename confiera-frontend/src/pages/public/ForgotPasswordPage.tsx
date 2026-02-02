import { useState } from "react";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "sonner";

interface ForgotPasswordPageProps {
    onNavigate: (page: string) => void;
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
    const [email, setEmail] = useState("");
    const { forgotPassword } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await forgotPassword(email);
            setIsSubmitted(true);
            toast.success("Reset link sent!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send reset link");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
                <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-primary">Check Your Email</CardTitle>
                        <CardDescription className="text-gray-600 mt-2">
                            If an account exists for <span className="font-semibold text-gray-900">{email}</span>, we've sent a password reset link.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-center text-gray-500">
                            Please check your inbox and follow the instructions to reset your password. The link will expire in 1 hour.
                        </p>
                        <Button
                            onClick={() => onNavigate("login")}
                            className="w-full bg-primary hover:bg-primary/90 text-white"
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
                        <CardTitle className="text-2xl font-bold text-primary">Forgot Password?</CardTitle>
                        <CardDescription className="text-gray-600">
                            No worries! Enter your email address and we'll send you a link to reset your password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@university.edu"
                                        className="pl-10 border-gray-300 focus:ring-primary focus:border-primary shadow-sm"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg py-6"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending link..." : "Send Reset Link"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
