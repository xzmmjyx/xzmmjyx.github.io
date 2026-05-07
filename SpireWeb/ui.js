(function() {
  'use strict';

  var G = window.SpireGame;
  var state = null;
  var $root;
  var rewardState = null;
  var eventState = null;
  var shopState = null;

  var drag = { active: false, cardEl: null, cardIdx: -1, startX: 0, startY: 0, offsetX: 0, offsetY: 0, clone: null };

  function init() {
    $root = document.getElementById('game');
    state = G.createInitialState();
    render();
  }

  function render() {
    if (!$root) return;
    switch (state.screen) {
      case 'title': renderTitle(); break;
      case 'playing': renderGame(); break;
    }
  }

  function renderTitle() {
    $root.innerHTML =
      '<div class="title-screen">' +
        '<div class="title-bg-particles" id="title-particles"></div>' +
        '<div class="title-content">' +
          '<div class="title-emblem">&#9876;</div>' +
          '<h1 class="title-text">工大尖塔</h1>' +
          '<p class="title-sub">SLAY THE LNTU · 网页版</p>' +
          '<div class="title-version">v2.0 · 单人Roguelike卡牌</div>' +
          '<button class="btn-start" id="btn-start">' +
            '<span class="btn-start-icon">&#9654;</span>' +
            '<span>开始游戏</span>' +
          '</button>' +
          '<div class="title-hint">拖动卡牌到敌人身上打出 · 点击卡牌快速使用</div>' +
        '</div>' +
      '</div>';
    document.getElementById('btn-start').addEventListener('click', function() {
      state.screen = 'playing';
      render();
    });
    initTitleParticles();
  }

  function initTitleParticles() {
    var c = document.getElementById('title-particles');
    if (!c) return;
    for (var i = 0; i < 40; i++) {
      var p = document.createElement('div');
      p.className = 'tparticle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = (Math.random() * 8) + 's';
      p.style.animationDuration = (4 + Math.random() * 6) + 's';
      p.style.opacity = 0.1 + Math.random() * 0.3;
      p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
      c.appendChild(p);
    }
  }

  function renderGame() {
    $root.innerHTML =
      '<div class="game-container">' +
        '<div class="top-bar">' +
          '<div class="top-left">' +
            '<div class="hp-bar-wrap">' +
              '<div class="hp-bar-icon">&#10084;</div>' +
              '<div class="hp-bar-outer">' +
                '<div class="hp-bar-inner" style="width:' + Math.max(0, state.player.hp / state.player.maxHp * 100) + '%"></div>' +
                '<span class="hp-text">' + state.player.hp + ' / ' + state.player.maxHp + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="player-stats">' +
              '<span class="stat-gold"><span class="gold-icon">&#9733;</span>' + state.player.gold + '</span>' +
              '<span class="stat-floor">&#9650;' + (state.currentFloor + 1) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="top-center">' +
            '<button class="btn-deck" id="btn-deck"><span class="deck-icon">&#9827;</span> 牌组<span class="deck-count">' + state.deck.length + '</span></button>' +
            '<button class="btn-discard" id="btn-discard"><span class="deck-icon">&#9828;</span> 弃牌<span class="deck-count">' + state.discard.length + '</span></button>' +
          '</div>' +
          '<div class="top-right">' +
            renderRelicBar() +
            '<button class="btn-map-toggle" id="btn-map-toggle">&#9776;</button>' +
          '</div>' +
        '</div>' +
        '<div class="game-main" id="game-main"></div>' +
      '</div>';

    document.getElementById('btn-deck').addEventListener('click', function() { showDeckView('deck'); });
    document.getElementById('btn-discard').addEventListener('click', function() { showDeckView('discard'); });
    document.getElementById('btn-map-toggle').addEventListener('click', function() {
      if (state.phase === 'combat') return;
      state.phase = 'map';
      render();
    });

    var main = document.getElementById('game-main');
    switch (state.phase) {
      case 'map': renderMap(main); break;
      case 'combat': renderCombat(main); break;
      case 'victory': renderVictory(main); break;
      case 'defeat': renderDefeat(main); break;
      case 'rest': renderRest(main); break;
      case 'event': renderEvent(main); break;
      case 'shop': renderShop(main); break;
    }
  }

  function renderRelicBar() {
    if (!state.relics || state.relics.length === 0) return '';
    var h = '<div class="relic-bar">';
    for (var i = 0; i < state.relics.length; i++) {
      var r = state.relics[i];
      h += '<div class="relic-icon" title="' + r.name + ': ' + r.desc + '">' + getRelicEmoji(r.id) + '</div>';
    }
    h += '</div>';
    return h;
  }

  function getRelicEmoji(id) {
    var map = {
      burning_blood: '&#128293;', vajra: '&#128170;', anchor: '&#9875;',
      bag_of_preparation: '&#127890;', oddly_smooth_stone: '&#128142;',
      blood_vial: '&#129516;', lantern: '&#128161;', horn_cleat: '&#127927;',
      ornamental_fan: '&#127880;', pen_nib: '&#9998;', eternal_feather: '&#129718;',
      meat_on_the_bone: '&#127830;', kunai: '&#128481;', shuriken: '&#128302;'
    };
    return map[id] || '&#9733;';
  }

  // ---- MAP ----
  function renderMap(container) {
    var map = state.map;
    var floors = map.length;
    var h = '<div class="map-screen"><h2 class="map-title">&#9650; 尖塔地图 &#9650;</h2><div class="map-scroll"><div class="map-grid">';
    for (var f = floors - 1; f >= 0; f--) {
      h += '<div class="map-floor">';
      h += '<span class="floor-label">' + (f === floors - 1 ? 'BOSS' : (f === 7 ? '&#9764;' : (f + 1))) + '</span>';
      for (var n = 0; n < map[f].length; n++) {
        var node = map[f][n];
        var cls = 'map-node map-node-' + node.type;
        if (node.visited) cls += ' visited';
        if (node.locked) cls += ' locked';
        h += '<button class="' + cls + '" data-floor="' + f + '" data-node="' + n + '" ' + (node.locked ? 'disabled' : '') + '>' +
          '<span class="node-icon">' + getNodeIcon(node.type) + '</span>' +
          '<span class="node-type-label">' + getNodeTypeLabel(node.type) + '</span></button>';
      }
      h += '</div>';
    }
    h += '</div></div></div>';
    container.innerHTML = h;
    var nodes = container.querySelectorAll('.map-node:not(.locked)');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].addEventListener('click', function() {
        onMapNodeClick(parseInt(this.dataset.floor), parseInt(this.dataset.node));
      });
    }
  }

  function getNodeIcon(type) {
    var icons = { battle: '&#9876;', elite: '&#9760;', boss: '&#9764;', rest: '&#9752;', event: '?', shop: '&#9830;' };
    return icons[type] || '&#8226;';
  }

  function getNodeTypeLabel(type) {
    var labels = { battle: '战斗', elite: '精英', boss: 'BOSS', rest: '篝火', event: '未知', shop: '商店' };
    return labels[type] || '';
  }

  function onMapNodeClick(f, n) {
    if (!G.navigateToNode(state, f, n)) return;
    var node = state.map[f][n];
    switch (node.type) {
      case 'battle':
        var ids = G.getEnemyList('battle');
        G.startCombat(state, ids);
        break;
      case 'elite':
        var ids = G.getEnemyList('elite');
        G.startCombat(state, ids);
        break;
      case 'boss':
        var ids = G.getEnemyList('boss');
        G.startCombat(state, ids);
        break;
      case 'rest':
        state.phase = 'rest';
        break;
      case 'event':
        state.phase = 'event';
        eventState = G.EventsDB[Math.floor(Math.random() * G.EventsDB.length)];
        break;
      case 'shop':
        state.phase = 'shop';
        shopState = { cards: [] };
        var pool = G.shuffleArray(G.ShopCards.slice());
        for (var i = 0; i < 5; i++) {
          shopState.cards.push({ id: pool[i], price: 45 + Math.floor(Math.random() * 85) });
        }
        break;
    }
    render();
  }

  // ---- COMBAT ----
  function renderCombat(container) {
    var enemies = state.enemies;
    var h = '<div class="combat-screen" id="combat-screen">';

    h += '<div class="enemy-area">';
    for (var i = 0; i < enemies.length; i++) {
      var e = enemies[i];
      var isTarget = (i === state.targetEnemy);
      h += '<div class="enemy-wrap' + (isTarget ? ' enemy-target' : '') + (e.hp <= 0 ? ' enemy-dead' : '') + '" data-enemy-idx="' + i + '" id="enemy-' + i + '">';
      h += '<div class="enemy-intent-badge">' + getIntentIcon(e.intent, e) + '</div>';
      h += '<div class="enemy-sprite" id="enemy-sprite-' + i + '">' + getEnemySprite(e.id) + '</div>';
      if (e.block > 0) {
        h += '<div class="enemy-block-badge">&#9643; ' + e.block + '</div>';
      }
      h += '<div class="enemy-hp-bar">';
      h += '<div class="enemy-hp-fill" style="width:' + Math.max(0, e.hp / e.maxHp * 100) + '%"></div>';
      h += '<span class="enemy-hp-text">' + Math.max(0, e.hp) + '/' + e.maxHp + '</span>';
      h += '</div>';
      h += '<div class="enemy-name-tag">' + e.name + '</div>';
      h += '<div class="enemy-buffs">';
      if (e.strength > 0) h += '<span class="ebuff str">&#9876;' + e.strength + '</span>';
      if (e.vulnerable > 0) h += '<span class="ebuff vuln">&#9888;' + e.vulnerable + '</span>';
      if (e.weak > 0) h += '<span class="ebuff weak">&#10006;' + e.weak + '</span>';
      h += '</div>';
      h += '</div>';
    }
    h += '</div>';

    h += '<div class="mid-area">';
    h += '<div class="player-info-bar">';
    h += '<div class="energy-orb"><span class="energy-val">' + state.player.energy + '</span><span class="energy-max">/' + state.player.maxEnergy + '</span></div>';
    if (state.player.block > 0) {
      h += '<div class="player-block-badge">&#9643; ' + state.player.block + '</div>';
    }
    h += '<div class="player-buffs">';
    if (state.player.strength > 0) h += '<span class="pbuff str">&#9876;' + state.player.strength + '</span>';
    if (state.player.dexterity > 0) h += '<span class="pbuff dex">&#128008;' + state.player.dexterity + '</span>';
    if (state.player.vulnerable > 0) h += '<span class="pbuff vuln">&#9888;' + state.player.vulnerable + '</span>';
    if (state.player.weak > 0) h += '<span class="pbuff weak">&#10006;' + state.player.weak + '</span>';
    if (state.player.regen > 0) h += '<span class="pbuff regen">&#127807;' + state.player.regen + '</span>';
    h += '</div>';

    h += '<div class="potion-bar">';
    for (var i = 0; i < 3; i++) {
      if (state.player.potions[i]) {
        var p = state.player.potions[i];
        h += '<div class="potion-slot filled" data-potion="' + i + '" title="' + p.name + ': ' + p.desc + '">' + getPotionIcon(p.id) + '</div>';
      } else {
        h += '<div class="potion-slot empty"></div>';
      }
    }
    h += '</div>';
    h += '</div>';
    h += '<button class="btn-end-turn" id="btn-end-turn">结束回合</button>';
    h += '</div>';

    h += '<div class="hand-area" id="hand-area">';
    for (var i = 0; i < state.hand.length; i++) {
      var card = state.hand[i];
      var canPlay = card.cost >= 0 && card.cost <= state.player.energy;
      var typeClass = 'card-' + card.type;
      h += '<div class="hand-card ' + typeClass + (canPlay ? '' : ' card-disabled') + '" data-index="' + i + '">';
      h += '<div class="card-glow"></div>';
      h += '<div class="card-frame">';
      h += '<div class="card-cost-orb">' + (card.cost < 0 ? 'X' : card.cost) + '</div>';
      h += '<div class="card-art">' + getCardArt(card.id) + '</div>';
      h += '<div class="card-title-bar">' + card.name + '</div>';
      h += '<div class="card-desc-box">' + card.desc.replace(/\n/g, '<br>') + '</div>';
      h += '<div class="card-type-bar">' + getTypeLabel(card.type) + '</div>';
      h += '</div>';
      h += '</div>';
    }
    h += '</div>';

    h += '<div class="drop-zone" id="drop-zone"><div class="drop-zone-text">拖到此处或敌人身上打出</div></div>';

    h += '</div>';
    container.innerHTML = h;

    initDragDrop();

    var handCards = container.querySelectorAll('.hand-card:not(.card-disabled)');
    for (var i = 0; i < handCards.length; i++) {
      handCards[i].addEventListener('click', function(e) {
        if (drag.active) return;
        var idx = parseInt(this.dataset.index);
        var card = state.hand[idx];
        if (!card || card.cost < 0 || card.cost > state.player.energy) return;
        var needsTarget = (card.type === 'attack' || card.id === 'disarm' || card.id === 'thunderclap');
        if (needsTarget && state.enemies.length > 1) {
          var target = state.targetEnemy;
          G.playCard(state, idx, target);
        } else {
          G.playCard(state, idx, 0);
        }
        spawnDamageNumbers();
        render();
      });
      handCards[i].addEventListener('contextmenu', function(e) { e.preventDefault(); });
    }

    var enemyWraps = container.querySelectorAll('.enemy-wrap:not(.enemy-dead)');
    for (var i = 0; i < enemyWraps.length; i++) {
      enemyWraps[i].addEventListener('click', function() {
        state.targetEnemy = parseInt(this.dataset.enemyIdx);
        render();
      });
    }

    var endBtn = document.getElementById('btn-end-turn');
    if (endBtn) {
      endBtn.addEventListener('click', function() {
        G.endTurn(state);
        spawnDamageNumbers();
        render();
      });
    }

    var potions = container.querySelectorAll('.potion-slot.filled');
    for (var i = 0; i < potions.length; i++) {
      potions[i].addEventListener('click', function() {
        var idx = parseInt(this.dataset.potion);
        var p = state.player.potions[idx];
        if (p) {
          p.effect(state);
          state.player.potions.splice(idx, 1);
          render();
        }
      });
    }
  }

  // ---- DRAG & DROP ----
  function initDragDrop() {
    var cards = document.querySelectorAll('.hand-card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('mousedown', onDragStart);
      cards[i].addEventListener('touchstart', onDragStart, { passive: false });
    }
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);
  }

  function onDragStart(e) {
    if (e.button && e.button !== 0) return;
    var cardEl = e.currentTarget;
    var idx = parseInt(cardEl.dataset.index);
    var card = state.hand[idx];
    if (!card || card.cost < 0 || card.cost > state.player.energy) return;

    e.preventDefault();
    var pos = getEventPos(e);
    var rect = cardEl.getBoundingClientRect();

    drag.active = true;
    drag.cardEl = cardEl;
    drag.cardIdx = idx;
    drag.startX = pos.x;
    drag.startY = pos.y;
    drag.offsetX = pos.x - rect.left - rect.width / 2;
    drag.offsetY = pos.y - rect.top - rect.height / 2;

    drag.clone = cardEl.cloneNode(true);
    drag.clone.classList.add('card-drag-clone');
    drag.clone.style.width = rect.width + 'px';
    drag.clone.style.height = rect.height + 'px';
    document.body.appendChild(drag.clone);

    moveDragClone(pos.x, pos.y);
    cardEl.style.opacity = '0.2';
    document.getElementById('drop-zone').classList.add('visible');
  }

  function onDragMove(e) {
    if (!drag.active) return;
    e.preventDefault();
    var pos = getEventPos(e);
    moveDragClone(pos.x, pos.y);

    var dz = document.getElementById('drop-zone');
    var dzRect = dz.getBoundingClientRect();
    var overDropZone = pos.x >= dzRect.left && pos.x <= dzRect.right && pos.y >= dzRect.top && pos.y <= dzRect.bottom;

    var overEnemy = false;
    var enemies = document.querySelectorAll('.enemy-wrap:not(.enemy-dead)');
    for (var i = 0; i < enemies.length; i++) {
      var er = enemies[i].getBoundingClientRect();
      if (pos.x >= er.left && pos.x <= er.right && pos.y >= er.top && pos.y <= er.bottom) {
        overEnemy = true;
        enemies[i].classList.add('enemy-hover-target');
      } else {
        enemies[i].classList.remove('enemy-hover-target');
      }
    }

    dz.classList.toggle('highlight', overDropZone);
  }

  function onDragEnd(e) {
    if (!drag.active) return;
    var pos = getEventPos(e);

    var dropZone = document.getElementById('drop-zone');
    var dzRect = dropZone.getBoundingClientRect();
    var overDropZone = pos.x >= dzRect.left && pos.x <= dzRect.right && pos.y >= dzRect.top && pos.y <= dzRect.bottom;

    var overEnemyIdx = -1;
    var enemies = document.querySelectorAll('.enemy-wrap:not(.enemy-dead)');
    for (var i = 0; i < enemies.length; i++) {
      var er = enemies[i].getBoundingClientRect();
      if (pos.x >= er.left && pos.x <= er.right && pos.y >= er.top && pos.y <= er.bottom) {
        overEnemyIdx = parseInt(enemies[i].dataset.enemyIdx);
        break;
      }
    }

    var played = false;
    if (overDropZone || overEnemyIdx >= 0) {
      var idx = drag.cardIdx;
      var card = state.hand[idx];
      if (card && card.cost >= 0 && card.cost <= state.player.energy) {
        var target = overEnemyIdx >= 0 ? overEnemyIdx : state.targetEnemy;
        played = G.playCard(state, idx, target);
      }
    }

    cleanupDrag();
    if (played) {
      spawnDamageNumbers();
    }
    render();
  }

  function cleanupDrag() {
    if (drag.clone && drag.clone.parentNode) drag.clone.parentNode.removeChild(drag.clone);
    if (drag.cardEl) drag.cardEl.style.opacity = '';
    drag.active = false;
    drag.cardEl = null;
    drag.cardIdx = -1;
    drag.clone = null;
    var dz = document.getElementById('drop-zone');
    if (dz) {
      dz.classList.remove('visible', 'highlight');
    }
    var hovers = document.querySelectorAll('.enemy-hover-target');
    for (var i = 0; i < hovers.length; i++) hovers[i].classList.remove('enemy-hover-target');
  }

  function moveDragClone(x, y) {
    if (!drag.clone) return;
    drag.clone.style.left = (x - drag.clone.offsetWidth / 2) + 'px';
    drag.clone.style.top = (y - drag.clone.offsetHeight / 2) + 'px';
  }

  function getEventPos(e) {
    if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    if (e.changedTouches && e.changedTouches.length) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  // ---- DAMAGE NUMBERS ----
  function spawnDamageNumbers() {
    var cbs = state.combatCallbacks;
    if (!cbs) return;
    for (var i = 0; i < cbs.length; i++) {
      var cb = cbs[i];
      if (cb.type === 'damage_enemy') {
        var el = document.getElementById('enemy-' + cb.enemyIdx);
        if (el && cb.amount > 0) spawnFloat(el, '-' + cb.amount, 'dmg-red');
        if (el && cb.blocked > 0) spawnFloat(el, '挡' + cb.blocked, 'dmg-blue');
      }
      if (cb.type === 'damage_player') {
        var el = document.querySelector('.hp-bar-outer');
        if (el && cb.amount > 0) spawnFloat(el, '-' + cb.amount, 'dmg-red');
      }
      if (cb.type === 'gain_block') {
        var el = document.querySelector('.energy-orb');
        if (el && cb.amount > 0) spawnFloat(el, '+' + cb.amount + '挡', 'dmg-blue');
      }
    }
    state.combatCallbacks = [];
  }

  function spawnFloat(parent, text, cls) {
    var span = document.createElement('div');
    span.className = 'float-num ' + cls;
    span.textContent = text;
    span.style.position = 'fixed';
    var rect = parent.getBoundingClientRect();
    span.style.left = (rect.left + rect.width / 2) + 'px';
    span.style.top = (rect.top + rect.height / 3) + 'px';
    document.body.appendChild(span);
    setTimeout(function() { if (span.parentNode) span.parentNode.removeChild(span); }, 1000);
  }

  // ---- HELPERS ----
  function getTypeLabel(type) {
    var m = { attack: '攻击', skill: '技能', power: '能力', status: '状态' };
    return m[type] || '';
  }

  function getIntentIcon(intent, enemy) {
    if (!intent) return '<span class="intent-unknown">?</span>';
    if (intent.type === 'attack') {
      var d = (intent.value || 0) + enemy.strength;
      if (enemy.weak > 0) d = Math.floor(d * 0.75);
      var hits = intent.hits || 1;
      var txt = hits > 1 ? (d + 'x' + hits) : ('' + d);
      return '<span class="intent-atk">&#9876; ' + txt + '</span>';
    }
    if (intent.type === 'defend') return '<span class="intent-def">&#9643; ' + intent.value + '</span>';
    if (intent.type === 'attack_buff') {
      var d = intent.atk + enemy.strength;
      if (enemy.weak > 0) d = Math.floor(d * 0.75);
      return '<span class="intent-atk">&#9876; ' + d + '+</span>';
    }
    if (intent.type === 'attack_debuff') {
      var d = intent.atk + enemy.strength;
      return '<span class="intent-atk">&#9876; ' + d + ' &#9888;</span>';
    }
    if (intent.type === 'buff') return '<span class="intent-buff">&#10024;</span>';
    if (intent.type === 'debuff') return '<span class="intent-debuff">&#9888;</span>';
    return '<span class="intent-unknown">?</span>';
  }

  function getCardArt(id) {
    var arts = {
      strike: '&#9876;', strike_plus: '&#9876;', defend: '&#9643;', defend_plus: '&#9643;',
      bash: '&#128168;', bash_plus: '&#128168;', anger: '&#128293;', cleave: '&#9876;&#9876;',
      iron_wave: '&#128170;', shrug_it_off: '&#128170;', pommel_strike: '&#128481;',
      body_slam: '&#128170;', inflame: '&#128293;', flex: '&#127947;',
      bloodletting: '&#129516;', twin_strike: '&#9876;&#9876;', havoc: '&#128165;',
      offering: '&#128293;', flame_barrier: '&#128293;', thunderclap: '&#9889;',
      disarm: '&#128481;', evolve: '&#127793;', metallicize: '&#128167;', wound: '&#10006;'
    };
    return arts[id] || '&#9733;';
  }

  function getPotionIcon(id) {
    var icons = {
      fire_potion: '&#128293;', block_potion: '&#128737;', strength_potion: '&#128170;',
      dexterity_potion: '&#128008;', regen_potion: '&#127807;', energy_potion: '&#9889;',
      fairy_potion: '&#10024;'
    };
    return icons[id] || '&#129516;';
  }

  function getEnemySprite(id) {
    var sprites = {
      jaw_worm: '<svg viewBox="0 0 80 80" width="90" height="90"><circle cx="40" cy="42" r="26" fill="#3d6b3d"/><circle cx="40" cy="38" r="22" fill="#4a7a4a"/><circle cx="32" cy="36" r="5" fill="#ffe"/><circle cx="48" cy="36" r="5" fill="#ffe"/><circle cx="33" cy="37" r="2.5" fill="#222"/><circle cx="49" cy="37" r="2.5" fill="#222"/><path d="M28 52 Q40 64 52 52" stroke="#2a4a2a" stroke-width="3" fill="none"/><polygon points="31,53 34,61 37,53" fill="#eee"/><polygon points="43,53 46,61 49,53" fill="#eee"/></svg>',
      louse_green: '<svg viewBox="0 0 80 80" width="90" height="90"><ellipse cx="40" cy="46" rx="20" ry="18" fill="#2d7a2d"/><ellipse cx="40" cy="42" rx="18" ry="16" fill="#3a8a3a"/><circle cx="34" cy="40" r="4" fill="#ffe"/><circle cx="46" cy="40" r="4" fill="#ffe"/><circle cx="35" cy="41" r="2" fill="#111"/><circle cx="47" cy="41" r="2" fill="#111"/><line x1="24" y1="34" x2="17" y2="24" stroke="#3a8a3a" stroke-width="3"/><line x1="56" y1="34" x2="63" y2="24" stroke="#3a8a3a" stroke-width="3"/></svg>',
      louse_red: '<svg viewBox="0 0 80 80" width="90" height="90"><ellipse cx="40" cy="46" rx="20" ry="18" fill="#8a2a2a"/><ellipse cx="40" cy="42" rx="18" ry="16" fill="#aa3a3a"/><circle cx="34" cy="40" r="4" fill="#ffe"/><circle cx="46" cy="40" r="4" fill="#ffe"/><circle cx="35" cy="41" r="2" fill="#111"/><circle cx="47" cy="41" r="2" fill="#111"/><line x1="24" y1="34" x2="17" y2="24" stroke="#aa3a3a" stroke-width="3"/><line x1="56" y1="34" x2="63" y2="24" stroke="#aa3a3a" stroke-width="3"/></svg>',
      slime_small: '<svg viewBox="0 0 80 80" width="90" height="90"><ellipse cx="40" cy="52" rx="24" ry="16" fill="#5aaa5a"/><ellipse cx="40" cy="46" rx="22" ry="18" fill="#7acd7a"/><circle cx="34" cy="44" r="4" fill="#fff"/><circle cx="46" cy="44" r="4" fill="#fff"/><circle cx="35" cy="45" r="2" fill="#2a5a2a"/><circle cx="47" cy="45" r="2" fill="#2a5a2a"/></svg>',
      fungi_beast: '<svg viewBox="0 0 80 80" width="90" height="90"><rect x="34" y="36" width="12" height="24" rx="3" fill="#7a5a2a"/><ellipse cx="40" cy="30" rx="17" ry="12" fill="#bb3333"/><ellipse cx="40" cy="28" rx="13" ry="8" fill="#dd4444"/><circle cx="30" cy="28" r="3" fill="#fff"/><circle cx="50" cy="28" r="3" fill="#fff"/><circle cx="31" cy="29" r="1.5" fill="#111"/><circle cx="51" cy="29" r="1.5" fill="#111"/><line x1="22" y1="52" x2="16" y2="64" stroke="#7a5a2a" stroke-width="3"/><line x1="58" y1="52" x2="64" y2="64" stroke="#7a5a2a" stroke-width="3"/></svg>',
      cultist: '<svg viewBox="0 0 80 80" width="90" height="90"><circle cx="40" cy="28" r="14" fill="#333"/><rect x="31" y="38" width="18" height="22" rx="3" fill="#2a2a2a"/><circle cx="35" cy="26" r="3.5" fill="#e22"/><circle cx="45" cy="26" r="3.5" fill="#e22"/><path d="M30 14 L40 4 L50 14" stroke="#e22" stroke-width="2" fill="none"/><path d="M33 60 L26 72" stroke="#2a2a2a" stroke-width="3"/><path d="M47 60 L54 72" stroke="#2a2a2a" stroke-width="3"/><circle cx="40" cy="34" r="3" fill="#e22" opacity=".5"/></svg>',
      looter: '<svg viewBox="0 0 80 80" width="90" height="90"><circle cx="40" cy="26" r="13" fill="#7a6a4a"/><rect x="31" y="36" width="18" height="24" rx="3" fill="#5a4a2a"/><circle cx="35" cy="24" r="3" fill="#fff"/><circle cx="45" cy="24" r="3" fill="#fff"/><circle cx="36" cy="25" r="1.5" fill="#111"/><circle cx="46" cy="25" r="1.5" fill="#111"/><rect x="52" y="42" width="16" height="10" rx="2" fill="#a08040"/><path d="M33 60 L26 72" stroke="#5a4a2a" stroke-width="3"/><path d="M47 60 L54 72" stroke="#5a4a2a" stroke-width="3"/></svg>',
      gremlin_nob: '<svg viewBox="0 0 80 80" width="90" height="90"><rect x="24" y="28" width="32" height="30" rx="8" fill="#8a3333"/><circle cx="34" cy="38" r="5" fill="#fff"/><circle cx="46" cy="38" r="5" fill="#fff"/><circle cx="35" cy="39" r="2.5" fill="#222"/><circle cx="47" cy="39" r="2.5" fill="#222"/><path d="M30 50 Q40 58 50 50" stroke="#5a2222" stroke-width="3" fill="none"/><polygon points="28,24 32,20 36,28" fill="#8a3333"/><polygon points="44,28 48,20 52,24" fill="#8a3333"/><path d="M20 40 L12 36" stroke="#8a3333" stroke-width="5"/><path d="M60 40 L68 36" stroke="#8a3333" stroke-width="5"/></svg>',
      hexaghost: '<svg viewBox="0 0 80 80" width="90" height="90"><circle cx="40" cy="40" r="24" fill="none" stroke="#e84" stroke-width="2"/><circle cx="40" cy="40" r="16" fill="#a42"/><circle cx="40" cy="34" r="3" fill="#ff8"/><circle cx="34" cy="42" r="3" fill="#ff8"/><circle cx="46" cy="42" r="3" fill="#ff8"/><circle cx="40" cy="50" r="3" fill="#ff8"/><circle cx="30" cy="30" r="4" fill="#f64"/><circle cx="50" cy="30" r="4" fill="#f64"/><circle cx="30" cy="50" r="4" fill="#f64"/><circle cx="50" cy="50" r="4" fill="#f64"/></svg>',
      slime_boss: '<svg viewBox="0 0 80 80" width="90" height="90"><ellipse cx="40" cy="52" rx="30" ry="20" fill="#5aaa5a"/><ellipse cx="40" cy="44" rx="28" ry="22" fill="#7acd7a"/><circle cx="30" cy="40" r="6" fill="#fff"/><circle cx="50" cy="40" r="6" fill="#fff"/><circle cx="31" cy="41" r="3" fill="#222"/><circle cx="51" cy="41" r="3" fill="#222"/><path d="M30 54 Q40 62 50 54" stroke="#3a8a3a" stroke-width="3" fill="none"/></svg>'
    };
    return sprites[id] || sprites.jaw_worm;
  }

  // ---- VICTORY ----
  function renderVictory(container) {
    var rewards = G.getBattleRewards(state);
    rewardState = { gold: rewards.gold, cards: rewards.cards, chosen: false };
    var h = '<div class="reward-screen">';
    h += '<div class="reward-glow"></div>';
    h += '<div class="reward-title">&#9876; 战斗胜利</div>';
    h += '<div class="reward-gold">&#9733; +' + rewards.gold + ' 金币</div>';
    h += '<div class="reward-section"><div class="reward-label">选择一张卡牌加入牌组</div><div class="reward-cards">';
    for (var i = 0; i < rewardState.cards.length; i++) {
      var card = G.CardsDB[rewardState.cards[i]];
      h += '<div class="hand-card card-' + card.type + ' card-reward" data-cid="' + rewardState.cards[i] + '">';
      h += '<div class="card-frame">';
      h += '<div class="card-cost-orb">' + card.cost + '</div>';
      h += '<div class="card-art">' + getCardArt(card.id) + '</div>';
      h += '<div class="card-title-bar">' + card.name + '</div>';
      h += '<div class="card-desc-box">' + card.desc.replace(/\n/g, '<br>') + '</div>';
      h += '<div class="card-type-bar">' + getTypeLabel(card.type) + '</div>';
      h += '</div></div>';
    }
    h += '</div></div>';
    h += '<button class="btn-continue" id="btn-skip-reward">跳过奖励</button>';
    h += '</div>';
    container.innerHTML = h;

    var cards = container.querySelectorAll('.card-reward');
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', function() {
        if (rewardState.chosen) return;
        rewardState.chosen = true;
        G.addCardToDeck(state, this.dataset.cid);
        finishReward();
      });
    }
    document.getElementById('btn-skip-reward').addEventListener('click', finishReward);
  }

  function finishReward() {
    if (state.currentFloor >= state.map.length - 1) {
      state.screen = 'win';
      renderWin();
      return;
    }
    state.phase = 'map';
    render();
  }

  function renderWin() {
    $root.innerHTML =
      '<div class="win-screen">' +
        '<div class="win-emblem">&#9734;</div>' +
        '<h1 class="win-title">恭喜通关!</h1>' +
        '<p class="win-desc">你成功征服了尖塔</p>' +
        '<div class="win-stats">' +
          '<div class="ws">&#10084; ' + state.player.hp + '/' + state.player.maxHp + '</div>' +
          '<div class="ws">&#9733; ' + state.player.gold + '</div>' +
          '<div class="ws">&#9827; ' + state.deck.length + ' 张</div>' +
        '</div>' +
        '<button class="btn-start" id="btn-restart">再来一局</button>' +
      '</div>';
    document.getElementById('btn-restart').addEventListener('click', function() {
      state = G.createInitialState();
      render();
    });
  }

  function renderDefeat(container) {
    container.innerHTML =
      '<div class="defeat-screen">' +
        '<div class="defeat-emblem">&#10006;</div>' +
        '<h1 class="defeat-title">你倒下了...</h1>' +
        '<p class="defeat-desc">尖塔再次击败了挑战者</p>' +
        '<div class="win-stats">' +
          '<div class="ws">层 ' + (state.currentFloor + 1) + '</div>' +
          '<div class="ws">&#9733; ' + state.player.gold + '</div>' +
        '</div>' +
        '<button class="btn-start" id="btn-restart">重新开始</button>' +
      '</div>';
    document.getElementById('btn-restart').addEventListener('click', function() {
      state = G.createInitialState();
      render();
    });
  }

  // ---- REST ----
  function renderRest(container) {
    var healAmt = Math.floor(state.player.maxHp * 0.3);
    container.innerHTML =
      '<div class="rest-screen">' +
        '<div class="campfire">&#9752;</div>' +
        '<h2 class="rest-title">篝火</h2>' +
        '<p class="rest-desc">火焰温暖而宁静，你决定...</p>' +
        '<div class="rest-actions">' +
          '<button class="btn-rest" id="btn-rest-heal">' +
            '<span class="rest-icon">&#10084;</span>' +
            '<span class="rest-label">休息</span>' +
            '<span class="rest-sub">恢复' + healAmt + ' HP</span>' +
          '</button>' +
          '<button class="btn-rest" id="btn-rest-smith">' +
            '<span class="rest-icon">&#9876;</span>' +
            '<span class="rest-label">铁匠</span>' +
            '<span class="rest-sub">升级一张牌</span>' +
          '</button>' +
        '</div>' +
      '</div>';
    document.getElementById('btn-rest-heal').addEventListener('click', function() {
      G.healPlayer(state, healAmt);
      state.phase = 'map';
      render();
    });
    document.getElementById('btn-rest-smith').addEventListener('click', function() {
      showUpgradeView();
    });
  }

  function showUpgradeView() {
    var overlay = document.createElement('div');
    overlay.className = 'deck-overlay';
    overlay.id = 'deck-overlay';
    var h = '<div class="deck-panel">';
    h += '<div class="deck-header"><span>选择要升级的牌</span><button class="btn-close-deck" id="btn-close-deck">&#10006;</button></div>';
    h += '<div class="deck-cards">';
    for (var i = 0; i < state.deck.length; i++) {
      var c = state.deck[i];
      if (c.type === 'status') continue;
      h += '<div class="hand-card card-' + c.type + '" data-didx="' + i + '">';
      h += '<div class="card-frame"><div class="card-cost-orb">' + c.cost + '</div>';
      h += '<div class="card-art">' + getCardArt(c.id) + '</div>';
      h += '<div class="card-title-bar">' + c.name + '</div>';
      h += '<div class="card-desc-box">' + c.desc.replace(/\n/g, '<br>') + '</div>';
      h += '<div class="card-type-bar">' + getTypeLabel(c.type) + '</div>';
      h += '</div></div>';
    }
    h += '</div></div>';
    overlay.innerHTML = h;
    document.body.appendChild(overlay);

    var cards = overlay.querySelectorAll('.hand-card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', function() {
        var didx = parseInt(this.dataset.didx);
        var c = state.deck[didx];
        if (c && G.CardsDB[c.id + '_plus']) {
          var up = G.cloneCard(G.CardsDB[c.id + '_plus']);
          state.deck[didx] = up;
        } else if (c) {
          c.name += '+';
          c.upgraded = true;
          if (c.type === 'attack') c.desc += '\n(强化)';
        }
        overlay.remove();
        state.phase = 'map';
        render();
      });
    }
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
    var closeBtn = document.getElementById('btn-close-deck');
    if (closeBtn) closeBtn.addEventListener('click', function() { overlay.remove(); });
  }

  // ---- EVENT ----
  function renderEvent(container) {
    if (!eventState) { state.phase = 'map'; render(); return; }
    var h = '<div class="event-screen">';
    h += '<div class="event-glyph">?</div>';
    h += '<h2 class="event-title">' + eventState.name + '</h2>';
    h += '<p class="event-desc">' + eventState.desc + '</p>';
    h += '<div class="event-choices">';
    for (var i = 0; i < eventState.choices.length; i++) {
      h += '<button class="btn-event-choice" data-idx="' + i + '">' + eventState.choices[i].text + '</button>';
    }
    h += '</div>';
    h += '<div class="event-result" id="event-result"></div>';
    h += '</div>';
    container.innerHTML = h;

    var btns = container.querySelectorAll('.btn-event-choice');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function() {
        var idx = parseInt(this.dataset.idx);
        var result = eventState.choices[idx].effect(state);
        document.getElementById('event-result').textContent = result;
        document.getElementById('event-result').style.display = 'block';
        var all = document.querySelectorAll('.btn-event-choice');
        for (var j = 0; j < all.length; j++) { all[j].disabled = true; all[j].style.opacity = '0.4'; }
        setTimeout(function() { eventState = null; state.phase = 'map'; render(); }, 1500);
      });
    }
  }

  // ---- SHOP ----
  function renderShop(container) {
    if (!shopState) { state.phase = 'map'; render(); return; }
    var h = '<div class="shop-screen">';
    h += '<h2 class="shop-title">&#9830; 旅行商人</h2>';
    h += '<div class="shop-gold">金币: &#9733; ' + state.player.gold + '</div>';
    h += '<div class="shop-cards">';
    for (var i = 0; i < shopState.cards.length; i++) {
      var item = shopState.cards[i];
      var card = G.CardsDB[item.id];
      var canBuy = state.player.gold >= item.price;
      h += '<div class="shop-card-wrap">';
      h += '<div class="hand-card card-' + card.type + (canBuy ? '' : ' card-disabled') + '" data-sidx="' + i + '">';
      h += '<div class="card-frame"><div class="card-cost-orb">' + card.cost + '</div>';
      h += '<div class="card-art">' + getCardArt(card.id) + '</div>';
      h += '<div class="card-title-bar">' + card.name + '</div>';
      h += '<div class="card-desc-box">' + card.desc.replace(/\n/g, '<br>') + '</div>';
      h += '<div class="card-type-bar">' + getTypeLabel(card.type) + '</div>';
      h += '</div></div>';
      h += '<div class="shop-price">&#9733; ' + item.price + '</div>';
      h += '</div>';
    }
    h += '</div>';
    h += '<button class="btn-continue" id="btn-leave-shop">离开商店</button>';
    h += '</div>';
    container.innerHTML = h;

    var cards = container.querySelectorAll('.hand-card:not(.card-disabled)');
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', function() {
        var idx = parseInt(this.dataset.sidx);
        var item = shopState.cards[idx];
        if (state.player.gold >= item.price) {
          state.player.gold -= item.price;
          G.addCardToDeck(state, item.id);
          shopState.cards.splice(idx, 1);
          render();
        }
      });
    }
    document.getElementById('btn-leave-shop').addEventListener('click', function() {
      shopState = null;
      state.phase = 'map';
      render();
    });
  }

  // ---- DECK VIEW ----
  function showDeckView(type) {
    var cards = type === 'deck' ? state.deck : state.discard;
    var title = type === 'deck' ? '牌组' : '弃牌堆';
    var overlay = document.createElement('div');
    overlay.className = 'deck-overlay';
    overlay.id = 'deck-overlay';
    var h = '<div class="deck-panel">';
    h += '<div class="deck-header"><span>' + title + ' (' + cards.length + ')</span><button class="btn-close-deck" id="btn-close-deck">&#10006;</button></div>';
    h += '<div class="deck-cards">';
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      h += '<div class="hand-card card-' + c.type + '">';
      h += '<div class="card-frame"><div class="card-cost-orb">' + (c.cost < 0 ? 'X' : c.cost) + '</div>';
      h += '<div class="card-art">' + getCardArt(c.id) + '</div>';
      h += '<div class="card-title-bar">' + c.name + '</div>';
      h += '<div class="card-desc-box">' + c.desc.replace(/\n/g, '<br>') + '</div>';
      h += '<div class="card-type-bar">' + getTypeLabel(c.type) + '</div>';
      h += '</div></div>';
    }
    if (!cards.length) h += '<div class="deck-empty">没有卡牌</div>';
    h += '</div></div>';
    overlay.innerHTML = h;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
    document.getElementById('btn-close-deck').addEventListener('click', function() { overlay.remove(); });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
