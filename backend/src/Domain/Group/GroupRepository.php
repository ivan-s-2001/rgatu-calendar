<?php

declare(strict_types=1);

namespace App\Domain\Group;

use App\Infrastructure\Database\Database;

final readonly class GroupRepository
{
    public function __construct(
        private Database $database,
    ) {}

    public function all(): array
    {
        $sql = <<<'SQL'
SELECT
    g.id,
    g.code,
    g.course,
    g.study_form,
    ou.code AS faculty_code,
    ou.name AS faculty_name
FROM student_group g
LEFT JOIN org_unit ou ON ou.id = g.org_unit_id
WHERE g.is_active = 1
ORDER BY g.code
SQL;

        return $this->database->pdo()->query($sql)->fetchAll();
    }
}
