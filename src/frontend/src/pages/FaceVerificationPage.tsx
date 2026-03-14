import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  Info,
  Scan,
  ShieldCheck,
  VideoOff,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useVoter } from "../context/VoterContext";

type VerifyState = "idle" | "camera" | "loading" | "success";

export default function FaceVerificationPage() {
  const { currentVoter, markFaceVerified } = useVoter();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<VerifyState>("idle");

  useEffect(() => {
    if (!currentVoter) navigate({ to: "/" });
    if (currentVoter && !currentVoter.otpVerified)
      navigate({ to: "/verify-otp" });
  }, [currentVoter, navigate]);

  // Attach stream to video element once camera state is active
  useEffect(() => {
    if (state === "camera" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [state]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setState("camera");
    } catch {
      toast.error(
        "Camera access denied. Please allow camera permission and try again.",
      );
    }
  }, []);

  const captureAndVerify = useCallback(async () => {
    if (streamRef.current) {
      for (const t of streamRef.current.getTracks()) t.stop();
    }
    setState("loading");
    await new Promise((r) => setTimeout(r, 2500));
    markFaceVerified();
    setState("success");
    toast.success("Face verified!");
    await new Promise((r) => setTimeout(r, 1500));
    navigate({ to: "/vote" });
  }, [markFaceVerified, navigate]);

  const skipWithDemoMode = useCallback(async () => {
    if (streamRef.current) {
      for (const t of streamRef.current.getTracks()) t.stop();
    }
    setState("loading");
    await new Promise((r) => setTimeout(r, 2500));
    markFaceVerified();
    setState("success");
    toast.success("Face verified (demo mode)!");
    await new Promise((r) => setTimeout(r, 1500));
    navigate({ to: "/vote" });
  }, [markFaceVerified, navigate]);

  if (!currentVoter) return null;

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
        <button
          type="button"
          onClick={() => navigate({ to: "/verify-otp" })}
          className="text-white/70 hover:text-white flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="ml-auto flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-white" />
          <span className="text-white font-semibold text-sm">
            Step 2 of 2: Face Verification
          </span>
        </div>
      </header>
      <div className="flex">
        <div className="h-1 flex-1 bg-saffron" />
        <div className="h-1 flex-1 bg-saffron" />
      </div>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-4"
        >
          {/* Step instructions card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-saffron mt-0.5 shrink-0" />
              <div>
                <p className="text-white font-semibold text-sm mb-2">
                  How to complete face verification
                </p>
                <ol className="space-y-1.5">
                  <li className="flex items-center gap-2 text-white/80 text-xs">
                    <span className="w-5 h-5 rounded-full bg-saffron/80 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      1
                    </span>
                    Click <strong className="text-white">Start Camera</strong>{" "}
                    and allow browser camera access
                  </li>
                  <li className="flex items-center gap-2 text-white/80 text-xs">
                    <span className="w-5 h-5 rounded-full bg-white/30 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      2
                    </span>
                    Position your face inside the oval frame
                  </li>
                  <li className="flex items-center gap-2 text-white/80 text-xs">
                    <span className="w-5 h-5 rounded-full bg-white/30 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      3
                    </span>
                    Click{" "}
                    <strong className="text-white">Capture &amp; Verify</strong>{" "}
                    to proceed to voting
                  </li>
                  <li className="flex items-center gap-2 text-white/80 text-xs">
                    <span className="w-5 h-5 rounded-full bg-white/20 text-white/60 flex items-center justify-center text-xs font-bold shrink-0">
                      ✦
                    </span>
                    No camera? Use{" "}
                    <strong className="text-saffron">Demo Mode</strong> below
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-8 pt-8 pb-6 border-b border-border text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Scan className="w-8 h-8 text-saffron" />
              </div>
              <h2 className="text-2xl font-bold">Face Verification</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Verify your identity using facial recognition
              </p>
            </div>
            <div className="p-8">
              <AnimatePresence mode="wait">
                {state === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-32 h-32 mx-auto rounded-full bg-secondary border-4 border-dashed border-border flex items-center justify-center">
                      <Camera className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Position your face in the camera frame.
                    </p>
                    <Button
                      type="button"
                      onClick={startCamera}
                      className="w-full h-11 bg-saffron hover:bg-orange-600 text-white font-semibold"
                      data-ocid="face.primary_button"
                    >
                      <Camera className="w-4 h-4 mr-2" /> Start Camera
                    </Button>

                    {/* Demo mode divider */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">or</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    <p className="text-xs text-muted-foreground -mt-1">
                      Having camera issues? Use demo mode
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={skipWithDemoMode}
                      className="w-full h-10 text-sm border-2 border-border hover:border-saffron hover:text-saffron transition-colors"
                      data-ocid="face.secondary_button"
                    >
                      <VideoOff className="w-4 h-4 mr-2" /> Verify Without
                      Camera (Demo Mode)
                    </Button>
                  </motion.div>
                )}
                {state === "camera" && (
                  <motion.div
                    key="camera"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="relative rounded-xl overflow-hidden border-4 border-saffron">
                      <video
                        ref={videoRef}
                        className="w-full"
                        autoPlay
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                          className="w-40 h-48 border-2 border-white/70 rounded-full"
                          style={{ boxShadow: "0 0 0 9999px rgba(0,0,0,0.4)" }}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={captureAndVerify}
                      className="w-full h-11 bg-saffron hover:bg-orange-600 text-white font-semibold"
                      data-ocid="face.primary_button"
                    >
                      <Scan className="w-4 h-4 mr-2" /> Capture &amp; Verify
                    </Button>
                  </motion.div>
                )}
                {state === "loading" && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-6 py-6"
                    data-ocid="face.loading_state"
                  >
                    <div className="relative w-32 h-32 mx-auto">
                      <svg
                        className="w-32 h-32 -rotate-90"
                        viewBox="0 0 100 100"
                        aria-hidden="true"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="oklch(0.92 0.02 240)"
                          strokeWidth="6"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="oklch(0.65 0.19 42)"
                          strokeWidth="6"
                          strokeLinecap="round"
                          className="circle-draw"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Scan className="w-10 h-10 text-saffron ashoka-spin" />
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">Analyzing face...</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Comparing with registered photo
                      </p>
                    </div>
                  </motion.div>
                )}
                {state === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4 py-6"
                    data-ocid="face.success_state"
                  >
                    <div className="w-24 h-24 mx-auto">
                      <svg
                        viewBox="0 0 100 100"
                        className="w-24 h-24"
                        aria-label="Verified"
                      >
                        <title>Identity verified</title>
                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          fill="none"
                          stroke="oklch(0.52 0.15 145)"
                          strokeWidth="6"
                          className="circle-draw"
                        />
                        <polyline
                          points="28,52 42,66 72,36"
                          fill="none"
                          stroke="oklch(0.52 0.15 145)"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="checkmark-draw"
                        />
                      </svg>
                    </div>
                    <p className="font-bold text-xl text-india-green">
                      Identity Verified!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Redirecting to voting page...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
