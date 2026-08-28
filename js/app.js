import { LANGUAGES, resolveLanguage } from "./config.js";
import { loadLanguageData } from "./services/data-loader.js";
import { createHistory } from "./services/history.js";
import { createTranslator } from "./services/translator.js";

const language = resolveLanguage();
const config = LANGUAGES[language];
const state = { data: null, reverse: false, activeTopic: null, translator: null, history: createHistory(config.historyKey) };
const $ = selector => document.querySelector(selector);

function escapeHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function localText(row) {
  return row?.[config.targetKey] || "";
}

function phraseHtml(row, className = "phrase") {
  return `<div class="${className}"><div class="ko">${escapeHtml(row.ko)}</div><div class="${config.targetKey}">${escapeHtml(localText(row))}</div>${row.pron ? `<div class="pron">${escapeHtml(row.pron)}</div>` : ""}</div>`;
}

function renderBasic() {
  const icons = ["👋", "🙏", "🍽️", "☕", "📍", "💬", "🔤"];
  $("#basicList").innerHTML = state.data.basic.map((group, index) => {
    const content = group.subcategories?.length
      ? `<div class="basic-sub-list">${group.subcategories.map((sub, subIndex) => `<div class="basic-subitem"><button class="basic-sub-toggle" data-sub="${index}-${subIndex}" type="button"><span class="basic-sub-title">🔤 ${escapeHtml(sub.title)}</span><span class="basic-count">${sub.phrases.length}</span><span class="basic-sub-arrow">⌄</span></button><div class="basic-sub-panel" data-sub-panel="${index}-${subIndex}"><div class="phrase-list">${sub.phrases.map(row => phraseHtml(row)).join("")}</div></div></div>`).join("")}</div>`
      : `<div class="phrase-list">${(group.phrases || []).map(row => phraseHtml(row)).join("")}</div>`;
    const count = group.phrases?.length || group.subcategories?.reduce((sum, sub) => sum + sub.phrases.length, 0) || 0;
    return `<div class="basic-item"><button class="basic-toggle" data-basic="${index}" type="button"><span class="basic-icon">${icons[index] || "💡"}</span><span class="basic-title"><span class="basic-ko">${escapeHtml(group.korean)}</span><span class="basic-id">${escapeHtml(group.local)}</span></span><span class="basic-count">${count}</span><span class="basic-arrow">⌄</span></button><div class="basic-panel" data-basic-panel="${index}">${content}</div></div>`;
  }).join("");
}

function renderTopics() {
  $("#topicPicker").innerHTML = Object.entries(state.data.topics).map(([key, topic]) => {
    const title = topic.title || key;
    const emoji = title.match(/^\p{Extended_Pictographic}/u)?.[0] || "💬";
    return `<button class="topic" data-topic="${escapeHtml(key)}" type="button"><span class="emoji">${emoji}</span><div class="ko">${escapeHtml(title)}</div><div class="${config.targetKey}">${topic.q?.length || 0} questions</div></button>`;
  }).join("");
}

function renderQuestionList(key) {
  const topic = state.data.topics[key];
  state.activeTopic = key;
  $("#topicPicker").hidden = true;
  $("#talkFlow").innerHTML = `<button class="back" data-action="topics" type="button"><span class="back-arrow">‹</span> 주제 선택</button><div class="section-title"><h2>${escapeHtml(topic.title)}</h2><p>질문을 누르면 답변 예시가 열립니다</p></div><div class="question-btn-list">${topic.q.map((question, index) => `<div class="q-item"><button class="question-btn" data-question="${index}" type="button"><span class="qnum">${index + 1}</span><span class="qtext"><span class="t-${config.targetKey}">${escapeHtml(localText(question))}</span><span class="t-pron">${escapeHtml(question.pron || "")}</span><span class="t-ko">${escapeHtml(question.ko)}</span></span><span class="qtoggle">⌄</span></button><div class="q-panel" data-question-panel="${index}">${renderChoices(question, index)}</div></div>`).join("")}</div>`;
}

function renderChoices(question, questionIndex) {
  return `<div class="choice-label">ANSWER EXAMPLES</div><div class="choice-list">${(question.choices || []).map((choice, choiceIndex) => `<div class="choice-item"><button class="choice-btn" data-choice="${questionIndex}-${choiceIndex}" type="button"><span class="ctext"><span class="t-${config.targetKey}">${escapeHtml(localText(choice))}</span><span class="t-pron">${escapeHtml(choice.pron || "")}</span><span class="t-ko">${escapeHtml(choice.ko)}</span></span><span class="ctoggle">⌄</span></button><div class="followup-list" data-followups="${questionIndex}-${choiceIndex}"><div class="fl-label">FOLLOW-UP QUESTIONS</div>${(choice.followups || []).map((item, index) => `<div class="followup-item"><div class="fnum">${index + 1}</div><span class="t-${config.targetKey}">${escapeHtml(localText(item))}</span><span class="t-pron">${escapeHtml(item.pron || "")}</span><span class="t-ko">${escapeHtml(item.ko)}</span></div>`).join("")}</div></div>`).join("")}</div>`;
}

