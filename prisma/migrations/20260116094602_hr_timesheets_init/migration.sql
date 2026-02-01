-- CreateEnum
CREATE TYPE "TimesheetWeekStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'RETURNED', 'LOCKED', 'SENT');

-- CreateEnum
CREATE TYPE "TimesheetReasonCode" AS ENUM ('AS_ROTA', 'ROTA_CHANGE', 'OVERTIME', 'SICK_COVER', 'SICK_LEAVE', 'ANNUAL_LEAVE', 'UNPAID_LEAVE', 'OTHER');

-- CreateTable
CREATE TABLE "timesheet_week_packs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "facility_id" UUID NOT NULL,
    "week_start" DATE NOT NULL,
    "week_end" DATE NOT NULL,
    "status" "TimesheetWeekStatus" NOT NULL DEFAULT 'DRAFT',
    "submitted_by" UUID,
    "submitted_at" TIMESTAMPTZ(6),
    "approved_by" UUID,
    "approved_at" TIMESTAMPTZ(6),
    "locked_by" UUID,
    "locked_at" TIMESTAMPTZ(6),
    "sent_to_treasury_by" UUID,
    "sent_to_treasury_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timesheet_week_packs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timesheet_shift_entries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "week_pack_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "staff_user_id" UUID,
    "staff_label" TEXT NOT NULL,
    "role_label" TEXT,
    "planned_start" TEXT,
    "planned_end" TEXT,
    "actual_start" TEXT NOT NULL,
    "actual_end" TEXT NOT NULL,
    "reason" "TimesheetReasonCode" NOT NULL DEFAULT 'AS_ROTA',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timesheet_shift_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timesheet_audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "week_pack_id" UUID NOT NULL,
    "actor_user_id" UUID,
    "actor_label" TEXT DEFAULT 'System',
    "action" TEXT NOT NULL,
    "detail" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timesheet_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "timesheet_week_packs_facility_id_week_start_key" ON "timesheet_week_packs"("facility_id", "week_start");

-- CreateIndex
CREATE INDEX "timesheet_shift_entries_week_pack_id_date_idx" ON "timesheet_shift_entries"("week_pack_id", "date");

-- CreateIndex
CREATE INDEX "timesheet_audit_logs_week_pack_id_created_at_idx" ON "timesheet_audit_logs"("week_pack_id", "created_at");

-- AddForeignKey
ALTER TABLE "timesheet_shift_entries" ADD CONSTRAINT "timesheet_shift_entries_week_pack_id_fkey" FOREIGN KEY ("week_pack_id") REFERENCES "timesheet_week_packs"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "timesheet_audit_logs" ADD CONSTRAINT "timesheet_audit_logs_week_pack_id_fkey" FOREIGN KEY ("week_pack_id") REFERENCES "timesheet_week_packs"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
