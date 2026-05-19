-- ============================================================
-- FIFA WC 2026 Trading Cards — Sticker Catalog Seed
-- Run this AFTER schema-v2.sql
-- ============================================================

-- Argentina
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('ARG-00', 'Argentina Logo', 'Argentina', 'Argentina', 'logo'),
  ('ARG-B', 'Argentina Badge', 'Argentina', 'Argentina', 'badge'),
  ('ARG-01', 'Lionel Messi', 'Argentina', 'Argentina', 'player'),
  ('ARG-02', 'Enzo Fernández', 'Argentina', 'Argentina', 'player'),
  ('ARG-03', 'Julián Álvarez', 'Argentina', 'Argentina', 'player'),
  ('ARG-04', 'Rodrigo De Paul', 'Argentina', 'Argentina', 'player'),
  ('ARG-05', 'Lautaro Martínez', 'Argentina', 'Argentina', 'player'),
  ('ARG-06', 'Emiliano Martínez', 'Argentina', 'Argentina', 'player'),
  ('ARG-07', 'Cristian Romero', 'Argentina', 'Argentina', 'player'),
  ('ARG-08', 'Leandro Paredes', 'Argentina', 'Argentina', 'player'),
  ('ARG-09', 'Ángel Di María', 'Argentina', 'Argentina', 'player'),
  ('ARG-10', 'Alexis Mac Allister', 'Argentina', 'Argentina', 'player'),
  ('ARG-11', 'Germán Pezzella', 'Argentina', 'Argentina', 'player'),
  ('ARG-12', 'Nahuel Molina', 'Argentina', 'Argentina', 'player'),
  ('ARG-13', 'Thiago Almada', 'Argentina', 'Argentina', 'player') ON CONFLICT (number) DO NOTHING;

-- Brazil
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('BRA-00', 'Brazil Logo', 'Brazil', 'Brazil', 'logo'),
  ('BRA-B', 'Brazil Badge', 'Brazil', 'Brazil', 'badge'),
  ('BRA-01', 'Vinicius Jr', 'Brazil', 'Brazil', 'player'),
  ('BRA-02', 'Rodrygo', 'Brazil', 'Brazil', 'player'),
  ('BRA-03', 'Casemiro', 'Brazil', 'Brazil', 'player'),
  ('BRA-04', 'Alisson Becker', 'Brazil', 'Brazil', 'player'),
  ('BRA-05', 'Marquinhos', 'Brazil', 'Brazil', 'player'),
  ('BRA-06', 'Raphinha', 'Brazil', 'Brazil', 'player'),
  ('BRA-07', 'Endrick', 'Brazil', 'Brazil', 'player'),
  ('BRA-08', 'Bruno Guimarães', 'Brazil', 'Brazil', 'player'),
  ('BRA-09', 'Militão', 'Brazil', 'Brazil', 'player'),
  ('BRA-10', 'Pedro', 'Brazil', 'Brazil', 'player'),
  ('BRA-11', 'Gerson', 'Brazil', 'Brazil', 'player'),
  ('BRA-12', 'Danilo', 'Brazil', 'Brazil', 'player'),
  ('BRA-13', 'Fred', 'Brazil', 'Brazil', 'player') ON CONFLICT (number) DO NOTHING;

-- France
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('FRA-00', 'France Logo', 'France', 'France', 'logo'),
  ('FRA-B', 'France Badge', 'France', 'France', 'badge'),
  ('FRA-01', 'Kylian Mbappé', 'France', 'France', 'player'),
  ('FRA-02', 'Antoine Griezmann', 'France', 'France', 'player'),
  ('FRA-03', 'Ousmane Dembélé', 'France', 'France', 'player'),
  ('FRA-04', 'N''Golo Kanté', 'France', 'France', 'player'),
  ('FRA-05', 'Aurélien Tchouaméni', 'France', 'France', 'player'),
  ('FRA-06', 'Mike Maignan', 'France', 'France', 'player'),
  ('FRA-07', 'Jules Koundé', 'France', 'France', 'player'),
  ('FRA-08', 'Dayot Upamecano', 'France', 'France', 'player'),
  ('FRA-09', 'Marcus Thuram', 'France', 'France', 'player'),
  ('FRA-10', 'Eduardo Camavinga', 'France', 'France', 'player'),
  ('FRA-11', 'Kingsley Coman', 'France', 'France', 'player'),
  ('FRA-12', 'Lucas Hernández', 'France', 'France', 'player'),
  ('FRA-13', 'Ibrahima Konaté', 'France', 'France', 'player') ON CONFLICT (number) DO NOTHING;

-- Germany
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('GER-00', 'Germany Logo', 'Germany', 'Germany', 'logo'),
  ('GER-B', 'Germany Badge', 'Germany', 'Germany', 'badge'),
  ('GER-01', 'Florian Wirtz', 'Germany', 'Germany', 'player'),
  ('GER-02', 'Jamal Musiala', 'Germany', 'Germany', 'player'),
  ('GER-03', 'Joshua Kimmich', 'Germany', 'Germany', 'player'),
  ('GER-04', 'Manuel Neuer', 'Germany', 'Germany', 'player'),
  ('GER-05', 'Antonio Rüdiger', 'Germany', 'Germany', 'player'),
  ('GER-06', 'Kai Havertz', 'Germany', 'Germany', 'player'),
  ('GER-07', 'Leroy Sané', 'Germany', 'Germany', 'player'),
  ('GER-08', 'Toni Kroos', 'Germany', 'Germany', 'player'),
  ('GER-09', 'Thomas Müller', 'Germany', 'Germany', 'player'),
  ('GER-10', 'Niclas Füllkrug', 'Germany', 'Germany', 'player'),
  ('GER-11', 'Ilkay Gündogan', 'Germany', 'Germany', 'player'),
  ('GER-12', 'David Raum', 'Germany', 'Germany', 'player'),
  ('GER-13', 'Nico Schlotterbeck', 'Germany', 'Germany', 'player') ON CONFLICT (number) DO NOTHING;

