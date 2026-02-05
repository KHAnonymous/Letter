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
  // 1) 音乐：循环 + 淡入
  // -----------------------------
  let x = document.createElement("audio");
  x.src = "qlx.mp3";
  x.autoplay = true;
  x.loop = true;
  x.volume = 0;

  // ✅ 稳定性：append 到 DOM
  document.body.appendChild(x);

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
  // 2) 打字效果（保留你原逻辑）
  // -----------------------------
  let i = 0;
  let str =
    '雾凇雨凇土松，这一切刚刚好，就像是你，刚刚好是我喜欢的类型。<<' +
    '和你在一起的时候，每天都觉得特别的开心，干什么都开心，不干什么也开心，开心到有点难过，因为我认识你的时间不是那么的刚刚好。<<' +
    '我是一个不太会表达爱意的人，希望下述的话语能述说我的内心。<<' +
    '“我行过许多地方的桥，看过许多次数的云，喝过许多种类的酒，却只爱过一个正当最好年龄的人”。<<' +
    '你一眨眼，温驯的小鹿有跳动一下，柔软的暖风有轻拂一下，遥远的星星有闪烁一下，我也有心动却不止一下。';

  // ✅ 用段落输出：to 之后先开一个段落
  let strp = '<div class="to">to xxx</div><p class="para">';

  function print() {
    if (i >= str.length) return;

    // ✅ 规则1：遇到 << 代表新段落
    if (str[i] === '<' && str[i + 1] === '<') {
      strp += '</p><p class="para">';
      i += 2;
      box.innerHTML = strp + "|";
      return;
    }

    // ✅ 规则2：遇到单个 < 代表仅换行
    if (str[i] === '<') {
      strp += '<br>';
      i += 1;
      box.innerHTML = strp + "|";
      return;
    }

    // 正常输出字符
    strp += str[i];
    box.innerHTML = strp + "|";
    i++;
  }

  setTimeout(() => {
    let printid = setInterval(() => {
      print();
      if (i === str.length) {
        clearInterval(printid);
        strp += '</p><div class="from">from xxx</div>';
        box.innerHTML = strp;
      }
    }, 190);
  }, 5500);

  // -----------------------------
  // 3) 背景淡入 + 视频淡入播放
  // -----------------------------
  setTimeout(() => {
    bg.style.opacity = 1;

    bgVideo.style.opacity = 1;
    bgVideo.play().catch(() => {}); // ✅ 移动端更稳
  }, 50);
}


// -------------------------------------------------------
// ✅ 接管：点 eLuvLetter 的蜡封 #open → 切幕 → startLetter()
// -------------------------------------------------------
(function bindEluvOpen() {
  const openBtn = document.getElementById('open');
  if (!openBtn) return;

  openBtn.addEventListener('click', () => {
    // 让 eLuvLetter 自己的翻开动画先跑一会儿（可调）
    setTimeout(() => {
      // 1) 可选：停掉 eLuvLetter BGM
      const music = document.getElementById('music');
      if (music && !music.paused) music.pause();

      // 先显示第二幕（但不要黑屏）
      if (stage) stage.classList.add('show');

      // 立刻启动第二幕（让视频尽快开始淡入）
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


    }, 1200); // ✅ 这里控制“翻开后多久切幕”
  }, true);
})();
