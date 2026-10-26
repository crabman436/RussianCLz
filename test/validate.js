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


// ---- grammar data ----
(function () {
  const G = require(path.join(__dirname, "..", "js", "grammar.js"));
  const items = C.buildItems(VOCAB);
  const headwords = new Set(items.map((i) => C.normalizeRu(i.ru)));
  const seen = new Set();
  G.NOUNS.forEach((n, i) => {
    const where = `noun ${i} (${n[0]})`;
    assert(n.length === 6, `${where}: expected 6 fields`);
    assert(["m", "f", "n", "pl"].includes(n[1]), `${where}: bad gender`);
    assert(G.GENDER_RULES[n[2]], `${where}: unknown gender rule ${n[2]}`);
    assert(!LATIN.test(n[0]), `${where}: Latin letters in word`);
    assert(!seen.has(n[0]), `${where}: duplicate noun`);
    seen.add(n[0]);
    assert(headwords.has(C.normalizeRu(n[0])), `${where}: not in the vocabulary list`);
    if (n[3]) {
      assert(G.PLURAL_RULES[n[4]], `${where}: unknown plural rule ${n[4]}`);
      assert(!LATIN.test(n[3]), `${where}: Latin letters in plural`);
      if (n[4] === "spell7") { assert(/[гкхжчшщ]и$/.test(C.stripStress(n[3])), `${where}: spell7 plural should end in 7-letter + и`); }
      if (n[4] === "hard-y") { assert(/ы$/.test(C.stripStress(n[3].split("|")[0])), `${where}: hard-y plural should end in ы`); }
      if (n[4] === "indecl") { assert(n[3] === n[0], `${where}: indeclinable plural must equal singular`); }
    } else {
      assert(n[4] === null, `${where}: plural rule without plural`);
    }
    if (n[1] === "pl") { assert(n[2] === "pl-only" && !n[3], `${where}: plural-only noun misconfigured`); }
  });
  G.ADJECTIVES.forEach((a, i) => {
    const where = `adjective ${i} (${a[0]})`;
    assert(a.length === 6, `${where}: expected 6 fields`);
    const forms = a.slice(0, 4).map(C.stripStress);
    assert(["all", "person", "thing"].includes(a[5]), `${where}: bad fit tag`);
    if (forms[0].length <= 4) { return; } // possessives (мой, наш, чей) have their own forms
    assert(/(ый|ий|ой)$/.test(forms[0]), `${where}: odd masculine form`);
    assert(/(ая|ья)$/.test(forms[1]), `${where}: feminine should end in -ая`);
    assert(/(ое|ее|оё|ьё)$/.test(forms[2]), `${where}: neuter should end in -ое/-ее`);
    assert(/(ые|ие|ьи)$/.test(forms[3]), `${where}: plural should end in -ые/-ие`);
    if (/[гкхжчшщ]ый$/.test(forms[0]) || /[гкхжчшщ]ые$/.test(forms[3])) { fail(`${where}: violates the 7-letter rule`); }
  });
  G.LESSONS.forEach((l) => assert(G.DRILLS[l.drill], `lesson ${l.id}: unknown drill`));

  let seed = 7;
  const rng = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  Object.keys(G.DRILLS).forEach((kind) => {
    const qs = G.DRILLS[kind].build(C, rng);
    assert(qs.length >= 20, `${kind}: too few questions`);
    const ids = new Set();
    qs.forEach((q) => {
      assert(!ids.has(q.id), `${kind}: duplicate question id ${q.id}`);
      ids.add(q.id);
      assert(q.options.filter((o) => o.correct).length === 1, `${kind} ${q.id}: expected exactly one correct option`);
      assert(new Set(q.options.map((o) => C.normalizeRu(o.label))).size === q.options.length, `${kind} ${q.id}: duplicate options`);
      assert(q.options.length === (kind === "spelling" ? 2 : 4), `${kind} ${q.id}: wrong option count`);
      const correct = q.options.find((o) => o.correct).label;
      assert(C.normalizeRu(correct) === C.normalizeRu(q.answer) || (kind === "gender"), `${kind} ${q.id}: correct option does not match answer`);
      assert(typeof q.explain === "string" && q.explain.length > 10, `${kind} ${q.id}: missing explanation`);
    });
  });
  console.log(`grammar: ${G.NOUNS.length} nouns, ${G.ADJECTIVES.length} adjectives, ${Object.keys(G.DRILLS).map((k) => k + "=" + G.DRILLS[k].build(C, rng).length).join(" ")}`);
})();

if (failures) { console.error(`${failures} check(s) failed`); process.exit(1); }
console.log("All checks passed.");
