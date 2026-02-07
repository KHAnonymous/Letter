// =======================================================
// 第二幕（你的视频+读信）启动：由 eLuvLetter 的 #open 触发
// 依赖：HTML 有 #myStage #myBox #bgVideo #letterText
// =======================================================

// ✅ 取第二幕的 DOM（注意：已改名避免与 eLuvLetter 冲突）
let stage   = document.querySelector('#myStage');
let bg      = document.querySelector('#myBox');
let bgVideo = document.querySelector('#bgVideo');
let box     = document.querySelector('#letterText');

// -------------------------------------------------------
// ✅ 把你原来 heart.click 的全部逻辑封装为 startLetter()
// -------------------------------------------------------
function startLetter() {
  // 允许背景层接收滚动/鼠标（第二幕）
  bg.classList.add('active'); // 配合 my-letter.css 里的 .active
  bg.style.pointerEvents = "auto";

  // -----------------------------
  // 1) 音乐：循环 + 淡入（移动端可能需要用户手势才能播放，失败就忽略）
  // -----------------------------
  let x = document.createElement("audio");
  x.src = "qlx.mp3";
  x.loop = true;
  x.volume = 0;

  // ✅ 稳定性：append 到 DOM
  document.body.appendChild(x);

  // ✅ 尝试播放（如果手机拦截，就算了，不影响后续）
  x.play().catch(() => {});

  let vol = 0;
  let fadeIn = setInterval(() => {
    vol += 0.02;
    if (vol >= 0.6) {
      vol = 0.6;
      clearInterval(fadeIn);
    }
    x.volume = vol;
  }, 200);


    
  // -----------------------------
  // 2) 打字效果（性能优化版：移动端批量输出，减少卡顿）
  // -----------------------------

  let i = 0;

  const toName = "莉莉：";
  const fromName = "大师兄";

  // ✅ 用模板字符串写长文本（保留你原来的自然段换行）
  let str = `我是一个有表达恐惧的人，从没想过自己有一天会以书信的形式，将内心的想法娓娓道来。初访湄洲岛，落日迷人眼。当初我随口一句：“有机会我真想拜访下泉州的各路神仙”。没想到，等来的是你一句，“大师兄，我和你说一件事儿，你别打我，我已经和妈祖打好招呼了，我们即刻起身前往湄洲岛”。听到这话时，我没有计划被打乱的不安，反而满是惊喜与期待。伴随着你的歌单，还有你那“莉式”踩油门的节奏，心在远方，身在路上，我们就这样出发了。环岛骑行、妈祖庙前的许愿、登高远眺、海边的落日……一幕一幕，深深刻在我的脑海里。那一刻，我的心，不止动了一下。

夜爬清源山，满城烟火绽放。机缘巧合下，我有了和你一起跨年的机会，而且还是夜爬清源山，一个我当初多少有点口嗨的想法。庆幸有你，不然我可能还没进山门就已经打退堂鼓了。起初我以为只是普通的登山步道，直到开始略显狼狈时，恰巧你说了一句：“肯定不会再有女生陪你夜爬伸手不见五指的山了。”那一刻，我的内心像是被狠狠撞了一下。我不曾想过自己会夜爬跨年，会在山顶对酒当歌，会登高欣赏满城的烟花，怀揣着下一刻它会在哪儿绽放的期待；也不曾想过，这一件件事情，会有人始终陪在身旁。那一晚，理性与感性不断博弈，我辗转难眠。

雾凇、雨凇、土松，还有那不合时宜的告白。我一句“有机会我想看看雾凇。”你却认真地回应：“大师兄，我在九仙山群里蹲了一下，听说过几日大概率会有雾凇，我们凌晨出发吧。”我没想过雾凇能美到令人失语，天地仿佛忽然失了色，只剩下呼吸时呼出的白。时间在那里走得很慢，慢到你能看清每一根松针上凝结的星辰。在记录风形状的雾凇，乖巧可爱的土松，还有融化得触不及防的雨凇的见证下，我听着你讲述上回和朋友们前来的经历，呼吸着沁人心脾的空气，感受着脚下每一步的小心翼翼，也是我第一回真正听从了内心深处的声音。晚上吃饭时，我下意识想选一家“漂亮饭”，却没想到最后约的是烧烤。更没想到，在确认你能听清我声音之后，我还是把那句话说出了口。其实，在你没有立刻回应的时候，我的大脑一片空白。庆幸的是，你并没有婉拒，而是说，希望再相处一段时间，再给我答复。回去的路上，你耐心地向我袒露了你的顾虑。说实话，那些问题我并非没有想过，只是真正被你问起时，还是会生出一种“百口难辨”的无力感。那一晚，我其实有点害怕，害怕第二天开始，我们的关系会变得尴尬。好在，后来证明，我只是多虑了。

你是“闪闪发光但不耀眼夺目”的人，是看清生活的另一面，仍旧对生活充满热忱的人。是温暖自己更温暖他人的人。于我而言，你像是在不断敲击着我的世界。我曾害怕自己辛苦守护的安宁被打破，试图将自己推离你，但从你敲击的裂缝里，我发现了阳光。你是我难以预料的惊喜，也是我来日方长的温柔。他们说，每个人都有独属于自己的语言。若你愿意，我会认真学习你的“语法”，细心倾听你的心声。正如你所说：“好的感情不是三分钟热度，而是细水长流，对的人，最终会站在你的前途里。”我希望有个如你一般的人，如山间清爽的风，如古城温暖的阳光，是你就好。从清晨到夜晚，从山野到书房，只要最后是你就好。不是清风偏拂柳，是尔存时万物春。`;

  
  // ✅ 先写 To + 第一段
  let strp = `<div class="to">致${toName}</div><p class="para">`;

  // ✅ 移动端判定（尽量简单可靠）
  const isMobile = window.matchMedia("(max-width: 768px)").matches || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  // ✅ 移动端：每次吐出更多字符，减少 innerHTML 刷新频率
  const charsPerTick = isMobile ? 3 : 1;
  // ✅ 移动端：间隔更大一点，减少 CPU 占用
  const tickMs = isMobile ? 70 : 90;

  // ✅ 光标闪烁（不用每个字都拼一次 |）
  let cursorOn = true;
  let cursorTimer = setInterval(() => {
    cursorOn = !cursorOn;
    // 只有在打字过程中才更新光标
    if (i < str.length) box.innerHTML = strp + (cursorOn ? "|" : "");
  }, 350);

  function stepOnce() {
    if (i >= str.length) return false;

    // 空行：新段落
    if (str[i] === '\n' && str[i + 1] === '\n') {
      strp += '</p><p class="para">';
      i += 2;
      return true;
    }

    // 单换行：<br>
    if (str[i] === '\n') {
      strp += '<br>';
      i += 1;
      return true;
    }

    // 普通字符
    strp += str[i];
    i++;
    return true;
  }

  setTimeout(() => {
    const printid = setInterval(() => {
      // ✅ 批量输出
      for (let k = 0; k < charsPerTick; k++) {
        if (!stepOnce()) break;
      }

      // ✅ 统一刷新（减少次数）
      box.innerHTML = strp + (cursorOn ? "|" : "");

      if (i >= str.length) {
        clearInterval(printid);
        clearInterval(cursorTimer);
        strp += `</p><div class="from">${fromName}</div>`;
        box.innerHTML = strp;
      }
    }, tickMs);
  }, 5500);

  
  
  
  
  
  // -----------------------------
  // 3) 背景淡入 + 视频淡入（⚠️ 注意：首次播放已移到 click 事件里）
  // -----------------------------
  requestAnimationFrame(() => {
    bg.style.opacity = 1;
    bgVideo.style.opacity = 1;
  });
}


