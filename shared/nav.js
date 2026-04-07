// ===== CURSOR =====
const cur=document.getElementById('cur'),ring=document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'});
(function curLoop(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(curLoop)})();

// ===== SCROLL REVEAL =====
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis')}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// ===== THEME =====
const THEME_KEY='roundtable-theme';
const themeMeta=document.getElementById('themeColorMeta');
const manifestLink=document.getElementById('manifestLink');
const systemThemeQuery=window.matchMedia('(prefers-color-scheme: light)');

function readSavedTheme(){
  try{return localStorage.getItem(THEME_KEY)}catch(_){return null}
}

function writeSavedTheme(theme){
  try{localStorage.setItem(THEME_KEY,theme)}catch(_){/* ignore */}
}

function updateThemeControls(theme){
  document.querySelectorAll('.theme-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.themeMode===theme));
}

function updateThemeMeta(theme){
  if(themeMeta)themeMeta.setAttribute('content',theme==='light'?'#f5efe4':'#040508');
}

function updateManifest(theme){
  if(!manifestLink)return;
  const href=theme==='light'?'/manifest-light.json':'/manifest-dark.json';
  if(manifestLink.getAttribute('href')!==href)manifestLink.setAttribute('href',href);
}

function updateThemeAssets(theme){
  const logoSrc=theme==='light'?'/roundtable-logo-transparent-gold.png':'/roundtable-logo-transparent.png';
  const navLogo=document.getElementById('navLogo');
  const aboutLogo=document.getElementById('aboutLogo');
  const footerLogo=document.getElementById('footerLogo');
  if(navLogo)navLogo.src=logoSrc;
  if(aboutLogo)aboutLogo.src=logoSrc;
  if(footerLogo)footerLogo.src=logoSrc;
}

function setTheme(theme,persist=true){
  document.documentElement.setAttribute('data-theme',theme);
  updateThemeControls(theme);
  updateThemeMeta(theme);
  updateManifest(theme);
  updateThemeAssets(theme);
  if(persist)writeSavedTheme(theme);
}

function getInitialTheme(){
  const saved=readSavedTheme();
  if(saved==='dark'||saved==='light')return saved;
  return systemThemeQuery.matches?'light':'dark';
}

if(systemThemeQuery.addEventListener){
  systemThemeQuery.addEventListener('change',e=>{
    if(!readSavedTheme())setTheme(e.matches?'light':'dark',false);
  });
}

// ===== NAV SCROLL =====
window.addEventListener('scroll',()=>{document.querySelector('.nav').style.borderBottomColor=window.scrollY>30?'var(--nav-line-strong)':'var(--nav-line-soft)'});

// ===== I18N =====
let currentLang='en';
let writingsData=[];
const SUPPORTED_WRITING_LANGS=['en','zh','ja','fr'];
const AUTO_TRANSLATE_LANGS=true;
const translationCache=new Map();
const translationInFlight=new Set();
const translationFailed=new Set();

const T={
en:{nav_about:'About',nav_now:'Now',nav_projects:'Toolkit',nav_writing:'Writing',nav_contact:'Contact',hero_eyebrow:'RoundTable AI Lab · Independent Research',hero_t1:'Every Seat.',hero_t2:'Every Idea.',hero_t3:'For What Comes Next.',hero_desc:"AI tools research, honest market insights, and personal perspectives on where AI is really going — open to all, where every way of thinking deserves a seat.",hero_cta1:"What I'm Building",hero_cta2:'Read the Lab',scroll:'Scroll',about_tag:'The Master',about_title:'Lijun Liu',about_p1:'Born in Shanghai, now based in Tokyo, and currently working at Microsoft. I move constantly between AI and the people who invest in it, use it, build it, and deploy it. I have also visited 16 countries and regions, learning about their cultures and histories, and am still exploring.',about_p2:'<strong>I run RoundTable AI Lab as an independent space — it does not represent any company or brand position, and everything is based on my own real experience and discussed on its own merits.</strong> The round table itself has no head seat. Developers, business professionals, researchers, and entrepreneurs — no matter your field, there is a seat for you here, and your perspectives, discussion, and collaboration are welcome.',about_p3:'The name comes from the Knights of the Round Table — not because they were heroes, but because they sat as equals. That spirit runs through everything here: <strong>honest analysis, open sharing, and growing together around the same ideals.</strong>',pill1:'AI Tools Research',pill2:'Market Intelligence',pill3:'Cloud · AI',pill4:'Tokyo · Shanghai',pill5:'EN · 中文 · 日本語 · FR',pill6:'Think Tank',pill7:'Consulting',now_tag:'Current Chapter',now_title:"What I'm Working On",now_live:'Live · Updated 2026',n1t:'AI Tools Research',n1d:'Systematically evaluating AI coding assistants, agents, and productivity tools — Claude Code, GitHub Copilot, and beyond. Publishing findings for practitioners at every level.',n1tag:'Ongoing',n2t:'OpenClaw · RoundTable',n2d:'Building and experimenting with the OpenClaw agent framework. Each agent in my fleet is named after a Knight of the Round Table — King Arthur is the Orchestrator, and Magus Merlin is the Observer.',n2tag:'Active Build',n3t:'Multilingual Publishing',n3d:'Writing about AI market dynamics in Chinese, Japanese, and English — breaking the language barrier so every seat at the table has a voice.',n3tag:'3 Languages',n4t:'Agentic Coding',n4d:'Co-coding with AI every day to explore what non-traditional developers can build — turning ideas into working products faster and more creatively.',n4tag:'AI Co-Coding',n5t:'Community Talk · OpenClaw',n5d:'Presented OpenClaw at the Tokyo Generative AI Development Community — sharing agent architecture and agentic coding insights with local AI builders.',n5tag:'2026.4.4 · Event Info',n5tag2:'▶ Watch',proj_tag:'Arsenal',proj_title:'Toolkit & Builds',proj_sub:'Mastering five AI agent tools and building with Agentic Coding — my arsenal for what comes next.',proj_agents_title:'AI Agent Tools',proj_oc_title:'OpenClaw · RoundTable',proj_vibe_title:'Agentic Coding',at_oc_tag:'Open Source Project',at_cop_tag:'AI IDE',at_claude_tag:'Autonomous AI Agent',at_codex_tag:'Autonomous AI Agent',at_ag_tag:'Autonomous AI Agent',at_next_name:'Exploring the Next...',at_next_tag:'To Be Continued',oc_master:'The Master',oc_orchestrator:'Orchestrator',oc_lancelot:'SNS Operations',oc_gawain:'System Maintenance',oc_galahad:'Intelligence Gathering',oc_bedivere:'Content Editing',oc_tristan:'Media Production',oc_merlin:'Observer',oc_kay_name:'Kay',oc_percival_name:'Percival',oc_agravain_name:'Agravain',oc_coming_soon:'Coming Soon',p1d:'Open-source PowerPoint generation engine built to be called by AI agents. Create and revise .pptx from natural language via MCP, CLI, or Docker.',write_tag:'The Dispatch',write_title:'Writing & Insights',write_sub:'Analysis, commentary, and field notes on AI tools and the market. Published in multiple languages — pick your seat.',ct_tag:'Take a Seat',ct_title:"Let's Connect",ct_note:'The round table has room for everyone — <strong>developers, business professionals, researchers, and entrepreneurs</strong>. If you\'re curious about AI tools, building something interesting, or just want to exchange honest perspectives, reach out.',ct_email_label:'Email',ct_email_handle:'contact@roundtableailab.org',f_slogan:'Every Seat. Every Idea. For What Comes Next.'},
zh:{nav_about:'关于',nav_now:'当下',nav_projects:'武器库',nav_writing:'文章',nav_contact:'联系',hero_eyebrow:'圆桌 AI 实验室 · 独立研究',hero_t1:'每一个席位。',hero_t2:'每一个想法。',hero_t3:'为了未见的未来。',hero_desc:'AI工具研究、真实的市场洞察与个人观点——对所有人开放，每一种思考都值得被尊重。',hero_cta1:'我在做什么',hero_cta2:'阅读实验室',scroll:'向下滚动',about_tag:'圆桌主理人',about_title:'刘莉珺',about_p1:'生于上海，现居东京，就职于微软。常年穿梭在AI与投资、使用、开发、部署它的人之间。也曾访问过16个国家和地区，学习各国文化历史，并且仍在探索中。',about_p2:'<strong>圆桌AI实验室是我独立运营的空间——不代表公司或品牌立场，通过我自己的实际体验、就事论事。</strong> 圆桌本身没有主位。开发者、商界人士、研究员、创业者——无论你身处哪个领域，这里都有你的席位，欢迎你的观点、讨论与合作。',about_p3:'这个名字来自圆桌骑士——不是因为他们是英雄，而是因为他们平等而坐。这种精神贯穿这里的一切：<strong>诚实分析、开放分享、为了相同的理念而共同成长。</strong>',pill1:'AI工具研究',pill2:'市场洞察',pill3:'云 · AI',pill4:'东京 · 上海',pill5:'中文 · 日本語 · EN · FR',pill6:'智库',pill7:'咨询',now_tag:'当下篇章',now_title:'我在做什么',now_live:'持续更新 · 2026',n1t:'AI工具研究',n1d:'系统评测AI编程助手、智能体与效率工具——Claude Code、GitHub Copilot等。发布面向各层级从业者的研究报告。',n1tag:'持续进行',n2t:'OpenClaw · RoundTable',n2d:'搭建并实验OpenClaw智能体框架。我的每个Agent都以圆桌骑士命名——亚瑟王是 Orchestrator，梅林法师是 Observer。',n2tag:'积极构建',n3t:'多语言发布',n3d:'用中文、日语、英语撰写AI市场动态——打破语言壁垒，让圆桌的每个席位都有发言权。',n3tag:'三种语言',n4t:'Agentic Coding',n4d:'我正在和AI高频协作写代码，以非传统开发者视角探索开发的可能性——把想法更快、更有创造力地变成可用产品。',n4tag:'AI 协同编码',n5t:'社区分享 · OpenClaw',n5d:'在 Tokyo Generative AI Development Community 活动上分享了 OpenClaw 项目——与本地 AI 开发者交流智能体架构与 Agentic Coding 实践心得。',n5tag:'2026.4.4 · 活动详情',n5tag2:'▶ 观看',proj_tag:'武器库',proj_title:'工具与构建',proj_sub:'精通五种AI Agent工具，以Agentic Coding构建项目——迎接未来的武器库。',proj_agents_title:'AI Agent 工具',proj_oc_title:'OpenClaw · RoundTable',proj_vibe_title:'Agentic Coding',at_oc_tag:'开源项目',at_cop_tag:'AI IDE',at_claude_tag:'自主 AI Agent',at_codex_tag:'自主 AI Agent',at_ag_tag:'自主 AI Agent',at_next_name:'探索下一个...',at_next_tag:'未完待续',oc_master:'The Master',oc_orchestrator:'协调者',oc_lancelot:'SNS运营',oc_gawain:'系统维护',oc_galahad:'情报搜集',oc_bedivere:'文字编辑',oc_tristan:'媒体制作',oc_merlin:'观察者',oc_kay_name:'Kay',oc_percival_name:'Percival',oc_agravain_name:'Agravain',oc_coming_soon:'待上线',p1d:'面向 AI Agent 调用的开源 PowerPoint 生成引擎。可通过 MCP、CLI 或 Docker，用自然语言创建并修订 .pptx。',write_tag:'情报站',write_title:'文章与洞察',write_sub:'AI工具与市场的分析、评论与田野笔记。多语言发布——选择你的席位。',ct_tag:'入席',ct_title:'保持联系',ct_note:'圆桌容得下所有人——<strong>开发者、商界人士、研究者、创业者</strong>。如果你对AI工具感到好奇、正在构建有趣的东西，或只是想交流真诚的观点，欢迎联系。',ct_email_label:'电子邮件',ct_email_handle:'contact@roundtableailab.org',f_slogan:'每一个席位。每一个想法。为了未见的未来。'},
ja:{nav_about:'About',nav_now:'Now',nav_projects:'武器庫',nav_writing:'発信',nav_contact:'連絡',hero_eyebrow:'ラウンドテーブル AI Lab · 独立研究',hero_t1:'すべての席。',hero_t2:'すべてのアイデア。',hero_t3:'その先のために。',hero_desc:'AIツールの研究、正直な市場インサイト、個人的な視点——誰にでも開かれ、あらゆる思考が等しく尊重される場所。',hero_cta1:'今作っているもの',hero_cta2:'ラボを読む',scroll:'スクロール',about_tag:'マスター',about_title:'リュウ　リクン',about_p1:'上海生まれ、現在は東京在住で、Microsoftに勤務しています。私は長年、AIと、その投資・利用・開発・導入に関わる人々のあいだを行き来してきました。これまでに16の国と地域を訪れ、各国の文化や歴史を学んできましたが、まだ探索は続いています。',about_p2:'<strong>RoundTable AI Labは私が独立して運営する場であり、会社やブランドの立場を代表するものではありません。自分自身の実体験にもとづき、個別のテーマごとに是々非々で向き合います。</strong> 円卓そのものに上座はありません。開発者、ビジネスパーソン、研究者、起業家——どの分野にいても、ここにはあなたの席があります。あなたの視点、議論、そして協働を歓迎します。',about_p3:'この名前は円卓の騎士に由来します——彼らが英雄だったからではなく、対等に座ったからです。この精神はここでのすべてに通じています。<strong>誠実な分析、オープンな共有、そして同じ理念のもとで共に成長すること。</strong>',pill1:'AIツール研究',pill2:'市場インテリジェンス',pill3:'クラウド · AI',pill4:'東京 · 上海',pill5:'日本語 · 中文 · EN · FR',pill6:'シンクタンク',pill7:'コンサルティング',now_tag:'現在の章',now_title:'今取り組んでいること',now_live:'更新中 · 2026',n1t:'AIツール研究',n1d:'AIコーディングアシスタント、エージェント、生産性ツールを体系的に評価——Claude Code、GitHub Copilotなど。あらゆるレベルの実践者向けに知見を公開。',n1tag:'継続中',n2t:'OpenClaw · RoundTable',n2d:'OpenClawエージェントフレームワークの構築と実験。私のエージェント群はそれぞれ円卓の騎士の名を冠している——アーサー王は Orchestrator、魔術師マーリンは Observer。',n2tag:'積極開発',n3t:'多言語発信',n3d:'中国語、日本語、英語でAI市場の動向を発信——言語の壁を超え、円卓のすべての席に声を。',n3tag:'3言語',n4t:'Agentic Coding',n4d:'AIと日々ペアでコードを書き、非伝統的な開発者として何を作れるかを探っています。アイデアを、より速く創造的に動くプロダクトへ。',n4tag:'AI協働コーディング',n5t:'コミュニティ登壇 · OpenClaw',n5d:'Tokyo Generative AI Development Community にて OpenClaw を発表——エージェントアーキテクチャと Agentic Coding の知見をローカルAIビルダーと共有。',n5tag:'2026.4.4 · イベント情報',n5tag2:'▶ 視聴',proj_tag:'武器庫',proj_title:'ツールキット & ビルド',proj_sub:'5つのAIエージェントツールを駆使し、Agentic Codingで構築する——未来への武器庫。',proj_agents_title:'AI Agentツール',proj_oc_title:'OpenClaw · RoundTable',proj_vibe_title:'Agentic Coding',at_oc_tag:'オープンソース',at_cop_tag:'AI IDE',at_claude_tag:'自律型AI Agent',at_codex_tag:'自律型AI Agent',at_ag_tag:'自律型AI Agent',at_next_name:'次の一手を探索中...',at_next_tag:'続く',oc_master:'The Master',oc_orchestrator:'オーケストレーター',oc_lancelot:'SNS運営',oc_gawain:'システム保守',oc_galahad:'情報収集',oc_bedivere:'コンテンツ編集',oc_tristan:'メディア制作',oc_merlin:'観察者',oc_kay_name:'Kay',oc_percival_name:'Percival',oc_agravain_name:'Agravain',oc_coming_soon:'近日公開',p1d:'AIエージェントから呼び出せるオープンソースのPowerPoint生成エンジン。MCP・CLI・Docker経由で自然言語から .pptx の作成と改訂ができます。',write_tag:'ディスパッチ',write_title:'発信と洞察',write_sub:'AIツールと市場の分析、コメンタリー、フィールドノート。多言語で公開——あなたの席を選んで。',ct_tag:'着席する',ct_title:'つながろう',ct_note:'円卓には誰でも座れる——<strong>開発者、ビジネスプロフェッショナル、研究者、起業家</strong>。AIツールに興味があれば、何か面白いものを作っていれば、あるいは正直な視点を交換したいだけでも、ぜひ連絡を。',ct_email_label:'メール',ct_email_handle:'contact@roundtableailab.org',f_slogan:'すべての席。すべてのアイデア。その先のために。'},
fr:{nav_about:'À propos',nav_now:'Maintenant',nav_projects:'Arsenal',nav_writing:'Articles',nav_contact:'Contact',hero_eyebrow:'RoundTable AI Lab · Recherche indépendante',hero_t1:'Chaque siège.',hero_t2:'Chaque idée.',hero_t3:'Pour la suite.',hero_desc:"Recherche sur les outils d'IA, veille marché honnête et points de vue personnels — ouvert à tous, où chaque façon de penser mérite sa place.",hero_cta1:'Ce que je construis',hero_cta2:'Lire le Lab',scroll:'Défiler',about_tag:'Le Maître',about_title:'Lijun Liu',about_p1:"Né à Shanghai, aujourd'hui installé à Tokyo et actuellement chez Microsoft. Depuis des années, je navigue entre l'IA et celles et ceux qui y investissent, l'utilisent, la développent et la déploient. J'ai aussi visité 16 pays et régions, découvrant leurs cultures et leurs histoires, et je continue d'explorer.",about_p2:"<strong>Je gère RoundTable AI Lab comme un espace indépendant — il ne représente pas la position d'une entreprise ou d'une marque, et je m'appuie sur mon expérience concrète pour aborder chaque sujet sur ses propres mérites.</strong> La table ronde n'a pas de siège principal. Développeurs, professionnels du monde des affaires, chercheurs, entrepreneurs — quel que soit votre domaine, il y a une place pour vous ici.",about_p3:"Le nom vient des Chevaliers de la Table Ronde — non pas parce qu'ils étaient des héros, mais parce qu'ils siégeaient en égaux. Cet esprit traverse tout ici : <strong>analyse honnête, partage ouvert, et progression commune autour des mêmes convictions.</strong>",pill1:'Recherche outils IA',pill2:'Intelligence marché',pill3:'Cloud · IA',pill4:'Tokyo · Shanghai',pill5:'FR · EN · 中文 · 日本語',pill6:'Think Tank',pill7:'Conseil',now_tag:'Chapitre actuel',now_title:'Sur quoi je travaille',now_live:'En cours · 2026',n1t:'Recherche outils IA',n1d:"Évaluation systématique des assistants de codage IA, agents et outils de productivité — Claude Code, GitHub Copilot et au-delà.",n1tag:'En cours',n2t:'OpenClaw · RoundTable',n2d:"Construction et expérimentation avec le framework d'agents OpenClaw. Chaque agent porte le nom d'un Chevalier de la Table Ronde — le Roi Arthur est l'Orchestrateur, et Magus Merlin est l'Observateur.",n2tag:'Construction active',n3t:'Publication multilingue',n3d:"Écriture sur la dynamique du marché IA en chinois, japonais et anglais — briser la barrière des langues.",n3tag:'3 langues',n4t:'Agentic Coding',n4d:"Je code au quotidien avec l'IA pour explorer, en tant que développeur non traditionnel, jusqu'où l'on peut aller.",n4tag:'Co-coding IA',n5t:'Talk communautaire · OpenClaw',n5d:'Présentation d\'OpenClaw lors de la communauté Tokyo Generative AI Development — partage d\'insights sur l\'architecture agent et l\'Agentic Coding avec les bâtisseurs IA locaux.',n5tag:'2026.4.4 · Détails',n5tag2:'▶ Regarder',proj_tag:'Arsenal',proj_title:'Outils & Créations',proj_sub:"Maîtriser cinq outils AI agent et construire avec Agentic Coding — mon arsenal pour la suite.",proj_agents_title:'Outils AI Agent',proj_oc_title:'OpenClaw · RoundTable',proj_vibe_title:'Agentic Coding',at_oc_tag:'Projet Open Source',at_cop_tag:'AI IDE',at_claude_tag:'AI Agent Autonome',at_codex_tag:'AI Agent Autonome',at_ag_tag:'AI Agent Autonome',at_next_name:'Explorer la suite...',at_next_tag:'À suivre',oc_master:'Le Maître',oc_orchestrator:'Orchestrateur',oc_lancelot:'Opérations SNS',oc_gawain:'Maintenance système',oc_galahad:'Collecte de renseignements',oc_bedivere:'Édition de contenu',oc_tristan:'Production média',oc_merlin:'Observateur',oc_kay_name:'Keu',oc_percival_name:'Perceval',oc_agravain_name:'Agravain',oc_coming_soon:'À venir',p1d:"Moteur open source de génération PowerPoint conçu pour être appelé par des agents IA. Créez et révisez des .pptx en langage naturel via MCP, CLI ou Docker.",write_tag:'La Dépêche',write_title:'Articles & Insights',write_sub:"Analyses, commentaires et notes de terrain sur les outils IA et le marché. Publié en plusieurs langues — choisissez votre siège.",ct_tag:'Prendre un siège',ct_title:'Restons en contact',ct_note:"La table ronde a de la place pour tout le monde — <strong>développeurs, professionnels, chercheurs et entrepreneurs</strong>. Si vous êtes curieux des outils IA ou si vous voulez échanger des perspectives honnêtes, contactez-moi.",ct_email_label:'E-mail',ct_email_handle:'contact@roundtableailab.org',f_slogan:'Chaque siège. Chaque idée. Pour la suite.'}
};

function getLocalizedContent(source,lang){
  if(!source||typeof source!=='object')return '';
  return source[lang]||source.en||source.zh||source.ja||source.fr||'';
}

function mapTranslateLang(lang){return lang==='zh'?'zh-CN':lang}

function pickSourceLang(source,targetLang){
  for(const lang of SUPPORTED_WRITING_LANGS){if(lang!==targetLang&&source[lang])return lang}
  return null;
}

async function translateText(text,fromLang,toLang){
  const sl=mapTranslateLang(fromLang||'auto'),tl=mapTranslateLang(toLang);
  const url=`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;
  const res=await fetch(url);
  if(!res.ok)throw new Error(`Translate request failed: ${res.status}`);
  const data=await res.json();
  if(!Array.isArray(data)||!Array.isArray(data[0]))return '';
  return data[0].map(part=>part[0]).join('').trim();
}

async function translateMissingField(item,field,targetLang){
  if(!AUTO_TRANSLATE_LANGS)return;
  const source=item[field];
  if(!source||typeof source!=='object'||source[targetLang])return;
  const fromLang=pickSourceLang(source,targetLang);
  if(!fromLang)return;
  const original=source[fromLang];
  if(!original)return;
  const key=`${fromLang}:${targetLang}:${field}:${original}`;
  if(translationCache.has(key)){source[targetLang]=translationCache.get(key);return}
  if(translationInFlight.has(key)||translationFailed.has(key))return;
  translationInFlight.add(key);
  try{
    const translated=await translateText(original,fromLang,targetLang);
    if(translated){translationCache.set(key,translated);source[targetLang]=translated}
    else translationFailed.add(key);
  }catch(_){translationFailed.add(key)}
  finally{translationInFlight.delete(key)}
}

function formatWritingDate(date){return typeof date==='string'?date.replace(/-/g,'.'):''}

function sortedWritings(items){
  return[...items].sort((a,b)=>{
    const pinDiff=Number(Boolean(b.pinned))-Number(Boolean(a.pinned));
    if(pinDiff!==0)return pinDiff;
    return new Date(b.date)-new Date(a.date);
  });
}

function renderWritings(){
  const list=document.getElementById('writingList');
  if(!list)return;
  list.innerHTML='';
  const langAtRender=currentLang;
  const translationJobs=[];
  sortedWritings(writingsData).forEach(item=>{
    const article=document.createElement('article');
    article.className='wi';
    const date=document.createElement('span');
    date.className='w-date';
    date.textContent=formatWritingDate(item.date);
    const main=document.createElement('a');
    main.className='w-main';
    main.href=item.links?.linkedin||item.links?.x||'#';
    main.target='_blank';
    main.rel='noopener noreferrer';
    const title=document.createElement('div');
    title.className='w-title';
    title.textContent=getLocalizedContent(item.title,currentLang);
    if(!item.title?.[currentLang])translationJobs.push(translateMissingField(item,'title',currentLang));
    const sub=document.createElement('div');
    sub.className='w-sub';
    sub.textContent=getLocalizedContent(item.summary,currentLang);
    if(!item.summary?.[currentLang])translationJobs.push(translateMissingField(item,'summary',currentLang));
    main.append(title,sub);
    const links=document.createElement('span');
    links.className='w-plat-links';
    if(item.links?.linkedin){
      const a=document.createElement('a');a.className='w-plat-link';a.href=item.links.linkedin;a.target='_blank';a.rel='noopener noreferrer';a.textContent='LinkedIn';links.appendChild(a);
    }
    if(item.links?.x){
      const a=document.createElement('a');a.className='w-plat-link';a.href=item.links.x;a.target='_blank';a.rel='noopener noreferrer';a.textContent='X (Twitter)';links.appendChild(a);
    }
    article.append(date,main,links);
    list.appendChild(article);
  });
  if(translationJobs.length>0){
    Promise.allSettled(translationJobs).then(()=>{if(currentLang===langAtRender)renderWritings()});
  }
}

async function loadWritings(){
  try{
    const res=await fetch('/data/writings.json');
    if(!res.ok)throw new Error(`Failed to load writings: ${res.status}`);
    const data=await res.json();
    writingsData=Array.isArray(data)?data:[];
    renderWritings();
  }catch(err){console.error(err)}
}

function setLang(l){
  currentLang=l;
  const d=T[l];
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(d[k]!==undefined)el.innerHTML=d[k]});
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.remove('active'));
  const map={en:'EN',zh:'中文',ja:'日本語',fr:'FR'};
  document.querySelectorAll('.lang-btn').forEach(b=>{if(b.textContent===map[l])b.classList.add('active')});
  document.documentElement.lang=l==='zh'?'zh-Hans':l==='ja'?'ja':l;
  renderWritings();
}

// ===== INIT =====
setTheme(getInitialTheme(),false);
loadWritings();
setLang(currentLang);
