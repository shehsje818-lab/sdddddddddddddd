import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_ENDPOINTS } from "@/config/api";
import { PageLayout } from "@/components/Layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";

interface Application {
  id: string;
  position: string;
  status: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(API_ENDPOINTS.APPLICATIONS_MY, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setApplications(data);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const copyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      owner: 'bg-purple-600',
      main_admin: 'bg-red-600',
      admin: 'bg-orange-600',
      sr_moderator: 'bg-yellow-600',
      moderator: 'bg-blue-600',
      helper: 'bg-green-600',
      junior_helper: 'bg-cyan-600',
      default: 'bg-gray-600'
    };
    return colors[role] || 'bg-gray-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '✓';
      case 'declined':
        return '✕';
      case 'pending':
        return '⏳';
      default:
        return '?';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <PageLayout>
        <div className="container py-12">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="w-24 h-24 border-4 border-primary">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">{user.username}</h1>
                <p className="text-muted-foreground mb-3">{user.email}</p>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <Badge className={getRoleColor(user.role)}>
                    {user.role.replace(/_/g, ' ').toUpperCase()}
                  </Badge>
                  {user.role === 'main_admin' || user.role === 'owner' ? (
                    <Badge variant="secondary" className="border-2 border-primary">
                      Admin Access
                    </Badge>
                  ) : null}
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Joined {formatDate(user.joinedAt)}
                </p>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={copyUserId}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy User ID
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Applications</CardTitle>
            <CardDescription>
              {applications.length === 0 
                ? 'You haven\'t submitted any applications yet.' 
                : `You have ${applications.length} application${applications.length !== 1 ? 's' : ''}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading applications...
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No applications yet</p>
                <Button asChild>
                  {/* Link component would be imported */}
                  Apply
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1 mb-3 md:mb-0">
                      <h3 className="font-semibold text-foreground mb-1 capitalize">
                        {app.position.replace(/-/g, ' ')}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Submitted on {formatDate(app.submittedAt)}
                      </p>
                      {app.reviewedAt && (
                        <p className="text-sm text-muted-foreground">
                          Reviewed on {formatDate(app.reviewedAt)}
                        </p>
                      )}
                      {app.reviewNotes && (
                        <p className="text-sm mt-2 text-muted-foreground italic">
                          Notes: {app.reviewNotes}
                        </p>
                      )}
                    </div>
                    
                    <div className={`px-4 py-2 rounded-full border font-semibold inline-flex gap-2 items-center w-fit ${getStatusColor(app.status)}`}>
                      <span>{getStatusIcon(app.status)}</span>
                      <span className="capitalize">{app.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {applications.filter(a => a.status === 'approved').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {applications.filter(a => a.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
