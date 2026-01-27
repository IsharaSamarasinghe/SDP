import { useState } from "react";
import { Settings, Calendar, FileText, Bell, LogOut, GraduationCap, Download, Link as LinkIcon, Plus, Trash2, Edit, UserPlus, Mail, Send, CreditCard, Check, X, Presentation } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { toast } from "sonner";
import { WorkshopsTabContent } from "../components/WorkshopsTabContent";
import { SessionsTabContent } from "../components/SessionsTabContent";

interface EvaluationCriterion {
  id: string;
  name: string;
  maxMarks: number;
}

interface Session {
  id: number;
  name: string;
  date: string;
  time: string;
  room: string;
  track: string;
  evaluationCriteria: EvaluationCriterion[];
}

interface OrganizerDashboardProps {
  onNavigate: (page: string) => void;
}

export function OrganizerDashboard({ onNavigate }: OrganizerDashboardProps) {
  const [activeTab, setActiveTab] = useState("settings");
  
  // Past Publications Management
  const [publications, setPublications] = useState([
    { id: 1, year: "2024", title: "SCSE 2024 Proceedings", link: "https://ieeexplore.ieee.org/scse2024" },
    { id: 2, year: "2023", title: "SCSE 2023 Proceedings", link: "https://ieeexplore.ieee.org/scse2023" },
  ]);
  const [isAddingPublication, setIsAddingPublication] = useState(false);
  const [newPubYear, setNewPubYear] = useState("");
  const [newPubTitle, setNewPubTitle] = useState("");
  const [newPubLink, setNewPubLink] = useState("");
  const [editingPub, setEditingPub] = useState<number | null>(null);

  // Evaluator Management
  const [evaluators, setEvaluators] = useState([
    { id: 1, name: "Dr. A. Wijesinghe", email: "wijesinghe@kln.ac.lk", track: "AI & Machine Learning", status: "Active" },
    { id: 2, name: "Prof. K. Fernando", email: "fernando@kln.ac.lk", track: "Robotics", status: "Active" },
  ]);
  const [isAddingEvaluator, setIsAddingEvaluator] = useState(false);
  const [newEvaluatorName, setNewEvaluatorName] = useState("");
  const [newEvaluatorEmail, setNewEvaluatorEmail] = useState("");
  const [newEvaluatorTrack, setNewEvaluatorTrack] = useState("");

  // Session Management
  const [sessions, setSessions] = useState<Session[]>([
    { 
      id: 1, 
      name: "Opening Keynote", 
      date: "2025-11-15", 
      time: "09:00 - 10:00", 
      room: "Main Hall", 
      track: "General",
      evaluationCriteria: [] 
    },
    { 
      id: 2, 
      name: "AI Research Presentations", 
      date: "2025-11-15", 
      time: "10:30 - 12:00", 
      room: "Room A", 
      track: "AI & Machine Learning",
      evaluationCriteria: [
        { id: "1", name: "Innovation", maxMarks: 30 },
        { id: "2", name: "Technical Depth", maxMarks: 40 },
        { id: "3", name: "Presentation", maxMarks: 30 },
      ]
    },
    { 
      id: 3, 
      name: "Robotics Workshop", 
      date: "2025-11-16", 
      time: "14:00 - 16:00", 
      room: "Lab 1", 
      track: "Robotics",
      evaluationCriteria: [
        { id: "4", name: "Hands-on content", maxMarks: 50 },
        { id: "5", name: "Clarity", maxMarks: 50 },
      ]
    },
  ]);
  
  const [tracks, setTracks] = useState(["General", "AI & Machine Learning", "Robotics", "Energy Systems", "Quantum Computing"]);

  // Payment Verification Management
  const [pendingPayments, setPendingPayments] = useState([
    { 
      id: 1, 
      regId: "CF2025-00456", 
      name: "Dr. S. Perera", 
      conference: "SCSE 2025",
      amount: "LKR 25,000", 
      method: "Bank Transfer", 
      submittedDate: "2025-01-15",
      proofUrl: "payment_proof_001.pdf",
      email: "s.perera@university.lk"
    },
    { 
      id: 2, 
      regId: "CF2025-00789", 
      name: "Prof. K. Silva", 
      conference: "ICAPS 2025",
      amount: "USD 150", 
      method: "Wire Transfer", 
      submittedDate: "2025-01-16",
      proofUrl: "payment_proof_002.pdf",
      email: "k.silva@university.lk"
    },
  ]);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  // Workshop Management
  const [workshops, setWorkshops] = useState([
    {
      id: 1,
      title: "AI & Machine Learning Fundamentals",
      description: "Hands-on workshop covering the basics of AI and ML",
      instructor: "Dr. A. Wijesinghe",
      fee: 5000,
      currency: "LKR",
      capacity: 50,
      starts_at: "2025-11-15T09:00",
      ends_at: "2025-11-15T12:00",
      registrations: [
        { id: 1, userName: "Dr. S. Perera", status: "confirmed", created_at: "2025-01-15" },
        { id: 2, userName: "Prof. K. Silva", status: "confirmed", created_at: "2025-01-16" },
        { id: 3, userName: "M. Fernando", status: "pending", created_at: "2025-01-20" },
      ],
    },
    {
      id: 2,
      title: "Advanced Robotics Programming",
      description: "Deep dive into robotics control systems",
      instructor: "Prof. K. Fernando",
      fee: 6000,
      currency: "LKR",
      capacity: 40,
      starts_at: "2025-11-16T14:00",
      ends_at: "2025-11-16T17:00",
      registrations: [
        { id: 1, userName: "T. Wickramasinghe", status: "confirmed", created_at: "2025-01-18" },
      ],
    },
  ]);
  const [isAddingWorkshop, setIsAddingWorkshop] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<number | null>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [showWorkshopDetails, setShowWorkshopDetails] = useState(false);
  const [workshopFormData, setWorkshopFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    fee: "0",
    currency: "LKR",
    capacity: "",
    starts_at: "",
    ends_at: "",
  });

  const sidebarItems = [
    { id: "settings", icon: Settings, label: "Conference Settings" },
    { id: "publications", icon: LinkIcon, label: "Past Publications" },
    { id: "workshops", icon: Presentation, label: "Manage Workshops" },
    { id: "sessions", icon: Calendar, label: "Manage Sessions & Tracks" },
    { id: "payments", icon: CreditCard, label: "Payment Verification" },
    { id: "reports", icon: FileText, label: "Reports" },
    { id: "notifications", icon: Bell, label: "Notifications" },
  ];

  const handleAddPublication = () => {
    if (!newPubYear || !newPubTitle || !newPubLink) {
      toast.error("All fields are required");
      return;
    }
    const newPub = {
      id: publications.length + 1,
      year: newPubYear,
      title: newPubTitle,
      link: newPubLink,
    };
    setPublications([...publications, newPub]);
    setNewPubYear("");
    setNewPubTitle("");
    setNewPubLink("");
    setIsAddingPublication(false);
    toast.success("Publication link added successfully");
  };

  const handleUpdatePublication = (id: number) => {
    const pub = publications.find(p => p.id === id);
    if (pub) {
      setNewPubYear(pub.year);
      setNewPubTitle(pub.title);
      setNewPubLink(pub.link);
      setEditingPub(id);
      setIsAddingPublication(true);
    }
  };

  const handleSaveEdit = () => {
    if (!newPubYear || !newPubTitle || !newPubLink) {
      toast.error("All fields are required");
      return;
    }
    setPublications(publications.map(p => 
      p.id === editingPub ? { ...p, year: newPubYear, title: newPubTitle, link: newPubLink } : p
    ));
    setNewPubYear("");
    setNewPubTitle("");
    setNewPubLink("");
    setEditingPub(null);
    setIsAddingPublication(false);
    toast.success("Publication updated successfully");
  };

  const handleDeletePublication = (id: number) => {
    setPublications(publications.filter(p => p.id !== id));
    toast.success("Publication deleted successfully");
  };

  const handleAddEvaluator = () => {
    if (!newEvaluatorName || !newEvaluatorEmail || !newEvaluatorTrack) {
      toast.error("All fields are required");
      return;
    }
    const newEvaluator = {
      id: evaluators.length + 1,
      name: newEvaluatorName,
      email: newEvaluatorEmail,
      track: newEvaluatorTrack,
      status: "Pending",
    };
    setEvaluators([...evaluators, newEvaluator]);
    setNewEvaluatorName("");
    setNewEvaluatorEmail("");
    setNewEvaluatorTrack("");
    setIsAddingEvaluator(false);
    toast.success("Evaluator invited successfully. Credentials sent via email.");
  };

  const handleSendCredentials = (evaluatorId: number) => {
    const evaluator = evaluators.find(e => e.id === evaluatorId);
    if (evaluator) {
      toast.success(`Credentials sent to ${evaluator.email}`);
    }
  };

  const handleDeleteEvaluator = (id: number) => {
    setEvaluators(evaluators.filter(e => e.id !== id));
    toast.success("Evaluator removed successfully");
  };

  const handleApprovePayment = (id: number) => {
    const payment = pendingPayments.find(p => p.id === id);
    if (payment) {
      setPendingPayments(pendingPayments.filter(p => p.id !== id));
      toast.success(`Payment approved for ${payment.name}. Confirmation email sent.`);
    }
  };

  const handleRejectPayment = (id: number) => {
    const payment = pendingPayments.find(p => p.id === id);
    if (payment) {
      setPendingPayments(pendingPayments.filter(p => p.id !== id));
      toast.error(`Payment rejected for ${payment.name}. Notification email sent.`);
    }
  };

  const handleViewProof = (payment: any) => {
    setSelectedPayment(payment);
    setShowProofDialog(true);
  };

  // Workshop handlers
  const handleAddWorkshop = () => {
    const { title, fee, capacity, starts_at, ends_at } = workshopFormData;
    
    // Validation
    if (!title) {
      toast.error("Title is required");
      return;
    }
    if (!capacity || parseInt(capacity) <= 0) {
      toast.error("Capacity must be greater than 0");
      return;
    }
    if (parseFloat(fee) < 0) {
      toast.error("Fee cannot be negative");
      return;
    }
    if (!starts_at || !ends_at) {
      toast.error("Start and end times are required");
      return;
    }
    if (new Date(ends_at) <= new Date(starts_at)) {
      toast.error("End time must be after start time");
      return;
    }

    const newWorkshop = {
      id: workshops.length + 1,
      ...workshopFormData,
      fee: parseFloat(fee),
      capacity: parseInt(capacity),
      registrations: [],
    };

    setWorkshops([...workshops, newWorkshop]);
    setWorkshopFormData({
      title: "",
      description: "",
      instructor: "",
      fee: "0",
      currency: "LKR",
      capacity: "",
      starts_at: "",
      ends_at: "",
    });
    setIsAddingWorkshop(false);
    toast.success("Workshop created successfully");
  };

  const handleEditWorkshop = (id: number) => {
    const workshop = workshops.find(w => w.id === id);
    if (workshop) {
      setWorkshopFormData({
        title: workshop.title,
        description: workshop.description || "",
        instructor: workshop.instructor || "",
        fee: workshop.fee.toString(),
        currency: workshop.currency,
        capacity: workshop.capacity.toString(),
        starts_at: workshop.starts_at,
        ends_at: workshop.ends_at,
      });
      setEditingWorkshop(id);
      setIsAddingWorkshop(true);
    }
  };

  const handleSaveWorkshopEdit = () => {
    const { title, fee, capacity, starts_at, ends_at } = workshopFormData;
    
    // Validation
    if (!title) {
      toast.error("Title is required");
      return;
    }
    if (!capacity || parseInt(capacity) <= 0) {
      toast.error("Capacity must be greater than 0");
      return;
    }
    if (parseFloat(fee) < 0) {
      toast.error("Fee cannot be negative");
      return;
    }
    if (!starts_at || !ends_at) {
      toast.error("Start and end times are required");
      return;
    }
    if (new Date(ends_at) <= new Date(starts_at)) {
      toast.error("End time must be after start time");
      return;
    }

    setWorkshops(workshops.map(w => 
      w.id === editingWorkshop
        ? {
            ...w,
            ...workshopFormData,
            fee: parseFloat(fee),
            capacity: parseInt(capacity),
          }
        : w
    ));
    setWorkshopFormData({
      title: "",
      description: "",
      instructor: "",
      fee: "0",
      currency: "LKR",
      capacity: "",
      starts_at: "",
      ends_at: "",
    });
    setEditingWorkshop(null);
    setIsAddingWorkshop(false);
    toast.success("Workshop updated successfully");
  };

  const handleDeleteWorkshop = (id: number) => {
    setWorkshops(workshops.filter(w => w.id !== id));
    toast.success("Workshop deleted successfully");
  };

  const handleViewWorkshopDetails = (workshop: any) => {
    setSelectedWorkshop(workshop);
    setShowWorkshopDetails(true);
  };

  const handleChangeRegistrationStatus = (workshopId: number, registrationId: number, newStatus: string) => {
    setWorkshops(workshops.map(w => {
      if (w.id === workshopId) {
        return {
          ...w,
          registrations: w.registrations.map(r =>
            r.id === registrationId ? { ...r, status: newStatus } : r
          ),
        };
      }
      return w;
    }));
    toast.success(`Registration status updated to ${newStatus}`);
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
              <div className="text-xs text-muted-foreground">Organizer Panel</div>
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

        <div className="p-4 border-t border-sidebar-border">
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
          {/* Conference Settings */}
          {activeTab === "settings" && (
            <div>
              <h1 className="mb-2 text-primary">Conference Settings</h1>
              <p className="text-muted-foreground mb-8">
                Edit deadlines, meals, discounts, and links for SCSE 2025
              </p>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Deadlines</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Paper Submission</Label>
                        <Input type="date" defaultValue="2025-01-15" />
                      </div>
                      <div className="space-y-2">
                        <Label>Registration</Label>
                        <Input type="date" defaultValue="2025-02-28" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Registration Fees</CardTitle>
                    <CardDescription>Set pricing for different participant categories</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Pricing Table */}
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow style={{ background: '#F5F5F5' }}>
                            <TableHead className="w-[40%]">Category</TableHead>
                            <TableHead className="text-center">Standard</TableHead>
                            <TableHead className="text-center">Early Bird</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Local Authors */}
                          <TableRow style={{ background: '#FFF9E6' }}>
                            <TableCell colSpan={3}>
                              <span style={{ color: '#4B0101' }}>Local Authors (LKR)</span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Local author IEEE member</TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="25000" className="text-center" />
                            </TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="22500" className="text-center" />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Local author non-IEEE member</TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="35000" className="text-center" />
                            </TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="30000" className="text-center" />
                            </TableCell>
                          </TableRow>

                          {/* International Authors */}
                          <TableRow style={{ background: '#FFF9E6' }}>
                            <TableCell colSpan={3}>
                              <span style={{ color: '#4B0101' }}>International Authors (USD)</span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>International Author IEEE member</TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="200" className="text-center" />
                            </TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="150" className="text-center" />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>International Author non-IEEE member</TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="275" className="text-center" />
                            </TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="225" className="text-center" />
                            </TableCell>
                          </TableRow>

                          {/* Local Student Authors */}
                          <TableRow style={{ background: '#FFF9E6' }}>
                            <TableCell colSpan={3}>
                              <span style={{ color: '#4B0101' }}>Local Student Authors (LKR)</span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Local Student Author IEEE member</TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="22500" className="text-center" />
                            </TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="18500" className="text-center" />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Local Student Author non-IEEE member</TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="30000" className="text-center" />
                            </TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="25000" className="text-center" />
                            </TableCell>
                          </TableRow>

                          {/* Participant */}
                          <TableRow style={{ background: '#FFF9E6' }}>
                            <TableCell colSpan={3}>
                              <span style={{ color: '#4B0101' }}>Participants (LKR)</span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Participant</TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="5000" className="text-center" />
                            </TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="5000" className="text-center" />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    {/* Early Bird Deadline */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="space-y-2">
                        <Label>Early Bird Deadline</Label>
                        <Input type="date" defaultValue="2025-02-15" />
                      </div>
                      <div className="space-y-2">
                        <Label>Currency Exchange Rate (1 USD = ? LKR)</Label>
                        <Input type="number" defaultValue="320" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>CMT Submission Link</Label>
                      <Input defaultValue="https://cmt.scse2025.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>IEEE Xplore Link</Label>
                      <Input defaultValue="https://ieeexplore.ieee.org/scse" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Evaluator Panel Management</CardTitle>
                        <CardDescription>Manage evaluators and send login credentials</CardDescription>
                      </div>
                      <Dialog open={isAddingEvaluator} onOpenChange={setIsAddingEvaluator}>
                        <DialogTrigger asChild>
                          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add Evaluator
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Panel Evaluator</DialogTitle>
                            <DialogDescription>
                              Add a new evaluator and send login credentials via email
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <Label>Full Name</Label>
                              <Input
                                value={newEvaluatorName}
                                onChange={(e) => setNewEvaluatorName(e.target.value)}
                                placeholder="e.g., Dr. John Doe"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Email Address</Label>
                              <Input
                                type="email"
                                value={newEvaluatorEmail}
                                onChange={(e) => setNewEvaluatorEmail(e.target.value)}
                                placeholder="evaluator@example.com"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Assigned Track</Label>
                              <Select value={newEvaluatorTrack} onValueChange={setNewEvaluatorTrack}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select track" />
                                </SelectTrigger>
                                <SelectContent>
                                  {tracks.map((track) => (
                                    <SelectItem key={track} value={track}>{track}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setIsAddingEvaluator(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                className="bg-accent text-accent-foreground hover:bg-accent/90"
                                onClick={handleAddEvaluator}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Add & Send Credentials
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Track</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {evaluators.map((evaluator) => (
                          <TableRow key={evaluator.id}>
                            <TableCell>{evaluator.name}</TableCell>
                            <TableCell>{evaluator.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{evaluator.track}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={evaluator.status === "Active" ? "default" : "secondary"}>
                                {evaluator.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSendCredentials(evaluator.id)}
                                >
                                  <Mail className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive"
                                  onClick={() => handleDeleteEvaluator(evaluator.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Past Publications */}
          {activeTab === "publications" && (
            <div>
              <h1 className="mb-2 text-primary">Past Publications</h1>
              <p className="text-muted-foreground mb-8">
                Manage links to past conference proceedings and publications
              </p>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Publication Links</CardTitle>
                    <Dialog open={isAddingPublication} onOpenChange={setIsAddingPublication}>
                      <DialogTrigger asChild>
                        <Button 
                          className="bg-accent text-accent-foreground hover:bg-accent/90"
                          onClick={() => {
                            setEditingPub(null);
                            setNewPubYear("");
                            setNewPubTitle("");
                            setNewPubLink("");
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Publication
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingPub ? "Edit" : "Add"} Publication Link</DialogTitle>
                          <DialogDescription>
                            Add links to past conference proceedings on IEEE Xplore or other platforms
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label>Year</Label>
                            <Input
                              value={newPubYear}
                              onChange={(e) => setNewPubYear(e.target.value)}
                              placeholder="e.g., 2024"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              value={newPubTitle}
                              onChange={(e) => setNewPubTitle(e.target.value)}
                              placeholder="e.g., SCSE 2024 Proceedings"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Link URL</Label>
                            <Input
                              value={newPubLink}
                              onChange={(e) => setNewPubLink(e.target.value)}
                              placeholder="https://ieeexplore.ieee.org/..."
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsAddingPublication(false);
                                setEditingPub(null);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="bg-accent text-accent-foreground hover:bg-accent/90"
                              onClick={editingPub ? handleSaveEdit : handleAddPublication}
                            >
                              {editingPub ? "Update" : "Add"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Link</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {publications.map((pub) => (
                        <TableRow key={pub.id}>
                          <TableCell>{pub.year}</TableCell>
                          <TableCell>{pub.title}</TableCell>
                          <TableCell>
                            <a
                              href={pub.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:underline flex items-center gap-1"
                            >
                              <LinkIcon className="w-4 h-4" />
                              View on IEEE Xplore
                            </a>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdatePublication(pub.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive"
                                onClick={() => handleDeletePublication(pub.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Sessions & Tracks */}
          {activeTab === "sessions" && (
            <SessionsTabContent
              sessions={sessions}
              setSessions={setSessions}
              tracks={tracks}
              setTracks={setTracks}
            />
          )}

          {/* Payment Verification */}
          {activeTab === "payments" && (
            <div>
              <h1 className="mb-2 text-primary">Payment Verification</h1>
              <p className="text-muted-foreground mb-8">
                Review and approve pending payment submissions
              </p>

              {pendingPayments.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <CreditCard className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-primary mb-2">No Pending Payments</h3>
                    <p className="text-sm text-muted-foreground">
                      All payment submissions have been processed
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {pendingPayments.map((payment) => (
                    <Card key={payment.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-primary">{payment.name}</CardTitle>
                            <CardDescription>
                              Registration ID: {payment.regId} • {payment.conference}
                            </CardDescription>
                          </div>
                          <Badge className="bg-yellow-500 text-white">
                            Pending Review
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Email</p>
                              <p>{payment.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Amount</p>
                              <p>{payment.amount}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Payment Method</p>
                              <p>{payment.method}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Submitted Date</p>
                              <p>{payment.submittedDate}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Payment Proof</p>
                              <div className="border border-border rounded-lg p-4 bg-muted">
                                <div className="flex items-center gap-2 mb-3">
                                  <FileText className="w-5 h-5 text-primary" />
                                  <span className="text-sm font-mono">{payment.proofUrl}</span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => handleViewProof(payment)}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  View/Download Proof
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-6 pt-6 border-t">
                          <Button
                            variant="outline"
                            className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRejectPayment(payment.id)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject Payment
                          </Button>
                          <Button
                            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                            onClick={() => handleApprovePayment(payment.id)}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Approve & Confirm
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Workshops */}
          {activeTab === "workshops" && (
            <WorkshopsTabContent
              workshops={workshops}
              isAddingWorkshop={isAddingWorkshop}
              setIsAddingWorkshop={setIsAddingWorkshop}
              editingWorkshop={editingWorkshop}
              setEditingWorkshop={setEditingWorkshop}
              workshopFormData={workshopFormData}
              setWorkshopFormData={setWorkshopFormData}
              selectedWorkshop={selectedWorkshop}
              showWorkshopDetails={showWorkshopDetails}
              setShowWorkshopDetails={setShowWorkshopDetails}
              handleAddWorkshop={handleAddWorkshop}
              handleEditWorkshop={handleEditWorkshop}
              handleSaveWorkshopEdit={handleSaveWorkshopEdit}
              handleDeleteWorkshop={handleDeleteWorkshop}
              handleViewWorkshopDetails={handleViewWorkshopDetails}
              handleChangeRegistrationStatus={handleChangeRegistrationStatus}
            />
          )}

          {/* Reports */}
          {activeTab === "reports" && (
            <div>
              <h1 className="mb-2 text-primary">Reports & Analytics</h1>
              <p className="text-muted-foreground mb-8">
                Generate and export comprehensive conference reports with advanced filtering
              </p>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Report Generation</CardTitle>
                  <CardDescription>
                    Access the full-featured report generation system with filters, data preview, and export options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-secondary p-6 rounded-lg text-center space-y-4">
                    <FileText className="w-16 h-16 mx-auto text-primary" />
                    <div>
                      <h3 className="text-primary mb-2">Comprehensive Reporting System</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Filter by conference, track, payment status, workshop, evaluator, and date range. 
                        Preview data and export to PDF or Excel format.
                      </p>
                    </div>
                    <Button 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => onNavigate("report-generation")}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Open Report Generation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div>
              <h1 className="mb-2 text-primary">Notifications</h1>
              <p className="text-muted-foreground mb-8">
                View and manage conference notifications
              </p>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Payment Confirmed",
                        message: "Dr. S. Perera has completed payment for SCSE 2025",
                        time: "2 hours ago",
                        type: "success",
                      },
                      {
                        title: "Deadline Approaching",
                        message: "Paper submission deadline is in 5 days",
                        time: "1 day ago",
                        type: "warning",
                      },
                      {
                        title: "New Registration",
                        message: "Dr. Jane Smith registered for the conference",
                        time: "3 days ago",
                        type: "info",
                      },
                    ].map((notification, idx) => (
                      <div key={idx} className="flex gap-4 p-4 border border-border rounded-lg">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notification.type === "success"
                              ? "bg-accent"
                              : notification.type === "warning"
                              ? "bg-destructive"
                              : "bg-primary"
                          }`}
                        />
                        <div className="flex-1">
                          <p>{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Payment Proof Dialog */}
      <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
            <DialogDescription>
              Review the uploaded payment proof document
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Registration ID</span>
                  <span className="text-sm font-mono">{selectedPayment.regId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm">{selectedPayment.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-sm">{selectedPayment.amount}</span>
                </div>
              </div>
              <div className="border border-border rounded-lg p-6 bg-secondary text-center">
                <FileText className="w-16 h-16 mx-auto text-primary mb-4" />
                <p className="text-sm font-mono mb-4">{selectedPayment.proofUrl}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  In a production system, the payment proof document would be displayed here
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Document
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}