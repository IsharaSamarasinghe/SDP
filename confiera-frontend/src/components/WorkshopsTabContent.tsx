import { Plus, Edit, Trash2, Users, Calendar as CalendarIcon, Clock, DollarSign } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

interface Workshop {
  id: number;
  title: string;
  description?: string;
  instructor?: string;
  fee: number;
  currency: string;
  capacity: number;
  starts_at: string;
  ends_at: string;
  registrations: Array<{
    id: number;
    userName: string;
    status: string;
    created_at: string;
  }>;
}

interface WorkshopsTabContentProps {
  workshops: Workshop[];
  isAddingWorkshop: boolean;
  setIsAddingWorkshop: (value: boolean) => void;
  editingWorkshop: number | null;
  setEditingWorkshop: (value: number | null) => void;
  workshopFormData: {
    title: string;
    description: string;
    instructor: string;
    fee: string;
    currency: string;
    capacity: string;
    starts_at: string;
    ends_at: string;
  };
  setWorkshopFormData: (data: any) => void;
  selectedWorkshop: Workshop | null;
  showWorkshopDetails: boolean;
  setShowWorkshopDetails: (value: boolean) => void;
  handleAddWorkshop: () => void;
  handleEditWorkshop: (id: number) => void;
  handleSaveWorkshopEdit: () => void;
  handleDeleteWorkshop: (id: number) => void;
  handleViewWorkshopDetails: (workshop: Workshop) => void;
  handleChangeRegistrationStatus: (workshopId: number, registrationId: number, newStatus: string) => void;
}

