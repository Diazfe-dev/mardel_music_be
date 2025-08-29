-- Create social_media_profile table
CREATE TABLE IF NOT EXISTS social_media_profile (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uri TEXT NOT NULL,
  social_media_id INT NOT NULL,
  profile_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON
UPDATE
	CURRENT_TIMESTAMP,
	CONSTRAINT fk_smp_social FOREIGN KEY (social_media_id) REFERENCES social_media(id) ON
	DELETE
		CASCADE,
		CONSTRAINT fk_smp_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON
		DELETE
			CASCADE,
			CONSTRAINT uq_profile_social UNIQUE (profile_id,
			social_media_id)
);

-- Social media artist
INSERT 	INTO social_media_profile (profile_id, social_media_id, uri)
VALUES
(1,1, 'https://open.spotify.com/intl-es'),
(1,3, 'https://www.youtube.com/'),
(1,
4,
'https://soundcloud.com/discover');
