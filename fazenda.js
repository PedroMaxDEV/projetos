'use strict';
function fieldNoise(n) {
  const value=Math.sin(n*12.9898+17.3)*43758.5453;
  return value-Math.floor(value);
}

function farmTerrain(face,reef,plant){
  const soil=['#6f5134','#765738','#694b31','#705137'];
  for(let row=-5;row<27;row++){
    const z=row*.65;
    for(let col=-9;col<19;col++){
      const x=col*.72;
      const service=x< -1.44 && x> -3.5 || x>8 && x<10.4;
      const crop=x>=-.72 && x<8 && z>-.8 && z<6;
      const farther=z>8 && x>0;
      const hue=service?'#a78a65':crop?soil[Math.floor(fieldNoise(row*53+col)*4)]:farther?(row%2?'#457243':'#537e46'):'#5d7850';
      face([[x,0,z],[x+.72,0,z],[x+.72,0,z+.65],[x,0,z+.65]],hue);
      if(crop){
        const nearRow=Math.round(z/1.7)*1.7;
        if(Math.abs(z-nearRow)<.50)reef(x,z+.24,.38,.31,'#58442c');
      }
    }
  }
  for(let row=0;row<4;row++){
    for(let i=0;i<15;i++){
      const x=i*.5+.25,z=row*1.7+(fieldNoise(i+row*17)-.5)*.16;
      plant(x,z,i+row*17);
    }
  }
  for(let i=0;i<30;i++){
    const x=i<17?-5+i*.94:(i%2?-4.7:11.6)+fieldNoise(i)*.9;
    const z=i<17?10.4+fieldNoise(i+50)*3.1:(i-17)*.78-2;
    const r=.47+fieldNoise(i+80)*.48,h=1.4+fieldNoise(i+15)*1.35;
    face([[x-.08,0,z],[x+.08,0,z],[x+.08,h*.7,z],[x-.08,h*.7,z]],'#483a2a');
    const top=[x,h,z];
    const rim=Array.from({length:7},(_,n)=>[x+Math.cos(n*.898)*r,h*.60+fieldNoise(i*8+n)*.25,z+Math.sin(n*.898)*r]);
    rim.forEach((p,n)=>face([top,p,rim[(n+1)%7]],['#284f34','#396344','#496f46'][n%3]));
  }
  for(const x of [-2.27,8.61]){
    face([[x,.01,-5],[x+.095,.01,-5],[x+.095,.01,16],[x,.01,16]],'#736347');
    face([[x+.40,.011,-5],[x+.50,.011,-5],[x+.50,.011,16],[x+.40,.011,16]],'#796748');
  }
}

let farmMap;
function paintFarmMap(ctx,width,height){
  if(!farmMap){
    const image=document.createElement('canvas');
    image.width=720;image.height=288;
    const g=image.getContext('2d');
    g.fillStyle='#61774a';g.fillRect(0,0,720,288);
    for(let i=0;i<2000;i++){
      g.fillStyle=i%2?'#638052':'#425e40';
      g.fillRect(fieldNoise(i)*720,fieldNoise(i+501)*288,3+i%9,2+i%3);
    }
    g.fillStyle='#b28c63';g.fillRect(59,0,26,288);g.fillRect(634,0,26,288);g.fillRect(0,229,720,18);
    g.fillStyle='#634a33';g.fillRect(85,28,549,201);
    for(let row=0;row<4;row++){
      const y=28+(row+.5)*201/4;
      g.fillStyle='#473924';g.fillRect(85,y-13,549,26);
      for(let i=0;i<216;i++){
        const x=89+fieldNoise(row*241+i)*540,yy=y+(fieldNoise(i+row*99+720)-.5)*26;
        g.fillStyle=['#67934a','#86a458','#487441','#375c33'][i%4];
        g.beginPath();g.ellipse(x,yy,4+i%5,3+i%3,i,0,Math.PI*2);g.fill();
      }
    }
    for(let i=0;i<110;i++){
      const x=fieldNoise(i+785)*720, y=i%3?247+fieldNoise(i+895)*41:fieldNoise(i+913)*29;
      g.fillStyle=['#284b35','#376145','#52764a'][i%3];g.beginPath();g.arc(x,y,5+i%9,0,Math.PI*2);g.fill();
    }
    g.strokeStyle='#e5edb0';g.lineWidth=2;g.strokeRect(85,28,549,201);
    g.fillStyle='#fff5d8';g.font='700 14px sans-serif';g.fillText('N ↑',670,24);
    g.fillText('TALHÃO A',99,20);
    farmMap=image;
  }
  ctx.drawImage(farmMap,0,0,width,height);
}
