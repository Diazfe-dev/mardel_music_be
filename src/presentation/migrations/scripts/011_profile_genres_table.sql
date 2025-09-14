-- Drop profile_genres table if it exists
DROP TABLE IF EXISTS profile_genres;

-- Create profile_genres table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS profile_genres (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    genre_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pg_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_pg_genre FOREIGN KEY (genre_id) REFERENCES musical_genres(id) ON DELETE CASCADE,
    CONSTRAINT uq_profile_genre UNIQUE (profile_id, genre_id)
);

-- Add indexes for better performance (without IF NOT EXISTS since we dropped the table)
CREATE INDEX idx_profile_genres_profile_id ON profile_genres(profile_id);
CREATE INDEX idx_profile_genres_genre_id ON profile_genres(genre_id);
