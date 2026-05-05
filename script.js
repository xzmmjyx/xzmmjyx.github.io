(function(){
  'use strict';

  var $ = function(s,r){return(r||document).querySelector(s)};
  var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  var photos = [
    {src:'images/1.jpg',h:400,title:'现场照片 1',desc:'测绘现场实录',cat:'control'},
    {src:'images/2.jpg',h:500,title:'现场照片 2',desc:'测绘现场实录',cat:'leveling'},
    {src:'images/3.jpg',h:450,title:'现场照片 3',desc:'测绘现场实录',cat:'rtk'},
    {src:'images/4.jpg',h:600,title:'现场照片 4',desc:'测绘现场实录',cat:'map'},
    {src:'images/5.jpg',h:400,title:'现场照片 5',desc:'测绘现场实录',cat:'control'},
    {src:'images/6.jpg',h:550,title:'现场照片 6',desc:'测绘现场实录',cat:'rtk'},
    {src:'images/7.jpg',h:500,title:'现场照片 7',desc:'测绘现场实录',cat:'leveling'},
    {src:'images/1.jpg',h:400,title:'现场照片 8',desc:'测绘现场实录',cat:'control'},
    {src:'images/2.jpg',h:500,title:'现场照片 9',desc:'测绘现场实录',cat:'rtk'},
    {src:'images/3.jpg',h:450,title:'现场照片 10',desc:'测绘现场实录',cat:'map'},
    {src:'images/4.jpg',h:600,title:'现场照片 11',desc:'测绘现场实录',cat:'control'},
    {src:'images/5.jpg',h:400,title:'现场照片 12',desc:'测绘现场实录',cat:'map'},
    {src:'images/6.jpg',h:550,title:'现场照片 13',desc:'测绘现场实录',cat:'leveling'},
    {src:'images/7.jpg',h:500,title:'现场照片 14',desc:'测绘现场实录',cat:'rtk'},
    {src:'images/1.jpg',h:400,title:'现场照片 15',desc:'测绘现场实录',cat:'map'}
  ];

  var catNames = {control:'控制测量',leveling:'水准测量',rtk:'RTK作业',map:'地形测图'};
  var currentFilter = 'all';
  var lightboxIdx = 0;
  var filteredPhotos = photos.slice();

  function initPageLoader(){
    var loader = $('#page-loader');
    if(!loader) return;
    window.addEventListener('load', function(){
      setTimeout(function(){loader.classList.add('hidden')}, 800);
    });
    setTimeout(function(){loader.classList.add('hidden')}, 3000);
  }

  function initHeroParticles(){
    var canvas = $('#hero-particles');
    if(!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var w, h;
    function resize(){
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    for(var i=0;i<60;i++){
      particles.push({
        x: Math.random()*w,
        y: Math.random()*h,
        vx: (Math.random()-.5)*.3,
        vy: (Math.random()-.5)*.3,
        r: Math.random()*2+.5,
        o: Math.random()*.4+.1
      });
    }
    function draw(){
      ctx.clearRect(0,0,w,h);
      for(var i=0;i<particles.length;i++){
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if(p.x<0) p.x=w;
        if(p.x>w) p.x=0;
        if(p.y<0) p.y=h;
        if(p.y>h) p.y=0;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle='rgba(108,140,255,'+p.o+')';
        ctx.fill();
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
            ctx.strokeStyle='rgba(108,140,255,'+((1-dist/120)*.15)+')';
            ctx.lineWidth=.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  function initHeroCounter(){
    var nums = $$('.hero-stat-num[data-count]');
    if(!nums.length) return;
    var counted = false;
    function animateCount(){
      if(counted) return;
      counted = true;
      nums.forEach(function(el){
        var target = parseInt(el.getAttribute('data-count'),10);
        var duration = 1500;
        var start = performance.now();
        function step(now){
          var progress = Math.min((now-start)/duration,1);
          var eased = 1-Math.pow(1-progress,3);
          el.textContent = Math.round(target*eased);
          if(progress<1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          setTimeout(animateCount,600);
          obs.unobserve(e.target);
        }
      });
    },{threshold:.3});
    obs.observe(nums[0]);
  }

  function initTypewriter(){
    var el = $('#hero-title');
    if(!el) return;
    var text = el.getAttribute('data-text') || '';
    el.textContent = '';
    var i = 0;
    function type(){
      if(i < text.length){
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, 120);
      } else {
        el.classList.add('done');
      }
    }
    setTimeout(type, 1200);
  }

  function initCursorParticles(){
    var canvas = $('#cursor-canvas');
    if(!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouseX = 0, mouseY = 0;
    var raf;
    function resize(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', function(e){
      mouseX = e.clientX;
      mouseY = e.clientY;
      if(Math.random() > .7){
        particles.push({x:mouseX,y:mouseY,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,life:1,r:Math.random()*2+1});
      }
    });
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(var i=particles.length-1;i>=0;i--){
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= .02;
        if(p.life <= 0){particles.splice(i,1);continue}
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = 'rgba(108,140,255,'+p.life*.5+')';
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
  }

  function initScroll(){
    var navbar = $('#navbar');
    var backToTop = $('#back-to-top');
    var progressBar = $('.scroll-progress');
    var heroContent = $('.hero-content');
    var heroStats = $('.hero-stats');
    var ticking = false;
    var sectionIds = ['hero','academy','profile','showcase','equipment','timeline','skills','gallery','roast'];

    function onScroll(){
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(function(){
        var st = window.pageYOffset || document.documentElement.scrollTop;
        var docH = document.documentElement.scrollHeight - window.innerHeight;
        if(navbar) navbar.classList.toggle('scrolled', st > 60);
        if(backToTop) backToTop.classList.toggle('show', st > 400);
        if(progressBar) progressBar.style.width = (docH > 0 ? (st/docH)*100 : 0) + '%';

        if(st < window.innerHeight){
          var ratio = st / window.innerHeight;
          if(heroContent){
            heroContent.style.transform = 'translateY('+(ratio*80)+'px)';
            heroContent.style.opacity = 1-ratio*1.2;
          }
          if(heroStats){
            heroStats.style.transform = 'translateY('+(ratio*40)+'px)';
            heroStats.style.opacity = 1-ratio*1.5;
          }
        }

        var current = sectionIds[0];
        for(var i=0;i<sectionIds.length;i++){
          var sec = document.getElementById(sectionIds[i]);
          if(sec){
            var rect = sec.getBoundingClientRect();
            if(rect.top <= 150) current = sectionIds[i];
          }
        }
        $$('.nav-link').forEach(function(a){
          a.classList.toggle('active', a.getAttribute('data-section') === current);
        });
        $$('.side-dots .dot').forEach(function(d){
          d.classList.toggle('active', d.getAttribute('data-section') === current);
        });
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  function initMobileNav(){
    var toggle = $('#nav-toggle');
    var links = $('#nav-links');
    if(!toggle||!links) return;
    toggle.addEventListener('click', function(){
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    $$('.nav-link',links).forEach(function(a){
      a.addEventListener('click', function(){
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  function initMasonry(){
    var container = $('#masonry');
    if(!container) return;
    renderPhotos(container);
  }

  function renderPhotos(container){
    container.innerHTML = '';
    filteredPhotos = currentFilter === 'all' ? photos.slice() : photos.filter(function(p){return p.cat===currentFilter});
    filteredPhotos.forEach(function(photo,idx){
      var item = document.createElement('div');
      item.className = 'masonry-item';
      item.innerHTML = '<img data-src="'+photo.src+'" alt="'+photo.title+'" style="aspect-ratio:600/'+photo.h+';background:#1a1a26">' +
        '<div class="masonry-overlay"><h4>'+photo.title+'</h4><p>'+photo.desc+'</p></div>';
      item.addEventListener('click',function(){openLightbox(idx)});
      container.appendChild(item);
    });
    observeLazy();
    observeReveal();
  }

  function observeLazy(){
    var imgs = $$('.masonry-item img[data-src]');
    if(!imgs.length) return;
    if(!('IntersectionObserver' in window)){
      imgs.forEach(function(img){img.src=img.getAttribute('data-src');img.removeAttribute('data-src')});
      return;
    }
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          var img = e.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          obs.unobserve(img);
        }
      });
    },{rootMargin:'200px'});
    imgs.forEach(function(img){obs.observe(img)});
  }

  function initFilter(){
    $$('.filter-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        $$('.filter-btn').forEach(function(b){b.classList.remove('active')});
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderPhotos($('#masonry'));
      });
    });
  }

  function openLightbox(idx){
    lightboxIdx = idx;
    var lb = $('#lightbox');
    if(!lb) return;
    updateLightbox();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function updateLightbox(){
    var photo = filteredPhotos[lightboxIdx];
    if(!photo) return;
    var img = $('#lightbox-img');
    var caption = $('#lightbox-caption');
    var counter = $('#lightbox-counter');
    if(img) img.src = photo.src;
    if(caption) caption.textContent = photo.title + ' — ' + photo.desc;
    if(counter) counter.textContent = (lightboxIdx+1)+' / '+filteredPhotos.length;
  }

  function closeLightbox(){
    var lb = $('#lightbox');
    if(!lb) return;
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function initLightbox(){
    var lb = $('#lightbox');
    if(!lb) return;
    var closeBtn = $('#lightbox-close');
    var prevBtn = $('#lightbox-prev');
    var nextBtn = $('#lightbox-next');
    if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if(prevBtn) prevBtn.addEventListener('click', function(){
      lightboxIdx = (lightboxIdx - 1 + filteredPhotos.length) % filteredPhotos.length;
      updateLightbox();
    });
    if(nextBtn) nextBtn.addEventListener('click', function(){
      lightboxIdx = (lightboxIdx + 1) % filteredPhotos.length;
      updateLightbox();
    });
    lb.addEventListener('click', function(e){
      if(e.target === lb) closeLightbox();
    });
    document.addEventListener('keydown', function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key==='Escape') closeLightbox();
      if(e.key==='ArrowLeft'){lightboxIdx=(lightboxIdx-1+filteredPhotos.length)%filteredPhotos.length;updateLightbox()}
      if(e.key==='ArrowRight'){lightboxIdx=(lightboxIdx+1)%filteredPhotos.length;updateLightbox()}
    });
    var startX=0;
    lb.addEventListener('touchstart',function(e){startX=e.touches[0].clientX},{passive:true});
    lb.addEventListener('touchend',function(e){
      var diff=e.changedTouches[0].clientX-startX;
      if(Math.abs(diff)>50){
        if(diff>0){lightboxIdx=(lightboxIdx-1+filteredPhotos.length)%filteredPhotos.length}
        else{lightboxIdx=(lightboxIdx+1)%filteredPhotos.length}
        updateLightbox();
      }
    },{passive:true});
  }

  function observeReveal(){
    var els = $$('.masonry-item:not(.visible),.equip-card:not(.visible),.roast-card:not(.visible),.academy-card:not(.visible),.section-header:not(.visible),.profile-text-col:not(.visible),.profile-photo-col:not(.visible),.showcase-card:not(.visible),.wave-divider:not(.visible)');
    if(!els.length) return;
    if(!('IntersectionObserver' in window)){
      els.forEach(function(el){el.classList.add('visible')});
      return;
    }
    var obs = new IntersectionObserver(function(entries){
      var revealed = [];
      entries.forEach(function(e){
        if(e.isIntersecting){
          revealed.push(e.target);
          obs.unobserve(e.target);
        }
      });
      revealed.forEach(function(el,i){
        setTimeout(function(){el.classList.add('visible')},i*60);
      });
    },{threshold:.08,rootMargin:'0px 0px -30px 0px'});
    els.forEach(function(el){obs.observe(el)});
  }

  function initBarFills(){
    var fills = $$('.equip-fill[data-width]');
    if(!fills.length) return;
    if(!('IntersectionObserver' in window)){
      fills.forEach(function(f){f.style.width=f.getAttribute('data-width')+'%'});
      return;
    }
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          setTimeout(function(){e.target.style.width=e.target.getAttribute('data-width')+'%'},200);
          obs.unobserve(e.target);
        }
      });
    },{threshold:.3});
    fills.forEach(function(f){obs.observe(f)});
  }

  function initSkillTree(){
    var container = $('#skill-tree');
    if(!container) return;

    var treeData = [
      {icon:'🔭',label:'仪器操作',pct:68,note:'凑合能用，偶尔翻车',subs:[
        {icon:'🎯',label:'全站仪',pct:65,note:'对中整平40→15分钟',leaves:['对中整平','坐标测量','后方交会']},
        {icon:'📡',label:'RTK',pct:80,note:'有信号就行',leaves:['基站架设','移动站','坐标转换']},
        {icon:'📏',label:'水准仪',pct:55,note:'闭合差没合格过',leaves:['读数','记录','计算闭合差']}
      ]},
      {icon:'📐',label:'测量技术',pct:55,note:'理论懂一半，实操看运气',subs:[
        {icon:'🗺',label:'控制测量',pct:50,note:'会布但点不能用',leaves:['导线测量','三角测量','GPS控制网']},
        {icon:'⛰',label:'水准测量',pct:45,note:'手冻僵了记错读数',leaves:['二等水准','四等水准','高程计算']},
        {icon:'📐',label:'地形测绘',pct:42,note:'地物符号认不全',leaves:['碎部测量','特征点','比例尺']}
      ]},
      {icon:'💻',label:'内业处理',pct:42,note:'画图靠猜，平差靠蒙',subs:[
        {icon:'🗺',label:'CASS画图',pct:40,note:'等高线像心电图',leaves:['等高线','地物绘制','图幅整饰']},
        {icon:'📊',label:'数据平差',pct:35,note:'Excel凑合用',leaves:['条件平差','间接平差','精度评定']},
        {icon:'🖱',label:'CAD制图',pct:45,note:'基本操作会',leaves:['图层管理','标注','出图']}
      ]},
      {icon:'🏃',label:'体力活',pct:92,note:'唯一的强项，不吹',subs:[
        {icon:'⛰',label:'跑外业',pct:95,note:'扛仪器爬山不带喘',leaves:['上山','下山','翻墙']},
        {icon:'❄',label:'抗冻能力',pct:88,note:'零下15度还在测',leaves:['冬训','毅力','硬抗']},
        {icon:'☀',label:'抗晒能力',pct:90,note:'38度依然在线',leaves:['夏天外业','防晒','中暑预防']}
      ]},
      {icon:'🐟',label:'摸鱼艺术',pct:95,note:'树荫下蹲着，手机一掏',subs:[
        {icon:'📶',label:'找信号',pct:98,note:'RTK没信号就是休息',leaves:['切换基站','重启设备','等待搜星']},
        {icon:'😴',label:'偷懒术',pct:95,note:'完美伪装观测中',leaves:['装调仪器','看手机','树荫蹲']},
        {icon:'📝',label:'编数据',pct:60,note:'偶尔合理修正',leaves:['凑闭合差','美化数据','截图存档']}
      ]}
    ];

    function svgEl(tag,attr){
      var el=document.createElementNS('http://www.w3.org/2000/svg',tag);
      if(attr){for(var k in attr)el.setAttribute(k,attr[k])}
      return el;
    }

    function ringSVG(size,pct,cls){
      var r=size/2-2;
      var circ=2*Math.PI*r;
      var off=circ*(1-pct/100);
      var svg=svgEl('svg',{viewBox:'0 0 '+size+' '+size});
      var c=svgEl('circle',{cx:size/2,cy:size/2,r:r,'stroke-dasharray':circ,'stroke-dashoffset':circ});
      if(cls) c.className.baseVal=cls;
      c.style.setProperty('--'+cls+'-offset',off);
      svg.appendChild(c);
      return svg;
    }

    function spawnParticles(el,count){
      var rect=el.getBoundingClientRect();
      var pRect=container.getBoundingClientRect();
      for(var i=0;i<count;i++){
        var p=document.createElement('div');
        p.className='tree-particle';
        var s=2+Math.random()*4;
        p.style.width=s+'px';
        p.style.height=s+'px';
        p.style.background=Math.random()>.5?'var(--accent)':'var(--gold)';
        p.style.left=(rect.left-pRect.left+rect.width/2+(Math.random()-.5)*60)+'px';
        p.style.top=(rect.top-pRect.top+rect.height/2+(Math.random()-.5)*60)+'px';
        container.appendChild(p);
        (function(pEl){
          var angle=Math.random()*Math.PI*2;
          var dist=30+Math.random()*60;
          var dx=Math.cos(angle)*dist;
          var dy=Math.sin(angle)*dist;
          pEl.style.opacity='0.8';
          pEl.style.transition='all '+(0.6+Math.random()*0.6)+'s ease-out';
          requestAnimationFrame(function(){
            pEl.style.transform='translate('+dx+'px,'+dy+'px) scale(0)';
            pEl.style.opacity='0';
          });
          setTimeout(function(){if(pEl.parentNode)pEl.parentNode.removeChild(pEl)},1400);
        })(p);
      }
    }

    function buildSubNodes(subs,parentEl){
      var wrap=document.createElement('div');
      wrap.className='tree-sub-wrap';
      subs.forEach(function(s,idx){
        var col=document.createElement('div');
        col.className='tree-sub-col';
        col.style.transitionDelay=(idx*0.08)+'s';

        var stem=document.createElement('div');
        stem.className='tree-sub-stem';
        col.appendChild(stem);

        var node=document.createElement('div');
        node.className='tree-snode';

        var ringW=52;
        var r=ringW/2-2;
        var circ=2*Math.PI*r;
        var off=circ*(1-s.pct/100);
        var ring=document.createElement('div');
        ring.className='tree-snode-ring';
        var svg=svgEl('svg',{viewBox:'0 0 '+ringW+' '+ringW});
        var c=svgEl('circle',{cx:ringW/2,cy:ringW/2,r:r,'stroke-dasharray':circ,'stroke-dashoffset':circ});
        c.style.setProperty('--s-dash-offset',off);
        ring.appendChild(svg);
        svg.appendChild(c);

        var inner=document.createElement('div');
        inner.className='tree-snode-inner';
        inner.textContent=s.icon;

        ring.appendChild(inner);
        node.appendChild(ring);

        var lbl=document.createElement('div');
        lbl.className='tree-snode-label';
        lbl.textContent=s.label;
        node.appendChild(lbl);

        var pctEl=document.createElement('div');
        pctEl.className='tree-snode-pct';
        pctEl.textContent=s.pct+'%';
        node.appendChild(pctEl);

        if(s.note){
          var note=document.createElement('div');
          note.className='tree-snode-label';
          note.style.fontSize='.62rem';
          note.style.color='var(--txt3)';
          note.style.maxWidth='120px';
          note.style.margin='3px auto 0';
          note.style.lineHeight='1.3';
          note.textContent=s.note;
          node.appendChild(note);
        }

        col.appendChild(node);

        var leafWrap=document.createElement('div');
        leafWrap.className='tree-leaf-skills';
        if(s.leaves){
          s.leaves.forEach(function(l){
            var tag=document.createElement('span');
            tag.className='tree-leaf-tag';
            tag.textContent=l;
            leafWrap.appendChild(tag);
          });
        }
        col.appendChild(leafWrap);

        node.addEventListener('mouseenter',function(){
          leafWrap.classList.add('visible');
          var circle=c;
          if(!circle.classList.contains('animated')){
            circle.classList.add('animated');
            spawnParticles(node,6);
          }
        });
        node.addEventListener('mouseleave',function(){
          setTimeout(function(){if(!col.matches(':hover'))leafWrap.classList.remove('visible')},200);
        });
        col.addEventListener('mouseleave',function(){
          leafWrap.classList.remove('visible');
        });

        wrap.appendChild(col);
      });
      parentEl.appendChild(wrap);
      return wrap;
    }

    function buildBranch(b,idx){
      var col=document.createElement('div');
      col.className='tree-branch-col';
      col.style.transitionDelay=(idx*0.1)+'s';

      var stem=document.createElement('div');
      stem.className='tree-branch-stem';
      col.appendChild(stem);

      var glow=document.createElement('div');
      glow.className='tree-branch-stem-glow';
      col.appendChild(glow);

      var node=document.createElement('div');
      node.className='tree-bnode';

      var ringW=72;
      var r=ringW/2-2;
      var circ=2*Math.PI*r;
      var off=circ*(1-b.pct/100);
      var ring=document.createElement('div');
      ring.className='tree-bnode-ring';
      var svg=svgEl('svg',{viewBox:'0 0 '+ringW+' '+ringW});
      var c=svgEl('circle',{cx:ringW/2,cy:ringW/2,r:r,'stroke-dasharray':circ,'stroke-dashoffset':circ});
      c.style.setProperty('--b-dash-offset',off);
      ring.appendChild(svg);
      svg.appendChild(c);

      var inner=document.createElement('div');
      inner.className='tree-bnode-inner';
      inner.textContent=b.icon;
      ring.appendChild(inner);
      node.appendChild(ring);

      var lbl=document.createElement('div');
      lbl.className='tree-bnode-label';
      lbl.textContent=b.label;
      node.appendChild(lbl);

      var pctEl=document.createElement('div');
      pctEl.className='tree-bnode-pct';
      pctEl.textContent=b.pct+'%';
      node.appendChild(pctEl);

      if(b.note){
        var note=document.createElement('div');
        note.className='tree-bnode-note';
        note.textContent=b.note;
        node.appendChild(note);
      }

      col.appendChild(node);

      var subWrap=buildSubNodes(b.subs,col);

      var expandTimer=null;
      var collapseTimer=null;
      col.addEventListener('mouseenter',function(){
        clearTimeout(collapseTimer);
        if(subWrap.classList.contains('expanded')) return;
        expandTimer=setTimeout(function(){
          subWrap.classList.add('expanded');
          var subCols=subWrap.querySelectorAll('.tree-sub-col');
          subCols.forEach(function(sc,i){
            setTimeout(function(){sc.classList.add('visible')},i*100+100);
          });
          var subRings=subWrap.querySelectorAll('.tree-snode-ring circle');
          subRings.forEach(function(sr,i){
            setTimeout(function(){sr.classList.add('animated')},i*100+300);
          });
          if(!c.classList.contains('animated')){
            c.classList.add('animated');
            spawnParticles(node,10);
          }
        },200);
      });
      col.addEventListener('mouseleave',function(e){
        clearTimeout(expandTimer);
        if(!col.contains(e.relatedTarget)){
          collapseTimer=setTimeout(function(){
            subWrap.classList.remove('expanded');
            subWrap.querySelectorAll('.tree-sub-col').forEach(function(sc){
              sc.classList.remove('visible');
            });
          },300);
        }
      });

      return col;
    }

    var layer=document.createElement('div');
    layer.className='tree-layer';

    var rootNode=document.createElement('div');
    rootNode.className='tree-root-node';

    var rootRingW=100;
    var rootR=rootRingW/2-2;
    var rootCirc=2*Math.PI*rootR;
    var rootOff=rootCirc*(1-60/100);
    var rootRing=document.createElement('div');
    rootRing.className='tree-root-ring';
    var rsvg=svgEl('svg',{viewBox:'0 0 '+rootRingW+' '+rootRingW});
    var rc=svgEl('circle',{cx:rootRingW/2,cy:rootRingW/2,r:rootR,'stroke-dasharray':rootCirc,'stroke-dashoffset':rootCirc});
    rootRing.appendChild(rsvg);
    rsvg.appendChild(rc);

    var rootInner=document.createElement('div');
    rootInner.className='tree-root-inner';
    rootInner.textContent='⛏';
    rootRing.appendChild(rootInner);
    rootNode.appendChild(rootRing);

    var rootLabel=document.createElement('div');
    rootLabel.className='tree-root-label';
    rootLabel.textContent='测绘技能树';
    rootNode.appendChild(rootLabel);

    var rootNote=document.createElement('div');
    rootNote.className='tree-root-note';
    rootNote.textContent='总体半吊子水平 · 悬停展开各分支';
    rootNode.appendChild(rootNote);

    layer.appendChild(rootNode);

    var trunkWrap=document.createElement('div');
    trunkWrap.className='tree-trunk-wrap';
    var trunkLine=document.createElement('div');
    trunkLine.className='tree-trunk-line';
    trunkWrap.appendChild(trunkLine);
    var trunkPulse=document.createElement('div');
    trunkPulse.className='tree-trunk-pulse';
    trunkWrap.appendChild(trunkPulse);
    layer.appendChild(trunkWrap);

    var branchesWrap=document.createElement('div');
    branchesWrap.className='tree-branches-wrap';

    treeData.forEach(function(b,idx){
      branchesWrap.appendChild(buildBranch(b,idx));
    });
    layer.appendChild(branchesWrap);

    container.appendChild(layer);

    var rootExpanded=false;
    function expandRoot(){
      if(rootExpanded) return;
      rootExpanded=true;
      trunkLine.classList.add('grown');
      setTimeout(function(){
        branchesWrap.classList.add('expanded');
        var cols=branchesWrap.querySelectorAll('.tree-branch-col');
        cols.forEach(function(c,i){
          setTimeout(function(){c.classList.add('visible')},i*120+200);
        });
        var branchCircles=branchesWrap.querySelectorAll('.tree-bnode-ring circle');
        branchCircles.forEach(function(c,i){
          setTimeout(function(){c.classList.add('animated')},i*120+500);
        });
        spawnParticles(rootNode,15);
      },400);
    }
    function collapseRoot(){
      if(!rootExpanded) return;
      rootExpanded=false;
      branchesWrap.classList.remove('expanded');
      branchesWrap.querySelectorAll('.tree-branch-col').forEach(function(c){c.classList.remove('visible')});
      branchesWrap.querySelectorAll('.tree-sub-wrap').forEach(function(sw){
        sw.classList.remove('expanded');
        sw.querySelectorAll('.tree-sub-col').forEach(function(sc){sc.classList.remove('visible')});
      });
      branchesWrap.querySelectorAll('.tree-leaf-skills').forEach(function(l){l.classList.remove('visible')});
      setTimeout(function(){trunkLine.classList.remove('grown')},200);
    }

    var expandTimer=null;
    var collapseTimer=null;

    container.addEventListener('mouseenter',function(){
      clearTimeout(collapseTimer);
      if(rootExpanded) return;
      expandTimer=setTimeout(function(){expandRoot()},200);
    });
    container.addEventListener('mouseleave',function(e){
      clearTimeout(expandTimer);
      if(!container.contains(e.relatedTarget)){
        collapseTimer=setTimeout(collapseRoot,400);
      }
    });

    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          setTimeout(function(){
            rc.classList.add('animated');
            spawnParticles(rootNode,8);
          },300);
          obs.unobserve(e.target);
        }
      });
    },{threshold:.2});
    obs.observe(container);
  }

  function initHellScroller(){
    var scroller = $('#hell-scroller');
    if(!scroller) return;

    var jokes = [
      {tag:'闭合差',title:'测绘人死后下地狱',body:'测绘人问阎王："我这辈子干了什么坏事？"阎王翻开生死簿："你没干坏事，你只是闭合差一直超限，阎王殿的面积都测不准了。"测绘人说："那也不能怪我啊，是风太大了。"阎王说："你现在在室内。"'},
      {tag:'RTK',title:'天堂和地狱的区别',body:'天堂：RTK一秒定位，搜星12颗，精度±1cm。地狱：工大实训基地，全站仪气泡跑了40分钟，闭合差限差±20mm，你测出来±200mm。最地狱的是：你已经是全班最好的了。'},
      {tag:'控制测量',title:'三个测绘人的遗愿',body:'第一个说："我闭合差从来没超限。"阎王说："假的，拉下去。"第二个说："我对中整平只要三分钟。"阎王说："吹的，拉下去。"第三个啥也没说，阎王翻了翻记录："哦，你在工大测绘实习的，上来自己坐，你已经够惨了。"'},
      {tag:'外业实习',title:'测绘专业和殡仪馆',body:'区别是：殡仪馆只让你死一次，测绘实习天天都在死。殡仪馆好歹体面收场，测绘外业死了都找不到——三脚架还忘在山上了。最惨的是殡仪馆不收测绘人，因为闭合差超了，棺材尺寸都量不准。'},
      {tag:'地形测图',title:'等高线的心声',body:'CASS里的等高线对测量员说："求求你别画了，你画的不是等高线，是我的心电图。"测量员说："别急，等我画完你就平稳了。"等高线："可是我已经死了。"测量员："没事，死了也得把图画完交作业。"'},
      {tag:'单身狗',title:'测绘人为什么不谈恋爱',body:'对象问："你心里有我吗？"测绘人答："闭合差超了，心里只有数据。"对象问："你爱我多少？"测绘人答："误差范围内，±3σ置信度99.7%。"对象："分手。"测绘人："好的，我先把这段导线测完，然后我再处理这段关系的平差。"'},
      {tag:'工大食堂',title:'辽工程食堂的测量学',body:'工大食堂做菜跟测绘一样——闭合差永远超限。说好的红烧肉，端上来一看，形状不规则、质量不达标、误差±50%。你去投诉，厨师说："这叫随机误差，符合正态分布。"你看了看盘子里的东西："这明明是粗差，应该剔除。"'},
      {tag:'全站仪',title:'对中整平的哲学',body:'佛说：一花一世界。测绘人说：一气泡一地狱。全站仪的气泡是量子力学的最佳诠释——你越看它，它越跑。你追它，它跑得更快。你放弃它，它就稳了。这就是为什么老测量员说："对中整平靠的不是技术，是缘分。"'},
      {tag:'工大宿舍',title:'辽工程宿舍的测绘噩梦',body:'工大宿舍的暖气跟RTK信号一样——名义上是有的，实际上你感受不到。冬天零下20度，被窝里瑟瑟发抖，室友说："这就是高程改正，你得适应。"你裹着三层被子说："这不是改正，这是系统误差，而且是无法消除的那种。"'},
      {tag:'水准仪',title:'二等水准的噩梦',body:'老师说："二等水准闭合差限差±4√L。"你测完一看：超了。重测，又超了。再重测，还超。你开始怀疑人生，怀疑地球是不是不平。最后发现——脚架踩进泥里了，高程从一开始就歪了。你抱着脚架痛哭："你为什么不告诉我？"'},
      {tag:'考研',title:'测绘人的考研自白',body:'为什么考研？因为本科四年学到的是：闭合差会超限、仪器会坏、外业会死、内业会疯。读研之后学到的是：闭合差还是会超限，仪器还是会坏，但你已经是研究生了，可以指挥本科生去死了。这就是学历的价值。'},
      {tag:'CAD',title:'CAD制图人的崩溃',body:'CAD画图画到凌晨三点，Ctrl+S按了无数次。突然蓝屏。你愣了三秒，缓缓摘下眼镜，看着窗外的月亮，想起了母亲。你打开手机想给导师发消息说不做了，看到导师凌晨三点发来的消息："图呢？"你把手机关了。'},
      {tag:'实习工资',title:'测绘人的工资',body:'面试官问："你期望薪资多少？"测绘人说："一万。"面试官笑了。测绘人说："八千。"面试官还在笑。测绘人说："五千。"面试官不笑了，说："我们给你三千五，但你得接受出差，出差没有补贴，外业包吃住——住帐篷，吃泡面。"测绘人说："成交。"'},
      {tag:'导线测量',title:'导线测量的绝望',body:'导线测量像人生——你得一站一站地走，每一步都有误差，误差还会累积。走到最后你发现，你已经偏离目标十万八千里了。但你不能重来，因为天黑了，仪器没电了，你也走不动了。这时候你才明白：人生就是一条闭合不了的导线。'},
      {tag:'数据处理',title:'平差的艺术',body:'导师问："你的平差结果呢？"你说："残差太大，法方程病态了。"导师说："那就剔除粗差。"你说："剔除之后还剩两个点。"导师说："那叫两个点确定一条直线，不需要平差。"你说："可是这两个点的残差也超限了。"导师："那你别平差了，你去平复一下你的心情吧。"'},
      {tag:'毕业论文',title:'测绘论文的致谢',body:'致谢：感谢我的导师，没有您的催促我就不会通宵达旦。感谢全站仪，让我知道什么叫"对中整平的人生"。感谢工大的食堂，让我在饥寒交迫中领悟了误差理论的真谛。感谢我的室友，没有你们我不会在凌晨两点还清醒地处理数据。最后感谢我自己，活着写完了这篇论文。'},
      {tag:'天气',title:'测绘人看天气',body:'普通人看天气：今天晴天，适合出门。测绘人看天气：今天风力3级，对棱镜杆有影响，RTK搜星数可能下降，建议改用全站仪。下雨了：水准仪不能用了，导线测不了了，全班放假。全班欢呼。老师说："回去算数据。"全班沉默。'},
      {tag:'GNSS',title:'搜星的信仰',body:'RTK开机，等搜星。一分钟：6颗，不够。两分钟：8颗，还行。三分钟：10颗，开干。突然掉到4颗。你抬头看天，天很蓝，没有云，但卫星就是不来。你双手合十："北斗大哥，GPS大爷，给个面子吧。"五分钟后12颗星全到了。你信了——测绘是门玄学。'},
      {tag:'仪器维修',title:'仪器坏了之后',body:'全站仪摔了。你大脑飞速运转：1.自己修——可能更坏；2.报修——要扣钱；3.假装没坏——下一个人用的时候才发现；4.说是风吹倒的——对，是风的错。你选了4。下一个人用了之后说："这仪器怎么歪了？"你说："可能是磁偏角的影响。"'},
      {tag:'辽工程',title:'辽工程测绘人的日常',body:'早上6点起床跑外业，零下15度冻成狗。中午泡面对付一口，继续测。下午4点收工回宿舍，发现数据有问题，白测了。晚上写报告写到凌晨，发现CAD又崩了。第二天重来。这就是辽工程测绘人的日常，比地平线还平，比等高线还曲折。'},
      {tag:'体育',title:'测绘人的体能',body:'有人说测绘是脑力劳动。错。测绘是体力劳动里掺了一点脑力，脑力劳动里掺了一点体力，最终两者都做不好。跑外业一天走三万步，扛着仪器爬山，回来还要坐着画图画到半夜。你的身体说："你要么动，要么静，别两个都要。"你说："闭嘴，导师要明天交成果。"'},
      {tag:'GPS-RTK',title:'坐标转换的噩梦',body:'老师说："把WGS84坐标转到地方坐标系。"你用了七参数，结果不对。用了四参数，还是不对。用了三参数，差了十万八千里。你开始怀疑地球是不是圆的。最后发现——输入的时候小数点点错了。你看着屏幕上偏差100公里的结果，缓缓闭上了眼睛。'},
      {tag:'假期',title:'测绘人的寒暑假',body:'别人寒假：旅游、聚会、打游戏。测绘人寒假：写实习报告、算平差、画CAD。别人暑假：实习、赚钱、谈恋爱。测绘人暑假：外业测量、晒脱皮、中暑。你问学长："测绘人有没有轻松的时候？"学长说："毕业之后。"你问："毕业之后就轻松了？"学长说："不是，毕业之后就不学测绘了。"'}
    ];

    var rows = [
      {el:$('#hell-track-1'), dir:'left', items: jokes.slice(0,8)},
      {el:$('#hell-track-2'), dir:'right', items: jokes.slice(8,16)},
      {el:$('#hell-track-3'), dir:'left', items: jokes.slice(16)}
    ];

    rows.forEach(function(row){
      if(!row.el) return;
      var all = row.items.concat(row.items);
      row.el.innerHTML = '';
      all.forEach(function(j,idx){
        var card = document.createElement('div');
        card.className = 'hell-card';
        card.setAttribute('data-idx', String(jokes.indexOf(j)));
        var preview = j.body.length > 80 ? j.body.substring(0,80)+'...' : j.body;
        card.innerHTML =
          '<div class="hell-card-head"><span class="hell-card-tag">'+j.tag+'</span><span class="hell-card-num">#'+(jokes.indexOf(j)+1)+'</span></div>' +
          '<h4>'+j.title+'</h4>' +
          '<p>'+preview+'</p>' +
          '<div class="hell-card-hint">点击查看全文 ▸</div>';
        row.el.appendChild(card);
      });
    });

    var expanded = $('#hell-expanded');
    var expandedTag = $('#hell-expanded-tag');
    var expandedTitle = $('#hell-expanded-title');
    var expandedBody = $('#hell-expanded-body');
    var expandedClose = $('#hell-expanded-close');

    scroller.addEventListener('click',function(e){
      var card = e.target.closest('.hell-card');
      if(!card) return;
      var idx = parseInt(card.getAttribute('data-idx'),10);
      var j = jokes[idx];
      if(!j) return;
      expandedTag.textContent = j.tag;
      expandedTitle.textContent = j.title;
      expandedBody.textContent = j.body;
      expanded.classList.add('open');
      $$('.hell-row').forEach(function(r){r.classList.add('paused')});
    });

    if(expandedClose){
      expandedClose.addEventListener('click',function(){
        expanded.classList.remove('open');
        $$('.hell-row').forEach(function(r){r.classList.remove('paused')});
      });
    }
  }

  function initRoast(){
    var textarea = $('#roast-textarea');
    var count = $('#roast-count');
    var submit = $('#roast-submit');
    if(!textarea||!count||!submit) return;
    textarea.addEventListener('input', function(){
      count.textContent = textarea.value.length;
    });
    submit.addEventListener('click', function(){
      var text = textarea.value.trim();
      if(!text) return;
      var names = ['工大怨种G','退学考虑H','闭合差战士I','考研逃兵J','匿名矿工K','食堂受害者L'];
      var name = names[Math.floor(Math.random()*names.length)];
      var grid = $('.roast-grid');
      var inputCard = $('.roast-input-card');
      if(!grid||!inputCard) return;
      var card = document.createElement('div');
      card.className = 'roast-card';
      card.innerHTML = '<div class="roast-avatar">'+name+'</div><p>'+text.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</p><span class="roast-time">刚刚</span>';
      grid.insertBefore(card, inputCard);
      textarea.value = '';
      count.textContent = '0';
      setTimeout(function(){card.classList.add('visible')},50);
    });
  }

  function initBackToTop(){
    var btn = $('#back-to-top');
    if(!btn) return;
    btn.addEventListener('click', function(){
      window.scrollTo({top:0,behavior:'smooth'});
    });
  }

  function initTheme(){
    var btn = $('#theme-toggle');
    if(!btn) return;
    var saved = localStorage.getItem('theme');
    if(saved==='light') document.body.classList.add('light');
    else if(!saved && window.matchMedia('(prefers-color-scheme: light)').matches){
      document.body.classList.add('light');
    }
    btn.addEventListener('click', function(){
      document.body.classList.toggle('light');
      localStorage.setItem('theme', document.body.classList.contains('light')?'light':'dark');
    });
  }

  function initSideDots(){
    $$('.side-dots .dot').forEach(function(dot){
      dot.addEventListener('click', function(){
        var section = dot.getAttribute('data-section');
        var target = document.getElementById(section);
        if(target) target.scrollIntoView({behavior:'smooth'});
      });
    });
  }

  function init(){
    initPageLoader();
    initHeroParticles();
    initHeroCounter();
    initTypewriter();
    initCursorParticles();
    initScroll();
    initMobileNav();
    initMasonry();
    initFilter();
    initLightbox();
    initBarFills();
    initSkillTree();
    initHellScroller();
    initRoast();
    initBackToTop();
    initTheme();
    initSideDots();
    observeReveal();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
