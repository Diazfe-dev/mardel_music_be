-- Drop social_media_type table if exists;
DROP TABLE IF EXISTS social_media_type;

-- Create social_media_type table
CREATE TABLE IF NOT EXISTS social_media_type(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description VARCHAR(255)
);

-- -- Poblar tipos
-- INSERT INTO social_media_type (name, description)
-- VALUES
-- ('music', 'Plataformas de música en streaming'),
-- ('video', 'Plataformas de video'),
-- ('social', 'Redes sociales generales');