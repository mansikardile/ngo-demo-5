import { mockPrograms } from '../mock/programs';
import { Program, ProgramStatus, ApiResponse, PaginatedResponse } from '../types';
import { apiRequest } from '../lib/apiClient';

const PROGRAM_STORAGE_KEY = 'ngo_programs_store_v1';

function loadProgramsFromStorage(): Program[] {
  try {
    const saved = localStorage.getItem(PROGRAM_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[programService] Failed loading from localStorage:', err);
  }
  return [...mockPrograms];
}

function saveProgramsToStorage(programs: Program[]) {
  try {
    localStorage.setItem(PROGRAM_STORAGE_KEY, JSON.stringify(programs));
  } catch (err) {
    console.warn('[programService] Failed saving to localStorage:', err);
  }
}

let inMemoryPrograms: Program[] = loadProgramsFromStorage();

function mapProgramToFrontend(p: any): Program {
  return {
    id: p.id,
    programCode: p.programCode || p.program_code || `PRG-${p.id.slice(0, 6)}`,
    name: p.name,
    description: p.description || '',
    category: p.category || 'General',
    location: p.location || 'Pune',
    address: p.address || '',
    date: p.date || p.startDate || new Date().toISOString(),
    startTime: p.startTime || '09:00 AM',
    endTime: p.endTime || '05:00 PM',
    currentParticipants: p.currentParticipants ?? p.totalRegistered ?? p._count?.registrations ?? 0,
    maxParticipants: p.maxParticipants ?? 100,
    currentVolunteers: p.currentVolunteers ?? 0,
    volunteerRequirement: p.volunteerRequirement ?? p.maxVolunteers ?? 15,
    targetAudience: p.targetAudience || 'Community Youth & Adults',
    areaOfInterest: p.areaOfInterest || p.category || 'Social Impact',
    status: p.status || 'ACTIVE',
    coordinatorId: p.coordinatorId,
    createdAt: p.createdAt || new Date().toISOString(),
    updatedAt: p.updatedAt || new Date().toISOString(),
  };
}

export const programService = {
  async getPrograms(params?: {
    search?: string;
    category?: string;
    location?: string;
    status?: ProgramStatus | 'ALL';
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Program>> {
    try {
      const queryParts: string[] = [];
      if (params?.page) queryParts.push(`page=${params.page}`);
      if (params?.limit) queryParts.push(`limit=${params.limit}`);
      if (params?.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
      if (params?.category && params.category !== 'ALL') queryParts.push(`category=${encodeURIComponent(params.category)}`);
      if (params?.location && params.location !== 'ALL') queryParts.push(`location=${encodeURIComponent(params.location)}`);
      if (params?.status && params.status !== 'ALL') queryParts.push(`status=${encodeURIComponent(params.status)}`);

      const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
      const res = await apiRequest<any[]>(`/programs${queryString}`);

      if (res.success && Array.isArray(res.data)) {
        const mappedData = res.data.map(mapProgramToFrontend);
        inMemoryPrograms = mappedData;
        saveProgramsToStorage(mappedData);
        return {
          success: true,
          data: mappedData,
          pagination: res.pagination || {
            page: params?.page || 1,
            limit: params?.limit || 10,
            total: mappedData.length,
            totalPages: Math.ceil(mappedData.length / (params?.limit || 10)) || 1,
          },
        };
      }
    } catch (err) {
      console.warn('[programService] Backend fetch unavailable, using persistent local store:', err);
    }

    inMemoryPrograms = loadProgramsFromStorage();
    let filtered = [...inMemoryPrograms];
    if (params?.search) {
      const query = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.programCode.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }
    if (params?.category && params.category !== 'ALL') {
      filtered = filtered.filter((p) => p.category === params.category);
    }
    if (params?.location && params.location !== 'ALL') {
      filtered = filtered.filter((p) => p.location.toLowerCase() === params.location?.toLowerCase());
    }
    if (params?.status && params.status !== 'ALL') {
      filtered = filtered.filter((p) => p.status === params.status);
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedData = filtered.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },

  async getProgramById(id: string): Promise<ApiResponse<Program | null>> {
    try {
      const res = await apiRequest<any>(`/programs/${id}`);
      if (res.success && res.data) {
        return { success: true, data: mapProgramToFrontend(res.data) };
      }
    } catch (err) {
      console.warn('[programService] Backend getProgramById unavailable, using local store:', err);
    }

    inMemoryPrograms = loadProgramsFromStorage();
    const program = inMemoryPrograms.find((p) => p.id === id || p.programCode === id);
    if (!program) {
      return { success: false, data: null, message: 'Program not found', code: 'PROGRAM_NOT_FOUND' };
    }
    return { success: true, data: program };
  },

  async createProgram(
    data: Omit<Program, 'id' | 'createdAt' | 'updatedAt' | 'currentParticipants' | 'currentVolunteers'>
  ): Promise<ApiResponse<Program>> {
    try {
      const startDate = data.date ? new Date(data.date).toISOString() : new Date().toISOString();
      const payload = {
        name: data.name,
        category: data.category,
        location: data.location,
        address: data.address || '',
        startDate,
        endDate: startDate,
        maxParticipants: data.maxParticipants ? Number(data.maxParticipants) : 50,
        maxVolunteers: data.volunteerRequirement ? Number(data.volunteerRequirement) : 10,
        description: data.description || '',
        status: data.status || 'ACTIVE',
      };

      const res = await apiRequest<any>('/programs', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success && res.data) {
        const created = mapProgramToFrontend(res.data);
        inMemoryPrograms = loadProgramsFromStorage();
        inMemoryPrograms.unshift(created);
        saveProgramsToStorage(inMemoryPrograms);
        return { success: true, data: created };
      }
    } catch (err) {
      console.warn('[programService] Backend createProgram unavailable, storing in persistent local store:', err);
    }

    const newProgram: Program = {
      ...data,
      id: `prg-uuid-${Date.now()}`,
      currentParticipants: 0,
      currentVolunteers: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryPrograms = loadProgramsFromStorage();
    inMemoryPrograms.unshift(newProgram);
    saveProgramsToStorage(inMemoryPrograms);
    return { success: true, data: newProgram };
  },

  async updateProgram(id: string, updates: Partial<Program>): Promise<ApiResponse<Program>> {
    try {
      const res = await apiRequest<any>(`/programs/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });

      if (res.success && res.data) {
        const updated = mapProgramToFrontend(res.data);
        inMemoryPrograms = loadProgramsFromStorage();
        const idx = inMemoryPrograms.findIndex((p) => p.id === id);
        if (idx !== -1) inMemoryPrograms[idx] = updated;
        saveProgramsToStorage(inMemoryPrograms);
        return { success: true, data: updated };
      }
    } catch (err) {
      console.warn('[programService] Backend updateProgram unavailable, updating persistent local store:', err);
    }

    inMemoryPrograms = loadProgramsFromStorage();
    const index = inMemoryPrograms.findIndex((p) => p.id === id);
    if (index === -1) {
      return { success: false, data: null as any, message: 'Program not found', code: 'PROGRAM_NOT_FOUND' };
    }
    const updated = {
      ...inMemoryPrograms[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    inMemoryPrograms[index] = updated;
    saveProgramsToStorage(inMemoryPrograms);
    return { success: true, data: updated };
  },

  async updateProgramStatus(id: string, status: ProgramStatus): Promise<ApiResponse<Program>> {
    try {
      const res = await apiRequest<any>(`/programs/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (res.success && res.data) {
        const updated = mapProgramToFrontend(res.data);
        inMemoryPrograms = loadProgramsFromStorage();
        const idx = inMemoryPrograms.findIndex((p) => p.id === id);
        if (idx !== -1) inMemoryPrograms[idx] = updated;
        saveProgramsToStorage(inMemoryPrograms);
        return { success: true, data: updated };
      }
    } catch (err) {
      console.warn('[programService] Backend updateProgramStatus failed:', err);
    }

    return this.updateProgram(id, { status });
  },

  async deleteProgram(id: string): Promise<ApiResponse<boolean>> {
    try {
      const res = await apiRequest<boolean>(`/programs/${id}`, { method: 'DELETE' });
      if (res.success) {
        inMemoryPrograms = loadProgramsFromStorage().filter((p) => p.id !== id);
        saveProgramsToStorage(inMemoryPrograms);
        return { success: true, data: true };
      }
    } catch (err) {
      console.warn('[programService] Backend deleteProgram unavailable, updating local store:', err);
    }

    inMemoryPrograms = loadProgramsFromStorage().filter((p) => p.id !== id);
    saveProgramsToStorage(inMemoryPrograms);
    return { success: true, data: true };
  },
};
