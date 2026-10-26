// Pure game logic, shared by the browser app and the node tests.
(function (root) {
  "use strict";

  var MAX_LEVEL = 4;
  // Days until the next review after reaching a given mastery level (Clozemaster-style).
  var INTERVALS_DAYS = [0, 1, 10, 30, 180];
  var DAY_MS = 24 * 60 * 60 * 1000;
  var POINTS = { mc: 4, text: 8 };

  // Normalize Russian text for comparison: strip stress marks, lowercase, ё -> е, drop punctuation.
  function normalizeRu(s) {
    return String(s || "")
      .normalize("NFD")
      .replace(/\u0301/g, "")
      .normalize("NFC")
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(/[?!.,;:«»"()]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function stripStress(s) {
    return String(s || "").normalize("NFD").replace(/\u0301/g, "").normalize("NFC");
  }

  function buildItems(vocab) {
    var seen = {};
    return vocab.map(function (row, index) {
      var m = row[3].match(/\{\{(.+?)\}\}/);
      if (!m) { throw new Error("No {{cloze}} in sentence: " + row[3]); }
      var id = normalizeRu(row[1]) + "|" + row[0];
      if (seen[id]) { throw new Error("Duplicate id: " + id); }
      seen[id] = true;
      return {
        id: id,
        index: index,
        cat: row[0],
        ru: row[1],
        en: row[2],
        sentence: row[3],
        before: row[3].slice(0, m.index),
        answer: m[1],
        after: row[3].slice(m.index + m[0].length),
        translation: row[4],
        note: row[5] || ""
      };
    });
  }

  function categoriesOf(items) {
    var out = [];
    items.forEach(function (it) { if (out.indexOf(it.cat) < 0) { out.push(it.cat); } });
    return out;
  }

  function shuffle(arr, rng) {
    rng = rng || Math.random;
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Make `word` start with the same case as `model` so the correct answer doesn't stand out.
  function matchCase(word, model) {
    if (!word) { return word; }
    var first = model.charAt(0);
    var upper = first !== first.toLowerCase();
    return (upper ? word.charAt(0).toUpperCase() : word.charAt(0).toLowerCase()) + word.slice(1);
  }

  // Four multiple-choice options: the answer plus three distractors, same category first.
  function pickOptions(item, items, rng) {
    rng = rng || Math.random;
    var used = {};
    used[normalizeRu(item.answer)] = true;
    var picks = [];
    function take(pool) {
      shuffle(pool, rng).forEach(function (o) {
        if (picks.length >= 3) { return; }
        var k = normalizeRu(o.answer);
        if (used[k]) { return; }
        used[k] = true;
        picks.push(o);
      });
    }
    take(items.filter(function (o) { return o.cat === item.cat && o.id !== item.id; }));
    if (picks.length < 3) { take(items.filter(function (o) { return o.cat !== item.cat; })); }
    var options = picks.map(function (o) {
      return { label: matchCase(stripStress(o.answer), item.answer), correct: false };
    });
    options.push({ label: item.answer, correct: true });
    return shuffle(options, rng);
  }

  function isCorrect(input, item) {
    return normalizeRu(input) === normalizeRu(item.answer);
  }

  function entryFor(progress, id) {
    return progress[id] || { level: 0, next: 0, seen: 0, correct: 0, wrong: 0 };
  }

  function isDue(entry, now) {
    return entry.seen > 0 && entry.next <= now;
  }

  // Pick the sentences for one round.
  // mode: "review" (due only), "new" (unseen only, list order), "mixed" (due, then new, then practice)
  function selectRound(items, progress, opts) {
    var now = opts.now || Date.now();
    var size = opts.size || 10;
    var pool = opts.category ? items.filter(function (i) { return i.cat === opts.category; }) : items;
    var due = pool.filter(function (i) { return isDue(entryFor(progress, i.id), now); })
      .sort(function (a, b) { return entryFor(progress, a.id).next - entryFor(progress, b.id).next; });
    var fresh = pool.filter(function (i) { return entryFor(progress, i.id).seen === 0; });
    var rest = pool.filter(function (i) {
      var e = entryFor(progress, i.id);
      return e.seen > 0 && !isDue(e, now);
    }).sort(function (a, b) { return entryFor(progress, a.id).level - entryFor(progress, b.id).level; });

    var chosen;
    if (opts.mode === "review") {
      chosen = due.slice(0, size);
    } else if (opts.mode === "new") {
      chosen = fresh.slice(0, size);
    } else {
      chosen = due.slice(0, size);
      if (chosen.length < size) { chosen = chosen.concat(fresh.slice(0, size - chosen.length)); }
      if (chosen.length < size) { chosen = chosen.concat(shuffle(rest, opts.rng).slice(0, size - chosen.length)); }
    }
    return opts.mode === "new" ? chosen : shuffle(chosen, opts.rng);
  }

  // Update one progress entry after an answer. Correct: +1 level. Wrong: back to 0 (like Clozemaster).
  function applyAnswer(entry, correct, now) {
    var e = {
      level: entry.level || 0, next: entry.next || 0, seen: entry.seen || 0,
      correct: entry.correct || 0, wrong: entry.wrong || 0
    };
    e.seen += 1;
    e.last = now;
    if (correct) {
      e.correct += 1;
      e.level = Math.min(MAX_LEVEL, e.level + 1);
      e.next = now + INTERVALS_DAYS[e.level] * DAY_MS;
    } else {
      e.wrong += 1;
      e.level = 0;
      e.next = now;
    }
    return e;
  }

  function summarize(items, progress, now) {
    now = now || Date.now();
    var s = { total: items.length, levels: [0, 0, 0, 0, 0], due: 0, fresh: 0, mastered: 0 };
    items.forEach(function (i) {
      var e = entryFor(progress, i.id);
      if (e.seen === 0) { s.fresh += 1; }
      s.levels[e.level] += 1;
      if (isDue(e, now)) { s.due += 1; }
      if (e.level === MAX_LEVEL) { s.mastered += 1; }
    });
    return s;
  }

  var api = {
    MAX_LEVEL: MAX_LEVEL,
    INTERVALS_DAYS: INTERVALS_DAYS,
    POINTS: POINTS,
    normalizeRu: normalizeRu,
    stripStress: stripStress,
    buildItems: buildItems,
    categoriesOf: categoriesOf,
    shuffle: shuffle,
    matchCase: matchCase,
    pickOptions: pickOptions,
    isCorrect: isCorrect,
    entryFor: entryFor,
    isDue: isDue,
    selectRound: selectRound,
    applyAnswer: applyAnswer,
    summarize: summarize
  };

  if (typeof module !== "undefined" && module.exports) { module.exports = api; }
  else { root.ClozeCore = api; }
})(typeof window !== "undefined" ? window : this);
