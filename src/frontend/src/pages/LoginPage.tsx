import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ShieldCheck, Vote } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useVoter } from "../context/VoterContext";

export default function LoginPage() {
  const [epicId, setEpicId] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [activeTab, setActiveTab] = useState("epic");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useVoter();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const id = activeTab === "epic" ? epicId.trim() : aadhaar.trim();
    if (!id) {
      setError(
        `Please enter your ${activeTab === "epic" ? "EPIC ID" : "Aadhaar Number"}`,
      );
      return;
    }
    setError("");
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const voter = login(id);
    setIsLoading(false);
    if (voter) {
      toast.success(`Welcome back, ${voter.name}!`);
      navigate({ to: "/dashboard" });
    } else {
      setError("Voter not found. Please register or check your ID.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.22 0.14 264) 0%, oklch(0.28 0.16 264) 50%, oklch(0.24 0.12 260) 100%)",
      }}
    >
      <div className="h-1.5 bg-india-stripe w-full" />

      <header className="py-4 px-6 flex items-center gap-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/30">
            <Vote className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">
              Election Commission of India
            </h1>
            <p className="text-white/60 text-xs">भारत निर्वाचन आयोग</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 text-white/70 text-xs">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span>Secure Portal</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-8 pt-8 pb-6 text-center border-b border-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Vote className="w-8 h-8 text-saffron" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                SecureVote India
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Voter Authentication Portal
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                General Election 2026 — Lok Sabha
              </p>
            </div>

            <div className="p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-6">
                  <TabsTrigger
                    value="epic"
                    className="flex-1"
                    data-ocid="login.epic_tab"
                  >
                    EPIC ID
                  </TabsTrigger>
                  <TabsTrigger
                    value="aadhaar"
                    className="flex-1"
                    data-ocid="login.aadhaar_tab"
                  >
                    Aadhaar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="epic">
                  <div className="space-y-2">
                    <Label htmlFor="epic-input">Voter EPIC ID</Label>
                    <Input
                      id="epic-input"
                      placeholder="e.g. DL1234567890"
                      value={epicId}
                      onChange={(e) => setEpicId(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      className="h-11"
                      data-ocid="login.input"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the EPIC ID from your Voter ID card
                    </p>
                    <p className="text-xs text-blue-600 font-medium">
                      Demo: DL1234567890
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="aadhaar">
                  <div className="space-y-2">
                    <Label htmlFor="aadhaar-input">Aadhaar Number</Label>
                    <Input
                      id="aadhaar-input"
                      placeholder="12-digit Aadhaar number"
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      maxLength={12}
                      className="h-11"
                      data-ocid="login.input"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your 12-digit Aadhaar number
                    </p>
                    <p className="text-xs text-blue-600 font-medium">
                      Demo: 123456789012
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              {error && (
                <div
                  className="mt-4 flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive text-sm"
                  data-ocid="login.error_state"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full mt-6 h-11 bg-saffron hover:bg-orange-600 text-white font-semibold"
                data-ocid="login.submit_button"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "Continue →"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                New voter?{" "}
                <Link
                  to="/register"
                  className="text-primary font-semibold hover:underline"
                  data-ocid="login.register_link"
                >
                  Register here
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-white/40 text-xs mt-6">
            © {new Date().getFullYear()} Election Commission of India. All
            rights reserved.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
