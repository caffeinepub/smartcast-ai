import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  AlertTriangle,
  BarChart2,
  Bell,
  Brain,
  CheckCircle2,
  ChevronDown,
  Cloud,
  Cpu,
  Database,
  Factory,
  Github,
  IndianRupee,
  Linkedin,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Package,
  Pencil,
  Plus,
  Settings,
  Thermometer,
  Trash2,
  TrendingDown,
  TrendingUp,
  Twitter,
  User,
  Wifi,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import type { AuthorityNotification, Machine } from "./backend";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

// ─── Mock chart data ──────────────────────────────────────────────────────────
// ─── 2-Month daily date labels ────────────────────────────────────────────────
function gen2MonthDates(): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 59; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    );
  }
  return dates;
}
const twoMonthDates = gen2MonthDates();

const baseTemps = [
  225, 228, 232, 229, 240, 245, 238, 252, 255, 248, 260, 256, 242, 238, 244,
  250, 253, 248, 241, 236, 243, 249, 255, 252, 246, 240, 237, 244, 250, 256,
  259, 252, 247, 243, 239, 245, 251, 258, 254, 248, 242, 238, 244, 250, 256,
  260, 253, 247, 241, 237, 244, 250, 257, 253, 247, 241, 238, 245, 251, 248,
];
const temperatureData = twoMonthDates.map((date, i) => ({
  date,
  temp: baseTemps[i] + Math.round((Math.random() - 0.5) * 6),
}));

const baseVibs = [
  0.8, 1.1, 0.9, 1.4, 1.8, 1.5, 2.0, 2.3, 2.7, 2.1, 1.6, 1.3, 1.0, 1.3, 1.7,
  2.1, 2.4, 2.8, 3.1, 2.5, 2.0, 1.6, 1.2, 1.5, 1.9, 2.3, 2.7, 3.0, 2.6, 2.1,
  1.7, 1.3, 1.6, 2.0, 2.4, 2.8, 3.2, 2.7, 2.2, 1.8, 1.4, 1.7, 2.1, 2.5, 2.9,
  3.3, 2.8, 2.3, 1.9, 1.5, 1.8, 2.2, 2.6, 3.0, 3.4, 2.9, 2.4, 2.0, 1.6, 1.9,
];
const vibrationData = twoMonthDates.map((date, i) => ({
  date,
  vibration: Math.round((baseVibs[i] + (Math.random() - 0.5) * 0.3) * 10) / 10,
}));

// Generate per-machine electricity / RPM 2-month daily data
function genElectricityData(baseKwh: number) {
  return twoMonthDates.map((date, i) => ({
    date,
    kwh: Math.round(
      baseKwh + Math.sin(i * 0.4) * 40 + (Math.random() - 0.5) * 30,
    ),
  }));
}

function genRpmData(baseRpm: number) {
  return twoMonthDates.map((date, i) => ({
    date,
    rpm: Math.round(
      baseRpm + Math.cos(i * 0.3) * 200 + (Math.random() - 0.5) * 80,
    ),
  }));
}

// ─── 24-hour monitoring data ──────────────────────────────────────────────────
const temperatureData24h = [
  { time: "00:00", temp: 210 },
  { time: "02:00", temp: 215 },
  { time: "04:00", temp: 208 },
  { time: "06:00", temp: 220 },
  { time: "08:00", temp: 235 },
  { time: "10:00", temp: 242 },
  { time: "12:00", temp: 238 },
  { time: "14:00", temp: 255 },
  { time: "16:00", temp: 262 },
  { time: "18:00", temp: 248 },
  { time: "20:00", temp: 241 },
  { time: "22:00", temp: 230 },
  { time: "24:00", temp: 218 },
];

const vibrationData24h = [
  { time: "00:00", vibration: 0.8 },
  { time: "02:00", vibration: 1.2 },
  { time: "04:00", vibration: 0.9 },
  { time: "06:00", vibration: 1.5 },
  { time: "08:00", vibration: 2.1 },
  { time: "10:00", vibration: 1.8 },
  { time: "12:00", vibration: 2.4 },
  { time: "14:00", vibration: 3.1 },
  { time: "16:00", vibration: 2.7 },
  { time: "18:00", vibration: 1.9 },
  { time: "20:00", vibration: 1.4 },
  { time: "22:00", vibration: 1.1 },
  { time: "24:00", vibration: 0.9 },
];

function genElectricityData24h(baseKwh: number) {
  const times = [
    "00:00",
    "02:00",
    "04:00",
    "06:00",
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
    "22:00",
    "24:00",
  ];
  return times.map((time, i) => ({
    time,
    kwh: Math.round(baseKwh + Math.sin(i * 0.8) * 40 + i * 3),
  }));
}

function genRpmData24h(baseRpm: number) {
  const times = [
    "00:00",
    "02:00",
    "04:00",
    "06:00",
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
    "22:00",
    "24:00",
  ];
  return times.map((time, i) => ({
    time,
    rpm: Math.round(baseRpm + Math.cos(i * 0.6) * 200 + i * 10),
  }));
}

// ─── Risk level helper ────────────────────────────────────────────────────────
function getRiskLevel(machine: Machine): "high" | "medium" | "low" {
  const score = Number(machine.healthScore);
  const hasCriticalOrHigh = machine.predictionAlerts.some(
    (a) => a.severity === "High" || a.severity === "Critical",
  );
  const hasMedium = machine.predictionAlerts.some(
    (a) => a.severity === "Medium",
  );
  if (score < 40 || hasCriticalOrHigh) return "high";
  if (score <= 70 || hasMedium) return "medium";
  return "low";
}

const RISK_CONFIG = {
  high: {
    label: "High Risk",
    badgeClass: "bg-red-500/20 text-red-400 border-red-500/40",
    iconClass: "text-red-400",
    dotClass: "bg-red-400 animate-pulse",
    cardClass: "bg-red-500/10 border-red-500/25",
    textClass: "text-red-400",
  },
  medium: {
    label: "Medium Risk",
    badgeClass: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    iconClass: "text-amber-400",
    dotClass: "bg-amber-400",
    cardClass: "bg-amber-500/10 border-amber-500/25",
    textClass: "text-amber-400",
  },
  low: {
    label: "Low Risk",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    iconClass: "text-emerald-400",
    dotClass: "bg-emerald-400",
    cardClass: "bg-emerald-500/10 border-emerald-500/25",
    textClass: "text-emerald-400",
  },
} as const;

// ─── Demo machines ────────────────────────────────────────────────────────────
const DEMO_MACHINES: Machine[] = [
  {
    id: "machine-a",
    model: "DC-350T",
    manufacturer: "Toshiba",
    location: "Plant Floor 1",
    healthScore: BigInt(35),
    sensorReadings: {
      temperature: BigInt(262),
      vibration: BigInt(31),
      pressure: BigInt(85),
      oilLevel: BigInt(45),
      rpm: BigInt(1200),
      electricityUsage: 320,
      hoursSinceInspection: BigInt(72),
    },
    predictionAlerts: [
      {
        description: "Bearing failure imminent",
        severity: "High",
        likelihood: BigInt(87),
        predictedFailureTime: "< 24 hours",
      },
    ],
    maintenanceHistory: [
      {
        status: "completed" as any,
        cost: BigInt(15000),
        date: "2026-01-15",
        description: "Bearing replacement",
        remarks: "All bearings replaced",
      },
    ],
  },
  {
    id: "machine-b",
    model: "Carat 130",
    manufacturer: "Bühler",
    location: "Plant Floor 2",
    healthScore: BigInt(72),
    sensorReadings: {
      temperature: BigInt(218),
      vibration: BigInt(12),
      pressure: BigInt(92),
      oilLevel: BigInt(78),
      rpm: BigInt(950),
      electricityUsage: 280,
      hoursSinceInspection: BigInt(24),
    },
    predictionAlerts: [
      {
        description: "Minor vibration increase",
        severity: "Medium",
        likelihood: BigInt(45),
        predictedFailureTime: "3-5 days",
      },
    ],
    maintenanceHistory: [],
  },
  {
    id: "machine-c",
    model: "IP-200",
    manufacturer: "Italpresse",
    location: "Plant Floor 3",
    healthScore: BigInt(89),
    sensorReadings: {
      temperature: BigInt(195),
      vibration: BigInt(8),
      pressure: BigInt(96),
      oilLevel: BigInt(88),
      rpm: BigInt(1050),
      electricityUsage: 245,
      hoursSinceInspection: BigInt(12),
    },
    predictionAlerts: [],
    maintenanceHistory: [
      {
        status: "completed" as any,
        cost: BigInt(8000),
        date: "2026-02-10",
        description: "Oil change",
        remarks: "Completed on schedule",
      },
    ],
  },
];

// ─── Nav links ────────────────────────────────────────────────────────────────
const navLinks = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "How It Works", href: "#howitworks" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Impact", href: "#impact" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

// ─── Workflow steps ───────────────────────────────────────────────────────────
const workflowSteps = [
  { icon: Cpu, label: "Machine Sensors", num: "01" },
  { icon: Database, label: "Data Collection", num: "02" },
  { icon: Zap, label: "AI Analysis", num: "03" },
  { icon: AlertCircle, label: "Failure Prediction", num: "04" },
  { icon: Bell, label: "Dashboard Alert", num: "05" },
  { icon: Wrench, label: "Maintenance Action", num: "06" },
];

