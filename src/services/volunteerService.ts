import { mockVolunteers } from '../mock/volunteers';
import { Volunteer, VolunteerStatus, ApiResponse, PaginatedResponse } from '../types';

let inMemoryVolunteers: Volunteer[] = [...mockVolunteers];

export const volunteerService = {
  async getVolunteers(params?: {
    search?: string;
    status?: VolunteerStatus | 'ALL';
    location?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Volunteer>> {
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
    const vol = inMemoryVolunteers.find((v) => v.id === idOrVolunteerId || v.volunteerId === idOrVolunteerId);
    if (!vol) {
      return { success: false, data: null, message: 'Volunteer record not found', code: 'VOLUNTEER_NOT_FOUND' };
    }
    return { success: true, data: vol };
  },

  async updateVolunteerStatus(id: string, status: VolunteerStatus): Promise<ApiResponse<Volunteer>> {
    const vol = inMemoryVolunteers.find((v) => v.id === id);
    if (!vol) {
      return { success: false, data: null as any, message: 'Volunteer not found', code: 'VOLUNTEER_NOT_FOUND' };
    }
    vol.status = status;
    return { success: true, data: vol };
  },

  async logHours(id: string, hours: number, programName: string, role: string): Promise<ApiResponse<Volunteer>> {
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
    return { success: true, data: vol };
  },
};
