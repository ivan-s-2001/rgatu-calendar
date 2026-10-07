<?php

declare(strict_types=1);

namespace App\Domain\Auth;

use App\Infrastructure\Database\Database;

final readonly class AccessRepository
{
    public function __construct(
        private Database $database,
    ) {}

    public function forUser(int $userId): array
    {
        $sql = <<<'SQL'
SELECT
    ura.id AS assignment_id,
    r.code AS role_code,
    r.name AS role_name,
    ura.org_unit_id,
    ou.name AS org_unit_name,
    ura.group_id,
    sg.code AS group_code,
    ura.valid_from,
    ura.valid_to,
    p.code AS permission_code
FROM user_role_assignment ura
JOIN access_role r ON r.id = ura.role_id
LEFT JOIN role_permission rp ON rp.role_id = r.id
LEFT JOIN access_permission p ON p.id = rp.permission_id
LEFT JOIN org_unit ou ON ou.id = ura.org_unit_id
LEFT JOIN student_group sg ON sg.id = ura.group_id
WHERE ura.user_id = :user_id
  AND (ura.valid_from IS NULL OR ura.valid_from <= CURRENT_DATE())
  AND (ura.valid_to IS NULL OR ura.valid_to >= CURRENT_DATE())
ORDER BY r.code, ura.id, p.code
SQL;

        $statement = $this->database->pdo()->prepare($sql);
        $statement->execute(['user_id' => $userId]);
        $rows = $statement->fetchAll();

        $assignments = [];
        $permissions = [];

        foreach ($rows as $row) {
            $id = (int) $row['assignment_id'];

            if (!isset($assignments[$id])) {
                $assignments[$id] = [
                    'id' => $id,
                    'role' => [
                        'code' => $row['role_code'],
                        'name' => $row['role_name'],
                    ],
                    'scope' => [
                        'orgUnitId' => $row['org_unit_id'] !== null ? (int) $row['org_unit_id'] : null,
                        'orgUnitName' => $row['org_unit_name'],
                        'groupId' => $row['group_id'] !== null ? (int) $row['group_id'] : null,
                        'groupCode' => $row['group_code'],
                    ],
                    'validFrom' => $row['valid_from'],
                    'validTo' => $row['valid_to'],
                ];
            }

            if ($row['permission_code'] !== null) {
                $permissions[$row['permission_code']] = true;
            }
        }

        $roleCodes = array_values(array_unique(array_map(
            static fn(array $assignment): string => $assignment['role']['code'],
            array_values($assignments),
        )));

        return [
            'assignments' => array_values($assignments),
            'permissions' => array_keys($permissions),
            'surfaces' => $this->surfacesForRoles($roleCodes),
        ];
    }

    private function surfacesForRoles(array $roles): array
    {
        $surfaces = [];

        if (array_intersect($roles, ['student', 'group_leader'])) {
            $surfaces[] = 'student';
        }

        if (in_array('teacher', $roles, true)) {
            $surfaces[] = 'teacher';
        }

        if (array_intersect($roles, [
            'department_staff',
            'department_head',
            'dean_staff',
            'dean',
            'scheduler',
            'education_office',
            'university_admin',
            'system_admin',
        ])) {
            $surfaces[] = 'admin';
        }

        return array_values(array_unique($surfaces));
    }
}
