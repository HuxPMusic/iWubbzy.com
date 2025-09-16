// Playlist player for S1. 
// - Uses /downloads/s1-soundtrack/tracks.json
// - Reads ID3 tags for titles/track numbers and album art
// - URL-encodes filenames so spaces/commas/apostrophes work on GitHub Pages

const AUDIO = document.getElementById('audio');
const PLAY  = document.getElementById('play');
const NEXT  = document.getElementById('next');
const PREV  = document.getElementById('prev');
const SEEK  = document.getElementById('seek');
const NOW   = document.getElementById('now-playing');
const LIST  = document.getElementById('tracklist');
const COVER = document.getElementById('cover');

let tracks = [];
let index = 0;
let seeking = false;

function stripExt(name) {
  return name.replace(/\.mp3$/i, '');
}
function fmtTime(s) {
  const m = Math.floor(s/60);
  const ss = Math.floor(s%60).toString().padStart(2,'0');
  return `${m}:${ss}`;
}
function setNowPlaying(meta) {
  const { title, artist, trackNumber } = meta;
  NOW.textContent = `${trackNumber ? trackNumber + '. ' : ''}${title}${artist ? ' — ' + artist : ''}`;
}
function applyCoverFromTags(tags) {
  if (!tags || !tags.picture) return;
  try {
    const { data, format } = tags.picture;
    const bytes = new Uint8Array(data);
    const blob = new Blob([bytes], { type: format });
    const url = URL.createObjectURL(blob);
    COVER.src = url;
  } catch {}
}
function readTags(url) {
  return new Promise((resolve) => {
    window.jsmediatags.read(url, {
      onSuccess: ({ tags }) => {
        const t = tags || {};
        const title  = t.title || '';
        const artist = t.artist || '';
        const track  = (t.track || '').toString().split('/')[0];
        const trackNumber = parseInt(track, 10) || undefined;
        resolve({ title, artist, trackNumber, _tags: t });
      },
      onError: () => resolve({ title: '', artist: '', trackNumber: undefined })
    });
  });
}

async function buildList() {
  LIST.innerHTML = '';
  // Read ID3 for each file so the list shows proper numbers/titles
  for (let i = 0; i < tracks.length; i++) {
    const f = tracks[i].file;
    const url = `/downloads/s1-soundtrack/${encodeURIComponent(f)}`;
    const meta = await readTags(url);
    const title = meta.title || stripExt(f);
    const tn = meta.trackNumber;
    tracks[i].meta = { title, artist: meta.artist || '', trackNumber: tn };
    const li = document.createElement('li');
    li.textContent = `${tn ? tn + '. ' : ''}${title}`; // number once, no .mp3
    li.addEventListener('click', () => load(i, true));
    LIST.appendChild(li);
  }
}

async function load(i, autoplay=false) {
  index = i;
  const t = tracks[i];
  const url = `/downloads/s1-soundtrack/${encodeURIComponent(t.file)}`;
  AUDIO.src = url;

  // If we don't yet have tags for this one (direct load), read them
  if (!t.meta) {
    const meta = await readTags(url);
    const title = meta.title || stripExt(t.file);
    t.meta = { title, artist: meta.artist || '', trackNumber: meta.trackNumber || (i+1) };
  }
  if (i === 0 && t.meta && t.meta._tags) applyCoverFromTags(t.meta._tags);
  setNowPlaying(t.meta);

  // Highlight list
  [...LIST.children].forEach((li, idx) => li.classList.toggle('active', idx===i));

  if (autoplay) AUDIO.play();
}

async function init() {
  try {
    const res = await fetch('/downloads/s1-soundtrack/tracks.json');
    const json = await res.json();
    tracks = json.tracks || [];
  } catch {
    tracks = [];
  }
  if (!tracks.length) {
    NOW.textContent = 'No tracks found. Add MP3s and update /downloads/s1-soundtrack/tracks.json';
    return;
  }
  await buildList();
  await load(0, false);
}

// Controls
PLAY.addEventListener('click', () => {
  if (AUDIO.paused) AUDIO.play(); else AUDIO.pause();
});
AUDIO.addEventListener('play', () => PLAY.textContent = '⏸');
AUDIO.addEventListener('pause', () => PLAY.textContent = '▶');
AUDIO.addEventListener('ended', () => {
  if (index < tracks.length - 1) load(index+1, true);
});
NEXT.addEventListener('click', () => {
  if (index < tracks.length - 1) load(index+1, true);
});
PREV.addEventListener('click', () => {
  if (index > 0) load(index-1, true);
});

// Seek
AUDIO.addEventListener('timeupdate', () => {
  if (seeking || isNaN(AUDIO.duration)) return;
  SEEK.value = Math.floor((AUDIO.currentTime / AUDIO.duration) * 100) || 0;
  SEEK.title = `${fmtTime(AUDIO.currentTime)} / ${fmtTime(AUDIO.duration)}`;
});
SEEK.addEventListener('input', () => seeking = true);
SEEK.addEventListener('change', () => {
  if (!isNaN(AUDIO.duration)) {
    AUDIO.currentTime = (parseInt(SEEK.value,10) / 100) * AUDIO.duration;
  }
  seeking = false;
});

init();