-- Spain
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('ESP-00', 'Spain Logo', 'Spain', 'Spain', 'logo'),
  ('ESP-B', 'Spain Badge', 'Spain', 'Spain', 'badge'),
  ('ESP-01', 'Pedri', 'Spain', 'Spain', 'player'),
  ('ESP-02', 'Gavi', 'Spain', 'Spain', 'player'),
  ('ESP-03', 'Rodri', 'Spain', 'Spain', 'player'),
  ('ESP-04', 'Álvaro Morata', 'Spain', 'Spain', 'player'),
  ('ESP-05', 'Unai Simón', 'Spain', 'Spain', 'player'),
  ('ESP-06', 'Aymeric Laporte', 'Spain', 'Spain', 'player'),
  ('ESP-07', 'Ferran Torres', 'Spain', 'Spain', 'player'),
  ('ESP-08', 'Dani Olmo', 'Spain', 'Spain', 'player'),
  ('ESP-09', 'Mikel Merino', 'Spain', 'Spain', 'player'),
  ('ESP-10', 'Alejandro Balde', 'Spain', 'Spain', 'player'),
  ('ESP-11', 'Nico Williams', 'Spain', 'Spain', 'player'),
  ('ESP-12', 'Lamine Yamal', 'Spain', 'Spain', 'player'),
  ('ESP-13', 'Marcos Llorente', 'Spain', 'Spain', 'player') ON CONFLICT (number) DO NOTHING;

-- England
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('ENG-00', 'England Logo', 'England', 'England', 'logo'),
  ('ENG-B', 'England Badge', 'England', 'England', 'badge'),
  ('ENG-01', 'Harry Kane', 'England', 'England', 'player'),
  ('ENG-02', 'Jude Bellingham', 'England', 'England', 'player'),
  ('ENG-03', 'Phil Foden', 'England', 'England', 'player'),
  ('ENG-04', 'Bukayo Saka', 'England', 'England', 'player'),
  ('ENG-05', 'Jordan Pickford', 'England', 'England', 'player'),
  ('ENG-06', 'John Stones', 'England', 'England', 'player'),
  ('ENG-07', 'Kyle Walker', 'England', 'England', 'player'),
  ('ENG-08', 'Declan Rice', 'England', 'England', 'player'),
  ('ENG-09', 'Marcus Rashford', 'England', 'England', 'player'),
  ('ENG-10', 'Jack Grealish', 'England', 'England', 'player'),
  ('ENG-11', 'Kieran Trippier', 'England', 'England', 'player'),
  ('ENG-12', 'Luke Shaw', 'England', 'England', 'player'),
  ('ENG-13', 'Conor Gallagher', 'England', 'England', 'player') ON CONFLICT (number) DO NOTHING;

-- Italy
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('ITA-00', 'Italy Logo', 'Italy', 'Italy', 'logo'),
  ('ITA-B', 'Italy Badge', 'Italy', 'Italy', 'badge'),
  ('ITA-01', 'Italy Captain', 'Italy', 'Italy', 'player'),
  ('ITA-02', 'Italy Goalkeeper', 'Italy', 'Italy', 'player'),
  ('ITA-03', 'Italy Defender 1', 'Italy', 'Italy', 'player'),
  ('ITA-04', 'Italy Defender 2', 'Italy', 'Italy', 'player'),
  ('ITA-05', 'Italy Defender 3', 'Italy', 'Italy', 'player'),
  ('ITA-06', 'Italy Defender 4', 'Italy', 'Italy', 'player'),
  ('ITA-07', 'Italy Midfielder 1', 'Italy', 'Italy', 'player'),
  ('ITA-08', 'Italy Midfielder 2', 'Italy', 'Italy', 'player'),
  ('ITA-09', 'Italy Midfielder 3', 'Italy', 'Italy', 'player'),
  ('ITA-10', 'Italy Midfielder 4', 'Italy', 'Italy', 'player'),
  ('ITA-11', 'Italy Forward 1', 'Italy', 'Italy', 'player'),
  ('ITA-12', 'Italy Player 12', 'Italy', 'Italy', 'player'),
  ('ITA-13', 'Italy Player 13', 'Italy', 'Italy', 'player') ON CONFLICT (number) DO NOTHING;

-- Portugal
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('POR-00', 'Portugal Logo', 'Portugal', 'Portugal', 'logo'),
  ('POR-B', 'Portugal Badge', 'Portugal', 'Portugal', 'badge'),
  ('POR-01', 'Portugal Captain', 'Portugal', 'Portugal', 'player'),
  ('POR-02', 'Portugal Goalkeeper', 'Portugal', 'Portugal', 'player'),
  ('POR-03', 'Portugal Defender 1', 'Portugal', 'Portugal', 'player'),
  ('POR-04', 'Portugal Defender 2', 'Portugal', 'Portugal', 'player'),
  ('POR-05', 'Portugal Defender 3', 'Portugal', 'Portugal', 'player'),
  ('POR-06', 'Portugal Defender 4', 'Portugal', 'Portugal', 'player'),
  ('POR-07', 'Portugal Midfielder 1', 'Portugal', 'Portugal', 'player'),
  ('POR-08', 'Portugal Midfielder 2', 'Portugal', 'Portugal', 'player'),
  ('POR-09', 'Portugal Midfielder 3', 'Portugal', 'Portugal', 'player'),
  ('POR-10', 'Portugal Midfielder 4', 'Portugal', 'Portugal', 'player'),
  ('POR-11', 'Portugal Forward 1', 'Portugal', 'Portugal', 'player'),
  ('POR-12', 'Portugal Player 12', 'Portugal', 'Portugal', 'player'),
  ('POR-13', 'Portugal Player 13', 'Portugal', 'Portugal', 'player') ON CONFLICT (number) DO NOTHING;

-- Netherlands
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('NED-00', 'Netherlands Logo', 'Netherlands', 'Netherlands', 'logo'),
  ('NED-B', 'Netherlands Badge', 'Netherlands', 'Netherlands', 'badge'),
  ('NED-01', 'Netherlands Captain', 'Netherlands', 'Netherlands', 'player'),
  ('NED-02', 'Netherlands Goalkeeper', 'Netherlands', 'Netherlands', 'player'),
  ('NED-03', 'Netherlands Defender 1', 'Netherlands', 'Netherlands', 'player'),
  ('NED-04', 'Netherlands Defender 2', 'Netherlands', 'Netherlands', 'player'),
  ('NED-05', 'Netherlands Defender 3', 'Netherlands', 'Netherlands', 'player'),
  ('NED-06', 'Netherlands Defender 4', 'Netherlands', 'Netherlands', 'player'),
  ('NED-07', 'Netherlands Midfielder 1', 'Netherlands', 'Netherlands', 'player'),
  ('NED-08', 'Netherlands Midfielder 2', 'Netherlands', 'Netherlands', 'player'),
  ('NED-09', 'Netherlands Midfielder 3', 'Netherlands', 'Netherlands', 'player'),
  ('NED-10', 'Netherlands Midfielder 4', 'Netherlands', 'Netherlands', 'player'),
  ('NED-11', 'Netherlands Forward 1', 'Netherlands', 'Netherlands', 'player'),
  ('NED-12', 'Netherlands Player 12', 'Netherlands', 'Netherlands', 'player'),
  ('NED-13', 'Netherlands Player 13', 'Netherlands', 'Netherlands', 'player') ON CONFLICT (number) DO NOTHING;

