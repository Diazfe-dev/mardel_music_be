-- Create permissions_to_roles table
CREATE TABLE IF NOT EXISTS permissions_to_roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ptr_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_ptr_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
  CONSTRAINT unique_role_permission UNIQUE (role_id, permission_id)
);


-- Admin
INSERT INTO permissions_to_roles(role_id, permission_id)
SELECT 	1, id FROM permissions;

-- Artist
INSERT INTO permissions_to_roles(role_id, permission_id)
VALUES (2, 8), (2, 9), (2, 10), (2, 11);

-- Visitant 
INSERT INTO permissions_to_roles (role_id, permission_id)
VALUES (3, 11);