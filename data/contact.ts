export const contactHero = {
  eyebrow: "Get in Touch",
  headline: "Let's Talk",
  subtext:
    "For media, partnerships, appearances, and foundation enquiries, send the team a message.",
  image: "/hero.jpeg",
};

export const enquiryTypes = [
  { value: "media", label: "Media and Interviews" },
  { value: "sponsorship", label: "Sponsorship and Endorsements" },
  { value: "events", label: "Event Appearances" },
  { value: "foundation", label: "Foundation and Partnerships" },
  { value: "general", label: "General" },
] as const;

export type EnquiryTypeValue = (typeof enquiryTypes)[number]["value"];

// TODO: Replace these example.com addresses and location with verified details.
export const contactDetails = [
  {
    label: "Management / agent",
    value: "management@ferdinandomanyala.co.ke",
    type: "email",
    href: "mailto:management@ferdinandomanyala.co.ke",
  },
  {
    label: "Media / press",
    value: "press@ferdinandomanyala.co.ke",
    type: "email",
    href: "mailto:press@ferdinandomanyala.co.ke",
  },
  {
    label: "Foundation enquiries",
    value: "foundation@ferdinandomanyala.co.ke",
    type: "email",
    href: "mailto:foundation@ferdinandomanyala.co.ke",
  },
  {
    label: "City / region",
    value: "Nairobi, Kenya (placeholder)",
    type: "location",
    href: "",
  },
] as const;

// URLs are intentionally blank until official social profiles are confirmed.
export const socials = [
  { platform: "Instagram", url: "https://www.instagram.com/ferdiomanyala/" },
  { platform: "X", url: "https://x.com/Ferdiomanyala" },
  { platform: "Facebook", url: "https://web.facebook.com/FerdiOmanyalaOMURWA" },
  // { platform: "YouTube", url: "" },
  { platform: "TikTok", url: "https://www.tiktok.com/@ferdinandomanyala" },
] as const;

export const routingCards: {
  enquiryType: EnquiryTypeValue;
  title: string;
  description: string;
  responseTime: string;
}[] = [
  {
    enquiryType: "media",
    title: "Media & Interviews",
    description:
      "For interview requests, press materials, and media opportunities.",
    responseTime: "Response time to be confirmed",
  },
  {
    enquiryType: "sponsorship",
    title: "Sponsorship & Brands",
    description:
      "For brand partnerships, endorsements, and commercial collaborations.",
    responseTime: "Response time to be confirmed",
  },
  {
    enquiryType: "events",
    title: "Events & Appearances",
    description:
      "For event invitations, speaking requests, and appearance bookings.",
    responseTime: "Response time to be confirmed",
  },
  {
    enquiryType: "foundation",
    title: "Foundation & Partnerships",
    description:
      "For community programs, foundation support, and partnership enquiries.",
    responseTime: "Response time to be confirmed",
  },
];

export const faqs = [
  {
    question: "How do I book an appearance?",
    answer:
      "Choose Event Appearances in the enquiry form and include the event date, location, and details. Availability and booking terms will be confirmed by the team.",
  },
  {
    question: "How can my brand explore a partnership?",
    answer:
      "Select Sponsorship and Endorsements and share your organisation, goals, and proposed collaboration. Partnership opportunities are reviewed by the management team.",
  },
  {
    question: "Do you accept interview requests?",
    answer:
      "Yes. Select Media and Interviews and include your publication, format, proposed timing, and deadline so the request can be routed appropriately.",
  },
  {
    question: "How can I support the foundation?",
    answer:
      "Choose Foundation and Partnerships and describe the kind of support or collaboration you have in mind. Visit the Foundation page for more about its work.",
  },
  {
    question: "What should I include in my message?",
    answer:
      "A clear summary, relevant dates, your organisation or publication, and the best way to follow up will help the team understand your enquiry.",
  },
  {
    question: "When should I expect a reply?",
    answer:
      "Response times are placeholders and have not yet been confirmed. The team will follow up if your enquiry can be taken forward.",
  },
] as const;

export const contactCopy = {
  metadataTitle: "Contact — Ferdinand Omanyala",
  metadataDescription:
    "Contact the team for media, partnership, appearance, and foundation enquiries.",
  formEyebrow: "Send an Enquiry",
  formTitle: "Tell us what you have in mind.",
  formIntro:
    "Share a few details below and your enquiry can be directed to the right team.",
  fullNameLabel: "Full name",
  emailLabel: "Email address",
  phoneLabel: "Phone (optional)",
  organisationLabel: "Organisation (optional)",
  enquiryTypeLabel: "Enquiry type",
  messageLabel: "Message",
  messageHint: "Please include at least 20 characters.",
  selectPlaceholder: "Choose an enquiry type",
  messagePlaceholder: "How can the team help?",
  submitLabel: "Send enquiry",
  sendingLabel: "Sending...",
  successTitle: "Thanks for reaching out.",
  successMessage:
    "This contact form is a preview and is not connected to an inbox yet. No message was sent.",
  successResetLabel: "Send another enquiry",
  networkError:
    "We couldn't reach the contact service. Your message is still here; please try again.",
  errorTitle: "Your enquiry couldn't be sent.",
  retryLabel: "Try again",
  detailsEyebrow: "Contact Details",
  detailsTitle: "Reach the right team.",
  detailsIntro:
    "Contact addresses and location below are placeholders pending verification.",
  socialHeading: "Follow along",
  noSocials:
    "Official social links will appear here once they have been confirmed.",
  routingEyebrow: "Enquiry Routing",
  routingTitle: "A good place to start.",
  routingIntro:
    "Choose a topic and we'll set the enquiry type in the form for you.",
  routingButtonLabel: "Start this enquiry",
  faqEyebrow: "FAQ",
  faqTitle: "A few quick answers.",
  closingEyebrow: "Keep in touch",
  closingTitle: "Prefer to connect on social?",
  closingText:
    "Follow the official channels once their links are confirmed, or learn more about the Foundation.",
  foundationLinkLabel: "Explore the Foundation",
  accordionInstructions:
    "Use the arrow keys to move between questions. Press Enter or Space to expand an answer.",
  honeypotLabel: "Leave this field empty",
  validation: {
    fullNameRequired: "Enter your full name.",
    fullNameTooLong: "Name must be 120 characters or fewer.",
    emailRequired: "Enter your email address.",
    emailInvalid: "Enter a valid email address.",
    emailTooLong: "Email must be 254 characters or fewer.",
    phoneTooLong: "Phone must be 40 characters or fewer.",
    organisationTooLong: "Organisation must be 120 characters or fewer.",
    enquiryTypeRequired: "Choose an enquiry type.",
    messageRequired: "Enter a message.",
    messageTooShort: "Message must be at least 20 characters.",
    messageTooLong: "Message must be 5,000 characters or fewer.",
  },
  apiSuccessMessage:
    "Preview success only. This enquiry was not stored or sent to an inbox.",
} as const;
