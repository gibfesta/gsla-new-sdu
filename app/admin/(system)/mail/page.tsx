"use client";

/**
 * -------------------------------------------------------------------------------------
 * PAGE: Admin — Mail & Messages
 * Route: /admin/mail
 *
 * GOAL (Realism upgrade)
 * - Chat feels like chat (bubbles + quick reply)
 * - Mail feels like mail (mailboxes + subject headers + email cards + reply composer)
 *
 * WHAT'S NEW
 * - Mailboxes: Inbox / Sent / Drafts / Archived
 * - Mail list rows show:
 *    • Subject (bold when unread)
 *    • From/To label depending on mailbox
 *    • Date on the right
 * - Unread badge in header counts ONLY Inbox unread (more realistic)
 *
 * DEMO WIRING
 * - Header unread badge reads localStorage key: "gsla_admin_mail_unread"
 * - This page updates that key whenever inbox unread changes
 *
 * FUTURE WIRING
 * - Replace seed data with DB/API
 * - Realtime updates (Supabase Realtime / Pusher)
 * - Attachments (storage + metadata)
 * -------------------------------------------------------------------------------------
 */

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MessageSquare,
  Plus,
  Search,
  Users,
  X,
  Paperclip,
  Send,
  Reply,
  Archive,
  Inbox as InboxIcon,
  FileText,
  SendHorizontal,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type ThreadType = "chat" | "mail";
type Mailbox = "inbox" | "sent" | "drafts" | "archived";
type RecipientMode = "users" | "teams" | "roles";

type Thread = {
  id: string;
  type: ThreadType;

  // Chat: name of person/group | Mail: subject
  title: string;

  // Preview
  lastMessage: string;

  // Unread applies to Mail Inbox and Chats (demo)
  unread: number;

  // Mail-specific
  mailbox?: Mailbox; // only used when type === "mail"
  mailFrom?: string;
  mailTo?: string[];
  lastAt?: string; // "Today 09:12"
};

type BaseMsg = {
  id: string;
  threadId: string;
  sender: string;
  body: string;
  createdAt: string; // demo string
};

type ChatMsg = BaseMsg & { kind: "chat" };

type MailMsg = BaseMsg & {
  kind: "mail";
  subject: string;
  to: string[];
  cc?: string[];
};

type Msg = ChatMsg | MailMsg;

type Person = { id: string; name: string; tag?: string };
type Team = { id: string; name: string };
type Role = { id: string; name: string };

/* -------------------------------------------------------------------------- */
/* Seed data                                                                  */
/* -------------------------------------------------------------------------- */

const seedThreads: Thread[] = [
  // Chats
  {
    id: "t_chat_1",
    type: "chat",
    title: "John Murphy",
    lastMessage: "Thanks, that makes sense 👍",
    unread: 2,
    lastAt: "Today 10:19",
  },
  {
    id: "t_chat_2",
    type: "chat",
    title: "U16 Coaches Group",
    lastMessage: "Training times confirmed.",
    unread: 1,
    lastAt: "Yesterday 18:02",
  },

  // Mail Inbox
  {
    id: "t_mail_in_1",
    type: "mail",
    mailbox: "inbox",
    title: "Safeguarding Certificate Renewal",
    lastMessage: "Understood — I’ll complete this and upload the renewal by next week.",
    unread: 1,
    mailFrom: "Aisha Khan",
    mailTo: ["GSLA Admin"],
    lastAt: "Today 09:12",
  },
  {
    id: "t_mail_in_2",
    type: "mail",
    mailbox: "inbox",
    title: "Facility access request — Saturday morning",
    lastMessage: "Could we open the hall 30 minutes earlier for warm-up?",
    unread: 2,
    mailFrom: "Mark Collins",
    mailTo: ["GSLA Admin"],
    lastAt: "Yesterday 21:40",
  },

  // Mail Sent
  {
    id: "t_mail_sent_1",
    type: "mail",
    mailbox: "sent",
    title: "Event Information — Community Concert",
    lastMessage: "Call time updated to 17:30.",
    unread: 0,
    mailFrom: "GSLA Admin",
    mailTo: ["Sofia Lopez", "Mark Collins"],
    lastAt: "Mon 14:05",
  },

  // Mail Drafts
  {
    id: "t_mail_draft_1",
    type: "mail",
    mailbox: "drafts",
    title: "Reminder — First Aid Certificate Renewal",
    lastMessage: "Hello {NAME}, just a reminder your First Aid certificate is due for renewal...",
    unread: 0,
    mailFrom: "GSLA Admin",
    mailTo: ["(not set)"],
    lastAt: "Draft • Today 08:10",
  },

  // Mail Archived
  {
    id: "t_mail_arch_1",
    type: "mail",
    mailbox: "archived",
    title: "Thanks — documents uploaded",
    lastMessage: "All received, thank you.",
    unread: 0,
    mailFrom: "Sofia Lopez",
    mailTo: ["GSLA Admin"],
    lastAt: "Last week",
  },
];