-- Belgium
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('BEL-00', 'Belgium Logo', 'Belgium', 'Belgium', 'logo'),
  ('BEL-B', 'Belgium Badge', 'Belgium', 'Belgium', 'badge'),
  ('BEL-01', 'Belgium Captain', 'Belgium', 'Belgium', 'player'),
  ('BEL-02', 'Belgium Goalkeeper', 'Belgium', 'Belgium', 'player'),
  ('BEL-03', 'Belgium Defender 1', 'Belgium', 'Belgium', 'player'),
  ('BEL-04', 'Belgium Defender 2', 'Belgium', 'Belgium', 'player'),
  ('BEL-05', 'Belgium Defender 3', 'Belgium', 'Belgium', 'player'),
  ('BEL-06', 'Belgium Defender 4', 'Belgium', 'Belgium', 'player'),
  ('BEL-07', 'Belgium Midfielder 1', 'Belgium', 'Belgium', 'player'),
  ('BEL-08', 'Belgium Midfielder 2', 'Belgium', 'Belgium', 'player'),
  ('BEL-09', 'Belgium Midfielder 3', 'Belgium', 'Belgium', 'player'),
  ('BEL-10', 'Belgium Midfielder 4', 'Belgium', 'Belgium', 'player'),
  ('BEL-11', 'Belgium Forward 1', 'Belgium', 'Belgium', 'player'),
  ('BEL-12', 'Belgium Player 12', 'Belgium', 'Belgium', 'player'),
  ('BEL-13', 'Belgium Player 13', 'Belgium', 'Belgium', 'player') ON CONFLICT (number) DO NOTHING;

-- Croatia
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('CRO-00', 'Croatia Logo', 'Croatia', 'Croatia', 'logo'),
  ('CRO-B', 'Croatia Badge', 'Croatia', 'Croatia', 'badge'),
  ('CRO-01', 'Croatia Captain', 'Croatia', 'Croatia', 'player'),
  ('CRO-02', 'Croatia Goalkeeper', 'Croatia', 'Croatia', 'player'),
  ('CRO-03', 'Croatia Defender 1', 'Croatia', 'Croatia', 'player'),
  ('CRO-04', 'Croatia Defender 2', 'Croatia', 'Croatia', 'player'),
  ('CRO-05', 'Croatia Defender 3', 'Croatia', 'Croatia', 'player'),
  ('CRO-06', 'Croatia Defender 4', 'Croatia', 'Croatia', 'player'),
  ('CRO-07', 'Croatia Midfielder 1', 'Croatia', 'Croatia', 'player'),
  ('CRO-08', 'Croatia Midfielder 2', 'Croatia', 'Croatia', 'player'),
  ('CRO-09', 'Croatia Midfielder 3', 'Croatia', 'Croatia', 'player'),
  ('CRO-10', 'Croatia Midfielder 4', 'Croatia', 'Croatia', 'player'),
  ('CRO-11', 'Croatia Forward 1', 'Croatia', 'Croatia', 'player'),
  ('CRO-12', 'Croatia Player 12', 'Croatia', 'Croatia', 'player'),
  ('CRO-13', 'Croatia Player 13', 'Croatia', 'Croatia', 'player') ON CONFLICT (number) DO NOTHING;

-- Uruguay
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('URU-00', 'Uruguay Logo', 'Uruguay', 'Uruguay', 'logo'),
  ('URU-B', 'Uruguay Badge', 'Uruguay', 'Uruguay', 'badge'),
  ('URU-01', 'Uruguay Captain', 'Uruguay', 'Uruguay', 'player'),
  ('URU-02', 'Uruguay Goalkeeper', 'Uruguay', 'Uruguay', 'player'),
  ('URU-03', 'Uruguay Defender 1', 'Uruguay', 'Uruguay', 'player'),
  ('URU-04', 'Uruguay Defender 2', 'Uruguay', 'Uruguay', 'player'),
  ('URU-05', 'Uruguay Defender 3', 'Uruguay', 'Uruguay', 'player'),
  ('URU-06', 'Uruguay Defender 4', 'Uruguay', 'Uruguay', 'player'),
  ('URU-07', 'Uruguay Midfielder 1', 'Uruguay', 'Uruguay', 'player'),
  ('URU-08', 'Uruguay Midfielder 2', 'Uruguay', 'Uruguay', 'player'),
  ('URU-09', 'Uruguay Midfielder 3', 'Uruguay', 'Uruguay', 'player'),
  ('URU-10', 'Uruguay Midfielder 4', 'Uruguay', 'Uruguay', 'player'),
  ('URU-11', 'Uruguay Forward 1', 'Uruguay', 'Uruguay', 'player'),
  ('URU-12', 'Uruguay Player 12', 'Uruguay', 'Uruguay', 'player'),
  ('URU-13', 'Uruguay Player 13', 'Uruguay', 'Uruguay', 'player') ON CONFLICT (number) DO NOTHING;

-- Mexico
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('MEX-00', 'Mexico Logo', 'Mexico', 'Mexico', 'logo'),
  ('MEX-B', 'Mexico Badge', 'Mexico', 'Mexico', 'badge'),
  ('MEX-01', 'Mexico Captain', 'Mexico', 'Mexico', 'player'),
  ('MEX-02', 'Mexico Goalkeeper', 'Mexico', 'Mexico', 'player'),
  ('MEX-03', 'Mexico Defender 1', 'Mexico', 'Mexico', 'player'),
  ('MEX-04', 'Mexico Defender 2', 'Mexico', 'Mexico', 'player'),
  ('MEX-05', 'Mexico Defender 3', 'Mexico', 'Mexico', 'player'),
  ('MEX-06', 'Mexico Defender 4', 'Mexico', 'Mexico', 'player'),
  ('MEX-07', 'Mexico Midfielder 1', 'Mexico', 'Mexico', 'player'),
  ('MEX-08', 'Mexico Midfielder 2', 'Mexico', 'Mexico', 'player'),
  ('MEX-09', 'Mexico Midfielder 3', 'Mexico', 'Mexico', 'player'),
  ('MEX-10', 'Mexico Midfielder 4', 'Mexico', 'Mexico', 'player'),
  ('MEX-11', 'Mexico Forward 1', 'Mexico', 'Mexico', 'player'),
  ('MEX-12', 'Mexico Player 12', 'Mexico', 'Mexico', 'player'),
  ('MEX-13', 'Mexico Player 13', 'Mexico', 'Mexico', 'player') ON CONFLICT (number) DO NOTHING;

