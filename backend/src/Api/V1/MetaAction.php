<?php

declare(strict_types=1);

namespace App\Api\V1;

use App\Api\Shared\JsonResponseFactory;
use App\Shared\ApplicationParams;
use Psr\Http\Message\ResponseInterface;

final readonly class MetaAction
{
    public function __construct(
        private JsonResponseFactory $responses,
        private ApplicationParams $application,
    ) {}

    public function __invoke(): ResponseInterface
    {
        return $this->responses->success([
            'name' => $this->application->name,
            'version' => $this->application->version,
            'apiVersion' => 'v1',
            'institution' => [
                'id' => 'rsatu',
                'name' => 'РГАТУ им. П. А. Соловьёва',
            ],
            'modules' => [
                'profile',
                'schedule',
                'sessions',
                'academic-work',
                'debts',
                'services',
                'notifications',
            ],
        ]);
    }
}
