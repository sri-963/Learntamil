/* Tamil script dataset.
 * Every card carries: glyph -> sound (roman) -> example word -> example sentence.
 * Generated locally so the app works fully offline.
 * Romanisation: ISO 15919-style diacritics (ā, ī, ṭ, ṇ, ṅ, ñ, ḻ, ḷ, ṟ, ṉ).
 */
(function () {
  'use strict';

  var VOWELS = [
    { id: 'v-a', glyph: 'அ', roman: 'a',
      example: {
        word: 'அம்மா', roman: 'ammā', meaning: 'mother',
        sentence: { ta: 'அம்மா வீட்டில் இருக்கிறார்.', roman: 'Ammā vīṭṭil irukkiṟār.', en: 'Mother is at home.' }
      } },
    { id: 'v-aa', glyph: 'ஆ', roman: 'ā',
      example: {
        word: 'ஆடு', roman: 'āṭu', meaning: 'goat',
        sentence: { ta: 'ஆடு புல் சாப்பிடுகிறது.', roman: 'Āṭu pul cāppiṭukiṟatu.', en: 'The goat eats grass.' }
      } },
    { id: 'v-i', glyph: 'இ', roman: 'i',
      example: {
        word: 'இலை', roman: 'ilai', meaning: 'leaf',
        sentence: { ta: 'இலை பச்சை நிறத்தில் உள்ளது.', roman: 'Ilai paccai niṟattil uḷḷatu.', en: 'The leaf is green.' }
      } },
    { id: 'v-ii', glyph: 'ஈ', roman: 'ī',
      example: {
        word: 'ஈ', roman: 'ī', meaning: 'housefly',
        sentence: { ta: 'ஈ மேசையில் பறக்கிறது.', roman: 'Ī mēcaiyil paṟakkiṟatu.', en: 'A fly is flying over the table.' }
      } },
    { id: 'v-u', glyph: 'உ', roman: 'u',
      example: {
        word: 'உப்பு', roman: 'uppu', meaning: 'salt',
        sentence: { ta: 'உப்பு கடலில் உள்ளது.', roman: 'Uppu kaṭalil uḷḷatu.', en: 'Salt is in the sea.' }
      } },
    { id: 'v-uu', glyph: 'ஊ', roman: 'ū',
      example: {
        word: 'ஊர்', roman: 'ūr', meaning: 'village',
        sentence: { ta: 'என் ஊர் சென்னைக்கு அருகில் உள்ளது.', roman: 'Eṉ ūr Ceṉṉaikku arukil uḷḷatu.', en: 'My village is near Chennai.' }
      } },
    { id: 'v-e', glyph: 'எ', roman: 'e',
      example: {
        word: 'எலி', roman: 'eli', meaning: 'rat',
        sentence: { ta: 'எலி சோறு சாப்பிட்டது.', roman: 'Eli cōṟu cāppiṭṭatu.', en: 'The rat ate rice.' }
      } },
    { id: 'v-ee', glyph: 'ஏ', roman: 'ē',
      example: {
        word: 'ஏணி', roman: 'ēṇi', meaning: 'ladder',
        sentence: { ta: 'ஏணி சுவரில் சாய்ந்துள்ளது.', roman: 'Ēṇi cuvaril cāyntuḷḷatu.', en: 'The ladder leans against the wall.' }
      } },
    { id: 'v-ai', glyph: 'ஐ', roman: 'ai',
      example: {
        word: 'ஐந்து', roman: 'aintu', meaning: 'five',
        sentence: { ta: 'எனக்கு ஐந்து புத்தகங்கள் உள்ளன.', roman: 'Eṉakku aintu puttakaṅkaḷ uḷḷaṉa.', en: 'I have five books.' }
      } },
    { id: 'v-o', glyph: 'ஒ', roman: 'o',
      example: {
        word: 'ஒட்டகம்', roman: 'oṭṭakam', meaning: 'camel',
        sentence: { ta: 'ஒட்டகம் பாலைவனத்தில் வாழ்கிறது.', roman: 'Oṭṭakam pālaivaṉattil vāḻkiṟatu.', en: 'The camel lives in the desert.' }
      } },
    { id: 'v-oo', glyph: 'ஓ', roman: 'ō',
      example: {
        word: 'ஓடம்', roman: 'ōṭam', meaning: 'boat',
        sentence: { ta: 'ஓடம் ஆற்றில் செல்கிறது.', roman: 'Ōṭam āṟṟil celkiṟatu.', en: 'The boat travels on the river.' }
      } },
    { id: 'v-au', glyph: 'ஔ', roman: 'au',
      example: {
        word: 'ஔவை', roman: 'Auvai', meaning: 'Avvai (poet)',
        sentence: { ta: 'ஔவை ஒரு புகழ்பெற்ற கவிஞர்.', roman: 'Auvai oru pukaḻpeṟṟa kaviñar.', en: 'Avvai is a famous poet.' }
      } }
  ];

  var CONSONANTS = [
    { id: 'c-k', glyph: 'க்', base: 'க', roman: 'k',
      example: {
        word: 'கல்', roman: 'kal', meaning: 'stone',
        sentence: { ta: 'கல் தண்ணீரில் மூழ்கியது.', roman: 'Kal taṇṇīril mūḻkiyatu.', en: 'The stone sank in the water.' }
      } },
    { id: 'c-ng', glyph: 'ங்', base: 'ங', roman: 'ṅ',
      example: {
        word: 'அங்கு', roman: 'aṅku', meaning: 'there',
        sentence: { ta: 'என் வீடு அங்கு உள்ளது.', roman: 'Eṉ vīṭu aṅku uḷḷatu.', en: 'My house is there.' }
      } },
    { id: 'c-ch', glyph: 'ச்', base: 'ச', roman: 'c',
      example: {
        word: 'சங்கு', roman: 'caṅku', meaning: 'conch',
        sentence: { ta: 'கடற்கரையில் சங்கு கிடைத்தது.', roman: 'Kaṭaṟkaraiyil caṅku kiṭaittatu.', en: 'I found a conch on the beach.' }
      } },
    { id: 'c-ny', glyph: 'ஞ்', base: 'ஞ', roman: 'ñ',
      example: {
        word: 'ஞாயிறு', roman: 'ñāyiṟu', meaning: 'sun',
        sentence: { ta: 'ஞாயிறு மேற்கில் மறைகிறது.', roman: 'Ñāyiṟu mēṟkil maṟaikiṟatu.', en: 'The sun sets in the west.' }
      } },
    { id: 'c-t', glyph: 'ட்', base: 'ட', roman: 'ṭ',
      example: {
        word: 'டமாரம்', roman: 'ṭamāram', meaning: 'drum',
        sentence: { ta: 'டமாரம் சத்தமாக ஒலித்தது.', roman: 'Ṭamāram cattamāka olittatu.', en: 'The drum sounded loudly.' }
      } },
    { id: 'c-n', glyph: 'ண்', base: 'ண', roman: 'ṇ',
      example: {
        word: 'மணி', roman: 'maṇi', meaning: 'bell',
        sentence: { ta: 'கோயில் மணி அடிக்கிறது.', roman: 'Kōyil maṇi aṭikkiṟatu.', en: 'The temple bell is ringing.' }
      } },
    { id: 'c-th', glyph: 'த்', base: 'த', roman: 't',
      example: {
        word: 'தவளை', roman: 'tavaḷai', meaning: 'frog',
        sentence: { ta: 'தவளை குளத்தில் குதிக்கிறது.', roman: 'Tavaḷai kuḷattil kutikkiṟatu.', en: 'The frog jumps into the pond.' }
      } },
    { id: 'c-nh', glyph: 'ந்', base: 'ந', roman: 'n',
      example: {
        word: 'நிலா', roman: 'nilā', meaning: 'moon',
        sentence: { ta: 'நிலா இரவில் பிரகாசிக்கிறது.', roman: 'Nilā iravil pirakācikkiṟatu.', en: 'The moon shines at night.' }
      } },
    { id: 'c-p', glyph: 'ப்', base: 'ப', roman: 'p',
      example: {
        word: 'பல்', roman: 'pal', meaning: 'tooth',
        sentence: { ta: 'என் பல் வலிக்கிறது.', roman: 'Eṉ pal valikkiṟatu.', en: 'My tooth hurts.' }
      } },
    { id: 'c-m', glyph: 'ம்', base: 'ம', roman: 'm',
      example: {
        word: 'மலை', roman: 'malai', meaning: 'mountain',
        sentence: { ta: 'மலை உச்சியில் பனி உள்ளது.', roman: 'Malai ucciyil paṉi uḷḷatu.', en: 'There is snow on the mountain top.' }
      } },
    { id: 'c-y', glyph: 'ய்', base: 'ய', roman: 'y',
      example: {
        word: 'யானை', roman: 'yāṉai', meaning: 'elephant',
        sentence: { ta: 'யானை காட்டில் நடக்கிறது.', roman: 'Yāṉai kāṭṭil naṭakkiṟatu.', en: 'The elephant walks in the forest.' }
      } },
    { id: 'c-r', glyph: 'ர்', base: 'ர', roman: 'r',
      example: {
        word: 'ரொட்டி', roman: 'roṭṭi', meaning: 'bread',
        sentence: { ta: 'அம்மா ரொட்டி சுட்டார்.', roman: 'Ammā roṭṭi cuṭṭār.', en: 'Mother baked bread.' }
      } },
    { id: 'c-l', glyph: 'ல்', base: 'ல', roman: 'l',
      example: {
        word: 'லட்டு', roman: 'laṭṭu', meaning: 'sweet',
        sentence: { ta: 'லட்டு மிகவும் இனிப்பாக உள்ளது.', roman: 'Laṭṭu mikavum iṉippāka uḷḷatu.', en: 'The laddu is very sweet.' }
      } },
    { id: 'c-v', glyph: 'வ்', base: 'வ', roman: 'v',
      example: {
        word: 'வண்டி', roman: 'vaṇṭi', meaning: 'cart',
        sentence: { ta: 'வண்டி சாலையில் செல்கிறது.', roman: 'Vaṇṭi cālaiyil celkiṟatu.', en: 'The cart travels on the road.' }
      } },
    { id: 'c-zh', glyph: 'ழ்', base: 'ழ', roman: 'ḻ',
      example: {
        word: 'தமிழ்', roman: 'tamiḻ', meaning: 'Tamil',
        sentence: { ta: 'நான் தமிழ் கற்கிறேன்.', roman: 'Nāṉ tamiḻ kaṟkiṟēṉ.', en: 'I am learning Tamil.' }
      } },
    { id: 'c-ll', glyph: 'ள்', base: 'ள', roman: 'ḷ',
      example: {
        word: 'வாள்', roman: 'vāḷ', meaning: 'sword',
        sentence: { ta: 'வாள் கூர்மையாக உள்ளது.', roman: 'Vāḷ kūrmaiyāka uḷḷatu.', en: 'The sword is sharp.' }
      } },
    { id: 'c-rr', glyph: 'ற்', base: 'ற', roman: 'ṟ',
      example: {
        word: 'நாற்காலி', roman: 'nāṟkāli', meaning: 'chair',
        sentence: { ta: 'நாற்காலியில் உட்காருங்கள்.', roman: 'Nāṟkāliyil uṭkāruṅkaḷ.', en: 'Sit on the chair.' }
      } },
    { id: 'c-nn', glyph: 'ன்', base: 'ன', roman: 'ṉ',
      example: {
        word: 'மனம்', roman: 'manaṉ', meaning: 'mind',
        sentence: { ta: 'மனம் அமைதியாக இருக்க வேண்டும்.', roman: 'Manaṉ amaitiyāka irukka vēṇṭum.', en: 'The mind should be calm.' }
      } }
  ];

  var VOWEL_SIGNS = [
    { roman: 'a',  sign: '' },
    { roman: 'ā',  sign: 'ா' },
    { roman: 'i',  sign: 'ி' },
    { roman: 'ī',  sign: 'ீ' },
    { roman: 'u',  sign: 'ு' },
    { roman: 'ū',  sign: 'ூ' },
    { roman: 'e',  sign: 'ெ' },
    { roman: 'ē',  sign: 'ே' },
    { roman: 'ai', sign: 'ை' },
    { roman: 'o',  sign: 'ொ' },
    { roman: 'ō',  sign: 'ோ' },
    { roman: 'au', sign: 'ௌ' }
  ];

  /* Curated example word + sentence for the k-family. Other compound
     families are fully usable (audio + tracing) but carry no example yet. */
  var COMPOUND_EXAMPLES = {
    'க':  { word: 'கடல்', roman: 'kaṭal', meaning: 'sea',
      sentence: { ta: 'கடல் அலைகள் எழும்புகின்றன.', roman: 'Kaṭal alaikaḷ eḻumpukiṉṟaṉa.', en: 'The sea waves rise.' } },
    'கா': { word: 'கால்', roman: 'kāl', meaning: 'leg',
      sentence: { ta: 'என் கால் வலிக்கிறது.', roman: 'Eṉ kāl valikkiṟatu.', en: 'My leg hurts.' } },
    'கி': { word: 'கிளி', roman: 'kiḷi', meaning: 'parrot',
      sentence: { ta: 'கிளி பேசுகிறது.', roman: 'Kiḷi pēcukiṟatu.', en: 'The parrot speaks.' } },
    'கீ': { word: 'கீரை', roman: 'kīrai', meaning: 'greens',
      sentence: { ta: 'கீரை சத்தான உணவு.', roman: 'Kīrai cattāṉa uṇav.', en: 'Greens are nutritious food.' } },
    'கு': { word: 'குருவி', roman: 'kuruvi', meaning: 'sparrow',
      sentence: { ta: 'குருவி மரத்தில் அமர்ந்துள்ளது.', roman: 'Kuruvi marattil amarntuḷḷatu.', en: 'The sparrow is sitting on the tree.' } },
    'கூ': { word: 'கூடை', roman: 'kūṭai', meaning: 'basket',
      sentence: { ta: 'கூடையில் பழங்கள் உள்ளன.', roman: 'Kūṭaiyil paḻaṅkaḷ uḷḷaṉa.', en: 'There are fruits in the basket.' } },
    'கெ': { word: 'கெண்டை', roman: 'keṇṭai', meaning: 'carp',
      sentence: { ta: 'கெண்டை மீன் குளத்தில் உள்ளது.', roman: 'Keṇṭai mīṉ kuḷattil uḷḷatu.', en: 'The carp is in the pond.' } },
    'கே': { word: 'கேள்வி', roman: 'kēḷvi', meaning: 'question',
      sentence: { ta: 'ஆசிரியர் கேள்வி கேட்டார்.', roman: 'Āciriyar kēḷvi kēṭṭār.', en: 'The teacher asked a question.' } },
    'கை': { word: 'கை', roman: 'kai', meaning: 'hand',
      sentence: { ta: 'என் கையில் புத்தகம் உள்ளது.', roman: 'Eṉ kaiyil puttakam uḷḷatu.', en: 'I have a book in my hand.' } },
    'கொ': { word: 'கொடி', roman: 'koṭi', meaning: 'vine',
      sentence: { ta: 'கொடி சுவரில் படர்கிறது.', roman: 'Koṭi cuvaril paṭarkiṟatu.', en: 'The vine climbs the wall.' } },
    'கோ': { word: 'கோழி', roman: 'kōḻi', meaning: 'hen',
      sentence: { ta: 'கோழி முட்டை இட்டது.', roman: 'Kōḻi muṭṭai iṭṭatu.', en: 'The hen laid an egg.' } },
    'கௌ': { word: 'கௌரவம்', roman: 'kauravam', meaning: 'honour',
      sentence: { ta: 'கௌரவம் அனைவருக்கும் முக்கியம்.', roman: 'Kauravam aṉaivarkkum mukkiyam.', en: 'Honour is important to everyone.' } }
  };

  var compounds = [];
  CONSONANTS.forEach(function (c, ci) {
    VOWEL_SIGNS.forEach(function (v, vi) {
      var glyph = c.base + v.sign;
      compounds.push({
        id: 'cp-' + c.roman + '-' + v.roman,
        glyph: glyph,
        roman: c.roman + v.roman,
        type: 'compound',
        family: c.roman,
        familyBase: c.base,
        familyIndex: ci,
        vowelIndex: vi,
        order: ci * VOWEL_SIGNS.length + vi,
        example: COMPOUND_EXAMPLES[glyph] || null
      });
    });
  });

  function decorate(list, type) {
    return list.map(function (card, i) {
      card.type = type;
      card.order = i;
      return card;
    });
  }

  var vowels = decorate(VOWELS, 'vowel');
  var consonants = decorate(CONSONANTS, 'consonant');

  var all = vowels.concat(consonants, compounds);
  all.forEach(function (card) {
    if (!card.id) card.id = 'x-' + card.order;
    if (!card.say) card.say = card.glyph;
  });

  var byId = {};
  var byGlyph = {};
  all.forEach(function (card) {
    byId[card.id] = card;
    if (!byGlyph[card.glyph]) byGlyph[card.glyph] = card;
  });

  var families = CONSONANTS.map(function (c) {
    return { roman: c.roman, base: c.base, glyph: c.glyph, id: c.id };
  });

  window.TAMIL = {
    vowels: vowels,
    consonants: consonants,
    compounds: compounds,
    all: all,
    byId: byId,
    byGlyph: byGlyph,
    families: families,
    vowelSigns: VOWEL_SIGNS
  };
})();
