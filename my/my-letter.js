// =======================================================
// 第二幕（视频背景 + 读信）启动：由 eLuvLetter 的 #open 触发
// 依赖：HTML 有 #myStage #myBox #bgVideo #letterText
// =======================================================

let stage   = document.querySelector('#myStage');
let bg      = document.querySelector('#myBox');
let bgVideo = document.querySelector('#bgVideo');
let box     = document.querySelector('#letterText');

let bgm = null;
let bgmFadeTimer = null;

// ✅ 统一移动端判定
function isMobileDevice() {
  return (
    window.matchMedia("(max-width: 768px)").matches ||
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  );
}

// ✅ BGM 淡入
function fadeInBgm(targetVol = 0.6, step = 0.02, intervalMs = 160) {
  if (!bgm) return;
  if (bgmFadeTimer) clearInterval(bgmFadeTimer);

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

// ✅ 手机端保活：防止 video 抢占后 bgm 被暂停
function keepBgmAlive(ms = 15000) {
  if (!bgm) return;
  const start = Date.now();

  const timer = setInterval(() => {
    if (Date.now() - start > ms) {
      clearInterval(timer);
      return;
    }
    const stageShown = stage && stage.classList.contains('show');
    if (stageShown && bgm.paused) bgm.play().catch(() => {});
  }, 700);

  const onVis = () => {
    if (document.visibilityState === 'visible') {
      bgm.play().catch(() => {});
    }
  };
  document.addEventListener('visibilitychange', onVis, { passive: true });

  setTimeout(() => {
    document.removeEventListener('visibilitychange', onVis);
  }, ms + 1200);
}

// ✅ 等到 canplay（有足够数据可以开始播）
function waitCanPlay(video, timeoutMs = 6000) {
  return new Promise((resolve) => {
    if (!video) return resolve(false);
    if (video.readyState >= 3) return resolve(true);

    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      resolve(!!ok);
    };

    video.addEventListener('canplay', () => finish(true), { once: true });
    setTimeout(() => finish(false), timeoutMs);
  });
}

// ✅ 等“首帧真的画出来”
function waitFirstFrame(video, timeoutMs = 6000) {
  return new Promise((resolve) => {
    if (!video) return resolve(false);
    if (video.currentTime > 0 && !video.paused) return resolve(true);

    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      resolve(!!ok);
    };

    if (typeof video.requestVideoFrameCallback === 'function') {
      const t0 = performance.now();
      const tick = () => {
        video.requestVideoFrameCallback(() => {
          if (video.currentTime > 0 || performance.now() - t0 > 1200) finish(true);
          else tick();
        });
      };
      tick();
      setTimeout(() => finish(false), timeoutMs);
      return;
    }

    const onLoaded = () => finish(true);
    const onTimeUpdate = () => {
      if (video.currentTime > 0) finish(true);
    };

    video.addEventListener('loadeddata', onLoaded, { once: true });
    video.addEventListener('timeupdate', onTimeUpdate);

    setTimeout(() => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      finish(false);
    }, timeoutMs);
  });
}

// -------------------------------------------------------
// ✅ 第二幕打字逻辑
// -------------------------------------------------------
function startLetter() {
  if (!box) return;

  // ✅ 允许滚动/交互
  if (bg) {
    bg.classList.add('active');
    bg.style.pointerEvents = "auto";
  }

  // ✅ 如果你 CSS 没切到 ready，这里也兜底强制可见
  if (stage) stage.classList.add('ready');
  box.style.opacity = "1";

  const isMobile = isMobileDevice();
  const charsPerTick = 1;
  const tickMs = isMobile ? 55 : 85;
  const baseStartDelayMs = isMobile ? 650 : 1400;

  let i = 0;

  const toName = "莉莉：";
  const fromName = "大师兄";

  let str = `我是一个有表达恐惧的人，从没想过自己有一天会以书信的形式，将内心的想法娓娓道来。初访湄洲岛，落日迷人眼。当初我随口一句：“有机会我真想拜访下泉州的各路神仙”。没想到，等来的是你一句，“大师兄，我和你说一件事儿，你别打我，我已经和妈祖打好招呼了，我们即刻起身前往湄洲岛”。听到这话时，我没有计划被打乱的不安，反而满是惊喜与期待。伴随着你的歌单，还有你那“莉式”踩油门的节奏，心在远方，身在路上，我们就这样出发了。环岛骑行、妈祖庙前的许愿、登高远眺、海边的落日……一幕一幕，深深刻在我的脑海里。那一刻，我的心，不止动了一下。

夜爬清源山，满城烟火绽放。机缘巧合下，我有了和你一起跨年的机会，而且还是夜爬清源山，一个我当初多少有点口嗨的想法。庆幸有你，不然我可能还没进山门就已经打退堂鼓了。起初我以为只是普通的登山步道，直到开始略显狼狈时，恰巧你说了一句：“肯定不会再有女生陪你夜爬伸手不见五指的山了。”那一刻，我的内心像是被狠狠撞了一下。我不曾想过自己会夜爬跨年，会在山顶对酒当歌，会登高欣赏满城的烟花，怀揣着下一刻它会在哪儿绽放的期待；也不曾想过，这一件件事情，会有人始终陪在身旁。那一晚，理性与感性不断博弈，我辗转难眠。

雾凇、雨凇、土松，还有那不合时宜的告白。我一句“有机会我想看看雾凇。”你却认真地回应：“大师兄，我在九仙山群里蹲了一下，听说过几日大概率会有雾凇，我们凌晨出发吧。”我没想过雾凇能美到令人失语，天地仿佛忽然失了色，只剩下呼吸时呼出的白。时间在那里走得很慢，慢到你能看清每一根松针上凝结的星辰。在记录风形状的雾凇，乖巧可爱的土松，还有融化得触不及防的雨凇的见证下，我听着你讲述上回和朋友们前来的经历，呼吸着沁人心脾的空气，感受着脚下每一步的小心翼翼，也是我第一回真正听从了内心深处的声音。晚上吃饭时，我下意识想选一家“漂亮饭”，却没想到最后约的是烧烤。更没想到，在确认你能听清我声音之后，我还是把那句话说出了口。其实，在你没有立刻回应的时候，我的大脑一片空白。庆幸的是，你并没有婉拒，而是说，希望再相处一段时间，再给我答复。回去的路上，你耐心地向我袒露了你的顾虑。说实话，那些问题我并非没有想过，只是真正被你问起时，还是会生出一种“百口难辨”的无力感。那一晚，我其实有点害怕，害怕第二天开始，我们的关系会变得尴尬。好在，后来证明，我只是多虑了。

你是“闪闪发光但不耀眼夺目”的人，是看清生活的另一面，仍旧对生活充满热忱的人。是温暖自己更温暖他人的人。于我而言，你像是在不断敲击着我的世界。我曾害怕自己辛苦守护的安宁被打破，试图将自己推离你，但从你敲击的裂缝里，我发现了阳光。你是我难以预料的惊喜，也是我来日方长的温柔。他们说，每个人都有独属于自己的语言。若你愿意，我会认真学习你的“语法”，细心倾听你的心声。正如你所说：“好的感情不是三分钟热度，而是细水长流，对的人，最终会站在你的前途里。”我希望有个如你一般的人，如山间清爽的风，如古城温暖的阳光，是你就好。从清晨到夜晚，从山野到书房，只要最后是你就好。不是清风偏拂柳，是尔存时万物春。`;

  let strp = `<div class="to">致${toName}</div><p class="para">`;

  let cursorOn = true;
  const cursorTimer = setInterval(() => {
    cursorOn = !cursorOn;
    if (i < str.length) box.innerHTML = strp + (cursorOn ? "|" : "");
  }, 360);

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
  }, baseStartDelayMs);
}

