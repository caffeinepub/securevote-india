import { type ReactNode, createContext, useContext } from "react";
import { type VoterStore, useVoterStore } from "../hooks/useVoterStore";

const VoterContext = createContext<VoterStore | null>(null);

export function VoterProvider({ children }: { children: ReactNode }) {
  const store = useVoterStore();
  return (
    <VoterContext.Provider value={store}>{children}</VoterContext.Provider>
  );
}

export function useVoter(): VoterStore {
  const ctx = useContext(VoterContext);
  if (!ctx) throw new Error("useVoter must be used within VoterProvider");
  return ctx;
}
