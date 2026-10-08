// Demo fallback content used until Supabase tables are seeded.
// Keep in one file so swapping to live data is a one-line change per page.
export type Service = {
  slug: string;
  title: string;
  icon: string; // phosphor icon key used by ServicesGrid
  desc: string;
  duration: string;
  priceFrom: string;
};

export const SERVICES: Service[] = [
  { slug: "general-servicing", title: "General Servicing", icon: "wrench", desc: "Full inspection, fluids, filters & 40-point safety check.", duration: "2-4 hrs", priceFrom: "₦25,000" },
  { slug: "engine-diagnostics", title: "Engine Diagnostics", icon: "cpu", desc: "Dealer-level OBD scan, fault tracing & honest repair plan.", duration: "45-90 min", priceFrom: "₦10,000" },
  { slug: "brake-repair", title: "Brake Repair", icon: "disc", desc: "Pads, discs, calipers & ABS, stopping power restored.", duration: "1-3 hrs", priceFrom: "₦15,000" },
  { slug: "suspension", title: "Suspension & Steering", icon: "move", desc: "Shocks, bushings, tie-rods. No more knocks over Lagos roads.", duration: "2-5 hrs", priceFrom: "₦20,000" },
  { slug: "ac-repair", title: "AC Repair & Regas", icon: "snowflake", desc: "Leak test, compressor & ice-cold regas for traffic heat.", duration: "1-2 hrs", priceFrom: "₦12,000" },
  { slug: "electrical", title: "Auto Electrical", icon: "zap", desc: "Battery, alternator, starter, wiring & dashboard faults.", duration: "1-3 hrs", priceFrom: "₦8,000" },
  { slug: "tire-alignment", title: "Tires & Alignment", icon: "circle", desc: "Fitting, balancing, 3D alignment & rotation.", duration: "45-90 min", priceFrom: "₦7,500" },
  { slug: "oil-change", title: "Oil Change", icon: "droplet", desc: "Quality oil + OEM filter in under 45 minutes.", duration: "~45 min", priceFrom: "₦18,000" },
  { slug: "body-work", title: "Body Work & Paint", icon: "spray", desc: "Dent removal, panel beating & oven-baked spray.", duration: "1-5 days", priceFrom: "Quote" },
];

export const TESTIMONIALS = [
  { name: "Mrs. Adebayo", car: "Toyota Camry 2018", text: "They diagnosed in 30 minutes what two other shops missed. Fair bill, and they showed me the old parts.", rating: 5, date: "Mar 2026" },
  { name: "Chidi O.", car: "Honda Accord 2016", text: "Booked online, car ready same day. AC is ice cold even in traffic. Very professional.", rating: 5, date: "Jun 2026" },
  { name: "Mr. Eze", car: "Lexus RX 350", text: "Transparent pricing and WhatsApp updates with photos. I trust them with both my cars now.", rating: 5, date: "Aug 2026" },
  { name: "Fatima S.", car: "Kia Rio 2019", text: "As a first-time car owner I asked many questions, they never rushed me. Quick turnaround too.", rating: 4, date: "Sep 2026" },
  { name: "Segun A.", car: "Hyundai Tucson 2020", text: "Suspension knock gone after one visit. They road-tested with me before I paid.", rating: 5, date: "Jul 2026" },
  { name: "Ngozi E.", car: "Toyota Corolla 2017", text: "Quote matched the final bill to the naira. That alone keeps me coming back.", rating: 5, date: "May 2026" },
];

export const STATS = [
  { value: 11, suffix: "+", label: "Years in the trade" },
  { value: 4732, suffix: "", label: "Cars serviced" },
  { value: 4.8, suffix: "★", label: "Average rating (612 reviews)", decimals: 1 },
  { value: 93, suffix: "%", label: "Customers who return" },
];

// About page: swap names/photos when real team details arrive.
export const CEO = {
  name: "Gbenga Ogunleye",
  title: "Founder & Chief Executive",
  bio: "Master technician with 12+ years on Nigerian roads, from dealership bays to founding GBOKS AUTOS in Ikeja. Believes every driver deserves a mechanic who explains before charging.",
  message:
    "Bring your car as it is, noisy, overheating, or just due for service. We will inspect it like it is our own, quote you honestly, and return old parts with every job. If we would not put our family in it, we will not hand it back to you.",
};

export const TEAM = [
  { name: "Adaeze Okonkwo", role: "Head of diagnostics", detail: "Engine, ECU and electrical faults.", initials: "AO", tint: "bg-[#E1F3FE] text-[#1F6C9F]" },
  { name: "Tunde Bakare", role: "Lead mechanic", detail: "Servicing, brakes and suspension.", initials: "TB", tint: "bg-[#EDF3EC] text-[#346538]" },
  { name: "Emeka Nwosu", role: "AC and cooling specialist", detail: "AC, radiator and overheating.", initials: "EN", tint: "bg-[#FBF3DB] text-[#956400]" },
  { name: "Aisha Bello", role: "Service advisor", detail: "Bookings, quotes and updates.", initials: "AB", tint: "bg-[#FDEBEC] text-[#9F2F2D]" },
];

export const CERTS = [
  "NASENI-affiliated workshop practices",
  "Dealer-level OBD & diagnostics certified",
  "OEM / OEM-equivalent parts policy",
  "12-month / 10,000 km workmanship guideline",
];
