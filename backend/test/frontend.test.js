import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../../app/src/main/assets/app.js', import.meta.url), 'utf8');
const parse = runInNewContext(source.slice(source.indexOf('function parseRecord('), source.indexOf('function lessons(')) + '; parseRecord;');

test('university records retain assessment type separately from the teacher', () => {
  const fixtures = [
    ['ЗИС-24 Экология Зачет Курочкина Т.Н. 2-201', 'Экология', 'Зачет', 'Курочкина Т.Н.', '2-201', 'credit'],
    ['ЗИС-24 Объектно-ориентированное программирование Экзамен Беляев А.Е. Г-529', 'Объектно-ориентированное программирование', 'Экзамен', 'Беляев А.Е.', 'Г-529', 'exam'],
    ['ЗИС-24 Объектно-ориентированное программирование Защита Беляев А.Е. Г-529', 'Объектно-ориентированное программирование', 'Защита', 'Беляев А.Е.', 'Г-529', 'credit'],
    ['ЗИС-24 Физика Консультация Иванова-Петрова А.Б. Г-523', 'Физика', 'Консультация', 'Иванова-Петрова А.Б.', 'Г-523', 'consult'],
    ['ЗТС1-24 ЗТС2-24 Французский язык Экзамен Тихомирова С.В. 3-202', 'Французский язык', 'Экзамен', 'Тихомирова С.В.', '3-202', 'exam'],
  ];
  for (const [raw, subject, type, teacher, room, category] of fixtures) {
    const value = parse(raw, { kind: 'groups', name: 'ЗИС-24' });
    assert.deepEqual([value.subject, value.type, value.teacher, value.room, value.category], [subject, type, teacher, room, category]);
    assert.equal(value.raw, raw);
  }
});
