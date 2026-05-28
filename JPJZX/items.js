// ==================== 物品数据库 - 385 种物品 ====================
const ITEMS_DATABASE = {
    // ==================== 绿色品质物品 (80 个) ====================
    green: [
        // 武器类 (12个)
        { id: 'g_w_1', name: '破损手枪', icon: '🔫', quality: 'green', baseValue: 150, width: 2, height: 1, category: 'weapon' },
        { id: 'g_w_2', name: '旧匕首', icon: '🗡️', quality: 'green', baseValue: 120, width: 1, height: 2, category: 'weapon' },
        { id: 'g_w_3', name: '生锈砍刀', icon: '🔪', quality: 'green', baseValue: 130, width: 1, height: 2, category: 'weapon' },
        { id: 'g_w_4', name: '玩具枪', icon: '🔫', quality: 'green', baseValue: 80, width: 2, height: 1, category: 'weapon' },
        { id: 'g_w_5', name: '弹弓', icon: '🏹', quality: 'green', baseValue: 100, width: 1, height: 1, category: 'weapon' },
        { id: 'g_w_6', name: '小刀', icon: '🔪', quality: 'green', baseValue: 100, width: 1, height: 1, category: 'weapon' },
        { id: 'g_w_7', name: '斧头', icon: '🪓', quality: 'green', baseValue: 160, width: 1, height: 2, category: 'weapon' },
        { id: 'g_w_8', name: '手榴弹', icon: '💣', quality: 'green', baseValue: 200, width: 1, height: 1, category: 'weapon' },
        { id: 'g_w_9', name: '烟雾弹', icon: '💨', quality: 'green', baseValue: 150, width: 1, height: 1, category: 'weapon' },
        { id: 'g_w_10', name: '闪光弹', icon: '✨', quality: 'green', baseValue: 180, width: 1, height: 1, category: 'weapon' },
        { id: 'g_w_11', name: '铁棍', icon: '🏏', quality: 'green', baseValue: 90, width: 2, height: 1, category: 'weapon' },
        { id: 'g_w_12', name: '弹匣', icon: '📦', quality: 'green', baseValue: 110, width: 1, height: 1, category: 'weapon' },

        // 护甲类 (10个)
        { id: 'g_a_1', name: '破头盔', icon: '⛑️', quality: 'green', baseValue: 140, width: 1, height: 1, category: 'armor' },
        { id: 'g_a_2', name: '旧护膝', icon: '🦵', quality: 'green', baseValue: 110, width: 1, height: 1, category: 'armor' },
        { id: 'g_a_3', name: '磨损手套', icon: '🧤', quality: 'green', baseValue: 90, width: 1, height: 1, category: 'armor' },
        { id: 'g_a_4', name: '简易护目镜', icon: '🥽', quality: 'green', baseValue: 120, width: 1, height: 1, category: 'armor' },
        { id: 'g_a_5', name: '破布护甲', icon: '🦺', quality: 'green', baseValue: 150, width: 2, height: 2, category: 'armor' },
        { id: 'g_a_6', name: '皮带', icon: '👖', quality: 'green', baseValue: 85, width: 2, height: 1, category: 'armor' },
        { id: 'g_a_7', name: '布帽', icon: '🎩', quality: 'green', baseValue: 75, width: 1, height: 1, category: 'armor' },
        { id: 'g_a_8', name: '旧围巾', icon: '🧣', quality: 'green', baseValue: 65, width: 1, height: 1, category: 'armor' },
        { id: 'g_a_9', name: '草鞋', icon: '👟', quality: 'green', baseValue: 70, width: 1, height: 1, category: 'armor' },
        { id: 'g_a_10', name: '简易盾牌', icon: '🛡️', quality: 'green', baseValue: 160, width: 2, height: 2, category: 'armor' },

        // 医疗类 (10个)
        { id: 'g_m_1', name: '绷带', icon: '🩹', quality: 'green', baseValue: 100, width: 1, height: 1, category: 'medical' },
        { id: 'g_m_2', name: '消毒棉', icon: '🧻', quality: 'green', baseValue: 80, width: 1, height: 1, category: 'medical' },
        { id: 'g_m_3', name: '止痛药', icon: '💊', quality: 'green', baseValue: 120, width: 1, height: 1, category: 'medical' },
        { id: 'g_m_4', name: '创可贴', icon: '🩹', quality: 'green', baseValue: 70, width: 1, height: 1, category: 'medical' },
        { id: 'g_m_5', name: '冰袋', icon: '🧊', quality: 'green', baseValue: 90, width: 1, height: 1, category: 'medical' },
        { id: 'g_m_6', name: '酒精棉', icon: '🧴', quality: 'green', baseValue: 85, width: 1, height: 1, category: 'medical' },
        { id: 'g_m_7', name: '纱布卷', icon: '🧻', quality: 'green', baseValue: 95, width: 1, height: 1, category: 'medical' },
        { id: 'g_m_8', name: '退烧贴', icon: '🩹', quality: 'green', baseValue: 75, width: 1, height: 1, category: 'medical' },
        { id: 'g_m_9', name: '感冒药', icon: '💊', quality: 'green', baseValue: 110, width: 1, height: 1, category: 'medical' },
        { id: 'g_m_10', name: '维生素', icon: '💊', quality: 'green', baseValue: 60, width: 1, height: 1, category: 'medical' },

        // 电子类 (10个)
        { id: 'g_e_1', name: '旧电池', icon: '🔋', quality: 'green', baseValue: 110, width: 1, height: 1, category: 'electronic' },
        { id: 'g_e_2', name: '电线', icon: '🔌', quality: 'green', baseValue: 100, width: 1, height: 1, category: 'electronic' },
        { id: 'g_e_3', name: '小灯泡', icon: '💡', quality: 'green', baseValue: 90, width: 1, height: 1, category: 'electronic' },
        { id: 'g_e_4', name: '旧手机', icon: '📱', quality: 'green', baseValue: 150, width: 1, height: 2, category: 'electronic' },
        { id: 'g_e_5', name: '指南针', icon: '🧭', quality: 'green', baseValue: 150, width: 1, height: 1, category: 'electronic' },
        { id: 'g_e_6', name: '收音机', icon: '📻', quality: 'green', baseValue: 130, width: 2, height: 1, category: 'electronic' },
        { id: 'g_e_7', name: '计算器', icon: '🔢', quality: 'green', baseValue: 100, width: 1, height: 1, category: 'electronic' },
        { id: 'g_e_8', name: '遥控器', icon: '🎮', quality: 'green', baseValue: 80, width: 1, height: 1, category: 'electronic' },
        { id: 'g_e_9', name: '耳机', icon: '🎧', quality: 'green', baseValue: 120, width: 1, height: 1, category: 'electronic' },
        { id: 'g_e_10', name: '充电线', icon: '🔌', quality: 'green', baseValue: 70, width: 1, height: 1, category: 'electronic' },

        // 贵重物品 (10个)
        { id: 'g_v_1', name: '铜币', icon: '🪙', quality: 'green', baseValue: 100, width: 1, height: 1, category: 'valuable' },
        { id: 'g_v_2', name: '玻璃珠', icon: '🔮', quality: 'green', baseValue: 120, width: 1, height: 1, category: 'valuable' },
        { id: 'g_v_3', name: '旧邮票', icon: '📮', quality: 'green', baseValue: 110, width: 1, height: 1, category: 'valuable' },
        { id: 'g_v_4', name: '贝壳', icon: '🐚', quality: 'green', baseValue: 90, width: 1, height: 1, category: 'valuable' },
        { id: 'g_v_5', name: '彩色石头', icon: '🪨', quality: 'green', baseValue: 100, width: 1, height: 1, category: 'valuable' },
        { id: 'g_v_6', name: '旧徽章', icon: '🏅', quality: 'green', baseValue: 130, width: 1, height: 1, category: 'valuable' },
        { id: 'g_v_7', name: '老照片', icon: '📷', quality: 'green', baseValue: 80, width: 1, height: 1, category: 'valuable' },
        { id: 'g_v_8', name: '旧书签', icon: '🔖', quality: 'green', baseValue: 60, width: 1, height: 1, category: 'valuable' },
        { id: 'g_v_9', name: '小铃铛', icon: '🔔', quality: 'green', baseValue: 85, width: 1, height: 1, category: 'valuable' },
        { id: 'g_v_10', name: '旧怀表', icon: '⌚', quality: 'green', baseValue: 140, width: 1, height: 1, category: 'valuable' },

        // 材料类 (12个)
        { id: 'g_s_1', name: '废铁', icon: '🔩', quality: 'green', baseValue: 80, width: 1, height: 1, category: 'material' },
        { id: 'g_s_2', name: '旧零件', icon: '⚙️', quality: 'green', baseValue: 120, width: 1, height: 1, category: 'material' },
        { id: 'g_s_3', name: '木板', icon: '🪵', quality: 'green', baseValue: 100, width: 2, height: 1, category: 'material' },
        { id: 'g_s_4', name: '塑料片', icon: '📄', quality: 'green', baseValue: 70, width: 1, height: 1, category: 'material' },
        { id: 'g_s_5', name: '橡胶块', icon: '🧱', quality: 'green', baseValue: 110, width: 1, height: 1, category: 'material' },
        { id: 'g_s_6', name: '螺丝钉', icon: '🔩', quality: 'green', baseValue: 50, width: 1, height: 1, category: 'material' },
        { id: 'g_s_7', name: '弹簧', icon: '🌀', quality: 'green', baseValue: 60, width: 1, height: 1, category: 'material' },
        { id: 'g_s_8', name: '胶带', icon: '🧻', quality: 'green', baseValue: 40, width: 1, height: 1, category: 'material' },
        { id: 'g_s_9', name: '砂纸', icon: '📄', quality: 'green', baseValue: 55, width: 1, height: 1, category: 'material' },
        { id: 'g_s_10', name: '油漆罐', icon: '🪣', quality: 'green', baseValue: 95, width: 1, height: 1, category: 'material' },
        { id: 'g_s_11', name: '生锈链条', icon: '⛓️', quality: 'green', baseValue: 100, width: 1, height: 1, category: 'material' },
        { id: 'g_s_12', name: '旧报纸', icon: '📰', quality: 'green', baseValue: 60, width: 1, height: 1, category: 'material' },

        // 容器类 (8个)
        { id: 'g_c_1', name: '小工具盒', icon: '🧰', quality: 'green', baseValue: 150, width: 2, height: 1, category: 'container' },
        { id: 'g_c_2', name: '弹药袋', icon: '🎒', quality: 'green', baseValue: 140, width: 1, height: 2, category: 'container' },
        { id: 'g_c_3', name: '旧背包', icon: '🎒', quality: 'green', baseValue: 160, width: 2, height: 2, category: 'container' },
        { id: 'g_c_4', name: '铁皮箱', icon: '📦', quality: 'green', baseValue: 130, width: 2, height: 1, category: 'container' },
        { id: 'g_c_5', name: '布袋', icon: '👝', quality: 'green', baseValue: 80, width: 1, height: 1, category: 'container' },
        { id: 'g_c_6', name: '木箱', icon: '📦', quality: 'green', baseValue: 120, width: 2, height: 2, category: 'container' },
        { id: 'g_c_7', name: '塑料桶', icon: '🪣', quality: 'green', baseValue: 90, width: 1, height: 1, category: 'container' },
        { id: 'g_c_8', name: '纸盒', icon: '📦', quality: 'green', baseValue: 60, width: 1, height: 1, category: 'container' },

        // 特殊类 (8个)
        { id: 'g_x_1', name: '神秘碎片', icon: '✨', quality: 'green', baseValue: 180, width: 1, height: 1, category: 'special' },
        { id: 'g_x_2', name: '古老硬币', icon: '🪙', quality: 'green', baseValue: 200, width: 1, height: 1, category: 'special' },
        { id: 'g_x_3', name: '幸运四叶草', icon: '🍀', quality: 'green', baseValue: 170, width: 1, height: 1, category: 'special' },
        { id: 'g_x_4', name: '护身符', icon: '📿', quality: 'green', baseValue: 190, width: 1, height: 1, category: 'special' },
        { id: 'g_x_5', name: '水晶碎片', icon: '💎', quality: 'green', baseValue: 210, width: 1, height: 1, category: 'special' },
        { id: 'g_x_6', name: '魔法粉尘', icon: '✨', quality: 'green', baseValue: 160, width: 1, height: 1, category: 'special' },
        { id: 'g_x_7', name: '古卷残页', icon: '📜', quality: 'green', baseValue: 150, width: 1, height: 1, category: 'special' },
        { id: 'g_x_8', name: '星象图', icon: '🗺️', quality: 'green', baseValue: 175, width: 2, height: 1, category: 'special' }
    ],

    // ==================== 蓝色品质物品 (70 个) ====================
    blue: [
        // 武器类 (12个)
        { id: 'b_w_1', name: '军用匕首', icon: '🗡️', quality: 'blue', baseValue: 350, width: 1, height: 2, category: 'weapon' },
        { id: 'b_w_2', name: '战术手枪', icon: '🔫', quality: 'blue', baseValue: 450, width: 2, height: 1, category: 'weapon' },
        { id: 'b_w_3', name: '冲锋枪', icon: '🔫', quality: 'blue', baseValue: 500, width: 3, height: 1, category: 'weapon' },
        { id: 'b_w_4', name: '霰弹枪', icon: '🔫', quality: 'blue', baseValue: 480, width: 3, height: 1, category: 'weapon' },
        { id: 'b_w_5', name: '弩', icon: '🏹', quality: 'blue', baseValue: 400, width: 2, height: 1, category: 'weapon' },
        { id: 'b_w_6', name: '电击枪', icon: '⚡', quality: 'blue', baseValue: 380, width: 1, height: 1, category: 'weapon' },
        { id: 'b_w_7', name: '战术刀', icon: '🔪', quality: 'blue', baseValue: 380, width: 1, height: 2, category: 'weapon' },
        { id: 'b_w_8', name: '消音器', icon: '🔇', quality: 'blue', baseValue: 480, width: 2, height: 1, category: 'weapon' },
        { id: 'b_w_9', name: '瞄准镜', icon: '🎯', quality: 'blue', baseValue: 450, width: 2, height: 1, category: 'electronic' },
        { id: 'b_w_10', name: '子弹箱', icon: '📦', quality: 'blue', baseValue: 420, width: 2, height: 1, category: 'container' },
        { id: 'b_w_11', name: '防暴盾', icon: '🛡️', quality: 'blue', baseValue: 520, width: 2, height: 3, category: 'weapon' },
        { id: 'b_w_12', name: '信号枪', icon: '🔫', quality: 'blue', baseValue: 360, width: 2, height: 1, category: 'weapon' },

        // 护甲类 (10个)
        { id: 'b_a_1', name: '战术头盔', icon: '⛑️', quality: 'blue', baseValue: 400, width: 1, height: 1, category: 'armor' },
        { id: 'b_a_2', name: '防弹背心', icon: '🦺', quality: 'blue', baseValue: 550, width: 2, height: 2, category: 'armor' },
        { id: 'b_a_3', name: '护腿板', icon: '🦵', quality: 'blue', baseValue: 350, width: 1, height: 2, category: 'armor' },
        { id: 'b_a_4', name: '战术手套', icon: '🧤', quality: 'blue', baseValue: 300, width: 1, height: 1, category: 'armor' },
        { id: 'b_a_5', name: '护目镜', icon: '🥽', quality: 'blue', baseValue: 320, width: 1, height: 1, category: 'armor' },
        { id: 'b_a_6', name: '战术背包', icon: '🎒', quality: 'blue', baseValue: 500, width: 2, height: 3, category: 'container' },
        { id: 'b_a_7', name: '防割手套', icon: '🧤', quality: 'blue', baseValue: 280, width: 1, height: 1, category: 'armor' },
        { id: 'b_a_8', name: '战术腰带', icon: '👖', quality: 'blue', baseValue: 320, width: 2, height: 1, category: 'armor' },
        { id: 'b_a_9', name: '战术靴', icon: '👢', quality: 'blue', baseValue: 400, width: 2, height: 1, category: 'armor' },
        { id: 'b_a_10', name: '防毒面具', icon: '😷', quality: 'blue', baseValue: 380, width: 1, height: 1, category: 'armor' },

        // 医疗类 (10个)
        { id: 'b_m_1', name: '急救包', icon: '🏥', quality: 'blue', baseValue: 350, width: 1, height: 1, category: 'medical' },
        { id: 'b_m_2', name: '手术刀', icon: '🔪', quality: 'blue', baseValue: 380, width: 1, height: 1, category: 'medical' },
        { id: 'b_m_3', name: '注射器', icon: '💉', quality: 'blue', baseValue: 320, width: 1, height: 1, category: 'medical' },
        { id: 'b_m_4', name: '夹板', icon: '🦴', quality: 'blue', baseValue: 300, width: 1, height: 2, category: 'medical' },
        { id: 'b_m_5', name: '止血带', icon: '🩸', quality: 'blue', baseValue: 280, width: 1, height: 1, category: 'medical' },
        { id: 'b_m_6', name: '氧气瓶', icon: '🫁', quality: 'blue', baseValue: 450, width: 1, height: 2, category: 'medical' },
        { id: 'b_m_7', name: '解毒剂', icon: '💉', quality: 'blue', baseValue: 400, width: 1, height: 1, category: 'medical' },
        { id: 'b_m_8', name: '兴奋剂', icon: '💊', quality: 'blue', baseValue: 380, width: 1, height: 1, category: 'medical' },
        { id: 'b_m_9', name: '营养液', icon: '🧪', quality: 'blue', baseValue: 350, width: 1, height: 1, category: 'medical' },
        { id: 'b_m_10', name: '血液袋', icon: '🩸', quality: 'blue', baseValue: 320, width: 1, height: 1, category: 'medical' },

        // 电子类 (10个)
        { id: 'b_e_1', name: '对讲机', icon: '📻', quality: 'blue', baseValue: 400, width: 1, height: 2, category: 'electronic' },
        { id: 'b_e_2', name: '无人机', icon: '🚁', quality: 'blue', baseValue: 550, width: 2, height: 2, category: 'electronic' },
        { id: 'b_e_3', name: 'GPS定位器', icon: '🛰️', quality: 'blue', baseValue: 450, width: 1, height: 1, category: 'electronic' },
        { id: 'b_e_4', name: '夜视仪', icon: '👓', quality: 'blue', baseValue: 500, width: 2, height: 1, category: 'electronic' },
        { id: 'b_e_5', name: '雷达模块', icon: '📡', quality: 'blue', baseValue: 480, width: 1, height: 1, category: 'electronic' },
        { id: 'b_e_6', name: '电路板', icon: '🖥️', quality: 'blue', baseValue: 420, width: 2, height: 1, category: 'electronic' },
        { id: 'b_e_7', name: '战术手电', icon: '🔦', quality: 'blue', baseValue: 300, width: 1, height: 1, category: 'electronic' },
        { id: 'b_e_8', name: '激光指示器', icon: '🔴', quality: 'blue', baseValue: 380, width: 1, height: 1, category: 'electronic' },
        { id: 'b_e_9', name: '显微镜', icon: '🔬', quality: 'blue', baseValue: 550, width: 2, height: 2, category: 'electronic' },
        { id: 'b_e_10', name: '示波器', icon: '📈', quality: 'blue', baseValue: 520, width: 2, height: 1, category: 'electronic' },

        // 贵重物品 (8个)
        { id: 'b_v_1', name: '银条', icon: '🥈', quality: 'blue', baseValue: 500, width: 1, height: 1, category: 'valuable' },
        { id: 'b_v_2', name: '金戒指', icon: '💍', quality: 'blue', baseValue: 550, width: 1, height: 1, category: 'valuable' },
        { id: 'b_v_3', name: '玉佩', icon: '💎', quality: 'blue', baseValue: 600, width: 1, height: 1, category: 'valuable' },
        { id: 'b_v_4', name: '怀表', icon: '⌚', quality: 'blue', baseValue: 480, width: 1, height: 1, category: 'valuable' },
        { id: 'b_v_5', name: '古董硬币', icon: '🪙', quality: 'blue', baseValue: 520, width: 1, height: 1, category: 'valuable' },
        { id: 'b_v_6', name: '珍珠项链', icon: '📿', quality: 'blue', baseValue: 580, width: 1, height: 1, category: 'valuable' },
        { id: 'b_v_7', name: '翡翠手镯', icon: '💎', quality: 'blue', baseValue: 560, width: 1, height: 1, category: 'valuable' },
        { id: 'b_v_8', name: '古董花瓶', icon: '🏺', quality: 'blue', baseValue: 530, width: 1, height: 2, category: 'valuable' },

        // 材料类 (8个)
        { id: 'b_s_1', name: '钛合金板', icon: '🔩', quality: 'blue', baseValue: 400, width: 2, height: 1, category: 'material' },
        { id: 'b_s_2', name: '碳纤维', icon: '🧱', quality: 'blue', baseValue: 450, width: 2, height: 1, category: 'material' },
        { id: 'b_s_3', name: '精密齿轮', icon: '⚙️', quality: 'blue', baseValue: 380, width: 1, height: 1, category: 'material' },
        { id: 'b_s_4', name: '激光晶体', icon: '💠', quality: 'blue', baseValue: 500, width: 1, height: 1, category: 'material' },
        { id: 'b_s_5', name: '超导线圈', icon: '🌀', quality: 'blue', baseValue: 480, width: 1, height: 1, category: 'material' },
        { id: 'b_s_6', name: '记忆合金', icon: '🔩', quality: 'blue', baseValue: 420, width: 1, height: 1, category: 'material' },
        { id: 'b_s_7', name: '光纤', icon: '💡', quality: 'blue', baseValue: 390, width: 1, height: 1, category: 'material' },
        { id: 'b_s_8', name: '半导体', icon: '🔲', quality: 'blue', baseValue: 410, width: 1, height: 1, category: 'material' },

        // 容器类 (6个)
        { id: 'b_c_1', name: '武器箱', icon: '📦', quality: 'blue', baseValue: 500, width: 3, height: 2, category: 'container' },
        { id: 'b_c_2', name: '医疗箱', icon: '🏥', quality: 'blue', baseValue: 480, width: 2, height: 2, category: 'container' },
        { id: 'b_c_3', name: '工具套装', icon: '🧰', quality: 'blue', baseValue: 450, width: 2, height: 2, category: 'container' },
        { id: 'b_c_4', name: '弹药箱', icon: '📦', quality: 'blue', baseValue: 460, width: 2, height: 1, category: 'container' },
        { id: 'b_c_5', name: '电子设备箱', icon: '📦', quality: 'blue', baseValue: 470, width: 2, height: 2, category: 'container' },
        { id: 'b_c_6', name: '野战背囊', icon: '🎒', quality: 'blue', baseValue: 440, width: 2, height: 2, category: 'container' },

        // 特殊类 (6个)
        { id: 'b_x_1', name: '能量碎片', icon: '⚡', quality: 'blue', baseValue: 550, width: 1, height: 1, category: 'special' },
        { id: 'b_x_2', name: '时空胶囊', icon: '💊', quality: 'blue', baseValue: 600, width: 1, height: 1, category: 'special' },
        { id: 'b_x_3', name: '量子纠缠态', icon: '🌀', quality: 'blue', baseValue: 650, width: 1, height: 1, category: 'special' },
        { id: 'b_x_4', name: '密码本', icon: '📖', quality: 'blue', baseValue: 520, width: 1, height: 1, category: 'special' },
        { id: 'b_x_5', name: '情报文件', icon: '📄', quality: 'blue', baseValue: 480, width: 1, height: 1, category: 'special' },
        { id: 'b_x_6', name: '加密U盘', icon: '💾', quality: 'blue', baseValue: 530, width: 1, height: 1, category: 'special' }
    ],

    // ==================== 紫色品质物品 (60 个) ====================
    purple: [
        // 武器类 (10个)
        { id: 'p_w_1', name: '突击步枪', icon: '🔫', quality: 'purple', baseValue: 900, width: 3, height: 2, category: 'weapon' },
        { id: 'p_w_2', name: '狙击步枪', icon: '🎯', quality: 'purple', baseValue: 1100, width: 4, height: 1, category: 'weapon' },
        { id: 'p_w_3', name: '轻机枪', icon: '🔫', quality: 'purple', baseValue: 1000, width: 3, height: 2, category: 'weapon' },
        { id: 'p_w_4', name: '火箭筒', icon: '🚀', quality: 'purple', baseValue: 1200, width: 4, height: 1, category: 'weapon' },
        { id: 'p_w_5', name: '能量武器', icon: '⚡', quality: 'purple', baseValue: 1150, width: 3, height: 1, category: 'weapon' },
        { id: 'p_w_6', name: '等离子枪', icon: '🔮', quality: 'purple', baseValue: 1050, width: 3, height: 1, category: 'weapon' },
        { id: 'p_w_7', name: '磁轨炮', icon: '🎯', quality: 'purple', baseValue: 1100, width: 4, height: 1, category: 'weapon' },
        { id: 'p_w_8', name: '激光炮', icon: '🔦', quality: 'purple', baseValue: 1050, width: 3, height: 2, category: 'weapon' },
        { id: 'p_w_9', name: '离子炮', icon: '⚡', quality: 'purple', baseValue: 1000, width: 3, height: 2, category: 'weapon' },
        { id: 'p_w_10', name: '微波武器', icon: '📡', quality: 'purple', baseValue: 950, width: 3, height: 1, category: 'weapon' },

        // 护甲类 (8个)
        { id: 'p_a_1', name: '动力装甲', icon: '🤖', quality: 'purple', baseValue: 1200, width: 3, height: 3, category: 'armor' },
        { id: 'p_a_2', name: '隐形斗篷', icon: '👻', quality: 'purple', baseValue: 1100, width: 2, height: 2, category: 'armor' },
        { id: 'p_a_3', name: '能量护盾', icon: '🛡️', quality: 'purple', baseValue: 1000, width: 2, height: 2, category: 'armor' },
        { id: 'p_a_4', name: '战术外骨骼', icon: '🦴', quality: 'purple', baseValue: 1150, width: 2, height: 3, category: 'armor' },
        { id: 'p_a_5', name: '纳米战甲', icon: '⚔️', quality: 'purple', baseValue: 1250, width: 3, height: 2, category: 'armor' },
        { id: 'p_a_6', name: '磁悬浮靴', icon: '👢', quality: 'purple', baseValue: 900, width: 1, height: 1, category: 'armor' },
        { id: 'p_a_7', name: '光学迷彩', icon: '🎭', quality: 'purple', baseValue: 1050, width: 2, height: 2, category: 'armor' },
        { id: 'p_a_8', name: '力场发生器', icon: '⭕', quality: 'purple', baseValue: 1100, width: 2, height: 2, category: 'armor' },

        // 医疗类 (8个)
        { id: 'p_m_1', name: '纳米修复器', icon: '🔬', quality: 'purple', baseValue: 900, width: 2, height: 1, category: 'medical' },
        { id: 'p_m_2', name: '基因药剂', icon: '🧬', quality: 'purple', baseValue: 1000, width: 1, height: 1, category: 'medical' },
        { id: 'p_m_3', name: '再生胶囊', icon: '💊', quality: 'purple', baseValue: 950, width: 1, height: 1, category: 'medical' },
        { id: 'p_m_4', name: '生命维持装置', icon: '❤️', quality: 'purple', baseValue: 1100, width: 2, height: 2, category: 'medical' },
        { id: 'p_m_5', name: '克隆舱', icon: '🛸', quality: 'purple', baseValue: 1300, width: 3, height: 2, category: 'medical' },
        { id: 'p_m_6', name: '细胞活化器', icon: '🧫', quality: 'purple', baseValue: 980, width: 2, height: 1, category: 'medical' },
        { id: 'p_m_7', name: '神经修复液', icon: '🧪', quality: 'purple', baseValue: 1020, width: 1, height: 1, category: 'medical' },
        { id: 'p_m_8', name: '器官培养皿', icon: '🧫', quality: 'purple', baseValue: 1150, width: 2, height: 2, category: 'medical' },

        // 电子类 (8个)
        { id: 'p_e_1', name: '量子芯片', icon: '💾', quality: 'purple', baseValue: 1000, width: 1, height: 1, category: 'electronic' },
        { id: 'p_e_2', name: 'AI核心', icon: '🧠', quality: 'purple', baseValue: 1200, width: 2, height: 2, category: 'electronic' },
        { id: 'p_e_3', name: '全息投影仪', icon: '📽️', quality: 'purple', baseValue: 950, width: 2, height: 2, category: 'electronic' },
        { id: 'p_e_4', name: '空间跳跃器', icon: '🌀', quality: 'purple', baseValue: 1150, width: 2, height: 2, category: 'electronic' },
        { id: 'p_e_5', name: '反重力装置', icon: '🎈', quality: 'purple', baseValue: 1100, width: 2, height: 2, category: 'electronic' },
        { id: 'p_e_6', name: '心灵感应器', icon: '🔮', quality: 'purple', baseValue: 1050, width: 2, height: 2, category: 'electronic' },
        { id: 'p_e_7', name: '电磁脉冲器', icon: '⚡', quality: 'purple', baseValue: 1000, width: 2, height: 1, category: 'electronic' },
        { id: 'p_e_8', name: '相位转换器', icon: '🌀', quality: 'purple', baseValue: 1080, width: 2, height: 2, category: 'electronic' },

        // 贵重物品 (8个)
        { id: 'p_v_1', name: '金条', icon: '🥇', quality: 'purple', baseValue: 1000, width: 2, height: 1, category: 'valuable' },
        { id: 'p_v_2', name: '钻石', icon: '💎', quality: 'purple', baseValue: 1200, width: 1, height: 1, category: 'valuable' },
        { id: 'p_v_3', name: '红宝石', icon: '🔴', quality: 'purple', baseValue: 1100, width: 1, height: 1, category: 'valuable' },
        { id: 'p_v_4', name: '蓝宝石', icon: '🔵', quality: 'purple', baseValue: 1100, width: 1, height: 1, category: 'valuable' },
        { id: 'p_v_5', name: '祖母绿', icon: '💚', quality: 'purple', baseValue: 1150, width: 1, height: 1, category: 'valuable' },
        { id: 'p_v_6', name: '黑珍珠', icon: '🔮', quality: 'purple', baseValue: 1050, width: 1, height: 1, category: 'valuable' },
        { id: 'p_v_7', name: '帝王玉', icon: '💎', quality: 'purple', baseValue: 1180, width: 1, height: 1, category: 'valuable' },
        { id: 'p_v_8', name: '猫眼石', icon: '👁️', quality: 'purple', baseValue: 1080, width: 1, height: 1, category: 'valuable' },

        // 材料类 (8个)
        { id: 'p_s_1', name: '暗物质', icon: '🌌', quality: 'purple', baseValue: 1200, width: 1, height: 1, category: 'material' },
        { id: 'p_s_2', name: '反物质', icon: '⚛️', quality: 'purple', baseValue: 1300, width: 1, height: 1, category: 'material' },
        { id: 'p_s_3', name: '零点能量', icon: '⭕', quality: 'purple', baseValue: 1250, width: 1, height: 1, category: 'material' },
        { id: 'p_s_4', name: '时空结晶', icon: '💠', quality: 'purple', baseValue: 1150, width: 1, height: 1, category: 'material' },
        { id: 'p_s_5', name: '星核碎片', icon: '⭐', quality: 'purple', baseValue: 1100, width: 1, height: 1, category: 'material' },
        { id: 'p_s_6', name: '虚空精华', icon: '🌀', quality: 'purple', baseValue: 1180, width: 1, height: 1, category: 'material' },
        { id: 'p_s_7', name: '元素之心', icon: '❤️', quality: 'purple', baseValue: 1220, width: 1, height: 1, category: 'material' },
        { id: 'p_s_8', name: '龙鳞', icon: '🐉', quality: 'purple', baseValue: 1080, width: 1, height: 1, category: 'material' },

        // 容器类 (5个)
        { id: 'p_c_1', name: '空间戒指', icon: '💍', quality: 'purple', baseValue: 1200, width: 1, height: 1, category: 'container' },
        { id: 'p_c_2', name: '次元袋', icon: '🎒', quality: 'purple', baseValue: 1100, width: 2, height: 2, category: 'container' },
        { id: 'p_c_3', name: '储物手镯', icon: '📿', quality: 'purple', baseValue: 1150, width: 1, height: 1, category: 'container' },
        { id: 'p_c_4', name: '折叠空间', icon: '📦', quality: 'purple', baseValue: 1050, width: 2, height: 2, category: 'container' },
        { id: 'p_c_5', name: '量子存储器', icon: '💾', quality: 'purple', baseValue: 1080, width: 1, height: 1, category: 'container' },

        // 特殊类 (5个)
        { id: 'p_x_1', name: '灵魂碎片', icon: '👻', quality: 'purple', baseValue: 1100, width: 1, height: 1, category: 'special' },
        { id: 'p_x_2', name: '命运之轮', icon: '🎡', quality: 'purple', baseValue: 1250, width: 2, height: 2, category: 'special' },
        { id: 'p_x_3', name: '真理之书', icon: '📖', quality: 'purple', baseValue: 1300, width: 2, height: 3, category: 'special' },
        { id: 'p_x_4', name: '预言水晶球', icon: '🔮', quality: 'purple', baseValue: 1150, width: 2, height: 2, category: 'special' },
        { id: 'p_x_5', name: '传送门卷轴', icon: '📜', quality: 'purple', baseValue: 1200, width: 1, height: 1, category: 'special' }
    ],

    // ==================== 金色品质物品 (50 个) ====================
    gold: [
        // 武器类 (10个)
        { id: 'gd_w_1', name: '传说之剑', icon: '⚔️', quality: 'gold', baseValue: 2500, width: 2, height: 3, category: 'weapon' },
        { id: 'gd_w_2', name: '雷霆之怒', icon: '⚡', quality: 'gold', baseValue: 2600, width: 3, height: 2, category: 'weapon' },
        { id: 'gd_w_3', name: '冰霜哀伤', icon: '❄️', quality: 'gold', baseValue: 2550, width: 2, height: 3, category: 'weapon' },
        { id: 'gd_w_4', name: '烈焰焚天', icon: '🔥', quality: 'gold', baseValue: 2650, width: 3, height: 2, category: 'weapon' },
        { id: 'gd_w_5', name: '暗影之吻', icon: '🌑', quality: 'gold', baseValue: 2700, width: 2, height: 2, category: 'weapon' },
        { id: 'gd_w_6', name: '圣光裁决', icon: '✨', quality: 'gold', baseValue: 2800, width: 3, height: 2, category: 'weapon' },
        { id: 'gd_w_7', name: '混沌之刃', icon: '🌀', quality: 'gold', baseValue: 2750, width: 2, height: 3, category: 'weapon' },
        { id: 'gd_w_8', name: '时空撕裂者', icon: '⏰', quality: 'gold', baseValue: 2900, width: 3, height: 2, category: 'weapon' },
        { id: 'gd_w_9', name: '轩辕剑', icon: '🗡️', quality: 'gold', baseValue: 2800, width: 2, height: 3, category: 'weapon' },
        { id: 'gd_w_10', name: '盘古斧', icon: '🪓', quality: 'gold', baseValue: 2900, width: 2, height: 3, category: 'weapon' },

        // 护甲类 (5个)
        { id: 'gd_a_1', name: '神龙战甲', icon: '🐉', quality: 'gold', baseValue: 2800, width: 3, height: 3, category: 'armor' },
        { id: 'gd_a_2', name: '凤凰羽翼', icon: '🦅', quality: 'gold', baseValue: 2700, width: 3, height: 2, category: 'armor' },
        { id: 'gd_a_3', name: '麒麟护体', icon: '🦄', quality: 'gold', baseValue: 2750, width: 3, height: 3, category: 'armor' },
        { id: 'gd_a_4', name: '白虎战盔', icon: '🐯', quality: 'gold', baseValue: 2600, width: 2, height: 2, category: 'armor' },
        { id: 'gd_a_5', name: '玄武盾', icon: '🐢', quality: 'gold', baseValue: 2650, width: 2, height: 3, category: 'armor' },

        // 医疗类 (5个)
        { id: 'gd_m_1', name: '不死药', icon: '🧪', quality: 'gold', baseValue: 2500, width: 1, height: 1, category: 'medical' },
        { id: 'gd_m_2', name: '长生不老药', icon: '💊', quality: 'gold', baseValue: 2800, width: 1, height: 1, category: 'medical' },
        { id: 'gd_m_3', name: '起死回生丹', icon: '☯️', quality: 'gold', baseValue: 2900, width: 1, height: 1, category: 'medical' },
        { id: 'gd_m_4', name: '生命之泉', icon: '⛲', quality: 'gold', baseValue: 2700, width: 1, height: 2, category: 'medical' },
        { id: 'gd_m_5', name: '治愈圣水', icon: '💧', quality: 'gold', baseValue: 2600, width: 1, height: 1, category: 'medical' },

        // 电子类 (5个)
        { id: 'gd_e_1', name: '宇宙计算机', icon: '🖥️', quality: 'gold', baseValue: 2800, width: 3, height: 3, category: 'electronic' },
        { id: 'gd_e_2', name: '维度通讯器', icon: '📡', quality: 'gold', baseValue: 2700, width: 2, height: 2, category: 'electronic' },
        { id: 'gd_e_3', name: '时间机器', icon: '⏱️', quality: 'gold', baseValue: 3000, width: 3, height: 3, category: 'electronic' },
        { id: 'gd_e_4', name: '空间门', icon: '🌀', quality: 'gold', baseValue: 2900, width: 3, height: 3, category: 'electronic' },
        { id: 'gd_e_5', name: '平行宇宙探测器', icon: '🌌', quality: 'gold', baseValue: 2850, width: 2, height: 2, category: 'electronic' },

        // 贵重物品 (5个)
        { id: 'gd_v_1', name: '和氏璧', icon: '💎', quality: 'gold', baseValue: 2800, width: 1, height: 1, category: 'valuable' },
        { id: 'gd_v_2', name: '传国玉玺', icon: '👑', quality: 'gold', baseValue: 3000, width: 2, height: 2, category: 'valuable' },
        { id: 'gd_v_3', name: '九龙杯', icon: '🏆', quality: 'gold', baseValue: 2900, width: 2, height: 2, category: 'valuable' },
        { id: 'gd_v_4', name: '夜明珠', icon: '🔮', quality: 'gold', baseValue: 2750, width: 1, height: 1, category: 'valuable' },
        { id: 'gd_v_5', name: '金缕玉衣', icon: '👘', quality: 'gold', baseValue: 2850, width: 3, height: 2, category: 'valuable' },

        // 材料类 (5个)
        { id: 'gd_s_1', name: '混沌原石', icon: '🪨', quality: 'gold', baseValue: 2700, width: 2, height: 2, category: 'material' },
        { id: 'gd_s_2', name: '世界树之叶', icon: '🍃', quality: 'gold', baseValue: 2600, width: 1, height: 1, category: 'material' },
        { id: 'gd_s_3', name: '太阳核心', icon: '☀️', quality: 'gold', baseValue: 2900, width: 2, height: 2, category: 'material' },
        { id: 'gd_s_4', name: '月亮精华', icon: '🌙', quality: 'gold', baseValue: 2800, width: 1, height: 1, category: 'material' },
        { id: 'gd_s_5', name: '星辰之力', icon: '⭐', quality: 'gold', baseValue: 2750, width: 1, height: 1, category: 'material' },

        // 容器类 (5个)
        { id: 'gd_c_1', name: '乾坤袋', icon: '🎒', quality: 'gold', baseValue: 2800, width: 2, height: 2, category: 'container' },
        { id: 'gd_c_2', name: '山河社稷图', icon: '🗺️', quality: 'gold', baseValue: 2900, width: 3, height: 2, category: 'container' },
        { id: 'gd_c_3', name: '混沌钟', icon: '🔔', quality: 'gold', baseValue: 3000, width: 2, height: 3, category: 'container' },
        { id: 'gd_c_4', name: '女娲石', icon: '💎', quality: 'gold', baseValue: 2850, width: 1, height: 1, category: 'container' },
        { id: 'gd_c_5', name: '伏羲琴', icon: '🎼', quality: 'gold', baseValue: 2750, width: 3, height: 1, category: 'container' },

        // 特殊类 (10个)
        { id: 'gd_x_1', name: '命运石之门', icon: '🚪', quality: 'gold', baseValue: 2900, width: 2, height: 2, category: 'special' },
        { id: 'gd_x_2', name: '贤者之石', icon: '🔮', quality: 'gold', baseValue: 2800, width: 1, height: 1, category: 'special' },
        { id: 'gd_x_3', name: '创世神之力', icon: '👼', quality: 'gold', baseValue: 3000, width: 2, height: 2, category: 'special' },
        { id: 'gd_x_4', name: '琴', icon: '🎼', quality: 'gold', baseValue: 2600, width: 3, height: 1, category: 'special' },
        { id: 'gd_x_5', name: '棋', icon: '♟️', quality: 'gold', baseValue: 2650, width: 2, height: 2, category: 'special' },
        { id: 'gd_x_6', name: '书', icon: '📚', quality: 'gold', baseValue: 2500, width: 2, height: 1, category: 'special' },
        { id: 'gd_x_7', name: '画', icon: '🖼️', quality: 'gold', baseValue: 2550, width: 2, height: 2, category: 'special' },
        { id: 'gd_x_8', name: '天命之书', icon: '📖', quality: 'gold', baseValue: 2700, width: 2, height: 2, category: 'special' },
        { id: 'gd_x_9', name: '永恒之火', icon: '🔥', quality: 'gold', baseValue: 2850, width: 1, height: 1, category: 'special' },
        { id: 'gd_x_10', name: '世界之心', icon: '❤️', quality: 'gold', baseValue: 2950, width: 1, height: 1, category: 'special' }
    ],

    // ==================== 红色品质物品 (50 个) ====================
    red: [
        // 武器类 (10个)
        { id: 'r_w_1', name: '诸神黄昏', icon: '🌅', quality: 'red', baseValue: 5000, width: 4, height: 2, category: 'weapon' },
        { id: 'r_w_2', name: '创世纪', icon: '🌍', quality: 'red', baseValue: 5200, width: 3, height: 3, category: 'weapon' },
        { id: 'r_w_3', name: '末日审判', icon: '⚖️', quality: 'red', baseValue: 5100, width: 3, height: 2, category: 'weapon' },
        { id: 'r_w_4', name: '天堂之拳', icon: '👊', quality: 'red', baseValue: 5300, width: 2, height: 2, category: 'weapon' },
        { id: 'r_w_5', name: '地狱之火', icon: '🔥', quality: 'red', baseValue: 5150, width: 3, height: 2, category: 'weapon' },
        { id: 'r_w_6', name: '混沌初开', icon: '🌌', quality: 'red', baseValue: 5400, width: 4, height: 3, category: 'weapon' },
        { id: 'r_w_7', name: '宇宙大爆炸', icon: '💥', quality: 'red', baseValue: 5500, width: 4, height: 4, category: 'weapon' },
        { id: 'r_w_8', name: '维度崩塌', icon: '🏚️', quality: 'red', baseValue: 5350, width: 3, height: 3, category: 'weapon' },
        { id: 'r_w_9', name: '时间终结', icon: '⌛', quality: 'red', baseValue: 5250, width: 3, height: 2, category: 'weapon' },
        { id: 'r_w_10', name: '空间破碎', icon: '💔', quality: 'red', baseValue: 5300, width: 3, height: 2, category: 'weapon' },

        // 护甲类 (5个)
        { id: 'r_a_1', name: '创世神装', icon: '👼', quality: 'red', baseValue: 5500, width: 3, height: 3, category: 'armor' },
        { id: 'r_a_2', name: '永恒战甲', icon: '♾️', quality: 'red', baseValue: 5400, width: 3, height: 3, category: 'armor' },
        { id: 'r_a_3', name: '无限护盾', icon: '🛡️', quality: 'red', baseValue: 5300, width: 2, height: 3, category: 'armor' },
        { id: 'r_a_4', name: '神之领域', icon: '🌟', quality: 'red', baseValue: 5450, width: 3, height: 3, category: 'armor' },
        { id: 'r_a_5', name: '圣域结界', icon: '⭕', quality: 'red', baseValue: 5350, width: 3, height: 3, category: 'armor' },

        // 医疗类 (5个)
        { id: 'r_m_1', name: '永生之血', icon: '🩸', quality: 'red', baseValue: 5200, width: 1, height: 1, category: 'medical' },
        { id: 'r_m_2', name: '轮回转生', icon: '☸️', quality: 'red', baseValue: 5300, width: 1, height: 1, category: 'medical' },
        { id: 'r_m_3', name: '涅槃重生', icon: '🔥', quality: 'red', baseValue: 5400, width: 1, height: 1, category: 'medical' },
        { id: 'r_m_4', name: '万物复苏', icon: '🌱', quality: 'red', baseValue: 5250, width: 2, height: 1, category: 'medical' },
        { id: 'r_m_5', name: '生命永恒', icon: '❤️', quality: 'red', baseValue: 5350, width: 1, height: 1, category: 'medical' },

        // 电子类 (5个)
        { id: 'r_e_1', name: '全知全能', icon: '🧠', quality: 'red', baseValue: 5500, width: 3, height: 3, category: 'electronic' },
        { id: 'r_e_2', name: '上帝视角', icon: '👁️', quality: 'red', baseValue: 5400, width: 2, height: 2, category: 'electronic' },
        { id: 'r_e_3', name: '因果律武器', icon: '⛓️', quality: 'red', baseValue: 5600, width: 3, height: 2, category: 'electronic' },
        { id: 'r_e_4', name: '命运操控器', icon: '🎮', quality: 'red', baseValue: 5500, width: 2, height: 2, category: 'electronic' },
        { id: 'r_e_5', name: '现实修改器', icon: '✏️', quality: 'red', baseValue: 5700, width: 3, height: 2, category: 'electronic' },

        // 贵重物品 (5个)
        { id: 'r_v_1', name: '宇宙之心', icon: '🌌', quality: 'red', baseValue: 5500, width: 2, height: 2, category: 'valuable' },
        { id: 'r_v_2', name: '创世水晶', icon: '💠', quality: 'red', baseValue: 5400, width: 2, height: 2, category: 'valuable' },
        { id: 'r_v_3', name: '永恒钻石', icon: '💎', quality: 'red', baseValue: 5600, width: 1, height: 1, category: 'valuable' },
        { id: 'r_v_4', name: '无限宝石', icon: '🔮', quality: 'red', baseValue: 5500, width: 1, height: 1, category: 'valuable' },
        { id: 'r_v_5', name: '混沌珠', icon: '🔴', quality: 'red', baseValue: 5450, width: 1, height: 1, category: 'valuable' },

        // 材料类 (5个)
        { id: 'r_s_1', name: '本源之力', icon: '⚡', quality: 'red', baseValue: 5300, width: 1, height: 1, category: 'material' },
        { id: 'r_s_2', name: '大道之源', icon: '☯️', quality: 'red', baseValue: 5400, width: 1, height: 1, category: 'material' },
        { id: 'r_s_3', name: '万物之始', icon: '🌀', quality: 'red', baseValue: 5500, width: 2, height: 2, category: 'material' },
        { id: 'r_s_4', name: '终焉之末', icon: '🌑', quality: 'red', baseValue: 5450, width: 2, height: 2, category: 'material' },
        { id: 'r_s_5', name: '虚无之境', icon: '⬛', quality: 'red', baseValue: 5350, width: 2, height: 2, category: 'material' },

        // 容器类 (5个)
        { id: 'r_c_1', name: '洪荒世界', icon: '🌍', quality: 'red', baseValue: 5600, width: 3, height: 3, category: 'container' },
        { id: 'r_c_2', name: '诸天万界', icon: '🌌', quality: 'red', baseValue: 5700, width: 3, height: 3, category: 'container' },
        { id: 'r_c_3', name: '无尽虚空', icon: '🕳️', quality: 'red', baseValue: 5500, width: 3, height: 3, category: 'container' },
        { id: 'r_c_4', name: '创世之盒', icon: '📦', quality: 'red', baseValue: 5400, width: 2, height: 2, category: 'container' },
        { id: 'r_c_5', name: '永恒之箱', icon: '🎁', quality: 'red', baseValue: 5450, width: 2, height: 2, category: 'container' },

        // 特殊类 (10个)
        { id: 'r_x_1', name: '作者权限', icon: '👨‍💻', quality: 'red', baseValue: 6000, width: 2, height: 2, category: 'special' },
        { id: 'r_x_2', name: 'GM命令', icon: '🎯', quality: 'red', baseValue: 5800, width: 2, height: 2, category: 'special' },
        { id: 'r_x_3', name: '系统漏洞', icon: '🐛', quality: 'red', baseValue: 5900, width: 2, height: 2, category: 'special' },
        { id: 'r_x_4', name: '第四面墙', icon: '🧱', quality: 'red', baseValue: 5700, width: 3, height: 2, category: 'special' },
        { id: 'r_x_5', name: '突破次元', icon: '🌀', quality: 'red', baseValue: 5800, width: 2, height: 2, category: 'special' },
        { id: 'r_x_6', name: '无限循环', icon: '♾️', quality: 'red', baseValue: 5650, width: 2, height: 1, category: 'special' },
        { id: 'r_x_7', name: '绝对真理', icon: '📖', quality: 'red', baseValue: 5750, width: 2, height: 2, category: 'special' },
        { id: 'r_x_8', name: '终极答案', icon: '4️⃣2️⃣', quality: 'red', baseValue: 5550, width: 1, height: 1, category: 'special' },
        { id: 'r_x_9', name: '世界代码', icon: '💻', quality: 'red', baseValue: 5850, width: 2, height: 2, category: 'special' },
        { id: 'r_x_10', name: '源代码', icon: '📜', quality: 'red', baseValue: 5950, width: 2, height: 3, category: 'special' }
    ]
};

