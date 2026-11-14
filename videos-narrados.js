'use strict';

const clipDialog = document.querySelector('#narrated-clip');
const clipHost = document.querySelector('#narrated-clip-player');
const clipStatus = document.querySelector('#narrated-clip-status');
const clipPlay = document.querySelector('#narrated-clip-play');
const clipFile = document.querySelector('#narrated-clip-file');
let narratedClip = null;

let youtubeApi;

function loadYoutubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  youtubeApi ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    const timeout = setTimeout(() => fail(), 12000);
    const fail = () => {
      clearTimeout(timeout);
      script.remove();
      reject(new Error('YouTube indisponível'));
    };
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timeout);
      resolve(window.YT);
    };
    script.onerror = fail;
    document.head.append(script);
  }).catch(error => { youtubeApi = null; throw error; });
  return youtubeApi;
}

function clipSourceLabel(url) {
  return new URL(url).hostname === 'www.youtube.com' ? 'Assistir no YouTube' : 'Assistir na Embrapa';
}

function offerClipPlay(clip, play) {
  if (narratedClip !== clip) return;
  clipStatus.textContent = 'Toque em Reproduzir vídeo.';
  clipPlay.hidden = false;
  clipPlay.onclick = play;
}

function showClipUnavailable(clip) {
  if (narratedClip !== clip) return;
  clearTimeout(clip.loading);
  const player = clip.externalPlayer;
  clip.externalPlayer = null;
  player?.destroy();
  clipHost.replaceChildren();
  clipPlay.hidden = true;
  clipFile.hidden = false;
  clipStatus.textContent = 'Abra o vídeo na fonte ou selecione um MP4.';
}

async function playYoutubeClip(clip, url) {
  const id = url.hostname === 'www.youtube.com' ? url.searchParams.get('v') : null;
  if (!id || location.protocol === 'file:') {
    showClipUnavailable(clip);
    return;
  }
  try {
    const YT = await loadYoutubeApi();
    if (narratedClip !== clip) return;
    const frame = document.createElement('iframe');
    const start = Number(url.searchParams.get('start')) || 0;
    const query = new URLSearchParams({
      enablejsapi:'1', origin:location.origin, playsinline:'1', rel:'0',
      start:String(start)
    });
    frame.title = clip.slide.t;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.src = 'https://www.youtube.com/embed/' + id + '?' + query;
    clipHost.replaceChildren(frame);
    clip.loading = setTimeout(() => showClipUnavailable(clip), 15000);
    clip.externalPlayer = new YT.Player(frame, {events:{
      onReady(event) {
        if (narratedClip !== clip) return;
        clearTimeout(clip.loading);
        const play = () => event.target.playVideo();
        offerClipPlay(clip, play);
        play();
      },
      onAutoplayBlocked(event) { offerClipPlay(clip, () => event.target.playVideo()); },
      onStateChange(event) {
        if (narratedClip !== clip) return;
        if (event.data === 0) closeNarratedClip(true);
        if (event.data !== 1) return;
        clipPlay.hidden = true;
        clipStatus.textContent = 'Reproduzindo vídeo.';

      },
      onError() { showClipUnavailable(clip); }
    }});
  } catch {
    showClipUnavailable(clip);
  }
}

function releaseClipVideo(clip) {
  clearTimeout(clip.loading);
  const video = clip.video;
  clip.video = null;
  if (video) {
    video.pause();
    video.removeAttribute('src');
    video.load();
  }
  if (clip.objectUrl) {
    URL.revokeObjectURL(clip.objectUrl);
    clip.objectUrl = null;
  }
  clipHost.replaceChildren();
}

function closeNarratedClip(resume = false) {
  const clip = narratedClip;
  if (!clip) return;
  narratedClip = null;
  releaseClipVideo(clip);
  clip.externalPlayer?.destroy();
  clipPlay.hidden = true;
  clipPlay.onclick = null;
  clipFile.hidden = true;
  clipFile.value = '';
  if (clipDialog.open) clipDialog.close();
  if (clip.enteredFullscreen && document.fullscreenElement === document.documentElement) {
    document.exitFullscreen?.().catch(() => {});
  }
  if (resume) clip.onDone();
}

function playLocalNarratedClip(clip, src) {
  const video = document.createElement('video');
  clip.video = video;
  video.controls = video.playsInline = true;
  clipStatus.textContent = 'Carregando vídeo…';
  clipPlay.hidden = true;
  clipFile.hidden = true;
  const isCurrent = () => narratedClip === clip && clip.video === video;
  const unavailable = () => {
    if (!isCurrent()) return;
    releaseClipVideo(clip);
    if (clip.fallback) showClipUnavailable(clip);
    else {
      clip.fallback = true;
      clipStatus.textContent = 'Abrindo vídeo online…';
      playYoutubeClip(clip, new URL(clip.slide.url));
    }
  };
  video.addEventListener('error', unavailable);
  video.addEventListener('loadedmetadata', () => clearTimeout(clip.loading), {once:true});
  video.addEventListener('ended', () => { if (isCurrent()) closeNarratedClip(true); });
  video.addEventListener('playing', () => {
    if (!isCurrent()) return;
    clipPlay.hidden = true;
    clipStatus.textContent = '';
  });
  clipHost.replaceChildren(video);
  clip.loading = setTimeout(unavailable, 8000);
  video.src = src;
  const play = () => video.play().catch(() => {
    if (!isCurrent() || video.error) return;
    clipStatus.textContent = 'Clique em Reproduzir vídeo para iniciar com som.';
    clipPlay.hidden = false;
    clipPlay.onclick = play;
  });
  play();
}

function openNarratedClip(slide, onDone) {
  closeNarratedClip();
  const clip = {slide, onDone};
  narratedClip = clip;
  document.querySelector('#narrated-clip-title').textContent = slide.t;
  const source = document.querySelector('#narrated-clip-source');
  source.href = slide.url;
  source.textContent = clipSourceLabel(slide.url);
  clipDialog.showModal();
  playLocalNarratedClip(clip, 'midia/videos/' + slide.file);
}

clipFile.addEventListener('change', () => {
  const file = clipFile.files[0];
  const clip = narratedClip;
  if (!file || !clip) return;
  releaseClipVideo(clip);
  clip.externalPlayer?.destroy();
  clip.externalPlayer = null;
  clip.objectUrl = URL.createObjectURL(file);
  playLocalNarratedClip(clip, clip.objectUrl);
});
document.querySelector('#narrated-clip-continue').addEventListener('click', () => closeNarratedClip(true));
document.querySelector('#narrated-clip-fullscreen').addEventListener('click', async () => {
  const clip = narratedClip;
  if (!clip || document.fullscreenElement || !document.documentElement.requestFullscreen) return;
  try {
    await document.documentElement.requestFullscreen();
    if (narratedClip === clip) clip.enteredFullscreen = true;
    else await document.exitFullscreen?.();
  } catch { /* The player already fills the browser viewport. */ }
});
clipDialog.addEventListener('cancel', event => {
  event.preventDefault();
  closeNarratedClip(true);
});
