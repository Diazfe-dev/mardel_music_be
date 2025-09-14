-- Seed: Redes sociales disponibles
-- Este archivo contiene las principales plataformas de redes sociales

-- Limpiar datos existentes
DELETE FROM social_media_profile WHERE social_media_id IN (SELECT id FROM social_media);
DELETE FROM social_media;

-- Insertar redes sociales con sus tipos
INSERT INTO social_media (name, description, type_id) VALUES
-- Plataformas de música (type_id = 1)
('Spotify', 'Servicio de streaming de música.', 1),
('Apple Music', 'Servicio de música por suscripción de Apple.', 1),
('YouTube Music', 'Servicio de streaming musical de YouTube.', 1),
('SoundCloud', 'Plataforma para compartir y descubrir música.', 1),
('Deezer', 'Servicio de música por streaming con amplio catálogo.', 1),
('Tidal', 'Plataforma de música en alta fidelidad.', 1),
('Amazon Music', 'Servicio de streaming de música de Amazon.', 1),
('Bandcamp', 'Plataforma para apoyar a artistas y comprar música.', 1),
('Pandora', 'Servicio de radio por internet y recomendaciones musicales.', 1),

-- Plataformas de video (type_id = 2)
('YouTube', 'Plataforma de video.', 2),
('TikTok', 'Red social de videos cortos.', 2),

-- Redes sociales generales (type_id = 3)
('Facebook', 'Red social.', 3),
('Instagram', 'Red social de fotos y videos.', 3),
('Twitter / X', 'Red social de microblogging.', 3);
