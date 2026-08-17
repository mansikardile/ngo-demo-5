import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Helpers ──────────────────────────────────────────────────────────────────
function randomHex(n: number) {
  return [...Array(n)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('')
    .toUpperCase();
}

function ptId() { return `CPR-PAR-${randomHex(8)}`; }
function vtId() { return `CPR-VOL-${randomHex(8)}`; }

async function main() {
  console.log('🌱 Seeding database...');

  // ── 1. Admin user via Supabase Auth ────────────────────────────────────────
  const adminEmail = 'admin@ngo.org';
  const adminPassword = 'Admin@12345';

  let supabaseUid: string;

  const { data: existingUser } = await supabase.auth.admin.listUsers();
  const existing = existingUser?.users.find((u) => u.email === adminEmail);

  if (existing) {
    supabaseUid = existing.id;
    console.log(`  ℹ️  Admin Supabase user already exists: ${adminEmail}`);
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });
    if (error || !data.user) {
      throw new Error(`Failed to create admin Supabase user: ${error?.message}`);
    }
    supabaseUid = data.user.id;
    console.log(`  ✅ Created Supabase admin user: ${adminEmail}`);
  }

  // Upsert admin in our User table
  const admin = await prisma.user.upsert({
    where: { supabaseUid },
    update: {},
    create: {
      supabaseUid,
      email: adminEmail,
      name: 'NGO Administrator',
      role: 'ADMIN',
    },
  });
  console.log(`  ✅ Admin user in DB: ${admin.name}`);

  // ── 2. Five programs ────────────────────────────────────────────────────────
  const programsData = [
    {
      programCode: 'EDU-PUN-2026-01',
      name: 'Community STEM Workshop',
      description: 'Hands-on STEM activities for underprivileged students.',
      category: 'Education',
      location: 'Pune',
      address: 'Model Colony Community Center, Pune',
      startDate: new Date('2026-09-01T09:00:00Z'),
      endDate: new Date('2026-09-01T17:00:00Z'),
      status: 'ACTIVE' as const,
      maxParticipants: 50,
      maxVolunteers: 10,
      coordinatorId: admin.id,
    },
    {
      programCode: 'HLT-MUM-2026-01',
      name: 'Health Awareness Drive',
      description: 'Free health checkups and awareness sessions.',
      category: 'Health',
      location: 'Mumbai',
      address: 'Dharavi Community Hall, Mumbai',
      startDate: new Date('2026-09-15T08:00:00Z'),
      endDate: new Date('2026-09-15T16:00:00Z'),
      status: 'UPCOMING' as const,
      maxParticipants: 100,
      maxVolunteers: 20,
      coordinatorId: admin.id,
    },
    {
      programCode: 'SKL-BLR-2026-01',
      name: 'Digital Literacy Program',
      description: 'Basic computer and internet skills for rural youth.',
      category: 'Skill Development',
      location: 'Bangalore',
      address: 'Rajajinagar NGO Hub, Bangalore',
      startDate: new Date('2026-08-01T09:00:00Z'),
      endDate: new Date('2026-08-30T17:00:00Z'),
      status: 'COMPLETED' as const,
      maxParticipants: 40,
      maxVolunteers: 8,
      coordinatorId: admin.id,
    },
    {
      programCode: 'ENV-DEL-2026-01',
      name: 'Green City Campaign',
      description: 'Tree plantation and environmental awareness.',
      category: 'Environment',
      location: 'Delhi',
      address: 'Lodhi Garden, Delhi',
      startDate: new Date('2026-10-05T07:00:00Z'),
      endDate: new Date('2026-10-05T12:00:00Z'),
      status: 'DRAFT' as const,
      maxParticipants: 200,
      maxVolunteers: 30,
      coordinatorId: admin.id,
    },
    {
      programCode: 'OUT-CHE-2026-01',
      name: 'Rural Outreach Initiative',
      description: 'Community outreach in rural Tamil Nadu.',
      category: 'Outreach',
      location: 'Chennai',
      address: 'Tambaram Outreach Center, Chennai',
      startDate: new Date('2026-07-10T09:00:00Z'),
      endDate: new Date('2026-07-10T17:00:00Z'),
      status: 'CANCELLED' as const,
      maxParticipants: 60,
      maxVolunteers: 12,
      coordinatorId: admin.id,
    },
  ];

  const programs = [];
  for (const p of programsData) {
    const prog = await prisma.program.upsert({
      where: { programCode: p.programCode },
      update: {},
      create: p,
    });
    programs.push(prog);
    console.log(`  ✅ Program: ${prog.name} [${prog.status}]`);
  }

  // ── 3. Twenty participants ──────────────────────────────────────────────────
  const participantNames = [
    'Aarav Sharma', 'Priya Patel', 'Rohit Kumar', 'Sneha Iyer', 'Karan Mehta',
    'Ananya Singh', 'Vijay Nair', 'Pooja Reddy', 'Rahul Gupta', 'Divya Joshi',
    'Arjun Bose', 'Meera Pillai', 'Siddharth Rao', 'Kavya Menon', 'Aditya Desai',
    'Riya Kapoor', 'Pranav Shah', 'Nandini Verma', 'Tarun Bhat', 'Swati Chaudhari',
  ];

  const participants = [];
  for (let i = 0; i < 20; i++) {
    const email = `participant${i + 1}@example.com`;
    const p = await prisma.participant.upsert({
      where: { trackingId: `CPR-PAR-SEED${String(i + 1).padStart(4, '0')}` },
      update: {},
      create: {
        trackingId: `CPR-PAR-SEED${String(i + 1).padStart(4, '0')}`,
        name: participantNames[i],
        email,
        phone: `98${String(1000000 + i * 111111).substring(0, 8)}`,
        location: ['Pune', 'Mumbai', 'Bangalore', 'Delhi', 'Chennai'][i % 5],
        college: `${['VIT', 'BITS', 'IIT', 'NIT', 'MIT'][i % 5]} University`,
        ageOrYear: `${['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'][i % 5]}`,
        areaOfInterest: ['Technology', 'Health', 'Environment', 'Education', 'Social Work'][i % 5],
      },
    });
    participants.push(p);
  }
  console.log(`  ✅ 20 Participants seeded`);

  // ── 4. Ten volunteers ───────────────────────────────────────────────────────
  const volunteerNames = [
    'Aryan Khanna', 'Lavanya Nambiar', 'Dev Malhotra', 'Simran Grewal',
    'Aakash Tiwari', 'Bhavna Choudhary', 'Manish Pandey', 'Kritika Mishra',
    'Sourav Das', 'Harini Krishnan',
  ];

  const volunteers = [];
  for (let i = 0; i < 10; i++) {
    const email = `volunteer${i + 1}@example.com`;
    const v = await prisma.volunteer.upsert({
      where: { trackingId: `CPR-VOL-SEED${String(i + 1).padStart(4, '0')}` },
      update: {},
      create: {
        trackingId: `CPR-VOL-SEED${String(i + 1).padStart(4, '0')}`,
        name: volunteerNames[i],
        email,
        phone: `97${String(1000000 + i * 222222).substring(0, 8)}`,
        location: ['Pune', 'Mumbai', 'Bangalore', 'Delhi', 'Chennai'][i % 5],
        college: `${['VIT', 'BITS', 'IIT', 'NIT', 'MIT'][i % 5]} University`,
        ageOrYear: `${['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'][i % 5]}`,
        areaOfInterest: ['Mentoring', 'Logistics', 'Medical', 'Tech Support', 'Coordination'][i % 5],
        totalHours: [4, 8, 6, 10, 3, 7, 5, 9, 2, 6][i],
      },
    });
    volunteers.push(v);
  }
  console.log(`  ✅ 10 Volunteers seeded`);

  // ── 5. Thirty registrations ─────────────────────────────────────────────────
  const statuses: ('REGISTERED' | 'ATTENDED' | 'PARTICIPATED' | 'COMPLETED')[] = [
    'REGISTERED', 'ATTENDED', 'PARTICIPATED', 'COMPLETED',
  ];

  let regCount = 0;

  // Participants across the first 3 programs
  for (let i = 0; i < 20 && regCount < 25; i++) {
    const prog = programs[i % 3]; // Distribute across first 3 programs
    const status = statuses[i % 4];

    try {
      await prisma.registration.create({
        data: {
          programId: prog.id,
          participantId: participants[i].id,
          registrantType: 'PARTICIPANT',
          status,
          registeredAt: new Date('2026-08-01T10:00:00Z'),
          attendedAt: status !== 'REGISTERED' ? new Date('2026-08-15T10:00:00Z') : null,
          participatedAt: (status === 'PARTICIPATED' || status === 'COMPLETED')
            ? new Date('2026-08-15T14:00:00Z') : null,
          completedAt: status === 'COMPLETED' ? new Date('2026-08-15T17:00:00Z') : null,
        },
      });
      regCount++;
    } catch {
      // Skip if duplicate
    }
  }

  // Volunteers across the first 2 programs
  for (let i = 0; i < 10 && regCount < 30; i++) {
    const prog = programs[i % 2];
    const vStatus = (['REGISTERED', 'ASSIGNED', 'ACTIVE', 'COMPLETED'] as const)[i % 4];
    const rStatus = (['REGISTERED', 'ATTENDED', 'PARTICIPATED', 'COMPLETED'] as const)[i % 4];

    try {
      await prisma.registration.create({
        data: {
          programId: prog.id,
          volunteerId: volunteers[i].id,
          registrantType: 'VOLUNTEER',
          status: rStatus,
          volunteerStatus: vStatus,
          hoursContributed: volunteers[i].totalHours,
          registeredAt: new Date('2026-08-01T10:00:00Z'),
        },
      });
      regCount++;
    } catch {
      // Skip if duplicate
    }
  }
  console.log(`  ✅ ${regCount} Registrations seeded`);

  // ── 6. Ten impact records ───────────────────────────────────────────────────
  for (let i = 0; i < Math.min(5, programs.length); i++) {
    const prog = programs[i];
    const regs = await prisma.registration.findMany({ where: { programId: prog.id } });

    const totalRegistered = regs.length;
    const totalAttended = regs.filter(r =>
      ['ATTENDED', 'PARTICIPATED', 'COMPLETED'].includes(r.status)
    ).length;
    const totalCompleted = regs.filter(r => r.status === 'COMPLETED').length;
    const totalVolunteers = regs.filter(r => r.registrantType === 'VOLUNTEER').length;
    const totalVolunteerHours = regs.reduce((s, r) => s + (r.hoursContributed ?? 0), 0);

    await prisma.impactRecord.create({
      data: {
        programId: prog.id,
        totalRegistered,
        totalAttended,
        totalParticipated: regs.filter(r => ['PARTICIPATED', 'COMPLETED'].includes(r.status)).length,
        totalCompleted,
        totalVolunteers,
        totalVolunteerHours,
        attendanceRate: totalRegistered > 0 ? (totalAttended / totalRegistered) * 100 : 0,
        completionRate: totalRegistered > 0 ? (totalCompleted / totalRegistered) * 100 : 0,
        recordedAt: new Date(),
      },
    });
  }
  console.log(`  ✅ 5 Impact records seeded`);

  console.log('\n🎉 Seed complete!');
  console.log(`\n🔑 Admin login credentials:`);
  console.log(`   Email:    ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
