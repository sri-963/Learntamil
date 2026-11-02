/* Learn Tamil script — offline PWA. */
(function () {
  'use strict';

  var T = window.TAMIL;
  var Store = window.Store;
  var Audio = window.Audio;

  var $view = document.getElementById('view');
  var $sheet = document.getElementById('sheet');
  var $sheetBody = document.getElementById('sheetBody');

  /* ---------- icons ---------- */
  var ICON = {
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4V4Z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7V4Z"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.3 9a2.7 2.7 0 1 1 3.8 2.5c-.7.35-1.1.9-1.1 1.7"/><path d="M12 17h.01"/></svg>',
    sliders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h8"/><path d="M16 7h4"/><circle cx="14" cy="7" r="2"/><path d="M4 17h4"/><path d="M12 17h8"/><circle cx="10" cy="17" r="2"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>',
    stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V5h6v2"/><path d="M6 7l1 13h10l1-13"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m8 5 11 7-11 7V5Z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 6"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>'
  };

  var TABS = [
    { id: 'learn', label: 'Learn', icon: ICON.book },
    { id: 'trace', label: 'Trace', icon: ICON.pencil },
    { id: 'chart', label: 'Chart', icon: ICON.grid },
    { id: 'quiz', label: 'Quiz', icon: ICON.quiz },
    { id: 'settings', label: 'Settings', icon: ICON.sliders }
  ];

  /* Five letters that rotate once per local day. */
  function dailyCards(forDate) {
    var base = forDate || new Date();
    var pool = T.vowels.concat(T.consonants, T.compounds.filter(function (c) { return c.family === 'k'; }));
    var midnight = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    var dayNumber = Math.floor(midnight.getTime() / 86400000);
    var count = Math.min(5, pool.length);
    var start = ((dayNumber % pool.length) + pool.length) % pool.length;
    var out = [];
    for (var i = 0; i < count; i++) out.push(pool[(start + i) % pool.length]);
    return out;
  }

  var DECKS = [
    { id: 'basics', label: 'Basics', cards: function () { return T.vowels.concat(T.consonants); } },
    { id: 'daily', label: 'Today', cards: dailyCards },
    { id: 'review', label: 'Review', cards: function () {
      var pool = T.vowels.concat(T.consonants, T.compounds.filter(function (c) { return c.family === 'k'; }));
      var unknown = pool.filter(function (c) { return !Store.isKnown(c.id); });
      return unknown.length ? unknown : pool;
    } },
    { id: 'vowels', label: 'Vowels', cards: function () { return T.vowels; } },
    { id: 'consonants', label: 'Consonants', cards: function () { return T.consonants; } },
    { id: 'kfamily', label: 'க family', cards: function () { return T.compounds.filter(function (c) { return c.family === 'k'; }); } },
    { id: 'all', label: 'All ' + T.all.length, cards: function () { return T.all; } }
  ];

  function deckById(id) {
    for (var i = 0; i < DECKS.length; i++) if (DECKS[i].id === id) return DECKS[i];
    return DECKS[0];
  }

  function currentDeck() { return deckById(state.deck); }
  function currentDeckCards() { return currentDeck().cards(); }

  var state = {
    view: 'learn',
    deck: 'basics',
    learnIndex: 0,
    revealed: false,
    traceId: null,
    traceGuide: true,
    chartTab: 'vowels',
    quiz: null
  };

  var recording = null;
  var deferredInstall = null;
  var toastTimer = null;
  var traceView = null;

  /* ---------- helpers ---------- */
  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function typeLabel(card) {
    if (card.type === 'vowel') return 'Vowel · uyir';
    if (card.type === 'consonant') return 'Consonant · mei';
    return 'Compound · uyirmei';
  }

  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2400);
  }

  function updateHeader() {
    var basics = T.vowels.concat(T.consonants);
    var n = Store.knownCount(basics);
    var el = document.getElementById('overallProgress');
    if (el) {
      el.textContent = n + ' / ' + basics.length;
      el.title = n + ' of ' + basics.length + ' basic letters learned';
    }
  }

  /* ---------- speech + recording ---------- */
  function sayLetter(card) {
    return Audio.playCard(card);
  }

  function sayWord(card) {
    if (card.example) Audio.speak(card.example.word);
  }

  function saySentence(card) {
    if (card.example && card.example.sentence) {
      Audio.speak(card.example.sentence.ta, { rate: Math.min(0.85, Store.settings().rate) });
    }
  }

  function startRecording(card, btn) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      toast('Recording is not available here. Open over HTTPS or localhost.');
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      var mr = new MediaRecorder(stream);
      var chunks = [];
      var rec = { id: card.id, recorder: mr, timer: null };
      recording = rec;

      mr.ondataavailable = function (e) {
        if (e.data && e.data.size) chunks.push(e.data);
      };

      mr.onstop = function () {
        if (rec.timer) clearTimeout(rec.timer);
        stream.getTracks().forEach(function (track) { track.stop(); });
        if (recording === rec) recording = null;
        if (!chunks.length) {
          toast('Nothing recorded — try again');
          render();
          return;
        }
        var blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' });
        Audio.putRecording(rec.id, blob).then(function () {
          toast('Recording saved for ' + card.roman);
          render();
        }).catch(function () {
          toast('Could not save the recording');
          render();
        });
      };

      mr.start();
      rec.timer = setTimeout(stopRecording, 8000);
      if (btn) {
        btn.innerHTML = ICON.stop;
        btn.classList.add('live');
      }
      toast('Recording… tap the mic again to stop');
    }).catch(function () {
      toast('Microphone blocked. Allow it in Chrome settings.');
    });
  }

  function stopRecording() {
    if (!recording) return;
    var rec = recording;
    try { rec.recorder.stop(); } catch (err) { recording = null; }
  }

  function toggleRecord(card, btn) {
    if (recording) { stopRecording(); return; }
    startRecording(card, btn);
  }

  /* ---------- navigation ---------- */
  function go(view) {
    if (recording) stopRecording();
    Audio.stop();
    state.view = view;
    try { history.replaceState(null, '', '#' + view); } catch (err) { /* ignore */ }
    try { window.scrollTo(0, 0); } catch (err) { /* ignore */ }
    render();
  }

  function renderTabs() {
    var bar = document.getElementById('tabbar');
    bar.innerHTML = TABS.map(function (tab) {
      return '<button class="tab" data-view="' + tab.id + '" type="button">' +
        tab.icon + '<span>' + tab.label + '</span></button>';
    }).join('');
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-view]');
      if (btn) go(btn.dataset.view);
    });
  }

  function updateTabs() {
    var tabs = document.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle('active', tabs[i].dataset.view === state.view);
    }
  }

  function render() {
    updateTabs();
    if (state.view === 'learn') renderLearn();
    else if (state.view === 'trace') renderTrace();
    else if (state.view === 'chart') renderChart();
    else if (state.view === 'quiz') renderQuiz();
    else renderSettings();
    updateHeader();
  }

  /* ---------- deck chips ---------- */
  function deckChipsHtml() {
    return DECKS.map(function (d) {
      return '<button class="chip ' + (d.id === state.deck ? 'active' : '') +
        '" data-deck="' + d.id + '" type="button">' + d.label + '</button>';
    }).join('');
  }

  function bindDeckChips(root, after) {
    root.querySelectorAll('[data-deck]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.deck = btn.dataset.deck;
        Store.setSetting('lastDeck', state.deck);
        state.learnIndex = Store.firstUnknown(currentDeckCards());
        state.revealed = false;
        state.traceId = null;
        state.quiz = null;
        after();
      });
    });
  }

  /* ---------- LEARN ---------- */
  function sentenceMarkup(card, attr) {
    if (!card.example || !card.example.sentence) return '';
    var s = card.example.sentence;
    return '<div class="sentence">' +
      '<button class="icon-btn s-say" ' + attr + '="say-sentence" title="Hear the sentence" aria-label="Hear the sentence">' + ICON.speaker + '</button>' +
      '<div class="s-ta">' + s.ta + '</div>' +
      '<div class="s-roman">' + s.roman + '</div>' +
      '<div class="s-en">' + s.en + '</div>' +
    '</div>';
  }

  function exampleHtml(card) {
    var ex = card.example;
    if (!ex) {
      if (card.type === 'compound') {
        var v = T.vowels[card.vowelIndex];
        return '<div class="example placeholder">' + card.familyBase + ' + ' + v.glyph +
          ' = ' + card.glyph + ' &nbsp;·&nbsp; ' + v.roman + '</div>';
      }
      return '<div class="example placeholder">Example word coming soon.</div>';
    }
    var sentence = sentenceMarkup(card, 'data-act');
    return '' +
      '<div class="example">' +
        '<div style="flex:1;min-width:0">' +
          '<div class="ex-word">' + ex.word + '</div>' +
          '<div class="ex-sub"><strong>' + ex.roman + '</strong> · ' + ex.meaning + '</div>' +
        '</div>' +
        '<button class="icon-btn" data-act="say-word" title="Hear the word">' + ICON.speaker + '</button>' +
      '</div>' + sentence;
  }

  function renderLearn() {
    var cards = currentDeckCards();
    if (!cards.length) { $view.innerHTML = '<p class="hint">This deck is empty.</p>'; return; }
    if (state.learnIndex >= cards.length || state.learnIndex < 0) state.learnIndex = 0;

    var card = cards[state.learnIndex];
    var known = Store.isKnown(card.id);
    var knownCount = Store.knownCount(cards);
    var pct = Math.round((knownCount / cards.length) * 100);
    var isReview = state.deck === 'review';
    var showExample = state.revealed || isReview;
    var reminderHtml = '';
    if (!isReview && state.deck !== 'daily') {
      if (Store.isPracticedToday()) {
        reminderHtml = '<div class="streak-line">' + ICON.check +
          ' Practiced today · ' + (Store.practice().streak || 1) + '-day streak</div>';
      } else {
        reminderHtml = '<div class="reminder">' +
          '<div class="reminder-icon">' + ICON.bell + '</div>' +
          '<div class="reminder-text">' +
            '<strong>Today\'s 5 letters are waiting</strong>' +
            '<span>Two minutes keeps the streak going.</span>' +
          '</div>' +
          '<button class="btn small primary" data-act="daily" type="button">Start</button>' +
        '</div>';
      }
    }
    var progressHtml = isReview
      ? '<div class="progress"><span>' + cards.length + ' letter' + (cards.length === 1 ? '' : 's') + ' to review</span></div>'
      : '<div class="progress">' +
          '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
          '<span>' + knownCount + ' / ' + cards.length + '</span>' +
        '</div>';

    $view.innerHTML = '' +
      '<h1 class="section-title">Learn</h1>' +
      reminderHtml +
      '<div class="chips">' + deckChipsHtml() + '</div>' +
      progressHtml +
      '<div class="flashcard">' +
        '<div class="card-meta">' +
          '<span class="badge ' + card.type + '">' + typeLabel(card) + '</span>' +
          '<div style="display:flex;align-items:center;gap:6px">' +
            (known ? '<span class="badge known">known</span>' : '') +
            '<button class="icon-btn" data-act="record" title="Record your voice" aria-label="Record your voice">' + ICON.mic + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="glyph">' + card.glyph + '</div>' +
        '<div class="roman ' + (showExample ? '' : 'blurred') + '">' + card.roman + '</div>' +
        '<div style="display:flex;justify-content:center;margin-top:4px">' +
          '<button class="icon-btn accent" data-act="say" title="Hear the letter" aria-label="Hear the letter">' + ICON.speaker + '</button>' +
        '</div>' +
        (showExample
          ? exampleHtml(card)
          : '<button class="reveal-btn" data-act="reveal" type="button">Reveal sound, word &amp; sentence</button>') +
        '<div class="actions">' +
          '<button class="btn" data-act="again" type="button">Again</button>' +
          '<button class="btn primary" data-act="known" type="button">Got it</button>' +
        '</div>' +
        '<div class="card-foot">' +
          '<button data-act="prev" type="button">' + ICON.left + ' Prev</button>' +
          '<span>' + (state.learnIndex + 1) + ' / ' + cards.length + '</span>' +
          '<button data-act="next" type="button">Next ' + ICON.right + '</button>' +
        '</div>' +
      '</div>' +
      '<p class="hint" style="margin-top:14px">Tap the mic to record your own pronunciation. Your recording is used instead of the text-to-speech voice.</p>';

    bindDeckChips($view, renderLearn);

    $view.querySelectorAll('[data-act]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var act = btn.dataset.act;

        if (act === 'daily') {
          state.deck = 'daily';
          Store.setSetting('lastDeck', 'daily');
          state.learnIndex = 0;
          state.revealed = false;
          renderLearn();
          return;
        }

        var list = currentDeckCards();
        var c = list[state.learnIndex] || list[0];
        if (!c) return;

        if (act === 'reveal') {
          state.revealed = true;
          renderLearn();
        } else if (act === 'say') {
          sayLetter(c);
        } else if (act === 'say-word') {
          sayWord(c);
        } else if (act === 'say-sentence') {
          saySentence(c);
        } else if (act === 'known') {
          markAndAdvance(true);
        } else if (act === 'again') {
          markAndAdvance(false);
        } else if (act === 'prev') {
          state.learnIndex = (state.learnIndex - 1 + list.length) % list.length;
          state.revealed = false;
          renderLearn();
        } else if (act === 'next') {
          state.learnIndex = (state.learnIndex + 1) % list.length;
          state.revealed = false;
          renderLearn();
        } else if (act === 'record') {
          toggleRecord(c, btn);
        }
      });
    });
  }

  function indexOfId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return i;
    return -1;
  }

  function markAndAdvance(known) {
    var cards = currentDeckCards();
    if (!cards.length) return;
    var card = cards[state.learnIndex];
    var nextId = cards[(state.learnIndex + 1) % cards.length].id;
    if (card) Store.mark(card.id, known);
    Store.markPracticed();

    state.revealed = false;
    updateHeader();

    /* The review deck changes shape as cards are marked, so follow the
       next card by id instead of by index. */
    var after = currentDeckCards();
    var idx = indexOfId(after, nextId);
    state.learnIndex = idx === -1 ? 0 : idx;
    renderLearn();

    if (Store.settings().autoSpeak) {
      var next = after[state.learnIndex];
      if (next) setTimeout(function () { sayLetter(next); }, 140);
    }
  }

  /* ---------- TRACE ---------- */
  function traceCard() {
    var cards = currentDeckCards();
    if (state.traceId && T.byId[state.traceId]) return T.byId[state.traceId];
    if (!cards.length) return null;
    return cards[Store.firstUnknown(cards)] || cards[0];
  }

  function renderTrace() {
    var card = traceCard();
    if (!card) { $view.innerHTML = '<p class="hint">No letters in this deck.</p>'; return; }

    var cards = currentDeckCards();
    var known = Store.isKnown(card.id);

    $view.innerHTML = '' +
      '<h1 class="section-title">Trace</h1>' +
      '<div class="chips">' + deckChipsHtml() + '</div>' +
      '<div class="trace-head">' +
        '<div class="trace-current">' +
          '<span class="glyph-small">' + card.glyph + '</span>' +
          '<span class="roman-small">' + card.roman + (known ? ' · known' : '') + '</span>' +
        '</div>' +
        '<div style="display:flex;gap:8px">' +
          '<button class="icon-btn" data-act="say" title="Hear the letter">' + ICON.speaker + '</button>' +
          '<button class="icon-btn" data-act="guide" title="Show/hide guide" aria-pressed="' + state.traceGuide + '">' + ICON.eye + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="canvas-wrap">' +
        '<canvas id="guideCanvas" class="guide"></canvas>' +
        '<canvas id="drawCanvas"></canvas>' +
        '<div class="trace-note" id="traceNote">Trace over the grey letter</div>' +
      '</div>' +
      '<div class="btn-row">' +
        '<button class="btn small" data-act="clear" type="button">Clear</button>' +
        '<button class="btn small" data-act="prev" type="button">' + ICON.left + ' Prev</button>' +
        '<button class="btn small" data-act="next" type="button">Next ' + ICON.right + '</button>' +
        '<button class="btn small primary" data-act="done" type="button">Mark done</button>' +
      '</div>' +
      (card.example
        ? '<div class="example" style="max-width:100%;margin-top:16px">' +
            '<div style="flex:1;min-width:0">' +
              '<div class="ex-word">' + card.example.word + '</div>' +
              '<div class="ex-sub"><strong>' + card.example.roman + '</strong> · ' + card.example.meaning + '</div>' +
            '</div>' +
          '</div>'
        : '') +
      sentenceMarkup(card, 'data-act') +
      '<p class="hint" style="margin-top:14px">Draw with your finger on the letter. Tap Clear to try again.</p>';

    bindDeckChips($view, function () { state.traceId = null; renderTrace(); });

    $view.querySelectorAll('[data-act]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var act = btn.dataset.act;
        var list = currentDeckCards();
        var idx = -1;
        for (var i = 0; i < list.length; i++) if (list[i].id === card.id) { idx = i; break; }

        if (act === 'say') {
          sayLetter(card);
        } else if (act === 'say-sentence') {
          saySentence(card);
        } else if (act === 'guide') {
          state.traceGuide = !state.traceGuide;
          btn.setAttribute('aria-pressed', String(state.traceGuide));
          drawTraceGuide();
        } else if (act === 'clear') {
          if (traceView) {
            traceView.ctx.clearRect(0, 0, traceView.w, traceView.h);
            var note = document.getElementById('traceNote');
            if (note) note.classList.remove('hide');
          }
        } else if (act === 'prev' || act === 'next') {
          if (!list.length) return;
          var step = act === 'next' ? 1 : -1;
          var nextIdx = idx === -1 ? 0 : (idx + step + list.length) % list.length;
          state.traceId = list[nextIdx].id;
          renderTrace();
        } else if (act === 'done') {
          Store.mark(card.id, true);
          Store.markPracticed();
          updateHeader();
          toast(card.roman + ' marked known');
          if (list.length) {
            var nextIndex = idx === -1 ? 0 : (idx + 1) % list.length;
            state.traceId = list[nextIndex].id;
          }
          renderTrace();
        }
      });
    });

    setupTraceCanvas(card);
  }

  function setupTraceCanvas(card) {
    var wrap = $view.querySelector('.canvas-wrap');
    var guide = document.getElementById('guideCanvas');
    var draw = document.getElementById('drawCanvas');
    if (!wrap || !guide || !draw) return;

    var rect = wrap.getBoundingClientRect();
    var w = Math.max(1, Math.round(rect.width));
    var h = Math.max(1, Math.round(rect.height));
    var dpr = Math.min(window.devicePixelRatio || 1, 3);

    [guide, draw].forEach(function (canvas) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      var ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvas._ctx = ctx;
    });

    traceView = {
      card: card,
      guideCtx: guide._ctx,
      ctx: draw._ctx,
      w: w,
      h: h,
      drawing: false,
      last: null
    };

    drawTraceGuide();
    bindDrawEvents(draw);
  }

  function drawTraceGuide() {
    if (!traceView) return;
    var ctx = traceView.guideCtx;
    ctx.clearRect(0, 0, traceView.w, traceView.h);
    if (!state.traceGuide) return;

    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#2a1a10';
    var size = Math.round(Math.min(traceView.w, traceView.h) * 0.62);
    ctx.font = '600 ' + size + 'px "Noto Sans Tamil","Latha",system-ui,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(traceView.card.glyph, traceView.w / 2, traceView.h / 2);
    ctx.restore();
  }

  function bindDrawEvents(canvas) {
    var ctx = traceView.ctx;

    function pos(e) {
      var r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function hideNote() {
      var note = document.getElementById('traceNote');
      if (note) note.classList.add('hide');
    }

    function start(e) {
      e.preventDefault();
      traceView.drawing = true;
      traceView.last = pos(e);
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      ctx.beginPath();
      ctx.arc(traceView.last.x, traceView.last.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#b3400f';
      ctx.fill();
      hideNote();
    }

    function move(e) {
      if (!traceView.drawing) return;
      e.preventDefault();
      var p = pos(e);
      ctx.beginPath();
      ctx.moveTo(traceView.last.x, traceView.last.y);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = '#b3400f';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      traceView.last = p;
    }

    function end() {
      traceView.drawing = false;
      traceView.last = null;
    }

    canvas.addEventListener('pointerdown', start);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    canvas.addEventListener('pointerleave', end);
  }

  /* ---------- CHART ---------- */
  function letterCell(card) {
    return '<button class="letter-cell ' + (Store.isKnown(card.id) ? 'known' : '') +
      '" data-id="' + card.id + '" type="button">' +
      '<span class="lc-glyph">' + card.glyph + '</span>' +
      '<span class="lc-roman">' + card.roman + '</span>' +
      '</button>';
  }

  function renderChart() {
    var tabs = [
      { id: 'vowels', label: 'Vowels' },
      { id: 'consonants', label: 'Consonants' },
      { id: 'compounds', label: 'Compounds' }
    ];

    var body;
    if (state.chartTab === 'vowels') {
      body = '<div class="chart-grid">' + T.vowels.map(letterCell).join('') + '</div>';
    } else if (state.chartTab === 'consonants') {
      body = '<div class="chart-grid">' + T.consonants.map(letterCell).join('') + '</div>';
    } else {
      body = T.families.map(function (f) {
        var row = T.compounds.filter(function (c) { return c.family === f.roman; });
        return '<div class="family-block">' +
          '<div class="family-head">' +
            '<span class="family-key">' + f.base + '</span>' +
            '<span class="family-name">' + f.roman + ' family</span>' +
          '</div>' +
          '<div class="family-scroll">' + row.map(letterCell).join('') + '</div>' +
        '</div>';
      }).join('');
    }

    $view.innerHTML = '' +
      '<h1 class="section-title">Chart</h1>' +
      '<div class="chips">' + tabs.map(function (t) {
        return '<button class="chip ' + (state.chartTab === t.id ? 'active' : '') +
          '" data-chart="' + t.id + '" type="button">' + t.label + '</button>';
      }).join('') + '</div>' +
      '<div id="chartBody">' + body + '</div>' +
      '<p class="hint" style="margin-top:18px">Tap any letter to hear it, see the example word and sentence, or practise tracing it.</p>';

    $view.querySelectorAll('[data-chart]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.chartTab = btn.dataset.chart;
        renderChart();
      });
    });

    $view.querySelectorAll('.letter-cell').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = T.byId[btn.dataset.id];
        if (card) openSheet(card);
      });
    });
  }

  /* ---------- SHEET ---------- */
  function openSheet(card) {
    var ex = card.example;
    var body = '' +
      '<div class="sheet-head">' +
        '<div>' +
          '<div class="sheet-glyph">' + card.glyph + '</div>' +
          '<h2 class="sheet-title" id="sheetTitle">' + card.roman + '</h2>' +
          '<p class="sheet-sub">' + typeLabel(card) + '</p>' +
        '</div>' +
        '<button class="icon-btn" data-sheet="close" aria-label="Close">' + ICON.close + '</button>' +
      '</div>';

    if (ex) {
      body += '<div class="example" style="max-width:100%">' +
          '<div style="flex:1;min-width:0">' +
            '<div class="ex-word">' + ex.word + '</div>' +
            '<div class="ex-sub"><strong>' + ex.roman + '</strong> · ' + ex.meaning + '</div>' +
          '</div>' +
          '<button class="icon-btn" data-sheet="say-word" title="Hear the word">' + ICON.speaker + '</button>' +
        '</div>';
      body += sentenceMarkup(card, 'data-sheet');
    } else {
      body += '<p class="hint" style="margin-top:16px">No example word for this compound yet — use Listen and Practice.</p>';
    }

    body += '<div class="sheet-actions">' +
        '<button class="btn" data-sheet="listen" type="button">' + ICON.speaker + ' Listen</button>' +
        '<button class="btn teal" data-sheet="practice" type="button">' + ICON.pencil + ' Practice</button>' +
      '</div>';

    $sheetBody.innerHTML = body;
    $sheet.hidden = false;

    $sheetBody.querySelectorAll('[data-sheet]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var act = btn.dataset.sheet;
        if (act === 'close') closeSheet();
        else if (act === 'listen') sayLetter(card);
        else if (act === 'say-word') sayWord(card);
        else if (act === 'say-sentence') saySentence(card);
        else if (act === 'practice') {
          state.traceId = card.id;
          closeSheet();
          go('trace');
        }
      });
    });
  }

  function closeSheet() { $sheet.hidden = true; }

  /* ---------- QUIZ ---------- */
  function makeQuestion(card) {
    var deckCards = currentDeckCards();
    var modes = ['sound', 'glyph'];
    if (Audio.voiceInfo().hasTamil) modes.push('listen');
    var mode = modes[Math.floor(Math.random() * modes.length)];
    var glyphOptions = mode !== 'glyph';

    var options = [card];
    var pool = shuffle(deckCards.filter(function (c) { return c.id !== card.id; }));
    for (var i = 0; i < pool.length && options.length < 4; i++) {
      var cand = pool[i];
      var clash = options.some(function (o) {
        return glyphOptions ? o.glyph === cand.glyph : o.roman === cand.roman;
      });
      if (!clash) options.push(cand);
    }

    return { card: card, mode: mode, options: shuffle(options) };
  }

  function startQuiz() {
    var cards = currentDeckCards();
    if (!cards.length) { toast('This deck is empty'); return; }
    var pool = shuffle(cards).slice(0, Math.min(10, cards.length));
    state.quiz = {
      cards: pool,
      index: 0,
      score: 0,
      total: pool.length,
      question: makeQuestion(pool[0]),
      finished: false
    };
    renderQuiz();
  }

  function renderQuiz() {
    var q = state.quiz;
    if (!q) {
      var cards = currentDeckCards();
      $view.innerHTML = '' +
        '<h1 class="section-title">Quiz</h1>' +
        '<p class="hint" style="margin-bottom:12px">Ten quick questions. Match the sound to the letter, the letter to the sound, or listen and choose.</p>' +
        '<div class="chips">' + deckChipsHtml() + '</div>' +
        '<div class="panel" style="text-align:center">' +
          '<h3>' + currentDeck().label + '</h3>' +
          '<p class="hint">' + cards.length + ' cards in this deck · ' + Math.min(10, cards.length) + ' questions</p>' +
          '<button class="btn primary block" data-act="start" type="button" style="margin-top:14px">Start quiz</button>' +
        '</div>';
      bindDeckChips($view, renderQuiz);
      $view.querySelector('[data-act="start"]').addEventListener('click', startQuiz);
      return;
    }

    if (q.finished) {
      var pct = Math.round((q.score / q.total) * 100);
      var msg = pct === 100 ? 'Perfect — excellent!' : pct >= 70 ? 'Well done — keep going.' : 'Good start — review the deck and try again.';
      $view.innerHTML = '' +
        '<h1 class="section-title">Quiz</h1>' +
        '<div class="quiz-result">' +
          '<div class="score">' + q.score + ' / ' + q.total + '</div>' +
          '<p class="hint" style="margin:10px 0 20px">' + msg + '</p>' +
          '<div class="btn-row" style="justify-content:center">' +
            '<button class="btn primary" data-act="restart" type="button">Try again</button>' +
            '<button class="btn" data-act="newdeck" type="button">Change deck</button>' +
          '</div>' +
        '</div>';
      $view.querySelector('[data-act="restart"]').addEventListener('click', startQuiz);
      $view.querySelector('[data-act="newdeck"]').addEventListener('click', function () {
        state.quiz = null;
        renderQuiz();
      });
      return;
    }

    var question = q.question;
    var card = question.card;
    var glyphOptions = question.mode !== 'glyph';
    var label, promptHtml;

    if (question.mode === 'sound') {
      label = 'Which letter sounds like this?';
      promptHtml = '<div class="q-roman">' + card.roman + '</div>';
    } else if (question.mode === 'glyph') {
      label = 'What sound is this?';
      promptHtml = '<div class="q-glyph">' + card.glyph + '</div>';
    } else {
      label = 'Listen, then choose the letter';
      promptHtml = '<button class="icon-btn accent" data-act="replay" type="button" style="width:68px;height:68px;margin:10px auto" aria-label="Play sound">' +
        ICON.speaker + '</button>';
    }

    $view.innerHTML = '' +
      '<div class="quiz-shell">' +
        '<div class="quiz-top"><span>Question ' + (q.index + 1) + ' / ' + q.total + '</span><span>Score ' + q.score + '</span></div>' +
        '<div class="progress"><div class="progress-track"><div class="progress-fill" style="width:' +
          Math.round((q.index / q.total) * 100) + '%"></div></div></div>' +
        '<div class="quiz-prompt">' +
          '<div class="q-label">' + label + '</div>' +
          promptHtml +
        '</div>' +
        '<div class="options">' +
          question.options.map(function (o, i) {
            return '<button class="option ' + (glyphOptions ? 'glyph-option' : '') +
              '" data-opt="' + i + '" type="button">' +
              (glyphOptions ? o.glyph : o.roman) + '</button>';
          }).join('') +
        '</div>' +
      '</div>';

    var replay = $view.querySelector('[data-act="replay"]');
    if (replay) {
      replay.addEventListener('click', function () { sayLetter(card); });
    }

    $view.querySelectorAll('[data-opt]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var opt = question.options[Number(btn.dataset.opt)];
        answerQuestion(opt, btn);
      });
    });

    if (question.mode === 'listen') {
      setTimeout(function () {
        if (state.quiz === q && !q.finished && !q.answered) sayLetter(card);
      }, 280);
    }
  }

  function answerQuestion(opt, btn) {
    var q = state.quiz;
    if (!q || q.finished || q.answered) return;
    q.answered = true;

    var correctId = q.question.card.id;
    var isCorrect = opt.id === correctId;
    if (isCorrect) q.score++;
    Store.markPracticed();

    $view.querySelectorAll('[data-opt]').forEach(function (b) {
      var o = q.question.options[Number(b.dataset.opt)];
      b.disabled = true;
      if (o.id === correctId) b.classList.add('correct');
      else if (b === btn) b.classList.add('wrong');
    });

    toast(isCorrect ? 'Correct' : 'It is ' + q.question.card.roman);

    setTimeout(function () {
      if (state.quiz !== q) return;
      if (q.index + 1 >= q.total) {
        q.finished = true;
        renderQuiz();
        return;
      }
      q.index++;
      q.answered = false;
      var next = q.cards[q.index];
      q.question = makeQuestion(next);
      renderQuiz();
    }, 950);
  }

  /* ---------- calendar reminders ---------- */
  function pad2(n) { return String(n).padStart(2, '0'); }

  function icsLocal(d) {
    return d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate()) +
      'T' + pad2(d.getHours()) + pad2(d.getMinutes()) + '00';
  }

  function icsUTC(d) {
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  }

  function buildReminderICS(times) {
    var now = new Date();
    var url = location.href.split('#')[0];
    var days = 60;
    var lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Learn Tamil//Reminders//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    times.forEach(function (t, slot) {
      if (!/^\d{2}:\d{2}$/.test(t)) return;
      var h = Number(t.slice(0, 2));
      var m = Number(t.slice(3, 5));

      var first = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
      if (first.getTime() <= now.getTime()) first.setDate(first.getDate() + 1);

      for (var d = 0; d < days; d++) {
        var start = new Date(first.getFullYear(), first.getMonth(), first.getDate() + d, h, m, 0, 0);
        var end = new Date(start.getTime() + 15 * 60000);
        var letters = dailyCards(start).map(function (c) { return c.glyph; }).join(' ');
        var dateKey = start.getFullYear() + pad2(start.getMonth() + 1) + pad2(start.getDate());

        lines.push('BEGIN:VEVENT');
        lines.push('UID:tamil-' + dateKey + '-' + slot + '@learntamil');
        lines.push('DTSTAMP:' + icsUTC(now));
        lines.push('DTSTART:' + icsLocal(start));
        lines.push('DTEND:' + icsLocal(end));
        lines.push('TRANSP:TRANSPARENT');
        lines.push('SUMMARY:Tamil: ' + letters);
        lines.push('DESCRIPTION:Today\'s five letters. Open Learn Tamil to hear and trace them.');
        lines.push('URL:' + url);
        lines.push('BEGIN:VALARM');
        lines.push('TRIGGER:PT0M');
        lines.push('ACTION:DISPLAY');
        lines.push('DESCRIPTION:Tamil: ' + letters);
        lines.push('END:VALARM');
        lines.push('END:VEVENT');
      }
    });

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  function downloadReminderICS() {
    var ics = buildReminderICS(Store.settings().reminderTimes);
    var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tamil-practice.ics';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      try { URL.revokeObjectURL(a.href); } catch (err) { /* ignore */ }
      if (a.parentNode) a.parentNode.removeChild(a);
    }, 1500);
    toast('Calendar file downloaded — open it to add the reminders');
  }

  /* ---------- SETTINGS ---------- */
  function renderSettings() {
    var s = Store.settings();
    var vi = Audio.voiceInfo();
    var known = Store.knownCount(T.all);

    var installHtml = deferredInstall
      ? '<button class="btn primary block" data-act="install" type="button">Install app</button>'
      : '<p class="hint">Open the Chrome menu and choose <strong>Add to Home screen</strong> to install.</p>';

    $view.innerHTML = '' +
      '<h1 class="section-title">Settings</h1>' +

      '<div class="panel">' +
        '<h3>Voice</h3>' +
        '<div class="row">' +
          '<div style="min-width:0">' +
            '<div class="row-label"><span class="status-dot ' + (vi.hasTamil ? 'ok' : '') + '"></span>' +
              (vi.hasTamil ? 'Tamil voice ready' : 'No Tamil voice found') + '</div>' +
            '<div class="row-sub">' + (vi.hasTamil
              ? escapeHtml(vi.voiceName)
              : 'Install Tamil in Android text-to-speech, or record your own audio from a flashcard.') + '</div>' +
          '</div>' +
          '<button class="btn small" data-act="test-tts" type="button">Test</button>' +
        '</div>' +
        '<div class="row" style="display:block">' +
          '<div class="row-label" style="margin-bottom:8px">Speed <span id="rateValue">' + s.rate.toFixed(2) + '×</span></div>' +
          '<input id="rate" type="range" min="0.5" max="1.3" step="0.05" value="' + s.rate + '" aria-label="Speech speed">' +
        '</div>' +
        '<div class="row">' +
          '<div>' +
            '<div class="row-label">Auto-play letters</div>' +
            '<div class="row-sub">Speak the next card automatically</div>' +
          '</div>' +
          '<button class="switch ' + (s.autoSpeak ? 'on' : '') + '" data-act="auto" type="button" aria-pressed="' + s.autoSpeak + '" aria-label="Auto-play letters"></button>' +
        '</div>' +
      '</div>' +

      '<div class="panel">' +
        '<h3>Reminders</h3>' +
        '<p class="hint" style="margin-bottom:6px">Adds two daily Calendar alerts for the next 60 days, each showing that day\'s five letters. Regenerate anytime. The app also shows today\'s review when you open it.</p>' +
        '<div class="row">' +
          '<div><div class="row-label">Morning</div><div class="row-sub">Calendar alert</div></div>' +
          '<input type="time" data-reminder="0" value="' + s.reminderTimes[0] + '" aria-label="Morning reminder time">' +
        '</div>' +
        '<div class="row">' +
          '<div><div class="row-label">Evening</div><div class="row-sub">Calendar alert</div></div>' +
          '<input type="time" data-reminder="1" value="' + s.reminderTimes[1] + '" aria-label="Evening reminder time">' +
        '</div>' +
        '<button class="btn primary block" data-act="calendar" type="button" style="margin-top:12px">' + ICON.calendar + ' Add to calendar</button>' +
      '</div>' +

      '<div class="panel">' +
        '<h3>Your recordings</h3>' +
        '<p class="hint" id="recSummary">Loading…</p>' +
        '<div class="rec-list" id="recList"></div>' +
      '</div>' +

      '<div class="panel">' +
        '<h3>Install</h3>' +
        '<p class="hint" style="margin-bottom:12px">Installed, the app works fully offline.</p>' +
        installHtml +
      '</div>' +

      '<div class="panel">' +
        '<h3>Progress</h3>' +
        '<div class="row">' +
          '<div>' +
            '<div class="row-label">Letters marked known</div>' +
            '<div class="row-sub">' + known + ' of ' + T.all.length + ' letters</div>' +
          '</div>' +
          '<button class="btn small" data-act="reset" type="button">Reset</button>' +
        '</div>' +
      '</div>' +

      '<p class="hint" style="text-align:center;margin-top:18px">Learn Tamil script · v1 · works offline</p>';

    var testBtn = $view.querySelector('[data-act="test-tts"]');
    if (testBtn) testBtn.addEventListener('click', function () {
      if (!vi.hasTamil) toast('No Tamil voice installed on this device');
      Audio.speak('தமிழ் அ ஆ இ ஈ');
    });

    var rate = document.getElementById('rate');
    if (rate) {
      rate.addEventListener('input', function () {
        var value = Number(rate.value);
        document.getElementById('rateValue').textContent = value.toFixed(2) + '×';
        Store.setSetting('rate', value);
      });
      rate.addEventListener('change', function () {
        Audio.speak('அ', { rate: Number(rate.value) });
      });
    }

    var autoBtn = $view.querySelector('[data-act="auto"]');
    if (autoBtn) autoBtn.addEventListener('click', function () {
      var next = !Store.settings().autoSpeak;
      Store.setSetting('autoSpeak', next);
      renderSettings();
    });

    var installBtn = $view.querySelector('[data-act="install"]');
    if (installBtn) installBtn.addEventListener('click', function () {
      if (!deferredInstall) return;
      deferredInstall.prompt();
      var choice = deferredInstall.userChoice;
      deferredInstall = null;
      if (choice && choice.then) choice.then(function () { renderSettings(); });
      else renderSettings();
    });

    $view.querySelectorAll('[data-reminder]').forEach(function (input) {
      input.addEventListener('change', function () {
        var idx = Number(input.dataset.reminder);
        var times = Store.settings().reminderTimes.slice();
        times[idx] = input.value || times[idx];
        Store.setSetting('reminderTimes', times);
        toast('Saved — tap Add to calendar to update');
      });
    });

    var calBtn = $view.querySelector('[data-act="calendar"]');
    if (calBtn) calBtn.addEventListener('click', downloadReminderICS);

    var resetBtn = $view.querySelector('[data-act="reset"]');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      if (window.confirm('Reset all progress and streak? Your recordings are kept.')) {
        Store.resetProgress();
        updateHeader();
        toast('Progress reset');
        renderSettings();
      }
    });

    Audio.recordingIds().then(function (ids) {
      var summary = document.getElementById('recSummary');
      var list = document.getElementById('recList');
      if (!summary || !list) return;
      var cards = ids.map(function (id) { return T.byId[id]; }).filter(Boolean);
      if (!cards.length) {
        summary.textContent = 'No recordings yet. Tap the mic on a flashcard to record your own voice.';
        return;
      }
      summary.textContent = cards.length + ' letter' + (cards.length === 1 ? '' : 's') +
        ' recorded. Your voice plays instead of text-to-speech.';
      list.innerHTML = cards.map(function (c) {
        return '<div class="rec-item">' +
          '<span class="rec-glyph">' + c.glyph + '</span>' +
          '<span class="rec-roman">' + c.roman + '</span>' +
          '<span class="rec-actions">' +
            '<button class="mini-btn" data-play="' + c.id + '" aria-label="Play">' + ICON.play + '</button>' +
            '<button class="mini-btn" data-del="' + c.id + '" aria-label="Delete">' + ICON.trash + '</button>' +
          '</span>' +
        '</div>';
      }).join('');

      list.querySelectorAll('[data-play]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.dataset.play;
          Audio.getRecording(id).then(function (blob) {
            if (blob) Audio.playBlob(blob);
            else toast('Recording not found');
          });
        });
      });

      list.querySelectorAll('[data-del]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          Audio.deleteRecording(btn.dataset.del).then(function () {
            toast('Recording deleted');
            renderSettings();
          });
        });
      });
    });
  }

  /* ---------- boot ---------- */
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    var secure = location.protocol === 'https:' ||
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1';
    if (!secure) return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* offline cache optional */ });
    });
  }

  function setupInstall() {
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferredInstall = e;
      if (state.view === 'settings') renderSettings();
    });
    window.addEventListener('appinstalled', function () {
      deferredInstall = null;
      toast('App installed');
    });
  }

  function init() {
    var savedDeck = Store.settings().lastDeck;
    if (deckById(savedDeck).id === savedDeck) state.deck = savedDeck;
    state.learnIndex = Store.firstUnknown(currentDeckCards());

    var hash = (location.hash || '').replace('#', '');
    TABS.forEach(function (tab) { if (tab.id === hash) state.view = tab.id; });

    renderTabs();
    render();
    setupInstall();
    registerSW();

    Audio.onVoicesChanged(function () {
      if (state.view === 'settings') renderSettings();
    });

    var pill = document.getElementById('overallProgress');
    if (pill) pill.addEventListener('click', function () {
      var basics = T.vowels.concat(T.consonants);
      var n = Store.knownCount(basics);
      toast(n + ' of ' + basics.length + ' basic letters known');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSheet();
    });

    $sheet.addEventListener('click', function (e) {
      if (e.target === $sheet) closeSheet();
    });

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      if (state.view !== 'trace') return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { renderTrace(); }, 220);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
