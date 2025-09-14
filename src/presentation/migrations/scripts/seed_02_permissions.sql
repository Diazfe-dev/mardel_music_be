-- Seed: Permisos del sistema
-- Este archivo contiene todos los permisos disponibles

-- Limpiar datos existentes (opcional, para re-ejecutar seeds)
DELETE FROM permissions_to_roles;
DELETE FROM permissions;

-- Insertar permisos básicos
INSERT INTO permissions (name, description) VALUES
('create_user', 'Puede crear nuevos usuarios'),
('delete_user', 'Puede eliminar usuarios'),
('edit_user', 'Puede editar usuarios'),
('create_role', 'Puede crear roles'),
('edit_role', 'Puede editar roles'),
('create_permissions', 'Puede crear permissions'),
('edit_permissions', 'Puede editar permissions'),
('create_event', 'Puede crear eventos'),
('edit_event', 'Puede editar eventos'),
('delete_event', 'Puede eliminar eventos'),
('view_events', 'Puede visualizar eventos');
