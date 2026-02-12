// =======================================================
// 第二幕（你的视频+读信）启动：由 eLuvLetter 的 #open 触发
// 依赖：HTML 有 #myStage #myBox #bgVideo #letterText
// =======================================================

let stage   = document.querySelector('#myStage');
let bg      = document.querySelector('#myBox');
let bgVideo = document.querySelector('#bgVideo');
let box     = document.querySelector('#letterText');

// ✅ 全局保存 BGM，避免重复创建 & 便于在 click 中播放
let bgm = null;

// ✅ 全局：控制“打字额外延迟”（用于等待视频真正开始播放）
let extraTypingDelayMs = 0;

// ✅ ✅ ✅ 淡入计时器句柄，避免重复开多个 interval
let bgmFadeTimer = null;

// ✅ 统一的移动端判定（click 与 startLetter 用同一套）
function isMobileDevice() {
  return (
    window.matchMedia("(max-width: 768px)").matches ||
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  );
}

// ✅ 等待视频真正进入 playing（手机端首帧就绪更可信）
function waitVideoPlaying(video, timeoutMs) {
  return new Promise((resolve) => {
    if (!video) return resolve(false);

    // 已经在播
    if (!video.paused && video.currentTime > 0) return resolve(true);

    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      resolve(!!ok);
    };

    const onPlaying = () => finish(true);
    video.addEventListener('playing', onPlaying, { once: true });

    setTimeout(() => finish(false), timeoutMs);
  });
}

// ✅ ✅ ✅ 统一的 BGM 淡入：放到“点击链路”里更符合手机策略
function fadeInBgm(targetVol = 0.6, step = 0.02, intervalMs = 200) {
  if (!bgm) return;

  // 避免重复淡入叠加
  if (bgmFadeTimer) clearInterval(bgmFadeTimer);

  // 从当前音量继续
  let vol = Math.max(0, Math.min(bgm.volume || 0, targetVol));

  bgmFadeTimer = setInterval(() => {
    vol += step;
    if (vol >= targetVol) {
      vol = targetVol;
      clearInterval(bgmFadeTimer);
      bgmFadeTimer = null;
    }
    bgm.volume = vol;
  }, intervalMs);
}

// ✅ ✅ ✅（保活）防止视频开始后把音频挤掉
function keepBgmAlive(ms = 12000) {
  if (!bgm) return;
  const start = Date.now();

  const timer = setInterval(() => {
    if (Date.now() - start > ms) {
      clearInterval(timer);
      return;
    }

    const stageShown = stage && stage.classList.contains('show');
    if (stageShown && bgm.paused) {
      bgm.play().catch(() => {});
    }
  }, 800);

  const onVis = () => {
    if (document.visibilityState === 'visible') {
      try { bgm.play().catch(() => {}); } catch(e) {}
    }
  };
  document.addEventListener('visibilitychange', onVis, { passive: true });

  setTimeout(() => {
    document.removeEventListener('visibilitychange', onVis);
  }, ms + 1000);
}

