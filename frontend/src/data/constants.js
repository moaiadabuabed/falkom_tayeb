import {
  Heart, Building2, Sparkles, Store, Users, PartyPopper,
  Music, Landmark, GraduationCap, Rocket, Star, Crown,
  ShieldCheck, CheckCircle2, MoreHorizontal,
} from "lucide-react";

export const goldButton = "button gold";
export const outlineButton = "button outline";

/*
  Replace FILL HERE with the real usernames/URLs when you receive them.
  These links are intentionally visible and editable in one place.
*/
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/FILL_HERE",
  facebook: "https://www.facebook.com/FILL_HERE",
  linkedin: "https://www.linkedin.com/in/FILL_HERE",
};

/* Demo-only admin credentials for local testing without a backend. */
export const DEMO_ADMIN = { email: "admin@falkomtayyeb.com", password: "FalkomAdmin2024" };

/* Wizard step labels, in order. */
export const steps = ["Event Details", "Event Type", "Packages", "Requirements", "Review & Submit"];

/*
  Services shown on the public "Our Services" page live in two distinct
  places: the main service-cards grid, and the "ALL TYPES OF EVENTS" list in
  the side card.
*/
export const mainServices = [
  ["WEDDINGS", "Beautifully planned weddings that reflect your love story.", Heart],
  ["CORPORATE EVENTS", "Professional events that elevate your brand and engage your audience.", Building2],
  ["FASHION SHOWS", "Creative production of stunning fashion shows that leave a lasting impression.", Sparkles],
  ["EXHIBITIONS", "End-to-end exhibition solutions that showcase your brand.", Store],
  ["CONFERENCES", "Seamless conference management for impactful and memorable events.", Users],
  ["PRIVATE EVENTS", "Unique celebrations tailored to your special moments.", PartyPopper],
];

export const SERVICE_ICON_OPTIONS = { Heart, Building2, Sparkles, Store, Users, PartyPopper, Music, Landmark, GraduationCap, Rocket, Star, Crown, ShieldCheck, CheckCircle2 };

export const DEFAULT_SERVICE_CARDS = mainServices.map(([title, desc, Icon]) => ({
  title, desc, iconName: Object.keys(SERVICE_ICON_OPTIONS).find(k => SERVICE_ICON_OPTIONS[k] === Icon) || "Sparkles",
}));

export const DEFAULT_EVENT_TYPES = [
  ["Government & Public Events", "Landmark"], ["Entertainment & Live Events", "Music"],
  ["Graduations & School Events", "GraduationCap"], ["Festivals & Cultural Events", "PartyPopper"], ["Product Launches", "Rocket"],
].map(([title, iconName]) => ({ title, iconName }));

/* Event types offered in the booking wizard (Event Type step + admin selects). */
export const eventTypes = [
  ["CORPORATE EVENTS", "Conferences, seminars, product launches, gala dinners and more.", Building2],
  ["WEDDINGS", "Full wedding planning and exceptional celebrations.", Heart],
  ["PRIVATE EVENTS", "Birthday parties, anniversaries and private celebrations.", Users],
  ["FASHION SHOWS", "Runway shows, model management and fashion events.", Sparkles],
  ["EXHIBITIONS", "Exhibition design, booth construction and management.", Store],
  ["GRADUATIONS", "School and university graduation ceremonies and parties.", GraduationCap],
  ["FESTIVALS & CULTURAL", "Festivals, cultural shows and community celebrations.", PartyPopper],
  ["GOVERNMENT EVENTS", "Official ceremonies and government gatherings.", Landmark],
  ["OTHER", "Can't find your event type? Let us know your requirements.", MoreHorizontal],
];

/* Package tiers offered in the Package Selection step. */
export const packages = [
  ["SILVER", "Essential setup for memorable events", ["Basic Stage Setup", "Standard Seating", "Basic Lighting", "Sound System", "Event Coordination"]],
  ["GOLD", "Enhanced experience for your special event", ["Premium Stage Setup", "Comfort Seating", "Advanced Lighting", "Professional Sound", "Event Coordination", "Basic Decorations"]],
  ["DIAMOND", "Complete luxury experience for your event", ["Luxury Stage Setup", "Premium Seating", "Advanced Lighting", "High-End Sound System", "Event Coordination", "Premium Decorations", "VIP Services"]],
];

export const whyChooseUs = [
  ["TRUSTED EXPERTISE", "Years of hands-on experience delivering events across the UAE, from intimate gatherings to large-scale productions.", ShieldCheck],
  ["END-TO-END PLANNING", "From the very first idea to the final teardown, we manage every moving part so you don't have to.", CheckCircle2],
  ["TAILORED TO YOU", "No two events are alike. Every plan is built around your vision, your guests and your budget.", Sparkles],
  ["A TEAM THAT CARES", "Dedicated coordinators stay with you at every step, answering questions and solving problems before they arise.", Users],
];

export const ourValues = [
  ["EXCELLENCE", "We hold every detail, big or small, to the same high standard.", Crown],
  ["CREATIVITY", "We bring fresh ideas to every event, from weddings to product launches.", Sparkles],
  ["RELIABILITY", "Clients count on us to deliver exactly what we promise, on time.", CheckCircle2],
  ["PASSION", "We love what we do, and it shows in the experiences we create.", Heart],
];

/*
  No seeded placeholder photos - the gallery only ever shows what the admin
  actually uploads from the admin panel's Gallery tab.
*/
export const galleryImages = [];
export const galleryFilters = ["ALL", "WEDDINGS", "CORPORATE", "PRIVATE EVENTS", "FASHION SHOWS", "EXHIBITIONS", "CONFERENCES", "GRADUATIONS"];

/*
  Local, dependency-free fallback (a drawn SVG, not a network request) -
  if a photo URL ever goes down, the gallery still shows a clean on-brand
  tile instead of a broken-image icon.
*/
export const GALLERY_FALLBACK = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='760'><rect width='100%' height='100%' fill='#15131a'/><rect x='1' y='1' width='598' height='758' fill='none' stroke='#d4af3766' stroke-width='2'/><text x='50%' y='50%' font-family='Georgia,serif' font-size='26' fill='#d4af37' text-anchor='middle' dominant-baseline='middle' letter-spacing='2'>FALKOM TAYYEB</text></svg>`
);
