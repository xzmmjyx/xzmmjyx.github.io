(function(){
  'use strict';

  var $ = function(s,r){return(r||document).querySelector(s)};
  var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  function initLoader(){
    var loader = $('#page-loader');
    if(!loader) return;
    window.addEventListener('load', function(){
      setTimeout(function(){loader.classList.add('hidden')}, 600);
    });
    setTimeout(function(){loader.classList.add('hidden')}, 2500);
  }

  function initBgCanvas(){
    var canvas = $('#bg-canvas');
    if(!canvas) return;
    var ctx = canvas.getContext('2d');
    var w,h;
    function resize(){w=canvas.width=canvas.offsetWidth;h=canvas.height=canvas.offsetHeight}
    resize();
    window.addEventListener('resize',resize);

    var particles=[];
    var count=Math.min(40,Math.floor(window.innerWidth/30));
    for(var i=0;i<count;i++){
      particles.push({
        x:Math.random()*window.innerWidth,
        y:Math.random()*window.innerHeight,
        r:1+Math.random()*2,
        dx:(Math.random()-.5)*.4,
        dy:(Math.random()-.5)*.4,
        alpha:.08+Math.random()*.12
      });
    }

    function draw(){
      ctx.clearRect(0,0,w,h);
      var isDark=document.body.classList.contains('dark');
      for(var i=0;i<particles.length;i++){
        var p=particles[i];
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=isDark?'rgba(108,140,255,'+p.alpha+')':'rgba(59,108,245,'+p.alpha+')';
        ctx.fill();
        p.x+=p.dx;
        p.y+=p.dy;
        if(p.x<0)p.x=w;
        if(p.x>w)p.x=0;
        if(p.y<0)p.y=h;
        if(p.y>h)p.y=0;
      }
      for(var i=0;i<particles.length;i++){
        for(var j=i+1;j<particles.length;j++){
          var dx=particles[i].x-particles[j].x;
          var dy=particles[i].y-particles[j].y;
          var dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<120){
            ctx.beginPath();
            ctx.moveTo(particles[i].x,particles[i].y);
            ctx.lineTo(particles[j].x,particles[j].y);
            ctx.strokeStyle=isDark?'rgba(108,140,255,'+(0.06*(1-dist/120))+')':'rgba(59,108,245,'+(0.06*(1-dist/120))+')';
            ctx.lineWidth=.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  function initNavbar(){
    var nav=$('#navbar');
    if(!nav) return;
    window.addEventListener('scroll',function(){
      if(window.scrollY>50)nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    });
  }

  function initTheme(){
    var btn=$('#theme-toggle');
    if(!btn) return;
    var saved=localStorage.getItem('xzmmj-theme');
    if(saved==='dark')document.body.classList.add('dark');
    btn.addEventListener('click',function(){
      document.body.classList.toggle('dark');
      localStorage.setItem('xzmmj-theme',document.body.classList.contains('dark')?'dark':'light');
    });
  }

  function initScrollReveal(){
    var headers=$$('.section-header');
    var cards=$$('.project-card');
    var targets=headers.concat(cards);
    if(!targets.length) return;
    if(!('IntersectionObserver' in window)){
      targets.forEach(function(t){t.classList.add('visible')});
      return;
    }
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          var delay=e.target.dataset.index?parseInt(e.target.dataset.index)*120:0;
          setTimeout(function(){e.target.classList.add('visible')},delay);
        }
      });
    },{threshold:.15});
    targets.forEach(function(t){observer.observe(t)});
  }

  function initCardClick(){
    var cards=$$('a.project-card');
    cards.forEach(function(card){
      card.addEventListener('click',function(e){
        e.preventDefault();
        var href=card.getAttribute('href');
        if(href)window.location.href=href;
      });
    });
  }

  initLoader();
  initBgCanvas();
  initNavbar();
  initTheme();
  initScrollReveal();
  initCardClick();
})();