-- USA
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('USA-00', 'USA Logo', 'USA', 'USA', 'logo'),
  ('USA-B', 'USA Badge', 'USA', 'USA', 'badge'),
  ('USA-01', 'USA Captain', 'USA', 'USA', 'player'),
  ('USA-02', 'USA Goalkeeper', 'USA', 'USA', 'player'),
  ('USA-03', 'USA Defender 1', 'USA', 'USA', 'player'),
  ('USA-04', 'USA Defender 2', 'USA', 'USA', 'player'),
  ('USA-05', 'USA Defender 3', 'USA', 'USA', 'player'),
  ('USA-06', 'USA Defender 4', 'USA', 'USA', 'player'),
  ('USA-07', 'USA Midfielder 1', 'USA', 'USA', 'player'),
  ('USA-08', 'USA Midfielder 2', 'USA', 'USA', 'player'),
  ('USA-09', 'USA Midfielder 3', 'USA', 'USA', 'player'),
  ('USA-10', 'USA Midfielder 4', 'USA', 'USA', 'player'),
  ('USA-11', 'USA Forward 1', 'USA', 'USA', 'player'),
  ('USA-12', 'USA Player 12', 'USA', 'USA', 'player'),
  ('USA-13', 'USA Player 13', 'USA', 'USA', 'player') ON CONFLICT (number) DO NOTHING;

-- Japan
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('JPN-00', 'Japan Logo', 'Japan', 'Japan', 'logo'),
  ('JPN-B', 'Japan Badge', 'Japan', 'Japan', 'badge'),
  ('JPN-01', 'Japan Captain', 'Japan', 'Japan', 'player'),
  ('JPN-02', 'Japan Goalkeeper', 'Japan', 'Japan', 'player'),
  ('JPN-03', 'Japan Defender 1', 'Japan', 'Japan', 'player'),
  ('JPN-04', 'Japan Defender 2', 'Japan', 'Japan', 'player'),
  ('JPN-05', 'Japan Defender 3', 'Japan', 'Japan', 'player'),
  ('JPN-06', 'Japan Defender 4', 'Japan', 'Japan', 'player'),
  ('JPN-07', 'Japan Midfielder 1', 'Japan', 'Japan', 'player'),
  ('JPN-08', 'Japan Midfielder 2', 'Japan', 'Japan', 'player'),
  ('JPN-09', 'Japan Midfielder 3', 'Japan', 'Japan', 'player'),
  ('JPN-10', 'Japan Midfielder 4', 'Japan', 'Japan', 'player'),
  ('JPN-11', 'Japan Forward 1', 'Japan', 'Japan', 'player'),
  ('JPN-12', 'Japan Player 12', 'Japan', 'Japan', 'player'),
  ('JPN-13', 'Japan Player 13', 'Japan', 'Japan', 'player') ON CONFLICT (number) DO NOTHING;

-- South Korea
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('KOR-00', 'South Korea Logo', 'South Korea', 'South Korea', 'logo'),
  ('KOR-B', 'South Korea Badge', 'South Korea', 'South Korea', 'badge'),
  ('KOR-01', 'South Korea Captain', 'South Korea', 'South Korea', 'player'),
  ('KOR-02', 'South Korea Goalkeeper', 'South Korea', 'South Korea', 'player'),
  ('KOR-03', 'South Korea Defender 1', 'South Korea', 'South Korea', 'player'),
  ('KOR-04', 'South Korea Defender 2', 'South Korea', 'South Korea', 'player'),
  ('KOR-05', 'South Korea Defender 3', 'South Korea', 'South Korea', 'player'),
  ('KOR-06', 'South Korea Defender 4', 'South Korea', 'South Korea', 'player'),
  ('KOR-07', 'South Korea Midfielder 1', 'South Korea', 'South Korea', 'player'),
  ('KOR-08', 'South Korea Midfielder 2', 'South Korea', 'South Korea', 'player'),
  ('KOR-09', 'South Korea Midfielder 3', 'South Korea', 'South Korea', 'player'),
  ('KOR-10', 'South Korea Midfielder 4', 'South Korea', 'South Korea', 'player'),
  ('KOR-11', 'South Korea Forward 1', 'South Korea', 'South Korea', 'player'),
  ('KOR-12', 'South Korea Player 12', 'South Korea', 'South Korea', 'player'),
  ('KOR-13', 'South Korea Player 13', 'South Korea', 'South Korea', 'player') ON CONFLICT (number) DO NOTHING;

-- Morocco
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('MAR-00', 'Morocco Logo', 'Morocco', 'Morocco', 'logo'),
  ('MAR-B', 'Morocco Badge', 'Morocco', 'Morocco', 'badge'),
  ('MAR-01', 'Morocco Captain', 'Morocco', 'Morocco', 'player'),
  ('MAR-02', 'Morocco Goalkeeper', 'Morocco', 'Morocco', 'player'),
  ('MAR-03', 'Morocco Defender 1', 'Morocco', 'Morocco', 'player'),
  ('MAR-04', 'Morocco Defender 2', 'Morocco', 'Morocco', 'player'),
  ('MAR-05', 'Morocco Defender 3', 'Morocco', 'Morocco', 'player'),
  ('MAR-06', 'Morocco Defender 4', 'Morocco', 'Morocco', 'player'),
  ('MAR-07', 'Morocco Midfielder 1', 'Morocco', 'Morocco', 'player'),
  ('MAR-08', 'Morocco Midfielder 2', 'Morocco', 'Morocco', 'player'),
  ('MAR-09', 'Morocco Midfielder 3', 'Morocco', 'Morocco', 'player'),
  ('MAR-10', 'Morocco Midfielder 4', 'Morocco', 'Morocco', 'player'),
  ('MAR-11', 'Morocco Forward 1', 'Morocco', 'Morocco', 'player'),
  ('MAR-12', 'Morocco Player 12', 'Morocco', 'Morocco', 'player'),
  ('MAR-13', 'Morocco Player 13', 'Morocco', 'Morocco', 'player') ON CONFLICT (number) DO NOTHING;

