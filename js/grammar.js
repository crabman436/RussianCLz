// Grammar lessons and drills: noun gender, nominative plurals, the 7-letter spelling rule, adjective agreement.
(function (root) {
  "use strict";

  // Noun: [word, gender (m/f/n/pl), gender rule, plural (null = not drilled; "a|b" = alternatives), plural rule, English]
  var NOUNS = [
    // people
    ["студе́нт", "m", "cons", "студе́нты", "hard-y", "student"],
    ["студе́нтка", "f", "a-fem", "студе́нтки", "spell7", "student (f.)"],
    ["аспира́нт", "m", "cons", "аспира́нты", "hard-y", "graduate student"],
    ["пиани́ст", "m", "cons", "пиани́сты", "hard-y", "pianist"],
    ["журнали́ст", "m", "cons", "журнали́сты", "hard-y", "journalist"],
    ["журнали́стка", "f", "a-fem", "журнали́стки", "spell7", "journalist (f.)"],
    ["профе́ссор", "m", "cons", "профессора́", "stress-a", "professor"],
    ["арти́ст", "m", "cons", "арти́сты", "hard-y", "actor"],
    ["музыка́нт", "m", "cons", "музыка́нты", "hard-y", "musician"],
    ["программи́ст", "m", "cons", "программи́сты", "hard-y", "programmer"],
    ["профе́ссия", "f", "a-fem", "профе́ссии", "iya", "profession"],
    ["америка́нец", "m", "cons", "америка́нцы", "fleeting", "American"],
    ["америка́нка", "f", "a-fem", "америка́нки", "spell7", "American (f.)"],
    ["ру́сский", "m", "adj-m", "ру́сские", "adj", "Russian"],
    ["ру́сская", "f", "adj-f", "ру́сские", "adj", "Russian (f.)"],
    ["англича́нин", "m", "cons", "англича́не", "anin", "English person"],
    ["армяни́н", "m", "cons", "армя́не", "anin", "Armenian"],
    ["белору́с", "m", "cons", "белору́сы", "hard-y", "Belarusian"],
    ["ирла́ндец", "m", "cons", "ирла́ндцы", "fleeting", "Irish person"],
    ["испа́нец", "m", "cons", "испа́нцы", "fleeting", "Spaniard"],
    ["италья́нец", "m", "cons", "италья́нцы", "fleeting", "Italian"],
    ["кана́дец", "m", "cons", "кана́дцы", "fleeting", "Canadian"],
    ["кита́ец", "m", "cons", "кита́йцы", "fleeting", "Chinese person"],
    ["мексика́нец", "m", "cons", "мексика́нцы", "fleeting", "Mexican"],
    ["не́мец", "m", "cons", "не́мцы", "fleeting", "German"],
    ["россия́нин", "m", "cons", "россия́не", "anin", "Russian citizen"],
    ["тата́рин", "m", "cons", "тата́ры", "irregular", "Tatar"],
    ["узбе́к", "m", "cons", "узбе́ки", "spell7", "Uzbek"],
    ["украи́нец", "m", "cons", "украи́нцы", "fleeting", "Ukrainian"],
    ["францу́з", "m", "cons", "францу́зы", "hard-y", "French person"],
    ["япо́нец", "m", "cons", "япо́нцы", "fleeting", "Japanese person"],
    ["челове́к", "m", "cons", "лю́ди", "irregular", "person"],
    ["мужчи́на", "m", "a-masc", "мужчи́ны", "hard-y", "man"],
    ["де́вушка", "f", "a-fem", "де́вушки", "spell7", "young woman"],
    ["семья́", "f", "a-fem", "се́мьи", "soft-i", "family"],
    ["сестра́", "f", "a-fem", "сёстры", "stress", "sister"],
    ["брат", "m", "cons", "бра́тья", "ya", "brother"],
    ["мать", "f", "soft-f", "ма́тери", "irregular", "mother"],
    ["ма́ма", "f", "a-fem", "ма́мы", "hard-y", "mom"],
    ["оте́ц", "m", "cons", "отцы́", "fleeting", "father"],
    ["па́па", "m", "a-masc", "па́пы", "hard-y", "dad"],
    ["сын", "m", "cons", "сыновья́", "ya", "son"],
    ["дочь", "f", "soft-f", "до́чери", "irregular", "daughter"],
    ["ба́бушка", "f", "a-fem", "ба́бушки", "spell7", "grandmother"],
    ["де́душка", "m", "a-masc", "де́душки", "spell7", "grandfather"],
    ["внук", "m", "cons", "вну́ки", "spell7", "grandson"],
    ["вну́чка", "f", "a-fem", "вну́чки", "spell7", "granddaughter"],
    ["ребёнок", "m", "cons", "де́ти", "irregular", "child"],
    ["дя́дя", "m", "a-masc", "дя́ди", "soft-i", "uncle"],
    ["тётя", "f", "a-fem", "тёти", "soft-i", "aunt"],
    ["жена́", "f", "a-fem", "жёны", "stress", "wife"],
    ["муж", "m", "cons", "мужья́", "ya", "husband"],
    ["ко́шка", "f", "a-fem", "ко́шки", "spell7", "cat"],
    ["соба́ка", "f", "a-fem", "соба́ки", "spell7", "dog"],
    ["роди́тель", "m", "soft-m", "роди́тели", "soft-i", "parent"],
    ["хозя́ин", "m", "cons", "хозя́ева", "irregular", "landlord"],
    ["хозя́йка", "f", "a-fem", "хозя́йки", "spell7", "landlady"],
    ["сосе́д", "m", "cons", "сосе́ди", "irregular", "neighbor"],
    ["сосе́дка", "f", "a-fem", "сосе́дки", "spell7", "neighbor (f.)"],
    // clothing
    ["бейсбо́лка", "f", "a-fem", "бейсбо́лки", "spell7", "baseball cap"],
    ["блу́зка", "f", "a-fem", "блу́зки", "spell7", "blouse"],
    ["босоно́жки", "pl", "pl-only", null, null, "sandals"],
    ["боти́нки", "pl", "pl-only", null, null, "shoes"],
    ["брю́ки", "pl", "pl-only", null, null, "pants"],
    ["га́лстук", "m", "cons", "га́лстуки", "spell7", "necktie"],
    ["джи́нсы", "pl", "pl-only", null, null, "jeans"],
    ["костю́м", "m", "cons", "костю́мы", "hard-y", "suit"],
    ["ко́фта", "f", "a-fem", "ко́фты", "hard-y", "jersey"],
    ["кроссо́вки", "pl", "pl-only", null, null, "sneakers"],
    ["ку́ртка", "f", "a-fem", "ку́ртки", "spell7", "jacket"],
    ["ма́йка", "f", "a-fem", "ма́йки", "spell7", "tee-shirt"],
    ["носки́", "pl", "pl-only", null, null, "socks"],
    ["оде́жда", "f", "a-fem", null, null, "clothing"],
    ["очки́", "pl", "pl-only", null, null, "glasses"],
    ["пальто́", "n", "indecl", "пальто́", "indecl", "coat"],
    ["перча́тки", "pl", "pl-only", null, null, "gloves"],
    ["пиджа́к", "m", "cons", "пиджаки́", "spell7", "blazer"],
    ["пла́тье", "n", "o-neut", "пла́тья", "neut", "dress"],
    ["плащ", "m", "cons", "плащи́", "spell7", "raincoat"],
    ["реме́нь", "m", "soft-m", "ремни́", "fleeting", "belt"],
    ["руба́шка", "f", "a-fem", "руба́шки", "spell7", "shirt"],
    ["сапоги́", "pl", "pl-only", null, null, "boots"],
    ["сви́тер", "m", "cons", "сви́теры|свитера́", "hard-y", "sweater"],
    ["то́пик", "m", "cons", "то́пики", "spell7", "top"],
    ["ту́фли", "pl", "pl-only", null, null, "shoes"],
    ["футбо́лка", "f", "a-fem", "футбо́лки", "spell7", "sports shirt"],
    ["ша́пка", "f", "a-fem", "ша́пки", "spell7", "hat"],
    ["шарф", "m", "cons", "ша́рфы", "hard-y", "scarf"],
    ["шо́рты", "pl", "pl-only", null, null, "shorts"],
    ["ю́бка", "f", "a-fem", "ю́бки", "spell7", "skirt"],
    // furniture
    ["кре́сло", "n", "o-neut", "кре́сла", "neut", "armchair"],
    ["крова́ть", "f", "soft-f", "крова́ти", "soft-i", "bed"],
    ["ла́мпа", "f", "a-fem", "ла́мпы", "hard-y", "lamp"],
    ["радиобуди́льник", "m", "cons", "радиобуди́льники", "spell7", "clock-radio"],
    ["стол", "m", "cons", "столы́", "hard-y", "table"],
    ["стул", "m", "cons", "сту́лья", "ya", "chair"],
    ["телеви́зор", "m", "cons", "телеви́зоры", "hard-y", "television"],
    ["ту́мбочка", "f", "a-fem", "ту́мбочки", "spell7", "nightstand"],
    ["часы́", "pl", "pl-only", null, null, "clock, watch"],
    ["шкаф", "m", "cons", "шкафы́", "hard-y", "cabinet"],
    ["зе́ркало", "n", "o-neut", "зеркала́", "neut", "mirror"],
    ["карти́на", "f", "a-fem", "карти́ны", "hard-y", "picture"],
    // travel & household
    ["бага́ж", "m", "cons", null, null, "baggage"],
    ["бума́га", "f", "a-fem", null, null, "paper"],
    ["де́ньги", "pl", "pl-only", null, null, "money"],
    ["каранда́ш", "m", "cons", "карандаши́", "spell7", "pencil"],
    ["ключ", "m", "cons", "ключи́", "spell7", "key"],
    ["компью́тер", "m", "cons", "компью́теры", "hard-y", "computer"],
    ["меню́", "n", "indecl", "меню́", "indecl", "menu"],
    ["моби́льник", "m", "cons", "моби́льники", "spell7", "cellphone"],
    ["но́мер", "m", "cons", "номера́", "stress-a", "hotel room; number"],
    ["ноутбу́к", "m", "cons", "ноутбу́ки", "spell7", "laptop"],
    ["планше́т", "m", "cons", "планше́ты", "hard-y", "tablet"],
    ["пода́рок", "m", "cons", "пода́рки", "fleeting", "present"],
    ["ру́чка", "f", "a-fem", "ру́чки", "spell7", "pen"],
    ["рюкза́к", "m", "cons", "рюкзаки́", "spell7", "backpack"],
    ["смартфо́н", "m", "cons", "смартфо́ны", "hard-y", "smartphone"],
    ["су́мка", "f", "a-fem", "су́мки", "spell7", "bag"],
    ["телефо́н", "m", "cons", "телефо́ны", "hard-y", "telephone"],
    ["фо́то", "n", "indecl", "фо́то", "indecl", "photo"],
    ["фотогра́фия", "f", "a-fem", "фотогра́фии", "iya", "photograph"],
    ["чемода́н", "m", "cons", "чемода́ны", "hard-y", "suitcase"],
    ["та́почки", "pl", "pl-only", null, null, "slippers"],
    ["полоте́нце", "n", "o-neut", "полоте́нца", "neut", "towel"],
    ["маши́на", "f", "a-fem", "маши́ны", "hard-y", "car"],
    // places
    ["аэропо́рт", "m", "cons", "аэропо́рты", "hard-y", "airport"],
    ["буфе́т", "m", "cons", "буфе́ты", "hard-y", "snack bar"],
    ["гости́ница", "f", "a-fem", "гости́ницы", "tsy", "hotel"],
    ["кафе́", "n", "indecl", "кафе́", "indecl", "cafe"],
    ["музе́й", "m", "cons", "музе́и", "soft-i", "museum"],
    ["туале́т", "m", "cons", "туале́ты", "hard-y", "bathroom"],
    ["го́род", "m", "cons", "города́", "stress-a", "city"],
    ["а́дрес", "m", "cons", "адреса́", "stress-a", "address"],
    ["кварти́ра", "f", "a-fem", "кварти́ры", "hard-y", "apartment"],
    ["у́лица", "f", "a-fem", "у́лицы", "tsy", "street"],
    ["дом", "m", "cons", "дома́", "stress-a", "house"],
    ["ко́рпус", "m", "cons", "корпуса́", "stress-a", "building"],
    ["общежи́тие", "n", "o-neut", "общежи́тия", "ie-iya", "dorm"],
    ["ко́мната", "f", "a-fem", "ко́мнаты", "hard-y", "room"],
    ["ва́нная", "f", "adj-f", "ва́нные", "adj", "bathroom"],
    ["ку́хня", "f", "a-fem", "ку́хни", "soft-i", "kitchen"],
    ["балко́н", "m", "cons", "балко́ны", "hard-y", "balcony"],
    ["потоло́к", "m", "cons", "потолки́", "fleeting", "ceiling"],
    ["стена́", "f", "a-fem", "сте́ны", "stress", "wall"],
    ["магази́н", "m", "cons", "магази́ны", "hard-y", "store"],
    ["дверь", "f", "soft-f", "две́ри", "soft-i", "door"],
    ["гости́ная", "f", "adj-f", "гости́ные", "adj", "living room"],
    ["окно́", "n", "o-neut", "о́кна", "neut", "window"],
    ["спа́льня", "f", "a-fem", "спа́льни", "soft-i", "bedroom"],
    ["столо́вая", "f", "adj-f", "столо́вые", "adj", "dining room"],
    // reading & general
    ["газе́та", "f", "a-fem", "газе́ты", "hard-y", "newspaper"],
    ["журна́л", "m", "cons", "журна́лы", "hard-y", "magazine"],
    ["кни́га", "f", "a-fem", "кни́ги", "spell7", "book"],
    ["слова́рь", "m", "soft-m", "словари́", "soft-i", "dictionary"],
    ["тетра́дь", "f", "soft-f", "тетра́ди", "soft-i", "notebook"],
    ["уче́бник", "m", "cons", "уче́бники", "spell7", "textbook"],
    ["вопро́с", "m", "cons", "вопро́сы", "hard-y", "question"],
    ["пробле́ма", "f", "a-fem", "пробле́мы", "hard-y", "problem"],
    ["и́мя", "n", "mya", "имена́", "irregular", "name"],
    ["плюс", "m", "cons", "плю́сы", "hard-y", "plus"]
  ];

  // Nouns that describe people (used to pair sensible adjectives)
  var PERSON_WORDS = {};
  NOUNS.slice(0, 59).forEach(function (n) { PERSON_WORDS[n[0]] = true; });
  delete PERSON_WORDS["профе́ссия"];

  var GENDER_RULES = {
    "cons": "It ends in a consonant → <b>masculine</b>.",
    "a-fem": "It ends in <b>-а / -я</b> → <b>feminine</b>.",
    "a-masc": "It ends in -а / -я, but it names a male person → <b>masculine</b> (мой папа, наш дедушка).",
    "o-neut": "It ends in <b>-о / -е</b> → <b>neuter</b>.",
    "mya": "It ends in <b>-мя</b> → <b>neuter</b>. A small irregular group (имя, время); don't be fooled by the -я.",
    "soft-m": "It ends in <b>-ь</b>, so the gender must be memorised. This one is <b>masculine</b>.",
    "soft-f": "It ends in <b>-ь</b>, so the gender must be memorised. This one is <b>feminine</b>.",
    "indecl": "A foreign loanword that never changes its ending; indeclinable words in -о / -е are <b>neuter</b>.",
    "adj-m": "It looks like an adjective and declines like one; the -ий ending shows <b>masculine</b>.",
    "adj-f": "It looks like an adjective and declines like one; the -ая ending shows <b>feminine</b>.",
    "pl-only": "This word is used only in the <b>plural</b> (a pair or a mass noun). Adjectives take plural -ые / -ие."
  };

  var PLURAL_RULES = {
    "hard-y": "Hard stem: masculine nouns add <b>-ы</b>, feminine -а becomes <b>-ы</b>.",
    "spell7": "<b>7-letter spelling rule</b>: after г, к, х, ж, ч, ш, щ you can never write ы, so the plural ends in <b>-и</b>.",
    "tsy": "ц is <b>not</b> one of the 7 letters, so -ы is written after it.",
    "soft-i": "Soft stem (-ь, -я, -й): the plural ends in <b>-и</b>.",
    "iya": "<b>-ия → -ии</b>.",
    "neut": "Neuter: <b>-о → -а</b>, <b>-е → -я</b>. Watch the stress: it often moves (окно́ → о́кна, зе́ркало → зеркала́).",
    "ie-iya": "Neuter <b>-ие → -ия</b>.",
    "fleeting": "<b>Fleeting vowel</b>: the о / е before the last consonant drops out, then the ending is added (оте́ц → отцы́, пода́рок → пода́рки).",
    "stress-a": "Some masculine nouns take a stressed <b>-а́</b> in the plural instead of -ы. They must be memorised: дом → дома́, го́род → города́, а́дрес → адреса́, но́мер → номера́.",
    "anin": "Nouns in <b>-анин / -янин</b> drop -ин and take <b>-е</b>: англича́нин → англича́не.",
    "ya": "Irregular plural in <b>-ья</b>: брат → бра́тья, стул → сту́лья, муж → мужья́, сын → сыновья́.",
    "irregular": "<b>Irregular</b> plural — memorise it.",
    "stress": "The ending is regular, but the stress moves to the stem and е becomes <b>ё</b>: сестра́ → сёстры, жена́ → жёны.",
    "adj": "This noun declines like an adjective, so its plural is the adjective plural <b>-ые / -ие</b>.",
    "indecl": "Indeclinable: the plural looks exactly like the singular (одно пальто, два пальто)."
  };

  var GENDER_LABELS = { m: "masculine", f: "feminine", n: "neuter", pl: "plural only" };

  // Adjective: [masc, fem, neut, plural, English, fits: "all" | "person" | "thing"]
  var ADJECTIVES = [
    ["хоро́ший", "хоро́шая", "хоро́шее", "хоро́шие", "good", "all"],
    ["плохо́й", "плоха́я", "плохо́е", "плохи́е", "bad", "all"],
    ["неплохо́й", "неплоха́я", "неплохо́е", "неплохи́е", "not bad", "all"],
    ["краси́вый", "краси́вая", "краси́вое", "краси́вые", "beautiful", "all"],
    ["некраси́вый", "некраси́вая", "некраси́вое", "некраси́вые", "ugly", "all"],
    ["до́брый", "до́брая", "до́брое", "до́брые", "kind", "person"],
    ["большо́й", "больша́я", "большо́е", "больши́е", "big", "thing"],
    ["ста́рый", "ста́рая", "ста́рое", "ста́рые", "old", "all"],
    ["ста́рший", "ста́ршая", "ста́ршее", "ста́ршие", "older", "person"],
    ["ма́ленький", "ма́ленькая", "ма́ленькое", "ма́ленькие", "small", "thing"],
    ["мла́дший", "мла́дшая", "мла́дшее", "мла́дшие", "younger", "person"],
    ["молодо́й", "молода́я", "молодо́е", "молоды́е", "young", "person"],
    ["но́вый", "но́вая", "но́вое", "но́вые", "new", "thing"],
    ["интере́сный", "интере́сная", "интере́сное", "интере́сные", "interesting", "all"],
    ["норма́льный", "норма́льная", "норма́льное", "норма́льные", "OK, normal", "all"],
    ["обы́чный", "обы́чная", "обы́чное", "обы́чные", "usual", "all"],
    ["све́тлый", "све́тлая", "све́тлое", "све́тлые", "bright", "thing"],
    ["ве́жливый", "ве́жливая", "ве́жливое", "ве́жливые", "polite", "person"],
    ["беста́ктный", "беста́ктная", "беста́ктное", "беста́ктные", "tactless", "person"],
    ["высо́кий", "высо́кая", "высо́кое", "высо́кие", "tall, high", "all"],
    ["удо́бный", "удо́бная", "удо́бное", "удо́бные", "comfortable", "thing"],
    ["бе́лый", "бе́лая", "бе́лое", "бе́лые", "white", "thing"],
    ["чёрный", "чёрная", "чёрное", "чёрные", "black", "thing"],
    ["прия́тный", "прия́тная", "прия́тное", "прия́тные", "pleasant", "all"],
    ["серьёзный", "серьёзная", "серьёзное", "серьёзные", "serious", "person"],
    ["ужа́сный", "ужа́сная", "ужа́сное", "ужа́сные", "horrible", "all"],
    // possessives and чей follow the same agreement idea
    ["мой", "моя́", "моё", "мои́", "my", "all"],
    ["твой", "твоя́", "твоё", "твои́", "your (informal)", "all"],
    ["наш", "на́ша", "на́ше", "на́ши", "our", "all"],
    ["ваш", "ва́ша", "ва́ше", "ва́ши", "your (formal)", "all"],
    ["чей", "чья", "чьё", "чьи", "whose", "all"]
  ];

  var GENDER_INDEX = { m: 0, f: 1, n: 2, pl: 3 };
  var SEVEN = "гкхжчшщ";

  function strip(s) { return s.normalize("NFD").replace(/́/g, "").normalize("NFC"); }
  function stemOf(word) { return strip(word).slice(0, -2); }

  function adjectiveExplanation(adj, noun) {
    var g = noun[1];
    var form = adj[GENDER_INDEX[g]];
    var plain = strip(form);
    var ending = plain.slice(-2);
    var stemEnd = plain.slice(-3, -2);
    var why = "";
    if (g === "m") { why = "Masculine → the dictionary form " + (ending === "ой" ? "(-ой because the ending is stressed)" : ending === "ий" ? "(-ий: spelling rule after " + stemEnd + ", or a soft stem)" : "(-ый)") + "."; }
    else if (g === "f") { why = "Feminine → <b>-ая</b>."; }
    else if (g === "n") { why = "Neuter → <b>-ое</b>" + (ending === "ее" ? ", but after ж, ч, ш, щ an unstressed о is written е, so <b>-ее</b> (the 5-letter rule)" : "") + "."; }
    else { why = "Plural → <b>-ые</b>" + (ending === "ие" ? ", but after " + stemEnd + " the 7-letter rule turns ы into и, so <b>-ие</b>" : "") + "."; }
    if (adj[0].length <= 4) { why = "Possessive words agree like adjectives: " + GENDER_LABELS[g] + " noun → " + form + "."; }
    return why;
  }

  // ---- question builders ----
  // Every question: { id, kind, prompt (HTML), sub (HTML), answer, alts[], options[{label,correct}]|null, explain (HTML), speak }
  function genderQuestions() {
    return NOUNS.map(function (n) {
      var labels = ["masculine", "feminine", "neuter", "plural only"];
      var keys = ["m", "f", "n", "pl"];
      return {
        id: "gender:" + strip(n[0]),
        kind: "gender",
        prompt: n[0],
        sub: n[5],
        answer: GENDER_LABELS[n[1]],
        alts: [],
        options: keys.map(function (k, i) { return { label: labels[i], correct: k === n[1] }; }),
        explain: GENDER_RULES[n[2]],
        speak: n[0]
      };
    });
  }

  function pluralCandidates(noun) {
    var w = strip(noun[0]);
    var stem = /[аяоеь]$/.test(w) ? w.slice(0, -1) : w;
    var set = [stem + "ы", stem + "и", stem + "а", stem + "я", stem + "ья", w];
    if (noun[4] === "fleeting") { set.push(strip(noun[3]).replace(/[ыиа]$/, "ы").replace(/ы$/, "и")); }
    return set;
  }

  function pluralQuestions(C, rng) {
    rng = rng || Math.random;
    return NOUNS.filter(function (n) { return n[3]; }).map(function (n) {
      var forms = n[3].split("|");
      var correctPlain = strip(forms[0]);
      var used = {}; used[C.normalizeRu(correctPlain)] = true;
      forms.forEach(function (f) { used[C.normalizeRu(f)] = true; });
      var distractors = [];
      C.shuffle(pluralCandidates(n), rng).forEach(function (c) {
        var k = C.normalizeRu(c);
        if (distractors.length < 3 && !used[k]) { used[k] = true; distractors.push(c); }
      });
      var options = distractors.map(function (d) { return { label: d, correct: false }; });
      options.push({ label: correctPlain, correct: true });
      return {
        id: "plural:" + strip(n[0]),
        kind: "plural",
        prompt: n[0] + " → ?",
        sub: "plural of “" + n[5] + "”",
        answer: forms[0],
        alts: forms.slice(1),
        options: C.shuffle(options, rng),
        explain: PLURAL_RULES[n[4]] + (forms.length > 1 ? " Both <b>" + forms.join("</b> and <b>") + "</b> are used." : ""),
        speak: forms[0]
      };
    });
  }

  function spellingQuestions() {
    var qs = [];
    NOUNS.forEach(function (n) {
      if (!n[3] || ["hard-y", "spell7", "tsy", "fleeting"].indexOf(n[4]) < 0) { return; }
      var plural = strip(n[3].split("|")[0]);
      var last = plural.slice(-1);
      if (last !== "ы" && last !== "и") { return; }
      var stem = plural.slice(0, -1);
      var letter = stem.slice(-1);
      var is7 = SEVEN.indexOf(letter) >= 0;
      qs.push({
        id: "spell:" + plural,
        kind: "spelling",
        prompt: stem + "<span class='gap'>_</span>",
        sub: "plural of " + n[0] + " (" + n[5] + ")",
        answer: last,
        alts: [],
        options: [{ label: "ы", correct: last === "ы" }, { label: "и", correct: last === "и" }],
        explain: is7 ? "<b>" + letter + "</b> is one of the 7 letters (г, к, х, ж, ч, ш, щ), so ы is impossible: write <b>" + plural + "</b>."
          : letter === "ц" ? "ц is <b>not</b> one of the 7 letters, so ы is fine: <b>" + plural + "</b>."
          : "<b>" + letter + "</b> is not one of the 7 letters, so the regular hard ending -ы stays: <b>" + plural + "</b>.",
        speak: plural
      });
    });
    ADJECTIVES.forEach(function (a) {
      if (a[0].length <= 4) { return; }
      var masc = strip(a[0]);
      var plural = strip(a[3]);
      var letter = masc.slice(-3, -2);
      var is7 = SEVEN.indexOf(letter) >= 0;
      var mEnd = masc.slice(-2);
      if (mEnd === "ой") { return; }
      qs.push({
        id: "spell:" + masc,
        kind: "spelling",
        prompt: masc.slice(0, -2) + "<span class='gap'>__</span>",
        sub: "masculine adjective “" + a[4] + "”",
        answer: mEnd,
        alts: [],
        options: [{ label: "ый", correct: mEnd === "ый" }, { label: "ий", correct: mEnd === "ий" }],
        explain: is7 ? "After <b>" + letter + "</b> ы is impossible, so the masculine ending is <b>-ий</b>: " + masc + "."
          : "<b>" + letter + "</b> is not one of the 7 letters, so the ending is the regular <b>-ый</b>: " + masc + ".",
        speak: masc
      });
      qs.push({
        id: "spell:" + plural,
        kind: "spelling",
        prompt: plural.slice(0, -2) + "<span class='gap'>__</span>",
        sub: "plural adjective “" + a[4] + "”",
        answer: plural.slice(-2),
        alts: [],
        options: [{ label: "ые", correct: plural.slice(-2) === "ые" }, { label: "ие", correct: plural.slice(-2) === "ие" }],
        explain: is7 ? "After <b>" + letter + "</b> ы is impossible, so the plural ending is <b>-ие</b>: " + plural + "."
          : "<b>" + letter + "</b> is not one of the 7 letters, so the plural ending is the regular <b>-ые</b>: " + plural + ".",
        speak: plural
      });
    });
    return qs;
  }

  function adjectiveQuestions(C, rng) {
    rng = rng || Math.random;
    var qs = [];
    NOUNS.forEach(function (n) {
      var isPerson = !!PERSON_WORDS[n[0]];
      var fits = ADJECTIVES.filter(function (a) {
        return a[5] === "all" || (a[5] === "person") === isPerson;
      });
      var adj = fits[Math.floor(rng() * fits.length)];
      var g = n[1];
      var correct = adj[GENDER_INDEX[g]];
      qs.push({
        id: "adj:" + strip(adj[0]) + "+" + strip(n[0]),
        kind: "adjective",
        prompt: adj[0] + " + " + n[0],
        sub: "“" + adj[4] + " " + n[5] + "” — which form of the adjective?",
        answer: correct,
        alts: [],
        options: C.shuffle([0, 1, 2, 3].map(function (i) { return { label: strip(adj[i]), correct: i === GENDER_INDEX[g] }; }), rng),
        explain: "<b>" + strip(correct) + " " + strip(n[0]) + "</b>. " + n[0] + " is " + GENDER_LABELS[g] + " (" + GENDER_RULES[n[2]].replace(/<[^>]+>/g, "").replace(/\.$/, "") + "). " + adjectiveExplanation(adj, n),
        speak: correct + " " + n[0]
      });
    });
    return qs;
  }

  // ---- lessons (HTML) ----
  var LESSONS = [
    {
      id: "gender",
      title: "Noun gender",
      drill: "gender",
      html: "<p>Every Russian noun is masculine, feminine or neuter. You can usually tell from the <b>last letter</b> of the dictionary form:</p>" +
        "<table><thead><tr><th>Ending</th><th>Gender</th><th>Examples from the list</th></tr></thead><tbody>" +
        "<tr><td>consonant</td><td>masculine</td><td>стол, брат, студе́нт, го́род, музе́й</td></tr>" +
        "<tr><td>-а / -я</td><td>feminine</td><td>ла́мпа, кни́га, семья́, ку́хня</td></tr>" +
        "<tr><td>-о / -е / -ё</td><td>neuter</td><td>окно́, кре́сло, пла́тье, общежи́тие</td></tr>" +
        "<tr><td>-ь</td><td>masculine <i>or</i> feminine — memorise</td><td>m: слова́рь, реме́нь, роди́тель<br>f: дверь, крова́ть, тетра́дь, мать, дочь</td></tr>" +
        "</tbody></table>" +
        "<h3>The traps</h3><ul>" +
        "<li><b>Male people in -а / -я are masculine:</b> па́па, дя́дя, де́душка, мужчи́на. Say <i>мой па́па</i>, not <i>моя</i>.</li>" +
        "<li><b>-мя is neuter:</b> и́мя (моё и́мя), вре́мя.</li>" +
        "<li><b>Indeclinable loanwords</b> never change and are neuter: пальто́, кафе́, меню́, фо́то (чёрное пальто́).</li>" +
        "<li><b>Adjective-shaped nouns</b> decline like adjectives: ва́нная, гости́ная, столо́вая (f.), ру́сский / ру́сская.</li>" +
        "<li><b>Plural-only nouns</b> have no gender to learn: брю́ки, джи́нсы, очки́, де́ньги, часы́. Everything agreeing with them is plural.</li>" +
        "</ul><p>Gender matters because <b>everything that describes the noun must agree</b>: мой / моя́ / моё, э́тот / э́та / э́то, но́вый / но́вая / но́вое, and он / она́ / оно́ when you refer back to it.</p>"
    },
    {
      id: "plural",
      title: "Nominative plural",
      drill: "plural",
      html: "<p>The basic idea: hard stems take <b>-ы</b>, soft stems take <b>-и</b>, neuter nouns swap their vowel.</p>" +
        "<table><thead><tr><th>Singular ends in</th><th>Plural</th><th>Examples</th></tr></thead><tbody>" +
        "<tr><td>hard consonant</td><td>+ -ы</td><td>стол → столы́, журна́л → журна́лы</td></tr>" +
        "<tr><td>-а</td><td>-а → -ы</td><td>ла́мпа → ла́мпы, газе́та → газе́ты</td></tr>" +
        "<tr><td>-я / -ь / -й</td><td>→ -и</td><td>ку́хня → ку́хни, дверь → две́ри, музе́й → музе́и</td></tr>" +
        "<tr><td>-ия</td><td>→ -ии</td><td>профе́ссия → профе́ссии</td></tr>" +
        "<tr><td>-о</td><td>→ -а</td><td>окно́ → о́кна, кре́сло → кре́сла</td></tr>" +
        "<tr><td>-е / -ие</td><td>→ -я / -ия</td><td>пла́тье → пла́тья, общежи́тие → общежи́тия</td></tr>" +
        "</tbody></table>" +
        "<h3>Then apply the 7-letter spelling rule</h3>" +
        "<p>After <b>г к х ж ч ш щ</b> you may never write ы, so the plural is -и: кни́га → кни́ги, уче́бник → уче́бники, ключ → ключи́, ба́бушка → ба́бушки. (ц is not in the rule: у́лица → у́лицы.)</p>" +
        "<h3>Things to memorise</h3><ul>" +
        "<li><b>Fleeting vowel</b> — о / е before the last consonant drops: оте́ц → отцы́, пода́рок → пода́рки, америка́нец → америка́нцы, реме́нь → ремни́, потоло́к → потолки́.</li>" +
        "<li><b>Stressed -а́</b> instead of -ы for some masculine nouns: дом → дома́, го́род → города́, а́дрес → адреса́, но́мер → номера́, профе́ссор → профессора́.</li>" +
        "<li><b>-ья plurals:</b> брат → бра́тья, стул → сту́лья, муж → мужья́, сын → сыновья́.</li>" +
        "<li><b>-анин → -ане:</b> англича́нин → англича́не, россия́нин → россия́не (and тата́рин → тата́ры).</li>" +
        "<li><b>Irregular:</b> челове́к → лю́ди, ребёнок → де́ти, мать → ма́тери, дочь → до́чери, хозя́ин → хозя́ева, сосе́д → сосе́ди, и́мя → имена́.</li>" +
        "<li><b>Stress shift with ё:</b> сестра́ → сёстры, жена́ → жёны; also стена́ → сте́ны.</li>" +
        "<li><b>Indeclinable:</b> пальто́, кафе́, меню́, фо́то look the same in the plural.</li>" +
        "</ul>"
    },
    {
      id: "spelling",
      title: "The 7-letter spelling rule",
      drill: "spelling",
      html: "<p class='big-rule'>After <b>г к х</b> and <b>ж ч ш щ</b>, never write <b>ы</b> — write <b>и</b>.</p>" +
        "<p>That is the whole rule. It is not about pronunciation changing; it is a fixed spelling habit, and it shows up everywhere an ending would otherwise contain ы.</p>" +
        "<table><thead><tr><th>Where you meet it</th><th>Without the rule</th><th>With the rule</th></tr></thead><tbody>" +
        "<tr><td>Noun plurals</td><td>стол → столы́</td><td>кни́га → кни́г<b>и</b>, ключ → ключ<b>и́</b>, уче́бник → уче́бник<b>и</b></td></tr>" +
        "<tr><td>Masculine adjectives</td><td>но́вый</td><td>ру́сск<b>ий</b>, хоро́ш<b>ий</b>, ма́леньк<b>ий</b>, высо́к<b>ий</b></td></tr>" +
        "<tr><td>Plural adjectives</td><td>но́вые</td><td>ру́сск<b>ие</b>, хоро́ш<b>ие</b>, больш<b>и́е</b>, плох<b>и́е</b></td></tr>" +
        "</tbody></table>" +
        "<h3>How to remember the seven</h3><p>Three velars <b>г к х</b> (the back-of-the-throat sounds) plus four hushers <b>ж ч ш щ</b>. Note that <b>ц</b> is <i>not</i> in the list: у́лица → у́лицы, гости́ница → гости́ницы, оте́ц → отцы́.</p>" +
        "<h3>A cousin: the 5-letter rule</h3><p>After <b>ж ч ш щ ц</b>, an <i>unstressed</i> о is written <b>е</b>. That is why the neuter of хоро́ший is хоро́ш<b>ее</b> (not хорошое), while большо́й keeps большо́е because there the о is stressed.</p>"
    },
    {
      id: "adjectives",
      title: "Adjective endings",
      drill: "adjective",
      html: "<p>An adjective copies the gender and number of its noun. In the nominative there are four forms:</p>" +
        "<table><thead><tr><th></th><th>masculine</th><th>feminine</th><th>neuter</th><th>plural</th></tr></thead><tbody>" +
        "<tr><td>regular (hard stem)</td><td>но́в<b>ый</b></td><td>но́в<b>ая</b></td><td>но́в<b>ое</b></td><td>но́в<b>ые</b></td></tr>" +
        "<tr><td>stem ends in г к х ж ч ш щ</td><td>ру́сск<b>ий</b></td><td>ру́сск<b>ая</b></td><td>ру́сск<b>ое</b></td><td>ру́сск<b>ие</b></td></tr>" +
        "<tr><td>… and husher stem, unstressed</td><td>хоро́ш<b>ий</b></td><td>хоро́ш<b>ая</b></td><td>хоро́ш<b>ее</b></td><td>хоро́ш<b>ие</b></td></tr>" +
        "<tr><td>stress on the ending</td><td>больш<b>о́й</b></td><td>больш<b>а́я</b></td><td>больш<b>о́е</b></td><td>больш<b>и́е</b></td></tr>" +
        "</tbody></table>" +
        "<h3>Reading the table</h3><ul>" +
        "<li><b>Masculine</b> is the dictionary form. -ый is the default; -ий appears after the 7 letters (and in soft-stem adjectives); -ой means the stress is on the ending (плохо́й, большо́й, молодо́й).</li>" +
        "<li><b>Feminine</b> is always <b>-ая</b> for the adjectives in this list.</li>" +
        "<li><b>Neuter</b> is <b>-ое</b>, except after ж ч ш щ ц when unstressed → <b>-ее</b> (хоро́шее, ста́ршее, мла́дшее).</li>" +
        "<li><b>Plural</b> is <b>-ые</b>, or <b>-ие</b> after the 7 letters (ру́сские, ма́ленькие, высо́кие, больши́е, плохи́е).</li>" +
        "</ul>" +
        "<h3>Agreement in practice</h3><p>но́вый стол · но́вая ла́мпа · но́вое кре́сло · но́вые кни́ги<br>" +
        "хоро́ший сосе́д · хоро́шая кварти́ра · хоро́шее пальто́ · хоро́шие лю́ди<br>" +
        "большо́й го́род · больша́я ко́мната · большо́е окно́ · больши́е города́</p>" +
        "<p>Remember the gender traps: <i>мой до́брый де́душка</i> (masculine person in -а), <i>моё и́мя</i> (neuter -мя), <i>но́вое кафе́</i> (indeclinable), <i>ста́рые брю́ки</i> (plural only).</p>" +
        "<h3>Possessives and чей work the same way</h3><p>мой / моя́ / моё / мои́ · наш / на́ша / на́ше / на́ши · чей / чья / чьё / чьи — pick the form that matches the noun exactly as you would for an adjective. (его́, её, их never change.)</p>"
    }
  ];

  var DRILLS = {
    gender: { title: "Gender drill", lesson: "gender", desc: "Is the noun masculine, feminine, neuter, or plural only?", build: function () { return genderQuestions(); } },
    plural: { title: "Plural drill", lesson: "plural", desc: "Give the nominative plural of the noun.", build: function (C, rng) { return pluralQuestions(C, rng); } },
    spelling: { title: "Spelling rule drill", lesson: "spelling", desc: "ы or и? ый or ий? Apply the 7-letter rule.", build: function () { return spellingQuestions(); } },
    adjective: { title: "Adjective drill", lesson: "adjectives", desc: "Choose the adjective form that agrees with the noun.", build: function (C, rng) { return adjectiveQuestions(C, rng); } }
  };

  var api = {
    NOUNS: NOUNS, ADJECTIVES: ADJECTIVES, LESSONS: LESSONS, DRILLS: DRILLS,
    GENDER_RULES: GENDER_RULES, PLURAL_RULES: PLURAL_RULES, GENDER_LABELS: GENDER_LABELS,
    genderQuestions: genderQuestions, pluralQuestions: pluralQuestions,
    spellingQuestions: spellingQuestions, adjectiveQuestions: adjectiveQuestions
  };
  if (typeof module !== "undefined" && module.exports) { module.exports = api; }
  else { root.Grammar = api; }
})(typeof window !== "undefined" ? window : this);
