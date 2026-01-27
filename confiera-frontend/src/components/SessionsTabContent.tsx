import { useState } from "react";
import { Plus, Trash2, Edit, Calendar, Clock, MapPin, Tag, ClipboardList, Save, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { toast } from "sonner";

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

interface SessionsTabContentProps {
  sessions: Session[];
  setSessions: (sessions: Session[]) => void;
  tracks: string[];
  setTracks: (tracks: string[]) => void;
}

export function SessionsTabContent({ sessions, setSessions, tracks, setTracks }: SessionsTabContentProps) {
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [editingSession, setEditingSession] = useState<number | null>(null);
  
  const [isAddingTrack, setIsAddingTrack] = useState(false);
  const [newTrackName, setNewTrackName] = useState("");
  
  const [sessionFormData, setSessionFormData] = useState({
    name: "",
    date: "",
    time: "",
    room: "",
    track: "",
  });

  const [criteria, setCriteria] = useState<EvaluationCriterion[]>([]);
  const [newCriterionName, setNewCriterionName] = useState("");
  const [newCriterionMarks, setNewCriterionMarks] = useState("");

  const resetForm = () => {
    setSessionFormData({
      name: "",
      date: "",
      time: "",
      room: "",
      track: "",
    });
    setCriteria([]);
    setEditingSession(null);
    setNewCriterionName("");
    setNewCriterionMarks("");
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddingSession(true);
  };

  const handleOpenEdit = (session: Session) => {
    setSessionFormData({
      name: session.name,
      date: session.date,
      time: session.time,
      room: session.room,
      track: session.track,
    });
    setCriteria([...session.evaluationCriteria]);
    setEditingSession(session.id);
    setIsAddingSession(true);
  };

  const handleAddCriterion = () => {
    if (!newCriterionName || !newCriterionMarks) {
      toast.error("Please enter both criterion name and marks");
      return;
    }
    
    const marks = parseInt(newCriterionMarks);
    if (isNaN(marks) || marks <= 0) {
      toast.error("Marks must be a positive number");
      return;
    }

    const newCriterion: EvaluationCriterion = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCriterionName,
      maxMarks: marks,
    };

    setCriteria([...criteria, newCriterion]);
    setNewCriterionName("");
    setNewCriterionMarks("");
  };

  const handleRemoveCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const handleSaveSession = () => {
    const { name, date, time, room, track } = sessionFormData;
    
    if (!name || !date || !time || !room || !track) {
      toast.error("All session fields are required");
      return;
    }

    if (criteria.length === 0) {
      toast.error("Please add at least one evaluation criterion");
      return;
    }

    if (editingSession !== null) {
      // Update existing
      setSessions(sessions.map(s => 
        s.id === editingSession 
          ? { ...s, ...sessionFormData, evaluationCriteria: criteria }
          : s
      ));
      toast.success("Session updated successfully");
    } else {
      // Add new
      const newSession: Session = {
        id: sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 : 1,
        ...sessionFormData,
        evaluationCriteria: criteria,
      };
      setSessions([...sessions, newSession]);
      toast.success("Session generated successfully");
    }

    setIsAddingSession(false);
    resetForm();
  };

  const handleDeleteSession = (id: number) => {
    if (confirm("Are you sure you want to delete this session?")) {
      setSessions(sessions.filter(s => s.id !== id));
      toast.success("Session deleted successfully");
    }
  };

  const totalMarks = criteria.reduce((sum, c) => sum + c.maxMarks, 0);

  const handleAddTrack = () => {
    if (!newTrackName.trim()) {
      toast.error("Track name cannot be empty");
      return;
    }
    if (tracks.includes(newTrackName.trim())) {
      toast.error("Track already exists");
      return;
    }
    setTracks([...tracks, newTrackName.trim()]);
    setNewTrackName("");
    setIsAddingTrack(false);
    toast.success("Track added successfully");
  };

  const handleDeleteTrack = (trackName: string) => {
    if (sessions.some(s => s.track === trackName)) {
      toast.error("Cannot delete track that is assigned to sessions");
      return;
    }
    if (confirm(`Are you sure you want to delete the track "${trackName}"?`)) {
      setTracks(tracks.filter(t => t !== trackName));
      toast.success("Track deleted successfully");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Manage Sessions & Tracks</h1>
          <p className="text-muted-foreground">
            Organize conference tracks, generate sessions, and define evaluation criteria
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddingTrack} onOpenChange={setIsAddingTrack}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Tag className="w-4 h-4 mr-2" />
                Add Track
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Track</DialogTitle>
                <DialogDescription>
                  Enter the name of the new conference track.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="track-name">Track Name</Label>
                  <Input
                    id="track-name"
                    value={newTrackName}
                    onChange={(e) => setNewTrackName(e.target.value)}
                    placeholder="e.g., Cyber Security"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingTrack(false)}>Cancel</Button>
                <Button onClick={handleAddTrack}>Add Track</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button 
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={handleOpenAdd}
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Session
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conference Tracks</CardTitle>
            <CardDescription>Existing tracks for paper submissions and sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tracks.map((track) => (
                <div key={track} className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-full border">
                  <span className="text-sm font-medium">{track}</span>
                  <button 
                    onClick={() => handleDeleteTrack(track)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Schedule and management for paper presentations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session Details</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Venue & Track</TableHead>
                  <TableHead>Evaluation Criteria</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No sessions created yet. Click "Generate Session" to start.
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div className="font-medium">{session.name}</div>
                        <div className="text-xs text-muted-foreground">ID: SES-{session.id.toString().padStart(3, '0')}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {session.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {session.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {session.room}</span>
                          <span className="flex items-center gap-1 mt-1"><Badge variant="outline" className="text-[10px]">{session.track}</Badge></span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[250px]">
                          {session.evaluationCriteria.map((c) => (
                            <Badge key={c.id} variant="secondary" className="text-[10px]">
                              {c.name} ({c.maxMarks})
                            </Badge>
                          ))}
                          {session.evaluationCriteria.length === 0 && (
                            <span className="text-xs text-muted-foreground italic">No criteria defined</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenEdit(session)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteSession(session.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddingSession} onOpenChange={setIsAddingSession}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSession ? "Edit Session" : "Generate New Session"}</DialogTitle>
            <DialogDescription>
              Define the session details and set evaluation criteria for presentations.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="session-name">Session Name</Label>
                <Input
                  id="session-name"
                  value={sessionFormData.name}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, name: e.target.value })}
                  placeholder="e.g., AI Research Presentations - Track A"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-date">Date</Label>
                <Input
                  id="session-date"
                  type="date"
                  value={sessionFormData.date}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-time">Time Duration</Label>
                <Input
                  id="session-time"
                  value={sessionFormData.time}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, time: e.target.value })}
                  placeholder="e.g., 09:00 AM - 11:30 AM"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-room">Room / Venue</Label>
                <Input
                  id="session-room"
                  value={sessionFormData.room}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, room: e.target.value })}
                  placeholder="e.g., Senate Hall"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-track">Conference Track</Label>
                <Select 
                  value={sessionFormData.track} 
                  onValueChange={(val) => setSessionFormData({ ...sessionFormData, track: val })}
                >
                  <SelectTrigger id="session-track">
                    <SelectValue placeholder="Select track" />
                  </SelectTrigger>
                  <SelectContent>
                    {tracks.map((track) => (
                      <SelectItem key={track} value={track}>{track}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Evaluation Criteria</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Add evaluation criteria and assign maximum marks for each. Total marks will be calculated automatically.
              </p>

              <div className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-7 space-y-1">
                  <Label htmlFor="criterion-name" className="text-xs">Criterion Name</Label>
                  <Input
                    id="criterion-name"
                    value={newCriterionName}
                    onChange={(e) => setNewCriterionName(e.target.value)}
                    placeholder="e.g., Presentation Clarity"
                  />
                </div>
                <div className="col-span-3 space-y-1">
                  <Label htmlFor="criterion-marks" className="text-xs">Max Marks</Label>
                  <Input
                    id="criterion-marks"
                    type="number"
                    value={newCriterionMarks}
                    onChange={(e) => setNewCriterionMarks(e.target.value)}
                    placeholder="20"
                  />
                </div>
                <div className="col-span-2">
                  <Button 
                    type="button" 
                    className="w-full bg-primary"
                    onClick={handleAddCriterion}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden mt-4">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="text-xs font-semibold">Criterion Name</TableHead>
                      <TableHead className="text-xs font-semibold w-24">Marks</TableHead>
                      <TableHead className="text-xs font-semibold w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {criteria.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4 text-xs text-muted-foreground italic">
                          No criteria added yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      criteria.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="text-sm py-2">{c.name}</TableCell>
                          <TableCell className="text-sm py-2 font-medium">{c.maxMarks}</TableCell>
                          <TableCell className="py-2 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-destructive"
                              onClick={() => handleRemoveCriterion(c.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    {criteria.length > 0 && (
                      <TableRow className="bg-muted/30 font-bold">
                        <TableCell className="text-right text-sm">Total Marks:</TableCell>
                        <TableCell className="text-sm">{totalMarks}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setIsAddingSession(false)}>
              Cancel
            </Button>
            <Button className="bg-primary text-white" onClick={handleSaveSession}>
              <Save className="w-4 h-4 mr-2" />
              {editingSession ? "Save Changes" : "Generate Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
