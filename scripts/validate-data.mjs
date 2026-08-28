import { readFile, readdir } from "node:fs/promises";

const files = (await readdir(new URL("../data/", import.meta.url)))
  .filter(file => file.endsWith(".json"));
let failures = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ✗ ${message}`);
    failures += 1;
  }
}

function validatePhrase(phrase, targetKey, path) {
  assert(phrase && typeof phrase === "object", `${path}: 객체여야 합니다.`);
  assert(typeof phrase?.ko === "string" && phrase.ko.trim(), `${path}.ko가 필요합니다.`);
  assert(typeof phrase?.[targetKey] === "string" && phrase[targetKey].trim(), `${path}.${targetKey}가 필요합니다.`);
  if (phrase?.pron !== undefined) assert(typeof phrase.pron === "string", `${path}.pron은 문자열이어야 합니다.`);
}

for (const file of files) {
  const data = JSON.parse(await readFile(new URL(`../data/${file}`, import.meta.url), "utf8"));
  const targetKey = data.language;
  console.log(`검증: ${file}`);
  assert(["id", "vi"].includes(targetKey), `${file}: 지원하지 않는 language입니다.`);
  assert(Array.isArray(data.basic), `${file}.basic은 배열이어야 합니다.`);
  assert(data.topics && typeof data.topics === "object", `${file}.topics가 필요합니다.`);
  assert(Array.isArray(data.vocab), `${file}.vocab은 배열이어야 합니다.`);
  assert(Array.isArray(data.extra), `${file}.extra는 배열이어야 합니다.`);

  for (const [groupIndex, group] of (data.basic || []).entries()) {
    assert(typeof group.korean === "string", `basic[${groupIndex}].korean이 필요합니다.`);
    for (const [index, phrase] of (group.phrases || []).entries()) validatePhrase(phrase, targetKey, `basic[${groupIndex}].phrases[${index}]`);
    for (const [subIndex, sub] of (group.subcategories || []).entries()) {
      assert(typeof sub.title === "string", `basic[${groupIndex}].subcategories[${subIndex}].title이 필요합니다.`);
      for (const [index, phrase] of (sub.phrases || []).entries()) validatePhrase(phrase, targetKey, `basic[${groupIndex}].subcategories[${subIndex}].phrases[${index}]`);
    }
  }
  for (const [topicKey, topic] of Object.entries(data.topics || {})) {
    assert(typeof topic.title === "string", `topics.${topicKey}.title이 필요합니다.`);
    for (const [qIndex, question] of (topic.q || []).entries()) {
      validatePhrase(question, targetKey, `topics.${topicKey}.q[${qIndex}]`);
      for (const [cIndex, choice] of (question.choices || []).entries()) {
        validatePhrase(choice, targetKey, `topics.${topicKey}.q[${qIndex}].choices[${cIndex}]`);
        for (const [fIndex, followup] of (choice.followups || []).entries()) validatePhrase(followup, targetKey, `topics.${topicKey}.q[${qIndex}].choices[${cIndex}].followups[${fIndex}]`);
      }
    }
  }
  for (const [index, phrase] of (data.vocab || []).entries()) validatePhrase(phrase, targetKey, `vocab[${index}]`);
  for (const [index, phrase] of (data.extra || []).entries()) validatePhrase(phrase, targetKey, `extra[${index}]`);
}

if (failures) {
  console.error(`\n${failures}개 데이터 오류를 발견했습니다.`);
  process.exit(1);
}
console.log(`\n${files.length}개 언어 데이터 검증 완료`);
