// Validates the vocabulary data and exercises the core logic. Run with: npm test
"use strict";
const path = require("path");
const VOCAB = require(path.join(__dirname, "..", "js", "data.js"));
const C = require(path.join(__dirname, "..", "js", "core.js"));

let failures = 0;
function fail(msg) { failures += 1; console.error("FAIL: " + msg); }
function assert(cond, msg) { if (!cond) { fail(msg); } }

// ---- data checks ----
const LATIN = /[A-Za-z]/;
VOCAB.forEach((row, i) => {
  const where = `row ${i} (${row[1]})`;
  assert(Array.isArray(row) && (row.length === 5 || row.length === 6), `${where}: expected 5 or 6 fields`);
  row.forEach((f, j) => assert(typeof f === "string" && f.trim().length > 0, `${where}: field ${j} empty`));
  const matches = row[3].match(/\{\{.+?\}\}/g) || [];
  assert(matches.length === 1, `${where}: sentence must contain exactly one {{blank}}`);
  if (matches.length === 1) {
    const answer = matches[0].slice(2, -2);
    assert(C.normalizeRu(answer) === C.normalizeRu(row[1]), `${where}: blank "${answer}" does not match headword "${row[1]}"`);
  }
  assert(!LATIN.test(row[1]), `${where}: Latin letters in headword`);
  assert(!LATIN.test(row[3]), `${where}: Latin letters in Russian sentence`);
  assert(!/[Ѐ-ӿ]/.test(row[4]), `${where}: Cyrillic in English translation`);
});

let items;
try { items = C.buildItems(VOCAB); } catch (e) { fail(e.message); }

if (items) {
  const cats = C.categoriesOf(items);
  console.log(`${items.length} items in ${cats.length} categories`);

  // ---- multiple choice ----
  let seed = 42;
  const rng = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  items.forEach((item) => {
    const opts = C.pickOptions(item, items, rng);
    assert(opts.length === 4, `${item.ru}: expected 4 options`);
    assert(opts.filter((o) => o.correct).length === 1, `${item.ru}: expected one correct option`);
    const labels = new Set(opts.map((o) => C.normalizeRu(o.label)));
    assert(labels.size === 4, `${item.ru}: duplicate option labels ${JSON.stringify(opts.map((o) => o.label))}`);
    const firstIsUpper = (s) => s.charAt(0) !== s.charAt(0).toLowerCase();
    assert(opts.every((o) => firstIsUpper(o.label) === firstIsUpper(item.answer)), `${item.ru}: option casing gives away the answer`);
  });

  // ---- answer checking ----
  const privet = items.find((i) => i.ru === "Приве́т");
  assert(C.isCorrect("привет", privet), "lowercase answer accepted");
  assert(C.isCorrect("  Приве́т ", privet), "stress marks and whitespace ignored");
  assert(!C.isCorrect("пока", privet), "wrong answer rejected");
  const chyo = items.find((i) => i.ru === "Чьё?");
  assert(C.isCorrect("чье", chyo), "ё/е treated as equal");

  // ---- spaced repetition ----
  const now = Date.UTC(2026, 0, 1);
  let e = C.entryFor({}, "x");
  e = C.applyAnswer(e, true, now);
  assert(e.level === 1 && e.next === now + 1 * 86400000, "first correct answer -> level 1, due in 1 day");
  e = C.applyAnswer(e, true, now);
  assert(e.level === 2 && e.next === now + 10 * 86400000, "second correct -> level 2, due in 10 days");
  e = C.applyAnswer(e, false, now);
  assert(e.level === 0 && e.next === now && e.wrong === 1, "wrong answer resets to level 0 and is due now");
  for (let k = 0; k < 6; k++) { e = C.applyAnswer(e, true, now); }
  assert(e.level === C.MAX_LEVEL, "level caps at MAX_LEVEL");

  // ---- round selection ----
  const progress = {};
  progress[items[0].id] = { level: 1, next: now - 1, seen: 1, correct: 1, wrong: 0 };   // due
  progress[items[1].id] = { level: 2, next: now + 1e9, seen: 2, correct: 2, wrong: 0 }; // not due
  const review = C.selectRound(items, progress, { mode: "review", size: 10, now, rng });
  assert(review.length === 1 && review[0].id === items[0].id, "review round contains only due items");
  const fresh = C.selectRound(items, progress, { mode: "new", size: 5, now, rng });
  assert(fresh.length === 5 && fresh.every((i) => !progress[i.id]), "new round contains only unseen items");
  assert(fresh[0].id === items[2].id, "new round follows list order");
  const mixed = C.selectRound(items, progress, { mode: "mixed", size: 10, now, rng, category: items[0].cat });
  assert(mixed.length === Math.min(10, items.filter((i) => i.cat === items[0].cat).length), "mixed round is filled to size");
  assert(mixed.some((i) => i.id === items[0].id), "mixed round includes due item");
  assert(mixed.every((i) => i.cat === items[0].cat), "category filter respected");

  const summary = C.summarize(items, progress, now);
  assert(summary.due === 1 && summary.fresh === items.length - 2, "summary counts due and fresh");
}

if (failures) { console.error(`${failures} check(s) failed`); process.exit(1); }
console.log("All checks passed.");
