import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Shield, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
interface WalletConnectionProps {
  onConnect: (studentData: {
    name: string;
    email: string;
    studentId: string;
  }) => Promise<any>;
  onAdminLogin: (password: string) => Promise<boolean>;
  isConnecting?: boolean;
}
export const WalletConnection = ({
  onConnect,
  onAdminLogin,
  isConnecting
}: WalletConnectionProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: ''
  });
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const {
    toast
  } = useToast();
  const handleStudentConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.studentId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to continue.",
        variant: "destructive"
      });
      return;
    }
    try {
      await onConnect(formData);
      toast({
        title: "Wallet Connected Successfully!",
        description: "You can now participate in the election."
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the blockchain. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onAdminLogin(adminPassword);
    if (success) {
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the election management dashboard."
      });
    } else {
      toast({
        title: "Invalid Credentials",
        description: "Please check your admin password and try again.",
        variant: "destructive"
      });
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-blockchain">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">Voting Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Secure, Transparent, Decentralized Elections
            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-2 mb-6">
          <Button variant={!isAdminMode ? "default" : "outline"} size="sm" onClick={() => setIsAdminMode(false)} className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Student
          </Button>
          <Button variant={isAdminMode ? "admin" : "outline"} size="sm" onClick={() => setIsAdminMode(true)} className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Admin
          </Button>
        </div>

        {!isAdminMode ? <Card className="shadow-card-custom bg-gradient-card border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                Student Login
              </CardTitle>
              <CardDescription>
                Connect your student account to participate in elections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStudentConnect} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={e => setFormData(prev => ({
                ...prev,
                name: e.target.value
              }))} className="border-primary/20 focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">College Email</Label>
                  <Input id="email" type="email" placeholder="your.email@college.edu" value={formData.email} onChange={e => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))} className="border-primary/20 focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">Enrollment ID</Label>
                  <Input id="studentId" type="text" placeholder="STU123456" value={formData.studentId} onChange={e => setFormData(prev => ({
                ...prev,
                studentId: e.target.value
              }))} className="border-primary/20 focus:border-primary" />
                </div>
                <Button type="submit" variant="connect" size="lg" className="w-full" disabled={isConnecting}>
                  {isConnecting ? <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Connecting to Blockchain...
                    </> : <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </>}
                </Button>
              </form>
            </CardContent>
          </Card> : <Card className="shadow-card-custom bg-gradient-card border-blockchain-dark/20">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Shield className="w-5 h-5 text-blockchain-dark" />
                Admin Access
              </CardTitle>
              <CardDescription>
                Manage candidates and monitor election progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Admin Password</Label>
                  <Input id="adminPassword" type="password" placeholder="Enter admin password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="border-blockchain-dark/20 focus:border-blockchain-dark" />
                  <p className="text-xs text-muted-foreground">
                    Demo password: <Badge variant="secondary" className="text-xs">admin123</Badge>
                  </p>
                </div>
                <Button type="submit" variant="admin" size="lg" className="w-full">
                  <Shield className="w-4 h-4 mr-2" />
                  Access Admin Panel
                </Button>
              </form>
            </CardContent>
          </Card>}

        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
            Blockchain Network: Active
          </p>
        </div>
      </div>
    </div>;
};