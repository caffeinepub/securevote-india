import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Vote,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useVoter } from "../context/VoterContext";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    dob: "",
    mobile: "",
    epicId: "",
    aadhaar: "",
  });
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { register } = useVoter();
  const navigate = useNavigate();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      toast.error("Could not access camera.");
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    setFaceImage(canvasRef.current.toDataURL("image/jpeg", 0.8));
    if (streamRef.current) {
      for (const t of streamRef.current.getTracks()) t.stop();
    }
    setCameraActive(false);
    toast.success("Photo captured!");
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.dob) errs.dob = "Date of birth is required";
    if (!/^[0-9]{10}$/.test(form.mobile))
      errs.mobile = "Enter valid 10-digit mobile";
    if (!form.epicId.trim() && !form.aadhaar.trim())
      errs.epicId = "EPIC ID or Aadhaar required";
    if (form.aadhaar && !/^[0-9]{12}$/.test(form.aadhaar))
      errs.aadhaar = "Aadhaar must be 12 digits";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    register({
      name: form.name,
      dob: form.dob,
      mobile: form.mobile,
      epicId: form.epicId || `EPIC${Date.now()}`,
      aadhaar: form.aadhaar,
      faceImage,
    });
    setIsLoading(false);
    toast.success("Registration successful! Please verify your mobile.");
    // Redirect directly to OTP verification after registration
    navigate({ to: "/verify-otp" });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.22 0.14 264) 0%, oklch(0.28 0.16 264) 50%, oklch(0.24 0.12 260) 100%)",
      }}
    >
      <div className="h-1.5 bg-india-stripe w-full" />
      <header className="py-4 px-6 flex items-center gap-4 border-b border-white/10">
        <Link
          to="/"
          className="text-white/70 hover:text-white flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Vote className="w-5 h-5 text-white" />
          <span className="text-white font-semibold text-sm">
            SecureVote India
          </span>
        </div>
      </header>
      <main className="p-6 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-8 pt-8 pb-6 border-b border-border">
              <h2 className="text-2xl font-bold">Voter Registration</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Register as a new voter for General Election 2026
              </p>
              {/* Step indicator */}
              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-full bg-saffron text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <span className="text-xs font-medium text-saffron">
                    Register
                  </span>
                </div>
                <div className="flex-1 h-px bg-border" />
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-full bg-border text-muted-foreground text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <span className="text-xs text-muted-foreground">
                    OTP Verify
                  </span>
                </div>
                <div className="flex-1 h-px bg-border" />
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-full bg-border text-muted-foreground text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Face Verify
                  </span>
                </div>
                <div className="flex-1 h-px bg-border" />
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-full bg-border text-muted-foreground text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <span className="text-xs text-muted-foreground">Vote</span>
                </div>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(
                  [
                    {
                      key: "name",
                      label: "Full Name *",
                      props: {
                        placeholder: "As per official documents",
                        "data-ocid": "register.name_input",
                      },
                    },
                    {
                      key: "dob",
                      label: "Date of Birth *",
                      props: {
                        type: "date",
                        "data-ocid": "register.dob_input",
                      },
                    },
                    {
                      key: "mobile",
                      label: "Mobile Number *",
                      props: {
                        placeholder: "10-digit number",
                        maxLength: 10,
                        "data-ocid": "register.mobile_input",
                      },
                    },
                    {
                      key: "epicId",
                      label: "EPIC ID",
                      props: {
                        placeholder: "e.g. DL1234567890",
                        "data-ocid": "register.epic_input",
                      },
                    },
                    {
                      key: "aadhaar",
                      label: "Aadhaar Number",
                      props: {
                        placeholder: "12-digit",
                        maxLength: 12,
                        "data-ocid": "register.aadhaar_input",
                      },
                    },
                  ] as Array<{
                    key: keyof typeof form;
                    label: string;
                    props: Record<string, string | number>;
                  }>
                ).map(({ key, label, props }) => (
                  <div key={key} className="space-y-1.5">
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      value={form[key]}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [key]: e.target.value }))
                      }
                      className={errors[key] ? "border-destructive" : ""}
                      {...props}
                    />
                    {errors[key] && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors[key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Label>Face Photo</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-4 text-center space-y-3">
                  {faceImage ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-india-green">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium text-sm">
                          Photo captured
                        </span>
                      </div>
                      <img
                        src={faceImage}
                        alt="Captured face"
                        className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-saffron"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFaceImage(null);
                          setCameraActive(false);
                        }}
                      >
                        Retake
                      </Button>
                    </div>
                  ) : cameraActive ? (
                    <div className="space-y-3">
                      <video
                        ref={videoRef}
                        className="w-full max-w-sm mx-auto rounded-lg"
                        autoPlay
                        muted
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      <Button
                        type="button"
                        onClick={capturePhoto}
                        className="bg-saffron hover:bg-orange-600 text-white"
                        data-ocid="register.capture_button"
                      >
                        <Camera className="w-4 h-4 mr-2" /> Capture Photo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2 py-4">
                      <Camera className="w-10 h-10 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Capture your face photo for verification
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={startCamera}
                        data-ocid="register.capture_button"
                      >
                        <Camera className="w-4 h-4 mr-2" /> Open Camera
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full h-11 bg-saffron hover:bg-orange-600 text-white font-semibold"
                data-ocid="register.submit_button"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering...
                  </span>
                ) : (
                  "Register & Continue to OTP Verification →"
                )}
              </Button>
            </div>
          </div>
          <p className="text-center text-white/40 text-xs mt-6">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="hover:text-white/60 underline"
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
