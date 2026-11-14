'use strict';

const narrations = [
  "Este trabalho é da disciplina Computadores e Sociedade, do Centro de Informática da Universidade Federal da Paraíba. Vamos apresentar aplicações da inteligência artificial na agropecuária, da análise da lavoura ao acompanhamento do rebanho.",
  "Como a inteligência artificial pode ajudar durante o super El Niño? Para responder, vamos começar pelo risco climático e depois ligar a previsão ao que os sensores e as imagens mostram no campo. O El Niño já está em andamento. Em doze de novembro, a agência americana NOAA estimou mais de setenta e nove por cento de chance de o evento continuar forte a muito forte até o primeiro trimestre de dois mil e vinte e sete. O pico é esperado de novembro a janeiro. Essa probabilidade se refere ao fenômeno no Pacífico. Para saber o risco na fazenda, precisamos olhar a previsão regional e os dados do lugar.",
  "A previsão para novembro a janeiro indica mais chance de chuva acima da média no Sul. No Norte e em partes do Nordeste, o risco é o inverso. Em áreas do Centro-Oeste e Sudeste, o quadro varia. Na prática, o que pesa é onde a lavoura está, em que fase ela se encontra e como a chuva se distribui. Não dá para concluir que a safra inteira vai ganhar ou perder.",
  "O boletim climático mostra cenários. Um temporizador apenas liga a bomba no horário. Um modelo de inteligência artificial pode usar exemplos de chuva, umidade e fase da lavoura para apontar onde vale a pena medir de novo. Essa é a diferença que importa durante o El Niño.",
  "Primeiro entram três coisas: o que a previsão indica, o que já aconteceu e o que o solo mostra. Com exemplos anteriores, o modelo estima quais talhões têm maior risco. A equipe checa o sensor ou vai até o ponto. Só depois decide se muda a irrigação, a drenagem ou o horário da operação.",
  "Se a chuva falhar e o solo estiver perdendo umidade, o sistema pode apontar onde conferir antes de irrigar. Se chover demais, as imagens ajudam a localizar baixadas para vistoria antes de mandar uma máquina. Para semeadura, a previsão é mais uma informação: a janela oficial vem do ZARC.",
  "Imagine que dois talhões de uma propriedade receberam a mesma previsão de pouca chuva. Uma está em fase mais sensível e o sensor dela mostra que o solo está secando mais rápido. O modelo coloca essa área no topo da lista de vistoria. A equipe confirma a leitura. Se houver irrigação, avalia se ela é necessária. Se ainda for plantar, confere a janela oficial. O cenário é hipotético.",
  "Um talhão pode ter áreas com necessidades diferentes. A imagem aérea ajuda a localizar pontos suspeitos. Clima e umidade do solo ajudam a estimar a necessidade de água. O histórico das safras ajuda a estimar a produtividade.",
  "O satélite Sentinel Dois observa grandes áreas. Quatro de suas treze bandas têm resolução de dez metros por pixel. Um drone consegue observar detalhes de uma área menor. O sensor de solo mede a umidade em pontos selecionados. Cruzar os três dados ajuda a planejar a vistoria.",
  "O tutorial da Embrapa apresenta a ClimAPI, que reúne dados como chuva e temperatura. Observe como esses dados podem apoiar o planejamento da lavoura. Esses dados podem entrar num modelo que estima risco. A equipe precisa verificar se a estimativa funciona na região e para aquela cultura.",
  "Neste vídeo institucional, a Embrapa apresenta a agricultura digital. Observe quais informações uma fazenda pode registrar para acompanhar a produção. A ideia principal é transformar observações do campo em registros que possam ser comparados. Por exemplo, o produtor pode acompanhar as imagens de um talhão e verificar como ele mudou ao longo da safra.",
  "Um modelo pode acertar muitas folhas fotografadas em condições controladas e acertar menos quando recebe imagens diferentes. Luz, fundo, câmera e variedade da planta mudam os pixels. Por isso, vale testar o modelo em outros lugares, antes de confiar nos alertas em campo.",
  "Este vídeo trata do controle localizado de plantas daninhas com drones. Observe como se passa da imagem aérea à escolha dos pontos de intervenção. Primeiro vem a coleta das imagens. Depois vem a interpretação do mapa. Com esse mapa, o produtor decide quais pontos visitar. A visita ajuda a distinguir falta de água, doença e outros problemas com aparência parecida.",
  "O conjunto Crop and Weed reúne mais de oito mil imagens e inclui setenta e quatro espécies. As anotações ajudam o computador a identificar a planta, delimitar sua área e encontrar o caule. São tarefas úteis quando se quer intervir em pontos específicos.",
  "Em uma pesquisa pela internet feita em dois mil e vinte, cerca de oitenta e quatro por cento dos quinhentos e quatro produtores que responderam disseram usar alguma tecnologia digital. O número descreve esse grupo e inclui ferramentas digitais de vários tipos.",
  "Até aqui, acompanhamos a água e a chuva na lavoura. Agora vamos usar a mesma sequência no rebanho. Quando há risco de calor, a previsão ajuda a preparar a equipe e os sensores ajudam a indicar onde olhar primeiro.",
  "Para o gado, calor, água e pastagem merecem atenção. Um sistema pode cruzar temperatura, umidade e atividade dos animais para avisar onde vale a pena olhar primeiro. Se o alerta vier junto com uma queda de produção, a equipe confere o ambiente e examina os animais. O aviso ajuda a organizar o trabalho, mas não identifica sozinho a causa.",
  "Coleiras ou brincos podem registrar atividade. A ordenha automatizada registra informações como produção e condutividade do leite. Uma câmera pode ajudar a contar animais ou classificar posturas. Cada sensor responde a uma pergunta diferente.",
  "O sistema associa um registro ao animal. Em seguida, compara os dados atuais com o comportamento habitual. Se detectar uma mudança importante, envia um alerta. A equipe examina o animal e anota o resultado.",
  "Um falso positivo é um alerta sobre um problema que a inspeção não confirma. Um falso negativo acontece quando o problema existe e o sistema não alerta. Na prática, os dois erros têm custos diferentes.",
  "No vídeo sobre pecuária, preste atenção ao que dispara o alerta. É uma mudança na atividade, na produção ou em outro sinal? Depois pense em quem recebe esse aviso e como poderia conferir o animal.",
  "Em gado de leite, o produtor pode cruzar produção com outros sinais. Em gado de corte, pode acompanhar peso e atividade. Em aves, câmeras ajudam a observar como o grupo se distribui no galpão.",
  "No futuro da pecuária de precisão, um sistema pode combinar atividade, ruminação e dados de ordenha. Uma queda na ruminação pode ter causas diferentes. O histórico ajuda a decidir quem inspecionar e a equipe confirma o motivo.",
  "Imagine mil observações, com vinte ocorrências reais. Se o modelo encontrar dezesseis e gerar quarenta e nove alarmes falsos, apenas cerca de um quarto dos alertas será confirmado. Essa conta mostra por que vale medir a carga de trabalho junto com a capacidade de detectar problemas.",
  "Para decidir se a tecnologia vale a pena, pergunte quantos erros aparecem em campo, quem consegue responder aos alertas, e quanto custa operar o sistema com equipamento, manutenção e treinamento.",
  "Volte ao exemplo dos dois talhões. Depois que o sistema apontou um talhão, como a equipe descobre onde olhar? O drone percorre a área. Nesta demonstração, o modelo aprende com exemplos de cor e marca pontos diferentes. A equipe ainda precisa ir ao local para distinguir falta de água, doença e outros sinais parecidos.",
  "Vamos testar a etapa de vistoria. Primeiro, o piloto marca plantas suspeitas. Depois, o drone com inteligência artificial percorre a área e registra seus próprios pontos. No final, vamos comparar tempo, cobertura e acertos. A simulação mostra como priorizar a inspeção.",
  "O relatório compara quantos pontos cada lado visitou, quanto tempo levou e quantos alvos foram detectados. O piloto confere os registros após o voo. O drone salva as coordenadas durante a inspeção. Os resultados variam conforme a rodada, e os custos são ilustrativos.",
  "A câmera registra pontos de cor chamados pixels. O classificador compara cores e o sistema marca candidatos. Depois, a equipe vai a campo para entender a causa e decidir se precisa intervir.",
  "O gráfico compara o acesso à internet nos domicílios urbanos e rurais do Brasil em dois mil e vinte e três. O sinal pode variar na área de produção. Um equipamento pode processar parte dos dados na fazenda e sincronizar depois.",
  "Comece com um problema que possa ser medido. Compare a solução com a prática atual. Repita o teste em outros lotes ou safras. Acompanhe os erros e o impacto ao longo do tempo.",
  "Uma direção promissora é processar imagens no próprio equipamento. Isso permite registrar pontos mesmo quando a conexão fica instável. Uma nova safra, câmera ou iluminação pode exigir nova calibração.",
  "No próximo boletim, primeiro veja qual risco merece atenção na região. Depois combine a previsão com o que mediu na fazenda. Use a inteligência artificial para ordenar os pontos a verificar. Por último, registre o que aconteceu. Assim dá para saber em que situações o alerta ajudou.",
  "As fontes estão nesta tela e no botão Fontes. Entre elas estão pesquisas sobre imagens de plantas e sensores de rebanho, estudos sobre agricultura digital e dados do Instituto Brasileiro de Geografia e Estatística.",
  "Obrigado, pessoal! Se vocês pudessem usar inteligência artificial na fazenda para resolver um problema, qual escolheriam?"
];