-- Senegal
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('SEN-00', 'Senegal Logo', 'Senegal', 'Senegal', 'logo'),
  ('SEN-B', 'Senegal Badge', 'Senegal', 'Senegal', 'badge'),
  ('SEN-01', 'Senegal Captain', 'Senegal', 'Senegal', 'player'),
  ('SEN-02', 'Senegal Goalkeeper', 'Senegal', 'Senegal', 'player'),
  ('SEN-03', 'Senegal Defender 1', 'Senegal', 'Senegal', 'player'),
  ('SEN-04', 'Senegal Defender 2', 'Senegal', 'Senegal', 'player'),
  ('SEN-05', 'Senegal Defender 3', 'Senegal', 'Senegal', 'player'),
  ('SEN-06', 'Senegal Defender 4', 'Senegal', 'Senegal', 'player'),
  ('SEN-07', 'Senegal Midfielder 1', 'Senegal', 'Senegal', 'player'),
  ('SEN-08', 'Senegal Midfielder 2', 'Senegal', 'Senegal', 'player'),
  ('SEN-09', 'Senegal Midfielder 3', 'Senegal', 'Senegal', 'player'),
  ('SEN-10', 'Senegal Midfielder 4', 'Senegal', 'Senegal', 'player'),
  ('SEN-11', 'Senegal Forward 1', 'Senegal', 'Senegal', 'player'),
  ('SEN-12', 'Senegal Player 12', 'Senegal', 'Senegal', 'player'),
  ('SEN-13', 'Senegal Player 13', 'Senegal', 'Senegal', 'player') ON CONFLICT (number) DO NOTHING;

-- Australia
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('AUS-00', 'Australia Logo', 'Australia', 'Australia', 'logo'),
  ('AUS-B', 'Australia Badge', 'Australia', 'Australia', 'badge'),
  ('AUS-01', 'Australia Captain', 'Australia', 'Australia', 'player'),
  ('AUS-02', 'Australia Goalkeeper', 'Australia', 'Australia', 'player'),
  ('AUS-03', 'Australia Defender 1', 'Australia', 'Australia', 'player'),
  ('AUS-04', 'Australia Defender 2', 'Australia', 'Australia', 'player'),
  ('AUS-05', 'Australia Defender 3', 'Australia', 'Australia', 'player'),
  ('AUS-06', 'Australia Defender 4', 'Australia', 'Australia', 'player'),
  ('AUS-07', 'Australia Midfielder 1', 'Australia', 'Australia', 'player'),
  ('AUS-08', 'Australia Midfielder 2', 'Australia', 'Australia', 'player'),
  ('AUS-09', 'Australia Midfielder 3', 'Australia', 'Australia', 'player'),
  ('AUS-10', 'Australia Midfielder 4', 'Australia', 'Australia', 'player'),
  ('AUS-11', 'Australia Forward 1', 'Australia', 'Australia', 'player'),
  ('AUS-12', 'Australia Player 12', 'Australia', 'Australia', 'player'),
  ('AUS-13', 'Australia Player 13', 'Australia', 'Australia', 'player') ON CONFLICT (number) DO NOTHING;

-- Denmark
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('DEN-00', 'Denmark Logo', 'Denmark', 'Denmark', 'logo'),
  ('DEN-B', 'Denmark Badge', 'Denmark', 'Denmark', 'badge'),
  ('DEN-01', 'Denmark Captain', 'Denmark', 'Denmark', 'player'),
  ('DEN-02', 'Denmark Goalkeeper', 'Denmark', 'Denmark', 'player'),
  ('DEN-03', 'Denmark Defender 1', 'Denmark', 'Denmark', 'player'),
  ('DEN-04', 'Denmark Defender 2', 'Denmark', 'Denmark', 'player'),
  ('DEN-05', 'Denmark Defender 3', 'Denmark', 'Denmark', 'player'),
  ('DEN-06', 'Denmark Defender 4', 'Denmark', 'Denmark', 'player'),
  ('DEN-07', 'Denmark Midfielder 1', 'Denmark', 'Denmark', 'player'),
  ('DEN-08', 'Denmark Midfielder 2', 'Denmark', 'Denmark', 'player'),
  ('DEN-09', 'Denmark Midfielder 3', 'Denmark', 'Denmark', 'player'),
  ('DEN-10', 'Denmark Midfielder 4', 'Denmark', 'Denmark', 'player'),
  ('DEN-11', 'Denmark Forward 1', 'Denmark', 'Denmark', 'player'),
  ('DEN-12', 'Denmark Player 12', 'Denmark', 'Denmark', 'player'),
  ('DEN-13', 'Denmark Player 13', 'Denmark', 'Denmark', 'player') ON CONFLICT (number) DO NOTHING;

-- Switzerland
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('SUI-00', 'Switzerland Logo', 'Switzerland', 'Switzerland', 'logo'),
  ('SUI-B', 'Switzerland Badge', 'Switzerland', 'Switzerland', 'badge'),
  ('SUI-01', 'Switzerland Captain', 'Switzerland', 'Switzerland', 'player'),
  ('SUI-02', 'Switzerland Goalkeeper', 'Switzerland', 'Switzerland', 'player'),
  ('SUI-03', 'Switzerland Defender 1', 'Switzerland', 'Switzerland', 'player'),
  ('SUI-04', 'Switzerland Defender 2', 'Switzerland', 'Switzerland', 'player'),
  ('SUI-05', 'Switzerland Defender 3', 'Switzerland', 'Switzerland', 'player'),
  ('SUI-06', 'Switzerland Defender 4', 'Switzerland', 'Switzerland', 'player'),
  ('SUI-07', 'Switzerland Midfielder 1', 'Switzerland', 'Switzerland', 'player'),
  ('SUI-08', 'Switzerland Midfielder 2', 'Switzerland', 'Switzerland', 'player'),
  ('SUI-09', 'Switzerland Midfielder 3', 'Switzerland', 'Switzerland', 'player'),
  ('SUI-10', 'Switzerland Midfielder 4', 'Switzerland', 'Switzerland', 'player'),
  ('SUI-11', 'Switzerland Forward 1', 'Switzerland', 'Switzerland', 'player'),
  ('SUI-12', 'Switzerland Player 12', 'Switzerland', 'Switzerland', 'player'),
  ('SUI-13', 'Switzerland Player 13', 'Switzerland', 'Switzerland', 'player') ON CONFLICT (number) DO NOTHING;

