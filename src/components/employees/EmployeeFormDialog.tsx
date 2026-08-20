import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Briefcase,
  DollarSign,
  MapPin,
  FileCheck,
  GraduationCap,
  Building,
  Zap,
  AlertOctagon,
  Landmark,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Employee,
  type AddressItem,
  type KycDocumentItem,
  type EducationItem,
  type WorkExperienceItem,
  type SkillItem,
  type EmergencyContactItem,
  type BankAccountItem
} from "@/types/hr";
import { SystemRole, ROLE_OPTIONS, normalizeRole } from "@/features/auth/authTypes";
import { toast } from "sonner";

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSave: (data: Omit<Employee, "id">) => void;
}

export default function EmployeeFormDialog({
  open,
  onOpenChange,
  employee,
  onSave,
}: EmployeeFormDialogProps) {
  // 1. Basic Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [gender, setGender] = useState<Employee["gender"]>("Male");
  const [dob, setDob] = useState("");
  const [bloodGroup, setBloodGroup] = useState<Employee["bloodGroup"]>("O+");
  const [maritalStatus, setMaritalStatus] = useState<Employee["maritalStatus"]>("Single");
  const [photoUrl, setPhotoUrl] = useState("");

  // 2. Contact Details
  const [personalEmail, setPersonalEmail] = useState("");
  const [companyWorkEmail, setCompanyWorkEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");

  // 3. Job Details
  const [department, setDepartment] = useState<Employee["department"]>("Engineering");
  const [designation, setDesignation] = useState("");
  const [employmentType, setEmploymentType] = useState<Employee["employmentType"]>("FULL_TIME");
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split("T")[0]);
  const [reportingManager, setReportingManager] = useState("");
  const [shift, setShift] = useState<Employee["shift"]>("General");
  const [team, setTeam] = useState("");
  const [branchOffice, setBranchOffice] = useState("Mumbai HQ");
  const [workLocation, setWorkLocation] = useState<Employee["workLocation"]>("Onsite");
  const [probationPeriod, setProbationPeriod] = useState(3);
  const [capacity, setCapacity] = useState(100);
  const [costCenterId, setCostCenterId] = useState("");
  const [role, setRole] = useState<SystemRole>("employee");
  const [leaveGroup, setLeaveGroup] = useState("Standard India Policy");
  const [status, setStatus] = useState<Employee["status"]>("Active");

  // 4. Compensation & Salary
  const [ctc, setCtc] = useState(1200000);
  const [basicSalary, setBasicSalary] = useState(600000);
  const [hra, setHra] = useState(300000);
  const [bonus, setBonus] = useState(180000);
  const [pfDeduction, setPfDeduction] = useState(72000);
  const [esiDeduction, setEsiDeduction] = useState(0);
  const [profTax, setProfTax] = useState(2500);

  // 5. Addresses
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  // 6. KYC Documents
  const [kycDocuments, setKycDocuments] = useState<KycDocumentItem[]>([]);
  // 7. Education
  const [education, setEducation] = useState<EducationItem[]>([]);
  // 8. Work Experience
  const [workExperience, setWorkExperience] = useState<WorkExperienceItem[]>([]);
  // 9. Skills
  const [skills, setSkills] = useState<SkillItem[]>([]);
  // 10. Emergency Contacts
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContactItem[]>([]);
  // 11. Bank Accounts
  const [bankAccounts, setBankAccounts] = useState<BankAccountItem[]>([]);

  useEffect(() => {
    if (employee) {
      const parts = employee.name ? employee.name.split(" ") : ["", ""];
      setFirstName(employee.firstName || parts[0] || "");
      setLastName(employee.lastName || parts.slice(1).join(" ") || "");
      setEmployeeCode(employee.id || "");
      setGender(employee.gender || "Male");
      setDob(employee.dob || "1995-05-15");
      setBloodGroup(employee.bloodGroup || "O+");
      setMaritalStatus(employee.maritalStatus || "Single");
      setPhotoUrl(employee.photoUrl || employee.avatar || "");

      setPersonalEmail(employee.personalEmail || employee.email || "");
      setCompanyWorkEmail(employee.companyWorkEmail || employee.email || "");
      setPhone(employee.phone || "");
      setAlternatePhone(employee.alternatePhone || "");

      setDepartment(employee.department || "Engineering");
      setDesignation(employee.designation || "");
      setEmploymentType(employee.employmentType || "FULL_TIME");
      setJoiningDate(employee.joiningDate || employee.joinedAt || new Date().toISOString().split("T")[0]);
      setReportingManager(employee.reportingManager || employee.manager || "");
      setShift(employee.shift || "General");
      setTeam(employee.team || "");
      setBranchOffice(employee.branchOffice || "Mumbai HQ");
      setWorkLocation(employee.workLocation || "Onsite");
      setProbationPeriod(employee.probationPeriod ?? 3);
      setCapacity(employee.capacity ?? 100);
      setCostCenterId(employee.costCenterId || "CC-ENG-01");
      const rawRole = (employee as any).role || (employee as any).systemRole || (employee as any).backendRole || (employee as any).portalRole;
      setRole(normalizeRole(rawRole));
      setLeaveGroup(employee.leaveGroup || "Standard India Policy");
      setStatus(employee.status || "Active");

      setCtc(employee.ctc ?? employee.salary ?? 1200000);
      setBasicSalary(employee.basicSalary ?? 600000);
      setHra(employee.hra ?? 300000);
      setBonus(employee.bonus ?? 180000);
      setPfDeduction(employee.pfDeduction ?? 72000);
      setEsiDeduction(employee.esiDeduction ?? 0);
      setProfTax(employee.profTax ?? 2500);

      setAddresses(employee.addresses || []);
      setKycDocuments(employee.kycDocuments || []);
      setEducation(employee.education || []);
      setWorkExperience(employee.workExperience || []);
      setSkills(employee.skills || []);
      setEmergencyContacts(employee.emergencyContacts || []);
      setBankAccounts(employee.bankAccounts || []);
    } else {
      // Defaults for new employee
      setFirstName("");
      setLastName("");
      setEmployeeCode(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
      setGender("Male");
      setDob("1996-08-20");
      setBloodGroup("O+");
      setMaritalStatus("Single");
      setPhotoUrl("");

      setPersonalEmail("");
      setCompanyWorkEmail("");
      setPhone("");
      setAlternatePhone("");

      setDepartment("Engineering");
      setDesignation("");
      setEmploymentType("FULL_TIME");
      setJoiningDate(new Date().toISOString().split("T")[0]);
      setReportingManager("");
      setShift("General");
      setTeam("Core Platform");
      setBranchOffice("Mumbai HQ");
      setWorkLocation("Onsite");
      setProbationPeriod(3);
      setCapacity(100);
      setCostCenterId("CC-001");
      setRole("employee");
      setLeaveGroup("Standard India Policy");
      setStatus("Active");

      setCtc(1200000);
      setBasicSalary(600000);
      setHra(300000);
      setBonus(180000);
      setPfDeduction(72000);
      setEsiDeduction(0);
      setProfTax(2500);

      setAddresses([
        {
          id: "addr-1",
          type: "PRESENT",
          line1: "Flat 402, Highrise Tower, Andheri East",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India",
          pincode: "400069",
        },
      ]);
      setKycDocuments([
        {
          id: "kyc-1",
          type: "PAN",
          documentNumber: "ABCDE1234F",
        },
      ]);
      setEducation([
        {
          id: "edu-1",
          degree: "B.Tech Computer Science",
          institution: "IIT Bombay",
          fieldOfStudy: "Software Engineering",
          grade: "8.9 CGPA",
          startYear: "2018",
          endYear: "2022",
        },
      ]);
      setWorkExperience([]);
      setSkills([
        { id: "sk-1", name: "React", proficiency: "Expert", years: 4 },
        { id: "sk-2", name: "TypeScript", proficiency: "Advanced", years: 3 },
      ]);
      setEmergencyContacts([
        {
          id: "em-1",
          name: "Ramesh Sharma",
          relationship: "Parent",
          primaryPhone: "+91 9876543210",
        },
      ]);
      setBankAccounts([
        {
          id: "bnk-1",
          bankName: "HDFC Bank",
          accountHolder: "Primary Employee",
          accountNumber: "50100234567890",
          ifscCode: "HDFC0001234",
          accountType: "SAVINGS",
          isPrimary: true,
        },
      ]);
    }
  }, [employee, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First Name and Last Name are required.");
      return;
    }

    if (!personalEmail.trim() || !phone.trim()) {
      toast.error("Personal Email and Phone Number are required.");
      return;
    }

    if (!designation.trim()) {
      toast.error("Designation is required.");
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    onSave({
      name: fullName,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: companyWorkEmail.trim() || personalEmail.trim(),
      role,
      designation: designation.trim(),
      department,
      systemRole: role,
      portalRole: role,
      status,
      joinedAt: joiningDate,
      joiningDate,
      salary: ctc,
      ctc,
      basicSalary,
      hra,
      bonus,
      pfDeduction,
      esiDeduction,
      profTax,
      phone: phone.trim(),
      alternatePhone: alternatePhone.trim(),
      personalEmail: personalEmail.trim(),
      companyWorkEmail: companyWorkEmail.trim(),
      gender,
      dob,
      bloodGroup,
      maritalStatus,
      photoUrl,
      employmentType,
      reportingManager,
      shift,
      team,
      branchOffice,
      workLocation,
      probationPeriod,
      capacity,
      costCenterId,
      leaveGroup,
      addresses,
      kycDocuments,
      education,
      workExperience,
      skills,
      emergencyContacts,
      bankAccounts,
    });

    toast.success(
      employee
        ? `Updated employee profile: ${fullName}`
        : `Created new employee record: ${fullName}`
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 rounded-2xl bg-card border border-border/70 overflow-hidden shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* Clean Minimal Header */}
          <DialogHeader className="p-4 sm:p-5 border-b border-border/40 bg-secondary/20">
            <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
              {employee ? `Edit Employee — ${employee.name}` : "Add New Employee / System User"}
            </DialogTitle>
          </DialogHeader>

          {/* Continuous Multi-Section Form Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8 scrollbar-thin">
            {/* SECTION 1: BASIC INFO */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border/40 pb-2">
                <User className="w-4 h-4 text-primary" />
                <span>1. Personal & Basic Information</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">First Name *</Label>
                  <Input
                    placeholder="Jane"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-secondary/30 text-xs h-10 border-border/60"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Last Name *</Label>
                  <Input
                    placeholder="Cooper"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-secondary/30 text-xs h-10 border-border/60"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Employee ID</Label>
                    <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      Auto-Generated
                    </span>
                  </div>
                  <Input
                    placeholder="Auto-assigned by system (e.g. EMP-1001)"
                    value={employeeCode || "Auto-assigned by system on create"}
                    readOnly
                    disabled
                    className="bg-secondary/40 text-xs h-10 border-border/60 font-mono text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Gender</Label>
                  <Select value={gender} onValueChange={(v) => setGender(v as Employee["gender"])}>
                    <SelectTrigger className="bg-secondary/30 text-xs h-10 border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Date of Birth</Label>
                  <Input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="bg-secondary/30 text-xs h-10 border-border/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Blood Group</Label>
                  <Select value={bloodGroup} onValueChange={(v) => setBloodGroup(v as Employee["bloodGroup"])}>
                    <SelectTrigger className="bg-secondary/30 text-xs h-10 border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Marital Status</Label>
                  <Select value={maritalStatus} onValueChange={(v) => setMaritalStatus(v as Employee["maritalStatus"])}>
                    <SelectTrigger className="bg-secondary/30 text-xs h-10 border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Profile Photo Avatar URL</Label>
                <Input
                  placeholder="https://images.unsplash.com/photo-..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="bg-secondary/30 text-xs h-10 border-border/60"
                />
              </div>
            </div>

            {/* SECTION 2: CONTACT DETAILS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border/40 pb-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>2. Contact Details & Communication</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Personal Email *</Label>
                  <Input
                    type="email"
                    placeholder="user@gmail.com"
                    value={personalEmail}
                    onChange={(e) => setPersonalEmail(e.target.value)}
                    className="bg-secondary/30 text-xs h-10 border-border/60"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Company Work Email</Label>
                  <Input
                    type="email"
                    placeholder="user@company.com"
                    value={companyWorkEmail}
                    onChange={(e) => setCompanyWorkEmail(e.target.value)}
                    className="bg-secondary/30 text-xs h-10 border-border/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Phone Number *</Label>
                  <Input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-secondary/30 text-xs h-10 border-border/60 font-mono"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Alternate / Emergency Mobile</Label>
                  <Input
                    type="tel"
                    placeholder="+91 9876500000"
                    value={alternatePhone}
                    onChange={(e) => setAlternatePhone(e.target.value)}
                    className="bg-secondary/30 text-xs h-10 border-border/60 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: JOB DETAILS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border/40 pb-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <span>3. Job Role & Organization Assignment</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Department *</Label>
                  <Select value={department} onValueChange={(v) => setDepartment(v as Employee["department"])}>
                    <SelectTrigger className="bg-secondary/30 text-xs h-10 border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Role *</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as SystemRole)}>
                    <SelectTrigger className="bg-secondary/30 text-xs h-10 border-border/60 font-semibold text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Designation *</Label>
                  <Input
                    placeholder="Senior Frontend Engineer"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="bg-secondary/30 text-xs h-10 border-border/60"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Employment Type *</Label>
                  <Select value={employmentType} onValueChange={(v) => setEmploymentType(v as Employee["employmentType"])}>
                    <SelectTrigger className="bg-secondary/30 text-xs h-10 border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL_TIME">Full Time</SelectItem>
                      <SelectItem value="PART_TIME">Part Time</SelectItem>
                      <SelectItem value="CONTRACT">Contractor</SelectItem>
                      <SelectItem value="INTERN">Intern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Joining Date *</Label>
                  <Input
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="bg-secondary/30 text-xs h-10 border-border/60"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Reporting Manager</Label>
                  <Input
                    placeholder="Alex Mercer (VP)"
                    value={reportingManager}
                    onChange={(e) => setReportingManager(e.target.value)}
                    className="bg-secondary/30 text-xs h-10 border-border/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Shift Schedule</Label>
                  <Select value={shift} onValueChange={(v) => setShift(v as Employee["shift"])}>
                    <SelectTrigger className="bg-secondary/30 text-xs h-10 border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General (9:00 AM - 6:00 PM)</SelectItem>
                      <SelectItem value="Morning">Morning Shift</SelectItem>
                      <SelectItem value="Evening">Evening Shift</SelectItem>
                      <SelectItem value="Night">Night Shift</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Team</Label>
                  <Input
                    placeholder="Core Platform"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    className="bg-secondary/30 text-xs h-10 border-border/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Branch / Office</Label>
                  <Input
                    placeholder="Mumbai HQ"
                    value={branchOffice}
                    onChange={(e) => setBranchOffice(e.target.value)}
                    className="bg-secondary/30 text-xs h-10 border-border/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Work Location</Label>
                  <Select value={workLocation} onValueChange={(v) => setWorkLocation(v as Employee["workLocation"])}>
                    <SelectTrigger className="bg-secondary/30 text-xs h-10 border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Onsite">Onsite</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* SECTION 4: COMPENSATION & SALARY */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border/40 pb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span>4. Compensation Structure & Deductions</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Annual CTC ($ / ₹)</Label>
                  <Input
                    type="number"
                    value={ctc}
                    onChange={(e) => setCtc(Number(e.target.value))}
                    className="bg-secondary/30 text-xs h-10 border-border/60 font-mono font-bold text-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Basic Salary ($ / ₹)</Label>
                  <Input
                    type="number"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(Number(e.target.value))}
                    className="bg-secondary/30 text-xs h-10 border-border/60 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">HRA Allowance ($ / ₹)</Label>
                  <Input
                    type="number"
                    value={hra}
                    onChange={(e) => setHra(Number(e.target.value))}
                    className="bg-secondary/30 text-xs h-10 border-border/60 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Bonus / Perks</Label>
                  <Input
                    type="number"
                    value={bonus}
                    onChange={(e) => setBonus(Number(e.target.value))}
                    className="bg-secondary/30 text-xs h-10 border-border/60 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">PF Deduction</Label>
                  <Input
                    type="number"
                    value={pfDeduction}
                    onChange={(e) => setPfDeduction(Number(e.target.value))}
                    className="bg-secondary/30 text-xs h-10 border-border/60 font-mono text-destructive"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">ESI Deduction</Label>
                  <Input
                    type="number"
                    value={esiDeduction}
                    onChange={(e) => setEsiDeduction(Number(e.target.value))}
                    className="bg-secondary/30 text-xs h-10 border-border/60 font-mono text-destructive"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Professional Tax</Label>
                  <Input
                    type="number"
                    value={profTax}
                    onChange={(e) => setProfTax(Number(e.target.value))}
                    className="bg-secondary/30 text-xs h-10 border-border/60 font-mono text-destructive"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: ADDRESSES */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>5. Residential & Office Addresses</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    setAddresses([
                      ...addresses,
                      {
                        id: String(Date.now()),
                        type: "PERMANENT",
                        line1: "",
                        city: "",
                        state: "",
                        country: "India",
                        pincode: "",
                      },
                    ])
                  }
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Address
                </Button>
              </div>

              {addresses.map((addr, idx) => (
                <div key={addr.id} className="p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs font-bold text-primary">
                      Address #{idx + 1} ({addr.type})
                    </Badge>
                    <button
                      type="button"
                      onClick={() => setAddresses(addresses.filter((a) => a.id !== addr.id))}
                      className="text-muted-foreground hover:text-destructive text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold">Address Type</Label>
                      <Select
                        value={addr.type}
                        onValueChange={(v) =>
                          setAddresses(
                            addresses.map((a) => (a.id === addr.id ? { ...a, type: v as AddressItem["type"] } : a))
                          )
                        }
                      >
                        <SelectTrigger className="bg-secondary/30 text-xs h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRESENT">PRESENT</SelectItem>
                          <SelectItem value="PERMANENT">PERMANENT</SelectItem>
                          <SelectItem value="OFFICE">OFFICE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <Label className="text-[11px] font-semibold">Address Line 1</Label>
                      <Input
                        value={addr.line1}
                        onChange={(e) =>
                          setAddresses(
                            addresses.map((a) => (a.id === addr.id ? { ...a, line1: e.target.value } : a))
                          )
                        }
                        placeholder="House / Street / Building"
                        className="bg-secondary/30 text-xs h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold">City</Label>
                      <Input
                        value={addr.city}
                        onChange={(e) =>
                          setAddresses(
                            addresses.map((a) => (a.id === addr.id ? { ...a, city: e.target.value } : a))
                          )
                        }
                        className="bg-secondary/30 text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold">State</Label>
                      <Input
                        value={addr.state}
                        onChange={(e) =>
                          setAddresses(
                            addresses.map((a) => (a.id === addr.id ? { ...a, state: e.target.value } : a))
                          )
                        }
                        className="bg-secondary/30 text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold">Pincode</Label>
                      <Input
                        value={addr.pincode}
                        onChange={(e) =>
                          setAddresses(
                            addresses.map((a) => (a.id === addr.id ? { ...a, pincode: e.target.value } : a))
                          )
                        }
                        className="bg-secondary/30 text-xs h-9 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold">Country</Label>
                      <Input
                        value={addr.country}
                        onChange={(e) =>
                          setAddresses(
                            addresses.map((a) => (a.id === addr.id ? { ...a, country: e.target.value } : a))
                          )
                        }
                        className="bg-secondary/30 text-xs h-9"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SECTION 6: KYC DOCUMENTS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <FileCheck className="w-4 h-4 text-primary" />
                  <span>6. Identity & KYC Documents</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    setKycDocuments([
                      ...kycDocuments,
                      {
                        id: String(Date.now()),
                        type: "AADHAAR",
                        documentNumber: "",
                      },
                    ])
                  }
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Document
                </Button>
              </div>

              {kycDocuments.map((doc) => (
                <div key={doc.id} className="p-4 rounded-xl bg-secondary/30 border border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-3 relative">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Document Type</Label>
                    <Select
                      value={doc.type}
                      onValueChange={(v) =>
                        setKycDocuments(
                          kycDocuments.map((d) => (d.id === doc.id ? { ...d, type: v as KycDocumentItem["type"] } : d))
                        )
                      }
                    >
                      <SelectTrigger className="bg-secondary/30 text-xs h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PAN">PAN Card</SelectItem>
                        <SelectItem value="AADHAAR">Aadhaar Card</SelectItem>
                        <SelectItem value="PASSPORT">Passport</SelectItem>
                        <SelectItem value="VOTER_ID">Voter ID</SelectItem>
                        <SelectItem value="DRIVING_LICENSE">Driving License</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Document Number</Label>
                    <Input
                      value={doc.documentNumber}
                      onChange={(e) =>
                        setKycDocuments(
                          kycDocuments.map((d) => (d.id === doc.id ? { ...d, documentNumber: e.target.value } : d))
                        )
                      }
                      placeholder="e.g. ABCDE1234F"
                      className="bg-secondary/30 text-xs h-9 font-mono"
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-1">
                      <Label className="text-[11px] font-semibold">Expiry Date (Optional)</Label>
                      <Input
                        type="date"
                        value={doc.expiryDate || ""}
                        onChange={(e) =>
                          setKycDocuments(
                            kycDocuments.map((d) => (d.id === doc.id ? { ...d, expiryDate: e.target.value } : d))
                          )
                        }
                        className="bg-secondary/30 text-xs h-9"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setKycDocuments(kycDocuments.filter((d) => d.id !== doc.id))}
                      className="h-9 px-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SECTION 7: EDUCATION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span>7. Educational History & Qualifications</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    setEducation([
                      ...education,
                      {
                        id: String(Date.now()),
                        degree: "",
                        institution: "",
                      },
                    ])
                  }
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Degree
                </Button>
              </div>

              {education.map((edu) => (
                <div key={edu.id} className="p-4 rounded-xl bg-secondary/30 border border-border/40 grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Degree / Qualification</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) =>
                        setEducation(education.map((item) => (item.id === edu.id ? { ...item, degree: e.target.value } : item)))
                      }
                      placeholder="B.Tech, MBA, etc."
                      className="bg-secondary/30 text-xs h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Institution / University</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) =>
                        setEducation(education.map((item) => (item.id === edu.id ? { ...item, institution: e.target.value } : item)))
                      }
                      placeholder="e.g. Delhi University"
                      className="bg-secondary/30 text-xs h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Grade / Score</Label>
                    <Input
                      value={edu.grade || ""}
                      onChange={(e) =>
                        setEducation(education.map((item) => (item.id === edu.id ? { ...item, grade: e.target.value } : item)))
                      }
                      placeholder="8.5 CGPA"
                      className="bg-secondary/30 text-xs h-9"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-1">
                      <Label className="text-[11px] font-semibold">End Year</Label>
                      <Input
                        value={edu.endYear || ""}
                        onChange={(e) =>
                          setEducation(education.map((item) => (item.id === edu.id ? { ...item, endYear: e.target.value } : item)))
                        }
                        placeholder="2022"
                        className="bg-secondary/30 text-xs h-9 font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setEducation(education.filter((item) => item.id !== edu.id))}
                      className="h-9 px-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SECTION 8: WORK EXPERIENCE */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Building className="w-4 h-4 text-primary" />
                  <span>8. Past Work Experience</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    setWorkExperience([
                      ...workExperience,
                      {
                        id: String(Date.now()),
                        companyName: "",
                        designation: "",
                        employmentType: "FULL_TIME",
                        startDate: "2022-01-01",
                      },
                    ])
                  }
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Experience
                </Button>
              </div>

              {workExperience.map((exp) => (
                <div key={exp.id} className="p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-foreground">{exp.companyName || "Previous Employer"}</span>
                    <button
                      type="button"
                      onClick={() => setWorkExperience(workExperience.filter((e) => e.id !== exp.id))}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold">Company Name</Label>
                      <Input
                        value={exp.companyName}
                        onChange={(e) =>
                          setWorkExperience(
                            workExperience.map((item) => (item.id === exp.id ? { ...item, companyName: e.target.value } : item))
                          )
                        }
                        className="bg-secondary/30 text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold">Designation</Label>
                      <Input
                        value={exp.designation}
                        onChange={(e) =>
                          setWorkExperience(
                            workExperience.map((item) => (item.id === exp.id ? { ...item, designation: e.target.value } : item))
                          )
                        }
                        className="bg-secondary/30 text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold">Start Date</Label>
                      <Input
                        type="date"
                        value={exp.startDate}
                        onChange={(e) =>
                          setWorkExperience(
                            workExperience.map((item) => (item.id === exp.id ? { ...item, startDate: e.target.value } : item))
                          )
                        }
                        className="bg-secondary/30 text-xs h-9"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SECTION 9: SKILLS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>9. Skills & Proficiencies</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    setSkills([
                      ...skills,
                      {
                        id: String(Date.now()),
                        name: "",
                        proficiency: "Intermediate",
                        years: 2,
                      },
                    ])
                  }
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Skill
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.map((skill) => (
                  <div key={skill.id} className="p-3 rounded-xl bg-secondary/30 border border-border/40 flex items-center gap-2">
                    <Input
                      placeholder="e.g. React, Node.js"
                      value={skill.name}
                      onChange={(e) =>
                        setSkills(skills.map((s) => (s.id === skill.id ? { ...s, name: e.target.value } : s)))
                      }
                      className="bg-secondary/40 text-xs h-9 flex-1"
                    />
                    <Select
                      value={skill.proficiency}
                      onValueChange={(v) =>
                        setSkills(
                          skills.map((s) => (s.id === skill.id ? { ...s, proficiency: v as SkillItem["proficiency"] } : s))
                        )
                      }
                    >
                      <SelectTrigger className="w-28 bg-secondary/40 text-xs h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <button
                      type="button"
                      onClick={() => setSkills(skills.filter((s) => s.id !== skill.id))}
                      className="text-muted-foreground hover:text-destructive px-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 10: EMERGENCY CONTACTS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <AlertOctagon className="w-4 h-4 text-primary" />
                  <span>10. Emergency Contacts</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    setEmergencyContacts([
                      ...emergencyContacts,
                      {
                        id: String(Date.now()),
                        name: "",
                        relationship: "Spouse",
                        primaryPhone: "",
                      },
                    ])
                  }
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Emergency Contact
                </Button>
              </div>

              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="p-4 rounded-xl bg-secondary/30 border border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-3 relative">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Contact Person Name</Label>
                    <Input
                      value={contact.name}
                      onChange={(e) =>
                        setEmergencyContacts(
                          emergencyContacts.map((c) => (c.id === contact.id ? { ...c, name: e.target.value } : c))
                        )
                      }
                      placeholder="Full Name"
                      className="bg-secondary/30 text-xs h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Relationship</Label>
                    <Select
                      value={contact.relationship}
                      onValueChange={(v) =>
                        setEmergencyContacts(
                          emergencyContacts.map((c) =>
                            c.id === contact.id ? { ...c, relationship: v as EmergencyContactItem["relationship"] } : c
                          )
                        )
                      }
                    >
                      <SelectTrigger className="bg-secondary/30 text-xs h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Spouse">Spouse</SelectItem>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="Sibling">Sibling</SelectItem>
                        <SelectItem value="Friend">Friend</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-1">
                      <Label className="text-[11px] font-semibold">Primary Phone Number</Label>
                      <Input
                        value={contact.primaryPhone}
                        onChange={(e) =>
                          setEmergencyContacts(
                            emergencyContacts.map((c) => (c.id === contact.id ? { ...c, primaryPhone: e.target.value } : c))
                          )
                        }
                        placeholder="+91 9876543210"
                        className="bg-secondary/30 text-xs h-9 font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setEmergencyContacts(emergencyContacts.filter((c) => c.id !== contact.id))}
                      className="h-9 px-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SECTION 11: BANK ACCOUNTS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Landmark className="w-4 h-4 text-primary" />
                  <span>11. Bank Account & Payroll Payout</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    setBankAccounts([
                      ...bankAccounts,
                      {
                        id: String(Date.now()),
                        bankName: "HDFC Bank",
                        accountHolder: `${firstName} ${lastName}`.trim() || "Account Holder",
                        accountNumber: "",
                        ifscCode: "",
                        accountType: "SAVINGS",
                        isPrimary: bankAccounts.length === 0,
                      },
                    ])
                  }
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Bank Account
                </Button>
              </div>

              {bankAccounts.map((acc) => (
                <div key={acc.id} className="p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-bold text-primary">
                        {acc.bankName || "Bank Account"}
                      </Badge>
                      {acc.isPrimary && (
                        <Badge className="bg-emerald-500/15 text-emerald-500 text-[10px] font-bold">
                          Primary Payout Account
                        </Badge>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setBankAccounts(bankAccounts.filter((b) => b.id !== acc.id))}
                      className="text-muted-foreground hover:text-destructive text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold">Bank Name</Label>
                      <Input
                        value={acc.bankName}
                        onChange={(e) =>
                          setBankAccounts(
                            bankAccounts.map((b) => (b.id === acc.id ? { ...b, bankName: e.target.value } : b))
                          )
                        }
                        placeholder="e.g. HDFC Bank"
                        className="bg-secondary/30 text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold">Account Number</Label>
                      <Input
                        value={acc.accountNumber}
                        onChange={(e) =>
                          setBankAccounts(
                            bankAccounts.map((b) => (b.id === acc.id ? { ...b, accountNumber: e.target.value } : b))
                          )
                        }
                        placeholder="50100234567890"
                        className="bg-secondary/30 text-xs h-9 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold">IFSC Code</Label>
                      <Input
                        value={acc.ifscCode}
                        onChange={(e) =>
                          setBankAccounts(
                            bankAccounts.map((b) => (b.id === acc.id ? { ...b, ifscCode: e.target.value } : b))
                          )
                        }
                        placeholder="HDFC0001234"
                        className="bg-secondary/30 text-xs h-9 font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="p-4 sm:p-5 border-t border-border/40 bg-secondary/30 flex flex-row items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs h-9"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="gradient-bg text-primary-foreground font-bold text-xs h-9 shadow-md gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{employee ? "Save Employee Profile" : "Create Employee Profile"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}