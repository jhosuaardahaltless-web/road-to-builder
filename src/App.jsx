import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";
import {
  Lock, Check, Swords, Flame, Coins, Users, Star,
  ChevronDown, ChevronUp, Hammer, Target, BookOpen, PiggyBank,
  PenLine, Trophy, MapPin, Briefcase, Crown, Building2, RotateCcw, LogOut, Cloud,
  MessageCircle, ScrollText, Compass, Radar
} from "lucide-react";

/* ============================ GAME DATA ============================ */

const CHAPTERS = [
  { id: 1, name: "The Freelancer", tagline: "Prove you can work for yourself." },
  { id: 2, name: "The Agency Builder", tagline: "You can't scale yourself. Build a team." },
  { id: 3, name: "The Company Owner", tagline: "Build something that outlasts you." },
  { id: 4, name: "The Builder", tagline: "This was always what it was for." },
];

const LEVELS = [
  /* ---------------- CHAPTER 1 — THE FREELANCER ---------------- */
  {
    id: 1, chapter: 1, title: "The Apprentice", subtitle: "Make your work visible", est: "1–2 weeks",
    quests: [
      { id: "1a", name: "Forge Your GitHub", xp: 80, rep: 2, time: "30 min",
        what: "Create a clean GitHub profile and push ONE real project — even a refactored Apex sample with a proper README.",
        why: "Clients can't trust code they can't see. This is your first piece of public proof.",
        min: "Just create the profile and one empty repo with a README title. Still counts.",
        skip: "You stay invisible. Nobody hires a black box.",
        input: true, placeholder: "Paste your GitHub profile URL" },
      { id: "1b", name: "Document the SLA Project", xp: 100, rep: 3, time: "20 min",
        what: "Write 5 sentences about your SLA / Service Cloud implementation: the problem, what you built, the result.",
        why: "This becomes your strongest case study. You already did the work — make it count.",
        min: "Write ONE sentence about the problem it solved.",
        skip: "Your best work stays a secret.",
        input: true, placeholder: "Write your SLA case study here..." },
      { id: "1c", name: "Document the Maps Integration", xp: 90, rep: 2, time: "20 min",
        what: "Write a short case study on your Google Maps integration — what it connected, why it mattered.",
        why: "Integration work is premium. Clients pay more for it. Show it off.",
        min: "List the two systems you connected.",
        skip: "You undersell your highest-value skill.",
        input: true, placeholder: "Write your Maps integration case study..." },
      { id: "1d", name: "Write Your Specialist Headline", xp: 60, rep: 1, time: "10 min",
        what: "Write a one-line positioning headline. e.g. 'Salesforce Service Cloud & Integration Developer'.",
        why: "Generalists get ignored. Specialists get hired. Pick your lane.",
        min: "Write any version of it. Refine later.",
        skip: "You blend into 10,000 other 'Salesforce developers'.",
        input: true, placeholder: "Your one-line headline..." },
    ],
    boss: { name: "Portfolio Live", desc: "A public page (GitHub README, Notion, or simple site) exists with your 2 case studies and headline visible.",
      input: true, placeholder: "Paste the link to your live portfolio" },
  },
  {
    id: 2, chapter: 1, title: "The Craftsman", subtitle: "Become discoverable", est: "1 week",
    quests: [
      { id: "2a", name: "Create Upwork Profile", xp: 90, rep: 2, time: "45 min",
        what: "Build your Upwork profile with your headline, overview, and Service Cloud skills tagged.",
        why: "This is where the cold-but-real demand lives. Get the line in the water.",
        min: "Create the account and save a draft overview.",
        skip: "You wait for clients who'll never find you.",
        input: true, placeholder: "Paste your Upwork profile URL" },
      { id: "2b", name: "Optimize LinkedIn", xp: 80, rep: 2, time: "30 min",
        what: "Update your LinkedIn headline + About section to your specialist positioning. Add your case studies.",
        why: "Partners and recruiters search LinkedIn for exactly your stack.",
        min: "Update just the headline.",
        skip: "Warm opportunities pass you by silently.",
        input: true, placeholder: "Paste your LinkedIn URL" },
      { id: "2c", name: "Add a Professional Photo", xp: 50, rep: 1, time: "15 min",
        what: "Add a clean, professional headshot to both profiles.",
        why: "Faceless profiles get 3–5x fewer responses. Trust starts with a face.",
        min: "Add it to one profile.",
        skip: "You look like a bot. Clients scroll past.",
        input: false },
    ],
    boss: { name: "Profiles Published", desc: "Both Upwork and LinkedIn are live, public, with photo + headline + a case study visible.",
      input: true, placeholder: "Paste both links to defeat the boss", rep: 4 },
  },
  {
    id: 3, chapter: 1, title: "The Specialist", subtitle: "Build credibility (side track — don't hide here)", est: "2 weeks (timeboxed)",
    quests: [
      { id: "3a", name: "Publish 1 Real Post", xp: 90, rep: 4, time: "30 min",
        what: "Write 1 LinkedIn post about a real Salesforce problem you solved (e.g. the SLA logic, the Maps integration).",
        why: "One good technical post does more than a cert. It proves you can think AND communicate.",
        min: "Write 3 sentences and post them.",
        skip: "You're a great dev nobody's heard of.",
        input: true, placeholder: "Paste the link to your post" },
      { id: "3b", name: "Request a Recommendation", xp: 70, rep: 3, time: "10 min",
        what: "Ask a CloudStaff colleague or manager for a short written recommendation of your work.",
        why: "Social proof you didn't write yourself is gold for cold clients.",
        min: "Send the request message. Receiving it isn't required to complete.",
        skip: "You start every pitch with zero vouching.",
        input: false },
      { id: "3c", name: "Start PD1 (Side Track)", xp: 60, rep: 2, time: "ongoing",
        what: "Begin Platform Developer I prep — but this is OPTIONAL fuel, not a gate. Just start a module.",
        why: "Opens the subcontracting door with partners. But it must NOT block your outreach.",
        min: "Complete one Trailhead module. That's it.",
        skip: "Slightly fewer partner doors — but you can still win without it.",
        input: false },
    ],
    boss: { name: "Credibility Online", desc: "1 public post + recommendation requested. PD1 started OR consciously skipped. Either way — you move on.",
      input: false, rep: 3 },
  },
  {
    id: 4, chapter: 1, title: "The Hunter", subtitle: "Outreach — the engine of everything", est: "ongoing — daily",
    quests: [
      { id: "4a", name: "Tap 5 Warm Contacts", xp: 120, rep: 5, time: "30 min",
        what: "Message 5 people who already know your work — ex-colleagues, CloudStaff network, old contacts. Ask if they know anyone needing Salesforce help.",
        why: "Your FASTEST client is warm, not cold. This is the highest-leverage quest in the whole game.",
        min: "Message just 1 person today.",
        skip: "You take the slowest possible road to your first client.",
        input: true, placeholder: "List who you reached out to" },
      { id: "4b", name: "Send 20 Proposals", xp: 150, rep: 5, time: "across the level",
        what: "Send 20 tailored Upwork proposals (use the Daily Outreach quest to chip away — 1/day).",
        why: "Cold outreach is a numbers game. 20 proposals ≈ your first real conversations.",
        min: "Track them with the daily quest. They add up.",
        skip: "5 proposals and silence is why most quit. Don't be most people.",
        input: false },
      { id: "4c", name: "Message 10 SF Partners", xp: 110, rep: 4, time: "across the level",
        what: "DM 10 Salesforce consulting partners on LinkedIn offering subcontract dev capacity.",
        why: "Partners have overflow work and need certified/skilled hands. This bypasses the review wall entirely.",
        min: "Send 1 partner message.",
        skip: "You ignore the door that opens fastest for skilled devs.",
        input: false },
      { id: "4d", name: "Post in Trailblazer Community", xp: 70, rep: 3, time: "15 min",
        what: "Post your availability + specialty in the Salesforce Trailblazer Community.",
        why: "Devs literally post needs there. Free, warm, targeted.",
        min: "Make one post.",
        skip: "You skip a free pool of buyers who speak your language.",
        input: false },
    ],
    boss: { name: "First Conversation", desc: "A real client or partner has replied and you're in an actual conversation about work.",
      input: true, placeholder: "Describe the conversation that started", rep: 6 },
  },
  {
    id: 5, chapter: 1, title: "The Closer", subtitle: "Turn talk into money", est: "1–4 weeks",
    quests: [
      { id: "5a", name: "Build Your Call Script", xp: 100, rep: 3, time: "30 min",
        what: "Pre-write what you'll say on a discovery call: intro, 3 questions to ask, how you describe your value. Built for your verbal-under-pressure weakness.",
        why: "You don't improvise well live — so don't. A script removes the panic and helps you close.",
        min: "Write your 2-sentence intro.",
        skip: "You freeze on the call and lose a client you'd earned.",
        input: true, placeholder: "Write your call-opening script" },
      { id: "5b", name: "Do Your First Call", xp: 130, rep: 5, time: "30 min",
        what: "Get on a real discovery call with a prospect. Use the script. Listen more than you explain.",
        why: "Most of closing is just showing up calm and clear. The script makes you both.",
        min: "Even a chat-based discovery counts if a call isn't possible.",
        skip: "You stall at the finish line.",
        input: false },
      { id: "5c", name: "Send a Scoped Proposal", xp: 110, rep: 4, time: "30 min",
        what: "Send a clear proposal: scope, timeline, price. Don't over-explain. State it confidently.",
        why: "Vague proposals get ghosted. A clear scope + price gets a yes or a counter — both are progress.",
        min: "Send a one-paragraph quote.",
        skip: "Indecision reads as inexperience.",
        input: false },
    ],
    boss: { name: "First Payment", desc: "Money has hit your account from a freelance client. You are officially no longer 'just an employee'.",
      input: true, placeholder: "How much was your first freelance payment? (PHP)", clients: 1, rep: 8 },
  },
  {
    id: 6, chapter: 1, title: "The Retainer", subtitle: "Make it last", est: "1–2 months",
    quests: [
      { id: "6a", name: "Deliver Clean Work", xp: 120, rep: 4, time: "—",
        what: "Ship the project to your own standards: 90%+ coverage, separation of concerns, no shortcuts.",
        why: "Your reputation is built on the first delivery. Make them want more.",
        min: "Ship something working and tested.",
        skip: "A sloppy first job kills the retainer before it starts.",
        input: false },
      { id: "6b", name: "Ask for a 5-Star Review", xp: 90, rep: 5, time: "10 min",
        what: "Request a review. The first one breaks the cold-start curse forever.",
        why: "Reviews compound. Your second client comes 3x easier than your first.",
        min: "Send the request.",
        skip: "You restart from zero credibility every time.",
        input: false },
      { id: "6c", name: "Propose Ongoing Work", xp: 110, rep: 5, time: "15 min",
        what: "Pitch a monthly retainer or 'ongoing support' arrangement to your happy client.",
        why: "Recurring income is the foundation everything else gets built on.",
        min: "Send the offer message.",
        skip: "You stay stuck in feast-or-famine project hunting.",
        input: false },
    ],
    boss: { name: "First Long-Term Client", desc: "A client has committed to ongoing/retainer work. Chapter 1 complete.",
      input: true, placeholder: "Describe your first retainer arrangement", clients: 1, rep: 10 },
  },

  /* ---------------- CHAPTER 2 — THE AGENCY BUILDER ---------------- */
  {
    id: 7, chapter: 2, title: "The Delegator", subtitle: "Stop being the bottleneck", est: "1–3 months",
    quests: [
      { id: "7a", name: "Document Your Workflow", xp: 120, rep: 3, time: "—",
        what: "Write down how you do your work — your CLAUDE.md, coding standards, delivery process — so someone else could follow it.",
        why: "You can't delegate what only lives in your head.",
        min: "Document one process.",
        skip: "You stay the only person who can do the work.", input: false },
      { id: "7b", name: "Find Your First Subcontractor", xp: 150, rep: 5, time: "—",
        what: "Identify 1 junior dev you could hand small tasks to (part-time / per-task).",
        why: "Your first hire turns you from a worker into a builder.",
        min: "Make a shortlist of candidates.",
        skip: "Your income stays capped at your own hours.", input: true, placeholder: "Who could be your first hire?" },
    ],
    boss: { name: "First Task Delegated", desc: "Someone else completed real client work for you and you reviewed it.", input: false, team: 1, rep: 6 },
  },
  {
    id: 8, chapter: 2, title: "The Juggler", subtitle: "Run multiple clients", est: "2–4 months",
    quests: [
      { id: "8a", name: "Land Client #2 & #3", xp: 160, rep: 6, time: "—",
        what: "Use referrals + reviews to land two more concurrent clients.",
        why: "One client is a job. Three is a business.",
        min: "Land one more.",
        skip: "One client leaving = income to zero.", input: false },
      { id: "8b", name: "Build a Simple Pipeline", xp: 110, rep: 3, time: "—",
        what: "Track leads, proposals, and active work in one place (Notion / spreadsheet).",
        why: "You can't grow what you don't measure.",
        min: "Make the tracker.",
        skip: "Opportunities slip through the cracks.", input: false },
    ],
    boss: { name: "200K / Month", desc: "Combined monthly revenue (salary + freelance) crosses PHP 200,000.", input: true, placeholder: "Current monthly total (PHP)", rep: 8 },
  },
  {
    id: 9, chapter: 2, title: "The Registrant", subtitle: "Make it official", est: "1–2 months",
    quests: [
      { id: "9a", name: "Register Your Business", xp: 140, rep: 5, time: "—",
        what: "Register as a sole proprietor (DTI) — the first legal step toward an agency.",
        why: "Real businesses can invoice, sign contracts, and be taken seriously.",
        min: "Start the registration.",
        skip: "You stay a freelancer, not a company.", input: true, placeholder: "Business name registered" },
      { id: "9b", name: "Create an Agency Brand", xp: 100, rep: 4, time: "—",
        what: "Name, logo, simple landing page for your agency.",
        why: "A brand outlasts and out-earns a personal name.",
        min: "Pick the name.",
        skip: "Clients see a person, not a company.", input: true, placeholder: "Your agency name" },
    ],
    boss: { name: "Agency Exists", desc: "Registered business + brand + landing page are live.", input: true, placeholder: "Paste your agency landing page link", rep: 8 },
  },
  {
    id: 10, chapter: 2, title: "The Systematizer", subtitle: "Build the machine", est: "2–3 months",
    quests: [
      { id: "10a", name: "Standardize Delivery", xp: 130, rep: 4, time: "—",
        what: "Turn your process into repeatable templates: onboarding, scoping, delivery, handover.",
        why: "Systems let the agency run without you in every detail.",
        min: "Template one stage.",
        skip: "Every project reinvents the wheel.", input: false },
      { id: "10b", name: "Second Team Member", xp: 150, rep: 5, time: "—",
        what: "Bring on a second reliable contractor as work grows.",
        why: "Capacity = ability to say yes to bigger work.",
        min: "Identify the person.",
        skip: "You turn away growth because you're maxed out.", input: false },
    ],
    boss: { name: "Runs Without You", desc: "A project was delivered with minimal direct work from you.", input: false, team: 1, rep: 9 },
  },
  {
    id: 11, chapter: 2, title: "The Reputation", subtitle: "Become known", est: "3–6 months",
    quests: [
      { id: "11a", name: "Collect Case Studies", xp: 120, rep: 5, time: "—",
        what: "Publish 3 real client case studies with results on your agency site.",
        why: "Proof at scale attracts bigger clients.",
        min: "Publish one.",
        skip: "You compete on price instead of proof.", input: false },
      { id: "11b", name: "Become Visible in the Community", xp: 110, rep: 6, time: "—",
        what: "Speak, post, or contribute consistently in the Salesforce ecosystem.",
        why: "Inbound clients beat chasing cold ones.",
        min: "One contribution.",
        skip: "You stay a hidden gem.", input: false },
    ],
    boss: { name: "Inbound Lead", desc: "A client found YOU and reached out first.", input: true, placeholder: "Describe your first inbound lead", rep: 10 },
  },
  {
    id: 12, chapter: 2, title: "The Stabilizer", subtitle: "Predictable income", est: "ongoing",
    quests: [
      { id: "12a", name: "3+ Retainer Clients", xp: 160, rep: 6, time: "—",
        what: "Lock in at least 3 recurring clients for predictable monthly revenue.",
        why: "Stability is what lets you take the next big risk.",
        min: "Two retainers locked.",
        skip: "Income stays unpredictable — risky with family costs.", input: false },
      { id: "12b", name: "Pay Yourself + Fund", xp: 120, rep: 3, time: "—",
        what: "Set a system: salary to yourself + fixed % to the Building Fund every month.",
        why: "The building only happens if you pay it first, automatically.",
        min: "Set up the auto-transfer.",
        skip: "The fund never grows past good intentions.", input: false },
    ],
    boss: { name: "300K / Month Agency", desc: "Agency revenue alone reaches PHP 300,000/month. Chapter 2 complete.", input: true, placeholder: "Current agency monthly revenue (PHP)", rep: 12 },
  },

  /* ---------------- CHAPTER 3 — THE COMPANY OWNER ---------------- */
  {
    id: 13, chapter: 3, title: "The Incorporator", subtitle: "Build something that outlasts you", est: "2–3 months",
    quests: [
      { id: "13a", name: "Form a Corporation", xp: 160, rep: 6, time: "—",
        what: "Register a formal corporation (SEC) — protect yourself and signal permanence.",
        why: "Bigger clients and loans require a real legal entity.",
        min: "Start the SEC process.",
        skip: "You hit a ceiling on contract size and credibility.", input: true, placeholder: "Corporation name" },
    ],
    boss: { name: "Company Born", desc: "Your corporation is legally registered.", input: false, rep: 12 },
  },
  {
    id: 14, chapter: 3, title: "The Team Lead", subtitle: "A real team", est: "3–6 months",
    quests: [
      { id: "14a", name: "Hire 3–5 People", xp: 180, rep: 7, time: "—",
        what: "Grow to a stable team of 3–5 developers/admins.",
        why: "A team multiplies what one person could ever bill.",
        min: "Reach 3 people.",
        skip: "You stay a small shop forever.", input: false },
      { id: "14b", name: "First San Carlos Hire", xp: 200, rep: 10, time: "—",
        what: "Hire your first developer FROM San Carlos City. This is the dream taking shape.",
        why: "Bringing opportunity home was always part of the why.",
        min: "Find one local candidate.",
        skip: "The local-impact dream stays abstract.", input: true, placeholder: "Your first San Carlos hire" },
    ],
    boss: { name: "A Real Team", desc: "5-person team operating, including at least one San Carlos local.", input: false, team: 3, rep: 14 },
  },
  {
    id: 15, chapter: 3, title: "The Office", subtitle: "A physical presence", est: "1–3 months",
    quests: [
      { id: "15a", name: "Get an Office", xp: 150, rep: 6, time: "—",
        what: "Secure office space — even a small one in San Carlos.",
        why: "A place makes the company real to clients and team.",
        min: "Tour spaces and pick a budget.",
        skip: "The company stays purely virtual.", input: true, placeholder: "Office location" },
    ],
    boss: { name: "Doors Open", desc: "Your team has a place to work.", input: false, rep: 12 },
  },
  {
    id: 16, chapter: 3, title: "The Brand", subtitle: "Known in the ecosystem", est: "6–12 months",
    quests: [
      { id: "16a", name: "Become a Salesforce Partner", xp: 200, rep: 10, time: "—",
        what: "Apply for and achieve Salesforce Consulting Partner status.",
        why: "Partner status unlocks the biggest, most stable clients.",
        min: "Begin the application.",
        skip: "You're locked out of the top tier of work.", input: false },
    ],
    boss: { name: "Recognized Partner", desc: "Your company is a recognized Salesforce partner.", input: false, rep: 16 },
  },
  {
    id: 17, chapter: 3, title: "The Scaler", subtitle: "Real revenue", est: "ongoing",
    quests: [
      { id: "17a", name: "500K+/Month", xp: 200, rep: 8, time: "—",
        what: "Company revenue consistently exceeds PHP 500,000/month.",
        why: "This is the engine that funds the building in cash or qualifies you for a loan.",
        min: "Cross it once.",
        skip: "The building stays years further away.", input: true, placeholder: "Current monthly company revenue (PHP)" },
    ],
    boss: { name: "Half a Million", desc: "PHP 500K+/month sustained for 3 months.", input: false, rep: 16 },
  },
  {
    id: 18, chapter: 3, title: "The Capitalist", subtitle: "Fund the dream", est: "1–2 years cumulative",
    quests: [
      { id: "18a", name: "Build Fund to 3M+", xp: 220, rep: 8, time: "—",
        what: "Grow your dedicated Building Fund past PHP 3,000,000 — half the target.",
        why: "Halfway to the building. The summit is in sight.",
        min: "Keep logging every deposit.",
        skip: "Momentum stalls right before the goal.", input: false },
    ],
    boss: { name: "Halfway Funded", desc: "Building Fund crosses PHP 3M. Chapter 3 complete.", input: false, rep: 18 },
  },

  /* ---------------- CHAPTER 4 — THE BUILDER ---------------- */
  {
    id: 19, chapter: 4, title: "The Landowner", subtitle: "This was always what it was for", est: "few months",
    quests: [
      { id: "19a", name: "Buy the Lot", xp: 250, rep: 10, time: "—",
        what: "Purchase land in San Carlos City for your building.",
        why: "The dream becomes a coordinate on a map.",
        min: "Shortlist 3 lots and get prices.",
        skip: "The building has nowhere to stand.", input: true, placeholder: "Where is your lot?" },
    ],
    boss: { name: "Land Secured", desc: "You own the ground your building will rise from.", input: false, rep: 20 },
  },
  {
    id: 20, chapter: 4, title: "The Architect", subtitle: "Break ground", est: "1+ year",
    quests: [
      { id: "20a", name: "Design & Permit", xp: 220, rep: 8, time: "—",
        what: "Hire an architect, finalize the design, secure building permits.",
        why: "The vision becomes a blueprint.",
        min: "Engage an architect.",
        skip: "A funded dream that never gets drawn.", input: false },
      { id: "20b", name: "Begin Construction", xp: 280, rep: 12, time: "—",
        what: "Break ground. Construction begins.",
        why: "Years of quests, made physical.",
        min: "Sign the contractor.",
        skip: "—", input: true, placeholder: "The day you broke ground" },
    ],
    boss: { name: "Ground Broken", desc: "Construction has started in San Carlos City.", input: false, rep: 24 },
  },
  {
    id: 21, chapter: 4, title: "The Builder", subtitle: "Dream realized", est: "—",
    quests: [
      { id: "21a", name: "Top It Off", xp: 400, rep: 20, time: "—",
        what: "The building is complete. Ground floor commercial, your name on it, opportunity flowing into San Carlos.",
        why: "Because this was never about Salesforce. It was about this.",
        min: "—",
        skip: "—", input: true, placeholder: "Write what you feel, standing in front of it." },
    ],
    boss: { name: "THE BUILDING STANDS", desc: "You did it, Jhosua. From a solo developer to a builder. The building stands in San Carlos City.", input: false, rep: 100 },
  },
];

