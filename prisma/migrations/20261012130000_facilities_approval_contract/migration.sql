-- GSLA-M1-010: additive, guarded Facilities approval contract.
-- Prisma-managed migration: apply in staging first, after verified backup and inventory.
-- Do not run application workflow writes until backend commands are deployed.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

DO $$
BEGIN
 IF EXISTS (SELECT id FROM public."Facilities Table" GROUP BY id HAVING count(*) > 1) THEN
  RAISE EXCEPTION 'Duplicate Facilities UUIDs; reconcile manually before migrating';
 END IF;
 IF EXISTS (
   SELECT 1 FROM pg_constraint
   WHERE contype='f' AND confrelid='public."Facilities Table"'::regclass
 ) THEN
  RAISE EXCEPTION 'Existing foreign keys reference the composite Facilities PK; migration needs dependency review';
 END IF;
END $$;

-- Preserve the original UUIDs and every row. Never regenerate facility identities.
ALTER TABLE public."Facilities Table" DROP CONSTRAINT "Facilities Table_pkey";
ALTER TABLE public."Facilities Table" ADD CONSTRAINT "Facilities Table_pkey" PRIMARY KEY (id);
ALTER TABLE public."Facilities Table"
 ADD COLUMN approval_state text NOT NULL DEFAULT 'DRAFT',
 ADD COLUMN lifecycle_state text NOT NULL DEFAULT 'ACTIVE',
 ADD COLUMN record_version integer NOT NULL DEFAULT 1,
 ADD COLUMN content_version integer NOT NULL DEFAULT 1,
 ADD COLUMN approved_content_version integer,
 ADD COLUMN pending_request_id uuid,
 ADD COLUMN initial_approval_request_id uuid,
 ADD COLUMN archived_at timestamptz,
 ADD COLUMN archived_by uuid,
 ADD COLUMN migration_origin text,
 ADD CONSTRAINT facilities_approval_state_ck CHECK (approval_state IN ('DRAFT','PENDING_APPROVAL','CHANGES_REQUESTED','REJECTED','APPROVED','LEGACY_UNVERIFIED')),
 ADD CONSTRAINT facilities_lifecycle_state_ck CHECK (lifecycle_state IN ('ACTIVE','ARCHIVED')),
 ADD CONSTRAINT facilities_versions_ck CHECK (record_version > 0 AND content_version > 0 AND (approved_content_version IS NULL OR approved_content_version BETWEEN 1 AND content_version)),
 ADD CONSTRAINT facilities_archive_evidence_ck CHECK (
  (lifecycle_state='ACTIVE' AND archived_at IS NULL AND archived_by IS NULL) OR
  (lifecycle_state='ARCHIVED' AND approval_state='APPROVED' AND archived_at IS NOT NULL AND archived_by IS NOT NULL)
 ),
 ADD CONSTRAINT facilities_approved_evidence_ck CHECK (
  (approval_state='APPROVED' AND approved_content_version IS NOT NULL AND initial_approval_request_id IS NOT NULL)
  OR (approval_state <> 'APPROVED' AND approved_content_version IS NULL AND initial_approval_request_id IS NULL)
 );

-- Existing rows are UNVERIFIED, not magically approved.
UPDATE public."Facilities Table"
SET approval_state='LEGACY_UNVERIFIED', migration_origin='GSLA-M1-010:existing-record-no-verified-approval'
WHERE migration_origin IS NULL;

CREATE TABLE public.facility_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 facility_id uuid NOT NULL REFERENCES public."Facilities Table"(id) ON DELETE RESTRICT,
 kind text NOT NULL CHECK (kind IN ('INITIAL_APPROVAL','ARCHIVE')),
 state text NOT NULL DEFAULT 'PENDING' CHECK (state IN ('PENDING','RETURNED','REJECTED','WITHDRAWN','APPROVED','SUPERSEDED')),
 request_version integer NOT NULL DEFAULT 1 CHECK (request_version > 0),
 submitted_content_version integer NOT NULL CHECK (submitted_content_version > 0),
 snapshot jsonb NOT NULL CHECK (jsonb_typeof(snapshot)='object'),
 validation_version text NOT NULL,
 submitted_by uuid NOT NULL,
 submitted_at timestamptz NOT NULL DEFAULT now(),
 submission_reason text,
 decided_by uuid,
 decided_at timestamptz,
 decision_reason text,
 policy_version text NOT NULL DEFAULT 'v0.2',
 command_id uuid NOT NULL UNIQUE,
 CONSTRAINT facility_request_decision_ck CHECK (
  (state='PENDING' AND decided_by IS NULL AND decided_at IS NULL)
  OR (state <> 'PENDING' AND decided_by IS NOT NULL AND decided_at IS NOT NULL)
 ),
 CONSTRAINT facility_request_reason_ck CHECK (
  state NOT IN ('RETURNED','REJECTED') OR nullif(btrim(decision_reason),'') IS NOT NULL
 ),
 CONSTRAINT facility_request_archive_reason_ck CHECK (
  kind <> 'ARCHIVE' OR nullif(btrim(submission_reason),'') IS NOT NULL
 ),
 UNIQUE(facility_id,id),
 UNIQUE(facility_id,id,kind)
);
CREATE UNIQUE INDEX facility_one_pending_request ON public.facility_requests(facility_id) WHERE state='PENDING';
CREATE INDEX facility_request_queue ON public.facility_requests(state,kind,submitted_at) WHERE state='PENDING';
CREATE INDEX facility_request_history ON public.facility_requests(facility_id,submitted_at DESC);

