"use client";

import { useState, useEffect } from "react";
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
  CheckCircle2
} from "lucide-react";

export default function Home() {
  const [appState, setAppState] = useState<"idle" | "loading" | "generated">("idle");
  const [prompt, setPrompt] = useState("");
  const [generatedData, setGeneratedData] = useState<{ schema: string, endpoints: any[] } | null>(null);
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
    } catch (error: any) {
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-ambient">
              <Zap size={18} className="text-on-primary" />
            </div>
            <span className="text-brand-display text-xl tracking-tight font-semibold text-on-surface">APIForge</span>
          </div>

          <nav className="flex flex-col gap-2">
            <NavItem icon={<LayoutDashboard size={18} />} label="Workspace" active={appState === "idle" || appState === "loading"} />
            <NavItem icon={<Database size={18} />} label="Schemas" active={appState === "generated"} />
            <NavItem icon={<TerminalSquare size={18} />} label="Endpoints" active={appState === "generated"} />
            <NavItem icon={<Shield size={18} />} label="Auth Rules" />
            <NavItem icon={<BookOpen size={18} />} label="Docs" />
          </nav>
        </div>

        <div>
          <nav className="flex flex-col gap-2">
            <NavItem icon={<Settings size={18} />} label="Project Settings" />
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
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
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

function IdleState({ prompt, setPrompt, onGenerate, errorMsg }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex-1 flex flex-col items-center justify-center p-8 relative"
    >
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

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
                className="absolute bottom-4 right-4 p-3 btn-primary rounded-lg shadow-ambient group-focus-within:animate-pulse focus:animate-none"
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

function Chip({ text, onClick }: { text: string, onClick?: () => void }) {
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

function LoadingStep({ text, delay }: { text: string, delay: number }) {
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

function GeneratedState({ onReset, schema, endpoints }: { onReset: () => void, schema: string, endpoints: any[] }) {
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

function Endpoint({ method, path, desc }: { method: string, path: string, desc: string }) {
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
