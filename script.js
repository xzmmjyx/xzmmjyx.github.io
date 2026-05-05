(function(){
  'use strict';

  var $ = function(s,r){return(r||document).querySelector(s)};
  var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  var photos = [
    {src:'https://picsum.photos/seed/totalstation/600/400',h:400,title:'全站仪对中整平现场',desc:'气泡跑了半小时还没进圈',cat:'control'},
    {src:'https://picsum.photos/seed/leveling1/600/800',h:800,title:'水准测量翻车瞬间',desc:'零下15度手冻僵了',cat:'leveling'},
    {src:'https://picsum.photos/seed/rtkwork/600/500',h:500,title:'RTK外业采集',desc:'信号时有时无',cat:'rtk'},
    {src:'https://picsum.photos/seed/contour/600/450',h:450,title:'地形测图等高线',desc:'画出来像心电图',cat:'map'},
    {src:'https://picsum.photos/seed/tripod/600/700',h:700,title:'三脚架忘在测站',desc:'天黑了打手电找的',cat:'control'},
    {src:'https://picsum.photos/seed/fieldwork1/600/400',h:400,title:'外业跑断腿',desc:'38度高温还在测',cat:'rtk'},
    {src:'https://picsum.photos/seed/surveyor/600/600',h:600,title:'闭合差超限第N次',desc:'风太大了不是我的错',cat:'leveling'},
    {src:'https://picsum.photos/seed/cass/600/350',h:350,title:'CASS画图画到凌晨',desc:'第二天发现数据是错的',cat:'map'},
    {src:'https://picsum.photos/seed/prism/600/500',h:500,title:'棱镜杆子弯了',desc:'没人发现直到闭合差超了',cat:'control'},
    {src:'https://picsum.photos/seed/gnss/600/750',h:750,title:'GNSS静态观测',desc:'坐了两小时玩手机',cat:'rtk'},
    {src:'https://picsum.photos/seed/traverse/600/400',h:400,title:'导线测量',desc:'一站测完发现读错盘了',cat:'control'},
    {src:'https://picsum.photos/seed/topo/600/550',h:550,title:'地形图测绘',desc:'地物符号认不全',cat:'map'},
    {src:'https://picsum.photos/seed/benchmark/600/650',h:650,title:'水准点找半天',desc:'点位被草盖住了',cat:'leveling'},
    {src:'https://picsum.photos/seed/gps/600/400',h:400,title:'GPS静态测量',desc:'放了两个小时机器自己跑了',cat:'rtk'},
    {src:'https://picsum.photos/seed/campus/600/500',h:500,title:'校内实习基地',desc:'操场都快被我们踩烂了',cat:'map'}
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
    var sectionIds = ['hero','academy','profile','equipment','timeline','skills','gallery','roast'];

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
    var els = $$('.masonry-item:not(.visible),.equip-card:not(.visible),.timeline-item:not(.visible),.skill-item:not(.visible),.roast-card:not(.visible),.academy-card:not(.visible),.section-header:not(.visible),.profile-text-col:not(.visible),.profile-photo-col:not(.visible)');
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
    var fills = $$('.equip-fill[data-width],.skill-fill[data-width]');
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
