"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Compass, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLogin, useRegister, getGetMeQueryKey } from "@/lib/mockApi";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function AuthModal() {
  const { authModalOpen, authModalTab, closeAuthModal, openAuthModal } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regRole, setRegRole] = useState("user");

  const loginMutation = useLogin({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        toast({ title: "Welcome back! 🎉", description: "Signed in successfully." });
        closeAuthModal();
        setLoginEmail(""); setLoginPass("");
      },
    },
  });

  const registerMutation = useRegister({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        toast({ title: "Account created! 🎉", description: "Welcome to Wanderstay." });
        closeAuthModal();
        setRegName(""); setRegEmail(""); setRegPass(""); setRegConfirm(""); setRegRole("user");
      },
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPass) return;
    loginMutation.mutate({ data: { email: loginEmail, password: loginPass } });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const name = regName.trim();
    const email = regEmail.trim();
    const pass = regPass.trim();
    const confirm = regConfirm.trim();

    if (!name || !email || !pass) return;

    // Email regex validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    if (pass !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (pass.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    registerMutation.mutate({ data: { name, email, password: pass, role: regRole } });
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;
  const loginError = (loginMutation.error as any)?.data?.error;
  const regError = (registerMutation.error as any)?.data?.error;

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all text-sm";

  return (
    <AnimatePresence>
      {authModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeAuthModal(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="w-full max-w-md bg-[#292524] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative px-6 sm:px-8 pt-6 sm:pt-8 pb-6 border-b border-white/10">
              <button
                onClick={closeAuthModal}
                className="absolute top-4 sm:top-6 right-4 sm:right-6 text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                  <Compass size={16} className="text-white" />
                </div>
                <span className="font-['DM_Serif_Display'] text-lg text-white">Wanderstay</span>
              </div>
              <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
                {(["login", "register"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => openAuthModal(tab)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      authModalTab === tab
                        ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/20"
                        : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    {tab === "login" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="px-6 sm:px-8 py-7">
              {authModalTab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className={inputClass}
                      required
                      data-testid="input-login-email"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Password</label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        className={`${inputClass} pr-11`}
                        required
                        data-testid="input-login-password"
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  {loginError && <p className="text-rose-400 text-sm bg-rose-500/10 px-3 py-2 rounded-lg">{loginError}</p>}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                    data-testid="button-login-submit"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                    <span>{isLoading ? "Signing in…" : "Sign In"}</span>
                  </motion.button>
                  
                  {/* Demo Login Buttons */}
                  <div className="pt-4 border-t border-white/10 mt-6">
                    <p className="text-center text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Quick Demo Login</p>
                    <div className="flex flex-col gap-2">
                      <button type="button" onClick={() => { setLoginEmail("admin@wanderstay.in"); setLoginPass("password123"); }} className="w-full py-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-sm font-semibold transition-all">Admin Demo</button>
                      <button type="button" onClick={() => { setLoginEmail("provider@wanderstay.in"); setLoginPass("password123"); }} className="w-full py-2 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20 rounded-lg text-sm font-semibold transition-all">Provider Demo</button>
                      <button type="button" onClick={() => { setLoginEmail("test@wanderstay.in"); setLoginPass("password123"); }} className="w-full py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-sm font-semibold transition-all">Tourist Demo</button>
                    </div>
                  </div>

                  <p className="text-center text-white/40 text-sm mt-4">
                    No account?{" "}
                    <button type="button" onClick={() => openAuthModal("register")} className="text-orange-400 hover:text-orange-300 font-semibold">
                      Create one free
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Full Name</label>
                    <input type="text" placeholder="Riya Chatterjee" value={regName} onChange={(e) => setRegName(e.target.value)} className={inputClass} required data-testid="input-reg-name" />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Email</label>
                    <input type="email" placeholder="you@example.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className={inputClass} required data-testid="input-reg-email" />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Password</label>
                    <div className="relative">
                      <input type={showPass ? "text" : "password"} placeholder="At least 6 characters" value={regPass} onChange={(e) => setRegPass(e.target.value)} className={`${inputClass} pr-11`} required data-testid="input-reg-password" />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Confirm Password</label>
                    <div className="relative">
                      <input type={showConfirm ? "text" : "password"} placeholder="Repeat password" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} className={`${inputClass} pr-11`} required data-testid="input-reg-confirm" />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Account Type</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setRegRole("user")}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all border ${
                          regRole === "user"
                            ? "bg-orange-500/20 border-orange-500 text-orange-400"
                            : "border-white/10 text-white/50 hover:bg-white/5"
                        }`}
                      >
                        Tourist
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegRole("provider")}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all border ${
                          regRole === "provider"
                            ? "bg-orange-500/20 border-orange-500 text-orange-400"
                            : "border-white/10 text-white/50 hover:bg-white/5"
                        }`}
                      >
                        Provider
                      </button>
                    </div>
                  </div>
                  {regError && <p className="text-rose-400 text-sm bg-rose-500/10 px-3 py-2 rounded-lg">{regError}</p>}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                    data-testid="button-register-submit"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                    <span>{isLoading ? "Creating account…" : "Create Account"}</span>
                  </motion.button>
                  <p className="text-center text-white/40 text-sm">
                    Already have an account?{" "}
                    <button type="button" onClick={() => openAuthModal("login")} className="text-orange-400 hover:text-orange-300 font-semibold">
                      Sign in
                    </button>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
