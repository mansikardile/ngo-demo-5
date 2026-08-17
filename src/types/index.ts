export type UserRole = 'ADMIN' | 'STAFF' | 'COORDINATOR';

export type ProgramStatus = 'DRAFT' | 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type RegistrationStatus = 'REGISTERED' | 'ATTENDED' | 'PARTICIPATED' | 'COMPLETED';

export type VolunteerStatus = 'REGISTERED' | 'ASSIGNED' | 'ACTIVE' | 'COMPLETED';

export type RegistrationType = 'PARTICIPANT' | 'VOLUNTEER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  location?: string;
  organization?: string;
}

export interface Program {
  id: string;
  programCode: string; // e.g. EDU-PUN-2026-01
  name: string;
  category: string;
  description: string;
  location: string;
  address: string;
  date: string; // ISO 8601 string
  startTime: string;
  endTime: string;
  maxParticipants: number;
  currentParticipants: number;
  volunteerRequirement: number;
  currentVolunteers: number;
  targetAudience: string;
  areaOfInterest: string;
  status: ProgramStatus;
  coordinatorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  id: string;
  trackingId: string; // e.g. CPR-PAR-2EC3287E
  name: string;
  email: string;
  phone: string;
  location: string;
  collegeOrOrganization: string;
  ageOrYear: string;
  areaOfInterest: string;
  registrationType: RegistrationType;
  status: RegistrationStatus;
  programId: string;
  programName: string;
  registrationId?: string;
  registeredDate: string;
  attendanceDate?: string;
  participationDate?: string;
  completionDate?: string;
}

export interface Volunteer {
  id: string;
  volunteerId: string; // e.g. VOL-PUN-042
  name: string;
  email: string;
  phone: string;
  location: string;
  status: VolunteerStatus;
  totalHours: number;
  lastParticipation: string;
  skills: string[];
  assignedPrograms: {
    programId: string;
    programName: string;
    role: string;
    hoursLogged: number;
  }[];
}

export interface Registration {
  id: string;
  trackingId: string;
  participantId?: string;
  volunteerId?: string;
  programId: string;
  programName: string;
  personName: string;
  email: string;
  phone: string;
  registrationDate: string;
  registrationType: RegistrationType;
  status: RegistrationStatus;
}

export interface Participation {
  id: string;
  trackingId: string;
  personName: string;
  email: string;
  programId: string;
  programName: string;
  registrationType: RegistrationType;
  status: RegistrationStatus;
  registeredDate: string;
  attendanceDate?: string;
  participationDate?: string;
  completionDate?: string;
}

export interface ImpactRecord {
  id: string;
  programId: string;
  programName: string;
  location: string;
  participantsCount: number;
  volunteersCount: number;
  volunteerHours: number;
  date: string;
}

export interface DashboardAnalytics {
  totalPrograms: number;
  activePrograms: number;
  totalParticipants: number;
  totalVolunteers: number;
  attendanceRate: number;
  completionRate: number;
  volunteerHours: number;
  participationTrend: { month: string; registered: number; completed: number }[];
  funnelData: { stage: string; count: number }[];
  statusDistribution: { status: ProgramStatus; count: number }[];
  categoryBreakdown: { category: string; count: number }[];
  locationImpact: { location: string; participants: number; volunteers: number; hours: number }[];
  volunteerContributionHistory: { month: string; hours: number }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'REGISTRATION' | 'PROGRAM' | 'VOLUNTEER' | 'SYSTEM';
  read: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
