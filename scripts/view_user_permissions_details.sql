DROP VIEW IF EXISTS user_permissions_details;

CREATE VIEW user_permissions_details AS
SELECT
    u.id AS user_id,
    u.name AS user_name,
    u.lastName AS user_lastName,
    u.email AS user_email,
    u.password AS user_password,
    u.profile_picture AS user_profile_picture,
    u.social_login AS user_social_login,
    u.phone_number AS user_phone_number,
    u.created_at AS user_created_at,
    u.updated_at AS user_updated_at,
    r.id AS role_id,
    r.name AS role_name,
    r.description AS role_description,
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
    u.id, u.name, u.lastName, u.email, u.password, u.social_login, u.phone_number, u.created_at, u.updated_at,
    r.id, r.name, r.description
ORDER BY
    u.id;