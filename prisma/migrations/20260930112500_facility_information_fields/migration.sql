ALTER TABLE "Facilities Table"
  ADD COLUMN "area" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "description" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "centre_manager_name" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "centre_manager_title" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "centre_manager_email" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "centre_manager_phone" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "facilities_manager_name" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "facilities_manager_email" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "supported_activities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
