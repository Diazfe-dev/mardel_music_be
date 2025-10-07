-- Vista para listar perfiles de artistas con información resumida
DROP VIEW IF EXISTS view_artist_profiles_list;

CREATE VIEW view_artist_profiles_list AS
SELECT 
    p.id as profile_id,
    p.user_id,
    p.artist_name,
    p.bio,
    p.location,
    p.profile_image_url,
    p.verified,
    p.created_at,
    p.updated_at,
    
    -- Información básica del usuario
    u.name as user_name,
    u.email as user_email,
    
    -- Géneros como string concatenado (para búsquedas)
    GROUP_CONCAT(DISTINCT mg.name SEPARATOR ', ') as genres_list,
    
    -- Contadores
    COUNT(DISTINCT pg.genre_id) as total_genres,
    COUNT(DISTINCT smp.id) as total_social_media,
    
    -- Primera red social (la más importante)
    (
        SELECT JSON_OBJECT(
            'platform_name', sm2.name,
            'url', smp2.uri
        )
        FROM social_media_profile smp2
        LEFT JOIN social_media sm2 ON smp2.social_media_id = sm2.id
        WHERE smp2.profile_id = p.id
        ORDER BY smp2.created_at ASC
        LIMIT 1
    ) as primary_social_media

FROM profiles p
    INNER JOIN users u ON p.user_id = u.id
    LEFT JOIN profile_genres pg ON p.id = pg.profile_id
    LEFT JOIN musical_genres mg ON pg.genre_id = mg.id AND mg.is_active = TRUE
    LEFT JOIN social_media_profile smp ON p.id = smp.profile_id
    LEFT JOIN social_media sm ON smp.social_media_id = sm.id

GROUP BY 
    p.id, 
    p.user_id, 
    p.artist_name, 
    p.bio, 
    p.location, 
    p.profile_image_url, 
    p.verified, 
    p.created_at, 
    p.updated_at,
    u.name,
    u.email

ORDER BY p.created_at DESC;