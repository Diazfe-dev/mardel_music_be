-- Vista para obtener detalles completos del perfil de artista
DROP VIEW IF EXISTS view_artist_profile_details;

CREATE VIEW view_artist_profile_details AS
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
    
    -- Agregar información del usuario
    u.name as user_name,
    u.lastName as user_lastName,
    u.email as user_email,
    
    -- Géneros como array JSON
    COALESCE(
        JSON_ARRAYAGG(
            CASE 
                WHEN mg.id IS NOT NULL THEN
                    JSON_OBJECT(
                        'id', mg.id,
                        'name', mg.name,
                        'description', mg.description
                    )
                ELSE NULL
            END
        ), 
        JSON_ARRAY()
    ) as genres,
    
    -- Redes sociales como array JSON
    COALESCE(
        JSON_ARRAYAGG(
            CASE 
                WHEN smp.id IS NOT NULL THEN
                    JSON_OBJECT(
                        'id', smp.id,
                        'social_media_id', smp.social_media_id,
                        'platform_name', sm.name,
                        'platform_description', sm.description,
                        'url', smp.uri,
                        'created_at', smp.created_at
                    )
                ELSE NULL
            END
        ), 
        JSON_ARRAY()
    ) as social_media,
    
    -- Contadores útiles
    COUNT(DISTINCT pg.genre_id) as total_genres,
    COUNT(DISTINCT smp.id) as total_social_media

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
    u.lastName,
    u.email;