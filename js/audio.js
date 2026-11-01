/* Speech (TTS) + user recordings (IndexedDB). */
(function () {
  'use strict';

  var synth = window.speechSynthesis || null;
  var voices = [];
  var tamilVoice = null;
  var voiceListeners = [];
  var currentAudio = null;

  function refreshVoices() {
    if (!synth) return;
    try { voices = synth.getVoices() || []; } catch (err) { voices = []; }
    tamilVoice = null;
    for (var i = 0; i < voices.length; i++) {
      var lang = (voices[i].lang || '').toLowerCase();
      if (lang.indexOf('ta') === 0) { tamilVoice = voices[i]; break; }
    }
    voiceListeners.forEach(function (fn) { fn(voiceInfo()); });
  }

  function voiceInfo() {
    return {
      supported: !!synth,
      hasTamil: !!tamilVoice,
      voiceName: tamilVoice ? (tamilVoice.name || 'Tamil voice') : null,
      voiceCount: voices.length
    };
  }

  if (synth) {
    refreshVoices();
    try { synth.onvoiceschanged = refreshVoices; } catch (err) { /* ignore */ }
    try { synth.addEventListener('voiceschanged', refreshVoices); } catch (err) { /* ignore */ }
    /* Some engines populate voices lazily. */
    setTimeout(refreshVoices, 400);
    setTimeout(refreshVoices, 1500);
  }

  function stop() {
    if (synth) { try { synth.cancel(); } catch (err) { /* ignore */ } }
    if (currentAudio) {
      try { currentAudio.pause(); } catch (err) { /* ignore */ }
      currentAudio = null;
    }
  }

  function speak(text, opts) {
    if (!synth) return false;
    opts = opts || {};
    try {
      synth.cancel();
      var utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ta-IN';
      if (tamilVoice) utter.voice = tamilVoice;
      utter.rate = opts.rate || (window.Store ? window.Store.settings().rate : 0.9);
      utter.pitch = 1;
      utter.volume = 1;
      synth.speak(utter);
      return true;
    } catch (err) {
      return false;
    }
  }

  /* ---------- recordings ---------- */

  var DB_NAME = 'learntamil-audio';
  var DB_STORE = 'recordings';
  var dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      if (!window.indexedDB) { reject(new Error('no indexedDB')); return; }
      var req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = function () {
        if (!req.result.objectStoreNames.contains(DB_STORE)) {
          req.result.createObjectStore(DB_STORE);
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
    return dbPromise;
  }

  function tx(mode, fn) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var t = db.transaction(DB_STORE, mode);
        var store = t.objectStore(DB_STORE);
        var request = fn(store);
        t.oncomplete = function () { resolve(request ? request.result : undefined); };
        t.onerror = function () { reject(t.error); };
        t.onabort = function () { reject(t.error); };
      });
    });
  }

  function putRecording(id, blob) {
    return tx('readwrite', function (store) { return store.put(blob, id); });
  }

  function getRecording(id) {
    return tx('readonly', function (store) { return store.get(id); }).catch(function () { return null; });
  }

  function hasRecording(id) {
    return getRecording(id).then(function (blob) { return !!blob; });
  }

  function deleteRecording(id) {
    return tx('readwrite', function (store) { return store.delete(id); });
  }

  function recordingIds() {
    return tx('readonly', function (store) { return store.getAllKeys(); }).then(function (keys) {
      return keys || [];
    }).catch(function () { return []; });
  }

  function clearRecordings() {
    return tx('readwrite', function (store) { return store.clear(); }).catch(function () {});
  }

  function playBlob(blob) {
    stop();
    return new Promise(function (resolve) {
      try {
        var url = URL.createObjectURL(blob);
        var audio = new Audio(url);
        currentAudio = audio;
        var done = function () {
          URL.revokeObjectURL(url);
          if (currentAudio === audio) currentAudio = null;
          resolve(true);
        };
        audio.onended = done;
        audio.onerror = done;
        var p = audio.play();
        if (p && p.catch) p.catch(done);
      } catch (err) {
        resolve(false);
      }
    });
  }

  function playCard(card) {
    stop();
    return getRecording(card.id).then(function (blob) {
      if (blob) return playBlob(blob).then(function () { return 'recording'; });
      speak(card.say || card.glyph);
      return 'tts';
    }).catch(function () {
      speak(card.say || card.glyph);
      return 'tts';
    });
  }

  function onVoicesChanged(fn) {
    if (typeof fn === 'function') voiceListeners.push(fn);
  }

  window.Audio = {
    voiceInfo: voiceInfo,
    refreshVoices: refreshVoices,
    onVoicesChanged: onVoicesChanged,
    speak: speak,
    stop: stop,
    playCard: playCard,
    playBlob: playBlob,
    putRecording: putRecording,
    getRecording: getRecording,
    hasRecording: hasRecording,
    deleteRecording: deleteRecording,
    recordingIds: recordingIds,
    clearRecordings: clearRecordings
  };
})();
