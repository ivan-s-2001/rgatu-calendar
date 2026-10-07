<?php

declare(strict_types=1);

namespace App\Domain\Auth;

use App\Infrastructure\Database\Database;
use PDO;

final readonly class UserRepository
{
    public function __construct(
        private Database $database,
    ) {}

    public function findByLogin(string $login): ?array
    {
        $sql = <<<'SQL'
SELECT
    u.id,
    u.login,
    u.status,
    u.password_hash,
    p.id AS person_id,
    p.last_name,
    p.first_name,
    p.middle_name
FROM user_account u
JOIN person p ON p.id = u.person_id
WHERE u.login = :login
LIMIT 1
SQL;

        $statement = $this->database->pdo()->prepare($sql);
        $statement->execute(['login' => $login]);
        $row = $statement->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : $row;
    }

    public function findById(int $userId): ?array
    {
        $sql = <<<'SQL'
SELECT
    u.id,
    u.login,
    u.status,
    p.id AS person_id,
    p.last_name,
    p.first_name,
    p.middle_name
FROM user_account u
JOIN person p ON p.id = u.person_id
WHERE u.id = :id
LIMIT 1
SQL;

        $statement = $this->database->pdo()->prepare($sql);
        $statement->execute(['id' => $userId]);
        $row = $statement->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : $row;
    }

    public function markLogin(int $userId): void
    {
        $statement = $this->database->pdo()->prepare(
            'UPDATE user_account SET last_login_at = UTC_TIMESTAMP() WHERE id = :id',
        );
        $statement->execute(['id' => $userId]);
    }
}
