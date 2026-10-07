<?php

declare(strict_types=1);

namespace App\Api\V1\Auth;

use App\Api\Shared\JsonResponseFactory;
use App\Domain\Auth\AuthService;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final readonly class LogoutAction
{
    public function __construct(
        private JsonResponseFactory $responses,
        private AuthService $auth,
    ) {}

    public function __invoke(ServerRequestInterface $request): ResponseInterface
    {
        $resolved = $this->auth->resolve(
            $request->getCookieParams()[AuthService::COOKIE_NAME] ?? null,
        );

        if ($resolved === null) {
            return $this->responses->success(null)
                ->withHeader('Set-Cookie', $this->clearCookie());
        }

        if (!$this->auth->validateCsrf(
            $resolved['session'],
            $request->getHeaderLine('X-CSRF-Token') ?: null,
        )) {
            return $this->responses->error('Invalid CSRF token.', 403);
        }

        $this->auth->revoke((int) $resolved['session']['id']);

        return $this->responses->success(null)
            ->withHeader('Set-Cookie', $this->clearCookie());
    }

    private function clearCookie(): string
    {
        $secure = filter_var(
            getenv('AUTH_COOKIE_SECURE') ?: 'true',
            FILTER_VALIDATE_BOOLEAN,
        );

        return AuthService::COOKIE_NAME
            . '=; Path=/; Max-Age=0; HttpOnly;'
            . ($secure ? ' Secure;' : '')
            . ' SameSite=Lax';
    }
}
