import React, { useState, useMemo, useEffect } from 'react';
import {
  Inbox,
  UserCheck,
  UserCog,
  AlertCircle,
  CheckCircle2,
  Search,
  Plus,
  Sparkles,
  Send,
  RefreshCw,
  Mail,
  ShieldCheck,
  ChevronLeft,
  Check,
  X,
  Menu,
  CornerUpLeft,
  ExternalLink,
  MessageSquarePlus,
  Zap,
  Globe
} from 'lucide-react';

// ============================================================================
// INITIAL MOCK DATA (Rich Executive Dataset across Clients)
// ============================================================================
const INITIAL_CLIENTS = [
  {
    id: 'client_arjun',
    name: 'Arjun Mehta',
    role: 'CEO, FinStack',
    email: 'arjun@finstack.io',
    provider: 'Gmail',
    avatar: 'AM',
    color: 'bg-indigo-600'
  },
  {
    id: 'client_priya',
    name: 'Priya Nair',
    role: 'Managing Partner, Apex VC',
    email: 'priya@apexvc.in',
    provider: 'Outlook',
    avatar: 'PN',
    color: 'bg-emerald-600'
  }
];

const INITIAL_EMAILS = [
  {
    id: 'em_1',
    clientId: 'client_arjun',
    senderName: 'Vikramaditya Rao',
    senderRole: 'General Partner, Sequoia Surge',
    senderEmail: 'v.rao@surge-cap.com',
    subject: 'Series A Term Sheet – Final Valuation & Board Seat Clause',
    timestamp: '10:14 AM',
    date: 'Today',
    category: 'Investor Relations',
    urgency: 'urgent',
    owner: 'client', // 'client' | 'assistant' | 'fyi'
    status: 'open', // 'open' | 'resolved'
    confidence: 98,
    aiSummary: 'Lead investor requests CEO confirmation on the $28M post-money cap and pro-rata board observer seat before Friday.',
    aiReasoning: 'Strategic equity valuation and board governance clauses require direct CEO decision-making and sign-off.',
    assistantNote: 'Flagged for your review — Vikram wants to lock terms before tomorrow’s IC call.',
    body: `Hi Arjun,\n\nGreat catching up yesterday evening. Our investment committee reviewed the updated cohort metrics and we are ready to move forward.\n\nBefore our legal team circulates the definitive term sheet tomorrow afternoon, could you personally confirm that you are aligned with the $28M post-money valuation cap and the single board observer seat structure?\n\nOnce you confirm, we can finalize paperwork by Friday.\n\nBest,\nVikramaditya Rao\nGeneral Partner`,
    drafts: {
      brief: `Hi Vikram,\n\nConfirmed — aligned on the $28M post-money cap and the observer seat structure. Please have your legal team circulate the definitive term sheet.\n\nBest,\nArjun`,
      warm: `Hi Vikram,\n\nThank you for moving so quickly on this! We’re thrilled to partner with you. I can confirm we are fully aligned on the $28M cap and board observer structure. Looking forward to reviewing the term sheet tomorrow.\n\nWarm regards,\nArjun`,
      decline: `Hi Vikram,\n\nThank you for sending this over. After discussing internally, we need a bit more flexibility on the valuation cap before locking terms. Let’s hop on a quick 15-minute call today to align.\n\nBest,\nArjun`
    }
  },
  {
    id: 'em_2',
    clientId: 'client_arjun',
    senderName: 'Ananya Deshmukh',
    senderRole: 'Corporate Travel Desk, IndiGo Business',
    senderEmail: 'concierge@goindigo-corp.in',
    subject: 'Flight Reschedule Confirmation: BLR → BOM (18 Nov)',
    timestamp: '09:42 AM',
    date: 'Today',
    category: 'Travel & Logistics',
    urgency: 'normal',
    owner: 'assistant',
    status: 'open',
    confidence: 96,
    aiSummary: 'Airline moved Wednesday morning flight by 45 minutes; requests confirmation on seat 1A & lounge access.',
    aiReasoning: 'Routine travel logistics and seat confirmation can be executed directly by the executive assistant.',
    assistantNote: '',
    body: `Dear Executive Office,\n\nPlease note that Mr. Arjun Mehta's upcoming flight 6E-5312 from Bengaluru (BLR) to Mumbai (BOM) on 18 Nov has been rescheduled from 07:30 AM to 08:15 AM.\n\nWe have retained Seat 1A and fast-track boarding. Kindly confirm if this updated timing works with his Mumbai schedule or if you would like us to move him to the 06:45 AM departure.\n\nRegards,\nCorporate Concierge Desk`,
    drafts: {
      brief: `Hi Ananya,\n\nThe 08:15 AM departure works well with Arjun’s Mumbai calendar. Please lock in Seat 1A and send over the updated boarding pass.\n\nThanks,\nExecutive Assistant to Arjun Mehta`,
      warm: `Hi Ananya,\n\nThank you for the prompt heads-up! We’ve checked Arjun’s calendar and the 08:15 AM departure works smoothly. Please confirm Seat 1A and share the updated itinerary whenever ready.\n\nBest regards,\nExecutive Assistant to Arjun Mehta`,
      decline: `Hi Ananya,\n\nUnfortunately, the 08:15 AM arrival pushes too close to Arjun’s first meeting in Mumbai. Please move him to the 06:45 AM departure with comparable front-row seating.\n\nThanks,\nExecutive Assistant to Arjun Mehta`
    }
  },
  {
    id: 'em_3',
    clientId: 'client_priya',
    senderName: 'Rohan Kulkarni',
    senderRole: 'Founder, NeuroGrid AI',
    senderEmail: 'rohan@neurogrid.ai',
    subject: 'Follow-up: Apex VC Lead Allocation & Co-Investor Intro',
    timestamp: '09:15 AM',
    date: 'Today',
    category: 'Deal Flow',
    urgency: 'urgent',
    owner: 'client',
    status: 'open',
    confidence: 95,
    aiSummary: 'Portfolio founder asks Priya to personally introduce him to Lightspeed partner and confirm Apex’s $1.5M check.',
    aiReasoning: 'Warm partner-to-partner VC introductions and allocation commitments carry high relationship weight requiring Priya’s voice.',
    assistantNote: 'Rohan has two competing term sheets closing this week.',
    body: `Hi Priya,\n\nThanks again for the deep-dive session on our inference engine benchmarks. Having Apex VC lead our seed round is our top priority.\n\nTwo quick asks:\n1. Can we lock in Apex’s $1.5M lead allocation so I can communicate certainty to our angels?\n2. Would you feel comfortable making a warm intro to Dev Khare as you mentioned?\n\nBest,\nRohan`,
    drafts: {
      brief: `Hi Rohan,\n\nYes — we are locked in for the $1.5M lead allocation. I’ll send the warm intro note to Dev right after this email.\n\nBest,\nPriya`,
      warm: `Hi Rohan,\n\nWe’re equally excited to back you and the NeuroGrid team! Consider the $1.5M lead allocation confirmed on our end. I’m sending over the warm intro to Dev right now so you two can connect this week.\n\nBest,\nPriya`,
      decline: `Hi Rohan,\n\nAppreciate the momentum! Let’s hold off on external intros until our partnership vote wraps up tomorrow morning, after which I’ll confirm our final allocation.\n\nBest,\nPriya`
    }
  },
  {
    id: 'em_4',
    clientId: 'client_priya',
    senderName: 'Siddharth Malhotra',
    senderRole: 'Producer, TechSparks Summit',
    senderEmail: 'speakers@techsparks.in',
    subject: 'Keynote Panel Logistics & Bio Approval for Dec 4',
    timestamp: 'Yesterday',
    date: 'Yesterday',
    category: 'Speaking & PR',
    urgency: 'normal',
    owner: 'assistant',
    status: 'open',
    confidence: 94,
    aiSummary: 'Conference producer needs headshot, 80-word bio, and AV check slot for Priya’s upcoming panel.',
    aiReasoning: 'Standard media kit delivery and calendar scheduling for confirmed speaking engagements belong to the assistant.',
    assistantNote: '',
    body: `Hello Priya's Team,\n\nWe are excited to host Priya Nair on the "Future of Indian DeepTech" panel on Dec 4 at 11:00 AM.\n\nCould you please share her approved 80-word speaker bio, high-res headshot, and confirm whether she will require a green room pass for an accompanying team member?\n\nWarm regards,\nSiddharth Malhotra`,
    drafts: {
      brief: `Hi Siddharth,\n\nAttached are Priya’s approved 80-word bio and high-res headshot. Please issue one green room pass for me as I’ll be accompanying her.\n\nBest,\nExecutive Assistant to Priya Nair`,
      warm: `Hi Siddharth,\n\nPriya is looking forward to the panel! I’ve attached her updated bio and press headshot. Please do arrange one additional green room pass for me so we can coordinate smoothly on-site.\n\nWarm regards,\nExecutive Assistant to Priya Nair`,
      decline: `Hi Siddharth,\n\nThank you for reaching out. Due to a recent board travel conflict on Dec 4, we may need to adjust Priya’s slot time. Could you share alternative afternoon panel times?\n\nBest,\nExecutive Assistant to Priya Nair`
    }
  },
  {
    id: 'em_5',
    clientId: 'client_arjun',
    senderName: 'Meera Krishnan',
    senderRole: 'VP Engineering, FinStack',
    senderEmail: 'meera.k@finstack.io',
    subject: 'Principal Architect Final Offer Sign-off (Candidate: Karthik S.)',
    timestamp: 'Yesterday',
    date: 'Yesterday',
    category: 'Executive Hiring',
    urgency: 'urgent',
    owner: 'client',
    status: 'open',
    confidence: 92,
    aiSummary: 'VP Eng requests CEO approval on ESOP grant exception (0.35%) to close senior engineering hire today.',
    aiReasoning: 'Above-band ESOP compensation exceptions require direct founder/CEO sign-off.',
    assistantNote: 'Comp band exception: 0.35% ESOP vs standard 0.25%.',
    body: `Hi Arjun,\n\nKarthik cleared all architecture rounds with unanimous strong-hire feedback. He has a competing offer from Razorpay.\n\nTo close him today, I’d like your sign-off on bumping his ESOP grant from 0.25% to 0.35% while keeping base cash within band. Let me know if you approve so HR can release the letter.\n\nThanks,\nMeera`,
    drafts: {
      brief: `Hi Meera,\n\nApproved on the 0.35% ESOP grant for Karthik. Have HR issue the offer letter today.\n\nBest,\nArjun`,
      warm: `Hi Meera,\n\nGreat job getting Karthik across the line! Given the strong panel feedback, I fully approve the 0.35% ESOP exception. Let’s get the offer out right away.\n\nBest,\nArjun`,
      decline: `Hi Meera,\n\nLet’s hold at 0.30% ESOP max to preserve our Q4 pool, and offer a 6-month performance refresh instead. Let me know if he’s open to that.\n\nBest,\nArjun`
    }
  },
  {
    id: 'em_6',
    clientId: 'client_arjun',
    senderName: 'AWS Billing & Accounts',
    senderRole: 'Enterprise Cloud Support',
    senderEmail: 'no-reply-billing@aws.amazon.com',
    subject: 'October Enterprise Cloud Invoice #INV-884920 ($14,280.00)',
    timestamp: 'Yesterday',
    date: 'Yesterday',
    category: 'Finance & Ops',
    urgency: 'normal',
    owner: 'assistant',
    status: 'open',
    confidence: 99,
    aiSummary: 'Monthly AWS infrastructure invoice ready for forwarding to FinStack accounts payable.',
    aiReasoning: 'Routine monthly vendor invoice routing should be handled by the assistant without interrupting the CEO.',
    assistantNote: '',
    body: `Hello,\n\nYour Amazon Web Services invoice #INV-884920 for the billing period Oct 1 – Oct 31 totaling $14,280.00 is now available in the billing console.\n\nAuto-debit is scheduled for Nov 20 unless settled via wire transfer prior.\n\nThank you,\nAWS Billing Team`,
    drafts: {
      brief: `Forwarding to accounts@finstack.io: Please log AWS Invoice #INV-884920 ($14,280.00) for the Nov 20 auto-debit reconciliation.\n\nBest,\nExecutive Assistant`,
      warm: `Hi Finance Team,\n\nSharing the October AWS enterprise invoice (#INV-884920 for $14,280.00) for your records ahead of the Nov 20 auto-debit. Let me know if you need the PDF breakdown.\n\nThanks,\nExecutive Assistant`,
      decline: `Hi AWS Support,\n\nWe are reviewing a credit adjustment on this billing cycle. Please pause auto-debit until our finance team confirms.\n\nRegards,\nExecutive Assistant`
    }
  },
  {
    id: 'em_7',
    clientId: 'client_priya',
    senderName: 'Nandini Sen',
    senderRole: 'LP Relations, Sovereign Fund Asia',
    senderEmail: 'n.sen@sfa-cap.sg',
    subject: 'Q3 Limited Partner Letter & Annual AGM Dinner RSVP',
    timestamp: '13 Nov',
    date: '13 Nov',
    category: 'LP Relations',
    urgency: 'normal',
    owner: 'fyi',
    status: 'open',
    confidence: 91,
    aiSummary: 'Anchor LP confirms receipt of Q3 fund report and RSVPs for 2 partners at the Mumbai AGM dinner.',
    aiReasoning: 'Informational confirmation with no open questions; logged for visibility and guest-list update.',
    assistantNote: '',
    body: `Dear Priya,\n\nThank you for sending over Apex VC’s Q3 portfolio report — impressive markups across the FinTech sleeve.\n\nBoth myself and Managing Director David Tan will attend the Annual General Meeting dinner in Mumbai on Dec 12. No dietary restrictions.\n\nWarm regards,\nNandini Sen`,
    drafts: {
      brief: `Hi Nandini,\n\nNoted with thanks! We’ve added both you and David to the Mumbai AGM dinner guest list for Dec 12.\n\nBest,\nExecutive Assistant to Priya Nair`,
      warm: `Hi Nandini,\n\nWonderful to hear you and David will be joining us in Mumbai! We’ve confirmed your spots for Dec 12 and look forward to hosting you.\n\nWarm regards,\nExecutive Assistant to Priya Nair`,
      decline: `Hi Nandini,\n\nThank you for confirming. Please let us know if your travel dates change closer to Dec 12.\n\nBest,\nExecutive Assistant to Priya Nair`
    }
  },
  {
    id: 'em_8',
    clientId: 'client_priya',
    senderName: 'Karan Johar (Legal Counsel)',
    senderRole: 'Partner, Trilegal',
    senderEmail: 'karan.j@trilegal.com',
    subject: 'Side Letter Execution Copy – Fund III Closing',
    timestamp: '12 Nov',
    date: '12 Nov',
    category: 'Legal',
    urgency: 'normal',
    owner: 'assistant',
    status: 'resolved',
    confidence: 95,
    aiSummary: 'Executed side letter PDF returned by outside counsel for archival in Fund III data room.',
    aiReasoning: 'Document filing and data-room archiving completed by assistant.',
    assistantNote: '',
    body: `Hi Team,\n\nPlease find attached the countersigned side letter for Fund III closing. Kindly archive this in your permanent compliance folder.\n\nRegards,\nKaran`,
    drafts: {
      brief: `Hi Karan,\n\nReceived and archived in the Fund III compliance vault. Thank you!\n\nBest,\nExecutive Assistant to Priya Nair`,
      warm: `Hi Karan,\n\nThank you for turning this around so quickly! We’ve securely filed the countersigned copy in our Fund III data room.\n\nBest,\nExecutive Assistant to Priya Nair`,
      decline: `Hi Karan,\n\nCould you re-send with Exhibit B attached? It appears missing from the PDF.\n\nThanks,\nExecutive Assistant`
    }
  }
];

