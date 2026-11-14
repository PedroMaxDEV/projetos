'use strict';
const $ = (selector) => document.querySelector(selector);
const slideNode = $('#slide');
const dialog = $('#dialog');
let current = 0;

const link = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
const sourceLink = (key) => link(refs[key][3], refs[key][0]);

function photo(key, preferReal = false, linkPhoto = true) {
  const [description, url] = photos[key];
  return `<figure class="photo"><div class="radar" aria-hidden="true"></div>
    <img data-remote="${url}" data-photo-key="${key}" data-prefer-real="${preferReal}" src="${preferReal ? url : 'midia/imagens/'+key+'.jpg'}" alt="${description}" hidden>
    ${linkPhoto ? `<a class="photo-link" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Abrir foto on-line: ${description}"><span>Ver foto on-line ↗</span></a>` : ''}
    <figcaption>Ilustração · ${description}</figcaption></figure>`;
}

function attachPhotos() {
  for (const img of slideNode.querySelectorAll('img[data-remote]')) {
    const show = () => {
      if (img.dataset.preferReal === 'true' && !img.dataset.retried) img.closest('.photo').querySelector('figcaption').textContent = 'Fotografia de campo';
      img.hidden = false;
      const photoLink = img.closest('.photo').querySelector('.photo-link');
      if (photoLink) photoLink.hidden = true;
    };
    const fallback = () => {
      if (img.dataset.retried) return;
      img.dataset.retried = 'true';
      if (img.dataset.preferReal === 'true') {
        img.src='midia/imagens/'+img.dataset.photoKey+'.jpg';
        return;
      }
      img.closest('.photo').classList.add('illustrated');
      img.closest('.photo').querySelector('figcaption').textContent = 'Ilustração · referência visual no link';
    };
    img.addEventListener('load', show);
    img.addEventListener('error', fallback);
    if (img.complete) img.naturalWidth ? show() : fallback();
  }
}

function cards(items, steps = false) {
  return `<div class="cards" style="--cols:${items.length}">${items.map(([title, text], index) => `
    <article class="card" style="--i:${index}">${steps ? `<span class="step" aria-hidden="true">0${index + 1}</span>` : ''}
    <h2>${title}</h2><p>${text}</p></article>`).join('')}</div>`;
}

function bodyFor(slide, title) {
  const lead = slide.lead ? `<p class="lead">${slide.lead}</p>` : '';
  switch (slide.type) {
    case 'hero':
      if (slide.course) return `<div class="two hero university-cover"><div><p class="eyebrow">${slide.institution}</p><p class="cover-course">${slide.course}</p>${title}</div>${photo(slide.photo)}</div>`;
      return `<div class="two hero"><div>${title}${lead}</div>${photo(slide.photo)}</div>`;
    case 'bars':
      return title + lead + `<div class="bars" aria-label="Acurácia, escala de zero a cem por cento">${slide.bars.map(([label, amount, formatted]) => `<div class="bar-row"><div class="bar-label"><span>${label}</span><strong>${formatted}</strong></div><div class="bar-track"><div class="bar-fill" style="width:${amount}%"></div></div></div>`).join('')}</div>`;
    case 'stat':
      return title + `<section class="stat-grid"><strong class="stat-number">${slide.stat}</strong><div class="stat-copy"><p>Dos 504 produtores que responderam à consulta on-line, cerca de 84% usavam alguma tecnologia digital.</p><small>Consulta de 2020 · amostra de respondentes · inclui ferramentas sem IA</small></div></section>`;
    case 'real':
      return title + '<div class="two">'+photo(slide.photo, true)+'<div>'+lead+'<div class="actions">'+link(refs[slide.s[0]][3],'Abrir fotografia real e crédito ↗')+'</div></div></div>';
    case 'report':
      return title + '<div id="survey-report" class="survey-report"></div>';
    case 'bibliography':
      return title + '<div class="bibliography">'+slide.s.map(key=>'<article><strong>'+sourceLink(key)+'</strong><span>'+refs[key][1]+'</span></article>').join('')+'</div>';
    case 'thanks':
      return '<div class="two hero closing"><div>'+title+lead+'</div>'+photo(slide.photo)+'</div>';
    case 'duel':
      return title + duelHTML();
    case 'clip':
      return title + `<div class="two clip-layout">
        <div class="clip-preview"><button id="open-clip" aria-label="Reproduzir vídeo" title="Reproduzir vídeo">
          ${photo(slide.photo, false, false)}<span class="clip-play-icon" aria-hidden="true">▶</span>
        </button><div class="clip-source">${link(slide.url, clipSourceLabel(slide.url))}</div></div>
        <div class="video-text">${lead}</div></div>`;
    default:
      if (slide.photo) return title + `<div class="two">${cards(slide.cards)}${photo(slide.photo)}</div>`;
      return title + cards(slide.cards, slide.type === 'flow');
  }
}

function render(index) {
  if (document.fullscreenElement?.id === 'flight-stage') document.exitFullscreen?.().catch(()=>{});
  stopRotor();
  manualPilot = null;
  clearInterval(duelTimer);
  current = Math.min(slides.length - 1, Math.max(0, index));
  const slide = slides[current];
  document.body.dataset.block = slide.b;
  document.querySelectorAll('[data-block]').forEach((button) => {
    if (button.tagName === 'BUTTON') button.setAttribute('aria-current', Number(button.dataset.block) === slide.b);
  });
  const title = `<h1>${slide.t}</h1>`;
  slideNode.innerHTML = `<article class="content ${slide.type || ''} ${slide.cards?.length === 1 ? 'summary-slide' : ''}">${slide.course ? '' : `<p class="eyebrow">Aluno ${slide.b} · ${blocks[slide.b - 1]}</p>`}${bodyFor(slide, title)}</article>`;
  const references = slide.s.map(sourceLink).join(' · ');
  const practical = slide.type === 'duel' ? ' · Dados sintéticos, elaboração do grupo' : '';
  $('#credit').innerHTML = 'Fontes · ' + references + practical;
  $('#page').textContent = `${String(current + 1).padStart(2, '0')} / ${slides.length}`;
  $('#progress').style.width = `${((current + 1) / slides.length) * 100}%`;
  $('#prev').disabled = current === 0;
  $('#next').disabled = current === slides.length - 1;
  const fragment = '#slide-' + (current + 1);
  if (location.hash !== fragment) history.replaceState(null, '', fragment);
  attachPhotos();
  if (slide.type === 'duel') { drawField(document.querySelector('#field-canvas')); drawSurvey(0,'Em solo'); }
  if (slide.type === 'report') showSurveyResults(document.querySelector('#survey-report'));
  window.scrollTo(0, 0);
  if (typeof narrationOnSlide === 'function') narrationOnSlide();
}

function openDialog(key) {
  const slide = slides[current];
  const titles = {roteiro:'Roteiro do grupo', fontes:'Referências e créditos', midia:'Fotos e vídeos', };
  $('#dialog-title').textContent = titles[key];
  let content = '';
  if (key === 'roteiro') {
    content = `<article class="note"><strong>Slide ${current + 1} · ${slide.m} min · ${slide.t}</strong><p>${slide.note}</p></article>` +
      blocks.map((block, index) => {
        const total = slides.filter((item) => item.b === index + 1).reduce((sum, item) => sum + item.m, 0);
        return `<details ${slide.b === index + 1 ? 'open' : ''}><summary>Aluno ${index + 1} · ${block} · ${total} min</summary><div class="agenda">${slides.map((item, position) => item.b === index + 1 ? `<button data-go="${position}">${item.m} min · ${item.t}</button>` : '').join('')}</div></details>`;
      }).join('');
  }
  if (key === 'fontes') content = Object.values(refs).map(([author, title, details, url]) => `<article class="reference"><strong>${author}</strong><p>${link(url, title)}</p><small>${details}</small></article>`).join('');
  if (key === 'midia') {
    content = '<p>As imagens ilustrativas já estão incluídas. Para exibir os vídeos offline, coloque os MP4 com os nomes abaixo. Os vídeos de origem estão em português. Separe trechos de até 90 segundos para a sala.</p>';
    content += slides.filter(item=>item.type==='clip').map(item=>`<p><code>midia/videos/${item.file}</code> · ${link(item.url,'Ver vídeo original')}</p>`).join('');
    content += Object.entries(photos).map(([name, [label, url, ref]]) => `<article class="media-item"><strong>${label}</strong><p><code>midia/imagens/${name}.jpg</code> · ${link(url, 'Abrir imagem ↗')} · ${sourceLink(ref)}</p></article>`).join('');
  }

  $('#dialog-body').innerHTML = content;
  dialog.scrollTop = 0;
  if (!dialog.open) dialog.showModal();
}

let compactFallback = false;
async function fullscreen() {
  if (document.fullscreenElement) {
    await document.exitFullscreen?.().catch(()=>{});
  } else if (compactFallback) {
    compactFallback = false;
  } else {
    try {
      if (!document.documentElement.requestFullscreen) throw new Error('Fullscreen unavailable');
      await document.documentElement.requestFullscreen();
    } catch {
      compactFallback = true;
    }
  }
  if (typeof syncNarrationFullscreen === 'function') syncNarrationFullscreen();
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.go !== undefined) {
    if (dialog.open) dialog.close();
    render(Number(button.dataset.go));
  }
  if (button.dataset.block) render(slides.findIndex((slide) => slide.b === Number(button.dataset.block)));
  if (button.dataset.dialog) openDialog(button.dataset.dialog);
  if (button.id === 'prev') render(current - 1);
  if (button.id === 'next') render(current + 1);
  if (button.id === 'fullscreen') fullscreen();
  if (button.id === 'open-clip') {
    if (typeof stopNarration === 'function') { stopNarration(); narrationOnSlide(); }
    openNarratedClip(slides[current], () => button.focus());
  }
  if (button.id === 'flight-fullscreen') {
    const stage = document.querySelector('#flight-stage');
    const action = document.fullscreenElement === stage ? document.exitFullscreen?.() : stage.requestFullscreen?.();
    action?.catch(() => { document.querySelector('#duel-result').textContent = 'Tela cheia indisponível. Tente abrir no Chrome ou Edge.'; });
  }
  if (button.id === 'flight-sound') toggleFlightAudio(button);
  if (button.id === 'start-duel') startFreeFlight();
  if (button.id === 'fly-duel') flyDuel();
});

document.addEventListener('keydown', (event) => {
  if (dialog.open || document.querySelector('#narrated-clip').open || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('video,input,textarea,select')) return;
  if (event.key === 'Escape' && compactFallback) { fullscreen(); return; }
  if (flightKey(event)) { event.preventDefault(); return; }
  if (event.key === 'ArrowRight' || event.key === 'PageDown') render(current + 1);
  else if (event.key === 'ArrowLeft' || event.key === 'PageUp') render(current - 1);
  else if (event.key === 'Home') render(0);
  else if (event.key === 'End') render(slides.length - 1);
  else if (event.key.toLowerCase() === 'f') fullscreen();
  else if (event.key.toLowerCase() === 'r') openDialog('roteiro');
  else return;
  event.preventDefault();
});

function fromHash() {
  const match = /^#slide-(\d+)$/.exec(location.hash);
  render(match ? Number(match[1]) - 1 : 0);
}
window.addEventListener('hashchange', fromHash);
fromHash();
