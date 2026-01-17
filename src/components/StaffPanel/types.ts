export interface StaffMember {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
  color: string;
  joinedAt: string;
  updatedAt: string;
}

export interface StaffPanelResponse {
  users: StaffMember[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

// Role hierarchy order
export const ROLE_HIERARCHY: Record<string, number> = {
  'owner': 0,
  'main_admin': 1,
  'admin': 2,
  'deputy': 3,
  'sr_moderator': 4,
  'moderator': 5,
  'helper': 6,
  'jr_helper': 7,
  'beta_tester': 8,
};

export const ROLE_LABELS: Record<string, string> = {
  'owner': 'Owner',
  'main_admin': 'Main Admin',
  'admin': 'Admin',
  'deputy': 'Deputy',
  'sr_moderator': 'Sr. Moderator',
  'moderator': 'Moderator',
  'helper': 'Helper',
  'jr_helper': 'Jr. Helper',
  'beta_tester': 'Beta Tester',
};