ALTER TABLE public."Facilities Table"
 ADD CONSTRAINT facilities_pending_request_fk FOREIGN KEY (id,pending_request_id) REFERENCES public.facility_requests(facility_id,id) DEFERRABLE INITIALLY DEFERRED,
 ADD CONSTRAINT facilities_initial_approval_fk FOREIGN KEY (id,initial_approval_request_id) REFERENCES public.facility_requests(facility_id,id) DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE public.facility_revisions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 facility_id uuid NOT NULL REFERENCES public."Facilities Table"(id) ON DELETE RESTRICT,
 content_version integer NOT NULL CHECK (content_version > 0),
 information jsonb NOT NULL CHECK (jsonb_typeof(information)='object'),
 actor_id uuid,
 actor_role text,
 recorded_at timestamptz NOT NULL DEFAULT now(),
 command_id uuid NOT NULL,
 source text NOT NULL DEFAULT 'COMMAND',
 UNIQUE(facility_id,content_version),
 UNIQUE(command_id)
);
CREATE INDEX facility_revisions_recent ON public.facility_revisions(facility_id,recorded_at DESC);

CREATE TABLE public.facility_audit_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 facility_id uuid NOT NULL REFERENCES public."Facilities Table"(id) ON DELETE RESTRICT,
 request_id uuid,
 revision_id uuid REFERENCES public.facility_revisions(id) ON DELETE RESTRICT,
 action text NOT NULL,
 before_state jsonb,
 after_state jsonb NOT NULL,
 record_version integer NOT NULL CHECK (record_version>0),
 content_version integer NOT NULL CHECK (content_version>0),
 actor_id uuid,
 actor_role text,
 reason text,
 policy_version text NOT NULL DEFAULT 'v0.2',
 validation_version text,
 command_id uuid NOT NULL UNIQUE,
 occurred_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT facility_audit_request_fk FOREIGN KEY (facility_id,request_id) REFERENCES public.facility_requests(facility_id,id) ON DELETE RESTRICT
);
CREATE INDEX facility_audit_recent ON public.facility_audit_events(facility_id,occurred_at DESC);

-- Retain historical actors' UUIDs even when their accounts are deactivated or deleted.
-- No cascading author/user foreign keys are introduced.
CREATE FUNCTION public.facility_history_no_mutation() RETURNS trigger LANGUAGE plpgsql
SET search_path = pg_catalog AS $$
BEGIN
 RAISE EXCEPTION 'Facility historical evidence is append-only';
END $$;
CREATE TRIGGER facility_revisions_append_only BEFORE UPDATE OR DELETE ON public.facility_revisions
FOR EACH ROW EXECUTE FUNCTION public.facility_history_no_mutation();
CREATE TRIGGER facility_audit_append_only BEFORE UPDATE OR DELETE ON public.facility_audit_events
FOR EACH ROW EXECUTE FUNCTION public.facility_history_no_mutation();

-- Request identity and submitted evidence remain immutable; final decision may be recorded once.
CREATE FUNCTION public.facility_request_evidence_guard() RETURNS trigger LANGUAGE plpgsql
SET search_path=pg_catalog AS $$
BEGIN
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'Facility request deletion prohibited'; END IF;
 IF (NEW.id,NEW.facility_id,NEW.kind,NEW.submitted_content_version,NEW.snapshot,NEW.validation_version,
     NEW.submitted_by,NEW.submitted_at,NEW.submission_reason,NEW.policy_version,NEW.command_id)
 IS DISTINCT FROM
    (OLD.id,OLD.facility_id,OLD.kind,OLD.submitted_content_version,OLD.snapshot,OLD.validation_version,
     OLD.submitted_by,OLD.submitted_at,OLD.submission_reason,OLD.policy_version,OLD.command_id)
 THEN RAISE EXCEPTION 'Submitted request evidence cannot be modified'; END IF;
 IF OLD.state <> 'PENDING' OR NEW.state = 'PENDING'
   OR NEW.request_version <> OLD.request_version + 1 THEN
  RAISE EXCEPTION 'Invalid request terminal transition/version';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER facility_requests_evidence_guard BEFORE UPDATE OR DELETE ON public.facility_requests
FOR EACH ROW EXECUTE FUNCTION public.facility_request_evidence_guard();

-- Deletion is not archival, including through privileged Prisma paths.
CREATE FUNCTION public.facility_no_delete() RETURNS trigger LANGUAGE plpgsql
SET search_path=pg_catalog AS $$
BEGIN RAISE EXCEPTION 'Facilities cannot be physically deleted; archive via approved workflow'; END $$;
CREATE TRIGGER facility_no_delete BEFORE DELETE ON public."Facilities Table"
FOR EACH ROW EXECUTE FUNCTION public.facility_no_delete();

ALTER TABLE public.facility_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_audit_events ENABLE ROW LEVEL SECURITY;
-- No browser/Data API workflow writes: privileged server commands only, reviewed separately.
REVOKE ALL ON public.facility_requests,public.facility_revisions,public.facility_audit_events FROM PUBLIC,anon,authenticated;
REVOKE DELETE,TRUNCATE ON public."Facilities Table" FROM anon,authenticated,service_role;
COMMIT;
