export interface EditPrompt {
  id: string;
  label: string;
  prompt: string;
  category: 'staging' | 'lighting' | 'declutter' | 'exterior' | 'repair';
  icon?: string;
}

export const realEstatePrompts: EditPrompt[] = [
  // Møblering (Staging) prompts
  {
    id: 'scandinavian-design',
    label: 'Skandinavisk design',
    prompt: 'Møbler rommet med skandinavisk design - lyse trefarger, minimalistisk stil, funksjonelle møbler, naturlige materialer. Ikke plasser møbler foran dører eller vinduer. Bruk hvite og beige farger med enkle, rene linjer',
    category: 'staging',
  },
  {
    id: 'modern-norwegian',
    label: 'Moderne norsk',
    prompt: 'Legg til moderne norske møbler med lyse farger, rene linjer og naturlige tekstiler. Inkluder designklassikere og funksjonelle løsninger som passer norske hjem',
    category: 'staging',
  },
  {
    id: 'cozy-interior',
    label: 'Koselig interiør',
    prompt: 'Skap et koselig interiør med myke tekstiler, ulltepper, puter og komfortable møbler. Legg til stearinlys og varme elementer for hygge-stemning',
    category: 'staging',
  },
  {
    id: 'minimalist-nordic',
    label: 'Minimalistisk nordisk',
    prompt: 'Innred med minimalistisk nordisk stil - få, men velvalgte møbler, mye luft og rom, naturlige materialer som tre og lin',
    category: 'staging',
  },
  
  // Belysning (Lighting) prompts
  {
    id: 'natural-nordic-light',
    label: 'Naturlig nordisk lys',
    prompt: 'Forbedre med naturlig, nordisk lys - lyst og luftig atmosfære, myke skygger, behagelig dagslys som fremhever rommets beste sider',
    category: 'lighting',
  },
  {
    id: 'warm-lighting',
    label: 'Varm belysning',
    prompt: 'Legg til varm, innbydende belysning som passer norske hjem. Skap en koselig atmosfære med godt balansert lys',
    category: 'lighting',
  },
  {
    id: 'bright-daylight',
    label: 'Klart dagslys',
    prompt: 'Optimaliser dagslys for å vise rommets beste sider, fjern mørke hjørner, skap en frisk og innbydende atmosfære',
    category: 'lighting',
  },
  
  // Rydding (Declutter) prompts
  {
    id: 'scandinavian-minimalism',
    label: 'Skandinavisk minimalisme',
    prompt: 'Fjern unødvendige gjenstander, skap ren skandinavisk minimalisme med fokus på rom, lys og enkelhet',
    category: 'declutter',
  },
  {
    id: 'clean-surfaces',
    label: 'Rene flater',
    prompt: 'Rydd alle overflater, fjern personlige eiendeler og rot, la rommets arkitektur og linjer komme frem',
    category: 'declutter',
  },
  {
    id: 'organized-space',
    label: 'Organisert rom',
    prompt: 'Organiser rommet pent og ryddig, skap balanse og harmoni, behold kun essensielle elementer',
    category: 'declutter',
  },
  
  // Eksteriør (Exterior) prompts
  {
    id: 'norwegian-garden',
    label: 'Norsk hage',
    prompt: 'Forbedre hagen med norske planter, velstelt plen, naturstein og elementer som passer det norske klimaet',
    category: 'exterior',
  },
  {
    id: 'nordic-facade',
    label: 'Nordisk fasade',
    prompt: 'Oppfrisk fasaden med rene linjer og moderne norsk stil, fjern skitt og slitasje, fremhev arkitektoniske detaljer',
    category: 'exterior',
  },
  {
    id: 'entrance-appeal',
    label: 'Innbydende inngang',
    prompt: 'Gjør inngangspartiet innbydende og velstelt med pent arrangerte planter, ren dørmatte og god belysning',
    category: 'exterior',
  },
  
  // Oppussing (Repair) prompts
  {
    id: 'wall-refresh',
    label: 'Oppfrisk vegger',
    prompt: 'Reparer vegger, fjern skader og sprekker, mal i lyse, moderne farger som hvit, lys grå eller varm beige',
    category: 'repair',
  },
  {
    id: 'modern-upgrade',
    label: 'Moderne oppgradering',
    prompt: 'Oppgrader utdaterte elementer til moderne skandinavisk standard, bytt gamle armaturer og håndtak',
    category: 'repair',
  },
  {
    id: 'surface-renewal',
    label: 'Forny overflater',
    prompt: 'Forny overflater med friske, lyse farger typisk for nordisk design, fjern slitasje og merker',
    category: 'repair',
  },
];

export function getPromptsByCategory(category: EditPrompt['category']): EditPrompt[] {
  return realEstatePrompts.filter(prompt => prompt.category === category);
}

export function combinePrompts(...prompts: string[]): string {
  return prompts.filter(Boolean).join('. ');
}

export function enhancePromptForRoom(basePrompt: string, roomType?: string): string {
  const roomEnhancements: Record<string, string> = {
    kitchen: 'moderne hvitevarer, rene benkeplater, organiserte skap, skandinavisk kjøkkendesign',
    bedroom: 'komfortabel seng med hvitt sengetøy, myk belysning, ryddig garderobe, rolig atmosfære',
    bathroom: 'rene armaturer, spa-atmosfære, friske håndklær, minimalistisk design',
    'living-room': 'komfortable sittemøbler, naturlige materialer, god romfølelse, hyggelig atmosfære',
    'dining-room': 'elegant borddekking, godt lys over spisebordet, romslig følelse, skandinaviske designmøbler',
    office: 'organisert arbeidsområde, profesjonelt utseende, god belysning, minimalistisk stil',
    garage: 'rent gulv, organisert lagring, god belysning, ryddig',
  };
  
  if (roomType && roomEnhancements[roomType]) {
    return `${basePrompt}, ${roomEnhancements[roomType]}`;
  }
  
  return basePrompt;
}