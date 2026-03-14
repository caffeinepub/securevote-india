import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Download, LayoutDashboard, Vote } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useVoter } from "../context/VoterContext";

const CANDIDATES: Record<
  string,
  { name: string; party: string; shortName: string; symbol: string }
> = {
  cand_1: {
    name: "Rajesh Kumar",
    party: "Bharatiya Janata Party",
    shortName: "BJP",
    symbol: "🪷",
  },
  cand_2: {
    name: "Priya Sharma",
    party: "Indian National Congress",
    shortName: "INC",
    symbol: "✋",
  },
  cand_3: {
    name: "Amit Singh",
    party: "Aam Aadmi Party",
    shortName: "AAP",
    symbol: "🧹",
  },
  cand_4: {
    name: "Sunita Devi",
    party: "Samajwadi Party",
    shortName: "SP",
    symbol: "🚲",
  },
};

export default function VoteConfirmedPage() {
  const { currentVoter } = useVoter();
  const navigate = useNavigate();
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentVoter) navigate({ to: "/" });
  }, [currentVoter, navigate]);
  if (!currentVoter) return null;

  const maskedId = `${currentVoter.epicId.slice(0, 4)}${"*".repeat(Math.max(0, currentVoter.epicId.length - 6))}${currentVoter.epicId.slice(-2)}`;
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const receiptNumber = `SVOTE-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const candidate = currentVoter.votedCandidateId
    ? CANDIDATES[currentVoter.votedCandidateId]
    : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        @media print {
          body > * { display: none !important; }
          #printable-receipt { display: block !important; }
          #printable-receipt * { display: revert !important; }
        }
        @keyframes checkDraw {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        .check-animated {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: checkDraw 0.6s ease forwards 0.4s;
        }
      `}</style>

      <div
        className="min-h-screen flex flex-col"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.14 264) 0%, oklch(0.28 0.16 264) 50%, oklch(0.24 0.12 260) 100%)",
        }}
      >
        <div className="h-1.5 bg-india-stripe w-full" />
        <header className="py-4 px-6 flex items-center justify-center border-b border-white/10">
          <div className="flex items-center gap-3">
            <Vote className="w-6 h-6 text-white" />
            <span className="text-white font-bold text-lg">
              SecureVote India
            </span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-lg space-y-4"
          >
            {/* Success badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/40 rounded-full px-5 py-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-green-300 text-sm font-semibold">
                  Vote Successfully Recorded
                </span>
              </div>
            </motion.div>

            {/* Official Receipt Card */}
            <div
              id="printable-receipt"
              ref={receiptRef}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
              data-ocid="confirmed.success_state"
            >
              {/* Tricolor stripe header */}
              <div className="h-2 flex">
                <div className="flex-1 bg-saffron" />
                <div className="flex-1 bg-white border-y border-border" />
                <div className="flex-1 bg-india-green" />
              </div>

              {/* Receipt header */}
              <div className="px-8 pt-6 pb-5 border-b border-border bg-gradient-to-b from-slate-50 to-white">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Vote className="w-5 h-5 text-saffron" />
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Election Commission of India
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-foreground">
                      Official Voting Receipt
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      General Election 2026 — Lok Sabha
                    </p>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
                    className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center"
                  >
                    <svg viewBox="0 0 60 60" className="w-10 h-10">
                      <title>Vote confirmed checkmark</title>
                      <circle
                        cx="30"
                        cy="30"
                        r="26"
                        fill="none"
                        stroke="oklch(0.52 0.15 145)"
                        strokeWidth="3"
                      />
                      <polyline
                        points="16,31 25,40 44,20"
                        fill="none"
                        stroke="oklch(0.52 0.15 145)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="check-animated"
                      />
                    </svg>
                  </motion.div>
                </div>
              </div>

              {/* Receipt body */}
              <div className="px-8 py-6 space-y-4">
                {/* Receipt number */}
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-lg px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">
                    Receipt Number
                  </span>
                  <span className="font-mono text-xs font-bold text-foreground tracking-wider">
                    {receiptNumber}
                  </span>
                </div>

                {/* Voter details */}
                <div className="space-y-0 rounded-xl border border-border overflow-hidden divide-y divide-border">
                  {[
                    { label: "Voter Name", value: currentVoter.name },
                    { label: "EPIC ID", value: maskedId, mono: true },
                    { label: "Constituency", value: currentVoter.constituency },
                    {
                      label: "Election",
                      value: "General Election 2026 — Lok Sabha",
                    },
                    { label: "Date & Time (IST)", value: timestamp },
                  ].map(({ label, value, mono }) => (
                    <div
                      key={label}
                      className="flex justify-between items-center px-4 py-3 bg-white"
                    >
                      <span className="text-sm text-muted-foreground">
                        {label}
                      </span>
                      <span
                        className={`text-sm font-medium text-right max-w-[55%] ${mono ? "font-mono" : ""}`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Candidate voted for */}
                {candidate && (
                  <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
                    <p className="text-xs text-green-700 font-bold uppercase tracking-wider mb-3">
                      Vote Cast For
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{candidate.symbol}</span>
                      <div className="flex-1">
                        <p className="font-bold text-foreground">
                          {candidate.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {candidate.party} ({candidate.shortName})
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-green-600 text-white rounded-full px-3 py-1 text-xs font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        Vote Recorded
                      </div>
                    </div>
                  </div>
                )}

                {/* Status bar */}
                <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">
                    ✓ Vote Confirmed & Secured
                  </span>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Your vote is anonymous and encrypted. Keep this receipt for
                  your records.
                </p>
              </div>

              {/* Actions */}
              <div className="px-8 pb-7 space-y-3">
                <Button
                  type="button"
                  onClick={handlePrint}
                  variant="outline"
                  className="w-full h-11 border-2 font-semibold gap-2"
                  data-ocid="confirmed.print_button"
                >
                  <Download className="w-4 h-4" />
                  Print / Download Receipt
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="w-full h-11 bg-saffron hover:bg-orange-600 text-white font-semibold gap-2"
                  data-ocid="confirmed.dashboard_button"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Return to Dashboard
                </Button>
              </div>

              {/* Tricolor footer stripe */}
              <div className="h-1.5 flex">
                <div className="flex-1 bg-saffron" />
                <div className="flex-1 bg-white border border-border" />
                <div className="flex-1 bg-india-green" />
              </div>
            </div>
          </motion.div>
        </main>

        <footer className="py-4 text-center text-white/40 text-xs">
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
    </>
  );
}