// ─── Tech stack ───────────────────────────────────────────────────────────────
const techStack = [
  {
    icon: Brain,
    title: "AI/ML Models",
    desc: "Custom neural networks trained on industrial sensor data for failure pattern recognition",
  },
  {
    icon: Cpu,
    title: "ICP Blockchain",
    desc: "Internet Computer Protocol for decentralized, tamper-proof data storage and processing",
  },
  {
    icon: BarChart2,
    title: "Recharts Analytics",
    desc: "Real-time visualization of sensor readings, trends, and predictive insights",
  },
  {
    icon: Wifi,
    title: "IoT Integration",
    desc: "Seamless sensor connectivity with edge computing for low-latency data processing",
  },
];

// ─── Roadmap ──────────────────────────────────────────────────────────────────
const roadmap = [
  {
    phase: "Phase 1",
    time: "Now",
    title: "Core Platform",
    desc: "Real-time sensor integration, AI model deployment, failure prediction alerts, and health-score dashboard.",
    color: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    phase: "Phase 2",
    time: "Q3 2026",
    title: "Smart Factory Integration",
    desc: "Multi-machine monitoring, ERP integration, automatic work-order generation, and on-premise deployment option.",
    color: "text-sky-400",
    badge: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  },
  {
    phase: "Phase 3",
    time: "2027",
    title: "Full IIoT Ecosystem",
    desc: "Autonomous maintenance scheduling, digital twin simulation, cross-plant analytics, and AI-driven spare-parts procurement.",
    color: "text-violet-400",
    badge: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const { login, clear, isInitializing, isLoggingIn, identity } =
    useInternetIdentity();
  const { actor } = useActor();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const shortPrincipal = identity
    ? `${identity.getPrincipal().toString().slice(0, 5)}...`
    : "";

  // ─── Profile state ───────────────────────────────────────────────────────
  const [userProfile, setUserProfile] = useState<{
    name: string;
    role: string;
    company: string;
    phone: string;
  } | null>(null);
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem("smartcast_user_email") ?? "";
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    role: "",
    company: "",
    phone: "",
    email: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // ─── Authorities state ────────────────────────────────────────────────────
  const [authorities, setAuthorities] = useState<
    { id: string; name: string; email: string; phone: string }[]
  >(() => {
    try {
      const stored = localStorage.getItem("smartcast_authorities");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [showAddAuthorityForm, setShowAddAuthorityForm] = useState(false);
  const [authorityForm, setAuthorityForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editingAuthorityId, setEditingAuthorityId] = useState<string | null>(
    null,
  );
  const [editAuthorityForm, setEditAuthorityForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const saveAuthorities = (
    list: { id: string; name: string; email: string; phone: string }[],
  ) => {
    setAuthorities(list);
    localStorage.setItem("smartcast_authorities", JSON.stringify(list));
  };

  const handleAddAuthority = (e: React.FormEvent) => {
    e.preventDefault();
    const newAuth = { ...authorityForm, id: Date.now().toString() };
    saveAuthorities([...authorities, newAuth]);
    setAuthorityForm({ name: "", email: "", phone: "" });
    setShowAddAuthorityForm(false);
    toast.success("Authority added.");
  };

  const handleRemoveAuthority = (id: string) => {
    saveAuthorities(authorities.filter((a) => a.id !== id));
    toast.success("Authority removed.");
  };

  // ─── Machine list state ───────────────────────────────────────────────────
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loadingMachines, setLoadingMachines] = useState(false);

  // ─── Machine detail state ─────────────────────────────────────────────────
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(
    null,
  );
  const [machineData, setMachineData] = useState<Machine | null | undefined>(
    undefined,
  );
  const [loadingMachine, setLoadingMachine] = useState(false);

  // ─── Add Machine dialog ───────────────────────────────────────────────────
  const [showAddMachine, setShowAddMachine] = useState(false);
  const [addMachineForm, setAddMachineForm] = useState({
    id: "",
    manufacturer: "",
    model: "",
    location: "",
    temperature: "",
    vibration: "",
    pressure: "",
    oilLevel: "",
    rpm: "",
    electricityUsage: "",
    hoursSinceInspection: "",
  });
  const [addingMachine, setAddingMachine] = useState(false);

  // ─── Edit Machine dialog ──────────────────────────────────────────────────
  const [editMachine, setEditMachine] = useState<Machine | null>(null);
  const [editMachineForm, setEditMachineForm] = useState({
    manufacturer: "",
    model: "",
    location: "",
  });
  const [savingMachine, setSavingMachine] = useState(false);

  // ─── Remove Machine confirm ───────────────────────────────────────────────
  const [removeMachineId, setRemoveMachineId] = useState<string | null>(null);
  const [removingMachine, setRemovingMachine] = useState(false);
  const [selectedChartMachineIdx, setSelectedChartMachineIdx] = useState(0);
  const [chartRange, setChartRange] = useState<"24h" | "2mo">("24h");

  // ─── Notifications ────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState<AuthorityNotification[]>(
    [],
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [alertBanners, setAlertBanners] = useState<
    { machineId: string; machineName: string; message: string }[]
  >([]);
  const notifiedSet = useRef(new Set<string>());

  // ─── Fetch profile ────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated || !actor) return;
    try {
      const profile = await actor.getCallerUserProfile();
      if (profile) {
        setUserProfile(profile);
      } else {
        setShowProfileModal(true);
      }
    } catch (e) {
      console.error("Failed to fetch profile", e);
    }
  }, [isAuthenticated, actor]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ─── Fetch machines ───────────────────────────────────────────────────────
  const fetchMachines = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingMachines(true);
    try {
      let list: Machine[] = [];
      if (actor) {
        list = await actor.getAllMachines();
      }
      if (list.length === 0) {
        list = DEMO_MACHINES;
      }
      setMachines(list);
    } catch (e) {
      console.error("Failed to fetch machines", e);
      setMachines(DEMO_MACHINES);
    } finally {
      setLoadingMachines(false);
    }
  }, [isAuthenticated, actor]);

  useEffect(() => {
    fetchMachines();
  }, [fetchMachines]);

  // ─── Check alert conditions & notify authorities ──────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!actor) return;
    try {
      const notifs = await actor.getNotifications();
      setNotifications(notifs);
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    }
  }, [actor]);

  useEffect(() => {
    if (!isAuthenticated || machines.length === 0) return;
    const banners: {
      machineId: string;
      machineName: string;
      message: string;
    }[] = [];
    for (const m of machines) {
      const score = Number(m.healthScore);
      const hasCritical = m.predictionAlerts.some(
        (a) => a.severity === "High" || a.severity === "Critical",
      );
      if (score < 40 || hasCritical) {
        const machineName = `${m.manufacturer} ${m.model} (${m.id})`;
        const issue =
          score < 40
            ? `Health score critically low: ${score}%`
            : (m.predictionAlerts.find(
                (a) => a.severity === "High" || a.severity === "Critical",
              )?.description ?? "Critical alert detected");
        banners.push({ machineId: m.id, machineName, message: issue });

        if (!notifiedSet.current.has(m.id) && actor) {
          notifiedSet.current.add(m.id);
          // Notify authorities with email or phone
          const storedAuths = (() => {
            try {
              const s = localStorage.getItem("smartcast_authorities");
              return s
                ? (JSON.parse(s) as {
                    id: string;
                    name: string;
                    email: string;
                    phone: string;
                  }[])
                : [];
            } catch {
              return [];
            }
          })();
          const reachable = storedAuths.filter((a) => a.email || a.phone);
          if (reachable.length > 0) {
            const names = reachable.map((a) => a.name).join(", ");
            toast.warning(`🚨 Emergency alert sent to: ${names}`, {
              duration: 7000,
              description: `Machine: ${machineName} — ${issue}`,
            });
          }
          actor
            .notifyAuthorities(
              m.id,
              machineName,
              issue,
              score < 40 ? "Critical" : "High",
            )
            .then(() => {
              fetchNotifications();
            })
            .catch(console.error);
        }
      }
    }
    setAlertBanners(banners);
    fetchNotifications();
  }, [machines, isAuthenticated, actor, fetchNotifications]);

  // ─── Save profile (first-time modal) ─────────────────────────────────────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { email: _email, ...profileData } = profileForm;
      if (actor) await actor.saveCallerUserProfile(profileData);
      setUserProfile(profileData);
      setUserEmail(_email);
      localStorage.setItem("smartcast_user_email", _email);
      setShowProfileModal(false);
      toast.success("Profile saved!");
    } catch (e) {
      console.error("Failed to save profile", e);
      toast.error("Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // ─── Save profile (edit dialog) ───────────────────────────────────────────
  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { email: _email, ...profileData } = profileForm;
      if (actor) await actor.saveCallerUserProfile(profileData);
      setUserProfile(profileData);
      setUserEmail(_email);
      localStorage.setItem("smartcast_user_email", _email);
      setShowEditProfileDialog(false);
      toast.success("Profile updated successfully!");
    } catch (e) {
      console.error("Failed to update profile", e);
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // ─── Machine detail ───────────────────────────────────────────────────────
  const openMachineDetail = (machineId: string) => {
    const m = machines.find((x) => x.id === machineId) ?? null;
    setSelectedMachineId(machineId);
    setMachineData(m);
    setLoadingMachine(false);
  };

  const closeMachineDetail = () => {
    setSelectedMachineId(null);
    setMachineData(undefined);
  };

  // ─── Add machine ──────────────────────────────────────────────────────────
  const handleAddMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingMachine(true);
    const newMachine: Machine = {
      id: addMachineForm.id,
      model: addMachineForm.model,
      manufacturer: addMachineForm.manufacturer,
      location: addMachineForm.location,
      healthScore: BigInt(100),
      sensorReadings: {
        rpm: BigInt(
          addMachineForm.rpm ? Number.parseInt(addMachineForm.rpm) : 0,
        ),
        oilLevel: BigInt(
          addMachineForm.oilLevel
            ? Number.parseInt(addMachineForm.oilLevel)
            : 0,
        ),
        temperature: BigInt(
          addMachineForm.temperature
            ? Number.parseInt(addMachineForm.temperature)
            : 0,
        ),
        vibration: BigInt(
          addMachineForm.vibration
            ? Number.parseInt(addMachineForm.vibration)
            : 0,
        ),
        hoursSinceInspection: BigInt(
          addMachineForm.hoursSinceInspection
            ? Number.parseInt(addMachineForm.hoursSinceInspection)
            : 0,
        ),
        pressure: BigInt(
          addMachineForm.pressure
            ? Number.parseInt(addMachineForm.pressure)
            : 0,
        ),
        electricityUsage: addMachineForm.electricityUsage
          ? Number.parseFloat(addMachineForm.electricityUsage)
          : 0,
      },
      predictionAlerts: [],
      maintenanceHistory: [],
    };
    try {
      if (actor) await actor.addMachine(newMachine);
      setMachines((prev) => [...prev, newMachine]);
      setShowAddMachine(false);
      setAddMachineForm({
        id: "",
        manufacturer: "",
        model: "",
        location: "",
        temperature: "",
        vibration: "",
        pressure: "",
        oilLevel: "",
        rpm: "",
        electricityUsage: "",
        hoursSinceInspection: "",
      });
      toast.success("Machine added successfully!");
    } catch (e) {
      console.error("Failed to add machine", e);
      toast.error("Failed to add machine");
    } finally {
      setAddingMachine(false);
    }
  };

  // ─── Edit machine ─────────────────────────────────────────────────────────
  const openEditMachine = (m: Machine) => {
    setEditMachine(m);
    setEditMachineForm({
      manufacturer: m.manufacturer,
      model: m.model,
      location: m.location,
    });
  };

  const handleEditMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMachine) return;
    setSavingMachine(true);
    const updated: Machine = {
      ...editMachine,
      manufacturer: editMachineForm.manufacturer,
      model: editMachineForm.model,
      location: editMachineForm.location,
    };
    try {
      if (actor) await actor.addMachine(updated);
      setMachines((prev) =>
        prev.map((m) => (m.id === updated.id ? updated : m)),
      );
      setEditMachine(null);
      toast.success("Machine updated!");
    } catch (e) {
      console.error("Failed to update machine", e);
      toast.error("Failed to update machine");
    } finally {
      setSavingMachine(false);
    }
  };

  // ─── Remove machine ───────────────────────────────────────────────────────
  const confirmRemoveMachine = async () => {
    if (!removeMachineId) return;
    setRemovingMachine(true);
    try {
      if (actor) await actor.removeMachine(removeMachineId);
      setMachines((prev) => prev.filter((m) => m.id !== removeMachineId));
      setRemoveMachineId(null);
      toast.success("Machine removed.");
    } catch (e) {
      console.error("Failed to remove machine", e);
      toast.error("Failed to remove machine");
    } finally {
      setRemovingMachine(false);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const selectedMachine =
    machines.find((m) => m.id === selectedMachineId) ?? machineData ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />

      {/* ── Sticky Nav ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg"
            : "bg-background/80 backdrop-blur-md border-b border-border"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="/#"
              className="flex items-center gap-2.5 group"
              data-ocid="nav.link"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center glow-sky transition-all group-hover:bg-primary/30">
                <Cpu className="w-4 h-4 text-sky icon-glow" />
              </div>
              <span className="font-display font-700 text-lg tracking-tight">
                <span className="text-gradient-sky">SmartCast</span>
                <span className="text-foreground"> AI</span>
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="px-3 py-1.5 text-sm text-black hover:text-gray-700 transition-colors rounded-md hover:bg-muted/50"
                  data-ocid="nav.link"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {isInitializing || isLoggingIn ? (
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/30"
                  data-ocid="auth.loading_state"
                >
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Loading...
                  </span>
                </div>
              ) : isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 px-3 hover:bg-muted/50"
                      data-ocid="auth.user_button"
                    >
                      <div className="w-6 h-6 rounded-full bg-sky/20 border border-sky/40 flex items-center justify-center">
                        <User className="w-3 h-3 text-sky" />
                      </div>
                      <span className="text-sm text-foreground">
                        {userProfile ? userProfile.name : shortPrincipal}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-card border-border"
                  >
                    {userProfile && (
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-sm font-medium">
                          {userProfile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {userProfile.company}
                        </p>
                        {userEmail && (
                          <p className="text-xs text-muted-foreground">
                            {userEmail}
                          </p>
                        )}
                      </div>
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        setProfileForm({
                          ...(userProfile ?? {
                            name: "",
                            role: "",
                            company: "",
                            phone: "",
                          }),
                          email: userEmail,
                        });
                        setShowEditProfileDialog(true);
                      }}
                      className="gap-2 cursor-pointer"
                      data-ocid="profile.edit_button"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={clear}
                      className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                      data-ocid="auth.logout_button"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={login}
                  className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  data-ocid="auth.login_button"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md hover:bg-muted/50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-ocid="nav.toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="px-3 py-2 text-sm text-left text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                  data-ocid="nav.link"
                >
                  {link.label}
                </button>
              ))}
              <div className="border-t border-border pt-3 mt-2">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      {userProfile ? userProfile.name : shortPrincipal}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={clear}
                      className="h-7 gap-1 hover:text-destructive"
                      data-ocid="auth.logout_button"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={login}
                    className="w-full justify-start gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    data-ocid="auth.login_button"
                  >
                    <LogIn className="w-4 h-4" />
                    Login with Internet Identity
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── 1. Hero ── */}
      <section
        id="hero"
        data-ocid="hero.section"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-banner.dim_1400x700.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.78 0.13 210 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.13 210 / 0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky/30 bg-sky/10 text-sky text-xs font-medium mb-6 animate-fade-up">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live AI Monitoring · v2.4.1
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-800 leading-tight mb-6 text-gradient-white-sky animate-fade-up">
            AI Predictive Maintenance
            <br className="hidden sm:block" />
            for Die Casting Machines
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up">
            Prevent machine failures before they happen using AI and sensor
            data. Reduce downtime. Cut costs. Keep production running.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up">
            <Button
              size="lg"
              onClick={() => scrollTo("#dashboard")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold shadow-glow"
              data-ocid="hero.primary_button"
            >
              View Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollTo("#solution")}
              className="border-sky/40 text-sky hover:bg-sky/10 px-8 py-6 text-base font-semibold"
              data-ocid="hero.secondary_button"
            >
              Learn More
            </Button>
          </div>
          {/* Live stats bar */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto">
            {[
              { label: "Downtime Reduced", value: "30%" },
              { label: "Annual Savings", value: "₹8L" },
              { label: "Machines Monitored", value: "150+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-display font-800 text-gradient-sky">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Problem ── */}
      <section
        id="problem"
        data-ocid="problem.section"
        className="py-24 bg-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-red-500/20 text-red-400 border-red-500/30">
              The Problem
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-700 mb-4">
              Die Casting Machines{" "}
              <span className="text-red-400">Fail Unexpectedly</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Unplanned breakdowns cost Indian manufacturers crores in lost
              production and emergency repairs every year.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: AlertTriangle,
                value: "47%",
                label: "of breakdowns are unplanned",
                color: "text-red-400",
                bg: "bg-red-500/10 border-red-500/25",
              },
              {
                icon: TrendingDown,
                value: "₹5–8L",
                label: "average annual repair cost per plant",
                color: "text-amber-400",
                bg: "bg-amber-500/10 border-amber-500/25",
              },
              {
                icon: IndianRupee,
                value: "23h",
                label: "average downtime per incident",
                color: "text-orange-400",
                bg: "bg-orange-500/10 border-orange-500/25",
              },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`surface-card rounded-2xl p-6 border ${stat.bg}`}
                data-ocid={`problem.card.${i + 1}`}
              >
                <stat.icon className={`w-10 h-10 mb-4 ${stat.color}`} />
                <p
                  className={`text-4xl font-display font-800 ${stat.color} mb-2`}
                >
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Solution ── */}
      <section
        id="solution"
        data-ocid="solution.section"
        style={{ background: "#ffffff" }}
        className="py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-sky/20 text-sky border-sky/30">
              Our Solution
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-700 mb-4">
              Predict Before{" "}
              <span className="text-gradient-sky">It Breaks</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              SmartCast AI continuously monitors sensor data and uses ML models
              to predict failures days before they happen.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Thermometer,
                title: "Real-Time Sensors",
                desc: "Temperature, vibration, pressure, RPM, oil level — all monitored 24/7 with millisecond latency.",
              },
              {
                icon: Brain,
                title: "AI Prediction",
                desc: "Neural networks trained on thousands of failure events detect early warning patterns invisible to humans.",
              },
              {
                icon: Bell,
                title: "Instant Alerts",
                desc: "Push notifications to maintenance teams the moment risk exceeds safe thresholds.",
              },
              {
                icon: TrendingUp,
                title: "Cost Savings",
                desc: "Proactive maintenance reduces costs by up to 30% compared to reactive breakdown repairs.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="surface-card rounded-2xl p-6 hover:scale-[1.03] transition-transform duration-300 group"
                data-ocid={`solution.card.${i + 1}`}
              >
                <div className="w-12 h-12 rounded-xl bg-sky/10 border border-sky/25 flex items-center justify-center mb-5 group-hover:shadow-glow transition-all">
                  <item.icon className="w-6 h-6 text-sky icon-glow" />
                </div>
                <h3 className="font-display font-600 text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. How It Works ── */}
      <section
        id="howitworks"
        data-ocid="howitworks.section"
        className="py-24 bg-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-violet-500/20 text-violet-400 border-violet-500/30">
              Process
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-700 mb-4">
              How It <span className="text-gradient-sky">Works</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {workflowSteps.map((step, i) => (
              <div
                key={step.num}
                className="flex flex-col items-center text-center group"
                data-ocid={`workflow.card.${i + 1}`}
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky/20 to-primary/20 border border-sky/30 flex items-center justify-center group-hover:shadow-glow transition-all">
                    <step.icon className="w-7 h-7 text-sky icon-glow" />
                  </div>
                  <span className="absolute -top-2 -right-2 text-xs font-mono font-700 text-sky/70 bg-background border border-sky/20 rounded-md px-1">
                    {step.num}
                  </span>
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Dashboard ── */}
      <section
        id="dashboard"
        data-ocid="dashboard.section"
        style={{ background: "#ffffff" }}
        className="py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-sky/20 text-sky border-sky/30">
              Live Preview
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-700 mb-4">
              Live Dashboard <span className="text-gradient-sky">Preview</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Real-time analytics at a glance
            </p>
          </div>

          {/* ── AUTH GATE ── */}
          {!isAuthenticated ? (
            <div
              className="rounded-2xl border border-border overflow-hidden shadow-2xl flex flex-col items-center justify-center py-24 gap-6"
              style={{ background: "oklch(0.98 0.005 264)" }}
            >
              <div className="w-20 h-20 rounded-2xl bg-sky/10 border border-sky/30 flex items-center justify-center">
                <Lock className="w-10 h-10 text-sky" />
              </div>
              <div className="text-center">
                <h3 className="font-display font-700 text-2xl mb-2">
                  Dashboard Access Restricted
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Please log in with Internet Identity to access live machine
                  monitoring, analytics, and control features.
                </p>
              </div>
              <Button
                size="lg"
                onClick={login}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8"
                data-ocid="dashboard.login_button"
              >
                <LogIn className="w-5 h-5" />
                Login to Access Dashboard
              </Button>
            </div>
          ) : (
            /* ── FULL DASHBOARD ── */
            <div
              className="rounded-2xl border border-border overflow-hidden shadow-2xl"
              style={{ background: "oklch(0.98 0.005 264)" }}
            >
              {/* Top bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                <span className="ml-4 text-xs text-muted-foreground font-mono flex-1">
                  SmartCast AI — Operations Dashboard
                </span>
                <div className="flex items-center gap-2">
                  {/* Notifications bell */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotifications(true)}
                    className="relative h-8 w-8 p-0 hover:bg-muted/50"
                    data-ocid="notifications.bell_button"
                  >
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                        {notifications.length > 9 ? "9+" : notifications.length}
                      </span>
                    )}
                  </Button>
                  {/* Add machine */}
                  <Button
                    size="sm"
                    onClick={() => setShowAddMachine(true)}
                    className="h-8 gap-1.5 text-xs bg-sky/20 hover:bg-sky/30 text-sky border border-sky/30"
                    data-ocid="dashboard.add_machine_button"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Machine
                  </Button>
                </div>
              </div>

              {/* Critical alert banners */}
              {alertBanners.map((b) => (
                <div
                  key={b.machineId}
                  className="flex items-center gap-3 px-4 py-2.5 bg-red-500/15 border-b border-red-500/30"
                  data-ocid="dashboard.alert_banner"
                >
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-300 font-medium">
                    <span className="font-bold text-red-400">ALERT:</span>{" "}
                    {b.machineName} requires immediate attention — {b.message}
                  </p>
                </div>
              ))}

              {/* Risk Summary bar */}
              {machines.length > 0 &&
                (() => {
                  const counts = { high: 0, medium: 0, low: 0 };
                  for (const m of machines) counts[getRiskLevel(m)]++;
                  return (
                    <div
                      className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 py-3 border-b border-border"
                      data-ocid="dashboard.risk_summary"
                    >
                      <div
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 border border-sky/30 bg-sky/5"
                        data-ocid="dashboard.total_machines.card"
                      >
                        <div className="w-2.5 h-2.5 rounded-full shrink-0 bg-sky-400" />
                        <div className="min-w-0">
                          <p className="text-lg font-display font-700 leading-none text-sky-400">
                            {machines.length}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            Total Machines
                          </p>
                        </div>
                      </div>
                      {(["high", "medium", "low"] as const).map((level) => {
                        const cfg = RISK_CONFIG[level];
                        return (
                          <div
                            key={level}
                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 border ${cfg.cardClass}`}
                          >
                            <div
                              className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dotClass}`}
                            />
                            <div className="min-w-0">
                              <p
                                className={`text-lg font-display font-700 leading-none ${cfg.textClass}`}
                              >
                                {counts[level]}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                {cfg.label}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

              {/* Alerts Panel */}
              <div
                className={`mx-4 mt-4 mb-2 rounded-xl border p-4 ${alertBanners.length > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}
                data-ocid="dashboard.alerts_panel"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Bell
                    className={`w-4 h-4 ${alertBanners.length > 0 ? "text-red-500" : "text-green-600"}`}
                  />
                  <h3 className="text-sm font-semibold text-gray-800">
                    Machine Alerts
                  </h3>
                  {alertBanners.length > 0 && (
                    <span className="ml-auto text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                      {alertBanners.length} ACTIVE
                    </span>
                  )}
                </div>
                {alertBanners.length === 0 ? (
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium">
                      All machines operating normally
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {alertBanners.map((b) => (
                      <div
                        key={b.machineId}
                        className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-red-200"
                      >
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="text-sm font-bold text-gray-800">
                          {b.machineName}
                        </span>
                        <span className="text-xs text-gray-600 flex-1">
                          {b.message}
                        </span>
                        <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded">
                          CRITICAL
                        </span>
                        <span className="text-xs text-gray-400 font-mono shrink-0">
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Metric cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    {
                      label: "Total Machines",
                      value: String(machines.length),
                      color: "text-sky",
                      sub: "All monitored",
                      subColor: "text-sky",
                    },
                    {
                      label: "Active Alerts",
                      value: String(
                        machines.reduce(
                          (s, m) => s + m.predictionAlerts.length,
                          0,
                        ),
                      ),
                      color: "text-amber-400",
                      sub: "Needs attention",
                      subColor: "text-amber-400",
                    },
                    {
                      label: "Critical Machines",
                      value: String(
                        machines.filter((m) => Number(m.healthScore) < 40)
                          .length,
                      ),
                      color: "text-red-400",
                      sub: "Health < 40%",
                      subColor: "text-red-400",
                    },
                    {
                      label: "Avg Health Score",
                      value: machines.length
                        ? `${Math.round(machines.reduce((s, m) => s + Number(m.healthScore), 0) / machines.length)}%`
                        : "—",
                      color: "text-emerald-400",
                      sub: "Fleet average",
                      subColor: "text-muted-foreground",
                    },
                  ].map((m, i) => (
                    <div
                      key={m.label}
                      className="surface-card rounded-xl p-4"
                      data-ocid={`dashboard.card.${i + 1}`}
                    >
                      <p className="text-xs text-muted-foreground mb-2">
                        {m.label}
                      </p>
                      <p
                        className={`text-2xl font-display font-700 ${m.color}`}
                      >
                        {m.value}
                      </p>
                      <p className={`text-xs mt-1 ${m.subColor}`}>{m.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Chart Range Toggle */}
                <div
                  className="flex items-center gap-1 mb-4"
                  data-ocid="dashboard.chart_range_toggle"
                >
                  <span className="text-xs text-gray-500 mr-2">View:</span>
                  <button
                    type="button"
                    className={`px-3 py-1 text-xs rounded-l border font-medium transition-colors ${chartRange === "24h" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                    onClick={() => setChartRange("24h")}
                    data-ocid="dashboard.chart_24h_button"
                  >
                    24H
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1 text-xs rounded-r border-t border-b border-r font-medium transition-colors ${chartRange === "2mo" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                    onClick={() => setChartRange("2mo")}
                    data-ocid="dashboard.chart_2mo_button"
                  >
                    2 Months
                  </button>
                </div>

                {/* Charts — Temperature & Vibration */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="surface-card rounded-xl p-4">
                    <h3 className="text-sm font-semibold mb-4 text-foreground">
                      {chartRange === "24h"
                        ? "Temperature Monitoring (24H)"
                        : "Temperature Monitoring (2-Month Trend)"}
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart
                        data={
                          chartRange === "24h"
                            ? temperatureData24h
                            : temperatureData
                        }
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey={chartRange === "24h" ? "time" : "date"}
                          tick={{ fontSize: 10, fill: "#374151" }}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: "#374151" }}
                          domain={[200, 280]}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                          labelStyle={{ color: "#111827" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="temp"
                          stroke="#f97316"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, fill: "#f97316" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="surface-card rounded-xl p-4">
                    <h3 className="text-sm font-semibold mb-4 text-foreground">
                      {chartRange === "24h"
                        ? "Vibration Analysis (24H)"
                        : "Vibration Analysis (2-Month Trend)"}
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart
                        data={
                          chartRange === "24h"
                            ? vibrationData24h
                            : vibrationData
                        }
                      >
                        <defs>
                          <linearGradient
                            id="vibGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#6366f1"
                              stopOpacity={0.4}
                            />
                            <stop
                              offset="95%"
                              stopColor="#6366f1"
                              stopOpacity={0.02}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey={chartRange === "24h" ? "time" : "date"}
                          tick={{ fontSize: 10, fill: "#374151" }}
                        />
                        <YAxis tick={{ fontSize: 10, fill: "#374151" }} />
                        <Tooltip
                          contentStyle={{
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                          labelStyle={{ color: "#111827" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="vibration"
                          stroke="#6366f1"
                          strokeWidth={2}
                          fill="url(#vibGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Charts — Electricity & RPM for selected machine */}
                {machines.length > 0 &&
                  (() => {
                    const activeMachine =
                      machines[selectedChartMachineIdx] || machines[0];
                    const elecData =
                      chartRange === "24h"
                        ? genElectricityData24h(
                            activeMachine.sensorReadings.electricityUsage,
                          )
                        : genElectricityData(
                            activeMachine.sensorReadings.electricityUsage,
                          );
                    const elecDataKey = chartRange === "24h" ? "time" : "date";
                    const rpmData =
                      chartRange === "24h"
                        ? genRpmData24h(
                            Number(activeMachine.sensorReadings.rpm),
                          )
                        : genRpmData(Number(activeMachine.sensorReadings.rpm));
                    const rpmDataKey = chartRange === "24h" ? "time" : "date";
                    return (
                      <div>
                        {machines.length > 1 && (
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs font-medium text-gray-600">
                              Machine:
                            </span>
                            <select
                              className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700"
                              value={selectedChartMachineIdx}
                              onChange={(e) =>
                                setSelectedChartMachineIdx(
                                  Number(e.target.value),
                                )
                              }
                              data-ocid="dashboard.select"
                            >
                              {machines.map((m, i) => (
                                <option key={m.id} value={i}>
                                  {m.manufacturer} {m.model}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                          <div className="surface-card rounded-xl p-4">
                            <h3 className="text-sm font-semibold mb-1 text-foreground">
                              Electricity Usage (kWh)
                            </h3>
                            <p className="text-xs text-muted-foreground mb-3">
                              {activeMachine.manufacturer} {activeMachine.model}{" "}
                              —{" "}
                              {chartRange === "24h"
                                ? "24-hour trend"
                                : "2-month daily trend"}
                            </p>
                            <ResponsiveContainer width="100%" height={200}>
                              <AreaChart data={elecData}>
                                <defs>
                                  <linearGradient
                                    id="elecGrad"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor="#10b981"
                                      stopOpacity={0.4}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor="#10b981"
                                      stopOpacity={0.02}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#e5e7eb"
                                />
                                <XAxis
                                  dataKey={elecDataKey}
                                  tick={{
                                    fontSize: 10,
                                    fill: "#374151",
                                  }}
                                />
                                <YAxis
                                  tick={{
                                    fontSize: 10,
                                    fill: "#374151",
                                  }}
                                  domain={[150, 450]}
                                />
                                <Tooltip
                                  contentStyle={{
                                    background: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: 8,
                                    fontSize: 12,
                                  }}
                                  labelStyle={{ color: "#111827" }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="kwh"
                                  stroke="#10b981"
                                  strokeWidth={2}
                                  fill="url(#elecGrad)"
                                  name="kWh"
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>

                          <div className="surface-card rounded-xl p-4">
                            <h3 className="text-sm font-semibold mb-1 text-foreground">
                              Rotations Per Minute (RPM)
                            </h3>
                            <p className="text-xs text-muted-foreground mb-3">
                              {activeMachine.manufacturer} {activeMachine.model}{" "}
                              —{" "}
                              {chartRange === "24h"
                                ? "24-hour trend"
                                : "2-month daily trend"}
                            </p>
                            <ResponsiveContainer width="100%" height={200}>
                              <LineChart data={rpmData}>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#e5e7eb"
                                />
                                <XAxis
                                  dataKey={rpmDataKey}
                                  tick={{
                                    fontSize: 10,
                                    fill: "#374151",
                                  }}
                                />
                                <YAxis
                                  tick={{
                                    fontSize: 10,
                                    fill: "#374151",
                                  }}
                                  domain={[600, 2200]}
                                />
                                <Tooltip
                                  contentStyle={{
                                    background: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: 8,
                                    fontSize: 12,
                                  }}
                                  labelStyle={{ color: "#111827" }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="rpm"
                                  stroke="#8b5cf6"
                                  strokeWidth={2}
                                  dot={false}
                                  activeDot={{
                                    r: 4,
                                    fill: "#8b5cf6",
                                  }}
                                  name="RPM"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                {/* Machine list */}
                <div className="surface-card rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Machine Fleet</h3>
                    <Badge className="bg-sky/20 text-sky border-sky/30 text-xs">
                      {machines.length} Machines
                    </Badge>
                  </div>

                  {loadingMachines ? (
                    <div
                      className="p-4 space-y-2"
                      data-ocid="dashboard.loading_state"
                    >
                      {[1, 2, 3].map((n) => (
                        <Skeleton key={n} className="h-12 rounded-lg" />
                      ))}
                    </div>
                  ) : machines.length === 0 ? (
                    <div
                      className="flex flex-col items-center py-12 gap-3 text-center"
                      data-ocid="dashboard.empty_state"
                    >
                      <Factory className="w-10 h-10 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">
                        No machines yet. Add your first machine.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {machines.map((machine, i) => {
                        const score = Number(machine.healthScore);
                        const scoreColor =
                          score > 70
                            ? "text-emerald-400"
                            : score > 40
                              ? "text-amber-400"
                              : "text-red-400";
                        const riskLevel = getRiskLevel(machine);
                        const riskCfg = RISK_CONFIG[riskLevel];
                        return (
                          <div
                            key={machine.id}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/10 group transition-colors"
                            data-ocid={`machine.item.${i + 1}`}
                          >
                            <button
                              type="button"
                              className="flex-1 flex items-center gap-3 text-left"
                              onClick={() => openMachineDetail(machine.id)}
                            >
                              <div
                                className={`w-2 h-2 rounded-full shrink-0 ${riskCfg.dotClass}`}
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-medium truncate">
                                    {machine.manufacturer} {machine.model}
                                  </span>
                                  {/* Risk badge */}
                                  <Badge
                                    className={`text-xs h-5 px-1.5 font-semibold ${riskCfg.badgeClass}`}
                                    data-ocid={`machine.risk_badge.${i + 1}`}
                                  >
                                    {riskCfg.label}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-3 mt-0.5">
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {machine.location}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {machine.predictionAlerts.length} alert
                                    {machine.predictionAlerts.length !== 1
                                      ? "s"
                                      : ""}
                                  </span>
                                </div>
                              </div>
                              <span
                                className={`text-sm font-bold font-mono shrink-0 ${scoreColor}`}
                              >
                                {score}%
                              </span>
                            </button>
                            {/* Edit button */}
                            <button
                              type="button"
                              onClick={() => openEditMachine(machine)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-sky/10 hover:text-sky transition-all"
                              title="Edit machine"
                              data-ocid={`machine.edit_button.${i + 1}`}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => setRemoveMachineId(machine.id)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/10 hover:text-red-400 transition-all"
                              title="Remove machine"
                              data-ocid={`machine.remove_button.${i + 1}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 6. Impact ── */}
      <section
        id="impact"
        data-ocid="impact.section"
        className="py-24 bg-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              Business Impact
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-700 mb-4">
              Measurable <span className="text-gradient-sky">Results</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingDown,
                value: "30%",
                label: "Reduction in unplanned downtime",
                color: "text-emerald-400",
              },
              {
                icon: IndianRupee,
                value: "₹8L",
                label: "Annual maintenance savings per plant",
                color: "text-sky",
              },
              {
                icon: CheckCircle2,
                value: "92%",
                label: "Prediction accuracy rate",
                color: "text-violet-400",
              },
              {
                icon: TrendingUp,
                value: "+15%",
                label: "Higher Production Efficiency",
                color: "text-emerald-400",
              },
              {
                icon: Wrench,
                value: "2×",
                label: "Improved Machine Lifespan",
                color: "text-sky",
              },
              {
                icon: Wifi,
                value: "Ready",
                label: "Supports Industry 4.0",
                color: "text-violet-400",
              },
            ].map((item, i) => (
              <div
                key={item.label}
                className="surface-card rounded-2xl p-6 text-center"
                data-ocid={`impact.card.${i + 1}`}
              >
                <item.icon className={`w-10 h-10 mx-auto mb-4 ${item.color}`} />
                <p
                  className={`text-4xl font-display font-800 mb-2 ${item.color}`}
                >
                  {item.value}
                </p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Tech Stack ── */}
      <section
        id="tech"
        data-ocid="tech.section"
        style={{ background: "#ffffff" }}
        className="py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-sky/20 text-sky border-sky/30">
              Built With
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-700 mb-4">
              Technology <span className="text-gradient-sky">Stack</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, i) => (
              <div
                key={tech.title}
                className="surface-card rounded-2xl p-6 text-center hover:scale-105 hover:surface-card-glow transition-all duration-300 group"
                data-ocid={`tech.card.${i + 1}`}
              >
                <div className="w-16 h-16 rounded-2xl bg-sky/10 border border-sky/25 flex items-center justify-center mx-auto mb-5 group-hover:shadow-glow transition-all">
                  <tech.icon className="w-8 h-8 text-sky icon-glow" />
                </div>
                <h3 className="font-display font-600 text-base mb-2">
                  {tech.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tech.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Future Scope ── */}
      <section
        id="future"
        data-ocid="future.section"
        className="py-24 bg-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-violet-500/20 text-violet-400 border-violet-500/30">
              Roadmap
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-700 mb-4">
              Future <span className="text-gradient-sky">Roadmap</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Our vision to transform die casting operations at scale.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roadmap.map((item, i) => (
              <div
                key={item.phase}
                className="surface-card rounded-2xl p-6 relative overflow-hidden"
                data-ocid={`future.card.${i + 1}`}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky/50 to-transparent" />
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={`text-xs ${item.badge}`}>
                    {item.phase}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {item.time}
                  </span>
                </div>
                <h3
                  className={`font-display font-700 text-lg mb-3 ${item.color}`}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section
        id="team"
        data-ocid="team.section"
        className="py-24 bg-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-sky/20 text-sky border-sky/30">
              Meet the Team
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-700 mb-4">
              The Innovators{" "}
              <span className="text-gradient-sky">Behind SmartCast</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A passionate team of AI &amp; Data Science students building the
              future of industrial intelligence.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "S Sharan", role: "AI&DS Student", initials: "SS" },
              { name: "S Shivaram", role: "AI&DS Student", initials: "SH" },
              { name: "N Krishiv", role: "AI&DS Student", initials: "NK" },
              { name: "M Abishek", role: "AI&DS Student", initials: "MA" },
            ].map((member, i) => (
              <div
                key={member.name}
                className="surface-card rounded-2xl p-6 flex flex-col items-center text-center gap-4"
                data-ocid={`team.item.${i + 1}`}
              >
                <div className="w-20 h-20 rounded-full bg-sky/15 border-2 border-sky/30 flex items-center justify-center">
                  <span className="font-display font-700 text-xl text-sky">
                    {member.initials}
                  </span>
                </div>
                <div>
                  <p className="font-display font-700 text-lg text-foreground">
                    {member.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. Contact ── */}
      <section
        id="contact"
        data-ocid="contact.section"
        className="py-24 bg-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-sky/20 text-sky border-sky/30">
              Contact
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-700 mb-4">
              Get in <span className="text-gradient-sky">Touch</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="surface-card-glow rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sky/15 border border-sky/30 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-sky icon-glow" />
                  </div>
                  <div>
                    <div className="font-display font-700 text-gradient-sky">
                      SmartCast AI
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Predictive Maintenance Platform
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  AI-Based Predictive Maintenance for Die Casting Machines.
                  Built for hackathon innovation, designed for real-world
                  industrial impact.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-sky" />
                    <a
                      href="mailto:smartcastai@gmail.com"
                      className="text-sky hover:underline"
                    >
                      smartcastai@gmail.com
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                {[
                  { icon: Github, label: "GitHub" },
                  { icon: Twitter, label: "Twitter" },
                  { icon: Linkedin, label: "LinkedIn" },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="/#"
                    className="w-9 h-9 rounded-lg bg-muted/50 border border-border flex items-center justify-center hover:bg-sky/10 hover:border-sky/30 transition-colors"
                    aria-label={label}
                    data-ocid="contact.link"
                  >
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </div>

            <div className="surface-card rounded-2xl p-8">
              {submitted ? (
                <div
                  className="flex flex-col items-center justify-center h-full gap-4 text-center py-8"
                  data-ocid="contact.success_state"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="font-display font-700 text-xl">
                    Message Sent!
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    Thank you for reaching out. We'll get back to you within 24
                    hours.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2 border-sky/30 text-sky hover:bg-sky/10"
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({ name: "", email: "", message: "" });
                    }}
                  >
                    Send Another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium mb-2 block"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Arjun Sharma"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState((p) => ({ ...p, name: e.target.value }))
                      }
                      required
                      className="bg-muted/30 border-border focus:border-sky/50"
                      data-ocid="contact.input"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium mb-2 block"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState((p) => ({ ...p, email: e.target.value }))
                      }
                      required
                      className="bg-muted/30 border-border focus:border-sky/50"
                      data-ocid="contact.input"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="message"
                      className="text-sm font-medium mb-2 block"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your factory, machines, or what challenges you're facing..."
                      value={formState.message}
                      onChange={(e) =>
                        setFormState((p) => ({ ...p, message: e.target.value }))
                      }
                      required
                      rows={5}
                      className="bg-muted/30 border-border focus:border-sky/50 resize-none"
                      data-ocid="contact.textarea"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 font-semibold shadow-glow-sm"
                    data-ocid="contact.submit_button"
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-sky icon-glow" />
              </div>
              <span className="font-display font-700 text-lg">
                <span className="text-gradient-sky">SmartCast</span>
                <span className="text-foreground"> AI</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              AI-Based Predictive Maintenance for Die Casting Machines
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════
           DIALOGS & SHEETS
      ══════════════════════════════════════════════════════════ */}

      {/* ── Profile first-login modal ── */}
      <Dialog
        open={showProfileModal}
        onOpenChange={(open) => {
          if (!open && userProfile) setShowProfileModal(false);
        }}
      >
        <DialogContent
          className="bg-card border-border max-w-md"
          data-ocid="profile.modal"
          onPointerDownOutside={(e) => {
            if (!userProfile) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-display font-700 text-xl text-gradient-sky">
              Complete Your Profile
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Tell us a bit about yourself to get started.
            </p>
          </DialogHeader>
          <form onSubmit={handleSaveProfile} className="space-y-4 mt-2">
            <div>
              <Label
                htmlFor="pf-name"
                className="text-sm font-medium mb-1.5 block"
              >
                Full Name
              </Label>
              <Input
                id="pf-name"
                placeholder="Arjun Sharma"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, name: e.target.value }))
                }
                required
                className="bg-muted/30 border-border focus:border-sky/50"
                data-ocid="profile.input"
              />
            </div>
            <div>
              <Label
                htmlFor="pf-company"
                className="text-sm font-medium mb-1.5 block"
              >
                Company Name
              </Label>
              <Input
                id="pf-company"
                placeholder="Acme Castings Ltd."
                value={profileForm.company}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, company: e.target.value }))
                }
                required
                className="bg-muted/30 border-border focus:border-sky/50"
                data-ocid="profile.input"
              />
            </div>
            <div>
              <Label
                htmlFor="pf-role"
                className="text-sm font-medium mb-1.5 block"
              >
                Role / Designation
              </Label>
              <Input
                id="pf-role"
                placeholder="Maintenance Manager"
                value={profileForm.role}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, role: e.target.value }))
                }
                required
                className="bg-muted/30 border-border focus:border-sky/50"
                data-ocid="profile.input"
              />
            </div>
            <div>
              <Label
                htmlFor="pf-phone"
                className="text-sm font-medium mb-1.5 block"
              >
                Phone Number
              </Label>
              <Input
                id="pf-phone"
                placeholder="+91 98765 43210"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, phone: e.target.value }))
                }
                required
                className="bg-muted/30 border-border focus:border-sky/50"
                data-ocid="profile.input"
              />
            </div>
            <div>
              <Label
                htmlFor="pf-email"
                className="text-sm font-medium mb-1.5 block"
              >
                Email Address
              </Label>
              <Input
                id="pf-email"
                type="email"
                placeholder="you@example.com"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, email: e.target.value }))
                }
                className="bg-muted/30 border-border focus:border-sky/50"
                data-ocid="profile.input"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={savingProfile}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                data-ocid="profile.submit_button"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
              {userProfile && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowProfileModal(false)}
                  className="border-border/60"
                  data-ocid="profile.cancel_button"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Edit Profile dialog ── */}
      <Dialog
        open={showEditProfileDialog}
        onOpenChange={setShowEditProfileDialog}
      >
        <DialogContent
          className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="profile.edit_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display font-700 text-xl text-gradient-sky">
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditProfile} className="space-y-4 mt-2">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Full Name
              </Label>
              <Input
                placeholder="Arjun Sharma"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, name: e.target.value }))
                }
                required
                className="bg-muted/30 border-border focus:border-sky/50"
                data-ocid="profile.input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Company
              </Label>
              <Input
                placeholder="Acme Castings Ltd."
                value={profileForm.company}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, company: e.target.value }))
                }
                required
                className="bg-muted/30 border-border focus:border-sky/50"
                data-ocid="profile.input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Role</Label>
              <Input
                placeholder="Maintenance Manager"
                value={profileForm.role}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, role: e.target.value }))
                }
                required
                className="bg-muted/30 border-border focus:border-sky/50"
                data-ocid="profile.input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Phone</Label>
              <Input
                placeholder="+91 98765 43210"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, phone: e.target.value }))
                }
                required
                className="bg-muted/30 border-border focus:border-sky/50"
                data-ocid="profile.input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Email Address
              </Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, email: e.target.value }))
                }
                className="bg-muted/30 border-border focus:border-sky/50"
                data-ocid="profile.input"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditProfileDialog(false)}
                className="border-border/60"
                data-ocid="profile.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={savingProfile}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                data-ocid="profile.save_button"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
          {/* ── Authorities Section ── */}
          <div className="mt-6 border-t border-border pt-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display font-700 text-base text-foreground">
                  Authorities
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  People to notify on emergency alerts
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-sky/40 text-sky-400 hover:bg-sky/10 gap-1.5"
                onClick={() => setShowAddAuthorityForm((v) => !v)}
                data-ocid="profile.authorities.add_button"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Authority
              </Button>
            </div>

            {showAddAuthorityForm && (
              <form
                onSubmit={handleAddAuthority}
                className="bg-muted/20 rounded-lg p-3 mb-3 space-y-2 border border-border/50"
              >
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Full Name *"
                    value={authorityForm.name}
                    onChange={(e) =>
                      setAuthorityForm((p) => ({ ...p, name: e.target.value }))
                    }
                    required
                    className="bg-muted/30 border-border focus:border-sky/50 text-sm h-8"
                    data-ocid="profile.authority.name.input"
                  />
                  <Input
                    placeholder="Email *"
                    type="email"
                    value={authorityForm.email}
                    onChange={(e) =>
                      setAuthorityForm((p) => ({ ...p, email: e.target.value }))
                    }
                    required
                    className="bg-muted/30 border-border focus:border-sky/50 text-sm h-8"
                    data-ocid="profile.authority.email.input"
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Phone (optional)"
                    value={authorityForm.phone}
                    onChange={(e) =>
                      setAuthorityForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="bg-muted/30 border-border focus:border-sky/50 text-sm h-8 flex-1"
                    data-ocid="profile.authority.phone.input"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground px-3"
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2"
                    onClick={() => setShowAddAuthorityForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {authorities.length === 0 ? (
              <div
                className="text-center py-4 text-muted-foreground text-sm border border-dashed border-border/40 rounded-lg"
                data-ocid="profile.authorities.empty_state"
              >
                No authorities added yet
              </div>
            ) : (
              <div
                className="rounded-lg border border-border/50 overflow-hidden"
                data-ocid="profile.authorities.table"
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/20 border-b border-border/40">
                      <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">
                        Name
                      </th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">
                        Email
                      </th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">
                        Phone
                      </th>
                      <th className="px-2 py-2 w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {authorities.map((auth, idx) => (
                      <tr
                        key={auth.id}
                        className="border-b border-border/20 last:border-0 hover:bg-muted/10"
                      >
                        {editingAuthorityId === auth.id ? (
                          <>
                            <td className="px-2 py-1">
                              <Input
                                value={editAuthorityForm.name}
                                onChange={(e) =>
                                  setEditAuthorityForm((p) => ({
                                    ...p,
                                    name: e.target.value,
                                  }))
                                }
                                className="h-7 text-xs bg-muted/30 border-border"
                                data-ocid="profile.authority.name.input"
                              />
                            </td>
                            <td className="px-2 py-1">
                              <Input
                                value={editAuthorityForm.email}
                                onChange={(e) =>
                                  setEditAuthorityForm((p) => ({
                                    ...p,
                                    email: e.target.value,
                                  }))
                                }
                                className="h-7 text-xs bg-muted/30 border-border"
                                data-ocid="profile.authority.email.input"
                              />
                            </td>
                            <td className="px-2 py-1">
                              <Input
                                value={editAuthorityForm.phone}
                                onChange={(e) =>
                                  setEditAuthorityForm((p) => ({
                                    ...p,
                                    phone: e.target.value,
                                  }))
                                }
                                className="h-7 text-xs bg-muted/30 border-border"
                                data-ocid="profile.authority.phone.input"
                              />
                            </td>
                            <td className="px-2 py-1 flex gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  saveAuthorities(
                                    authorities.map((a) =>
                                      a.id === auth.id
                                        ? { ...a, ...editAuthorityForm }
                                        : a,
                                    ),
                                  );
                                  setEditingAuthorityId(null);
                                  toast.success("Authority updated.");
                                }}
                                className="text-emerald-400 hover:text-emerald-300 p-1 rounded"
                                data-ocid={`profile.authorities.save_button.${idx + 1}`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingAuthorityId(null)}
                                className="text-muted-foreground hover:text-foreground p-1 rounded"
                                data-ocid={`profile.authorities.cancel_button.${idx + 1}`}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-3 py-2 font-medium text-foreground">
                              {auth.name}
                            </td>
                            <td className="px-3 py-2 text-muted-foreground">
                              {auth.email || "—"}
                            </td>
                            <td className="px-3 py-2 text-muted-foreground">
                              {auth.phone || "—"}
                            </td>
                            <td className="px-2 py-2 flex gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingAuthorityId(auth.id);
                                  setEditAuthorityForm({
                                    name: auth.name,
                                    email: auth.email,
                                    phone: auth.phone,
                                  });
                                }}
                                className="text-sky hover:text-sky/70 p-1 rounded"
                                data-ocid={`profile.authorities.edit_button.${idx + 1}`}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveAuthority(auth.id)}
                                className="text-red-400 hover:text-red-300 p-1 rounded"
                                data-ocid={`profile.authorities.delete_button.${idx + 1}`}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Add Machine dialog ── */}
      <Dialog open={showAddMachine} onOpenChange={setShowAddMachine}>
        <DialogContent
          className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto"
          data-ocid="machine.add_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display font-700 text-xl text-gradient-sky">
              Add New Machine
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMachine} className="space-y-4 mt-2">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Machine ID
              </Label>
              <Input
                placeholder="machine-d"
                value={addMachineForm.id}
                onChange={(e) =>
                  setAddMachineForm((p) => ({ ...p, id: e.target.value }))
                }
                required
                className="bg-muted/30 border-border focus:border-sky/50"
                data-ocid="machine.input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Manufacturer
              </Label>
              <Input
                placeholder="e.g. Toshiba"
                value={addMachineForm.manufacturer}
                onChange={(e) =>
                  setAddMachineForm((p) => ({
                    ...p,
                    manufacturer: e.target.value,
                  }))
                }
                required
                className="bg-muted/30 border-border focus:border-sky/50"
                data-ocid="machine.input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Model</Label>
              <Input
                placeholder="e.g. DC-500X"
                value={addMachineForm.model}
                onChange={(e) =>
                  setAddMachineForm((p) => ({ ...p, model: e.target.value }))
                }
                required
                className="bg-muted/30 border-border focus:border-sky/50"
                data-ocid="machine.input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Location
              </Label>
              <Input
                placeholder="e.g. Plant Floor 4"
                value={addMachineForm.location}
                onChange={(e) =>
                  setAddMachineForm((p) => ({ ...p, location: e.target.value }))
                }
                required
                className="bg-muted/30 border-border focus:border-sky/50"
                data-ocid="machine.input"
              />
            </div>
            <div className="border-t border-border/40 pt-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Initial Sensor Readings (optional)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium mb-1 block">
                    Temperature (°C)
                  </Label>
                  <Input
                    placeholder="e.g. 230"
                    type="number"
                    value={addMachineForm.temperature}
                    onChange={(e) =>
                      setAddMachineForm((p) => ({
                        ...p,
                        temperature: e.target.value,
                      }))
                    }
                    className="bg-muted/30 border-border focus:border-sky/50 h-8 text-sm"
                    data-ocid="machine.input"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium mb-1 block">
                    Vibration (mm/s)
                  </Label>
                  <Input
                    placeholder="e.g. 1.5"
                    type="number"
                    step="0.1"
                    value={addMachineForm.vibration}
                    onChange={(e) =>
                      setAddMachineForm((p) => ({
                        ...p,
                        vibration: e.target.value,
                      }))
                    }
                    className="bg-muted/30 border-border focus:border-sky/50 h-8 text-sm"
                    data-ocid="machine.input"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium mb-1 block">
                    Pressure (bar)
                  </Label>
                  <Input
                    placeholder="e.g. 180"
                    type="number"
                    value={addMachineForm.pressure}
                    onChange={(e) =>
                      setAddMachineForm((p) => ({
                        ...p,
                        pressure: e.target.value,
                      }))
                    }
                    className="bg-muted/30 border-border focus:border-sky/50 h-8 text-sm"
                    data-ocid="machine.input"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium mb-1 block">
                    Oil Level (%)
                  </Label>
                  <Input
                    placeholder="e.g. 75"
                    type="number"
                    min="0"
                    max="100"
                    value={addMachineForm.oilLevel}
                    onChange={(e) =>
                      setAddMachineForm((p) => ({
                        ...p,
                        oilLevel: e.target.value,
                      }))
                    }
                    className="bg-muted/30 border-border focus:border-sky/50 h-8 text-sm"
                    data-ocid="machine.input"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium mb-1 block">RPM</Label>
                  <Input
                    placeholder="e.g. 1800"
                    type="number"
                    value={addMachineForm.rpm}
                    onChange={(e) =>
                      setAddMachineForm((p) => ({ ...p, rpm: e.target.value }))
                    }
                    className="bg-muted/30 border-border focus:border-sky/50 h-8 text-sm"
                    data-ocid="machine.input"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium mb-1 block">
                    Electricity (kWh)
                  </Label>
                  <Input
                    placeholder="e.g. 320"
                    type="number"
                    value={addMachineForm.electricityUsage}
                    onChange={(e) =>
                      setAddMachineForm((p) => ({
                        ...p,
                        electricityUsage: e.target.value,
                      }))
                    }
                    className="bg-muted/30 border-border focus:border-sky/50 h-8 text-sm"
                    data-ocid="machine.input"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs font-medium mb-1 block">
                    Hours Since Last Inspection
                  </Label>
                  <Input
                    placeholder="e.g. 720"
                    type="number"
                    value={addMachineForm.hoursSinceInspection}
                    onChange={(e) =>
                      setAddMachineForm((p) => ({
                        ...p,
                        hoursSinceInspection: e.target.value,
                      }))
                    }
                    className="bg-muted/30 border-border focus:border-sky/50 h-8 text-sm"
                    data-ocid="machine.input"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddMachine(false)}
                className="border-border/60"
                data-ocid="machine.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addingMachine}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                data-ocid="machine.submit_button"
              >
                {addingMachine ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Machine"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Edit Machine dialog ── */}
      <Dialog
        open={!!editMachine}
        onOpenChange={(open) => {
          if (!open) setEditMachine(null);
        }}
      >
        <DialogContent
          className="bg-card border-border max-w-md"
          data-ocid="machine.edit_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display font-700 text-xl text-gradient-sky">
              Edit Machine
            </DialogTitle>
            {editMachine && (
              <p className="text-xs text-muted-foreground">
                ID: {editMachine.id}
              </p>
            )}
          </DialogHeader>
          <form onSubmit={handleEditMachine} className="space-y-4 mt-2">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Manufacturer
              </Label>
              <Input
                value={editMachineForm.manufacturer}
                onChange={(e) =>
                  setEditMachineForm((p) => ({
                    ...p,
                    manufacturer: e.target.value,
                  }))
                }
                required
                className="bg-muted/30 border-border focus:border-sky/50"
                data-ocid="machine.input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Model</Label>
              <Input
                value={editMachineForm.model}
                onChange={(e) =>
                  setEditMachineForm((p) => ({ ...p, model: e.target.value }))
                }
                required
                className="bg-muted/30 border-border focus:border-sky/50"
                data-ocid="machine.input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Location
              </Label>
              <Input
                value={editMachineForm.location}
                onChange={(e) =>
                  setEditMachineForm((p) => ({
                    ...p,
                    location: e.target.value,
                  }))
                }
                required
                className="bg-muted/30 border-border focus:border-sky/50"
                data-ocid="machine.input"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditMachine(null)}
                className="border-border/60"
                data-ocid="machine.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={savingMachine}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                data-ocid="machine.save_button"
              >
                {savingMachine ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Remove Machine confirm dialog ── */}
      <Dialog
        open={!!removeMachineId}
        onOpenChange={(open) => {
          if (!open) setRemoveMachineId(null);
        }}
      >
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display font-700 text-lg">
              Remove Machine?
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. The machine and all its data will be
              permanently removed.
            </p>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setRemoveMachineId(null)}
              className="border-border/60"
              data-ocid="machine.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRemoveMachine}
              disabled={removingMachine}
              className="bg-red-500 hover:bg-red-600 text-white"
              data-ocid="machine.delete_button"
            >
              {removingMachine ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Machine
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Machine Detail Modal ── */}
      <Dialog
        open={!!selectedMachineId}
        onOpenChange={(open) => {
          if (!open) closeMachineDetail();
        }}
      >
        <DialogContent
          className="bg-card border-border max-w-3xl max-h-[85vh] overflow-y-auto"
          data-ocid="machine.detail.dialog"
        >
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="font-display font-700 text-xl text-gradient-sky flex items-center gap-2">
              <Factory className="w-5 h-5 text-sky" />
              Machine Details
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeMachineDetail}
              className="h-8 w-8 p-0 hover:bg-muted/50"
              data-ocid="machine.detail.close_button"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogHeader>

          {loadingMachine || machineData === undefined ? (
            <div className="space-y-4 mt-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <div className="grid grid-cols-2 gap-3">
                {["s1", "s2", "s3", "s4"].map((sk) => (
                  <Skeleton key={sk} className="h-20 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-32" />
            </div>
          ) : selectedMachine === null ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <AlertCircle className="w-12 h-12 text-muted-foreground/40" />
              <p className="text-muted-foreground">Machine data not found.</p>
            </div>
          ) : selectedMachine ? (
            <div className="mt-4">
              {/* Header info */}
              {(() => {
                const detailRiskLevel = getRiskLevel(selectedMachine);
                const detailRiskCfg = RISK_CONFIG[detailRiskLevel];
                return (
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground font-mono mb-1">
                        {selectedMachine.id}
                      </p>
                      <h3 className="font-display font-700 text-2xl">
                        {selectedMachine.model} · {selectedMachine.manufacturer}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {selectedMachine.location}
                      </p>
                      {/* Risk level badge */}
                      <div className="mt-3">
                        <Badge
                          className={`text-sm px-3 py-1 font-semibold border ${detailRiskCfg.badgeClass}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-2 inline-block ${detailRiskCfg.dotClass}`}
                          />
                          {detailRiskCfg.label}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">
                        Health Score
                      </p>
                      <p
                        className={`text-3xl font-display font-800 ${
                          Number(selectedMachine.healthScore) > 80
                            ? "text-emerald-400"
                            : Number(selectedMachine.healthScore) > 60
                              ? "text-amber-400"
                              : "text-red-400"
                        }`}
                      >
                        {Number(selectedMachine.healthScore)}%
                      </p>
                    </div>
                  </div>
                );
              })()}

              <Tabs defaultValue="sensors">
                <TabsList className="mb-4 bg-muted/30">
                  <TabsTrigger value="sensors" data-ocid="machine.detail.tab">
                    Sensors
                  </TabsTrigger>
                  <TabsTrigger value="alerts" data-ocid="machine.detail.tab">
                    Alerts ({selectedMachine.predictionAlerts.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="maintenance"
                    data-ocid="machine.detail.tab"
                  >
                    Maintenance ({selectedMachine.maintenanceHistory.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="sensors">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      {
                        label: "Temperature",
                        value: `${Number(selectedMachine.sensorReadings.temperature)}°C`,
                        icon: Thermometer,
                        color: "text-amber-400",
                      },
                      {
                        label: "Vibration",
                        value: `${Number(selectedMachine.sensorReadings.vibration)} mm/s`,
                        icon: Wifi,
                        color: "text-sky",
                      },
                      {
                        label: "Pressure",
                        value: `${Number(selectedMachine.sensorReadings.pressure)} bar`,
                        icon: Zap,
                        color: "text-violet-400",
                      },
                      {
                        label: "Oil Level",
                        value: `${Number(selectedMachine.sensorReadings.oilLevel)}%`,
                        icon: Database,
                        color: "text-emerald-400",
                      },
                      {
                        label: "RPM",
                        value: `${Number(selectedMachine.sensorReadings.rpm)}`,
                        icon: Settings,
                        color: "text-sky",
                      },
                      {
                        label: "Electricity",
                        value: `${selectedMachine.sensorReadings.electricityUsage} kWh`,
                        icon: Zap,
                        color: "text-yellow-400",
                      },
                      {
                        label: "Since Inspection",
                        value: `${Number(selectedMachine.sensorReadings.hoursSinceInspection)}h`,
                        icon: Wrench,
                        color: "text-muted-foreground",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="surface-card rounded-xl p-3"
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                          <span className="text-xs text-muted-foreground">
                            {s.label}
                          </span>
                        </div>
                        <p
                          className={`text-lg font-display font-700 ${s.color}`}
                        >
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="alerts">
                  {selectedMachine.predictionAlerts.length === 0 ? (
                    <div className="flex flex-col items-center py-8 gap-2 text-center">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400/50" />
                      <p className="text-sm text-muted-foreground">
                        No active alerts — machine operating normally.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedMachine.predictionAlerts.map((alert) => (
                        <div
                          key={alert.description}
                          className="surface-card rounded-xl p-4 border-l-2 border-red-500/50"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              className={`text-xs ${alert.severity === "High" || alert.severity === "Critical" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}`}
                            >
                              {alert.severity}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {Number(alert.likelihood)}% likelihood
                            </span>
                          </div>
                          <p className="text-sm font-medium">
                            {alert.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Predicted: {alert.predictedFailureTime}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="maintenance">
                  {selectedMachine.maintenanceHistory.length === 0 ? (
                    <div className="flex flex-col items-center py-8 gap-2 text-center">
                      <Wrench className="w-10 h-10 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">
                        No maintenance history recorded.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedMachine.maintenanceHistory.map((task) => (
                        <div
                          key={task.description + task.date}
                          className="surface-card rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">
                              {task.description}
                            </span>
                            <Badge
                              className={`text-xs ${task.status === "completed" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}`}
                            >
                              {task.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {task.date} · ₹{Number(task.cost).toLocaleString()}
                          </p>
                          {task.remarks && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {task.remarks}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* ── Notifications Sheet ── */}
      <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
        <SheetContent
          className="bg-card border-border w-[400px] sm:w-[480px]"
          data-ocid="notifications.sheet"
        >
          <SheetHeader>
            <SheetTitle className="font-display font-700 text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-sky" />
              Authority Notifications
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-4 pr-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-3 text-center">
                <Bell className="w-12 h-12 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">
                  No notifications yet.
                </p>
                <p className="text-xs text-muted-foreground">
                  Alerts will appear here when machines reach critical
                  conditions.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={String(notif.timestamp) + notif.machineId}
                    className="surface-card rounded-xl p-4 border-l-2 border-red-500/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">
                        {notif.machineName}
                      </span>
                      <Badge
                        className={`text-xs ${notif.severity === "Critical" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}`}
                      >
                        {notif.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-foreground/80">
                      {notif.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(
                        Number(notif.timestamp) / 1_000_000,
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