const voice = window.speechSynthesis;
const player = document.querySelector('#narration');
const playVoice = document.querySelector('#narration-play');
const voiceStatus = document.querySelector('#narration-status');
let active = false, paused = false, version = 0;
let nextSentence = 0, currentSpeech = null;

const voiceSelect = document.querySelector('#narration-voice');
const speedSelect = document.querySelector('#narration-speed');
const settings = document.querySelector('#narration-settings');
const transcript = document.querySelector('#narration-transcript');

function preference(key, value) {
  try {
    if (value === undefined) return localStorage.getItem('agro-narration-' + key);
    localStorage.setItem('agro-narration-' + key, value);
  } catch { /* Storage can be disabled for local files. */ }
}

function portugueseVoices() {
  return (voice?.getVoices() ?? []).filter(item => /^pt(?:[-_]|$)/i.test(item.lang)).sort((a, b) => {
    const quality = item => (/^pt[-_]BR$/i.test(item.lang) ? 4 : 0)
      + (/natural|neural|premium|enhanced|google/i.test(item.name) ? 3 : 0)
      + (item.default ? 1 : 0);
    return quality(b) - quality(a);
  });
}

function updateVoiceOptions() {
  const saved = preference('voice') ?? voiceSelect.value;
  const voices = portugueseVoices();
  voiceSelect.replaceChildren(new Option('Automática (português)', ''));
  for (const item of voices) voiceSelect.add(new Option(item.name + ' · ' + item.lang, item.voiceURI));
  if (voices.some(item => item.voiceURI === saved)) voiceSelect.value = saved;
}

