import { useState } from "react";
import { Calendar, FileText, Receipt, Ticket, LogOut, GraduationCap, Download, QrCode, Upload, User, Trash2, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Checkbox } from "../components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { toast } from "sonner";

interface ParticipantDashboardProps {
  onNavigate: (page: string) => void;
}

export function ParticipantDashboard({ onNavigate }: ParticipantDashboardProps) {
  const [activeTab, setActiveTab] = useState("conferences");
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [mealPreference, setMealPreference] = useState("vegetarian");
  const [selectedWorkshops, setSelectedWorkshops] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [selectedCurrency, setSelectedCurrency] = useState("LKR");
  const [participantType, setParticipantType] = useState("local-author-ieee");
  const [isEarlyBird, setIsEarlyBird] = useState(true); // Check if before early bird deadline
  const [paperIds, setPaperIds] = useState<string[]>([""]);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);

  const sidebarItems = [
    { id: "conferences", icon: Calendar, label: "Available Conferences" },
    { id: "registrations", icon: FileText, label: "My Registrations" },
    { id: "receipts", icon: Receipt, label: "Receipts & Invoices" },
    { id: "tickets", icon: Ticket, label: "Tickets" },
  ];

  const myRegistrations = [
    {
      conference: "SCSE 2025",
      regId: "CF2025-00123",
      status: "Confirmed",
      paymentStatus: "Paid",
      amount: "12,000 LKR",
      date: "March 25-27, 2025",
      participantType: "Local Author - IEEE Member",
      papers: ["P001", "P002"],
      workshops: ["AI in Energy Systems"],
      mealPreference: "Vegetarian",
      paymentMethod: "Online Payment",
      transactionId: "TXN123456789",
    },
  ];

  // Mock accepted papers for the user
  const acceptedPapers = [
    { id: "P001", title: "Deep Learning Approaches for Smart Grid Optimization", track: "AI & Machine Learning" },
    { id: "P002", title: "Renewable Energy Integration Using IoT", track: "Energy Systems" },
    { id: "P003", title: "Quantum Computing Applications in Energy Distribution", track: "Quantum Computing" },
  ];

  const workshops = [
    { id: "ws1", name: "AI in Energy Systems", fee: 2500, capacity: 30, enrolled: 18 },
    { id: "ws2", name: "IoT for Smart Grids", fee: 3000, capacity: 25, enrolled: 12 },
  ];

  const toggleWorkshop = (id: string) => {
    setSelectedWorkshops((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const handleAddPaperField = () => {
    setPaperIds([...paperIds, ""]);
  };

  const handleRemovePaperField = (index: number) => {
    if (paperIds.length > 1) {
      setPaperIds(paperIds.filter((_, i) => i !== index));
    }
  };

  const handlePaperIdChange = (index: number, value: string) => {
    const newPaperIds = [...paperIds];
    newPaperIds[index] = value;
    setPaperIds(newPaperIds);
  };

  const handleViewDetails = (registration: any) => {
    setSelectedRegistration(registration);
    setShowDetailsDialog(true);
  };

  const handleProceedToPayment = () => {
    // Validate required fields
    if (participantType !== "participant") {
      const validPaperIds = paperIds.filter(id => id.trim() !== "");
      if (validPaperIds.length === 0) {
        toast.error("Please enter at least one paper ID");
        return;
      }
    }

    // If bank transfer or wire transfer, show submission message
    if (paymentMethod === "bank" || paymentMethod === "wire") {
      if (!paymentProofFile) {
        toast.error("Please upload payment proof");
        return;
      }
      toast.success("Registration submitted for verification. You will receive confirmation once payment is verified.");
      setShowRegistrationForm(false);
      setActiveTab("registrations");
      return;
    }

    // For online payments, redirect to payment gateway
    // In a real implementation, you would navigate to the payment page with state
    toast.success("Redirecting to payment gateway...");
    setTimeout(() => {
      // Simulate payment completion
      setShowRegistrationForm(false);
      setActiveTab("registrations");
      toast.success("Payment successful! Registration confirmed.");
    }, 1500);
  };

  // Pricing structure based on conference settings
  const pricingTable: Record<string, { standard: number; earlyBird: number; currency: string }> = {
    "local-author-ieee": { standard: 25000, earlyBird: 22500, currency: "LKR" },
    "local-author-non-ieee": { standard: 35000, earlyBird: 30000, currency: "LKR" },
    "intl-author-ieee": { standard: 200, earlyBird: 150, currency: "USD" },
    "intl-author-non-ieee": { standard: 275, earlyBird: 225, currency: "USD" },
    "local-student-ieee": { standard: 22500, earlyBird: 18500, currency: "LKR" },
    "local-student-non-ieee": { standard: 30000, earlyBird: 25000, currency: "LKR" },
    "participant": { standard: 5000, earlyBird: 5000, currency: "LKR" },
  };

  const calculateTotal = () => {
    const pricing = pricingTable[participantType];
    const baseFee = isEarlyBird ? pricing.earlyBird : pricing.standard;
    const currency = pricing.currency;
    
    const exchangeRate = 320; // 1 USD = 320 LKR
    const workshopFee = workshops
      .filter((w) => selectedWorkshops.includes(w.id))
      .reduce((sum, w) => {
        const fee = currency === "LKR" ? w.fee : Math.round(w.fee / exchangeRate);
        return sum + fee;
      }, 0);
    
    const mealFee = currency === "LKR" 
      ? (mealPreference === "vegetarian" ? 1500 : 2000)
      : (mealPreference === "vegetarian" ? 5 : 7);
    
    const subtotal = baseFee + workshopFee + mealFee;
    return { baseFee, workshopFee, mealFee, subtotal, total: subtotal, currency };
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-primary tracking-wide" style={{ fontWeight: 600 }}>
                Confiera
              </div>
              <div className="text-xs text-muted-foreground">Participant Portal</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-primary text-white"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => onNavigate("profile")}
          >
            <User className="w-5 h-5 mr-3" />
            Profile & Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onNavigate("home")}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Available Conferences */}
          {activeTab === "conferences" && !showRegistrationForm && (
            <div>
              <h1 className="mb-2 text-primary">Available Conferences</h1>
              <p className="text-muted-foreground mb-8">
                Browse and register for upcoming conferences
              </p>

              <div className="grid gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-primary">SCSE 2025</CardTitle>
                        <CardDescription>
                          Smart Computing for Sustainable Energy
                        </CardDescription>
                      </div>
                      <Badge className="bg-accent text-accent-foreground">
                        Open
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Dates:</span>
                        <span>March 25-27, 2025</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Venue:</span>
                        <span>University of Kelaniya, Sri Lanka</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Registration Fee:</span>
                        <span>LKR 5,000 - 35,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">International:</span>
                        <span>USD 150 - 275</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Early Bird:</span>
                        <span className="text-accent">Until Feb 15, 2025</span>
                      </div>
                    </div>

                    {/* Paper Submission Section */}
                    <div className="mb-6 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
                      <h4 className="mb-3 text-sm" style={{ color: '#4B0101' }}>Paper Submission</h4>
                      <div className="flex flex-col gap-2">
                        <a
                          href="https://www.ieee.org/conferences/publishing/templates.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md transition-all hover:opacity-90"
                          style={{ 
                            background: '#F5C518',
                            color: '#000000',
                          }}
                        >
                          <FileText className="w-4 h-4" />
                          IEEE Paper Template
                        </a>
                        <a
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md transition-all hover:opacity-90"
                          style={{ 
                            background: '#F5C518',
                            color: '#000000',
                          }}
                        >
                          <FileText className="w-4 h-4" />
                          Guidelines
                        </a>
                        <a
                          href="https://cmt3.research.microsoft.com/SCSE2025"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md transition-all hover:opacity-90"
                          style={{ 
                            background: '#F5C518',
                            color: '#000000',
                          }}
                        >
                          <Upload className="w-4 h-4" />
                          Submit via CMT
                        </a>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => setShowRegistrationForm(true)}
                    >
                      Register Now
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-primary">ICAPS 2025</CardTitle>
                        <CardDescription>
                          International Conference on Applied & Pure Sciences
                        </CardDescription>
                      </div>
                      <Badge className="bg-accent text-accent-foreground">
                        Open
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Dates:</span>
                        <span>April 15-18, 2025</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Venue:</span>
                        <span>University of Kelaniya, Sri Lanka</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Registration Fee:</span>
                        <span>LKR 5,000 - 35,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">International:</span>
                        <span>USD 150 - 275</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Early Bird:</span>
                        <span className="text-accent">Until Mar 15, 2025</span>
                      </div>
                    </div>

                    {/* Paper Submission Section */}
                    <div className="mb-6 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
                      <h4 className="mb-3 text-sm" style={{ color: '#4B0101' }}>Paper Submission</h4>
                      <div className="flex flex-col gap-2">
                        <a
                          href="https://www.ieee.org/conferences/publishing/templates.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md transition-all hover:opacity-90"
                          style={{ 
                            background: '#F5C518',
                            color: '#000000',
                          }}
                        >
                          <FileText className="w-4 h-4" />
                          IEEE Paper Template
                        </a>
                        <a
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md transition-all hover:opacity-90"
                          style={{ 
                            background: '#F5C518',
                            color: '#000000',
                          }}
                        >
                          <FileText className="w-4 h-4" />
                          Guidelines
                        </a>
                        <a
                          href="https://cmt3.research.microsoft.com/ICAPS2025"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md transition-all hover:opacity-90"
                          style={{ 
                            background: '#F5C518',
                            color: '#000000',
                          }}
                        >
                          <Upload className="w-4 h-4" />
                          Submit via CMT
                        </a>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => setShowRegistrationForm(true)}
                    >
                      Register Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Registration Form */}
          {activeTab === "conferences" && showRegistrationForm && (
            <div>
              <Button
                variant="ghost"
                className="mb-6"
                onClick={() => setShowRegistrationForm(false)}
              >
                ← Back to Conferences
              </Button>

              <h1 className="mb-2 text-primary">Register for SCSE 2025</h1>
              <p className="text-muted-foreground mb-8">
                Complete your conference registration
              </p>

              <Card>
                <CardContent className="pt-6">
                  <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="info">Information</TabsTrigger>
                      <TabsTrigger value="workshops">Workshops & Meals</TabsTrigger>
                      <TabsTrigger value="payment">Payment</TabsTrigger>
                    </TabsList>

                    <TabsContent value="info" className="space-y-6 mt-6">
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Auto-filled from your profile</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p>Dr. N. Fernando</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p>n.fernando@kln.ac.lk</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Organization</p>
                            <p>University of Kelaniya</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Country</p>
                            <p>Sri Lanka</p>
                          </div>
                        </div>
                      </div>

                      {/* Participant Type Selection */}
                      <div className="space-y-2">
                        <Label>Registration Category</Label>
                        <Select value={participantType} onValueChange={setParticipantType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="local-author-ieee">Local Author - IEEE Member</SelectItem>
                            <SelectItem value="local-author-non-ieee">Local Author - Non-IEEE Member</SelectItem>
                            <SelectItem value="intl-author-ieee">International Author - IEEE Member</SelectItem>
                            <SelectItem value="intl-author-non-ieee">International Author - Non-IEEE Member</SelectItem>
                            <SelectItem value="local-student-ieee">Local Student Author - IEEE Member</SelectItem>
                            <SelectItem value="local-student-non-ieee">Local Student Author - Non-IEEE Member</SelectItem>
                            <SelectItem value="participant">Participant (No Paper Submission)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Your registration fee will be calculated based on this category
                        </p>
                      </div>

                      {participantType !== "participant" && (
                        <div className="space-y-4">
                          <div>
                            <Label>Paper ID(s)</Label>
                            <p className="text-xs text-muted-foreground mb-3">
                              Enter the Paper ID(s) from your acceptance notification email. If you have multiple accepted papers, click "Add Another Paper" to include all of them.
                            </p>
                          </div>
                          {paperIds.map((paperId, index) => (
                            <div key={index} className="flex gap-2">
                              <div className="flex-1">
                                <Input
                                  placeholder={`e.g., P00${index + 1}, SCSE-2025-${index + 1}`}
                                  value={paperId}
                                  onChange={(e) => handlePaperIdChange(index, e.target.value)}
                                />
                              </div>
                              {paperIds.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleRemovePaperField(index)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddPaperField}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Another Paper
                          </Button>
                          <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground">
                            <p className="mb-2">💡 <span className="text-foreground">Tip:</span></p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              <li>Paper IDs are provided in your acceptance email from the conference</li>
                              <li>If you submitted through CMT, check your CMT dashboard for Paper IDs</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Early Bird Notice */}
                      {isEarlyBird && (
                        <div className="bg-accent/10 border border-accent p-4 rounded-lg">
                          <p className="text-sm" style={{ color: '#4B0101' }}>
                            🎉 <span>Early Bird Pricing Active!</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Register before February 15, 2025 to get discounted rates
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="workshops" className="space-y-6 mt-6">
                      <div className="space-y-2">
                        <Label>Meal Preference</Label>
                        <RadioGroup value={mealPreference} onValueChange={setMealPreference}>
                          <div className="flex items-center space-x-2 border border-border p-4 rounded-lg">
                            <RadioGroupItem value="vegetarian" id="veg" />
                            <Label htmlFor="veg" className="flex-1 cursor-pointer">
                              Vegetarian (+LKR 1,500)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 border border-border p-4 rounded-lg">
                            <RadioGroupItem value="non-vegetarian" id="non-veg" />
                            <Label htmlFor="non-veg" className="flex-1 cursor-pointer">
                              Non-Vegetarian (+LKR 2,000)
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-4">
                        <Label>Select Workshops</Label>
                        {workshops.map((workshop) => (
                          <div key={workshop.id} className="flex items-start space-x-3 border border-border p-4 rounded-lg">
                            <Checkbox
                              id={workshop.id}
                              checked={selectedWorkshops.includes(workshop.id)}
                              onCheckedChange={() => toggleWorkshop(workshop.id)}
                            />
                            <div className="flex-1">
                              <Label htmlFor={workshop.id} className="cursor-pointer">
                                {workshop.name}
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                LKR {workshop.fee.toLocaleString()} | {workshop.enrolled}/{workshop.capacity} enrolled
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="payment" className="space-y-6 mt-6">
                      <Card className="bg-muted border-accent">
                        <CardHeader>
                          <CardTitle className="text-primary">Payment Summary</CardTitle>
                          <CardDescription>
                            Category: {participantType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            {isEarlyBird && " • Early Bird Rate Applied"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span>Base Registration Fee:</span>
                            <span>{calculateTotal().currency} {calculateTotal().baseFee.toLocaleString()}</span>
                          </div>
                          {calculateTotal().workshopFee > 0 && (
                            <div className="flex justify-between">
                              <span>Workshops:</span>
                              <span>{calculateTotal().currency} {calculateTotal().workshopFee.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Meals:</span>
                            <span>{calculateTotal().currency} {calculateTotal().mealFee.toLocaleString()}</span>
                          </div>
                          {isEarlyBird && (
                            <div className="flex justify-between text-accent">
                              <span>✓ Early Bird Discount Applied</span>
                              <span>Included</span>
                            </div>
                          )}
                          <div className="border-t border-border pt-2 mt-2 flex justify-between">
                            <span>Total Amount:</span>
                            <span className="text-primary">{calculateTotal().currency} {calculateTotal().total.toLocaleString()}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="space-y-4">
                        <Label>Payment Method</Label>
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                          {calculateTotal().currency === "LKR" ? (
                            <>
                              <div className="flex items-center space-x-2 border border-border p-4 rounded-lg">
                                <RadioGroupItem value="online" id="online" />
                                <Label htmlFor="online" className="flex-1 cursor-pointer">
                                  💳 Online Payment (Credit/Debit Card - LKR)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 border border-border p-4 rounded-lg">
                                <RadioGroupItem value="bank" id="bank" />
                                <Label htmlFor="bank" className="flex-1 cursor-pointer">
                                  🏦 Bank Transfer / Cheque (Sri Lankan Banks)
                                </Label>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center space-x-2 border border-border p-4 rounded-lg">
                                <RadioGroupItem value="paypal" id="paypal" />
                                <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                                  PayPal (Recommended for International)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 border border-border p-4 rounded-lg">
                                <RadioGroupItem value="stripe" id="stripe" />
                                <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                                  💳 Credit/Debit Card (Visa, MasterCard, Amex)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 border border-border p-4 rounded-lg">
                                <RadioGroupItem value="wire" id="wire" />
                                <Label htmlFor="wire" className="flex-1 cursor-pointer">
                                  🏦 International Wire Transfer
                                </Label>
                              </div>
                            </>
                          )}
                        </RadioGroup>
                      </div>

                      {/* Payment Method Specific Details */}
                      {paymentMethod === "bank" && calculateTotal().currency === "LKR" && (
                        <Card className="bg-secondary">
                          <CardHeader>
                            <CardTitle>Bank Transfer Details</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Bank Name:</p>
                              <p>Bank of Ceylon</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Account Name:</p>
                              <p>University of Kelaniya - Confiera</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Account Number:</p>
                              <p>87459632</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Branch:</p>
                              <p>Kelaniya Branch</p>
                            </div>
                            <div className="pt-2 border-t">
                              <Label>Upload Payment Proof *</Label>
                              <Input 
                                type="file" 
                                accept="image/*,application/pdf" 
                                className="mt-2"
                                onChange={(e) => setPaymentProofFile(e.target.files?.[0] || null)}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Upload bank slip or transfer confirmation
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {paymentMethod === "wire" && calculateTotal().currency === "USD" && (
                        <Card className="bg-secondary">
                          <CardHeader>
                            <CardTitle>International Wire Transfer Details</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Bank Name:</p>
                              <p>Bank of Ceylon</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">SWIFT Code:</p>
                              <p>BCEYLKLX</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Account Name:</p>
                              <p>University of Kelaniya - Confiera</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Account Number:</p>
                              <p>87459632001</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Bank Address:</p>
                              <p>Bank of Ceylon Head Office, No. 04, Bank of Ceylon Mawatha, Colombo 01, Sri Lanka</p>
                            </div>
                            <div className="pt-2 border-t">
                              <Label>Upload Payment Proof *</Label>
                              <Input 
                                type="file" 
                                accept="image/*,application/pdf" 
                                className="mt-2"
                                onChange={(e) => setPaymentProofFile(e.target.files?.[0] || null)}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Please upload the wire transfer receipt after completing the transfer
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {paymentMethod === "paypal" && calculateTotal().currency === "USD" && (
                        <Card className="bg-secondary">
                          <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground mb-4">
                              You will be redirected to PayPal to complete your payment securely.
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                              <Badge className="bg-accent text-accent-foreground">Secure</Badge>
                              <span className="text-muted-foreground">PayPal Buyer Protection applies</span>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {paymentMethod === "stripe" && calculateTotal().currency === "USD" && (
                        <Card className="bg-secondary">
                          <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground mb-4">
                              You will be redirected to our secure payment gateway to enter your card details.
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                              <Badge className="bg-accent text-accent-foreground">Secure</Badge>
                              <span className="text-muted-foreground">Powered by Stripe - PCI DSS Compliant</span>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {paymentMethod === "online" && calculateTotal().currency === "LKR" && (
                        <Card className="bg-secondary">
                          <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground mb-4">
                              You will be redirected to our secure payment gateway for local card payments.
                              Accepts all major Sri Lankan bank cards.
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                              <Badge className="bg-accent text-accent-foreground">Secure</Badge>
                              <span className="text-muted-foreground">SSL Encrypted</span>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <Button
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                        onClick={handleProceedToPayment}
                      >
                        {paymentMethod === "bank" || paymentMethod === "wire" ? "Submit for Verification" : "Proceed to Payment"}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}

          {/* My Registrations */}
          {activeTab === "registrations" && (
            <div>
              <h1 className="mb-2 text-primary">My Registrations</h1>
              <p className="text-muted-foreground mb-8">
                View your conference registrations and status
              </p>

              <div className="grid gap-6">
                {myRegistrations.map((reg, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-primary">{reg.conference}</CardTitle>
                          <CardDescription>Registration ID: {reg.regId}</CardDescription>
                        </div>
                        <Badge className="bg-accent text-accent-foreground">
                          {reg.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Date:</span>
                          <span>{reg.date}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Amount Paid:</span>
                          <span>{reg.amount}</span>
                        </div>
                        <div className="flex gap-3 mt-4">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleViewDetails(reg)}
                          >
                            View Details
                          </Button>
                          <Button
                            className="flex-1 bg-primary hover:bg-primary/90"
                            onClick={() => setActiveTab("tickets")}
                          >
                            View Ticket
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Receipts & Invoices */}
          {activeTab === "receipts" && (
            <div>
              <h1 className="mb-2 text-primary">Receipts & Invoices</h1>
              <p className="text-muted-foreground mb-8">
                Download your payment receipts and invoices
              </p>

              <Card>
                <CardHeader>
                  <CardTitle>Invoice - SCSE 2025</CardTitle>
                  <CardDescription>Registration ID: CF2025-00123</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-6 rounded-lg mb-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span>Dr. N. Fernando</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Conference:</span>
                        <span>SCSE 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Fee:</span>
                        <span>LKR 13,500</span>
                      </div>
                      <div className="flex justify-between text-accent">
                        <span className="text-muted-foreground">Discount:</span>
                        <span>IEEE Member (10%)</span>
                      </div>
                      <div className="border-t border-border pt-4 flex justify-between">
                        <span>Total:</span>
                        <span>LKR 12,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method:</span>
                        <span>Bank Transfer</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className="bg-accent text-accent-foreground">Confirmed</Badge>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF Invoice
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tickets */}
          {activeTab === "tickets" && (
            <div>
              <h1 className="mb-2 text-primary">Conference Tickets</h1>
              <p className="text-muted-foreground mb-8">
                Your digital conference tickets with QR codes
              </p>

              <div className="max-w-2xl mx-auto">
                <Card className="border-2 border-primary">
                  <CardHeader className="bg-gradient-to-r from-primary to-[#6B0000] text-white">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <GraduationCap className="w-8 h-8" />
                        <div>
                          <CardTitle className="text-white">CONFIERA 2025</CardTitle>
                          <p className="text-sm text-white/80">University of Kelaniya</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p>Dr. N. Fernando</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Registration ID</p>
                          <p>CF2025-00123</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Conference</p>
                          <p>SCSE 2025</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Workshop</p>
                          <p>AI in Energy Systems</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p>March 25–27, 2025</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Payment</p>
                          <p>LKR 12,000</p>
                        </div>
                      </div>

                      <div className="border-t border-border pt-4">
                        <div className="bg-white p-8 rounded-lg border border-border flex flex-col items-center">
                          <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center mb-4">
                            <QrCode className="w-32 h-32 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground text-center">
                            QR Code for entry verification
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent className="border-t border-border bg-muted text-center">
                    <p className="text-sm text-muted-foreground">
                      Thank you for registering with Confiera.
                    </p>
                  </CardContent>
                </Card>

                <div className="mt-6 text-center">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Download className="w-4 h-4 mr-2" />
                    Download Ticket
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Registration Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
            <DialogDescription>
              Complete information about your conference registration
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-3">
                <h3 className="text-primary">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Conference</p>
                    <p>{selectedRegistration.conference}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Registration ID</p>
                    <p className="font-mono">{selectedRegistration.regId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p>{selectedRegistration.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className="bg-accent text-accent-foreground">
                      {selectedRegistration.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p>{selectedRegistration.participantType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Meal Preference</p>
                    <p>{selectedRegistration.mealPreference}</p>
                  </div>
                </div>
              </div>

              {/* Paper Information */}
              {selectedRegistration.papers && selectedRegistration.papers.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-primary">Registered Paper(s)</h3>
                  <div className="space-y-2">
                    {selectedRegistration.papers.map((paperId: string, idx: number) => (
                      <div key={idx} className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">
                          <span className="text-primary font-mono">{paperId}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Workshop Information */}
              {selectedRegistration.workshops && selectedRegistration.workshops.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-primary">Registered Workshops</h3>
                  <div className="space-y-2">
                    {selectedRegistration.workshops.map((workshop: string, idx: number) => (
                      <div key={idx} className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">{workshop}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Information */}
              <div className="space-y-3">
                <h3 className="text-primary">Payment Information</h3>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payment Method</span>
                    <span className="text-sm">{selectedRegistration.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payment Status</span>
                    <Badge className="bg-accent text-accent-foreground">
                      {selectedRegistration.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="text-sm">{selectedRegistration.amount}</span>
                  </div>
                  {selectedRegistration.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Transaction ID</span>
                      <span className="text-sm font-mono">{selectedRegistration.transactionId}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowDetailsDialog(false)}
                >
                  Close
                </Button>
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setShowDetailsDialog(false);
                    setActiveTab("receipts");
                  }}
                >
                  View Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
