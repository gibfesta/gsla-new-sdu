import { facilityFormId } from "./facilityFormIds";

type OperationalEvidence = {
 state: "live" | "not-live";
 evidence: string;
 checkedAt: string;
};

// Reviewed end-to-end results only, keyed by immutable GSLA-FRM ID.
// Add a dated receipt reference after testing submission, database persistence,
// reload and applicable permissions on the target deployment. Connection alone
// and browser-local catalogue saves do not establish Live status.
const verifiedResults: Readonly<Record<string, OperationalEvidence>> = {};

export function facilityFormOperationalStatus(catalogueId: string): {
 state: "live" | "not-live" | "not-verified";
 evidence: string;
} {
 const id = facilityFormId(catalogueId);
 const result = id ? verifiedResults[id] : undefined;
 return result && result.evidence.trim() && result.checkedAt
  ? result
  : { state: "not-verified", evidence: "End-to-end submission, database saving and reloading have not yet been verified for this form." };
}
