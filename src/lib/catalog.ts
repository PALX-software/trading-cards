import type { StickerCatalog } from './types'

export interface StickerDef {
  number: string
  player_name: string
  team: string
  section: string
  sticker_type: 'player' | 'logo' | 'badge' | 'special'
  image_url: string | null
}

// ---------------------------------------------------------------------------
// Team codes
// ---------------------------------------------------------------------------
export const TEAM_CODES: Record<string, string> = {
  Argentina: 'ARG',
  Brazil: 'BRA',
  France: 'FRA',
  Germany: 'GER',
  Spain: 'ESP',
  England: 'ENG',
  Italy: 'ITA',
  Portugal: 'POR',
  Netherlands: 'NED',
  Belgium: 'BEL',
  Croatia: 'CRO',
  Uruguay: 'URU',
  Mexico: 'MEX',
  USA: 'USA',
  Japan: 'JPN',
  'South Korea': 'KOR',
  Morocco: 'MAR',
  Senegal: 'SEN',
  Australia: 'AUS',
  Denmark: 'DEN',
  Switzerland: 'SUI',
  Poland: 'POL',
  Ecuador: 'ECU',
  Cameroon: 'CMR',
  Canada: 'CAN',
  Ghana: 'GHA',
  Qatar: 'QAT',
  Serbia: 'SRB',
  Tunisia: 'TUN',
  Iran: 'IRN',
  'Saudi Arabia': 'KSA',
  Wales: 'WAL',
}

// ---------------------------------------------------------------------------
// Known player rosters (13 players per team)
// ---------------------------------------------------------------------------
const KNOWN_PLAYERS: Record<string, string[]> = {
  Argentina: [
    'Lionel Messi',
    'Enzo Fernández',
    'Julián Álvarez',
    'Rodrigo De Paul',
    'Lautaro Martínez',
    'Emiliano Martínez',
    'Cristian Romero',
    'Leandro Paredes',
    'Ángel Di María',
    'Alexis Mac Allister',
    'Germán Pezzella',
    'Nahuel Molina',
    'Thiago Almada',
  ],
  Brazil: [
    'Vinicius Jr',
    'Rodrygo',
    'Casemiro',
    'Alisson Becker',
    'Marquinhos',
    'Raphinha',
    'Endrick',
    'Bruno Guimarães',
    'Militão',
    'Pedro',
    'Gerson',
    'Danilo',
    'Fred',
  ],
  France: [
    'Kylian Mbappé',
    'Antoine Griezmann',
    'Ousmane Dembélé',
    "N'Golo Kanté",
    'Aurélien Tchouaméni',
    'Mike Maignan',
    'Jules Koundé',
    'Dayot Upamecano',
    'Marcus Thuram',
    'Eduardo Camavinga',
    'Kingsley Coman',
    'Lucas Hernández',
    'Ibrahima Konaté',
  ],
  Germany: [
    'Florian Wirtz',
    'Jamal Musiala',
    'Joshua Kimmich',
    'Manuel Neuer',
    'Antonio Rüdiger',
    'Kai Havertz',
    'Leroy Sané',
    'Toni Kroos',
    'Thomas Müller',
    'Niclas Füllkrug',
    'Ilkay Gündogan',
    'David Raum',
    'Nico Schlotterbeck',
  ],
  Spain: [
    'Pedri',
    'Gavi',
    'Rodri',
    'Álvaro Morata',
    'Unai Simón',
    'Aymeric Laporte',
    'Ferran Torres',
    'Dani Olmo',
    'Mikel Merino',
    'Alejandro Balde',
    'Nico Williams',
    'Lamine Yamal',
    'Marcos Llorente',
  ],
  England: [
    'Harry Kane',
    'Jude Bellingham',
    'Phil Foden',
    'Bukayo Saka',
    'Jordan Pickford',
    'John Stones',
    'Kyle Walker',
    'Declan Rice',
    'Marcus Rashford',
    'Jack Grealish',
    'Kieran Trippier',
    'Luke Shaw',
    'Conor Gallagher',
  ],
}

// Fallback generator for teams without known rosters
function genericPlayers(team: string): string[] {
  return [
    `${team} Captain`,
    `${team} Goalkeeper`,
    `${team} Defender 1`,
    `${team} Defender 2`,
    `${team} Defender 3`,
    `${team} Defender 4`,
    `${team} Midfielder 1`,
    `${team} Midfielder 2`,
    `${team} Midfielder 3`,
    `${team} Midfielder 4`,
    `${team} Forward 1`,
    `${team} Player 12`,
    `${team} Player 13`,
  ]
}

// ---------------------------------------------------------------------------
// Special stickers
// ---------------------------------------------------------------------------
const SPECIAL_NAMES: string[] = [
  'FIFA World Cup Trophy',
  'USA Stadium - MetLife',
  'USA Stadium - Rose Bowl',
  'USA Stadium - SoFi',
  'Mexico Stadium - Azteca',
  'Mexico Stadium - Guadalajara',
  'Canada Stadium - Toronto',
  'Canada Stadium - Vancouver',
  'Opening Match',
  'Final Match',
  'Golden Boot',
  'Golden Glove',
  'Golden Ball',
  'Fair Play',
  'Best Young Player',
  'Team of the Tournament',
  'WC 2026 Logo',
  'Host Nations',
  'FIFA Emblem',
  'WC History',
]

// ---------------------------------------------------------------------------
// Build the full catalog
// ---------------------------------------------------------------------------
function buildCatalog(): StickerDef[] {
  const stickers: StickerDef[] = []

  for (const team of Object.keys(TEAM_CODES)) {
    const code = TEAM_CODES[team]
    const players = KNOWN_PLAYERS[team] ?? genericPlayers(team)

    // Logo sticker
    stickers.push({
      number: `${code}-00`,
      player_name: `${team} Logo`,
      team,
      section: team,
      sticker_type: 'logo',
      image_url: null,
    })

    // Badge sticker
    stickers.push({
      number: `${code}-B`,
      player_name: `${team} Badge`,
      team,
      section: team,
      sticker_type: 'badge',
      image_url: null,
    })

    // Player stickers (01–13)
    for (let i = 0; i < 13; i++) {
      const num = String(i + 1).padStart(2, '0')
      stickers.push({
        number: `${code}-${num}`,
        player_name: players[i] ?? `${team} Player ${i + 1}`,
        team,
        section: team,
        sticker_type: 'player',
        image_url: null,
      })
    }
  }

  // Special stickers (SP-01 through SP-20)
  for (let i = 0; i < SPECIAL_NAMES.length; i++) {
    const num = String(i + 1).padStart(2, '0')
    stickers.push({
      number: `SP-${num}`,
      player_name: SPECIAL_NAMES[i],
      team: 'FIFA',
      section: 'SPECIAL',
      sticker_type: 'special',
      image_url: null,
    })
  }

  return stickers
}

export const STICKER_CATALOG: StickerDef[] = buildCatalog()

export const TOTAL_STICKERS: number = STICKER_CATALOG.length

export const CATALOG_MAP: Map<string, StickerDef> = new Map(
  STICKER_CATALOG.map((s) => [s.number, s])
)

export function getCatalogByTeam(team: string): StickerDef[] {
  return STICKER_CATALOG.filter((s) => s.team === team)
}

// Re-export the type alias so consumers can use either name
export type { StickerCatalog }
