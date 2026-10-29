(function () {
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  var header = $('#header'), bar = $('.progress'), nav = $('nav'), burger = $('.burger');
  var cur = $('.cursor'), lastY = 0;

  /* 스크롤: 진행 바, 헤더 숨김, 패럴랙스 */
  function onScroll() {
    var y = window.pageYOffset;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    header.classList.toggle('small', y > 40);
    header.classList.toggle('hide', y > lastY && y > 300 && !nav.classList.contains('open'));
    lastY = y;
    $$('[data-speed]').forEach(function (el) {
      var r = el.parentNode.getBoundingClientRect();
      el.style.transform = 'translate3d(0,' + (r.top * el.getAttribute('data-speed')) + 'px,0)';
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 모바일 메뉴 */
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.classList.toggle('lock', open);
  });
  $$('nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open'); burger.classList.remove('open');
      document.body.classList.remove('lock');
    });
  });

  /* 카운트 업 */
  function countUp(el) {
    var end = +el.getAttribute('data-count'), t0 = null, dur = 1800;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* 스크롤 등장 */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      $$('[data-count]').forEach(function (c) {
        if (e.target.contains(c) && !c.done) { c.done = true; countUp(c); }
      });
      io.unobserve(e.target);
    });
  }, { threshold: 0.18 });
  $$('.rv').forEach(function (el) { io.observe(el); });

  /* 커서 */
  var mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
  (function loop() {
    cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
    cur.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
    requestAnimationFrame(loop);
  })();
  $$('.tile').forEach(function (t) {
    t.addEventListener('mouseenter', function () { cur.classList.add('on'); });
    t.addEventListener('mouseleave', function () { cur.classList.remove('on'); });
  });

  /* 매장 검색 (샘플) */
  $('#storeForm').addEventListener('submit', function (e) {
    e.preventDefault();
    $('#msg').textContent = '"' + $('#q').value + '" 근처 매장을 찾는 중이에요. (샘플 동작)';
  });
})();
