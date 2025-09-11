-- Drop permissions table
DROP TABLE IF EXISTS permissions;

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON
UPDATE
	CURRENT_TIMESTAMP
);

-- -- Create permissions
-- INSERT 	INTO permissions (name, description)
-- VALUES
-- ('create_user', 'Puede crear nuevos usuarios'),
-- ('delete_user', 'Puede eliminar usuarios'),
-- ('edit_user', 'Puede editar usuarios'),
-- ('create_role', 'Puede editar roles'),
-- ('editr_role', 'Puede editar roles'),
-- ('create_permissions', 'Puede editar permissions'),
-- ('editr_permissions', 'Puede editar permissions'),
-- ('create_event', 'Puede crear eventos'),
-- ('edit_event', 'Puede editar eventos'),
-- ('delete_event', 'Puede eliminar eventos'),
-- ('view_events', 'Puede visualizar eventos');