import identities from "@/config/form-control/form-ids.json";

// Match immutable definition identities, never titles, display order or venue IDs.
const templatePrefix = "facilities.template.";
const catalogueIds = new Map(
  identities.assignments
    .filter(item => item.formId.startsWith(templatePrefix))
    .map(item => [item.formId.slice(templatePrefix.length), item.ownerFormId]),
);

export function facilityFormId(catalogueId: string): string | undefined {
  return catalogueIds.get(catalogueId);
}
