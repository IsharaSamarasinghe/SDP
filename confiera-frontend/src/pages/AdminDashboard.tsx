import { useState } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  FileText,
  Settings,
  LogOut,
  GraduationCap,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { toast } from "sonner";

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

type Conference = {
  id: number;
  name: string;
  status: "Active" | "Completed" | string;
  registrations: number;
  registrationOpen: boolean;
};

type Organizer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  assignedConference: string | null; // ✅ allow null
};

type WorkshopSummary = {
  conferenceId: number;
  conferenceName: string;
  totalWorkshops: number;
  upcomingWorkshops: number;
  confirmedRegistrations: number;
};

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "organizers" | "reports" | "settings">(
    "overview"
  );

  const [conferences, setConferences] = useState<Conference[]>([
    { id: 1, name: "SCSE 2025", status: "Active", registrations: 156, registrationOpen: true },
    { id: 2, name: "ICAPS 2025", status: "Active", registrations: 191, registrationOpen: true },
    { id: 3, name: "SCSE 2024", status: "Completed", registrations: 203, registrationOpen: false },
  ]);

  // Mock workshop data for monitoring
  const workshopsByConference: WorkshopSummary[] = [
    { conferenceId: 1, conferenceName: "SCSE 2025", totalWorkshops: 3, upcomingWorkshops: 2, confirmedRegistrations: 45 },
    { conferenceId: 2, conferenceName: "ICAPS 2025", totalWorkshops: 2, upcomingWorkshops: 1, confirmedRegistrations: 28 },
    { conferenceId: 3, conferenceName: "SCSE 2024", totalWorkshops: 4, upcomingWorkshops: 0, confirmedRegistrations: 67 },
  ];

  const totalWorkshops = workshopsByConference.reduce((sum, c) => sum + c.totalWorkshops, 0);
  const upcomingWorkshops = workshopsByConference.reduce((sum, c) => sum + c.upcomingWorkshops, 0);

  // Organizers state
  const [organizers, setOrganizers] = useState<Organizer[]>([
    { id: 1, firstName: "Nimal", lastName: "Silva", email: "nimal.silva@kln.ac.lk", password: "admin123", assignedConference: "SCSE 2025" },
    { id: 2, firstName: "Anura", lastName: "Perera", email: "anura.perera@kln.ac.lk", password: "admin123", assignedConference: "ICAPS 2025" },
    { id: 3, firstName: "Kamala", lastName: "Jayasinghe", email: "kamala.j@kln.ac.lk", password: "admin123", assignedConference: "ICET 2025" },
  ]);

  const [isAddOrganizerDialogOpen, setIsAddOrganizerDialogOpen] = useState(false);
  const [isEditOrganizerDialogOpen, setIsEditOrganizerDialogOpen] = useState(false);
  const [isDeleteOrganizerDialogOpen, setIsDeleteOrganizerDialogOpen] = useState(false);

  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null);

  const [organizerFormData, setOrganizerFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const sidebarItems = [
    { id: "overview", icon: LayoutDashboard, label: "Dashboard Overview" },
    { id: "organizers", icon: Users, label: "Manage Organizers" },
    { id: "reports", icon: FileText, label: "Reports" },
    // settings tab exists in UI below but not in sidebar - keep or add if you want
  ] as const;

  // (Not currently used in your UI, but kept if you later add buttons)
  const handleDeleteConference = (id: number) => {
    setConferences((prev) => prev.filter((conf) => conf.id !== id));
    toast.success("Conference deleted successfully");
  };

  const handleToggleRegistration = (id: number) => {
    setConferences((prev) =>
      prev.map((conf) =>
        conf.id === id ? { ...conf, registrationOpen: !conf.registrationOpen } : conf
      )
    );

    const conference = conferences.find((c) => c.id === id);
    toast.success(
      `Registration ${conference?.registrationOpen ? "closed" : "opened"} for ${conference?.name ?? "conference"}`
    );
  };

  // Organizer handlers
  const handleAddOrganizer = () => {
    if (
      !organizerFormData.firstName ||
      !organizerFormData.lastName ||
      !organizerFormData.email ||
      !organizerFormData.password
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const newOrganizer: Organizer = {
      id: organizers.length + 1,
      firstName: organizerFormData.firstName,
      lastName: organizerFormData.lastName,
      email: organizerFormData.email,
      password: organizerFormData.password,
      assignedConference: null, // ✅ allowed now
    };

    setOrganizers((prev) => [...prev, newOrganizer]);
    setIsAddOrganizerDialogOpen(false);
    setOrganizerFormData({ firstName: "", lastName: "", email: "", password: "" });

    toast.success(
      `Organizer ${organizerFormData.firstName} ${organizerFormData.lastName} added successfully`
    );
  };

  const handleEditOrganizer = () => {
    if (
      !organizerFormData.firstName ||
      !organizerFormData.lastName ||
      !organizerFormData.email ||
      !organizerFormData.password
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!selectedOrganizer) return;

    setOrganizers((prev) =>
      prev.map((org) =>
        org.id === selectedOrganizer.id
          ? { ...org, ...organizerFormData }
          : org
      )
    );

    setIsEditOrganizerDialogOpen(false);
    setSelectedOrganizer(null);
    setOrganizerFormData({ firstName: "", lastName: "", email: "", password: "" });
    toast.success("Organizer updated successfully");
  };

  const handleDeleteOrganizer = () => {
    if (!selectedOrganizer) return;

    setOrganizers((prev) => prev.filter((org) => org.id !== selectedOrganizer.id));
    setIsDeleteOrganizerDialogOpen(false);
    setSelectedOrganizer(null);
    toast.success("Organizer deleted successfully");
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
              <div className="text-xs text-muted-foreground">Admin Panel</div>
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
          {/* Overview */}
          {activeTab === "overview" && (
            <div>
              <h1 className="mb-2 text-primary">Dashboard Overview</h1>
              <p className="text-muted-foreground mb-8">
                Welcome to the Confiera Admin Dashboard
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardDescription>Total Conferences</CardDescription>
                    <CardTitle className="text-primary" style={{ fontSize: "2rem" }}>
                      12
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardDescription>Active Organizers</CardDescription>
                    <CardTitle className="text-accent" style={{ fontSize: "2rem" }}>
                      24
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card
                  className="border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
                  onClick={() => onNavigate("conference-management")}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" />
                      Conference Management
                    </CardTitle>
                    <CardDescription>Create, edit, and delete conferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Manage Conferences
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="border-2 border-accent/20 hover:border-accent/40 transition-colors cursor-pointer"
                  onClick={() => onNavigate("report-generation")}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-accent" />
                      Report Generation
                    </CardTitle>
                    <CardDescription>
                      Generate and export comprehensive reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      Open Report Generation
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Recent Conferences</CardTitle>
                    <Button
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => onNavigate("conference-management")}
                    >
                      Manage All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conferences.slice(0, 2).map((conf) => (
                      <div
                        key={conf.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div>
                          <p>{conf.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {conf.registrations} registrations
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                          {conf.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Workshop Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total Workshops</p>
                        <p className="text-primary" style={{ fontSize: "1.5rem" }}>
                          {totalWorkshops}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Upcoming Workshops</p>
                        <p className="text-accent" style={{ fontSize: "1.5rem" }}>
                          {upcomingWorkshops}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="mb-4">Workshops by Conference</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Conference</TableHead>
                            <TableHead className="text-right">Total Workshops</TableHead>
                            <TableHead className="text-right">Upcoming</TableHead>
                            <TableHead className="text-right">Confirmed Registrations</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {workshopsByConference.map((conf) => (
                            <TableRow key={conf.conferenceId}>
                              <TableCell style={{ fontWeight: 500 }}>
                                {conf.conferenceName}
                              </TableCell>
                              <TableCell className="text-right">{conf.totalWorkshops}</TableCell>
                              <TableCell className="text-right">
                                <Badge variant="outline">{conf.upcomingWorkshops}</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                {conf.confirmedRegistrations}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Manage Organizers */}
          {activeTab === "organizers" && (
            <div>
              <h1 className="mb-2 text-primary">Manage Organizers</h1>
              <p className="text-muted-foreground mb-8">
                Add, edit, and assign organizers to conferences
              </p>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Organizers List</CardTitle>
                    <Button
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => {
                        setOrganizerFormData({ firstName: "", lastName: "", email: "", password: "" });
                        setIsAddOrganizerDialogOpen(true);
                      }}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Organizer
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Assigned Conference</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {organizers.map((organizer) => (
                        <TableRow key={organizer.id}>
                          <TableCell>
                            <div style={{ fontWeight: 500 }}>
                              {organizer.firstName} {organizer.lastName}
                            </div>
                          </TableCell>
                          <TableCell>{organizer.email}</TableCell>
                          <TableCell>
                            {organizer.assignedConference ? (
                              <Badge variant="outline">{organizer.assignedConference}</Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">Not assigned</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrganizer(organizer);
                                  setOrganizerFormData({
                                    firstName: organizer.firstName,
                                    lastName: organizer.lastName,
                                    email: organizer.email,
                                    password: organizer.password,
                                  });
                                  setIsEditOrganizerDialogOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrganizer(organizer);
                                  setIsDeleteOrganizerDialogOpen(true);
                                }}
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
                </CardContent>
              </Card>
            </div>
          )}

          {/* Reports */}
          {activeTab === "reports" && (
            <div>
              <h1 className="mb-2 text-primary">Reports & Analytics</h1>
              <p className="text-muted-foreground mb-8">
                Generate and download comprehensive reports with advanced filtering
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

          {/* Settings */}
          {activeTab === "settings" && (
            <div>
              <h1 className="mb-2 text-primary">Settings</h1>
              <p className="text-muted-foreground mb-8">
                Configure system and account settings
              </p>

              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Admin Name</Label>
                    <Input defaultValue="System Administrator" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue="admin@kln.ac.lk" />
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Add Organizer Dialog */}
      <Dialog open={isAddOrganizerDialogOpen} onOpenChange={setIsAddOrganizerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Organizer</DialogTitle>
            <DialogDescription>
              Create a new organizer account. They will be able to manage conferences once assigned.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={organizerFormData.firstName}
                  onChange={(e) =>
                    setOrganizerFormData({ ...organizerFormData, firstName: e.target.value })
                  }
                  placeholder="e.g., Nimal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={organizerFormData.lastName}
                  onChange={(e) =>
                    setOrganizerFormData({ ...organizerFormData, lastName: e.target.value })
                  }
                  placeholder="e.g., Silva"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={organizerFormData.email}
                onChange={(e) =>
                  setOrganizerFormData({ ...organizerFormData, email: e.target.value })
                }
                placeholder="e.g., nimal.silva@kln.ac.lk"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={organizerFormData.password}
                onChange={(e) =>
                  setOrganizerFormData({ ...organizerFormData, password: e.target.value })
                }
                placeholder="Enter password"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOrganizerDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleAddOrganizer}>
              Add Organizer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Organizer Dialog */}
      <Dialog open={isEditOrganizerDialogOpen} onOpenChange={setIsEditOrganizerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Organizer</DialogTitle>
            <DialogDescription>Update organizer information.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">First Name *</Label>
                <Input
                  id="edit-firstName"
                  value={organizerFormData.firstName}
                  onChange={(e) =>
                    setOrganizerFormData({ ...organizerFormData, firstName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">Last Name *</Label>
                <Input
                  id="edit-lastName"
                  value={organizerFormData.lastName}
                  onChange={(e) =>
                    setOrganizerFormData({ ...organizerFormData, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={organizerFormData.email}
                onChange={(e) =>
                  setOrganizerFormData({ ...organizerFormData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">Password *</Label>
              <Input
                id="edit-password"
                type="password"
                value={organizerFormData.password}
                onChange={(e) =>
                  setOrganizerFormData({ ...organizerFormData, password: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOrganizerDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleEditOrganizer}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Organizer Confirmation */}
      <AlertDialog open={isDeleteOrganizerDialogOpen} onOpenChange={setIsDeleteOrganizerDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Organizer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedOrganizer?.firstName}{" "}
              {selectedOrganizer?.lastName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteOrganizer}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
