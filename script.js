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

  function initHeroContour(){
    var canvas = $('#hero-contour');
    if(!canvas) return;
    var ctx = canvas.getContext('2d');
    var w,h;
    function resize(){w=canvas.width=canvas.offsetWidth;h=canvas.height=canvas.offsetHeight}
    resize();
    window.addEventListener('resize',resize);
    var lines=[];
    var lineCount=12;
    for(var i=0;i<lineCount;i++){
      lines.push({offset:i*60,amp:20+Math.random()*30,freq:.003+Math.random()*.002,speed:.2+Math.random()*.3,phase:Math.random()*Math.PI*2});
    }
    var t=0;
    function draw(){
      ctx.clearRect(0,0,w,h);
      ctx.strokeStyle='rgba(59,108,245,.12)';
      ctx.lineWidth=1;
      for(var i=0;i<lines.length;i++){
        var l=lines[i];
        ctx.beginPath();
        for(var x=0;x<w;x+=4){
          var y=h*.3+l.offset+Math.sin(x*l.freq+l.phase+t*l.speed)*l.amp+Math.cos(x*l.freq*.7+t*l.speed*.6)*l.amp*.5;
          if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        }
        ctx.stroke();
      }
      t+=.016;
      requestAnimationFrame(draw);
    }
    draw();
  }

  function initHeroOrbit(){
    var canvas=$('#hero-orbit');
    if(!canvas) return;
    var ctx=canvas.getContext('2d');
    var w,h;
    function resize(){w=canvas.width=canvas.offsetWidth;h=canvas.height=canvas.offsetHeight}
    resize();
    window.addEventListener('resize',resize);
    var orbits=[];
    for(var i=0;i<5;i++){
      orbits.push({cx:w*(.2+Math.random()*.6),cy:h*(.2+Math.random()*.6),rx:80+Math.random()*200,ry:40+Math.random()*100,angle:Math.random()*Math.PI*2,speed:.002+Math.random()*.003,dotSize:2+Math.random()*2,dots:[]});
    }
    var t=0;
    function draw(){
      ctx.clearRect(0,0,w,h);
      for(var i=0;i<orbits.length;i++){
        var o=orbits[i];
        ctx.beginPath();
        ctx.ellipse(o.cx,o.cy,o.rx,o.ry,0,0,Math.PI*2);
        ctx.strokeStyle='rgba(59,108,245,.06)';
        ctx.lineWidth=1;
        ctx.stroke();
        var dx=o.cx+Math.cos(o.angle)*o.rx;
        var dy=o.cy+Math.sin(o.angle)*o.ry;
        o.dots.push({x:dx,y:dy,life:1});
        if(o.dots.length>20) o.dots.shift();
        for(var j=0;j<o.dots.length;j++){
          var d=o.dots[j];
          d.life-=.02;
          if(d.life<=0) continue;
          ctx.beginPath();
          ctx.arc(d.x,d.y,o.dotSize*d.life,0,Math.PI*2);
          ctx.fillStyle='rgba(59,108,245,'+d.life*.2+')';
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(dx,dy,o.dotSize,0,Math.PI*2);
        ctx.fillStyle='rgba(59,108,245,.25)';
        ctx.fill();
        o.angle+=o.speed;
      }
      t+=.016;
      requestAnimationFrame(draw);
    }
    draw();
  }

  function initHeroParticles(){
    var canvas=$('#hero-particles');
    if(!canvas) return;
    var ctx=canvas.getContext('2d');
    var particles=[];
    var w,h;
    function resize(){w=canvas.width=canvas.offsetWidth;h=canvas.height=canvas.offsetHeight}
    resize();
    window.addEventListener('resize',resize);
    for(var i=0;i<45;i++){
      particles.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.15,vy:(Math.random()-.5)*.15,r:Math.random()*1.5+.5,o:Math.random()*.3+.1});
    }
    function draw(){
      ctx.clearRect(0,0,w,h);
      for(var i=0;i<particles.length;i++){
        var p=particles[i];
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x=w;if(p.x>w)p.x=0;
        if(p.y<0)p.y=h;if(p.y>h)p.y=0;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle='rgba(59,108,245,'+p.o+')';ctx.fill();
      }
      for(var i=0;i<particles.length;i++){
        for(var j=i+1;j<particles.length;j++){
          var dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y;
          var dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<100){
            ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);
            ctx.strokeStyle='rgba(59,108,245,'+((1-dist/100)*.08)+')';ctx.lineWidth=.5;ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  function initHeroCounter(){
    var nums=$$('.hero-stat-num[data-count]');
    if(!nums.length) return;
    var counted=false;
    function animateCount(){
      if(counted) return;
      counted=true;
      nums.forEach(function(el){
        var target=parseInt(el.getAttribute('data-count'),10);
        var duration=1800,start=performance.now();
        function step(now){
          var progress=Math.min((now-start)/duration,1);
          var eased=1-Math.pow(1-progress,3);
          el.textContent=Math.round(target*eased);
          if(progress<1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){setTimeout(animateCount,800);obs.unobserve(e.target)}
      });
    },{threshold:.3});
    obs.observe(nums[0]);
  }

  function initHeroChars(){
    var title=$('#hero-title');
    var subtitle=$('#hero-subtitle');
    if(title){
      var text=title.getAttribute('data-text')||'';
      title.innerHTML='';
      for(var i=0;i<text.length;i++){
        var span=document.createElement('span');
        span.className='char';
        span.textContent=text[i];
        span.style.animationDelay=(1+i*.08)+'s';
        title.appendChild(span);
      }
    }
    if(subtitle){
      var stext=subtitle.getAttribute('data-text')||'';
      subtitle.innerHTML='';
      for(var i=0;i<stext.length;i++){
        var span=document.createElement('span');
        span.className='sub-char';
        span.textContent=stext[i];
        span.style.animationDelay=(1.5+i*.03)+'s';
        subtitle.appendChild(span);
      }
    }
  }

  function initCursorParticles(){
    var canvas=$('#cursor-canvas');
    if(!canvas) return;
    var ctx=canvas.getContext('2d');
    var particles=[];
    var mouseX=0,mouseY=0;
    function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight}
    resize();
    window.addEventListener('resize',resize);
    document.addEventListener('mousemove',function(e){
      mouseX=e.clientX;mouseY=e.clientY;
      if(Math.random()>.75) particles.push({x:mouseX,y:mouseY,vx:(Math.random()-.5)*1.5,vy:(Math.random()-.5)*1.5,life:1,r:Math.random()*1.5+.5});
    });
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(var i=particles.length-1;i>=0;i--){
        var p=particles[i];p.x+=p.vx;p.y+=p.vy;p.life-=.025;
        if(p.life<=0){particles.splice(i,1);continue}
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle='rgba(59,108,245,'+p.life*.3+')';ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  function initRipple(){
    var btn=$('#btn-explore');
    if(!btn) return;
    btn.addEventListener('click',function(e){
      var rect=btn.getBoundingClientRect();
      var x=e.clientX-rect.left,y=e.clientY-rect.top;
      var ripple=document.createElement('span');
      ripple.className='ripple';
      ripple.style.left=x+'px';ripple.style.top=y+'px';
      ripple.style.width=ripple.style.height=Math.max(rect.width,rect.height)+'px';
      btn.appendChild(ripple);
      setTimeout(function(){ripple.remove()},600);
    });
  }

  function initTagSparks(){
    $$('.hero-tag').forEach(function(tag){
      tag.addEventListener('mouseenter',function(){
        for(var i=0;i<4;i++){
          var spark=document.createElement('span');
          spark.className='tag-spark';
          spark.style.width=spark.style.height=(2+Math.random()*4)+'px';
          spark.style.left=Math.random()*100+'%';
          spark.style.top=Math.random()*100+'%';
          tag.appendChild(spark);
          setTimeout(function(){spark.remove()},500);
        }
      });
    });
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
    var els = $$('.masonry-item:not(.visible),.roast-card:not(.visible),.academy-card:not(.visible),.section-header:not(.visible),.profile-text-col:not(.visible),.profile-photo-col:not(.visible),.showcase-card:not(.visible),.wave-divider:not(.visible)');
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

  function initEquipment(){
    var grid = $('#equip-grid');
    var filterWrap = $('#equip-filter');
    var sortWrap = $('#equip-sort');
    var pillsWrap = $('#equip-stat-pills');
    var countWrap = $('#equip-count');
    var detailEmpty, detailContent;
    if(!grid) return;

    var detail = $('#equip-detail');
    if(detail){
      detailEmpty = detail.querySelector('.equip-detail-empty');
      detailContent = detail.querySelector('.equip-detail-content');
    }

    var equips = [
      {icon:'🔭',name:'全站仪',brand:'学校老古董 · 索佳SET230R',cat:'outdoor',tier:'r',status:'凑合能用',power:45,accuracy:50,endurance:40,weight:60,desc:'对中整平要半小时的那种，气泡跑得比我还快。据说这台机器经历过三次测绘实习，每次回来都要大修一次。'},
      {icon:'📡',name:'RTK接收机',brand:'南方测绘 · S82T',cat:'outdoor',tier:'sr',status:'主力担当',power:80,accuracy:85,endurance:60,weight:70,desc:'三分搞定坐标，前提是搜星够多、别进树林子。进林子就是灾难片，搜星从12颗直接掉到2颗。'},
      {icon:'📏',name:'水准仪',brand:'自动安平 · DSZ2',cat:'outdoor',tier:'r',status:'还行吧',power:55,accuracy:60,endurance:65,weight:75,desc:'二等水准闭合差超了三次，最后发现是脚架没踩实。踩实之后超了两次，因为尺垫歪了。'},
      {icon:'📐',name:'棱镜杆',brand:'一对 · 生锈合金',cat:'outdoor',tier:'n',status:'该换了',power:20,accuracy:30,endurance:25,weight:80,desc:'杆子弯了还没人发现，直到闭合差超限才发现是杆的问题。现在用它测出来的数据带弧度。'},
      {icon:'🖥️',name:'CASS软件',brand:'南方CASS · 学生破解版',cat:'office',tier:'sr',status:'刚入门',power:60,accuracy:55,endurance:30,weight:20,desc:'等高线画了一晚上，第二天发现高程数据是错的。重画之后发现CAD崩了，没保存。'},
      {icon:'🎒',name:'外业背包',brand:'军绿色 · 能装就行',cat:'survival',tier:'r',status:'好评',power:15,accuracy:10,endurance:90,weight:85,desc:'能塞下记录本、铅笔、水壶、泡面、充电宝和一堆乱七八糟的东西。唯一的作用是让你在外业冻死之前先把包垫在屁股底下。'},
      {icon:'🛰️',name:'GNSS接收机',brand:'中海达 · V200',cat:'outdoor',tier:'ssr',status:'梦中情器',power:90,accuracy:92,endurance:70,weight:65,desc:'只在答辩的时候见导师用过，精度±1cm，搜星16颗，对中只需5秒。我们用的RTK看见它会自卑。'},
      {icon:'⌨️',name:'平差软件',brand:'科傻COSA · 教育版',cat:'office',tier:'r',status:'够用',power:50,accuracy:70,endurance:20,weight:15,desc:'法方程一跑就是半小时，跑完告诉你残差超限。你改了数据重跑，它说："还是超限。"你问为什么，它说："因为你的数据就是垃圾。"'},
      {icon:'🏕️',name:'军大衣',brand:'07式 · 淘宝68包邮',cat:'survival',tier:'ssr',status:'外业之神',power:10,accuracy:5,endurance:95,weight:90,desc:'零下15度外业测量全靠它。穿上之后行动能力下降60%，但存活率提升200%。测绘人的终极装备，比全站仪重要。'},
      {icon:'📱',name:'手机APP测量',brand:'测量员 · 免费版',cat:'outdoor',tier:'n',status:'聊胜于无',power:30,accuracy:25,endurance:40,weight:95,desc:'精度±5m，跟没测差不多。但拍个照片标注一下还是可以的，至少比闭合差超限的导线强。'},
      {icon:'📊',name:'Excel表格',brand:'Office · 正版激活器',cat:'office',tier:'sr',status:'数据坟场',power:40,accuracy:80,endurance:50,weight:10,desc:'平差全靠Excel，公式写了三千行。一旦某格被误删，整个表格就像多米诺骨牌一样崩塌。你永远不知道哪一格是关键格。'},
      {icon:'🍪',name:'干粮补给',brand:'压缩饼干 · 军用级',cat:'survival',tier:'r',status:'续命物资',power:5,accuracy:5,endurance:80,weight:60,desc:'外业一走就是一整天，中午没地方吃饭。压缩饼干配矿泉水，测绘人的标准套餐。吃多了你会怀疑人生，不吃你会直接没命。'},
      {icon:'🔭',name:'激光铅垂仪',brand:'徕卡 · LZL2',cat:'outdoor',tier:'sr',status:'高级货',power:70,accuracy:75,endurance:55,weight:45,desc:'投点精度±1mm，但是用的时候不能有人经过，不能有震动，不能有风。在工大实训楼基本等于废的，因为楼下永远在施工。'},
      {icon:'🎒',name:'急救包',brand:'外业必备 · 过期版',cat:'survival',tier:'n',status:'心理安慰',power:5,accuracy:5,endurance:30,weight:50,desc:'碘伏过期两年，创可贴粘性为零，纱布发黄。但老师说必须带，因为"万一出事了，至少有个包可以拍照发朋友圈证明你们有急救措施"。'}
    ];

    var tiers = {ssr:'SSR',sr:'SR',r:'R',n:'N'};
    var tierColors = {ssr:'tier-ssr',sr:'tier-sr',r:'tier-r',n:'tier-n'};
    var tierOrder = {ssr:0,sr:1,r:2,n:3};
    var currentFilter = 'all';
    var currentSort = 'default';
    var selectedIdx = -1;

    function sortEquips(list){
      var arr = list.slice();
      if(currentSort === 'tier'){
        arr.sort(function(a,b){return tierOrder[a.tier] - tierOrder[b.tier]});
      }else if(currentSort === 'power'){
        arr.sort(function(a,b){return b.power - a.power});
      }else if(currentSort === 'accuracy'){
        arr.sort(function(a,b){return b.accuracy - a.accuracy});
      }
      return arr;
    }

    function getFiltered(){
      var list = currentFilter === 'all' ? equips : equips.filter(function(eq){return eq.cat === currentFilter});
      return sortEquips(list);
    }

    function renderPills(list){
      if(!pillsWrap) return;
      var cats = {outdoor:0,office:0,survival:0};
      list.forEach(function(e){cats[e.cat]++});
      pillsWrap.innerHTML =
        '<div class="equip-stat-pill"><span>'+list.length+'</span>装备总数</div>' +
        '<div class="equip-stat-pill"><span>'+cats.outdoor+'</span>外业</div>' +
        '<div class="equip-stat-pill"><span>'+cats.office+'</span>内业</div>' +
        '<div class="equip-stat-pill"><span>'+cats.survival+'</span>生存</div>';
    }

    function renderCards(list){
      grid.innerHTML = '';
      if(countWrap) countWrap.textContent = list.length + ' / ' + equips.length;
      list.forEach(function(e,i){
        var card = document.createElement('div');
        card.className = 'equip-card';
        card.setAttribute('data-cat', e.cat);
        card.setAttribute('data-idx', i);
        card.style.transitionDelay = (i * 50) + 'ms';
        card.innerHTML =
          '<div class="equip-card-banner"></div>' +
          '<span class="equip-card-tier '+tierColors[e.tier]+'">'+tiers[e.tier]+'</span>' +
          '<div class="equip-card-body">' +
            '<div class="equip-card-top">' +
              '<div class="equip-icon-wrap"><span class="equip-icon">'+e.icon+'</span></div>' +
            '</div>' +
            '<div class="equip-card-meta">' +
              '<h3>'+e.name+'</h3>' +
              '<span class="equip-brand">'+e.brand+'</span>' +
            '</div>' +
            '<div class="equip-card-stats">' +
              '<div class="equip-mini-stat"><span class="equip-mini-val">'+e.power+'</span><span class="equip-mini-label">威力</span></div>' +
              '<div class="equip-mini-stat"><span class="equip-mini-val">'+e.accuracy+'</span><span class="equip-mini-label">精度</span></div>' +
              '<div class="equip-mini-stat"><span class="equip-mini-val">'+e.endurance+'</span><span class="equip-mini-label">续航</span></div>' +
              '<div class="equip-mini-stat"><span class="equip-mini-val">'+e.weight+'</span><span class="equip-mini-label">便携</span></div>' +
            '</div>' +
            '<div class="equip-bar-row"><span class="equip-status">'+e.status+'</span></div>' +
            '<div class="equip-bar"><div class="equip-fill" data-width="'+e.power+'"></div></div>' +
          '</div>';
        card.addEventListener('click',function(){
          var allCards = grid.querySelectorAll('.equip-card');
          allCards.forEach(function(c){c.classList.remove('selected')});
          card.classList.add('selected');
          selectedIdx = i;
          var rightPanel = detail && getComputedStyle(detail.parentElement).display !== 'none';
          if(rightPanel){
            showDetail(e);
          }else{
            showModal(e);
          }
        });
        grid.appendChild(card);
      });
      observeEquipCards();
    }

    function showDetail(e){
      if(!detail || !detailContent) return;
      if(detailEmpty) detailEmpty.style.display = 'none';
      detailContent.style.display = '';
      var el = function(id){return document.getElementById(id)};
      el('equip-detail-icon').textContent = e.icon;
      el('equip-detail-name').textContent = e.name;
      el('equip-detail-brand').textContent = e.brand;
      var tierEl = el('equip-detail-tier');
      tierEl.textContent = tiers[e.tier];
      tierEl.className = 'equip-detail-tier '+tierColors[e.tier];
      el('equip-detail-status').textContent = e.status;
      el('equip-detail-desc').textContent = e.desc;
      el('equip-detail-stats').innerHTML =
        '<div class="equip-detail-stat"><span class="equip-detail-stat-val">'+e.power+'</span><span class="equip-detail-stat-label">威力</span></div>' +
        '<div class="equip-detail-stat"><span class="equip-detail-stat-val">'+e.accuracy+'</span><span class="equip-detail-stat-label">精度</span></div>' +
        '<div class="equip-detail-stat"><span class="equip-detail-stat-val">'+e.endurance+'</span><span class="equip-detail-stat-label">续航</span></div>' +
        '<div class="equip-detail-stat"><span class="equip-detail-stat-val">'+e.weight+'</span><span class="equip-detail-stat-label">便携</span></div>';
      var stats = [{l:'威力',v:e.power},{l:'精度',v:e.accuracy},{l:'续航',v:e.endurance},{l:'便携',v:e.weight}];
      var barsHtml = '';
      stats.forEach(function(s){
        barsHtml += '<div class="equip-detail-bar-item">' +
          '<span class="equip-detail-bar-label">'+s.l+'</span>' +
          '<div class="equip-detail-bar"><div class="equip-detail-bar-fill" data-width="'+s.v+'"></div></div>' +
          '<span class="equip-detail-bar-val">'+s.v+'</span>' +
        '</div>';
      });
      el('equip-detail-bars').innerHTML = barsHtml;
      setTimeout(function(){
        var fills = detailContent.querySelectorAll('.equip-detail-bar-fill');
        fills.forEach(function(f){
          f.style.width = f.getAttribute('data-width') + '%';
        });
      },80);
      detail.scrollTop = 0;
    }

    function showModal(e){
      var overlay = $('#equip-modal-overlay');
      if(!overlay) return;
      var el = function(id){return document.getElementById(id)};
      el('equip-modal-icon').textContent = e.icon;
      el('equip-modal-name').textContent = e.name;
      el('equip-modal-brand').textContent = e.brand;
      var tierEl = el('equip-modal-tier');
      tierEl.textContent = tiers[e.tier];
      tierEl.className = 'equip-detail-tier '+tierColors[e.tier];
      el('equip-modal-status').textContent = e.status;
      el('equip-modal-desc').textContent = e.desc;
      el('equip-modal-stats').innerHTML =
        '<div class="equip-detail-stat"><span class="equip-detail-stat-val">'+e.power+'</span><span class="equip-detail-stat-label">威力</span></div>' +
        '<div class="equip-detail-stat"><span class="equip-detail-stat-val">'+e.accuracy+'</span><span class="equip-detail-stat-label">精度</span></div>' +
        '<div class="equip-detail-stat"><span class="equip-detail-stat-val">'+e.endurance+'</span><span class="equip-detail-stat-label">续航</span></div>' +
        '<div class="equip-detail-stat"><span class="equip-detail-stat-val">'+e.weight+'</span><span class="equip-detail-stat-label">便携</span></div>';
      var stats = [{l:'威力',v:e.power},{l:'精度',v:e.accuracy},{l:'续航',v:e.endurance},{l:'便携',v:e.weight}];
      var barsHtml = '';
      stats.forEach(function(s){
        barsHtml += '<div class="equip-detail-bar-item">' +
          '<span class="equip-detail-bar-label">'+s.l+'</span>' +
          '<div class="equip-detail-bar"><div class="equip-detail-bar-fill" data-width="'+s.v+'"></div></div>' +
          '<span class="equip-detail-bar-val">'+s.v+'</span>' +
        '</div>';
      });
      el('equip-modal-bars').innerHTML = barsHtml;
      overlay.classList.add('open');
      setTimeout(function(){
        var fills = overlay.querySelectorAll('.equip-detail-bar-fill');
        fills.forEach(function(f){f.style.width = f.getAttribute('data-width')+'%'});
      },100);
    }

    function closeModal(){
      var overlay = $('#equip-modal-overlay');
      if(!overlay) return;
      overlay.classList.remove('open');
    }

    var modalCloseBtn = $('#equip-modal-close');
    var modalOverlay = $('#equip-modal-overlay');
    if(modalCloseBtn) modalCloseBtn.addEventListener('click',closeModal);
    if(modalOverlay) modalOverlay.addEventListener('click',function(e){if(e.target === modalOverlay) closeModal()});
    document.addEventListener('keydown',function(e){if(e.key === 'Escape') closeModal()});

    function observeEquipCards(){
      var cards = grid.querySelectorAll('.equip-card');
      if(!cards.length) return;
      if(!('IntersectionObserver' in window)){
        cards.forEach(function(c){c.classList.add('visible')});
        return;
      }
      var obs = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){
            e.target.classList.add('visible');
            var fill = e.target.querySelector('.equip-fill');
            if(fill) setTimeout(function(){fill.style.width = fill.getAttribute('data-width')+'%'},200);
            obs.unobserve(e.target);
          }
        });
      },{threshold:.08});
      cards.forEach(function(c){obs.observe(c)});
    }

    var filtered = getFiltered();
    renderCards(filtered);
    renderPills(filtered);

    if(filterWrap){
      filterWrap.addEventListener('click',function(e){
        var btn = e.target.closest('.equip-filter-btn');
        if(!btn) return;
        filterWrap.querySelectorAll('.equip-filter-btn').forEach(function(b){b.classList.remove('active')});
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        selectedIdx = -1;
        var list = getFiltered();
        renderCards(list);
        renderPills(list);
      });
    }

    if(sortWrap){
      sortWrap.addEventListener('click',function(e){
        var btn = e.target.closest('.equip-sort-btn');
        if(!btn) return;
        sortWrap.querySelectorAll('.equip-sort-btn').forEach(function(b){b.classList.remove('active')});
        btn.classList.add('active');
        currentSort = btn.getAttribute('data-sort');
        selectedIdx = -1;
        renderCards(getFiltered());
      });
    }
  }

  function initSkillTree(){
    var container = $('#skill-tree');
    if(!container) return;

    var treeData = [
      {icon:'🔭',label:'仪器操作',pct:68,note:'凑合能用，偶尔翻车',color:'#3b6cf5',subs:[
        {icon:'🎯',label:'全站仪',pct:65,note:'对中整平40→15分钟',leaves:[{t:'对中整平',s:'m'},{t:'坐标测量',s:'m'},{t:'后方交会',s:'l'},{t:'距离测量',s:'m'},{t:'角度放样',s:'n'}]},
        {icon:'📡',label:'RTK',pct:80,note:'有信号就行',leaves:[{t:'基站架设',s:'m'},{t:'移动站',s:'m'},{t:'坐标转换',s:'l'},{t:'点校正',s:'m'},{t:'动态测量',s:'m'}]},
        {icon:'📏',label:'水准仪',pct:55,note:'闭合差没合格过',leaves:[{t:'读数',s:'m'},{t:'记录',s:'m'},{t:'计算闭合差',s:'n'},{t:'自动安平',s:'l'},{t:'i角检校',s:'n'}]},
        {icon:'🛰',label:'GNSS接收机',pct:45,note:'导师才让碰',leaves:[{t:'静态观测',s:'l'},{t:'基线解算',s:'n'},{t:'网平差',s:'n'},{t:'搜星优化',s:'l'}]}
      ]},
      {icon:'📐',label:'测量技术',pct:55,note:'理论懂一半，实操看运气',color:'#e74c3c',subs:[
        {icon:'🗺',label:'控制测量',pct:50,note:'会布但点不能用',leaves:[{t:'导线测量',s:'m'},{t:'三角测量',s:'l'},{t:'GPS控制网',s:'l'},{t:'选点埋石',s:'m'},{t:'精度估算',s:'n'}]},
        {icon:'⛰',label:'水准测量',pct:45,note:'手冻僵了记错读数',leaves:[{t:'二等水准',s:'l'},{t:'四等水准',s:'m'},{t:'高程计算',s:'m'},{t:'跨河水准',s:'n'},{t:'三角高程',s:'l'}]},
        {icon:'📐',label:'地形测绘',pct:42,note:'地物符号认不全',leaves:[{t:'碎部测量',s:'m'},{t:'特征点',s:'l'},{t:'比例尺',s:'m'},{t:'地物调绘',s:'l'},{t:'地貌测绘',s:'n'}]},
        {icon:'🏗',label:'施工放样',pct:38,note:'放错两次被骂了',leaves:[{t:'极坐标法',s:'l'},{t:'高程放样',s:'m'},{t:'建筑放线',s:'n'},{t:'道路放样',s:'n'}]}
      ]},
      {icon:'💻',label:'内业处理',pct:42,note:'画图靠猜，平差靠蒙',color:'#9b59b6',subs:[
        {icon:'🗺',label:'CASS画图',pct:40,note:'等高线像心电图',leaves:[{t:'等高线',s:'m'},{t:'地物绘制',s:'l'},{t:'图幅整饰',s:'l'},{t:'断面图',s:'n'},{t:'土方计算',s:'n'}]},
        {icon:'📊',label:'数据平差',pct:35,note:'Excel凑合用',leaves:[{t:'条件平差',s:'n'},{t:'间接平差',s:'n'},{t:'精度评定',s:'l'},{t:'粗差探测',s:'n'},{t:'法方程',s:'n'}]},
        {icon:'🖱',label:'CAD制图',pct:45,note:'基本操作会',leaves:[{t:'图层管理',s:'m'},{t:'标注',s:'m'},{t:'出图',s:'l'},{t:'块编辑',s:'l'},{t:'二次开发',s:'n'}]},
        {icon:'🌐',label:'GIS应用',pct:30,note:'只会打开看',leaves:[{t:'ArcGIS',s:'l'},{t:'矢量化',s:'n'},{t:'空间分析',s:'n'},{t:'属性编辑',s:'l'}]}
      ]},
      {icon:'🧮',label:'理论基础',pct:38,note:'考前突击勉强过',color:'#f39c12',subs:[
        {icon:'📐',label:'误差理论',pct:35,note:'误差本身就是个误差',leaves:[{t:'偶然误差',s:'m'},{t:'系统误差',s:'l'},{t:'中误差',s:'l'},{t:'极限误差',s:'n'},{t:'相对误差',s:'n'}]},
        {icon:'🧮',label:'矩阵运算',pct:28,note:'求逆就头大',leaves:[{t:'矩阵求逆',s:'n'},{t:'最小二乘',s:'l'},{t:'特征值',s:'n'},{t:'正规方程',s:'n'}]},
        {icon:'📊',label:'概率统计',pct:40,note:'正态分布倒是熟',leaves:[{t:'正态分布',s:'m'},{t:'假设检验',s:'l'},{t:'区间估计',s:'l'},{t:'回归分析',s:'n'}]},
        {icon:'🌍',label:'大地测量',pct:32,note:'椭球体头大',leaves:[{t:'参考椭球',s:'l'},{t:'高斯投影',s:'n'},{t:'坐标系转换',s:'n'},{t:'垂线偏差',s:'n'}]}
      ]},
      {icon:'🏃',label:'体力活',pct:92,note:'唯一的强项，不吹',color:'#27ae60',subs:[
        {icon:'⛰',label:'跑外业',pct:95,note:'扛仪器爬山不带喘',leaves:[{t:'上山',s:'m'},{t:'下山',s:'m'},{t:'翻墙',s:'m'},{t:'扛仪器',s:'m'},{t:'越野',s:'m'}]},
        {icon:'❄',label:'抗冻能力',pct:88,note:'零下15度还在测',leaves:[{t:'冬训',s:'m'},{t:'毅力',s:'m'},{t:'硬抗',s:'m'},{t:'军大衣',s:'m'}]},
        {icon:'☀',label:'抗晒能力',pct:90,note:'38度依然在线',leaves:[{t:'夏天外业',s:'m'},{t:'防晒',s:'l'},{t:'中暑预防',s:'m'},{t:'补水',s:'m'}]},
        {icon:'🎒',label:'负重行军',pct:85,note:'背包20斤不喘',leaves:[{t:'装备搬运',s:'m'},{t:'长途跋涉',s:'m'},{t:'地形适应',s:'m'}]}
      ]},
      {icon:'🐟',label:'摸鱼艺术',pct:95,note:'树荫下蹲着，手机一掏',color:'#1abc9c',subs:[
        {icon:'📶',label:'找信号',pct:98,note:'RTK没信号就是休息',leaves:[{t:'切换基站',s:'m'},{t:'重启设备',s:'m'},{t:'等待搜星',s:'m'},{t:'假装调试',s:'m'}]},
        {icon:'😴',label:'偷懒术',pct:95,note:'完美伪装观测中',leaves:[{t:'装调仪器',s:'m'},{t:'看手机',s:'m'},{t:'树荫蹲',s:'m'},{t:'借口上厕所',s:'m'}]},
        {icon:'📝',label:'编数据',pct:60,note:'偶尔合理修正',leaves:[{t:'凑闭合差',s:'l'},{t:'美化数据',s:'n'},{t:'截图存档',s:'m'},{t:'合理推测',s:'l'}]},
        {icon:'🍕',label:'外业生存',pct:88,note:'找吃的才是核心技能',leaves:[{t:'泡面',s:'m'},{t:'找小卖部',s:'m'},{t:'蹭饭',s:'m'},{t:'带零食',s:'m'}]}
      ]}
    ];

    var catNames = ['仪器操作','测量技术','内业处理','理论基础','体力活','摸鱼艺术'];
    var catColors = ['#3b6cf5','#e74c3c','#9b59b6','#f39c12','#27ae60','#1abc9c'];
    var avgPct = Math.round(treeData.reduce(function(s,b){return s+b.pct},0)/treeData.length);
    var totalSkills = treeData.reduce(function(s,b){return s+b.subs.reduce(function(ss,sub){return ss+sub.leaves.length},0)},0);

    function renderSummary(){
      var wrap = $('#skill-summary');
      if(!wrap) return;
      var items = [
        {icon:'📊',val:avgPct+'%',label:'综合评级'},
        {icon:'🔢',val:treeData.length,label:'技能分支'},
        {icon:'📋',val:totalSkills,label:'子技能总数'},
        {icon:'⭐',val:'Lv.3',label:'当前等级'}
      ];
      items.forEach(function(it,i){
        var card = document.createElement('div');
        card.className = 'skill-summary-card';
        card.style.transitionDelay = (i*0.1)+'s';
        card.innerHTML = '<span class="skill-summary-icon">'+it.icon+'</span><div class="skill-summary-info"><span class="skill-summary-val">'+it.val+'</span><span class="skill-summary-label">'+it.label+'</span></div>';
        wrap.appendChild(card);
      });
      var obs = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){
            wrap.querySelectorAll('.skill-summary-card').forEach(function(c){c.classList.add('visible')});
            obs.unobserve(e.target);
          }
        });
      },{threshold:.3});
      obs.observe(wrap);
    }

    function renderRadar(){
      var canvas = $('#skill-radar');
      var legendWrap = $('#skill-radar-legend');
      if(!canvas||!canvas.getContext) return;
      var ctx = canvas.getContext('2d');
      var w = canvas.width, h = canvas.height;
      var cx = w/2, cy = h/2, R = Math.min(cx,cy)-40;
      var n = treeData.length;
      var angleStep = 2*Math.PI/n;
      var startAngle = -Math.PI/2;

      function drawGrid(){
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--border').trim()||'rgba(0,0,0,.06)';
        ctx.lineWidth = 1;
        for(var i=1;i<=5;i++){
          var r = R*i/5;
          ctx.beginPath();
          for(var j=0;j<=n;j++){
            var a = startAngle + j*angleStep;
            var x = cx + r*Math.cos(a);
            var y = cy + r*Math.sin(a);
            j===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
          }
          ctx.closePath();
          ctx.stroke();
        }
        for(var j=0;j<n;j++){
          var a = startAngle + j*angleStep;
          ctx.beginPath();
          ctx.moveTo(cx,cy);
          ctx.lineTo(cx+R*Math.cos(a),cy+R*Math.sin(a));
          ctx.stroke();
        }
      }

      function drawLabels(){
        ctx.font = '600 11px "Microsoft YaHei",sans-serif';
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--txt2').trim()||'#5a5a72';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for(var j=0;j<n;j++){
          var a = startAngle + j*angleStep;
          var lr = R+24;
          var x = cx + lr*Math.cos(a);
          var y = cy + lr*Math.sin(a);
          ctx.fillText(treeData[j].label,x,y);
        }
      }

      function animateArea(progress){
        ctx.clearRect(0,0,w,h);
        drawGrid();
        drawLabels();
        ctx.beginPath();
        for(var j=0;j<=n;j++){
          var idx = j%n;
          var a = startAngle + idx*angleStep;
          var r = R*(treeData[idx].pct/100)*progress;
          var x = cx + r*Math.cos(a);
          var y = cy + r*Math.sin(a);
          j===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        ctx.closePath();
        var accent = getComputedStyle(document.body).getPropertyValue('--accent').trim()||'#3b6cf5';
        ctx.fillStyle = accent+'30';
        ctx.fill();
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.stroke();
        for(var j=0;j<n;j++){
          var a = startAngle + j*angleStep;
          var r = R*(treeData[j].pct/100)*progress;
          var x = cx + r*Math.cos(a);
          var y = cy + r*Math.sin(a);
          ctx.beginPath();
          ctx.arc(x,y,4,0,2*Math.PI);
          ctx.fillStyle = catColors[j];
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      var obs = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){
            var start = null;
            function step(ts){
              if(!start) start=ts;
              var p = Math.min((ts-start)/1200,1);
              var eased = 1-Math.pow(1-p,3);
              animateArea(eased);
              if(p<1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            obs.unobserve(e.target);
          }
        });
      },{threshold:.3});
      obs.observe(canvas);

      if(legendWrap){
        treeData.forEach(function(b,i){
          var item = document.createElement('div');
          item.className = 'skill-radar-legend-item';
          item.style.transitionDelay = (i*0.12)+'s';
          item.innerHTML = '<span class="skill-radar-legend-dot" style="background:'+catColors[i]+'"></span><span>'+b.label+'</span><span class="skill-radar-legend-pct">'+b.pct+'%</span>';
          legendWrap.appendChild(item);
        });
        var lobs = new IntersectionObserver(function(entries){
          entries.forEach(function(e){
            if(e.isIntersecting){
              legendWrap.querySelectorAll('.skill-radar-legend-item').forEach(function(el){el.classList.add('visible')});
              lobs.unobserve(e.target);
            }
          });
        },{threshold:.3});
        lobs.observe(legendWrap);
      }
    }

    function svgEl(tag,attr){
      var el=document.createElementNS('http://www.w3.org/2000/svg',tag);
      if(attr){for(var k in attr)el.setAttribute(k,attr[k])}
      return el;
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
          var dist=30+Math.random()*80;
          var dx=Math.cos(angle)*dist;
          var dy=Math.sin(angle)*dist;
          pEl.style.opacity='0.8';
          pEl.style.transition='all '+(0.5+Math.random()*0.7)+'s ease-out';
          requestAnimationFrame(function(){
            pEl.style.transform='translate('+dx+'px,'+dy+'px) scale(0)';
            pEl.style.opacity='0';
          });
          setTimeout(function(){if(pEl.parentNode)pEl.parentNode.removeChild(pEl)},1500);
        })(p);
      }
    }

    var tooltipEl = document.createElement('div');
    tooltipEl.className = 'skill-tooltip';
    document.body.appendChild(tooltipEl);

    function showTooltip(e,name,pct,note){
      tooltipEl.innerHTML = '<div class="skill-tooltip-name">'+name+'</div><div class="skill-tooltip-pct">熟练度 '+pct+'%</div>'+(note?'<div class="skill-tooltip-note">'+note+'</div>':'');
      tooltipEl.classList.add('show');
      positionTooltip(e);
    }
    function positionTooltip(e){
      var x = e.clientX+14, y = e.clientY+14;
      if(x+230>window.innerWidth) x = e.clientX-230;
      if(y+100>window.innerHeight) y = e.clientY-100;
      tooltipEl.style.left = x+'px';
      tooltipEl.style.top = y+'px';
    }
    function hideTooltip(){
      tooltipEl.classList.remove('show');
    }

    function buildSubNodes(subs,parentEl,colIdx){
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
          var noteEl=document.createElement('div');
          noteEl.className='tree-snode-note';
          noteEl.textContent=s.note;
          node.appendChild(noteEl);
        }

        node.addEventListener('mouseenter',function(ev){showTooltip(ev,s.label,s.pct,s.note)});
        node.addEventListener('mousemove',positionTooltip);
        node.addEventListener('mouseleave',hideTooltip);

        col.appendChild(node);

        var leafWrap=document.createElement('div');
        leafWrap.className='tree-leaf-skills';
        if(s.leaves){
          s.leaves.forEach(function(l){
            var tag=document.createElement('span');
            tag.className='tree-leaf-tag';
            if(l.s==='n') tag.classList.add('locked');
            else if(l.s==='m') tag.classList.add('mastered');
            tag.textContent=l.t;
            leafWrap.appendChild(tag);
          });
        }
        col.appendChild(leafWrap);

        node.addEventListener('mouseenter',function(){
          leafWrap.classList.add('visible');
          if(!c.classList.contains('animated')){
            c.classList.add('animated');
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
        var noteEl=document.createElement('div');
        noteEl.className='tree-bnode-note';
        noteEl.textContent=b.note;
        node.appendChild(noteEl);
      }

      var arrowEl=document.createElement('div');
      arrowEl.className='tree-bnode-arrow';
      arrowEl.textContent='▼ 点击展开';
      node.appendChild(arrowEl);

      node.addEventListener('mouseenter',function(ev){showTooltip(ev,b.label,b.pct,b.note)});
      node.addEventListener('mousemove',positionTooltip);
      node.addEventListener('mouseleave',hideTooltip);

      col.appendChild(node);

      var subWrap=buildSubNodes(b.subs,col,idx);

      var isOpen = false;
      node.addEventListener('click',function(e){
        e.stopPropagation();
        if(isOpen){
          isOpen=false;
          node.classList.remove('active');
          subWrap.classList.remove('expanded');
          subWrap.querySelectorAll('.tree-sub-col').forEach(function(sc){sc.classList.remove('visible')});
          setTimeout(function(){drawCanvasLines()},400);
        }else{
          isOpen=true;
          node.classList.add('active');
          subWrap.classList.add('expanded');
          var subCols=subWrap.querySelectorAll('.tree-sub-col');
          subCols.forEach(function(sc,i){
            setTimeout(function(){sc.classList.add('visible')},i*80+60);
          });
          var subRings=subWrap.querySelectorAll('.tree-snode-ring circle');
          subRings.forEach(function(sr,i){
            setTimeout(function(){sr.classList.add('animated')},i*80+200);
          });
          if(!c.classList.contains('animated')){
            c.classList.add('animated');
            spawnParticles(node,10);
          }
          setTimeout(function(){drawCanvasLines()},500);
        }
      });

      return col;
    }

    var layer=document.createElement('div');
    layer.className='tree-layer';

    var rootNode=document.createElement('div');
    rootNode.className='tree-root-node';

    var rootRingW=110;
    var rootR=rootRingW/2-2;
    var rootCirc=2*Math.PI*rootR;
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
    rootNote.textContent='综合评级 '+avgPct+'% · 点击展开各分支 · 共'+totalSkills+'项子技能';
    rootNode.appendChild(rootNote);

    var rootHint=document.createElement('div');
    rootHint.className='tree-root-hint';
    rootHint.textContent='CLICK';
    rootNode.appendChild(rootHint);

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

    var skillCanvas = $('#skill-canvas');
    function drawCanvasLines(){
      if(!skillCanvas) return;
      var rect = container.getBoundingClientRect();
      skillCanvas.width = container.scrollWidth;
      skillCanvas.height = container.scrollHeight;
      var ctx = skillCanvas.getContext('2d');
      ctx.clearRect(0,0,skillCanvas.width,skillCanvas.height);
      var accent = getComputedStyle(document.body).getPropertyValue('--accent').trim()||'#3b6cf5';
      var cols = branchesWrap.querySelectorAll('.tree-branch-col.visible');
      var rootRect = rootNode.getBoundingClientRect();
      var rootX = rootRect.left-rect.left+rootRect.width/2;
      var rootY = rootRect.bottom-rect.top;
      cols.forEach(function(col){
        var colRect = col.getBoundingClientRect();
        var colX = colRect.left-rect.left+colRect.width/2;
        var colY = colRect.top-rect.top+15;
        ctx.beginPath();
        ctx.moveTo(rootX,rootY);
        ctx.bezierCurveTo(rootX,rootY+30,colX,colY-30,colX,colY);
        ctx.strokeStyle = accent+'60';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }

    var rootExpanded=false;
    function expandRoot(){
      if(rootExpanded) return;
      rootExpanded=true;
      rootNode.classList.add('expanded');
      trunkLine.classList.add('grown');
      rootHint.style.display='none';
      setTimeout(function(){
        branchesWrap.classList.add('expanded');
        var cols=branchesWrap.querySelectorAll('.tree-branch-col');
        cols.forEach(function(c,i){
          setTimeout(function(){c.classList.add('visible')},i*100+200);
        });
        var branchCircles=branchesWrap.querySelectorAll('.tree-bnode-ring circle');
        branchCircles.forEach(function(c,i){
          setTimeout(function(){c.classList.add('animated')},i*100+500);
        });
        spawnParticles(rootNode,15);
        setTimeout(drawCanvasLines,800);
      },400);
    }
    function collapseRoot(){
      if(!rootExpanded) return;
      rootExpanded=false;
      rootNode.classList.remove('expanded');
      branchesWrap.classList.remove('expanded');
      branchesWrap.querySelectorAll('.tree-branch-col').forEach(function(c){c.classList.remove('visible')});
      branchesWrap.querySelectorAll('.tree-bnode').forEach(function(b){b.classList.remove('active')});
      branchesWrap.querySelectorAll('.tree-sub-wrap').forEach(function(sw){
        sw.classList.remove('expanded');
        sw.querySelectorAll('.tree-sub-col').forEach(function(sc){sc.classList.remove('visible')});
      });
      branchesWrap.querySelectorAll('.tree-leaf-skills').forEach(function(l){l.classList.remove('visible')});
      setTimeout(function(){trunkLine.classList.remove('grown');rootHint.style.display=''},200);
      if(skillCanvas){
        var ctx=skillCanvas.getContext('2d');
        if(ctx) ctx.clearRect(0,0,skillCanvas.width,skillCanvas.height);
      }
    }

    rootNode.addEventListener('click',function(){
      if(rootExpanded) collapseRoot();
      else expandRoot();
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

    renderSummary();
    renderRadar();
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
    if(saved==='dark') document.body.classList.add('dark');
    else if(!saved && window.matchMedia('(prefers-color-scheme: dark)').matches){
      document.body.classList.add('dark');
    }
    btn.addEventListener('click', function(){
      document.body.classList.toggle('dark');
      localStorage.setItem('theme', document.body.classList.contains('dark')?'dark':'light');
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
    initHeroContour();
    initHeroOrbit();
    initHeroParticles();
    initHeroCounter();
    initHeroChars();
    initCursorParticles();
    initRipple();
    initTagSparks();
    initScroll();
    initMobileNav();
    initMasonry();
    initFilter();
    initLightbox();
    initEquipment();
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
