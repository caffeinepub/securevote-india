import { useCallback, useState } from "react";

export interface Voter {
  id: string;
  name: string;
  dob: string;
  mobile: string;
  epicId: string;
  aadhaar: string;
  faceImage: string | null;
  hasVoted: boolean;
  votedCandidateId: string | null;
  otpVerified: boolean;
  faceVerified: boolean;
  constituency: string;
}

const VOTERS_KEY = "securevote_voters";
const CURRENT_KEY = "securevote_current";

const DEFAULT_VOTERS: Voter[] = [
  {
    id: "voter_1",
    name: "Arjun Mehta",
    dob: "1990-05-15",
    mobile: "9876543210",
    epicId: "DL1234567890",
    aadhaar: "123456789012",
    faceImage: null,
    hasVoted: false,
    votedCandidateId: null,
    otpVerified: false,
    faceVerified: false,
    constituency: "New Delhi - 01",
  },
];

function loadVoters(): Voter[] {
  try {
    const raw = localStorage.getItem(VOTERS_KEY);
    if (raw) return JSON.parse(raw) as Voter[];
    localStorage.setItem(VOTERS_KEY, JSON.stringify(DEFAULT_VOTERS));
    return DEFAULT_VOTERS;
  } catch {
    return DEFAULT_VOTERS;
  }
}

function saveVoters(voters: Voter[]) {
  localStorage.setItem(VOTERS_KEY, JSON.stringify(voters));
}

export function useVoterStore() {
  const [voters, setVotersState] = useState<Voter[]>(loadVoters);
  const [currentVoterId, setCurrentVoterId] = useState<string | null>(() =>
    localStorage.getItem(CURRENT_KEY),
  );

  const currentVoter = voters.find((v) => v.id === currentVoterId) ?? null;

  const updateVoters = useCallback((updated: Voter[]) => {
    saveVoters(updated);
    setVotersState(updated);
  }, []);

  const login = useCallback((epicOrAadhaar: string): Voter | null => {
    const fresh = loadVoters();
    const voter = fresh.find(
      (v) =>
        v.epicId.toLowerCase() === epicOrAadhaar.toLowerCase() ||
        v.aadhaar === epicOrAadhaar,
    );
    if (voter) {
      localStorage.setItem(CURRENT_KEY, voter.id);
      setCurrentVoterId(voter.id);
      setVotersState(fresh);
    }
    return voter ?? null;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CURRENT_KEY);
    setCurrentVoterId(null);
    // Reset OTP/face verified on logout
    const fresh = loadVoters();
    const updated = fresh.map((v) => ({
      ...v,
      otpVerified: false,
      faceVerified: false,
    }));
    updateVoters(updated);
  }, [updateVoters]);

  const register = useCallback(
    (
      data: Omit<
        Voter,
        | "id"
        | "hasVoted"
        | "votedCandidateId"
        | "otpVerified"
        | "faceVerified"
        | "constituency"
      >,
    ): Voter => {
      const fresh = loadVoters();
      const newVoter: Voter = {
        ...data,
        id: `voter_${Date.now()}`,
        hasVoted: false,
        votedCandidateId: null,
        otpVerified: false,
        faceVerified: false,
        constituency: "General - 01",
      };
      const updated = [...fresh, newVoter];
      updateVoters(updated);
      localStorage.setItem(CURRENT_KEY, newVoter.id);
      setCurrentVoterId(newVoter.id);
      return newVoter;
    },
    [updateVoters],
  );

  const markOtpVerified = useCallback(() => {
    if (!currentVoterId) return;
    const fresh = loadVoters();
    const updated = fresh.map((v) =>
      v.id === currentVoterId ? { ...v, otpVerified: true } : v,
    );
    updateVoters(updated);
    setVotersState(updated);
  }, [currentVoterId, updateVoters]);

  const markFaceVerified = useCallback(() => {
    if (!currentVoterId) return;
    const fresh = loadVoters();
    const updated = fresh.map((v) =>
      v.id === currentVoterId ? { ...v, faceVerified: true } : v,
    );
    updateVoters(updated);
    setVotersState(updated);
  }, [currentVoterId, updateVoters]);

  const castVote = useCallback(
    (candidateId: string) => {
      if (!currentVoterId) return;
      const fresh = loadVoters();
      const updated = fresh.map((v) =>
        v.id === currentVoterId
          ? { ...v, hasVoted: true, votedCandidateId: candidateId }
          : v,
      );
      updateVoters(updated);
      setVotersState(updated);
    },
    [currentVoterId, updateVoters],
  );

  return {
    voters,
    currentVoter,
    currentVoterId,
    login,
    logout,
    register,
    markOtpVerified,
    markFaceVerified,
    castVote,
  };
}

export type VoterStore = ReturnType<typeof useVoterStore>;
