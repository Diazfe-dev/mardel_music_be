-- Seed: Tipos de redes sociales
-- Este archivo contiene los tipos básicos de plataformas

-- Limpiar datos existentes
DELETE FROM social_media WHERE type_id IN (SELECT id FROM social_media_type);
DELETE FROM social_media_type;

-- Insertar tipos de redes sociales
INSERT INTO social_media_type (name, description) VALUES
('music', 'Plataformas de música en streaming'),
('video', 'Plataformas de video'),
('social', 'Redes sociales generales');
