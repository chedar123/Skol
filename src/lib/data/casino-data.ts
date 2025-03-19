export interface Casino {
  id: string;
  name: string;
  logo: string;
  popupImage: string;
  bonusAmount: string;
  rating: string;
  reviews: string;
  features: string[];
  reviewLink: string;
  ctaLink: string;
  popular?: boolean;
  description?: string;
  bonus?: string;
  affiliateLink?: string;
  tags?: string[];
  hasSwedishLicense?: boolean;
}

export interface Slot {
  id: string;
  name: string;
  image: string;
  gameUrl: string;
  description: string;
}

export interface StreamSchedule {
  date: string;
  time: string;
  title: string;
}

export interface SocialMedia {
  name: string;
  icon: string;
  link: string;
}

export const casinoList: Casino[] = [
  {
    id: "starzino",
    name: "STARZINO",
    logo: "/images/casinos/starzino.png",
    popupImage: "/images/casinos/Starzino2.jpg",
    bonusAmount: "Welcome package up to €1500 bonus + 150 free spins!",
    bonus: "Up to €1500 + 150 spins",
    rating: "4.2",
    reviews: "174",
    features: ["Svensk licens", "Snabb utbetalning", "24/7 support"],
    reviewLink: "/recension/starzino",
    ctaLink: "https://starzinotracker.com/d86dfc5c0",
    affiliateLink: "https://starzinotracker.com/d86dfc5c0",
    popular: true,
    description: "Stort utbud av slots och live casino spel med snabba utbetalningar.",
    tags: ["popular"],
    hasSwedishLicense: true
  },
  {
    id: "ggbet",
    name: "GGBET",
    logo: "/images/casinos/ggbet.png",
    popupImage: "/images/casinos/ggbet3.png",
    bonusAmount: "100% welcome bonus - up to €4500 + 275 spins!",
    bonus: "Up to €4500 + 275 spins",
    rating: "4.7",
    reviews: "256",
    features: ["Svensk licens", "Live casino", "Mobilapp"],
    reviewLink: "/recension/ggbet",
    ctaLink: "https://getggbetpromo.com/l/66dee1775f4ba035ee0e43a5",
    affiliateLink: "https://getggbetpromo.com/l/66dee1775f4ba035ee0e43a5",
    popular: true,
    description: "Stort spelutbud med fokus på esport och sportvadslagning.",
    tags: ["popular"],
    hasSwedishLicense: true
  },
  {
    id: "instantcasino",
    name: "INSTANTCASINO",
    logo: "/images/casinos/instant.png",
    popupImage: "/images/casinos/instant2.png",
    bonusAmount: "10% weekly cashback on all losses!",
    bonus: "10% weekly cashback",
    rating: "4.1",
    reviews: "118",
    features: ["Svensk licens", "Cashback", "Live casino"],
    reviewLink: "/recension/instantcasino",
    ctaLink: "https://record.instantcasinoaffiliates.com/_M3-qV2DN6fYWqcfzuvZcQGNd7ZgqdRLk/1/",
    affiliateLink: "https://record.instantcasinoaffiliates.com/_M3-qV2DN6fYWqcfzuvZcQGNd7ZgqdRLk/1/",
    popular: true,
    description: "Cashback-casino med överraskande enkelt koncept och snabba uttag.",
    tags: ["popular"],
    hasSwedishLicense: true
  },
  {
    id: "hugocasino",
    name: "HUGO CASINO",
    logo: "/images/casinos/Hugo-Casino_logo.jpg",
    popupImage: "/images/casinos/hugo2.png",
    bonusAmount: "225% deposit bonus - up to €600 + 275 spins!",
    bonus: "Up to €600 + 275 spins",
    rating: "4.0",
    reviews: "92",
    features: ["Svensk licens", "Mobilvänligt", "Live casino"],
    reviewLink: "/recension/hugocasino",
    ctaLink: "https://hugoredirect.com/d5f1b591b",
    affiliateLink: "https://hugoredirect.com/d5f1b591b",
    popular: true,
    description: "Populärt casino med många free spins och ett stort spelutbud.",
    tags: ["popular"],
    hasSwedishLicense: false
  }
];

