import { useState, useMemo } from "react";
import { 
  FileDown, 
  FileSpreadsheet, 
  GraduationCap, 
  Filter, 
  Download, 
  Eye,
  DollarSign,
  Users,
  FileText,
  Utensils,
  Award,
  Calendar as CalendarIcon,
  BookOpen,
  Search,
  Building2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ReportGenerationPageProps {
  onNavigate: (page: string) => void;
  userRole: "admin" | "organizer";
}

export function ReportGenerationPage({ onNavigate, userRole }: ReportGenerationPageProps) {
  // Define conferences based on user role
  const availableConferences = userRole === "admin" 
    ? [
        { id: "scse2025", name: "SCSE 2025" },
        { id: "icaps2025", name: "ICAPS 2025" },
        { id: "scse2024", name: "SCSE 2024" },
        { id: "icet2025", name: "ICET 2025" },
      ]
    : [
        { id: "scse2025", name: "SCSE 2025" },
        { id: "icaps2025", name: "ICAPS 2025" },
      ];

  const defaultConference = userRole === "admin" ? "all" : availableConferences[0]?.id || "scse2025";
  
  const [selectedConference, setSelectedConference] = useState(defaultConference);
  const [selectedTrack, setSelectedTrack] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [selectedPaymentType, setSelectedPaymentType] = useState("all");
  const [selectedParticipantType, setSelectedParticipantType] = useState("all");
  const [selectedWorkshop, setSelectedWorkshop] = useState("all");
  const [selectedOrganization, setSelectedOrganization] = useState("all");
  const [selectedMealType, setSelectedMealType] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [activeReportType, setActiveReportType] = useState("financial");

  // Sample data - Financial Reports
  const allFinancialData = [
    { 
      id: "REG001", 
      name: "Dr. Sunil Perera", 
      type: "Author", 
      amount: 25000, 
      currency: "LKR",
      paymentType: "Online Banking", 
      status: "Paid",
      discount: "IEEE Member (10%)",
      date: "2025-10-15",
      conference: "scse2025"
    },
    { 
      id: "REG002", 
      name: "Ms. Amara Silva", 
      type: "Student", 
      amount: 15000, 
      currency: "LKR",
      paymentType: "Bank Transfer", 
      status: "Paid",
      discount: "Student (40%)",
      date: "2025-10-16",
      conference: "scse2025"
    },
    { 
      id: "REG003", 
      name: "Prof. Nimal Fernando", 
      type: "Participant", 
      amount: 20000, 
      currency: "LKR",
      paymentType: "Cheque", 
      status: "Pending",
      discount: "Early Bird (15%)",
      date: "2025-10-17",
      conference: "icaps2025"
    },
    { 
      id: "REG004", 
      name: "Dr. Jane Smith", 
      type: "Author", 
      amount: 150, 
      currency: "USD",
      paymentType: "Online Banking", 
      status: "Paid",
      discount: "None",
      date: "2025-10-18",
      conference: "icaps2025"
    },
    { 
      id: "REG005", 
      name: "Dr. Chamara Jayawardena", 
      type: "Author", 
      amount: 22500, 
      currency: "LKR",
      paymentType: "Online Banking", 
      status: "Paid",
      discount: "IEEE Member (10%)",
      date: "2025-09-20",
      conference: "scse2025"
    },
    { 
      id: "REG006", 
      name: "Mr. Rajitha Dissanayake", 
      type: "Participant", 
      amount: 5000, 
      currency: "LKR",
      paymentType: "Bank Transfer", 
      status: "Paid",
      discount: "None",
      date: "2025-10-05",
      conference: "scse2025"
    },
    { 
      id: "REG007", 
      name: "Dr. Kamal Bandara", 
      type: "Author", 
      amount: 28000, 
      currency: "LKR",
      paymentType: "Online Banking", 
      status: "Paid",
      discount: "Early Bird (15%)",
      date: "2024-09-15",
      conference: "scse2024"
    },
    { 
      id: "REG008", 
      name: "Prof. Sarah Johnson", 
      type: "Author", 
      amount: 180, 
      currency: "USD",
      paymentType: "Online Banking", 
      status: "Paid",
      discount: "IEEE Member (10%)",
      date: "2025-10-20",
      conference: "icet2025"
    },
  ];

  // Sample data - Registration & Attendance
  const allRegistrationData = [
    { 
      id: "P001", 
      name: "Dr. Sunil Perera", 
      email: "sunil@kln.ac.lk",
      organization: "University of Kelaniya",
      type: "Author",
      track: "AI & Machine Learning",
      status: "Confirmed",
      checkedIn: true,
      registrationDate: "2025-09-15",
      conference: "scse2025"
    },
    { 
      id: "P002", 
      name: "Ms. Amara Silva", 
      email: "amara.s@gmail.com",
      organization: "University of Colombo",
      type: "Student",
      track: "Robotics",
      status: "Confirmed",
      checkedIn: true,
      registrationDate: "2025-09-18",
      conference: "scse2025"
    },
    { 
      id: "P003", 
      name: "Prof. Nimal Fernando", 
      email: "nimal.f@moratuwa.ac.lk",
      organization: "University of Moratuwa",
      type: "Participant",
      track: "Energy Systems",
      status: "Confirmed",
      checkedIn: false,
      registrationDate: "2025-09-20",
      conference: "icaps2025"
    },
    { 
      id: "P004", 
      name: "Dr. Jane Smith", 
      email: "jane.smith@stanford.edu",
      organization: "Stanford University",
      type: "Author",
      track: "Quantum Computing",
      status: "Pending",
      checkedIn: false,
      registrationDate: "2025-10-01",
      conference: "icaps2025"
    },
    { 
      id: "P005", 
      name: "Dr. Chamara Jayawardena", 
      email: "chamara@kln.ac.lk",
      organization: "University of Kelaniya",
      type: "Author",
      track: "AI & Machine Learning",
      status: "Confirmed",
      checkedIn: true,
      registrationDate: "2025-09-10",
      conference: "scse2025"
    },
    { 
      id: "P006", 
      name: "Mr. Rajitha Dissanayake", 
      email: "rajitha@gmail.com",
      organization: "University of Peradeniya",
      type: "Participant",
      track: "Robotics",
      status: "Confirmed",
      checkedIn: false,
      registrationDate: "2025-10-02",
      conference: "scse2025"
    },
    { 
      id: "P007", 
      name: "Dr. Kamal Bandara", 
      email: "kamal@kln.ac.lk",
      organization: "University of Kelaniya",
      type: "Author",
      track: "AI & Machine Learning",
      status: "Confirmed",
      checkedIn: true,
      registrationDate: "2024-09-10",
      conference: "scse2024"
    },
    { 
      id: "P008", 
      name: "Prof. Sarah Johnson", 
      email: "sarah.j@mit.edu",
      organization: "MIT",
      type: "Author",
      track: "IoT",
      status: "Confirmed",
      checkedIn: false,
      registrationDate: "2025-10-12",
      conference: "icet2025"
    },
  ];

  // Sample data - Papers & Publications
  const allPaperData = [
    { 
      id: "P001", 
      title: "Deep Learning Applications in Healthcare", 
      authors: "Dr. Sunil Perera, Dr. A. Wijesinghe",
      organization: "University of Kelaniya",
      track: "AI & Machine Learning",
      submissionDate: "2025-08-15",
      status: "Accepted",
      sessionScore: 8.5,
      reviewerScore: 8.2,
      conference: "scse2025"
    },
    { 
      id: "P002", 
      title: "Autonomous Robotics for Agriculture", 
      authors: "Ms. Amara Silva, Prof. K. Fernando",
      organization: "University of Colombo",
      track: "Robotics",
      submissionDate: "2025-08-20",
      status: "Accepted",
      sessionScore: 8.8,
      reviewerScore: 8.6,
      conference: "scse2025"
    },
    { 
      id: "P003", 
      title: "Renewable Energy Grid Integration", 
      authors: "Prof. Nimal Fernando",
      organization: "University of Moratuwa",
      track: "Energy Systems",
      submissionDate: "2025-08-25",
      status: "Accepted",
      sessionScore: 7.9,
      reviewerScore: 8.0,
      conference: "icaps2025"
    },
    { 
      id: "P004", 
      title: "Quantum Algorithms for Optimization", 
      authors: "Dr. Jane Smith, Dr. M. Johnson",
      organization: "Stanford University",
      track: "Quantum Computing",
      submissionDate: "2025-09-01",
      status: "Under Review",
      sessionScore: 0,
      reviewerScore: 7.5,
      conference: "icaps2025"
    },
    { 
      id: "P005", 
      title: "Neural Network Architectures for NLP", 
      authors: "Dr. Chamara Jayawardena",
      organization: "University of Kelaniya",
      track: "AI & Machine Learning",
      submissionDate: "2025-08-10",
      status: "Accepted",
      sessionScore: 8.3,
      reviewerScore: 8.4,
      conference: "scse2025"
    },
    { 
      id: "P006", 
      title: "Computer Vision for Medical Diagnosis", 
      authors: "Dr. Kamal Bandara, Dr. L. Silva",
      organization: "University of Kelaniya",
      track: "AI & Machine Learning",
      submissionDate: "2024-08-05",
      status: "Accepted",
      sessionScore: 8.1,
      reviewerScore: 8.0,
      conference: "scse2024"
    },
    { 
      id: "P007", 
      title: "IoT Security Framework for Smart Cities", 
      authors: "Prof. Sarah Johnson",
      organization: "MIT",
      track: "IoT",
      submissionDate: "2025-09-15",
      status: "Accepted",
      sessionScore: 8.7,
      reviewerScore: 8.5,
      conference: "icet2025"
    },
  ];

  // Sample data - Catering (Meal Preferences) - linked to registration
  const allCateringData = [
    { participantId: "P001", name: "Dr. Sunil Perera", mealType: "Vegetarian", conference: "scse2025" },
    { participantId: "P002", name: "Ms. Amara Silva", mealType: "Vegetarian", conference: "scse2025" },
    { participantId: "P003", name: "Prof. Nimal Fernando", mealType: "Non-Vegetarian", conference: "icaps2025" },
    { participantId: "P004", name: "Dr. Jane Smith", mealType: "Vegetarian", conference: "icaps2025" },
    { participantId: "P005", name: "Dr. Chamara Jayawardena", mealType: "Non-Vegetarian", conference: "scse2025" },
    { participantId: "P006", name: "Mr. Rajitha Dissanayake", mealType: "Vegetarian", conference: "scse2025" },
    { participantId: "P007", name: "Dr. Kamal Bandara", mealType: "Vegetarian", conference: "scse2024" },
    { participantId: "P008", name: "Prof. Sarah Johnson", mealType: "Non-Vegetarian", conference: "icet2025" },
  ];

  // Sample data - Awards & Evaluations
  const allAwardData = [
    { 
      paperId: "P002", 
      title: "Autonomous Robotics for Agriculture", 
      authors: "Ms. Amara Silva, Prof. K. Fernando",
      track: "Robotics",
      avgScore: 8.8,
      award: "Best Paper",
      evaluator1: 8.5,
      evaluator2: 9.0,
      evaluator3: 9.0,
      remarks: "Excellent practical implementation and innovation",
      conference: "scse2025"
    },
    { 
      paperId: "P001", 
      title: "Deep Learning Applications in Healthcare", 
      authors: "Dr. Sunil Perera, Dr. A. Wijesinghe",
      track: "AI & Machine Learning",
      avgScore: 8.5,
      award: "Best Track Paper",
      evaluator1: 8.0,
      evaluator2: 8.5,
      evaluator3: 9.0,
      remarks: "Strong research methodology",
      conference: "scse2025"
    },
    { 
      paperId: "P003", 
      title: "Renewable Energy Grid Integration", 
      authors: "Prof. Nimal Fernando",
      track: "Energy Systems",
      avgScore: 7.9,
      award: "-",
      evaluator1: 8.0,
      evaluator2: 7.5,
      evaluator3: 8.2,
      remarks: "Good contribution to field",
      conference: "icaps2025"
    },
    { 
      paperId: "P006", 
      title: "Computer Vision for Medical Diagnosis", 
      authors: "Dr. Kamal Bandara, Dr. L. Silva",
      track: "AI & Machine Learning",
      avgScore: 8.1,
      award: "Best Track Paper",
      evaluator1: 8.0,
      evaluator2: 8.2,
      evaluator3: 8.1,
      remarks: "Innovative approach to medical imaging",
      conference: "scse2024"
    },
  ];

  // Sample data - Workshop Management
  const allWorkshopData = [
    { 
      id: "W001", 
      topic: "AI & Machine Learning Fundamentals", 
      instructor: "Dr. A. Wijesinghe",
      date: "2025-11-15",
      fee: 5000,
      capacity: 50,
      registered: 45,
      attended: 42,
      conference: "scse2025"
    },
    { 
      id: "W002", 
      topic: "Advanced Robotics Programming", 
      instructor: "Prof. K. Fernando",
      date: "2025-11-16",
      fee: 6000,
      capacity: 40,
      registered: 38,
      attended: 35,
      conference: "scse2025"
    },
    { 
      id: "W003", 
      topic: "Quantum Computing Basics", 
      instructor: "Dr. M. Johnson",
      date: "2025-11-17",
      fee: 7000,
      capacity: 30,
      registered: 28,
      attended: 25,
      conference: "icaps2025"
    },
    { 
      id: "W004", 
      topic: "IoT Security Best Practices", 
      instructor: "Prof. Sarah Johnson",
      date: "2025-11-20",
      fee: 8000,
      capacity: 35,
      registered: 30,
      attended: 28,
      conference: "icet2025"
    },
  ];

  // Filtering logic using useMemo
  const financialData = useMemo(() => {
    let filtered = allFinancialData;
    
    // Filter by conference
    if (selectedConference !== "all") {
      filtered = filtered.filter(item => item.conference === selectedConference);
    }
    
    // Filter by payment status
    if (selectedPaymentStatus !== "all") {
      filtered = filtered.filter(item => item.status === selectedPaymentStatus);
    }
    
    // Filter by payment type
    if (selectedPaymentType !== "all") {
      filtered = filtered.filter(item => item.paymentType === selectedPaymentType);
    }
    
    // Filter by participant type
    if (selectedParticipantType !== "all") {
      filtered = filtered.filter(item => item.type === selectedParticipantType);
    }
    
    // Filter by date range
    if (dateRange !== "all") {
      const today = new Date();
      const itemDate = new Date(filtered[0]?.date || today);
      
      if (dateRange === "this_week") {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(item => new Date(item.date) >= weekAgo);
      } else if (dateRange === "this_month") {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(item => new Date(item.date) >= monthAgo);
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [selectedConference, selectedPaymentStatus, selectedPaymentType, selectedParticipantType, dateRange, searchQuery]);

  const registrationData = useMemo(() => {
    let filtered = allRegistrationData;
    
    // Filter by conference
    if (selectedConference !== "all") {
      filtered = filtered.filter(item => item.conference === selectedConference);
    }
    
    // Filter by track
    if (selectedTrack !== "all") {
      filtered = filtered.filter(item => item.track === selectedTrack);
    }
    
    // Filter by participant type
    if (selectedParticipantType !== "all") {
      filtered = filtered.filter(item => item.type === selectedParticipantType);
    }
    
    // Filter by organization
    if (selectedOrganization !== "all") {
      filtered = filtered.filter(item => item.organization === selectedOrganization);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [selectedConference, selectedTrack, selectedParticipantType, selectedOrganization, searchQuery]);

  const paperData = useMemo(() => {
    let filtered = allPaperData;
    
    // Filter by conference
    if (selectedConference !== "all") {
      filtered = filtered.filter(item => item.conference === selectedConference);
    }
    
    // Filter by track
    if (selectedTrack !== "all") {
      filtered = filtered.filter(item => item.track === selectedTrack);
    }
    
    // Filter by organization
    if (selectedOrganization !== "all") {
      filtered = filtered.filter(item => item.organization === selectedOrganization);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [selectedConference, selectedTrack, selectedOrganization, searchQuery]);

  const workshopData = useMemo(() => {
    let filtered = allWorkshopData;
    
    // Filter by conference
    if (selectedConference !== "all") {
      filtered = filtered.filter(item => item.conference === selectedConference);
    }
    
    // Filter by workshop
    if (selectedWorkshop !== "all") {
      filtered = filtered.filter(item => item.id === selectedWorkshop);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [selectedConference, selectedWorkshop, searchQuery]);

  // Recalculate payment breakdown based on filtered data
  const paymentBreakdownData = useMemo(() => {
    const breakdown: { [key: string]: { value: number, count: number } } = {};
    
    financialData.forEach(item => {
      const amount = item.currency === "LKR" ? item.amount : item.amount * 300;
      if (!breakdown[item.paymentType]) {
        breakdown[item.paymentType] = { value: 0, count: 0 };
      }
      breakdown[item.paymentType].value += amount;
      breakdown[item.paymentType].count += 1;
    });
    
    return Object.entries(breakdown).map(([name, data]) => ({
      name,
      value: data.value,
      count: data.count
    }));
  }, [financialData]);

  // Recalculate discount breakdown based on filtered data
  const discountBreakdownData = useMemo(() => {
    const breakdown: { [key: string]: { value: number, count: number } } = {};
    
    financialData.forEach(item => {
      const amount = item.currency === "LKR" ? item.amount : item.amount * 300;
      const discountType = item.discount.split(' ')[0]; // Get first word (Student, IEEE, Early, None)
      if (!breakdown[discountType]) {
        breakdown[discountType] = { value: 0, count: 0 };
      }
      breakdown[discountType].value += amount;
      breakdown[discountType].count += 1;
    });
    
    return Object.entries(breakdown).map(([name, data]) => ({
      name,
      value: data.value,
      count: data.count
    }));
  }, [financialData]);

  // Recalculate attendance stats based on filtered data
  const attendanceStatsData = useMemo(() => {
    const checkedIn = registrationData.filter(p => p.checkedIn).length;
    const notCheckedIn = registrationData.filter(p => !p.checkedIn).length;
    
    return [
      { name: "Checked In", value: checkedIn },
      { name: "Not Checked In", value: notCheckedIn }
    ];
  }, [registrationData]);

  // Recalculate papers by organization based on filtered data
  const papersByOrganizationData = useMemo(() => {
    const orgBreakdown: { [key: string]: { internal: number, external: number } } = {};
    
    paperData.forEach(paper => {
      const isLocal = paper.organization.includes("University of");
      const orgName = isLocal ? paper.organization : "International";
      
      if (!orgBreakdown[orgName]) {
        orgBreakdown[orgName] = { internal: 0, external: 0 };
      }
      
      if (isLocal) {
        orgBreakdown[orgName].internal += 1;
      } else {
        orgBreakdown[orgName].external += 1;
      }
    });
    
    return Object.entries(orgBreakdown).map(([name, data]) => ({
      name,
      internal: data.internal,
      external: data.external
    }));
  }, [paperData]);

  const workshopAttendanceData = useMemo(() => 
    workshopData.map(w => ({
      name: w.topic.substring(0, 20) + "...",
      registered: w.registered,
      attended: w.attended
    }))
  , [workshopData]);

  // Filter catering data
  const cateringData = useMemo(() => {
    let filtered = allCateringData;
    
    // Filter by conference
    if (selectedConference !== "all") {
      filtered = filtered.filter(item => item.conference === selectedConference);
    }
    
    // Filter by meal type
    if (selectedMealType !== "all") {
      filtered = filtered.filter(item => item.mealType === selectedMealType);
    }
    
    // Calculate meal type breakdown
    const breakdown: { [key: string]: number } = {};
    filtered.forEach(item => {
      breakdown[item.mealType] = (breakdown[item.mealType] || 0) + 1;
    });
    
    const total = filtered.length || 1;
    return Object.entries(breakdown).map(([type, count]) => ({
      type,
      count,
      percentage: (count / total) * 100
    }));
  }, [selectedConference, selectedMealType]);

  // Filter award data
  const awardData = useMemo(() => {
    let filtered = allAwardData;
    
    // Filter by conference
    if (selectedConference !== "all") {
      filtered = filtered.filter(item => item.conference === selectedConference);
    }
    
    // Filter by track
    if (selectedTrack !== "all") {
      filtered = filtered.filter(item => item.track === selectedTrack);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.paperId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [selectedConference, selectedTrack, searchQuery]);

  // Chart colors
  const COLORS = ['#F5C518', '#4B0101', '#FFD740', '#1E1E1E', '#737373', '#E53E3E'];

  const handlePreviewReport = (reportType: string) => {
    setActiveReportType(reportType);
    setIsPreviewDialogOpen(true);
  };

  const handleGeneratePDF = () => {
    setIsPreviewDialogOpen(false);
    toast.success(`${activeReportType.charAt(0).toUpperCase() + activeReportType.slice(1)} Report PDF generated successfully!`);
  };

  const handleExportExcel = () => {
    setIsPreviewDialogOpen(false);
    toast.success(`${activeReportType.charAt(0).toUpperCase() + activeReportType.slice(1)} Report Excel exported successfully!`);
  };

  const handleBackToDashboard = () => {
    if (userRole === "admin") {
      onNavigate("admin-dashboard");
    } else {
      onNavigate("organizer-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-sidebar border-b border-sidebar-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white tracking-wide" style={{ fontWeight: 600 }}>
                  Confiera Report Generation
                </div>
                <div className="text-xs text-gray-400">
                  {userRole === "admin" ? "Admin Panel - All Conferences" : `Organizer Panel - ${availableConferences.length} Assigned Conference${availableConferences.length > 1 ? 's' : ''}`}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-gray-600 text-white hover:bg-sidebar-accent"
              onClick={handleBackToDashboard}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-primary mb-2">Report Generation & Analytics</h1>
          <p className="text-muted-foreground">
            Generate comprehensive reports and analyze conference data with interactive filters and visualizations
          </p>
          {userRole === "organizer" && (
            <div className="mt-4 bg-accent/10 border border-accent/30 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <span style={{ fontWeight: 600 }}>Note:</span> As an organizer, you can only generate reports for your assigned conferences: {availableConferences.map(c => c.name).join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* Main Tabs for Report Types */}
        <Tabs defaultValue="financial" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-1">
            <TabsTrigger value="financial" className="gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Financial</span>
            </TabsTrigger>
            <TabsTrigger value="registration" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Registration</span>
            </TabsTrigger>
            <TabsTrigger value="papers" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Papers</span>
            </TabsTrigger>
            <TabsTrigger value="catering" className="gap-2">
              <Utensils className="w-4 h-4" />
              <span className="hidden sm:inline">Catering</span>
            </TabsTrigger>
            <TabsTrigger value="awards" className="gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Awards</span>
            </TabsTrigger>
            <TabsTrigger value="workshops" className="gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Workshops</span>
            </TabsTrigger>
          </TabsList>

          {/* FINANCIAL REPORTS TAB */}
          <TabsContent value="financial" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  Financial Report Filters
                </CardTitle>
                <CardDescription>Filter financial data by date, payment type, and participant category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Conference</Label>
                    <Select value={selectedConference} onValueChange={setSelectedConference}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Conference" />
                      </SelectTrigger>
                      <SelectContent>
                        {userRole === "admin" && <SelectItem value="all">All Conferences</SelectItem>}
                        {availableConferences.map((conf) => (
                          <SelectItem key={conf.id} value={conf.id}>
                            {conf.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Type</Label>
                    <Select value={selectedPaymentType} onValueChange={setSelectedPaymentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Payment Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="online">Online Banking</SelectItem>
                        <SelectItem value="transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Status</Label>
                    <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Date Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-green-600" style={{ fontWeight: 600 }}>LKR 720,000</div>
                  <p className="text-xs text-muted-foreground mt-1">From 180 registrations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Pending Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-amber-600" style={{ fontWeight: 600 }}>LKR 90,000</div>
                  <p className="text-xs text-muted-foreground mt-1">25 pending payments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Total Discounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-blue-600" style={{ fontWeight: 600 }}>LKR 450,000</div>
                  <p className="text-xs text-muted-foreground mt-1">130 discounted registrations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Payment Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl" style={{ fontWeight: 600 }}>94.2%</div>
                  <p className="text-xs text-green-600 mt-1">155 of 165 successful</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method Distribution</CardTitle>
                  <CardDescription>Revenue and count by payment method</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={paymentBreakdownData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                      formatter={(value) => {if (typeof value === "number") {
                        return `LKR ${value.toLocaleString()}`;
                      }
                      return value;
                      }}
                      />

                      <Legend />
                      <Bar dataKey="value" fill="#4B0101" name="Revenue (LKR)" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                    {paymentBreakdownData.map((item, idx) => (
                      <div key={idx} className="text-center p-2 bg-secondary rounded">
                        <div className="text-muted-foreground">{item.name}</div>
                        <div style={{ fontWeight: 600 }}>{item.count} payments</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Discount Distribution</CardTitle>
                  <CardDescription>Discounts applied by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={discountBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>percent !== undefined ? `${name} ${(percent * 100).toFixed(0)}%` : name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {discountBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                      formatter={(value) => {
                        if (typeof value === "number") {
                          return `LKR ${value.toLocaleString()}`;
                        }
                        return value;
                        }}
                        />

                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Financial Data Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payment Transactions</CardTitle>
                    <CardDescription>Detailed list of all payment transactions ({financialData.length} records)</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white gap-2"
                      onClick={() => handlePreviewReport("financial")}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={handleExportExcel}
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reg ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {financialData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-mono text-sm">{row.id}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{row.type}</Badge>
                          </TableCell>
                          <TableCell style={{ fontWeight: 600 }}>
                            {row.currency} {row.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm">{row.paymentType}</TableCell>
                          <TableCell>
                            <Badge
                              className={row.status === "Paid" ? "bg-green-600 text-white" : "bg-amber-500 text-white"}
                            >
                              {row.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{row.discount}</TableCell>
                          <TableCell className="text-sm">{row.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REGISTRATION & ATTENDANCE TAB */}
          <TabsContent value="registration" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  Registration Report Filters
                </CardTitle>
                <CardDescription>Filter participants by track, organization, and registration status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label>Conference</Label>
                    <Select value={selectedConference} onValueChange={setSelectedConference}>
                      <SelectTrigger>
                        <SelectValue placeholder="Conference" />
                      </SelectTrigger>
                      <SelectContent>
                        {userRole === "admin" && <SelectItem value="all">All Conferences</SelectItem>}
                        {availableConferences.map((conf) => (
                          <SelectItem key={conf.id} value={conf.id}>
                            {conf.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Track</Label>
                    <Select value={selectedTrack} onValueChange={setSelectedTrack}>
                      <SelectTrigger>
                        <SelectValue placeholder="Track" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tracks</SelectItem>
                        <SelectItem value="ai">AI & Machine Learning</SelectItem>
                        <SelectItem value="robotics">Robotics</SelectItem>
                        <SelectItem value="energy">Energy Systems</SelectItem>
                        <SelectItem value="quantum">Quantum Computing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Organization</Label>
                    <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
                      <SelectTrigger>
                        <SelectValue placeholder="Organization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Organizations</SelectItem>
                        <SelectItem value="uok">University of Kelaniya</SelectItem>
                        <SelectItem value="colombo">University of Colombo</SelectItem>
                        <SelectItem value="moratuwa">University of Moratuwa</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Participant Type</Label>
                    <Select value={selectedParticipantType} onValueChange={setSelectedParticipantType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="author">Author</SelectItem>
                        <SelectItem value="participant">Participant</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Total Registered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl" style={{ fontWeight: 600 }}>150</div>
                  <p className="text-xs text-muted-foreground mt-1">All participants</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Confirmed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-green-600" style={{ fontWeight: 600 }}>135</div>
                  <p className="text-xs text-muted-foreground mt-1">90% confirmation rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Checked In</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-blue-600" style={{ fontWeight: 600 }}>120</div>
                  <p className="text-xs text-muted-foreground mt-1">80% attendance</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-amber-600" style={{ fontWeight: 600 }}>15</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
                </CardContent>
              </Card>
            </div>

            {/* Attendance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Check-in Status</CardTitle>
                <CardDescription>Participant attendance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={attendanceStatsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => percent !== undefined ? `${name} ${(percent * 100).toFixed(0)}%` : name}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {attendanceStatsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#22c55e' : '#f59e0b'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Registration Data Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Participant Registry</CardTitle>
                    <CardDescription>Complete list of registered participants ({registrationData.length} records)</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white gap-2"
                      onClick={() => handlePreviewReport("registration")}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={handleExportExcel}
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Track</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Check-in</TableHead>
                        <TableHead>Reg Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrationData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-mono text-sm">{row.id}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell className="text-sm">{row.email}</TableCell>
                          <TableCell className="text-sm">{row.organization}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{row.type}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{row.track}</TableCell>
                          <TableCell>
                            <Badge
                              className={row.status === "Confirmed" ? "bg-green-600 text-white" : "bg-amber-500 text-white"}
                            >
                              {row.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {row.checkedIn ? (
                              <Badge className="bg-blue-600 text-white">✓ Checked In</Badge>
                            ) : (
                              <Badge variant="outline">Not Yet</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">{row.registrationDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PAPERS & PUBLICATIONS TAB */}
          <TabsContent value="papers" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  Paper & Publication Filters
                </CardTitle>
                <CardDescription>Filter papers by track, organization, and review status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Conference</Label>
                    <Select value={selectedConference} onValueChange={setSelectedConference}>
                      <SelectTrigger>
                        <SelectValue placeholder="Conference" />
                      </SelectTrigger>
                      <SelectContent>
                        {userRole === "admin" && <SelectItem value="all">All Conferences</SelectItem>}
                        {availableConferences.map((conf) => (
                          <SelectItem key={conf.id} value={conf.id}>
                            {conf.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Track</Label>
                    <Select value={selectedTrack} onValueChange={setSelectedTrack}>
                      <SelectTrigger>
                        <SelectValue placeholder="Track" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tracks</SelectItem>
                        <SelectItem value="ai">AI & Machine Learning</SelectItem>
                        <SelectItem value="robotics">Robotics</SelectItem>
                        <SelectItem value="energy">Energy Systems</SelectItem>
                        <SelectItem value="quantum">Quantum Computing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Organization</Label>
                    <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
                      <SelectTrigger>
                        <SelectValue placeholder="Organization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Organizations</SelectItem>
                        <SelectItem value="internal">Internal (UoK)</SelectItem>
                        <SelectItem value="local">Local Universities</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search papers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Paper Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Total Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl" style={{ fontWeight: 600 }}>45</div>
                  <p className="text-xs text-muted-foreground mt-1">All papers submitted</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Accepted Papers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-green-600" style={{ fontWeight: 600 }}>32</div>
                  <p className="text-xs text-muted-foreground mt-1">71% acceptance rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Under Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-amber-600" style={{ fontWeight: 600 }}>8</div>
                  <p className="text-xs text-muted-foreground mt-1">Pending evaluation</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Avg Session Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-blue-600" style={{ fontWeight: 600 }}>8.2</div>
                  <p className="text-xs text-muted-foreground mt-1">Out of 10</p>
                </CardContent>
              </Card>
            </div>

            {/* Papers by Organization Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Papers by Organization</CardTitle>
                <CardDescription>Internal vs External submissions comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={papersByOrganizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="internal" fill="#4B0101" name="Internal" stackId="a" />
                    <Bar dataKey="external" fill="#F5C518" name="External" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Papers Data Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Paper Submissions</CardTitle>
                    <CardDescription>Detailed list of all submitted papers ({paperData.length} records)</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white gap-2"
                      onClick={() => handlePreviewReport("papers")}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={handleExportExcel}
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Paper ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Authors</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Track</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Session Score</TableHead>
                        <TableHead>Review Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paperData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-mono text-sm">{row.id}</TableCell>
                          <TableCell className="max-w-xs">
                            <div style={{ fontWeight: 500 }}>{row.title}</div>
                          </TableCell>
                          <TableCell className="text-sm">{row.authors}</TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-muted-foreground" />
                              {row.organization}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{row.track}</TableCell>
                          <TableCell>
                            <Badge
                              className={row.status === "Accepted" ? "bg-green-600 text-white" : "bg-amber-500 text-white"}
                            >
                              {row.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono">
                            {row.sessionScore > 0 ? (
                              <span className="text-blue-600" style={{ fontWeight: 600 }}>{row.sessionScore}</span>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="font-mono" style={{ fontWeight: 600 }}>{row.reviewerScore}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CATERING (MEAL PREFERENCES) TAB */}
          <TabsContent value="catering" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  Catering Report Filters
                </CardTitle>
                <CardDescription>Filter meal preferences by conference and participant type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Conference</Label>
                    <Select value={selectedConference} onValueChange={setSelectedConference}>
                      <SelectTrigger>
                        <SelectValue placeholder="Conference" />
                      </SelectTrigger>
                      <SelectContent>
                        {userRole === "admin" && <SelectItem value="all">All Conferences</SelectItem>}
                        {availableConferences.map((conf) => (
                          <SelectItem key={conf.id} value={conf.id}>
                            {conf.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Meal Type</Label>
                    <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Meal Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="veg">Vegetarian</SelectItem>
                        <SelectItem value="nonveg">Non-Vegetarian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Participant Type</Label>
                    <Select value={selectedParticipantType} onValueChange={setSelectedParticipantType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="author">Author</SelectItem>
                        <SelectItem value="participant">Participant</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meal Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Total Participants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl" style={{ fontWeight: 600 }}>150</div>
                  <p className="text-xs text-muted-foreground mt-1">With meal preferences</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Vegetarian</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-green-600" style={{ fontWeight: 600 }}>85</div>
                  <p className="text-xs text-muted-foreground mt-1">56.7% of participants</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Non-Vegetarian</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-red-600" style={{ fontWeight: 600 }}>65</div>
                  <p className="text-xs text-muted-foreground mt-1">43.3% of participants</p>
                </CardContent>
              </Card>
            </div>

            {/* Meal Distribution Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Meal Preference Distribution</CardTitle>
                  <CardDescription>Visual breakdown of meal choices</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={cateringData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ payload }) => {
                          if (!payload) return "";
                          const { type, count, percentage } = payload as {
                            type: string;
                            count: number;
                            percentage: number;
                          };
                          return `${type}: ${count} (${percentage.toFixed(1)}%)`;
                        }}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        <Cell fill="#22c55e" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Catering Summary</CardTitle>
                  <CardDescription>Quick overview for catering arrangements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Utensils className="w-5 h-5 text-green-600" />
                          <span style={{ fontWeight: 600 }}>Vegetarian Meals</span>
                        </div>
                        <Badge className="bg-green-600 text-white">85 servings</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        56.7% of total participants
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Utensils className="w-5 h-5 text-red-600" />
                          <span style={{ fontWeight: 600 }}>Non-Vegetarian Meals</span>
                        </div>
                        <Badge className="bg-red-600 text-white">65 servings</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        43.3% of total participants
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span style={{ fontWeight: 600 }}>Total Meals Required</span>
                        <span className="text-xl text-blue-600" style={{ fontWeight: 600 }}>150</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Export Actions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Export Catering Report</CardTitle>
                    <CardDescription>Download meal preference data for catering team</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white gap-2"
                      onClick={() => handlePreviewReport("catering")}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={handleExportExcel}
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </TabsContent>

          {/* AWARDS & EVALUATIONS TAB */}
          <TabsContent value="awards" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  Award & Evaluation Filters
                </CardTitle>
                <CardDescription>Filter awards by track and evaluation scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Conference</Label>
                    <Select value={selectedConference} onValueChange={setSelectedConference}>
                      <SelectTrigger>
                        <SelectValue placeholder="Conference" />
                      </SelectTrigger>
                      <SelectContent>
                        {userRole === "admin" && <SelectItem value="all">All Conferences</SelectItem>}
                        {availableConferences.map((conf) => (
                          <SelectItem key={conf.id} value={conf.id}>
                            {conf.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Track</Label>
                    <Select value={selectedTrack} onValueChange={setSelectedTrack}>
                      <SelectTrigger>
                        <SelectValue placeholder="Track" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tracks</SelectItem>
                        <SelectItem value="ai">AI & Machine Learning</SelectItem>
                        <SelectItem value="robotics">Robotics</SelectItem>
                        <SelectItem value="energy">Energy Systems</SelectItem>
                        <SelectItem value="quantum">Quantum Computing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search papers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Award Winners Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 border-accent">
                <CardHeader className="bg-accent/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent" />
                    <CardTitle className="text-sm">Best Paper Award</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div style={{ fontWeight: 600 }} className="mb-1">Autonomous Robotics for Agriculture</div>
                  <div className="text-sm text-muted-foreground mb-2">Ms. Amara Silva, Prof. K. Fernando</div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-accent text-accent-foreground">Score: 8.8</Badge>
                    <Badge variant="outline">Robotics</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-600">
                <CardHeader className="bg-blue-50 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-sm">Best Track Paper</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div style={{ fontWeight: 600 }} className="mb-1">Deep Learning in Healthcare</div>
                  <div className="text-sm text-muted-foreground mb-2">Dr. Sunil Perera, Dr. A. Wijesinghe</div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600 text-white">Score: 8.5</Badge>
                    <Badge variant="outline">AI & ML</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-600">
                <CardHeader className="bg-green-50 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-sm">Best Student Paper</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div style={{ fontWeight: 600 }} className="mb-1">IoT for Smart Agriculture</div>
                  <div className="text-sm text-muted-foreground mb-2">Ms. Nethmi Perera</div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600 text-white">Score: 8.3</Badge>
                    <Badge variant="outline">Robotics</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Evaluation Data Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Paper Evaluations & Rankings</CardTitle>
                    <CardDescription>Detailed evaluation scores and panel feedback ({awardData.length} evaluated papers)</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white gap-2"
                      onClick={() => handlePreviewReport("awards")}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={handleExportExcel}
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Paper ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Authors</TableHead>
                        <TableHead>Track</TableHead>
                        <TableHead>Eval 1</TableHead>
                        <TableHead>Eval 2</TableHead>
                        <TableHead>Eval 3</TableHead>
                        <TableHead>Avg Score</TableHead>
                        <TableHead>Award</TableHead>
                        <TableHead>Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {awardData.map((row) => (
                        <TableRow key={row.paperId}>
                          <TableCell className="font-mono text-sm">{row.paperId}</TableCell>
                          <TableCell className="max-w-xs" style={{ fontWeight: 500 }}>{row.title}</TableCell>
                          <TableCell className="text-sm">{row.authors}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{row.track}</Badge>
                          </TableCell>
                          <TableCell className="font-mono">{row.evaluator1}</TableCell>
                          <TableCell className="font-mono">{row.evaluator2}</TableCell>
                          <TableCell className="font-mono">{row.evaluator3}</TableCell>
                          <TableCell>
                            <span className="text-blue-600 font-mono" style={{ fontWeight: 600 }}>{row.avgScore}</span>
                          </TableCell>
                          <TableCell>
                            {row.award !== "-" ? (
                              <Badge className="bg-accent text-accent-foreground">{row.award}</Badge>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="text-sm max-w-xs">{row.remarks}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* WORKSHOPS TAB */}
          <TabsContent value="workshops" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  Workshop Report Filters
                </CardTitle>
                <CardDescription>Filter workshops by conference and topic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Conference</Label>
                    <Select value={selectedConference} onValueChange={setSelectedConference}>
                      <SelectTrigger>
                        <SelectValue placeholder="Conference" />
                      </SelectTrigger>
                      <SelectContent>
                        {userRole === "admin" && <SelectItem value="all">All Conferences</SelectItem>}
                        {availableConferences.map((conf) => (
                          <SelectItem key={conf.id} value={conf.id}>
                            {conf.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Workshop</Label>
                    <Select value={selectedWorkshop} onValueChange={setSelectedWorkshop}>
                      <SelectTrigger>
                        <SelectValue placeholder="Workshop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Workshops</SelectItem>
                        <SelectItem value="ai">AI & Machine Learning</SelectItem>
                        <SelectItem value="robotics">Advanced Robotics</SelectItem>
                        <SelectItem value="quantum">Quantum Computing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search workshops..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workshop Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Total Workshops</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl" style={{ fontWeight: 600 }}>3</div>
                  <p className="text-xs text-muted-foreground mt-1">Available sessions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Total Capacity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl" style={{ fontWeight: 600 }}>120</div>
                  <p className="text-xs text-muted-foreground mt-1">Total seats</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Registered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-blue-600" style={{ fontWeight: 600 }}>111</div>
                  <p className="text-xs text-muted-foreground mt-1">92.5% capacity</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Attendance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-green-600" style={{ fontWeight: 600 }}>91.9%</div>
                  <p className="text-xs text-muted-foreground mt-1">102 of 111 attended</p>
                </CardContent>
              </Card>
            </div>

            {/* Workshop Attendance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Workshop Attendance Overview</CardTitle>
                <CardDescription>Registration vs attendance comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={workshopAttendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="registered" fill="#4B0101" name="Registered" />
                    <Bar dataKey="attended" fill="#22c55e" name="Attended" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Workshop Data Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Workshop Details</CardTitle>
                    <CardDescription>Complete list of workshops with attendance data ({workshopData.length} workshops)</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white gap-2"
                      onClick={() => handlePreviewReport("workshops")}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={handleExportExcel}
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Workshop ID</TableHead>
                        <TableHead>Topic</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Fee (LKR)</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead>Attended</TableHead>
                        <TableHead>Attendance %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workshopData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-mono text-sm">{row.id}</TableCell>
                          <TableCell style={{ fontWeight: 500 }}>{row.topic}</TableCell>
                          <TableCell className="text-sm">{row.instructor}</TableCell>
                          <TableCell className="text-sm">{row.date}</TableCell>
                          <TableCell style={{ fontWeight: 600 }}>{row.fee.toLocaleString()}</TableCell>
                          <TableCell>{row.capacity}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{row.registered}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-600 text-white">{row.attended}</Badge>
                          </TableCell>
                          <TableCell className="font-mono" style={{ fontWeight: 600 }}>
                            {((row.attended / row.registered) * 100).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {activeReportType.charAt(0).toUpperCase() + activeReportType.slice(1)} Report Preview
            </DialogTitle>
            <DialogDescription>
              Preview your report before downloading. Click export buttons below to generate PDF or Excel.
            </DialogDescription>
          </DialogHeader>
          
          <div className="border border-border rounded-lg p-8 bg-white shadow-sm space-y-6">
            {/* Report Header */}
            <div className="text-center space-y-3 pb-6 border-b-2 border-primary">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
              </div>
              <h2 className="text-primary" style={{ fontWeight: 600 }}>
                University of Kelaniya - Confiera
              </h2>
              <h3 style={{ fontWeight: 600 }}>
                {activeReportType.charAt(0).toUpperCase() + activeReportType.slice(1)} Report
              </h3>
              <div className="text-sm text-muted-foreground">
                Generated on {new Date().toLocaleDateString('en-GB')}
              </div>
            </div>

            {/* Report Information */}
            <div className="space-y-4">
              <h3 className="text-primary" style={{ fontWeight: 600 }}>Report Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Conference</div>
                  <div style={{ fontWeight: 500 }}>
                    {selectedConference === "all" 
                      ? "All Conferences" 
                      : availableConferences.find(c => c.id === selectedConference)?.name || "SCSE 2025"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Report Type</div>
                  <div style={{ fontWeight: 500 }}>
                    {activeReportType.charAt(0).toUpperCase() + activeReportType.slice(1)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Generated By</div>
                  <div style={{ fontWeight: 500 }}>
                    {userRole === "admin" ? "Admin User" : "Organizer User"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Report ID</div>
                  <div style={{ fontWeight: 500 }} className="font-mono">
                    RPT-{Date.now().toString().slice(-8)}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="space-y-4">
              <h3 className="text-primary" style={{ fontWeight: 600 }}>Summary Statistics</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-secondary p-4 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground mb-2">Total Records</div>
                  <div className="text-2xl" style={{ fontWeight: 600 }}>150</div>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                  <div className="text-sm text-green-700 mb-2">Completed</div>
                  <div className="text-2xl text-green-600" style={{ fontWeight: 600 }}>140</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-center">
                  <div className="text-sm text-amber-700 mb-2">Pending</div>
                  <div className="text-2xl text-amber-600" style={{ fontWeight: 600 }}>10</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                  <div className="text-sm text-blue-700 mb-2">Accuracy</div>
                  <div className="text-2xl text-blue-600" style={{ fontWeight: 600 }}>98%</div>
                </div>
              </div>
            </div>

            {/* Summary Footer */}
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <div className="text-center">
                <p style={{ fontWeight: 600 }} className="mb-2">Report Summary</p>
                <p className="text-sm text-muted-foreground">
                  This report contains comprehensive data for the selected filters and parameters. 
                  Export to PDF or Excel for detailed analysis and record keeping.
                </p>
              </div>
            </div>

            {/* Report Footer */}
            <div className="pt-4 border-t border-border text-center space-y-1">
              <p className="text-sm text-muted-foreground">
                Generated by Confiera Report Engine
              </p>
              <p className="text-sm text-muted-foreground">
                University of Kelaniya, Sri Lanka
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Close Preview
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-primary text-primary hover:bg-primary/10"
              onClick={handleExportExcel}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Download Excel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-white gap-2"
              onClick={handleGeneratePDF}
            >
              <FileDown className="w-4 h-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
