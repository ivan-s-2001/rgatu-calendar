<?php

declare(strict_types=1);

namespace App\Api\V1\Auth;

use App\Api\Shared\JsonResponseFactory;
use App\Domain\Auth\AuthService;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use RuntimeException;

final readonly class LoginAction
{
    public function __construct(
        private JsonResponseFactory $responses,
        private AuthService $auth,
    ) {}

    public function __invoke(ServerRequestInterface $request): ResponseInterface
    {
        $body = $request->getParsedBody();
        $login = is_array($body) ? trim((string) ($body['login'] ?? '')) : '';
        $password = is_array($body) ? (string) ($body['password'] ?? '') : '';

        if ($login === '' || $password === '') {
            return $this->responses->error('Login and password are required.', 422);
        }

        try {
            $result = $this->auth->login(
                $login,
                $password,
                $request->getHeaderLine('User-Agent') ?: null,
                $request->getServerParams()['REMOTE_ADDR'] ?? null,
            );
        } catch (RuntimeException $e) {
            if ($e->getMessage() === 'INVALID_CREDENTIALS') {
                return $this->responses->error('Invalid login or password.', 401);
            }
            throw $e;
        }

        return $this->responses
            ->success([
                'user' => $result['user'],
                'csrfToken' => $result['csrfToken'],
            ])
            ->withHeader('Set-Cookie', $this->cookie(
                $result['sessionToken'],
                $result['ttl'],
            ));
    }

    private function cookie(string $token, int $ttl): string
    {
        $secure = filter_var(
            getenv('AUTH_COOKIE_SECURE') ?: 'true',
            FILTER_VALIDATE_BOOLEAN,
        );

        return sprintf(
            '%s=%s; Path=/; Max-Age=%d; HttpOnly;%s SameSite=Lax',
            AuthService::COOKIE_NAME,
            rawurlencode($token),
            $ttl,
            $secure ? ' Secure;' : '',
        );
    }
}
