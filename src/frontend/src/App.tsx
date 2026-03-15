import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Github,
  IndianRupee,
  Linkedin,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Package,
  Settings,
  TrendingDown,
  TrendingUp,
  Twitter,
  Wifi,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { useInternetIdentity } from "./hooks/useInternetIdentity";

// ─── Mock chart data ──────────────────────────────────────────────────────────
const temperatureData = [
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

const vibrationData = [
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

// ─── Team members ─────────────────────────────────────────────────────────────
const team = [
  {
    name: "Arjun Sharma",
    role: "AI/ML Engineer",
    initials: "AS",
    gradient: "from-blue-600 to-cyan-400",
  },
  {
    name: "Priya Patel",
    role: "IoT Systems Architect",
    initials: "PP",
    gradient: "from-violet-600 to-blue-400",
  },
  {
    name: "Rahul Mehta",
    role: "Data Engineer",
    initials: "RM",
    gradient: "from-sky-500 to-indigo-500",
  },
  {
    name: "Sneha Joshi",
    role: "Frontend & UI Lead",
    initials: "SJ",
    gradient: "from-cyan-500 to-teal-400",
  },
];

// ─── Impact metrics ───────────────────────────────────────────────────────────
const impactCards = [
  {
    value: "30%",
    label: "Reduction in Downtime",
    desc: "Fewer unexpected breakdowns with predictive alerts",
    icon: TrendingUp,
    color: "text-emerald-400",
  },
  {
    value: "₹5–8L",
    label: "Saved per Year",
    desc: "Annual maintenance cost reduction per machine",
    icon: IndianRupee,
    color: "text-sky",
  },
  {
    value: "2×",
    label: "Longer Machine Life",
    desc: "Extended asset lifespan through proactive care",
    icon: Settings,
    color: "text-violet-400",
  },
  {
    value: "25%",
    label: "Efficiency Gain",
    desc: "Production throughput increase across the line",
    icon: BarChart2,
    color: "text-amber-400",
  },
];

// ─── Tech stack ───────────────────────────────────────────────────────────────
const techStack = [
  {
    icon: Brain,
    title: "AI / Machine Learning",
    desc: "TensorFlow + scikit-learn models trained on real failure signatures for early anomaly detection",
  },
  {
    icon: Wifi,
    title: "IoT Sensors",
    desc: "Industrial-grade vibration, temperature, and pressure sensors with sub-second polling",
  },
  {
    icon: Cloud,
    title: "Cloud Computing",
    desc: "Scalable cloud infrastructure for real-time stream processing and model inference",
  },
  {
    icon: BarChart2,
    title: "Data Analytics",
    desc: "Interactive dashboards with live telemetry, historical trend analysis, and customizable alerts",
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
    color: "text-sky",
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

// ─── Alert rows ───────────────────────────────────────────────────────────────
const alerts = [
  {
    machine: "Machine A",
    issue: "High vibration",
    risk: "High",
    riskColor: "bg-red-500/20 text-red-400 border-red-500/30",
    time: "2h ago",
  },
  {
    machine: "Machine B",
    issue: "Temp spike",
    risk: "Medium",
    riskColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    time: "5h ago",
  },
  {
    machine: "Machine C",
    issue: "Normal operation",
    risk: "Low",
    riskColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    time: "1d ago",
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
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const shortPrincipal = identity
    ? `${identity.getPrincipal().toString().slice(0, 5)}...`
    : "";

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Sticky Nav ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg"
            : "bg-transparent"
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
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
                  data-ocid="nav.link"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Button
                size="sm"
                onClick={() => scrollTo("#contact")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-sm"
                data-ocid="nav.primary_button"
              >
                Get Started
              </Button>
              {isInitializing || isLoggingIn ? (
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/30"
                  data-ocid="auth.loading_state"
                >
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              ) : isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono bg-muted/40 px-2 py-1 rounded border border-border/50">
                    {shortPrincipal}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clear}
                    className="border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40 gap-1.5"
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
                  className="border-primary/40 hover:bg-primary/10 hover:text-primary gap-1.5"
                  data-ocid="auth.login_button"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md hover:bg-muted/50"
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

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden bg-card/95 backdrop-blur-md border-b border-border">
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                  data-ocid="nav.link"
                >
                  {link.label}
                </button>
              ))}
              <div className="mt-2 pt-2 border-t border-border/50">
                {isInitializing || isLoggingIn ? (
                  <div
                    className="flex items-center gap-2 px-3 py-2"
                    data-ocid="auth.loading_state"
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Loading...
                    </span>
                  </div>
                ) : isAuthenticated ? (
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      {shortPrincipal}
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
                    variant="ghost"
                    onClick={login}
                    className="w-full justify-start gap-2 text-primary hover:bg-primary/10"
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
        {/* BG image + overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-banner.dim_1400x700.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />

        {/* Grid pattern overlay */}
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

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { val: "99.2%", lab: "Accuracy" },
              { val: "<2s", lab: "Alert Latency" },
              { val: "50+", lab: "Sensors Supported" },
            ].map((s) => (
              <div key={s.lab} className="text-center">
                <div className="text-2xl font-display font-700 text-gradient-sky">
                  {s.val}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {s.lab}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <ChevronDown className="w-6 h-6 text-sky/60" />
        </div>
      </section>

      {/* ── 2. Problem ── */}
      <section
        id="problem"
        data-ocid="problem.section"
        className="py-24 bg-background relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-red-500/20 text-red-400 border-red-500/30">
              The Challenge
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-700 mb-4">
              The <span className="text-gradient-sky">Problem</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Die casting operations are disrupted every year by unexpected
              machine failures — costing manufacturers millions in downtime,
              scrap, and emergency repair bills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: AlertTriangle,
                val: "₹2–4 Lakhs",
                label: "Average downtime cost per incident",
                color: "text-red-400",
                bg: "bg-red-500/10 border-red-500/20",
              },
              {
                icon: TrendingDown,
                val: "30%",
                label: "Production lost due to unplanned failures",
                color: "text-amber-400",
                bg: "bg-amber-500/10 border-amber-500/20",
              },
              {
                icon: Package,
                val: "40%",
                label: "Increase in scrap material during failures",
                color: "text-orange-400",
                bg: "bg-orange-500/10 border-orange-500/20",
              },
            ].map((card, i) => (
              <div
                key={card.val}
                className={`surface-card rounded-2xl p-8 text-center hover:scale-[1.02] transition-transform duration-300 ${card.bg}`}
                data-ocid={`problem.card.${i + 1}`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${card.bg} border flex items-center justify-center mx-auto mb-4`}
                >
                  <card.icon className={`w-7 h-7 ${card.color}`} />
                </div>
                <div
                  className={`text-4xl font-display font-800 ${card.color} mb-2`}
                >
                  {card.val}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {card.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Solution ── */}
      <section
        id="solution"
        data-ocid="solution.section"
        className="py-24"
        style={{ background: "oklch(0.14 0.035 264)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <Badge className="mb-4 bg-sky/20 text-sky border-sky/30">
                AI-Powered
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-700 mb-6">
                Our AI <span className="text-gradient-sky">Solution</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                SmartCast AI continuously monitors die casting machine health
                through industrial-grade sensors. Our proprietary ML models
                analyze thousands of data points per second to detect anomalies
                and predict failures — hours or days before they disrupt your
                line.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time sensor monitoring across all machines",
                  "Predictive failure alerts with confidence scoring",
                  "Automated health scoring (0–100 scale)",
                  "Historical trend analysis & reporting",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sky mt-0.5 flex-shrink-0 icon-glow" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="absolute -inset-4 bg-sky/5 rounded-3xl blur-2xl" />
              <img
                src="/assets/generated/ai-solution-bg.dim_800x500.jpg"
                alt="AI solution visualization"
                className="relative rounded-2xl w-full object-cover border border-sky/20 shadow-glow"
              />
              {/* Floating metric card */}
              <div className="absolute -bottom-6 -left-6 surface-card-glow rounded-xl p-4 shadow-glow">
                <div className="text-xs text-muted-foreground mb-1">
                  Model Accuracy
                </div>
                <div className="text-2xl font-display font-700 text-gradient-sky">
                  99.2%
                </div>
                <div className="text-xs text-emerald-400 mt-1">
                  ↑ 4.1% this month
                </div>
              </div>
            </div>
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
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              Process
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-700 mb-4">
              How It <span className="text-gradient-sky">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Six seamless steps from raw sensor data to maintenance action.
            </p>
          </div>

          {/* Desktop: horizontal */}
          <div className="hidden md:flex items-start gap-0">
            {workflowSteps.map((step, i) => (
              <div
                key={step.num}
                className="flex-1 flex flex-col items-center relative"
              >
                {/* Connector line */}
                {i < workflowSteps.length - 1 && (
                  <div className="absolute top-7 left-1/2 w-full h-[1px] bg-gradient-to-r from-sky/40 to-sky/10" />
                )}
                <div className="relative z-10 w-14 h-14 rounded-full bg-sky/15 border-2 border-sky/50 flex items-center justify-center mb-4 animate-pulse-glow">
                  <step.icon className="w-6 h-6 text-sky icon-glow" />
                </div>
                <div className="text-xs font-mono text-sky/60 mb-1">
                  {step.num}
                </div>
                <div className="text-sm font-semibold text-center px-2 leading-tight">
                  {step.label}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: vertical */}
          <div className="md:hidden flex flex-col gap-4">
            {workflowSteps.map((step) => (
              <div
                key={step.num}
                className="flex items-center gap-4 surface-card rounded-xl p-4"
              >
                <div className="w-12 h-12 rounded-full bg-sky/15 border border-sky/40 flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-5 h-5 text-sky icon-glow" />
                </div>
                <div>
                  <div className="text-xs text-sky/60 font-mono">
                    {step.num}
                  </div>
                  <div className="font-semibold">{step.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Dashboard ── */}
      <section
        id="dashboard"
        data-ocid="dashboard.section"
        style={{ background: "oklch(0.14 0.035 264)" }}
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

          {/* Dashboard shell */}
          <div
            className="rounded-2xl border border-border overflow-hidden shadow-2xl"
            style={{ background: "oklch(0.11 0.028 264)" }}
          >
            {/* Top bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <span className="ml-4 text-xs text-muted-foreground font-mono">
                SmartCast AI — Operations Dashboard
              </span>
            </div>

            <div className="p-6">
              {/* Metric cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    label: "Machine Health Score",
                    value: "87%",
                    color: "text-emerald-400",
                    sub: "Excellent",
                    subColor: "text-emerald-400",
                  },
                  {
                    label: "Active Alerts",
                    value: "3",
                    color: "text-amber-400",
                    sub: "Needs attention",
                    subColor: "text-amber-400",
                  },
                  {
                    label: "Uptime Today",
                    value: "94.2%",
                    color: "text-sky",
                    sub: "+1.4% vs avg",
                    subColor: "text-sky",
                  },
                  {
                    label: "Temp Status",
                    value: "Normal",
                    color: "text-emerald-400",
                    sub: "238°C avg",
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
                    <p className={`text-2xl font-display font-700 ${m.color}`}>
                      {m.value}
                    </p>
                    <p className={`text-xs mt-1 ${m.subColor}`}>{m.sub}</p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Temperature chart */}
                <div className="surface-card rounded-xl p-4">
                  <h3 className="text-sm font-semibold mb-4 text-foreground">
                    Temperature Monitoring (24h)
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={temperatureData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="oklch(0.22 0.04 264)"
                      />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 10, fill: "oklch(0.60 0.04 240)" }}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "oklch(0.60 0.04 240)" }}
                        domain={[200, 280]}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "oklch(0.14 0.035 264)",
                          border: "1px solid oklch(0.22 0.04 264)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        labelStyle={{ color: "oklch(0.78 0.13 210)" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="temp"
                        stroke="oklch(0.75 0.19 55)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: "oklch(0.75 0.19 55)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Vibration chart */}
                <div className="surface-card rounded-xl p-4">
                  <h3 className="text-sm font-semibold mb-4 text-foreground">
                    Vibration Analysis (24h)
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={vibrationData}>
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
                            stopColor="oklch(0.78 0.13 210)"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="oklch(0.78 0.13 210)"
                            stopOpacity={0.02}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="oklch(0.22 0.04 264)"
                      />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 10, fill: "oklch(0.60 0.04 240)" }}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "oklch(0.60 0.04 240)" }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "oklch(0.14 0.035 264)",
                          border: "1px solid oklch(0.22 0.04 264)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        labelStyle={{ color: "oklch(0.78 0.13 210)" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="vibration"
                        stroke="oklch(0.78 0.13 210)"
                        strokeWidth={2}
                        fill="url(#vibGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Alerts table */}
              <div className="surface-card rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    Failure Prediction Alerts
                  </h3>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                    3 Active
                  </Badge>
                </div>
                <div className="divide-y divide-border">
                  {alerts.map((a, i) => (
                    <div
                      key={a.machine}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                      data-ocid={`dashboard.item.${i + 1}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-sky" />
                        <span className="text-sm font-medium">{a.machine}</span>
                      </div>
                      <span className="text-sm text-muted-foreground flex-1 ml-6">
                        {a.issue}
                      </span>
                      <Badge className={`text-xs ${a.riskColor} mr-6`}>
                        {a.risk} Risk
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {a.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Business Impact ── */}
      <section
        id="impact"
        data-ocid="impact.section"
        className="py-24 bg-background"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              Results
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-700 mb-4">
              Business <span className="text-gradient-sky">Impact</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Measurable outcomes for manufacturers who adopt SmartCast AI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {impactCards.map((card, i) => (
              <div
                key={card.label}
                className="surface-card-glow rounded-2xl p-8 hover:scale-[1.02] transition-transform duration-300"
                data-ocid={`impact.card.${i + 1}`}
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-muted/50 border border-border flex items-center justify-center flex-shrink-0">
                    <card.icon className={`w-7 h-7 ${card.color}`} />
                  </div>
                  <div>
                    <div
                      className={`text-4xl font-display font-800 ${card.color} mb-1`}
                    >
                      {card.value}
                    </div>
                    <div className="font-semibold text-foreground mb-1">
                      {card.label}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Tech Stack ── */}
      <section
        id="tech"
        data-ocid="tech.section"
        style={{ background: "oklch(0.14 0.035 264)" }}
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
                {/* Phase accent */}
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

      {/* ── 9. Team ── */}
      <section
        id="team"
        data-ocid="team.section"
        style={{ background: "oklch(0.14 0.035 264)" }}
        className="py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              Our Team
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-700 mb-4">
              Meet the <span className="text-gradient-sky">Team</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div
                key={member.name}
                className="surface-card rounded-2xl p-6 text-center hover:scale-[1.03] transition-transform duration-300 group"
                data-ocid={`team.card.${i + 1}`}
              >
                {/* Avatar */}
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto mb-4 text-2xl font-display font-700 text-white shadow-glow-sm`}
                >
                  {member.initials}
                </div>
                <h3 className="font-display font-600 text-base mb-1">
                  {member.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {member.role}
                </p>
                <div className="flex justify-center">
                  <a
                    href="/#"
                    className="w-8 h-8 rounded-lg bg-muted/50 border border-border flex items-center justify-center hover:bg-sky/10 hover:border-sky/30 transition-colors"
                    data-ocid="team.link"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-muted-foreground hover:text-sky" />
                  </a>
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
            {/* Info card */}
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
                      href="mailto:smartcast@hackathon.dev"
                      className="text-sky hover:underline"
                    >
                      smartcast@hackathon.dev
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

            {/* Form */}
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
            {/* Logo */}
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
    </div>
  );
}
