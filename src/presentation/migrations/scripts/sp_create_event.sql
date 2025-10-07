DELIMITER $$

DROP PROCEDURE IF EXISTS sp_create_event$$

CREATE PROCEDURE sp_create_event(
    IN p_profile_id INT,
    IN p_name VARCHAR(255),
    IN p_description TEXT,
    IN p_picture_url VARCHAR(500),
    IN p_location VARCHAR(255),
    IN p_ticket_url VARCHAR(500),
    IN p_event_date DATETIME,
    IN p_genres JSON
)
BEGIN
    DECLARE v_event_id INT;
    DECLARE v_genre_count INT DEFAULT 0;
    DECLARE v_counter INT DEFAULT 0;
    DECLARE v_genre_name VARCHAR(255);
    DECLARE v_genre_id INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Verificar que el perfil existe
    IF NOT EXISTS(SELECT 1 FROM profiles WHERE id = p_profile_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Artist profile does not exist';
    END IF;

    -- Crear el evento
    INSERT INTO events (profile_id, name, description, picture_url, location, ticket_url, event_date, created_at, updated_at)
    VALUES (p_profile_id, p_name, p_description, p_picture_url, p_location, p_ticket_url, p_event_date, NOW(), NOW());

    SET v_event_id = LAST_INSERT_ID();

    -- Procesar géneros musicales (acepta nombres de géneros)
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
            
            -- Si el género existe, agregarlo al evento
            IF v_genre_id IS NOT NULL THEN
                INSERT IGNORE INTO event_genres (event_id, genre_id, created_at)
                VALUES (v_event_id, v_genre_id, NOW());
                
                -- Reset variable for next iteration
                SET v_genre_id = NULL;
            END IF;
            
            SET v_counter = v_counter + 1;
        END WHILE;
    END IF;

    COMMIT;

    -- Retornar el ID del evento creado
    SELECT v_event_id as event_id, 'Event created successfully' as message;

END$$

DELIMITER ;