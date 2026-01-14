import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_ENDPOINTS } from "@/config/api";
import { PageLayout } from "@/components/Layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Clock, UserCog } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Application {
  _id: string;
  position: string;
  status: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
  userId: {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    discordId: string;
  };
  formData: Record<string, any>;
}

interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  discordId: string;
  role: string;
  joinedAt: string;
}

interface DashboardStats {
  totalUsers: number;
  usersByRole: Record<string, number>;
}

const AdminPortal = () => {
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [positionFilter, setPositionFilter] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewingStatus, setReviewingStatus] = useState<'approved' | 'declined' | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [userPage, setUserPage] = useState(1);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  // Database collections state
  const [dbCollections, setDbCollections] = useState<Record<string, any[]>>({
    users: [],
    applications: [],
    auditLogs: []
  });
  const [dbLoading, setDbLoading] = useState(false);
  const [activeDbTab, setActiveDbTab] = useState<'users' | 'applications' | 'auditLogs'>('users');
  const [editDocument, setEditDocument] = useState<any>(null);
  const [editDocumentText, setEditDocumentText] = useState<string>('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<string>('');
  const [savingDocument, setSavingDocument] = useState(false);

  const roles = ['default', 'admin', 'main_admin', 'owner'];
  const roleLabels: Record<string, string> = {
    'default': 'User (Normal)',
    'admin': 'Admin',
    'main_admin': 'Main Admin',
    'owner': 'Owner'
  };

  useEffect(() => {
    if (user && (user.role === 'main_admin' || user.role === 'owner')) {
      fetchApplications();
      fetchStats();
    }
  }, [statusFilter, positionFilter, user]);

  useEffect(() => {
    if (user && (user.role === 'main_admin' || user.role === 'owner')) {
      fetchUsers(userPage);
    }
  }, [roleFilter, userPage, user]);

  useEffect(() => {
    if (user?.role === 'main_admin' || user?.role === 'owner') {
      fetchDatabaseCollections();
    }
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (positionFilter) params.append('position', positionFilter);

      const response = await fetch(
        `${API_ENDPOINTS.APPLICATIONS_ALL}?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(API_ENDPOINTS.ADMIN_STATS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchDatabaseCollections = async () => {
    setDbLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const [usersRes, appsRes, logsRes] = await Promise.all([
        fetch(`${API_ENDPOINTS.ADMIN_USERS}?limit=100`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_ENDPOINTS.APPLICATIONS_ALL}?limit=100`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_ENDPOINTS.ADMIN_AUDIT_LOGS}?limit=100`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const usersData = await usersRes.json();
      const appsData = await appsRes.json();
      const logsData = await logsRes.json();

      setDbCollections({
        users: usersData.users || [],
        applications: appsData.applications || [],
        auditLogs: logsData.logs || []
      });
    } catch (err) {
      console.error('Failed to fetch database collections:', err);
    } finally {
      setDbLoading(false);
    }
  };

  const handleOpenDocument = (document: any, collection: string) => {
    setEditDocument(document);
    setEditingCollection(collection);
    setEditDocumentText(JSON.stringify(document, null, 2));
    setEditDialogOpen(true);
  };

  const handleSaveDocument = async () => {
    if (!editDocument || !editingCollection) return;

    setSavingDocument(true);
    try {
      const token = localStorage.getItem('authToken');
      const updatedData = JSON.parse(editDocumentText);
      
      const response = await fetch(
        API_ENDPOINTS.ADMIN_DB_UPDATE(editingCollection, editDocument._id),
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedData)
        }
      );

      if (response.ok) {
        fetchDatabaseCollections();
        setEditDialogOpen(false);
        setEditDocument(null);
        setEditDocumentText('');
      } else {
        alert('Failed to save document');
      }
    } catch (err) {
      console.error('Failed to save document:', err);
      alert('Invalid JSON format');
    } finally {
      setSavingDocument(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!editDocument || !editingCollection) return;
    
    if (!confirm(`Are you sure you want to delete this ${editingCollection} document?`)) {
      return;
    }

    setSavingDocument(true);
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(
        API_ENDPOINTS.ADMIN_DB_DELETE(editingCollection, editDocument._id),
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        fetchDatabaseCollections();
        setEditDialogOpen(false);
        setEditDocument(null);
        setEditDocumentText('');
      } else {
        alert('Failed to delete document');
      }
    } catch (err) {
      console.error('Failed to delete document:', err);
      alert('Error deleting document');
    } finally {
      setSavingDocument(false);
    }
  };

  const fetchUsers = async (page: number = 1) => {
    setUsersLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '20');
      if (roleFilter) params.append('role', roleFilter);

      const response = await fetch(
        `${API_ENDPOINTS.ADMIN_USERS}?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleUpdateUserRole = async () => {
    if (!selectedUser || !selectedRole) return;

    setUpdatingRoleId(selectedUser._id);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        API_ENDPOINTS.ADMIN_USER_ROLE(selectedUser._id),
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ role: selectedRole })
        }
      );

      if (response.ok) {
        setUsers(users.map(u => u._id === selectedUser._id ? { ...u, role: selectedRole } : u));
        setRoleDialogOpen(false);
        setSelectedUser(null);
        setSelectedRole('');
        fetchStats();
      } else {
        console.error('Failed to update role');
      }
    } catch (err) {
      console.error('Failed to update user role:', err);
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleReviewApplication = async (status: 'approved' | 'declined') => {
    if (!selectedApp) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        API_ENDPOINTS.APPLICATIONS_REVIEW(selectedApp._id),
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status,
            notes: reviewNotes
          })
        }
      );

      if (response.ok) {
        setReviewDialogOpen(false);
        setSelectedApp(null);
        setReviewNotes('');
        setReviewingStatus(null);
        fetchApplications();
      }
    } catch (err) {
      console.error('Failed to review application:', err);
    }
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
        return <Check className="w-4 h-4" />;
      case 'declined':
        return <X className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
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

  if (authLoading) {
    return (
      <PageLayout>
        <div className="container py-12 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </PageLayout>
    );
  }

  if (!user || (user.role !== 'main_admin' && user.role !== 'owner')) {
    return (
      <PageLayout>
        <div className="container py-12">
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Portal</h1>
        <p className="text-muted-foreground mb-8">Manage applications, users, and database</p>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={statusFilter || 'all'} onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="declined">Declined</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Position</label>
                    <Select value={positionFilter || 'all'} onValueChange={(value) => setPositionFilter(value === 'all' ? '' : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All positions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All positions</SelectItem>
                        <SelectItem value="junior-helper">Junior Helper</SelectItem>
                        <SelectItem value="dungeon-carrier">Dungeon Carrier</SelectItem>
                        <SelectItem value="slayer-carrier">Slayer Carrier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Applications</CardTitle>
                <CardDescription>
                  {loading ? 'Loading...' : `${applications.length} application${applications.length !== 1 ? 's' : ''}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading applications...
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No applications found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div
                        key={app._id}
                        className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex-1 mb-3 md:mb-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                              {app.userId.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {app.userId.username}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {app.userId.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className="capitalize">
                              {app.position.replace(/-/g, ' ')}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {formatDate(app.submittedAt)}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
                          <div className={`px-3 py-1 rounded-full border font-semibold inline-flex gap-2 items-center w-fit ${getStatusColor(app.status)}`}>
                            {getStatusIcon(app.status)}
                            <span className="capitalize text-sm">{app.status}</span>
                          </div>
                          
                          {app.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedApp(app);
                                setReviewDialogOpen(true);
                              }}
                            >
                              Review
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Role</label>
                    <Select value={roleFilter || 'all'} onValueChange={(value) => {
                      setRoleFilter(value === 'all' ? '' : value);
                      setUserPage(1);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="All roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All roles</SelectItem>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {roleLabels[role]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Users Database</CardTitle>
                <CardDescription>
                  {usersLoading ? 'Loading...' : `Displaying ${users.length} users`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading users...
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((u) => (
                          <TableRow key={u._id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {u.avatar ? (
                                  <img 
                                    src={u.avatar} 
                                    alt={u.username}
                                    className="w-8 h-8 rounded-full"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                                    {u.username.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <span className="font-medium">{u.username}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {u.email}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {roleLabels[u.role]}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(u.joinedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </TableCell>
                            <TableCell>
                              <Dialog open={roleDialogOpen && selectedUser?._id === u._id} onOpenChange={(open) => {
                                setRoleDialogOpen(open);
                                if (open) {
                                  setSelectedUser(u);
                                  setSelectedRole(u.role);
                                } else {
                                  setSelectedUser(null);
                                  setSelectedRole('');
                                }
                              }}>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedUser(u);
                                      setSelectedRole(u.role);
                                    }}
                                  >
                                    <UserCog className="w-4 h-4 mr-2" />
                                    Manage
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Manage User Role</DialogTitle>
                                    <DialogDescription>
                                      Assign a role to {selectedUser?.username}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-sm font-medium mb-3">Select Role:</p>
                                      <Select value={selectedRole} onValueChange={setSelectedRole}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {roles.map((role) => (
                                            <SelectItem key={role} value={role}>
                                              {roleLabels[role]}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  <div className="flex gap-3 justify-end mt-6">
                                    <Button 
                                      variant="outline"
                                      onClick={() => {
                                        setRoleDialogOpen(false);
                                        setSelectedUser(null);
                                        setSelectedRole('');
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      onClick={handleUpdateUserRole}
                                      disabled={updatingRoleId === u._id}
                                    >
                                      {updatingRoleId === u._id ? 'Updating...' : 'Update Role'}
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Database Collections</CardTitle>
                  <CardDescription>Click on any row to edit and update in MongoDB</CardDescription>
                </div>
                <Button onClick={fetchDatabaseCollections} disabled={dbLoading}>
                  {dbLoading ? 'Loading...' : 'Refresh'}
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs value={activeDbTab} onValueChange={(tab) => setActiveDbTab(tab as any)}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="users">
                      Users ({dbCollections.users.length})
                    </TabsTrigger>
                    <TabsTrigger value="applications">
                      Applications ({dbCollections.applications.length})
                    </TabsTrigger>
                    <TabsTrigger value="auditLogs">
                      Audit Logs ({dbCollections.auditLogs.length})
                    </TabsTrigger>
                  </TabsList>

                  {/* Users Collection */}
                  <TabsContent value="users" className="space-y-4">
                    {dbLoading ? (
                      <div className="text-center py-8 text-muted-foreground">Loading...</div>
                    ) : dbCollections.users.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No users found</div>
                    ) : (
                      <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                          <thead className="bg-muted border-b">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold">Username</th>
                              <th className="px-4 py-3 text-left font-semibold">Email</th>
                              <th className="px-4 py-3 text-left font-semibold">Role</th>
                              <th className="px-4 py-3 text-left font-semibold">Discord ID</th>
                              <th className="px-4 py-3 text-left font-semibold">Joined</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dbCollections.users.map((doc: any) => (
                              <tr 
                                key={doc._id} 
                                className="border-b hover:bg-secondary/50 cursor-pointer transition-colors"
                                onClick={() => handleOpenDocument(doc, 'users')}
                              >
                                <td className="px-4 py-3 font-medium">{doc.username}</td>
                                <td className="px-4 py-3 text-muted-foreground">{doc.email}</td>
                                <td className="px-4 py-3">
                                  <Badge>{roleLabels[doc.role] || doc.role}</Badge>
                                </td>
                                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{doc.discordId}</td>
                                <td className="px-4 py-3 text-muted-foreground text-xs">
                                  {new Date(doc.joinedAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </TabsContent>

                  {/* Applications Collection */}
                  <TabsContent value="applications" className="space-y-4">
                    {dbLoading ? (
                      <div className="text-center py-8 text-muted-foreground">Loading...</div>
                    ) : dbCollections.applications.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No applications found</div>
                    ) : (
                      <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                          <thead className="bg-muted border-b">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold">Username</th>
                              <th className="px-4 py-3 text-left font-semibold">Position</th>
                              <th className="px-4 py-3 text-left font-semibold">Status</th>
                              <th className="px-4 py-3 text-left font-semibold">Submitted</th>
                              <th className="px-4 py-3 text-left font-semibold">Reviewed</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dbCollections.applications.map((doc: any) => (
                              <tr 
                                key={doc._id} 
                                className="border-b hover:bg-secondary/50 cursor-pointer transition-colors"
                                onClick={() => handleOpenDocument(doc, 'applications')}
                              >
                                <td className="px-4 py-3 font-medium">
                                  {doc.userId?.username || 'Unknown'}
                                </td>
                                <td className="px-4 py-3 capitalize text-muted-foreground">
                                  {doc.position?.replace(/-/g, ' ')}
                                </td>
                                <td className="px-4 py-3">
                                  <Badge className={getStatusColor(doc.status)}>
                                    {doc.status}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                  {new Date(doc.submittedAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                  {doc.reviewedAt ? new Date(doc.reviewedAt).toLocaleDateString() : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </TabsContent>

                  {/* Audit Logs Collection */}
                  <TabsContent value="auditLogs" className="space-y-4">
                    {dbLoading ? (
                      <div className="text-center py-8 text-muted-foreground">Loading...</div>
                    ) : dbCollections.auditLogs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No audit logs found</div>
                    ) : (
                      <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                          <thead className="bg-muted border-b">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold">Action</th>
                              <th className="px-4 py-3 text-left font-semibold">Admin</th>
                              <th className="px-4 py-3 text-left font-semibold">Target</th>
                              <th className="px-4 py-3 text-left font-semibold">Details</th>
                              <th className="px-4 py-3 text-left font-semibold">Timestamp</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dbCollections.auditLogs.map((doc: any) => (
                              <tr 
                                key={doc._id} 
                                className="border-b hover:bg-secondary/50 cursor-pointer transition-colors"
                                onClick={() => handleOpenDocument(doc, 'auditLogs')}
                              >
                                <td className="px-4 py-3 font-mono font-semibold text-xs">
                                  {doc.action}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                  {doc.userId?.username || 'System'}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground text-xs">
                                  {doc.targetType}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground text-xs">
                                  {JSON.stringify(doc.details).substring(0, 50)}...
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                  {new Date(doc.timestamp).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="space-y-6">
            {stats && (
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  </CardContent>
                </Card>

                {Object.entries(stats.usersByRole).map(([role, count]) => (
                  <Card key={role}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium capitalize">
                        {role.replace(/_/g, ' ')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{count}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <AlertDialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Review Application</AlertDialogTitle>
              <AlertDialogDescription>
                {selectedApp && (
                  <>
                    <div className="space-y-2 mt-4">
                      <p><strong>Applicant:</strong> {selectedApp.userId.username}</p>
                      <p><strong>Position:</strong> {selectedApp.position.replace(/-/g, ' ')}</p>
                      <p><strong>Submitted:</strong> {formatDate(selectedApp.submittedAt)}</p>
                    </div>
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {selectedApp && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Application Details</h4>
                  <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                    {Object.entries(selectedApp.formData).map(([key, value]: [string, any]) => (
                      <div key={key}>
                        <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong>
                        <p className="text-muted-foreground">{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Review Notes (Optional)</label>
                  <Textarea
                    placeholder="Add any feedback or notes for the applicant..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={() => handleReviewApplication('declined')}
              >
                <X className="w-4 h-4 mr-2" />
                Decline
              </Button>
              <Button
                onClick={() => handleReviewApplication('approved')}
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit Document Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Document - {editingCollection}</DialogTitle>
              <DialogDescription>
                Modify the document data and save to update in MongoDB
              </DialogDescription>
            </DialogHeader>

            {editDocument && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Document ID</label>
                  <input
                    type="text"
                    value={editDocument._id}
                    disabled
                    className="w-full px-3 py-2 bg-muted border rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">JSON Data</label>
                  <textarea
                    value={editDocumentText}
                    onChange={(e) => setEditDocumentText(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md font-mono text-xs bg-background text-foreground h-64 resize-none"
                    placeholder="Edit JSON here..."
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button
                variant="destructive"
                onClick={handleDeleteDocument}
                disabled={savingDocument}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                disabled={savingDocument}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveDocument}
                disabled={savingDocument}
              >
                {savingDocument ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default AdminPortal;
