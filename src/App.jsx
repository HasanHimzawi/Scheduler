import { useState, useEffect, useCallback, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Calendar, Clock, MapPin, Search, Plus, Edit3, Trash2, Users, Bell, ChevronLeft, ChevronRight, LogOut, Settings, BarChart3, Home, Star, Sparkles, Send, Check, X, Filter, Tag, User, Mail, Eye, EyeOff, Zap, TrendingUp, ArrowRight, Globe, Layers, Moon, Sun, Heart, AlertCircle, CheckCircle, RefreshCw, MessageSquare, Copy, Share2 } from "lucide-react";

const CATEGORIES = [
  { id: "work", label: "Work", color: "#6366f1", icon: "💼" },
  { id: "social", label: "Social", color: "#ec4899", icon: "🎉" },
  { id: "health", label: "Health", color: "#10b981", icon: "💪" },
  { id: "education", label: "Education", color: "#f59e0b", icon: "📚" },
  { id: "travel", label: "Travel", color: "#06b6d4", icon: "✈️" },
  { id: "personal", label: "Personal", color: "#8b5cf6", icon: "🏠" },
  { id: "meeting", label: "Meeting", color: "#3b82f6", icon: "🤝" },
  { id: "deadline", label: "Deadline", color: "#ef4444", icon: "⏰" },
];

