export interface StickerDef {
  number: string
  player_name: string
  team: string
  section: string
  sticker_type: 'player' | 'logo' | 'badge' | 'special'
  image_url: string | null
}

export const TEAM_CODES: Record<string, string> = {
  'Algeria': 'ALG', 'Argentina': 'ARG', 'Australia': 'AUS', 'Austria': 'AUT',
  'Belgium': 'BEL', 'Brazil': 'BRA', 'Canada': 'CAN', 'Cape Verde': 'CPV',
  'Colombia': 'COL', 'Croatia': 'CRO', 'Curaçao': 'CUW', 'Denmark': 'DEN',
  'Ecuador': 'ECU', 'Egypt': 'EGY', 'England': 'ENG', 'France': 'FRA',
  'Germany': 'GER', 'Ghana': 'GHA', 'Haiti': 'HAI', 'Iran': 'IRN',
  'Italy': 'ITA', 'Ivory Coast': 'CIV', 'Jamaica': 'JAM', 'Japan': 'JPN',
  'Jordan': 'JOR', 'Korea Republic': 'KOR', 'Mexico': 'MEX', 'Morocco': 'MAR',
  'Netherlands': 'NED', 'New Zealand': 'NZL', 'Norway': 'NOR', 'Panama': 'PAN',
  'Paraguay': 'PAR', 'Poland': 'POL', 'Portugal': 'POR', 'Qatar': 'QAT',
  'Saudi Arabia': 'KSA', 'Scotland': 'SCO', 'Senegal': 'SEN', 'South Africa': 'RSA',
  'Spain': 'ESP', 'Sweden': 'SWE', 'Switzerland': 'SUI', 'Tunisia': 'TUN',
  'Turkey': 'TUR', 'United States': 'USA', 'Uruguay': 'URU', 'Uzbekistan': 'UZB',
}

function p(n: number): string {
  return n.toString().padStart(3, '0')
}

function team(n: number, name: string, teamName: string, type: StickerDef['sticker_type'] = 'player'): StickerDef {
  return { number: p(n), player_name: name, team: teamName, section: teamName, sticker_type: type, image_url: null }
}

function special(n: number, name: string, section: string): StickerDef {
  return { number: p(n), player_name: name, team: section, section, sticker_type: 'special', image_url: null }
}

