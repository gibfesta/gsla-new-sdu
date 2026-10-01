"use client";
import { useMemo, useSyncExternalStore } from "react";
import type { Attachment } from "./facilityWorkflows";
export type DocStatus = "Pending" | "Approved" | "Rejected";
export type ApprovalState = "Pending" | "Approved" | "Not required";
export type Status = "Draft" | "Submitted" | "Approved" | "Completed" | "Cancelled";
export type Category = "Concert" | "Stand-up" | "Community" | "Cultural" | "Other";

export type EventTimes = { prepStart: string; doorsOpen: string; eventStart: string; eventEnd: string; dismantleComplete: string };
export type EventRecord = {
 id: string; facilityId?: string; name: string; category: Category; organiser: string;
 leadOrganiser: { name: string; email: string; phone: string }; location: string; status: Status; quickNotes: string;
 times: EventTimes; venueImpact: { prepStart: string; doorsOpen: string; eventWindow: string; dismantleComplete: string; venueBlocked: string };
 timeline: { at: string; by: string; text: string }[];
 documents: { name: string; owner: string; updated: string; status: DocStatus; notes: string; files: Attachment[]; comments: string }[];
 equipment: { item: string; qty: number; providedBy: string; state: ApprovalState; notes: string }[];
 staffing: { role: string; name: string; status: string }[];
 approvals: { area: string; state: ApprovalState; by: string; at: string }[];
 postEvent: { available: boolean; whatWorked: string; whatDidnt: string; issues: string; recommendations: string };
 internalNotes: { by: string; at: string; text: string }[];
};
// Form structure only: these labels are requirements, not fictional event records.
export function emptyEvent(): EventRecord {
 return { id:"",name:"",category:"Other",organiser:"",leadOrganiser:{name:"",email:"",phone:""},location:"",status:"Draft",quickNotes:"",
 times:{prepStart:"",doorsOpen:"",eventStart:"",eventEnd:"",dismantleComplete:""},venueImpact:{prepStart:"",doorsOpen:"",eventWindow:"",dismantleComplete:"",venueBlocked:""},timeline:[],internalNotes:[],
 documents:["Event Plan / Schedule","Risk Assessment","Safeguarding Plan","Emergency Procedures","Venue Layout / Site Map"].map(name=>({name,owner:"",updated:"",status:"Pending",notes:"",files:[],comments:""})),
 equipment:["Stage / risers","PA system","Tables / stalls","Barriers / crowd control"].map(item=>({item,qty:0,providedBy:"",state:"Pending",notes:""})),
 staffing:["Event Lead","Venue Liaison","Safeguarding Officer","First Aid Cover","Setup / Teardown"].map(role=>({role,name:"",status:"Pending"})),
 approvals:["Safeguarding","Facilities / Venue","Equipment","Final Sign-off"].map(area=>({area,state:"Pending",by:"",at:""})),
 postEvent:{available:false,whatWorked:"",whatDidnt:"",issues:"",recommendations:""} };
}
// Hide old demonstration IDs without deleting browser entries or user-created records.
const demoIds = new Set(["evt-101", "evt-102", "evt-103", "evt-104"]);
export function readSavedEvents(raw: string): EventRecord[] {
 try { const saved: unknown = JSON.parse(raw || "{}");
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) return [];
  return Object.values(saved).filter((record): record is EventRecord => !!record && typeof record === "object" && "id" in record && typeof record.id === "string" && !demoIds.has(record.id) && "times" in record && !!record.times).map(completeEvent);
 } catch { return []; }
}
export function eventRegisterEntry(event: EventRecord) {
 const [venue, ...spaces] = event.location.split(/\s*[•·]\s*/);
 const date = event.times.eventStart ? new Intl.DateTimeFormat("en-GB", { day:"numeric",month:"short",year:"numeric",timeZone:"UTC" }).format(new Date(event.times.eventStart.slice(0,10)+"T12:00:00Z")) : "Not set";
 return { id:event.id,name:event.name,organiser:event.organiser,category:event.category,status:event.status,venue:venue || "Not set",venueId:event.facilityId || venue,date,impact:[spaces.join(" · "),blockedTime(event.times)].filter(Boolean).join(" · ") };
}
// Convert Gibraltar local wall-clock inputs into instants, including daylight-saving changes.
export function eventTimestamp(value:string) {
 if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return NaN;
 const target=Date.parse(value+"Z"); if(!Number.isFinite(target))return NaN;
 const formatter=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Gibraltar",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});
 const local=(instant:number)=>{const parts=Object.fromEntries(formatter.formatToParts(instant).map(p=>[p.type,p.value]));return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;};
 let instant=target;
 for(let i=0;i<3;i++) instant+=target-Date.parse(local(instant)+"Z");
 return local(instant)===value?instant:NaN;
}
function minutes(value:string) {return eventTimestamp(value)/60000;}
export function blockedTime(times:EventTimes) {
 if(!times.prepStart || !times.dismantleComplete) return "Not set";
 const total=minutes(times.dismantleComplete)-minutes(times.prepStart);
 return total < 0 ? "Check event times" : `${Math.floor(total/60)}h${total%60 ? ` ${total%60}m` : ""} (prep → dismantle)`;
}
export function completeEvent(event:EventRecord): EventRecord {
 const t=event.times;
 // Display entered local date/time verbatim: no browser locale conversion.
 const label=(v:string)=>v ? `${v.slice(0,10)} · ${v.slice(11,16)}` : "Not set";
 return {...event,venueImpact:{prepStart:label(t.prepStart),doorsOpen:label(t.doorsOpen),eventWindow:`${label(t.eventStart)} → ${label(t.eventEnd)}`,dismantleComplete:label(t.dismantleComplete),venueBlocked:blockedTime(t)}};
}
export function validateEvent(event:EventRecord): string {
 if(!event.name.trim()) return "Enter the event name.";
 if(!event.location.trim()) return "Enter the venue and space.";
 if(!event.organiser.trim()) return "Enter the organiser.";
 if(event.leadOrganiser.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.leadOrganiser.email)) return "Enter a valid lead organiser email.";
 const values=Object.values(event.times);
 if(values.some(v=>!v)) return "Enter all five venue impact dates and times.";
 if(values.some(v=>!Number.isFinite(minutes(v)))) return "Enter valid dates and times.";
 if(values.some((v,i)=>i>0 && minutes(v)<minutes(values[i-1]))) return "Times must follow: prep start, doors open, event start, event end, dismantle complete.";
 if(event.times.eventStart===event.times.eventEnd) return "Event end must be after event start.";
 if(event.equipment.some(e=>!Number.isInteger(e.qty)||e.qty<0)) return "Equipment quantities must be whole numbers of zero or more.";
 return "";
}
const key="gsla-event-page-design-v1";
const change="gsla-event-page-change";
function subscribe(callback:()=>void) { window.addEventListener("storage",callback);window.addEventListener(change,callback);return()=>{window.removeEventListener("storage",callback);window.removeEventListener(change,callback)}; }
function snapshot() { try {return localStorage.getItem(key)||"{}";} catch {return "{}";} }
export function useEventRecords() {
 const raw=useSyncExternalStore(subscribe,snapshot,()=>"");
 const records=useMemo(()=>readSavedEvents(raw),[raw]);
 return {records,ready:raw!==""};
}
export function saveEventRecord(event:EventRecord) {
 const stored=JSON.parse(localStorage.getItem(key)||"{}");
 localStorage.setItem(key,JSON.stringify({...stored,[event.id]:completeEvent(event)}));
 window.dispatchEvent(new Event(change));
}
