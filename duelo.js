'use strict';
const fieldPlants = Array.from({length:32}, (_, i) => {
  const problem = [2,7,11,16,24,29].includes(i);
  const hard = i === 16 || i === 29;
  const dry = [4,14,21,30].includes(i);
  return {problem, hard, dry, angle:(i * 59) % 180};
});
let flightToken = 0;
let duelTimer = 0;
let manualPilot = null;

function duelHTML() {
  return `<section id="flight-stage" aria-label="Simulador de drone"><div class="duel-controls">
    <div class="actions"><button id="fly-duel" class="primary" disabled>Treinar e decolar com IA</button><button id="start-duel">Pilotar sem IA · 30 s</button><button id="flight-fullscreen" title="Tela cheia da missão">Tela cheia</button><button id="flight-sound" aria-pressed="${!flightMuted}">${flightMuted ? 'Som desligado' : 'Som ligado'}</button><span id="duel-clock" hidden>30 s</span></div>
    <span class="duel-key"><i></i> Drone <i></i> Pessoa</span></div>
    <div class="arena" id="duel-arena">
      <canvas hidden id="field-canvas" width="960" height="360" role="img" aria-label="Vista aérea de lavoura simulada"></canvas>
      <canvas id="survey-camera" width="840" height="330" aria-label="Câmera em perspectiva do drone"></canvas><canvas id="survey-map" width="360" height="135" aria-label="Mapa de rotas"></canvas><div class="targets" hidden>${fieldPlants.map((_,i)=>`<button data-plant="${i}" disabled aria-label="Planta ${i+1}" aria-pressed="false"></button>`).join('')}</div>
      <div id="drone-view" aria-hidden="true">
        <div class="sensor-footprint"></div>
        <div class="aircraft"><i></i><i></i><i></i><i></i><b></b></div>
      </div>
      <span id="survey-hud"></span><div class="flight-status"><span id="flight-phase">Em solo</span><span id="coverage">0 / 32</span></div>
    </div>
    <div id="duel-result" class="duel-message" role="status">GameSir: esquerdo movimenta · direito gira e sobe/desce · X marca · Y troca a câmera.</div></section>`;
}

function drawField(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#4b3924';
  ctx.fillRect(0,0,960,360);
  for (let i=0; i<5200; i++) {
    ctx.fillStyle = i % 2 ? '#7d603b55' : '#2a211844';
    ctx.fillRect((i*3391)%960,(i*233)%360,5+i%8,2);
  }
  for (let y=45; y<360; y+=90) {
    ctx.fillStyle='#253219';
    ctx.fillRect(0,y-23,960,46);
    ctx.fillStyle='#3c4928';
    ctx.fillRect(0,y+22,960,5);
  }
  fieldPlants.forEach(({problem,hard,dry,angle},i) => {
    const x = 60+(i%8)*120;
    const y = 45+Math.floor(i/8)*90;
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(angle*Math.PI/180);
    for (let leaf=0; leaf<6; leaf++) {
      ctx.rotate(Math.PI/3);
      ctx.fillStyle = dry ? '#9d993f' : ['#659b42','#83ad48','#4a873c'][leaf%3];
      ctx.beginPath();
      ctx.ellipse(15,0,19,8,0,0,Math.PI*2);
      ctx.fill();
      ctx.strokeStyle='#bfce7770';
      ctx.beginPath();
      ctx.moveTo(3,0);ctx.lineTo(31,0);ctx.stroke();
      if ((problem && leaf<(hard?1:5)) || (dry && leaf<4)) {
        ctx.fillStyle = dry ? '#a7873a' : '#a65931';
        ctx.beginPath();
        ctx.arc(18,2,hard?2:5,0,Math.PI*2);
        ctx.fill();
      }
    }
    ctx.restore();
  });
}

const rgbExamples = [
  [[153,79,43],[166,89,49],[176,96,54]],
  [[77,58,36],[125,96,59],[101,155,66],[157,153,63],[167,135,58]]
];
function trainColorModel(){
  return rgbExamples.map(group=>[0,1,2].map(channel=>group.reduce((sum,rgb)=>sum+rgb[channel],0)/group.length));
}
function scanPlants(canvas) {
  const {data} = canvas.getContext('2d').getImageData(0,0,960,360);
  const centers = trainColorModel();
  const distance = (p, rgb) => rgb.reduce((sum,value,channel)=>sum+(value-data[p+channel])**2,0);
  return fieldPlants.map((_,i) => {
    const x=60+(i%8)*120, y=45+Math.floor(i/8)*90;
    let spots=0;
    for(let dy=-34;dy<=34;dy++) for(let dx=-34;dx<=34;dx++){
      const p=((y+dy)*960+x+dx)*4;
      if(distance(p,centers[0]) < distance(p,centers[1]) && distance(p,centers[0]) < 850) spots++;
    }
    return spots>=42;
  });
}

function standardGamepad() {
  try {
    return Array.from(navigator.getGamepads?.() ?? []).find(pad => pad?.connected && pad.mapping === 'standard');
  } catch {
    return undefined;
  }
}

