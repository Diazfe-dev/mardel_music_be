CREATE TABLE IF NOT EXISTS roles (
                                     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                     name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS permissions (
                                           id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                           name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS permissions_to_roles (
                                                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                                    role_id INT NOT NULL,
                                                    permission_id INT NOT NULL,
                                                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                    CONSTRAINT fk_ptr_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_ptr_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS users (
                                     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                     role_id INT NOT NULL,
                                     name VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
    );

CREATE TABLE IF NOT EXISTS profiles (
                                        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                        user_id INT NOT NULL UNIQUE,
                                        artist_name VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT,
    avatar_url VARCHAR(500),
    verified boolean DEFAULT(false),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

-- Tipos de redes sociales
CREATE TABLE IF NOT EXISTS social_media_type(
                                                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                                name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255)
    );

-- Redes sociales
CREATE TABLE IF NOT EXISTS social_media (
                                            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                            name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255),
    type_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_social_media_type FOREIGN KEY (type_id) REFERENCES social_media_type(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS social_media_profile (
                                                    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                                    uri TEXT NOT NULL,
                                                    social_media_id INT NOT NULL,
                                                    profile_id INT NOT NULL,
                                                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                    CONSTRAINT fk_smp_social FOREIGN KEY (social_media_id) REFERENCES social_media(id) ON DELETE CASCADE,
    CONSTRAINT fk_smp_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    CONSTRAINT uq_profile_social UNIQUE (profile_id, social_media_id)
    );

INSERT INTO roles (name, description) VALUES
                                          ('admin', 'Administrador con acceso completo'),
                                          ('artist', 'Crear y editar sus propios eventos'),
                                          ('visitant', 'Solo puede visualizar contenido');

INSERT INTO permissions (name, description) VALUES
                                                ('create_user', 'Puede crear nuevos usuarios'),
                                                ('delete_user', 'Puede eliminar usuarios'),
                                                ('edit_user', 'Puede editar usuarios'),
                                                ('create_role', 'Puede editar roles'),
                                                ('editr_role', 'Puede editar roles'),
                                                ('create_permissions', 'Puede editar permissions'),
                                                ('editr_permissions', 'Puede editar permissions'),
                                                ('create_event', 'Puede crear eventos'),
                                                ('edit_event', 'Puede editar eventos'),
                                                ('delete_event', 'Puede eliminar eventos'),
                                                ('view_events', 'Puede visualizar eventos');

-- Admin
INSERT INTO permissions_to_roles(role_id, permission_id) SELECT 1, id FROM permissions;

-- Artist
INSERT INTO permissions_to_roles(role_id, permission_id)
VALUES
    (2,8),
    (2,9),
    (2,10),
    (2,11);

-- Visitant
INSERT INTO permissions_to_roles (role_id, permission_id)
VALUES
    (3, 11);

-- Poblar tipos
INSERT INTO social_media_type (name, description) VALUES
                                                      ('music', 'Plataformas de música en streaming'),
                                                      ('video', 'Plataformas de video'),
                                                      ('social', 'Redes sociales generales');

-- Poblar redes sociales con tipo
INSERT INTO social_media (name, description, type_id)
VALUES
    ('Spotify', 'Servicio de streaming de música.', 1),
    ('Apple Music', 'Servicio de música por suscripción de Apple.', 1),
    ('YouTube Music', 'Servicio de streaming musical de YouTube.', 1),
    ('SoundCloud', 'Plataforma para compartir y descubrir música.', 1),
    ('Deezer', 'Servicio de música por streaming con amplio catálogo.', 1),
    ('Tidal', 'Plataforma de música en alta fidelidad.', 1),
    ('Amazon Music', 'Servicio de streaming de música de Amazon.', 1),
    ('Bandcamp', 'Plataforma para apoyar a artistas y comprar música.', 1),
    ('Pandora', 'Servicio de radio por internet y recomendaciones musicales.', 1),
    ('YouTube', 'Plataforma de video.', 2),
    ('Facebook', 'Red social.', 3),
    ('Instagram', 'Red social.', 3),
    ('TikTok', 'Red social de videos cortos.', 2),
    ('Twitter / X', 'Red social de microblogging.', 3);

-- Mock Users
INSERT INTO	users (name, lastName, email, password,	role_id)
VALUES
    ('Admin','Profile','admin@test.com','1234test',1),
    ('Artist','Profile','artist@test.com','1234test',2),
    ('Viewer','Profile','viewer@test.com','1234test',3);

INSERT INTO profiles (user_id, artist_name, bio ,avatar_url )
VALUES
    (2, 'Perfil de Prueba', 'Soy un perfil de usuario de prueba', 'https://www.google.com');

INSERT 	INTO social_media_profile (profile_id, social_media_id, uri)
VALUES
    (1,1, 'https://open.spotify.com/intl-es'),
    (1,3, 'https://www.youtube.com/'),
    (1,4, 'https://soundcloud.com/discover');