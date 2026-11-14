'use strict';
const flightKeys = new Set();
window.addEventListener('keyup',event=>flightKeys.delete(event.code));
window.addEventListener('blur',()=>flightKeys.clear());

function nearestPlant(x,z) {
  const col=Math.round(x),row=Math.round(z/1.7);
  if(row<0||row>3||col<0||col>7||Math.hypot(x-col,z-row*1.7)>.47)return -1;
  return row*8+col;
}

function flightKey(event) {
  if(!manualPilot?.free)return false;
  const code=event.code;
  if(['KeyX','Space','KeyC'].includes(code)){
    if(!event.repeat){
      if(code==='KeyC')manualPilot.pov=!manualPilot.pov;else capturePlant();
    }
    return true;
  }
  if(!['KeyW','KeyA','KeyS','KeyD','KeyQ','KeyE','KeyR','KeyF','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(code))return false;
  flightKeys.add(code);
  return true;
}

function capturePlant() {
  const p=manualPilot;
  const target=nearestPlant(p.x,p.z);
  const result=document.querySelector('#duel-result');
  if(target<0){result.textContent='Aproxime a mira de uma planta para registrar.';return;}
  const index=survey.frames.indexOf(target);
  if(index<0) survey.frames.push(target);
  else survey.frames.splice(index,1);
  const [x,z]=surveyPoint(target);
  result.textContent=(index<0?'Ponto registrado · ':'Registro removido · ')+String.fromCharCode(65+z)+(x+1);
}

function startFreeFlight() {
  const arena=document.querySelector('#duel-arena');
  const startButton=document.querySelector('#start-duel'), auto=document.querySelector('#fly-duel');
  const clock=document.querySelector('#duel-clock'), phase=document.querySelector('#flight-phase');
  const coverage=document.querySelector('#coverage'), result=document.querySelector('#duel-result');
  Object.assign(survey,{path:[],frames:[],autoPath:[],autoPoints:[],manual:null,automatic:null,review:null});
  flightKeys.clear();
  const p=manualPilot={free:true,arena,x:0,z:0,altitude:1.05,yaw:0,vx:0,vz:0,vy:0,spin:0,bank:0};
  startRotor();
  const start=performance.now();
  let previous=start,down=false,viewDown=false,painted=-Infinity;
  clock.hidden=false;
  startButton.disabled=true;
  auto.disabled=true;
  auto.textContent='Treinar e decolar com IA';
  phase.textContent='Inspeção manual';
  result.textContent='X marca a planta. Y no controle ou C no teclado alterna a câmera.';
  arena.tabIndex=-1;arena.focus({preventScroll:true});
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const key=(...names)=>names.some(n=>flightKeys.has(n))?1:0;
  function frame(now){
    if(!arena.isConnected || manualPilot!==p)return;
    const dt=Math.min(.05,(now-previous)/1000);
    previous=now;
    const pad=standardGamepad();
    const button=i=>pad?.buttons[i]?.pressed?1:0;
    const axis=i=>{
      const value=pad?.axes[i]??0;
      const t=Math.max(0,(Math.abs(value)-.14)/.86);
      return Math.sign(value)*t**1.35;
    };
    const strafe=clamp(key('KeyD','ArrowRight')-key('KeyA','ArrowLeft')+axis(0)+button(15)-button(14),-1,1);
    const forward=clamp(key('KeyW','ArrowUp')-key('KeyS','ArrowDown')-axis(1)+button(12)-button(13),-1,1);
    const blend=1-Math.exp(-dt*7);
    const approach=(value,goal)=>value+(goal-value)*blend;
    p.spin=approach(p.spin,1.9*(key('KeyE')-key('KeyQ')+axis(2)));
    p.vy=approach(p.vy,1.4*(key('KeyR')-key('KeyF')-axis(3)));
    p.yaw+=dt*p.spin;
    p.altitude=clamp(p.altitude+dt*p.vy,.65,3.4);
    const norm=Math.max(1,Math.hypot(strafe,forward));
    p.vx=approach(p.vx,2.9*(strafe*Math.cos(p.yaw)+forward*Math.sin(p.yaw))/norm);
    p.vz=approach(p.vz,2.9*(forward*Math.cos(p.yaw)-strafe*Math.sin(p.yaw))/norm);
    p.x=clamp(p.x+dt*p.vx,-.65,7.65);
    p.z=clamp(p.z+dt*p.vz,-.65,5.75);
    p.bank=approach(p.bank,-strafe*.22);
    const point=nearestPlant(p.x,p.z);
    if(point>=0 && survey.path.at(-1)!==point)survey.path.push(point);
    if(button(3)&&!viewDown)p.pov=!p.pov;
    viewDown=Boolean(button(3));
    if(button(2)&&!down)capturePlant();
    down=Boolean(button(2));
    const remaining=Math.max(0,duration-(now-start)/1000);
    clock.textContent=Math.ceil(remaining)+' s';
    if(now-painted>=15 || !remaining){
      painted=now;
      const cell=Math.max(0,Math.min(3,Math.round(p.z/1.7)))*8+Math.max(0,Math.min(7,Math.round(p.x)));
      drawSurvey(cell,p.pov?'Manual':'Rota manual',[p.x,p.z,p.altitude,p.yaw,p.bank],survey.frames.includes(point));
      rotorSpeed(.3+.43*Math.min(1,Math.hypot(strafe,forward))+.18*Math.abs(axis(3)));
      coverage.textContent='ALT '+p.altitude.toFixed(1)+' m · '+survey.frames.length+' registros';
    }
    if(remaining){requestAnimationFrame(frame);return;}
    survey.manual=surveySummary(duration,survey.path,fieldPlants.map((_,i)=>survey.frames.includes(i)));
    stopRotor();
    manualPilot=null;flightKeys.clear();
    phase.textContent='Pouso manual';
    result.textContent='Voo encerrado. Treine o modelo e lance a missão autônoma.';
    startButton.disabled=false;auto.disabled=false;
  }
  requestAnimationFrame(frame);
}
