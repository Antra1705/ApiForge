"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Play,
  Settings,
  TerminalSquare,
  LayoutDashboard,
  Code,
  Key,
  BookOpen,
  Layers,
  Zap,
  Server,
  Shield,
  Box,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Lock,
  Users,
  Save,
  Globe,
  FileText,
  Key as KeyIcon,
  ToggleRight,
  DatabaseZap
} from "lucide-react";

export default function Home() {
  const [appState, setAppState] = useState("idle");
  const [prompt, setPrompt] = useState("");
  const [generatedData, setGeneratedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMsg("Please enter a prompt.");
      return;
    }

    setErrorMsg("");
    setAppState("loading");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");

      setGeneratedData(data);
      setAppState("generated");
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
      setAppState("idle");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden antialiased bg-surface text-on-surface">
      {/* Sidebar - Asymmetrical Plane, structural boundary via tonal shift */}
      <aside className="w-64 flex flex-col justify-between py-6 px-4 bg-surface-container z-10 transition-all duration-300">
        <div>
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="w-3 h-3 rounded bg-primary" />
            <span className="text-brand-display text-xl tracking-tight font-semibold text-on-surface">APIForge</span>
          </div>

          <nav className="flex flex-col gap-2">
            <NavItem onClick={() => setAppState("idle")} icon={<LayoutDashboard size={18} />} label="Workspace" active={appState === "idle" || appState === "loading"} />
            <NavItem icon={<Database size={18} />} label="Schemas" active={appState === "generated"} />
            <NavItem icon={<TerminalSquare size={18} />} label="Endpoints" active={appState === "generated"} />
            <NavItem onClick={() => setAppState("coming_soon_auth")} icon={<Shield size={18} />} label="Auth Rules" active={appState === "coming_soon_auth"} />
            <NavItem onClick={() => setAppState("coming_soon_docs")} icon={<BookOpen size={18} />} label="Docs" active={appState === "coming_soon_docs"} />
          </nav>
        </div>

        <div>
          <nav className="flex flex-col gap-2">
            <NavItem onClick={() => setAppState("coming_soon_settings")} icon={<Settings size={18} />} label="Project Settings" active={appState === "coming_soon_settings"} />
          </nav>
        </div>
      </aside>

      {/* Main Workspace - Different tonal plane */}
      <main className="flex-1 flex flex-col p-6 bg-surface overflow-hidden relative">
        <div className="flex-1 bg-surface-container-high rounded-xl overflow-hidden relative flex flex-col">
          
          <AnimatePresence mode="wait">
            {appState === "idle" && (
              <IdleState 
                key="idle" 
                prompt={prompt} 
                setPrompt={setPrompt} 
                onGenerate={handleGenerate}
                errorMsg={errorMsg}
              />
            )}
            
            {appState === "loading" && (
              <LoadingState key="loading" />
            )}

            {appState === "generated" && generatedData && (
              <GeneratedState 
                key="generated" 
                schema={generatedData.schema}
                endpoints={generatedData.endpoints}
                onReset={() => setAppState("idle")} 
              />
            )}

            {appState === "coming_soon_auth" && <AuthRulesState key="auth" />}
            {appState === "coming_soon_docs" && <DocsState key="docs" endpoints={generatedData?.endpoints || []} />}
            {appState === "coming_soon_settings" && <SettingsState key="settings" />}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full text-left font-medium ${
        active 
          ? "bg-surface-bright text-primary" 
          : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest"
      }`}
    >
      <span className={active ? "text-primary" : "text-outline"}>{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
}

function IdleState({ prompt, setPrompt, onGenerate, errorMsg }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex-1 flex flex-col items-center justify-center p-8 relative"
    >
      {/* Decorative Orbs */}
      {/* Glow blobs removed for solid aesthetics */}

      <div className="max-w-3xl w-full flex flex-col gap-8 z-10">
        <div className="text-center space-y-4">
          <h1 className="text-brand-display text-4xl md:text-5xl text-on-surface font-semibold">
            Define your API <br /> in plain english.
          </h1>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
            Automagically generate schemas, REST endpoints, and docs. Fast, scalable, and kinetic.
          </p>
        </div>

        <div className="relative flex flex-col gap-2">
          <div className="relative group">
            <label className="absolute -top-6 left-2 text-sm font-medium text-on-surface-variant transition-colors group-focus-within:text-primary">
              Prompt
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Build an API for a marketplace where users can list items and message sellers..."
                className="w-full h-40 input-inset p-5 pr-20 resize-none text-base focus-glow"
                autoFocus
              />
              <button 
                onClick={onGenerate}
                className="absolute bottom-4 right-4 p-3 btn-primary rounded-lg group-focus-within:animate-pulse focus:animate-none"
              >
                <Play size={20} className="fill-current ml-0.5" />
              </button>
            </div>
          </div>
          {errorMsg && (
            <div className="text-error text-sm font-medium px-2 flex items-center gap-2">
              <Shield size={14} className="text-error" /> {errorMsg}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 justify-center">
          <span className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Examples:</span>
          <Chip text="E-commerce backend" onClick={() => setPrompt("E-commerce backend with carts, orders, and payments")} />
          <Chip text="Blog with comments" onClick={() => setPrompt("A blogging platform where users can post articles, leave comments, and like posts.")} />
          <Chip text="Real-time chat schema" onClick={() => setPrompt("Real-time chat application with users, channels, and direct messages.")} />
        </div>
      </div>
    </motion.div>
  );
}

function Chip({ text, onClick }) {
  return (
    <button onClick={onClick} className="px-3 py-1.5 text-xs font-mono rounded-full bg-surface-container-highest border border-outline-variant/15 text-primary-fixed-dim hover:bg-surface-bright hover:border-primary/30 transition-all">
      {text}
    </button>
  );
}

function LoadingState() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center relative overflow-hidden"
    >
      <div className="w-full max-w-2xl px-8 flex flex-col gap-6 z-10">
        <div className="flex items-center gap-4 text-primary">
          <Loader2 className="animate-spin" size={28} />
          <h2 className="text-2xl font-medium tracking-tight">AI Architect Synthesizing...</h2>
        </div>
        
        <div className="space-y-4">
          <LoadingStep delay={0} text="Parsing natural language constraints" />
          <LoadingStep delay={0.8} text="Architecting relational database schema" />
          <LoadingStep delay={1.6} text="Generating RESTful endpoints" />
        </div>
      </div>
    </motion.div>
  );
}

function LoadingStep({ text, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="flex items-center gap-3 text-on-surface-variant font-mono text-sm bg-surface-container-highest/50 p-3 rounded-lg border border-outline-variant/10"
    >
      <CheckCircle2 size={16} className="text-secondary" />
      {text}
    </motion.div>
  );
}

function GeneratedState({ onReset, schema, endpoints }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col h-full overflow-hidden"
    >
      {/* Header */}
      <header className="px-6 py-4 border-b border-surface/50 flex items-center justify-between z-10 glass-overlay rounded-none border-t-0 border-l-0 border-r-0">
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 bg-surface-container-lowest rounded text-xs font-mono text-secondary border border-outline-variant/15">v1.0.0</span>
          <h2 className="text-lg font-medium">Generated API Reference</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onReset} className="px-4 py-2 text-sm btn-secondary font-medium">New Prompt</button>
          <button className="px-4 py-2 text-sm btn-primary font-medium flex items-center gap-2">
            <Code size={16} /> Deploy to Cloud
          </button>
        </div>
      </header>

      {/* Main Split View */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Schema */}
        <div className="w-1/2 p-6 flex flex-col gap-4 overflow-y-auto border-r border-surface">
          <div className="flex items-center gap-2 text-on-surface-variant mb-2">
            <Database size={18} className="text-secondary" />
            <h3 className="font-medium text-sm uppercase tracking-wider">Database Schema (Prisma)</h3>
          </div>
          
          <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/15 shadow-inset-layer flex-1 overflow-auto">
            <pre className="font-mono text-sm text-on-surface whitespace-pre-wrap leading-relaxed">
              {schema}
            </pre>
          </div>
        </div>

        {/* Right Panel: Endpoints */}
        <div className="w-1/2 p-6 flex flex-col gap-4 overflow-y-auto bg-surface-container-lowest/30">
          <div className="flex items-center gap-2 text-on-surface-variant mb-2">
            <TerminalSquare size={18} className="text-primary" />
            <h3 className="font-medium text-sm uppercase tracking-wider">REST Endpoints</h3>
          </div>

          <div className="flex flex-col gap-3">
            {endpoints.map((ep, idx) => (
              <Endpoint key={idx} method={ep.method} path={ep.path} desc={ep.desc} />
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}

function Endpoint({ method, path, desc }) {
  let methodStyles = "";
  const upperMethod = method.toUpperCase();
  
  if (upperMethod === "GET") {
    // Success (GET): primary text on primary_fixed_variant (low opacity) background
    methodStyles = "text-primary bg-primary-fixed-variant/40 border-primary-fixed-variant/50";
  } else if (upperMethod === "POST" || upperMethod === "PUT" || upperMethod === "PATCH") {
    // Warning (POST): tertiary text on tertiary_fixed_variant background
    methodStyles = "text-tertiary bg-tertiary-fixed-variant border-tertiary-fixed-variant/50";
  } else if (upperMethod === "DELETE") {
    // Error (DELETE): error text on error_container background
    methodStyles = "text-error bg-error-container border-error/20";
  } else {
    methodStyles = "text-on-surface bg-surface-variant border-outline-variant/50";
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.01, backgroundColor: "var(--color-surface-bright)" }}
      className="p-4 bg-surface-container-low rounded-lg transition-all duration-200 cursor-pointer flex flex-col gap-3 group"
    >
      <div className="flex items-center gap-4">
        <span className={`px-2.5 py-1 text-xs font-bold font-mono tracking-wide rounded border ${methodStyles}`}>
          {upperMethod}
        </span>
        <span className="font-mono text-sm text-on-surface-variant group-hover:text-on-surface transition-colors break-all">
          {path}
        </span>
      </div>
      <p className="text-sm text-on-surface-variant pl-1">
        {desc}
      </p>
    </motion.div>
  );
}

function ComingSoonState({ title, icon }) {
// ... This block will effectively be replaced by the appended code ...
}

function SettingsState() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="px-6 py-4 border-b border-surface/50 flex items-center gap-3 z-10 glass-overlay rounded-none">
        <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-on-surface-variant border border-outline-variant/20">
          <Settings size={18} />
        </div>
        <h2 className="text-lg font-medium text-on-surface">Project Settings</h2>
      </header>
      <div className="flex-1 p-8 overflow-y-auto w-full max-w-4xl mx-auto flex flex-col gap-8">
        
        <div className="space-y-6 bg-surface-container-low p-8 rounded-xl border border-outline-variant/15 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-50" />
          <h3 className="text-lg font-medium flex items-center gap-2"><Globe size={18} className="text-primary"/> General Configuration</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant">Project Name</label>
              <input type="text" defaultValue="Marketplace API Backend" className="w-full input-inset p-3 bg-surface-container-highest border-transparent rounded-lg text-on-surface focus:border-primary/50 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant">Environment Stage</label>
              <select className="w-full input-inset p-3 bg-surface-container-highest border-transparent rounded-lg text-on-surface focus:border-primary/50 transition-colors">
                <option>Development</option>
                <option>Staging</option>
                <option>Production</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-surface-container-low p-8 rounded-xl border border-outline-variant/15 relative overflow-hidden">
          <h3 className="text-lg font-medium flex items-center gap-2"><DatabaseZap size={18} className="text-secondary"/> Database Engine</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border-2 border-primary/40 bg-surface-bright rounded-lg cursor-pointer flex flex-col items-center justify-center gap-3 relative">
               <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full animate-pulse" />
               <Database size={24} className="text-primary" />
               <span className="font-medium text-primary">PostgreSQL</span>
            </div>
            <div className="p-4 border border-outline-variant/20 hover:border-outline-variant/40 bg-surface-container-highest rounded-lg cursor-pointer flex flex-col items-center justify-center gap-3 transition-colors">
               <Layers size={24} className="text-on-surface-variant" />
               <span className="font-medium text-on-surface-variant">MongoDB</span>
            </div>
            <div className="p-4 border border-outline-variant/20 hover:border-outline-variant/40 bg-surface-container-highest rounded-lg cursor-pointer flex flex-col items-center justify-center gap-3 transition-colors">
               <Server size={24} className="text-on-surface-variant" />
               <span className="font-medium text-on-surface-variant">MySQL</span>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium text-on-surface-variant">Connection URI</label>
            <input type="password" defaultValue="postgres://user:pass@localhost:5432/db" className="w-full input-inset p-3 bg-surface-container-highest border-transparent rounded-lg text-on-surface focus:border-primary/50 font-mono text-sm" />
          </div>
        </div>

        <div className="flex justify-end pt-4">
           <button className="btn-primary px-6 py-2.5 rounded-lg flex items-center gap-2"><Save size={18} /> Save Configuration</button>
        </div>

      </div>
    </motion.div>
  );
}

function DocsState({ endpoints = [] }) {
  // Group endpoints by primary resource. e.g. /api/users -> Users
  const groupedEndpoints = useMemo(() => {
    const groups = {};
    if (!endpoints || endpoints.length === 0) return groups;
    
    endpoints.forEach(ep => {
      const parts = ep.path.split('/').filter(Boolean);
      let resource = parts[0] || "General";
      if (resource === 'api' && parts.length > 1) {
        resource = parts[1];
      }
      // Capitalize first letter
      resource = resource.charAt(0).toUpperCase() + resource.slice(1);
      
      if (!groups[resource]) {
        groups[resource] = [];
      }
      groups[resource].push(ep);
    });
    return groups;
  }, [endpoints]);

  const tabs = Object.keys(groupedEndpoints);
  const [activeTab, setActiveTab] = useState(tabs.length > 0 ? tabs[0] : "Users");

  useEffect(() => {
    if (tabs.length > 0 && !tabs.includes(activeTab)) {
      setActiveTab(tabs[0]);
    }
  }, [tabs, activeTab]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col h-full overflow-hidden min-h-0">
      <header className="px-6 py-4 border-b border-surface/50 flex flex-col gap-1 z-10 glass-overlay rounded-none">
        <div className="flex justify-between items-center w-full">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-secondary border border-outline-variant/20">
               <BookOpen size={18} />
             </div>
             <h2 className="text-lg font-medium text-on-surface">Live API Documentation</h2>
           </div>
           <button className="bg-surface-container-highest text-on-surface-variant hover:text-on-surface px-4 py-1.5 rounded text-sm border border-outline-variant/30 flex items-center gap-2 transition-colors">
              <FileText size={16}/> Export OpenAPI Spec
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Side menu for docs */}
        <div className="w-64 border-r border-outline-variant/15 p-4 flex flex-col gap-2 overflow-y-auto bg-surface/30">
           <h3 className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-2 px-2">Resources</h3>
           {tabs.length > 0 ? tabs.map(tab => (
             <div key={tab} onClick={() => setActiveTab(tab)} className={`p-2 rounded text-sm font-medium cursor-pointer transition-colors ${activeTab === tab ? "bg-surface-bright text-primary border border-primary/20" : "hover:bg-surface-container-highest text-on-surface-variant"}`}>{tab}</div>
           )) : (
             <div className="p-2 text-sm text-on-surface-variant opacity-50">No generated endpoints yet.</div>
           )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-surface-container-lowest/50 flex flex-col gap-6 min-h-0">
           {tabs.length > 0 && groupedEndpoints[activeTab] ? (
             <>
               {groupedEndpoints[activeTab].map((ep, idx) => {
                 let colorClasses = "";
                 const method = ep.method.toUpperCase();
                 
                 if (method === "GET") colorClasses = "text-primary bg-primary-fixed-variant/40 border-primary-fixed-variant/50";
                 else if (method === "POST" || method === "PUT" || method === "PATCH") colorClasses = "text-tertiary bg-tertiary-fixed-variant border-tertiary-fixed-variant/50";
                 else if (method === "DELETE") colorClasses = "text-error bg-error-container border-error/20";
                 else colorClasses = "text-on-surface bg-surface-variant border-outline-variant/50";

                 return (
                   <div key={idx} className="shrink-0 flex flex-col border border-outline-variant/20 rounded-xl overflow-hidden bg-surface-container">
                     <div className={`bg-surface-bright/30 border-b border-outline-variant/10 p-4 flex items-center gap-4 shrink-0`}>
                        <span className={`px-2.5 py-1 text-xs font-bold font-mono border rounded ${colorClasses}`}>{method}</span>
                        <span className="font-mono text-lg text-on-surface">{ep.path}</span>
                     </div>
                     <div className="p-6 flex flex-col shrink-0">
                        <p className="text-on-surface-variant mb-6 border-b border-outline-variant/20 pb-4">{ep.desc}</p>
                        {method === "GET" && (
                          <div className="space-y-3">
                             <h4 className="text-sm font-medium text-on-surface">Response <span className="text-secondary opacity-80 text-xs font-mono ml-2">200 OK</span></h4>
                             <pre className="p-4 bg-surface-container-highest rounded-lg font-mono text-sm leading-relaxed text-on-surface-variant border border-outline-variant/10 shadow-inset-layer overflow-x-auto">
{`{
  "data": [
    { ... }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 50
  }
}`}
                             </pre>
                          </div>
                        )}
                        {(method === "POST" || method === "PUT" || method === "PATCH") && (
                          <div className="space-y-3">
                             <h4 className="text-sm font-medium text-on-surface">Request Body <span className="text-primary opacity-80 text-xs font-mono ml-2">application/json</span></h4>
                             <pre className="p-4 bg-surface-container-highest rounded-lg font-mono text-sm leading-relaxed text-on-surface-variant border border-outline-variant/10 shadow-inset-layer overflow-x-auto">
{`{
  "//": "Payload corresponding to active schema parameters"
}`}
                             </pre>
                          </div>
                        )}
                     </div>
                   </div>
                 );
               })}
             </>
           ) : (
             <div className="flex-1 flex items-center justify-center p-8 h-full">
               <div className="text-center text-on-surface-variant max-w-sm flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant border border-outline-variant/20 mb-4">
                    <BookOpen size={24} className="opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium text-on-surface mb-2">No endpoints configured</h3>
                  <p className="text-sm">We couldn't find generated endpoints in the workspace. Try generating a new API to preview docs here.</p>
               </div>
             </div>
           )}
        </div>
      </div>
    </motion.div>
  );
}

function AuthRulesState() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="px-6 py-4 border-b border-surface/50 flex flex-col gap-1 z-10 glass-overlay rounded-none">
        <div className="flex justify-between items-center w-full">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary border border-outline-variant/20">
               <Shield size={18} />
             </div>
             <h2 className="text-lg font-medium text-on-surface">Security & Authentication</h2>
           </div>
           <button className="btn-primary px-4 py-1.5 rounded text-sm flex items-center gap-2">
              <ToggleRight size={16}/> Apply Rules
           </button>
        </div>
      </header>

      <div className="flex-1 p-8 overflow-y-auto w-full max-w-5xl mx-auto grid grid-cols-3 gap-8">
         {/* Left col: Auth methods */}
         <div className="col-span-1 flex flex-col gap-6">
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/15 flex flex-col gap-4">
               <h3 className="font-medium text-on-surface border-b border-outline-variant/15 pb-2 text-sm flex justify-between items-center">
                  Authentication Providers <Shield size={14} className="text-secondary"/>
               </h3>
               
               <div className="p-4 bg-surface-container-highest border-l-2 border-primary rounded-r">
                 <div className="flex items-center justify-between mb-1">
                   <div className="flex items-center gap-2"><KeyIcon size={16} className="text-primary"/> <span className="font-medium text-sm">JWT Bearer Auth</span></div>
                   <div className="text-primary text-xs font-bold uppercase tracking-wide">Active</div>
                 </div>
                 <p className="text-xs text-on-surface-variant">Standard stateless authorization.</p>
               </div>
               
               <div className="p-4 bg-surface-container-highest border border-outline-variant/10 rounded cursor-pointer hover:bg-surface-bright transition-colors opacity-60">
                 <div className="flex items-center gap-2 mb-1"><Layers size={16} className="text-on-surface-variant"/> <span className="font-medium text-sm">OAuth 2.0 (Social)</span></div>
                 <p className="text-xs text-on-surface-variant">Google, GitHub, Apple login integration.</p>
               </div>
            </div>
         </div>

         {/* Right cols: Role constraints */}
         <div className="col-span-2 space-y-6">
             <h3 className="font-medium text-lg flex items-center gap-2"><Lock size={18} className="text-primary-fixed-dim" /> Role Based Access Control</h3>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/15 relative overflow-hidden group">
                   
                   <h4 className="text-xl font-medium text-on-surface mb-2 flex items-center gap-2">Admin <span className="text-[10px] uppercase font-mono bg-error-container text-error rounded px-1.5 py-0.5">High Priv</span></h4>
                   <p className="text-sm text-on-surface-variant mb-6 h-10">Unrestricted access. Can modify roles and delete resources.</p>
                   <div className="text-xs font-mono text-on-surface-variant bg-surface p-2 rounded">Policy: Allow *:*</div>
                </div>

                <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/15 relative overflow-hidden">
                   <h4 className="text-xl font-medium text-on-surface mb-2 flex items-center gap-2">User <span className="text-[10px] uppercase font-mono bg-primary-fixed-variant text-primary-fixed rounded px-1.5 py-0.5">Standard</span></h4>
                   <p className="text-sm text-on-surface-variant mb-6 h-10">Authorized to manage own resources and perform POST/GET actions.</p>
                   <div className="text-xs font-mono text-on-surface-variant bg-surface p-2 rounded">Policy: Allow owner:*</div>
                </div>
             </div>

             <div className="bg-surface-container-highest p-4 rounded-lg border border-outline-variant/20 flex gap-4 items-center">
                 <div className="p-2 bg-surface rounded shadow-inset-layer"><Users size={18} className="text-on-surface-variant" /></div>
                 <div>
                    <h5 className="font-medium text-sm text-on-surface">Anonymous Access</h5>
                    <p className="text-xs text-on-surface-variant">Currently disabled. All endpoints require an Authorization header unless explicitly marked public.</p>
                 </div>
                 <button className="ml-auto text-xs font-medium text-primary border border-primary/30 px-3 py-1.5 rounded hover:bg-primary/10 transition-colors">Enable Public Mode</button>
             </div>
         </div>
      </div>
    </motion.div>
  );
}
