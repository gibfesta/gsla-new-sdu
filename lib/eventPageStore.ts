"use client";
import { useMemo, useSyncExternalStore } from "react";
import type { Attachment } from "./facilityWorkflows";
export type DocStatus = "Pending" | "Approved" | "Rejected";
export type ApprovalState = "Pending" | "Approved" | "Not required";
export type Status = "Draft" | "Submitted" | "Approved" | "Completed" | "Cancelled";
export type Category = "Concert" | "Stand-up" | "Community" | "Cultural" | "Other";


function seedEvent(eventId: string) {
    const isStandUp = eventId === "evt-101";
    const isConcert = eventId === "evt-102";
    const isMarket = eventId === "evt-103";
    const isCultural = eventId === "evt-104";

    const status: Status = isCultural ? "Completed" : isConcert ? "Approved" : isMarket ? "Draft" : "Submitted";
    const category: Category = isConcert ? "Concert" : isStandUp ? "Stand-up" : isCultural ? "Cultural" : "Community";

    return {
      id: eventId,
      name: isStandUp
        ? "Friday Night Stand-Up Showcase"
        : isConcert
          ? "Community Winter Concert"
          : isCultural
            ? "Cultural Evening: Dance & Food"
            : "Local Makers Market",
      category,
      organiser: isStandUp
        ? "Community Arts Collective"
        : isConcert
          ? "Gibraltar Music Group"
          : isCultural
            ? "Cultural Exchange Network"
            : "Neighbourhood Partnership",
      leadOrganiser: {
        name: "Alex Morgan",
        email: "alex.morgan@example.com",
        phone: "+350 55555",
      },
      location: isMarket
        ? "Europa Sports Complex • Outdoor Area"
        : "Europa Sports Complex • Main Hall",
      status,
      quickNotes:
        "Operations record capturing plans, approvals, logistics, and learnings — so repeat events become easier, faster, and more predictable.",

      venueImpact: {
        prepStart: isConcert
          ? "Sat 24 Jan 2026 • 10:00"
          : isStandUp
            ? "Fri 16 Jan 2026 • 14:00"
            : isCultural
              ? "Sat 06 Dec 2025 • 12:00"
              : "Sun 01 Feb 2026 • 07:00",
        doorsOpen: isConcert
          ? "Sat 24 Jan 2026 • 18:30"
          : isStandUp
            ? "Fri 16 Jan 2026 • 19:00"
            : isCultural
              ? "Sat 06 Dec 2025 • 17:30"
              : "Sun 01 Feb 2026 • 09:30",
        eventWindow: isConcert
          ? "Sat 24 Jan 2026 • 19:30–22:00"
          : isStandUp
            ? "Fri 16 Jan 2026 • 20:00–22:15"
            : isCultural
              ? "Sat 06 Dec 2025 • 18:00–23:00"
              : "Sun 01 Feb 2026 • 10:00–15:00",
        dismantleComplete: isConcert
          ? "Sun 25 Jan 2026 • 02:00"
          : isStandUp
            ? "Sat 17 Jan 2026 • 00:30"
            : isCultural
              ? "Sun 07 Dec 2025 • 01:00"
              : "Sun 01 Feb 2026 • 18:00",
        venueBlocked: isConcert
          ? "16h (prep → dismantle)"
          : isStandUp
            ? "10h 30m (prep → dismantle)"
            : isCultural
              ? "13h (prep → dismantle)"
              : "11h (prep → dismantle)",
      },

      timeline: [
        { at: "2025-12-01 09:12", by: "Organiser", text: "Event record created (Draft)." },
        { at: "2025-12-03 16:30", by: "Organiser", text: "Risk assessment uploaded." },
        { at: "2025-12-05 10:05", by: "Organiser", text: "Equipment request submitted." },
        { at: "2025-12-06 14:20", by: "GSLA", text: "Requested clarification on venue layout / access." },
        { at: "2025-12-07 09:40", by: "Organiser", text: "Updated site map uploaded." },
        { at: "2025-12-08 15:10", by: "GSLA", text: "Safeguarding approval granted." },
      ],

      documents: [
        { name: "Event Plan / Schedule", owner: "Organiser", updated: "2025-12-02", status: (isMarket ? "Pending" : "Pending") as DocStatus, notes: "Draft schedule included." },
        { name: "Risk Assessment", owner: "Organiser", updated: "2025-12-03", status: (isConcert || isCultural ? "Approved" : "Pending") as DocStatus, notes: "Baseline covered; confirm crowd flow." },
        { name: "Safeguarding Plan", owner: "Organiser", updated: "2025-12-04", status: (isConcert || isCultural ? "Approved" : "Pending") as DocStatus, notes: "Named safeguarding lead / procedures." },
        { name: "Emergency Procedures", owner: "Organiser", updated: "2025-12-04", status: "Pending" as DocStatus, notes: "Add ambulance access point + steward brief." },
        { name: "Venue Layout / Site Map", owner: "Organiser", updated: "2025-12-07", status: "Pending" as DocStatus, notes: "Updated after GSLA feedback." },
      ],

      equipment: [
        { item: "Stage / risers", qty: isMarket ? 0 : 1, providedBy: "External", state: isMarket ? "Not required" as ApprovalState : "Pending" as ApprovalState, notes: isMarket ? "Not needed for market stalls." : "Confirm supplier + delivery window." },
        { item: "PA system", qty: isMarket ? 0 : 1, providedBy: "GSLA", state: isConcert ? "Approved" as ApprovalState : isCultural ? "Approved" as ApprovalState : isMarket ? "Not required" as ApprovalState : "Pending" as ApprovalState, notes: isMarket ? "Not required." : "May require booking (avoid clashes)." },
        { item: "Tables / stalls", qty: isMarket ? 30 : 0, providedBy: "Organiser", state: isMarket ? "Pending" as ApprovalState : "Not required" as ApprovalState, notes: isMarket ? "Confirm count + delivery timing." : "N/A." },
        { item: "Barriers / crowd control", qty: isMarket ? 10 : 20, providedBy: "GSLA", state: "Pending" as ApprovalState, notes: "Confirm required count based on layout." },
      ],

      staffing: [
        { role: "Event Lead", name: "Alex Morgan", status: "Confirmed" },
        { role: "Venue Liaison", name: "GSLA Duty Manager (TBC)", status: "Pending" },
        { role: "Safeguarding Officer", name: "TBC", status: isCultural ? "Confirmed" : "Pending" },
        { role: "First Aid Cover", name: "Jordan Lee", status: isConcert || isCultural ? "Confirmed" : "Pending" },
        { role: "Setup / Teardown", name: "Volunteer team", status: isCultural ? "Confirmed" : "Pending" },
      ],

      approvals: [
        { area: "Safeguarding", state: (isConcert || isCultural) ? "Approved" as ApprovalState : "Pending" as ApprovalState, by: (isConcert || isCultural) ? "GSLA" : "—", at: (isConcert || isCultural) ? "2025-12-08" : "—" },
        { area: "Facilities / Venue", state: isConcert ? "Approved" as ApprovalState : isCultural ? "Approved" as ApprovalState : "Pending" as ApprovalState, by: (isConcert || isCultural) ? "GSLA" : "—", at: (isConcert || isCultural) ? "2025-12-09" : "—" },
        { area: "Equipment", state: "Pending" as ApprovalState, by: "—", at: "—" },
        { area: "Final Sign-off", state: isCultural ? "Approved" as ApprovalState : "Pending" as ApprovalState, by: isCultural ? "GSLA" : "—", at: isCultural ? "2025-12-10" : "—" },
      ],

      postEvent: {
        available: isCultural,
        whatWorked: "Clear steward roles + simple venue layout. Setup checklist reduced last-minute issues.",
        whatDidnt: "PA placement caused feedback; reposition speakers and keep mics away from monitors.",
        issues: "Minor schedule slip; build 10-minute buffers between segments.",
        recommendations: "Reuse the same layout next time; add signage for registration and water point.",
      },

      internalNotes: [
        { by: "GSLA", at: "2025-12-06 14:20", text: "Need updated layout showing audience flow + emergency access routes." },
        { by: "GSLA", at: "2025-12-08 15:10", text: "Safeguarding approved. Venue confirmation pending capacity and steward plan." },
      ],
    };
}

