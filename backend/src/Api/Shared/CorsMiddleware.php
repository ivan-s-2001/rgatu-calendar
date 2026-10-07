<?php

declare(strict_types=1);

namespace App\Api\Shared;

use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

final readonly class CorsMiddleware implements MiddlewareInterface
{
    public function __construct(
        private ResponseFactoryInterface $responseFactory,
    ) {}

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $requestOrigin = $request->getHeaderLine('Origin');
        $allowedOrigins = array_values(array_filter(array_map(
            static fn(string $origin): string => trim($origin),
            explode(',', getenv('APP_CORS_ORIGINS') ?: ''),
        )));

        $allowOrigin = '';
        if ($requestOrigin !== '' && in_array($requestOrigin, $allowedOrigins, true)) {
            $allowOrigin = $requestOrigin;
        }

        if (strtoupper($request->getMethod()) === 'OPTIONS') {
            $response = $this->responseFactory->createResponse($allowOrigin === '' ? 403 : 204);
        } else {
            $response = $handler->handle($request);
        }

        if ($allowOrigin === '') {
            return $response->withHeader('Vary', 'Origin');
        }

        return $response
            ->withHeader('Access-Control-Allow-Origin', $allowOrigin)
            ->withHeader('Access-Control-Allow-Credentials', 'true')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
            ->withHeader('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, If-None-Match, X-CSRF-Token')
            ->withHeader('Access-Control-Max-Age', '86400')
            ->withHeader('Vary', 'Origin');
    }
}
