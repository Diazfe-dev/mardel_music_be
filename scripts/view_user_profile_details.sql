-- VISTA PARA RECUPERAR EL PERFIL DEL USUARIO CON SUS REDES SOCIALES
DROP VIEW IF EXISTS user_profile_details;
CREATE VIEW user_profile_details AS
SELECT
    u.id AS user_id,
    pr.id AS profile_id,
    pr.artist_name AS profile_artist_name,
    pr.bio AS profile_bio,
    pr.avatar_url AS profile_avatar_url,
    pr.verified AS profile_verified,

    GROUP_CONCAT(DISTINCT CONCAT(sm.name, ': ', smp.uri) ORDER BY sm.name SEPARATOR '; ') AS social_media_links
FROM
    users u
        LEFT JOIN
    profiles pr ON u.id = pr.user_id
        LEFT JOIN
    social_media_profile smp ON pr.id = smp.profile_id
        LEFT JOIN
    social_media sm ON smp.social_media_id = sm.id
GROUP BY
    u.id,
    pr.id, pr.artist_name, pr.bio, pr.avatar_url, pr.verified
ORDER BY
    u.id;

-- EJEMPLO PARA LLAMAR AL VIEW user_profile_details
-- SELECT * FROM user_profile_details WHERE user_id = 1;