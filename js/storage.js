/* Tiny localStorage-backed store. */
(function () {
  'use strict';

  var KEY = 'learntamil.v1';

  var defaults = {
    known: {},
    practice: { last: null, streak: 0, totalDays: 0 },
    settings: {
      rate: 0.9,
      autoSpeak: false,
      lastDeck: 'basics',
      reminderTimes: ['09:00', '20:00']
    }
  };

  var data = null;

  function dateKey(d) {
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function todayKey() { return dateKey(new Date()); }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function load() {
    if (data) return data;
    data = clone(defaults);
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          data.known = parsed.known || {};
          data.practice = Object.assign({}, defaults.practice, parsed.practice || {});
          data.settings = Object.assign({}, defaults.settings, parsed.settings || {});
          if (!Array.isArray(data.settings.reminderTimes) || data.settings.reminderTimes.length !== 2) {
            data.settings.reminderTimes = defaults.settings.reminderTimes.slice();
          }
        }
      }
    } catch (err) {
      /* corrupt storage: fall back to defaults */
    }
    return data;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(load()));
    } catch (err) {
      /* private mode / quota: progress simply won't persist */
    }
  }

  window.Store = {
    all: load,
    settings: function () { return load().settings; },
    setSetting: function (key, value) {
      load().settings[key] = value;
      save();
    },
    isKnown: function (id) {
      return !!load().known[id];
    },
    mark: function (id, known) {
      var d = load();
      if (known) d.known[id] = Date.now();
      else delete d.known[id];
      save();
    },
    knownCount: function (cards) {
      var d = load();
      var n = 0;
      for (var i = 0; i < cards.length; i++) if (d.known[cards[i].id]) n++;
      return n;
    },
    firstUnknown: function (cards) {
      var d = load();
      for (var i = 0; i < cards.length; i++) if (!d.known[cards[i].id]) return i;
      return 0;
    },
    practice: function () {
      return load().practice;
    },
    isPracticedToday: function () {
      return load().practice.last === todayKey();
    },
    markPracticed: function () {
      var p = load().practice;
      var today = todayKey();
      if (p.last === today) return p;
      var y = new Date();
      y.setDate(y.getDate() - 1);
      p.streak = p.last === dateKey(y) ? (p.streak || 0) + 1 : 1;
      p.last = today;
      p.totalDays = (p.totalDays || 0) + 1;
      save();
      return p;
    },
    resetProgress: function () {
      var d = load();
      d.known = {};
      d.practice = { last: null, streak: 0, totalDays: 0 };
      save();
    }
  };
})();
