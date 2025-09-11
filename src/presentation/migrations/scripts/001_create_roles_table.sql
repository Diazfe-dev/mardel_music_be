-- Drops roles table if exists
DROP TABLE IF EXISTS roles;

-- Create roles table

CREATE TABLE IF NOT EXISTS roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON
UPDATE
	CURRENT_TIMESTAMP
);

-- -- Create roles
-- INSERT 	INTO roles (name, description)
-- VALUES 
-- ('admin', 'Administrador con acceso completo'),
-- ('artist', 'Crear y editar sus propios eventos'),
-- ('user', 'Solo puede visualizar contenido');