// -------------------------------------------------------
// ✅ 接管：点 #open → 切到第二幕
// -------------------------------------------------------
(function bindEluvOpen() {
  const openBtn = document.getElementById('open');
  if (!openBtn) return;

  openBtn.addEventListener('click', async () => {
    const isMobile = isMobileDevice();

    const music = document.getElementById('music');
    if (music && !music.paused) music.pause();

    if (stage) stage.classList.add('show');

    if (bg) {
      bg.style.opacity = 1;
      bg.style.backgroundColor = "#000";
    }
    if (bgVideo) {
      bgVideo.style.opacity = 1;
      bgVideo.style.backgroundColor = "#000";
    }

    if (bgVideo) {
      const desktopSrc = bgVideo.getAttribute('data-src-desktop') || 'skystar.mp4';
      const mobileSrc  = bgVideo.getAttribute('data-src-mobile')  || 'skystar_m_safe.mp4';
      const targetSrc  = isMobile ? mobileSrc : desktopSrc;

      if (bgVideo.getAttribute('src') !== targetSrc) {
        bgVideo.setAttribute('src', targetSrc);
      }

      bgVideo.muted = true;
      bgVideo.volume = 0;
      bgVideo.setAttribute('muted', '');
      bgVideo.setAttribute('playsinline', '');
      bgVideo.setAttribute('webkit-playsinline', '');
      bgVideo.setAttribute('preload', 'auto');
      bgVideo.loop = true;

      try { bgVideo.load(); } catch(e) {}
    }

    if (!bgm) {
      bgm = document.createElement("audio");
      bgm.src = "qlx.mp3";
      bgm.loop = true;
      bgm.preload = "auto";
      bgm.volume = 0;
      bgm.setAttribute('playsinline', '');
      bgm.setAttribute('webkit-playsinline', '');
      document.body.appendChild(bgm);

      bgm.addEventListener('ended', () => {
        try {
          bgm.currentTime = 0;
          bgm.play().catch(() => {});
        } catch(e) {}
      });
    }

    bgm.play().catch(() => {});
    fadeInBgm(0.6, 0.02, 160);

    if (bgVideo) {
      await waitCanPlay(bgVideo, 6500);
      bgVideo.play().catch(() => {});
      bgVideo.addEventListener('play', () => bgm && bgm.play().catch(() => {}), { once: true });
      bgVideo.addEventListener('playing', () => bgm && bgm.play().catch(() => {}), { once: true });

      await waitFirstFrame(bgVideo, 6500);

      // ✅✅✅ 关键修复：首帧到位后，标记 ready，文字层才会显示
      if (stage) stage.classList.add('ready');
    } else {
      if (stage) stage.classList.add('ready');
    }

    if (isMobile) keepBgmAlive(16000);

    const env = document.getElementById('envelope');
    const sakuraLayer = document.getElementById('jsi-cherry-container');

    [env, sakuraLayer].forEach(el => {
      if (!el) return;
      el.style.transition = 'opacity .6s';
      el.style.opacity = '0';
      setTimeout(() => { el.style.display = 'none'; }, 650);
    });

    startLetter();
  }, true);
})();
