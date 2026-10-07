<?php

declare(strict_types=1);

use App\Api\V1\GroupsAction;
use App\Api\V1\HealthAction;
use App\Api\V1\MetaAction;
use Yiisoft\Router\Route;

return [
    Route::get('/')->action(MetaAction::class)->name('app/index'),
    Route::get('/api/v1/meta')->action(MetaAction::class)->name('api/v1/meta'),
    Route::get('/api/v1/health')->action(HealthAction::class)->name('api/v1/health'),
    Route::get('/api/v1/groups')->action(GroupsAction::class)->name('api/v1/groups'),
];