// -------------------------------------------------------
// ✅ 接管：点 eLuvLetter 的蜡封 #open → 切幕 → startLetter()
// -------------------------------------------------------
(function bindEluvOpen() {
  const openBtn = document.getElementById('open');
  if (!openBtn) return;

  openBtn.addEventListener('click', () => {

    // 1) 可选：停掉 eLuvLetter BGM
    const music = document.getElementById('music');
    if (music && !music.paused) music.pause();

    // 2) 先显示第二幕
    if (stage) stage.classList.add('show');

    // 3) ✅ 关键：在“用户点击”这一刻，立刻触发视频播放（移动端才不会拦截）
    if (bgVideo) {
      // 再保险一次（iOS/安卓更稳）
      bgVideo.muted = true;
      bgVideo.setAttribute('muted', '');
      bgVideo.setAttribute('playsinline', '');
      bgVideo.setAttribute('webkit-playsinline', '');

      // 让它先变可见（就算 CSS 里默认 0，这里也先给到 1）
      bgVideo.style.opacity = 1;
      bg.style.opacity = 1;

      // 有些机型需要 load 一次
      try { bgVideo.load(); } catch(e) {}

      // ✅ play 必须在 click 同步链中
      bgVideo.play().catch(() => {});
    }

    // 4) 让 eLuvLetter 自己的翻开动画先跑一会儿（可调）
    setTimeout(() => {

      // 立刻启动第二幕（打字/音乐/淡入）
      startLetter();

      // 再把第一幕做“渐隐”，而不是瞬间 display:none
      const env = document.getElementById('envelope');
      const sakuraLayer = document.getElementById('jsi-cherry-container');

      [env, sakuraLayer].forEach(el => {
        if (!el) return;
        el.style.transition = 'opacity .8s';
        el.style.opacity = '0';
        setTimeout(() => { el.style.display = 'none'; }, 800);
      });

    }, 1200);

  }, true);
})();
