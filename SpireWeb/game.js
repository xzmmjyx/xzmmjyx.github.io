(function() {
  'use strict';

  function cloneCard(card) {
    var c = {};
    for (var k in card) {
      if (card.hasOwnProperty(k)) c[k] = card[k];
    }
    return c;
  }

  function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (typeof obj === 'function') return obj;
    if (Array.isArray(obj)) {
      var arr = [];
      for (var i = 0; i < obj.length; i++) arr[i] = deepClone(obj[i]);
      return arr;
    }
    var out = {};
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) out[k] = deepClone(obj[k]);
    }
    return out;
  }

  var CardsDB = {
    strike: {
      id: 'strike', name: '打击', type: 'attack', cost: 1, rarity: 'basic',
      desc: '造成6点伤害',
      effect: function(s, t) {
        var d = 6 + s.player.strength;
        dealDamageToEnemy(s, t, d);
      }
    },
    strike_plus: {
      id: 'strike_plus', name: '打击+', type: 'attack', cost: 1, rarity: 'basic', upgraded: true,
      desc: '造成9点伤害',
      effect: function(s, t) {
        var d = 9 + s.player.strength;
        dealDamageToEnemy(s, t, d);
      }
    },
    defend: {
      id: 'defend', name: '防御', type: 'skill', cost: 1, rarity: 'basic',
      desc: '获得5点格挡',
      effect: function(s) {
        gainBlock(s, 5 + s.player.dexterity);
      }
    },
    defend_plus: {
      id: 'defend_plus', name: '防御+', type: 'skill', cost: 1, rarity: 'basic', upgraded: true,
      desc: '获得8点格挡',
      effect: function(s) {
        gainBlock(s, 8 + s.player.dexterity);
      }
    },
    bash: {
      id: 'bash', name: '重击', type: 'attack', cost: 2, rarity: 'basic',
      desc: '造成8点伤害\n给予2层易伤',
      effect: function(s, t) {
        var d = 8 + s.player.strength;
        dealDamageToEnemy(s, t, d);
        t.vulnerable += 2;
      }
    },
    bash_plus: {
      id: 'bash_plus', name: '重击+', type: 'attack', cost: 2, rarity: 'basic', upgraded: true,
      desc: '造成10点伤害\n给予3层易伤',
      effect: function(s, t) {
        var d = 10 + s.player.strength;
        dealDamageToEnemy(s, t, d);
        t.vulnerable += 3;
      }
    },
    anger: {
      id: 'anger', name: '怒火', type: 'attack', cost: 0, rarity: 'common',
      desc: '造成6点伤害\n将一张怒火加入弃牌堆',
      effect: function(s, t) {
        var d = 6 + s.player.strength;
        dealDamageToEnemy(s, t, d);
        s.discard.push(cloneCard(CardsDB.anger));
      }
    },
    cleave: {
      id: 'cleave', name: '横扫', type: 'attack', cost: 1, rarity: 'common',
      desc: '对所有敌人造成8点伤害',
      effect: function(s) {
        var d = 8 + s.player.strength;
        for (var i = 0; i < s.enemies.length; i++) {
          dealDamageToEnemy(s, s.enemies[i], d);
        }
      }
    },
    iron_wave: {
      id: 'iron_wave', name: '铁涌', type: 'attack', cost: 1, rarity: 'common',
      desc: '获得5点格挡\n造成5点伤害',
      effect: function(s, t) {
        gainBlock(s, 5 + s.player.dexterity);
        var d = 5 + s.player.strength;
        dealDamageToEnemy(s, t, d);
      }
    },
    shrug_it_off: {
      id: 'shrug_it_off', name: '耸肩', type: 'skill', cost: 1, rarity: 'common',
      desc: '获得8点格挡\n抽1张牌',
      effect: function(s) {
        gainBlock(s, 8 + s.player.dexterity);
        drawCards(s, 1);
      }
    },
    pommel_strike: {
      id: 'pommel_strike', name: '剑柄打击', type: 'attack', cost: 1, rarity: 'common',
      desc: '造成9点伤害\n抽1张牌',
      effect: function(s, t) {
        var d = 9 + s.player.strength;
        dealDamageToEnemy(s, t, d);
        drawCards(s, 1);
      }
    },
    body_slam: {
      id: 'body_slam', name: '猛撞', type: 'attack', cost: 1, rarity: 'uncommon',
      desc: '造成等同于格挡值的伤害',
      effect: function(s, t) {
        var d = s.player.block + s.player.strength;
        dealDamageToEnemy(s, t, d);
      }
    },
    inflame: {
      id: 'inflame', name: '燃烧', type: 'power', cost: 1, rarity: 'uncommon',
      desc: '获得2点力量',
      effect: function(s) {
        s.player.strength += 2;
      }
    },
    flex: {
      id: 'flex', name: '屈伸', type: 'skill', cost: 0, rarity: 'common',
      desc: '获得2点力量\n回合结束失去2点力量',
      effect: function(s) {
        s.player.strength += 2;
        s.player.loseStrength += 2;
      }
    },
    bloodletting: {
      id: 'bloodletting', name: '放血', type: 'skill', cost: 0, rarity: 'uncommon',
      desc: '失去3点生命\n获得2点能量',
      effect: function(s) {
        s.player.hp = Math.max(1, s.player.hp - 3);
        s.player.energy += 2;
      }
    },
    twin_strike: {
      id: 'twin_strike', name: '双重打击', type: 'attack', cost: 1, rarity: 'common',
      desc: '造成5点伤害两次',
      effect: function(s, t) {
        var d = 5 + s.player.strength;
        dealDamageToEnemy(s, t, d);
        if (t.hp > 0) dealDamageToEnemy(s, t, d);
      }
    },
    havoc: {
      id: 'havoc', name: '浩劫', type: 'skill', cost: 1, rarity: 'common',
      desc: '打出抽牌堆顶牌\n消耗该牌',
      effect: function(s) {
        if (s.draw.length > 0) {
          var c = s.draw.pop();
          if (c.cost <= s.player.energy) {
            s.player.energy -= c.cost;
            c.effect(s, s.targetEnemy || s.enemies[0]);
          }
          s.exhaust.push(c);
        }
      }
    },
    offering: {
      id: 'offering', name: '祭品', type: 'skill', cost: 0, rarity: 'rare',
      desc: '失去6点生命\n获得2点能量\n抽3张牌',
      effect: function(s) {
        s.player.hp = Math.max(1, s.player.hp - 6);
        s.player.energy += 2;
        drawCards(s, 3);
      }
    },
    flame_barrier: {
      id: 'flame_barrier', name: '火焰屏障', type: 'skill', cost: 2, rarity: 'uncommon',
      desc: '获得12点格挡\n受到攻击时反弹4点伤害',
      effect: function(s) {
        gainBlock(s, 12 + s.player.dexterity);
        s.player.flameBarrier = (s.player.flameBarrier || 0) + 4;
      }
    },
    thunderclap: {
      id: 'thunderclap', name: '雷鸣', type: 'attack', cost: 1, rarity: 'common',
      desc: '对所有敌人造成4点伤害\n给予1层易伤',
      effect: function(s) {
        var d = 4 + s.player.strength;
        for (var i = 0; i < s.enemies.length; i++) {
          dealDamageToEnemy(s, s.enemies[i], d);
          s.enemies[i].vulnerable += 1;
        }
      }
    },
    disarm: {
      id: 'disarm', name: '缴械', type: 'skill', cost: 1, rarity: 'uncommon',
      desc: '敌人失去2点力量\n消耗',
      effect: function(s, t) {
        t.strength -= 2;
      },
      exhaust: true
    },
    evolve: {
      id: 'evolve', name: '进化', type: 'power', cost: 1, rarity: 'uncommon',
      desc: '每当你抽到状态牌时\n抽1张牌',
      effect: function(s) {
        s.player.evolve = (s.player.evolve || 0) + 1;
      }
    },
    metallicize: {
      id: 'metallicize', name: '金属化', type: 'power', cost: 1, rarity: 'uncommon',
      desc: '回合结束时获得3点格挡',
      effect: function(s) {
        s.player.metallicize = (s.player.metallicize || 0) + 3;
      }
    }
  };

  var WoundCard = {
    id: 'wound', name: '伤口', type: 'status', cost: -1, rarity: 'status',
    desc: '无法打出',
    effect: function() {}
  };

  var EnemiesDB = {
    jaw_worm: {
      id: 'jaw_worm', name: '颚虫', baseHp: [40, 44],
      moves: [
        { type: 'attack', value: 11, weight: 45 },
        { type: 'defend', value: 6, weight: 30 },
        { type: 'attack_buff', atk: 5, str: 3, weight: 25 }
      ]
    },
    louse_green: {
      id: 'louse_green', name: '绿虫', baseHp: [10, 15],
      moves: [
        { type: 'attack', value: 6, weight: 75 },
        { type: 'defend', value: 4, weight: 25 }
      ]
    },
    louse_red: {
      id: 'louse_red', name: '红虫', baseHp: [10, 15],
      moves: [
        { type: 'attack', value: 7, weight: 75 },
        { type: 'debuff', effect: 'weaken', value: 2, weight: 25 }
      ]
    },
    fungi_beast: {
      id: 'fungi_beast', name: '真菌兽', baseHp: [22, 28],
      moves: [
        { type: 'attack', value: 6, weight: 60 },
        { type: 'buff', effect: 'strength', value: 3, weight: 40 }
      ]
    },
    slime_small: {
      id: 'slime_small', name: '小史莱姆', baseHp: [6, 8],
      moves: [
        { type: 'attack', value: 5, weight: 100 }
      ]
    },
    cultist: {
      id: 'cultist', name: '邪教徒', baseHp: [48, 54],
      moves: [
        { type: 'attack_buff', atk: 6, str: 3, weight: 100 }
      ]
    },
    looter: {
      id: 'looter', name: '抢劫者', baseHp: [44, 48],
      moves: [
        { type: 'attack', value: 10, weight: 30 },
        { type: 'attack', value: 14, weight: 30 },
        { type: 'defend', value: 6, weight: 25 },
        { type: 'debuff', effect: 'steal', value: 15, weight: 15 }
      ]
    },
    gremlin_nob: {
      id: 'gremlin_nob', name: '地精头目', baseHp: [82, 86],
      moves: [
        { type: 'attack', value: 14, weight: 67 },
        { type: 'attack_buff', atk: 6, str: 2, weight: 33 }
      ]
    },
    hexaghost: {
      id: 'hexaghost', name: '六火亡魂', baseHp: [250, 250],
      moves: [
        { type: 'attack', value: 2, hits: 6, weight: 40 },
        { type: 'attack', value: 12, weight: 30 },
        { type: 'buff', effect: 'strength', value: 2, weight: 30 }
      ]
    },
    slime_boss: {
      id: 'slime_boss', name: '史莱姆BOSS', baseHp: [150, 150],
      moves: [
        { type: 'attack_debuff', atk: 10, effect: 'slimed', weight: 40 },
        { type: 'defend', value: 6, weight: 30 },
        { type: 'attack', value: 16, weight: 30 }
      ]
    }
  };

  var EventsDB = [
    {
      id: 'big_fish', name: '大鱼',
      desc: '你发现了一条搁浅的巨鱼，它的鳞片闪烁着微光。',
      choices: [
        { text: '吃鱼 (恢复30%生命)', effect: function(s) {
          var h = Math.floor(s.player.maxHp * 0.3);
          s.player.hp = Math.min(s.player.maxHp, s.player.hp + h);
          return '你恢复了' + h + '点生命';
        }},
        { text: '搜刮 (获得一件遗物)', effect: function(s) {
          addRandomRelic(s);
          return '你获得了一件遗物';
        }},
        { text: '离开', effect: function() { return '你继续前进'; } }
      ]
    },
    {
      id: 'healing_fountain', name: '治疗之泉',
      desc: '清澈的泉水散发着温暖的光芒。',
      choices: [
        { text: '饮用 (恢复30%生命)', effect: function(s) {
          var h = Math.floor(s.player.maxHp * 0.3);
          s.player.hp = Math.min(s.player.maxHp, s.player.hp + h);
          return '你恢复了' + h + '点生命';
        }},
        { text: '离开', effect: function() { return '你继续前进'; } }
      ]
    },
    {
      id: 'mysterious_altar', name: '神秘祭坛',
      desc: '一个古老的祭坛，散发着诡异的力量。',
      choices: [
        { text: '献祭 (-10%生命，获得随机强力牌)', effect: function(s) {
          var lose = Math.floor(s.player.maxHp * 0.1);
          s.player.hp -= lose;
          var pool = ['inflame', 'offering', 'flame_barrier', 'metallicize'];
          var cid = pool[Math.floor(Math.random() * pool.length)];
          s.deck.push(cloneCard(CardsDB[cid]));
          return '失去' + lose + '生命，获得' + CardsDB[cid].name;
        }},
        { text: '忽略', effect: function() { return '你无视了祭坛'; } }
      ]
    },
    {
      id: 'abandoned_chest', name: '废弃宝箱',
      desc: '一个落满灰尘的宝箱，似乎没有陷阱。',
      choices: [
        { text: '打开 (获得50-100金币)', effect: function(s) {
          var g = 50 + Math.floor(Math.random() * 51);
          s.player.gold += g;
          return '你获得了' + g + '金币';
        }},
        { text: '砸碎 (获得随机牌)', effect: function(s) {
          var pool = Object.keys(CardsDB);
          var cid = pool[Math.floor(Math.random() * pool.length)];
          s.deck.push(cloneCard(CardsDB[cid]));
          return '你获得了' + CardsDB[cid].name;
        }},
        { text: '离开', effect: function() { return '你离开了'; } }
      ]
    },
    {
      id: 'scrap_ooze', name: '废弃软泥',
      desc: '一堆废弃的软泥中似乎藏着什么。',
      choices: [
        { text: '伸手进去 (50%获得遗物/50%失去10%HP)', effect: function(s) {
          if (Math.random() < 0.5) {
            addRandomRelic(s);
            return '你获得了一件遗物！';
          } else {
            var lose = Math.floor(s.player.maxHp * 0.1);
            s.player.hp -= lose;
            return '软泥灼伤了你！失去' + lose + '生命';
          }
        }},
        { text: '离开', effect: function() { return '你绕开了软泥'; } }
      ]
    }
  ];

  var RelicsDB = {
    burning_blood: { id: 'burning_blood', name: '燃血', desc: '每场战斗结束恢复6点生命', rarity: 'starter', onCombatEnd: function(s) { s.player.hp = Math.min(s.player.maxHp, s.player.hp + 6); } },
    vajra: { id: 'vajra', name: '金刚杵', desc: '战斗开始时获得1点力量', rarity: 'common', onCombatStart: function(s) { s.player.strength += 1; } },
    anchor: { id: 'anchor', name: '船锚', desc: '战斗开始时获得10点格挡', rarity: 'common', onCombatStart: function(s) { s.player.block += 10; } },
    bag_of_preparation: { id: 'bag_of_preparation', name: '准备袋', desc: '战斗开始时额外抽2张牌', rarity: 'common', onCombatStart: function(s) { drawCards(s, 2); } },
    oddly_smooth_stone: { id: 'oddly_smooth_stone', name: '光滑石', desc: '战斗开始时获得1点敏捷', rarity: 'common', onCombatStart: function(s) { s.player.dexterity += 1; } },
    blood_vial: { id: 'blood_vial', name: '血瓶', desc: '战斗开始时恢复2点生命', rarity: 'common', onCombatStart: function(s) { s.player.hp = Math.min(s.player.maxHp, s.player.hp + 2); } },
    lantern: { id: 'lantern', name: '灯笼', desc: '第一回合获得1点额外能量', rarity: 'common', onCombatStart: function(s) { if (s.combatTurn === 0) s.player.energy += 1; } },
    horn_cleat: { id: 'horn_cleat', name: '号角', desc: '第二回合获得14点格挡', rarity: 'uncommon', onTurnStart: function(s) { if (s.combatTurn === 1) s.player.block += 14; } },
    ornamental_fan: { id: 'ornamental_fan', name: '装饰扇', desc: '每打出3张攻击牌获得4点格挡', rarity: 'uncommon', onCardPlayed: function(s, c) { if (c.type === 'attack') { s.player.attackCount = (s.player.attackCount || 0) + 1; if (s.player.attackCount % 3 === 0) gainBlock(s, 4); } } },
    pen_nib: { id: 'pen_nib', name: '钢笔', desc: '每打出10张攻击牌，下张攻击牌伤害翻倍', rarity: 'uncommon', onCardPlayed: function(s, c) { if (c.type === 'attack') { s.player.penCount = (s.player.penCount || 0) + 1; } } },
    eternal_feather: { id: 'eternal_feather', name: '永恒羽', desc: '每拥有5张牌恢复3点生命(休息时)', rarity: 'uncommon' },
    meat_on_the_bone: { id: 'meat_on_the_bone', name: '骨头肉', desc: '战斗结束时若HP≤50%恢复12点', rarity: 'uncommon', onCombatEnd: function(s) { if (s.player.hp <= s.player.maxHp / 2) s.player.hp = Math.min(s.player.maxHp, s.player.hp + 12); } },
    kunai: { id: 'kunai', name: '苦无', desc: '每打出3张攻击牌获得1点敏捷', rarity: 'rare', onCardPlayed: function(s, c) { if (c.type === 'attack') { s.player.kunaiCount = (s.player.kunaiCount || 0) + 1; if (s.player.kunaiCount % 3 === 0) s.player.dexterity += 1; } } },
    shuriken: { id: 'shuriken', name: '手里剑', desc: '每打出3张攻击牌获得1点力量', rarity: 'rare', onCardPlayed: function(s, c) { if (c.type === 'attack') { s.player.shurikenCount = (s.player.shurikenCount || 0) + 1; if (s.player.shurikenCount % 3 === 0) s.player.strength += 1; } } }
  };

  var ShopCards = ['anger', 'cleave', 'iron_wave', 'shrug_it_off', 'pommel_strike', 'inflame', 'flex', 'bloodletting', 'twin_strike', 'flame_barrier', 'thunderclap', 'disarm', 'evolve', 'metallicize', 'body_slam', 'offering'];

  var PotionsDB = {
    fire_potion: { id: 'fire_potion', name: '火焰药水', desc: '造成20点伤害', rarity: 'common', effect: function(s) { var t = s.enemies[s.targetEnemy] || s.enemies[0]; dealDamageToEnemy(s, t, 20); } },
    block_potion: { id: 'block_potion', name: '格挡药水', desc: '获得12点格挡', rarity: 'common', effect: function(s) { gainBlock(s, 12); } },
    strength_potion: { id: 'strength_potion', name: '力量药水', desc: '获得2点力量', rarity: 'common', effect: function(s) { s.player.strength += 2; } },
    dexterity_potion: { id: 'dexterity_potion', name: '敏捷药水', desc: '获得2点敏捷', rarity: 'common', effect: function(s) { s.player.dexterity += 2; } },
    regen_potion: { id: 'regen_potion', name: '再生药水', desc: '获得5层再生', rarity: 'uncommon', effect: function(s) { s.player.regen = (s.player.regen || 0) + 5; } },
    energy_potion: { id: 'energy_potion', name: '能量药水', desc: '获得2点能量', rarity: 'uncommon', effect: function(s) { s.player.energy += 2; } },
    fairy_potion: { id: 'fairy_potion', name: '仙灵药水', desc: '恢复最大生命值的30%', rarity: 'rare', effect: function(s) { var h = Math.floor(s.player.maxHp * 0.3); s.player.hp = Math.min(s.player.maxHp, s.player.hp + h); } }
  };

  function dealDamageToEnemy(s, enemy, amount) {
    if (!enemy || enemy.hp <= 0) return;
    var dmg = amount;
    if (enemy.vulnerable > 0) dmg = Math.floor(dmg * 1.5);
    var blocked = Math.min(enemy.block, dmg);
    enemy.block -= blocked;
    var hpLoss = dmg - blocked;
    enemy.hp -= hpLoss;
    enemy.lastDamageTaken = hpLoss;
    if (enemy.hp <= 0) enemy.hp = 0;
    if (s && s.combatCallbacks) {
      s.combatCallbacks.push({ type: 'damage_enemy', enemyIdx: s.enemies.indexOf(enemy), amount: hpLoss, blocked: blocked });
    }
  }

  function dealDamageToPlayer(s, amount) {
    var dmg = amount;
    if (s.player.vulnerable > 0) dmg = Math.floor(dmg * 1.5);
    var blocked = Math.min(s.player.block, dmg);
    s.player.block -= blocked;
    var hpLoss = dmg - blocked;
    s.player.hp -= hpLoss;
    if (s.player.hp <= 0) s.player.hp = 0;
    if (s && s.combatCallbacks) {
      s.combatCallbacks.push({ type: 'damage_player', amount: hpLoss, blocked: blocked });
    }
    if (s.player.flameBarrier && s.player.flameBarrier > 0) {
      // flame barrier reflect
    }
    return hpLoss;
  }

  function gainBlock(s, amount) {
    s.player.block += amount;
    if (s && s.combatCallbacks) {
      s.combatCallbacks.push({ type: 'gain_block', amount: amount });
    }
  }

  function randomRange(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

  function randomWeighted(items) {
    var total = 0;
    for (var i = 0; i < items.length; i++) total += items[i].weight;
    var r = Math.random() * total, sum = 0;
    for (var i = 0; i < items.length; i++) {
      sum += items[i].weight;
      if (r <= sum) return items[i];
    }
    return items[items.length - 1];
  }

  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function drawCards(s, count) {
    for (var i = 0; i < count; i++) {
      if (s.hand.length >= 10) break;
      if (s.draw.length === 0) {
        if (s.discard.length === 0) break;
        s.draw = shuffleArray(s.discard.slice());
        s.discard = [];
      }
      var card = s.draw.pop();
      s.hand.push(card);
    }
  }

  function createEnemy(templateId) {
    var t = EnemiesDB[templateId];
    var hp = randomRange(t.baseHp[0], t.baseHp[1]);
    return {
      id: t.id, name: t.name,
      hp: hp, maxHp: hp, block: 0,
      vulnerable: 0, weak: 0, strength: 0,
      moves: t.moves, lastMove: -1, intent: null,
      lastDamageTaken: 0
    };
  }

  function pickEnemyMove(enemy) {
    var avail = [];
    for (var i = 0; i < enemy.moves.length; i++) {
      if (i !== enemy.lastMove || enemy.moves.length <= 1) avail.push(enemy.moves[i]);
    }
    if (avail.length === 0) avail = enemy.moves;
    var move = randomWeighted(avail);
    enemy.lastMove = enemy.moves.indexOf(move);
    return move;
  }

  function generateMap() {
    var map = [];
    var floors = 15;
    for (var f = 0; f < floors; f++) {
      var nodes = [];
      var count = f === 0 ? 1 : (f === floors - 1 ? 1 : (f === 8 ? 1 : (2 + Math.floor(Math.random() * 2))));
      for (var n = 0; n < count; n++) {
        var type;
        if (f === 0) type = 'battle';
        else if (f === floors - 1) type = 'boss';
        else if (f === 8) type = 'rest';
        else {
          var r = Math.random();
          if (r < 0.45) type = 'battle';
          else if (r < 0.6) type = 'elite';
          else if (r < 0.75) type = 'event';
          else if (r < 0.88) type = 'rest';
          else type = 'shop';
        }
        nodes.push({ type: type, x: n, y: f, connections: [], visited: false, locked: f > 0 });
      }
      map.push(nodes);
    }
    for (var f = 0; f < floors - 1; f++) {
      for (var n = 0; n < map[f].length; n++) {
        var node = map[f][n];
        var next = map[f + 1];
        var minC = Math.max(0, n - 1);
        var maxC = Math.min(next.length - 1, n + 1);
        node.connections = [];
        for (var c = minC; c <= maxC; c++) node.connections.push(c);
      }
    }
    map[0][0].locked = false;
    map[0][0].visited = true;
    var firstConnections = map[0][0].connections;
    if (firstConnections && map.length > 1) {
      for (var i = 0; i < firstConnections.length; i++) {
        map[1][firstConnections[i]].locked = false;
      }
    }
    return map;
  }

  function createInitialState() {
    var deck = [
      cloneCard(CardsDB.strike), cloneCard(CardsDB.strike), cloneCard(CardsDB.strike),
      cloneCard(CardsDB.strike), cloneCard(CardsDB.strike),
      cloneCard(CardsDB.defend), cloneCard(CardsDB.defend), cloneCard(CardsDB.defend),
      cloneCard(CardsDB.defend),
      cloneCard(CardsDB.bash)
    ];

    return {
      player: {
        hp: 80, maxHp: 80, block: 0, energy: 3, maxEnergy: 3, gold: 99,
        strength: 0, dexterity: 0, vulnerable: 0, weak: 0,
        loseStrength: 0, regen: 0, flameBarrier: 0,
        metallicize: 0, evolve: 0,
        attackCount: 0, kunaiCount: 0, shurikenCount: 0, penCount: 0,
        potions: []
      },
      enemies: [],
      targetEnemy: 0,
      deck: deck, draw: [], hand: [], discard: [], exhaust: [],
      relics: [cloneCard(RelicsDB.burning_blood)],
      map: generateMap(),
      currentFloor: 0, currentNode: 0,
      phase: 'map', combatTurn: 0, screen: 'title',
      combatCallbacks: [],
      animating: false
    };
  }

  function addRandomRelic(s) {
    var pool = [];
    for (var k in RelicsDB) {
      if (RelicsDB[k].rarity !== 'starter') {
        var owned = false;
        for (var i = 0; i < s.relics.length; i++) {
          if (s.relics[i].id === k) { owned = true; break; }
        }
        if (!owned) pool.push(k);
      }
    }
    if (pool.length > 0) {
      var rid = pool[Math.floor(Math.random() * pool.length)];
      s.relics.push(cloneCard(RelicsDB[rid]));
    }
  }

  function startCombat(s, enemyIds) {
    s.enemies = [];
    for (var i = 0; i < enemyIds.length; i++) {
      s.enemies.push(createEnemy(enemyIds[i]));
    }
    s.targetEnemy = 0;
    s.draw = shuffleArray(s.deck.slice());
    s.hand = [];
    s.discard = [];
    s.exhaust = [];
    s.player.block = 0;
    s.player.energy = s.player.maxEnergy;
    s.player.strength = 0;
    s.player.dexterity = 0;
    s.player.vulnerable = 0;
    s.player.weak = 0;
    s.player.loseStrength = 0;
    s.player.regen = 0;
    s.player.flameBarrier = 0;
    s.player.metallicize = 0;
    s.player.evolve = 0;
    s.player.attackCount = 0;
    s.player.kunaiCount = 0;
    s.player.shurikenCount = 0;
    s.player.penCount = 0;
    s.combatTurn = 0;
    s.combatCallbacks = [];
    s.phase = 'combat';
    drawCards(s, 5);
    for (var i = 0; i < s.relics.length; i++) {
      if (s.relics[i].onCombatStart) s.relics[i].onCombatStart(s);
    }
    for (var i = 0; i < s.enemies.length; i++) {
      s.enemies[i].intent = pickEnemyMove(s.enemies[i]);
    }
  }

  function playCard(s, handIndex, targetIdx) {
    var card = s.hand[handIndex];
    if (!card) return false;
    if (card.cost < 0) return false;
    if (card.cost > s.player.energy) return false;

    s.player.energy -= card.cost;
    var target = s.enemies[targetIdx] || s.enemies[s.targetEnemy] || s.enemies[0];

    if (card.effect) card.effect(s, target);

    for (var i = 0; i < s.relics.length; i++) {
      if (s.relics[i].onCardPlayed) s.relics[i].onCardPlayed(s, card);
    }

    if (card.exhaust) {
      s.exhaust.push(card);
    } else if (card.type !== 'power') {
      s.discard.push(card);
    }
    s.hand.splice(handIndex, 1);

    var allDead = true;
    for (var i = 0; i < s.enemies.length; i++) {
      if (s.enemies[i].hp > 0) { allDead = false; break; }
    }
    if (allDead) {
      s.phase = 'victory';
    }
    return true;
  }

  function enemyTurn(s) {
    for (var i = 0; i < s.enemies.length; i++) {
      var e = s.enemies[i];
      if (e.hp <= 0) continue;

      var move = e.intent;
      if (!move) continue;

      if (move.type === 'attack') {
        var hits = move.hits || 1;
        for (var h = 0; h < hits; h++) {
          if (s.player.hp <= 0) break;
          var dmg = (move.value || 0) + e.strength;
          if (e.weak > 0) dmg = Math.floor(dmg * 0.75);
          dealDamageToPlayer(s, dmg);
          if (s.combatCallbacks) s.combatCallbacks.push({ type: 'enemy_attack', enemyIdx: i });
        }
      } else if (move.type === 'defend') {
        e.block += move.value;
        if (s.combatCallbacks) s.combatCallbacks.push({ type: 'enemy_defend', enemyIdx: i });
      } else if (move.type === 'attack_buff') {
        var dmg = move.atk + e.strength;
        if (e.weak > 0) dmg = Math.floor(dmg * 0.75);
        dealDamageToPlayer(s, dmg);
        e.strength += move.str;
        if (s.combatCallbacks) s.combatCallbacks.push({ type: 'enemy_buff', enemyIdx: i });
      } else if (move.type === 'attack_debuff') {
        var dmg = move.atk + e.strength;
        if (e.weak > 0) dmg = Math.floor(dmg * 0.75);
        dealDamageToPlayer(s, dmg);
        if (move.effect === 'slimed') {
          s.discard.push(cloneCard(WoundCard));
        }
      } else if (move.type === 'buff') {
        if (move.effect === 'strength') e.strength += move.value;
      } else if (move.type === 'debuff') {
        if (move.effect === 'weaken') s.player.weak += move.value;
        else if (move.effect === 'steal') {
          var stolen = Math.min(s.player.gold, move.value);
          s.player.gold -= stolen;
        }
      }

      e.vulnerable = Math.max(0, e.vulnerable - 1);
      e.weak = Math.max(0, e.weak - 1);
    }

    if (s.player.hp <= 0) {
      s.player.hp = 0;
      s.phase = 'defeat';
      return;
    }

    s.player.vulnerable = Math.max(0, s.player.vulnerable - 1);
    s.player.weak = Math.max(0, s.player.weak - 1);

    if (s.player.flameBarrier > 0) s.player.flameBarrier = Math.max(0, s.player.flameBarrier - 1);
  }

  function endTurn(s) {
    enemyTurn(s);
    if (s.phase === 'defeat') return;

    s.player.block = 0;
    if (s.player.metallicize > 0) s.player.block += s.player.metallicize;
    if (s.player.regen > 0) {
      s.player.hp = Math.min(s.player.maxHp, s.player.hp + s.player.regen);
      s.player.regen--;
    }
    if (s.player.loseStrength > 0) {
      s.player.strength -= s.player.loseStrength;
      s.player.loseStrength = 0;
    }

    s.combatTurn++;

    for (var i = s.hand.length - 1; i >= 0; i--) {
      s.discard.push(s.hand[i]);
    }
    s.hand = [];
    s.player.energy = s.player.maxEnergy;
    drawCards(s, 5);

    for (var i = 0; i < s.relics.length; i++) {
      if (s.relics[i].onTurnStart) s.relics[i].onTurnStart(s);
    }

    for (var i = 0; i < s.enemies.length; i++) {
      if (s.enemies[i].hp > 0) {
        s.enemies[i].block = 0;
        s.enemies[i].intent = pickEnemyMove(s.enemies[i]);
      }
    }
  }

  function getBattleRewards(s) {
    var gold = 10 + Math.floor(Math.random() * 20);
    s.player.gold += gold;
    for (var i = 0; i < s.relics.length; i++) {
      if (s.relics[i].onCombatEnd) s.relics[i].onCombatEnd(s);
    }
    var pool = [];
    for (var k in CardsDB) {
      if (CardsDB[k].rarity !== 'basic' && CardsDB[k].rarity !== 'status') pool.push(k);
    }
    var rewards = [];
    var used = {};
    for (var i = 0; i < 3; i++) {
      var idx;
      do { idx = Math.floor(Math.random() * pool.length); } while (used[idx]);
      used[idx] = true;
      rewards.push(pool[idx]);
    }
    return { gold: gold, cards: rewards };
  }

  function getEnemyList(type) {
    var pools = {
      battle: [['jaw_worm'], ['louse_green', 'louse_red'], ['slime_small', 'slime_small', 'slime_small'], ['fungi_beast', 'fungi_beast'], ['louse_green', 'louse_green']],
      elite: [['gremlin_nob'], ['cultist']],
      boss: [['hexaghost'], ['slime_boss']]
    };
    var pool = pools[type] || pools.battle;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  window.SpireGame = {
    CardsDB: CardsDB,
    EnemiesDB: EnemiesDB,
    EventsDB: EventsDB,
    RelicsDB: RelicsDB,
    PotionsDB: PotionsDB,
    ShopCards: ShopCards,
    createInitialState: createInitialState,
    startCombat: startCombat,
    playCard: playCard,
    endTurn: endTurn,
    getBattleRewards: getBattleRewards,
    addCardToDeck: function(s, id) { s.deck.push(cloneCard(CardsDB[id])); },
    healPlayer: function(s, a) { s.player.hp = Math.min(s.player.maxHp, s.player.hp + a); },
    navigateToNode: function(s, f, n) {
      var node = s.map[f][n];
      if (node.locked || node.visited) return false;
      node.visited = true;
      s.currentFloor = f;
      s.currentNode = n;
      for (var i = 0; i < s.map[f].length; i++) {
        if (i !== n) s.map[f][i].locked = true;
      }
      var nf = f + 1;
      if (nf < s.map.length) {
        for (var i = 0; i < s.map[nf].length; i++) s.map[nf][i].locked = true;
        for (var i = 0; i < node.connections.length; i++) s.map[nf][node.connections[i]].locked = false;
      }
      return true;
    },
    getEnemyList: getEnemyList,
    drawCards: drawCards,
    shuffleArray: shuffleArray,
    cloneCard: cloneCard,
    addRandomRelic: addRandomRelic
  };
})();
