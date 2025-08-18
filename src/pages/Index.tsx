import { useState } from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { VotingDashboard } from '@/components/VotingDashboard';
import { AdminDashboard } from '@/components/AdminDashboard';
import { useBlockchainVoting } from '@/hooks/useBlockchainVoting';

const Index = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  
  const {
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
  } = useBlockchainVoting();

  const handleConnect = async (studentData: { name: string; email: string; studentId: string }) => {
    setIsConnecting(true);
    try {
      await connectWallet(studentData);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAdminLogin = async (password: string) => {
    return await loginAsAdmin(password);
  };

  if (!isConnected) {
    return (
      <WalletConnection 
        onConnect={handleConnect}
        onAdminLogin={handleAdminLogin}
        isConnecting={isConnecting}
      />
    );
  }

  if (isAdmin) {
    return (
      <AdminDashboard
        candidates={candidates}
        votes={votes}
        totalVotes={totalVotes}
        onAddCandidate={addCandidate}
        onDisconnect={disconnectWallet}
        getResults={getResults}
      />
    );
  }

  if (currentStudent) {
    return (
      <VotingDashboard
        student={currentStudent}
        candidates={candidates}
        votes={votes}
        totalVotes={totalVotes}
        onVote={castVote}
        onDisconnect={disconnectWallet}
        getResults={getResults}
      />
    );
  }

  return null;
};

export default Index;