// ============================================================================
// PRESET DEMO TEMPLATES FOR LIVE AI SIMULATION
// ============================================================================
const SIMULATION_PRESETS = [
  {
    label: 'Board Investor Intro',
    clientId: 'client_arjun',
    senderName: 'Shailendra Singh',
    senderRole: 'Managing Director, Peak XV',
    senderEmail: 'shailendra@peakxv.com',
    subject: 'Quick coffee next week + potential Series B strategic partner',
    body: `Hey Arjun,\n\nHope you're having a great week. I'm flying into Bangalore next Tuesday and would love to grab 30 mins with you personally to discuss an inbound strategic partnership idea for FinStack before your next board meeting.\n\nAre you free Tuesday around 4 PM?\n\nBest,\nShailendra`
  },
  {
    label: 'Flight & Hotel Change',
    clientId: 'client_priya',
    senderName: 'Taj Palace Concierge',
    senderRole: 'Reservations Desk, New Delhi',
    senderEmail: 'reservations.delhi@tajhotels.com',
    subject: 'Suite Upgrade & Airport Transfer Details for Priya Nair',
    body: `Dear Executive Office,\n\nWe are delighted to confirm Ms. Priya Nair's stay from Nov 22–24. Please share her flight arrival number so our chauffeur can be stationed at Terminal 3, and confirm if she prefers a non-smoking Luxury Suite.\n\nWarm regards,\nTaj Concierge`
  },
  {
    label: 'Urgent Legal Contract',
    clientId: 'client_arjun',
    senderName: 'Ritu Verma',
    senderRole: 'General Counsel, FinStack',
    senderEmail: 'ritu.legal@finstack.io',
    subject: 'URGENT: RBI Payment Aggregator License Undertaking – Founder Signature',
    body: `Hi Arjun,\n\nOur regulatory counsel just confirmed that the RBI compliance undertaking requires your direct personal digital signature and declaration as Managing Director before 5:00 PM IST today.\n\nPlease review the attached 2-page declaration and confirm once signed.\n\nRegards,\nRitu`
  }
];

