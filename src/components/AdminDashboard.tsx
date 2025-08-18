import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  LogOut, 
  Users, 
  BarChart3, 
  Shield, 
  Clock,
  CheckCircle,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Candidate, Vote as VoteType } from '@/hooks/useBlockchainVoting';

interface AdminDashboardProps {
  candidates: Candidate[];
  votes: VoteType[];
  totalVotes: number;
  onAddCandidate: (candidate: Omit<Candidate, 'id' | 'voteCount'>) => Promise<Candidate>;
  onDisconnect: () => void;
  getResults: () => any[];
}

export const AdminDashboard = ({ 
  candidates, 
  votes, 
  totalVotes, 
  onAddCandidate, 
  onDisconnect,
  getResults 
}: AdminDashboardProps) => {
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    position: '',
    description: ''
  });
  const { toast } = useToast();

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!candidateForm.name || !candidateForm.position || !candidateForm.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all candidate fields.",
        variant: "destructive"
      });
      return;
    }

    setIsAddingCandidate(true);

    try {
      await onAddCandidate(candidateForm);
      setCandidateForm({ name: '', position: '', description: '' });
      toast({
        title: "Candidate Added Successfully!",
        description: `${candidateForm.name} has been added to the election.`,
      });
    } catch (error) {
      toast({
        title: "Failed to Add Candidate",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAddingCandidate(false);
    }
  };

  const results = getResults();
  const uniqueVoters = new Set(votes.map(vote => vote.voterId)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blockchain-dark rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Election Management</p>
                </div>
              </div>
              <Badge className="bg-blockchain-dark text-white">
                Administrator
              </Badge>
            </div>
            
            <Button variant="outline" onClick={onDisconnect}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card-custom">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Votes</p>
                  <p className="text-2xl font-bold">{totalVotes}</p>
                </div>
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-custom">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Candidates</p>
                  <p className="text-2xl font-bold">{candidates.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-custom">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unique Voters</p>
                  <p className="text-2xl font-bold">{uniqueVoters}</p>
                </div>
                <div className="w-12 h-12 bg-blockchain-dark/20 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-blockchain-dark" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-custom">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Participation</p>
                  <p className="text-2xl font-bold">{totalVotes > 0 ? '100%' : '0%'}</p>
                </div>
                <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="candidates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="candidates" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Candidates
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="candidates" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Add Candidate Form */}
              <Card className="shadow-card-custom">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Add New Candidate
                  </CardTitle>
                  <CardDescription>
                    Add candidates to the current election
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCandidate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="candidateName">Full Name</Label>
                      <Input
                        id="candidateName"
                        type="text"
                        placeholder="Enter candidate's full name"
                        value={candidateForm.name}
                        onChange={(e) => setCandidateForm(prev => ({ ...prev, name: e.target.value }))}
                        className="border-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="candidatePosition">Position</Label>
                      <Input
                        id="candidatePosition"
                        type="text"
                        placeholder="e.g., Class Representative"
                        value={candidateForm.position}
                        onChange={(e) => setCandidateForm(prev => ({ ...prev, position: e.target.value }))}
                        className="border-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="candidateDescription">Description</Label>
                      <Textarea
                        id="candidateDescription"
                        placeholder="Brief description of the candidate's background and goals"
                        value={candidateForm.description}
                        onChange={(e) => setCandidateForm(prev => ({ ...prev, description: e.target.value }))}
                        className="border-primary/20 focus:border-primary"
                        rows={3}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      variant="admin" 
                      size="lg" 
                      className="w-full"
                      disabled={isAddingCandidate}
                    >
                      {isAddingCandidate ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Adding Candidate...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Candidate
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Current Candidates */}
              <Card className="shadow-card-custom">
                <CardHeader>
                  <CardTitle>Current Candidates</CardTitle>
                  <CardDescription>
                    Candidates registered for this election
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {candidates.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No candidates registered yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {candidates.map((candidate) => (
                        <Card key={candidate.id} className="border">
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">{candidate.name}</h3>
                                  <Badge variant="outline" className="mt-1">{candidate.position}</Badge>
                                </div>
                                <Badge className="bg-primary text-primary-foreground">
                                  {candidate.voteCount} votes
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{candidate.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card className="shadow-card-custom">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Election Results
                </CardTitle>
                <CardDescription>
                  Real-time voting results and statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {results.length === 0 ? (
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No candidates available for results.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {results.map((candidate, index) => (
                        <Card key={candidate.id} className="border">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full text-sm font-bold">
                                    #{index + 1}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">{candidate.name}</h3>
                                    <p className="text-sm text-muted-foreground">{candidate.position}</p>
                                  </div>
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
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="shadow-card-custom">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Blockchain Transactions
                </CardTitle>
                <CardDescription>
                  All voting transactions recorded on the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                {votes.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No transactions recorded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {votes.map((vote) => (
                      <Card key={vote.id} className="border">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="font-medium">Vote for {vote.candidateName}</p>
                              <p className="text-sm text-muted-foreground">
                                Voter: {vote.voterId}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Transaction Hash</p>
                              <p className="font-mono text-sm">{vote.transactionHash.slice(0, 20)}...</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Timestamp</p>
                              <p className="text-sm">{new Date(vote.timestamp).toLocaleString()}</p>
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