<?php

declare(strict_types=1);

namespace App\Api\V1;

use App\Api\Shared\JsonResponseFactory;
use App\Domain\Group\GroupRepository;
use Psr\Http\Message\ResponseInterface;
use Throwable;

final readonly class GroupsAction
{
    public function __construct(
        private JsonResponseFactory $responses,
        private GroupRepository $groups,
    ) {}

    public function __invoke(): ResponseInterface
    {
        try {
            return $this->responses->success($this->groups->all());
        } catch (Throwable $e) {
            return $this->responses->error(
                'Groups are temporarily unavailable.',
                503,
            );
        }
    }
}