-- Poland
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('POL-00', 'Poland Logo', 'Poland', 'Poland', 'logo'),
  ('POL-B', 'Poland Badge', 'Poland', 'Poland', 'badge'),
  ('POL-01', 'Poland Captain', 'Poland', 'Poland', 'player'),
  ('POL-02', 'Poland Goalkeeper', 'Poland', 'Poland', 'player'),
  ('POL-03', 'Poland Defender 1', 'Poland', 'Poland', 'player'),
  ('POL-04', 'Poland Defender 2', 'Poland', 'Poland', 'player'),
  ('POL-05', 'Poland Defender 3', 'Poland', 'Poland', 'player'),
  ('POL-06', 'Poland Defender 4', 'Poland', 'Poland', 'player'),
  ('POL-07', 'Poland Midfielder 1', 'Poland', 'Poland', 'player'),
  ('POL-08', 'Poland Midfielder 2', 'Poland', 'Poland', 'player'),
  ('POL-09', 'Poland Midfielder 3', 'Poland', 'Poland', 'player'),
  ('POL-10', 'Poland Midfielder 4', 'Poland', 'Poland', 'player'),
  ('POL-11', 'Poland Forward 1', 'Poland', 'Poland', 'player'),
  ('POL-12', 'Poland Player 12', 'Poland', 'Poland', 'player'),
  ('POL-13', 'Poland Player 13', 'Poland', 'Poland', 'player') ON CONFLICT (number) DO NOTHING;

-- Ecuador
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('ECU-00', 'Ecuador Logo', 'Ecuador', 'Ecuador', 'logo'),
  ('ECU-B', 'Ecuador Badge', 'Ecuador', 'Ecuador', 'badge'),
  ('ECU-01', 'Ecuador Captain', 'Ecuador', 'Ecuador', 'player'),
  ('ECU-02', 'Ecuador Goalkeeper', 'Ecuador', 'Ecuador', 'player'),
  ('ECU-03', 'Ecuador Defender 1', 'Ecuador', 'Ecuador', 'player'),
  ('ECU-04', 'Ecuador Defender 2', 'Ecuador', 'Ecuador', 'player'),
  ('ECU-05', 'Ecuador Defender 3', 'Ecuador', 'Ecuador', 'player'),
  ('ECU-06', 'Ecuador Defender 4', 'Ecuador', 'Ecuador', 'player'),
  ('ECU-07', 'Ecuador Midfielder 1', 'Ecuador', 'Ecuador', 'player'),
  ('ECU-08', 'Ecuador Midfielder 2', 'Ecuador', 'Ecuador', 'player'),
  ('ECU-09', 'Ecuador Midfielder 3', 'Ecuador', 'Ecuador', 'player'),
  ('ECU-10', 'Ecuador Midfielder 4', 'Ecuador', 'Ecuador', 'player'),
  ('ECU-11', 'Ecuador Forward 1', 'Ecuador', 'Ecuador', 'player'),
  ('ECU-12', 'Ecuador Player 12', 'Ecuador', 'Ecuador', 'player'),
  ('ECU-13', 'Ecuador Player 13', 'Ecuador', 'Ecuador', 'player') ON CONFLICT (number) DO NOTHING;

-- Cameroon
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('CMR-00', 'Cameroon Logo', 'Cameroon', 'Cameroon', 'logo'),
  ('CMR-B', 'Cameroon Badge', 'Cameroon', 'Cameroon', 'badge'),
  ('CMR-01', 'Cameroon Captain', 'Cameroon', 'Cameroon', 'player'),
  ('CMR-02', 'Cameroon Goalkeeper', 'Cameroon', 'Cameroon', 'player'),
  ('CMR-03', 'Cameroon Defender 1', 'Cameroon', 'Cameroon', 'player'),
  ('CMR-04', 'Cameroon Defender 2', 'Cameroon', 'Cameroon', 'player'),
  ('CMR-05', 'Cameroon Defender 3', 'Cameroon', 'Cameroon', 'player'),
  ('CMR-06', 'Cameroon Defender 4', 'Cameroon', 'Cameroon', 'player'),
  ('CMR-07', 'Cameroon Midfielder 1', 'Cameroon', 'Cameroon', 'player'),
  ('CMR-08', 'Cameroon Midfielder 2', 'Cameroon', 'Cameroon', 'player'),
  ('CMR-09', 'Cameroon Midfielder 3', 'Cameroon', 'Cameroon', 'player'),
  ('CMR-10', 'Cameroon Midfielder 4', 'Cameroon', 'Cameroon', 'player'),
  ('CMR-11', 'Cameroon Forward 1', 'Cameroon', 'Cameroon', 'player'),
  ('CMR-12', 'Cameroon Player 12', 'Cameroon', 'Cameroon', 'player'),
  ('CMR-13', 'Cameroon Player 13', 'Cameroon', 'Cameroon', 'player') ON CONFLICT (number) DO NOTHING;

-- Canada
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('CAN-00', 'Canada Logo', 'Canada', 'Canada', 'logo'),
  ('CAN-B', 'Canada Badge', 'Canada', 'Canada', 'badge'),
  ('CAN-01', 'Canada Captain', 'Canada', 'Canada', 'player'),
  ('CAN-02', 'Canada Goalkeeper', 'Canada', 'Canada', 'player'),
  ('CAN-03', 'Canada Defender 1', 'Canada', 'Canada', 'player'),
  ('CAN-04', 'Canada Defender 2', 'Canada', 'Canada', 'player'),
  ('CAN-05', 'Canada Defender 3', 'Canada', 'Canada', 'player'),
  ('CAN-06', 'Canada Defender 4', 'Canada', 'Canada', 'player'),
  ('CAN-07', 'Canada Midfielder 1', 'Canada', 'Canada', 'player'),
  ('CAN-08', 'Canada Midfielder 2', 'Canada', 'Canada', 'player'),
  ('CAN-09', 'Canada Midfielder 3', 'Canada', 'Canada', 'player'),
  ('CAN-10', 'Canada Midfielder 4', 'Canada', 'Canada', 'player'),
  ('CAN-11', 'Canada Forward 1', 'Canada', 'Canada', 'player'),
  ('CAN-12', 'Canada Player 12', 'Canada', 'Canada', 'player'),
  ('CAN-13', 'Canada Player 13', 'Canada', 'Canada', 'player') ON CONFLICT (number) DO NOTHING;

