import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { associationsChecked, associationsSource, type DirectoryAssociation } from "./associationsDirectory";

export default function AssociationDirectoryProfile({ association }: { association: DirectoryAssociation }) {
  return <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 text-[#112d56] shadow-sm sm:p-6">
    <Link href="/sports-development/sports" className="inline-flex items-center gap-2 text-sm font-semibold text-[#155ca7] hover:underline"><ArrowLeft size={16} aria-hidden="true" />Back to Sports &amp; Leisure Associations</Link>
    <h1 className="mt-5 text-2xl font-bold sm:text-3xl">{association.name}</h1>
    <h2 className="mt-6 text-lg font-bold">Published contacts</h2>
    <ul className="mt-3 divide-y divide-[#e5edf8] rounded-xl border border-[#d5e4f6] px-4">{association.contacts.map((line, index) => <li key={`${index}-${line}`} className="break-words py-2.5 text-sm text-[#35557f]">{line}</li>)}</ul>
    <p className="mt-5 text-xs leading-5 text-[#60799f]">Source: <a href={associationsSource} target="_blank" rel="noreferrer" className="font-semibold text-[#155ca7] hover:underline">GSLA Sports &amp; Leisure Directory</a> · Checked {associationsChecked}. Contact details are shown as published.</p>
  </section>;
}