export function WorkshopsTabContent({
  workshops,
  isAddingWorkshop,
  setIsAddingWorkshop,
  editingWorkshop,
  setEditingWorkshop,
  workshopFormData,
  setWorkshopFormData,
  selectedWorkshop,
  showWorkshopDetails,
  setShowWorkshopDetails,
  handleAddWorkshop,
  handleEditWorkshop,
  handleSaveWorkshopEdit,
  handleDeleteWorkshop,
  handleViewWorkshopDetails,
  handleChangeRegistrationStatus,
}: WorkshopsTabContentProps) {
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getConfirmedCount = (workshop: Workshop) => {
    return workshop.registrations.filter(r => r.status === "confirmed").length;
  };

  return (
    <div>
      <h1 className="mb-2 text-primary">Manage Workshops</h1>
      <p className="text-muted-foreground mb-8">
        Create and manage workshops for SCSE 2025
      </p>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Workshops</CardTitle>
              <CardDescription>Organize workshops and track participant registrations</CardDescription>
            </div>
            <Dialog open={isAddingWorkshop} onOpenChange={setIsAddingWorkshop}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setEditingWorkshop(null);
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
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workshop
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingWorkshop ? "Edit" : "Create"} Workshop</DialogTitle>
                  <DialogDescription>
                    {editingWorkshop ? "Update workshop information" : "Create a new workshop for your conference"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={workshopFormData.title}
                      onChange={(e) => setWorkshopFormData({ ...workshopFormData, title: e.target.value })}
                      placeholder="e.g., Introduction to Machine Learning"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={workshopFormData.description}
                      onChange={(e) => setWorkshopFormData({ ...workshopFormData, description: e.target.value })}
                      placeholder="Brief description of the workshop content"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Instructor</Label>
                    <Input
                      value={workshopFormData.instructor}
                      onChange={(e) => setWorkshopFormData({ ...workshopFormData, instructor: e.target.value })}
                      placeholder="e.g., Dr. John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>
                        Fee <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={workshopFormData.fee}
                        onChange={(e) => setWorkshopFormData({ ...workshopFormData, fee: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select 
                        value={workshopFormData.currency} 
                        onValueChange={(value) => setWorkshopFormData({ ...workshopFormData, currency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LKR">LKR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Capacity <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={workshopFormData.capacity}
                      onChange={(e) => setWorkshopFormData({ ...workshopFormData, capacity: e.target.value })}
                      placeholder="Maximum number of participants"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>
                        Start Time <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="datetime-local"
                        value={workshopFormData.starts_at}
                        onChange={(e) => setWorkshopFormData({ ...workshopFormData, starts_at: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        End Time <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="datetime-local"
                        value={workshopFormData.ends_at}
                        onChange={(e) => setWorkshopFormData({ ...workshopFormData, ends_at: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingWorkshop(false);
                        setEditingWorkshop(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-primary hover:bg-primary/90"
                      onClick={editingWorkshop ? handleSaveWorkshopEdit : handleAddWorkshop}
                    >
                      {editingWorkshop ? "Save Changes" : "Create Workshop"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {workshops.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-primary mb-2">No workshops created yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Create your first workshop to help participants enhance their skills
              </p>
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setIsAddingWorkshop(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Workshop
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead className="text-right">Fee</TableHead>
                  <TableHead className="text-right">Capacity</TableHead>
                  <TableHead className="text-right">Registrations</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workshops.map((workshop) => {
                  const startDate = formatDateTime(workshop.starts_at);
                  const endTime = formatDateTime(workshop.ends_at).time;
                  const confirmedCount = getConfirmedCount(workshop);
                  
                  return (
                    <TableRow key={workshop.id}>
                      <TableCell style={{ fontWeight: 500 }}>{workshop.title}</TableCell>
                      <TableCell>{workshop.instructor || "-"}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <CalendarIcon className="w-3 h-3" />
                            {startDate.date}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {startDate.time} - {endTime}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {workshop.currency} {workshop.fee.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">{workshop.capacity}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="link"
                          className="text-accent hover:text-accent/80 p-0 h-auto"
                          onClick={() => handleViewWorkshopDetails(workshop)}
                        >
                          {confirmedCount}/{workshop.registrations.length}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditWorkshop(workshop.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Workshop</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{workshop.title}"? This action cannot be undone.
                                  {workshop.registrations.length > 0 && (
                                    <span className="block mt-2 text-destructive">
                                      Warning: {workshop.registrations.length} participant(s) have registered for this workshop.
                                    </span>
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleDeleteWorkshop(workshop.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Workshop Details Dialog */}
      <Dialog open={showWorkshopDetails} onOpenChange={setShowWorkshopDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Workshop Details</DialogTitle>
            <DialogDescription>
              View workshop information and manage participant registrations
            </DialogDescription>
          </DialogHeader>
          {selectedWorkshop && (
            <div className="space-y-6 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Title</p>
                    <p>{selectedWorkshop.title}</p>
                  </div>
                  {selectedWorkshop.instructor && (
                    <div>
                      <p className="text-sm text-muted-foreground">Instructor</p>
                      <p>{selectedWorkshop.instructor}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Fee</p>
                    <p>{selectedWorkshop.currency} {selectedWorkshop.fee.toLocaleString()}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p>{selectedWorkshop.capacity} participants</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Schedule</p>
                    <p>
                      {formatDateTime(selectedWorkshop.starts_at).date}<br />
                      {formatDateTime(selectedWorkshop.starts_at).time} - {formatDateTime(selectedWorkshop.ends_at).time}
                    </p>
                  </div>
                </div>
              </div>

              {selectedWorkshop.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{selectedWorkshop.description}</p>
                </div>
              )}

              <div>
                <h4 className="mb-4">Participant Registrations</h4>
                {selectedWorkshop.registrations.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-border rounded-lg">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No registrations yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Participant</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedWorkshop.registrations.map((reg) => (
                        <TableRow key={reg.id}>
                          <TableCell>{reg.userName}</TableCell>
                          <TableCell>{new Date(reg.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                reg.status === "confirmed"
                                  ? "default"
                                  : reg.status === "cancelled"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {reg.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Select
                              value={reg.status}
                              onValueChange={(value) =>
                                handleChangeRegistrationStatus(selectedWorkshop.id, reg.id, value)
                              }
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
