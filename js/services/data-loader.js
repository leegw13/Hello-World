export async function loadLanguageData(config) {
  const response = await fetch(config.dataUrl, { cache: "no-cache" });
  if (!response.ok) throw new Error(`언어 데이터 요청 실패 (${response.status})`);
  const data = await response.json();
  if (!Array.isArray(data.basic) || !data.topics || !Array.isArray(data.vocab)) {
    throw new Error("언어 데이터 형식이 올바르지 않습니다.");
  }
  return data;
}