const DAILY_QUESTS = [
  { id: "d_outreach", name: "Send Proposals", icon: "target", xp: 50, rep: 2,
    desc: "Send up to 2 targeted Upwork proposals. On dry days, 1 close-enough Salesforce job counts.", flagship: true,
    how: [
      "H|When to spend a Connect",
      "Only fire a proposal when it's a real fit. Check all four before spending: (1) niche match — Service Cloud, SLA, Entitlements, RMA, field service; (2) the client is payment-verified; (3) the job was posted in the last 24–48 hours; (4) fewer than ~20 proposals so far. If it fails any of these, skip it and save the Connect for a better job.",
      "H|On dry days, widen one notch",
      "When there are no true Service Cloud jobs, it's fine to take a close-enough Salesforce job: general Admin/Dev work, Flow automation, case management, or customer portals. Your Dyson and Mimecast production experience still makes you credible there — just adjust the angle of your opening line.",
      "H|How to open the proposal",
      "Lead with THEIR problem and one line of proof you've solved exactly this before. Do not open with 'I am a Salesforce developer with X years of experience' — they've read that 40 times and it puts you in the same pile as everyone else.",
      "GOOD|I saw you need SLA milestones that actually pause the clock when you're waiting on the customer. I built exactly this for a global support team at Dyson — entitlements, business-hours logic, and escalation rules that held up under real case volume. Here's how I'd approach yours: ...",
      "BAD|Hi, I am a certified Salesforce developer with experience in many projects. I am hardworking and can deliver quality work. Please consider me for this job.",
      "Expect roughly 1 reply for every 10–15 proposals when you're starting. That is completely normal — don't read silence as failure. The only target right now is your FIRST reply.",
    ] },
  { id: "d_connect", name: "LinkedIn Connections", icon: "users", xp: 30, rep: 2,
    desc: "Send 5 connection requests with a short personal note. Every day, no exceptions.",
    how: [
      "H|The 3 tiers aren't the same thing",
      "Before you connect, know which tier someone is in — because each tier pays you back differently. Tier 3 is your actual pipeline (people who can buy). Tier 1 and Tier 2 are leverage — they put you in front of Tier 3. Weight your 5 toward Tier 3, a couple toward Tier 1/2. Never a random add.",
      "H|Tier 3 — Direct prospects (your real pipeline)",
      "The master filter, both must be true: are they on Salesforce Service Cloud, AND do they have contractual SLAs that cost them money when missed? If not, custom SLA work is a non-starter for them — skip. Best-fit anchor: field service & equipment maintenance (HVAC, medical devices, elevators, fire/security) — the same buyer who later needs your scheduling and RMA work too. Also strong: MSPs, B2B SaaS with tiered support, telecom, logistics, healthcare, facilities.",
      "Score them on 5 points — (1) on Service Cloud, (2) SLA-heavy industry, (3) has contractual service commitments, (4) decision-maker or close to one (Head/Director/Mgr of Service, Ops, or Support — or owner at a smaller company), (5) active on LinkedIn. Hits 4–5 → connect and track them. Hits 2 or fewer → skip. Don't even spend a comment on them.",
      "GOOD|Hi [Name] — I work with field service teams on the Salesforce side of their SLAs (entitlements, response-time tracking, escalations). Always glad to connect with people running service ops.",
      "GOOD|Hi [Name] — noticed [Company] is scaling its support org. I build the Service Cloud side of that — SLA tracking, case automation, returns workflows. Thought it'd be good to be connected.",
      "H|Tier 1 — Influential voices (leverage, NOT pipeline)",
      "These people never buy — their value is that their audience (your Tier 3 buyers) sees you in their comments. You only need 5–8 good ones. The real test: read their comment section. Full of actual service-business people? Gold. All other consultants? Skip. Aim for mid-sized niche voices — on a mega-account your comment just vanishes.",
      "GOOD|Hi [Name] — really value your posts on Service Cloud design, especially the SLA/entitlement threads. Looking forward to following along.",
      "H|Tier 2 — Connectors (leverage, NOT pipeline)",
      "People who can refer or subcontract to you: Salesforce consultants/agencies who serve your buyer but don't do exactly what you do, fractional ops people, etc. Qualify by — do they serve the same buyer, is what they offer complementary (not competing), and are they reachable?",
      "GOOD|Hi [Name] — looks like we serve the same kind of service teams from different angles (you on [their thing], me on the Service Cloud SLA side). Always good to know people I can trade referrals with.",
      "H|The rule: don't pitch, just connect",
      "Your job here is to start a relationship, not make a sale. Add value publicly before you ever ask for anything privately — this is your runway, and you build the trust before the takeoff. A connection note just plants the flag so they recognise your name later.",
      "BAD|Hi, I'm a Salesforce developer looking for clients. Do you need any Salesforce work done? I can offer good rates.",
      "Five a day, every day — but five that clear a tier, weighted toward Tier 3. Never five random adds.",
    ] },
  { id: "d_comment", name: "Comment Ladder", icon: "comment", xp: 40, rep: 3,
    desc: "Leave ~3 valuable comments a day — spread across the tiers over the week, not one rigidly per tier per day. Be the familiar face.",
    how: [
      "H|Why comments are underrated",
      "Think about your own behaviour: you read a post from someone you admire, then drop straight into the comments to see what the 'town square' is saying — the comments are now part of the content. If your name keeps appearing next to something valuable, people start associating you as a trusted voice in the industry, long before you ever pitch. Every good comment is a small billboard for your business.",
      "In 2026 this is also a hard algorithm signal: a substantive, on-topic comment is one of the strongest reach signals on the platform, and LinkedIn reads your title and industry to decide who else to show you to. Commenting consistently on Service Cloud / support-ops posts literally tags you to that buyer audience. Generic 'Great post 🔥' comments get flagged as low-value — they cost you, they don't help.",
      "H|The Ladder — who's on it",
      "Tier 1 — Creators your dream clients follow: niche Service Cloud / customer-service / support-ops voices (mid-sized, NOT mega Salesforce celebrities — your comment vanishes on a huge account). Objective: borrow their trust and get seen by their audience.",
      "Tier 2 — Peers & collaborators in your niche (other Salesforce consultants, admins, integration devs, complementary freelancers). Objective: build credibility by proximity. Qualify by ROLE (they're a peer), not by their post's likes — a low-engagement post is fine, and you stand out more when you're the only comment. This is your least important tier; keep it small (~5) and don't agonize over it.",
      "Tier 3 — Dream clients themselves (heads of support / service ops at companies you'd love to work with). Objective: warm them up with zero pitching. BUT most Tier 3 barely post — so you reach them mainly through Connections, Signal Outreach, and email, NOT comments. Comment on a Tier 3 only when they actually post (highest value when they do); never burn your daily budget hunting for Tier 3 posts that aren't there.",
      "H|The 3-B test — tier anyone in 5 seconds",
      "Read the headline + their company, not the post. Ask one question: what does this person do for a living — Buy, Build, or Broadcast?",
      "BROADCAST — they create content for an audience = Tier 1. Headline gives it away: Founder/CEO of a tool or media brand, Evangelist, Podcast host, Author, Speaker, MVP, big follower count.",
      "BUILD — they sell a service like you = Tier 2. Headline: Salesforce/ServiceNow Consultant, Developer, Admin, Freelancer, Solutions Architect, Agency owner.",
      "BUY — they run service/support ops inside a company = Tier 3. Headline: Head / Director / VP of Customer Success, Service, Support, or Service Ops — at an end-user company (50–500 people).",
      "The company is the disambiguator: a senior service title at a tool vendor or consultancy is NOT a buyer (that's Tier 1 or a peer, not pipeline). And don't over-think it — mis-tiering rarely costs you anything, because the action (a good comment) is identical for all three. Only Tier 3 is worth verifying carefully, since it's the only tier that becomes pipeline.",
      "H|Which posts get your comment — spend by leverage",
      "Your 3 daily comments are a budget — spend them by leverage, not on whatever scrolls past. HIGHEST, always: niche posts from Tier 3 dream clients (Service Cloud, SLA, entitlements, support-ops) — relationship plus the strongest algorithm signal. SELECTIVE: Salesforce tips/tricks/new-feature posts, especially from Tier 1 voices — good for borrowing their visibility, but generic 'Salesforce dev' topics dilute your Service Cloud authority if you overdo them, so stay in your lane. MINIMIZE: bare 'congrats on the new role!' reactions with no insight — they read as low-value and build nothing.",
      "The fix that makes even a congrats or feature post count: never drop the comment formula. Tie your insight back to your niche. e.g. 'Congrats on the MVP! Your post on case escalation rules is what made me rethink how we pause SLA timers on customer-wait — still using that. Are you seeing teams handle multi-calendar coverage differently now?' Now a celebratory occasion still reads as a substantive, on-topic comment. Topic discipline is one of the algorithm's strongest levers.",
      "H|The comment formula",
      "Compliment the post → add something specific and smart from your own experience → end on a question to keep the conversation going. Never the lazy 'Love this 🔥'.",
      "BAD|Love this! 🔥 Great post, totally agree.",
      "GOOD|Great breakdown of SLA design. The piece most orgs miss is pausing the timer while you're waiting on the customer — we fixed that with entitlement business hours plus a milestone time trigger, and reopened breaches dropped a lot. Curious — are you handling weekend coverage with multiple calendars or one global one?",
      "H|Comment broad, post narrow",
      "Your niche is the buyer and the problem (SLAs, service ops) — not the word 'Service Cloud'. Almost nobody posts 'Service Cloud' daily, but the wider conversation — customer service, support ops, CX, SLAs, field service, returns — is huge, and the algorithm tags you by the topic, not the keyword. So COMMENT broad across that whole conversation (that's where the volume and your buyers are), and save the NARROW Service Cloud / SLA content for your own POSTS, where you own an empty lane nobody else is filling.",
      "Don't expect following Salesforce celebrities (Benioff, Gerholdt, Mazalon, Yu) to feed you Service Cloud posts — they're generalists, and engaging with them can dilute your niche signal. Engage with Service Cloud / customer success / support-ops voices and your dream clients instead.",
      "H|Hunt once, comment daily — the 15-minute fix",
      "If this quest keeps eating 1–3 hours, here's why: you're SOURCING people every day. That's the time sink, not the commenting. Fix it by separating the two jobs. ONCE (a 60–90 min setup, not daily): build a roster of ~5–10 Tier 1 + ~5 Tier 2 voices, Follow them, and hit the 🔔 bell on your top ones. Write the list down — name, tier, link — don't run it from memory. DAILY (15 min): open your feed/notifications and comment on whoever already posted. Zero searching in the daily window.",
      "Build a portfolio, not a frequency rule: 8 Tier 1s who each post weekly = ~1+ post a day combined. A voice who posts only once a week is FINE to keep — that's the whole point of having several. The bell makes sure you catch it.",
      "H|Quality vs volume — settled",
      "Per comment: always QUALITY (the formula, real substance). 'Volume' just means CONSISTENCY — showing up most days beats a burst of 20. The number is 2–3 substantive comments a day, done. Don't chase more. And cap each comment at ~3 minutes — past that you're polishing a comment like it's a contract.",
      "H|Two motions, don't mix them",
      "Comment Ladder = Tier 1 & 2 (warm, on LinkedIn, where there's a steady feed). Direct Outreach = Tier 3 (Connections + Signal Outreach + email — e.g. Google Maps to find the company, Apollo for the email). Tier 3 buyers are mostly inactive on LinkedIn, so don't try to comment-warm them — go direct. Stop hunting for Tier 3 posts during this quest.",
    ] },
  { id: "d_signal", name: "Signal Outreach", icon: "radar", xp: 40, rep: 3,
    desc: "Find 1–3 people who gave a reason to be contacted TODAY, and send each one short, specific message.",
    how: [
      "H|Stop messaging at random",
      "Every day a few of your Tier 3 prospects do something that makes today the right day to reach them. You're not blasting a campaign — you're finding the 1–3 people who just gave you an opening and sending each one a single, specific note. Precision, not volume.",
      "H|The 4 signals — watch for these (strongest first)",
      "1. They posted a problem — a service headache in their own words (missed appointments, lost returns, slow support, messy scheduling). STRONGEST signal: they named the pain themselves.",
      "2. They engaged with relevant content — liked or commented on a post about Salesforce, Service Cloud, field service, RMA/returns, or scheduling. They're already thinking about what you fix.",
      "3. They're hiring — posted a job for service, dispatch, support, or ops staff. Growing team = messier process = your work becomes relevant.",
      "4. New job — a prospect started a new role or company. New role = new problems, new budget, more open to talking.",
      "H|Where to find them (15 min, inside your normal LinkedIn time)",
      "Scan your feed, then check the activity and comment sections of your Tier 1 voices and Tier 2 connectors — they're full of Tier 3 prospects reacting to exactly your topics. Pick just 1–3 who hit a signal today. Zero-signal day? Fine — fall back to connections + comments, don't force it.",
      "H|The message formula — under 5 lines",
      "Line 1 names the signal (prove you noticed the specific thing). Then one sentence connecting it to what you do — not a pitch. Then one low-friction question. Never 'book a 30-min call' in the first message.",
      "GOOD|Saw your post about returns getting lost between the warehouse and support — that gap is usually a Service Cloud workflow problem, and it's fixable. Out of curiosity, is it costing you more in refunds or in staff time right now?",
      "GOOD|Saw you just joined [Company] as Head of Service — congrats. I build the Service Cloud side of support orgs (SLAs, entitlements, returns). No pitch — just curious what the first thing you're hoping to fix there is.",
      "BAD|Hi! I'm a Salesforce developer with experience across many projects. I'd love to set up a 30-minute call to show how I can help your business. When are you free this week?",
      "H|The only scoreboard",
      "Did you send your 1–3 signal messages today? That's the number that matters — not likes, not replies. One message per signal, no follow-up sequence. Prep for 2 minutes, then send — the signal window is short.",
    ] },
  { id: "d_craft", name: "Sharpen the Craft", icon: "book", xp: 30, rep: 1,
    desc: "25 minutes on a cert, Trailhead, or a skill that raises your rate.",
    how: [
      "Protect this time — but never let studying quietly become a hiding place from outreach. The order matters: outreach first, craft second. Refactoring and 'one more cert' are the classic ways preparation eats the day.",
      "Bias toward skills that raise your rate or deepen your niche: Agentforce (early-mover advantage), advanced Flow, integration patterns, and anything that strengthens your Service Cloud story.",
    ] },
  { id: "d_fund", name: "Feed the Fund", icon: "piggy", xp: 20, rep: 0,
    desc: "Log any amount saved toward the building. Even PHP 100.", fund: true },
  { id: "d_proof", name: "Leave Proof", icon: "pen", xp: 20, rep: 1,
    desc: "Write 1 sentence of what you learned or built today.",
    how: [
      "One sentence is enough. The point is a daily internal feedback loop, so progress feels real instead of invisible.",
      "EX|Today I rewrote my Upwork opener to lead with the client's SLA problem instead of my résumé.",
    ] },
];

