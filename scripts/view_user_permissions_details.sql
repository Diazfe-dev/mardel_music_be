-- Si la vista 'user_permissions_details' ya existe, la eliminamos para poder crearla de nuevo.
DROP VIEW IF EXISTS user_permissions_details;

-- Creamos una vista para consolidar la información de usuario, su rol y todos sus permisos asociados.
CREATE VIEW user_permissions_details AS
SELECT
    u.id AS user_id,
    u.name AS user_name,
    u.lastName AS user_lastName,
    u.email AS user_email,
    -- Considera NO exponer la contraseña en una vista si no es estrictamente necesario por seguridad.
    u.password AS user_password,
    u.created_at AS user_created_at,
    u.updated_at AS user_updated_at,
    r.id AS role_id,
    r.name AS role_name,
    r.description AS role_description,
    -- Agrupamos todos los nombres de permisos en una cadena separada por comas para cada usuario.
    -- DISTINCT asegura que no haya permisos duplicados si un rol tuviera el mismo permiso por alguna razón.
    -- ORDER BY p.name asegura un orden consistente de los permisos en la cadena.
    GROUP_CONCAT(DISTINCT p.name ORDER BY p.name SEPARATOR ', ') AS permissions
FROM
    users u
        LEFT JOIN
    roles r ON u.role_id = r.id
        LEFT JOIN
    permissions_to_roles ptr ON r.id = ptr.role_id
        LEFT JOIN
    permissions p ON ptr.permission_id = p.id
GROUP BY
    u.id, u.name, u.lastName, u.email, u.password, u.created_at, u.updated_at,
    r.id, r.name, r.description
ORDER BY
    u.id;
