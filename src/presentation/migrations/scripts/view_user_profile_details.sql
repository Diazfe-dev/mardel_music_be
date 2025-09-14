-- VISTA PARA RECUPERAR EL PERFIL DEL USUARIO CON SUS REDES SOCIALES Y GÉNEROS MUSICALES
DROP VIEW IF EXISTS user_profile_details;
CREATE VIEW user_profile_details AS
SELECT
    u.id AS user_id,
    u.name AS user_name,
    u.lastName AS user_last_name,
    u.email AS user_email,
    u.phone_number AS user_phone,
    u.profile_picture AS user_profile_picture,
    r.name AS user_role,
    
    -- Profile information
    pr.id AS profile_id,
    pr.artist_name AS profile_artist_name,
    pr.bio AS profile_bio,
    pr.location AS profile_location,
    pr.profile_image_url AS profile_image_url,
    pr.verified AS profile_verified,
    pr.created_at AS profile_created_at,
    pr.updated_at AS profile_updated_at,

    -- Musical genres as JSON array with id and name
    CASE 
        WHEN COUNT(DISTINCT mg.id) > 0 THEN
            CONCAT('[', 
                GROUP_CONCAT(DISTINCT 
                    CONCAT('{"id":', mg.id, ',"name":"', mg.name, '"}') 
                    ORDER BY mg.name SEPARATOR ','
                ), 
            ']')
        ELSE '[]'
    END AS musical_genres,
    
    -- Social media as JSON array with id, platform_name and url
    CASE 
        WHEN COUNT(DISTINCT smp.social_media_id) > 0 THEN
            CONCAT('[', 
                GROUP_CONCAT(DISTINCT 
                    CONCAT('{"social_media_id":', smp.social_media_id, 
                           ',"platform_name":"', sm.name, 
                           '","url":"', smp.uri, '"}') 
                    ORDER BY sm.name SEPARATOR ','
                ), 
            ']')
        ELSE '[]'
    END AS social_media
    
FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    LEFT JOIN profiles pr ON u.id = pr.user_id
    LEFT JOIN social_media_profile smp ON pr.id = smp.profile_id
    LEFT JOIN social_media sm ON smp.social_media_id = sm.id
    LEFT JOIN profile_genres pg ON pr.id = pg.profile_id
    LEFT JOIN musical_genres mg ON pg.genre_id = mg.id AND mg.is_active = TRUE
    
GROUP BY
    u.id, u.name, u.lastName, u.email, u.phone_number, u.profile_picture,
    r.name, pr.id, pr.artist_name, pr.bio, pr.location, 
    pr.profile_image_url, pr.verified, pr.created_at, pr.updated_at
    
ORDER BY u.id;