const WEEKLY_QUESTS = [
  { id: "w_post", name: "Publish 1 Post", icon: "pen", xp: 90, rep: 4,
    desc: "Post once this week about a real Salesforce problem you solved.",
    how: [
      "H|The principle",
      "Add value publicly before you ask for anything privately. The post is your runway — it builds trust with people who'll never comment but quietly watch, so the relationship is already warm when you eventually reach out.",
      "H|A structure you can reuse every week",
      "1) The problem a support/service leader actually feels. 2) What you built. 3) The result it drove. 4) A takeaway or a question to invite replies.",
      "EX|Most support teams think their SLAs are working — until escalations start slipping through. The usual culprit: the timer keeps running while you're waiting on the customer. I rebuilt one team's entitlements so the clock paused correctly on customer-wait, and reopened breaches dropped sharply. If your SLA timer doesn't pause when the ball is in the customer's court, that's the first place I'd look. How is your team handling it?",
      "H|Format matters as much as words (2026 algorithm)",
      "LinkedIn now ranks on dwell time, not likes — how long people actually read. A document/PDF carousel, or a short native video with your face in the first few seconds, holds attention far better than a wall of text, so it travels further. Turn the structure above into a 4–6 slide carousel or a 30–60s talking-head clip. Plain text still works, but it's the weakest format — save it for quick takes, not your one real post of the week.",
      "H|Hook the first 2 lines",
      "Only the first line or two show before 'see more'. Make them a curiosity gap or a sharp claim that earns the click — that click is the dwell-time signal the algorithm is watching for. Use white space, not a dense paragraph.",
      "H|Two rules that decide if you're even seen",
      "1) Never put a link in the post body — it cuts reach by roughly 60%. If you need a link, drop it in the FIRST COMMENT instead. 2) Most of your reach is decided in the first 60–90 minutes (the 'golden hour'): be online right after posting and reply to every comment within ~15 minutes. Early, relevant engagement is what tells the algorithm to keep pushing the post out.",
      "Concrete beats clever. One real thing you shipped → what changed. Specialists get remembered; generalists get scrolled past.",
    ] },
  { id: "w_top25", name: "Tend the Top 25", icon: "compass", xp: 60, rep: 3,
    desc: "Review your Top 25 list and interact with at least 5 of them this week.",
    how: [
      "H|Build the list",
      "Make a list of the 25 people you most want to be top-of-mind for. Mix all three ladder tiers: creators your dream clients follow (Salesforce MVPs / Service Cloud voices), complementary freelancers and consultants, and actual dream clients (heads of support / service ops at target companies).",
      "H|How to work it",
      "Use LinkedIn's Follow feature — or Sales Navigator — so their posts reliably surface in your feed. Then be ever-present in their comments, leaving little billboards for your business in the form of genuinely valuable comments. Interact with at least 5 of the 25 each week.",
      "Refresh the list as you learn who actually engages back. This is your warm pipeline in slow motion — the people you're building familiarity with before any sales conversation ever happens.",
    ] },
];