export const STICKER_CATALOG: StickerDef[] = [
  // ── INTRO / ESPECIALES (001–020) ─────────────────────────────────────────
  // 20 stickers
  special(1,  'Trofeo FIFA',                    'Introducción'),
  special(2,  'Balón Oficial',                  'Introducción'),
  special(3,  'Logo FIFA World Cup 2026',       'Introducción'),
  special(4,  'Mascota Maple',                  'Introducción'),
  special(5,  'Mascota Clutch',                 'Introducción'),
  special(6,  'Mascota Zavu',                   'Introducción'),
  special(7,  'Estadio MetLife (USA)',           'Introducción'),
  special(8,  'Estadio Azteca (MEX)',            'Introducción'),
  special(9,  'Estadio Rose Bowl (USA)',         'Introducción'),
  special(10, 'Estadio BC Place (CAN)',          'Introducción'),
  special(11, 'Estadio SoFi (USA)',              'Introducción'),
  special(12, 'Estadio BMO Field (CAN)',         'Introducción'),
  special(13, 'Estadio AT&T (USA)',              'Introducción'),
  special(14, "Estadio Levi's (USA)",            'Introducción'),
  special(15, 'Estadio Arrowhead (USA)',         'Introducción'),
  special(16, 'Estadio Gillette (USA)',          'Introducción'),
  special(17, 'Estadio Lincoln Financial (USA)', 'Introducción'),
  special(18, 'Los Tres Países Anfitriones',     'Introducción'),
  special(19, 'El Grupo A',                      'Introducción'),
  special(20, 'El Camino al Título',             'Introducción'),

  // ── ALGERIA (021–038) — 2 GK, 5 DEF, 5 MID, 4 FWD ──────────────────────
  team(21, 'Escudo Oficial',     'Algeria', 'badge'),
  team(22, 'Foto del Equipo',    'Algeria', 'logo'),
  team(23, 'Rayan Aït-Nouri',    'Algeria'),   // GK
  team(24, 'Islam Slimani',      'Algeria'),   // GK (veteran, used as backup)
  team(25, 'Rami Bensebaïni',    'Algeria'),   // DEF
  team(26, 'Youcef Atal',        'Algeria'),   // DEF
  team(27, 'Aïssa Mandi',        'Algeria'),   // DEF
  team(28, 'Alexis Guendouz',    'Algeria'),   // DEF
  team(29, 'Hichem Boudaoui',    'Algeria'),   // DEF
  team(30, 'Nabil Bentaleb',     'Algeria'),   // MID
  team(31, 'Yacine Adli',        'Algeria'),   // MID
  team(32, 'Farès Chaïbi',       'Algeria'),   // MID
  team(33, 'Billal Brahimi',     'Algeria'),   // MID
  team(34, 'Saïd Benrahma',      'Algeria'),   // MID
  team(35, 'Amine Gouiri',       'Algeria'),   // FWD
  team(36, 'Mohammed Amoura',    'Algeria'),   // FWD
  team(37, 'Riyad Mahrez',       'Algeria'),   // FWD
  team(38, 'Baghdad Bounedjah',  'Algeria'),   // FWD

  // ── ARGENTINA (039–056) ──────────────────────────────────────────────────
  team(39, 'Escudo Oficial',       'Argentina', 'badge'),
  team(40, 'Foto del Equipo',      'Argentina', 'logo'),
  team(41, 'Emiliano Martínez',    'Argentina'),   // GK
  team(42, 'Geronimo Rulli',       'Argentina'),   // GK
  team(43, 'Nahuel Molina',        'Argentina'),   // DEF
  team(44, 'Cristian Romero',      'Argentina'),   // DEF
  team(45, 'Nicolás Otamendi',     'Argentina'),   // DEF
  team(46, 'Nicolás González',     'Argentina'),   // DEF
  team(47, 'Exequiel Palacios',    'Argentina'),   // DEF
  team(48, 'Enzo Fernández',       'Argentina'),   // MID
  team(49, 'Alexis Mac Allister',  'Argentina'),   // MID
  team(50, 'Rodrigo De Paul',      'Argentina'),   // MID
  team(51, 'Giovanni Lo Celso',    'Argentina'),   // MID
  team(52, 'Giuliano Simeone',     'Argentina'),   // MID
  team(53, 'Julián Álvarez',       'Argentina'),   // FWD
  team(54, 'Lautaro Martínez',     'Argentina'),   // FWD
  team(55, 'Franco Mastantuono',   'Argentina'),   // FWD
  team(56, 'Lionel Messi',         'Argentina'),   // FWD

  // ── AUSTRALIA (057–074) ──────────────────────────────────────────────────
  team(57, 'Escudo Oficial',      'Australia', 'badge'),
  team(58, 'Foto del Equipo',     'Australia', 'logo'),
  team(59, 'Mathew Ryan',         'Australia'),   // GK
  team(60, 'Danny Vukovic',       'Australia'),   // GK
  team(61, 'Harry Souttar',       'Australia'),   // DEF
  team(62, 'Alessandro Circati',  'Australia'),   // DEF
  team(63, 'Miloš Degenek',       'Australia'),   // DEF
  team(64, 'Nathaniel Atkinson',  'Australia'),   // DEF
  team(65, 'Aziz Behich',         'Australia'),   // DEF
  team(66, 'Jackson Irvine',      'Australia'),   // MID
  team(67, 'Riley McGree',        'Australia'),   // MID
  team(68, 'Cameron Devlin',      'Australia'),   // MID
  team(69, "Aiden O'Neill",       'Australia'),   // MID
  team(70, 'Connor Metcalfe',     'Australia'),   // MID
  team(71, 'Craig Goodwin',       'Australia'),   // FWD
  team(72, 'Nestory Irankunda',   'Australia'),   // FWD
  team(73, 'Jordan Bos',          'Australia'),   // FWD
  team(74, 'Lewis Miller',        'Australia'),   // FWD

  // ── AUSTRIA (075–092) ────────────────────────────────────────────────────
  team(75, 'Escudo Oficial',        'Austria', 'badge'),
  team(76, 'Foto del Equipo',       'Austria', 'logo'),
  team(77, 'Alexander Schlager',    'Austria'),   // GK
  team(78, 'Patrick Pentz',         'Austria'),   // GK
  team(79, 'Kevin Danso',           'Austria'),   // DEF
  team(80, 'Philipp Lienhart',      'Austria'),   // DEF
  team(81, 'David Alaba',           'Austria'),   // DEF
  team(82, 'Stefan Posch',          'Austria'),   // DEF
  team(83, 'Valentino Lazaro',      'Austria'),   // DEF
  team(84, 'Konrad Laimer',         'Austria'),   // MID
  team(85, 'Nicolas Seiwald',       'Austria'),   // MID
  team(86, 'Marcel Sabitzer',       'Austria'),   // MID
  team(87, 'Florian Grillitsch',    'Austria'),   // MID
  team(88, 'Romano Schmid',         'Austria'),   // MID
  team(89, 'Christoph Baumgartner', 'Austria'),   // FWD
  team(90, 'Andreas Weimann',       'Austria'),   // FWD
  team(91, 'Marko Arnautović',      'Austria'),   // FWD
  team(92, 'Michael Gregoritsch',   'Austria'),   // FWD

  // ── BELGIUM (093–110) ────────────────────────────────────────────────────
  team(93,  'Escudo Oficial',       'Belgium', 'badge'),
  team(94,  'Foto del Equipo',      'Belgium', 'logo'),
  team(95,  'Thibaut Courtois',     'Belgium'),   // GK
  team(96,  'Koen Casteels',        'Belgium'),   // GK
  team(97,  'Timothy Castagne',     'Belgium'),   // DEF
  team(98,  'Wout Faes',            'Belgium'),   // DEF
  team(99,  'Arthur Theate',        'Belgium'),   // DEF
  team(100, 'Jan Vertonghen',       'Belgium'),   // DEF
  team(101, 'Maxime De Cuyper',     'Belgium'),   // DEF
  team(102, 'Amadou Onana',         'Belgium'),   // MID
  team(103, 'Youri Tielemans',      'Belgium'),   // MID
  team(104, 'Kevin De Bruyne',      'Belgium'),   // MID
  team(105, 'Johan Bakayoko',       'Belgium'),   // MID
  team(106, 'Jérémy Doku',          'Belgium'),   // MID
  team(107, 'Charles De Ketelaere', 'Belgium'),   // FWD
  team(108, 'Leandro Trossard',     'Belgium'),   // FWD
  team(109, 'Lois Openda',          'Belgium'),   // FWD
  team(110, 'Romelu Lukaku',        'Belgium'),   // FWD

  // ── BRAZIL (111–128) ─────────────────────────────────────────────────────
  team(111, 'Escudo Oficial',    'Brazil', 'badge'),
  team(112, 'Foto del Equipo',   'Brazil', 'logo'),
  team(113, 'Alisson',           'Brazil'),   // GK
  team(114, 'Ederson',           'Brazil'),   // GK
  team(115, 'Danilo',            'Brazil'),   // DEF
  team(116, 'Éder Militão',      'Brazil'),   // DEF
  team(117, 'Gabriel Magalhães', 'Brazil'),   // DEF
  team(118, 'Marquinhos',        'Brazil'),   // DEF
  team(119, 'Renan Lodi',        'Brazil'),   // DEF
  team(120, 'Casemiro',          'Brazil'),   // MID
  team(121, 'Bruno Guimarães',   'Brazil'),   // MID
  team(122, 'Lucas Paquetá',     'Brazil'),   // MID
  team(123, 'Rodrygo',           'Brazil'),   // MID
  team(124, 'Raphinha',          'Brazil'),   // MID
  team(125, 'Vinícius Júnior',   'Brazil'),   // FWD
  team(126, 'Matheus Cunha',     'Brazil'),   // FWD
  team(127, 'Endrick',           'Brazil'),   // FWD
  team(128, 'Estêvão',           'Brazil'),   // FWD

  // ── CANADA (129–146) ─────────────────────────────────────────────────────
  team(129, 'Escudo Oficial',     'Canada', 'badge'),
  team(130, 'Foto del Equipo',    'Canada', 'logo'),
  team(131, 'Dayne St. Clair',    'Canada'),   // GK
  team(132, 'Milan Borjan',       'Canada'),   // GK
  team(133, 'Richie Laryea',      'Canada'),   // DEF
  team(134, 'Derek Cornelius',    'Canada'),   // DEF
  team(135, 'Alistair Johnston',  'Canada'),   // DEF
  team(136, 'Scott Kennedy',      'Canada'),   // DEF
  team(137, 'Alphonso Davies',    'Canada'),   // DEF
  team(138, 'Stephen Eustáquio',  'Canada'),   // MID
  team(139, 'Ismaël Koné',        'Canada'),   // MID
  team(140, 'Jonathan Osorio',    'Canada'),   // MID
  team(141, 'Liam Millar',        'Canada'),   // MID
  team(142, 'Jacob Shaffelburg',  'Canada'),   // MID
  team(143, 'Tajon Buchanan',     'Canada'),   // FWD
  team(144, 'Jonathan David',     'Canada'),   // FWD
  team(145, 'Cyle Larin',         'Canada'),   // FWD
  team(146, 'Jacen Russell-Rowe', 'Canada'),   // FWD

  // ── CAPE VERDE (147–164) ─────────────────────────────────────────────────
  team(147, 'Escudo Oficial',     'Cape Verde', 'badge'),
  team(148, 'Foto del Equipo',    'Cape Verde', 'logo'),
  team(149, 'Vozinha',            'Cape Verde'),   // GK
  team(150, 'Marcelo Djalo',      'Cape Verde'),   // GK
  team(151, 'Logan Costa',        'Cape Verde'),   // DEF
  team(152, 'Steven Moreira',     'Cape Verde'),   // DEF
  team(153, 'Pico',               'Cape Verde'),   // DEF
  team(154, 'João Paulo',         'Cape Verde'),   // DEF
  team(155, 'Marco Soares',       'Cape Verde'),   // DEF
  team(156, 'Bryan Tavares',      'Cape Verde'),   // MID
  team(157, 'Kevin Pina',         'Cape Verde'),   // MID
  team(158, 'Jamiro Monteiro',    'Cape Verde'),   // MID
  team(159, 'Patrick Andrade',    'Cape Verde'),   // MID
  team(160, 'Yannick Semedo',     'Cape Verde'),   // MID
  team(161, 'Ryan Mendes',        'Cape Verde'),   // FWD
  team(162, 'Jovane Cabral',      'Cape Verde'),   // FWD
  team(163, 'Julio Tavares',      'Cape Verde'),   // FWD
  team(164, 'Daílson Livramento', 'Cape Verde'),   // FWD

  // ── COLOMBIA (165–182) ───────────────────────────────────────────────────
  team(165, 'Escudo Oficial',         'Colombia', 'badge'),
  team(166, 'Foto del Equipo',        'Colombia', 'logo'),
  team(167, 'Camilo Vargas',          'Colombia'),   // GK
  team(168, 'David Ospina',           'Colombia'),   // GK
  team(169, 'Dávinson Sánchez',       'Colombia'),   // DEF
  team(170, 'Yerry Mina',             'Colombia'),   // DEF
  team(171, 'Daniel Muñoz',           'Colombia'),   // DEF
  team(172, 'Wilmar Barrios',         'Colombia'),   // DEF
  team(173, 'Jefferson Lerma',        'Colombia'),   // DEF
  team(174, 'Richard Ríos',           'Colombia'),   // MID
  team(175, 'James Rodríguez',        'Colombia'),   // MID
  team(176, 'Juan Fernando Quintero', 'Colombia'),   // MID
  team(177, 'Jhon Arias',             'Colombia'),   // MID
  team(178, 'Luis Díaz',              'Colombia'),   // MID
  team(179, 'Cucho Hernández',        'Colombia'),   // FWD
  team(180, 'Rafael Santos Borré',    'Colombia'),   // FWD
  team(181, 'Jhon Jáder Durán',       'Colombia'),   // FWD
  team(182, 'Luis Suárez',            'Colombia'),   // FWD

  // ── CROATIA (183–200) ────────────────────────────────────────────────────
  team(183, 'Escudo Oficial',    'Croatia', 'badge'),
  team(184, 'Foto del Equipo',   'Croatia', 'logo'),
  team(185, 'Dominik Livaković', 'Croatia'),   // GK
  team(186, 'Ivica Ivušić',      'Croatia'),   // GK
  team(187, 'Duje Ćaleta-Car',   'Croatia'),   // DEF
  team(188, 'Joško Gvardiol',    'Croatia'),   // DEF
  team(189, 'Josip Stanišić',    'Croatia'),   // DEF
  team(190, 'Borna Sosa',        'Croatia'),   // DEF
  team(191, 'Luka Ivanušec',     'Croatia'),   // DEF
  team(192, 'Mateo Kovačić',     'Croatia'),   // MID
  team(193, 'Luka Modrić',       'Croatia'),   // MID
  team(194, 'Lovro Majer',       'Croatia'),   // MID
  team(195, 'Mario Pašalić',     'Croatia'),   // MID
  team(196, 'Petar Sucić',       'Croatia'),   // MID
  team(197, 'Ivan Perišić',      'Croatia'),   // FWD
  team(198, 'Andrej Kramarić',   'Croatia'),   // FWD
  team(199, 'Ante Budimir',      'Croatia'),   // FWD
  team(200, 'Bruno Petković',    'Croatia'),   // FWD

  // ── CURAÇAO (201–218) ────────────────────────────────────────────────────
  team(201, 'Escudo Oficial',    'Curaçao', 'badge'),
  team(202, 'Foto del Equipo',   'Curaçao', 'logo'),
  team(203, 'Eloy Room',         'Curaçao'),   // GK
  team(204, 'Giliano Wijnaldum', 'Curaçao'),   // GK
  team(205, 'Sherel Floranus',   'Curaçao'),   // DEF
  team(206, 'Roshon van Eijma',  'Curaçao'),   // DEF
  team(207, 'Armando Obispo',    'Curaçao'),   // DEF
  team(208, 'Cuco Martina',      'Curaçao'),   // DEF
  team(209, 'Liviano Comenica',  'Curaçao'),   // DEF
  team(210, 'Juriën Gaari',      'Curaçao'),   // MID
  team(211, 'Juninho Bacuna',    'Curaçao'),   // MID
  team(212, 'Kenló Gorré',       'Curaçao'),   // MID
  team(213, 'Glen Kamara',       'Curaçao'),   // MID
  team(214, 'Raphael Obinna',    'Curaçao'),   // MID
  team(215, 'Leandro Bacuna',    'Curaçao'),   // FWD
  team(216, 'Sontje Hansen',     'Curaçao'),   // FWD
  team(217, 'Myron Boadu',       'Curaçao'),   // FWD
  team(218, 'Jearl Margaritha',  'Curaçao'),   // FWD

  // ── DENMARK (219–236) ────────────────────────────────────────────────────
  team(219, 'Escudo Oficial',       'Denmark', 'badge'),
  team(220, 'Foto del Equipo',      'Denmark', 'logo'),
  team(221, 'Kasper Schmeichel',    'Denmark'),   // GK
  team(222, 'Oliver Christensen',   'Denmark'),   // GK
  team(223, 'Simon Kjær',           'Denmark'),   // DEF
  team(224, 'Andreas Christensen',  'Denmark'),   // DEF
  team(225, 'Jannik Vestergaard',   'Denmark'),   // DEF
  team(226, 'Joakim Mæhle',         'Denmark'),   // DEF
  team(227, 'Thomas Delaney',       'Denmark'),   // DEF
  team(228, 'Pierre-Emile Højbjerg','Denmark'),   // MID
  team(229, 'Morten Hjulmand',      'Denmark'),   // MID
  team(230, 'Christian Eriksen',    'Denmark'),   // MID
  team(231, 'Viktor Claesson',      'Denmark'),   // MID
  team(232, 'Andreas Skov Olsen',   'Denmark'),   // MID
  team(233, 'Mikkel Damsgaard',     'Denmark'),   // FWD
  team(234, 'Kasper Dolberg',       'Denmark'),   // FWD
  team(235, 'Rasmus Højlund',       'Denmark'),   // FWD
  team(236, 'Martin Braithwaite',   'Denmark'),   // FWD

  // ── ECUADOR (237–254) ────────────────────────────────────────────────────
  team(237, 'Escudo Oficial',      'Ecuador', 'badge'),
  team(238, 'Foto del Equipo',     'Ecuador', 'logo'),
  team(239, 'Hernán Galíndez',     'Ecuador'),   // GK
  team(240, 'Alexander Domínguez', 'Ecuador'),   // GK
  team(241, 'Piero Hincapié',      'Ecuador'),   // DEF
  team(242, 'Pervis Estupiñán',    'Ecuador'),   // DEF
  team(243, 'Willian Pacho',       'Ecuador'),   // DEF
  team(244, 'Robert Arboleda',     'Ecuador'),   // DEF
  team(245, 'Ángelo Preciado',     'Ecuador'),   // DEF
  team(246, 'Moisés Caicedo',      'Ecuador'),   // MID
  team(247, 'Alan Franco',         'Ecuador'),   // MID
  team(248, 'Joel Ordóñez',        'Ecuador'),   // MID
  team(249, 'Jhegson Méndez',      'Ecuador'),   // MID
  team(250, 'Jeremy Sarmiento',    'Ecuador'),   // MID
  team(251, 'Gonzalo Plata',       'Ecuador'),   // FWD
  team(252, 'Kendry Páez',         'Ecuador'),   // FWD
  team(253, 'Kevin Rodríguez',     'Ecuador'),   // FWD
  team(254, 'Enner Valencia',      'Ecuador'),   // FWD

  // ── EGYPT (255–272) ──────────────────────────────────────────────────────
  team(255, 'Escudo Oficial',     'Egypt', 'badge'),
  team(256, 'Foto del Equipo',    'Egypt', 'logo'),
  team(257, 'Mohamed El-Shenawy', 'Egypt'),   // GK
  team(258, 'Ahmed El-Shenawy',   'Egypt'),   // GK
  team(259, 'Mohamed Hany',       'Egypt'),   // DEF
  team(260, 'Ahmed Hegazy',       'Egypt'),   // DEF
  team(261, 'Mohamed Abdelmonem', 'Egypt'),   // DEF
  team(262, 'Ayman Ashraf',       'Egypt'),   // DEF
  team(263, 'Ramy Rabia',         'Egypt'),   // DEF
  team(264, 'Marwan Attia',       'Egypt'),   // MID
  team(265, 'Zizo',               'Egypt'),   // MID
  team(266, 'Amr El-Sulaya',      'Egypt'),   // MID
  team(267, 'Hamdy Fathy',        'Egypt'),   // MID
  team(268, 'Omar El-Abd',        'Egypt'),   // MID
  team(269, 'Mostafa Mohamed',    'Egypt'),   // FWD
  team(270, 'Trézéguet',          'Egypt'),   // FWD
  team(271, 'Omar Marmoush',      'Egypt'),   // FWD
  team(272, 'Mohamed Salah',      'Egypt'),   // FWD

  // ── ENGLAND (273–290) ────────────────────────────────────────────────────
  team(273, 'Escudo Oficial',         'England', 'badge'),
  team(274, 'Foto del Equipo',        'England', 'logo'),
  team(275, 'Jordan Pickford',        'England'),   // GK
  team(276, 'Aaron Ramsdale',         'England'),   // GK
  team(277, 'Reece James',            'England'),   // DEF
  team(278, 'Trent Alexander-Arnold', 'England'),   // DEF
  team(279, 'John Stones',            'England'),   // DEF
  team(280, 'Ben White',              'England'),   // DEF
  team(281, 'Declan Rice',            'England'),   // DEF
  team(282, 'Jordan Henderson',       'England'),   // MID
  team(283, 'Conor Gallagher',        'England'),   // MID
  team(284, 'Phil Foden',             'England'),   // MID
  team(285, 'Bukayo Saka',            'England'),   // MID
  team(286, 'Cole Palmer',            'England'),   // MID
  team(287, 'Jude Bellingham',        'England'),   // FWD
  team(288, 'Marcus Rashford',        'England'),   // FWD
  team(289, 'Ollie Watkins',          'England'),   // FWD
  team(290, 'Harry Kane',             'England'),   // FWD

  // ── FRANCE (291–308) ─────────────────────────────────────────────────────
  team(291, 'Escudo Oficial',      'France', 'badge'),
  team(292, 'Foto del Equipo',     'France', 'logo'),
  team(293, 'Mike Maignan',        'France'),   // GK
  team(294, 'Alphonse Areola',     'France'),   // GK
  team(295, 'William Saliba',      'France'),   // DEF
  team(296, 'Jules Koundé',        'France'),   // DEF
  team(297, 'Benjamin Pavard',     'France'),   // DEF
  team(298, 'Lucas Hernández',     'France'),   // DEF
  team(299, 'Théo Hernández',      'France'),   // DEF
  team(300, 'Aurélien Tchouaméni', 'France'),   // MID
  team(301, 'Eduardo Camavinga',   'France'),   // MID
  team(302, 'Antoine Griezmann',   'France'),   // MID
  team(303, 'Bradley Barcola',     'France'),   // MID
  team(304, 'Ousmane Dembélé',     'France'),   // MID
  team(305, 'Desire Doué',         'France'),   // FWD
  team(306, 'Marcus Thuram',       'France'),   // FWD
  team(307, 'Randal Kolo Muani',   'France'),   // FWD
  team(308, 'Kylian Mbappé',       'France'),   // FWD

  // ── GERMANY (309–326) ────────────────────────────────────────────────────
  team(309, 'Escudo Oficial',        'Germany', 'badge'),
  team(310, 'Foto del Equipo',       'Germany', 'logo'),
  team(311, 'Marc-André ter Stegen', 'Germany'),   // GK
  team(312, 'Oliver Baumann',        'Germany'),   // GK
  team(313, 'Antonio Rüdiger',       'Germany'),   // DEF
  team(314, 'Jonathan Tah',          'Germany'),   // DEF
  team(315, 'Robin Koch',            'Germany'),   // DEF
  team(316, 'Felix Nmecha',          'Germany'),   // DEF
  team(317, 'Toni Kroos',            'Germany'),   // DEF
  team(318, 'Joshua Kimmich',        'Germany'),   // MID
  team(319, 'Leon Goretzka',         'Germany'),   // MID
  team(320, 'Florian Wirtz',         'Germany'),   // MID
  team(321, 'Jamal Musiala',         'Germany'),   // MID
  team(322, 'Serge Gnabry',          'Germany'),   // MID
  team(323, 'Thomas Müller',         'Germany'),   // FWD
  team(324, 'Leroy Sané',            'Germany'),   // FWD
  team(325, 'Kai Havertz',           'Germany'),   // FWD
  team(326, 'Niclas Füllkrug',       'Germany'),   // FWD

  // ── GHANA (327–344) ──────────────────────────────────────────────────────
  team(327, 'Escudo Oficial',       'Ghana', 'badge'),
  team(328, 'Foto del Equipo',      'Ghana', 'logo'),
  team(329, 'Lawrence Ati Zigi',    'Ghana'),   // GK
  team(330, 'Abdul Manaf Nurudeen', 'Ghana'),   // GK
  team(331, 'Alidu Seidu',          'Ghana'),   // DEF
  team(332, 'Alexander Djiku',      'Ghana'),   // DEF
  team(333, 'Tariq Lamptey',        'Ghana'),   // DEF
  team(334, 'Baba Rahman',          'Ghana'),   // DEF
  team(335, 'Gideon Mensah',        'Ghana'),   // DEF
  team(336, 'Thomas Partey',        'Ghana'),   // MID
  team(337, 'Mohammed Kudus',       'Ghana'),   // MID
  team(338, 'Daniel-Kofi Kyereh',   'Ghana'),   // MID
  team(339, 'Caleb Ekuban',         'Ghana'),   // MID
  team(340, 'Abdul Fatawu Issahaku','Ghana'),   // MID
  team(341, 'Kamaldeen Sulemana',   'Ghana'),   // FWD
  team(342, 'Inaki Williams',       'Ghana'),   // FWD
  team(343, 'Jordan Ayew',          'Ghana'),   // FWD
  team(344, 'Antoine Semenyo',      'Ghana'),   // FWD

  // ── HAITI (345–362) ──────────────────────────────────────────────────────
  team(345, 'Escudo Oficial',       'Haiti', 'badge'),
  team(346, 'Foto del Equipo',      'Haiti', 'logo'),
  team(347, 'Johnny Placide',       'Haiti'),   // GK
  team(348, 'Melchie Dumornay',     'Haiti'),   // GK
  team(349, 'Ricardo Adé',          'Haiti'),   // DEF
  team(350, 'Carlens Arcus',        'Haiti'),   // DEF
  team(351, 'Hannes Delcroix',      'Haiti'),   // DEF
  team(352, 'Jessé Saint-Just',     'Haiti'),   // DEF
  team(353, 'Leverton Pierre',      'Haiti'),   // DEF
  team(354, 'Danley Jean-Jacques',  'Haiti'),   // MID
  team(355, 'Jean-Aéner Bellegarde','Haiti'),   // MID
  team(356, 'Garry Rodrigues',      'Haiti'),   // MID
  team(357, 'Gregory Bourgeois',    'Haiti'),   // MID
  team(358, 'Ruben Providence',     'Haiti'),   // MID
  team(359, 'Steeven Saba',         'Haiti'),   // FWD
  team(360, 'Duckens Nazon',        'Haiti'),   // FWD
  team(361, 'Don Deedon Loucius',   'Haiti'),   // FWD
  team(362, 'Frantzdy Pierrot',     'Haiti'),   // FWD

  // ── IRAN (363–380) ───────────────────────────────────────────────────────
  team(363, 'Escudo Oficial',         'Iran', 'badge'),
  team(364, 'Foto del Equipo',        'Iran', 'logo'),
  team(365, 'Alireza Beiranvand',     'Iran'),   // GK
  team(366, 'Hossein Hosseini',       'Iran'),   // GK
  team(367, 'Shoja Khalilzadeh',      'Iran'),   // DEF
  team(368, 'Morteza Pouraliganji',   'Iran'),   // DEF
  team(369, 'Milad Mohammadi',        'Iran'),   // DEF
  team(370, 'Sadegh Moharrami',       'Iran'),   // DEF
  team(371, 'Ramin Rezaeian',         'Iran'),   // DEF
  team(372, 'Saeid Ezatolahi',        'Iran'),   // MID
  team(373, 'Hossein Kanani',         'Iran'),   // MID
  team(374, 'Ahmad Nourollahi',       'Iran'),   // MID
  team(375, 'Saman Ghoddos',          'Iran'),   // MID
  team(376, 'Ali Gholizadeh',         'Iran'),   // MID
  team(377, 'Mohammad Mohebi',        'Iran'),   // FWD
  team(378, 'Alireza Jahanbakhsh',    'Iran'),   // FWD
  team(379, 'Sardar Azmoun',          'Iran'),   // FWD
  team(380, 'Mehdi Taremi',           'Iran'),   // FWD

  // ── ITALY (381–398) ──────────────────────────────────────────────────────
  team(381, 'Escudo Oficial',       'Italy', 'badge'),
  team(382, 'Foto del Equipo',      'Italy', 'logo'),
  team(383, 'Gianluigi Donnarumma', 'Italy'),   // GK
  team(384, 'Alex Meret',           'Italy'),   // GK
  team(385, 'Giovanni Di Lorenzo',  'Italy'),   // DEF
  team(386, 'Alessandro Bastoni',   'Italy'),   // DEF
  team(387, 'Giorgio Scalvini',     'Italy'),   // DEF
  team(388, 'Riccardo Calafiori',   'Italy'),   // DEF
  team(389, 'Federico Dimarco',     'Italy'),   // DEF
  team(390, 'Nicolo Barella',       'Italy'),   // MID
  team(391, 'Sandro Tonali',        'Italy'),   // MID
  team(392, 'Bryan Cristante',      'Italy'),   // MID
  team(393, 'Lorenzo Pellegrini',   'Italy'),   // MID
  team(394, 'Federico Chiesa',      'Italy'),   // MID
  team(395, 'Khvicha Kvaratskhelia','Italy'),   // FWD
  team(396, 'Giacomo Raspadori',    'Italy'),   // FWD
  team(397, 'Leonardo Bonucci',     'Italy'),   // FWD
  team(398, 'Moise Kean',           'Italy'),   // FWD

  // ── IVORY COAST (399–416) ────────────────────────────────────────────────
  team(399, 'Escudo Oficial',      'Ivory Coast', 'badge'),
  team(400, 'Foto del Equipo',     'Ivory Coast', 'logo'),
  team(401, 'Yahia Fofana',        'Ivory Coast'),   // GK
  team(402, 'Badra Ali Sangaré',   'Ivory Coast'),   // GK
  team(403, 'Ghislain Konan',      'Ivory Coast'),   // DEF
  team(404, 'Odilon Kossounou',    'Ivory Coast'),   // DEF
  team(405, 'Evan Ndicka',         'Ivory Coast'),   // DEF
  team(406, 'Serge Aurier',        'Ivory Coast'),   // DEF
  team(407, 'Wilfried Singo',      'Ivory Coast'),   // DEF
  team(408, 'Ibrahim Sangaré',     'Ivory Coast'),   // MID
  team(409, 'Franck Kessié',       'Ivory Coast'),   // MID
  team(410, 'Jean-Philippe Gbamin','Ivory Coast'),   // MID
  team(411, 'Nicolas Pépé',        'Ivory Coast'),   // MID
  team(412, 'Maxwell Cornet',      'Ivory Coast'),   // MID
  team(413, 'Simon Adingra',       'Ivory Coast'),   // FWD
  team(414, 'Lazare Amani',        'Ivory Coast'),   // FWD
  team(415, 'Sébastien Haller',    'Ivory Coast'),   // FWD
  team(416, 'Oumar Diakité',       'Ivory Coast'),   // FWD

  // ── JAMAICA (417–434) ────────────────────────────────────────────────────
  team(417, 'Escudo Oficial',      'Jamaica', 'badge'),
  team(418, 'Foto del Equipo',     'Jamaica', 'logo'),
  team(419, 'Andre Blake',         'Jamaica'),   // GK
  team(420, 'Dillon Barnes',       'Jamaica'),   // GK
  team(421, 'Wes Morgan',          'Jamaica'),   // DEF
  team(422, 'Liam Moore',          'Jamaica'),   // DEF
  team(423, 'Kemar Lawrence',      'Jamaica'),   // DEF
  team(424, 'Miles Welch-Hayes',   'Jamaica'),   // DEF
  team(425, 'Oniel Fisher',        'Jamaica'),   // DEF
  team(426, 'Damion Lowe',         'Jamaica'),   // MID
  team(427, 'Daniel Johnson',      'Jamaica'),   // MID
  team(428, 'Je-Vaughn Watson',    'Jamaica'),   // MID
  team(429, 'Ravel Morrison',      'Jamaica'),   // MID
  team(430, 'Bobby Decordova-Reid','Jamaica'),   // MID
  team(431, 'Shamar Nicholson',    'Jamaica'),   // FWD
  team(432, 'Leon Bailey',         'Jamaica'),   // FWD
  team(433, 'Michail Antonio',     'Jamaica'),   // FWD
  team(434, 'Bobby Reid',          'Jamaica'),   // FWD

  // ── JAPAN (435–452) ──────────────────────────────────────────────────────
  team(435, 'Escudo Oficial',    'Japan', 'badge'),
  team(436, 'Foto del Equipo',   'Japan', 'logo'),
  team(437, 'Zion Suzuki',       'Japan'),   // GK
  team(438, 'Shuichi Gonda',     'Japan'),   // GK
  team(439, 'Tsuyoshi Watanabe', 'Japan'),   // DEF
  team(440, 'Ko Itakura',        'Japan'),   // DEF
  team(441, 'Maya Yoshida',      'Japan'),   // DEF
  team(442, 'Yuto Nagatomo',     'Japan'),   // DEF
  team(443, 'Kaishu Sano',       'Japan'),   // DEF
  team(444, 'Daichi Kamada',     'Japan'),   // MID
  team(445, 'Ritsu Doan',        'Japan'),   // MID
  team(446, 'Takumi Minamino',   'Japan'),   // MID
  team(447, 'Junya Ito',         'Japan'),   // MID
  team(448, 'Kaoru Mitoma',      'Japan'),   // MID
  team(449, 'Keito Nakamura',    'Japan'),   // FWD
  team(450, 'Takefusa Kubo',     'Japan'),   // FWD
  team(451, 'Shuto Machino',     'Japan'),   // FWD
  team(452, 'Ayase Ueda',        'Japan'),   // FWD

  // ── JORDAN (453–470) ─────────────────────────────────────────────────────
  team(453, 'Escudo Oficial',       'Jordan', 'badge'),
  team(454, 'Foto del Equipo',      'Jordan', 'logo'),
  team(455, 'Amer Shafi',           'Jordan'),   // GK
  team(456, 'Khaled Shehadeh',      'Jordan'),   // GK
  team(457, 'Mohammed Abu Hashish', 'Jordan'),   // DEF
  team(458, 'Yazan Al-Arab',        'Jordan'),   // DEF
  team(459, 'Abdallah Nasib',       'Jordan'),   // DEF
  team(460, 'Baha Faisal',          'Jordan'),   // DEF
  team(461, 'Ibrahim Saadeh',       'Jordan'),   // DEF
  team(462, 'Nizar Al-Rashdan',     'Jordan'),   // MID
  team(463, 'Ahmad Al-Sarour',      'Jordan'),   // MID
  team(464, 'Noor Al-Rawabdeh',     'Jordan'),   // MID
  team(465, 'Mahmoud Al-Mardi',     'Jordan'),   // MID
  team(466, 'Ali Olwan',            'Jordan'),   // MID
  team(467, 'Abdullah Nasib',       'Jordan'),   // FWD
  team(468, 'Yazeed Abulaila',      'Jordan'),   // FWD
  team(469, 'Musa Al-Taamari',      'Jordan'),   // FWD
  team(470, 'Yazan Al-Naimat',      'Jordan'),   // FWD

  // ── KOREA REPUBLIC (471–488) ─────────────────────────────────────────────
  team(471, 'Escudo Oficial',    'Korea Republic', 'badge'),
  team(472, 'Foto del Equipo',   'Korea Republic', 'logo'),
  team(473, 'Hyeonwoo Jo',       'Korea Republic'),   // GK
  team(474, 'Jo Hyeon-woo',      'Korea Republic'),   // GK
  team(475, 'Min-Jae Kim',       'Korea Republic'),   // DEF
  team(476, 'Kim Tae-hwan',      'Korea Republic'),   // DEF
  team(477, 'Lee Ki-je',         'Korea Republic'),   // DEF
  team(478, 'Kim Jin-su',        'Korea Republic'),   // DEF
  team(479, 'Young-Gwol Seol',   'Korea Republic'),   // DEF
  team(480, 'Taesook Lee',       'Korea Republic'),   // MID
  team(481, 'In-Beom Hwang',     'Korea Republic'),   // MID
  team(482, 'Jae-Sung Lee',      'Korea Republic'),   // MID
  team(483, 'Kangin Lee',        'Korea Republic'),   // MID
  team(484, 'Yumin Cho',         'Korea Republic'),   // MID
  team(485, 'Hee-Chan Hwang',    'Korea Republic'),   // FWD
  team(486, 'Hyeongyu Oh',       'Korea Republic'),   // FWD
  team(487, 'Cho Gue-sung',      'Korea Republic'),   // FWD
  team(488, 'Son Heung-min',     'Korea Republic'),   // FWD

  // ── MEXICO (489–506) ─────────────────────────────────────────────────────
  team(489, 'Escudo Oficial',    'Mexico', 'badge'),
  team(490, 'Foto del Equipo',   'Mexico', 'logo'),
  team(491, 'Luis Malagón',      'Mexico'),   // GK
  team(492, 'Guillermo Ochoa',   'Mexico'),   // GK
  team(493, 'Israel Reyes',      'Mexico'),   // DEF
  team(494, 'Néstor Araujo',     'Mexico'),   // DEF
  team(495, 'César Montes',      'Mexico'),   // DEF
  team(496, 'Juan Vásquez',      'Mexico'),   // DEF
  team(497, 'Gerardo Arteaga',   'Mexico'),   // DEF
  team(498, 'Jesús Gallardo',    'Mexico'),   // MID
  team(499, 'Edson Álvarez',     'Mexico'),   // MID
  team(500, 'Carlos Rodríguez',  'Mexico'),   // MID
  team(501, 'Orbelín Pineda',    'Mexico'),   // MID
  team(502, 'Roberto Alvarado',  'Mexico'),   // MID
  team(503, 'Hirving Lozano',    'Mexico'),   // FWD
  team(504, 'Henry Martín',      'Mexico'),   // FWD
  team(505, 'Raúl Jiménez',      'Mexico'),   // FWD
  team(506, 'Santiago Giménez',  'Mexico'),   // FWD

  // ── MOROCCO (507–524) ────────────────────────────────────────────────────
  team(507, 'Escudo Oficial',      'Morocco', 'badge'),
  team(508, 'Foto del Equipo',     'Morocco', 'logo'),
  team(509, 'Yassine Bounou',      'Morocco'),   // GK
  team(510, 'Munir El Haddadi',    'Morocco'),   // GK
  team(511, 'Noussair Mazraoui',   'Morocco'),   // DEF
  team(512, 'Nayef Aguerd',        'Morocco'),   // DEF
  team(513, 'Romain Saïss',        'Morocco'),   // DEF
  team(514, 'Achraf Hakimi',       'Morocco'),   // DEF
  team(515, 'Sofyan Amrabat',      'Morocco'),   // DEF
  team(516, 'Eliesse Ben Seghir',  'Morocco'),   // MID
  team(517, 'Ismael Saibari',      'Morocco'),   // MID
  team(518, 'Zakaria Aboukhlal',   'Morocco'),   // MID
  team(519, 'Selim Amallah',       'Morocco'),   // MID
  team(520, 'Amine Harit',         'Morocco'),   // MID
  team(521, 'Brahim Díaz',         'Morocco'),   // FWD
  team(522, 'Abde Ezzalzouli',     'Morocco'),   // FWD
  team(523, 'Ayoub El Kaabi',      'Morocco'),   // FWD
  team(524, 'Youssef En-Nesyri',   'Morocco'),   // FWD

  // ── NETHERLANDS (525–542) ────────────────────────────────────────────────
  team(525, 'Escudo Oficial',    'Netherlands', 'badge'),
  team(526, 'Foto del Equipo',   'Netherlands', 'logo'),
  team(527, 'Bart Verbruggen',   'Netherlands'),   // GK
  team(528, 'Mark Flekken',      'Netherlands'),   // GK
  team(529, 'Virgil van Dijk',   'Netherlands'),   // DEF
  team(530, 'Stefan de Vrij',    'Netherlands'),   // DEF
  team(531, 'Matthijs de Ligt',  'Netherlands'),   // DEF
  team(532, 'Nathan Aké',        'Netherlands'),   // DEF
  team(533, 'Jeremie Frimpong',  'Netherlands'),   // DEF
  team(534, 'Denzel Dumfries',   'Netherlands'),   // MID
  team(535, 'Tijjani Reijnders', 'Netherlands'),   // MID
  team(536, 'Ryan Gravenberch',  'Netherlands'),   // MID
  team(537, 'Xavi Simons',       'Netherlands'),   // MID
  team(538, 'Cody Gakpo',        'Netherlands'),   // MID
  team(539, 'Donyell Malen',     'Netherlands'),   // FWD
  team(540, 'Memphis Depay',     'Netherlands'),   // FWD
  team(541, 'Brian Brobbey',     'Netherlands'),   // FWD
  team(542, 'Wout Weghorst',     'Netherlands'),   // FWD

  // ── NEW ZEALAND (543–560) ────────────────────────────────────────────────
  team(543, 'Escudo Oficial',    'New Zealand', 'badge'),
  team(544, 'Foto del Equipo',   'New Zealand', 'logo'),
  team(545, 'Max Crocombe',      'New Zealand'),   // GK
  team(546, 'Michael Woud',      'New Zealand'),   // GK
  team(547, 'Liberato Cacace',   'New Zealand'),   // DEF
  team(548, 'Tommy Smith',       'New Zealand'),   // DEF
  team(549, 'Nando Pijnaker',    'New Zealand'),   // DEF
  team(550, 'Tim Payne',         'New Zealand'),   // DEF
  team(551, 'Finn Surman',       'New Zealand'),   // DEF
  team(552, 'Joe Bell',          'New Zealand'),   // MID
  team(553, 'Sarpreet Singh',    'New Zealand'),   // MID
  team(554, 'Matt Garbett',      'New Zealand'),   // MID
  team(555, 'Clayton Lewis',     'New Zealand'),   // MID
  team(556, 'Callan Elliot',     'New Zealand'),   // MID
  team(557, 'Marko Stamenic',    'New Zealand'),   // FWD
  team(558, 'Elijah Just',       'New Zealand'),   // FWD
  team(559, 'Kosta Barbarouses', 'New Zealand'),   // FWD
  team(560, 'Chris Wood',        'New Zealand'),   // FWD

  // ── NORWAY (561–578) ─────────────────────────────────────────────────────
  team(561, 'Escudo Oficial',          'Norway', 'badge'),
  team(562, 'Foto del Equipo',         'Norway', 'logo'),
  team(563, 'Ørjan Nyland',            'Norway'),   // GK
  team(564, 'Stian Rode Gregersen',    'Norway'),   // GK
  team(565, 'Julian Ryerson',          'Norway'),   // DEF
  team(566, 'Christoffer Ajer',        'Norway'),   // DEF
  team(567, 'David Møller Wolfe',      'Norway'),   // DEF
  team(568, 'Sander Berge',            'Norway'),   // DEF
  team(569, 'Patrick Berg',            'Norway'),   // DEF
  team(570, 'Martin Ødegaard',         'Norway'),   // MID
  team(571, 'Kristian Thorstvedt',     'Norway'),   // MID
  team(572, 'Jens Petter Hauge',       'Norway'),   // MID
  team(573, 'Mohamed Elyounoussi',     'Norway'),   // MID
  team(574, 'Antonio Nusa',            'Norway'),   // MID
  team(575, 'Oscar Bobb',              'Norway'),   // FWD
  team(576, 'Alexander Sørloth',       'Norway'),   // FWD
  team(577, 'Erling Haaland',          'Norway'),   // FWD
  team(578, 'Ola Solbakken',           'Norway'),   // FWD

  // ── PANAMA (579–596) ─────────────────────────────────────────────────────
  team(579, 'Escudo Oficial',          'Panama', 'badge'),
  team(580, 'Foto del Equipo',         'Panama', 'logo'),
  team(581, 'Orlando Mosquera',        'Panama'),   // GK
  team(582, 'Luis Mejía',              'Panama'),   // GK
  team(583, 'Andrés Andrade',          'Panama'),   // DEF
  team(584, 'Fidel Escobar',           'Panama'),   // DEF
  team(585, 'Roderick Miller',         'Panama'),   // DEF
  team(586, 'Michael Amir Murillo',    'Panama'),   // DEF
  team(587, 'Cristian Martínez',       'Panama'),   // DEF
  team(588, 'Adalberto Carrasquilla',  'Panama'),   // MID
  team(589, 'Aníbal Godoy',            'Panama'),   // MID
  team(590, 'César Yanis',             'Panama'),   // MID
  team(591, 'Edgar Bárcenas',          'Panama'),   // MID
  team(592, 'Alberto Quintero',        'Panama'),   // MID
  team(593, 'José Fajardo',            'Panama'),   // FWD
  team(594, 'Ismael Díaz',             'Panama'),   // FWD
  team(595, 'Cecilio Waterman',        'Panama'),   // FWD
  team(596, 'José Luis Rodríguez',     'Panama'),   // FWD

  // ── PARAGUAY (597–614) ───────────────────────────────────────────────────
  team(597, 'Escudo Oficial',      'Paraguay', 'badge'),
  team(598, 'Foto del Equipo',     'Paraguay', 'logo'),
  team(599, 'Antony Silva',        'Paraguay'),   // GK
  team(600, 'Roberto Fernández',   'Paraguay'),   // GK
  team(601, 'Gustavo Gómez',       'Paraguay'),   // DEF
  team(602, 'Omar Alderete',       'Paraguay'),   // DEF
  team(603, 'Júnior Alonso',       'Paraguay'),   // DEF
  team(604, 'Juan José Cáceres',   'Paraguay'),   // DEF
  team(605, 'Braian Ojeda',        'Paraguay'),   // DEF
  team(606, 'Richard Sánchez',     'Paraguay'),   // MID
  team(607, 'Andrés Cubas',        'Paraguay'),   // MID
  team(608, 'Mathías Villasanti',  'Paraguay'),   // MID
  team(609, 'Julián Almirón',      'Paraguay'),   // MID
  team(610, 'Miguel Almirón',      'Paraguay'),   // MID
  team(611, 'Julio Enciso',        'Paraguay'),   // FWD
  team(612, 'Ramón Sosa',          'Paraguay'),   // FWD
  team(613, 'Darío Lezcano',       'Paraguay'),   // FWD
  team(614, 'Antonio Sanabria',    'Paraguay'),   // FWD

  // ── POLAND (615–632) ─────────────────────────────────────────────────────
  team(615, 'Escudo Oficial',         'Poland', 'badge'),
  team(616, 'Foto del Equipo',        'Poland', 'logo'),
  team(617, 'Wojciech Szczęsny',      'Poland'),   // GK
  team(618, 'Łukasz Fabiański',       'Poland'),   // GK
  team(619, 'Jan Bednarek',           'Poland'),   // DEF
  team(620, 'Kamil Glik',             'Poland'),   // DEF
  team(621, 'Bartosz Bereszyński',    'Poland'),   // DEF
  team(622, 'Jakub Kiwior',           'Poland'),   // DEF
  team(623, 'Matty Cash',             'Poland'),   // DEF
  team(624, 'Mateusz Klich',          'Poland'),   // MID
  team(625, 'Grzegorz Krychowiak',    'Poland'),   // MID
  team(626, 'Piotr Zieliński',        'Poland'),   // MID
  team(627, 'Przemysław Frankowski',  'Poland'),   // MID
  team(628, 'Sebastian Szymański',    'Poland'),   // MID
  team(629, 'Szymon Żurkowski',       'Poland'),   // FWD
  team(630, 'Michał Skóraś',          'Poland'),   // FWD
  team(631, 'Arkadiusz Milik',        'Poland'),   // FWD
  team(632, 'Robert Lewandowski',     'Poland'),   // FWD

  // ── PORTUGAL (633–650) ───────────────────────────────────────────────────
  team(633, 'Escudo Oficial',      'Portugal', 'badge'),
  team(634, 'Foto del Equipo',     'Portugal', 'logo'),
  team(635, 'Diogo Costa',         'Portugal'),   // GK
  team(636, 'Rui Patrício',        'Portugal'),   // GK
  team(637, 'Rúben Dias',          'Portugal'),   // DEF
  team(638, 'Pepe',                'Portugal'),   // DEF
  team(639, 'João Cancelo',        'Portugal'),   // DEF
  team(640, 'Nuno Mendes',         'Portugal'),   // DEF
  team(641, 'João Neves',          'Portugal'),   // DEF
  team(642, 'Vitinha',             'Portugal'),   // MID
  team(643, 'Bruno Fernandes',     'Portugal'),   // MID
  team(644, 'Rúben Neves',         'Portugal'),   // MID
  team(645, 'Bernardo Silva',      'Portugal'),   // MID
  team(646, 'Francisco Conceição', 'Portugal'),   // MID
  team(647, 'Pedro Neto',          'Portugal'),   // FWD
  team(648, 'Rafael Leão',         'Portugal'),   // FWD
  team(649, 'Gonçalo Ramos',       'Portugal'),   // FWD
  team(650, 'Cristiano Ronaldo',   'Portugal'),   // FWD

  // ── QATAR (651–668) ──────────────────────────────────────────────────────
  team(651, 'Escudo Oficial',    'Qatar', 'badge'),
  team(652, 'Foto del Equipo',   'Qatar', 'logo'),
  team(653, 'Meshaal Barsham',   'Qatar'),   // GK
  team(654, 'Saad Al-Sheeb',     'Qatar'),   // GK
  team(655, 'Boualem Khoukhi',   'Qatar'),   // DEF
  team(656, 'Abdelkarim Hassan', 'Qatar'),   // DEF
  team(657, 'Lucas Mendes',      'Qatar'),   // DEF
  team(658, 'Pedro Miguel',      'Qatar'),   // DEF
  team(659, 'Bassam Al-Rawi',    'Qatar'),   // DEF
  team(660, 'Homam Al-Amin',     'Qatar'),   // MID
  team(661, 'Ahmed Fathi',       'Qatar'),   // MID
  team(662, 'Karim Boudiaf',     'Qatar'),   // MID
  team(663, 'Edmilson Junior',   'Qatar'),   // MID
  team(664, 'Hassan Al-Haydos',  'Qatar'),   // MID
  team(665, 'Ahmed Al-Qaeni',    'Qatar'),   // FWD
  team(666, 'Akram Hassan Afif', 'Qatar'),   // FWD
  team(667, 'Almoez Ali',        'Qatar'),   // FWD
  team(668, 'Yusuf Abdurisag',   'Qatar'),   // FWD

  // ── SAUDI ARABIA (669–686) ───────────────────────────────────────────────
  team(669, 'Escudo Oficial',       'Saudi Arabia', 'badge'),
  team(670, 'Foto del Equipo',      'Saudi Arabia', 'logo'),
  team(671, 'Mohammed Al-Owais',    'Saudi Arabia'),   // GK
  team(672, 'Nawaf Al-Aqidi',       'Saudi Arabia'),   // GK
  team(673, 'Hassan Altambakti',    'Saudi Arabia'),   // DEF
  team(674, 'Saud Abdulhamid',      'Saudi Arabia'),   // DEF
  team(675, 'Ali Al-Bulaihi',       'Saudi Arabia'),   // DEF
  team(676, 'Jehad Thikri',         'Saudi Arabia'),   // DEF
  team(677, 'Abdulelah Al-Malki',   'Saudi Arabia'),   // DEF
  team(678, 'Nasser Al-Dawsari',    'Saudi Arabia'),   // MID
  team(679, 'Abdullah Alkhanbari',  'Saudi Arabia'),   // MID
  team(680, 'Musar Al-Juwayr',      'Saudi Arabia'),   // MID
  team(681, 'Faisal Al-Ghamdi',     'Saudi Arabia'),   // MID
  team(682, 'Salem Al-Dawsari',     'Saudi Arabia'),   // MID
  team(683, 'Feras Al-Brikan',      'Saudi Arabia'),   // FWD
  team(684, 'Abdullah Al-Hamdan',   'Saudi Arabia'),   // FWD
  team(685, 'Saleh Al-Bashir',      'Saudi Arabia'),   // FWD
  team(686, 'Saleh Al-Shehri',      'Saudi Arabia'),   // FWD

  // ── SCOTLAND (687–704) ───────────────────────────────────────────────────
  team(687, 'Escudo Oficial',     'Scotland', 'badge'),
  team(688, 'Foto del Equipo',    'Scotland', 'logo'),
  team(689, 'Angus Gunn',         'Scotland'),   // GK
  team(690, 'Craig Gordon',       'Scotland'),   // GK
  team(691, 'Kieran Tierney',     'Scotland'),   // DEF
  team(692, 'Grant Hanley',       'Scotland'),   // DEF
  team(693, 'Jack Hendry',        'Scotland'),   // DEF
  team(694, 'Anthony Ralston',    'Scotland'),   // DEF
  team(695, 'Andrew Robertson',   'Scotland'),   // DEF
  team(696, 'Scott McTominay',    'Scotland'),   // MID
  team(697, 'Billy Gilmour',      'Scotland'),   // MID
  team(698, 'Lewis Ferguson',     'Scotland'),   // MID
  team(699, 'Kenny McLean',       'Scotland'),   // MID
  team(700, 'Ryan Christie',      'Scotland'),   // MID
  team(701, 'John McGinn',        'Scotland'),   // FWD
  team(702, 'Ben Doak',           'Scotland'),   // FWD
  team(703, 'Lawrence Shankland', 'Scotland'),   // FWD
  team(704, 'Ché Adams',          'Scotland'),   // FWD

  // ── SENEGAL (705–722) ────────────────────────────────────────────────────
  team(705, 'Escudo Oficial',        'Senegal', 'badge'),
  team(706, 'Foto del Equipo',       'Senegal', 'logo'),
  team(707, 'Édouard Mendy',         'Senegal'),   // GK
  team(708, 'Alfred Gomis',          'Senegal'),   // GK
  team(709, 'Kalidou Koulibaly',     'Senegal'),   // DEF
  team(710, 'Moussa Niakhaté',       'Senegal'),   // DEF
  team(711, 'Formose Mendy',         'Senegal'),   // DEF
  team(712, 'El Hadji Malick Diouf', 'Senegal'),   // DEF
  team(713, 'Pape Guèye',            'Senegal'),   // DEF
  team(714, 'Idrissa Gana Gueye',    'Senegal'),   // MID
  team(715, 'Pape Matar Sarr',       'Senegal'),   // MID
  team(716, 'Lamine Camara',         'Senegal'),   // MID
  team(717, 'Krepin Diatta',         'Senegal'),   // MID
  team(718, 'Ismaïla Sarr',          'Senegal'),   // MID
  team(719, 'Habib Diallo',          'Senegal'),   // FWD
  team(720, 'Bamba Dieng',           'Senegal'),   // FWD
  team(721, 'Nicolas Jackson',       'Senegal'),   // FWD
  team(722, 'Sadio Mané',            'Senegal'),   // FWD

  // ── SOUTH AFRICA (723–740) ───────────────────────────────────────────────
  team(723, 'Escudo Oficial',    'South Africa', 'badge'),
  team(724, 'Foto del Equipo',   'South Africa', 'logo'),
  team(725, 'Ronwen Williams',   'South Africa'),   // GK
  team(726, 'Veli Mothwa',       'South Africa'),   // GK
  team(727, 'Siyabonga Ngezana', 'South Africa'),   // DEF
  team(728, 'Siyanda Xulu',      'South Africa'),   // DEF
  team(729, 'Aubrey Modiba',     'South Africa'),   // DEF
  team(730, 'Terrence Mashego',  'South Africa'),   // DEF
  team(731, 'Khuliso Mudau',     'South Africa'),   // DEF
  team(732, 'Teboho Mokoena',    'South Africa'),   // MID
  team(733, 'Bongani Zungu',     'South Africa'),   // MID
  team(734, 'Yaya Sithole',      'South Africa'),   // MID
  team(735, 'Mbekezeli Mbokazi', 'South Africa'),   // MID
  team(736, 'Themba Zwane',      'South Africa'),   // MID
  team(737, 'Percy Tau',         'South Africa'),   // FWD
  team(738, 'Oswin Appollis',    'South Africa'),   // FWD
  team(739, 'Evidence Makgopa',  'South Africa'),   // FWD
  team(740, 'Lyle Foster',       'South Africa'),   // FWD

  // ── SPAIN (741–758) ──────────────────────────────────────────────────────
  team(741, 'Escudo Oficial',      'Spain', 'badge'),
  team(742, 'Foto del Equipo',     'Spain', 'logo'),
  team(743, 'Unai Simón',          'Spain'),   // GK
  team(744, 'Alejandro Remiro',    'Spain'),   // GK
  team(745, 'Robin Le Normand',    'Spain'),   // DEF
  team(746, 'Dean Huijsen',        'Spain'),   // DEF
  team(747, 'Aymeric Laporte',     'Spain'),   // DEF
  team(748, 'César Azpilicueta',   'Spain'),   // DEF
  team(749, 'Marc Cucurella',      'Spain'),   // DEF
  team(750, 'Martín Zubimendi',    'Spain'),   // MID
  team(751, 'Rodri',               'Spain'),   // MID
  team(752, 'Gavi',                'Spain'),   // MID
  team(753, 'Pedri',               'Spain'),   // MID
  team(754, 'Fabián Ruiz',         'Spain'),   // MID
  team(755, 'Lamine Yamal',        'Spain'),   // FWD
  team(756, 'Nico Williams',       'Spain'),   // FWD
  team(757, 'Álvaro Morata',       'Spain'),   // FWD
  team(758, 'Mikel Oyarzabal',     'Spain'),   // FWD

  // ── SWEDEN (759–776) ─────────────────────────────────────────────────────
  team(759, 'Escudo Oficial',        'Sweden', 'badge'),
  team(760, 'Foto del Equipo',       'Sweden', 'logo'),
  team(761, 'Robin Olsen',           'Sweden'),   // GK
  team(762, 'Karl-Johan Johnsson',   'Sweden'),   // GK
  team(763, 'Victor Lindelöf',       'Sweden'),   // DEF
  team(764, 'Mikael Lustig',         'Sweden'),   // DEF
  team(765, 'Sebastian Larsson',     'Sweden'),   // DEF
  team(766, 'Jens Cajuste',          'Sweden'),   // DEF
  team(767, 'Filip Helander',        'Sweden'),   // DEF
  team(768, 'Emil Forsberg',         'Sweden'),   // MID
  team(769, 'Mattias Svanberg',      'Sweden'),   // MID
  team(770, 'Dejan Kulusevski',      'Sweden'),   // MID
  team(771, 'Anthony Elanga',        'Sweden'),   // MID
  team(772, 'Jordan Larsson',        'Sweden'),   // MID
  team(773, 'Alexander Isak',        'Sweden'),   // FWD
  team(774, 'Viktor Gyökeres',       'Sweden'),   // FWD
  team(775, 'Isaac Kiese Thelin',    'Sweden'),   // FWD
  team(776, 'Zlatan Ibrahimović',    'Sweden'),   // FWD

  // ── SWITZERLAND (777–794) ────────────────────────────────────────────────
  team(777, 'Escudo Oficial',    'Switzerland', 'badge'),
  team(778, 'Foto del Equipo',   'Switzerland', 'logo'),
  team(779, 'Gregor Kobel',      'Switzerland'),   // GK
  team(780, 'Yann Sommer',       'Switzerland'),   // GK
  team(781, 'Manuel Akanji',     'Switzerland'),   // DEF
  team(782, 'Fabian Schär',      'Switzerland'),   // DEF
  team(783, 'Nico Elvedi',       'Switzerland'),   // DEF
  team(784, 'Kevin Mbabu',       'Switzerland'),   // DEF
  team(785, 'Ricardo Rodríguez', 'Switzerland'),   // DEF
  team(786, 'Granit Xhaka',      'Switzerland'),   // MID
  team(787, 'Denis Zakaria',     'Switzerland'),   // MID
  team(788, 'Remo Freuler',      'Switzerland'),   // MID
  team(789, 'Manuel Widmer',     'Switzerland'),   // MID
  team(790, 'Dan Ndoye',         'Switzerland'),   // MID
  team(791, 'Rubén Vargas',      'Switzerland'),   // FWD
  team(792, 'Noah Okafor',       'Switzerland'),   // FWD
  team(793, 'Zeki Amdouni',      'Switzerland'),   // FWD
  team(794, 'Breel Embolo',      'Switzerland'),   // FWD

  // ── TUNISIA (795–812) ────────────────────────────────────────────────────
  team(795, 'Escudo Oficial',   'Tunisia', 'badge'),
  team(796, 'Foto del Equipo',  'Tunisia', 'logo'),
  team(797, 'Aymen Dahmen',     'Tunisia'),   // GK
  team(798, 'Bechir Ben Said',  'Tunisia'),   // GK
  team(799, 'Montassar Talbi',  'Tunisia'),   // DEF
  team(800, 'Yassin Meriah',    'Tunisia'),   // DEF
  team(801, 'Mohamed Dräger',   'Tunisia'),   // DEF
  team(802, 'Ali Abdi',         'Tunisia'),   // DEF
  team(803, 'Wajdi Kechrida',   'Tunisia'),   // DEF
  team(804, 'Ferjani Sassi',    'Tunisia'),   // MID
  team(805, 'Aïssa Laïdouni',   'Tunisia'),   // MID
  team(806, 'Ellyes Skhiri',    'Tunisia'),   // MID
  team(807, 'Hannibal Mejbri',  'Tunisia'),   // MID
  team(808, 'Naïm Sliti',       'Tunisia'),   // MID
  team(809, 'Wahbi Khazri',     'Tunisia'),   // FWD
  team(810, 'Elias Achouri',    'Tunisia'),   // FWD
  team(811, 'Seifeddine Jaziri','Tunisia'),   // FWD
  team(812, 'Hazem Mastouri',   'Tunisia'),   // FWD

  // ── TURKEY (813–830) ─────────────────────────────────────────────────────
  team(813, 'Escudo Oficial',      'Turkey', 'badge'),
  team(814, 'Foto del Equipo',     'Turkey', 'logo'),
  team(815, 'Mert Günok',          'Turkey'),   // GK
  team(816, 'Altay Bayındır',      'Turkey'),   // GK
  team(817, 'Çağlar Söyüncü',      'Turkey'),   // DEF
  team(818, 'Merih Demiral',       'Turkey'),   // DEF
  team(819, 'Samet Akaydın',       'Turkey'),   // DEF
  team(820, 'Zeki Çelik',          'Turkey'),   // DEF
  team(821, 'Ferdi Kadıoğlu',      'Turkey'),   // DEF
  team(822, 'Hakan Çalhanoğlu',    'Turkey'),   // MID
  team(823, 'Salih Özcan',         'Turkey'),   // MID
  team(824, 'Arda Güler',          'Turkey'),   // MID
  team(825, 'Kenan Yıldız',        'Turkey'),   // MID
  team(826, 'Baris Alper Yılmaz',  'Turkey'),   // MID
  team(827, 'Kerem Aktürkoğlu',    'Turkey'),   // FWD
  team(828, 'Muhammed Şengezer',   'Turkey'),   // FWD
  team(829, 'Cenk Tosun',          'Turkey'),   // FWD
  team(830, 'Burak Yılmaz',        'Turkey'),   // FWD

  // ── UNITED STATES (831–848) ──────────────────────────────────────────────
  team(831, 'Escudo Oficial',    'United States', 'badge'),
  team(832, 'Foto del Equipo',   'United States', 'logo'),
  team(833, 'Matt Freese',       'United States'),   // GK
  team(834, 'Zack Steffen',      'United States'),   // GK
  team(835, 'Chris Richards',    'United States'),   // DEF
  team(836, 'Miles Robinson',    'United States'),   // DEF
  team(837, 'Tim Ream',          'United States'),   // DEF
  team(838, 'Sergino Dest',      'United States'),   // DEF
  team(839, 'Antonee Robinson',  'United States'),   // DEF
  team(840, 'Tyler Adams',       'United States'),   // MID
  team(841, 'Weston McKennie',   'United States'),   // MID
  team(842, 'Tanner Tessmann',   'United States'),   // MID
  team(843, 'Giovanni Reyna',    'United States'),   // MID
  team(844, 'Timothy Weah',      'United States'),   // MID
  team(845, 'Malik Tillman',     'United States'),   // FWD
  team(846, 'Folarin Balogun',   'United States'),   // FWD
  team(847, 'Ricardo Pepi',      'United States'),   // FWD
  team(848, 'Christian Pulisic', 'United States'),   // FWD

  // ── URUGUAY (849–866) ────────────────────────────────────────────────────
  team(849, 'Escudo Oficial',          'Uruguay', 'badge'),
  team(850, 'Foto del Equipo',         'Uruguay', 'logo'),
  team(851, 'Sergio Rochet',           'Uruguay'),   // GK
  team(852, 'Guillermo Varela',        'Uruguay'),   // GK
  team(853, 'Ronald Araújo',           'Uruguay'),   // DEF
  team(854, 'José María Giménez',      'Uruguay'),   // DEF
  team(855, 'Sebastián Cáceres',       'Uruguay'),   // DEF
  team(856, 'Martín Cáceres',          'Uruguay'),   // DEF
  team(857, 'Mathías Olivera',         'Uruguay'),   // DEF
  team(858, 'Nahitan Nández',          'Uruguay'),   // MID
  team(859, 'Rodrigo Bentancur',       'Uruguay'),   // MID
  team(860, 'Manuel Ugarte',           'Uruguay'),   // MID
  team(861, 'Lucas Torreira',          'Uruguay'),   // MID
  team(862, 'Federico Valverde',       'Uruguay'),   // MID
  team(863, 'Giorgian De Arrascaeta',  'Uruguay'),   // FWD
  team(864, 'Facundo Pellistri',       'Uruguay'),   // FWD
  team(865, 'Darwin Núñez',            'Uruguay'),   // FWD
  team(866, 'Luis Suárez',             'Uruguay'),   // FWD

  // ── UZBEKISTAN (867–884) ─────────────────────────────────────────────────
  team(867, 'Escudo Oficial',         'Uzbekistan', 'badge'),
  team(868, 'Foto del Equipo',        'Uzbekistan', 'logo'),
  team(869, 'Utkir Yusupov',          'Uzbekistan'),   // GK
  team(870, 'Timur Kapadze',          'Uzbekistan'),   // GK
  team(871, 'Abdukodir Khusanov',     'Uzbekistan'),   // DEF
  team(872, 'Farrukh Sayfiev',        'Uzbekistan'),   // DEF
  team(873, 'Sherzod Nasrullaev',     'Uzbekistan'),   // DEF
  team(874, 'Rustam Ashurmatov',      'Uzbekistan'),   // DEF
  team(875, 'Khushnudbek Aliqulov',   'Uzbekistan'),   // DEF
  team(876, 'Khokjabkar Alijonov',    'Uzbekistan'),   // MID
  team(877, 'Dostonbek Khamdamov',    'Uzbekistan'),   // MID
  team(878, 'Javokhir Sidiqov',       'Uzbekistan'),   // MID
  team(879, 'Islom Tukhtakhujaev',    'Uzbekistan'),   // MID
  team(880, 'Bahodir Abdullaev',      'Uzbekistan'),   // MID
  team(881, 'Odiljon Hamrobekov',     'Uzbekistan'),   // FWD
  team(882, 'Otabek Shukurov',        'Uzbekistan'),   // FWD
  team(883, 'Abbosbek Fayzullaev',    'Uzbekistan'),   // FWD
  team(884, 'Eldor Shomurodov',       'Uzbekistan'),   // FWD

  // ── MEJORES PORTEROS (885–900) — 16 stickers ─────────────────────────────
  special(885, 'Emiliano Martínez',    'Mejores Porteros'),
  special(886, 'Thibaut Courtois',     'Mejores Porteros'),
  special(887, 'Alisson',              'Mejores Porteros'),
  special(888, 'Mike Maignan',         'Mejores Porteros'),
  special(889, 'Marc-André ter Stegen','Mejores Porteros'),
  special(890, 'Yassine Bounou',       'Mejores Porteros'),
  special(891, 'Diogo Costa',          'Mejores Porteros'),
  special(892, 'Unai Simón',           'Mejores Porteros'),
  special(893, 'Gregor Kobel',         'Mejores Porteros'),
  special(894, 'Jordan Pickford',      'Mejores Porteros'),
  special(895, 'Zion Suzuki',          'Mejores Porteros'),
  special(896, 'Ronwen Williams',      'Mejores Porteros'),
  special(897, 'Dayne St. Clair',      'Mejores Porteros'),
  special(898, 'Kasper Schmeichel',    'Mejores Porteros'),
  special(899, 'Gianluigi Donnarumma', 'Mejores Porteros'),
  special(900, 'Meshaal Barsham',      'Mejores Porteros'),

  // ── MEJORES DEFENSAS (901–916) — 16 stickers ─────────────────────────────
  special(901, 'Virgil van Dijk',    'Mejores Defensas'),
  special(902, 'Éder Militão',       'Mejores Defensas'),
  special(903, 'Joško Gvardiol',     'Mejores Defensas'),
  special(904, 'William Saliba',     'Mejores Defensas'),
  special(905, 'Antonio Rüdiger',    'Mejores Defensas'),
  special(906, 'Min-Jae Kim',        'Mejores Defensas'),
  special(907, 'Achraf Hakimi',      'Mejores Defensas'),
  special(908, 'Alphonso Davies',    'Mejores Defensas'),
  special(909, 'Nuno Mendes',        'Mejores Defensas'),
  special(910, 'Rúben Dias',         'Mejores Defensas'),
  special(911, 'Cristian Romero',    'Mejores Defensas'),
  special(912, 'Kalidou Koulibaly',  'Mejores Defensas'),
  special(913, 'Ronald Araújo',      'Mejores Defensas'),
  special(914, 'Dean Huijsen',       'Mejores Defensas'),
  special(915, 'Marquinhos',         'Mejores Defensas'),
  special(916, 'Alessandro Bastoni', 'Mejores Defensas'),

  // ── MEJORES MEDIOCAMPISTAS (917–932) — 16 stickers ───────────────────────
  special(917, 'Jude Bellingham',     'Mejores Mediocampistas'),
  special(918, 'Luka Modrić',         'Mejores Mediocampistas'),
  special(919, 'Kevin De Bruyne',     'Mejores Mediocampistas'),
  special(920, 'Pedri',               'Mejores Mediocampistas'),
  special(921, 'Rodri',               'Mejores Mediocampistas'),
  special(922, 'Federico Valverde',   'Mejores Mediocampistas'),
  special(923, 'Moisés Caicedo',      'Mejores Mediocampistas'),
  special(924, 'Martin Ødegaard',     'Mejores Mediocampistas'),
  special(925, 'Florian Wirtz',       'Mejores Mediocampistas'),
  special(926, 'Sofyan Amrabat',      'Mejores Mediocampistas'),
  special(927, 'Joshua Kimmich',      'Mejores Mediocampistas'),
  special(928, 'Bruno Fernandes',     'Mejores Mediocampistas'),
  special(929, 'Scott McTominay',     'Mejores Mediocampistas'),
  special(930, 'Enzo Fernández',      'Mejores Mediocampistas'),
  special(931, 'Tijjani Reijnders',   'Mejores Mediocampistas'),
  special(932, 'Aurélien Tchouaméni', 'Mejores Mediocampistas'),

  // ── MEJORES DELANTEROS (933–948) — 16 stickers ───────────────────────────
  special(933, 'Erling Haaland',    'Mejores Delanteros'),
  special(934, 'Kylian Mbappé',     'Mejores Delanteros'),
  special(935, 'Harry Kane',        'Mejores Delanteros'),
  special(936, 'Vinícius Júnior',   'Mejores Delanteros'),
  special(937, 'Mohamed Salah',     'Mejores Delanteros'),
  special(938, 'Lamine Yamal',      'Mejores Delanteros'),
  special(939, 'Romelu Lukaku',     'Mejores Delanteros'),
  special(940, 'Darwin Núñez',      'Mejores Delanteros'),
  special(941, 'Raphinha',          'Mejores Delanteros'),
  special(942, 'Jonathan David',    'Mejores Delanteros'),
  special(943, 'Sadio Mané',        'Mejores Delanteros'),
  special(944, 'Viktor Gyökeres',   'Mejores Delanteros'),
  special(945, 'Alexander Sørloth', 'Mejores Delanteros'),
  special(946, 'Luis Díaz',         'Mejores Delanteros'),
  special(947, 'Santiago Giménez',  'Mejores Delanteros'),
  special(948, 'Bukayo Saka',       'Mejores Delanteros'),

  // ── ESTRELLAS DEL TORNEO (949–964) — 16 stickers ─────────────────────────
  special(949, 'Lionel Messi',       'Estrellas del Torneo'),
  special(950, 'Cristiano Ronaldo',  'Estrellas del Torneo'),
  special(951, 'Kylian Mbappé',      'Estrellas del Torneo'),
  special(952, 'Harry Kane',         'Estrellas del Torneo'),
  special(953, 'Son Heung-min',      'Estrellas del Torneo'),
  special(954, 'Erling Haaland',     'Estrellas del Torneo'),
  special(955, 'Mohamed Salah',      'Estrellas del Torneo'),
  special(956, 'Lamine Yamal',       'Estrellas del Torneo'),
  special(957, 'Jude Bellingham',    'Estrellas del Torneo'),
  special(958, 'Kevin De Bruyne',    'Estrellas del Torneo'),
  special(959, 'Luka Modrić',        'Estrellas del Torneo'),
  special(960, 'Federico Valverde',  'Estrellas del Torneo'),
  special(961, 'Vinícius Júnior',    'Estrellas del Torneo'),
  special(962, 'Florian Wirtz',      'Estrellas del Torneo'),
  special(963, 'Pedri',              'Estrellas del Torneo'),
  special(964, 'Rodri',              'Estrellas del Torneo'),

  // ── GLORIAS MUNDIALISTAS (965–980) — 16 stickers ─────────────────────────
  special(965, 'Zinedine Zidane',  'Glorias Mundialistas'),
  special(966, 'Ronaldo Nazário',  'Glorias Mundialistas'),
  special(967, 'Pelé',             'Glorias Mundialistas'),
  special(968, 'Diego Maradona',   'Glorias Mundialistas'),
  special(969, 'Ronaldinho',       'Glorias Mundialistas'),
  special(970, 'Thierry Henry',    'Glorias Mundialistas'),
  special(971, 'Oliver Kahn',      'Glorias Mundialistas'),
  special(972, 'Miroslav Klose',   'Glorias Mundialistas'),
  special(973, 'Roberto Baggio',   'Glorias Mundialistas'),
  special(974, 'Paolo Maldini',    'Glorias Mundialistas'),
  special(975, 'Cafu',             'Glorias Mundialistas'),
  special(976, 'Xavi Hernández',   'Glorias Mundialistas'),
  special(977, 'Andrés Iniesta',   'Glorias Mundialistas'),
  special(978, 'Johan Cruyff',     'Glorias Mundialistas'),
  special(979, 'Gerd Müller',      'Glorias Mundialistas'),
  special(980, 'Eusébio',          'Glorias Mundialistas'),
]

export const TOTAL_STICKERS = STICKER_CATALOG.length

export const CATALOG_MAP = new Map<string, StickerDef>(
  STICKER_CATALOG.map((s) => [s.number, s])
)

export function getCatalogByTeam(teamName: string): StickerDef[] {
  return STICKER_CATALOG.filter((s) => s.section === teamName)
}

export const ALL_SECTIONS = [...new Set(STICKER_CATALOG.map((s) => s.section))]
