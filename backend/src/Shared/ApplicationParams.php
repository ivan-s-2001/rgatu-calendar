<?php

declare(strict_types=1);

namespace App\Shared;

final readonly class ApplicationParams
{
    public function __construct(
        public string $name = 'RGATU Student API',
        public string $version = '0.1.0',
    ) {}
}
