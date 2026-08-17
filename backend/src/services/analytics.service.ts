import { prisma } from '../config/prisma';

export const analyticsService = {
  /**
   * Dashboard analytics — use-case F
   * All aggregation done in DB, not in frontend memory
   */
  async getDashboard() {
    const [
      totalPrograms,
      activePrograms,
      totalParticipants,
      totalVolunteers,
      registrationStats,
      volunteerHours,
    ] = await Promise.all([
      // Total programs
      prisma.program.count(),

      // Active programs
      prisma.program.count({ where: { status: 'ACTIVE' } }),

      // Total unique participants
      prisma.participant.count(),

      // Total unique volunteers
      prisma.volunteer.count(),

      // Registration funnel stats
      prisma.registration.groupBy({
        by: ['status'],
        _count: { id: true },
      }),

      // Total volunteer hours contributed
      prisma.volunteer.aggregate({
        _sum: { totalHours: true },
      }),
    ]);

    // Build registration funnel counts
    const funnelMap: Record<string, number> = {};
    for (const s of registrationStats) {
      funnelMap[s.status] = s._count.id;
    }

    const totalRegistered = Object.values(funnelMap).reduce((a, b) => a + b, 0);
    const totalAttended = (funnelMap['ATTENDED'] ?? 0)
      + (funnelMap['PARTICIPATED'] ?? 0)
      + (funnelMap['COMPLETED'] ?? 0);
    const totalCompleted = funnelMap['COMPLETED'] ?? 0;

    const attendanceRate =
      totalRegistered > 0
        ? Math.round((totalAttended / totalRegistered) * 100)
        : 0;

    const completionRate =
      totalRegistered > 0
        ? Math.round((totalCompleted / totalRegistered) * 100)
        : 0;

    return {
      totalPrograms,
      activePrograms,
      totalParticipants,
      totalVolunteers,
      totalRegistrations: totalRegistered,
      attendanceRate,
      completionRate,
      volunteerHoursContributed: volunteerHours._sum.totalHours ?? 0,
      registrationFunnel: {
        registered: funnelMap['REGISTERED'] ?? 0,
        attended: funnelMap['ATTENDED'] ?? 0,
        participated: funnelMap['PARTICIPATED'] ?? 0,
        completed: funnelMap['COMPLETED'] ?? 0,
      },
    };
  },

  /**
   * Program-wise performance analytics — use-case U
   */
  async getProgramAnalytics() {
    const programs = await prisma.program.findMany({
      select: {
        id: true,
        name: true,
        programCode: true,
        location: true,
        category: true,
        status: true,
        startDate: true,
        endDate: true,
        _count: { select: { registrations: true } },
        registrations: {
          select: { status: true, registrantType: true, hoursContributed: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return programs.map((p) => {
      const participants = p.registrations.filter(
        (r) => r.registrantType === 'PARTICIPANT'
      );
      const volunteers = p.registrations.filter(
        (r) => r.registrantType === 'VOLUNTEER'
      );
      const completed = p.registrations.filter((r) => r.status === 'COMPLETED').length;
      const attended = p.registrations.filter(
        (r) => r.status === 'ATTENDED' || r.status === 'PARTICIPATED' || r.status === 'COMPLETED'
      ).length;
      const totalHours = volunteers.reduce(
        (sum, v) => sum + (v.hoursContributed ?? 0),
        0
      );

      return {
        id: p.id,
        name: p.name,
        programCode: p.programCode,
        location: p.location,
        category: p.category,
        status: p.status,
        startDate: p.startDate,
        endDate: p.endDate,
        totalRegistrations: p._count.registrations,
        totalParticipants: participants.length,
        totalVolunteers: volunteers.length,
        totalAttended: attended,
        totalCompleted: completed,
        attendanceRate:
          p._count.registrations > 0
            ? Math.round((attended / p._count.registrations) * 100)
            : 0,
        completionRate:
          p._count.registrations > 0
            ? Math.round((completed / p._count.registrations) * 100)
            : 0,
        volunteerHours: totalHours,
      };
    });
  },

  /**
   * Location-wise impact — use-case U
   */
  async getLocationAnalytics() {
    const programs = await prisma.program.findMany({
      select: {
        location: true,
        status: true,
        _count: { select: { registrations: true } },
        registrations: { select: { status: true } },
      },
    });

    const locationMap: Record<
      string,
      {
        location: string;
        totalPrograms: number;
        totalRegistrations: number;
        totalCompleted: number;
      }
    > = {};

    for (const p of programs) {
      if (!locationMap[p.location]) {
        locationMap[p.location] = {
          location: p.location,
          totalPrograms: 0,
          totalRegistrations: 0,
          totalCompleted: 0,
        };
      }
      locationMap[p.location].totalPrograms += 1;
      locationMap[p.location].totalRegistrations += p._count.registrations;
      locationMap[p.location].totalCompleted += p.registrations.filter(
        (r) => r.status === 'COMPLETED'
      ).length;
    }

    return Object.values(locationMap);
  },
};
