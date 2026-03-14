import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { VoterProvider } from "./context/VoterContext";
import DashboardPage from "./pages/DashboardPage";
import FaceVerificationPage from "./pages/FaceVerificationPage";
import LoginPage from "./pages/LoginPage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import RegisterPage from "./pages/RegisterPage";
import VoteConfirmedPage from "./pages/VoteConfirmedPage";
import VotingPage from "./pages/VotingPage";

const rootRoute = createRootRoute({
  component: () => (
    <VoterProvider>
      <Outlet />
      <Toaster position="top-right" richColors />
    </VoterProvider>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const verifyOtpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verify-otp",
  component: OtpVerificationPage,
});

const verifyFaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verify-face",
  component: FaceVerificationPage,
});

const voteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vote",
  component: VotingPage,
});

const voteConfirmedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vote-confirmed",
  component: VoteConfirmedPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  dashboardRoute,
  verifyOtpRoute,
  verifyFaceRoute,
  voteRoute,
  voteConfirmedRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