// ============================================================================
// SMART AI CLASSIFICATION ENGINE (Gemini API + Intelligent Fallback)
// ============================================================================
async function analyzeEmailWithAI({ senderName, senderRole, subject, body, clientName }) {
  const apiKey =
    (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) ||
    (typeof window !== 'undefined' && window.__GEMINI_API_KEY__) ||
    '';

  const prompt = `You are an elite Executive Assistant AI triage engine. Analyze this incoming email for client "${clientName}".
Sender: ${senderName} (${senderRole})
Subject: ${subject}
Body: ${body}

Determine:
1. "owner": Must be strictly "client" (if it requires personal founder/partner judgment, strategic investor decision, personal relationship meeting, or legal executive sign-off) OR "assistant" (if it involves scheduling, travel, hotel, invoices, bios, logistics, or routine coordination) OR "fyi" (if purely informational).
2. "urgency": "urgent" or "normal".
3. "category": Short 2-word category (e.g. "Investor Relations", "Travel & Logistics", "Legal & Compliance", "Executive Scheduling").
4. "confidence": Integer between 89 and 99.
5. "aiSummary": A crisp 1-sentence executive summary (max 18 words).
6. "aiReasoning": A 1-sentence explanation of WHY the client or assistant should handle it.
7. "drafts": Object with 3 tailored reply drafts ("brief", "warm", "decline") written from the assigned owner's perspective.

Return ONLY valid JSON matching this schema.`;

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        }
      );
      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (parsed.owner && parsed.aiSummary && parsed.drafts) {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn('Gemini API fallback triggered:', err);
    }
  }

  // Intelligent deterministic fallback (ensures 100% reliability even without an API key)
  await new Promise((r) => setTimeout(r, 850));
  const combined = `${subject} ${body} ${senderRole}`.toLowerCase();

  const isClientRequired =
    combined.includes('term sheet') ||
    combined.includes('investor') ||
    combined.includes('personally') ||
    combined.includes('signature') ||
    combined.includes('board') ||
    combined.includes('coffee') ||
    combined.includes('valuation') ||
    combined.includes('partner') ||
    combined.includes('rbi') ||
    combined.includes('sign-off');

  const isUrgent =
    combined.includes('urgent') ||
    combined.includes('today') ||
    combined.includes('5:00 pm') ||
    combined.includes('deadline') ||
    combined.includes('term sheet');

  const owner = isClientRequired ? 'client' : 'assistant';
  const signer = isClientRequired ? clientName.split(' ')[0] : `Executive Assistant to ${clientName}`;
  const firstName = senderName.split(' ')[0];

  return {
    owner,
    urgency: isUrgent ? 'urgent' : 'normal',
    category: isClientRequired ? 'Strategic & Executive' : 'Operations & Logistics',
    confidence: isClientRequired ? 96 : 94,
    aiSummary: isClientRequired
      ? `${senderName} requests ${clientName.split(' ')[0]}'s direct input/sign-off regarding "${subject.slice(0, 45)}".`
      : `Routine coordination request from ${senderName} regarding ${subject.slice(0, 45)}.`,
    aiReasoning: isClientRequired
      ? 'High-stakes relationship or executive sign-off detected; requires client’s personal authority.'
      : 'Operational logistics and scheduling coordination can be handled autonomously by the assistant.',
    drafts: {
      brief: `Hi ${firstName},\n\nThank you for reaching out. ${
        isClientRequired
          ? 'I have reviewed this and confirm we can proceed as discussed. Let’s lock in details shortly.'
          : `I’m coordinating this on ${clientName.split(' ')[0]}’s behalf and will confirm all details shortly.`
      }\n\nBest,\n${signer}`,
      warm: `Hi ${firstName},\n\nGreat hearing from you! ${
        isClientRequired
          ? 'I appreciate you bringing this directly to me—happy to connect and move this forward together.'
          : `Thank you for the update! I’m taking care of the logistics for ${clientName.split(' ')[0]} and will get back to you right away.`
      }\n\nWarm regards,\n${signer}`,
      decline: `Hi ${firstName},\n\nThank you for thinking of us. Unfortunately, ${clientName.split(' ')[0]}’s schedule is fully committed this week, so we will need to pass for now.\n\nBest,\n${signer}`
    }
  };
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Core State
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [emails, setEmails] = useState(INITIAL_EMAILS);
  const [roleMode, setRoleMode] = useState('assistant'); // 'assistant' | 'client'
  const [selectedClientId, setSelectedClientId] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'assistant' | 'client' | 'urgent' | 'resolved'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmailId, setSelectedEmailId] = useState('em_1');

  // Composer & Triage State
  const [selectedTone, setSelectedTone] = useState('brief'); // 'brief' | 'warm' | 'decline'
  const [draftText, setDraftText] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [assistantNoteInput, setAssistantNoteInput] = useState('');

  // Client Portal State
  const [clientPersonalReplyId, setClientPersonalReplyId] = useState(null);
  const [clientPersonalReplyText, setClientPersonalReplyText] = useState('');

  // Modals & Mobile Navigation State
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Trigger Toast Helper
  const triggerToast = (title, subtitle = '', type = 'success') => {
    setToast({ title, subtitle, type });
    setTimeout(() => {
      setToast((prev) => (prev?.title === title ? null : prev));
    }, 3500);
  };

  // Client Lookup Map
  const clientMap = useMemo(() => {
    const map = {};
    clients.forEach((c) => {
      map[c.id] = c;
    });
    return map;
  }, [clients]);

  // Ensure Client Portal always selects a valid single client if 'all' was active
  const effectiveClientPortalId = useMemo(() => {
    if (selectedClientId !== 'all') return selectedClientId;
    return clients[0]?.id || 'client_arjun';
  }, [selectedClientId, clients]);

  // Filtered Emails for Assistant Workspace
  const filteredEmails = useMemo(() => {
    return emails.filter((em) => {
      if (selectedClientId !== 'all' && em.clientId !== selectedClientId) return false;

      if (activeFilter === 'assistant' && (em.owner !== 'assistant' || em.status === 'resolved')) return false;
      if (activeFilter === 'client' && (em.owner !== 'client' || em.status === 'resolved')) return false;
      if (activeFilter === 'urgent' && (em.urgency !== 'urgent' || em.status === 'resolved')) return false;
      if (activeFilter === 'resolved' && em.status !== 'resolved') return false;
      if (activeFilter === 'all' && em.status === 'resolved') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          em.subject.toLowerCase().includes(q) ||
          em.senderName.toLowerCase().includes(q) ||
          em.aiSummary.toLowerCase().includes(q) ||
          em.category.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [emails, selectedClientId, activeFilter, searchQuery]);

  // Live Badge Counts
  const counts = useMemo(() => {
    const scoped = selectedClientId === 'all' ? emails : emails.filter((e) => e.clientId === selectedClientId);
    return {
      all: scoped.filter((e) => e.status === 'open').length,
      assistant: scoped.filter((e) => e.owner === 'assistant' && e.status === 'open').length,
      client: scoped.filter((e) => e.owner === 'client' && e.status === 'open').length,
      urgent: scoped.filter((e) => e.urgency === 'urgent' && e.status === 'open').length,
      resolved: scoped.filter((e) => e.status === 'resolved').length
    };
  }, [emails, selectedClientId]);

  // Selected Email Object
  const selectedEmail = useMemo(() => {
    return emails.find((e) => e.id === selectedEmailId) || filteredEmails[0] || emails[0];
  }, [emails, selectedEmailId, filteredEmails]);

  // Sync composer draft whenever selected email or tone changes
  useEffect(() => {
    if (selectedEmail) {
      setDraftText(selectedEmail.drafts?.[selectedTone] || selectedEmail.drafts?.brief || '');
      setAssistantNoteInput(selectedEmail.assistantNote || '');
    }
  }, [selectedEmail?.id, selectedTone]);

  // Handlers
  const handleSelectEmail = (id) => {
    setSelectedEmailId(id);
    setSelectedTone('brief');
    setMobileThreadOpen(true);
  };

  const handleOwnershipChange = (emailId, newOwner) => {
    setEmails((prev) =>
      prev.map((em) =>
        em.id === emailId
          ? {
              ...em,
              owner: newOwner,
              status: 'open',
              assistantNote:
                newOwner === 'client'
                  ? assistantNoteInput || em.assistantNote || 'Flagged for your personal input.'
                  : em.assistantNote
            }
          : em
      )
    );
    const label =
      newOwner === 'client'
        ? 'Escalated to Client Portal'
        : newOwner === 'assistant'
        ? 'Assigned to Assistant'
        : 'Marked as FYI';
    triggerToast(label, 'Ownership updated across workspace & client portal.');
  };

  const handleSaveAssistantNote = () => {
    if (!selectedEmail) return;
    setEmails((prev) =>
      prev.map((em) => (em.id === selectedEmail.id ? { ...em, assistantNote: assistantNoteInput } : em))
    );
    triggerToast('Note attached for client', 'Visible immediately in the Client Portal view.');
  };

  const handleRegenerateDraft = async () => {
    if (!selectedEmail) return;
    setIsRegenerating(true);
    const client = clientMap[selectedEmail.clientId];
    const result = await analyzeEmailWithAI({
      senderName: selectedEmail.senderName,
      senderRole: selectedEmail.senderRole,
      subject: selectedEmail.subject,
      body: selectedEmail.body,
      clientName: client?.name || 'Executive'
    });
    setEmails((prev) =>
      prev.map((em) => (em.id === selectedEmail.id ? { ...em, drafts: result.drafts } : em))
    );
    setDraftText(result.drafts[selectedTone] || result.drafts.brief);
    setIsRegenerating(false);
    triggerToast('AI Draft Regenerated', 'Fresh response tailored with Gemini AI.');
  };

  const handleSendReply = (emailId, customBody = null, actorLabel = 'Assistant') => {
    setEmails((prev) =>
      prev.map((em) =>
        em.id === emailId
          ? {
              ...em,
              status: 'resolved',
              sentReply: customBody || draftText,
              sentBy: actorLabel
            }
          : em
      )
    );
    setClientPersonalReplyId(null);
    setClientPersonalReplyText('');
    triggerToast('Reply Sent & Thread Resolved', `Dispatched on behalf of ${actorLabel}.`);
  };

  const handleAddSimulatedEmail = (newEmailObj) => {
    setEmails((prev) => [newEmailObj, ...prev]);
    setSelectedEmailId(newEmailObj.id);
    setActiveFilter('all');
    setRoleMode('assistant');
    setMobileThreadOpen(true);
    triggerToast(
      `AI Classified: ${newEmailObj.owner === 'client' ? 'Client Must Reply' : 'Assistant Handles'}`,
      `Confidence ${newEmailObj.confidence}% • Added to top of inbox.`
    );
  };

  const handleConnectNewClient = ({ name, role, email, provider }) => {
    const newClientId = `client_${Date.now()}`;
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const newClient = {
      id: newClientId,
      name,
      role,
      email,
      provider,
      avatar: initials || 'CL',
      color: 'bg-purple-600'
    };

    const syncedEmails = [
      {
        id: `em_sync_1_${Date.now()}`,
        clientId: newClientId,
        senderName: 'Harsha Vardhan',
        senderRole: 'Managing Director, Blume Ventures',
        senderEmail: 'harsha@blume.vc',
        subject: `Strategic Advisory Invite & Co-Investment Note for ${name.split(' ')[0]}`,
        timestamp: 'Just now',
        date: 'Today',
        category: 'Investor Relations',
        urgency: 'urgent',
        owner: 'client',
        status: 'open',
        confidence: 97,
        aiSummary: `Requests ${name.split(' ')[0]}’s direct confirmation to join advisory syndicate closing Friday.`,
        aiReasoning: 'Personal advisory commitment requires direct executive confirmation.',
        assistantNote: 'Newly synced from connected inbox — high priority.',
        body: `Hi ${name.split(' ')[0]},\n\nFollowing our conversation last week, we would love to have you join our founder advisory circle for the upcoming fintech cohort. Could you confirm your interest by tomorrow?\n\nBest,\nHarsha`,
        drafts: {
          brief: `Hi Harsha,\n\nCount me in — happy to join the advisory circle. Let’s connect briefly this week on next steps.\n\nBest,\n${name.split(' ')[0]}`,
          warm: `Hi Harsha,\n\nThank you for thinking of me! I’d be delighted to join the founder advisory circle and support the cohort. Looking forward to collaborating.\n\nWarm regards,\n${name.split(' ')[0]}`,
          decline: `Hi Harsha,\n\nThank you so much for the invite. Given current bandwidth commitments, I’ll need to sit this cohort out, though I’d love to stay close.\n\nBest,\n${name.split(' ')[0]}`
        }
      },
      {
        id: `em_sync_2_${Date.now()}`,
        clientId: newClientId,
        senderName: 'Four Seasons Concierge',
        senderRole: 'Guest Relations, Bengaluru',
        senderEmail: 'concierge.blr@fourseasons.com',
        subject: 'Private Dining Reservation Confirmation – Friday 8:00 PM',
        timestamp: '2m ago',
        date: 'Today',
        category: 'Hospitality',
        urgency: 'normal',
        owner: 'assistant',
        status: 'open',
        confidence: 95,
        aiSummary: 'Restaurant requests final guest count and menu preference for Friday’s private dining room.',
        aiReasoning: 'Routine dining reservation confirmation handled by executive assistant.',
        assistantNote: '',
        body: `Dear Executive Office,\n\nWe are holding the Private Dining Room for ${name} this Friday at 8:00 PM for 4 guests. Please reconfirm the final headcount by tomorrow noon.\n\nRegards,\nFour Seasons Team`,
        drafts: {
          brief: `Hi Team,\n\nConfirming the table for 4 guests this Friday at 8:00 PM under ${name}. Thank you!\n\nBest,\nExecutive Assistant`,
          warm: `Hi Team,\n\nThank you for holding the room! We confirm 4 guests for Friday at 8:00 PM. Looking forward to a wonderful evening.\n\nWarm regards,\nExecutive Assistant`,
          decline: `Hi Team,\n\nWe need to shift this reservation to next Tuesday at 8:00 PM if available. Please let us know.\n\nThanks,\nExecutive Assistant`
        }
      }
    ];

    setClients((prev) => [...prev, newClient]);
    setEmails((prev) => [...syncedEmails, ...prev]);
    setSelectedClientId(newClientId);
    setSelectedEmailId(syncedEmails[0].id);
    setShowConnectModal(false);
    triggerToast(`${provider} Connected for ${name}`, 'Synced 2 prioritized emails & ran AI triage.');
  };

  // Client Portal Emails
  const clientPortalEmails = useMemo(() => {
    return emails.filter(
      (e) => e.clientId === effectiveClientPortalId && e.owner === 'client' && e.status === 'open'
    );
  }, [emails, effectiveClientPortalId]);

  const activePortalClient = clientMap[effectiveClientPortalId] || clients[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-x-hidden">
      {/* ====================================================================
          TOP NAVIGATION HEADER
      ==================================================================== */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        {/* Left: Brand & Mobile Menu */}
        <div className="flex items-center gap-2.5">
          {roleMode === 'assistant' && (
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">
                  EnvoyAI
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  EXEC COPILOT
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 leading-none">
                AI Executive Inbox & Delegation
              </p>
            </div>
          </div>
        </div>

        {/* Center: Prominent Dual-Role Switcher */}
        <div className="order-3 sm:order-2 w-full sm:w-auto flex justify-center">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 w-full sm:w-auto">
            <button
              onClick={() => setRoleMode('assistant')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                roleMode === 'assistant'
                  ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCog className="w-4 h-4" />
              <span>Assistant Workspace</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-700">
                {counts.all}
              </span>
            </button>
            <button
              onClick={() => setRoleMode('client')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                roleMode === 'client'
                  ? 'bg-white text-amber-700 shadow-xs ring-1 ring-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Client Portal View</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800">
                {
                  emails.filter(
                    (e) => e.clientId === effectiveClientPortalId && e.owner === 'client' && e.status === 'open'
                  ).length
                }
              </span>
            </button>
          </div>
        </div>

        {/* Right: Client Selector + Action Buttons */}
        <div className="order-2 sm:order-3 flex items-center gap-2">
          {/* Client Dropdown */}
          <div className="relative">
            <select
              value={roleMode === 'client' ? effectiveClientPortalId : selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer max-w-[155px] sm:max-w-[220px] truncate"
            >
              {roleMode === 'assistant' && <option value="all">All Clients ({clients.length})</option>}
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.role.split(',')[0]})
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▼
            </span>
          </div>

          {/* Simulate Incoming Email */}
          <button
            onClick={() => setShowSimulateModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Simulate Incoming Email</span>
            <span className="md:hidden">Simulate AI</span>
          </button>

          {/* Connect Account */}
          <button
            onClick={() => setShowConnectModal(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-medium transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Connect Account</span>
          </button>
        </div>
      </header>

      {/* ====================================================================
          VIEW 1: ASSISTANT WORKSPACE (3-Pane Responsive Layout)
      ==================================================================== */}
      {roleMode === 'assistant' ? (
        <div className="flex-1 flex overflow-hidden relative">
          {/* Mobile Drawer Backdrop */}
          {mobileSidebarOpen && (
            <div
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden"
            />
          )}

          {/* PANE 1: LEFT NAVIGATION SIDEBAR */}
          <aside
            className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
              mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            <div className="p-3.5 space-y-5 overflow-y-auto">
              {/* Mobile Sidebar Header */}
              <div className="flex items-center justify-between lg:hidden pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-800 text-sm">Smart Views</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Smart Views Navigation */}
              <div>
                <p className="px-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Smart Triage Queues
                </p>
                <nav className="space-y-1">
                  {[
                    {
                      id: 'all',
                      label: 'All Active Inbox',
                      icon: Inbox,
                      count: counts.all,
                      badgeClass: 'bg-slate-100 text-slate-700'
                    },
                    {
                      id: 'assistant',
                      label: 'Assistant to Handle',
                      icon: UserCog,
                      count: counts.assistant,
                      badgeClass: 'bg-indigo-100 text-indigo-700'
                    },
                    {
                      id: 'client',
                      label: 'Client Action Required',
                      icon: UserCheck,
                      count: counts.client,
                      badgeClass: 'bg-amber-100 text-amber-800'
                    },
                    {
                      id: 'urgent',
                      label: 'Urgent Priority',
                      icon: AlertCircle,
                      count: counts.urgent,
                      badgeClass: 'bg-rose-100 text-rose-700'
                    },
                    {
                      id: 'resolved',
                      label: 'Resolved & Sent',
                      icon: CheckCircle2,
                      count: counts.resolved,
                      badgeClass: 'bg-emerald-100 text-emerald-700'
                    }
                  ].map((item) => {
                    const Icon = item.icon;
                    const active = activeFilter === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveFilter(item.id);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
                          active
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                          {item.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${item.badgeClass}`}>
                          {item.count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Connected Client Inboxes */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between px-2.5 mb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Connected Inboxes
                  </p>
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Sync
                  </span>
                </div>

                <div className="space-y-2">
                  {clients.map((client) => {
                    const isSelected = selectedClientId === client.id;
                    return (
                      <button
                        key={client.id}
                        onClick={() => {
                          setSelectedClientId(isSelected ? 'all' : client.id);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50/60 border-indigo-200'
                            : 'bg-slate-50/70 border-slate-200/70 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg ${client.color} text-white text-xs font-bold flex items-center justify-center shrink-0`}
                          >
                            {client.avatar}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-800 truncate">{client.name}</p>
                            <p className="text-[11px] text-slate-500 truncate">{client.email}</p>
                          </div>
                          <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-white border border-slate-200 text-slate-600">
                            {client.provider}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    setShowConnectModal(true);
                  }}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/40 text-xs font-semibold text-slate-600 hover:text-indigo-700 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Connect Client Inbox
                </button>
              </div>
            </div>

            {/* Bottom AI Efficiency Card */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50/60">
              <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Auto-Triage
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400">95.4% Acc</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {counts.assistant} routine threads ready for 1-click assistant dispatch.
                </p>
              </div>
            </div>
          </aside>

          {/* PANE 2: MIDDLE EMAIL LIST PANE */}
          <section
            className={`w-full lg:w-[390px] xl:w-[430px] border-r border-slate-200 bg-white flex flex-col shrink-0 ${
              mobileThreadOpen ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Search & Quick Filter Bar */}
            <div className="p-3 border-b border-slate-200 space-y-2.5 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sender, subject, or AI summary..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>

              {/* Mobile / Compact Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                {[
                  { id: 'all', label: `All (${counts.all})` },
                  { id: 'client', label: `Client (${counts.client})` },
                  { id: 'assistant', label: `Assistant (${counts.assistant})` },
                  { id: 'urgent', label: `Urgent (${counts.urgent})` },
                  { id: 'resolved', label: `Resolved (${counts.resolved})` }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                      activeFilter === tab.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Cards Feed */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredEmails.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Queue is clear!</p>
                  <p className="text-xs text-slate-500 mt-1">
                    No conversations match this filter. Try simulating a new incoming email.
                  </p>
                </div>
              ) : (
                filteredEmails.map((em) => {
                  const client = clientMap[em.clientId];
                  const isSelected = selectedEmail?.id === em.id;

                  return (
                    <div
                      key={em.id}
                      onClick={() => handleSelectEmail(em.id)}
                      className={`p-3.5 cursor-pointer transition relative ${
                        isSelected
                          ? 'bg-indigo-50/70 border-l-4 border-l-indigo-600'
                          : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                      }`}
                    >
                      {/* Top Row: Client Tag + Urgency + Timestamp */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold text-white ${
                              client?.color || 'bg-slate-600'
                            }`}
                          >
                            For {client?.name.split(' ')[0]}
                          </span>
                          {em.urgency === 'urgent' && em.status === 'open' && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                              URGENT
                            </span>
                          )}
                          {em.status === 'resolved' && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                              RESOLVED
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 shrink-0">{em.timestamp}</span>
                      </div>

                      {/* Sender & Subject */}
                      <div className="mb-1">
                        <p className="text-xs font-semibold text-slate-700 truncate">
                          {em.senderName}{' '}
                          <span className="font-normal text-slate-400">• {em.senderRole}</span>
                        </p>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1 mt-0.5">
                          {em.subject}
                        </h3>
                      </div>

                      {/* 1-Line AI Summary */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2.5">
                        <Sparkles className="w-3 h-3 text-indigo-500 inline mr-1 -mt-0.5" />
                        {em.aiSummary}
                      </p>

                      {/* Bottom Ownership Pill */}
                      <div className="flex items-center justify-between gap-2">
                        {em.owner === 'client' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100/90 text-amber-900 border border-amber-200">
                            <UserCheck className="w-3 h-3 text-amber-700" />
                            Client Must Reply
                          </span>
                        )}
                        {em.owner === 'assistant' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100/90 text-indigo-800 border border-indigo-200">
                            <UserCog className="w-3 h-3 text-indigo-600" />
                            Assistant Handles
                          </span>
                        )}
                        {em.owner === 'fyi' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            FYI / No Action
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400 font-medium">{em.category}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* PANE 3: RIGHT THREAD & AI CO-PILOT PANE */}
          <main
            className={`flex-1 bg-slate-50/70 overflow-y-auto flex flex-col ${
              mobileThreadOpen ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {selectedEmail ? (
              <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-5">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setMobileThreadOpen(false)}
                  className="lg:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Inbox List
                </button>

                {/* Email Thread Header Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-semibold text-white ${
                            clientMap[selectedEmail.clientId]?.color || 'bg-indigo-600'
                          }`}
                        >
                          Client: {clientMap[selectedEmail.clientId]?.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                          {selectedEmail.category}
                        </span>
                        {selectedEmail.urgency === 'urgent' && (
                          <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-rose-100 text-rose-700">
                            High Priority
                          </span>
                        )}
                      </div>
                      <h1 className="text-base sm:text-xl font-bold text-slate-900 leading-snug">
                        {selectedEmail.subject}
                      </h1>
                    </div>

                    <div className="text-right text-xs text-slate-500">
                      <p className="font-medium text-slate-700">{selectedEmail.date}</p>
                      <p>{selectedEmail.timestamp}</p>
                    </div>
                  </div>

                  {/* Sender Metadata */}
                  <div className="flex items-center justify-between py-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                        {selectedEmail.senderName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{selectedEmail.senderName}</p>
                        <p className="text-xs text-slate-500">
                          {selectedEmail.senderRole} • &lt;{selectedEmail.senderEmail}&gt;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="pt-4 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {selectedEmail.body}
                  </div>
                </div>

                {/* AI TRIAGE & OWNERSHIP ANALYSIS CARD */}
                <div
                  className={`rounded-2xl border p-4 sm:p-5 shadow-xs transition ${
                    selectedEmail.owner === 'client'
                      ? 'bg-amber-50/70 border-amber-200'
                      : selectedEmail.owner === 'assistant'
                      ? 'bg-indigo-50/60 border-indigo-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900">
                          AI Ownership & Triage Analysis
                        </h2>
                        <p className="text-[11px] text-slate-500">
                          Confidence Score: <strong className="text-slate-800">{selectedEmail.confidence}%</strong>
                        </p>
                      </div>
                    </div>

                    {/* Interactive Ownership Override Controls */}
                    <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                      <button
                        onClick={() => handleOwnershipChange(selectedEmail.id, 'assistant')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          selectedEmail.owner === 'assistant'
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Assistant Handles
                      </button>
                      <button
                        onClick={() => handleOwnershipChange(selectedEmail.id, 'client')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          selectedEmail.owner === 'client'
                            ? 'bg-amber-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Client Must Reply
                      </button>
                      <button
                        onClick={() => handleOwnershipChange(selectedEmail.id, 'fyi')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          selectedEmail.owner === 'fyi'
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        FYI
                      </button>
                    </div>
                  </div>

                  {/* AI Reasoning Box */}
                  <div className="bg-white/90 rounded-xl p-3 border border-slate-200/80 text-xs sm:text-sm text-slate-700 mb-3">
                    <span className="font-bold text-slate-900">Why AI decided this: </span>
                    {selectedEmail.aiReasoning}
                  </div>

                  {/* Optional Quick Note for Client */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="relative flex-1">
                      <MessageSquarePlus className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={assistantNoteInput}
                        onChange={(e) => setAssistantNoteInput(e.target.value)}
                        placeholder="Add context note for Client Portal (e.g., 'Please confirm Thursday availability')..."
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <button
                      onClick={handleSaveAssistantNote}
                      className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition shrink-0 cursor-pointer"
                    >
                      Pin Note to Client View
                    </button>
                  </div>
                </div>

                {/* AI SMART REPLY COMPOSER */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">AI Smart Reply Composer</h3>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                        {selectedEmail.owner === 'client'
                          ? `Drafted for ${clientMap[selectedEmail.clientId]?.name}`
                          : 'Drafted for Assistant'}
                      </span>
                    </div>

                    {/* Tone Switcher Pills */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                      {[
                        { id: 'brief', label: 'Executive & Brief' },
                        { id: 'warm', label: 'Warm & Helpful' },
                        { id: 'decline', label: 'Polite Decline' }
                      ].map((tone) => (
                        <button
                          key={tone.id}
                          onClick={() => setSelectedTone(tone.id)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                            selectedTone === tone.id
                              ? 'bg-white text-indigo-700 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {tone.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Editable Draft Textarea */}
                  <textarea
                    rows={5}
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />

                  {/* Bottom Composer Actions */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={handleRegenerateDraft}
                      disabled={isRegenerating}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-indigo-600' : ''}`} />
                      {isRegenerating ? 'Regenerating via Gemini...' : 'Regenerate Draft'}
                    </button>

                    <div className="flex items-center gap-2">
                      {selectedEmail.owner === 'client' && (
                        <button
                          onClick={() => {
                            handleOwnershipChange(selectedEmail.id, 'client');
                            setRoleMode('client');
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold transition cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Preview in Client Portal
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleSendReply(
                            selectedEmail.id,
                            draftText,
                            selectedEmail.owner === 'client'
                              ? clientMap[selectedEmail.clientId]?.name
                              : 'Executive Assistant'
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Send Reply & Resolve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </main>
        </div>
      ) : (
        /* ====================================================================
            VIEW 2: MINIMALISTIC CLIENT PORTAL VIEW (Executive Focus Mode)
        ==================================================================== */
        <div className="flex-1 bg-slate-50 py-6 sm:py-10 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Client Welcome Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl ${activePortalClient?.color} text-white font-bold text-lg flex items-center justify-center shadow-sm shrink-0`}
                >
                  {activePortalClient?.avatar}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    Executive Focus Mode
                  </div>
                  <h1 className="text-lg sm:text-2xl font-bold text-slate-900">
                    Welcome back, {activePortalClient?.name.split(' ')[0]}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Your assistant filtered out routine noise. Only{' '}
                    <strong className="text-slate-800">{clientPortalEmails.length} items</strong> require your
                    personal decision today.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setRoleMode('assistant')}
                className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                <CornerUpLeft className="w-3.5 h-3.5" />
                Back to Assistant View
              </button>
            </div>

            {/* Client Action Cards */}
            {clientPortalEmails.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">You’re all caught up!</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
                  Zero emails require your personal attention right now. Your executive assistant is handling all
                  other incoming threads.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {clientPortalEmails.map((em) => {
                  const isEditingPersonal = clientPersonalReplyId === em.id;

                  return (
                    <div
                      key={em.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-amber-300 transition space-y-4"
                    >
                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-800">{em.senderName}</span>
                            <span className="text-xs text-slate-400">• {em.senderRole}</span>
                            {em.urgency === 'urgent' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                                URGENT
                              </span>
                            )}
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900">{em.subject}</h3>
                        </div>
                        <span className="text-xs text-slate-400">{em.timestamp}</span>
                      </div>

                      {/* Assistant Note Callout */}
                      {em.assistantNote && (
                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs sm:text-sm text-amber-950">
                          <UserCog className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Assistant Note: </span>
                            {em.assistantNote}
                          </div>
                        </div>
                      )}

                      {/* AI 1-Line Summary + Original Snippet */}
                      <div className="space-y-2">
                        <p className="text-xs sm:text-sm font-medium text-indigo-950 bg-indigo-50/70 px-3 py-2 rounded-lg border border-indigo-100">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600 inline mr-1.5 -mt-0.5" />
                          <strong>AI Summary:</strong> {em.aiSummary}
                        </p>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                          {em.body}
                        </div>
                      </div>

                      {/* Proposed Assistant Draft Preview */}
                      {!isEditingPersonal ? (
                        <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
                            Recommended Draft Ready to Send:
                          </p>
                          <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line">
                            {em.drafts?.brief}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 block">
                            Write your personal reply:
                          </label>
                          <textarea
                            rows={4}
                            value={clientPersonalReplyText}
                            onChange={(e) => setClientPersonalReplyText(e.target.value)}
                            className="w-full p-3 rounded-xl border border-indigo-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setClientPersonalReplyId(null)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() =>
                                handleSendReply(em.id, clientPersonalReplyText, activePortalClient?.name)
                              }
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              Send Personal Reply
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 1-Click Executive Action Bar */}
                      {!isEditingPersonal && (
                        <div className="pt-2 flex flex-wrap items-center gap-2.5">
                          <button
                            onClick={() =>
                              handleSendReply(em.id, em.drafts?.brief, activePortalClient?.name)
                            }
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            Approve & Send Draft
                          </button>

                          <button
                            onClick={() => {
                              setClientPersonalReplyId(em.id);
                              setClientPersonalReplyText(em.drafts?.brief || '');
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs sm:text-sm font-semibold transition cursor-pointer"
                          >
                            <Mail className="w-4 h-4 text-indigo-600" />
                            I’ll Reply Personally
                          </button>

                          <button
                            onClick={() => handleOwnershipChange(em.id, 'assistant')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs sm:text-sm font-semibold transition sm:ml-auto cursor-pointer"
                          >
                            <UserCog className="w-4 h-4" />
                            Delegate Back to Assistant
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 1: SIMULATE INCOMING EMAIL (LIVE AI TRIAGE)
      ==================================================================== */}
      {showSimulateModal && (
        <SimulateEmailModal
          clients={clients}
          onClose={() => setShowSimulateModal(false)}
          onAddEmail={handleAddSimulatedEmail}
        />
      )}

      {/* ====================================================================
          MODAL 2: CONNECT CLIENT INBOX (OAUTH SIMULATION)
      ==================================================================== */}
      {showConnectModal && (
        <ConnectAccountModal
          onClose={() => setShowConnectModal(false)}
          onConnect={handleConnectNewClient}
        />
      )}

      {/* ====================================================================
          TOAST CONFIRMATION BANNER
      ==================================================================== */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-white text-sm">{toast.title}</p>
            {toast.subtitle && <p className="text-slate-300 mt-0.5">{toast.subtitle}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SUB-COMPONENT: SIMULATE INCOMING EMAIL MODAL
// ============================================================================
function SimulateEmailModal({ clients, onClose, onAddEmail }) {
  const [clientId, setClientId] = useState(clients[0]?.id || 'client_arjun');
  const [senderName, setSenderName] = useState(SIMULATION_PRESETS[0].senderName);
  const [senderRole, setSenderRole] = useState(SIMULATION_PRESETS[0].senderRole);
  const [senderEmail, setSenderEmail] = useState(SIMULATION_PRESETS[0].senderEmail);
  const [subject, setSubject] = useState(SIMULATION_PRESETS[0].subject);
  const [body, setBody] = useState(SIMULATION_PRESETS[0].body);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const applyPreset = (preset) => {
    setClientId(preset.clientId);
    setSenderName(preset.senderName);
    setSenderRole(preset.senderRole);
    setSenderEmail(preset.senderEmail);
    setSubject(preset.subject);
    setBody(preset.body);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setIsAnalyzing(true);

    const targetClient = clients.find((c) => c.id === clientId) || clients[0];
    const aiResult = await analyzeEmailWithAI({
      senderName,
      senderRole,
      subject,
      body,
      clientName: targetClient.name
    });

    const newEmail = {
      id: `em_sim_${Date.now()}`,
      clientId,
      senderName,
      senderRole: senderRole || 'External Contact',
      senderEmail: senderEmail || 'contact@domain.com',
      subject,
      timestamp: 'Just now',
      date: 'Today',
      category: aiResult.category,
      urgency: aiResult.urgency,
      owner: aiResult.owner,
      status: 'open',
      confidence: aiResult.confidence,
      aiSummary: aiResult.aiSummary,
      aiReasoning: aiResult.aiReasoning,
      assistantNote:
        aiResult.owner === 'client' ? 'Auto-flagged by AI triage for your direct review.' : '',
      body,
      drafts: aiResult.drafts
    };

    setIsAnalyzing(false);
    onAddEmail(newEmail);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Simulate Incoming Email (Live AI Triage)
              </h3>
              <p className="text-xs text-slate-500">
                Test real-time ownership detection, urgency scoring & draft generation
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200/60">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Quick Preset Pills */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              1-Click Demo Scenarios:
            </label>
            <div className="flex flex-wrap gap-2">
              {SIMULATION_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200/70 transition cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Target Client Inbox</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm bg-white"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Sender Name</label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Sender Title / Org</label>
              <input
                type="text"
                value={senderRole}
                onChange={(e) => setSenderRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Sender Email</label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email Body</label>
            <textarea
              rows={4}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-200 text-xs sm:text-sm leading-relaxed"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm disabled:opacity-60 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Running AI Triage...' : 'Ingest & Classify with AI'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENT: CONNECT CLIENT ACCOUNT MODAL (OAUTH SIMULATION)
// ============================================================================
function ConnectAccountModal({ onClose, onConnect }) {
  const [provider, setProvider] = useState('Gmail');
  const [name, setName] = useState('Kabir Bedi');
  const [role, setRole] = useState('Founder, CloudScale');
  const [email, setEmail] = useState('kabir@cloudscale.in');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onConnect({ name, role, email, provider });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Connect Client Inbox</h3>
            <p className="text-xs text-slate-500">Authorize delegated OAuth access & sync priority threads</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200/60">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleConnect} className="p-5 space-y-4">
          {/* Provider Selector */}
          <div className="grid grid-cols-2 gap-2.5">
            {['Gmail', 'Outlook'].map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setProvider(item)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                  provider === item
                    ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Globe className={`w-4 h-4 ${provider === item ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div>
                  <p className="text-xs font-bold text-slate-900">{item}</p>
                  <p className="text-[10px] text-slate-500">OAuth 2.0 Sync</p>
                </div>
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Client Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Title & Company</label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Work Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Authorizing & Syncing...' : `Authorize ${provider} & Sync`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}