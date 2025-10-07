-- Create event_genres table for many-to-many relationship between events and musical genres
DROP TABLE IF EXISTS event_genres;

CREATE TABLE IF NOT EXISTS event_genres (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    genre_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_event_genres_event_id 
        FOREIGN KEY (event_id) 
        REFERENCES events(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    CONSTRAINT fk_event_genres_genre_id 
        FOREIGN KEY (genre_id) 
        REFERENCES musical_genres(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Unique constraint to prevent duplicate genre assignments
    UNIQUE KEY unique_event_genre (event_id, genre_id),
    
    -- Indexes for better performance
    INDEX idx_event_genres_event_id (event_id),
    INDEX idx_event_genres_genre_id (genre_id)
);