const STATUS_CONFIG = {
  upcoming: { label: "Upcoming", color: "#6366f1", bg: "rgba(99,102,241,0.15)" },
  attending: { label: "Attending", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  maybe: { label: "Maybe", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  declined: { label: "Declined", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
};

const DEMO_USERS = [
  { id: "u1", name: "Hasan", email: "hasan@chronos.app", avatar: "#6366f1", password: "demo" },
  { id: "u2", name: "Sarah", email: "sarah@chronos.app", avatar: "#ec4899", password: "demo" },
  { id: "u3", name: "Alex", email: "alex@chronos.app", avatar: "#10b981", password: "demo" },
];

const today = new Date();
const fmt = (d) => d.toISOString().split("T")[0];

const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const uid = () => "e" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const SEED_EVENTS = [
  { id: "e1", title: "Team Sprint Planning", date: fmt(addDays(today, 1)), time: "09:00", duration: 60, location: "Zoom Meeting Room", description: "Weekly sprint planning session with the development team. Review backlog items and assign tasks for the upcoming sprint.", category: "meeting", status: "attending", createdBy: "u1", invitees: [{ userId: "u2", status: "attending" }, { userId: "u3", status: "maybe" }], priority: "high" },
  { id: "e2", title: "AI Workshop: LLM Fine-tuning", date: fmt(addDays(today, 3)), time: "14:00", duration: 120, location: "Tech Hub, Downtown", description: "Hands-on workshop covering the latest techniques in LLM fine-tuning and deployment strategies.", category: "education", status: "upcoming", createdBy: "u1", invitees: [], priority: "medium" },
  { id: "e3", title: "Friday Social Dinner", date: fmt(addDays(today, 5)), time: "19:30", duration: 150, location: "Le Petit Bistro", description: "Monthly team dinner. Great food and conversation!", category: "social", status: "maybe", createdBy: "u2", invitees: [{ userId: "u1", status: "maybe" }, { userId: "u3", status: "attending" }], priority: "low" },
  { id: "e4", title: "Product Demo Presentation", date: fmt(addDays(today, 2)), time: "11:00", duration: 45, location: "Conference Room A", description: "Present the new features of the billing application to stakeholders.", category: "work", status: "attending", createdBy: "u1", invitees: [{ userId: "u2", status: "upcoming" }], priority: "high" },
  { id: "e5", title: "Gym Session", date: fmt(today), time: "07:00", duration: 60, location: "FitLife Gym", description: "Morning workout - chest and back day.", category: "health", status: "attending", createdBy: "u1", invitees: [], priority: "low" },
  { id: "e6", title: "Client Onboarding Call", date: fmt(addDays(today, 7)), time: "10:00", duration: 30, location: "Google Meet", description: "Onboard new client to the document processing platform.", category: "work", status: "upcoming", createdBy: "u1", invitees: [{ userId: "u3", status: "upcoming" }], priority: "high" },
  { id: "e7", title: "Weekend Hiking Trip", date: fmt(addDays(today, 8)), time: "06:00", duration: 480, location: "Cedar Forest Trail", description: "Day hike through the beautiful cedar forests. Bring snacks and water!", category: "travel", status: "upcoming", createdBy: "u3", invitees: [{ userId: "u1", status: "maybe" }, { userId: "u2", status: "attending" }], priority: "medium" },
  { id: "e8", title: "Portfolio Website Launch", date: fmt(addDays(today, 4)), time: "16:00", duration: 30, location: "Remote", description: "Deploy the updated portfolio website with all new project showcases.", category: "deadline", status: "upcoming", createdBy: "u1", invitees: [], priority: "high" },
];

const Glass = ({ children, className = "", style = {}, onClick, hover = false }) => (
  <div onClick={onClick} className={className} style={{
    background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16, transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    ...(hover ? { cursor: "pointer" } : {}), ...style,
  }}
    onMouseEnter={e => { if (hover) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}}
    onMouseLeave={e => { if (hover) { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}}
  >{children}</div>
);

const Badge = ({ children, color = "#6366f1", style = {} }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: color + "22", color, letterSpacing: 0.5, ...style }}>{children}</span>
);

const Btn = ({ children, onClick, primary, danger, small, disabled, style = {} }) => (
  <button disabled={disabled} onClick={onClick} style={{
    display: "inline-flex", alignItems: "center", gap: 6, padding: small ? "6px 14px" : "10px 20px",
    borderRadius: 12, border: "none", fontSize: small ? 12 : 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    background: danger ? "rgba(239,68,68,0.15)" : primary ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.06)",
    color: danger ? "#ef4444" : primary ? "#fff" : "#94a3b8", transition: "all 0.2s", opacity: disabled ? 0.5 : 1, ...style,
  }}>{children}</button>
);

const Input = ({ icon: Icon, ...props }) => (
  <div style={{ position: "relative" }}>
    {Icon && <Icon size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />}
    <input {...props} style={{
      width: "100%", padding: Icon ? "10px 12px 10px 38px" : "10px 12px", background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0", fontSize: 13, outline: "none",
      transition: "border-color 0.2s", boxSizing: "border-box", ...props.style,
    }} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
  </div>
);

const Select = ({ options, value, onChange, style = {} }) => (
  <select value={value} onChange={e => onChange(e.target.value)} style={{
    padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, color: "#e2e8f0", fontSize: 13, outline: "none", width: "100%", ...style,
  }}>
    {options.map(o => <option key={o.value} value={o.value} style={{ background: "#1e1b4b" }}>{o.label}</option>)}
  </select>
);

const Avatar = ({ user, size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${user?.avatar || "#6366f1"}, ${user?.avatar || "#6366f1"}88)`,
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4, fontWeight: 700, color: "#fff", flexShrink: 0,
  }}>{(user?.name || "?")[0].toUpperCase()}</div>
);

const Modal = ({ open, onClose, title, children, wide }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} />
      <div onClick={e => e.stopPropagation()} style={{
        position: "relative", width: "100%", maxWidth: wide ? 700 : 520, maxHeight: "85vh", overflow: "auto",
        background: "linear-gradient(145deg, #1e1b4b, #0f172a)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, padding: 28, animation: "modalIn 0.3s ease",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: "none", borderRadius: 8, padding: 6, cursor: "pointer", color: "#94a3b8" }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Toast = ({ toast, onDismiss }) => {
  if (!toast) return null;
  const colors = { success: "#10b981", error: "#ef4444", info: "#6366f1" };
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 2000, padding: "14px 20px", borderRadius: 14,
      background: "rgba(15,23,42,0.95)", border: `1px solid ${colors[toast.type] || colors.info}44`,
      color: "#e2e8f0", fontSize: 13, display: "flex", alignItems: "center", gap: 10, animation: "slideUp 0.3s ease",
      boxShadow: `0 0 30px ${colors[toast.type] || colors.info}22`, maxWidth: 360,
    }}>
      {toast.type === "success" ? <CheckCircle size={18} color={colors.success} /> : toast.type === "error" ? <AlertCircle size={18} color={colors.error} /> : <Bell size={18} color={colors.info} />}
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button onClick={onDismiss} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 2 }}><X size={14} /></button>
    </div>
  );
};

// ─── MAIN APP ──────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState(SEED_EVENTS);
  const [view, setView] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [calMonth, setCalMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [editEvent, setEditEvent] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [viewEvent, setViewEvent] = useState(null);
  const [toast, setToast] = useState(null);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [inviteModal, setInviteModal] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Persistent storage
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("chronos-events");
        if (r?.value) setEvents(JSON.parse(r.value));
      } catch {
        // Silently ignore storage errors
      }
      try {
        const r = await window.storage.get("chronos-user");
        if (r?.value) setUser(JSON.parse(r.value));
      } catch {
        // Silently ignore storage errors
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => { try { await window.storage.set("chronos-events", JSON.stringify(events)); } catch { /* Ignore */ } })();
  }, [events, loaded]);

  useEffect(() => {
    if (!loaded) return;
    (async () => { try { await window.storage.set("chronos-user", JSON.stringify(user)); } catch { /* Ignore */ } })();
  }, [user, loaded]);

  const login = (u) => { setUser(u); notify(`Welcome back, ${u.name}!`); };
  const logout = () => { setUser(null); setView("dashboard"); };

  const myEvents = useMemo(() => {
    if (!user) return [];
    return events.filter(e => e.createdBy === user.id || e.invitees?.some(i => i.userId === user.id));
  }, [events, user]);

  const filteredEvents = useMemo(() => {
    let r = myEvents;
    if (search) { const s = search.toLowerCase(); r = r.filter(e => e.title.toLowerCase().includes(s) || e.location?.toLowerCase().includes(s) || e.description?.toLowerCase().includes(s)); }
    if (filterCat !== "all") r = r.filter(e => e.category === filterCat);
    if (filterStatus !== "all") r = r.filter(e => e.status === filterStatus);
    return r.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [myEvents, search, filterCat, filterStatus]);

  const saveEvent = (ev) => {
    if (ev.id && events.find(e => e.id === ev.id)) {
      setEvents(p => p.map(e => e.id === ev.id ? ev : e));
      notify("Event updated!");
    } else {
      const ne = { ...ev, id: uid(), createdBy: user.id, invitees: ev.invitees || [] };
      setEvents(p => [...p, ne]);
      notify("Event created!");
    }
    setShowCreate(false);
    setEditEvent(null);
  };

  const deleteEvent = (id) => {
    setEvents(p => p.filter(e => e.id !== id));
    setViewEvent(null);
    notify("Event deleted", "info");
  };

  const updateInviteStatus = (eventId, status) => {
    setEvents(p => p.map(e => {
      if (e.id !== eventId) return e;
      return { ...e, invitees: e.invitees.map(i => i.userId === user.id ? { ...i, status } : i) };
    }));
    notify(`RSVP updated to ${status}`);
  };

  const sendInvite = (eventId, userId) => {
    setEvents(p => p.map(e => {
      if (e.id !== eventId) return e;
      if (e.invitees.find(i => i.userId === userId)) return e;
      return { ...e, invitees: [...e.invitees, { userId, status: "upcoming" }] };
    }));
    const u = DEMO_USERS.find(x => x.id === userId);
    notify(`Invitation sent to ${u?.name}!`);
  };

  // AI: Natural language event creation (Mock implementation)
  const aiCreateEvent = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const input = aiInput.toLowerCase();
      
      // Extract title (everything before timing/location keywords)
      let title = aiInput.split(/\b(at|on|next|tomorrow|today|this|@)\b/i)[0].trim() || "New Event";
      title = title.charAt(0).toUpperCase() + title.slice(1);
      
      // Extract date
      let date = fmt(today);
      if (input.includes("tomorrow")) date = fmt(addDays(today, 1));
      else if (input.includes("next week")) date = fmt(addDays(today, 7));
      else if (input.match(/next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/)) {
        const days = {monday:1,tuesday:2,wednesday:3,thursday:4,friday:5,saturday:6,sunday:0};
        const targetDay = input.match(/next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/)[1];
        const currentDay = today.getDay();
        const targetDayNum = days[targetDay];
        let daysToAdd = targetDayNum - currentDay;
        if (daysToAdd <= 0) daysToAdd += 7;
        date = fmt(addDays(today, daysToAdd));
      }
      
      // Extract time
      const timeMatch = input.match(/(\d{1,2}):?(\d{2})\s*(am|pm)?|(\d{1,2})\s*(am|pm)/i);
      let time = "12:00";
      if (timeMatch) {
        let hour = parseInt(timeMatch[1] || timeMatch[4]);
        const min = timeMatch[2] || "00";
        const period = timeMatch[3] || timeMatch[5];
        if (period && period.toLowerCase() === "pm" && hour < 12) hour += 12;
        if (period && period.toLowerCase() === "am" && hour === 12) hour = 0;
        time = `${hour.toString().padStart(2, "0")}:${min}`;
      }
      
      // Extract location
      const atMatch = input.match(/\s+at\s+([^,.]+)/i);
      const location = atMatch ? atMatch[1].trim() : "";
      
      // Determine category
      let category = "personal";
      if (input.match(/\b(meeting|call|standup|sync)\b/i)) category = "meeting";
      else if (input.match(/\b(lunch|dinner|coffee|drinks|party)\b/i)) category = "social";
      else if (input.match(/\b(gym|workout|exercise|run)\b/i)) category = "health";
      else if (input.match(/\b(class|study|workshop|training)\b/i)) category = "education";
      else if (input.match(/\b(deadline|submit|due)\b/i)) category = "deadline";
      else if (input.match(/\b(work|project|task)\b/i)) category = "work";
      
      const ev = {
        title,
        date,
        time,
        duration: 60,
        location,
        description: `Created from: "${aiInput}"`,
        category,
        priority: "medium",
        status: "upcoming",
        id: uid(),
        createdBy: user.id,
        invitees: []
      };
      
      setEvents(p => [...p, ev]);
      setAiInput("");
      notify("Event created successfully!", "success");
    } catch {
      notify("Couldn't parse that. Try again!", "error");
    }
    setAiLoading(false);
  };

  // AI: Smart suggestions
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [aiSugLoading, setAiSugLoading] = useState(false);

  const getAiSuggestions = async () => {
    setAiSugLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
      // Generate smart suggestions based on actual events
      const suggestions = [];
      
      // Check for work-life balance
      const workEvents = myEvents.filter(e => e.category === "work" || e.category === "meeting").length;
      const personalEvents = myEvents.filter(e => e.category === "personal" || e.category === "social").length;
      if (workEvents > personalEvents * 2) {
        suggestions.push({
          title: "Work-Life Balance",
          description: "You have many work events. Consider scheduling some personal time or social activities.",
          type: "wellness"
        });
      }
      
      // Check for clustered events
      const upcomingThisWeek = myEvents.filter(e => e.date >= fmt(today) && e.date <= fmt(addDays(today, 7))).length;
      if (upcomingThisWeek > 10) {
        suggestions.push({
          title: "Busy Week Ahead",
          description: `You have ${upcomingThisWeek} events this week. Consider blocking time for focused work.`,
          type: "optimization"
        });
      }
      
      // Default suggestions
      if (suggestions.length === 0) {
        suggestions.push(
          { title: "Stay Organized", description: "Review your upcoming events and prioritize the most important ones.", type: "optimization" },
          { title: "Take Breaks", description: "Schedule short breaks between meetings to stay refreshed and productive.", type: "wellness" },
          { title: "Network More", description: "Consider scheduling coffee chats or social events to expand your network.", type: "social" }
        );
      }
      
      setAiSuggestions(suggestions.slice(0, 3));
    } catch { setAiSuggestions([{ title: "Stay Balanced", description: "Mix work events with personal time for better productivity.", type: "wellness" }]); }
    setAiSugLoading(false);
  };

  const myInvitations = useMemo(() => {
    if (!user) return [];
    return events.filter(e => e.createdBy !== user.id && e.invitees?.some(i => i.userId === user.id))
      .map(e => ({ ...e, myStatus: e.invitees.find(i => i.userId === user.id)?.status }));
  }, [events, user]);

  const stats = useMemo(() => {
    const upcoming = myEvents.filter(e => e.date >= fmt(today)).length;
    const att = myEvents.filter(e => e.status === "attending").length;
    const inv = myInvitations.length;
    const cats = {};
    myEvents.forEach(e => { cats[e.category] = (cats[e.category] || 0) + 1; });
    return { upcoming, attending: att, invitations: inv, categories: cats, total: myEvents.length };
  }, [myEvents, myInvitations]);

  // ─── AUTH SCREEN ──────────────────────────
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", minWidth: "100vw", width: "100vw", height: "100vh", background: "linear-gradient(135deg, #0f0a2e 0%, #1a1145 40%, #0f172a 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','SF Pro',-apple-system,sans-serif", padding: 20, boxSizing: "border-box" }}>
        <style>{`
          @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-20px) } }
          @keyframes pulse { 0%,100% { opacity: 0.4 } 50% { opacity: 0.8 } }
          @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(10px) } to { opacity:1; transform:scale(1) translateY(0) } }
          @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
          @keyframes glow { 0%,100% { box-shadow: 0 0 30px rgba(99,102,241,0.3) } 50% { box-shadow: 0 0 60px rgba(99,102,241,0.5) } }
          input::placeholder { color: #475569 !important; }
          select option { background: #1e1b4b; }
          ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 3px; }
        `}</style>
        <div style={{ position: "absolute", top: "15%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent)", animation: "float 8s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "15%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.1), transparent)", animation: "float 6s ease-in-out infinite 2s", pointerEvents: "none" }} />
        <Glass style={{ padding: 40, width: "100%", maxWidth: 420, animation: "modalIn 0.5s ease" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", marginBottom: 16, animation: "glow 3s ease-in-out infinite" }}>
              <Sparkles size={32} color="#fff" />
            </div>
            <h1 style={{ color: "#e2e8f0", fontSize: 28, fontWeight: 800, margin: "0 0 4px", letterSpacing: -0.5 }}>Chronos</h1>
            <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>AI-Powered Event Scheduling</p>
          </div>
          <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16, textAlign: "center" }}>Select a user profile to continue</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DEMO_USERS.map(u => (
              <div key={u.id} onClick={() => login(u)} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 14,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", transition: "all 0.25s",
              }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
                <Avatar user={u} size={42} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>{u.email}</div>
                </div>
                <ArrowRight size={16} color="#64748b" />
              </div>
            ))}
          </div>
        </Glass>
      </div>
    );
  }

  // ─── EVENT FORM ──────────────────────────
  const EventForm = ({ event, onSave, onCancel }) => {
    const [f, setF] = useState(event || {
      title: "", date: fmt(today), time: "12:00", duration: 60, location: "", description: "", category: "personal", status: "upcoming", priority: "medium",
    });
    const up = (k, v) => setF(p => ({ ...p, [k]: v }));
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Input placeholder="Event title" value={f.title} onChange={e => up("title", e.target.value)} icon={Edit3} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Input type="date" value={f.date} onChange={e => up("date", e.target.value)} icon={Calendar} />
          <Input type="time" value={f.time} onChange={e => up("time", e.target.value)} icon={Clock} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Input placeholder="Duration (min)" type="number" value={f.duration} onChange={e => up("duration", parseInt(e.target.value) || 0)} icon={Clock} />
          <Select value={f.priority} onChange={v => up("priority", v)} options={[{ value: "low", label: "🟢 Low" }, { value: "medium", label: "🟡 Medium" }, { value: "high", label: "🔴 High" }]} />
        </div>
        <Input placeholder="Location" value={f.location} onChange={e => up("location", e.target.value)} icon={MapPin} />
        <Select value={f.category} onChange={v => up("category", v)} options={CATEGORIES.map(c => ({ value: c.id, label: c.icon + " " + c.label }))} />
        <Select value={f.status} onChange={v => up("status", v)} options={Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))} />
        <textarea placeholder="Description..." value={f.description || ""} onChange={e => up("description", e.target.value)}
          style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0", fontSize: 13, outline: "none", minHeight: 80, resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
          <Btn onClick={onCancel}>Cancel</Btn>
          <Btn primary onClick={() => f.title ? onSave(f) : null} disabled={!f.title}>
            <Check size={14} /> {event?.id ? "Update" : "Create"} Event
          </Btn>
        </div>
      </div>
    );
  };

  // ─── EVENT CARD ──────────────────────────
  const EventCard = ({ ev, compact }) => {
    const cat = CATEGORIES.find(c => c.id === ev.category) || CATEGORIES[5];
    const isPast = ev.date < fmt(today);
    const isToday = ev.date === fmt(today);
    return (
      <Glass hover onClick={() => setViewEvent(ev)} style={{ padding: compact ? 12 : 16, opacity: isPast ? 0.6 : 1 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ width: 4, height: compact ? 40 : 56, borderRadius: 4, background: cat.color, flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: compact ? 13 : 14 }}>{ev.title}</span>
              {isToday && <Badge color="#10b981" style={{ fontSize: 9 }}>TODAY</Badge>}
              {ev.priority === "high" && <Badge color="#ef4444" style={{ fontSize: 9 }}>HIGH</Badge>}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: compact ? 8 : 12, color: "#64748b", fontSize: 11 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={11} /> {ev.date}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={11} /> {ev.time}</span>
              {ev.location && !compact && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={11} /> {ev.location}</span>}
            </div>
          </div>
          <Badge color={STATUS_CONFIG[ev.status]?.color || "#6366f1"}>{STATUS_CONFIG[ev.status]?.label || ev.status}</Badge>
        </div>
      </Glass>
    );
  };

  // ─── VIEWS ──────────────────────────
  const DashboardView = () => {
    const todayEvents = myEvents.filter(e => e.date === fmt(today));
    const upcomingEvts = myEvents.filter(e => e.date >= fmt(today)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 5);
    const statCards = [
      { label: "Total Events", value: stats.total, icon: Layers, color: "#6366f1" },
      { label: "Upcoming", value: stats.upcoming, icon: Calendar, color: "#3b82f6" },
      { label: "Attending", value: stats.attending, icon: Check, color: "#10b981" },
      { label: "Invitations", value: stats.invitations, icon: Mail, color: "#ec4899" },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <h2 style={{ color: "#e2e8f0", fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {user.name}
          </h2>
          <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
            You have {todayEvents.length} event{todayEvents.length !== 1 ? "s" : ""} today and {stats.upcoming} upcoming.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {statCards.map((s, i) => (
            <Glass key={i} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <s.icon size={18} color={s.color} />
                <span style={{ color: s.color, fontSize: 10, fontWeight: 600, background: s.color + "18", padding: "2px 8px", borderRadius: 10 }}>
                  {i === 0 ? "ALL" : i === 1 ? "SOON" : i === 2 ? "RSVP" : "NEW"}
                </span>
              </div>
              <div style={{ color: "#e2e8f0", fontSize: 26, fontWeight: 800 }}>{s.value}</div>
              <div style={{ color: "#64748b", fontSize: 11 }}>{s.label}</div>
            </Glass>
          ))}
        </div>

        {/* AI Natural Language Creator */}
        <Glass style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Sparkles size={16} color="#8b5cf6" />
            <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14 }}>AI Quick Create</span>
            <Badge color="#8b5cf6">SMART PARSER</Badge>
          </div>
          <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 10px" }}>Describe your event in plain English and it will be created automatically.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <MessageSquare size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b", pointerEvents: "none", zIndex: 1 }} />
              <input
                placeholder='e.g. "Lunch with Sarah next Friday at 12:30 at Café Hamra"'
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && aiCreateEvent()}
                style={{
                  width: "100%", padding: "10px 12px 10px 38px", background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0", fontSize: 13, outline: "none",
                  transition: "border-color 0.2s", boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
            <Btn primary onClick={aiCreateEvent} disabled={aiLoading || !aiInput.trim()}>
              {aiLoading ? <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Zap size={14} />}
              {aiLoading ? "" : "Create"}
            </Btn>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </Glass>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Upcoming Timeline */}
          <Glass style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14 }}>Upcoming Events</span>
              <Btn small onClick={() => setView("events")}>View All</Btn>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {upcomingEvts.length ? upcomingEvts.map(ev => <EventCard key={ev.id} ev={ev} compact />) :
                <p style={{ color: "#475569", fontSize: 13, textAlign: "center", padding: 20 }}>No upcoming events</p>}
            </div>
          </Glass>

          {/* AI Suggestions */}
          <Glass style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <Sparkles size={14} color="#f59e0b" /> AI Insights
              </span>
              <Btn small onClick={getAiSuggestions} disabled={aiSugLoading}>
                {aiSugLoading ? <RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }} /> : <RefreshCw size={12} />}
                Refresh
              </Btn>
            </div>
            {aiSuggestions ? aiSuggestions.map((s, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.03)", marginBottom: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{s.title}</div>
                <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.5 }}>{s.description}</div>
              </div>
            )) : (
              <div style={{ textAlign: "center", padding: 30, color: "#475569" }}>
                <Sparkles size={28} style={{ marginBottom: 8, opacity: 0.5 }} />
                <p style={{ fontSize: 12 }}>Click "Refresh" to get AI-powered scheduling insights based on your events.</p>
              </div>
            )}
          </Glass>
        </div>

        {/* Invitations */}
        {myInvitations.length > 0 && (
          <Glass style={{ padding: 18 }}>
            <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Mail size={16} color="#ec4899" /> Pending Invitations ({myInvitations.filter(e => e.myStatus === "upcoming").length})
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {myInvitations.filter(e => e.myStatus === "upcoming").slice(0, 3).map(ev => {
                const from = DEMO_USERS.find(u => u.id === ev.createdBy);
                return (
                  <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <Avatar user={from} size={32} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{ev.title}</div>
                      <div style={{ color: "#64748b", fontSize: 11 }}>From {from?.name} · {ev.date} at {ev.time}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn small primary onClick={e => { e.stopPropagation(); updateInviteStatus(ev.id, "attending"); }}><Check size={12} /></Btn>
                      <Btn small onClick={e => { e.stopPropagation(); updateInviteStatus(ev.id, "maybe"); }}>Maybe</Btn>
                      <Btn small danger onClick={e => { e.stopPropagation(); updateInviteStatus(ev.id, "declined"); }}><X size={12} /></Btn>
                    </div>
                  </div>
                );
              })}
            </div>
          </Glass>
        )}
      </div>
    );
  };

  const CalendarView = () => {
    const year = calMonth.getFullYear(), month = calMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    const getEventsForDay = (d) => {
      if (!d) return [];
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      return myEvents.filter(e => e.date === dateStr);
    };

    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ color: "#e2e8f0", fontSize: 20, fontWeight: 800, margin: 0 }}>
            {calMonth.toLocaleDateString("en", { month: "long", year: "numeric" })}
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn small onClick={() => setCalMonth(new Date(year, month - 1, 1))}><ChevronLeft size={14} /></Btn>
            <Btn small onClick={() => setCalMonth(new Date(today.getFullYear(), today.getMonth(), 1))}>Today</Btn>
            <Btn small onClick={() => setCalMonth(new Date(year, month + 1, 1))}><ChevronRight size={14} /></Btn>
          </div>
        </div>
        <Glass style={{ padding: 16, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} style={{ textAlign: "center", color: "#64748b", fontSize: 11, fontWeight: 600, padding: "8px 0", letterSpacing: 0.5 }}>{d}</div>
            ))}
            {days.map((d, i) => {
              const evts = getEventsForDay(d);
              const isToday = d && year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
              return (
                <div key={i} style={{
                  minHeight: 80, padding: 6, background: isToday ? "rgba(99,102,241,0.08)" : d ? "rgba(255,255,255,0.01)" : "transparent",
                  borderRadius: 8, border: isToday ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.03)",
                  cursor: d ? "pointer" : "default", transition: "background 0.2s",
                }} onMouseEnter={e => { if (d) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { if (d) e.currentTarget.style.background = isToday ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.01)"; }}
                  onClick={() => { if (d) { setShowCreate(true); setEditEvent({ date: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` }); } }}>
                  {d && <>
                    <div style={{ color: isToday ? "#818cf8" : "#94a3b8", fontSize: 12, fontWeight: isToday ? 700 : 500, marginBottom: 4 }}>{d}</div>
                    {evts.slice(0, 3).map(ev => {
                      const cat = CATEGORIES.find(c => c.id === ev.category);
                      return (
                        <div key={ev.id} onClick={e => { e.stopPropagation(); setViewEvent(ev); }} style={{
                          fontSize: 10, padding: "2px 5px", borderRadius: 4, marginBottom: 2, cursor: "pointer",
                          background: (cat?.color || "#6366f1") + "22", color: cat?.color || "#6366f1",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500,
                        }}>{ev.time?.slice(0, 5)} {ev.title}</div>
                      );
                    })}
                    {evts.length > 3 && <div style={{ fontSize: 9, color: "#64748b", textAlign: "center" }}>+{evts.length - 3} more</div>}
                  </>}
                </div>
              );
            })}
          </div>
        </Glass>
      </div>
    );
  };

  const EventsView = () => (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ color: "#e2e8f0", fontSize: 20, fontWeight: 800, margin: 0 }}>All Events</h2>
        <Btn primary onClick={() => { setEditEvent(null); setShowCreate(true); }}><Plus size={14} /> New Event</Btn>
      </div>
      <Glass style={{ padding: 14, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: "1 1 200px" }}><Input icon={Search} placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <Select value={filterCat} onChange={setFilterCat} style={{ flex: "0 1 150px" }} options={[{ value: "all", label: "All Categories" }, ...CATEGORIES.map(c => ({ value: c.id, label: c.icon + " " + c.label }))]} />
          <Select value={filterStatus} onChange={setFilterStatus} style={{ flex: "0 1 140px" }} options={[{ value: "all", label: "All Status" }, ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))]} />
        </div>
      </Glass>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filteredEvents.length ? filteredEvents.map(ev => <EventCard key={ev.id} ev={ev} />) :
          <Glass style={{ padding: 40, textAlign: "center" }}>
            <Search size={32} color="#475569" style={{ marginBottom: 10 }} />
            <p style={{ color: "#64748b", fontSize: 14 }}>No events found matching your criteria.</p>
          </Glass>}
      </div>
    </div>
  );

  const InvitationsView = () => (
    <div>
      <h2 style={{ color: "#e2e8f0", fontSize: 20, fontWeight: 800, margin: "0 0 16px" }}>Invitations</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Glass style={{ padding: 18 }}>
          <h3 style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 700, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}><Mail size={16} color="#ec4899" /> Received</h3>
          {myInvitations.length ? myInvitations.map(ev => {
            const from = DEMO_USERS.find(u => u.id === ev.createdBy);
            return (
              <div key={ev.id} style={{ padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.03)", marginBottom: 10, border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Avatar user={from} size={28} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{ev.title}</div>
                    <div style={{ color: "#64748b", fontSize: 11 }}>From {from?.name} · {ev.date}</div>
                  </div>
                  <Badge color={STATUS_CONFIG[ev.myStatus]?.color}>{STATUS_CONFIG[ev.myStatus]?.label}</Badge>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["attending", "maybe", "declined"].map(s => (
                    <Btn key={s} small primary={ev.myStatus === s} onClick={() => updateInviteStatus(ev.id, s)}>
                      {STATUS_CONFIG[s].label}
                    </Btn>
                  ))}
                </div>
              </div>
            );
          }) : <p style={{ color: "#475569", fontSize: 13, textAlign: "center", padding: 20 }}>No invitations received</p>}
        </Glass>
        <Glass style={{ padding: 18 }}>
          <h3 style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 700, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}><Send size={16} color="#6366f1" /> Sent</h3>
          {events.filter(e => e.createdBy === user.id && e.invitees?.length > 0).map(ev => (
            <div key={ev.id} style={{ padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.03)", marginBottom: 10, border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{ev.title}</div>
              {ev.invitees.map(inv => {
                const u = DEMO_USERS.find(x => x.id === inv.userId);
                return u ? (
                  <div key={inv.userId} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <Avatar user={u} size={22} />
                    <span style={{ color: "#94a3b8", fontSize: 12, flex: 1 }}>{u.name}</span>
                    <Badge color={STATUS_CONFIG[inv.status]?.color} style={{ fontSize: 10 }}>{STATUS_CONFIG[inv.status]?.label}</Badge>
                  </div>
                ) : null;
              })}
            </div>
          ))}
        </Glass>
      </div>
    </div>
  );

  const AnalyticsView = () => {
    const catData = CATEGORIES.map(c => ({ name: c.icon + " " + c.label, value: myEvents.filter(e => e.category === c.id).length, color: c.color })).filter(d => d.value > 0);
    const statusData = Object.entries(STATUS_CONFIG).map(([k, v]) => ({ name: v.label, value: myEvents.filter(e => e.status === k).length, color: v.color }));
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(today, i);
      return { name: d.toLocaleDateString("en", { weekday: "short" }), events: myEvents.filter(e => e.date === fmt(d)).length };
    });
    const priorityData = ["high", "medium", "low"].map(p => ({
      name: p.charAt(0).toUpperCase() + p.slice(1), value: myEvents.filter(e => e.priority === p).length,
      color: p === "high" ? "#ef4444" : p === "medium" ? "#f59e0b" : "#10b981",
    }));
    return (
      <div>
        <h2 style={{ color: "#e2e8f0", fontSize: 20, fontWeight: 800, margin: "0 0 16px" }}>Analytics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Glass style={{ padding: 18 }}>
            <h3 style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>Events This Week</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={last7}><defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#1e1b4b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} />
                <Area type="monotone" dataKey="events" stroke="#6366f1" fillOpacity={1} fill="url(#g1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Glass>
          <Glass style={{ padding: 18 }}>
            <h3 style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>By Category</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart><Pie data={catData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                {catData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie><Tooltip contentStyle={{ background: "#1e1b4b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} /></PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {catData.map((d, i) => <span key={i} style={{ fontSize: 10, color: d.color }}>{d.name} ({d.value})</span>)}
            </div>
          </Glass>
          <Glass style={{ padding: 18 }}>
            <h3 style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>By Status</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={statusData}>
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#1e1b4b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>{statusData.map((d, i) => <Cell key={i} fill={d.color} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </Glass>
          <Glass style={{ padding: 18 }}>
            <h3 style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>By Priority</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={priorityData} layout="vertical">
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={{ background: "#1e1b4b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>{priorityData.map((d, i) => <Cell key={i} fill={d.color} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </Glass>
        </div>
      </div>
    );
  };

  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "events", label: "Events", icon: Layers },
    { id: "invitations", label: "Invitations", icon: Mail },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", minWidth: "100vw", width: "100vw", height: "100vh", background: "linear-gradient(135deg, #0f0a2e 0%, #1a1145 30%, #0f172a 100%)", fontFamily: "'Inter','SF Pro',-apple-system,sans-serif", color: "#e2e8f0", boxSizing: "border-box" }}>
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-20px) } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(10px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 30px rgba(99,102,241,0.3) } 50% { box-shadow: 0 0 60px rgba(99,102,241,0.5) } }
        @keyframes spin { to { transform: rotate(360deg) } }
        input::placeholder { color: #475569 !important; }
        textarea::placeholder { color: #475569 !important; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 3px; }
      `}</style>

      {/* Ambient effects */}
      <div style={{ position: "fixed", top: "10%", left: "50%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.06), transparent)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: 0, right: 0, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.04), transparent)", pointerEvents: "none" }} />

      {/* Sidebar */}
      <div style={{ width: 220, flexShrink: 0, padding: 16, borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>Chronos</span>
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(n => {
            const active = view === n.id;
            const invCount = n.id === "invitations" ? myInvitations.filter(e => e.myStatus === "upcoming").length : 0;
            return (
              <div key={n.id} onClick={() => setView(n.id)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                background: active ? "rgba(99,102,241,0.15)" : "transparent", color: active ? "#818cf8" : "#64748b",
                transition: "all 0.2s", fontWeight: active ? 600 : 500, fontSize: 13,
              }} onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                <n.icon size={17} />
                <span style={{ flex: 1 }}>{n.label}</span>
                {invCount > 0 && <span style={{ background: "#ec4899", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "1px 7px", minWidth: 18, textAlign: "center" }}>{invCount}</span>}
              </div>
            );
          })}
        </nav>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12, marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", marginBottom: 8 }}>
            <Avatar user={user} size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
              <div style={{ color: "#475569", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
            </div>
          </div>
          <div onClick={logout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10, cursor: "pointer", color: "#64748b", fontSize: 13, transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <LogOut size={16} /> Sign Out
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
        {view === "dashboard" && DashboardView()}
        {view === "calendar" && CalendarView()}
        {view === "events" && EventsView()}
        {view === "invitations" && InvitationsView()}
        {view === "analytics" && AnalyticsView()}
      </div>

      {/* FAB */}
      <button onClick={() => { setEditEvent(null); setShowCreate(true); }} style={{
        position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", width: 52, height: 52, borderRadius: 16,
        background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 24px rgba(99,102,241,0.4)",
        transition: "transform 0.2s, box-shadow 0.2s", zIndex: 100,
      }} onMouseEnter={e => { e.currentTarget.style.transform = "translateX(-50%) scale(1.08)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateX(-50%) scale(1)"; }}>
        <Plus size={22} />
      </button>

      {/* Create/Edit Modal */}
      <Modal open={showCreate || !!editEvent} onClose={() => { setShowCreate(false); setEditEvent(null); }}
        title={editEvent?.id ? "Edit Event" : "Create Event"}>
        <EventForm
          event={editEvent?.id ? editEvent : editEvent?.date ? { title: "", date: editEvent.date, time: "12:00", duration: 60, location: "", description: "", category: "personal", status: "upcoming", priority: "medium" } : null}
          onSave={saveEvent} onCancel={() => { setShowCreate(false); setEditEvent(null); }} />
      </Modal>

      {/* View Event Modal */}
      <Modal open={!!viewEvent} onClose={() => setViewEvent(null)} title="" wide>
        {viewEvent && (() => {
          const ev = viewEvent;
          const cat = CATEGORIES.find(c => c.id === ev.category) || CATEGORIES[5];
          const isOwner = ev.createdBy === user.id;
          const creator = DEMO_USERS.find(u => u.id === ev.createdBy);
          return (
            <div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: cat.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{cat.icon}</div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ color: "#e2e8f0", fontSize: 20, fontWeight: 800, margin: "0 0 6px" }}>{ev.title}</h2>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Badge color={cat.color}>{cat.label}</Badge>
                    <Badge color={STATUS_CONFIG[ev.status]?.color}>{STATUS_CONFIG[ev.status]?.label}</Badge>
                    {ev.priority === "high" && <Badge color="#ef4444">High Priority</Badge>}
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
                {[
                  { icon: Calendar, label: "Date", value: new Date(ev.date + "T00:00").toLocaleDateString("en", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
                  { icon: Clock, label: "Time", value: `${ev.time} · ${ev.duration} min` },
                  { icon: MapPin, label: "Location", value: ev.location || "—" },
                  { icon: User, label: "Organizer", value: creator?.name || "Unknown" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
                    <item.icon size={16} color="#64748b" />
                    <div>
                      <div style={{ color: "#475569", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{item.label}</div>
                      <div style={{ color: "#e2e8f0", fontSize: 13 }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              {ev.description && (
                <div style={{ padding: 14, borderRadius: 10, background: "rgba(255,255,255,0.03)", marginBottom: 18 }}>
                  <div style={{ color: "#475569", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Description</div>
                  <p style={{ color: "#94a3b8", fontSize: 13, margin: 0, lineHeight: 1.6 }}>{ev.description}</p>
                </div>
              )}
              {/* Attendees */}
              {ev.invitees?.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ color: "#475569", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
                    Attendees ({ev.invitees.length})
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {ev.invitees.map(inv => {
                      const u = DEMO_USERS.find(x => x.id === inv.userId);
                      return u ? (
                        <div key={inv.userId} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <Avatar user={u} size={22} />
                          <span style={{ color: "#e2e8f0", fontSize: 12 }}>{u.name}</span>
                          <Badge color={STATUS_CONFIG[inv.status]?.color} style={{ fontSize: 9 }}>{STATUS_CONFIG[inv.status]?.label}</Badge>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
              {/* RSVP for invitees */}
              {!isOwner && (
                <div style={{ display: "flex", gap: 8, marginBottom: 18, padding: 14, borderRadius: 10, background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.1)" }}>
                  <span style={{ color: "#94a3b8", fontSize: 13, marginRight: 8, display: "flex", alignItems: "center" }}>Your RSVP:</span>
                  {["attending", "maybe", "declined"].map(s => (
                    <Btn key={s} small primary={ev.invitees?.find(i => i.userId === user.id)?.status === s}
                      onClick={() => { updateInviteStatus(ev.id, s); setViewEvent({ ...ev, invitees: ev.invitees.map(i => i.userId === user.id ? { ...i, status: s } : i) }); }}>
                      {STATUS_CONFIG[s].label}
                    </Btn>
                  ))}
                </div>
              )}
              {/* Actions */}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
                {isOwner && (
                  <>
                    <Btn onClick={() => {
                      const others = DEMO_USERS.filter(u => u.id !== user.id && !ev.invitees?.find(i => i.userId === u.id));
                      if (others.length) { setInviteModal(ev.id); }
                      else notify("All users already invited", "info");
                    }}><Users size={14} /> Invite</Btn>
                    <Btn onClick={() => { setViewEvent(null); setEditEvent(ev); setShowCreate(true); }}><Edit3 size={14} /> Edit</Btn>
                    <Btn danger onClick={() => deleteEvent(ev.id)}><Trash2 size={14} /> Delete</Btn>
                  </>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Invite Modal */}
      <Modal open={!!inviteModal} onClose={() => setInviteModal(null)} title="Invite Users">
        {inviteModal && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DEMO_USERS.filter(u => u.id !== user.id).map(u => {
              const ev = events.find(e => e.id === inviteModal);
              const alreadyInvited = ev?.invitees?.find(i => i.userId === u.id);
              return (
                <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <Avatar user={u} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>{u.email}</div>
                  </div>
                  {alreadyInvited ?
                    <Badge color={STATUS_CONFIG[alreadyInvited.status]?.color}>{STATUS_CONFIG[alreadyInvited.status]?.label}</Badge> :
                    <Btn small primary onClick={() => { sendInvite(inviteModal, u.id); }}><Send size={12} /> Invite</Btn>
                  }
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}