/* The playbook the user reads BEFORE working — distilled from the freelancer growth transcripts. */
const MISSION_BRIEFING = [
  { h: "The one rule", t: "Add value publicly before you ask for anything privately. Consistency of presence beats quality of pitch. Show up daily BEFORE you have something to sell, so the relationship is already warm when the moment comes." },
  { h: "The Comment Ladder", t: "Tier 1 — creators your dream clients follow (borrow trust). Tier 2 — peers & complementary freelancers (credibility by proximity). Tier 3 — dream clients themselves (warm them up, never pitch). Hit one per tier each day." },
  { h: "How to comment", t: "Compliment the post → add something specific and smart → end on a question. Never 'Love this 🔥'. Every good comment is a billboard with your name on it." },
  { h: "Connection notes", t: "No cold pitch — ever. Short personal note, centered on them. You're just planting the flag so they recognise you later." },
  { h: "The bridge to sales", t: "When a chat gets warm, don't 'switch' to selling — bridge: 'Not sure if this is on your radar right now, but if you're trying to solve [their thing], I'm happy to share a few frameworks that might help. Just say the word.' Direct, not pushy, centered on their problem." },
  { h: "Build the runway", t: "Keep a CRM of 25 dream clients. Interact weekly. You build the trust before the takeoff." },
];

