// S1 player — duplicate-number hotfix
// This version strips any leading numbers from ID3 title (e.g., "21. Planet Fun")
// so the list shows exactly: "<trackNumber>. <clean title>"

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

// utils
const stripExt = s => s.replace(/\.mp3$/i,'').trim();
const stripLeadingNum = s => s.replace(/^\s*\d+\s*[.\-)]?\s*/,'').trim();
const fmtTime = s => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;

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
        const title  = (t.title || '').trim();
        const artist = (t.artist || '').trim();
        const track  = (t.track || '').toString().split('/')[0];
        const trackNumber = parseInt(track, 10) || undefined;
        resolve({ title, artist, trackNumber, _tags: t });
      },
      onError: () => resolve({ title: '', artist: '', trackNumber: undefined })
    });
  });
}

// Build list quickly from filenames, then upgrade with tags
async function buildList() {
  LIST.innerHTML = '';
  tracks.forEach((t, i) => {
    const fnTitle = stripLeadingNum(stripExt(t.file));
    t.meta = { title: fnTitle, artist: '', trackNumber: i+1 };
    const li = document.createElement('li');
    li.dataset.index = i;
    li.textContent = `${i+1}. ${fnTitle}`;
    li.addEventListener('click', () => load(i, true));
    LIST.appendChild(li);
  });
  // upgrade with ID3
  for (let i = 0; i < tracks.length; i++) {
    const f = tracks[i].file;
    const url = `/downloads/s1-soundtrack/${encodeURIComponent(f)}`;
    const meta = await readTags(url);
    const rawTitle = meta.title || tracks[i].meta.title;
    const title = stripLeadingNum(stripExt(rawTitle));
    const artist = meta.artist || tracks[i].meta.artist;
    const tn = meta.trackNumber || (i+1);
    tracks[i].meta = { title, artist, trackNumber: tn, _tags: meta._tags };
    const li = LIST.children[i];
    if (li) li.textContent = `${tn}. ${title}`;
    if (i === 0 && meta._tags) applyCoverFromTags(meta._tags);
  }
}

async function load(i, autoplay=false) {
  index = i;
  const t = tracks[i];
  const url = `/downloads/s1-soundtrack/${encodeURIComponent(t.file)}`;
  AUDIO.src = url;
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

// Controls
PLAY.addEventListener('click', () => { if (AUDIO.paused) AUDIO.play(); else AUDIO.pause(); });
AUDIO.addEventListener('play',  () => PLAY.textContent = '⏸');
AUDIO.addEventListener('pause', () => PLAY.textContent = '▶');
AUDIO.addEventListener('ended', () => { if (index < tracks.length - 1) load(index+1, true); });
NEXT.addEventListener('click', () => { if (index < tracks.length - 1) load(index+1, true); });
PREV.addEventListener('click', () => { if (index > 0) load(index-1, true); });

// Seek
AUDIO.addEventListener('timeupdate', () => {
  if (seeking || isNaN(AUDIO.duration)) return;
  SEEK.value = Math.floor((AUDIO.currentTime / AUDIO.duration) * 100) || 0;
  SEEK.title = `${fmtTime(AUDIO.currentTime)} / ${fmtTime(AUDIO.duration)}`;
});
SEEK.addEventListener('input', () => seeking = true);
SEEK.addEventListener('change', () => {
  if (!isNaN(AUDIO.duration)) AUDIO.currentTime = (parseInt(SEEK.value,10) / 100) * AUDIO.duration;
  seeking = false;
});

init();