// 物品工具类
const ItemUtils = {
    // 根据ID查找物品
    findById(id) {
        if (!id) return null;
        for (const pool of Object.values(ITEMS_DATABASE)) {
            const item = pool.find(i => i.id === id);
            if (item) return item;
        }
        return null;
    },

    // 获取所有物品
    getAll() {
        const all = [];
        for (const pool of Object.values(ITEMS_DATABASE)) {
            all.push(...pool);
        }
        return all;
    },

    // 按品质获取物品
    getByQuality(quality) {
        return ITEMS_DATABASE[quality] || [];
    },

    // 按类别获取物品
    getByCategory(category) {
        return this.getAll().filter(item => item.category === category);
    },

    // 随机获取物品
    getRandom(quality) {
        const pool = ITEMS_DATABASE[quality] || ITEMS_DATABASE.green;
        return { ...pool[Math.floor(Math.random() * pool.length)] };
    },

    // 根据掉落率随机生成物品
    randomByDropRate(dropRate) {
        const roll = Math.random() * 100;
        let quality;
        if (roll < dropRate * 0.08) quality = 'red';
        else if (roll < dropRate * 0.18) quality = 'gold';
        else if (roll < dropRate * 0.35) quality = 'purple';
        else if (roll < dropRate * 0.55) quality = 'blue';
        else quality = 'green';

        const item = this.getRandom(quality);
        return {
            ...item,
            id: item.id + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)
        };
    },

    // 获取品质名称
    getQualityName(quality) {
        const names = {
            green: '普通',
            blue: '稀有',
            purple: '史诗',
            gold: '传说',
            red: '神话'
        };
        return names[quality] || '普通';
    },

    // 获取品质颜色
    getQualityColor(quality) {
        const colors = {
            green: '#00ff00',
            blue: '#0064ff',
            purple: '#9600ff',
            gold: '#ffd700',
            red: '#ff0000'
        };
        return colors[quality] || '#00ff00';
    },

    // 获取品质图标
    getQualityIcon(quality) {
        const icons = {
            green: '🟢',
            blue: '🔵',
            purple: '🟣',
            gold: '🟡',
            red: '🔴'
        };
        return icons[quality] || '🟢';
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ITEMS_DATABASE, ItemUtils };
}
