# RussianCLz

A Clozemaster-style trainer for the **First Year Russian Word List 4**: 300 fill-in-the-blank sentences across 20 categories (greetings, family, clothing, housing, numbers, adjectives and more).

Each turn shows a Russian sentence with one word missing and its English translation. Pick the word from four choices, or type it. Correct answers raise a sentence's mastery (0% → 25% → 50% → 75% → 100%) and schedule it for review later; a wrong answer drops it back to 0%, just like Clozemaster.

## Run it

No build step and no dependencies. Either:

- open `index.html` in a browser, or
- run `npm start` and open <http://localhost:8080>.

Pushing to `main` deploys the app to GitHub Pages via the included workflow (enable Pages → Source: GitHub Actions in the repository settings once).

## Grammar lessons and drills

The home screen also has a **Grammar** section with four short lessons written around the same words, each with a drill:

| Lesson | Drill |
| --- | --- |
| Noun gender (endings, -ь words, папа/дядя, -мя, indeclinables, plural-only nouns) | Is the noun masculine, feminine, neuter or plural only? |
| Nominative plural (-ы/-и/-а/-я, fleeting vowels, stressed -а́, -ья, irregulars) | Type or choose the plural |
| The 7-letter spelling rule (г к х ж ч ш щ + и, never ы; note on the 5-letter rule) | ы or и? ый or ий? |
| Adjective endings (-ый/-ий/-ой, -ая, -ое/-ее, -ые/-ие, agreement, possessives) | Pick the form that agrees with the noun |

Every drill answer comes with a one-line explanation of the rule that applies. Questions you miss are weighted to come back sooner.

## Features

- **Review / Learn new / Mixed** rounds, per category or across the whole list
- **Multiple choice** (4 points) or **typing** (8 points); typing ignores stress marks, case and ё/е
- Spaced repetition: a sentence comes back after 1, 10, 30 and 180 days as its mastery grows
- Score, streaks, per-collection progress, and a browse view of every word with its sentence
- Word notes from the list (gender, plural forms, feminine forms, pronunciation hints)
- Optional read-aloud using the browser's Russian voice
- Progress lives in `localStorage`; export/import it as JSON to move between devices
- Keyboard: `1`–`4` choose, `Enter` submit / next, `Esc` home

## Project layout

| Path | What it is |
| --- | --- |
| `js/data.js` | The vocabulary: `[category, headword, English, sentence with {{blank}}, translation, note]` |
| `js/core.js` | Pure game logic (normalisation, option picking, round selection, spaced repetition) |
| `js/grammar.js` | Noun gender/plural data, adjective forms, lesson text and drill question generators |
| `js/app.js` | UI rendering, keyboard handling, persistence |
| `css/style.css` | Styles |
| `test/validate.js` | Data validation and logic tests (`npm test`) |

## Adding or editing words

Edit `js/data.js` for sentences, or `js/grammar.js` for nouns, plurals and adjectives. Each sentence row needs exactly one `{{blank}}` in the sentence whose text matches the headword (stress marks are optional). Run `npm test` to check the data: it also catches stray Latin letters inside Russian text and duplicate entries.
