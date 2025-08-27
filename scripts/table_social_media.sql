-- Create social_media table
CREATE TABLE IF NOT EXISTS social_media (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description VARCHAR(255),
  type_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON
UPDATE
	CURRENT_TIMESTAMP,
	CONSTRAINT fk_social_media_type FOREIGN KEY (type_id) REFERENCES social_media_type(id) ON
	DELETE
		CASCADE
);

-- Poblar redes sociales con tipo
INSERT INTO social_media (name, description, type_id)
VALUES
  ('Spotify', 'Servicio de streaming de música.',1),
  ('Apple Music', 'Servicio de música por suscripción de Apple.', 1),
  ('YouTube Music', 'Servicio de streaming musical de YouTube.', 1),
  ('SoundCloud','Plataforma para compartir y descubrir música.',1),
  ('Deezer','Servicio de música por streaming con amplio catálogo.',1),
  ('Tidal','Plataforma de música en alta fidelidad.',1),
  ('Amazon Music','Servicio de streaming de música de Amazon.',1),
  ('Bandcamp','Plataforma para apoyar a artistas y comprar música.',1),
  ('Pandora','Servicio de radio por internet y recomendaciones musicales.',1),
  ('YouTube','Plataforma de video.',2),
  ('Facebook','Red social.',3),
  ('Instagram','Red social.',3),
  ('TikTok','Red social de videos cortos.',2),
  ('Twitter / X','Red social de microblogging.',3);