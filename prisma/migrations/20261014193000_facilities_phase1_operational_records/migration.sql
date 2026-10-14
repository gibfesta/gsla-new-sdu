-- GSLA-M2-001: approved Phase 1 Facilities operational domain storage.
-- Source: approved Facilities Phase 1 register; EventEditor/EventRecord and workflow templates.
-- Run only AFTER GSLA-M1-010 canonical Facilities UUID PK migration.
-- Dedicated Events/Issues/AM-PM Handovers; not generic form-submission replacements.
-- No role grants: protected server commands must authenticate and authorize per approved v0.2.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

DO $$
BEGIN
 IF NOT EXISTS (
   SELECT 1 FROM pg_constraint WHERE conrelid='public."Facilities Table"'::regclass
     AND contype='p' AND pg_get_constraintdef(oid)='PRIMARY KEY (id)'
 ) THEN RAISE EXCEPTION 'M1-010 UUID primary key required before M2-001 domain migration'; END IF;
END $$;

CREATE TABLE public.facility_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 facility_id uuid NOT NULL REFERENCES public."Facilities Table"(id) ON DELETE RESTRICT,
 name text NOT NULL CHECK (length(btrim(name)) BETWEEN 1 AND 250),
 category text NOT NULL CHECK (category IN ('Concert','Stand-up','Community','Cultural','Other')),
 location text NOT NULL CHECK (length(btrim(location)) > 0),
 organiser text NOT NULL CHECK (length(btrim(organiser)) > 0),
 lead_organiser_name text NOT NULL DEFAULT '',
 lead_organiser_email text NOT NULL DEFAULT '',
 lead_organiser_phone text NOT NULL DEFAULT '',
 summary text NOT NULL DEFAULT '',
 prep_start timestamptz NOT NULL,
 doors_open timestamptz NOT NULL,
 event_start timestamptz NOT NULL,
 event_end timestamptz NOT NULL,
 dismantle_complete timestamptz NOT NULL,
 state text NOT NULL DEFAULT 'Draft'
   CHECK (state IN ('Draft','Submitted','Approved','Completed','Cancelled')),
 -- Auxiliary source form content (staffing, documents, equipment, notes) is retained
 -- without treating JSON state or typed-in sign-offs as authoritative approval evidence.
 details jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(details)='object'),
 record_version integer NOT NULL DEFAULT 1 CHECK (record_version > 0),
 created_by uuid NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_by uuid NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT facility_events_time_order CHECK (
 prep_start <= doors_open AND doors_open <= event_start
 AND event_start < event_end AND event_end <= dismantle_complete
 ),
 UNIQUE (facility_id,id)
);
CREATE INDEX facility_events_venue_window_idx ON public.facility_events(facility_id,event_start,event_end);
CREATE INDEX facility_events_review_idx ON public.facility_events(state,created_at DESC);

CREATE TABLE public.facility_issues (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 facility_id uuid NOT NULL REFERENCES public."Facilities Table"(id) ON DELETE RESTRICT,
 title text NOT NULL CHECK (length(btrim(title)) BETWEEN 1 AND 250),
 category text NOT NULL CHECK (category IN ('Maintenance','Safety','Security','Cleaning','Equipment','Other')),
 location text NOT NULL CHECK (length(btrim(location)) > 0),
 description text NOT NULL CHECK (length(btrim(description)) > 0),
 priority text NOT NULL CHECK (priority IN ('Low','Medium','High','Urgent')),
 immediate_action text NOT NULL DEFAULT '',
 state text NOT NULL DEFAULT 'New'
   CHECK (state IN ('New','Reviewed','In Progress','Resolved','Closed')),
 evidence jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(evidence)='object'),
 record_version integer NOT NULL DEFAULT 1 CHECK (record_version > 0),
 reported_by uuid NOT NULL,
 reported_at timestamptz NOT NULL DEFAULT now(),
 updated_by uuid NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE (facility_id,id)
);
CREATE INDEX facility_issues_facility_priority_idx ON public.facility_issues(facility_id,state,priority,reported_at DESC);

