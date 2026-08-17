import { mockParticipants } from '../mock/participants';
import { mockRegistrations } from '../mock/registrations';
import { Participant, Registration, RegistrationStatus, ApiResponse, PaginatedResponse } from '../types';
import { apiRequest } from '../lib/apiClient';

const PARTICIPANT_STORAGE_KEY = 'ngo_participants_store_v1';
const REGISTRATION_STORAGE_KEY = 'ngo_registrations_store_v1';

function loadParticipants(): Participant[] {
  try {
    const saved = localStorage.getItem(PARTICIPANT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('[participantService] Failed loading participants from localStorage:', err);
  }
  return [...mockParticipants];
}

function saveParticipants(pts: Participant[]) {
  try {
    localStorage.setItem(PARTICIPANT_STORAGE_KEY, JSON.stringify(pts));
  } catch (err) {
    console.warn('[participantService] Failed saving participants to localStorage:', err);
  }
}

function loadRegistrations(): Registration[] {
  try {
    const saved = localStorage.getItem(REGISTRATION_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('[participantService] Failed loading registrations from localStorage:', err);
  }
  return [...mockRegistrations];
}

function saveRegistrations(regs: Registration[]) {
  try {
    localStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify(regs));
  } catch (err) {
    console.warn('[participantService] Failed saving registrations to localStorage:', err);
  }
}

let inMemoryParticipants: Participant[] = loadParticipants();
let inMemoryRegistrations: Registration[] = loadRegistrations();

function mapBackendParticipant(p: any): Participant {
  const reg = Array.isArray(p.registrations) ? p.registrations[0] : p.registration;
  return {
    id: p.id,
    trackingId: p.trackingId || p.tracking_id || `CPR-PAR-${p.id.slice(0, 8).toUpperCase()}`,
    name: p.name,
    email: p.email,
    phone: p.phone || '',
    location: p.location || 'Pune',
    collegeOrOrganization: p.college || p.collegeOrOrganization || 'N/A',
    ageOrYear: p.ageOrYear || 'N/A',
    areaOfInterest: p.areaOfInterest || 'General',
    registrationType: reg?.registrantType || p.registrationType || 'PARTICIPANT',
    status: reg?.status || p.status || 'REGISTERED',
    programId: reg?.programId || p.programId || '',
    programName: reg?.program?.name || p.programName || 'Community Program',
    registrationId: reg?.id || p.registrationId,
    registeredDate: p.createdAt || p.registeredDate || new Date().toISOString(),
    attendanceDate: reg?.attendedAt || p.attendanceDate,
    participationDate: reg?.participatedAt || p.participationDate,
    completionDate: reg?.completedAt || p.completionDate,
  };
}

export const participantService = {
  async getParticipants(params?: {
    search?: string;
    status?: RegistrationStatus | 'ALL';
    programId?: string;
    location?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Participant>> {
    try {
      const queryParts: string[] = [];
      if (params?.page) queryParts.push(`page=${params.page}`);
      if (params?.limit) queryParts.push(`limit=${params.limit}`);
      if (params?.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
      if (params?.status && params.status !== 'ALL') queryParts.push(`status=${encodeURIComponent(params.status)}`);
      if (params?.programId && params.programId !== 'ALL') queryParts.push(`programId=${encodeURIComponent(params.programId)}`);

      const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
      const res = await apiRequest<any[]>(`/participants${queryString}`);

      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map(mapBackendParticipant);
        inMemoryParticipants = mapped;
        saveParticipants(mapped);
        return {
          success: true,
          data: mapped,
          pagination: res.pagination || {
            page: params?.page || 1,
            limit: params?.limit || 10,
            total: mapped.length,
            totalPages: Math.ceil(mapped.length / (params?.limit || 10)) || 1,
          },
        };
      }
    } catch (err) {
      console.warn('[participantService] Backend getParticipants unavailable, using local persistent store:', err);
    }

    inMemoryParticipants = loadParticipants();
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
    try {
      const cleanId = trackingId.trim();
      const res = await apiRequest<any>(`/participants/track/${encodeURIComponent(cleanId)}`);
      if (res.success && res.data) {
        return { success: true, data: mapBackendParticipant(res.data) };
      }
    } catch (err) {
      console.warn('[participantService] Backend tracking search unavailable, checking local persistent store:', err);
    }

    inMemoryParticipants = loadParticipants();
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
    try {
      const isVolunteer = data.registrationType === 'VOLUNTEER';
      const endpoint = `/programs/${data.programId}/register/${isVolunteer ? 'volunteer' : 'participant'}`;

      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        college: data.collegeOrOrganization,
        ageOrYear: data.ageOrYear,
        areaOfInterest: data.areaOfInterest,
      };

      const res = await apiRequest<any>(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success && res.data) {
        const trackingId = res.data.trackingId;
        const participant = mapBackendParticipant({
          ...res.data.participant,
          registration: {
            status: res.data.status,
            programId: data.programId,
            program: { name: data.programName },
            registrantType: data.registrationType,
          },
        });

        inMemoryParticipants = loadParticipants();
        inMemoryParticipants.unshift(participant);
        saveParticipants(inMemoryParticipants);

        const newReg: Registration = {
          id: res.data.registrationId || `reg-${Date.now()}`,
          trackingId,
          participantId: participant.id,
          programId: data.programId,
          programName: data.programName,
          personName: data.name,
          email: data.email,
          phone: data.phone,
          registrationDate: participant.registeredDate,
          registrationType: data.registrationType,
          status: 'REGISTERED',
        };
        inMemoryRegistrations = loadRegistrations();
        inMemoryRegistrations.unshift(newReg);
        saveRegistrations(inMemoryRegistrations);

        return {
          success: true,
          data: { trackingId, participant },
        };
      }
    } catch (err) {
      console.warn('[participantService] Backend registration call unavailable, storing in persistent local store:', err);
    }

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

    inMemoryParticipants = loadParticipants();
    inMemoryParticipants.unshift(newParticipant);
    saveParticipants(inMemoryParticipants);

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
    inMemoryRegistrations = loadRegistrations();
    inMemoryRegistrations.unshift(newReg);
    saveRegistrations(inMemoryRegistrations);

    return {
      success: true,
      data: { trackingId, participant: newParticipant },
    };
  },

  async updateParticipationStatus(idOrTrackingId: string, nextStatus: RegistrationStatus): Promise<ApiResponse<Participant>> {
    inMemoryParticipants = loadParticipants();
    inMemoryRegistrations = loadRegistrations();

    const pt = inMemoryParticipants.find((p) => p.id === idOrTrackingId || p.trackingId === idOrTrackingId);

    try {
      const regId = pt?.registrationId || pt?.id || idOrTrackingId;
      const res = await apiRequest<any>(`/registrations/${regId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.success && res.data) {
        const updated = mapBackendParticipant(res.data);
        const idx = inMemoryParticipants.findIndex((p) => p.id === updated.id);
        if (idx !== -1) inMemoryParticipants[idx] = updated;
        saveParticipants(inMemoryParticipants);
        return { success: true, data: updated };
      }
    } catch (err) {
      console.warn('[participantService] Backend status update failed, updating local store:', err);
    }

    if (!pt) {
      return { success: false, data: null as any, message: 'Participant record not found', code: 'PARTICIPANT_NOT_FOUND' };
    }

    pt.status = nextStatus;
    const now = new Date().toISOString();
    if (nextStatus === 'ATTENDED' && !pt.attendanceDate) pt.attendanceDate = now;
    if (nextStatus === 'PARTICIPATED' && !pt.participationDate) pt.participationDate = now;
    if (nextStatus === 'COMPLETED' && !pt.completionDate) pt.completionDate = now;

    saveParticipants(inMemoryParticipants);

    const reg = inMemoryRegistrations.find((r) => r.trackingId === pt.trackingId);
    if (reg) {
      reg.status = nextStatus;
      saveRegistrations(inMemoryRegistrations);
    }

    return { success: true, data: pt };
  },

  async getRegistrations(params?: { search?: string; status?: RegistrationStatus | 'ALL' }): Promise<PaginatedResponse<Registration>> {
    inMemoryRegistrations = loadRegistrations();
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
