// ===== ROUND TABLE SEATS =====
(function buildSeats(){
  const container=document.getElementById('seats-container');
  if(!container)return;
  const totalSeats=12, radius=290;
  for(let i=0;i<totalSeats;i++){
    const angle=(i/totalSeats)*(Math.PI*2);
    const x=Math.cos(angle)*radius;
    const y=Math.sin(angle)*radius;
    const wrapper=document.createElement('div');
    wrapper.style.cssText=`position:absolute;left:calc(50% + ${x}px);top:calc(50% + ${y}px);transform:rotate(${angle+Math.PI/2}rad)`;
    const seat=document.createElement('div');
    seat.className='seat';
    const glow=document.createElement('div');
    glow.className='seat-glow';
    seat.appendChild(glow);
    wrapper.appendChild(seat);
    container.appendChild(wrapper);
  }
})();

// ===== STAR FIELD =====
(function buildStars(){
  const starsContainer=document.querySelector('.bg-stars');
  if(!starsContainer)return;
  for(let i=0;i<80;i++){
    const star=document.createElement('div');
    star.className='star';
    const size=Math.random()*2+1;
    star.style.width=size+'px';
    star.style.height=size+'px';
    star.style.left=Math.random()*100+'%';
    star.style.top=Math.random()*100+'%';
    star.style.setProperty('--dur',(1.5+Math.random()*3)+'s');
    star.style.setProperty('--delay',(-Math.random()*4)+'s');
    if(Math.random()>0.65)star.style.background='rgba(201,168,76,0.9)';
    starsContainer.appendChild(star);
  }
})();

// ===== NEBULA MOUSE INTERACTION =====
document.addEventListener('mousemove',e=>{
  const glows=document.querySelectorAll('.bg-glow');
  if(glows[0])glows[0].style.transform=`translate(${e.clientX/50}px, ${e.clientY/50}px)`;
});

// ===== PARTICLE / LIGHT DUST SYSTEM =====
(function initParticles(){
  const canvas=document.getElementById('particle-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let W,H;
  const particles=[];
  const PARTICLE_COUNT=120;
  let mouseX=-1000,mouseY=-1000;

  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight}
  window.addEventListener('resize',resize);
  resize();

  document.addEventListener('mousemove',e=>{mouseX=e.clientX;mouseY=e.clientY});

  class Particle{
    constructor(){this.reset(true)}
    reset(init){
      const isLight=document.documentElement.getAttribute('data-theme')==='light';
      this.x=Math.random()*W;
      this.y=init?Math.random()*H:-10;
      this.size=Math.random()*2.5+0.5;
      this.speedX=(Math.random()-0.5)*0.3;
      this.speedY=Math.random()*0.4+0.1;
      this.opacity=isLight?(Math.random()*0.55+0.35):(Math.random()*0.6+0.2);
      this.fadeDir=Math.random()>0.5?1:-1;
      this.fadeSpeed=Math.random()*0.008+0.002;
      const r=Math.random();
      if(isLight){
        if(r<0.42)this.color=[214,165,46];
        else if(r<0.72)this.color=[39,86,160];
        else this.color=[255,252,244];
      }else{
        if(r<0.5)this.color=[201,168,76];
        else if(r<0.8)this.color=[255,255,255];
        else this.color=[180,160,220];
      }
    }
    update(){
      const dx=mouseX-this.x,dy=mouseY-this.y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<200&&dist>1){this.x+=dx/dist*0.3;this.y+=dy/dist*0.3}
      this.x+=this.speedX+Math.sin(Date.now()*0.001+this.y*0.01)*0.15;
      this.y+=this.speedY;
      this.opacity+=this.fadeDir*this.fadeSpeed;
      if(this.opacity>=0.8)this.fadeDir=-1;
      if(this.opacity<=0.05)this.fadeDir=1;
      if(this.y>H+10||this.x<-10||this.x>W+10)this.reset(false);
    }
    draw(){
      const[r,g,b]=this.color;
      const isLight=document.documentElement.getAttribute('data-theme')==='light';
      ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      ctx.fillStyle=`rgba(${r},${g},${b},${this.opacity})`;ctx.fill();
      if(this.size>1.5){
        ctx.beginPath();ctx.arc(this.x,this.y,this.size*3,0,Math.PI*2);
        ctx.fillStyle=`rgba(${r},${g},${b},${this.opacity*(isLight?0.24:0.15)})`;ctx.fill();
      }
    }
  }

  for(let i=0;i<PARTICLE_COUNT;i++)particles.push(new Particle());

  function animate(){
    ctx.clearRect(0,0,W,H);
    for(const p of particles){p.update();p.draw()}
    requestAnimationFrame(animate);
  }
  animate();
})();
