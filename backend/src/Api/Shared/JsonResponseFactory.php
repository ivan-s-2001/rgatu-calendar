<?php

declare(strict_types=1);

namespace App\Api\Shared;

use JsonException;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\StreamFactoryInterface;

final readonly class JsonResponseFactory
{
    public function __construct(
        private ResponseFactoryInterface $responseFactory,
        private StreamFactoryInterface $streamFactory,
    ) {}

    /**
     * @throws JsonException
     */
    public function success(array|object|null $data = null, int $status = 200): ResponseInterface
    {
        return $this->json([
            'status' => 'success',
            'data' => $data,
        ], $status);
    }

    /**
     * @throws JsonException
     */
    public function error(string $message, int $status = 400, array|object|null $data = null): ResponseInterface
    {
        return $this->json([
            'status' => 'failed',
            'error_message' => $message,
            'error_data' => $data,
        ], $status);
    }

    /**
     * @throws JsonException
     */
    private function json(array $payload, int $status): ResponseInterface
    {
        $body = json_encode(
            $payload,
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR,
        );

        return $this->responseFactory
            ->createResponse($status)
            ->withHeader('Content-Type', 'application/json; charset=utf-8')
            ->withBody($this->streamFactory->createStream($body));
    }
}
