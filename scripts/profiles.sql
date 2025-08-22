-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  artist_name VARCHAR(255) NOT NULL UNIQUE,
  bio TEXT,
  avatar_url VARCHAR(500),
  verified boolean DEFAULT(false),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON
UPDATE
	CURRENT_TIMESTAMP,
	CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON
	DELETE
		CASCADE
);


-- Mock Profiles
INSERT INTO profiles (user_id, artist_name, bio ,avatar_url )
VALUES
(2, 'Perfil de Prueba', 'Soy un perfil de usuario de prueba', 'https://www.google.com');