-- Ghana
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('GHA-00', 'Ghana Logo', 'Ghana', 'Ghana', 'logo'),
  ('GHA-B', 'Ghana Badge', 'Ghana', 'Ghana', 'badge'),
  ('GHA-01', 'Ghana Captain', 'Ghana', 'Ghana', 'player'),
  ('GHA-02', 'Ghana Goalkeeper', 'Ghana', 'Ghana', 'player'),
  ('GHA-03', 'Ghana Defender 1', 'Ghana', 'Ghana', 'player'),
  ('GHA-04', 'Ghana Defender 2', 'Ghana', 'Ghana', 'player'),
  ('GHA-05', 'Ghana Defender 3', 'Ghana', 'Ghana', 'player'),
  ('GHA-06', 'Ghana Defender 4', 'Ghana', 'Ghana', 'player'),
  ('GHA-07', 'Ghana Midfielder 1', 'Ghana', 'Ghana', 'player'),
  ('GHA-08', 'Ghana Midfielder 2', 'Ghana', 'Ghana', 'player'),
  ('GHA-09', 'Ghana Midfielder 3', 'Ghana', 'Ghana', 'player'),
  ('GHA-10', 'Ghana Midfielder 4', 'Ghana', 'Ghana', 'player'),
  ('GHA-11', 'Ghana Forward 1', 'Ghana', 'Ghana', 'player'),
  ('GHA-12', 'Ghana Player 12', 'Ghana', 'Ghana', 'player'),
  ('GHA-13', 'Ghana Player 13', 'Ghana', 'Ghana', 'player') ON CONFLICT (number) DO NOTHING;

-- Qatar
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('QAT-00', 'Qatar Logo', 'Qatar', 'Qatar', 'logo'),
  ('QAT-B', 'Qatar Badge', 'Qatar', 'Qatar', 'badge'),
  ('QAT-01', 'Qatar Captain', 'Qatar', 'Qatar', 'player'),
  ('QAT-02', 'Qatar Goalkeeper', 'Qatar', 'Qatar', 'player'),
  ('QAT-03', 'Qatar Defender 1', 'Qatar', 'Qatar', 'player'),
  ('QAT-04', 'Qatar Defender 2', 'Qatar', 'Qatar', 'player'),
  ('QAT-05', 'Qatar Defender 3', 'Qatar', 'Qatar', 'player'),
  ('QAT-06', 'Qatar Defender 4', 'Qatar', 'Qatar', 'player'),
  ('QAT-07', 'Qatar Midfielder 1', 'Qatar', 'Qatar', 'player'),
  ('QAT-08', 'Qatar Midfielder 2', 'Qatar', 'Qatar', 'player'),
  ('QAT-09', 'Qatar Midfielder 3', 'Qatar', 'Qatar', 'player'),
  ('QAT-10', 'Qatar Midfielder 4', 'Qatar', 'Qatar', 'player'),
  ('QAT-11', 'Qatar Forward 1', 'Qatar', 'Qatar', 'player'),
  ('QAT-12', 'Qatar Player 12', 'Qatar', 'Qatar', 'player'),
  ('QAT-13', 'Qatar Player 13', 'Qatar', 'Qatar', 'player') ON CONFLICT (number) DO NOTHING;

-- Serbia
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('SRB-00', 'Serbia Logo', 'Serbia', 'Serbia', 'logo'),
  ('SRB-B', 'Serbia Badge', 'Serbia', 'Serbia', 'badge'),
  ('SRB-01', 'Serbia Captain', 'Serbia', 'Serbia', 'player'),
  ('SRB-02', 'Serbia Goalkeeper', 'Serbia', 'Serbia', 'player'),
  ('SRB-03', 'Serbia Defender 1', 'Serbia', 'Serbia', 'player'),
  ('SRB-04', 'Serbia Defender 2', 'Serbia', 'Serbia', 'player'),
  ('SRB-05', 'Serbia Defender 3', 'Serbia', 'Serbia', 'player'),
  ('SRB-06', 'Serbia Defender 4', 'Serbia', 'Serbia', 'player'),
  ('SRB-07', 'Serbia Midfielder 1', 'Serbia', 'Serbia', 'player'),
  ('SRB-08', 'Serbia Midfielder 2', 'Serbia', 'Serbia', 'player'),
  ('SRB-09', 'Serbia Midfielder 3', 'Serbia', 'Serbia', 'player'),
  ('SRB-10', 'Serbia Midfielder 4', 'Serbia', 'Serbia', 'player'),
  ('SRB-11', 'Serbia Forward 1', 'Serbia', 'Serbia', 'player'),
  ('SRB-12', 'Serbia Player 12', 'Serbia', 'Serbia', 'player'),
  ('SRB-13', 'Serbia Player 13', 'Serbia', 'Serbia', 'player') ON CONFLICT (number) DO NOTHING;

-- Tunisia
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('TUN-00', 'Tunisia Logo', 'Tunisia', 'Tunisia', 'logo'),
  ('TUN-B', 'Tunisia Badge', 'Tunisia', 'Tunisia', 'badge'),
  ('TUN-01', 'Tunisia Captain', 'Tunisia', 'Tunisia', 'player'),
  ('TUN-02', 'Tunisia Goalkeeper', 'Tunisia', 'Tunisia', 'player'),
  ('TUN-03', 'Tunisia Defender 1', 'Tunisia', 'Tunisia', 'player'),
  ('TUN-04', 'Tunisia Defender 2', 'Tunisia', 'Tunisia', 'player'),
  ('TUN-05', 'Tunisia Defender 3', 'Tunisia', 'Tunisia', 'player'),
  ('TUN-06', 'Tunisia Defender 4', 'Tunisia', 'Tunisia', 'player'),
  ('TUN-07', 'Tunisia Midfielder 1', 'Tunisia', 'Tunisia', 'player'),
  ('TUN-08', 'Tunisia Midfielder 2', 'Tunisia', 'Tunisia', 'player'),
  ('TUN-09', 'Tunisia Midfielder 3', 'Tunisia', 'Tunisia', 'player'),
  ('TUN-10', 'Tunisia Midfielder 4', 'Tunisia', 'Tunisia', 'player'),
  ('TUN-11', 'Tunisia Forward 1', 'Tunisia', 'Tunisia', 'player'),
  ('TUN-12', 'Tunisia Player 12', 'Tunisia', 'Tunisia', 'player'),
  ('TUN-13', 'Tunisia Player 13', 'Tunisia', 'Tunisia', 'player') ON CONFLICT (number) DO NOTHING;

