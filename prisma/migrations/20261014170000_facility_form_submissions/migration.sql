-- GSLA-M2-001: authenticated Facilities operational form submissions.
-- Additive only. Does not replace Facilities approval command migration.
-- The server is the sole writer; direct Data API access stays denied.
CREATE TABLE public.facility_form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id uuid NOT NULL,
  form_id text NOT NULL CHECK (length(trim(form_id)) BETWEEN 1 AND 120),
  form_version integer NOT NULL CHECK (form_version > 0),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  submitted_by uuid NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT facility_form_submission_facility_fk
    FOREIGN KEY (facility_id) REFERENCES public."Facilities Table"(id) ON DELETE RESTRICT
);
CREATE INDEX facility_form_submissions_facility_date_idx
  ON public.facility_form_submissions(facility_id,submitted_at DESC);
CREATE INDEX facility_form_submissions_form_idx
  ON public.facility_form_submissions(form_id,submitted_at DESC);
ALTER TABLE public.facility_form_submissions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.facility_form_submissions FROM PUBLIC, anon, authenticated;
-- Updates and physical deletion deliberately omitted until separate approved role-scoped commands.
