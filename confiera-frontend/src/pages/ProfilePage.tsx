import { useState } from "react";
import { User, Calendar, MapPin, Mail, Phone, Building, Award, Lock, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { toast } from "sonner";

interface ProfilePageProps {
  onNavigate: (page: string) => void;
  userRole?: string;
}

export function ProfilePage({ onNavigate, userRole = "participant" }: ProfilePageProps) {
  // Profile Data
  const [name, setName] = useState("Dr. N. Fernando");
  const [birthday, setBirthday] = useState("1985-06-15");
  const [phone, setPhone] = useState("+94712345678");
  const [address, setAddress] = useState("123 Main Street, Colombo, Sri Lanka");
  const [email, setEmail] = useState("n.fernando@kln.ac.lk");
  const [organization, setOrganization] = useState("University of Kelaniya");
  const [country, setCountry] = useState("Sri Lanka");
  const [ieeeId, setIeeeId] = useState("12345678");

  // Password Change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Registration History
  const registrationHistory = [
    {
      id: "REG-2025-001",
      conference: "SCSE 2025",
      date: "2025-01-15",
      status: "Confirmed",
      amount: "LKR 12,150",
      paymentStatus: "Paid",
    },
    {
      id: "REG-2024-045",
      conference: "ICAPS 2024",
      date: "2024-03-20",
      status: "Completed",
      amount: "LKR 10,500",
      paymentStatus: "Paid",
    },
    {
      id: "REG-2024-023",
      conference: "SCSE 2024",
      date: "2024-02-10",
      status: "Completed",
      amount: "LKR 11,800",
      paymentStatus: "Paid",
    },
  ];

  const validatePassword = (pwd: string) => {
    const minLength = pwd.length >= 8;
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    if (!minLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      setPasswordError(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (!validatePassword(newPassword)) {
      return;
    }

    toast.success("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const getDashboardRoute = () => {
    switch (userRole) {
      case "admin":
        return "admin-dashboard";
      case "organizer":
        return "organizer-dashboard";
      case "evaluator":
        return "evaluator-dashboard";
      default:
        return "participant-dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => onNavigate(getDashboardRoute())}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-primary">Profile & Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and view your registration history
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="history">Registration History</TabsTrigger>
          </TabsList>

          {/* Profile Information */}
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthday">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Date of Birth
                    </Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organization">
                      <Building className="w-4 h-4 inline mr-2" />
                      Organization
                    </Label>
                    <Input
                      id="organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Country
                    </Label>
                    <Input
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ieeeId">
                    <Award className="w-4 h-4 inline mr-2" />
                    IEEE Membership ID (Optional)
                  </Label>
                  <Input
                    id="ieeeId"
                    value={ieeeId}
                    onChange={(e) => setIeeeId(e.target.value)}
                    placeholder="Enter your IEEE membership ID"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Lock className="w-4 h-4" />
                  <AlertDescription>
                    Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (e.target.value) validatePassword(e.target.value);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                {passwordError && (
                  <Alert variant="destructive">
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end">
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleChangePassword}
                  >
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Registration History */}
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Registration History</CardTitle>
                <CardDescription>
                  View all your past conference registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Registration ID</TableHead>
                      <TableHead>Conference</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrationHistory.map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell className="text-primary">{reg.id}</TableCell>
                        <TableCell>{reg.conference}</TableCell>
                        <TableCell>{reg.date}</TableCell>
                        <TableCell>{reg.amount}</TableCell>
                        <TableCell>
                          <Badge className="bg-accent text-accent-foreground">
                            {reg.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={reg.status === "Confirmed" ? "default" : "secondary"}
                          >
                            {reg.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
