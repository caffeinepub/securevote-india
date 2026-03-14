import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ShieldCheck, Vote } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useVoter } from "../context/VoterContext";

const CANDIDATES = [
  {
    id: "cand_1",
    name: "Rajesh Kumar",
    party: "Bharatiya Janata Party",
    shortName: "BJP",
    symbol: "🪷",
    color: "badge-bjp",
    bgColor: "oklch(0.97 0.03 42)",
    borderColor: "oklch(0.8 0.1 42)",
  },
  {
    id: "cand_2",
    name: "Priya Sharma",
    party: "Indian National Congress",
    shortName: "INC",
    symbol: "✋",
    color: "badge-inc",
    bgColor: "oklch(0.96 0.03 264)",
    borderColor: "oklch(0.78 0.1 264)",
  },
  {
    id: "cand_3",
    name: "Amit Singh",
    party: "Aam Aadmi Party",
    shortName: "AAP",
    symbol: "🧹",
    color: "badge-aap",
    bgColor: "oklch(0.95 0.04 215)",
    borderColor: "oklch(0.75 0.12 215)",
  },
  {
    id: "cand_4",
    name: "Sunita Devi",
    party: "Samajwadi Party",
    shortName: "SP",
    symbol: "🚲",
    color: "badge-sp",
    bgColor: "oklch(0.96 0.04 300)",
    borderColor: "oklch(0.78 0.12 300)",
  },
];

export default function VotingPage() {
  const { currentVoter, castVote } = useVoter();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!currentVoter) {
      navigate({ to: "/" });
      return;
    }
    if (currentVoter.hasVoted) {
      navigate({ to: "/dashboard" });
      return;
    }
    if (!currentVoter.otpVerified || !currentVoter.faceVerified)
      navigate({ to: "/dashboard" });
  }, [currentVoter, navigate]);

  if (!currentVoter) return null;
  const selectedCandidate = CANDIDATES.find((c) => c.id === selected);

  const handleCastVote = () => {
    if (!selected) return;
    castVote(selected);
    setConfirmOpen(false);
    toast.success("Vote cast successfully!");
    navigate({ to: "/vote-confirmed" });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.97 0.008 240)" }}
    >
      <div className="h-1.5 bg-india-stripe w-full" />
      <header className="bg-navy text-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Vote className="w-6 h-6 text-saffron" />
            <div>
              <h1 className="font-bold text-lg">Cast Your Vote</h1>
              <p className="text-white/60 text-xs">
                General Election 2026 — Lok Sabha
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-xs">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            Secure Ballot
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <strong>Instructions:</strong> Select one candidate and click
              &quot;Cast Vote&quot;. Your vote is final.
            </div>
          </motion.div>
          <div className="space-y-4">
            {CANDIDATES.map((candidate, idx) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                data-ocid={`vote.candidate.item.${idx + 1}`}
              >
                <button
                  type="button"
                  onClick={() => setSelected(candidate.id)}
                  className="w-full text-left rounded-xl border-2 p-5 transition-all"
                  style={{
                    background:
                      selected === candidate.id ? candidate.bgColor : "white",
                    borderColor:
                      selected === candidate.id
                        ? candidate.borderColor
                        : "oklch(0.88 0.02 240)",
                    boxShadow:
                      selected === candidate.id
                        ? `0 0 0 3px ${candidate.borderColor}40`
                        : "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                      style={{
                        borderColor:
                          selected === candidate.id
                            ? candidate.borderColor
                            : "oklch(0.7 0 0)",
                      }}
                    >
                      {selected === candidate.id && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: candidate.borderColor }}
                        />
                      )}
                    </div>
                    <div className="text-4xl">{candidate.symbol}</div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground text-lg">
                        {candidate.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {candidate.party}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${candidate.color}`}
                    >
                      {candidate.shortName}
                    </span>
                    {selected === candidate.id && (
                      <CheckCircle2
                        className="w-5 h-5 flex-shrink-0"
                        style={{ color: candidate.borderColor }}
                      />
                    )}
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={!selected}
              className="w-full h-12 bg-saffron hover:bg-orange-600 text-white font-bold text-base"
              data-ocid="vote.submit_button"
            >
              Cast Vote
            </Button>
          </motion.div>
        </div>
      </main>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Vote</DialogTitle>
            <DialogDescription>
              You are about to cast your vote for:
            </DialogDescription>
          </DialogHeader>
          {selectedCandidate && (
            <div className="py-4">
              <div
                className="flex items-center gap-4 p-4 rounded-xl border-2"
                style={{
                  background: selectedCandidate.bgColor,
                  borderColor: selectedCandidate.borderColor,
                }}
              >
                <span className="text-4xl">{selectedCandidate.symbol}</span>
                <div>
                  <p className="font-bold text-lg">{selectedCandidate.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedCandidate.party}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 text-center">
                ⚠️ This action cannot be undone.
              </p>
            </div>
          )}
          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              data-ocid="vote.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCastVote}
              className="bg-saffron hover:bg-orange-600 text-white"
              data-ocid="vote.confirm_button"
            >
              Confirm Vote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
