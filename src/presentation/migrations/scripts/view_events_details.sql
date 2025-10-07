-- View to get events with complete information including artist, genres and likes
DROP VIEW IF EXISTS view_events_details;

CREATE VIEW view_events_details AS
SELECT
    -- Event information
    e.id AS event_id,
    e.name AS event_name,
    e.description AS event_description,
    e.picture_url AS event_picture_url,
    e.location AS event_location,
    e.ticket_url AS event_ticket_url,
    e.event_date AS event_date,
    e.created_at AS event_created_at,
    e.updated_at AS event_updated_at,
    e.is_active AS event_is_active,
    
    -- Artist information
    e.profile_id AS artist_profile_id,
    p.artist_name AS artist_name,
    p.profile_image_url AS artist_profile_image_url,
    p.verified AS artist_verified,
    
    -- User information (event creator)
    u.id AS creator_user_id,
    u.name AS creator_user_name,
    u.lastName AS creator_user_last_name,
    
    -- Genres as JSON array
    CASE 
        WHEN COUNT(DISTINCT mg.id) > 0 THEN
            CONCAT('[', 
                GROUP_CONCAT(DISTINCT 
                    CONCAT('{"id":', mg.id, ',"name":"', mg.name, '"}') 
                    ORDER BY mg.name SEPARATOR ','
                ), 
            ']')
        ELSE '[]'
    END AS event_genres,
    
    -- Likes count
    (SELECT COUNT(*) FROM event_likes el WHERE el.event_id = e.id) AS total_likes
    
FROM events e
    INNER JOIN profiles p ON e.profile_id = p.id
    INNER JOIN users u ON p.user_id = u.id
    LEFT JOIN event_genres eg ON e.id = eg.event_id
    LEFT JOIN musical_genres mg ON eg.genre_id = mg.id AND mg.is_active = TRUE
GROUP BY
    e.id, e.name, e.description, e.picture_url, e.location, e.ticket_url, 
    e.event_date, e.created_at, e.updated_at, e.is_active,
    e.profile_id, p.artist_name, p.profile_image_url, p.verified,
    u.id, u.name, u.lastName
ORDER BY e.event_date DESC;