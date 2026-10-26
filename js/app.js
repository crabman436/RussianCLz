// UI layer: renders views into #app and keeps progress in localStorage.
(function () {
  "use strict";

  var C = window.ClozeCore;
  var ITEMS = C.buildItems(window.VOCAB);
  var CATEGORIES = C.categoriesOf(ITEMS);
  var STORAGE_KEY = "russianclz-v1";
  var LEVEL_LABELS = ["0%", "25%", "50%", "75%", "100%"];

  var state = loadState();
  var view = { name: "home" };
  var round = null;
  var app = document.getElementById("app");

  // ---------- persistence ----------
  function defaultState() {
    return {
      progress: {},
      score: 0,
      answered: 0,
      correctTotal: 0,
      bestStreak: 0,
      settings: { mode: "mc", roundSize: 10, translation: "always", category: "", tts: true }
    };
  }
  function loadState() {
    var s = defaultState();
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        s.progress = saved.progress || {};
        s.score = saved.score || 0;
        s.answered = saved.answered || 0;
        s.correctTotal = saved.correctTotal || 0;
        s.bestStreak = saved.bestStreak || 0;
        Object.keys(s.settings).forEach(function (k) {
          if (saved.settings && saved.settings[k] !== undefined) { s.settings[k] = saved.settings[k]; }
        });
      }
    } catch (e) { /* ignore corrupt storage */ }
    return s;
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }

  // ---------- helpers ----------
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function h(strings) {
    var out = strings[0];
    for (var i = 1; i < arguments.length; i++) { out += arguments[i] + strings[i]; }
    return out;
  }
  function masteryDots(level) {
    var dots = "";
    for (var i = 1; i <= C.MAX_LEVEL; i++) {
      dots += '<span class="dot' + (i <= level ? " on" : "") + '"></span>';
    }
    return '<span class="mastery" title="Mastery ' + LEVEL_LABELS[level] + '">' + dots + "</span>";
  }
  function activeItems() {
    var cat = state.settings.category;
    return cat ? ITEMS.filter(function (i) { return i.cat === cat; }) : ITEMS;
  }
  function speak(text) {
    if (!state.settings.tts || !window.speechSynthesis) { return; }
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(C.stripStress(text));
      u.lang = "ru-RU";
      var voice = window.speechSynthesis.getVoices().filter(function (v) { return /^ru/i.test(v.lang); })[0];
      if (voice) { u.voice = voice; }
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } catch (e) { /* no speech support */ }
  }
  function hasRussianVoice() {
    if (!window.speechSynthesis) { return false; }
    return window.speechSynthesis.getVoices().some(function (v) { return /^ru/i.test(v.lang); });
  }

  // ---------- rendering ----------
  function render() {
    if (view.name === "home") { renderHome(); }
    else if (view.name === "play") { renderPlay(); }
    else if (view.name === "summary") { renderSummary(); }
    else if (view.name === "browse") { renderBrowse(); }
    window.scrollTo(0, 0);
  }

  function renderHome() {
    var items = activeItems();
    var s = C.summarize(items, state.progress);
    var set = state.settings;
    var pct = function (n) { return s.total ? Math.round((n / s.total) * 100) : 0; };
    var accuracy = state.answered ? Math.round((state.correctTotal / state.answered) * 100) : 0;

    var catOptions = '<option value="">All categories (' + ITEMS.length + ")</option>" + CATEGORIES.map(function (c) {
      var n = ITEMS.filter(function (i) { return i.cat === c; }).length;
      return '<option value="' + esc(c) + '"' + (set.category === c ? " selected" : "") + ">" + esc(c) + " (" + n + ")</option>";
    }).join("");

    var catRows = CATEGORIES.map(function (c) {
      var ci = ITEMS.filter(function (i) { return i.cat === c; });
      var cs = C.summarize(ci, state.progress);
      var started = cs.total - cs.fresh;
      return h`<tr>
        <td><button class="link" data-action="browse" data-cat="${esc(c)}">${esc(c)}</button></td>
        <td class="num">${cs.total}</td>
        <td class="num">${started}</td>
        <td class="num ${cs.due ? "warn" : ""}">${cs.due}</td>
        <td class="num">${cs.mastered}</td>
        <td><button class="btn small" data-action="play-cat" data-cat="${esc(c)}">Play</button></td>
      </tr>`;
    }).join("");

    app.innerHTML = h`
      <header class="top">
        <div class="brand">Русский<span>Cloze</span></div>
        <div class="pills">
          <span class="pill" title="Total score">★ ${state.score}</span>
          <span class="pill" title="Accuracy">${accuracy}% acc</span>
        </div>
      </header>

      <section class="card">
        <div class="row between">
          <h2>Progress${set.category ? " · " + esc(set.category) : ""}</h2>
          <span class="muted">${s.total - s.fresh} / ${s.total} started · ${s.mastered} mastered</span>
        </div>
        <div class="bar">
          <div class="seg l1" style="width:${pct(s.levels[1])}%" title="25%: ${s.levels[1]}"></div>
          <div class="seg l2" style="width:${pct(s.levels[2])}%" title="50%: ${s.levels[2]}"></div>
          <div class="seg l3" style="width:${pct(s.levels[3])}%" title="75%: ${s.levels[3]}"></div>
          <div class="seg l4" style="width:${pct(s.levels[4])}%" title="100%: ${s.levels[4]}"></div>
        </div>
        <div class="legend">
          <span><i class="sw l0"></i>0% · ${s.levels[0]}</span>
          <span><i class="sw l1"></i>25% · ${s.levels[1]}</span>
          <span><i class="sw l2"></i>50% · ${s.levels[2]}</span>
          <span><i class="sw l3"></i>75% · ${s.levels[3]}</span>
          <span><i class="sw l4"></i>100% · ${s.levels[4]}</span>
        </div>
      </section>

      <section class="card">
        <h2>Play</h2>
        <div class="controls">
          <label>Collection
            <select data-setting="category">${catOptions}</select>
          </label>
          <label>Answer with
            <select data-setting="mode">
              <option value="mc"${set.mode === "mc" ? " selected" : ""}>Multiple choice (4 pts)</option>
              <option value="text"${set.mode === "text" ? " selected" : ""}>Typing (8 pts)</option>
            </select>
          </label>
          <label>Round size
            <select data-setting="roundSize">
              ${[5, 10, 20, 30].map(function (n) { return '<option value="' + n + '"' + (set.roundSize === n ? " selected" : "") + ">" + n + "</option>"; }).join("")}
            </select>
          </label>
          <label>Translation
            <select data-setting="translation">
              <option value="always"${set.translation === "always" ? " selected" : ""}>Show before answering</option>
              <option value="after"${set.translation === "after" ? " selected" : ""}>Show after answering</option>
            </select>
          </label>
        </div>
        <div class="play-buttons">
          <button class="btn primary big" data-action="play" data-mode="review" ${s.due ? "" : "disabled"}>
            Review <span class="count">${s.due} due</span>
          </button>
          <button class="btn big" data-action="play" data-mode="new" ${s.fresh ? "" : "disabled"}>
            Learn new <span class="count">${s.fresh} left</span>
          </button>
          <button class="btn big" data-action="play" data-mode="mixed">
            Mixed <span class="count">due + new</span>
          </button>
        </div>
        <p class="muted small">Review brings back sentences whose mastery timer has run out. Learn new goes through unseen words in list order. Wrong answers reset a sentence to 0%, like Clozemaster.</p>
      </section>

      <section class="card">
        <h2>Collections</h2>
        <div class="table-wrap">
        <table>
          <thead><tr><th>Category</th><th class="num">Words</th><th class="num">Started</th><th class="num">Due</th><th class="num">Mastered</th><th></th></tr></thead>
          <tbody>${catRows}</tbody>
        </table>
        </div>
      </section>

      <section class="card">
        <h2>Settings &amp; data</h2>
        <div class="row wrap gap">
          <label class="check"><input type="checkbox" data-setting="tts"${set.tts ? " checked" : ""}> Read sentences aloud after answering (needs a Russian voice in your browser)</label>
        </div>
        <div class="row wrap gap">
          <button class="btn small" data-action="export">Export progress</button>
          <label class="btn small">Import progress<input type="file" accept="application/json" data-action="import" hidden></label>
          <button class="btn small danger" data-action="reset">Reset all progress</button>
        </div>
        <p class="muted small">Best streak: ${state.bestStreak} · Answered: ${state.answered}. Progress is stored in this browser only; export it to move between devices.</p>
      </section>

      <footer class="muted small">Keyboard: <kbd>1</kbd>–<kbd>4</kbd> choose, <kbd>Enter</kbd> submit / next, <kbd>Esc</kbd> back home.</footer>
    `;
  }

  function renderPlay() {
    var item = round.items[round.index];
    var set = state.settings;
    var entry = C.entryFor(state.progress, item.id);
    var answered = round.answered;
    var showTranslation = set.translation === "always" || answered;

    var blank;
    if (!answered) {
      blank = '<span class="blank">' + "_".repeat(Math.max(4, Math.min(12, C.stripStress(item.answer).length))) + "</span>";
    } else {
      blank = '<span class="blank ' + (round.lastCorrect ? "ok" : "bad") + '">' + esc(item.answer) + "</span>";
    }

    var answerArea;
    if (!answered) {
      if (set.mode === "mc") {
        answerArea = '<div class="options">' + round.options.map(function (o, i) {
          return '<button class="btn option" data-action="choose" data-i="' + i + '"><kbd>' + (i + 1) + "</kbd> " + esc(o.label) + "</button>";
        }).join("") + "</div>";
      } else {
        answerArea = h`
          <form class="typing" data-action="submit">
            <input type="text" id="answer" autocomplete="off" autocapitalize="off" spellcheck="false" lang="ru" placeholder="Type the missing word…" autofocus>
            <button class="btn primary" type="submit">Check</button>
            <button class="btn" type="button" data-action="giveup">Show answer</button>
          </form>
          <p class="muted small">Stress marks, capitalisation and ё/е are ignored when checking.</p>`;
      }
    } else {
      var newEntry = C.entryFor(state.progress, item.id);
      answerArea = h`
        <div class="reveal ${round.lastCorrect ? "ok" : "bad"}">
          <div class="verdict">${round.lastCorrect ? "Correct! +" + round.lastPoints : "Incorrect" + (round.lastInput ? " — you wrote “" + esc(round.lastInput) + "”" : "")}</div>
          <div class="word">
            <span class="ru">${esc(item.ru)}</span>
            <span class="en">${esc(item.en)}</span>
          </div>
          ${item.note ? '<div class="note">' + esc(item.note) + "</div>" : ""}
          <div class="row between">
            <span class="muted small">Mastery: ${masteryDots(newEntry.level)} ${LEVEL_LABELS[newEntry.level]}${round.lastCorrect ? " · next review in " + C.INTERVALS_DAYS[newEntry.level] + " day" + (C.INTERVALS_DAYS[newEntry.level] === 1 ? "" : "s") : " · back to 0%"}</span>
            ${hasRussianVoice() ? '<button class="btn small" data-action="speak" title="Read aloud">🔊 Listen</button>' : ""}
          </div>
          <button class="btn primary big" data-action="next" id="next">${round.index + 1 < round.items.length ? "Next" : "Finish round"} <kbd>Enter</kbd></button>
        </div>`;
    }

    app.innerHTML = h`
      <header class="top">
        <button class="btn small" data-action="home">← Home</button>
        <div class="pills">
          <span class="pill">${round.index + 1} / ${round.items.length}</span>
          <span class="pill" title="Round score">+${round.points}</span>
          <span class="pill" title="Streak">🔥 ${round.streak}</span>
        </div>
      </header>
      <div class="progress"><div style="width:${Math.round((round.index / round.items.length) * 100)}%"></div></div>
      <section class="card play">
        <div class="row between meta">
          <span class="chip">${esc(item.cat)}</span>
          <span>${masteryDots(entry.level)} <span class="muted small">${LEVEL_LABELS[entry.level]}</span></span>
        </div>
        <p class="sentence" lang="ru">${esc(item.before)}${blank}${esc(item.after)}</p>
        <p class="translation ${showTranslation ? "" : "hidden"}">${esc(item.translation)}</p>
        ${answerArea}
      </section>
    `;
    var input = document.getElementById("answer");
    if (input) { input.focus(); }
  }

  function renderSummary() {
    var n = round.items.length;
    var rows = round.results.map(function (r) {
      return h`<tr class="${r.correct ? "ok" : "bad"}">
        <td>${r.correct ? "✓" : "✗"}</td>
        <td lang="ru">${esc(r.item.ru)}</td>
        <td>${esc(r.item.en)}</td>
        <td>${masteryDots(C.entryFor(state.progress, r.item.id).level)}</td>
      </tr>`;
    }).join("");
    app.innerHTML = h`
      <header class="top">
        <button class="btn small" data-action="home">← Home</button>
        <div class="pills"><span class="pill">★ ${state.score}</span></div>
      </header>
      <section class="card">
        <h2>Round complete</h2>
        <div class="stats">
          <div><b>${round.correct} / ${n}</b><span>correct</span></div>
          <div><b>+${round.points}</b><span>points</span></div>
          <div><b>${round.bestStreak}</b><span>best streak</span></div>
        </div>
        <div class="table-wrap"><table><tbody>${rows}</tbody></table></div>
        <div class="play-buttons">
          <button class="btn primary big" data-action="play" data-mode="${round.mode}">Play again (${round.mode})</button>
          <button class="btn big" data-action="home">Home</button>
        </div>
      </section>`;
  }

  function renderBrowse() {
    var cat = view.cat || CATEGORIES[0];
    var items = ITEMS.filter(function (i) { return i.cat === cat; });
    var tabs = CATEGORIES.map(function (c) {
      return '<button class="tab' + (c === cat ? " active" : "") + '" data-action="browse" data-cat="' + esc(c) + '">' + esc(c) + "</button>";
    }).join("");
    var rows = items.map(function (it) {
      var e = C.entryFor(state.progress, it.id);
      return h`<tr>
        <td lang="ru"><b>${esc(it.ru)}</b>${it.note ? '<div class="muted small">' + esc(it.note) + "</div>" : ""}</td>
        <td>${esc(it.en)}</td>
        <td lang="ru">${esc(it.before)}<u>${esc(it.answer)}</u>${esc(it.after)}<div class="muted small">${esc(it.translation)}</div></td>
        <td>${masteryDots(e.level)}</td>
      </tr>`;
    }).join("");
    app.innerHTML = h`
      <header class="top">
        <button class="btn small" data-action="home">← Home</button>
        <div class="pills"><button class="btn small primary" data-action="play-cat" data-cat="${esc(cat)}">Play ${esc(cat)}</button></div>
      </header>
      <section class="card">
        <div class="tabs">${tabs}</div>
        <div class="table-wrap"><table class="browse">
          <thead><tr><th>Word</th><th>Meaning</th><th>Sentence</th><th>Mastery</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
      </section>`;
  }

  // ---------- game flow ----------
  function startRound(mode, category) {
    if (category !== undefined) { state.settings.category = category; saveState(); }
    var items = C.selectRound(ITEMS, state.progress, {
      mode: mode, category: state.settings.category, size: state.settings.roundSize
    });
    if (!items.length) {
      alert(mode === "review" ? "Nothing is due for review right now." : "No new words left in this collection.");
      return;
    }
    round = { mode: mode, items: items, index: 0, answered: false, options: null,
      points: 0, correct: 0, streak: 0, bestStreak: 0, results: [] };
    prepareQuestion();
    view = { name: "play" };
    render();
  }
  function prepareQuestion() {
    var item = round.items[round.index];
    round.answered = false;
    round.lastInput = "";
    round.options = state.settings.mode === "mc" ? C.pickOptions(item, ITEMS) : null;
  }
  function answer(input, correct) {
    if (round.answered) { return; }
    var item = round.items[round.index];
    var now = Date.now();
    var entry = C.entryFor(state.progress, item.id);
    state.progress[item.id] = C.applyAnswer(entry, correct, now);
    var pts = correct ? C.POINTS[state.settings.mode] : 0;
    round.answered = true;
    round.lastCorrect = correct;
    round.lastInput = input;
    round.lastPoints = pts;
    round.points += pts;
    round.results.push({ item: item, correct: correct });
    if (correct) {
      round.correct += 1;
      round.streak += 1;
      round.bestStreak = Math.max(round.bestStreak, round.streak);
      state.correctTotal += 1;
    } else {
      round.streak = 0;
    }
    state.answered += 1;
    state.score += pts;
    state.bestStreak = Math.max(state.bestStreak, round.streak);
    saveState();
    render();
    speak(item.sentence.replace(/\{\{|\}\}/g, ""));
  }
  function next() {
    if (!round.answered) { return; }
    round.index += 1;
    if (round.index >= round.items.length) {
      view = { name: "summary" };
    } else {
      prepareQuestion();
    }
    render();
  }

  // ---------- data import/export ----------
  function exportProgress() {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "russianclz-progress.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  function importProgress(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        if (!data || typeof data.progress !== "object") { throw new Error("bad file"); }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        state = loadState();
        render();
      } catch (e) { alert("That file doesn't look like exported progress."); }
    };
    reader.readAsText(file);
  }

  // ---------- events ----------
  app.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-action]");
    if (!el) { return; }
    var action = el.getAttribute("data-action");
    if (action === "home") { view = { name: "home" }; render(); }
    else if (action === "play") { startRound(el.getAttribute("data-mode")); }
    else if (action === "play-cat") { startRound("mixed", el.getAttribute("data-cat")); }
    else if (action === "browse") { view = { name: "browse", cat: el.getAttribute("data-cat") }; render(); }
    else if (action === "choose") {
      var o = round.options[Number(el.getAttribute("data-i"))];
      answer(o.label, o.correct);
    }
    else if (action === "giveup") { answer("", false); }
    else if (action === "next") { next(); }
    else if (action === "speak") { speak(round.items[round.index].sentence.replace(/\{\{|\}\}/g, "")); }
    else if (action === "export") { exportProgress(); }
    else if (action === "reset") {
      if (confirm("Delete all progress and scores? This cannot be undone.")) {
        localStorage.removeItem(STORAGE_KEY);
        state = defaultState();
        render();
      }
    }
  });

  app.addEventListener("submit", function (ev) {
    var form = ev.target.closest("[data-action='submit']");
    if (!form) { return; }
    ev.preventDefault();
    var input = document.getElementById("answer").value;
    if (!input.trim()) { return; }
    answer(input, C.isCorrect(input, round.items[round.index]));
  });

  app.addEventListener("change", function (ev) {
    var el = ev.target;
    if (el.getAttribute("data-action") === "import") {
      if (el.files && el.files[0]) { importProgress(el.files[0]); }
      return;
    }
    var key = el.getAttribute("data-setting");
    if (!key) { return; }
    var value = el.type === "checkbox" ? el.checked : el.value;
    if (key === "roundSize") { value = Number(value); }
    state.settings[key] = value;
    saveState();
    if (key === "category") { render(); }
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.target.tagName === "INPUT" || ev.target.tagName === "SELECT") {
      if (ev.key === "Enter" && view.name === "play" && round.answered) { ev.preventDefault(); next(); }
      return;
    }
    if (ev.key === "Escape" && view.name !== "home") { view = { name: "home" }; render(); return; }
    if (view.name !== "play") { return; }
    if (round.answered && ev.key === "Enter") { ev.preventDefault(); next(); return; }
    if (!round.answered && round.options && /^[1-4]$/.test(ev.key)) {
      var o = round.options[Number(ev.key) - 1];
      if (o) { answer(o.label, o.correct); }
    }
  });

  if (window.speechSynthesis) { window.speechSynthesis.onvoiceschanged = function () { /* voices now loaded */ }; }
  render();
})();
