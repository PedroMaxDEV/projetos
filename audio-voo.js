'use strict';
let flightAudio;
let flightMuted=false;
let rotor;
function stopRotor(){
  if(!rotor)return;
  const {context, gain, motor, pulse}=rotor;
  rotor=null;
  const now=context.currentTime;
  gain.gain.setTargetAtTime(0,now,.08);
  motor.stop(now+.4);
  pulse.stop(now+.4);
}
function startRotor(){
  stopRotor();
  const Audio=window.AudioContext || window.webkitAudioContext;
  if(!Audio)return;
  try{
    const context=flightAudio ??= new Audio();
    context.resume().catch(()=>{});
    const motor=context.createOscillator(),pulse=context.createOscillator();
    const filter=context.createBiquadFilter(),gain=context.createGain();
    motor.type='sawtooth'; pulse.type='triangle';
    motor.frequency.value=118; pulse.frequency.value=61;
    filter.type='lowpass'; filter.frequency.value=510;
    gain.gain.value=0;
    motor.connect(filter); pulse.connect(filter);
    filter.connect(gain); gain.connect(context.destination);
    motor.start(); pulse.start();
    rotor={context,motor,pulse,gain};
  }catch{}
}
function rotorSpeed(power){
  if(!rotor)return;
  const {context,motor,pulse,gain}=rotor, now=context.currentTime;
  motor.frequency.setTargetAtTime(105+49*power,now,.11);
  pulse.frequency.setTargetAtTime(55+24*power,now,.11);
  gain.gain.setTargetAtTime(flightMuted?0:.045,now,.16);
}
function toggleFlightAudio(button){
  flightMuted=!flightMuted;
  button.textContent=flightMuted?'Som desligado':'Som ligado';
  button.setAttribute('aria-pressed',String(!flightMuted));
  if(flightMuted)rotorSpeed(0);
}