function narrationState(status, isError = false) {
  playVoice.textContent = active && !paused ? 'Pausar' : paused ? 'Continuar' : 'Ouvir';
  voiceStatus.textContent = status;
  voiceStatus.classList.toggle('narration-sr', !isError);
}
function stopNarration() {
  closeNarratedClip();
  version++;
  active = paused = false;
  nextSentence = 0;
  currentSpeech = null;
  voice?.cancel();
}
function narrationError(message) {
  stopNarration();
  narrationState(message, true);
  settings.open = transcript.open = true;
}
function finishNarratedSlide() {
  if (document.querySelector('#narration-auto').checked && current < slides.length - 1) render(current + 1);
  else {
    stopNarration();
    narrationState(current === slides.length - 1 ? 'Apresentação concluída.' : 'Leitura do slide concluída.');
  }
}
function speakSlide() {
  const token = ++version;
  voice.cancel();
  // Join short phrases so the synthesizer can preserve the flow within a paragraph.
  const chunks = [];
  for (const phrase of narrations[current].match(/[^.!?]+[.!?]*/g) ?? []) {
    const text = phrase.trim();
    if (chunks.length && chunks.at(-1).length + text.length < 190) chunks[chunks.length - 1] += ' ' + text;
    else chunks.push(text);
  }
  const choices = portugueseVoices();
  const selected = choices.find(item => item.voiceURI === voiceSelect.value) ?? choices[0];
  const advance = () => {
    if (token !== version) return;
    if (nextSentence >= chunks.length) {
      const slide = slides[current];
      if (slide.type === 'clip') {
        const focus = document.activeElement;
        openNarratedClip(slide, () => {
          if (token !== version) return;
          finishNarratedSlide();
          if (focus?.isConnected) focus.focus();
        });
      } else finishNarratedSlide();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(chunks[nextSentence]);
    utterance.lang = selected?.lang ?? 'pt-BR';
    if (selected) utterance.voice = selected;
    utterance.rate = Number(speedSelect.value);
    currentSpeech = utterance;
    utterance.onend = () => { if (token === version) { nextSentence++; advance(); } };
    utterance.onerror = () => {
      if (token === version) narrationError('Voz indisponível. Selecione outra voz ou leia a transcrição em Ajustes.');
    };
    narrationState('Narrando · slide ' + (current + 1) + ' de ' + slides.length);
    voice.speak(currentSpeech);
  };
  advance();
}
function narrationOnSlide() {
  document.querySelector('#narration-text').textContent = narrations[current];
  document.querySelector('#narration-page').textContent = (current + 1) + ' / ' + slides.length;
  document.querySelector('#narration-back').disabled = current === 0;
  document.querySelector('#narration-next').disabled = current === slides.length - 1;
  if (player.hidden) return;
  const resume = active && !paused;
  stopNarration();
  if (resume) { active = true; speakSlide(); }
  else narrationState('Pronto para ouvir o slide ' + (current + 1) + '.');
}
const fullscreenOpen = document.querySelector('#fullscreen-narration-open');
function presentationFullscreen() {
  return document.fullscreenElement === document.documentElement || compactFallback;
}
function syncNarrationFullscreen() {
  const compact = presentationFullscreen();
  document.documentElement.classList.toggle('presentation-fullscreen', compact);
  fullscreenOpen.hidden = !compact || !player.hidden;
}
function openNarration() {
  player.hidden = false;
  syncNarrationFullscreen();
  updateVoiceOptions();
  if (!voice || !window.SpeechSynthesisUtterance) {
    playVoice.disabled = true;
    narrationError('Leitura por voz indisponível. Abra a transcrição em Ajustes.');
  } else if (!active) {
    active = true;
    speakSlide();
  }
  (playVoice.disabled ? settings.querySelector('summary') : playVoice).focus();
}
document.querySelector('#narration-open').addEventListener('click', openNarration);
fullscreenOpen.addEventListener('click', openNarration);
playVoice.addEventListener('click', () => {
  if (active && !paused) {
    version++;
    voice.cancel();
    paused = true;
    narrationState('Pausado. Ao continuar, este trecho recomeça.');
    return;
  }
  active = true;
  paused = false;
  speakSlide();
});
document.querySelector('#narration-repeat').addEventListener('click', () => {
  if (playVoice.disabled) return;
  stopNarration();
  active = true;
  speakSlide();
});
document.querySelector('#narration-close').addEventListener('click', () => {
  stopNarration();
  player.hidden = true;
  settings.open = false;
  syncNarrationFullscreen();
  (presentationFullscreen() ? fullscreenOpen : document.querySelector('#narration-open')).focus();
});
document.querySelector('#narration-back').addEventListener('click', () => render(current - 1));
document.querySelector('#narration-next').addEventListener('click', () => render(current + 1));
document.querySelector('#narration-fullscreen').addEventListener('click', fullscreen);
document.addEventListener('fullscreenchange', syncNarrationFullscreen);
speedSelect.addEventListener('change', () => {
  preference('speed', speedSelect.value);
  if (active && !paused) speakSlide();
});
voiceSelect.addEventListener('change', () => {
  preference('voice', voiceSelect.value);
  if (active && !paused) speakSlide();
});
const savedSpeed = preference('speed');
if (['0.65','0.8','1','1.15'].includes(savedSpeed)) speedSelect.value = savedSpeed;
voice?.addEventListener?.('voiceschanged', updateVoiceOptions);
updateVoiceOptions();
window.addEventListener('pagehide', stopNarration);
narrationOnSlide();