const defaultState = {
  currentLevel: 1,
  lifetimeXP: 0,
  streak: 0,
  lastActiveDate: null,
  stats: { income: 120000, clients: 0, buildingFund: 0, reputation: 0, team: 0 },
  storyDone: {},
  bossDone: {},
  daily: { date: null, done: {}, fundToday: 0 },
  weekly: { week: null, done: {} },
};

const todayStr = () => new Date().toISOString().slice(0, 10);
const weekStr = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  // ISO week: Thursday-anchored
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const wk = 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return d.getFullYear() + "-W" + String(wk).padStart(2, "0");
};
const peso = (n) => "PHP " + Number(n || 0).toLocaleString("en-PH");
const BUILDING_GOAL = 6000000;

/* ============================ ROOT ============================ */

export default function App() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!authReady) {
    return (
      <Shell>
        <div style={S.center}><Cloud size={28} color="#d4a24e" /><div style={S.loadTxt}>Connecting…</div></div>
      </Shell>
    );
  }

  return session ? <Game session={session} /> : <Auth />;
}

/* ============================ AUTH ============================ */

function Auth() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setMsg(null);
    if (!email || pw.length < 6) { setMsg({ t: "err", m: "Enter email and a password of 6+ characters." }); return; }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password: pw });
        if (error) throw error;
        setMsg({ t: "ok", m: "Account created. If email confirmation is on, check your inbox — otherwise just log in." });
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
      }
    } catch (e) {
      setMsg({ t: "err", m: e.message || "Something went wrong." });
    }
    setBusy(false);
  };

  return (
    <Shell>
      <FontInjector />
      <div style={S.authWrap}>
        <Hammer size={34} color="#d4a24e" />
        <div style={S.authTitle}>ROAD TO BUILDER</div>
        <div style={S.authSub}>Your journey from developer to a building in San Carlos.</div>

        <div style={S.authCard}>
          <div style={S.authTabs}>
            <button onClick={() => setMode("login")} style={{ ...S.authTab, ...(mode === "login" ? S.authTabOn : {}) }}>Log In</button>
            <button onClick={() => setMode("signup")} style={{ ...S.authTab, ...(mode === "signup" ? S.authTabOn : {}) }}>Sign Up</button>
          </div>

          <input style={S.authInput} type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} autoCapitalize="none" />
          <input style={S.authInput} type="password" placeholder="Password (6+ chars)" value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()} />

          {msg && <div style={{ ...S.authMsg, color: msg.t === "err" ? "#d98a6a" : "#9cc080" }}>{msg.m}</div>}

          <button style={S.authBtn} onClick={submit} disabled={busy}>
            {busy ? "Please wait…" : mode === "signup" ? "Create Account" : "Enter"}
          </button>
        </div>
        <div style={S.authHint}>Use the same email + password on your phone and computer to sync.</div>
      </div>
    </Shell>
  );
}

/* ============================ GAME ============================ */

