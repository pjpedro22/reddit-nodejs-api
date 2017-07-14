-- This creates the users table. The username field is constrained to unique
-- values only, by using a UNIQUE KEY on that column
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(60) NOT NULL, -- why 60??? ask me :)
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UNIQUE KEY username (username)
);

-- This creates the posts table. The userId column references the id column of
-- users. If a user is deleted, the corresponding posts' userIds will be set NULL.
CREATE TABLE posts (
   id INT AUTO_INCREMENT PRIMARY KEY,
   title VARCHAR(300) DEFAULT NULL,
   url VARCHAR(2000) DEFAULT NULL,
   userId INT DEFAULT NULL,
   createdAt DATETIME NOT NULL,
   updatedAt DATETIME NOT NULL,
   KEY userId (userId), -- why did we add this here? ask me :)
   CONSTRAINT validUser FOREIGN KEY (userId) REFERENCES users (id) ON DELETE SET NULL
 );

--This creates the subreddits table. 
CREATE TABLE subreddits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  description VARCHAR(200),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UNIQUE KEY (name)
);

--This add subredditId column in post table.
ALTER TABLE posts (
  subredditId INT,
  FOREIGN KEY (subredditId) REFERENCES subreddits(id)
);

--Drop post table.
DROP TABLE posts;

--Update column. Set subredditId to subreddits.id.
ALTER TABLE posts ADD COLUMN subredditId INT;
ALTER TABLE posts ADD FOREIGN KEY (subredditId) REFERENCES subreddits (id);