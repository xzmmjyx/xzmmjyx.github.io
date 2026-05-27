(function(){
  'use strict';

  var $ = function(s,r){return(r||document).querySelector(s)};
  var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

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
    var sectionIds = ['hero','academy','equipment','timeline','skills','sbti','sorting-hat','roast'];

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

  var sbtiDimNames = ['外业热情','内业耐心','仪器依赖','数据严谨','团队协作','摸鱼指数','熬夜能力','吐槽功力','理想主义','实用主义','社交能量','抗压能力','技术崇拜','佛系程度','卷王潜质'];

  var sbtiQuestions = [
    {q:'外业实习早上六点集合，你的反应是？',l:'"六点？我通宵还没睡呢……"',m:'"行吧，调五个闹钟"',h:'"好耶！外业最棒了！"'},
    {q:'扛着全站仪爬山坡，你心里想的是？',l:'"这坡是给人爬的吗？我要投诉"',m:'"歇会儿，喝口水再继续"',h:'"冲顶！一览众山小！"'},
    {q:'面对3000个数据的平差计算，你？',l:'Excel一键搞定，误差？什么误差？',m:'分十组慢慢算，每算完一组休息五分钟',h:'手算！每步检核！闭合差必须为零！'},
    {q:'CASS画等高线画到一半软件崩溃了，你？',l:'"毁灭吧，明天再说"',m:'重开，还好有自动保存',h:'淡定，我已经养成了每三秒保存一次的习惯'},
    {q:'到了测区发现全站仪没电了，你？',l:'回宿舍，今天休息',m:'换水准仪先干别的',h:'我有备用电池，你以为我第一天干测绘？'},
    {q:'RTK一直固定不了，你？',l:'"这破机器，砸了算了"',m:'换个地方试试',h:'检查电台频道、天线连接、看星历图'},
    {q:'记录数据时有人跟你说话，你？',l:'边聊边记，回头再看出没出错',m:'先记完，再回话',h:'"别跟我说话！数据错了你负责？"'},
    {q:'发现前天的数据可能记错了，你？',l:'差几毫米而已，没人发现',m:'翻记录本核对一下',h:'立刻重新测！精度就是生命！'},
    {q:'小组分工你更愿意？',l:'"你们干，我负责最后签字"',m:'随便分什么都行',h:'我来统筹全局！'},
    {q:'队友把棱镜高度读错了，你？',l:'"笑死，你行不行啊"',m:'"没事，改过来就好"',h:'"没关系，谁都会犯错，我帮你盯着"'},
    {q:'实习指导老师不在现场，你？',l:'光明正大躺平玩手机',m:'干一会儿歇一会儿',h:'老师不在更要好好干，证明自己'},
    {q:'画图的时候你通常会？',l:'打开视频边看边画',m:'听歌画图，效率还行',h:'关掉一切干扰，专注画图'},
    {q:'明天要交测量报告，你现在？',l:'已经写完了，早睡早起',m:'还差一点，今晚搞定',h:'还没开始？没事，今晚通宵'},
    {q:'凌晨两点你的状态是？',l:'早就睡了，梦里在测高程',m:'还在肝，但脑子已经不动了',h:'精神得很！再来三组数据！'},
    {q:'看到学校又买了新仪器但从来不用，你？',l:'习惯了，反正也用不上',m:'拍个照发朋友圈阴阳一下',h:'写一篇小作文吐槽，从采购流程到教学脱节'},
    {q:'听到"测绘是朝阳产业"这句话，你？',l:'"哦"（内心毫无波澜）',m:'"朝阳？我看是夕阳吧"',h:'哈哈哈哈哈哈哈哈（笑到流泪）'},
    {q:'你当初为什么选测绘？',l:'分低，调剂来的',m:'感觉能到处跑，挺好的',h:'为祖国建设添砖加瓦！'},
    {q:'你觉得测绘的未来是？',l:'能有什么未来，混口饭吃',m:'无人机+AI，应该还行',h:'测绘是万物之基，智慧城市的骨架！'},
    {q:'实习报告你一般？',l:'抄学长的，改个名字',m:'参考几份，自己整合一下',h:'自己实测实写，数据真实可靠'},
    {q:'考试前一天你？',l:'看重点，及格就行',m:'把课本过一遍',h:'所有公式推导三遍，例题全做'},
    {q:'外业休息时你通常？',l:'一个人找个阴凉处待着',m:'和旁边几个人聊聊天',h:'组织大家玩游戏！狼人杀走起！'},
    {q:'在学院里遇到认识但不熟的同学，你？',l:'低头看手机假装没看见',m:'点个头微笑一下',h:'热情打招呼，顺便聊两句'},
    {q:'闭合差超限第三次了，你？',l:'不干了，爱谁谁',m:'深呼吸，再试一次',h:'问题总有解决的办法，冷静分析'},
    {q:'导师把你的论文批得一文不值，你？',l:'躺平，改不动了',m:'改吧，导师说的也有道理',h:'逐条记录意见，连夜修改'},
    {q:'看到新出的测绘无人机，你？',l:'又贵又用不上，关我什么事',m:'关注了几个测评博主了解一下',h:'立刻找资料学！我要第一个用上！'},
    {q:'你更相信？',l:'老法师的经验，仪器是辅助',m:'传统仪器和新技术结合',h:'全自动化！机器比人靠谱！'},
    {q:'评奖评优没评上，你？',l:'"凭什么？我哪里比别人差？"',m:'有点失落，但明年再来',h:'无所谓，评上了也就那样'},
    {q:'实习结束聚餐，你喝酒吗？',l:'滴酒不沾，我喝可乐',m:'喝一点，啤的',h:'白的！今晚不醉不归！'},
    {q:'周末你通常在？',l:'床上躺到中午',m:'图书馆学习半天',h:'早上六点起床，学习一整天'},
    {q:'老师说这个项目可以加分，你？',l:'"加分？加几分？不够就算了"',m:'可以试试，反正也没事',h:'我报名！通宵也要做完！'}
  ];

  var sbtiTemplates = [
    {name:'外业战神',icon:'⛰️',tagline:'你属于野外，仪器是你的武器，山坡是你的战场',desc:'你是天生的外业选手，爬山涉水如履平地。别人还在对中整平，你已经测完三个点了。你的微信步数永远霸榜，你的防晒霜消耗量是全班之最。',dims:[4,1,2,2,3,1,3,2,2,2,3,3,2,1,2]},
    {name:'内业宅神',icon:'💻',tagline:'给我一台电脑和一杯咖啡，我能坐到天荒地老',desc:'你宁愿对着屏幕处理三千个数据，也不愿意去测区晒一分钟太阳。你的CASS操作快如闪电，你的Excel公式写得比情书还长。外业？那是别人的事。',dims:[1,4,2,3,1,2,2,3,1,3,1,2,3,2,2]},
    {name:'仪器毁灭者',icon:'💥',tagline:'全站仪杀手，三脚架终结者',desc:'你摸过的仪器都会坏，你碰过的棱镜都会歪。你不是故意的，但仪器们似乎对你有意见。学校仪器室已经把你的照片贴在了墙上，配文"此人禁止单独借仪器"。',dims:[2,1,0,1,2,3,2,3,1,2,2,1,1,3,1]},
    {name:'数据刺客',icon:'🗡️',tagline:'数据到你手里，活不过一集',desc:'你有一种神奇的能力——再简单的数据到你手里都能出错。闭合差超限是常态，坐标算错是日常。但你总能在最后一刻神奇地改回来，没人知道你是怎么做到的。',dims:[2,2,2,0,2,2,3,2,1,2,2,2,2,2,3]},
    {name:'摸鱼仙人',icon:'🐟',tagline:'摸鱼是一门艺术，而你已经是大师了',desc:'你深谙摸鱼之道，能在老师眼皮底下玩手机而不被发现。你的外业效率不高，但你的摸鱼效率极高。你的人生信条是：能躺着绝不站着，能歇着绝不干着。',dims:[1,1,1,1,1,4,1,3,1,1,2,1,1,4,0]},
    {name:'熬夜冠军',icon:'🌙',tagline:'见过凌晨四点的工大吗？我天天见',desc:'你的生物钟已经彻底紊乱，凌晨三点是你效率最高的时刻。你的测量报告都是通宵赶出来的，你的黑眼圈比全站仪的目标棱镜还圆。白天？白天那是休息时间。',dims:[2,2,2,2,2,2,4,2,2,2,2,2,2,2,3]},
    {name:'吐槽大王',icon:'🎙️',tagline:'给我一个话题，我能吐槽到天亮',desc:'你的嘴比你的全站仪还快，任何话题都能被你吐槽出花来。从学校食堂到仪器设备，从老师教学到实习安排，没有你不敢说的。你的外业记录本背面写满了段子。',dims:[2,2,2,2,2,3,2,4,1,2,3,2,2,2,2]},
    {name:'卷王本卷',icon:'📈',tagline:'卷死别人，或者被别人卷死',desc:'你是那种早上六点起床、晚上十二点还在学习的人。你不仅卷学习，还卷竞赛、卷论文、卷实习。你的存在让全班同学都感到焦虑，但你不在乎——你只想赢。',dims:[3,3,3,3,3,0,4,1,3,3,2,4,3,0,4]},
    {name:'佛系青年',icon:'☮️',tagline:'都可以，没关系，无所谓',desc:'你是全班最淡定的人。闭合差超限？没关系。仪器坏了？无所谓。考试挂科？都可以。你的人生哲学是"一切随缘"，但你随缘得太彻底了，导师都替你着急。',dims:[1,1,1,1,1,3,1,1,1,1,1,1,1,4,0]},
    {name:'社交恐怖分子',icon:'🎉',tagline:'整个测绘学院没有你不认识的人',desc:'你认识学院里的每一个人，包括门卫大爷和食堂阿姨。外业实习对你来说就是大型社交现场，你一边测数据一边跟路过的人打招呼。你的通讯录比测量数据库还大。',dims:[3,1,2,1,4,2,2,3,2,2,4,2,1,1,2]},
    {name:'社恐晚期',icon:'🙈',tagline:'别跟我说话，我社恐',desc:'你最大的恐惧是小组讨论和外业分组。你宁愿一个人扛着仪器去最远的测站，也不愿意跟人合作。你的外业记录本上除了数据，还写着"今天跟三个人说了话，好累"。',dims:[2,3,2,3,0,2,2,2,2,2,0,2,2,3,2]},
    {name:'理想主义炮灰',icon:'🌈',tagline:'测绘改变世界？先改变我的闭合差吧',desc:'你怀揣着"测绘改变世界"的梦想来到工大，然后被现实狠狠教育了。你发现测绘不是星辰大海，而是闭合差超限和仪器故障。但你还在坚持，因为你说过"不忘初心"。',dims:[3,2,2,2,2,1,2,2,4,1,2,2,2,1,2]},
    {name:'实用主义老油条',icon:'🧠',tagline:'别跟我谈理想，谈点实际的',desc:'你是全班最现实的人。选课选分高的，实习选轻松的，考试选重点背的。你的效率很高，但你的热情很低。你的人生信条是：能抄绝不写，能混绝不卷。',dims:[2,2,2,2,2,2,2,2,1,4,2,2,2,2,2]},
    {name:'技术狂人',icon:'🤖',tagline:'给我一个新仪器，我能玩一整天',desc:'你对新技术的热爱超过了测绘本身。无人机、激光扫描、三维建模——只要是新的你都感兴趣。你的电脑里装满了各种测绘软件，但你的基础测量成绩可能还没及格。',dims:[2,2,4,2,1,1,3,1,2,2,1,2,4,1,3]},
    {name:'复古派',icon:'📜',tagline:'老法师的传人，传统测量的守护者',desc:'你坚信传统测量才是正道。什么RTK、无人机，都是花里胡哨。你坚持用水准仪和经纬仪，你觉得手算平差才是真本事。你的外业记录本还是用铅笔写的，因为"电子设备不靠谱"。',dims:[2,2,0,3,2,2,2,2,2,2,2,2,0,3,1]},
    {name:'酒精战士',icon:'🍺',tagline:'酒是测绘人的第二生命',desc:'你是测绘学院的酒神。实习结束聚餐你是主角，班级聚会你是焦点。你的外业背包里除了仪器还有一瓶二锅头，你说这是"防寒用的"。你的测量数据可能不准，但你的酒量绝对准。',dims:[3,1,2,1,3,3,3,3,1,2,3,2,1,2,2]},
    {name:'傻乐者',icon:'😄',tagline:'虽然我什么都不会，但我很快乐',desc:'你是全班最快乐的人。闭合差超限？哈哈真好笑。仪器坏了？嘿嘿真有趣。考试挂科？嘻嘻没关系。你的快乐感染了所有人，虽然你的成绩单不太好看。但你不在乎，因为你快乐啊。',dims:[1,1,1,1,1,3,1,2,1,1,2,1,1,3,1]},
    {name:'仪器保姆',icon:'🔧',tagline:'仪器就是我的命，谁也别想碰',desc:'你对仪器的爱护程度令人发指。每次用完后都要擦三遍，装箱前要检查半小时。你借仪器的时候比借书还麻烦，因为你要签五份保证书。仪器室老师最喜欢你，因为你比他还爱惜设备。',dims:[2,2,3,3,2,1,2,1,2,2,2,2,3,2,2]},
    {name:'报告复印机',icon:'📠',tagline:'给我一份模板，我能复制出一片江山',desc:'你的实习报告永远是最规范的，因为你是照着模板一字不差抄的。你的测量数据永远是最漂亮的，因为你懂得"适当调整"。你的论文查重率永远是最高的，但你不在乎——能过就行。',dims:[1,3,1,3,2,2,2,1,1,3,1,2,1,2,3]},
    {name:'野外生存家',icon:'🏕️',tagline:'给我一把刀和一台全站仪，我能在野外活一个月',desc:'你是那种在测区也能活得很好的人。你带了足够的干粮和水，还有急救包和备用电池。别人在测区受苦，你在测区露营。你的外业装备比专业驴友还齐全。',dims:[4,1,2,2,2,2,3,2,2,2,3,3,1,2,2]},
    {name:'理论大师',icon:'📚',tagline:'纸上谈兵，我是专业的',desc:'你的理论知识极其扎实，所有公式倒背如流，所有原理如数家珍。但一上手实操你就懵了——仪器怎么开来着？你的外业成绩和你的理论成绩形成了鲜明对比。',dims:[1,3,1,3,1,2,3,1,3,1,1,2,2,2,2]},
    {name:'摆烂艺术家',icon:'🛌',tagline:'努力不一定成功，但不努力一定很舒服',desc:'你已经把摆烂提升到了艺术的高度。你的作业永远卡在deadline前最后一分钟交，你的实习报告永远是最短的。但你摆烂摆得理直气壮，甚至摆出了一种独特的美学风格。',dims:[0,0,0,0,0,4,0,3,0,0,0,0,0,4,0]},
    {name:'热心市民',icon:'🤗',tagline:'有困难找我就对了，虽然我也不一定行',desc:'你是全班最热心的人，谁有困难你都帮。虽然你帮的忙最后往往需要别人再帮你一次，但你的心意是好的。你的口头禅是"没事，我来"，然后搞砸了再说"不好意思"。',dims:[3,2,2,2,4,1,2,2,2,2,3,2,2,1,2]},
    {name:'焦虑测量员',icon:'😰',tagline:'每天都在焦虑，但也不知道在焦虑什么',desc:'你是全班最焦虑的人。测数据焦虑，画图焦虑，交报告焦虑，不交报告也焦虑。你的心率比你的测量频率还快，你的手汗比你的记录墨水还多。但你焦虑归焦虑，活儿还是能干完的。',dims:[2,2,2,3,2,2,3,2,2,2,2,0,2,1,3]},
    {name:'快乐测绘狗',icon:'🐶',tagline:'汪汪！今天也是快乐测绘的一天！',desc:'你是全班最乐观的人。不管遇到什么困难，你都能笑着说"没事"。你的快乐感染了全组的人，虽然你的数据经常出错，但大家还是愿意跟你一组——因为开心啊！',dims:[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]}
  ];

  var majorItems = ['计算机科学与技术','人工智能','电子信息工程','电气工程','金融学','法学','建筑学','临床医学','口腔医学','机械工程','自动化','通信工程','信息安全','数据科学','软件工程','土木工程','化学工程','生物医学','航天工程','建筑学（建筑老八校）','测绘工程'];
  var schoolItems = ['清华大学','北京大学','浙江大学','上海交通大学','复旦大学','南京大学','中国科学技术大学','哈尔滨工业大学','西安交通大学','北京航空航天大学','武汉大学','华中科技大学','中山大学','东南大学','同济大学','天津大学','北京理工大学','大连理工大学','东北原神职业技术学院'];
  var majorBadIdx = majorItems.indexOf('测绘工程');
  var schoolBadIdx = schoolItems.indexOf('东北原神职业技术学院');

  function initSBTITest(){
    var btnStart = $('#btn-sbti-start');
    var intro = $('#sbti-intro');
    var quiz = $('#sbti-quiz');
    var result = $('#sbti-result');
    if(!btnStart) return;
    var current = 0;
    var selected = [];
    var selectedIndices = [];
    var answers = [];
    btnStart.addEventListener('click', function(){
      intro.style.display = 'none';
      quiz.style.display = 'block';
      current = 0;
      answers = [];
      var pool = [];
      for(var i=0;i<sbtiQuestions.length;i++) pool.push(i);
      for(var i=pool.length-1;i>0;i--){
        var j=Math.floor(Math.random()*(i+1));
        var tmp=pool[i];pool[i]=pool[j];pool[j]=tmp;
      }
      selectedIndices = pool.slice(0,7);
      selected = selectedIndices.map(function(idx){return sbtiQuestions[idx]});
      renderSBTIQuestion();
    });
    function renderSBTIQuestion(){
      var q = selected[current];
      var bar = $('#sbti-progress-bar');
      var text = $('#sbti-progress-text');
      var qEl = $('#sbti-question');
      var oEl = $('#sbti-options');
      if(bar) bar.style.width = ((current+1)/selected.length*100)+'%';
      if(text) text.textContent = (current+1)+'/'+selected.length;
      if(qEl) qEl.textContent = q.q;
      if(oEl){
        oEl.innerHTML = '';
        var opts = [
          {text:q.l, val:0, label:'L'},
          {text:q.m, val:1, label:'M'},
          {text:q.h, val:2, label:'H'}
        ];
        opts.forEach(function(opt){
          var btn = document.createElement('button');
          btn.className = 'sbti-opt-btn';
          btn.innerHTML = '<span class="sbti-opt-label">'+opt.label+'</span><span class="sbti-opt-text">'+opt.text+'</span>';
          btn.addEventListener('click', function(){
            answers.push({idx:selectedIndices[current], val:opt.val});
            current++;
            if(current < selected.length){
              renderSBTIQuestion();
            }else{
              showSBTIResult();
            }
          });
          oEl.appendChild(btn);
        });
      }
    }
    function showSBTIResult(){
      var drank = false;
      for(var a=0;a<answers.length;a++){
        if(answers[a].idx === 27 && answers[a].val === 2){
          drank = true;
          break;
        }
      }
      if(drank){
        renderResultCard(sbtiTemplates[15]);
        return;
      }
      var r = Math.floor(Math.random() * sbtiTemplates.length);
      renderResultCard(sbtiTemplates[r]);
    }
    function renderResultCard(ty){
      quiz.style.display = 'none';
      result.style.display = 'block';
      result.innerHTML = '<div class="sbti-result-card sbti-result-card-lowfi">' +
        '<div class="sbti-result-stamp">SBTI</div>' +
        '<div class="sbti-result-icon">'+ty.icon+'</div>' +
        '<div class="sbti-result-type">'+ty.name+'</div>' +
        '<div class="sbti-result-tagline">'+ty.tagline+'</div>' +
        '<div class="sbti-result-divider"></div>' +
        '<p class="sbti-result-desc">'+ty.desc+'</p>' +
        '<button class="sbti-restart" id="btn-sbti-restart">↻ 再测一次</button>' +
        '</div>';
      var restartBtn = $('#btn-sbti-restart');
      if(restartBtn) restartBtn.addEventListener('click', function(){
        result.style.display = 'none';
        result.innerHTML = '';
        intro.style.display = 'block';
      });
    }
  }

  function initSortingHat(){
    var stage = $('#hat-stage');
    var machine = $('#hat-slot-machine');
    var resultEl = $('#hat-result');
    var btnMajor = $('#btn-hat-major');
    var btnSchool = $('#btn-hat-school');
    var lights = $$('.hat-light');
    if(!btnMajor || !btnSchool) return;
    btnMajor.addEventListener('click', function(){ startSlot('major') });
    btnSchool.addEventListener('click', function(){ startSlot('school') });

    function flashLights(on){
      for(var i=0;i<lights.length;i++){
        if(on){
          setTimeout(function(n){
            return function(){lights[n].classList.add('active')};
          }(i), i*80);
        }else{
          lights[i].classList.remove('active');
        }
      }
    }

    function startSlot(type){
      var items = type === 'major' ? majorItems : schoolItems;
      var badIdx = type === 'major' ? majorBadIdx : schoolBadIdx;
      var badItem = items[badIdx];
      stage.style.display = 'block';
      resultEl.innerHTML = '';
      resultEl.classList.remove('show');
      machine.innerHTML = '';
      var strip = document.createElement('div');
      strip.className = 'hat-slot-strip';
      machine.appendChild(strip);
      var total = 300;
      var itemW = 200;
      var slots = [];
      for(var i=0;i<total;i++){
        slots.push(items[Math.floor(Math.random()*items.length)]);
      }
      var stopPos = Math.floor(total*0.55) + Math.floor(Math.random()*(total*0.35));
      slots[stopPos] = badItem;
      var extraCount = 3 + Math.floor(Math.random()*4);
      for(var e=0;e<extraCount;e++){
        var p = Math.floor(Math.random()*(stopPos-8));
        slots[p] = badItem;
      }
      var itemsHtml = '';
      for(var i=0;i<total;i++){
        itemsHtml += '<div class="hat-slot-item'+(i<stopPos-5?' blurred':'')+'">'+slots[i]+'</div>';
      }
      strip.innerHTML = itemsHtml;
      var pointerOffset = machine.offsetWidth/2 - itemW/2;
      var targetPos = stopPos*itemW;
      var startOffset = Math.floor(Math.random()*itemW*3)-itemW*1.5;
      strip.style.transition = 'none';
      strip.style.transform = 'translateX('+startOffset+'px)';
      void strip.offsetHeight;
      flashLights(true);
      var duration = 6 + Math.random()*3;
      var phase1 = duration*0.6;
      var phase2 = duration*0.25;
      var phase3 = duration*0.15;
      var totalDist = -(targetPos-pointerOffset) - startOffset;
      var p1Target = startOffset + totalDist*0.85;
      var p2Target = startOffset + totalDist*0.97;
      var p3Target = -(targetPos-pointerOffset);
      setTimeout(function(){
        strip.style.transition = 'transform '+phase1+'s cubic-bezier(.2,.8,.35,1)';
        strip.style.transform = 'translateX('+p1Target+'px)';
      }, 100);
      setTimeout(function(){
        strip.style.transition = 'transform '+phase2+'s cubic-bezier(.4,.85,.5,1)';
        strip.style.transform = 'translateX('+p2Target+'px)';
      }, (phase1+0.1)*1000);
      setTimeout(function(){
        strip.style.transition = 'transform '+phase3+'s cubic-bezier(.6,.9,.75,1)';
        strip.style.transform = 'translateX('+p3Target+'px)';
      }, (phase1+phase2+0.1)*1000);
      var revealTime = (duration+0.3)*1000;
      var blurOffTime = revealTime - 400;
      setTimeout(function(){
        var items = strip.querySelectorAll('.hat-slot-item');
        for(var i=0;i<items.length;i++){
          items[i].classList.remove('blurred');
        }
      }, blurOffTime);
      setTimeout(function(){
        flashLights(false);
        var stopEl = strip.children[stopPos];
        if(stopEl) stopEl.classList.add('bad');
        var others = strip.querySelectorAll('.hat-slot-item:not(.bad)');
        for(var i=0;i<others.length;i++){
          others[i].style.opacity = '0.15';
        }
        resultEl.innerHTML = '<div class="hat-result-card"><div class="hat-result-main">'+badItem+'</div>' +
          '<p class="hat-result-desc">'+(type==='major'?'你的专业是……测绘工程！惊不惊喜？意不意外？命运的齿轮转了一圈又回到了起点。':'你的学校是……东北原神职业技术学院！欢迎来到提瓦特大陆最好的职业技术学院！')+'</p>' +
          '<button class="btn btn-primary hat-again" id="btn-hat-again">再来一次</button></div>';
        resultEl.classList.add('show');
        var againBtn = $('#btn-hat-again');
        if(againBtn) againBtn.addEventListener('click', function(){
          resultEl.classList.remove('show');
          resultEl.innerHTML = '';
          machine.innerHTML = '';
          stage.style.display = 'none';
          flashLights(false);
        });
      }, revealTime);
    }
  }

  function observeReveal(){
    var els = $$('.roast-card:not(.visible),.academy-card:not(.visible),.section-header:not(.visible),.wave-divider:not(.visible),.transition-section:not(.in-view),.equip-card:not(.visible)');
    if(!els.length) return;
    if(!('IntersectionObserver' in window)){
      els.forEach(function(el){
        var cls = el.classList.contains('transition-section') ? 'in-view' : 'visible';
        el.classList.add(cls);
      });
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
        var cls = el.classList.contains('transition-section') || el.classList.contains('transition-hero') ? 'in-view' : 'visible';
        setTimeout(function(){el.classList.add(cls)},i*60);
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
      {icon:'🎒',name:'急救包',brand:'外业必备 · 过期版',cat:'survival',tier:'n',status:'心理安慰',power:5,accuracy:5,endurance:30,weight:50,desc:'碘伏过期两年，创可贴粘性为零，纱布发黄。但老师说必须带，因为"万一出事了，至少有个包可以拍照发朋友圈证明你们有急救措施"。'},
      {icon:'📐',name:'三脚架',brand:'木质老古董 · 咯吱作响',cat:'outdoor',tier:'n',status:'快散架了',power:10,accuracy:15,endurance:20,weight:40,desc:'螺丝拧不紧，腿伸不直，风一吹就晃。每次架仪器都像在玩叠叠乐，运气好能撑一天，运气不好仪器直接倒地上。'},
      {icon:'🖊️',name:'记录手簿',brand:'测绘专用 · 油渍版',cat:'outdoor',tier:'r',status:'文物级',power:5,accuracy:10,endurance:70,weight:90,desc:'上面有三代学长的笔迹，数据潦草到自己都看不懂。翻到最后一页写着："别学测绘，快跑。"'},
      {icon:'📡',name:'经纬仪',brand:'DJ6 · 上古神器',cat:'outdoor',tier:'n',status:'退役待定',power:40,accuracy:35,endurance:30,weight:55,desc:'比全站仪还古老的存在，读数要用游标，角度要手算。老师说用它是为了"打基础"，学生说用它是为了"体验原始人的生活"。'},
      {icon:'🖥️',name:'AutoCAD',brand:'Autodesk · 教育版水印',cat:'office',tier:'sr',status:'图层噩梦',power:65,accuracy:70,endurance:40,weight:15,desc:'画图画到一半发现图层锁了，解锁之后发现所有线都跑到0层了。你以为Ctrl+Z能救你？它只会撤销你最后三小时的成果。'},
      {icon:'🛰️',name:'北斗手持机',brand:'合众思壮 · eTrex',cat:'outdoor',tier:'r',status:'勉强能用',power:35,accuracy:30,endurance:80,weight:85,desc:'精度±3m，搜星搜半天。唯一的优点是掉水里捞出来还能用。在测绘精度面前它就是个玩具，但它不会崩溃也不会蓝屏。'},
      {icon:'🎒',name:'遮阳帽',brand:'工地同款 · 保命神器',cat:'survival',tier:'r',status:'外业标配',power:5,accuracy:0,endurance:60,weight:95,desc:'七月外业没有它你会中暑。戴上它你会变成移动的蘑菇。不帅，但能活。测绘人的审美标准：活着比好看重要。'},
      {icon:'📊',name:'MATLAB',brand:'MathWorks · 学生版',cat:'office',tier:'sr',status:'数据魔法',power:55,accuracy:85,endurance:35,weight:10,desc:'能算平差、能画图、能拟合。唯一的缺点是语法跟你的思维一样混乱。写出来的代码只有它自己能看懂，三个月后你也看不懂。'},
      {icon:'🏕️',name:'暖宝宝',brand:'1688批发 · 100片装',cat:'survival',tier:'n',status:'冬季续命',power:3,accuracy:0,endurance:40,weight:90,desc:'零下20度外业的最后尊严。贴满全身像木乃伊，但至少不会冻僵。唯一的问题是贴太多弯不下腰，仪器对中整平更难了。'},
      {icon:'📱',name:'无人机',brand:'大疆 · Phantom 4 RTK',cat:'outdoor',tier:'ssr',status:'高科技',power:85,accuracy:88,endurance:45,weight:50,desc:'航测神器，飞一圈顶你跑一天。但工大实训基地禁飞，因为旁边是机场。所以它只能在仓库里吃灰，偶尔被拿出来拍个合影。'},
      {icon:'🖊️',name:'计算器',brand:'卡西欧 · fx-5800P',cat:'office',tier:'r',status:'编程噩梦',power:30,accuracy:65,endurance:90,weight:90,desc:'能编程算坐标，但按键小到像蚂蚁。输入一个程序要半小时，按错一个键全部重来。考试不让带手机，所以你只能跟它死磕。'},
      {icon:'📡',name:'激光测距仪',brand:'博世 · GLM 50 C',cat:'outdoor',tier:'r',status:'室内利器',power:50,accuracy:60,endurance:70,weight:85,desc:'室内量距神器，精度±1.5mm。但外业用不了，因为阳光太强看不见激光点。所以它只能在宿舍量量床的尺寸。'},
      {icon:'🖥️',name:'ArcGIS',brand:'Esri · 学术授权',cat:'office',tier:'ssr',status:'空间分析',power:75,accuracy:90,endurance:25,weight:10,desc:'能做空间分析、能建模、能出图。但打开一个工程文件要五分钟，跑一个分析要半小时，导出一个PDF要十分钟。你的时间都花在等它加载上了。'},
      {icon:'🎒',name:'冲锋衣',brand:'北面 · 山寨版',cat:'survival',tier:'r',status:'防风防雨',power:10,accuracy:0,endurance:75,weight:80,desc:'号称防风防雨，实际防不了风也防不了雨。但穿上之后至少心理上觉得自己是专业的。外观跟正版一样，保暖差了十条街。'},
      {icon:'🍪',name:'保温杯',brand:'不锈钢 · 1000ml',cat:'survival',tier:'sr',status:'冬日神器',power:5,accuracy:0,endurance:85,weight:75,desc:'早上灌的热水，下午还是热的。外业测量的最后温暖。没有它你可能会在零下15度的野外冻成冰雕。保温效果比工大暖气强多了。'},
      {icon:'🛰️',name:'电子水准仪',brand:'天宝 · DiNi03',cat:'outdoor',tier:'sr',status:'高精仪器',power:70,accuracy:92,endurance:50,weight:55,desc:'精度0.3mm/km，自动读数。但学校只有两台，排队排到下学期。用它测水准闭合差从来不会超限，因为超限的是你，不是它。'},
      {icon:'📐',name:'棱镜',brand:'单棱镜 · 磨花了',cat:'outdoor',tier:'r',status:'凑合用',power:30,accuracy:40,endurance:50,weight:70,desc:'镜面磨花了导致反射信号弱，全站仪读数时有时无。你得用手擦半天才能测一次。老师说："轻拿轻放。"你已经轻拿轻放了三年，它还是花了。'},
      {icon:'🖥️',name:'Python',brand:'Anaconda · 数据处理',cat:'office',tier:'sr',status:'编程利器',power:60,accuracy:80,endurance:45,weight:15,desc:'能自动处理测绘数据、能批量平差、能出图。但你写的代码有八百个bug，每个bug都让你怀疑自己是不是选错了专业。'},
      {icon:'🏕️',name:'睡袋',brand:'棉质 · 不够保暖',cat:'survival',tier:'r',status:'野外过夜',power:5,accuracy:0,endurance:65,weight:60,desc:'外业太远回不去的时候用。钻进去发现自己还是冷，因为工大的帐篷也漏风。半夜醒来发现旁边有只虫子，你决定不睡了继续算数据。'},
      {icon:'📱',name:'GNSS后处理软件',brand:'HGO · 免费版',cat:'office',tier:'r',status:'数据解算',power:45,accuracy:65,endurance:30,weight:10,desc:'导入观测数据，解算基线，输出坐标。听起来很简单，实际操作的时候你会发现解算永远不通过。改了参数重算，还是不通过。最后发现是天线高量错了。'},
      {icon:'🖊️',name:'钢尺',brand:'50m · 生锈了',cat:'outdoor',tier:'n',status:'原始工具',power:25,accuracy:20,endurance:40,weight:60,desc:'量距的原始工具，精度感人。拉尺子要两个人，一个人拉一个人读数。风一吹尺子就飘，温度一变就热胀冷缩。但老师说这是"基础训练"。'},
      {icon:'📡',name:'陀螺全站仪',brand:'索佳 · SET230R+陀螺',cat:'outdoor',tier:'ssr',status:'定向神器',power:85,accuracy:90,endurance:35,weight:45,desc:'能测方位角，不用后视。但校准要半小时，操作要两个人，读数要三遍。而且学校只有一台，坏了就没了。所以它基本处于"薛定谔的状态"——你不知道它能不能用。'},
      {icon:'🖥️',name:'Visual Studio',brand:'微软 · 社区版',cat:'office',tier:'r',status:'开发环境',power:40,accuracy:50,endurance:30,weight:10,desc:'写平差程序用的。打开要两分钟，编译要一分钟，调试要一小时。最后发现bug在第一行——少了一个分号。'},
      {icon:'🎒',name:'防蛇药',brand:'外业必备 · 心理安慰',cat:'survival',tier:'n',status:'玄学装备',power:3,accuracy:0,endurance:50,weight:95,desc:'涂了之后蛇会不会走不知道，但蚊子肯定不会走。老师说外业要防蛇，你问怎么防，老师说"别踩到它"。这跟没说有什么区别。'},
      {icon:'🍪',name:'自热米饭',brand:'军粮 · 红烧牛肉味',cat:'survival',tier:'r',status:'外业午餐',power:5,accuracy:0,endurance:55,weight:50,desc:'加热15分钟，吃起来像纸板。但总比饿着强。吃完之后你会想念工大食堂的红烧肉，虽然食堂的红烧肉也像纸板。'},
      {icon:'🛰️',name:'倾斜摄影系统',brand:'五镜头 · 学院采购',cat:'outdoor',tier:'ssr',status:'建模神器',power:88,accuracy:85,endurance:25,weight:30,desc:'五个相机同时拍，能建三维模型。但数据量巨大，处理要跑三天三夜。而且学校服务器慢得像蜗牛，你只能用自己的笔记本跑，跑到一半蓝屏了。'},
      {icon:'📐',name:'脚架',brand:'铝合金 · 伸缩腿',cat:'outdoor',tier:'r',status:'基础装备',power:10,accuracy:20,endurance:50,weight:65,desc:'架仪器用的。风大的时候会晃，地软的时候会陷，腿锁不紧的时候会缩。你以为它是稳定的，其实它比你的人生还不稳定。'},
      {icon:'🖥️',name:'Google Earth',brand:'谷歌 · 免费版',cat:'office',tier:'r',status:'参考工具',power:35,accuracy:40,endurance:60,weight:10,desc:'看地形用的。卫星影像分辨率不够，看不清楚。但至少能让你知道要去的地方长什么样。唯一的缺点是它显示的坐标跟你测的差了十万八千里。'},
      {icon:'🏕️',name:'登山鞋',brand:'回力 · 外业限定',cat:'survival',tier:'r',status:'保命装备',power:5,accuracy:0,endurance:70,weight:75,desc:'爬山防滑用的。穿了三年鞋底磨平了，防滑变成了滑冰。但买新的要花钱，所以你选择继续穿。毕竟摔几次就习惯了。'},
      {icon:'📱',name:'测量学教材',brand:'武汉大学出版社 · 第五版',cat:'office',tier:'n',status:'催眠神器',power:10,accuracy:15,endurance:95,weight:40,desc:'看了三遍还是不懂什么是"高斯投影"。公式推导看了十遍还是看不懂。最后你选择不看了，反正考试也考不过。'},
      {icon:'🖊️',name:'铅笔',brand:'中华 · 2B',cat:'outdoor',tier:'n',status:'绘图工具',power:5,accuracy:10,endurance:30,weight:95,desc:'画草图用的。削了一支又一支，画了一张又一张。最后发现你画的图跟鬼画符一样，老师说"重画"。你削铅笔的手都在抖。'},
      {icon:'📡',name:'激光扫描仪',brand:'徕卡 · RTC360',cat:'outdoor',tier:'ssr',status:'点云神器',power:92,accuracy:95,endurance:30,weight:35,desc:'一分钟扫描200万点，精度1mm。但学校没有，你只能在论文里看到它的照片。你做梦都想用它扫描一次，醒来发现你还在用全站仪。'},
      {icon:'🖥️',name:'ENVI',brand:'遥感处理 · 学术版',cat:'office',tier:'sr',status:'影像分析',power:55,accuracy:70,endurance:25,weight:10,desc:'处理遥感影像用的。分类、融合、镶嵌，功能强大。但界面丑得像上个世纪的软件，操作复杂得像在做手术。'},
      {icon:'🎒',name:'急救毯',brand:'锡纸 · 一次性',cat:'survival',tier:'n',status:'紧急保暖',power:3,accuracy:0,endurance:20,weight:95,desc:'紧急情况下裹身上保暖。用过一次，裹上之后像烤鸡。但至少不会冻死。老师说这是"必备物资"，你问什么时候用，老师说"希望永远用不上"。'},
      {icon:'🍪',name:'榨菜',brand:'乌江 · 外业神器',cat:'survival',tier:'r',status:'下饭利器',power:3,accuracy:0,endurance:80,weight:80,desc:'泡面配榨菜，测绘人的米其林。一包榨菜能让一碗泡面升华，两包榨菜能让你忘记你在零下15度的野外。三包榨菜？你会上火。'},
      {icon:'🛰️',name:'水准尺',brand:'铟瓦 · 3m',cat:'outdoor',tier:'r',status:'精密测量',power:40,accuracy:55,endurance:60,weight:55,desc:'水准测量用的尺子。扶尺的人要站得笔直，不能晃。你以为扶尺很简单？站半小时腿就麻了。而且风一吹尺子就歪，你得重新扶。'},
      {icon:'📐',name:'尺垫',brand:'铸铁 · 生锈版',cat:'outdoor',tier:'n',status:'转点工具',power:15,accuracy:25,endurance:40,weight:50,desc:'水准测量转点用的。踩进土里就歪了，导致闭合差超限。你以为是你的问题？是尺垫的问题。但老师说是你的问题，因为你没踩实。'},
      {icon:'🖥️',name:'福昕PDF',brand:'Foxit · 编辑器',cat:'office',tier:'n',status:'格式转换',power:20,accuracy:30,endurance:50,weight:10,desc:'CAD导出PDF用的。你以为导出就完了？格式全乱了。字体变了，图层没了，比例尺错了。你导出十次，十次都不一样。'}
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

    var collapsed = true;
    var COLLAPSED_COUNT = 12;

    function renderCards(list){
      grid.innerHTML = '';
      var showList = collapsed ? list.slice(0, COLLAPSED_COUNT) : list;
      if(countWrap) countWrap.textContent = showList.length + ' / ' + equips.length;
      showList.forEach(function(e,i){
        var realIdx = equips.indexOf(e);
        var card = document.createElement('div');
        card.className = 'equip-card';
        card.setAttribute('data-cat', e.cat);
        card.setAttribute('data-idx', realIdx);
        card.style.transitionDelay = (i * 50) + 'ms';
        var overall = Math.round((e.power+e.accuracy+e.endurance+e.weight)/4);
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
          selectedIdx = realIdx;
          var rightPanel = detail && getComputedStyle(detail.parentElement).display !== 'none';
          if(rightPanel){
            showDetail(e);
          }else{
            showModal(e);
          }
        });
        grid.appendChild(card);
      });
      var existToggle = grid.parentElement.querySelector('.equip-collapse-toggle');
      if(existToggle) existToggle.remove();
      if(list.length > COLLAPSED_COUNT){
        var toggleBtn = document.createElement('button');
        toggleBtn.className = 'equip-collapse-toggle';
        toggleBtn.innerHTML = collapsed
          ? '<span>展开全部 '+list.length+' 件装备 ▾</span>'
          : '<span>收起 ▴</span>';
        toggleBtn.addEventListener('click',function(){
          collapsed = !collapsed;
          renderCards(getFiltered());
        });
        grid.parentElement.appendChild(toggleBtn);
      }
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
    var grid = $('#roast-grid');
    if(!grid) return;

    var roasts = [
      {avatar:'测绘苦力A',cat:'school',text:'东北原神职业技术学院，名字带"工程"俩字，结果教学楼电梯坏了半年没人修，这工程水平测绘闭合差怕是也得超。',time:'3天前'},
      {avatar:'外业冤种B',cat:'school',text:'说好的"工程技术"大学，测绘仪器比我还老，全站仪型号不详，RTK搜星搜到怀疑人生，实训基地荒得像二战遗址。',time:'5天前'},
      {avatar:'闭合差战士C',cat:'school',text:'工大最厉害的不是教学，是宣传。官网拍的跟清华似的，到了现场一看——这破地方我高考多考50分都嫌亏。',time:'1周前'},
      {avatar:'退学预备生D',cat:'school',text:'招生简章写"坐落于渤海之滨"，到了才发现是"坐落于辽宁阜新风沙之滨"。海呢？在哪呢？沙子倒是不少。',time:'10天前'},
      {avatar:'匿名矿工E',cat:'life',text:'工大食堂能把西红柿炒蛋做出水泥的味道，宿舍冬天暖气跟没开似的，夏天又热得跟蒸笼一样。一年四季都在受苦。',time:'2周前'},
      {avatar:'考研逃兵F',cat:'school',text:'东北原神职业技术学院，一个让你在大一就坚定考研决心的地方。不是因为学术氛围好，是因为你只想赶紧跑。',time:'3周前'},
      {avatar:'受害者G',cat:'study',text:'考完测量学出来，感觉自己不是在考试，是在参加智商鉴定。那些公式我背了三遍，考场上一个都想不起来。',time:'1天前'},
      {avatar:'仪器杀手H',cat:'school',text:'全站仪摔了之后导师看我的眼神，就像在看一个刚把传家宝砸了的败家子。问题是那仪器比我家房子还贵。',time:'4天前'},
      {avatar:'外业冻尸I',cat:'life',text:'零下20度跑外业，手冻得握不住笔，记录簿上的字像鬼画符。导师看了之后说："你这是在记录数据还是在画符驱鬼？"',time:'6天前'},
      {avatar:'毕不了业J',cat:'study',text:'导师让我改论文，改了八遍。第一遍说"方向不对"，第二遍说"方法不对"，第三遍说"结论不对"。我问到底哪里对？他说"你的名字对"。',time:'1周前'},
      {avatar:'食堂卧底K',cat:'life',text:'工大食堂的红烧肉，你永远不知道你吃到的是猪肉还是橡皮。有一次我嚼了五分钟没嚼烂，后来发现是块姜。',time:'8天前'},
      {avatar:'宿舍难民L',cat:'life',text:'工大宿舍的WiFi信号，跟我的前途一样——名义上是有的，实际上你根本感受不到。打个游戏卡到飞起，看个视频转圈到天亮。',time:'10天前'},
      {avatar:'转行预备M',cat:'study',text:'学了两年测绘，我发现我唯一学会的技能就是"在各种恶劣环境下站着不动"。这技能去当保安可能比当测量员更有用。',time:'2周前'},
      {avatar:'挂科战神N',cat:'study',text:'平差考了58分，我去找老师要那2分。老师说："你那2分在哪？"我说："在闭合差里。"老师说："闭合差超限了，不给。"',time:'3周前'},
      {avatar:'实习血泪O',cat:'school',text:'实习单位问我有什么技能，我说我会扛仪器、会跑外业、会在零下20度的户外坚持8小时。他说："我们要的是程序员。"',time:'5天前'},
      {avatar:'内业幽灵P',cat:'study',text:'CAD画图画到凌晨四点，突然蓝屏。我愣了十秒，然后默默打开了考研报名网站。测绘再见，计算机你好。',time:'2天前'},
      {avatar:'恋爱绝缘Q',cat:'life',text:'测绘专业最大的优势就是——你根本没时间谈恋爱。早上6点跑外业，晚上10点画图纸，周末还要算数据。你问女朋友在哪？在你梦里。',time:'1周前'},
      {avatar:'校招弃子R',cat:'school',text:'校招会上，测绘企业的展位冷清得像殡仪馆。计算机的展位排到门外，测绘的展位连HR都在打瞌睡。',time:'9天前'},
      {avatar:'抑郁边缘S',cat:'life',text:'工大的心理咨询中心永远满员，因为测绘专业的学生占了一半。咨询师问你为什么抑郁，你说"闭合差又超了"，咨询师说"我也是测绘转行的，我理解你"。',time:'4天前'},
      {avatar:'暴躁学姐T',cat:'study',text:'学弟问我测绘难不难，我说不难，就是每天都在怀疑人生。他说有那么夸张吗？我说你先去零下15度的山上扛一天仪器再来说话。',time:'6天前'},
      {avatar:'导师噩梦U',cat:'study',text:'导师半夜三点给我发消息："数据呢？"我回："在处理。"导师："明天早上之前必须交。"我看了看时间，决定先睡一觉，因为反正也做不完。',time:'3天前'},
      {avatar:'食堂美食家V',cat:'life',text:'工大食堂的阿姨打菜，手抖得比RTK搜星还厉害。你点一份红烧肉，她抖一抖就变成了三块。你问能不能多给点，她说"够了够了"。',time:'1周前'},
      {avatar:'逃课惯犯W',cat:'study',text:'测量学老师点名，发现来了一半人。问另一半呢？答曰："在宿舍算数据。"老师说："算什么数据？"答曰："算这门课还能不能过。"',time:'5天前'},
      {avatar:'社交废人X',cat:'life',text:'大学四年，我最大的社交圈就是测量小组的四个人。毕业后他们一个考公、一个转行、一个读研、一个失业。测绘人的友情，比闭合差还不稳定。',time:'2周前'},
      {avatar:'真相帝Y',cat:'school',text:'工大的校训是"诚朴求是 博学笃行"。翻译过来就是：诚实地承认自己是废物，朴实地下不了台，求是求不过别人，博学什么都没学到，笃行到最后只想跑。',time:'4天前'},
      {avatar:'宿管天敌Z',cat:'life',text:'宿管阿姨查寝，发现我的宿舍跟外业现场一样——仪器摊一地，数据散一桌，人趴在桌上睡着了。阿姨说："你们这是在搞科研还是在搞破坏？"',time:'8天前'},
      {avatar:'相亲失败A2',cat:'life',text:'相亲对象问我什么专业，我说测绘。她问测绘是什么，我说就是量地的。她说："哦，那不就是种地的？"我说："差不多，只不过我们用仪器量，你们用脚踩。"',time:'3天前'},
      {avatar:'GPA战士B2',cat:'study',text:'绩点3.5，在测绘专业算学霸。在计算机专业？算学渣。在金融专业？人家压根不看你绩点，看的是你爹是谁。',time:'1周前'},
      {avatar:'食堂哲学家C2',cat:'life',text:'工大食堂的菜价涨了，质量没涨。这说明什么？说明通货膨胀是真实的，而菜品升级是虚假的。经济学第一课，食堂教的。',time:'5天前'},
      {avatar:'仪器维修D2',cat:'school',text:'全站仪坏了，报修要走流程。流程走了一个月，仪器修了两个月，修好之后发现实习已经结束了。这效率，测绘行业不衰落才怪。',time:'10天前'},
      {avatar:'深夜崩溃E2',cat:'study',text:'凌晨两点还在算平差，算了三遍结果都不一样。我开始怀疑数学是不是假的。室友路过说："你这是在算命还是在算数据？"',time:'2天前'},
      {avatar:'人生导师F2',cat:'school',text:'学长说测绘专业就业前景好。我信了。毕业后发现"前景好"的意思是——前景好，就是你得往远处看才能看到好，近处全是坑。',time:'1周前'},
      {avatar:'校园流浪G2',cat:'life',text:'工大的野猫比学生过得好。猫有专人喂食，有暖气蹭，不用考试不用实习。我连猫都不如——猫至少不用交学费。',time:'6天前'},
      {avatar:'终极吐槽H2',cat:'school',text:'如果你问我工大测绘专业怎么样，我会告诉你：来之前我以为我是来学技术的，来之后我发现我是来渡劫的。四年下来，技术没学到多少，抗压能力倒是拉满了。',time:'刚刚'}
    ];

    var currentCat = 'all';

    function renderRoasts(){
      grid.innerHTML = '';
      var list = currentCat === 'all' ? roasts : roasts.filter(function(r){return r.cat === currentCat});
      list.forEach(function(r, i){
        var card = document.createElement('div');
        card.className = 'roast-card';
        card.style.transitionDelay = (i * 60) + 'ms';
        card.innerHTML =
          '<div class="roast-card-head">' +
            '<div class="roast-avatar">'+r.avatar+'</div>' +
            '<span class="roast-time">'+r.time+'</span>' +
          '</div>' +
          '<p>'+r.text+'</p>';
        grid.appendChild(card);
      });
      observeRoastCards();
    }

    function observeRoastCards(){
      var cards = grid.querySelectorAll('.roast-card:not(.visible)');
      if(!cards.length) return;
      if(!('IntersectionObserver' in window)){
        cards.forEach(function(c){c.classList.add('visible')});
        return;
      }
      var obs = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },{threshold:.08});
      cards.forEach(function(c){obs.observe(c)});
    }

    var filterBtns = $$('.roast-filter-btn');
    filterBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        filterBtns.forEach(function(b){b.classList.remove('active')});
        btn.classList.add('active');
        currentCat = btn.getAttribute('data-roast');
        renderRoasts();
      });
    });

    renderRoasts();

    var prankBtn = $('#btn-roast-prank');
    var modalOverlay = $('#roast-modal-overlay');
    var modalClose = $('#roast-modal-close');
    var step1 = $('#roast-step-1');
    var step2 = $('#roast-step-2');
    var next1 = $('#roast-next-1');
    var back2 = $('#roast-back-2');
    var submitReal = $('#roast-submit-real');

    if(prankBtn && modalOverlay){
      prankBtn.addEventListener('click', function(){
        modalOverlay.classList.add('open');
        step1.style.display = '';
        step2.style.display = 'none';
      });
    }
    if(modalClose && modalOverlay){
      modalClose.addEventListener('click', function(){
        modalOverlay.classList.remove('open');
      });
      modalOverlay.addEventListener('click', function(e){
        if(e.target === modalOverlay) modalOverlay.classList.remove('open');
      });
    }
    if(next1 && step1 && step2){
      next1.addEventListener('click', function(){
        var name = $('#roast-name');
        var sid = $('#roast-student-id');
        var idcard = $('#roast-id-card');
        if(!name.value.trim() || !sid.value.trim() || !idcard.value.trim()){
          alert('请完整填写所有必填项，信息不完整无法提交！');
          return;
        }
        step1.style.display = 'none';
        step2.style.display = '';
      });
    }
    if(back2 && step1 && step2){
      back2.addEventListener('click', function(){
        step2.style.display = 'none';
        step1.style.display = '';
      });
    }
    if(submitReal && modalOverlay){
      submitReal.addEventListener('click', function(){
        var major = $('#roast-major');
        var grade = $('#roast-grade');
        var cls = $('#roast-class');
        var dorm = $('#roast-dorm');
        var advisorName = $('#roast-advisor-name');
        var advisorPhone = $('#roast-advisor-phone');
        if(!major.value.trim() || !grade.value || !cls.value.trim() || !dorm.value.trim() || !advisorName.value.trim() || !advisorPhone.value.trim()){
          alert('请完整填写所有必填项，信息不完整无法提交！');
          return;
        }
        modalOverlay.classList.remove('open');
        setTimeout(function(){
          var overlay = document.createElement('div');
          overlay.className = 'roast-result-overlay';
          overlay.innerHTML =
            '<div class="roast-result-modal">' +
              '<div class="roast-result-icon">⚠️</div>' +
              '<h3 class="roast-result-title">审核不通过</h3>' +
              '<p class="roast-result-text">您的吐槽申请经校方审核 <strong>未通过</strong>。</p>' +
              '<p class="roast-result-text roast-result-highlight">信息已记录在案。</p>' +
              '<p class="roast-result-text">请于 <strong>3个工作日内</strong> 到 <strong>会和楼311</strong> 办理退学手续。</p>' +
              '<p class="roast-result-text">稍后辅导员将打电话联系您，请保持电话畅通。</p>' +
              '<div class="roast-result-footer">东北原神职业技术学院 · 学生管理处 · 宣</div>' +
              '<button class="btn btn-roast-result-close" id="roast-result-close">我知道了</button>' +
            '</div>';
          document.body.appendChild(overlay);
          setTimeout(function(){overlay.classList.add('open')},50);
          var closeBtn = overlay.querySelector('#roast-result-close');
          if(closeBtn){
            closeBtn.addEventListener('click',function(){
              overlay.classList.remove('open');
              setTimeout(function(){overlay.remove()},400);
            });
          }
          overlay.addEventListener('click',function(e){
            if(e.target === overlay){
              overlay.classList.remove('open');
              setTimeout(function(){overlay.remove()},400);
            }
          });
        },300);
      });
    }
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
    initEquipment();
    initSkillTree();
    initHellScroller();
    initRoast();
    initSBTITest();
    initSortingHat();
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
