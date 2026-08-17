import { mockPrograms } from '../mock/programs';
import { Program, ProgramStatus, ApiResponse, PaginatedResponse } from '../types';

let inMemoryPrograms: Program[] = [...mockPrograms];

export const programService = {
  async getPrograms(params?: {
    search?: string;
    category?: string;
    location?: string;
    status?: ProgramStatus | 'ALL';
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Program>> {
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
    const program = inMemoryPrograms.find((p) => p.id === id || p.programCode === id);
    if (!program) {
      return { success: false, data: null, message: 'Program not found', code: 'PROGRAM_NOT_FOUND' };
    }
    return { success: true, data: program };
  },

  async createProgram(data: Omit<Program, 'id' | 'createdAt' | 'updatedAt' | 'currentParticipants' | 'currentVolunteers'>): Promise<ApiResponse<Program>> {
    const newProgram: Program = {
      ...data,
      id: `prg-uuid-${Date.now()}`,
      currentParticipants: 0,
      currentVolunteers: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryPrograms.unshift(newProgram);
    return { success: true, data: newProgram };
  },

  async updateProgram(id: string, updates: Partial<Program>): Promise<ApiResponse<Program>> {
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
    return { success: true, data: updated };
  },

  async deleteProgram(id: string): Promise<ApiResponse<boolean>> {
    inMemoryPrograms = inMemoryPrograms.filter((p) => p.id !== id);
    return { success: true, data: true };
  },
};
