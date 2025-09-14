-- Seed: Relaciones entre roles y permisos
-- Este archivo asigna permisos específicos a cada rol

-- Limpiar datos existentes
DELETE FROM permissions_to_roles;

-- Admin: tiene todos los permisos
INSERT INTO permissions_to_roles(role_id, permission_id)
SELECT 1, id FROM permissions;

-- Artist: permisos relacionados con eventos
INSERT INTO permissions_to_roles(role_id, permission_id)
VALUES 
(2, 8),  -- create_event
(2, 9),  -- edit_event
(2, 10), -- delete_event
(2, 11); -- view_events

-- User: solo puede visualizar eventos  
INSERT INTO permissions_to_roles (role_id, permission_id)
VALUES (3, 11); -- view_events
