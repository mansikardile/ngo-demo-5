-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STAFF', 'COORDINATOR');

-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('DRAFT', 'UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('REGISTERED', 'ATTENDED', 'PARTICIPATED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "VolunteerStatus" AS ENUM ('REGISTERED', 'ASSIGNED', 'ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "RegistrantType" AS ENUM ('PARTICIPANT', 'VOLUNTEER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "supabase_uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STAFF',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "program_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "max_participants" INTEGER,
    "max_volunteers" INTEGER,
    "status" "ProgramStatus" NOT NULL DEFAULT 'DRAFT',
    "coordinator_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "tracking_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "college" TEXT,
    "age_or_year" TEXT,
    "area_of_interest" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteers" (
    "id" TEXT NOT NULL,
    "tracking_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "college" TEXT,
    "age_or_year" TEXT,
    "area_of_interest" TEXT,
    "total_hours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "volunteers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registrations" (
    "id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "participant_id" TEXT,
    "volunteer_id" TEXT,
    "registrant_type" "RegistrantType" NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'REGISTERED',
    "volunteer_status" "VolunteerStatus",
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attended_at" TIMESTAMP(3),
    "participated_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "hours_contributed" DOUBLE PRECISION,
    "role" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impact_records" (
    "id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "total_registered" INTEGER NOT NULL DEFAULT 0,
    "total_attended" INTEGER NOT NULL DEFAULT 0,
    "total_participated" INTEGER NOT NULL DEFAULT 0,
    "total_completed" INTEGER NOT NULL DEFAULT 0,
    "total_volunteers" INTEGER NOT NULL DEFAULT 0,
    "total_volunteer_hours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "attendance_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completion_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "impact_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_supabase_uid_key" ON "users"("supabase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "programs_program_code_key" ON "programs"("program_code");

-- CreateIndex
CREATE INDEX "programs_status_idx" ON "programs"("status");

-- CreateIndex
CREATE INDEX "programs_location_idx" ON "programs"("location");

-- CreateIndex
CREATE INDEX "programs_program_code_idx" ON "programs"("program_code");

-- CreateIndex
CREATE UNIQUE INDEX "participants_tracking_id_key" ON "participants"("tracking_id");

-- CreateIndex
CREATE INDEX "participants_email_idx" ON "participants"("email");

-- CreateIndex
CREATE INDEX "participants_tracking_id_idx" ON "participants"("tracking_id");

-- CreateIndex
CREATE UNIQUE INDEX "volunteers_tracking_id_key" ON "volunteers"("tracking_id");

-- CreateIndex
CREATE INDEX "volunteers_email_idx" ON "volunteers"("email");

-- CreateIndex
CREATE INDEX "volunteers_tracking_id_idx" ON "volunteers"("tracking_id");

-- CreateIndex
CREATE INDEX "registrations_program_id_idx" ON "registrations"("program_id");

-- CreateIndex
CREATE INDEX "registrations_participant_id_idx" ON "registrations"("participant_id");

-- CreateIndex
CREATE INDEX "registrations_volunteer_id_idx" ON "registrations"("volunteer_id");

-- CreateIndex
CREATE INDEX "registrations_status_idx" ON "registrations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "registrations_program_id_participant_id_key" ON "registrations"("program_id", "participant_id");

-- CreateIndex
CREATE UNIQUE INDEX "registrations_program_id_volunteer_id_key" ON "registrations"("program_id", "volunteer_id");

-- CreateIndex
CREATE INDEX "impact_records_program_id_idx" ON "impact_records"("program_id");

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_coordinator_id_fkey" FOREIGN KEY ("coordinator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "volunteers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impact_records" ADD CONSTRAINT "impact_records_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
