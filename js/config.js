export const LANGUAGES = {
  id: {
    dataUrl: "./data/indonesia.json",
    title: "Halo Indonesia",
    subtitle: "인도네시아 현장 회화 도우미",
    label: "Bahasa Indonesia",
    flag: "🇮🇩",
    targetKey: "id",
    historyKey: "helloworld-id-history",
    translateCode: "id"
  },
  vi: {
    dataUrl: "./data/vietnam.json",
    title: "Xin chào Việt Nam",
    subtitle: "베트남 현장 회화 도우미",
    label: "Tiếng Việt",
    flag: "🇻🇳",
    targetKey: "vi",
    historyKey: "helloworld-vi-history",
    translateCode: "vi"
  }
};

export function resolveLanguage() {
  const requested = new URLSearchParams(location.search).get("lang") || document.documentElement.dataset.lang;
  return Object.hasOwn(LANGUAGES, requested) ? requested : "id";
}
