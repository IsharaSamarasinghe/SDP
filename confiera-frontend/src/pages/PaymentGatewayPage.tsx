import { useState } from "react";
import { CreditCard, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

interface PaymentGatewayPageProps {
  onNavigate: (page: string) => void;
  paymentDetails: {
    conferenceId: string;
    conferenceName: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    registrationId: string;
  };
}

export function PaymentGatewayPage({ onNavigate, paymentDetails }: PaymentGatewayPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = () => {
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast.error("Please fill in all payment details");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      toast.success("Payment successful!");
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        onNavigate("participant-dashboard");
      }, 3000);
    }, 2000);
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-accent-foreground" />
            </div>
            <h2 className="mb-2 text-primary">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Your registration for {paymentDetails.conferenceName} has been confirmed.
            </p>
            <div className="bg-muted p-4 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <p className="font-mono">TXN{Math.random().toString(36).substring(7).toUpperCase()}</p>
            </div>
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => onNavigate("participant-dashboard")}
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4"
            onClick={() => onNavigate("participant-dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="mb-2">Secure Payment Gateway</h1>
          <p className="opacity-90">Complete your conference registration payment</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
                <CardDescription>
                  {paymentDetails.paymentMethod === "online" && "Enter your card details"}
                  {paymentDetails.paymentMethod === "paypal" && "PayPal Payment"}
                  {paymentDetails.paymentMethod === "stripe" && "Credit/Debit Card Payment"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-2 bg-muted p-4 rounded-lg">
                  <Lock className="w-4 h-4 text-accent" />
                  <p className="text-sm text-muted-foreground">
                    Your payment information is encrypted and secure
                  </p>
                </div>

                {paymentDetails.paymentMethod === "paypal" ? (
                  <div className="space-y-4">
                    <div className="bg-[#0070BA] text-white p-6 rounded-lg text-center">
                      <div className="text-2xl mb-4">PayPal</div>
                      <p className="text-sm opacity-90 mb-4">
                        You will be redirected to PayPal to complete your payment
                      </p>
                      <Button
                        className="w-full bg-white text-[#0070BA] hover:bg-gray-100"
                        onClick={handlePayment}
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Continue to PayPal"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={19}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Cardholder Name</Label>
                      <Input
                        placeholder="Name on card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input
                          placeholder="123"
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="w-4 h-4" />
                      <span>PCI DSS Compliant Payment Processing</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Conference</p>
                  <p>{paymentDetails.conferenceName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registration ID</p>
                  <p className="font-mono text-sm">{paymentDetails.registrationId}</p>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Total Amount</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl text-primary">
                      {paymentDetails.currency} {paymentDetails.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-accent text-accent-foreground">Secure</Badge>
                  <span className="text-xs text-muted-foreground">256-bit SSL</span>
                </div>

                {paymentDetails.paymentMethod !== "paypal" && (
                  <Button
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Pay ${paymentDetails.currency} ${paymentDetails.amount.toLocaleString()}`}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
