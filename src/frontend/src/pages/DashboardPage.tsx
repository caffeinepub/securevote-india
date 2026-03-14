import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Info,
  LayoutDashboard,
  LogOut,
  MapPin,
  Shield,
  ShieldCheck,
  Smartphone,
  User,
  Vote,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useVoter } from "../context/VoterContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", id: 1 },
  { icon: User, label: "My Profile", path: "/dashboard", id: 2 },
  { icon: Info, label: "Election Info", path: "/dashboard", id: 3 },
  { icon: HelpCircle, label: "Help & Support", path: "/dashboard", id: 4 },
];

export default function DashboardPage() {
  const { currentVoter, logout } = useVoter();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentVoter) navigate({ to: "/" });
  }, [currentVoter, navigate]);
  if (!currentVoter) return null;

  const handleProceedToVote = () => {
    if (currentVoter.hasVoted) {
      toast.info("You have already cast your vote.");
      return;
    }
    navigate({ to: "/vote" });
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
    toast.success("Logged out.");
  };

  const canVote = currentVoter.otpVerified && currentVoter.faceVerified;
  const needsOtp = !currentVoter.otpVerified;
  const needsFace = currentVoter.otpVerified && !currentVoter.faceVerified;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-1.5 bg-india-stripe w-full" />
      <div className="flex flex-1">
        <aside className="w-64 bg-navy flex-shrink-0 flex flex-col min-h-screen">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Vote className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">SecureVote</p>
                <p className="text-white/50 text-xs">India 2026</p>
              </div>
            </div>
          </div>
          <div className="px-4 py-4 border-b border-white/10">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-white font-semibold text-sm truncate">
                {currentVoter.name}
              </p>
              <p className="text-white/60 text-xs mt-0.5">
                {currentVoter.epicId}
              </p>
              {currentVoter.hasVoted && (
                <Badge className="mt-2 text-xs bg-green-600 text-white">
                  Vote Cast ✓
                </Badge>
              )}
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item, idx) => (
              <Link
                key={item.id}
                to={item.path as "/dashboard"}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm"
                data-ocid={`dashboard.sidebar_link.${idx + 1}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors text-sm w-full"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 bg-background">
          <header className="bg-white border-b border-border px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Voter Dashboard</h1>
              <p className="text-muted-foreground text-xs">
                General Election 2026 — Lok Sabha
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-4 h-4 text-green-500" />
              Secure Session
            </div>
          </header>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="govt-card p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-saffron" />
                  <h3 className="font-semibold">Voter Information</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Full Name", value: currentVoter.name },
                    {
                      label: "EPIC ID",
                      value: currentVoter.epicId,
                      mono: true,
                    },
                    {
                      label: "Constituency",
                      value: currentVoter.constituency,
                      icon: <MapPin className="w-3 h-3" />,
                    },
                    { label: "Date of Birth", value: currentVoter.dob },
                  ].map(({ label, value, mono, icon }) => (
                    <div
                      key={label}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-muted-foreground">
                        {label}
                      </span>
                      <span
                        className={`text-sm font-medium flex items-center gap-1 ${mono ? "font-mono" : ""}`}
                      >
                        {icon}
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="govt-card p-6"
                data-ocid="dashboard.voting_status_card"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Vote className="w-5 h-5 text-saffron" />
                  <h3 className="font-semibold">Voting Status</h3>
                </div>
                <div
                  className="flex items-center gap-3 p-4 rounded-lg"
                  style={{
                    background: currentVoter.hasVoted
                      ? "oklch(0.95 0.05 145)"
                      : "oklch(0.95 0.03 264)",
                  }}
                >
                  {currentVoter.hasVoted ? (
                    <>
                      <CheckCircle2 className="w-8 h-8 text-india-green" />
                      <div>
                        <p className="font-semibold text-india-green">
                          Vote Cast
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Your vote has been recorded
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-semibold text-primary">
                          Not Voted Yet
                        </p>
                        <p className="text-xs text-muted-foreground">
                          You haven&apos;t cast your vote
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="govt-card p-6"
                data-ocid="dashboard.election_info_card"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-saffron" />
                  <h3 className="font-semibold">Election Information</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Election
                    </span>
                    <span className="text-sm font-semibold">
                      General Election 2026
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <span className="text-sm font-medium">Lok Sabha</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      ● Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Mar 15, 2026
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="govt-card p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-saffron" />
                  <h3 className="font-semibold">Security Verification</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "OTP Verified", ok: currentVoter.otpVerified },
                    { label: "Face Verified", ok: currentVoter.faceVerified },
                  ].map(({ label, ok }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                    >
                      <span className="text-sm font-medium">{label}</span>
                      {ok ? (
                        <CheckCircle2 className="w-5 h-5 text-india-green" />
                      ) : (
                        <XCircle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Voting action card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-border shadow-govt overflow-hidden"
            >
              {/* Top tricolor accent */}
              <div className="h-1 flex">
                <div className="flex-1 bg-saffron" />
                <div className="flex-1 bg-white border-x border-border" />
                <div className="flex-1 bg-india-green" />
              </div>

              <div className="p-6">
                {currentVoter.hasVoted ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-india-green" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Vote Already Cast
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          You have exercised your right to vote.
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      disabled
                      className="sm:ml-auto bg-gray-100 text-gray-400 font-semibold px-8 h-11"
                      data-ocid="dashboard.proceed_button"
                    >
                      Vote Already Cast
                    </Button>
                  </div>
                ) : needsOtp ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-saffron" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Identity Verification Required
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Complete OTP verification to proceed to voting.
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => navigate({ to: "/verify-otp" })}
                      className="sm:ml-auto bg-saffron hover:bg-orange-600 text-white font-semibold px-6 h-11 gap-2 flex-shrink-0"
                      data-ocid="dashboard.proceed_button"
                    >
                      <Smartphone className="w-4 h-4" />
                      Start OTP Verification
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                ) : needsFace ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Face Verification Required
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          OTP verified ✓ — Now complete face verification.
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => navigate({ to: "/verify-face" })}
                      className="sm:ml-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 h-11 gap-2 flex-shrink-0"
                      data-ocid="dashboard.proceed_button"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Start Face Verification
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                ) : canVote ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Vote className="w-6 h-6 text-india-green" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Ready to Cast Your Vote!
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          OTP ✓ &nbsp; Face ID ✓ &nbsp; — All verifications
                          complete.
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={handleProceedToVote}
                      className="sm:ml-auto bg-saffron hover:bg-orange-600 text-white font-semibold px-8 h-11 gap-2 flex-shrink-0"
                      data-ocid="dashboard.proceed_button"
                    >
                      Proceed to Vote
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
      <footer className="bg-navy text-white/40 text-center py-3 text-xs">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="hover:text-white/60 underline"
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