export type EventTimes = { prepStart: string; doorsOpen: string; eventStart: string; eventEnd: string; dismantleComplete: string };
type SeedEvent = ReturnType<typeof seedEvent>;
export type EventRecord = Omit<SeedEvent, "documents" | "category" | "status"> & { category: Category; status: Status; times: EventTimes; documents: (SeedEvent["documents"][number] & { files: Attachment[]; comments: string })[] };
const dates: Record<string, string[]> = {
 "evt-101": ["2026-01-16T14:00","2026-01-16T19:00","2026-01-16T20:00","2026-01-16T22:15","2026-01-17T00:30"],
 "evt-102": ["2026-01-24T10:00","2026-01-24T18:30","2026-01-24T19:30","2026-01-24T22:00","2026-01-25T02:00"],
 "evt-103": ["2026-02-01T07:00","2026-02-01T09:30","2026-02-01T10:00","2026-02-01T15:00","2026-02-01T18:00"],
 "evt-104": ["2025-12-06T12:00","2025-12-06T17:30","2025-12-06T18:00","2025-12-06T23:00","2025-12-07T01:00"],
};
const examples = Object.entries(dates).map(([id, values]): EventRecord => {
 const seed = seedEvent(id);
 const [prepStart,doorsOpen,eventStart,eventEnd,dismantleComplete] = values;
 return {...seed, times:{prepStart,doorsOpen,eventStart,eventEnd,dismantleComplete}, documents: seed.documents.map(d => ({...d,files:[],comments:""}))};
});
export function emptyEvent(): EventRecord {
 const sample = examples[0];
 return { ...sample, id:"",name:"",category:"Other",organiser:"",leadOrganiser:{name:"",email:"",phone:""},location:"",status:"Draft",quickNotes:"",
 times:{prepStart:"",doorsOpen:"",eventStart:"",eventEnd:"",dismantleComplete:""},venueImpact:{prepStart:"",doorsOpen:"",eventWindow:"",dismantleComplete:"",venueBlocked:""},timeline:[],internalNotes:[],
 documents:sample.documents.map(d=>({...d,owner:"",updated:"",status:"Pending",notes:"",files:[],comments:""})),
 equipment:sample.equipment.map(e=>({...e,qty:0,providedBy:"",state:"Pending",notes:""})),
 staffing:sample.staffing.map(s=>({...s,name:"",status:"Pending"})),
 approvals:sample.approvals.map(a=>({...a,state:"Pending",by:"",at:""})),
 postEvent:{available:false,whatWorked:"",whatDidnt:"",issues:"",recommendations:""} };
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
 const records=useMemo(()=>{ let saved:Record<string,EventRecord>={};try{saved=JSON.parse(raw||"{}");}catch{};return [...examples.map(e=>saved[e.id]||e),...Object.values(saved).filter(e=>!dates[e.id])];},[raw]);
 return {records,ready:raw!==""};
}
export function saveEventRecord(event:EventRecord) {
 const stored=JSON.parse(localStorage.getItem(key)||"{}");
 localStorage.setItem(key,JSON.stringify({...stored,[event.id]:completeEvent(event)}));
 window.dispatchEvent(new Event(change));
}
