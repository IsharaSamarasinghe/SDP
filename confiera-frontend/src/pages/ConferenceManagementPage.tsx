import { useState } from "react";
import { Plus, Edit, Trash2, Calendar, MapPin, Users, GraduationCap, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";

interface ConferenceManagementPageProps {
  onNavigate: (page: string) => void;
}

interface ConferenceFees {
  localAuthorIEEE: { standard: number; earlyBird: number };
  localAuthorNonIEEE: { standard: number; earlyBird: number };
  internationalAuthorIEEE: { standard: number; earlyBird: number };
  internationalAuthorNonIEEE: { standard: number; earlyBird: number };
  localStudentIEEE: { standard: number; earlyBird: number };
  localStudentNonIEEE: { standard: number; earlyBird: number };
  participant: { standard: number; earlyBird: number };
}

interface Conference {
  id: string;
  name: string;
  shortName: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  registrationDeadline: string;
  paperDeadline: string;
  maxParticipants: number;
  currentParticipants: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  organizer: string;
  organizerId?: number;
  fees: ConferenceFees;
}

export function ConferenceManagementPage({ onNavigate }: ConferenceManagementPageProps) {
  const [conferences, setConferences] = useState<Conference[]>([
    {
      id: "scse2025",
      name: "Symposium on Computing, Science and Engineering 2025",
      shortName: "SCSE 2025",
      description: "Annual symposium focusing on cutting-edge research in computing, science, and engineering domains.",
      startDate: "2025-05-15",
      endDate: "2025-05-17",
      venue: "University of Kelaniya, Sri Lanka",
      registrationDeadline: "2025-04-30",
      paperDeadline: "2025-03-31",
      maxParticipants: 300,
      currentParticipants: 156,
      status: "upcoming",
      organizer: "Dr. Nimal Silva",
      fees: {
        localAuthorIEEE: { standard: 25000, earlyBird: 22500 },
        localAuthorNonIEEE: { standard: 35000, earlyBird: 30000 },
        internationalAuthorIEEE: { standard: 200, earlyBird: 150 },
        internationalAuthorNonIEEE: { standard: 275, earlyBird: 225 },
        localStudentIEEE: { standard: 22500, earlyBird: 18500 },
        localStudentNonIEEE: { standard: 30000, earlyBird: 25000 },
        participant: { standard: 5000, earlyBird: 5000 },
      },
    },
    {
      id: "icaps2025",
      name: "International Conference on Applied Psychology and Social Sciences 2025",
      shortName: "ICAPS 2025",
      description: "Exploring contemporary issues in psychology, sociology, and interdisciplinary social research.",
      startDate: "2025-06-10",
      endDate: "2025-06-12",
      venue: "University of Kelaniya, Sri Lanka",
      registrationDeadline: "2025-05-25",
      paperDeadline: "2025-04-30",
      maxParticipants: 250,
      currentParticipants: 89,
      status: "upcoming",
      organizer: "Prof. Anura Perera",
      fees: {
        localAuthorIEEE: { standard: 20000, earlyBird: 18000 },
        localAuthorNonIEEE: { standard: 30000, earlyBird: 25000 },
        internationalAuthorIEEE: { standard: 180, earlyBird: 140 },
        internationalAuthorNonIEEE: { standard: 250, earlyBird: 200 },
        localStudentIEEE: { standard: 18000, earlyBird: 15000 },
        localStudentNonIEEE: { standard: 25000, earlyBird: 20000 },
        participant: { standard: 4500, earlyBird: 4500 },
      },
    },
    {
      id: "scse2024",
      name: "Symposium on Computing, Science and Engineering 2024",
      shortName: "SCSE 2024",
      description: "Previous year's symposium on computing, science, and engineering.",
      startDate: "2024-05-20",
      endDate: "2024-05-22",
      venue: "University of Kelaniya, Sri Lanka",
      registrationDeadline: "2024-05-05",
      paperDeadline: "2024-04-05",
      maxParticipants: 300,
      currentParticipants: 280,
      status: "completed",
      organizer: "Dr. Nimal Silva",
      fees: {
        localAuthorIEEE: { standard: 24000, earlyBird: 21000 },
        localAuthorNonIEEE: { standard: 33000, earlyBird: 28000 },
        internationalAuthorIEEE: { standard: 190, earlyBird: 145 },
        internationalAuthorNonIEEE: { standard: 265, earlyBird: 215 },
        localStudentIEEE: { standard: 21000, earlyBird: 17500 },
        localStudentNonIEEE: { standard: 28000, earlyBird: 23000 },
        participant: { standard: 4800, earlyBird: 4800 },
      },
    },
    {
      id: "icet2025",
      name: "International Conference on Educational Technology 2025",
      shortName: "ICET 2025",
      description: "Innovations and best practices in educational technology and e-learning.",
      startDate: "2025-07-08",
      endDate: "2025-07-10",
      venue: "University of Kelaniya, Sri Lanka",
      registrationDeadline: "2025-06-20",
      paperDeadline: "2025-05-30",
      maxParticipants: 200,
      currentParticipants: 45,
      status: "upcoming",
      organizer: "Dr. Kamala Jayasinghe",
      fees: {
        localAuthorIEEE: { standard: 22000, earlyBird: 19500 },
        localAuthorNonIEEE: { standard: 32000, earlyBird: 27000 },
        internationalAuthorIEEE: { standard: 175, earlyBird: 135 },
        internationalAuthorNonIEEE: { standard: 240, earlyBird: 195 },
        localStudentIEEE: { standard: 20000, earlyBird: 16500 },
        localStudentNonIEEE: { standard: 27000, earlyBird: 22000 },
        participant: { standard: 4200, earlyBird: 4200 },
      },
    },
  ]);

  // Available organizers list (in real app, this would come from a shared state/API)
  const allOrganizers = [
    { id: 1, firstName: "Nimal", lastName: "Silva", email: "nimal.silva@kln.ac.lk", assignedConference: "scse2025" },
    { id: 2, firstName: "Anura", lastName: "Perera", email: "anura.perera@kln.ac.lk", assignedConference: "icaps2025" },
    { id: 3, firstName: "Kamala", lastName: "Jayasinghe", email: "kamala.j@kln.ac.lk", assignedConference: "icet2025" },
    { id: 4, firstName: "Sunil", lastName: "Fernando", email: "sunil.f@kln.ac.lk", assignedConference: null },
    { id: 5, firstName: "Priya", lastName: "Wickramasinghe", email: "priya.w@kln.ac.lk", assignedConference: null },
  ];

  // Get organizers that are not assigned to any conference or assigned to current conference
  const getAvailableOrganizers = (currentConferenceId?: string) => {
    return allOrganizers.filter(org => 
      org.assignedConference === null || org.assignedConference === currentConferenceId
    );
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [formData, setFormData] = useState<Partial<Conference>>({});

  const handleBackToDashboard = () => {
    onNavigate("admin-dashboard");
  };

  const handleCreateConference = () => {
    setFormData({
      status: "upcoming",
      currentParticipants: 0,
      fees: {
        localAuthorIEEE: { standard: 25000, earlyBird: 22500 },
        localAuthorNonIEEE: { standard: 35000, earlyBird: 30000 },
        internationalAuthorIEEE: { standard: 200, earlyBird: 150 },
        internationalAuthorNonIEEE: { standard: 275, earlyBird: 225 },
        localStudentIEEE: { standard: 22500, earlyBird: 18500 },
        localStudentNonIEEE: { standard: 30000, earlyBird: 25000 },
        participant: { standard: 5000, earlyBird: 5000 },
      },
    });
    setIsCreateDialogOpen(true);
  };

  const handleEditConference = (conference: Conference) => {
    setSelectedConference(conference);
    setFormData(conference);
    setIsEditDialogOpen(true);
  };

  const handleDeleteConference = (conference: Conference) => {
    setSelectedConference(conference);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveNewConference = () => {
    if (!formData.name || !formData.shortName || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.organizer) {
      toast.error("Please assign an organizer to this conference");
      return;
    }

    const newConference: Conference = {
      id: formData.shortName?.toLowerCase().replace(/\s+/g, "") || "",
      name: formData.name || "",
      shortName: formData.shortName || "",
      description: formData.description || "",
      startDate: formData.startDate || "",
      endDate: formData.endDate || "",
      venue: formData.venue || "",
      registrationDeadline: formData.registrationDeadline || "",
      paperDeadline: formData.paperDeadline || "",
      maxParticipants: formData.maxParticipants || 100,
      currentParticipants: 0,
      status: formData.status as any || "upcoming",
      organizer: formData.organizer || "",
      organizerId: formData.organizerId,
      fees: formData.fees || {
        localAuthorIEEE: { standard: 25000, earlyBird: 22500 },
        localAuthorNonIEEE: { standard: 35000, earlyBird: 30000 },
        internationalAuthorIEEE: { standard: 200, earlyBird: 150 },
        internationalAuthorNonIEEE: { standard: 275, earlyBird: 225 },
        localStudentIEEE: { standard: 22500, earlyBird: 18500 },
        localStudentNonIEEE: { standard: 30000, earlyBird: 25000 },
        participant: { standard: 5000, earlyBird: 5000 },
      },
    };

    setConferences([...conferences, newConference]);
    setIsCreateDialogOpen(false);
    setFormData({});
    toast.success(`Conference created successfully! Assigned to ${formData.organizer}`);
  };

  const handleSaveEditConference = () => {
    if (!selectedConference) return;

    const updatedConferences = conferences.map((conf) =>
      conf.id === selectedConference.id ? { ...conf, ...formData } : conf
    );

    setConferences(updatedConferences);
    setIsEditDialogOpen(false);
    setFormData({});
    setSelectedConference(null);
    toast.success("Conference updated successfully");
  };

  const handleConfirmDelete = () => {
    if (!selectedConference) return;

    const updatedConferences = conferences.filter((conf) => conf.id !== selectedConference.id);
    setConferences(updatedConferences);
    setIsDeleteDialogOpen(false);
    setSelectedConference(null);
    toast.success("Conference deleted successfully");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500";
      case "ongoing":
        return "bg-green-500";
      case "completed":
        return "bg-gray-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredConferences = conferences.filter((conf) =>
    conf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conf.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conf.organizer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-sidebar border-b border-sidebar-border sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white tracking-wide" style={{ fontWeight: 600 }}>
                  Conference Management
                </div>
                <div className="text-xs text-gray-400">Admin Panel</div>
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-primary mb-2">Conference Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage all conferences in the system
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search conferences by name, short name, or organizer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleCreateConference} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Conference
          </Button>
        </div>

        {/* Conferences Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Conferences ({filteredConferences.length})</CardTitle>
            <CardDescription>
              Manage all conferences across the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Conference</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fee Range</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConferences.map((conference) => (
                    <TableRow key={conference.id}>
                      <TableCell>
                        <div>
                          <div style={{ fontWeight: 600 }}>{conference.shortName}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {conference.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div>{new Date(conference.startDate).toLocaleDateString()}</div>
                            <div className="text-muted-foreground">
                              to {new Date(conference.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="line-clamp-1">{conference.venue}</span>
                        </div>
                      </TableCell>
                      <TableCell>{conference.organizer}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {conference.currentParticipants}/{conference.maxParticipants}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(conference.status)}>
                          {conference.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>LKR {conference.fees.participant.standard.toLocaleString()} - {conference.fees.localAuthorNonIEEE.standard.toLocaleString()}</div>
                          <div className="text-muted-foreground">USD ${conference.fees.internationalAuthorIEEE.standard} - ${conference.fees.internationalAuthorNonIEEE.standard}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditConference(conference)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteConference(conference)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Conference Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Conference</DialogTitle>
            <DialogDescription>
              Add a new conference to the system. Fill in all required information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Full Conference Name *</Label>
              <Input
                id="name"
                placeholder="e.g., International Conference on..."
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortName">Short Name *</Label>
              <Input
                id="shortName"
                placeholder="e.g., SCSE 2025"
                value={formData.shortName || ""}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizer">Assign Organizer *</Label>
              <Select
                value={formData.organizerId?.toString() || ""}
                onValueChange={(value: string) => {
                  const selectedOrg = getAvailableOrganizers().find(org => org.id.toString() === value);
                  if (selectedOrg) {
                    setFormData({ 
                      ...formData, 
                      organizer: `${selectedOrg.firstName} ${selectedOrg.lastName}`,
                      organizerId: selectedOrg.id
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organizer" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableOrganizers().length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No available organizers. All organizers are assigned.
                    </div>
                  ) : (
                    getAvailableOrganizers().map((org) => (
                      <SelectItem key={org.id} value={org.id.toString()}>
                        {org.firstName} {org.lastName} ({org.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {getAvailableOrganizers().length === 0 && (
                <p className="text-xs text-muted-foreground">
                  All organizers are currently assigned to conferences. Add a new organizer in Manage Organizers.
                </p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the conference..."
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate || ""}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate || ""}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                placeholder="e.g., University of Kelaniya, Sri Lanka"
                value={formData.venue || ""}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationDeadline">Registration Deadline</Label>
              <Input
                id="registrationDeadline"
                type="date"
                value={formData.registrationDeadline || ""}
                onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paperDeadline">Paper Submission Deadline</Label>
              <Input
                id="paperDeadline"
                type="date"
                value={formData.paperDeadline || ""}
                onChange={(e) => setFormData({ ...formData, paperDeadline: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Max Participants</Label>
              <Input
                id="maxParticipants"
                type="number"
                placeholder="e.g., 300"
                value={formData.maxParticipants || ""}
                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || "upcoming"}
                onValueChange={(value: any) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-primary mt-4">Registration Fees</h3>
              <Tabs defaultValue="local" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="local">Local Authors</TabsTrigger>
                  <TabsTrigger value="international">International</TabsTrigger>
                  <TabsTrigger value="student">Students</TabsTrigger>
                  <TabsTrigger value="participant">Participants</TabsTrigger>
                </TabsList>
                <TabsContent value="local" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>IEEE Member - Standard (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.localAuthorIEEE.standard || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            localAuthorIEEE: { ...formData.fees!.localAuthorIEEE, standard: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IEEE Member - Early Bird (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.localAuthorIEEE.earlyBird || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            localAuthorIEEE: { ...formData.fees!.localAuthorIEEE, earlyBird: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Non-IEEE - Standard (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.localAuthorNonIEEE.standard || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            localAuthorNonIEEE: { ...formData.fees!.localAuthorNonIEEE, standard: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Non-IEEE - Early Bird (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.localAuthorNonIEEE.earlyBird || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            localAuthorNonIEEE: { ...formData.fees!.localAuthorNonIEEE, earlyBird: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="international" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>IEEE Member - Standard (USD)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.internationalAuthorIEEE.standard || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            internationalAuthorIEEE: { ...formData.fees!.internationalAuthorIEEE, standard: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IEEE Member - Early Bird (USD)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.internationalAuthorIEEE.earlyBird || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            internationalAuthorIEEE: { ...formData.fees!.internationalAuthorIEEE, earlyBird: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Non-IEEE - Standard (USD)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.internationalAuthorNonIEEE.standard || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            internationalAuthorNonIEEE: { ...formData.fees!.internationalAuthorNonIEEE, standard: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Non-IEEE - Early Bird (USD)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.internationalAuthorNonIEEE.earlyBird || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            internationalAuthorNonIEEE: { ...formData.fees!.internationalAuthorNonIEEE, earlyBird: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="student" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>IEEE Member - Standard (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.localStudentIEEE.standard || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            localStudentIEEE: { ...formData.fees!.localStudentIEEE, standard: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IEEE Member - Early Bird (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.localStudentIEEE.earlyBird || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            localStudentIEEE: { ...formData.fees!.localStudentIEEE, earlyBird: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Non-IEEE - Standard (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.localStudentNonIEEE.standard || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            localStudentNonIEEE: { ...formData.fees!.localStudentNonIEEE, standard: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Non-IEEE - Early Bird (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.localStudentNonIEEE.earlyBird || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            localStudentNonIEEE: { ...formData.fees!.localStudentNonIEEE, earlyBird: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="participant" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Standard Fee (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.participant.standard || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            participant: { ...formData.fees!.participant, standard: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Early Bird Fee (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.participant.earlyBird || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            participant: { ...formData.fees!.participant, earlyBird: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewConference} className="bg-primary hover:bg-primary/90">
              Create Conference
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Conference Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Conference</DialogTitle>
            <DialogDescription>
              Update conference information. Changes will be reflected across the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-name">Full Conference Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g., International Conference on..."
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-shortName">Short Name *</Label>
              <Input
                id="edit-shortName"
                placeholder="e.g., SCSE 2025"
                value={formData.shortName || ""}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-organizer">Assign Organizer *</Label>
              <Select
                value={formData.organizerId?.toString() || ""}
                onValueChange={(value: string) => {
                  const selectedOrg = getAvailableOrganizers(selectedConference?.id).find(org => org.id.toString() === value);
                  if (selectedOrg) {
                    setFormData({ 
                      ...formData, 
                      organizer: `${selectedOrg.firstName} ${selectedOrg.lastName}`,
                      organizerId: selectedOrg.id
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organizer" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableOrganizers(selectedConference?.id).map((org) => (
                    <SelectItem key={org.id} value={org.id.toString()}>
                      {org.firstName} {org.lastName} ({org.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Brief description of the conference..."
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-startDate">Start Date *</Label>
              <Input
                id="edit-startDate"
                type="date"
                value={formData.startDate || ""}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-endDate">End Date *</Label>
              <Input
                id="edit-endDate"
                type="date"
                value={formData.endDate || ""}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-venue">Venue</Label>
              <Input
                id="edit-venue"
                placeholder="e.g., University of Kelaniya, Sri Lanka"
                value={formData.venue || ""}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-registrationDeadline">Registration Deadline</Label>
              <Input
                id="edit-registrationDeadline"
                type="date"
                value={formData.registrationDeadline || ""}
                onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-paperDeadline">Paper Submission Deadline</Label>
              <Input
                id="edit-paperDeadline"
                type="date"
                value={formData.paperDeadline || ""}
                onChange={(e) => setFormData({ ...formData, paperDeadline: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-maxParticipants">Max Participants</Label>
              <Input
                id="edit-maxParticipants"
                type="number"
                placeholder="e.g., 300"
                value={formData.maxParticipants || ""}
                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status || "upcoming"}
                onValueChange={(value: any) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-primary mt-4">Registration Fees</h3>
              <Tabs defaultValue="local" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="local">Local Authors</TabsTrigger>
                  <TabsTrigger value="international">International</TabsTrigger>
                  <TabsTrigger value="student">Students</TabsTrigger>
                  <TabsTrigger value="participant">Participants</TabsTrigger>
                </TabsList>
                <TabsContent value="local" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>IEEE Member - Standard (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.localAuthorIEEE.standard || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            localAuthorIEEE: { ...formData.fees!.localAuthorIEEE, standard: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IEEE Member - Early Bird (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.localAuthorIEEE.earlyBird || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            localAuthorIEEE: { ...formData.fees!.localAuthorIEEE, earlyBird: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Non-IEEE - Standard (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.localAuthorNonIEEE.standard || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            localAuthorNonIEEE: { ...formData.fees!.localAuthorNonIEEE, standard: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Non-IEEE - Early Bird (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.localAuthorNonIEEE.earlyBird || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            localAuthorNonIEEE: { ...formData.fees!.localAuthorNonIEEE, earlyBird: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="international" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>IEEE Member - Standard (USD)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.internationalAuthorIEEE.standard || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            internationalAuthorIEEE: { ...formData.fees!.internationalAuthorIEEE, standard: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IEEE Member - Early Bird (USD)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.internationalAuthorIEEE.earlyBird || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            internationalAuthorIEEE: { ...formData.fees!.internationalAuthorIEEE, earlyBird: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Non-IEEE - Standard (USD)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.internationalAuthorNonIEEE.standard || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            internationalAuthorNonIEEE: { ...formData.fees!.internationalAuthorNonIEEE, standard: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Non-IEEE - Early Bird (USD)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.internationalAuthorNonIEEE.earlyBird || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            internationalAuthorNonIEEE: { ...formData.fees!.internationalAuthorNonIEEE, earlyBird: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="student" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>IEEE Member - Standard (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.localStudentIEEE.standard || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            localStudentIEEE: { ...formData.fees!.localStudentIEEE, standard: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IEEE Member - Early Bird (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.localStudentIEEE.earlyBird || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            localStudentIEEE: { ...formData.fees!.localStudentIEEE, earlyBird: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Non-IEEE - Standard (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.localStudentNonIEEE.standard || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            localStudentNonIEEE: { ...formData.fees!.localStudentNonIEEE, standard: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Non-IEEE - Early Bird (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.localStudentNonIEEE.earlyBird || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            localStudentNonIEEE: { ...formData.fees!.localStudentNonIEEE, earlyBird: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="participant" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Standard Fee (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.participant.standard || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            participant: { ...formData.fees!.participant, standard: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Early Bird Fee (LKR)</Label>
                      <Input
                        type="number"
                        value={formData.fees?.participant.earlyBird || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          fees: { 
                            ...formData.fees!, 
                            participant: { ...formData.fees!.participant, earlyBird: parseInt(e.target.value) || 0 }
                          }
                        })}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditConference} className="bg-primary hover:bg-primary/90">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the conference "{selectedConference?.shortName}". 
              This action cannot be undone and will affect all associated data including registrations, 
              papers, and evaluations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Conference
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
