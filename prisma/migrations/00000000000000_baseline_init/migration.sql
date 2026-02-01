-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."Facilities Table" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL DEFAULT 'required',
    "type" TEXT NOT NULL DEFAULT 'default:Other',
    "status" TEXT NOT NULL DEFAULT 'default:Operational',
    "address" TEXT NOT NULL DEFAULT 'default',
    "contact email" TEXT NOT NULL,
    "contact phone" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "created _at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Facilities Table_pkey" PRIMARY KEY ("id","name","type","status","address","contact email","contact phone","notes","created _at","updated_at")
);

-- CreateTable
CREATE TABLE "public"."activities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "title" TEXT,
    "date_text" TEXT,
    "time_text" TEXT,
    "location" TEXT,
    "kind" TEXT,
    "role_label" TEXT,
    "status" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."compliance_records" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "label" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "detail" TEXT,
    "completed_on" DATE,
    "expires_on" DATE,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compliance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."courses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "name" TEXT,
    "provider" TEXT,
    "status" TEXT,
    "completed_on" DATE,
    "expires_on" DATE,
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "name" TEXT,
    "uploaded_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "expires_on" DATE,
    "storage_path" TEXT,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."internal_notes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "created_by_label" TEXT DEFAULT 'System',
    "text" TEXT NOT NULL,

    CONSTRAINT "internal_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."membership_teams" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "membership_id" UUID,
    "team_name" TEXT,

    CONSTRAINT "membership_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."memberships" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "sport_name" TEXT,
    "club_name" TEXT,
    "membership_type" TEXT,
    "registration_no" TEXT,
    "season" TEXT,
    "league" TEXT,
    "status" TEXT DEFAULT 'Active',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."profiles" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "preferred_name" TEXT,
    "date_of_birth" DATE,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN DEFAULT false,
    "phone" TEXT,
    "address_text" TEXT,
    "status" TEXT DEFAULT 'Active',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_access_modules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "module_name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_access_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_accounts" (
    "user_id" UUID NOT NULL,
    "username" TEXT,
    "public_user_code" TEXT NOT NULL,
    "created_on" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMPTZ(6),
    "two_fa_enabled" BOOLEAN DEFAULT false,

    CONSTRAINT "user_accounts_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."user_roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "role_name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_sports" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "sport_name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."volunteer_availability" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "availability_label" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "volunteer_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."volunteer_profiles" (
    "user_id" UUID NOT NULL,
    "status" TEXT DEFAULT 'Active',
    "start_date" DATE,
    "renewal_date" DATE,
    "away_events" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "volunteer_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."volunteer_roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "role_name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "volunteer_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "memberships_registration_no_key" ON "public"."memberships"("registration_no" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "user_accounts_public_user_code_key" ON "public"."user_accounts"("public_user_code" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "user_accounts_username_key" ON "public"."user_accounts"("username" ASC);

-- AddForeignKey
ALTER TABLE "public"."activities" ADD CONSTRAINT "activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."compliance_records" ADD CONSTRAINT "compliance_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."internal_notes" ADD CONSTRAINT "internal_notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."membership_teams" ADD CONSTRAINT "membership_teams_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "public"."memberships"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_access_modules" ADD CONSTRAINT "user_access_modules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_accounts" ADD CONSTRAINT "user_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_sports" ADD CONSTRAINT "user_sports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."volunteer_availability" ADD CONSTRAINT "volunteer_availability_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."volunteer_profiles" ADD CONSTRAINT "volunteer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."volunteer_roles" ADD CONSTRAINT "volunteer_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

