-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  profile_picture VARCHAR(500),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON
UPDATE
	CURRENT_TIMESTAMP,
	CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id) ON
	DELETE
		RESTRICT
);


-- Mock Users
INSERT
	INTO
	users (name,
	lastName,
	email,
	password,
	role_id)
VALUES
('Admin',
'Profile',
'admin@test.com',
'1234test',
1),
('Artist',
'Profile',
'artist@test.com',
'1234test',
2),
('Viewer',
'Profile',
'viewer@test.com',
'1234test',
3);