import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Info,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useVoter } from "../context/VoterContext";

export default function OtpVerificationPage() {
  const { currentVoter, markOtpVerified } = useVoter();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const autoSentRef = useRef(false);

  useEffect(() => {
    if (!currentVoter) navigate({ to: "/" });
  }, [currentVoter, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const maskedMobile = currentVoter
    ? currentVoter.mobile.replace(/^(.{6})/, "XXXXXX")
    : "";

  const sendOtp = useCallback(async () => {
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSending(false);
    setOtpSent(true);
    setCountdown(30);
    toast.success(`OTP sent to ${maskedMobile}`);
  }, [maskedMobile]);

  // Auto-send OTP on mount (once only)
  useEffect(() => {
    if (currentVoter && !autoSentRef.current) {
      autoSentRef.current = true;
      sendOtp();
    }
  }, [currentVoter, sendOtp]);

  const verifyOtp = async () => {
    if (otp.length < 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    setError("");
    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsVerifying(false);
    if (otp === "123456") {
      markOtpVerified();
      toast.success("OTP verified!");
      navigate({ to: "/verify-face" });
    } else setError("Invalid OTP. Demo OTP: 123456");
  };

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
          onClick={() => navigate({ to: "/dashboard" })}
          className="text-white/70 hover:text-white flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="ml-auto flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-white" />
          <span className="text-white font-semibold text-sm">
            Step 1 of 2: Mobile Verification
          </span>
        </div>
      </header>
      <div className="flex">
        <div className="h-1 flex-1 bg-saffron" />
        <div className="h-1 flex-1 bg-white/20" />
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
                  How to verify your mobile
                </p>
                <ol className="space-y-1.5">
                  <li className="flex items-center gap-2 text-white/80 text-xs">
                    <span className="w-5 h-5 rounded-full bg-saffron/80 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      1
                    </span>
                    OTP is automatically sent to your registered mobile
                  </li>
                  <li className="flex items-center gap-2 text-white/80 text-xs">
                    <span className="w-5 h-5 rounded-full bg-white/30 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      2
                    </span>
                    Enter the 6-digit OTP in the boxes below
                  </li>
                  <li className="flex items-center gap-2 text-white/80 text-xs">
                    <span className="w-5 h-5 rounded-full bg-white/30 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      3
                    </span>
                    Click <strong className="text-white">Verify OTP</strong> to
                    proceed to face verification
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-8 pt-8 pb-6 border-b border-border text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-saffron" />
              </div>
              <h2 className="text-2xl font-bold">Mobile Verification</h2>
              <p className="text-muted-foreground text-sm mt-1">
                OTP will be sent to{" "}
                <span className="font-mono font-semibold text-foreground">
                  {maskedMobile}
                </span>
              </p>
            </div>
            <div className="p-8 space-y-6">
              {isSending && !otpSent ? (
                <div className="text-center space-y-4 py-4">
                  <div className="flex justify-center">
                    <span className="w-8 h-8 border-2 border-saffron/30 border-t-saffron rounded-full animate-spin" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sending OTP to {maskedMobile}...
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div
                    className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-700 text-sm"
                    data-ocid="otp.success_state"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    OTP sent to {maskedMobile}
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-center">
                      Enter 6-digit OTP
                    </p>
                    <div className="flex justify-center" data-ocid="otp.input">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup>
                          {[0, 1, 2, 3, 4, 5].map((i) => (
                            <InputOTPSlot key={i} index={i} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      Demo OTP:{" "}
                      <span className="font-mono font-bold text-primary">
                        123456
                      </span>
                    </p>
                  </div>
                  {error && (
                    <div
                      className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive text-sm"
                      data-ocid="otp.error_state"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
                  <Button
                    type="button"
                    onClick={verifyOtp}
                    disabled={isVerifying || otp.length < 6}
                    className="w-full h-11 bg-saffron hover:bg-orange-600 text-white font-semibold"
                    data-ocid="otp.verify_button"
                  >
                    {isVerifying ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      "Verify OTP →"
                    )}
                  </Button>
                  {countdown > 0 ? (
                    <p className="text-center text-xs text-muted-foreground">
                      Resend in {countdown}s
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={sendOtp}
                      className="w-full text-center text-xs text-primary hover:underline"
                      data-ocid="otp.send_button"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
