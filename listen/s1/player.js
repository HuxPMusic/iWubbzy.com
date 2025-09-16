// Playlist player that pulls /downloads/s1-soundtrack/tracks.json
// and reads ID3 tags (title/artist/track + cover art) using jsmediatags.

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
  for (let i = 0; i < tracks.length; i++) {
    const li = document.createElement('li');
    li.textContent = `${i+1}. ${tracks[i].displayTitle || tracks[i].file}`;
    li.addEventListener('click', () => load(i, true));
    LIST.appendChild(li);
  }
}

async function load(i, autoplay=false) {
  index = i;
  const t = tracks[i];
  const url = `/downloads/s1-soundtrack/${t.file}`;

  AUDIO.src = url;
  const tagMeta = await readTags(url);

  t.meta = {
    title: tagMeta.title || t.title || t.file,
    artist: tagMeta.artist || t.artist || '',
    trackNumber: tagMeta.trackNumber || (t.track || (i+1))
  };
  if (i === 0) applyCoverFromTags(tagMeta._tags);
  setNowPlaying(t.meta);

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