function countMarks(marks) {
  return [marks.filter((m,i)=>m && fieldPlants[i].problem).length,marks.filter((m,i)=>m && !fieldPlants[i].problem).length];
}
function flyDuel() {
  clearInterval(duelTimer);
  const arena=document.querySelector('#duel-arena');
  const token=++flightToken;
  const cells=[...arena.querySelectorAll('[data-plant]')];
  const takeoff=document.querySelector('#fly-duel');
  const challenge=document.querySelector('#start-duel');
  const drone=document.querySelector('#drone-view');
  const phase=document.querySelector('#flight-phase');
  const coverage=document.querySelector('#coverage');
  const result=document.querySelector('#duel-result');
  cells.forEach(cell=>{cell.disabled=true;cell.className='';});
  takeoff.disabled=true;
  challenge.disabled=true;
  drone.className='';
  survey.automatic=null;
  survey.autoPath=[];
  survey.autoPoints=[];
  phase.textContent='Varredura aérea';
  result.textContent='A câmera percorre as linhas. As caixas aparecem na área examinada.';
  const marks=scanPlants(document.querySelector('#field-canvas'));
  const route=Array.from({length:32},(_,i)=>{
    const row=Math.floor(i/8), col=i%8;
    return row*8+(row%2 ? 7-col : col);
  });
  const finish=()=>{
    stopRotor();
    survey.automatic=surveySummary(Math.round((total+1700)/1000),survey.autoPath,marks);
  
    
    cells.forEach((cell,i)=>{
      if(fieldPlants[i].problem)cell.classList.add('ground-truth');
    });
    result.textContent='Mapa concluído · '+survey.automatic.coverage+' pontos vistoriados. Avance para o relatório comparativo.';
    phase.textContent='Voo concluído';
    drone.className='';
    takeoff.textContent='Repetir voo';
    takeoff.disabled=false;
    challenge.disabled=false;
  };
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  startRotor();
  let started=performance.now();
  let start=started;
  let scanned=0, previous=-1, lastPaint=-Infinity;
  const centers=trainColorModel();
  const init=['// Treinamento supervisionado · 8 amostras RGB rotuladas','const modelo = dados.map(classe => mediaRGB(classe));',
    'centro mancha = ['+centers[0].map(Math.round).join(', ')+']',
    'centro fundo  = ['+centers[1].map(Math.round).join(', ')+']',
    'detectar(pixel) → classe mais próxima + limiar de área',
    '> Modelo carregado no drone · armando motores…'];
  const terminal=document.createElement('pre');
  terminal.className='flight-terminal';
  arena.append(terminal);
  const timeline=[];
  let total=0;
  route.forEach((cell)=>{
    timeline.push({cell,begin:total});
    total+=marks[cell] ? 1320 : 470;
  });
  function frame(now){
    if(token!==flightToken || !arena.isConnected)return;
    if(now-lastPaint<40){requestAnimationFrame(frame);return;}
    lastPaint=now;
    const boot=4400;
    if(now-started<boot){
      const line=Math.min(init.length,Math.floor((now-started)/670)+1);
      terminal.textContent=init.slice(0,line).join('\n');
      requestAnimationFrame(frame);
      return;
    }
    if(terminal.isConnected){terminal.remove();start=now;}
    const launchTime=1700;
    rotorSpeed(now-start<launchTime ? .83 : .48);
    if(now-start<launchTime){
      phase.textContent='Decolagem · câmera externa';
      drawSurvey(0,'Rota IA',[0,0,(now-start)/launchTime]);
      requestAnimationFrame(frame);
      return;
    }
    const time=now-start-launchTime;
    let step=timeline.findLastIndex(item=>item.begin<=time);
    step=Math.max(0,step);
    while(scanned<=step){
      const cell=route[scanned++];
      survey.autoPath.push(cell);
      
    }
    const cell=route[step], item=timeline[step];
    const pov=Boolean(marks[cell]) && time-item.begin>430 && time-item.begin<1050;
    if(pov && !survey.autoPoints.includes(cell))survey.autoPoints.push(cell);
    const [x,z]=surveyPoint(cell);
    const [nx,nz]=surveyPoint(route[Math.min(step+1,31)]);
    const segment=time-item.begin;
    const fraction=marks[cell] ? (segment<430 ? 0 : Math.max(0,(segment-1050)/270)) : segment/470;
    const t=Math.min(1,fraction), f=t*t*(3-2*t);
    drawSurvey(cell,pov?'IA':'Rota IA',[x+(nx-x)*(reduce?0:f),(z+(nz-z)*(reduce?0:f))*1.7],pov);
    if(pov){
      const camera=arena.querySelector('#survey-camera'), ctx=camera.getContext('2d');
      ctx.fillStyle='#9bffdb';ctx.font='600 12px monospace';
      ctx.fillText('RGB • DETECÇÃO POSITIVA',17,camera.height-60);
      ctx.fillText('ALT 1,0 m • GPS LOCAL • PONTO '+String.fromCharCode(65+z)+(x+1),17,camera.height-42);
    }
    const cameraStage=step*2+Number(pov);
    if(previous!==cameraStage){
      previous=cameraStage;
      coverage.textContent=scanned+' / 32 pontos';
      phase.textContent=pov?'Câmera de inspeção · ocorrência registrada':'Câmera externa · rota autônoma';
      if(pov){
        const code=String.fromCharCode(65+z)+(x+1);
        result.textContent='Ponto '+code+' · tonalidade anômala · coordenada salva no mapa.';
      }
    }
    if(time<total)requestAnimationFrame(frame);
    else { survey.autoPoints=route.filter(point=>marks[point]); drawSurvey(cell,'Mapa final'); finish(); }
  }
  requestAnimationFrame(frame);
}
