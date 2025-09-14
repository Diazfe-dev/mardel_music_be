-- Seed musical genres
-- Clear existing data
DELETE FROM musical_genres;

-- Insert musical genres
INSERT INTO musical_genres (name, description, is_active) VALUES
('House', 'Género de música electrónica caracterizado por un ritmo repetitivo de cuatro por cuatro.', TRUE),
('Progressive House', 'Subgénero del house con estructuras de canciones más largas y progresiones armónicas complejas.', TRUE),
('Melodic House', 'Estilo de house music que enfatiza las melodías emotivas y atmósferas envolventes.', TRUE),
('Techno', 'Género de música electrónica de baile que se originó en Detroit, caracterizado por ritmos repetitivos.', TRUE),
('Deep House', 'Subgénero del house con influencias de jazz, funk y soul, caracterizado por ritmos más profundos.', TRUE),
('Tech House', 'Fusión entre house y techno, combinando la groove del house con elementos del techno.', TRUE),
('Trance', 'Género de música electrónica caracterizado por tempos de 125-150 BPM y melodías repetitivas.', TRUE),
('Progressive Trance', 'Subgénero del trance con estructuras de canciones más largas y desarrollos graduales.', TRUE),
('Uplifting Trance', 'Estilo de trance caracterizado por melodías eufóricas y drops energéticos.', TRUE),
('Psytrance', 'Subgénero del trance psicodélico con ritmos rápidos y elementos surrealistas.', TRUE),
('Ambient', 'Género musical que enfatiza el tono y la atmósfera sobre el ritmo y la estructura tradicional.', TRUE),
('Downtempo', 'Género de música electrónica relajada con tempos más lentos.', TRUE),
('Drum and Bass', 'Género de música electrónica caracterizado por ritmos de batería rápidos y líneas de bajo prominentes.', TRUE),
('Dubstep', 'Género de música electrónica que se originó en el sur de Londres, caracterizado por ritmos sincopados.', TRUE),
('Future Bass', 'Género de música electrónica caracterizado por acordes modulados y drops melódicos.', TRUE),
('Trap', 'Subgénero del hip hop caracterizado por ritmos de 808, hi-hats rápidos y melodías oscuras.', TRUE),
('Hardstyle', 'Género de música electrónica de baile caracterizado por ritmos duros y melodías eufóricas.', TRUE),
('Hardcore', 'Género de música electrónica extremadamente rápida, típicamente por encima de 160 BPM.', TRUE),
('Breakbeat', 'Género de música electrónica que utiliza breakbeats en lugar de ritmos de cuatro por cuatro.', TRUE),
('Garage', 'Género de música electrónica que se originó en Nueva York, caracterizado por ritmos sincopados.', TRUE);
