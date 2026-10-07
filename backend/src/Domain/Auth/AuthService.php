<?php

declare(strict_types=1);

namespace App\Domain\Auth;

use RuntimeException;

final readonly class AuthService
{
    public const COOKIE_NAME = 'rgatu_session';

    public function __construct(
        private UserRepository $users,
        private SessionRepository $sessions,
        private AccessRepository $access,
    ) {}

    public function login(
        string $login,
        string $password,
        ?string $userAgent,
        ?string $ipAddress,
    ): array {
        $user = $this->users->findByLogin($login);

        if (
            $user === null
            || $user['status'] !== 'active'
            || !is_string($user['password_hash'])
            || $user['password_hash'] === ''
            || !password_verify($password, $user['password_hash'])
        ) {
            throw new RuntimeException('INVALID_CREDENTIALS');
        }

        $token = bin2hex(random_bytes(32));
        $csrfToken = bin2hex(random_bytes(32));
        $ttl = max(900, (int) (getenv('AUTH_SESSION_TTL') ?: 43200));

        $session = $this->sessions->create(
            (int) $user['id'],
            hash('sha256', $token),
            hash('sha256', $csrfToken),
            $ttl,
            $userAgent,
            $ipAddress !== null && $ipAddress !== '' ? hash('sha256', $ipAddress) : null,
        );

        $this->users->markLogin((int) $user['id']);

        return [
            'sessionId' => $session['id'],
            'sessionToken' => $token,
            'csrfToken' => $csrfToken,
            'ttl' => $ttl,
            'user' => $this->me((int) $user['id']),
        ];
    }

    public function resolve(?string $token): ?array
    {
        if ($token === null || $token === '') {
            return null;
        }

        $session = $this->sessions->findActiveByTokenHash(hash('sha256', $token));

        if ($session === null || $session['user_status'] !== 'active') {
            return null;
        }

        $this->sessions->touch((int) $session['id']);

        return [
            'session' => $session,
            'user' => $this->me((int) $session['user_id']),
        ];
    }

    public function issueCsrf(int $sessionId): string
    {
        $token = bin2hex(random_bytes(32));
        $this->sessions->rotateCsrf($sessionId, hash('sha256', $token));

        return $token;
    }

    public function validateCsrf(array $session, ?string $csrfToken): bool
    {
        if (
            $csrfToken === null
            || $csrfToken === ''
            || !isset($session['csrf_token_hash'])
            || !is_string($session['csrf_token_hash'])
            || $session['csrf_token_hash'] === ''
        ) {
            return false;
        }

        return hash_equals(
            $session['csrf_token_hash'],
            hash('sha256', $csrfToken),
        );
    }

    public function revoke(int $sessionId): void
    {
        $this->sessions->revoke($sessionId);
    }

    private function me(int $userId): array
    {
        $user = $this->users->findById($userId);

        if ($user === null) {
            throw new RuntimeException('USER_NOT_FOUND');
        }

        $middle = trim((string) ($user['middle_name'] ?? ''));
        $fullName = trim(implode(' ', array_filter([
            $user['last_name'],
            $user['first_name'],
            $middle !== '' ? $middle : null,
        ])));

        return [
            'id' => (int) $user['id'],
            'login' => $user['login'],
            'person' => [
                'id' => (int) $user['person_id'],
                'firstName' => $user['first_name'],
                'lastName' => $user['last_name'],
                'middleName' => $user['middle_name'],
                'fullName' => $fullName,
            ],
            'access' => $this->access->forUser($userId),
        ];
    }
}