-- Two explicitly approved daily handover records: AM and PM.
-- Workflow content from accepted handover template; not confused with old
-- "Afternoon"/"Night" source template names.
CREATE TABLE public.facility_handovers (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 facility_id uuid NOT NULL REFERENCES public."Facilities Table"(id) ON DELETE RESTRICT,
 duty_date date NOT NULL,
 period text NOT NULL CHECK (period IN ('AM','PM')),
 shift_summary text NOT NULL CHECK (length(btrim(shift_summary))>0),
 risks text NOT NULL DEFAULT '',
 actions_required text NOT NULL DEFAULT '',
 manager_message text NOT NULL DEFAULT '',
 incoming_shift_acknowledged boolean NOT NULL DEFAULT false,
 submitted_by uuid NOT NULL,
 submitted_at timestamptz NOT NULL DEFAULT now(),
 record_version integer NOT NULL DEFAULT 1 CHECK (record_version > 0),
 updated_by uuid NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT facility_one_daily_handover UNIQUE(facility_id,duty_date,period),
 UNIQUE (facility_id,id)
);
CREATE INDEX facility_handovers_recent_idx ON public.facility_handovers(facility_id,duty_date DESC,period);

-- Append-only change evidence from server commands, no user-offboarding cascade.
CREATE TABLE public.facility_operational_audit (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 facility_id uuid NOT NULL REFERENCES public."Facilities Table"(id) ON DELETE RESTRICT,
 record_kind text NOT NULL CHECK(record_kind IN ('EVENT','ISSUE','HANDOVER')),
 record_id uuid NOT NULL,
 action text NOT NULL,
 record_version integer NOT NULL CHECK(record_version>0),
 before_data jsonb,
 after_data jsonb NOT NULL CHECK(jsonb_typeof(after_data)='object'),
 actor_id uuid NOT NULL,
 effective_role text NOT NULL,
 command_id uuid NOT NULL UNIQUE,
 occurred_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT facility_operational_audit_source_ck CHECK(before_data IS NULL OR jsonb_typeof(before_data)='object')
);
CREATE INDEX facility_operational_audit_facility_idx ON public.facility_operational_audit(facility_id,occurred_at DESC);
CREATE FUNCTION public.facility_operational_audit_append_only() RETURNS trigger
LANGUAGE plpgsql SET search_path=pg_catalog AS $$
BEGIN
 RAISE EXCEPTION 'Operational history is append-only';
END $$;
CREATE TRIGGER facility_operational_audit_no_modify
BEFORE UPDATE OR DELETE ON public.facility_operational_audit
FOR EACH ROW EXECUTE FUNCTION public.facility_operational_audit_append_only();

ALTER TABLE public.facility_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_handovers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_operational_audit ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.facility_events,public.facility_issues,
 public.facility_handovers,public.facility_operational_audit FROM PUBLIC,anon,authenticated;

-- New operational work must only be linked to approved and active venues.
-- FOR SHARE serializes eligibility check against concurrent lifecycle updates.
CREATE FUNCTION public.facility_operational_eligibility_guard() RETURNS trigger
LANGUAGE plpgsql SET search_path=pg_catalog AS $eligibility$
DECLARE eligible boolean;
BEGIN
 IF TG_OP='UPDATE' THEN
   IF NEW.facility_id IS DISTINCT FROM OLD.facility_id THEN
      RAISE EXCEPTION 'Operational record facility identity is immutable';
   END IF;
   RETURN NEW;
 END IF;
 SELECT (approval_state='APPROVED' AND lifecycle_state='ACTIVE')
 INTO eligible
 FROM public."Facilities Table"
 WHERE id=NEW.facility_id FOR SHARE;
 IF NOT COALESCE(eligible,false) THEN
   RAISE EXCEPTION 'New operational records require an approved active facility';
 END IF;
 IF TG_TABLE_NAME='facility_events' AND NEW.state <> 'Draft' THEN
   RAISE EXCEPTION 'New events must be created as Draft; approval is a separate command';
 END IF;
 RETURN NEW;
END $eligibility$;
CREATE TRIGGER facility_event_eligibility
BEFORE INSERT OR UPDATE OF facility_id ON public.facility_events
FOR EACH ROW EXECUTE FUNCTION public.facility_operational_eligibility_guard();
CREATE TRIGGER facility_issue_eligibility
BEFORE INSERT OR UPDATE OF facility_id ON public.facility_issues
FOR EACH ROW EXECUTE FUNCTION public.facility_operational_eligibility_guard();
CREATE TRIGGER facility_handover_eligibility
BEFORE INSERT OR UPDATE OF facility_id ON public.facility_handovers
FOR EACH ROW EXECUTE FUNCTION public.facility_operational_eligibility_guard();

COMMIT;