const seedMessages: Msg[] = [
  // Chat thread 1
  {
    id: "m1",
    threadId: "t_chat_1",
    kind: "chat",
    sender: "Admin",
    body: "Hi John — just checking if your documents are uploaded.",
    createdAt: "Today 10:14",
  },
  {
    id: "m2",
    threadId: "t_chat_1",
    kind: "chat",
    sender: "John Murphy",
    body: "Yes, uploaded them earlier today.",
    createdAt: "Today 10:18",
  },
  {
    id: "m3",
    threadId: "t_chat_1",
    kind: "chat",
    sender: "Admin",
    body: "Perfect, thanks 👍",
    createdAt: "Today 10:19",
  },

  // Chat thread 2
  {
    id: "m4",
    threadId: "t_chat_2",
    kind: "chat",
    sender: "Coach Liam",
    body: "Training times confirmed for Thursday.",
    createdAt: "Yesterday 18:02",
  },

  // Mail Inbox safeguarding
  {
    id: "e1",
    threadId: "t_mail_in_1",
    kind: "mail",
    sender: "GSLA Admin",
    to: ["Aisha Khan"],
    subject: "Safeguarding Certificate Renewal",
    body:
      "Hello Aisha,\n\nThis is a reminder that your safeguarding certificate is due for renewal.\n\nPlease upload the updated document by the end of the month.\n\nThank you,\nGSLA Admin",
    createdAt: "Yesterday 16:42",
  },
  {
    id: "e2",
    threadId: "t_mail_in_1",
    kind: "mail",
    sender: "Aisha Khan",
    to: ["GSLA Admin"],
    subject: "Re: Safeguarding Certificate Renewal",
    body:
      "Hi,\n\nUnderstood — I’ll complete this and upload the renewal by next week.\n\nThanks,\nAisha",
    createdAt: "Today 09:12",
  },

  // Mail Inbox facility request
  {
    id: "e3",
    threadId: "t_mail_in_2",
    kind: "mail",
    sender: "Mark Collins",
    to: ["GSLA Admin"],
    subject: "Facility access request — Saturday morning",
    body:
      "Hi,\n\nCould we open the hall 30 minutes earlier for warm-up this Saturday?\n\nThanks,\nMark",
    createdAt: "Yesterday 21:40",
  },

  // Mail Sent: event info
  {
    id: "e4",
    threadId: "t_mail_sent_1",
    kind: "mail",
    sender: "GSLA Admin",
    to: ["Sofia Lopez", "Mark Collins"],
    subject: "Event Information — Community Concert",
    body:
      "Hello all,\n\nPlease see the latest event details:\n\n- Date: Saturday\n- Location: Main Hall\n- Call time: 17:30\n- Notes: Please ensure access routes remain clear.\n\nRegards,\nGSLA Admin",
    createdAt: "Mon 14:05",
  },

  // Draft (single message body)
  {
    id: "e5",
    threadId: "t_mail_draft_1",
    kind: "mail",
    sender: "GSLA Admin",
    to: ["(not set)"],
    subject: "Reminder — First Aid Certificate Renewal",
    body:
      "Hello {NAME},\n\nJust a reminder your First Aid certificate is due for renewal.\n\nPlease upload the updated document by {DUE_DATE}.\n\nThanks,\nGSLA Admin",
    createdAt: "Draft • Today 08:10",
  },

  // Archived
  {
    id: "e6",
    threadId: "t_mail_arch_1",
    kind: "mail",
    sender: "Sofia Lopez",
    to: ["GSLA Admin"],
    subject: "Thanks — documents uploaded",
    body:
      "Hi,\n\nAll received, thank you.\n\nSofia",
    createdAt: "Last week",
  },
];

