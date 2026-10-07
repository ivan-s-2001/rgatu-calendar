USE rgatu_student;

CREATE TABLE auth_session (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  csrf_token_hash CHAR(64) NULL,
  created_at DATETIME NOT NULL,
  last_seen_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  user_agent VARCHAR(512) NULL,
  ip_hash CHAR(64) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_auth_session_token_hash (token_hash),
  KEY idx_auth_session_user (user_id),
  KEY idx_auth_session_expires (expires_at),
  CONSTRAINT fk_auth_session_user
    FOREIGN KEY (user_id) REFERENCES user_account(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_user_account_status ON user_account(status);
