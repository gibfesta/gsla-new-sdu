"use client";
import { useState } from "react";
import Image from "next/image";
import type { Attachment } from "@/lib/facilityWorkflows";

export default function WorkflowAttachments({ label, value, onChange, photosOnly = false, readOnly = false }: { label: string; value: Attachment[]; onChange?: (files: Attachment[]) => void; photosOnly?: boolean; readOnly?: boolean }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function select(files: FileList | null) {
    if (!files || !onChange) return;
    const selected = Array.from(files);
    if (value.length + selected.length > 5) { setError("Attach up to five files per field."); return; }
    const allowed = (file: File) => photosOnly ? ["image/jpeg", "image/png", "image/webp"].includes(file.type) : ["image/jpeg", "image/png", "image/webp", "application/pdf", "text/plain"].includes(file.type);
    if (selected.some(file => !allowed(file) || file.size > 1024 * 1024)) { setError("Use JPEG, PNG or WebP photos" + (photosOnly ? "" : ", PDF or text files") + ", up to 1 MB each for this preview."); return; }
    setBusy(true); setError("");
    try {
      const attachments = await Promise.all(selected.map(file => new Promise<Attachment>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("A file could not be read."));
        reader.onload = () => resolve({ id: crypto.randomUUID(), name: file.name, type: file.type, data: String(reader.result) });
        reader.readAsDataURL(file);
      })));
      onChange([...value, ...attachments]);
    } catch { setError("A file could not be read. Try attaching it again."); }
    finally { setBusy(false); }
  }
  return <div>
    {!readOnly && <label className="block text-sm font-semibold text-[#0C2F57]">{label}<input disabled={busy} type="file" multiple accept={photosOnly ? "image/jpeg,image/png,image/webp" : "image/jpeg,image/png,image/webp,application/pdf,text/plain"} className="mt-2 block w-full rounded-xl border border-slate-200 p-3 text-sm font-normal" onChange={e => { void select(e.target.files); e.target.value = ""; }} /></label>}
    {!readOnly && <p className="mt-1 text-xs text-slate-500">Preview attachments stay in this browser. Up to 5 files, 1 MB each.</p>}
    {busy && <p role="status" className="mt-2 text-sm">Reading attachments…</p>}
    {error && <p role="alert" className="mt-2 text-sm text-rose-700">{error}</p>}
    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{value.map(file => <div key={file.id} className="rounded-xl border border-slate-200 p-3">
      {file.type.startsWith("image/") && /^data:image\/(jpeg|png|webp);base64,/.test(file.data) ? <Image unoptimized src={file.data} alt={file.name} width={400} height={240} className="mb-2 h-36 w-full rounded-lg object-contain" /> : <span className="mb-2 block rounded-lg bg-slate-50 p-5 text-sm">Evidence document</span>}
      <p className="break-all text-xs font-semibold">{file.name}</p>
      {/^(data:image\/(jpeg|png|webp);base64,|data:application\/pdf;base64,|data:text\/plain;base64,)/.test(file.data) && <a className="mt-2 inline-block text-xs font-semibold underline" href={file.data} download={file.name}>Download attachment</a>}
      {!readOnly && onChange && <button type="button" className="mt-2 text-xs font-semibold text-rose-700" onClick={() => onChange(value.filter(item => item.id !== file.id))}>Remove {file.name}</button>}
    </div>)}</div>
  </div>;
}