-- Iran
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('IRN-00', 'Iran Logo', 'Iran', 'Iran', 'logo'),
  ('IRN-B', 'Iran Badge', 'Iran', 'Iran', 'badge'),
  ('IRN-01', 'Iran Captain', 'Iran', 'Iran', 'player'),
  ('IRN-02', 'Iran Goalkeeper', 'Iran', 'Iran', 'player'),
  ('IRN-03', 'Iran Defender 1', 'Iran', 'Iran', 'player'),
  ('IRN-04', 'Iran Defender 2', 'Iran', 'Iran', 'player'),
  ('IRN-05', 'Iran Defender 3', 'Iran', 'Iran', 'player'),
  ('IRN-06', 'Iran Defender 4', 'Iran', 'Iran', 'player'),
  ('IRN-07', 'Iran Midfielder 1', 'Iran', 'Iran', 'player'),
  ('IRN-08', 'Iran Midfielder 2', 'Iran', 'Iran', 'player'),
  ('IRN-09', 'Iran Midfielder 3', 'Iran', 'Iran', 'player'),
  ('IRN-10', 'Iran Midfielder 4', 'Iran', 'Iran', 'player'),
  ('IRN-11', 'Iran Forward 1', 'Iran', 'Iran', 'player'),
  ('IRN-12', 'Iran Player 12', 'Iran', 'Iran', 'player'),
  ('IRN-13', 'Iran Player 13', 'Iran', 'Iran', 'player') ON CONFLICT (number) DO NOTHING;

-- Saudi Arabia
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('KSA-00', 'Saudi Arabia Logo', 'Saudi Arabia', 'Saudi Arabia', 'logo'),
  ('KSA-B', 'Saudi Arabia Badge', 'Saudi Arabia', 'Saudi Arabia', 'badge'),
  ('KSA-01', 'Saudi Arabia Captain', 'Saudi Arabia', 'Saudi Arabia', 'player'),
  ('KSA-02', 'Saudi Arabia Goalkeeper', 'Saudi Arabia', 'Saudi Arabia', 'player'),
  ('KSA-03', 'Saudi Arabia Defender 1', 'Saudi Arabia', 'Saudi Arabia', 'player'),
  ('KSA-04', 'Saudi Arabia Defender 2', 'Saudi Arabia', 'Saudi Arabia', 'player'),
  ('KSA-05', 'Saudi Arabia Defender 3', 'Saudi Arabia', 'Saudi Arabia', 'player'),
  ('KSA-06', 'Saudi Arabia Defender 4', 'Saudi Arabia', 'Saudi Arabia', 'player'),
  ('KSA-07', 'Saudi Arabia Midfielder 1', 'Saudi Arabia', 'Saudi Arabia', 'player'),
  ('KSA-08', 'Saudi Arabia Midfielder 2', 'Saudi Arabia', 'Saudi Arabia', 'player'),
  ('KSA-09', 'Saudi Arabia Midfielder 3', 'Saudi Arabia', 'Saudi Arabia', 'player'),
  ('KSA-10', 'Saudi Arabia Midfielder 4', 'Saudi Arabia', 'Saudi Arabia', 'player'),
  ('KSA-11', 'Saudi Arabia Forward 1', 'Saudi Arabia', 'Saudi Arabia', 'player'),
  ('KSA-12', 'Saudi Arabia Player 12', 'Saudi Arabia', 'Saudi Arabia', 'player'),
  ('KSA-13', 'Saudi Arabia Player 13', 'Saudi Arabia', 'Saudi Arabia', 'player') ON CONFLICT (number) DO NOTHING;

-- Wales
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('WAL-00', 'Wales Logo', 'Wales', 'Wales', 'logo'),
  ('WAL-B', 'Wales Badge', 'Wales', 'Wales', 'badge'),
  ('WAL-01', 'Wales Captain', 'Wales', 'Wales', 'player'),
  ('WAL-02', 'Wales Goalkeeper', 'Wales', 'Wales', 'player'),
  ('WAL-03', 'Wales Defender 1', 'Wales', 'Wales', 'player'),
  ('WAL-04', 'Wales Defender 2', 'Wales', 'Wales', 'player'),
  ('WAL-05', 'Wales Defender 3', 'Wales', 'Wales', 'player'),
  ('WAL-06', 'Wales Defender 4', 'Wales', 'Wales', 'player'),
  ('WAL-07', 'Wales Midfielder 1', 'Wales', 'Wales', 'player'),
  ('WAL-08', 'Wales Midfielder 2', 'Wales', 'Wales', 'player'),
  ('WAL-09', 'Wales Midfielder 3', 'Wales', 'Wales', 'player'),
  ('WAL-10', 'Wales Midfielder 4', 'Wales', 'Wales', 'player'),
  ('WAL-11', 'Wales Forward 1', 'Wales', 'Wales', 'player'),
  ('WAL-12', 'Wales Player 12', 'Wales', 'Wales', 'player'),
  ('WAL-13', 'Wales Player 13', 'Wales', 'Wales', 'player') ON CONFLICT (number) DO NOTHING;

-- SPECIAL STICKERS
INSERT INTO sticker_catalog (number, player_name, team, section, sticker_type) VALUES
  ('SP-01', 'FIFA World Cup Trophy', 'FIFA', 'SPECIAL', 'special'),
  ('SP-02', 'USA Stadium - MetLife', 'FIFA', 'SPECIAL', 'special'),
  ('SP-03', 'USA Stadium - Rose Bowl', 'FIFA', 'SPECIAL', 'special'),
  ('SP-04', 'USA Stadium - SoFi', 'FIFA', 'SPECIAL', 'special'),
  ('SP-05', 'Mexico Stadium - Azteca', 'FIFA', 'SPECIAL', 'special'),
  ('SP-06', 'Mexico Stadium - Guadalajara', 'FIFA', 'SPECIAL', 'special'),
  ('SP-07', 'Canada Stadium - Toronto', 'FIFA', 'SPECIAL', 'special'),
  ('SP-08', 'Canada Stadium - Vancouver', 'FIFA', 'SPECIAL', 'special'),
  ('SP-09', 'Opening Match', 'FIFA', 'SPECIAL', 'special'),
  ('SP-10', 'Final Match', 'FIFA', 'SPECIAL', 'special'),
  ('SP-11', 'Golden Boot', 'FIFA', 'SPECIAL', 'special'),
  ('SP-12', 'Golden Glove', 'FIFA', 'SPECIAL', 'special'),
  ('SP-13', 'Golden Ball', 'FIFA', 'SPECIAL', 'special'),
  ('SP-14', 'Fair Play', 'FIFA', 'SPECIAL', 'special'),
  ('SP-15', 'Best Young Player', 'FIFA', 'SPECIAL', 'special'),
  ('SP-16', 'Team of the Tournament', 'FIFA', 'SPECIAL', 'special'),
  ('SP-17', 'WC 2026 Logo', 'FIFA', 'SPECIAL', 'special'),
  ('SP-18', 'Host Nations', 'FIFA', 'SPECIAL', 'special'),
  ('SP-19', 'FIFA Emblem', 'FIFA', 'SPECIAL', 'special'),
  ('SP-20', 'WC History', 'FIFA', 'SPECIAL', 'special') ON CONFLICT (number) DO NOTHING;