// -------------------------------------------------------
// ✅ 把你原来 heart.click 的全部逻辑封装为 startLetter()
// -------------------------------------------------------
function startLetter() {
  if (!bg || !bgVideo || !box) return;

  bg.classList.add('active');
  bg.style.pointerEvents = "auto";

  // -----------------------------
  // 1) 音乐：只做淡入（play 放到 click 里）
  // -----------------------------
  if (bgm) {
    bgm.loop = true;
    fadeInBgm(0.6, 0.02, 200);
  }

  // -----------------------------
  // 2) 打字效果（移动端批量输出）
  // -----------------------------
  let i = 0;

  const toName = "莉莉：";
  const fromName = "大师兄";

  let str = `我是一个有表达恐惧的人，从没想过自己有一天会以书信的形式，将内心的想法娓娓道来。初访湄洲岛，落日迷人眼。当初我随口一句：“有机会我真想拜访下泉州的各路神仙”。没想到，等来的是你一句，“大师兄，我和你说一件事儿，你别打我，我已经和妈祖打好招呼了，我们即刻起身前往湄洲岛”。听到这话时，我没有计划被打乱的不安，反而满是惊喜与期待。伴随着你的歌单，还有你那“莉式”踩油门的节奏，心在远方，身在路上，我们就这样出发了。环岛骑行、妈祖庙前的许愿、登高远眺、海边的落日……一幕一幕，深深刻在我的脑海里。那一刻，我的心，不止动了一下。

夜爬清源山，满城烟火绽放。机缘巧合下，我有了和你一起跨年的机会，而且还是夜爬清源山，一个我当初多少有点口嗨的想法。庆幸有你，不然我可能还没进山门就已经打退堂鼓了。起初我以为只是普通的登山步道，直到开始略显狼狈时，恰巧你说了一句：“肯定不会再有女生陪你夜爬伸手不见五指的山了。”那一刻，我的内心像是被狠狠撞了一下。我不曾想过自己会夜爬跨年，会在山顶对酒当歌，会登高欣赏满城的烟花，怀揣着下一刻它会在哪儿绽放的期待；也不曾想过，这一件件事情，会有人始终陪在身旁。那一晚，理性与感性不断博弈，我辗转难眠。

雾凇、雨凇、土松，还有那不合时宜的告白。我一句“有机会我想看看雾凇。”你却认真地回应：“大师兄，我在九仙山群里蹲了一下，听说过几日大概率会有雾凇，我们凌晨出发吧。”我没想过雾凇能美到令人失语，天地仿佛忽然失了色，只剩下呼吸时呼出的白。时间在那里走得很慢，慢到你能看清每一根松针上凝结的星辰。在记录风形状的雾凇，乖巧可爱的土松，还有融化得触不及防的雨凇的见证下，我听着你讲述上回和朋友们前来的经历，呼吸着沁人心脾的空气，感受着脚下每一步的小心翼翼，也是我第一回真正听从了内心深处的声音。晚上吃饭时，我下意识想选一家“漂亮饭”，却没想到最后约的是烧烤。更没想到，在确认你能听清我声音之后，我还是把那句话说出了口。其实，在你没有立刻回应的时候，我的大脑一片空白。庆幸的是，你并没有婉拒，而是说，希望再相处一段时间，再给我答复。回去的路上，你耐心地向我袒露了你的顾虑。说实话，那些问题我并非没有想过，只是真正被你问起时，还是会生出一种“百口难辨”的无力感。那一晚，我其实有点害怕，害怕第二天开始，我们的关系会变得尴尬。好在，后来证明，我只是多虑了。

你是“闪闪发光但不耀眼夺目”的人，是看清生活的另一面，仍旧对生活充满热忱的人。是温暖自己更温暖他人的人。于我而言，你像是在不断敲击着我的世界。我曾害怕自己辛苦守护的安宁被打破，试图将自己推离你，但从你敲击的裂缝里，我发现了阳光。你是我难以预料的惊喜，也是我来日方长的温柔。他们说，每个人都有独属于自己的语言。若你愿意，我会认真学习你的“语法”，细心倾听你的心声。正如你所说：“好的感情不是三分钟热度，而是细水长流，对的人，最终会站在你的前途里。”我希望有个如你一般的人，如山间清爽的风，如古城温暖的阳光，是你就好。从清晨到夜晚，从山野到书房，只要最后是你就好。不是清风偏拂柳，是尔存时万物春。`;

  let strp = `<div class="to">致${toName}</div><p class="para">`;

  const isMobile = isMobileDevice();
  const charsPerTick = isMobile ? 3 : 1;
  const tickMs = isMobile ? 70 : 90;

  const baseStartDelayMs = isMobile ? 1200 : 1800;
  const startDelayMs = baseStartDelayMs + (extraTypingDelayMs || 0);

  // 光标闪烁
  let cursorOn = true;

  function blinkCursor() {
    cursorOn = !cursorOn;
    if (i < str.length) box.innerHTML = strp + (cursorOn ? "|" : "");
  }
  let cursorTimer = setInterval(blinkCursor, 350);

  function stepOnce() {
    if (i >= str.length) return false;

    if (str[i] === '\n' && str[i + 1] === '\n') {
      strp += '</p><p class="para">';
      i += 2;
      return true;
    }
    if (str[i] === '\n') {
      strp += '<br>';
      i += 1;
      return true;
    }

    strp += str[i];
    i++;
    return true;
  }

  setTimeout(() => {
    const printid = setInterval(() => {
      for (let k = 0; k < charsPerTick; k++) {
        if (!stepOnce()) break;
      }

      box.innerHTML = strp + (cursorOn ? "|" : "");

      if (i >= str.length) {
        clearInterval(printid);
        clearInterval(cursorTimer);
        strp += `</p><div class="from">${fromName}</div>`;
        box.innerHTML = strp;
      }
    }, tickMs);
  }, startDelayMs);

  // 背景淡入 + 视频淡入
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

  openBtn.addEventListener('click', async (e) => {

    // ✅✅✅ 核心：彻底接管点击，阻断 letter.js 的 $("#open").click + 阻断 href="#content"
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const isMobile = isMobileDevice();

    // 1) 停掉 eLuvLetter BGM
    const music = document.getElementById('music');
    if (music) {
      try { music.pause(); } catch (err) {}
      music.muted = true;
      music.volume = 0;
    }

    // 2) 显示第二幕
    if (stage) {
      stage.classList.add('show');
      stage.classList.remove('ready'); // ✅ 先隐藏文字，等视频 ready 再 show
    }

    // 3) ✅ 设备切换视频源：手机用 skystar_m.mp4，其他用 skystar.mp4
    if (bgVideo) {
      const desktopSrc = bgVideo.getAttribute('data-src-desktop') || 'skystar.mp4';
      const mobileSrc  = bgVideo.getAttribute('data-src-mobile')  || 'skystar_m.mp4';
      const targetSrc  = isMobile ? mobileSrc : desktopSrc;

      if (bgVideo.getAttribute('src') !== targetSrc) {
        bgVideo.setAttribute('src', targetSrc);
      }

      // iOS/安卓稳健属性
      bgVideo.muted = true;
      bgVideo.volume = 0;
      bgVideo.playsInline = true;              // ✅ iOS 更稳：property
      bgVideo.setAttribute('muted', '');
      bgVideo.setAttribute('playsinline', '');
      bgVideo.setAttribute('webkit-playsinline', '');
      bgVideo.setAttribute('preload', 'auto');
      bgVideo.loop = true;

      // 让它先可见（避免首帧出来但被 opacity 藏掉）
      bgVideo.style.opacity = 1;
      if (bg) bg.style.opacity = 1;

      try { bgVideo.load(); } catch(e) {}
    }

    // 4) ✅ BGM：在点击链路内创建+播放（最稳）
    if (!bgm) {
      bgm = document.createElement("audio");
      bgm.src = "qlx.mp3";
      bgm.loop = true;
      bgm.preload = "auto";
      bgm.volume = 0;
      bgm.setAttribute('playsinline', '');
      bgm.setAttribute('webkit-playsinline', '');
      document.body.appendChild(bgm);

      // ✅ 循环兜底：部分机型 loop 不可靠，ended 时手动续播
      bgm.addEventListener('ended', () => {
        try {
          bgm.currentTime = 0;
          bgm.play().catch(() => {});
        } catch(e) {}
      });
    }

    // ✅✅✅ 先尝试播放（必须在 click 链路里）
    bgm.play().catch(() => {});

    // ✅ 立刻淡入（否则会“等很久才听到”）
    fadeInBgm(0.6, 0.02, 200);

    // 5) ✅ 触发视频播放（仍在 click 链路）
    if (bgVideo) {
      bgVideo.play().catch(() => {});
    }

    // ✅✅✅ 视频真正 ready 后：显示文字层（解决“白雾+先字后景”）
    if (bgVideo && stage) {
      const markReady = () => {
        stage.classList.add('ready');
        // 再补一次 bgm.play（很多手机 video 起来会挤掉音频）
        try { bgm && bgm.play().catch(() => {}); } catch(e) {}
      };
      bgVideo.addEventListener('playing', markReady, { once: true });
      bgVideo.addEventListener('canplay', markReady, { once: true });
    }

    // 6) ✅ 手机端：等 video 真正 playing，再把“额外打字延迟”降为 0
    if (isMobile) {
      extraTypingDelayMs = 1400; // 给一个“等待首帧”的缓冲
      const ok = await waitVideoPlaying(bgVideo, 2500);
      if (ok) extraTypingDelayMs = 0;

      keepBgmAlive(15000);
    } else {
      extraTypingDelayMs = 0;
    }

    // 7) 第一幕渐隐 + 启动第二幕
    setTimeout(() => {

      startLetter();

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
