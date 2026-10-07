<?php

declare(strict_types=1);

namespace App\Domain\Auth;

use App\Infrastructure\Database\Database;
use DateInterval;
use DateTimeImmutable;
use DateTimeZone;
use PDO;

final readonly class SessionRepository
{
    public function __construct(
        private Database $database,
    ) {}

    public function create(
        int $userId,
        string $tokenHash,
        string $csrfHash,
        int $ttlSeconds,
        ?string $userAgent,
        ?string $ipHash,
    ): array {
        $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
        $expiresAt = $now->add(new DateInterval('PT' . $ttlSeconds . 'S'));

        $sql = <<<'SQL'
INSERT INTO auth_session (
    user_id, token_hash, csrf_token_hash, created_at,
    last_seen_at, expires_at, user_agent, ip_hash
) VALUES (
    :user_id, :token_hash, :csrf_token_hash, :created_at,
    :last_seen_at, :expires_at, :user_agent, :ip_hash
)
SQL;

        $statement = $this->database->pdo()->prepare($sql);
        $statement->execute([
            'user_id' => $userId,
            'token_hash' => $tokenHash,
            'csrf_token_hash' => $csrfHash,
            'created_at' => $now->format('Y-m-d H:i:s'),
            'last_seen_at' => $now->format('Y-m-d H:i:s'),
            'expires_at' => $expiresAt->format('Y-m-d H:i:s'),
            'user_agent' => $userAgent,
            'ip_hash' => $ipHash,
        ]);

        return [
            'id' => (int) $this->database->pdo()->lastInsertId(),
            'expiresAt' => $expiresAt,
        ];
    }

    public function findActiveByTokenHash(string $tokenHash): ?array
    {
        $statement = $this->database->pdo()->prepare(<<<'SQL'
SELECT s.id, s.user_id, s.csrf_token_hash, s.created_at,
       s.last_seen_at, s.expires_at, u.status AS user_status
FROM auth_session s
JOIN user_account u ON u.id = s.user_id
WHERE s.token_hash = :token_hash
  AND s.revoked_at IS NULL
  AND s.expires_at > UTC_TIMESTAMP()
LIMIT 1
SQL);
        $statement->execute(['token_hash' => $tokenHash]);
        $row = $statement->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : $row;
    }

    public function touch(int $sessionId): void
    {
        $statement = $this->database->pdo()->prepare(
            'UPDATE auth_session SET last_seen_at = UTC_TIMESTAMP() WHERE id = :id',
        );
        $statement->execute(['id' => $sessionId]);
    }

    public function rotateCsrf(int $sessionId, string $csrfHash): void
    {
        $statement = $this->database->pdo()->prepare(
            'UPDATE auth_session SET csrf_token_hash = :csrf WHERE id = :id AND revoked_at IS NULL',
        );
        $statement->execute(['id' => $sessionId, 'csrf' => $csrfHash]);
    }

    public function revoke(int $sessionId): void
    {
        $statement = $this->database->pdo()->prepare(
            'UPDATE auth_session SET revoked_at = UTC_TIMESTAMP() WHERE id = :id AND revoked_at IS NULL',
        );
        $statement->execute(['id' => $sessionId]);
    }
}
