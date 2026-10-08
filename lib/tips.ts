export type Tip = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  minutes: number;
  date: string;
  body: string[];
};

export const TIPS: Tip[] = [
  {
    slug: "dashboard-warning-lights",
    title: "Dashboard lights: which ones stop you, which ones wait",
    excerpt: "Red means stop soon. Amber means book this week. The exact lights Lagos drivers see most.",
    tag: "Diagnostics",
    minutes: 4,
    date: "Sep 2026",
    body: [
      "Three lights do most of the talking on Lagos roads: engine, temperature, and oil. A steady amber engine light with normal sound and temperature means the computer logged a fault — drive gently and book diagnostics within the week.",
      "A red temperature needle, a red oil can, or a flashing engine light means stop. Pull over safely, switch off, and call. Driving on with no oil pressure or no coolant turns a small seal into an engine rebuild.",
      "Brake and battery lights sit in between. A brake warning with a soft pedal or long travel: do not drive. A battery light with normal running: you have the battery's reserve — head to the workshop the same day, not next week.",
      "When you arrive, tell us the colour, whether it was steady or flashing, and what you felt. That sentence saves thirty minutes of tracing.",
    ],
  },
  {
    slug: "ac-weak-in-traffic",
    title: "AC goes warm in traffic but cold at speed",
    excerpt: "The classic hold-up complaint. Low gas, weak fans, or a tired compressor — how to tell.",
    tag: "AC & cooling",
    minutes: 3,
    date: "Aug 2026",
    body: [
      "If the air is cold on the expressway and warm at idle, the system is short of airflow or refrigerant. At speed, ram air covers for a weak condenser fan. Standing still, there is no cover.",
      "Two quick checks before you visit: with the engine running and AC on max, both fans behind the radiator should spin. And listen for the compressor clicking in and out every few seconds — rapid cycling usually means low gas from a slow leak.",
      "A proper fix is leak test first, then regas — never regas alone on a leaking system. We pressure-test, repair, vacuum, then charge by weight and confirm vent temperature at idle before handover.",
    ],
  },
  {
    slug: "brakes-squeal",
    title: "Brakes squeal in the morning: normal or worn?",
    excerpt: "Light surface rust burns off. Metal-on-metal does not. The sound test that tells them apart.",
    tag: "Brakes",
    minutes: 3,
    date: "Aug 2026",
    body: [
      "A light squeak on the first two stops after overnight rain is surface rust on the discs and it clears by the third stop. That is normal and needs nothing.",
      "A sharp grind, a squeal that lasts all day, or a pedal that vibrates underfoot means the pads are at the wear markers or the discs are scored. That is metal telling you the budget option just expired.",
      "Brake work is pads, discs, calipers and fluid as a system. We measure disc thickness and show you the old pads against new ones, so the quote matches what your eyes see.",
    ],
  },
  {
    slug: "overheating-in-holdup",
    title: "Temperature climbs in hold-ups: what to do roadside",
    excerpt: "Heater on full, engine off if it keeps rising, never open a hot radiator cap.",
    tag: "Cooling",
    minutes: 4,
    date: "Jul 2026",
    body: [
      "If the needle climbs past normal in traffic: switch off the AC, turn the cabin heater to full hot with the fan high. It is unpleasant and it pulls real heat out of the engine — often enough to reach a safe stopping point.",
      "If it keeps climbing, stop and switch off. Wait at least thirty minutes. Never open the radiator or expansion cap while hot; the system is pressurised past boiling point and it will burn you.",
      "Common Lagos causes in order: low coolant from a slow leak, a dead fan or fan relay, a stuck thermostat, then head-gasket trouble. Topping up with water gets you to the bay — then we pressure-test cold to find where it went.",
    ],
  },
  {
    slug: "oil-change-intervals",
    title: "Oil changes: mileage lies, months matter",
    excerpt: "Short trips and dusty harmattan air age oil faster than the odometer admits.",
    tag: "Servicing",
    minutes: 3,
    date: "Jun 2026",
    body: [
      "The sticker says 5,000 km, but a car doing short Ikeja hops in traffic runs hot hours per kilometre. If your trips are short and dusty, change at 5,000 km or 6 months — whichever comes first.",
      "Use the grade on the oil cap or manual, not whatever is cheapest at the roadside. The wrong viscosity shows up months later as sludge and tired timing components, long after the saving is forgotten.",
      "Every oil change here includes an OEM or equivalent filter, a drain-plug washer, and a 40-point look-over. The filter matters as much as the oil — a collapsed cheap filter starves the engine it was meant to protect.",
    ],
  },
  {
    slug: "rainy-season-checklist",
    title: "Before the rains: the six checks that prevent aquaplaning",
    excerpt: "Tires, wipers, lights, brakes, drains and a dry spare. Thirty minutes, once a year.",
    tag: "Seasonal",
    minutes: 4,
    date: "May 2026",
    body: [
      "Tires first: check depth across the full width, not just the middle. Bald edges aquaplane while the middle still looks fine. We measure and show you in millimetres, not adjectives.",
      "Wipers and washers next — a smeared screen at night in rain is as blinding as no lights. Replace blades yearly and fill the washer bottle; Lagos spray is half mud.",
      "Then lights, brakes and drains: all indicators and brake lights working, pads with life left, and the cowl drains below the windscreen clear of leaves so water stops pooling at your feet.",
    ],
  },
];

export function getTip(slug: string): Tip | undefined {
  return TIPS.find((t) => t.slug === slug);
}
