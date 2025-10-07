-- Create events table
-- Events are created by artists (profiles), not users directly
DROP TABLE IF EXISTS events;

CREATE TABLE IF NOT EXISTS events (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    picture_url VARCHAR(500),
    location VARCHAR(255),
    ticket_url VARCHAR(500),
    event_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Foreign key constraint to profiles table (artists)
    CONSTRAINT fk_events_profile_id 
        FOREIGN KEY (profile_id) 
        REFERENCES profiles(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Indexes for better performance
    INDEX idx_events_profile_id (profile_id),
    INDEX idx_events_date (event_date),
    INDEX idx_events_active (is_active),
    INDEX idx_events_created_at (created_at)
);