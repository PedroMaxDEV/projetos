'use strict';
const survey = {path:[],frames:[],autoPath:[],manual:null,automatic:null,review:null};
const surveyPoint = i => [i % 8, Math.floor(i / 8)];
const money = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const duration = 30;

function drawSurvey(cell, mode, flightPoint, locked=false) {
  const canvas=document.querySelector('#survey-camera');
  const map=document.querySelector('#survey-map');
  if (!canvas || !map) return;
  const [cx,cz]=surveyPoint(cell);
  renderFlight3D(canvas,flightPoint ?? [cx,cz*1.7],mode,locked,performance.now());
  const m=map.getContext('2d');
  paintFarmMap(m,map.width,map.height);
  const px=i=>(85+((i%8)+.5)*549/8)*map.width/720;
  const py=i=>(28+(Math.floor(i/8)+.5)*201/4)*map.height/288;
  for(const [route,color] of [[survey.path,'#ffcf80'],[survey.autoPath,'#60ffe8']]){
    m.strokeStyle=color;m.lineWidth=3;m.beginPath();
    route.forEach((p,i)=>i?m.lineTo(px(p),py(p)):m.moveTo(px(p),py(p)));
    m.stroke();
  }
  for(const [points,color] of [[survey.frames,'#ffcf80'],[survey.autoPoints ?? [],'#60ffe8']]){
    m.fillStyle=color;
    for(const id of points){m.beginPath();m.arc(px(id),py(id),4,0,Math.PI*2);m.fill();}
  }
  if(mode!=='Mapa final'){m.fillStyle='#ffffff';m.beginPath();m.arc(px(cell),py(cell),5,0,7);m.fill();}
  if(mode==='Mapa final'){
    const g=canvas.getContext('2d');
    g.fillStyle='#071a16';g.fillRect(0,0,canvas.width,canvas.height);
    const width=Math.min(canvas.width-48,(canvas.height-46)*2.5);
    g.drawImage(map,(canvas.width-width)/2,25,width,width/2.5);
    g.font='600 14px sans-serif';
    g.fillStyle='#79fff0';g.fillText('● Drone com IA',28,canvas.height-9);
    g.fillStyle='#ffd18b';g.fillText('● Piloto',182,canvas.height-9);
  }
  document.querySelector('#survey-hud').textContent=mode+' · Faixa '+(cz+1)+' · Ponto '+(cx+1);
}

function showSurveyResults(container) {
  const {manual,automatic,review}=survey;
  const value = (entry, fn) => entry ? fn(entry) : '—';
  const manualCost=manual && review!==null ? money((manual.seconds+review)*.08) : '—';
  const advantage = comparisonCards(manual,automatic,review);
  const rows=[
    ['Tempo de voo',value(manual,e=>e.seconds+' s'),value(automatic,e=>e.seconds+' s')],
    ['Pontos para vistoria',manual && review!==null ? manual.points.join(', ') || 'Nenhum' : '—',automatic ? automatic.points.join(', ') || 'Nenhum' : '—'],
    ['Pontos visitados',value(manual,e=>e.coverage+'/32'),value(automatic,e=>e.coverage+'/32')],
    ['Tempo até o relatório',manual && review!==null ? (manual.seconds+review)+' s' : '—',value(automatic,e=>e.seconds+' s')],
    ['Relatório',manual ? (review!==null ? 'Conferido em '+review+' s' : 'Registros brutos') : '—',automatic?'Gerado a bordo':'—'],
    ['Acertos / falsos alarmes',manual && review!==null ? manual.hits+'/6 · '+manual.falseAlarms : '—',value(automatic,e=>e.hits+'/6 · '+e.falseAlarms)],
    ['Custo operacional ilustrativo',manualCost,value(automatic,e=>money(e.seconds*.12))]
  ];
  container.innerHTML=advantage+'<table><thead><tr><th>Indicador</th><th>Manual</th><th>Autônomo</th></tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map(text=>'<td>'+text+'</td>').join('')+'</tr>').join('')+'</tbody></table><p>Modelo didático por segundo: manual R$ 0,08 (voo + conferência) · IA R$ 0,12 (voo com processamento). Sem compra, manutenção ou supervisão. Tempos de jogo e custos fictícios.</p>';
  if(!manual || !automatic){
    const message=document.createElement('p');
    message.textContent='Volte à missão e conclua os dois voos para preencher a comparação.';
    container.append(message);
  }
  if(manual && review===null){
    const button=document.createElement('button');
    button.textContent='Conferir registros do piloto';
    button.onclick=()=>{
      button.disabled=true;
      const started=performance.now();
      const samples=survey.frames.map(cell=>{const [x,y]=surveyPoint(cell);return String.fromCharCode(65+y)+(x+1);});
      const progress=document.createElement('p');
      progress.textContent='Conferindo planilha de pontos: '+(samples.join(', ') || 'nenhum ponto marcado');
      container.append(progress);
      setTimeout(()=>{
        if(!container.isConnected)return;
        survey.review=Math.round((performance.now()-started)/1000);
        showSurveyResults(container);
      },5500);
    };
    container.append(button);
  }
}

function comparisonCards(manual,automatic,review){
  if(!manual || !automatic)return '';
  const difference=automatic.coverage-manual.coverage;
  const score=(label,value,detail)=>'<article><small>'+label+'</small><strong>'+value+'</strong><span>'+detail+'</span></article>';
  const coverage=difference>0 ? '+'+difference+' pontos' : difference===0?'Empate':difference+' pontos';
  const manualTime=manual.seconds+(review??0);
  const gain=Math.round((1-automatic.seconds/manualTime)*100);
  const time=review===null?'Aguardando':gain>0?gain+'% a menos':gain<0?(-gain)+'% a mais':'Empate';
  const hint=review===null?'Conferir registros manuais':manualTime+' s piloto · '+automatic.seconds+' s IA';
  return '<div class="mission-gains">'+score('Cobertura da IA',coverage,'IA '+automatic.coverage+'/32 · Piloto '+manual.coverage+'/32')+score('Tempo da IA',time,hint)+score('Detecção',automatic.hits+'/6 alvos','Piloto '+(review===null?'a conferir':manual.hits+'/6')+' · mapa automático')+'</div>';
}
function surveySummary(seconds,path,marks) {
  const [hits,falseAlarms]=countMarks(marks);
  const points = marks.flatMap((marked,i) => marked ? [String.fromCharCode(65+Math.floor(i/8))+(i%8+1)] : []);
  return {seconds,coverage:new Set(path).size,hits,falseAlarms,points};
}
