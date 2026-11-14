'use strict';
function renderFlight3D(canvas, point, mode, locked, elapsed=0) {
  const g=canvas.getContext('2d'), w=canvas.width,h=canvas.height;
  const [x,z,altitude=1.04,yaw=0,bank=0]=point;
  const chase=mode==='Rota IA'||mode==='Rota manual';
  const cam={x:x-Math.sin(yaw)*(chase?2.65:1.25)+Math.cos(yaw)*(chase?.52:0),y:chase?altitude+1.55:altitude,z:z-Math.cos(yaw)*(chase?3.1:1.25)-Math.sin(yaw)*(chase?.72:0),pitch:chase?.43:Math.atan2(altitude,1.25)};
  const c=Math.cos(cam.pitch),s=Math.sin(cam.pitch);
  if(!chase){cam.x=x-Math.sin(yaw)*1.25;cam.z=z-Math.cos(yaw)*1.25;}
  const turnX=Math.sin(yaw),turnZ=Math.cos(yaw);
  const project=([px,py,pz])=>{
    const dx=px-cam.x,dzWorld=pz-cam.z;
    const dy=py-cam.y,dz=dzWorld*turnZ+dx*turnX,depth=dz*c-dy*s;
    return [w/2+(dx*turnZ-dzWorld*turnX)*390/depth,h*.50-(dy*c+dz*s)*390/depth,depth];
  };
  const sky=g.createLinearGradient(0,0,0,h);
  sky.addColorStop(0,'#416d7b');sky.addColorStop(.33,'#bbd1ac');sky.addColorStop(.34,'#435c30');sky.addColorStop(1,'#251d13');
  g.fillStyle=sky;g.fillRect(0,0,w,h);
  const mesh=[];
  function face(vertices,color){
    const p=vertices.map(project);
    if(p.some(v=>v[2]<.16))return;
    mesh.push({p,color,depth:p.reduce((sum,v)=>sum+v[2],0)/p.length});
  }
  const bed=(x,z,a,b,tone)=>face([[x-a,.016,z-b],[x+a,.016,z-b],[x+a,.016,z+b],[x-a,.016,z+b]],tone);
  const filler=(x,z,id)=>{
    for(let n=0;n<4;n++){
      const angle=n*Math.PI*.5+fieldNoise(id)*5,dx=Math.cos(angle),dz=Math.sin(angle);
      const y=.19+fieldNoise(id+n)*.19;
      face([[x,.04,z],[x+dx*.20-dz*.11,y,z+dz*.20+dx*.11],[x+dx*.34,y*.75,z+dz*.34],[x+dx*.16+dz*.09,y*.74,z+dz*.16-dx*.09]],['#356843','#6c9b4e','#508044','#476d36'][n]);
    }
  };
  farmTerrain(face,bed,filler);
  for(let row=0;row<4;row++)for(let col=0;col<8;col++){
    const id=row*8+col,p=fieldPlants[id],zz=row*1.7;
    for(let n=0;n<8;n++){
      const angle=n*.785+id*.51,dx=Math.cos(angle),dz=Math.sin(angle);
      const lift=.18+(n%3)*.045;
      const base=[col,.05,zz], tip=[col+dx*.39,lift,zz+dz*.34];
      face([base,[col+dx*.21-dz*.12,lift+.08,zz+dz*.18+dx*.12],tip,[col+dx*.19+dz*.09,lift-.035,zz+dz*.18-dx*.09]],['#386528','#558238','#729544','#4e7932'][n%4]);
      const spotX=col+dx*.22,spotZ=zz+dz*.20;
      if((p.problem && n<(p.hard?3:6)) || (p.dry && n<3)){
        const a=p.hard?.023:.037, y=lift+.03;
        face([[spotX-a,y,spotZ],[spotX,y+.005,spotZ-a],[spotX+a,y,spotZ],[spotX,y,spotZ+a]],p.dry?'#a39a53':'#a46c42');
      }
    }
  }
  if(chase){
    const scan=elapsed*.0028;
    const beamX=x+Math.sin(scan)*.46;
    face([[x,.72,z],[beamX-1.2,.035,z+.55],[beamX+1.2,.035,z+.55]],'#6dffd03c');
    face([[beamX-1.1,.055,z+.52],[beamX+1.1,.055,z+.52],[beamX+1.1,.055,z+.62],[beamX-1.1,.055,z+.62]],'#6dffcfaf');
    const dy=(mode==='Rota manual'?altitude:.18+.64*Math.min(1,altitude))+Math.sin(elapsed*.006)*.025;
    const heading=mode==='Rota manual'?yaw:0;
    const co=Math.cos(heading),si=Math.sin(heading),roll=Math.sin(bank);
    const local=(u,v,t)=>[x+u*co+t*si,dy+v+u*roll,z+t*co-u*si];
    const poly=(vertices,color)=>face(vertices.map(p=>local(...p)),color);
    const ring=[[-.28,-.28],[.28,-.28],[.38,-.14],[.32,.26],[.20,.38],[-.20,.38],[-.32,.26],[-.38,-.14]];
    poly(ring.map(([u,t])=>[u*.76,.16,t*.79]),'#c6d5d3');
    ring.forEach(([u,t],i)=>{
      const [v,q]=ring[(i+1)%ring.length];
      poly([[u,-.04,t],[v,-.04,q],[v*.76,.16,q*.79],[u*.76,.16,t*.79]],i%2?'#34464b':'#62777b');
    });
    poly([[-.16,.165,-.20],[.16,.165,-.20],[.19,.165,.08],[-.19,.165,.08]],'#1e333a');
    poly([[-.11,.08,-.29],[.11,.08,-.29],[.11,-.07,-.34],[-.11,-.07,-.34]],'#131e23');
    for(const [u,t] of [[-.66,-.44],[.66,-.44],[-.66,.46],[.66,.46]]){
      const side=Math.sign(u);
      poly([[side*.19,.04,t*.28],[side*.24,.09,t*.21],[u+.043,.095,t],[u-.043,.075,t]],'#90a49f');
      poly([[side*.19,-.015,t*.28],[side*.24,.018,t*.21],[u+.043,.045,t],[u-.043,.025,t]],'#263a42');
      const disk=(radius,height,color)=>{
        poly(Array.from({length:12},(_,i)=>[u+Math.cos(i*Math.PI/6)*radius,height,t+Math.sin(i*Math.PI/6)*radius]),color);
      };
      disk(.089,.102,'#374d52');disk(.053,.124,'#d2ddd5');disk(.225,.133,'#a2c6c05c');
      const angle=elapsed*.038*side;
      for (let blade=0;blade<2;blade++){
        const phase=angle+blade*Math.PI;
        const c=Math.cos(phase),s=Math.sin(phase);
        poly([[u,.139,t],[u+c*.218-s*.025,.139,t+s*.218+c*.025],[u+c*.203+s*.025,.139,t+s*.203-c*.025]],'#e3eac9ba');
      }
      poly([[u-.05,.044,t-.085],[u+.05,.044,t-.085],[u+.04,-.013,t-.09],[u-.04,-.013,t-.09]],t<0?'#ff725e':'#77ffd2');
    }
    for(const u of [-.31,.31]){
      poly([[u-.035,-.20,-.34],[u+.035,-.20,-.34],[u+.035,-.20,.31],[u-.035,-.20,.31]],'#cad2c0');
      poly([[u,-.20,-.22],[u,-.20,-.15],[u+.06,-.04,-.08],[u+.06,-.04,-.16]],'#71868b');
      poly([[u,-.20,.17],[u,-.20,.24],[u+.06,-.04,.16],[u+.06,-.04,.10]],'#71868b');
    }
  }
  mesh.sort((a,b)=>b.depth-a.depth);
  for(const {p,color} of mesh){
    g.fillStyle=color;g.beginPath();
    p.forEach(([xx,yy],i)=>i?g.lineTo(xx,yy):g.moveTo(xx,yy));g.closePath();g.fill();
  }
  if(!chase || mode==='Rota manual'){
    const [mx,my]=project([x,.22,z]);
    const tone=locked?'#ffca78':mode==='IA'?'#73ffdd':'#eef6d6';
    g.strokeStyle=tone;g.lineWidth=2;
    for(const dir of [-1,1]){
      g.beginPath();g.moveTo(mx+dir*48,my-23);g.lineTo(mx+dir*48,my+23);
      g.moveTo(mx+dir*48,my-23);g.lineTo(mx+dir*30,my-23);
      g.moveTo(mx+dir*48,my+23);g.lineTo(mx+dir*30,my+23);
      g.moveTo(mx+dir*10,my);g.lineTo(mx+dir*30,my);g.stroke();
    }
    g.fillStyle=tone;g.font='600 13px monospace';
    g.fillText(locked?'ALVO REGISTRADO':mode==='IA'?'ANÁLISE ESPECTRAL SIMULADA':'MIRA • X PARA MARCAR',Math.max(12,mx-90),Math.min(h-40,my+43));
  }
}