function Game({ session }) {
  const [state, setState] = useState(defaultState);
  const [loaded, setLoaded] = useState(false);
  const [openQuest, setOpenQuest] = useState(null);
  const [openHow, setOpenHow] = useState(null);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [drafts, setDrafts] = useState({});
  const [fundInput, setFundInput] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [flash, setFlash] = useState(null);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef(null);
  const userId = session.user.id;

  /* ---- load from cloud ---- */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("game_state").select("state").eq("user_id", userId).maybeSingle();
      if (!error && data && data.state) {
        setState({ ...defaultState, ...data.state, stats: { ...defaultState.stats, ...(data.state.stats || {}) } });
      }
      setLoaded(true);
    })();
  }, [userId]);

  /* ---- daily reset ---- */
  useEffect(() => {
    if (!loaded) return;
    const t = todayStr();
    if (state.daily.date !== t) {
      setState((s) => ({ ...s, daily: { date: t, done: {}, fundToday: 0 } }));
    }
  }, [loaded, state.daily.date]);

  /* ---- weekly reset ---- */
  useEffect(() => {
    if (!loaded) return;
    const w = weekStr();
    if (!state.weekly || state.weekly.week !== w) {
      setState((s) => ({ ...s, weekly: { week: w, done: {} } }));
    }
  }, [loaded, state.weekly?.week]);

  /* ---- debounced cloud save ---- */
  const persist = useCallback((next) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaving(true);
    saveTimer.current = setTimeout(async () => {
      await supabase.from("game_state").upsert(
        { user_id: userId, state: next, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
      setSaving(false);
    }, 700);
  }, [userId]);

  const update = (fn) => setState((s) => { const n = fn(s); persist(n); return n; });

  const fireFlash = (m) => { setFlash(m); setTimeout(() => setFlash(null), 2200); };

  const level = LEVELS.find((l) => l.id === state.currentLevel) || LEVELS[LEVELS.length - 1];
  const chapter = CHAPTERS.find((c) => c.id === level.chapter);
  const levelQuestsDone = level.quests.filter((q) => state.storyDone[q.id]).length;
  const levelProgress = Math.round((levelQuestsDone / level.quests.length) * 100);
  const bossReady = levelQuestsDone === level.quests.length;
  const isFinal = level.id === 21 && state.bossDone[21];
  const fundPct = Math.min(100, (state.stats.buildingFund / BUILDING_GOAL) * 100);

  const completeStory = (q, val) => {
    if (q.input && (!val || val.trim().length < 2)) { fireFlash("Write something real to complete it."); return; }
    update((s) => ({
      ...s,
      storyDone: { ...s.storyDone, [q.id]: q.input ? val.trim() : true },
      lifetimeXP: s.lifetimeXP + q.xp,
      stats: { ...s.stats, reputation: s.stats.reputation + (q.rep || 0) },
    }));
    fireFlash(`+${q.xp} XP — ${q.name} done`);
    setOpenQuest(null);
  };

  const defeatBoss = (val) => {
    const b = level.boss;
    if (b.input && (!val || val.trim().length < 1)) { fireFlash("Enter the proof to defeat the boss."); return; }
    update((s) => ({
      ...s,
      bossDone: { ...s.bossDone, [level.id]: b.input ? val.trim() : true },
      lifetimeXP: s.lifetimeXP + 200,
      stats: {
        ...s.stats,
        reputation: s.stats.reputation + (b.rep || 0),
        clients: s.stats.clients + (b.clients || 0),
        team: s.stats.team + (b.team || 0),
      },
      currentLevel: Math.min(s.currentLevel + 1, 21),
    }));
    fireFlash(`BOSS DEFEATED — ${b.name}`);
    setOpenQuest(null);
  };

  const doDaily = (dq) => {
    if (state.daily.done[dq.id]) return;
    const t = todayStr();
    update((s) => {
      const wasNewDay = s.lastActiveDate !== t;
      let extraFund = 0;
      if (dq.fund) extraFund = parseFloat(String(fundInput).replace(/[^0-9.]/g, "")) || 0;
      return {
        ...s,
        lifetimeXP: s.lifetimeXP + dq.xp,
        streak: wasNewDay ? s.streak + 1 : s.streak,
        lastActiveDate: t,
        stats: { ...s.stats, reputation: s.stats.reputation + (dq.rep || 0), buildingFund: s.stats.buildingFund + extraFund },
        daily: { ...s.daily, date: t, done: { ...s.daily.done, [dq.id]: true }, fundToday: s.daily.fundToday + extraFund },
      };
    });
    if (dq.fund) setFundInput("");
    fireFlash(`+${dq.xp} XP — ${dq.name}`);
  };

  const doWeekly = (wq) => {
    if (state.weekly?.done?.[wq.id]) return;
    const t = todayStr();
    const w = weekStr();
    update((s) => {
      const wasNewDay = s.lastActiveDate !== t;
      return {
        ...s,
        lifetimeXP: s.lifetimeXP + wq.xp,
        streak: wasNewDay ? s.streak + 1 : s.streak,
        lastActiveDate: t,
        stats: { ...s.stats, reputation: s.stats.reputation + (wq.rep || 0) },
        weekly: { week: w, done: { ...(s.weekly?.done || {}), [wq.id]: true } },
      };
    });
    fireFlash(`+${wq.xp} XP — ${wq.name}`);
  };

  const resetGame = () => {
    if (!window.confirm("Reset all progress? This cannot be undone.")) return;
    update(() => ({ ...defaultState }));
    fireFlash("Game reset. New journey begins.");
  };

  const logout = () => supabase.auth.signOut();

  if (!loaded) {
    return <Shell><FontInjector /><div style={S.center}><Hammer size={28} color="#d4a24e" /><div style={S.loadTxt}>Loading your journey…</div></div></Shell>;
  }

  return (
    <Shell>
      <FontInjector />
      {flash && <div style={S.flash}>{flash}</div>}

      <div style={S.wrap}>
        {/* header */}
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={S.heroName}>JHOSUA ARDA</div>
              <div style={S.heroSub}>Salesforce Developer · San Carlos City</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={S.syncDot} title={saving ? "Saving…" : "Synced"}>
                <Cloud size={13} color={saving ? "#e0b563" : "#7fa86a"} />
              </span>
              <button onClick={resetGame} style={S.iconBtn} title="Reset"><RotateCcw size={14} /></button>
              <button onClick={logout} style={S.iconBtn} title="Log out"><LogOut size={14} /></button>
            </div>
          </div>

          <div style={S.chapterTag}><Crown size={13} color="#d4a24e" /><span>Chapter {chapter.id}: {chapter.name}</span></div>
          <div style={S.tagline}>"{chapter.tagline}"</div>

          <div style={S.levelRow}><span style={S.levelNo}>LV {level.id}</span><span style={S.levelTitle}>{level.title}</span></div>
          <div style={S.barOuter}><div style={{ ...S.barInner, width: `${levelProgress}%` }} /></div>
          <div style={S.barMeta}>
            <span>{levelQuestsDone}/{level.quests.length} quests</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Flame size={13} color="#e08a3c" /> {state.streak} day streak</span>
            <span>{state.lifetimeXP} XP</span>
          </div>

          <div style={S.statsGrid}>
            <Stat icon={<Coins size={15} />} label="Income/mo" val={peso(state.stats.income)} />
            <Stat icon={<Users size={15} />} label="Clients" val={state.stats.clients} />
            <Stat icon={<Briefcase size={15} />} label="Team" val={state.stats.team} />
            <Stat icon={<Star size={15} />} label="Reputation" val={state.stats.reputation} />
          </div>

          <div style={S.fundBox}>
            <div style={S.fundHead}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Building2 size={15} color="#d4a24e" /> BUILDING FUND</span>
              <span style={{ color: "#d4a24e" }}>{peso(state.stats.buildingFund)} / {peso(BUILDING_GOAL)}</span>
            </div>
            <div style={S.fundBarOuter}><div style={{ ...S.fundBarInner, width: `${fundPct}%` }} /></div>
            <div style={S.fundCaption}>The building in San Carlos. Every quest leads here.</div>
          </div>
        </div>

        {/* mission briefing */}
        <div style={S.briefing}>
          <div style={S.briefingHead} onClick={() => setBriefingOpen((o) => !o)}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ScrollText size={16} color={gold} />
              <span style={S.briefingTitle}>MISSION BRIEFING</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={S.briefingHint}>read before you work</span>
              {briefingOpen ? <ChevronUp size={16} color={muted} /> : <ChevronDown size={16} color={muted} />}
            </div>
          </div>
          {briefingOpen && (
            <div style={S.briefingBody}>
              {MISSION_BRIEFING.map((b, i) => (
                <div key={i} style={{ marginBottom: i === MISSION_BRIEFING.length - 1 ? 0 : 12 }}>
                  <div style={S.briefingH}>{b.h}</div>
                  <div style={S.briefingT}>{b.t}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* daily */}
        <SectionTitle icon={<Flame size={16} />} text="DAILY QUESTS" sub="Reset every day · keep the streak alive" />
        {DAILY_QUESTS.map((dq) => {
          const done = !!state.daily.done[dq.id];
          const howOpen = openHow === dq.id;
          return (
            <div key={dq.id} style={{ ...S.dailyCard, ...(done ? S.dailyDone : {}), ...(dq.flagship ? S.flagship : {}) }}>
              <div style={S.dailyRow}>
                <div style={S.dailyIcon}>{iconFor(dq.icon)}</div>
                <div style={{ flex: 1 }}>
                  <div style={S.dailyName}>{dq.name}{dq.flagship && <span style={S.flagBadge}>MOST IMPORTANT</span>}</div>
                  <div style={S.dailyDesc}>{dq.desc}</div>
                  {dq.fund && !done && (
                    <input value={fundInput} onChange={(e) => setFundInput(e.target.value)} placeholder="PHP amount saved today" style={S.fundInput} inputMode="numeric" />
                  )}
                  {dq.how && (
                    <button style={S.howBtn} onClick={() => setOpenHow(howOpen ? null : dq.id)}>
                      {howOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />} How to do this
                    </button>
                  )}
                </div>
                <button onClick={() => doDaily(dq)} disabled={done} style={{ ...S.checkBtn, ...(done ? S.checkBtnDone : {}) }}>
                  {done ? <Check size={16} /> : `+${dq.xp}`}
                </button>
              </div>
              {dq.how && howOpen && (
                <div style={S.howBox}>
                  <HowContent lines={dq.how} />
                </div>
              )}
            </div>
          );
        })}

        {/* weekly */}
        <SectionTitle icon={<Compass size={16} />} text="WEEKLY QUESTS" sub="Reset every week · the long game" />
        {WEEKLY_QUESTS.map((wq) => {
          const done = !!state.weekly?.done?.[wq.id];
          const howOpen = openHow === wq.id;
          return (
            <div key={wq.id} style={{ ...S.dailyCard, ...(done ? S.dailyDone : {}) }}>
              <div style={S.dailyRow}>
                <div style={S.dailyIcon}>{iconFor(wq.icon)}</div>
                <div style={{ flex: 1 }}>
                  <div style={S.dailyName}>{wq.name}</div>
                  <div style={S.dailyDesc}>{wq.desc}</div>
                  {wq.how && (
                    <button style={S.howBtn} onClick={() => setOpenHow(howOpen ? null : wq.id)}>
                      {howOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />} How to do this
                    </button>
                  )}
                </div>
                <button onClick={() => doWeekly(wq)} disabled={done} style={{ ...S.checkBtn, ...(done ? S.checkBtnDone : {}) }}>
                  {done ? <Check size={16} /> : `+${wq.xp}`}
                </button>
              </div>
              {wq.how && howOpen && (
                <div style={S.howBox}>
                  <HowContent lines={wq.how} />
                </div>
              )}
            </div>
          );
        })}

        {/* story */}
        <SectionTitle icon={<Swords size={16} />} text={`LEVEL ${level.id} — ${level.title.toUpperCase()}`} sub={`${level.subtitle} · est. ${level.est}`} />
        {level.quests.map((q) => {
          const done = !!state.storyDone[q.id];
          const open = openQuest === q.id;
          return (
            <div key={q.id} style={{ ...S.questCard, ...(done ? S.questDone : {}) }}>
              <div style={S.questHead} onClick={() => setOpenQuest(open ? null : q.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ ...S.questDot, ...(done ? S.questDotDone : {}) }}>{done ? <Check size={13} /> : null}</div>
                  <div><div style={S.questName}>{q.name}</div><div style={S.questXp}>+{q.xp} XP{q.rep ? ` · +${q.rep} rep` : ""} · {q.time}</div></div>
                </div>
                {open ? <ChevronUp size={18} color="#8a7f6a" /> : <ChevronDown size={18} color="#8a7f6a" />}
              </div>
              {open && (
                <div style={S.questBody}>
                  <Field label="WHAT TO DO" text={q.what} />
                  <Field label="WHY IT MATTERS" text={q.why} accent />
                  <Field label="MINIMUM VERSION" text={q.min} />
                  {q.skip && q.skip !== "—" && <Field label="IF SKIPPED" text={q.skip} warn />}
                  {!done && q.input && (
                    <textarea value={drafts[q.id] || ""} onChange={(e) => setDrafts({ ...drafts, [q.id]: e.target.value })} placeholder={q.placeholder} style={S.textarea} />
                  )}
                  {done ? (
                    <div style={S.doneNote}><Check size={13} color="#7fa86a" /> Completed
                      {typeof state.storyDone[q.id] === "string" && <span style={S.savedInput}>"{state.storyDone[q.id]}"</span>}
                    </div>
                  ) : (
                    <button style={S.completeBtn} onClick={() => completeStory(q, drafts[q.id])}>Complete Quest</button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* boss */}
        {!isFinal && (
          <div style={{ ...S.bossCard, ...(bossReady ? S.bossReady : {}) }}>
            <div style={S.bossHead}>{bossReady ? <Swords size={18} color="#e0b563" /> : <Lock size={18} color="#6b6151" />}<span style={S.bossLabel}>BOSS</span></div>
            <div style={S.bossName}>{level.boss.name}</div>
            <div style={S.bossDesc}>{level.boss.desc}</div>
            {bossReady ? (
              <>
                {level.boss.input && (
                  <input value={drafts["boss_" + level.id] || ""} onChange={(e) => setDrafts({ ...drafts, ["boss_" + level.id]: e.target.value })} placeholder={level.boss.placeholder} style={S.bossInput} />
                )}
                <button style={S.bossBtn} onClick={() => defeatBoss(drafts["boss_" + level.id])}>Defeat Boss · Advance to Level {Math.min(level.id + 1, 21)}</button>
              </>
            ) : (
              <div style={S.bossLocked}>Complete all {level.quests.length} quests above to challenge the boss.</div>
            )}
          </div>
        )}

        {isFinal && (
          <div style={S.victory}><Trophy size={40} color="#e0b563" /><div style={S.victoryTitle}>THE BUILDING STANDS</div><div style={S.victorySub}>From solo developer to builder. You did it, Jhosua.</div></div>
        )}

        {/* map */}
        <button style={S.mapToggle} onClick={() => setShowMap(!showMap)}><MapPin size={15} /> {showMap ? "Hide" : "Show"} World Map (21 Levels)</button>
        {showMap && (
          <div style={S.card}>
            {CHAPTERS.map((ch) => (
              <div key={ch.id} style={{ marginBottom: 18 }}>
                <div style={S.mapChapter}>CH {ch.id} · {ch.name}</div>
                {LEVELS.filter((l) => l.chapter === ch.id).map((l) => {
                  const isDone = !!state.bossDone[l.id];
                  const isCurrent = l.id === state.currentLevel;
                  const isLocked = l.id > state.currentLevel;
                  return (
                    <div key={l.id} style={{ ...S.mapNode, ...(isCurrent ? S.mapCurrent : {}), ...(isLocked ? S.mapLocked : {}) }}>
                      <div style={{ width: 24, textAlign: "center" }}>
                        {isDone ? <Check size={14} color="#7fa86a" /> : isLocked ? <Lock size={12} color="#5a5346" /> : <span style={{ color: "#d4a24e" }}>●</span>}
                      </div>
                      <span style={{ fontWeight: isCurrent ? 700 : 400 }}>LV{l.id} · {l.title}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        <div style={S.footer}>Signed in as {session.user.email} · synced to the cloud</div>
      </div>
    </Shell>
  );
}

/* ============================ UI BITS ============================ */

function Shell({ children }) {
  return <div style={S.root}><div style={S.grain} />{children}</div>;
}
function Stat({ icon, label, val }) {
  return <div style={S.statCell}><div style={{ color: "#d4a24e", marginBottom: 4 }}>{icon}</div><div style={S.statVal}>{val}</div><div style={S.statLabel}>{label}</div></div>;
}
function HowContent({ lines }) {
  return (
    <>
      {lines.map((line, i) => {
        if (line.startsWith("GOOD|")) {
          return (
            <div key={i} style={S.howGood}>
              <div style={S.howTagGood}>✓ COPY THIS</div>
              <div style={S.howExampleText}>{line.slice(5)}</div>
            </div>
          );
        }
        if (line.startsWith("BAD|")) {
          return (
            <div key={i} style={S.howBad}>
              <div style={S.howTagBad}>✕ AVOID</div>
              <div style={S.howExampleText}>{line.slice(4)}</div>
            </div>
          );
        }
        if (line.startsWith("EX|")) {
          return (
            <div key={i} style={S.howExample}>
              <div style={S.howExampleText}>{line.slice(3)}</div>
            </div>
          );
        }
        if (line.startsWith("H|")) {
          return <div key={i} style={S.howHeading}>{line.slice(2)}</div>;
        }
        return <div key={i} style={S.howLine}>{line}</div>;
      })}
    </>
  );
}
function SectionTitle({ icon, text, sub }) {
  return <div style={S.sectionTitle}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ color: "#d4a24e" }}>{icon}</span><span style={S.sectionText}>{text}</span></div>{sub && <div style={S.sectionSub}>{sub}</div>}</div>;
}
function Field({ label, text, accent, warn }) {
  return <div style={{ marginBottom: 10 }}><div style={{ ...S.fieldLabel, color: warn ? "#d98a6a" : accent ? "#d4a24e" : "#8a7f6a" }}>{label}</div><div style={{ ...S.fieldText, color: warn ? "#d9b3a3" : "#cabfa8" }}>{text}</div></div>;
}
function iconFor(name) {
  const c = "#d4a24e";
  if (name === "target") return <Target size={18} color={c} />;
  if (name === "book") return <BookOpen size={18} color={c} />;
  if (name === "piggy") return <PiggyBank size={18} color={c} />;
  if (name === "pen") return <PenLine size={18} color={c} />;
  if (name === "users") return <Users size={18} color={c} />;
  if (name === "comment") return <MessageCircle size={18} color={c} />;
  if (name === "compass") return <Compass size={18} color={c} />;
  if (name === "radar") return <Radar size={18} color={c} />;
  return <Hammer size={18} color={c} />;
}
function FontInjector() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Spectral:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
      * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      body { margin:0; }
      textarea, input { font-family: 'Spectral', serif; }
      @keyframes flashIn { from { opacity:0; transform: translate(-50%,-8px);} to {opacity:1; transform:translate(-50%,0);} }
      @keyframes glow { 0%,100%{ box-shadow:0 0 12px rgba(212,162,78,.25);} 50%{ box-shadow:0 0 22px rgba(212,162,78,.5);} }
      ::-webkit-scrollbar{ width:7px;} ::-webkit-scrollbar-thumb{ background:#3a3327; border-radius:4px;}
    `}</style>
  );
}

/* ============================ STYLES ============================ */

const ink = "#e8dcc4", muted = "#8a7f6a", gold = "#d4a24e", bg = "#100d09", card = "#1a1610";

const S = {
  root: { minHeight: "100vh", background: `radial-gradient(circle at 50% 0%, #1d1810 0%, ${bg} 60%)`, color: ink, fontFamily: "Spectral, serif", position: "relative", paddingBottom: 40 },
  grain: { position: "fixed", inset: 0, pointerEvents: "none", opacity: 0.04, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" },
  center: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 },
  loadTxt: { fontFamily: "Cinzel, serif", letterSpacing: 2, color: ink },
  wrap: { maxWidth: 600, margin: "0 auto", padding: "20px 16px", position: "relative", zIndex: 1 },
  flash: { position: "fixed", top: 18, left: "50%", transform: "translateX(-50%)", zIndex: 50, background: "#241d12", border: `1px solid ${gold}`, color: gold, padding: "10px 18px", borderRadius: 8, fontFamily: "Cinzel, serif", fontSize: 13, letterSpacing: 0.5, animation: "flashIn .3s ease", boxShadow: "0 8px 30px rgba(0,0,0,.5)" },

  /* auth */
  authWrap: { maxWidth: 420, margin: "0 auto", padding: "60px 20px", textAlign: "center", position: "relative", zIndex: 1 },
  authTitle: { fontFamily: "Cinzel, serif", fontSize: 26, fontWeight: 700, color: ink, letterSpacing: 2, marginTop: 14 },
  authSub: { color: muted, fontSize: 14, marginTop: 8, fontStyle: "italic" },
  authCard: { background: card, border: "1px solid #2c2519", borderRadius: 14, padding: 22, marginTop: 28, textAlign: "left" },
  authTabs: { display: "flex", gap: 8, marginBottom: 18 },
  authTab: { flex: 1, padding: 10, background: "transparent", border: "1px solid #2c2519", borderRadius: 8, color: muted, fontFamily: "Cinzel, serif", fontSize: 13, cursor: "pointer" },
  authTabOn: { background: "#241d12", borderColor: gold, color: gold },
  authInput: { width: "100%", background: "#15110b", border: "1px solid #2c2519", color: ink, borderRadius: 8, padding: "12px 14px", fontSize: 15, outline: "none", marginBottom: 12 },
  authMsg: { fontSize: 13, marginBottom: 12, lineHeight: 1.4 },
  authBtn: { width: "100%", padding: 13, background: "linear-gradient(90deg,#b8862f,#e0b563)", border: "none", borderRadius: 9, color: "#1a1610", fontFamily: "Cinzel, serif", fontSize: 14, fontWeight: 700, letterSpacing: 0.5, cursor: "pointer" },
  authHint: { color: "#5a5346", fontSize: 12, marginTop: 18, fontStyle: "italic" },

  card: { background: card, border: "1px solid #2c2519", borderRadius: 14, padding: 18, marginBottom: 16, boxShadow: "0 4px 24px rgba(0,0,0,.3)" },
  heroName: { fontFamily: "Cinzel, serif", fontSize: 22, fontWeight: 700, color: ink, letterSpacing: 1 },
  heroSub: { fontSize: 12.5, color: muted, marginTop: 2 },
  syncDot: { display: "flex", alignItems: "center", padding: 7, border: "1px solid #2c2519", borderRadius: 8 },
  iconBtn: { background: "transparent", border: "1px solid #2c2519", color: muted, borderRadius: 8, padding: 7, cursor: "pointer", display: "flex" },

  chapterTag: { display: "flex", alignItems: "center", gap: 6, marginTop: 14, fontFamily: "Cinzel, serif", fontSize: 12.5, color: ink, letterSpacing: 0.5 },
  tagline: { fontStyle: "italic", color: muted, fontSize: 13, marginTop: 3, marginBottom: 14 },
  levelRow: { display: "flex", alignItems: "baseline", gap: 10 },
  levelNo: { fontFamily: "Cinzel, serif", fontSize: 13, color: gold, fontWeight: 700 },
  levelTitle: { fontFamily: "Cinzel, serif", fontSize: 17, color: ink, fontWeight: 600 },
  barOuter: { height: 9, background: "#241f15", borderRadius: 6, marginTop: 8, overflow: "hidden", border: "1px solid #2c2519" },
  barInner: { height: "100%", background: "linear-gradient(90deg,#9c7028,#d4a24e,#e0b563)", borderRadius: 6, transition: "width .5s ease" },
  barMeta: { display: "flex", justifyContent: "space-between", fontSize: 11.5, color: muted, marginTop: 6 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 16 },
  statCell: { background: "#15110b", border: "1px solid #2c2519", borderRadius: 10, padding: "10px 4px", textAlign: "center" },
  statVal: { fontFamily: "Cinzel, serif", fontSize: 12.5, color: ink, fontWeight: 600 },
  statLabel: { fontSize: 9.5, color: muted, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.4 },
  fundBox: { marginTop: 16, background: "#15110b", border: "1px solid #322a1b", borderRadius: 10, padding: 12 },
  fundHead: { display: "flex", justifyContent: "space-between", fontFamily: "Cinzel, serif", fontSize: 11.5, color: ink, letterSpacing: 0.5 },
  fundBarOuter: { height: 7, background: "#241f15", borderRadius: 5, marginTop: 8, overflow: "hidden" },
  fundBarInner: { height: "100%", background: "linear-gradient(90deg,#6b8e5a,#d4a24e)", transition: "width .6s ease" },
  fundCaption: { fontSize: 11, color: muted, fontStyle: "italic", marginTop: 7 },

  sectionTitle: { margin: "22px 4px 12px" },
  sectionText: { fontFamily: "Cinzel, serif", fontSize: 14, color: ink, letterSpacing: 1, fontWeight: 600 },
  sectionSub: { fontSize: 11.5, color: muted, marginTop: 3, marginLeft: 24 },

  dailyCard: { display: "flex", flexDirection: "column", background: card, border: "1px solid #2c2519", borderRadius: 12, padding: 12, marginBottom: 10 },
  dailyRow: { display: "flex", alignItems: "center", gap: 12 },
  howBtn: { display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, background: "transparent", border: "none", color: gold, fontFamily: "Spectral, serif", fontSize: 11.5, cursor: "pointer", padding: 0, opacity: 0.85 },
  howBox: { marginTop: 10, paddingTop: 10, borderTop: "1px solid #2c2519" },
  howLine: { fontSize: 12, color: "#c4b99f", lineHeight: 1.6, marginBottom: 8 },
  howHeading: { fontFamily: "Cinzel, serif", fontSize: 11.5, color: gold, fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase", marginTop: 4, marginBottom: 7 },
  howExample: { background: "#14110b", border: "1px solid #2c2519", borderLeft: `3px solid ${gold}`, borderRadius: 8, padding: "9px 11px", marginBottom: 8 },
  howGood: { background: "#11140d", border: "1px solid #2e3a22", borderLeft: "3px solid #6f9a4a", borderRadius: 8, padding: "9px 11px", marginBottom: 8 },
  howBad: { background: "#16100d", border: "1px solid #3d2620", borderLeft: "3px solid #a85a4a", borderRadius: 8, padding: "9px 11px", marginBottom: 8 },
  howTagGood: { fontSize: 9, fontWeight: 700, letterSpacing: 0.8, color: "#8fb86a", marginBottom: 4 },
  howTagBad: { fontSize: 9, fontWeight: 700, letterSpacing: 0.8, color: "#c87a6a", marginBottom: 4 },
  howExampleText: { fontSize: 12, color: "#d6cbb2", lineHeight: 1.55, fontStyle: "italic" },
  briefing: { background: "#15110b", border: "1px solid #3a2f1a", borderRadius: 12, marginBottom: 16, overflow: "hidden" },
  briefingHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", cursor: "pointer" },
  briefingTitle: { fontFamily: "Cinzel, serif", fontSize: 13, color: gold, fontWeight: 700, letterSpacing: 0.5 },
  briefingHint: { fontSize: 10.5, color: muted, fontStyle: "italic" },
  briefingBody: { padding: "0 14px 14px" },
  briefingH: { fontFamily: "Cinzel, serif", fontSize: 12, color: ink, fontWeight: 600, marginBottom: 3 },
  briefingT: { fontSize: 12, color: "#bcb199", lineHeight: 1.55 },
  flagship: { borderColor: "#4a3c1f", background: "#1d180f" },
  dailyDone: { opacity: 0.55 },
  dailyIcon: { width: 40, height: 40, borderRadius: 10, background: "#15110b", border: "1px solid #2c2519", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  dailyName: { fontFamily: "Cinzel, serif", fontSize: 13.5, color: ink, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  flagBadge: { fontSize: 8.5, background: gold, color: "#1a1610", padding: "2px 6px", borderRadius: 4, fontWeight: 700, letterSpacing: 0.5 },
  dailyDesc: { fontSize: 12, color: muted, marginTop: 3, lineHeight: 1.4 },
  fundInput: { marginTop: 8, width: "100%", background: "#15110b", border: "1px solid #2c2519", color: ink, borderRadius: 8, padding: "8px 10px", fontSize: 13, outline: "none" },
  checkBtn: { minWidth: 48, height: 40, borderRadius: 10, border: `1px solid ${gold}`, background: "transparent", color: gold, fontFamily: "Cinzel, serif", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0 },
  checkBtnDone: { background: "#283520", borderColor: "#4a6138", color: "#9cc080", cursor: "default" },

  questCard: { background: card, border: "1px solid #2c2519", borderRadius: 12, marginBottom: 10, overflow: "hidden" },
  questDone: { borderColor: "#33402a", background: "#161811" },
  questHead: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, cursor: "pointer" },
  questDot: { width: 22, height: 22, borderRadius: "50%", border: `1px solid ${muted}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#9cc080", flexShrink: 0 },
  questDotDone: { background: "#33402a", borderColor: "#4a6138" },
  questName: { fontFamily: "Cinzel, serif", fontSize: 14, color: ink, fontWeight: 600 },
  questXp: { fontSize: 11, color: gold, marginTop: 2 },
  questBody: { padding: "0 14px 16px", borderTop: "1px solid #221c12" },
  fieldLabel: { fontSize: 10, letterSpacing: 1, fontWeight: 700, marginTop: 12, marginBottom: 3, fontFamily: "Cinzel, serif" },
  fieldText: { fontSize: 13.5, lineHeight: 1.5 },
  textarea: { width: "100%", minHeight: 70, marginTop: 12, background: "#15110b", border: "1px solid #2c2519", color: ink, borderRadius: 8, padding: 10, fontSize: 13.5, outline: "none", resize: "vertical" },
  completeBtn: { marginTop: 14, width: "100%", padding: 11, background: "linear-gradient(90deg,#9c7028,#d4a24e)", border: "none", borderRadius: 9, color: "#1a1610", fontFamily: "Cinzel, serif", fontSize: 13.5, fontWeight: 700, letterSpacing: 0.5, cursor: "pointer" },
  doneNote: { marginTop: 12, fontSize: 12.5, color: "#9cc080", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" },
  savedInput: { color: muted, fontStyle: "italic", fontSize: 12 },

  bossCard: { background: "#16110a", border: "1px solid #2c2519", borderRadius: 14, padding: 18, marginTop: 16, marginBottom: 16, opacity: 0.7 },
  bossReady: { opacity: 1, borderColor: gold, animation: "glow 2.5s ease-in-out infinite" },
  bossHead: { display: "flex", alignItems: "center", gap: 8 },
  bossLabel: { fontFamily: "Cinzel, serif", fontSize: 12, letterSpacing: 2, color: gold, fontWeight: 700 },
  bossName: { fontFamily: "Cinzel, serif", fontSize: 19, color: ink, fontWeight: 700, marginTop: 8 },
  bossDesc: { fontSize: 13.5, color: "#cabfa8", marginTop: 6, lineHeight: 1.5 },
  bossInput: { width: "100%", marginTop: 14, background: "#15110b", border: "1px solid #2c2519", color: ink, borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none" },
  bossBtn: { marginTop: 14, width: "100%", padding: 13, background: "linear-gradient(90deg,#b8862f,#e0b563)", border: "none", borderRadius: 9, color: "#1a1610", fontFamily: "Cinzel, serif", fontSize: 14, fontWeight: 700, letterSpacing: 0.5, cursor: "pointer" },
  bossLocked: { marginTop: 12, fontSize: 12.5, color: muted, fontStyle: "italic" },

  victory: { textAlign: "center", padding: 30, background: "#16110a", border: `1px solid ${gold}`, borderRadius: 14, marginTop: 16, animation: "glow 2.5s ease-in-out infinite" },
  victoryTitle: { fontFamily: "Cinzel, serif", fontSize: 22, color: gold, fontWeight: 700, marginTop: 12, letterSpacing: 1 },
  victorySub: { fontSize: 14, color: ink, marginTop: 8 },

  mapToggle: { width: "100%", padding: 12, background: "transparent", border: "1px solid #2c2519", color: muted, borderRadius: 10, fontFamily: "Cinzel, serif", fontSize: 12.5, letterSpacing: 0.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 },
  mapChapter: { fontFamily: "Cinzel, serif", fontSize: 12, color: gold, letterSpacing: 1, marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid #221c12" },
  mapNode: { display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 13, color: ink },
  mapCurrent: { color: gold },
  mapLocked: { color: "#5a5346" },
  footer: { textAlign: "center", fontSize: 11.5, color: "#5a5346", fontStyle: "italic", marginTop: 10 },
};