export const slotList: Slot[] = [
  {
    id: "tombstone",
    name: "Tombstone Slaughter",
    image: "/images/slots/Tombstone-Slaughter.png",
    gameUrl: "https://nolimitcity.com/demo/TombstoneSlaughter?showNavbar=true&slug=tombstone-slaughter",
    description: "Wild West-themed slot with explosive features!"
  },
  {
    id: "mental",
    name: "Mental",
    image: "/images/slots/Mental.png",
    gameUrl: "https://nolimitcity.com/demo/Mental?showNavbar=true&slug=mental",
    description: "Intense psychological thriller-themed slot!"
  },
  {
    id: "san-quentin",
    name: "San Quentin",
    image: "/images/slots/San-Quentin.png",
    gameUrl: "https://nolimitcity.com/demo/SanQuentin?showNavbar=true&slug=san-quentin",
    description: "High-stakes prison-themed slot with extreme volatility!"
  },
  {
    id: "deadwood-rip",
    name: "Deadwood RIP",
    image: "/images/slots/Deadwood-RIP.png",
    gameUrl: "https://nolimitcity.com/demo/DeadwoodRip?showNavbar=true&slug=deadwood-rip",
    description: "Vilda västern-slot med hög volatilitet och spännande funktioner!"
  },
  {
    id: "dead-canary",
    name: "Dead Canary",
    image: "/images/slots/dead-canary.jpeg",
    gameUrl: "https://nolimitcity.com/demo/DeadCanary?showNavbar=true&slug=dead-canary",
    description: "Utforska de farliga gruvorna med hög volatilitet och stora vinstmöjligheter!"
  },
  {
    id: "dead-or-deader",
    name: "Dead, Dead Or Deader",
    image: "/images/slots/Dead--Dead-or-DeaLer.png",
    gameUrl: "https://nolimitcity.com/demo/DeadDeadOrDeader?showNavbar=true&slug=dead-dead-or-deader",
    description: "Zombie-apokalyps med extrema multiplikatorer och spännande bonusfunktioner!"
  },
  {
    id: "duck-hunters",
    name: "Duck Hunters",
    image: "/images/slots/San-Quentin.png",
    gameUrl: "https://nolimitcity.com/demo/DuckHunters?showNavbar=true&slug=duck-hunters",
    description: "Jakttema med roliga karaktärer och generösa bonusfunktioner!"
  },
  {
    id: "xways-hoarder-2",
    name: "xWays Hoarder 2",
    image: "/images/slots/xways-hoarder-2.png",
    gameUrl: "https://nolimitcity.com/demo/xWaysHoarder2?showNavbar=true&slug=xways-hoarder-2",
    description: "Uppföljaren till den populära xWays-sloten med ännu fler vinstvägar!"
  },
  {
    id: "outsourced-payday",
    name: "Outsourced: Payday",
    image: "/images/slots/Tombstone-Slaughter.png",
    gameUrl: "https://nolimitcity.com/demo/OutsourcedPayday?showNavbar=true&slug=outsourced-payday",
    description: "Kontorshumor möter höga vinster i denna underhållande slot!"
  },
  {
    id: "tanked",
    name: "Tanked",
    image: "/images/slots/Mental.png",
    gameUrl: "https://nolimitcity.com/demo/Tanked?showNavbar=true&slug=tanked",
    description: "Militärtema med kraftfulla bonusfunktioner och hög volatilitet!"
  },
  {
    id: "munchies",
    name: "Munchies",
    image: "/images/slots/San-Quentin.png",
    gameUrl: "https://nolimitcity.com/demo/Munchies?showNavbar=true&slug=munchies",
    description: "Matinspirerad slot med söta symboler och läckra vinstmöjligheter!"
  },
  {
    id: "outsourced-slash-game",
    name: "Outsourced: Slash Game",
    image: "/images/slots/Deadwood-RIP.png",
    gameUrl: "https://nolimitcity.com/demo/OutsourcedSlashGame?showNavbar=true&slug=outsourced-slash-game",
    description: "Skräcktema med humoristiska inslag och spännande bonusspel!"
  },
  {
    id: "home-of-the-brave",
    name: "Home of the Brave",
    image: "/images/slots/Tombstone-Slaughter.png",
    gameUrl: "https://nolimitcity.com/demo/HomeOfTheBrave?showNavbar=true&slug=home-of-the-brave",
    description: "Patriotiskt tema med kraftfulla funktioner och stora vinstmöjligheter!"
  },
  {
    id: "mental-2",
    name: "Mental 2",
    image: "/images/slots/Mental.png",
    gameUrl: "https://nolimitcity.com/demo/Mental2?showNavbar=true&slug=mental-2",
    description: "Uppföljaren till den skrämmande Mental med ännu mer intensitet och högre vinster!"
  },
  {
    id: "blood-diamond",
    name: "Blood Diamond",
    image: "/images/slots/San-Quentin.png",
    gameUrl: "https://nolimitcity.com/demo/BloodDiamond?showNavbar=true&slug=blood-diamond",
    description: "Äventyr i diamantgruvor med höga insatser och farliga utmaningar!"
  },
  {
    id: "highway-to-hell",
    name: "Highway to Hell",
    image: "/images/slots/Deadwood-RIP.png",
    gameUrl: "https://nolimitcity.com/demo/HighwayToHell?showNavbar=true&slug=highway-to-hell",
    description: "Rock'n'roll-tema med explosiva funktioner och rebellisk attityd!"
  },
  {
    id: "criminal-record",
    name: "Criminal Record",
    image: "/images/slots/Tombstone-Slaughter.png",
    gameUrl: "https://nolimitcity.com/demo/CriminalRecord?showNavbar=true&slug=criminal-record",
    description: "Brottstema med spännande karaktärer och höga insatser!"
  },
  {
    id: "kill-em-all",
    name: "Kill Em All",
    image: "/images/slots/Mental.png",
    gameUrl: "https://nolimitcity.com/demo/KillEmAll?showNavbar=true&slug=kill-em-all",
    description: "Actionfylld slot med extrema multiplikatorer och intensiva bonusspel!"
  },
  {
    id: "fire-in-the-hole-3",
    name: "Fire in the Hole 3",
    image: "/images/slots/San-Quentin.png",
    gameUrl: "https://nolimitcity.com/demo/FireInTheHole3?showNavbar=true&slug=fire-in-the-hole-3",
    description: "Tredje delen i den populära gruvserien med explosiva vinster!"
  },
  {
    id: "rock-bottom",
    name: "Rock Bottom",
    image: "/images/slots/Deadwood-RIP.png",
    gameUrl: "https://nolimitcity.com/demo/RockBottom?showNavbar=true&slug=rock-bottom",
    description: "Utforska havets djup med spännande undervattensäventyr och stora vinster!"
  },
  {
    id: "misery-mining",
    name: "Misery Mining",
    image: "/images/slots/Tombstone-Slaughter.png",
    gameUrl: "https://nolimitcity.com/demo/MiseryMining?showNavbar=true&slug=misery-mining",
    description: "Gruvtema med hög volatilitet och mörk humor!"
  },
  {
    id: "road-rage",
    name: "Road Rage",
    image: "/images/slots/Mental.png",
    gameUrl: "https://nolimitcity.com/demo/RoadRage?showNavbar=true&slug=road-rage",
    description: "Actionfylld biljakt med adrenalinstinna bonusfunktioner!"
  },
  {
    id: "pearl-harbor",
    name: "Pearl Harbor",
    image: "/images/slots/San-Quentin.png",
    gameUrl: "https://nolimitcity.com/demo/PearlHarbor?showNavbar=true&slug=pearl-harbor",
    description: "Historiskt tema med dramatiska bonusspel och stora vinstmöjligheter!"
  },
  {
    id: "karen-maneater",
    name: "Karen Maneater",
    image: "/images/slots/Deadwood-RIP.png",
    gameUrl: "https://nolimitcity.com/demo/KarenManeater?showNavbar=true&slug=karen-maneater",
    description: "Humoristisk slot med satiriska inslag och överraskande bonusfunktioner!"
  },
  {
    id: "hot-nudge",
    name: "Hot Nudge",
    image: "/images/slots/Tombstone-Slaughter.png",
    gameUrl: "https://nolimitcity.com/demo/HotNudge?showNavbar=true&slug=hot-nudge",
    description: "Retro-futuristisk slot med xNudge-funktion och heta multiplikatorer!"
  }
];

export const streamSchedule: StreamSchedule[] = [
  {
    date: "Mon-Thu",
    time: "18:00 CET",
    title: "Bonus Hunt Sessions"
  },
  {
    date: "Saturday",
    time: "19:00 CET",
    title: "High Roller Session"
  }
];

export const socialMedia: SocialMedia[] = [
  { name: "Discord", icon: "/images/socials/discord.png", link: "https://discord.gg/din-discord-inbjudan" },
  { name: "Twitch", icon: "/images/socials/twitch.png", link: "https://twitch.tv/slotskolan" },
  { name: "Twitter", icon: "/images/socials/twitter.png", link: "https://x.com/slotskolan" },
  { name: "YouTube", icon: "/images/socials/youtube.png", link: "https://youtube.com/@slotskolan" },
  { name: "Kick", icon: "/images/socials/kick.png", link: "https://kick.com/slotskolan" }
];

export function getCasinoBySlug(slug: string): Casino | undefined {
  return casinoList.find(casino => casino.id === slug);
}
