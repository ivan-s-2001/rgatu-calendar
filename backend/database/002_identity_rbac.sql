USE rgatu_student;

CREATE TABLE person (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  last_name VARCHAR(128) NOT NULL,
  first_name VARCHAR(128) NOT NULL,
  middle_name VARCHAR(128) NULL,
  birth_date DATE NULL,
  external_key VARCHAR(191) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_person_external_key (external_key)
) ENGINE=InnoDB;

CREATE TABLE user_account (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  person_id BIGINT UNSIGNED NOT NULL,
  login VARCHAR(191) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  password_hash VARCHAR(255) NULL,
  last_login_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_login (login),
  UNIQUE KEY uq_user_person (person_id),
  CONSTRAINT fk_user_person
    FOREIGN KEY (person_id) REFERENCES person(id)
) ENGINE=InnoDB;

CREATE TABLE access_role (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(64) NOT NULL,
  name VARCHAR(128) NOT NULL,
  description VARCHAR(512) NULL,
  is_system TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_access_role_code (code)
) ENGINE=InnoDB;

CREATE TABLE access_permission (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(128) NOT NULL,
  description VARCHAR(512) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_access_permission_code (code)
) ENGINE=InnoDB;

CREATE TABLE role_permission (
  role_id BIGINT UNSIGNED NOT NULL,
  permission_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_role_permission_role
    FOREIGN KEY (role_id) REFERENCES access_role(id) ON DELETE CASCADE,
  CONSTRAINT fk_role_permission_permission
    FOREIGN KEY (permission_id) REFERENCES access_permission(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE user_role_assignment (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  role_id BIGINT UNSIGNED NOT NULL,
  org_unit_id BIGINT UNSIGNED NULL,
  group_id BIGINT UNSIGNED NULL,
  valid_from DATE NULL,
  valid_to DATE NULL,
  granted_by BIGINT UNSIGNED NULL,
  granted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_role_user (user_id),
  KEY idx_user_role_scope_org (org_unit_id),
  KEY idx_user_role_scope_group (group_id),
  CONSTRAINT fk_user_role_user
    FOREIGN KEY (user_id) REFERENCES user_account(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_role_role
    FOREIGN KEY (role_id) REFERENCES access_role(id),
  CONSTRAINT fk_user_role_org
    FOREIGN KEY (org_unit_id) REFERENCES org_unit(id),
  CONSTRAINT fk_user_role_group
    FOREIGN KEY (group_id) REFERENCES student_group(id),
  CONSTRAINT fk_user_role_granted_by
    FOREIGN KEY (granted_by) REFERENCES user_account(id)
) ENGINE=InnoDB;

CREATE TABLE audit_log (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  actor_user_id BIGINT UNSIGNED NULL,
  action VARCHAR(128) NOT NULL,
  entity_type VARCHAR(128) NOT NULL,
  entity_id VARCHAR(128) NULL,
  request_id VARCHAR(64) NULL,
  before_data JSON NULL,
  after_data JSON NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_actor_created (actor_user_id, created_at),
  KEY idx_audit_entity (entity_type, entity_id),
  KEY idx_audit_request (request_id),
  CONSTRAINT fk_audit_actor
    FOREIGN KEY (actor_user_id) REFERENCES user_account(id)
) ENGINE=InnoDB;

INSERT INTO access_role (code, name, description) VALUES
  ('student', 'Студент', 'Доступ только к собственным учебным данным'),
  ('group_leader', 'Староста', 'Студент с дополнительными полномочиями внутри своей группы'),
  ('teacher', 'Преподаватель', 'Назначенные занятия, проверка работ, оценки и заполнение ведомостей'),
  ('department_staff', 'Сотрудник кафедры', 'Работа в пределах своей кафедры'),
  ('department_head', 'Заведующий кафедрой', 'Управление процессами своей кафедры'),
  ('dean_staff', 'Сотрудник деканата', 'Контингент и учебный процесс своего подразделения'),
  ('dean', 'Декан / директор', 'Расширенные полномочия подразделения'),
  ('scheduler', 'Диспетчер расписания', 'Составление и корректировка расписания'),
  ('education_office', 'Учебное управление', 'Управление учебным процессом университета'),
  ('university_admin', 'Администрация университета', 'Межфакультетские административные полномочия'),
  ('system_admin', 'Системный администратор', 'Техническая конфигурация и доступы')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description);

INSERT INTO access_permission (code, description) VALUES
  ('self.profile.read', 'Просмотр собственного профиля'),
  ('self.study.read', 'Просмотр собственного учебного процесса'),
  ('self.submission.create', 'Отправка собственной работы'),
  ('group.attendance.mark', 'Отметка посещаемости своей группы'),
  ('teacher.workload.read', 'Просмотр назначенной нагрузки'),
  ('teacher.assignment.review', 'Проверка назначенных работ'),
  ('teacher.grade.write', 'Ввод оценок в разрешённом контексте'),
  ('teacher.sheet.fill', 'Заполнение открытой ведомости'),
  ('student.manage', 'Управление контингентом студентов'),
  ('group.manage', 'Управление учебными группами'),
  ('curriculum.manage', 'Управление учебными планами'),
  ('teaching_assignment.manage', 'Назначение преподавателей'),
  ('schedule.manage', 'Управление расписанием'),
  ('assessment.manage', 'Создание и управление официальной аттестацией'),
  ('sheet.manage', 'Создание, открытие и закрытие ведомостей'),
  ('debt.manage', 'Управление академическими задолженностями'),
  ('role.manage', 'Назначение ролей и областей доступа'),
  ('audit.read', 'Просмотр журнала аудита'),
  ('system.manage', 'Техническое администрирование системы')
ON DUPLICATE KEY UPDATE
  description = VALUES(description);

INSERT IGNORE INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM access_role r
JOIN access_permission p ON p.code IN ('self.profile.read','self.study.read','self.submission.create')
WHERE r.code = 'student';

INSERT IGNORE INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM access_role r
JOIN access_permission p ON p.code IN ('self.profile.read','self.study.read','self.submission.create','group.attendance.mark')
WHERE r.code = 'group_leader';

INSERT IGNORE INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM access_role r
JOIN access_permission p ON p.code IN ('teacher.workload.read','teacher.assignment.review','teacher.grade.write','teacher.sheet.fill')
WHERE r.code = 'teacher';

INSERT IGNORE INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM access_role r
JOIN access_permission p ON p.code IN ('student.manage','group.manage','teaching_assignment.manage','assessment.manage','sheet.manage','debt.manage')
WHERE r.code IN ('dean_staff','dean');

INSERT IGNORE INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM access_role r
JOIN access_permission p ON p.code IN ('schedule.manage')
WHERE r.code = 'scheduler';

INSERT IGNORE INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM access_role r
JOIN access_permission p ON p.code IN ('student.manage','group.manage','curriculum.manage','teaching_assignment.manage','schedule.manage','assessment.manage','sheet.manage','debt.manage','audit.read')
WHERE r.code IN ('education_office','university_admin');

INSERT IGNORE INTO role_permission (role_id, permission_id)
SELECT r.id, p.id FROM access_role r
JOIN access_permission p ON p.code IN ('role.manage','audit.read','system.manage')
WHERE r.code = 'system_admin';
