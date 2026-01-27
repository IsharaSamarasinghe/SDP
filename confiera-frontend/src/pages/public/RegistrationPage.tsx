import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Progress } from "../../components/ui/progress";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "sonner";

interface RegistrationPageProps {
  onNavigate: (page: string) => void;
}

const countries = [
  { name: "Sri Lanka", code: "+94" },
  { name: "India", code: "+91" },
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "Australia", code: "+61" },
  { name: "Canada", code: "+1" },
  { name: "Singapore", code: "+65" },
];

const universities = [
  "University of Kelaniya",
  "University of Colombo",
  "University of Moratuwa",
  "University of Peradeniya",
  "Massachusetts Institute of Technology",
  "Stanford University",
  "Other",
];

export function RegistrationPage({ onNavigate }: RegistrationPageProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);


  // Step 1 - Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Step 2 - Organization Info
  const [organization, setOrganization] = useState("");
  const [customOrganization, setCustomOrganization] = useState("");
  const [isUoKCandidate, setIsUoKCandidate] = useState<string>("");
  const [studentId, setStudentId] = useState("");
  const [nic, setNic] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Step 3 - Optional Fields
  const [ieeeId, setIeeeId] = useState("");

  // Step 4 - Security
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");


  const progress = (step / totalSteps) * 100;

  const handleCountryChange = (value: string) => {
    setCountry(value);
    const selectedCountry = countries.find((c) => c.name === value);
    if (selectedCountry) {
      setCountryCode(selectedCountry.code);
    }
  };

  const handleOrganizationChange = (value: string) => {
    setOrganization(value);
    if (value !== "University of Kelaniya") {
      setIsUoKCandidate("");
    }
    setEmailError("");
  };

  const validateEmail = (emailValue: string) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError("Please enter a valid email address");
      return false;
    }

    // UoK specific validation
    if (organization === "University of Kelaniya" && isUoKCandidate === "yes") {
      if (!emailValue.toLowerCase().endsWith("kln.ac.lk")) {
        setEmailError("University of Kelaniya email must be a valid kln.ac.lk domain email");
        return false;
      }
    }

    setEmailError("");
    return true;
  };

  const validatePassword = (pwd: string) => {
    const minLength = pwd.length >= 8;
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    if (!minLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      setPasswordError(
        "At least 8 characters with uppercase, lowercase, number, and special character"
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const canProceedStep1 = firstName && lastName && birthday && country && phone && address;
  const canProceedStep2 =
    organization &&
    (organization !== "Other" || customOrganization) &&
    (organization !== "University of Kelaniya" || isUoKCandidate !== "") &&
    (organization !== "University of Kelaniya" || isUoKCandidate !== "yes" || studentId) &&
    (country !== "Sri Lanka" || nic) &&
    email;
  const canProceedStep4 = password && confirmPassword && password === confirmPassword && !passwordError;

  const handleNext = () => {
    if (step === 2) {
      if (!validateEmail(email)) return;
    }
    if (step === 4) {
      if (!validatePassword(password)) return;
      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }
    }
    setStep(step + 1);
  };



  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await signup({
        firstName,
        lastName,
        email,
        password,
        phone,
        country,
        countryCode,
        address,
        organization: organization === "Other" ? customOrganization : organization,
        studentId,
        nic,
        ieeeId
      });
      toast.success("Account created! Please check email to verify.");
      onNavigate("login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: '#FAFAFA' }}>
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-gray-100"
          style={{ color: '#4B0101' }}
          onClick={() => onNavigate("home")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-lg border" style={{ background: '#FFFFFF', borderColor: '#E5E5E5' }}>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle style={{ color: '#4B0101' }}>Create Account</CardTitle>
                <CardDescription style={{ color: '#737373' }}>
                  Step {step} of {totalSteps}
                </CardDescription>
              </div>
              <div className="text-sm" style={{ color: '#737373' }}>
                {step === 1 && "Personal Information"}
                {step === 2 && "Organization Details"}
                {step === 3 && "Optional Information"}
                {step === 4 && "Account Security"}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent>
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" style={{ color: '#1E1E1E' }}>First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="border"
                      style={{ background: '#FFFFFF', borderColor: '#E5E5E5', color: '#1E1E1E' }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" style={{ color: '#1E1E1E' }}>Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="border"
                      style={{ background: '#FFFFFF', borderColor: '#E5E5E5', color: '#1E1E1E' }}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" style={{ color: '#1E1E1E' }}>Country</Label>
                  <Select value={country} onValueChange={handleCountryChange}>
                    <SelectTrigger id="country" className="border" style={{ background: '#FFFFFF', borderColor: '#E5E5E5', color: '#1E1E1E' }}>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent style={{ background: '#FFFFFF', borderColor: '#E5E5E5' }}>
                      {countries.map((c) => (
                        <SelectItem key={c.name} value={c.name} style={{ color: '#1E1E1E' }}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {countryCode && (
                  <Alert className="border" style={{ background: 'rgba(245, 197, 24, 0.1)', borderColor: '#F5C518' }}>
                    <AlertDescription style={{ color: '#A66500' }}>
                      ✓ Country code: {countryCode}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="birthday" style={{ color: '#1E1E1E' }}>Date of Birth</Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="border"
                    style={{ background: '#FFFFFF', borderColor: '#E5E5E5', color: '#1E1E1E' }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" style={{ color: '#1E1E1E' }}>Telephone Number</Label>
                  <div className="flex gap-2">
                    <Input
                      value={countryCode}
                      readOnly
                      className="w-20 border"
                      style={{ background: '#F5F5F5', borderColor: '#E5E5E5', color: '#737373' }}
                    />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="712345678"
                      className="border"
                      style={{ background: '#FFFFFF', borderColor: '#E5E5E5', color: '#1E1E1E' }}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" style={{ color: '#1E1E1E' }}>Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main Street, City"
                    className="border"
                    style={{ background: '#FFFFFF', borderColor: '#E5E5E5', color: '#1E1E1E' }}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Organization Info */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="organization" style={{ color: '#1E1E1E' }}>Organization / University</Label>
                  <Select value={organization} onValueChange={handleOrganizationChange}>
                    <SelectTrigger id="organization" className="border" style={{ background: '#FFFFFF', borderColor: '#E5E5E5', color: '#1E1E1E' }}>
                      <SelectValue placeholder="Select your organization" />
                    </SelectTrigger>
                    <SelectContent style={{ background: '#FFFFFF', borderColor: '#E5E5E5' }}>
                      {universities.map((uni) => (
                        <SelectItem key={uni} value={uni} style={{ color: '#1E1E1E' }}>
                          {uni}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {organization === "Other" && (
                  <div className="space-y-2">
                    <Label htmlFor="customOrganization" style={{ color: '#1E1E1E' }}>Organization Name</Label>
                    <Input
                      id="customOrganization"
                      value={customOrganization}
                      onChange={(e) => setCustomOrganization(e.target.value)}
                      placeholder="Enter organization name"
                      className="border"
                      style={{ background: '#FFFFFF', borderColor: '#E5E5E5', color: '#1E1E1E' }}
                      required
                    />
                  </div>
                )}

                {organization === "University of Kelaniya" && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label style={{ color: '#1E1E1E' }}>Are you a candidate from University of Kelaniya?</Label>
                      <RadioGroup value={isUoKCandidate} onValueChange={setIsUoKCandidate}>
                        <div className="flex items-center space-x-2 border p-4 rounded-lg" style={{ borderColor: '#E5E5E5', background: '#FAFAFA' }}>
                          <RadioGroupItem value="yes" id="uok-yes" />
                          <Label htmlFor="uok-yes" className="cursor-pointer flex-1" style={{ color: '#1E1E1E' }}>
                            Yes, I'm a UoK candidate
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-4 rounded-lg" style={{ borderColor: '#E5E5E5', background: '#FAFAFA' }}>
                          <RadioGroupItem value="no" id="uok-no" />
                          <Label htmlFor="uok-no" className="cursor-pointer flex-1" style={{ color: '#1E1E1E' }}>
                            No, I'm affiliated with UoK (faculty/staff)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {isUoKCandidate === "yes" && (
                      <Alert className="border" style={{ background: 'rgba(245, 197, 24, 0.1)', borderColor: '#F5C518' }}>
                        <AlertDescription style={{ color: '#A66500' }}>
                          Please use your University of Kelaniya email (kln.ac.lk) and provide Student ID
                        </AlertDescription>
                      </Alert>
                    )}

                    {isUoKCandidate === "yes" && (
                      <div className="space-y-2">
                        <Label htmlFor="studentId" style={{ color: '#1E1E1E' }}>Student ID</Label>
                        <Input
                          id="studentId"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          placeholder="e.g., CS/2021/123"
                          className="border"
                          style={{ background: '#FFFFFF', borderColor: '#E5E5E5', color: '#1E1E1E' }}
                          required
                        />
                      </div>
                    )}
                  </div>
                )}

                {country === "Sri Lanka" && (
                  <div className="space-y-2">
                    <Label htmlFor="nic" style={{ color: '#1E1E1E' }}>National Identity Card (NIC)</Label>
                    <Input
                      id="nic"
                      value={nic}
                      onChange={(e) => setNic(e.target.value)}
                      placeholder="200012345678 or 991234567V"
                      className="border"
                      style={{ background: '#FFFFFF', borderColor: '#E5E5E5', color: '#1E1E1E' }}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Required for Sri Lankan citizens</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: '#1E1E1E' }}>
                    {organization === "University of Kelaniya" && isUoKCandidate === "yes"
                      ? "University Email"
                      : "Official Email"}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateEmail(e.target.value);
                    }}
                    placeholder={
                      organization === "University of Kelaniya" && isUoKCandidate === "yes"
                        ? "your.name@kln.ac.lk"
                        : "your.email@example.com"
                    }
                    className="border"
                    style={{ background: '#FFFFFF', borderColor: '#E5E5E5', color: '#1E1E1E' }}
                    required
                  />
                  {emailError && (
                    <p className="text-sm" style={{ color: '#E53E3E' }}>{emailError}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Optional Fields */}
            {step === 3 && (
              <div className="space-y-6">
                <Alert className="border" style={{ background: '#F5F5F5', borderColor: '#E5E5E5' }}>
                  <AlertDescription style={{ color: '#737373' }}>
                    The following information is optional but helps us serve you better.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="ieeeId" style={{ color: '#1E1E1E' }}>IEEE Membership ID (Optional)</Label>
                  <Input
                    id="ieeeId"
                    value={ieeeId}
                    onChange={(e) => setIeeeId(e.target.value)}
                    placeholder="Enter IEEE ID if applicable"
                    className="border"
                    style={{ background: '#FFFFFF', borderColor: '#E5E5E5', color: '#1E1E1E' }}
                  />
                  <p className="text-xs" style={{ color: '#737373' }}>
                    IEEE members may receive special discounts on conference fees
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Security */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" style={{ color: '#1E1E1E' }}>Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    placeholder="••••••••"
                    className="border"
                    style={{ background: '#FFFFFF', borderColor: '#E5E5E5', color: '#1E1E1E' }}
                    required
                  />
                  <p className="text-xs" style={{ color: '#737373' }}>
                    At least 8 characters with uppercase, lowercase, number, and special character
                  </p>
                  {passwordError && (
                    <p className="text-sm" style={{ color: '#E53E3E' }}>{passwordError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" style={{ color: '#1E1E1E' }}>Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border"
                    style={{ background: '#FFFFFF', borderColor: '#E5E5E5', color: '#1E1E1E' }}
                    required
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-sm" style={{ color: '#E53E3E' }}>Passwords do not match</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: '#E5E5E5' }}>
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="border hover:bg-gray-50"
                  style={{ borderColor: '#4B0101', background: 'transparent', color: '#4B0101' }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
              {step < 4 ? (
                <Button
                  className="ml-auto shadow-md hover:opacity-90"
                  style={{ background: '#4B0101', color: '#FFFFFF' }}
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !canProceedStep1) ||
                    (step === 2 && !canProceedStep2)
                  }
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  className="ml-auto shadow-lg hover:opacity-90"
                  style={{ background: '#4B0101', color: '#FFFFFF' }}
                  onClick={handleSubmit}
                  disabled={!canProceedStep4 || isLoading}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              )}
            </div>

            <div className="text-center text-sm mt-6 pt-6 border-t" style={{ borderColor: '#660000' }}>
              <span style={{ color: '#E0E0E0' }}>Already have an account? </span>
              <button
                type="button"
                onClick={() => onNavigate("login")}
                className="transition-colors hover:text-[#FFD740]"
                style={{ fontWeight: 500, color: '#F5C518' }}
              >
                Login
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
