DELIMITER $$

DROP PROCEDURE IF EXISTS sp_toggle_event_like$$

CREATE PROCEDURE sp_toggle_event_like(
    IN p_event_id INT,
    IN p_user_id INT
)
BEGIN
    DECLARE v_like_exists INT DEFAULT 0;
    DECLARE v_action VARCHAR(20);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Verificar que el evento existe
    IF NOT EXISTS(SELECT 1 FROM events WHERE id = p_event_id AND is_active = TRUE) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Event does not exist or is not active';
    END IF;

    -- Verificar que el usuario existe
    IF NOT EXISTS(SELECT 1 FROM users WHERE id = p_user_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not exist';
    END IF;

    -- Verificar si ya existe el like
    SELECT COUNT(*) INTO v_like_exists 
    FROM event_likes 
    WHERE event_id = p_event_id AND user_id = p_user_id;

    IF v_like_exists > 0 THEN
        -- Si existe, eliminar el like
        DELETE FROM event_likes 
        WHERE event_id = p_event_id AND user_id = p_user_id;
        SET v_action = 'unliked';
    ELSE
        -- Si no existe, agregar el like
        INSERT INTO event_likes (event_id, user_id, created_at)
        VALUES (p_event_id, p_user_id, NOW());
        SET v_action = 'liked';
    END IF;

    COMMIT;

    -- Retornar la acción realizada y el conteo actualizado de likes
    SELECT 
        v_action as action,
        (SELECT COUNT(*) FROM event_likes WHERE event_id = p_event_id) as total_likes;

END$$

DELIMITER ;