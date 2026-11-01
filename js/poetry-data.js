/**
 * 统编版小学语文 1-6 年级古诗词背诵篇目数据
 * 共 112 首，按年级和学期分组
 */
const POETRY_DATA = [
  // ==================== 一年级上册 ====================
  { title: '咏鹅', author: '骆宾王', dynasty: '唐', grade: 1, semester: '上册', content: '鹅，鹅，鹅，\n曲项向天歌。\n白毛浮绿水，\n红掌拨清波。' },
  { title: '江南', author: '汉乐府', dynasty: '汉', grade: 1, semester: '上册', content: '江南可采莲，\n莲叶何田田。\n鱼戏莲叶间。\n鱼戏莲叶东，鱼戏莲叶西，\n鱼戏莲叶南，鱼戏莲叶北。' },
  { title: '画', author: '王维', dynasty: '唐', grade: 1, semester: '上册', content: '远看山有色，\n近听水无声。\n春去花还在，\n人来鸟不惊。' },
  { title: '悯农（其二）', author: '李绅', dynasty: '唐', grade: 1, semester: '上册', content: '锄禾日当午，\n汗滴禾下土。\n谁知盘中餐，\n粒粒皆辛苦。' },
  { title: '古朗月行（节选）', author: '李白', dynasty: '唐', grade: 1, semester: '上册', content: '小时不识月，\n呼作白玉盘。\n又疑瑶台镜，\n飞在青云端。' },
  { title: '风', author: '李峤', dynasty: '唐', grade: 1, semester: '上册', content: '解落三秋叶，\n能开二月花。\n过江千尺浪，\n入竹万竿斜。' },

  // ==================== 一年级下册 ====================
  { title: '春晓', author: '孟浩然', dynasty: '唐', grade: 1, semester: '下册', content: '春眠不觉晓，\n处处闻啼鸟。\n夜来风雨声，\n花落知多少。' },
  { title: '赠汪伦', author: '李白', dynasty: '唐', grade: 1, semester: '下册', content: '李白乘舟将欲行，\n忽闻岸上踏歌声。\n桃花潭水深千尺，\n不及汪伦送我情。' },
  { title: '静夜思', author: '李白', dynasty: '唐', grade: 1, semester: '下册', content: '床前明月光，\n疑是地上霜。\n举头望明月，\n低头思故乡。' },
  { title: '寻隐者不遇', author: '贾岛', dynasty: '唐', grade: 1, semester: '下册', content: '松下问童子，\n言师采药去。\n只在此山中，\n云深不知处。' },
  { title: '池上', author: '白居易', dynasty: '唐', grade: 1, semester: '下册', content: '小娃撑小艇，\n偷采白莲回。\n不解藏踪迹，\n浮萍一道开。' },
  { title: '小池', author: '杨万里', dynasty: '宋', grade: 1, semester: '下册', content: '泉眼无声惜细流，\n树阴照水爱晴柔。\n小荷才露尖尖角，\n早有蜻蜓立上头。' },
  { title: '画鸡', author: '唐寅', dynasty: '明', grade: 1, semester: '下册', content: '头上红冠不用裁，\n满身雪白走将来。\n平生不敢轻言语，\n一叫千门万户开。' },

  // ==================== 二年级上册 ====================
  { title: '梅花', author: '王安石', dynasty: '宋', grade: 2, semester: '上册', content: '墙角数枝梅，\n凌寒独自开。\n遥知不是雪，\n为有暗香来。' },
  { title: '小儿垂钓', author: '胡令能', dynasty: '唐', grade: 2, semester: '上册', content: '蓬头稚子学垂纶，\n侧坐莓苔草映身。\n路人借问遥招手，\n怕得鱼惊不应人。' },
  { title: '登鹳雀楼', author: '王之涣', dynasty: '唐', grade: 2, semester: '上册', content: '白日依山尽，\n黄河入海流。\n欲穷千里目，\n更上一层楼。' },
  { title: '望庐山瀑布', author: '李白', dynasty: '唐', grade: 2, semester: '上册', content: '日照香炉生紫烟，\n遥看瀑布挂前川。\n飞流直下三千尺，\n疑是银河落九天。' },
  { title: '江雪', author: '柳宗元', dynasty: '唐', grade: 2, semester: '上册', content: '千山鸟飞绝，\n万径人踪灭。\n孤舟蓑笠翁，\n独钓寒江雪。' },
  { title: '夜宿山寺', author: '李白', dynasty: '唐', grade: 2, semester: '上册', content: '危楼高百尺，\n手可摘星辰。\n不敢高声语，\n恐惊天上人。' },
  { title: '敕勒歌', author: '北朝民歌', dynasty: '北朝', grade: 2, semester: '上册', content: '敕勒川，阴山下，\n天似穹庐，笼盖四野。\n天苍苍，野茫茫，\n风吹草低见牛羊。' },

  // ==================== 二年级下册 ====================
  { title: '村居', author: '高鼎', dynasty: '清', grade: 2, semester: '下册', content: '草长莺飞二月天，\n拂堤杨柳醉春烟。\n儿童散学归来早，\n忙趁东风放纸鸢。' },
  { title: '咏柳', author: '贺知章', dynasty: '唐', grade: 2, semester: '下册', content: '碧玉妆成一树高，\n万条垂下绿丝绦。\n不知细叶谁裁出，\n二月春风似剪刀。' },
  { title: '赋得古原草送别（节选）', author: '白居易', dynasty: '唐', grade: 2, semester: '下册', content: '离离原上草，\n一岁一枯荣。\n野火烧不尽，\n春风吹又生。' },
  { title: '晓出净慈寺送林子方', author: '杨万里', dynasty: '宋', grade: 2, semester: '下册', content: '毕竟西湖六月中，\n风光不与四时同。\n接天莲叶无穷碧，\n映日荷花别样红。' },
  { title: '绝句', author: '杜甫', dynasty: '唐', grade: 2, semester: '下册', content: '两个黄鹂鸣翠柳，\n一行白鹭上青天。\n窗含西岭千秋雪，\n门泊东吴万里船。' },
  { title: '悯农（其一）', author: '李绅', dynasty: '唐', grade: 2, semester: '下册', content: '春种一粒粟，\n秋收万颗子。\n四海无闲田，\n农夫犹饿死。' },
  { title: '舟夜书所见', author: '查慎行', dynasty: '清', grade: 2, semester: '下册', content: '月黑见渔灯，\n孤光一点萤。\n微微风簇浪，\n散作满河星。' },

  // ==================== 三年级上册 ====================
  { title: '所见', author: '袁枚', dynasty: '清', grade: 3, semester: '上册', content: '牧童骑黄牛，\n歌声振林樾。\n意欲捕鸣蝉，\n忽然闭口立。' },
  { title: '山行', author: '杜牧', dynasty: '唐', grade: 3, semester: '上册', content: '远上寒山石径斜，\n白云生处有人家。\n停车坐爱枫林晚，\n霜叶红于二月花。' },
  { title: '赠刘景文', author: '苏轼', dynasty: '宋', grade: 3, semester: '上册', content: '荷尽已无擎雨盖，\n菊残犹有傲霜枝。\n一年好景君须记，\n最是橙黄橘绿时。' },
  { title: '夜书所见', author: '叶绍翁', dynasty: '宋', grade: 3, semester: '上册', content: '萧萧梧叶送寒声，\n江上秋风动客情。\n知有儿童挑促织，\n夜深篱落一灯明。' },
  { title: '望天门山', author: '李白', dynasty: '唐', grade: 3, semester: '上册', content: '天门中断楚江开，\n碧水东流至此回。\n两岸青山相对出，\n孤帆一片日边来。' },
  { title: '饮湖上初晴后雨', author: '苏轼', dynasty: '宋', grade: 3, semester: '上册', content: '水光潋滟晴方好，\n山色空蒙雨亦奇。\n欲把西湖比西子，\n淡妆浓抹总相宜。' },
  { title: '望洞庭', author: '刘禹锡', dynasty: '唐', grade: 3, semester: '上册', content: '湖光秋月两相和，\n潭面无风镜未磨。\n遥望洞庭山水翠，\n白银盘里一青螺。' },
  { title: '早发白帝城', author: '李白', dynasty: '唐', grade: 3, semester: '上册', content: '朝辞白帝彩云间，\n千里江陵一日还。\n两岸猿声啼不住，\n轻舟已过万重山。' },
  { title: '采莲曲', author: '王昌龄', dynasty: '唐', grade: 3, semester: '上册', content: '荷叶罗裙一色裁，\n芙蓉向脸两边开。\n乱入池中看不见，\n闻歌始觉有人来。' },

  // ==================== 三年级下册 ====================
  { title: '绝句', author: '杜甫', dynasty: '唐', grade: 3, semester: '下册', content: '迟日江山丽，\n春风花草香。\n泥融飞燕子，\n沙暖睡鸳鸯。' },
  { title: '惠崇春江晚景', author: '苏轼', dynasty: '宋', grade: 3, semester: '下册', content: '竹外桃花三两枝，\n春江水暖鸭先知。\n蒌蒿满地芦芽短，\n正是河豚欲上时。' },
  { title: '三衢道中', author: '曾几', dynasty: '宋', grade: 3, semester: '下册', content: '梅子黄时日日晴，\n小溪泛尽却山行。\n绿阴不减来时路，\n添得黄鹂四五声。' },
  { title: '忆江南', author: '白居易', dynasty: '唐', grade: 3, semester: '下册', content: '江南好，风景旧曾谙。\n日出江花红胜火，\n春来江水绿如蓝。\n能不忆江南？' },
  { title: '元日', author: '王安石', dynasty: '宋', grade: 3, semester: '下册', content: '爆竹声中一岁除，\n春风送暖入屠苏。\n千门万户曈曈日，\n总把新桃换旧符。' },
  { title: '清明', author: '杜牧', dynasty: '唐', grade: 3, semester: '下册', content: '清明时节雨纷纷，\n路上行人欲断魂。\n借问酒家何处有？\n牧童遥指杏花村。' },
  { title: '九月九日忆山东兄弟', author: '王维', dynasty: '唐', grade: 3, semester: '下册', content: '独在异乡为异客，\n每逢佳节倍思亲。\n遥知兄弟登高处，\n遍插茱萸少一人。' },
  { title: '滁州西涧', author: '韦应物', dynasty: '唐', grade: 3, semester: '下册', content: '独怜幽草涧边生，\n上有黄鹂深树鸣。\n春潮带雨晚来急，\n野渡无人舟自横。' },
  { title: '大林寺桃花', author: '白居易', dynasty: '唐', grade: 3, semester: '下册', content: '人间四月芳菲尽，\n山寺桃花始盛开。\n长恨春归无觅处，\n不知转入此中来。' },

  // ==================== 四年级上册 ====================
  { title: '鹿柴', author: '王维', dynasty: '唐', grade: 4, semester: '上册', content: '空山不见人，\n但闻人语响。\n返景入深林，\n复照青苔上。' },
  { title: '暮江吟', author: '白居易', dynasty: '唐', grade: 4, semester: '上册', content: '一道残阳铺水中，\n半江瑟瑟半江红。\n可怜九月初三夜，\n露似真珠月似弓。' },
  { title: '题西林壁', author: '苏轼', dynasty: '宋', grade: 4, semester: '上册', content: '横看成岭侧成峰，\n远近高低各不同。\n不识庐山真面目，\n只缘身在此山中。' },
  { title: '雪梅', author: '卢钺', dynasty: '宋', grade: 4, semester: '上册', content: '梅雪争春未肯降，\n骚人搁笔费评章。\n梅须逊雪三分白，\n雪却输梅一段香。' },
  { title: '嫦娥', author: '李商隐', dynasty: '唐', grade: 4, semester: '上册', content: '云母屏风烛影深，\n长河渐落晓星沉。\n嫦娥应悔偷灵药，\n碧海青天夜夜心。' },
  { title: '出塞', author: '王昌龄', dynasty: '唐', grade: 4, semester: '上册', content: '秦时明月汉时关，\n万里长征人未还。\n但使龙城飞将在，\n不教胡马度阴山。' },
  { title: '凉州词', author: '王翰', dynasty: '唐', grade: 4, semester: '上册', content: '葡萄美酒夜光杯，\n欲饮琵琶马上催。\n醉卧沙场君莫笑，\n古来征战几人回？' },
  { title: '夏日绝句', author: '李清照', dynasty: '宋', grade: 4, semester: '上册', content: '生当作人杰，\n死亦为鬼雄。\n至今思项羽，\n不肯过江东。' },
  { title: '别董大', author: '高适', dynasty: '唐', grade: 4, semester: '上册', content: '千里黄云白日曛，\n北风吹雁雪纷纷。\n莫愁前路无知己，\n天下谁人不识君？' },

  // ==================== 四年级下册 ====================
  { title: '宿新市徐公店', author: '杨万里', dynasty: '宋', grade: 4, semester: '下册', content: '篱落疏疏一径深，\n树头新绿未成阴。\n儿童急走追黄蝶，\n飞入菜花无处寻。' },
  { title: '四时田园杂兴（其二十五）', author: '范成大', dynasty: '宋', grade: 4, semester: '下册', content: '梅子金黄杏子肥，\n麦花雪白菜花稀。\n日长篱落无人过，\n惟有蜻蜓蛱蝶飞。' },
  { title: '清平乐·村居', author: '辛弃疾', dynasty: '宋', grade: 4, semester: '下册', content: '茅檐低小，溪上青青草。\n醉里吴音相媚好，白发谁家翁媪？\n大儿锄豆溪东，中儿正织鸡笼。\n最喜小儿亡赖，溪头卧剥莲蓬。' },
  { title: '卜算子·咏梅', author: '毛泽东', dynasty: '近现代', grade: 4, semester: '下册', content: '风雨送春归，飞雪迎春到。\n已是悬崖百丈冰，犹有花枝俏。\n俏也不争春，只把春来报。\n待到山花烂漫时，她在丛中笑。' },
  { title: '蜂', author: '罗隐', dynasty: '唐', grade: 4, semester: '下册', content: '不论平地与山尖，\n无限风光尽被占。\n采得百花成蜜后，\n为谁辛苦为谁甜？' },
  { title: '独坐敬亭山', author: '李白', dynasty: '唐', grade: 4, semester: '下册', content: '众鸟高飞尽，\n孤云独去闲。\n相看两不厌，\n只有敬亭山。' },
  { title: '芙蓉楼送辛渐', author: '王昌龄', dynasty: '唐', grade: 4, semester: '下册', content: '寒雨连江夜入吴，\n平明送客楚山孤。\n洛阳亲友如相问，\n一片冰心在玉壶。' },
  { title: '塞下曲', author: '卢纶', dynasty: '唐', grade: 4, semester: '下册', content: '月黑雁飞高，\n单于夜遁逃。\n欲将轻骑逐，\n大雪满弓刀。' },
  { title: '墨梅', author: '王冕', dynasty: '元', grade: 4, semester: '下册', content: '我家洗砚池头树，\n朵朵花开淡墨痕。\n不要人夸好颜色，\n只留清气满乾坤。' },

  // ==================== 五年级上册 ====================
  { title: '蝉', author: '虞世南', dynasty: '唐', grade: 5, semester: '上册', content: '垂緌饮清露，\n流响出疏桐。\n居高声自远，\n非是藉秋风。' },
  { title: '乞巧', author: '林杰', dynasty: '唐', grade: 5, semester: '上册', content: '七夕今宵看碧霄，\n牵牛织女渡河桥。\n家家乞巧望秋月，\n穿尽红丝几万条。' },
  { title: '示儿', author: '陆游', dynasty: '宋', grade: 5, semester: '上册', content: '死去元知万事空，\n但悲不见九州同。\n王师北定中原日，\n家祭无忘告乃翁。' },
  { title: '题临安邸', author: '林升', dynasty: '宋', grade: 5, semester: '上册', content: '山外青山楼外楼，\n西湖歌舞几时休？\n暖风熏得游人醉，\n直把杭州作汴州。' },
  { title: '己亥杂诗', author: '龚自珍', dynasty: '清', grade: 5, semester: '上册', content: '九州生气恃风雷，\n万马齐喑究可哀。\n我劝天公重抖擞，\n不拘一格降人才。' },
  { title: '山居秋暝', author: '王维', dynasty: '唐', grade: 5, semester: '上册', content: '空山新雨后，天气晚来秋。\n明月松间照，清泉石上流。\n竹喧归浣女，莲动下渔舟。\n随意春芳歇，王孙自可留。' },
  { title: '枫桥夜泊', author: '张继', dynasty: '唐', grade: 5, semester: '上册', content: '月落乌啼霜满天，\n江枫渔火对愁眠。\n姑苏城外寒山寺，\n夜半钟声到客船。' },
  { title: '长相思', author: '纳兰性德', dynasty: '清', grade: 5, semester: '上册', content: '山一程，水一程，\n身向榆关那畔行，夜深千帐灯。\n风一更，雪一更，\n聒碎乡心梦不成，故园无此声。' },
  { title: '渔歌子', author: '张志和', dynasty: '唐', grade: 5, semester: '上册', content: '西塞山前白鹭飞，\n桃花流水鳜鱼肥。\n青箬笠，绿蓑衣，\n斜风细雨不须归。' },
  { title: '观书有感（其一）', author: '朱熹', dynasty: '宋', grade: 5, semester: '上册', content: '半亩方塘一鉴开，\n天光云影共徘徊。\n问渠那得清如许？\n为有源头活水来。' },
  { title: '观书有感（其二）', author: '朱熹', dynasty: '宋', grade: 5, semester: '上册', content: '昨夜江边春水生，\n蒙冲巨舰一毛轻。\n向来枉费推移力，\n此日中流自在行。' },

  // ==================== 五年级下册 ====================
  { title: '四时田园杂兴（其三十一）', author: '范成大', dynasty: '宋', grade: 5, semester: '下册', content: '昼出耘田夜绩麻，\n村庄儿女各当家。\n童孙未解供耕织，\n也傍桑阴学种瓜。' },
  { title: '稚子弄冰', author: '杨万里', dynasty: '宋', grade: 5, semester: '下册', content: '稚子金盆脱晓冰，\n彩丝穿取当银铮。\n敲成玉磬穿林响，\n忽作玻璃碎地声。' },
  { title: '村晚', author: '雷震', dynasty: '宋', grade: 5, semester: '下册', content: '草满池塘水满陂，\n山衔落日浸寒漪。\n牧童归去横牛背，\n短笛无腔信口吹。' },
  { title: '鸟鸣涧', author: '王维', dynasty: '唐', grade: 5, semester: '下册', content: '人闲桂花落，\n夜静春山空。\n月出惊山鸟，\n时鸣春涧中。' },
  { title: '凉州词', author: '王之涣', dynasty: '唐', grade: 5, semester: '下册', content: '黄河远上白云间，\n一片孤城万仞山。\n羌笛何须怨杨柳，\n春风不度玉门关。' },
  { title: '送元二使安西', author: '王维', dynasty: '唐', grade: 5, semester: '下册', content: '渭城朝雨浥轻尘，\n客舍青青柳色新。\n劝君更尽一杯酒，\n西出阳关无故人。' },
  { title: '秋夜将晓出篱门迎凉有感', author: '陆游', dynasty: '宋', grade: 5, semester: '下册', content: '三万里河东入海，\n五千仞岳上摩天。\n遗民泪尽胡尘里，\n南望王师又一年。' },
  { title: '黄鹤楼送孟浩然之广陵', author: '李白', dynasty: '唐', grade: 5, semester: '下册', content: '故人西辞黄鹤楼，\n烟花三月下扬州。\n孤帆远影碧空尽，\n唯见长江天际流。' },
  { title: '寒菊', author: '郑思肖', dynasty: '宋', grade: 5, semester: '下册', content: '花开不并百花丛，\n独立疏篱趣未穷。\n宁可枝头抱香死，\n何曾吹落北风中。' },
  { title: '乡村四月', author: '翁卷', dynasty: '宋', grade: 5, semester: '下册', content: '绿遍山原白满川，\n子规声里雨如烟。\n乡村四月闲人少，\n才了蚕桑又插田。' },

  // ==================== 六年级上册 ====================
  { title: '宿建德江', author: '孟浩然', dynasty: '唐', grade: 6, semester: '上册', content: '移舟泊烟渚，\n日暮客愁新。\n野旷天低树，\n江清月近人。' },
  { title: '六月二十七日望湖楼醉书', author: '苏轼', dynasty: '宋', grade: 6, semester: '上册', content: '黑云翻墨未遮山，\n白雨跳珠乱入船。\n卷地风来忽吹散，\n望湖楼下水如天。' },
  { title: '西江月·夜行黄沙道中', author: '辛弃疾', dynasty: '宋', grade: 6, semester: '上册', content: '明月别枝惊鹊，清风半夜鸣蝉。\n稻花香里说丰年，听取蛙声一片。\n七八个星天外，两三点雨山前。\n旧时茅店社林边，路转溪桥忽见。' },
  { title: '过故人庄', author: '孟浩然', dynasty: '唐', grade: 6, semester: '上册', content: '故人具鸡黍，邀我至田家。\n绿树村边合，青山郭外斜。\n开轩面场圃，把酒话桑麻。\n待到重阳日，还来就菊花。' },
  { title: '七律·长征', author: '毛泽东', dynasty: '近现代', grade: 6, semester: '上册', content: '红军不怕远征难，万水千山只等闲。\n五岭逶迤腾细浪，乌蒙磅礴走泥丸。\n金沙水拍云崖暖，大渡桥横铁索寒。\n更喜岷山千里雪，三军过后尽开颜。' },
  { title: '菩萨蛮·大柏地', author: '毛泽东', dynasty: '近现代', grade: 6, semester: '上册', content: '赤橙黄绿青蓝紫，谁持彩练当空舞？\n雨后复斜阳，关山阵阵苍。\n当年鏖战急，弹洞前村壁。\n装点此关山，今朝更好看。' },
  { title: '春日', author: '朱熹', dynasty: '宋', grade: 6, semester: '上册', content: '胜日寻芳泗水滨，\n无边光景一时新。\n等闲识得东风面，\n万紫千红总是春。' },
  { title: '回乡偶书', author: '贺知章', dynasty: '唐', grade: 6, semester: '上册', content: '少小离家老大回，\n乡音无改鬓毛衰。\n儿童相见不相识，\n笑问客从何处来。' },
  { title: '浪淘沙（其一）', author: '刘禹锡', dynasty: '唐', grade: 6, semester: '上册', content: '九曲黄河万里沙，\n浪淘风簸自天涯。\n如今直上银河去，\n同到牵牛织女家。' },
  { title: '江南春', author: '杜牧', dynasty: '唐', grade: 6, semester: '上册', content: '千里莺啼绿映红，\n水村山郭酒旗风。\n南朝四百八十寺，\n多少楼台烟雨中。' },
  { title: '书湖阴先生壁', author: '王安石', dynasty: '宋', grade: 6, semester: '上册', content: '茅檐长扫净无苔，\n花木成畦手自栽。\n一水护田将绿绕，\n两山排闼送青来。' },

  // ==================== 六年级下册 ====================
  { title: '寒食', author: '韩翃', dynasty: '唐', grade: 6, semester: '下册', content: '春城无处不飞花，\n寒食东风御柳斜。\n日暮汉宫传蜡烛，\n轻烟散入五侯家。' },
  { title: '迢迢牵牛星', author: '佚名', dynasty: '汉', grade: 6, semester: '下册', content: '迢迢牵牛星，皎皎河汉女。\n纤纤擢素手，札札弄机杼。\n终日不成章，泣涕零如雨。\n河汉清且浅，相去复几许。\n盈盈一水间，脉脉不得语。' },
  { title: '十五夜望月', author: '王建', dynasty: '唐', grade: 6, semester: '下册', content: '中庭地白树栖鸦，\n冷露无声湿桂花。\n今夜月明人尽望，\n不知秋思落谁家？' },
  { title: '长歌行', author: '汉乐府', dynasty: '汉', grade: 6, semester: '下册', content: '青青园中葵，朝露待日晞。\n阳春布德泽，万物生光辉。\n常恐秋节至，焜黄华叶衰。\n百川东到海，何时复西归？\n少壮不努力，老大徒伤悲！' },
  { title: '马诗', author: '李贺', dynasty: '唐', grade: 6, semester: '下册', content: '大漠沙如雪，\n燕山月似钩。\n何当金络脑，\n快走踏清秋。' },
  { title: '石灰吟', author: '于谦', dynasty: '明', grade: 6, semester: '下册', content: '千锤万凿出深山，\n烈火焚烧若等闲。\n粉身碎骨浑不怕，\n要留清白在人间。' },
  { title: '竹石', author: '郑燮', dynasty: '清', grade: 6, semester: '下册', content: '咬定青山不放松，\n立根原在破岩中。\n千磨万击还坚劲，\n任尔东西南北风。' },
  { title: '采薇（节选）', author: '《诗经·小雅》', dynasty: '先秦', grade: 6, semester: '下册', content: '昔我往矣，杨柳依依。\n今我来思，雨雪霏霏。\n行道迟迟，载渴载饥。\n我心伤悲，莫知我哀！' },
  { title: '春夜喜雨', author: '杜甫', dynasty: '唐', grade: 6, semester: '下册', content: '好雨知时节，当春乃发生。\n随风潜入夜，润物细无声。\n野径云俱黑，江船火独明。\n晓看红湿处，花重锦官城。' },
  { title: '闻官军收河南河北', author: '杜甫', dynasty: '唐', grade: 6, semester: '下册', content: '剑外忽传收蓟北，初闻涕泪满衣裳。\n却看妻子愁何在，漫卷诗书喜欲狂。\n白日放歌须纵酒，青春作伴好还乡。\n即从巴峡穿巫峡，便下襄阳向洛阳。' },
  { title: '早春呈水部张十八员外', author: '韩愈', dynasty: '唐', grade: 6, semester: '下册', content: '天街小雨润如酥，\n草色遥看近却无。\n最是一年春好处，\n绝胜烟柳满皇都。' },
  { title: '江上渔者', author: '范仲淹', dynasty: '宋', grade: 6, semester: '下册', content: '江上往来人，\n但爱鲈鱼美。\n君看一叶舟，\n出没风波里。' },
  { title: '泊船瓜洲', author: '王安石', dynasty: '宋', grade: 6, semester: '下册', content: '京口瓜洲一水间，\n钟山只隔数重山。\n春风又绿江南岸，\n明月何时照我还。' },
  { title: '游园不值', author: '叶绍翁', dynasty: '宋', grade: 6, semester: '下册', content: '应怜屐齿印苍苔，\n小扣柴扉久不开。\n春色满园关不住，\n一枝红杏出墙来。' },
  { title: '卜算子·送鲍浩然之浙东', author: '王观', dynasty: '宋', grade: 6, semester: '下册', content: '水是眼波横，山是眉峰聚。\n欲问行人去那边？眉眼盈盈处。\n才始送春归，又送君归去。\n若到江南赶上春，千万和春住。' },
  { title: '浣溪沙', author: '苏轼', dynasty: '宋', grade: 6, semester: '下册', content: '游蕲水清泉寺，寺临兰溪，溪水西流。\n山下兰芽短浸溪，松间沙路净无泥，潇潇暮雨子规啼。\n谁道人生无再少？门前流水尚能西！休将白发唱黄鸡。' },
  { title: '清平乐', author: '黄庭坚', dynasty: '宋', grade: 6, semester: '下册', content: '春归何处？寂寞无行路。\n若有人知春去处，唤取归来同住。\n春无踪迹谁知？除非问取黄鹂。\n百啭无人能解，因风飞过蔷薇。' },
];

/**
 * 按年级和学期获取诗歌列表
 */
function getPoems(grade, semester) {
  return POETRY_DATA.filter(p => p.grade === parseInt(grade) && p.semester === semester);
}

/**
 * 获取年级统计
 */
function getPoetryStats() {
  const stats = {};
  for (const p of POETRY_DATA) {
    const key = `${p.grade}-${p.semester}`;
    stats[key] = (stats[key] || 0) + 1;
  }
  return stats;
}
