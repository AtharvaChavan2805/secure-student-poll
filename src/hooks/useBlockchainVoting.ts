import { useState, useEffect } from 'react';

export interface Candidate {
  id: string;
  name: string;
  position: string;
  description: string;
  voteCount: number;
}

export interface Vote {
  id: string;
  candidateId: string;
  candidateName: string;
  voterId: string;
  timestamp: number;
  blockHash: string;
  transactionHash: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  hasVoted: boolean;
}

export const useBlockchainVoting = () => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Simulate blockchain connection
  const connectWallet = async (studentData: { name: string; email: string; studentId: string }) => {
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const walletAddress = `0x${Math.random().toString(16).slice(2, 42)}`;
    const student: Student = {
      id: studentData.studentId,
      name: studentData.name,
      email: studentData.email,
      walletAddress,
      hasVoted: votes.some(vote => vote.voterId === studentData.studentId)
    };
    
    setCurrentStudent(student);
    setIsConnected(true);
    return student;
  };

  const disconnectWallet = () => {
    setCurrentStudent(null);
    setIsConnected(false);
    setIsAdmin(false);
  };

  const loginAsAdmin = async (password: string) => {
    if (password === 'admin123') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAdmin(true);
      setIsConnected(true);
      return true;
    }
    return false;
  };

  const addCandidate = async (candidateData: Omit<Candidate, 'id' | 'voteCount'>) => {
    const newCandidate: Candidate = {
      id: `candidate_${Date.now()}`,
      ...candidateData,
      voteCount: 0
    };
    setCandidates(prev => [...prev, newCandidate]);
    return newCandidate;
  };

  const castVote = async (candidateId: string) => {
    if (!currentStudent || currentStudent.hasVoted) {
      throw new Error('Unauthorized or already voted');
    }

    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) {
      throw new Error('Candidate not found');
    }

    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    const vote: Vote = {
      id: `vote_${Date.now()}`,
      candidateId,
      candidateName: candidate.name,
      voterId: currentStudent.id,
      timestamp: Date.now(),
      blockHash: `0x${Math.random().toString(16).slice(2, 66)}`,
      transactionHash: `0x${Math.random().toString(16).slice(2, 66)}`
    };

    setVotes(prev => [...prev, vote]);
    setCandidates(prev => prev.map(c => 
      c.id === candidateId 
        ? { ...c, voteCount: c.voteCount + 1 }
        : c
    ));
    setCurrentStudent(prev => prev ? { ...prev, hasVoted: true } : null);
    
    return vote;
  };

  // Initialize with some sample candidates
  useEffect(() => {
    setCandidates([
      {
        id: 'candidate_1',
        name: 'Alice Johnson',
        position: 'Class Representative',
        description: 'Experienced leader focused on student welfare and academic excellence.',
        voteCount: 0
      },
      {
        id: 'candidate_2',
        name: 'Bob Smith',
        position: 'Class Representative',
        description: 'Innovative thinker committed to improving campus facilities and events.',
        voteCount: 0
      }
    ]);
  }, []);

  const totalVotes = votes.length;
  const getResults = () => {
    return candidates.map(candidate => ({
      ...candidate,
      percentage: totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0
    }));
  };

  return {
    currentStudent,
    candidates,
    votes,
    isConnected,
    isAdmin,
    totalVotes,
    connectWallet,
    disconnectWallet,
    loginAsAdmin,
    addCandidate,
    castVote,
    getResults
  };
};