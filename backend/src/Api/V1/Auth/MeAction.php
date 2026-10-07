<?php

declare(strict_types=1);

namespace App\Api\V1\Auth;

use App\Api\Shared\JsonResponseFactory;
use App\Domain\Auth\AuthService;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final readonly class MeAction
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
            return $this->responses->error('Authentication required.', 401);
        }

        $csrfToken = $this->auth->issueCsrf((int) $resolved['session']['id']);

        return $this->responses->success([
            'user' => $resolved['user'],
            'csrfToken' => $csrfToken,
        ]);
    }
}
