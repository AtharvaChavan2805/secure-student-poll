import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Vote, 
  LogOut, 
  Users, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Wallet,
  Trophy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Student, Candidate, Vote as VoteType } from '@/hooks/useBlockchainVoting';

interface VotingDashboardProps {
  student: Student;
  candidates: Candidate[];
  votes: VoteType[];
  totalVotes: number;
  onVote: (candidateId: string) => Promise<VoteType>;
  onDisconnect: () => void;
  getResults: () => any[];
}

export const VotingDashboard = ({ 
  student, 
  candidates, 
  votes, 
  totalVotes, 
  onVote, 
  onDisconnect,
  getResults 
}: VotingDashboardProps) => {
  const [isVoting, setIsVoting] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const { toast } = useToast();

  const handleVote = async (candidateId: string) => {
    if (student.hasVoted) {
      toast({
        title: "Already Voted",
        description: "You have already cast your vote in this election.",
        variant: "destructive"
      });
      return;
    }

    setIsVoting(true);
    setSelectedCandidate(candidateId);

    try {
      const vote = await onVote(candidateId);
      toast({
        title: "Vote Cast Successfully!",
        description: `Your vote for ${vote.candidateName} has been recorded on the blockchain.`,
      });
    } catch (error) {
      toast({
        title: "Voting Failed",
        description: "Failed to cast your vote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVoting(false);
      setSelectedCandidate(null);
    }
  };

  const results = getResults();
  const userVote = votes.find(vote => vote.voterId === student.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Vote className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">BlockVote</h1>
                  <p className="text-sm text-muted-foreground">College Elections 2024</p>
                </div>
              </div>
              <Badge variant={student.hasVoted ? "default" : "secondary"} className="bg-success text-success-foreground">
                {student.hasVoted ? "Voted" : "Eligible"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Wallet className="w-3 h-3" />
                  {student.walletAddress.slice(0, 6)}...{student.walletAddress.slice(-4)}
                </p>
              </div>
              <Button variant="outline" onClick={onDisconnect}>
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="vote" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vote" className="flex items-center gap-2">
              <Vote className="w-4 h-4" />
              Cast Vote
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Live Results
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Blockchain History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vote" className="space-y-6">
            <Card className="shadow-card-custom">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Class Representative Election
                </CardTitle>
                <CardDescription>
                  Select your preferred candidate for Class Representative. You can only vote once.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {student.hasVoted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Vote Successfully Cast!</h3>
                    <p className="text-muted-foreground mb-4">
                      You voted for: <span className="font-medium text-foreground">{userVote?.candidateName}</span>
                    </p>
                    <Badge className="bg-success text-success-foreground">
                      Transaction: {userVote?.transactionHash.slice(0, 10)}...
                    </Badge>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {candidates.map((candidate) => (
                      <Card key={candidate.id} className="border-2 hover:border-primary/50 transition-colors">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold">{candidate.name}</h3>
                              <Badge variant="outline" className="mt-1">{candidate.position}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{candidate.description}</p>
                            <Button 
                              variant="vote" 
                              size="lg" 
                              className="w-full"
                              onClick={() => handleVote(candidate.id)}
                              disabled={isVoting}
                            >
                              {isVoting && selectedCandidate === candidate.id ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                  Casting Vote...
                                </>
                              ) : (
                                <>
                                  <Vote className="w-4 h-4 mr-2" />
                                  Vote for {candidate.name}
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card className="shadow-card-custom">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Live Election Results
                </CardTitle>
                <CardDescription>
                  Real-time results updated on every blockchain transaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-4 bg-accent/50 rounded-lg">
                    <p className="text-2xl font-bold">{totalVotes}</p>
                    <p className="text-sm text-muted-foreground">Total Votes Cast</p>
                  </div>
                  
                  <div className="space-y-4">
                    {results.map((candidate) => (
                      <Card key={candidate.id} className="border">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold">{candidate.name}</h3>
                                <p className="text-sm text-muted-foreground">{candidate.position}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold">{candidate.voteCount}</p>
                                <p className="text-sm text-muted-foreground">
                                  {candidate.percentage.toFixed(1)}%
                                </p>
                              </div>
                            </div>
                            <Progress value={candidate.percentage} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="shadow-card-custom">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Blockchain Transaction History
                </CardTitle>
                <CardDescription>
                  All votes recorded on the blockchain with transaction hashes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {votes.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No votes have been cast yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {votes.map((vote) => (
                      <Card key={vote.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Vote for {vote.candidateName}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(vote.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="mb-1">
                                TX: {vote.transactionHash.slice(0, 10)}...
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                Block: {vote.blockHash.slice(0, 10)}...
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};