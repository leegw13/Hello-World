function normalize(value) {
  return String(value || "").toLocaleLowerCase().replace(/[\s.,!?~·"'’“”()\-]/g, "");
}

function collectPhrases(data, targetKey) {
  const rows = [...(data.vocab || []), ...(data.extra || [])];
  for (const group of data.basic || []) {
    rows.push(...(group.phrases || []));
    for (const sub of group.subcategories || []) rows.push(...(sub.phrases || []));
  }
  for (const topic of Object.values(data.topics || {})) {
    for (const question of topic.q || []) {
      rows.push(question);
      for (const choice of question.choices || []) {
        rows.push(choice, ...(choice.followups || []));
      }
    }
  }
  return rows.filter(row => row.ko && row[targetKey]);
}

export function createTranslator(data, config) {
  const phrases = collectPhrases(data, config.targetKey);

  function local(text, reverse) {
    const key = reverse ? config.targetKey : "ko";
    const query = normalize(text);
    const exact = phrases.find(row => normalize(row[key]) === query);
    if (exact) return { output: exact[reverse ? "ko" : config.targetKey], pronunciation: reverse ? "" : exact.pron, provider: "offline" };
    return null;
  }

  async function online(text, reverse) {
    const source = reverse ? config.translateCode : "ko";
    const target = reverse ? "ko" : config.translateCode;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("온라인 번역 서비스에 연결할 수 없습니다.");
    const payload = await response.json();
    const output = payload?.responseData?.translatedText;
    if (!output) throw new Error("번역 결과가 없습니다.");
    return { output, pronunciation: "", provider: "online" };
  }

  return {
    async translate(text, reverse) {
      return local(text, reverse) || online(text, reverse);
    }
  };
}
