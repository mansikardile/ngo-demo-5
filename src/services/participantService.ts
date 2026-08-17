import { mockParticipants } from '../mock/participants';
import { mockRegistrations } from '../mock/registrations';
import { Participant, Registration, RegistrationStatus, ApiResponse, PaginatedResponse } from '../types';

let inMemoryParticipants: Participant[] = [...mockParticipants];
let inMemoryRegistrations: Registration[] = [...mockRegistrations];

export const participantService = {
  async getParticipants(params?: {
    search?: string;
    status?: RegistrationStatus | 'ALL';
    programId?: string;
    location?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Participant>> {
    let filtered = [...inMemoryParticipants];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.trackingId.toLowerCase().includes(q) ||
          p.collegeOrOrganization.toLowerCase().includes(q)
      );
    }

    if (params?.status && params.status !== 'ALL') {
      filtered = filtered.filter((p) => p.status === params.status);
    }

    if (params?.programId && params.programId !== 'ALL') {
      filtered = filtered.filter((p) => p.programId === params.programId);
    }

    if (params?.location && params.location !== 'ALL') {
      filtered = filtered.filter((p) => p.location.toLowerCase() === params.location?.toLowerCase());
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;

    return {
      success: true,
      data: filtered.slice(startIndex, startIndex + limit),
      pagination: { page, limit, total, totalPages },
    };
  },

  async getParticipantByTrackingId(trackingId: string): Promise<ApiResponse<Participant | null>> {
    const pt = inMemoryParticipants.find((p) => p.trackingId.toUpperCase() === trackingId.trim().toUpperCase());
    if (!pt) {
      return { success: false, data: null, message: 'Tracking record not found', code: 'PARTICIPANT_NOT_FOUND' };
    }
    return { success: true, data: pt };
  },

  async registerForProgram(data: {
    name: string;
    email: string;
    phone: string;
    location: string;
    collegeOrOrganization: string;
    ageOrYear: string;
    areaOfInterest: string;
    registrationType: 'PARTICIPANT' | 'VOLUNTEER';
    programId: string;
    programName: string;
  }): Promise<ApiResponse<{ trackingId: string; participant: Participant }>> {
    // Generate tracking ID following contract pattern: CPR-PAR-XXXXXX
    const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase();
    const trackingId = `CPR-PAR-${randomHex}`;

    const newParticipant: Participant = {
      id: `pt-uuid-${Date.now()}`,
      trackingId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      collegeOrOrganization: data.collegeOrOrganization,
      ageOrYear: data.ageOrYear,
      areaOfInterest: data.areaOfInterest,
      registrationType: data.registrationType,
      status: 'REGISTERED',
      programId: data.programId,
      programName: data.programName,
      registeredDate: new Date().toISOString(),
    };

    inMemoryParticipants.unshift(newParticipant);

    // Also record in central registrations table
    const newReg: Registration = {
      id: `reg-${Date.now()}`,
      trackingId,
      participantId: newParticipant.id,
      programId: data.programId,
      programName: data.programName,
      personName: data.name,
      email: data.email,
      phone: data.phone,
      registrationDate: newParticipant.registeredDate,
      registrationType: data.registrationType,
      status: 'REGISTERED',
    };
    inMemoryRegistrations.unshift(newReg);

    return {
      success: true,
      data: { trackingId, participant: newParticipant },
    };
  },

  async updateParticipationStatus(idOrTrackingId: string, nextStatus: RegistrationStatus): Promise<ApiResponse<Participant>> {
    const pt = inMemoryParticipants.find((p) => p.id === idOrTrackingId || p.trackingId === idOrTrackingId);
    if (!pt) {
      return { success: false, data: null as any, message: 'Participant record not found', code: 'PARTICIPANT_NOT_FOUND' };
    }

    pt.status = nextStatus;
    const now = new Date().toISOString();

    if (nextStatus === 'ATTENDED' && !pt.attendanceDate) pt.attendanceDate = now;
    if (nextStatus === 'PARTICIPATED' && !pt.participationDate) pt.participationDate = now;
    if (nextStatus === 'COMPLETED' && !pt.completionDate) pt.completionDate = now;

    // Sync registration record
    const reg = inMemoryRegistrations.find((r) => r.trackingId === pt.trackingId);
    if (reg) reg.status = nextStatus;

    return { success: true, data: pt };
  },

  async getRegistrations(params?: { search?: string; status?: RegistrationStatus | 'ALL' }): Promise<PaginatedResponse<Registration>> {
    let filtered = [...inMemoryRegistrations];
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.personName.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.trackingId.toLowerCase().includes(q)
      );
    }
    if (params?.status && params.status !== 'ALL') {
      filtered = filtered.filter((r) => r.status === params.status);
    }
    return {
      success: true,
      data: filtered,
      pagination: { page: 1, limit: 50, total: filtered.length, totalPages: 1 },
    };
  },
};
