import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Users, Loader2, AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { StaffMember, StaffPanelResponse, ROLE_HIERARCHY, ROLE_LABELS } from './types';
import { API_ENDPOINTS } from '@/config/api';
import { cn } from '@/lib/utils';

interface StaffPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StaffPanel({ isOpen, onClose }: StaffPanelProps) {
  const { user } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);

  // Fetch staff data
  useEffect(() => {
    if (!isOpen || !user) return;

    const fetchStaff = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Authentication required');
          return;
        }

        const response = await fetch(API_ENDPOINTS.ADMIN_USERS, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch staff: ${response.statusText}`);
        }

        const data: StaffPanelResponse = await response.json();
        
        // Sort staff by role hierarchy
        const sortedStaff = [...data.users].sort((a, b) => {
          const aHierarchy = ROLE_HIERARCHY[a.role] ?? 999;
          const bHierarchy = ROLE_HIERARCHY[b.role] ?? 999;
          return aHierarchy - bHierarchy;
        });
        
        setStaff(sortedStaff);
        setFilteredStaff(sortedStaff);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load staff');
        console.error('Error fetching staff:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [isOpen, user]);

  // Filter staff by search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredStaff(staff);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = staff.filter(member => 
      member.username.toLowerCase().includes(query) ||
      (ROLE_LABELS[member.role] || member.role).toLowerCase().includes(query)
    );
    setFilteredStaff(filtered);
  }, [searchQuery, staff]);

  // Group staff by role
  const groupedStaff = filteredStaff.reduce((acc, member) => {
    const role = member.role;
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(member);
    return acc;
  }, {} as Record<string, StaffMember[]>);

  // Sort groups by role hierarchy
  const sortedRoles = Object.keys(groupedStaff).sort(
    (a, b) => (ROLE_HIERARCHY[a] ?? 999) - (ROLE_HIERARCHY[b] ?? 999)
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:bg-transparent"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 bottom-0 z-50 w-full sm:w-96 bg-background border-l border-border shadow-lg transition-transform duration-300 ease-in-out overflow-hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Online Staff</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-md"
              aria-label="Close staff panel"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="px-4 py-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading staff...</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p className="text-sm">No staff members found</p>
              </div>
            ) : (
              <div className="p-4 space-y-6">
                {sortedRoles.map((role) => (
                  <div key={role} className="space-y-2">
                    {/* Role header */}
                    <div className="px-2 py-1">
                      <Badge
                        variant="secondary"
                        className="text-xs font-semibold"
                      >
                        {ROLE_LABELS[role] || role.replace(/_/g, ' ')}
                      </Badge>
                    </div>

                    {/* Staff members in this role */}
                    <div className="space-y-2">
                      {groupedStaff[role]?.map((member) => (
                        <div
                          key={member._id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          {/* Avatar */}
                          <Avatar className="w-9 h-9 flex-shrink-0">
                            <AvatarImage src={member.avatar} alt={member.username} />
                            <AvatarFallback>
                              {member.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          {/* Username and role indicator */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {member.username}
                            </p>
                            {member.color && (
                              <div
                                className="w-2 h-2 rounded-full mt-1"
                                style={{ backgroundColor: member.color }}
                                title={`Role color: ${member.color}`}
                              />
                            )}
                          </div>

                          {/* Role color badge */}
                          {member.color && (
                            <div
                              className="w-4 h-4 rounded-full border border-border flex-shrink-0"
                              style={{ backgroundColor: member.color }}
                              title={`${ROLE_LABELS[member.role] || member.role}: ${member.color}`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with staff count */}
          {!loading && !error && (
            <div className="p-4 border-t border-border text-xs text-muted-foreground text-center">
              {filteredStaff.length === 1
                ? '1 staff member'
                : `${filteredStaff.length} staff members`}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
