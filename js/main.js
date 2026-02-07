let envelope_opened = false;
let content = {
  salutation: "",
  signature: "",
  body: "",
  sign: 0
};

function playPause() {
  let player = document.getElementById('music');
  let play_btn = $('#music_btn');
  if (player.paused) {
    player.play();
    play_btn.attr('class', 'play');
  } else {
    player.pause();
    play_btn.attr('class', 'mute');
  }
}

// ✅ 统一封装：让 #contact 永远垂直居中
function centerContact() {
  const contact = $('#contact');
  if (!contact.length) return;

  // ✅ 优先用 visualViewport（移动端/地址栏变化更准）
  const vh = (window.visualViewport && window.visualViewport.height) ? window.visualViewport.height : window.innerHeight;

  // 防止出现负值
  let mtop = (vh - contact.outerHeight()) * 0.5;
  mtop = Math.max(12, mtop); // 最小留一点边距
  contact.css('margin-top', mtop + 'px');
}

window.onload = function () {
  loadingPage();
  $.ajaxSettings.async = true;

  $.getJSON("./font/content.json", function (result) {
    content.salutation = result.salutation;
    content.signature = result.signature;
    content.body = result.body;
    content.sign = getPureStr(content.signature).pxWidth('18px Satisfy, serif');

    document.title = result.title;
    $('#recipient').append(result.recipient);
    $('#flipback').text(result.sender);
    $('#music').attr('src', result.bgm);

    // ✅ 让 envelope 出现后再居中一次
    $('#envelope').fadeIn('slow', function () {
      centerContact();
    });

    $('.heart').fadeOut('fast');

    let currentUrl = window.location.href;
    let firstIndex = currentUrl.indexOf("#");
    if (firstIndex <= 0) window.location.href = currentUrl + "#contact";
  });

  // ✅ 初次居中 + 下一帧再居中（避免字体/图片晚加载导致漂）
  centerContact();
  requestAnimationFrame(centerContact);

  $('body').css('opacity', '1');
  $('#jsi-cherry-container').css('z-index', '-99');
};

window.onresize = function () {
  let cherry_container = $('#jsi-cherry-container');
  let canvas = cherry_container.find('canvas').eq(0);
  canvas.height(cherry_container.height());
  canvas.width(cherry_container.width());

  loadingPage();

  // ✅ 尺寸变化时同步重新居中
  centerContact();
};

// ✅ 移动端旋转屏幕/地址栏变化也会影响高度
window.addEventListener('orientationchange', () => {
  setTimeout(centerContact, 200);
});

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', centerContact);
}