function showTab(tab) {
  for (const section of document.querySelectorAll("main > .screen")) section.hidden = section.id !== tab;
  for (const button of document.querySelectorAll("[data-tab]")) button.classList.toggle("active", button.dataset.tab === tab);
  scrollTo({ top: 0, behavior: "smooth" });
}

function togglePair(button, panel) {
  const open = !button.classList.contains("open");
  button.classList.toggle("open", open);
  panel?.classList.toggle("open", open);
}

function updateDirection() {
  $("#dirFrom").textContent = state.reverse ? `${config.flag} ${config.label}` : "🇰🇷 한국어";
  $("#dirTo").textContent = state.reverse ? "🇰🇷 한국어" : `${config.flag} ${config.label}`;
}

function renderResult(input, result) {
  const tag = result.provider === "offline" ? "오프라인 문구" : "온라인 번역";
  const tagClass = result.provider === "offline" ? "tag-offline" : "tag-online";
  $("#trResult").innerHTML = `<div class="result-card"><span class="result-tag ${tagClass}">${tag}</span><div class="result-src">${escapeHtml(input)}</div><div class="result-main">${escapeHtml(result.output)}</div>${result.pronunciation ? `<div class="result-pron">${escapeHtml(result.pronunciation)}</div>` : ""}<div class="result-actions"><button class="res-btn primary" data-copy="${escapeHtml(result.output)}" type="button">복사</button><button class="res-btn" data-fill="${escapeHtml(result.output)}" type="button">다시 사용</button></div></div>`;
}

function renderHistory() {
  const entries = state.history.all();
  $("#trHistoryWrap").hidden = entries.length === 0;
  $("#trHistory").innerHTML = entries.map((entry, index) => `<button class="hist-item" data-history="${index}" type="button"><div class="h-out">${escapeHtml(entry.output)}</div><div class="h-in">${escapeHtml(entry.input)}</div></button>`).join("");
}

async function runTranslate() {
  const input = $("#srcText").value.trim();
  if (!input) return;
  const button = $("#translateBtn");
  button.disabled = true;
  button.textContent = "번역 중…";
  try {
    const result = await state.translator.translate(input, state.reverse);
    renderResult(input, result);
    state.history.add({ input, output: result.output, pronunciation: result.pronunciation, direction: state.reverse ? "reverse" : "forward" });
    renderHistory();
  } catch (error) {
    $("#trResult").innerHTML = `<div class="result-card"><span class="result-tag tag-error">번역 실패</span><div class="result-main">${escapeHtml(error.message)}</div></div>`;
  } finally {
    button.disabled = false;
    button.textContent = "번역하기";
  }
}

function bindEvents() {
  document.addEventListener("click", async event => {
    const target = event.target.closest("button");
    if (!target) return;
    if (target.dataset.tab) return showTab(target.dataset.tab);
    if (target.dataset.basic) return togglePair(target, document.querySelector(`[data-basic-panel="${target.dataset.basic}"]`));
    if (target.dataset.sub) return togglePair(target, document.querySelector(`[data-sub-panel="${target.dataset.sub}"]`));
    if (target.dataset.topic) return renderQuestionList(target.dataset.topic);
    if (target.dataset.action === "topics") { $("#topicPicker").hidden = false; $("#talkFlow").innerHTML = ""; return; }
    if (target.dataset.question) return togglePair(target, document.querySelector(`[data-question-panel="${target.dataset.question}"]`));
    if (target.dataset.choice) return togglePair(target, document.querySelector(`[data-followups="${target.dataset.choice}"]`));
    if (target.id === "swapBtn") { state.reverse = !state.reverse; updateDirection(); return; }
    if (target.id === "translateBtn") return runTranslate();
    if (target.id === "clearBtn") { $("#srcText").value = ""; $("#trResult").innerHTML = ""; $("#charCount").textContent = "0자"; return; }
    if (target.id === "historyClear") { state.history.clear(); renderHistory(); return; }
    if (target.dataset.copy) { await navigator.clipboard.writeText(target.dataset.copy); target.textContent = "복사됨"; return; }
    if (target.dataset.fill) { $("#srcText").value = target.dataset.fill; $("#charCount").textContent = `${target.dataset.fill.length}자`; return; }
    if (target.dataset.history) { const item = state.history.all()[Number(target.dataset.history)]; $("#srcText").value = item.input; $("#charCount").textContent = `${item.input.length}자`; }
  });
  $("#srcText").addEventListener("input", event => { $("#charCount").textContent = `${event.target.value.length}자`; });
  $("#srcText").addEventListener("keydown", event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); runTranslate(); } });
}

async function start() {
  try {
    state.data = await loadLanguageData(config);
    state.translator = createTranslator(state.data, config);
    document.title = `${config.title} · HelloWorld`;
    $("#appTitle").textContent = config.title;
    $("#appSubtitle").textContent = config.subtitle;
    renderBasic();
    renderTopics();
    updateDirection();
    renderHistory();
    bindEvents();
    $("#app").setAttribute("aria-busy", "false");
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js");
  } catch (error) {
    $("#appSubtitle").textContent = error.message;
    $("#app").setAttribute("aria-busy", "false");
  }
}

start();
