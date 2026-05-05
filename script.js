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
    var els = $$('.masonry-item:not(.visible),.equip-card:not(.visible),.timeline-item:not(.visible),.roast-card:not(.visible),.academy-card:not(.visible),.section-header:not(.visible),.profile-text-col:not(.visible),.profile-photo-col:not(.visible),.showcase-card:not(.visible)');
    if(!els.length) return;
    if(!('IntersectionObserver' in window)){
      els.forEach(function(el){el.classList.add('visible')});
      return;
    }
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
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
    initTypewriter();
    initCursorParticles();
    initScroll();
    initMobileNav();
    initMasonry();
    initFilter();
    initLightbox();
    initBarFills();
    initSkillTree();
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
