-- Seed: Roles iniciales
-- Este archivo contiene los roles básicos del sistema

-- Limpiar datos existentes (opcional, para re-ejecutar seeds)
DELETE FROM permissions_to_roles;
DELETE FROM roles;

-- Insertar roles básicos
INSERT INTO roles (name, description) VALUES 
('admin', 'Administrador con acceso completo'),
('artist', 'Artista que puede crear y editar sus propios eventos'),
('user', 'Usuario básico que solo puede visualizar contenido');
