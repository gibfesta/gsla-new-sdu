import FacilitiesDepartmentBanner from "./FacilitiesDepartmentBanner";

export default function VenueBanner({ title, description, eyebrow, details }: {
  title: string;
  description: string;
  eyebrow?: string;
  details?: React.ReactNode;
}) {
  return <FacilitiesDepartmentBanner title={title} description={description} eyebrow={eyebrow} details={details} tone="light" />;
}
