-- STORE PROCEDURE PARA CREAR UN PERFIL DE USUARIO CON LAS REDES SOCIALES
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_create_profile$$
CREATE PROCEDURE sp_create_profile(
    IN p_user_id INT,
    IN p_artist_name VARCHAR(255),
    IN p_bio TEXT,
    IN p_avatar_url VARCHAR(500),
    IN p_verified BOOLEAN,
    IN p_social_medias JSON,
    OUT p_profile_id INT
)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE n INT DEFAULT JSON_LENGTH(p_social_medias);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
BEGIN
ROLLBACK;
SET p_profile_id = NULL;
END;
START TRANSACTION;

INSERT INTO profiles(user_id, artist_name, bio, avatar_url, verified, created_at, updated_at)
VALUES (p_user_id, p_artist_name, p_bio, p_avatar_url, p_verified, NOW(), NOW());
SET p_profile_id = LAST_INSERT_ID();
    WHILE i < n DO
        INSERT INTO social_media_profile(profile_id, social_media_id, uri, created_at, updated_at)
        VALUES (
            p_profile_id,
            JSON_UNQUOTE(JSON_EXTRACT(p_social_medias, CONCAT('$[', i, '].social_media_id'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_social_medias, CONCAT('$[', i, '].uri'))),
            NOW(),
            NOW()
        );
        SET i = i + 1;
END WHILE;
COMMIT;
END $$
DELIMITER ;

-- EJEMPLO PARA CREAR EL PERFIL DEL USUARIO USANDO EL SP sp_create_profile
-- CALL sp_create_profile(
--     1,
--     'Artista Ejemplo 1',
--     'Biografía de ejemplo para el perfil de un artista.',
--     'https://avatar.url/ejemplo.png',
--     TRUE,
--     '[{"social_media_id":1,"uri":"https://open.spotify.com/intl-es/user/ejemplo"},{"social_media_id":2,"uri":"https://www.apple.com/la/apple-music/artist/ejemplo"}]',
--     @profile_id
-- );