const people: Person[] = [
  { id: "u1", name: "John Murphy", tag: "Coach" },
  { id: "u2", name: "Sofia Lopez", tag: "Volunteer" },
  { id: "u3", name: "Mark Collins", tag: "Team Admin" },
  { id: "u4", name: "Aisha Khan", tag: "Safeguarding Lead" },
];

const teams: Team[] = [
  { id: "tm1", name: "U16 Boys" },
  { id: "tm2", name: "U14 Girls" },
  { id: "tm3", name: "Senior Men" },
];

const roles: Role[] = [
  { id: "r1", name: "Coaches" },
  { id: "r2", name: "Volunteers" },
  { id: "r3", name: "Team Admins" },
  { id: "r4", name: "Safeguarding Leads" },
];

const mailTemplates = [
  {
    id: "tpl_safeguarding",
    name: "Safeguarding",
    subject: "Safeguarding training reminder",
    body:
      "Hello {NAME},\n\nThis is a reminder to complete/renew your safeguarding training by {DUE_DATE}.\n\nThank you,\nGSLA Admin",
  },
  {
    id: "tpl_renewal",
    name: "Renewal",
    subject: "Certificate renewal required",
    body:
      "Hello {NAME},\n\nYour certificate is due for renewal. Please upload the updated document by {DUE_DATE}.\n\nThanks,\nGSLA Admin",
  },
  {
    id: "tpl_event",
    name: "Event Info",
    subject: "Event information",
    body:
      "Hello all,\n\nPlease see the event information below:\n- Date:\n- Time:\n- Location:\n- Notes:\n\nRegards,\nGSLA Admin",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function setHeaderUnread(n: number) {
  window.localStorage.setItem("gsla_admin_mail_unread", String(n));
  window.dispatchEvent(new Event("gsla:mail-unread-updated"));
}

function initials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AdminMailPage() {
  const [activeTab, setActiveTab] = useState<ThreadType>("chat");
  const [activeMailbox, setActiveMailbox] = useState<Mailbox>("inbox");

  // Default active thread chosen based on initial tab
  const [activeThreadId, setActiveThreadId] = useState<string>("t_chat_1");

  const [threadData, setThreadData] = useState<Thread[]>(seedThreads);
  const [messageData, setMessageData] = useState<Msg[]>(seedMessages);

  // Search (UI-only filtering)
  const [threadQuery, setThreadQuery] = useState("");

  // Compose modal
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeType, setComposeType] = useState<ThreadType>("chat");
  const [recipientMode, setRecipientMode] = useState<RecipientMode>("users");
  const [recipientQuery, setRecipientQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [templateId, setTemplateId] = useState<string>("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  // Reply inputs (separate for chat vs mail)
  const [chatDraft, setChatDraft] = useState("");
  const [mailReplyBody, setMailReplyBody] = useState("");

  const activeThread = useMemo(
    () => threadData.find((t) => t.id === activeThreadId),
    [activeThreadId, threadData]
  );

  const activeMessages = useMemo(() => {
    return messageData
      .filter((m) => m.threadId === activeThreadId)
      .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
  }, [messageData, activeThreadId]);

  // Mailbox counts
  const mailboxCounts = useMemo(() => {
    const mails = threadData.filter((t) => t.type === "mail");
    const count = (mb: Mailbox) => mails.filter((t) => t.mailbox === mb).length;
    const unreadInbox = mails
      .filter((t) => t.mailbox === "inbox")
      .reduce((acc, t) => acc + (t.unread || 0), 0);

    return {
      inbox: count("inbox"),
      sent: count("sent"),
      drafts: count("drafts"),
      archived: count("archived"),
      unreadInbox,
    };
  }, [threadData]);

  // Header unread (realistic): only Inbox unread
  useEffect(() => {
    setHeaderUnread(mailboxCounts.unreadInbox);
  }, [mailboxCounts.unreadInbox]);

  // Mark as read when opening:
  // - Mail: only applies to inbox threads
  // - Chat: applies to any chat thread
  useEffect(() => {
    setThreadData((prev) =>
      prev.map((t) => {
        if (t.id !== activeThreadId) return t;
        if (t.type === "mail" && t.mailbox !== "inbox") return t;
        return { ...t, unread: 0 };
      })
    );
  }, [activeThreadId]);

  // Threads displayed on the left (filtered by tab + mailbox + query)
  const leftThreads = useMemo(() => {
    const q = threadQuery.trim().toLowerCase();

    const base =
      activeTab === "chat"
        ? threadData.filter((t) => t.type === "chat")
        : threadData.filter((t) => t.type === "mail" && t.mailbox === activeMailbox);

    const filtered = base.filter((t) => {
      if (!q) return true;
      const hay = `${t.title} ${t.lastMessage} ${t.mailFrom ?? ""} ${(t.mailTo ?? []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });

    // Light "realism": unread first, then newest-ish (lastAt string is demo so we keep stable order)
    return [...filtered].sort((a, b) => (b.unread || 0) - (a.unread || 0));
  }, [activeTab, activeMailbox, threadData, threadQuery]);

  // If user switches tab, pick a sensible active thread
  useEffect(() => {
    const next = leftThreads[0]?.id;
    if (!next) return;
    setActiveThreadId(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, activeMailbox]);

  const recipientsCount = selectedUsers.length + selectedTeams.length + selectedRoles.length;

  const openCompose = (type: ThreadType) => {
    setComposeType(type);
    setComposeOpen(true);

    setRecipientMode("users");
    setRecipientQuery("");
    setSelectedUsers([]);
    setSelectedTeams([]);
    setSelectedRoles([]);

    setTemplateId("");
    setComposeSubject("");
    setComposeBody("");
  };

  const applyTemplate = (id: string) => {
    setTemplateId(id);
    const t = mailTemplates.find((x) => x.id === id);
    if (!t) return;
    setComposeSubject(t.subject);
    setComposeBody(t.body);
  };

  const listForMode = useMemo(() => {
    const q = recipientQuery.trim().toLowerCase();

    if (recipientMode === "users") {
      return people
        .filter((p) => (q ? p.name.toLowerCase().includes(q) : true))
        .map((p) => ({
          id: p.id,
          label: p.name,
          meta: p.tag,
          selected: selectedUsers.includes(p.id),
          toggle: () =>
            setSelectedUsers((prev) =>
              prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id]
            ),
        }));
    }

    if (recipientMode === "teams") {
      return teams
        .filter((t) => (q ? t.name.toLowerCase().includes(q) : true))
        .map((t) => ({
          id: t.id,
          label: t.name,
          meta: "Team",
          selected: selectedTeams.includes(t.id),
          toggle: () =>
            setSelectedTeams((prev) =>
              prev.includes(t.id) ? prev.filter((x) => x !== t.id) : [...prev, t.id]
            ),
        }));
    }

    return roles
      .filter((r) => (q ? r.name.toLowerCase().includes(q) : true))
      .map((r) => ({
        id: r.id,
        label: r.name,
        meta: "Role group",
        selected: selectedRoles.includes(r.id),
        toggle: () =>
          setSelectedRoles((prev) =>
            prev.includes(r.id) ? prev.filter((x) => x !== r.id) : [...prev, r.id]
          ),
      }));
  }, [recipientMode, recipientQuery, selectedUsers, selectedTeams, selectedRoles]);

  // Actions: archive / unarchive
  const archiveActive = () => {
    if (!activeThread || activeThread.type !== "mail") return;

    setThreadData((prev) =>
      prev.map((t) => {
        if (t.id !== activeThread.id) return t;
        return { ...t, mailbox: "archived", unread: 0 };
      })
    );

    setActiveMailbox("archived");
    setActiveTab("mail");
  };

  const moveToInbox = () => {
    if (!activeThread || activeThread.type !== "mail") return;

    setThreadData((prev) =>
      prev.map((t) => {
        if (t.id !== activeThread.id) return t;
        return { ...t, mailbox: "inbox" };
      })
    );

    setActiveMailbox("inbox");
    setActiveTab("mail");
  };

  const sendCompose = () => {
    const newThreadId = `t_new_${Date.now()}`;
    const nowLabel = "Just now";

    // Create a mail thread in SENT, or a chat thread
    if (composeType === "mail") {
      const subject = composeSubject.trim() || "New mail";
      const body = composeBody.trim() || "Hello!";

      setThreadData((prev) => [
        {
          id: newThreadId,
          type: "mail",
          mailbox: "sent",
          title: subject,
          lastMessage: body.slice(0, 70),
          unread: 0,
          mailFrom: "GSLA Admin",
          mailTo: ["(demo recipients)"],
          lastAt: nowLabel,
        },
        ...prev,
      ]);

      setMessageData((prev) => [
        ...prev,
        {
          id: `e_${Date.now()}`,
          threadId: newThreadId,
          kind: "mail",
          sender: "GSLA Admin",
          to: ["(demo recipients)"],
          subject,
          body,
          createdAt: nowLabel,
        },
      ]);

      setComposeOpen(false);
      setActiveTab("mail");
      setActiveMailbox("sent");
      setActiveThreadId(newThreadId);
      return;
    }

    // Chat
    const body = composeBody.trim() || "Hello!";
    setThreadData((prev) => [
      {
        id: newThreadId,
        type: "chat",
        title: recipientsCount === 1 ? "New chat" : "New group chat",
        lastMessage: body.slice(0, 70),
        unread: 0,
        lastAt: nowLabel,
      },
      ...prev,
    ]);

    setMessageData((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        threadId: newThreadId,
        kind: "chat",
        sender: "Admin",
        body,
        createdAt: nowLabel,
      },
    ]);

    setComposeOpen(false);
    setActiveTab("chat");
    setActiveThreadId(newThreadId);
  };

  const sendChatReply = () => {
    if (!chatDraft.trim()) return;

    const newMsg: ChatMsg = {
      id: `m_${Date.now()}`,
      threadId: activeThreadId,
      kind: "chat",
      sender: "Admin",
      body: chatDraft.trim(),
      createdAt: "Just now",
    };

    setMessageData((prev) => [...prev, newMsg]);
    setChatDraft("");

    setThreadData((prev) =>
      prev.map((t) =>
        t.id === activeThreadId ? { ...t, lastMessage: newMsg.body, lastAt: "Just now" } : t
      )
    );
  };

  const sendMailReply = () => {
    if (!activeThread || activeThread.type !== "mail") return;
    if (!mailReplyBody.trim()) return;

    const subject = activeThread.title.startsWith("Re:")
      ? activeThread.title
      : `Re: ${activeThread.title}`;

    const newMsg: MailMsg = {
      id: `e_${Date.now()}`,
      threadId: activeThreadId,
      kind: "mail",
      sender: "GSLA Admin",
      to: activeThread.mailFrom ? [activeThread.mailFrom] : ["(demo recipient)"],
      subject,
      body: mailReplyBody.trim(),
      createdAt: "Just now",
    };

    setMessageData((prev) => [...prev, newMsg]);
    setMailReplyBody("");

    setThreadData((prev) =>
      prev.map((t) =>
        t.id === activeThreadId ? { ...t, lastMessage: newMsg.body, lastAt: "Just now" } : t
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0C2F57]">Mail & Messages</h1>
          <p className="mt-1 text-slate-600">
            Internal chat + email-style mailboxes (in-app only — no external mailboxes).
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => openCompose("chat")}>
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
          <Button onClick={() => openCompose("mail")}>
            <Plus className="mr-2 h-4 w-4" />
            Compose Mail
          </Button>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT: Navigation + Thread list */}
        <Card className="col-span-12 lg:col-span-4">
          <CardContent className="p-4 space-y-4">
            {/* Top tabs (Chats vs Mail) */}
            <div className="flex gap-2">
              <Button
                variant={activeTab === "chat" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("chat")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Chats
              </Button>
              <Button
                variant={activeTab === "mail" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("mail")}
              >
                <Mail className="mr-2 h-4 w-4" />
                Mail
              </Button>
            </div>

            {/* Mailbox switch (only shows when Mail tab is active) */}
            {activeTab === "mail" && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMailbox("inbox")}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                    activeMailbox === "inbox"
                      ? "border-[#0C2F57] bg-slate-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
                      <InboxIcon className="h-4 w-4 text-slate-500" />
                      Inbox
                    </span>
                    {mailboxCounts.unreadInbox > 0 && <Badge>{mailboxCounts.unreadInbox}</Badge>}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{mailboxCounts.inbox} threads</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMailbox("sent")}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                    activeMailbox === "sent"
                      ? "border-[#0C2F57] bg-slate-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
                      <SendHorizontal className="h-4 w-4 text-slate-500" />
                      Sent
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{mailboxCounts.sent} threads</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMailbox("drafts")}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                    activeMailbox === "drafts"
                      ? "border-[#0C2F57] bg-slate-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
                      <FileText className="h-4 w-4 text-slate-500" />
                      Drafts
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{mailboxCounts.drafts} drafts</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMailbox("archived")}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                    activeMailbox === "archived"
                      ? "border-[#0C2F57] bg-slate-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
                      <Archive className="h-4 w-4 text-slate-500" />
                      Archived
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{mailboxCounts.archived} threads</p>
                </button>
              </div>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                value={threadQuery}
                onChange={(e) => setThreadQuery(e.target.value)}
                placeholder={
                  activeTab === "mail"
                    ? `Search ${activeMailbox}...`
                    : "Search chats..."
                }
                className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            {/* Thread list */}
            <div className="space-y-2">
              {leftThreads.length === 0 ? (
                <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-500">
                  No threads found.
                </div>
              ) : (
                leftThreads.map((thread) => {
                  const isActive = activeThreadId === thread.id;

                  if (thread.type === "mail") {
                    const mb = thread.mailbox ?? "inbox";
                    const whoLabel =
                      mb === "sent" || mb === "drafts"
                        ? `To: ${(thread.mailTo ?? []).join(", ") || "(not set)"}`
                        : `From: ${thread.mailFrom ?? "Unknown"}`;

                    return (
                      <button
                        key={thread.id}
                        onClick={() => setActiveThreadId(thread.id)}
                        className={`w-full rounded-xl border p-3 text-left transition ${
                          isActive
                            ? "border-[#0C2F57] bg-slate-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <p
                                className={`truncate ${
                                  thread.unread > 0 && mb === "inbox"
                                    ? "font-extrabold text-slate-900"
                                    : "font-bold text-slate-800"
                                }`}
                              >
                                {thread.title}
                              </p>
                              <span className="text-xs text-slate-500 whitespace-nowrap">
                                {thread.lastAt ?? ""}
                              </span>
                            </div>

                            <p className="mt-0.5 text-xs text-slate-500 truncate">
                              {whoLabel}
                            </p>

                            <p className="mt-1 text-sm text-slate-600 truncate">
                              {thread.lastMessage}
                            </p>
                          </div>

                          {mb === "inbox" && thread.unread > 0 && <Badge>{thread.unread}</Badge>}
                        </div>
                      </button>
                    );
                  }

                  // Chat row
                  return (
                    <button
                      key={thread.id}
                      onClick={() => setActiveThreadId(thread.id)}
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        isActive
                          ? "border-[#0C2F57] bg-slate-50"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <p
                              className={`truncate ${
                                thread.unread > 0 ? "font-extrabold text-slate-900" : "font-semibold text-slate-800"
                              }`}
                            >
                              {thread.title}
                            </p>
                            <span className="text-xs text-slate-500 whitespace-nowrap">
                              {thread.lastAt ?? ""}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-slate-600 truncate">
                            {thread.lastMessage}
                          </p>
                        </div>
                        {thread.unread > 0 && <Badge>{thread.unread}</Badge>}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* RIGHT: Thread view */}
        <Card className="col-span-12 lg:col-span-8">
          <CardContent className="p-6 space-y-4">
            {!activeThread ? (
              <p className="text-slate-500">Select a conversation to begin.</p>
            ) : activeThread.type === "chat" ? (
              <>
                {/* Chat header */}
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-700">
                      {initials(activeThread.title)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">{activeThread.title}</h2>
                      <p className="text-sm text-slate-600">Chat conversation</p>
                    </div>
                  </div>
                  <Users className="h-5 w-5 text-slate-400" />
                </div>

                {/* Chat bubbles */}
                <div className="space-y-3">
                  {activeMessages.map((msg) => {
                    const mine = msg.sender === "Admin" || msg.sender === "GSLA Admin";
                    return (
                      <div
                        key={msg.id}
                        className={`max-w-[78%] rounded-xl p-3 text-sm ${
                          mine ? "ml-auto bg-[#0C2F57] text-white" : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className={`font-medium ${mine ? "text-white" : "text-slate-700"}`}>
                            {msg.sender}
                          </p>
                          <p className={`text-[11px] ${mine ? "text-white/80" : "text-slate-500"}`}>
                            {msg.createdAt}
                          </p>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap">{msg.body}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Chat reply */}
                <div className="pt-4 border-t">
                  <textarea
                    value={chatDraft}
                    onChange={(e) => setChatDraft(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    rows={3}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                      aria-label="Attach (coming soon)"
                      title="Attachments (coming soon)"
                    >
                      <Paperclip className="h-4 w-4" />
                      Attach
                      <Badge variant="secondary" className="ml-1">
                        Soon
                      </Badge>
                    </button>

                    <Button onClick={sendChatReply}>
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Mail header */}
                <div className="border-b pb-4 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900">{activeThread.title}</h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {activeThread.mailbox ? `${activeThread.mailbox.toUpperCase()} • ` : ""}
                        Mail thread (email-style, in-app)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {activeThread.mailbox === "archived" ? (
                        <Button variant="outline" size="sm" onClick={moveToInbox}>
                          <InboxIcon className="mr-2 h-4 w-4" />
                          Move to Inbox
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={archiveActive}>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMailReplyBody("")}
                        disabled={activeThread.mailbox === "drafts"}
                        title={activeThread.mailbox === "drafts" ? "Drafts are edited via Compose flow (demo)" : ""}
                      >
                        <Reply className="mr-2 h-4 w-4" />
                        Reply
                      </Button>

                      <Users className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                      <p className="text-xs text-slate-500">From</p>
                      <p className="font-semibold text-slate-800">{activeThread.mailFrom ?? "GSLA Admin"}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                      <p className="text-xs text-slate-500">To</p>
                      <p className="font-semibold text-slate-800">
                        {(activeThread.mailTo ?? ["(demo recipients)"]).join(", ")}
                      </p>
                    </div>
                  </div>

                  {activeThread.mailbox === "drafts" && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                      <span className="font-semibold">Draft mode:</span> in a real system you’d edit and save drafts here.
                      For the demo, drafts are static seed items.
                    </div>
                  )}
                </div>

                {/* Mail messages (email cards) */}
                <div className="space-y-3">
                  {activeMessages.map((msg) => {
                    const isMail = msg.kind === "mail";
                    const mail = msg as MailMsg;

                    return (
                      <div
                        key={msg.id}
                        className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
                      >
                        <div className="p-4 bg-slate-50 border-b border-slate-200">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-xs text-slate-500">Subject</p>
                              <p className="font-bold text-slate-900 truncate">
                                {isMail ? mail.subject : activeThread.title}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                                <p className="text-slate-700">
                                  <span className="text-slate-500">From:</span>{" "}
                                  <span className="font-semibold">{msg.sender}</span>
                                </p>
                                {isMail && (
                                  <p className="text-slate-700">
                                    <span className="text-slate-500">To:</span>{" "}
                                    <span className="font-semibold">{(mail.to ?? []).join(", ")}</span>
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="text-xs text-slate-500 whitespace-nowrap">
                              {msg.createdAt}
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <pre className="whitespace-pre-wrap text-sm text-slate-800 font-sans">
                            {msg.body}
                          </pre>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mail reply composer (disabled for Drafts) */}
                {activeThread.mailbox !== "drafts" && (
                  <div className="pt-4 border-t space-y-3">
                    <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-slate-500">To</p>
                          <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-slate-50">
                            {(activeThread.mailFrom ? [activeThread.mailFrom] : ["(demo recipient)"]).join(", ")}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Subject</p>
                          <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-slate-50">
                            {activeThread.title.startsWith("Re:") ? activeThread.title : `Re: ${activeThread.title}`}
                          </div>
                        </div>
                      </div>

                      <textarea
                        value={mailReplyBody}
                        onChange={(e) => setMailReplyBody(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                        rows={5}
                      />

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                          aria-label="Attach (coming soon)"
                          title="Attachments (coming soon)"
                        >
                          <Paperclip className="h-4 w-4" />
                          Attach files
                          <Badge variant="secondary" className="ml-1">
                            Soon
                          </Badge>
                        </button>

                        <Button onClick={sendMailReply}>
                          <Send className="mr-2 h-4 w-4" />
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Compose modal */}
      {composeOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <p className="text-sm text-slate-500">
                  {composeType === "chat" ? "New Chat" : "Compose Mail"}
                </p>
                <h3 className="text-lg font-bold text-slate-800">
                  {composeType === "chat"
                    ? "Start a conversation"
                    : "Send an email-style message (in-app)"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setComposeOpen(false)}
                className="rounded-xl p-2 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 grid grid-cols-12 gap-4">
              {/* Recipients */}
              <div className="col-span-12 lg:col-span-5 space-y-3">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={recipientMode === "users" ? "default" : "outline"}
                    onClick={() => setRecipientMode("users")}
                  >
                    Users
                  </Button>
                  <Button
                    size="sm"
                    variant={recipientMode === "teams" ? "default" : "outline"}
                    onClick={() => setRecipientMode("teams")}
                  >
                    Teams
                  </Button>
                  <Button
                    size="sm"
                    variant={recipientMode === "roles" ? "default" : "outline"}
                    onClick={() => setRecipientMode("roles")}
                  >
                    Roles
                  </Button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    value={recipientQuery}
                    onChange={(e) => setRecipientQuery(e.target.value)}
                    placeholder={`Search ${recipientMode}...`}
                    className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <div className="max-h-[280px] overflow-auto rounded-xl border border-slate-200">
                  {listForMode.length === 0 ? (
                    <div className="p-4 text-sm text-slate-500">No matches.</div>
                  ) : (
                    <div className="divide-y">
                      {listForMode.map((row) => (
                        <button
                          type="button"
                          key={row.id}
                          onClick={row.toggle}
                          className="w-full p-3 text-left hover:bg-slate-50 flex items-center justify-between gap-3"
                        >
                          <div>
                            <p className="font-semibold text-slate-800">{row.label}</p>
                            <p className="text-xs text-slate-500">{row.meta}</p>
                          </div>
                          <span
                            className={`h-5 w-5 rounded-md border ${
                              row.selected
                                ? "bg-[#0C2F57] border-[#0C2F57]"
                                : "border-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Selected: {recipientsCount}</Badge>
                  {composeType === "mail" && <Badge variant="secondary">Mail requires a subject</Badge>}
                </div>
              </div>

              {/* Compose */}
              <div className="col-span-12 lg:col-span-7 space-y-3">
                {composeType === "mail" && (
                  <>
                    <div className="rounded-xl border border-slate-200 p-3 space-y-2">
                      <p className="text-sm font-semibold text-slate-800">Template</p>
                      <select
                        value={templateId}
                        onChange={(e) => applyTemplate(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      >
                        <option value="">No template</option>
                        {mailTemplates.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-slate-500">
                        Templates autofill subject + body (placeholders replaced later via DB).
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-800">Subject</p>
                      <input
                        value={composeSubject}
                        onChange={(e) => setComposeSubject(e.target.value)}
                        placeholder="Subject..."
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-800">
                    {composeType === "chat" ? "First message" : "Body"}
                  </p>
                  <textarea
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    placeholder={composeType === "chat" ? "Write your message..." : "Write your email..."}
                    className="w-full rounded-2xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    rows={10}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                    aria-label="Attachments (coming soon)"
                    title="Attachments (coming soon)"
                  >
                    <Paperclip className="h-4 w-4" />
                    Attach files
                    <Badge variant="secondary" className="ml-1">
                      Soon
                    </Badge>
                  </button>

                  <Button
                    onClick={sendCompose}
                    disabled={recipientsCount === 0 || (composeType === "mail" && !composeSubject.trim())}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {composeType === "chat" ? "Start Chat" : "Send Mail"}
                  </Button>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                  <span className="font-semibold">Realtime (later):</span> sending should write to DB
                  and broadcast updates so recipients see mail instantly and inbox unread increments.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
