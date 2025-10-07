-- Create event_likes table for users to like events and receive notifications
DROP TABLE IF EXISTS event_likes;

CREATE TABLE IF NOT EXISTS event_likes (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_event_likes_event_id 
        FOREIGN KEY (event_id) 
        REFERENCES events(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    CONSTRAINT fk_event_likes_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Unique constraint to prevent duplicate likes from same user
    UNIQUE KEY unique_user_event_like (user_id, event_id),
    
    -- Indexes for better performance
    INDEX idx_event_likes_event_id (event_id),
    INDEX idx_event_likes_user_id (user_id),
    INDEX idx_event_likes_created_at (created_at)
);