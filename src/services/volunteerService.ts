import { mockVolunteers } from '../mock/volunteers';
import { Volunteer, VolunteerStatus, ApiResponse, PaginatedResponse } from '../types';
import { apiRequest } from '../lib/apiClient';

const VOLUNTEER_STORAGE_KEY = 'ngo_volunteers_store_v1';

function loadVolunteers(): Volunteer[] {
  try {
    const saved = localStorage.getItem(VOLUNTEER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('[volunteerService] Failed loading volunteers from localStorage:', err);
  }
  return [...mockVolunteers];
}

function saveVolunteers(vols: Volunteer[]) {
  try {
    localStorage.setItem(VOLUNTEER_STORAGE_KEY, JSON.stringify(vols));
  } catch (err) {
    console.warn('[volunteerService] Failed saving volunteers to localStorage:', err);
  }
}

let inMemoryVolunteers: Volunteer[] = loadVolunteers();

function mapBackendVolunteer(v: any): Volunteer {
  return {
    id: v.id,
    volunteerId: v.trackingId || v.tracking_id || `CPR-VOL-${v.id.slice(0, 8).toUpperCase()}`,
    name: v.name,
    email: v.email,
    phone: v.phone || '',
    location: v.location || 'Pune',
    skills: v.skills || [v.areaOfInterest || 'Community Support'],
    totalHours: v.totalHours ?? 0,
    status: v.status || 'ACTIVE',
    lastParticipation: v.updatedAt ? new Date(v.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    assignedPrograms: Array.isArray(v.registrations)
      ? v.registrations.map((r: any) => ({
          programId: r.programId || r.program?.id || '',
          programName: r.program?.name || 'Community Program',
          role: r.role || 'Volunteer',
          hoursLogged: r.hoursContributed || 0,
        }))
      : [
          {
            programId: 'prg-1',
            programName: 'Community STEM Workshop',
            role: 'Lead Mentor',
            hoursLogged: v.totalHours || 8,
          },
        ],
  };
}

export const volunteerService = {
  async getVolunteers(params?: {
    search?: string;
    status?: VolunteerStatus | 'ALL';
    location?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Volunteer>> {
    try {
      const queryParts: string[] = [];
      if (params?.page) queryParts.push(`page=${params.page}`);
      if (params?.limit) queryParts.push(`limit=${params.limit}`);
      if (params?.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
      if (params?.status && params.status !== 'ALL') queryParts.push(`status=${encodeURIComponent(params.status)}`);

      const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
      const res = await apiRequest<any[]>(`/volunteers${queryString}`);

      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map(mapBackendVolunteer);
        inMemoryVolunteers = mapped;
        saveVolunteers(mapped);
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
      console.warn('[volunteerService] Backend fetch unavailable, using local persistent store:', err);
    }

    inMemoryVolunteers = loadVolunteers();
    let filtered = [...inMemoryVolunteers];
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.email.toLowerCase().includes(q) ||
          v.volunteerId.toLowerCase().includes(q) ||
          v.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (params?.status && params.status !== 'ALL') {
      filtered = filtered.filter((v) => v.status === params.status);
    }
    if (params?.location && params.location !== 'ALL') {
      filtered = filtered.filter((v) => v.location.toLowerCase() === params.location?.toLowerCase());
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

  async getVolunteerById(idOrVolunteerId: string): Promise<ApiResponse<Volunteer | null>> {
    try {
      const res = await apiRequest<any>(`/volunteers/${idOrVolunteerId}`);
      if (res.success && res.data) {
        return { success: true, data: mapBackendVolunteer(res.data) };
      }
    } catch (err) {
      console.warn('[volunteerService] Backend getVolunteerById unavailable, using local store:', err);
    }

    inMemoryVolunteers = loadVolunteers();
    const vol = inMemoryVolunteers.find((v) => v.id === idOrVolunteerId || v.volunteerId === idOrVolunteerId);
    if (!vol) {
      return { success: false, data: null, message: 'Volunteer record not found', code: 'VOLUNTEER_NOT_FOUND' };
    }
    return { success: true, data: vol };
  },

  async updateVolunteerStatus(id: string, status: VolunteerStatus): Promise<ApiResponse<Volunteer>> {
    inMemoryVolunteers = loadVolunteers();
    const vol = inMemoryVolunteers.find((v) => v.id === id);
    if (!vol) {
      return { success: false, data: null as any, message: 'Volunteer not found', code: 'VOLUNTEER_NOT_FOUND' };
    }
    vol.status = status;
    saveVolunteers(inMemoryVolunteers);
    return { success: true, data: vol };
  },

  async logHours(id: string, hours: number, programName: string, role: string): Promise<ApiResponse<Volunteer>> {
    inMemoryVolunteers = loadVolunteers();
    const vol = inMemoryVolunteers.find((v) => v.id === id);
    if (!vol) {
      return { success: false, data: null as any, message: 'Volunteer not found', code: 'VOLUNTEER_NOT_FOUND' };
    }
    vol.totalHours += hours;
    vol.lastParticipation = new Date().toISOString().split('T')[0];
    vol.assignedPrograms.push({
      programId: `prg-logged-${Date.now()}`,
      programName,
      role,
      hoursLogged: hours,
    });
    saveVolunteers(inMemoryVolunteers);
    return { success: true, data: vol };
  },
};
