<?php

declare(strict_types=1);

namespace App\Infrastructure\Database;

use PDO;

final class Database
{
    private ?PDO $pdo = null;

    public function pdo(): PDO
    {
        if ($this->pdo instanceof PDO) {
            return $this->pdo;
        }

        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $port = getenv('DB_PORT') ?: '3306';
        $name = getenv('DB_NAME') ?: 'rgatu_student';
        $user = getenv('DB_USER') ?: 'rgatu';
        $password = getenv('DB_PASSWORD') ?: '';

        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            $host,
            $port,
            $name,
        );

        $this->pdo = new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        return $this->pdo;
    }

    public function isAlive(): bool
    {
        $value = $this->pdo()->query('SELECT 1')->fetchColumn();
        return $value === 1 || $value === '1';
    }
}
