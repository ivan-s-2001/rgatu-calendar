CREATE DATABASE IF NOT EXISTS rgatu_student
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE rgatu_student;

CREATE TABLE institution (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(32) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_institution_code (code)
) ENGINE=InnoDB;

CREATE TABLE org_unit (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  institution_id BIGINT UNSIGNED NOT NULL,
  parent_id BIGINT UNSIGNED NULL,
  code VARCHAR(64) NULL,
  name VARCHAR(255) NOT NULL,
  kind VARCHAR(32) NOT NULL DEFAULT 'faculty',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_org_unit_institution (institution_id),
  KEY idx_org_unit_parent (parent_id),
  CONSTRAINT fk_org_unit_institution
    FOREIGN KEY (institution_id) REFERENCES institution(id),
  CONSTRAINT fk_org_unit_parent
    FOREIGN KEY (parent_id) REFERENCES org_unit(id)
) ENGINE=InnoDB;

CREATE TABLE student_group (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  institution_id BIGINT UNSIGNED NOT NULL,
  org_unit_id BIGINT UNSIGNED NULL,
  code VARCHAR(64) NOT NULL,
  course TINYINT UNSIGNED NULL,
  study_form VARCHAR(32) NOT NULL DEFAULT 'unknown',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_group_institution_code (institution_id, code),
  KEY idx_group_org_unit (org_unit_id),
  CONSTRAINT fk_group_institution
    FOREIGN KEY (institution_id) REFERENCES institution(id),
  CONSTRAINT fk_group_org_unit
    FOREIGN KEY (org_unit_id) REFERENCES org_unit(id)
) ENGINE=InnoDB;

CREATE TABLE subject (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  institution_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(128) NULL,
  PRIMARY KEY (id),
  KEY idx_subject_institution (institution_id),
  CONSTRAINT fk_subject_institution
    FOREIGN KEY (institution_id) REFERENCES institution(id)
) ENGINE=InnoDB;

CREATE TABLE teacher (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  institution_id BIGINT UNSIGNED NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  external_key VARCHAR(128) NULL,
  PRIMARY KEY (id),
  KEY idx_teacher_institution (institution_id),
  KEY idx_teacher_external_key (external_key),
  CONSTRAINT fk_teacher_institution
    FOREIGN KEY (institution_id) REFERENCES institution(id)
) ENGINE=InnoDB;

CREATE TABLE location (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  institution_id BIGINT UNSIGNED NOT NULL,
  building_code VARCHAR(32) NULL,
  room_code VARCHAR(64) NULL,
  building_name VARCHAR(255) NULL,
  address VARCHAR(255) NULL,
  floor SMALLINT NULL,
  PRIMARY KEY (id),
  KEY idx_location_institution (institution_id),
  CONSTRAINT fk_location_institution
    FOREIGN KEY (institution_id) REFERENCES institution(id)
) ENGINE=InnoDB;

CREATE TABLE schedule_event (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  group_id BIGINT UNSIGNED NOT NULL,
  subject_id BIGINT UNSIGNED NULL,
  teacher_id BIGINT UNSIGNED NULL,
  location_id BIGINT UNSIGNED NULL,
  event_date DATE NOT NULL,
  starts_at TIME NOT NULL,
  ends_at TIME NOT NULL,
  lesson_type VARCHAR(64) NULL,
  subgroup VARCHAR(64) NULL,
  note TEXT NULL,
  source_key VARCHAR(191) NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_schedule_group_date (group_id, event_date),
  KEY idx_schedule_teacher_date (teacher_id, event_date),
  CONSTRAINT fk_schedule_group
    FOREIGN KEY (group_id) REFERENCES student_group(id),
  CONSTRAINT fk_schedule_subject
    FOREIGN KEY (subject_id) REFERENCES subject(id),
  CONSTRAINT fk_schedule_teacher
    FOREIGN KEY (teacher_id) REFERENCES teacher(id),
  CONSTRAINT fk_schedule_location
    FOREIGN KEY (location_id) REFERENCES location(id)
) ENGINE=InnoDB;

CREATE TABLE academic_item (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  group_id BIGINT UNSIGNED NULL,
  subject_id BIGINT UNSIGNED NULL,
  kind VARCHAR(32) NOT NULL,
  title VARCHAR(255) NOT NULL,
  starts_at DATETIME NULL,
  due_at DATETIME NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  details TEXT NULL,
  source_key VARCHAR(191) NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_academic_group_kind (group_id, kind),
  KEY idx_academic_due_at (due_at),
  CONSTRAINT fk_academic_group
    FOREIGN KEY (group_id) REFERENCES student_group(id),
  CONSTRAINT fk_academic_subject
    FOREIGN KEY (subject_id) REFERENCES subject(id)
) ENGINE=InnoDB;

CREATE TABLE data_source (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  institution_id BIGINT UNSIGNED NOT NULL,
  code VARCHAR(64) NOT NULL,
  kind VARCHAR(32) NOT NULL,
  url VARCHAR(1024) NULL,
  enabled TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_data_source_code (institution_id, code),
  CONSTRAINT fk_data_source_institution
    FOREIGN KEY (institution_id) REFERENCES institution(id)
) ENGINE=InnoDB;

CREATE TABLE source_snapshot (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  data_source_id BIGINT UNSIGNED NOT NULL,
  content_hash CHAR(64) NOT NULL,
  fetched_at DATETIME NOT NULL,
  imported_at DATETIME NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'fetched',
  metadata JSON NULL,
  PRIMARY KEY (id),
  KEY idx_snapshot_source_fetched (data_source_id, fetched_at),
  CONSTRAINT fk_snapshot_source
    FOREIGN KEY (data_source_id) REFERENCES data_source(id)
) ENGINE=InnoDB;

INSERT INTO institution (code, name)
VALUES ('rsatu', 'РГАТУ им. П. А. Соловьёва')
ON DUPLICATE KEY UPDATE name = VALUES(name);
