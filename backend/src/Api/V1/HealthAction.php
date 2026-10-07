<?php

declare(strict_types=1);

namespace App\Api\V1;

use App\Api\Shared\JsonResponseFactory;
use App\Infrastructure\Database\Database;
use Psr\Http\Message\ResponseInterface;
use Throwable;

final readonly class HealthAction
{
    public function __construct(
        private JsonResponseFactory $responses,
        private Database $database,
    ) {}

    public function __invoke(): ResponseInterface
    {
        try {
            $database = $this->database->isAlive();
        } catch (Throwable $e) {
            return $this->responses->error(
                'Database is unavailable.',
                503,
                ['database' => 'down'],
            );
        }

        return $this->responses->success([
            'api' => 'up',
            'database' => $database ? 'up' : 'down',
        ], $database ? 200 : 503);
    }
}
