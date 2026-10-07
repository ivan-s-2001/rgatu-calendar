<?php

declare(strict_types=1);

use App\Api\V1\Auth\LoginAction;
use App\Api\V1\Auth\LogoutAction;
use App\Api\V1\Auth\MeAction;
use App\Api\V1\GroupsAction;
use App\Api\V1\HealthAction;
use App\Api\V1\MetaAction;
use Yiisoft\Router\Route;

return [
    Route::get('/')->action(MetaAction::class)->name('app/index'),
    Route::get('/api/v1/meta')->action(MetaAction::class)->name('api/v1/meta'),
    Route::get('/api/v1/health')->action(HealthAction::class)->name('api/v1/health'),

    Route::post('/api/v1/auth/login')->action(LoginAction::class)->name('api/v1/auth/login'),
    Route::post('/api/v1/auth/logout')->action(LogoutAction::class)->name('api/v1/auth/logout'),
    Route::get('/api/v1/me')->action(MeAction::class)->name('api/v1/me'),

    Route::get('/api/v1/groups')->action(GroupsAction::class)->name('api/v1/groups'),
];
