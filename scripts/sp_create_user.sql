DELIMITER $$

DROP PROCEDURE IF EXISTS sp_create_user$$

CREATE PROCEDURE sp_create_user(
    IN p_name VARCHAR(255),
    IN p_lastName VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_profile_picture VARCHAR(500),
    IN p_role_id INT,
    IN p_social_login BOOLEAN,
    IN p_phone_number VARCHAR(255),
    OUT p_user_id INT
)
BEGIN
    DECLARE v_final_role_id INT;
    DECLARE v_viewer_role_id INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
BEGIN
ROLLBACK;
SET p_user_id = NULL;
END;

START TRANSACTION;

-- Si p_role_id es NULL, intentamos encontrar el ID del rol 'userAAA'.
IF p_role_id IS NULL THEN
SELECT id INTO v_viewer_role_id FROM roles WHERE name = 'user' LIMIT 1;

-- Verificamos si se encontró el rol 'visitant'.
IF v_viewer_role_id IS NULL THEN
            -- Si no se encuentra el rol por defecto, lanzamos un error.
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El rol "visitant" por defecto no fue encontrado.';
END IF;
        SET v_final_role_id = v_viewer_role_id;
ELSE
        -- Si p_role_id no es NULL, lo usamos directamente.
        -- Opcional: Puedes añadir una validación aquí para asegurar que p_role_id existe.
        SET v_final_role_id = p_role_id;
END IF;

    -- Insertamos el nuevo usuario en la tabla 'users'.
INSERT INTO users (role_id, name, lastName, email, password,phone_number, profile_picture, created_at, updated_at)
VALUES (v_final_role_id, p_name, p_lastName, p_email, p_password, p_phone_number, p_profile_picture, NOW(), NOW());

-- Obtenemos el ID generado automáticamente para el usuario recién insertado.
SET p_user_id = LAST_INSERT_ID();

    -- Confirmamos la transacción si todas las operaciones fueron exitosas.
COMMIT;

END $$

-- Restaura el delimitador estándar.
DELIMITER ;

-- ====================================================================================================
-- EJEMPLOS DE USO DEL PROCEDIMIENTO ALMACENADO
-- ====================================================================================================

-- Ejemplo 1: Crear un usuario asignando un rol específico (por ejemplo, 'artist' con id 2)
-- CALL sp_create_user('Nuevo', 'Artista', 'nuevo.artista@test.com', 'hashedpassword123', NULL, 2, @new_user_id_artist);
-- SELECT @new_user_id_artist;

-- Ejemplo 2: Crear un usuario sin especificar un rol (se le asignará 'visitant' por defecto)
-- CALL sp_create_user('Visitante', 'Default', 'visitante.default@test.com', 'hashedpassword456', NULL, NULL, @new_user_id_viewer);
-- SELECT @new_user_id_viewer;

-- Para verificar los usuarios creados:
-- SELECT * FROM users WHERE id = @new_user_id_artist OR id = @new_user_id_viewer;
