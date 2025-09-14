DELIMITER $$

DROP PROCEDURE IF EXISTS sp_create_artist_profile$$

CREATE PROCEDURE sp_create_artist_profile(
    IN p_user_id INT,
    IN p_name VARCHAR(255),
    IN p_bio TEXT,
    IN p_location VARCHAR(255),
    IN p_profile_image_url VARCHAR(500),
    IN p_genres JSON,
    IN p_social_media JSON
)
BEGIN
    DECLARE v_profile_id INT;
    DECLARE v_genre_count INT DEFAULT 0;
    DECLARE v_social_count INT DEFAULT 0;
    DECLARE v_counter INT DEFAULT 0;
    DECLARE v_genre_name VARCHAR(255);
    DECLARE v_genre_id INT;
    DECLARE v_social_media_id INT;
    DECLARE v_social_url VARCHAR(500);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Verificar si el usuario ya tiene un perfil
    IF EXISTS(SELECT 1 FROM profiles WHERE user_id = p_user_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User already has a profile';
    END IF;

    -- Verificar si el nombre del artista ya existe
    IF EXISTS(SELECT 1 FROM profiles WHERE artist_name = p_name) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Artist name already exists';
    END IF;

    -- Crear el perfil
    INSERT INTO profiles (user_id, artist_name, bio, location, profile_image_url, created_at, updated_at)
    VALUES (p_user_id, p_name, p_bio, p_location, p_profile_image_url, NOW(), NOW());

    SET v_profile_id = LAST_INSERT_ID();

    -- Procesar géneros musicales (ahora acepta nombres de géneros)
    IF p_genres IS NOT NULL AND JSON_TYPE(p_genres) = 'ARRAY' THEN
        SET v_genre_count = JSON_LENGTH(p_genres);
        SET v_counter = 0;
        
        WHILE v_counter < v_genre_count DO
            SET v_genre_name = JSON_UNQUOTE(JSON_EXTRACT(p_genres, CONCAT('$[', v_counter, ']')));
            
            -- Buscar el ID del género por nombre (case insensitive)
            SELECT id INTO v_genre_id 
            FROM musical_genres 
            WHERE LOWER(name) = LOWER(TRIM(v_genre_name)) 
            AND is_active = TRUE 
            LIMIT 1;
            
            -- Si el género existe, agregarlo al perfil
            IF v_genre_id IS NOT NULL THEN
                INSERT IGNORE INTO profile_genres (profile_id, genre_id, created_at)
                VALUES (v_profile_id, v_genre_id, NOW());
                
                -- Reset variable for next iteration
                SET v_genre_id = NULL;
            END IF;
            
            SET v_counter = v_counter + 1;
        END WHILE;
    END IF;

    -- Procesar redes sociales
    IF p_social_media IS NOT NULL AND JSON_TYPE(p_social_media) = 'ARRAY' THEN
        SET v_social_count = JSON_LENGTH(p_social_media);
        SET v_counter = 0;
        
        WHILE v_counter < v_social_count DO
            SET v_social_media_id = JSON_UNQUOTE(JSON_EXTRACT(p_social_media, CONCAT('$[', v_counter, '].social_media_id')));
            SET v_social_url = JSON_UNQUOTE(JSON_EXTRACT(p_social_media, CONCAT('$[', v_counter, '].url')));
            
            -- Verificar que la red social existe
            IF EXISTS(SELECT 1 FROM social_media WHERE id = v_social_media_id) THEN
                INSERT IGNORE INTO social_media_profile (profile_id, social_media_id, uri, created_at, updated_at)
                VALUES (v_profile_id, v_social_media_id, v_social_url, NOW(), NOW());
            END IF;
            
            SET v_counter = v_counter + 1;
        END WHILE;
    END IF;

    COMMIT;

    -- Retornar el ID del perfil creado
    SELECT v_profile_id as profile_id, 'Profile created successfully' as message;

END$$

DELIMITER ;
