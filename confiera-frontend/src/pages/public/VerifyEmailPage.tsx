import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { api } from "../../auth/AuthContext";

interface VerifyEmailPageProps {
    onNavigate: (page: string) => void;
}

export function VerifyEmailPage({ onNavigate }: VerifyEmailPageProps) {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const verify = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const token = params.get('token');
                if (!token) throw new Error('No token');

                await api.get(`/auth/verify-email?token=${token}`);
                setStatus('success');
            } catch (e) {
                setStatus('error');
            }
        };
        verify();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>Email Verification</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    {status === 'loading' && <Loader2 className="w-12 h-12 animate-spin text-blue-600" />}
                    {status === 'success' && (
                        <>
                            <CheckCircle2 className="w-16 h-16 text-green-600" />
                            <p className="text-center text-gray-600">Your email has been successfully verified.</p>
                            <Button onClick={() => onNavigate('login')} className="w-full">Go to Login</Button>
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <XCircle className="w-16 h-16 text-red-600" />
                            <p className="text-center text-gray-600">Verification failed. The link may be invalid or expired.</p>
                            <Button onClick={() => onNavigate('home')} variant="outline" className="w-full">Back to Home</Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
