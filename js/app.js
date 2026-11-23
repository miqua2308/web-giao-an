/* Bài 1 · Hệ điều hành — tương tác: tiến độ, câu hỏi, trò chơi. */
(function () {
  "use strict";
  var L = window.LESSON;
  var KEYS = "ABCD";

  /* ---------- tiện ích ---------- */
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function shake(n) { n.classList.remove("shake"); void n.offsetWidth; n.classList.add("shake"); }
  var toastTimer;
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  /* ---------- tiến độ (lưu trên trình duyệt, không bắt buộc) ---------- */
  var ACTIVITIES = ["quiz-p1", "quiz-p2", "quiz-p3", "game-sort", "game-timeline", "game-match", "game-needos", "final-test"];
  var STORE = "hdh-bai1-progress";
  var done = {};
  try { done = JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { done = {}; }
  function renderProgress() {
    var n = ACTIVITIES.filter(function (a) { return done[a]; }).length;
    document.getElementById("progressFill").style.width = (n / ACTIVITIES.length * 100) + "%";
    document.getElementById("progressText").textContent = n + "/" + ACTIVITIES.length;
    document.querySelector(".progress").setAttribute("aria-label", "Tiến độ: đã hoàn thành " + n + " trên " + ACTIVITIES.length + " hoạt động");
  }
  function complete(id) {
    if (done[id]) return;
    done[id] = true;
    try { localStorage.setItem(STORE, JSON.stringify(done)); } catch (e) {}
    renderProgress();
    var n = ACTIVITIES.filter(function (a) { return done[a]; }).length;
    toast(n === ACTIVITIES.length ? "Tuyệt vời! Em đã hoàn thành tất cả hoạt động." : "Hoàn thành thêm 1 hoạt động (" + n + "/" + ACTIVITIES.length + ")");
  }
  document.getElementById("resetProgress").addEventListener("click", function () {
    done = {};
    try { localStorage.removeItem(STORE); } catch (e) {}
    renderProgress(); toast("Đã xóa tiến độ.");
  });
  renderProgress();

  /* ---------- nút "Xem gợi ý" ---------- */
  document.querySelectorAll("[data-reveal]").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = document.getElementById(b.getAttribute("data-reveal"));
      var open = t.hidden;
      t.hidden = !open;
      b.setAttribute("aria-expanded", String(open));
      b.textContent = open ? "Ẩn gợi ý" : "Xem gợi ý";
    });
  });

  /* ---------- đánh dấu mục đang xem trên thanh điều hướng ---------- */
  var navLinks = document.querySelectorAll(".nav a");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["khoi-dong", "phan-1", "phan-2", "phan-3", "tong-ket"].forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  /* ================= CÂU HỎI THEO PHẦN ================= */
  function buildQuiz(root, list, id) {
    var answered = 0, correct = 0;
    var foot = el("div", { class: "quiz__foot", "aria-live": "polite" });
    list.forEach(function (item, qi) {
      var box = el("div", { class: "q" });
      box.appendChild(el("p", { class: "q__title" }, [el("span", { class: "q__num", text: "Câu " + (qi + 1) + "." }), item.q]));
      var opts = el("div", { class: "q__opts", role: "group", "aria-label": "Các lựa chọn câu " + (qi + 1) });
      var fb = el("div", { class: "q__fb", hidden: "" });
      var btns = item.options.map(function (o, oi) {
        return el("button", {
          class: "opt", type: "button",
          onclick: function () {
            btns.forEach(function (b) { b.disabled = true; });
            btns[item.answer].classList.add("is-ok");
            var ok = oi === item.answer;
            if (!ok) btns[oi].classList.add("is-bad");
            fb.hidden = false;
            fb.className = "q__fb " + (ok ? "ok" : "bad");
            fb.textContent = (ok ? "Chính xác! " : "Chưa đúng. Đáp án: " + KEYS[item.answer] + ". ") + item.explain;
            answered++; if (ok) correct++;
            updateFoot();
          }
        }, [el("span", { class: "opt__k", text: KEYS[oi] }), el("span", { text: o })]);
      });
      btns.forEach(function (b) { opts.appendChild(b); });
      box.appendChild(opts); box.appendChild(fb);
      root.appendChild(box);
    });
    function updateFoot() {
      foot.innerHTML = "";
      foot.appendChild(el("span", { text: answered < list.length ? "Đã trả lời " + answered + "/" + list.length + " câu" : "Kết quả: đúng " + correct + "/" + list.length + " câu" + (correct === list.length ? " 🎉" : "") }));
      if (answered === list.length) {
        foot.appendChild(el("button", { class: "btn btn--small btn--ghost", type: "button", text: "Làm lại", onclick: function () { root.querySelectorAll(".q, .quiz__foot").forEach(function (n) { n.remove(); }); buildQuiz(root, list, id); } }));
        complete(id);
      }
    }
    updateFoot();
    root.appendChild(foot);
  }
  document.querySelectorAll("[data-quiz]").forEach(function (root) {
    var key = root.getAttribute("data-quiz");
    buildQuiz(root, L.quizzes[key], "quiz-" + key);
  });

  /* ================= BÀI KIỂM TRA CUỐI BÀI ================= */
  function buildTest() {
    var root = document.querySelector("[data-test]");
    root.innerHTML = "";
    var picks = new Array(L.finalTest.length).fill(-1);
    var scoreBox = el("div");
    root.appendChild(scoreBox);
    var groups = L.finalTest.map(function (item, qi) {
      var box = el("div", { class: "q" });
      box.appendChild(el("p", { class: "q__title" }, [el("span", { class: "q__num", text: "Câu " + (qi + 1) + "." }), item.q]));
      var opts = el("div", { class: "q__opts", role: "radiogroup", "aria-label": "Câu " + (qi + 1) });
      var btns = item.options.map(function (o, oi) {
        return el("button", {
          class: "opt", type: "button", role: "radio", "aria-checked": "false",
          onclick: function () {
            picks[qi] = oi;
            btns.forEach(function (b, bi) { b.classList.toggle("is-picked", bi === oi); b.setAttribute("aria-checked", String(bi === oi)); });
            submit.disabled = picks.indexOf(-1) !== -1;
            counter.textContent = "Đã chọn " + picks.filter(function (p) { return p > -1; }).length + "/" + picks.length;
          }
        }, [el("span", { class: "opt__k", text: KEYS[oi] }), el("span", { text: o })]);
      });
      btns.forEach(function (b) { opts.appendChild(b); });
      var fb = el("div", { class: "q__fb", hidden: "" });
      box.appendChild(opts); box.appendChild(fb);
      box.appendChild(el("p", { class: "q__src", text: "Nguồn: giáo án, " + item.src }));
      root.appendChild(box);
      return { btns: btns, fb: fb, item: item };
    });
    var counter = el("span", { text: "Đã chọn 0/" + picks.length });
    var submit = el("button", { class: "btn", type: "button", disabled: "", text: "Nộp bài", onclick: grade });
    root.appendChild(el("div", { class: "quiz__foot" }, [counter, submit]));

    function grade() {
      var correct = 0;
      groups.forEach(function (g, qi) {
        var ok = picks[qi] === g.item.answer;
        if (ok) correct++;
        g.btns.forEach(function (b) { b.disabled = true; });
        g.btns[g.item.answer].classList.add("is-ok");
        if (!ok) g.btns[picks[qi]].classList.add("is-bad");
        g.fb.hidden = false;
        g.fb.className = "q__fb " + (ok ? "ok" : "bad");
        g.fb.textContent = (ok ? "Đúng. " : "Sai. Đáp án: " + KEYS[g.item.answer] + ". ") + g.item.explain;
      });
      submit.disabled = true;
      var msg = correct >= 9 ? "Xuất sắc! Em nắm rất chắc bài." : correct >= 7 ? "Khá tốt! Xem lại các câu sai bên dưới nhé." : correct >= 5 ? "Đạt. Em nên ôn lại các phần có câu sai." : "Em hãy đọc lại bài và thử lại nhé.";
      scoreBox.innerHTML = "";
      scoreBox.appendChild(el("div", { class: "test__score", "aria-live": "polite" }, [
        el("div", { class: "test__big", text: correct + "/10" }),
        el("div", { class: "test__msg", text: msg }),
        el("div", { class: "test__actions" }, [el("button", { class: "btn btn--small", type: "button", text: "Làm lại bài kiểm tra", onclick: buildTest })])
      ]));
      scoreBox.scrollIntoView({ behavior: "smooth", block: "center" });
      complete("final-test");
    }
  }
  buildTest();

  /* ================= TRÒ CHƠI 1: PHÂN LOẠI ================= */
  function gameSort(root) {
    var G = L.sortGame, selected = null, mistakes = 0, placed = 0;
    root.innerHTML = "";
    var stats = el("div", { class: "game__stats" });
    var bar = el("div", { class: "game__bar" }, [stats, el("button", { class: "btn btn--small btn--ghost", type: "button", text: "Chơi lại", onclick: function () { gameSort(root); } })]);
    var pool = el("div", { class: "pool", "aria-label": "Các thẻ việc cần xếp" });
    var zones = el("div", { class: "zones" });
    var live = el("p", { class: "sr-only", "aria-live": "polite", style: "position:absolute;left:-9999px" });
    root.appendChild(bar); root.appendChild(pool); root.appendChild(zones); root.appendChild(live);

    function renderStats() {
      stats.innerHTML = "";
      stats.appendChild(el("span", { class: "stat", text: "Đã xếp: " + placed + "/" + G.items.length }));
      stats.appendChild(el("span", { class: "stat", text: "Lỗi: " + mistakes }));
    }
    function select(chip) {
      if (selected) selected.classList.remove("is-selected");
      selected = chip === selected ? null : chip;
      if (selected) selected.classList.add("is-selected");
      zones.querySelectorAll(".zone").forEach(function (z) { z.classList.toggle("is-target", !!selected); });
    }
    function tryPlace(chip, zone) {
      if (!chip) { toast("Hãy chọn một thẻ việc trước."); return; }
      if (chip.dataset.group === zone.dataset.group) {
        chip.classList.remove("is-selected"); chip.classList.add("is-ok");
        chip.disabled = true; chip.draggable = false;
        zone.appendChild(chip); placed++;
        live.textContent = "Đúng: " + chip.textContent;
        selected = null;
        zones.querySelectorAll(".zone").forEach(function (z) { z.classList.remove("is-target"); });
        if (placed === G.items.length) finish();
      } else {
        mistakes++; shake(chip); zone.classList.add("flash-bad");
        setTimeout(function () { zone.classList.remove("flash-bad"); }, 450);
        live.textContent = "Chưa đúng, thử nhóm khác.";
      }
      renderStats();
    }
    function finish() {
      var score = Math.max(0, 100 - mistakes * 10);
      root.appendChild(el("div", { class: "game__done" }, [el("span", { text: "Hoàn thành! Điểm: " + score + "/100 (" + mistakes + " lỗi)" }), el("button", { class: "btn btn--small btn--ghost", type: "button", text: "Chơi lại", onclick: function () { gameSort(root); } })]));
      complete("game-sort");
    }

    shuffle(G.items).forEach(function (it) {
      var chip = el("button", { class: "chip", type: "button", draggable: "true", text: it.text });
      chip.dataset.group = it.group;
      chip.addEventListener("click", function (e) { e.stopPropagation(); if (!chip.disabled) select(chip); });
      chip.addEventListener("dragstart", function (e) { select(chip); if (selected !== chip) select(chip); e.dataTransfer.setData("text/plain", it.text); e.dataTransfer.effectAllowed = "move"; });
      pool.appendChild(chip);
    });
    G.groups.forEach(function (g) {
      var z = el("div", { class: "zone", role: "button", tabindex: "0", "aria-label": "Nhóm " + g.name }, [el("span", { class: "zone__name", text: g.name })]);
      z.dataset.group = g.id;
      z.addEventListener("click", function () { tryPlace(selected, z); });
      z.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tryPlace(selected, z); } });
      z.addEventListener("dragover", function (e) { e.preventDefault(); z.classList.add("is-over"); });
      z.addEventListener("dragleave", function () { z.classList.remove("is-over"); });
      z.addEventListener("drop", function (e) { e.preventDefault(); z.classList.remove("is-over"); tryPlace(selected, z); });
      zones.appendChild(z);
    });
    renderStats();
  }

  /* ================= TRÒ CHƠI 2: DÒNG THỜI GIAN ================= */
  function gameTimeline(root) {
    var items = L.timelineGame.items, tries = 0;
    var order = shuffle(items.map(function (_, i) { return i; }));
    // tránh trường hợp xáo trộn ra đúng thứ tự
    if (order.every(function (v, i) { return v === i; })) order.reverse();
    root.innerHTML = "";
    var list = el("ol", { class: "order" });
    var result = el("div", { "aria-live": "polite" });
    var check = el("button", { class: "btn", type: "button", text: "Kiểm tra", onclick: verify });
    var stats = el("span", { class: "stat", text: "Lượt kiểm tra: 0" });
    root.appendChild(el("div", { class: "game__bar" }, [el("div", { class: "game__stats" }, [stats]), el("button", { class: "btn btn--small btn--ghost", type: "button", text: "Xáo lại", onclick: function () { gameTimeline(root); } })]));
    root.appendChild(list);
    root.appendChild(el("div", { style: "margin-top:14px" }, [check]));
    root.appendChild(result);
    var dragIdx = null;

    function render(focusIdx, focusDir) {
      list.innerHTML = "";
      order.forEach(function (itemIdx, pos) {
        var it = items[itemIdx];
        var up = el("button", { type: "button", "aria-label": "Đưa " + it.name + " lên", text: "▲", onclick: function () { move(pos, -1); } });
        var down = el("button", { type: "button", "aria-label": "Đưa " + it.name + " xuống", text: "▼", onclick: function () { move(pos, 1); } });
        var li = el("li", { draggable: "true" }, [
          el("span", { class: "order__pos", text: String(pos + 1) }),
          el("span", { class: "order__name" }, [it.name, it.note ? el("small", { text: it.note }) : null]),
          el("span", { class: "order__btns" }, [up, down])
        ]);
        li.addEventListener("dragstart", function () { dragIdx = pos; li.classList.add("is-dragging"); });
        li.addEventListener("dragend", function () { li.classList.remove("is-dragging"); });
        li.addEventListener("dragover", function (e) { e.preventDefault(); });
        li.addEventListener("drop", function (e) {
          e.preventDefault();
          if (dragIdx === null || dragIdx === pos) return;
          var v = order.splice(dragIdx, 1)[0]; order.splice(pos, 0, v); dragIdx = null; render();
        });
        list.appendChild(li);
        if (focusIdx === pos) (focusDir < 0 ? up : down).focus();
      });
    }
    function move(pos, d) {
      var np = pos + d;
      if (np < 0 || np >= order.length) return;
      var t = order[pos]; order[pos] = order[np]; order[np] = t;
      result.innerHTML = "";
      render(np, d);
    }
    function verify() {
      tries++; stats.textContent = "Lượt kiểm tra: " + tries;
      var right = 0;
      list.querySelectorAll("li").forEach(function (li, pos) {
        var ok = order[pos] === pos;
        if (ok) right++;
        li.classList.toggle("is-ok", ok); li.classList.toggle("is-bad", !ok);
      });
      result.innerHTML = "";
      if (right === items.length) {
        var yrs = items.map(function (it) { return it.name + (it.year ? " (" + it.year + ")" : ""); }).join(" → ");
        result.appendChild(el("div", { class: "game__done" }, [el("span", { text: "Chính xác sau " + tries + " lượt! " + yrs })]));
        check.disabled = true;
        complete("game-timeline");
      } else {
        result.appendChild(el("p", { style: "margin-top:12px;font-weight:600", text: "Đúng vị trí " + right + "/" + items.length + ". Gợi ý: thẻ đỏ đang sai chỗ, hãy di chuyển rồi kiểm tra lại." }));
      }
    }
    render();
  }

  /* ================= TRÒ CHƠI 3: GHÉP CẶP ================= */
  function gameMatch(root) {
    var pairs = L.matchGame.pairs, sel = null, mistakes = 0, matched = 0, start = null, timer = null;
    root.innerHTML = "";
    var tStat = el("span", { class: "stat", text: "Thời gian: 0 giây" });
    var mStat = el("span", { class: "stat", text: "Lỗi: 0" });
    root.appendChild(el("div", { class: "game__bar" }, [el("div", { class: "game__stats" }, [tStat, mStat]), el("button", { class: "btn btn--small btn--ghost", type: "button", text: "Chơi lại", onclick: function () { clearInterval(timer); gameMatch(root); } })]));
    var left = el("div", { class: "match__col" }, [el("span", { class: "match__colhead", text: "Hệ điều hành / chương trình" })]);
    var right = el("div", { class: "match__col" }, [el("span", { class: "match__colhead", text: "Thiết bị" })]);
    root.appendChild(el("div", { class: "match" }, [left, right]));
    var out = el("div", { "aria-live": "polite" });
    root.appendChild(out);

    function tick() { tStat.textContent = "Thời gian: " + Math.round((Date.now() - start) / 1000) + " giây"; }
    function startTimer() { if (!start) { start = Date.now(); timer = setInterval(tick, 500); } }

    shuffle(pairs.map(function (p, i) { return i; })).forEach(function (i) {
      var b = el("button", { class: "chip", type: "button", text: pairs[i].left });
      b.dataset.k = i;
      b.addEventListener("click", function () {
        if (b.disabled) return; startTimer();
        if (sel) sel.classList.remove("is-selected");
        sel = b; b.classList.add("is-selected");
      });
      left.appendChild(b);
    });
    shuffle(pairs.map(function (p, i) { return i; })).forEach(function (i) {
      var b = el("button", { class: "chip", type: "button", text: pairs[i].right });
      b.dataset.k = i;
      b.addEventListener("click", function () {
        if (b.disabled) return; startTimer();
        if (!sel) { shake(b); toast("Chọn một ô bên trái trước nhé."); return; }
        if (sel.dataset.k === b.dataset.k) {
          [sel, b].forEach(function (x) { x.classList.remove("is-selected"); x.classList.add("is-ok"); x.disabled = true; });
          sel = null; matched++;
          if (matched === pairs.length) {
            clearInterval(timer); tick();
            var secs = Math.round((Date.now() - start) / 1000);
            out.appendChild(el("div", { class: "game__done" }, [el("span", { text: "Ghép xong trong " + secs + " giây, " + mistakes + " lỗi!" + (mistakes === 0 ? " Hoàn hảo!" : "") })]));
            complete("game-match");
          }
        } else {
          mistakes++; mStat.textContent = "Lỗi: " + mistakes;
          shake(b); b.classList.add("flash-bad"); setTimeout(function () { b.classList.remove("flash-bad"); }, 450);
        }
      });
      right.appendChild(b);
    });
  }

  /* ================= TRÒ CHƠI 4: CẦN HĐH KHÔNG? ================= */
  function gameNeedOs(root) {
    var deck = shuffle(L.needOsGame.items), i = 0, right = 0, streak = 0, best = 0, results = [];
    root.innerHTML = "";
    var stats = el("div", { class: "game__stats" });
    root.appendChild(el("div", { class: "game__bar" }, [stats, el("button", { class: "btn btn--small btn--ghost", type: "button", text: "Chơi lại", onclick: function () { gameNeedOs(root); } })]));
    var stage = el("div");
    root.appendChild(stage);
    function renderStats() {
      stats.innerHTML = "";
      stats.appendChild(el("span", { class: "stat", text: "Đúng: " + right + "/" + deck.length }));
      stats.appendChild(el("span", { class: "stat", text: "Chuỗi đúng: " + streak }));
    }
    function dots() {
      return el("div", { class: "dots", "aria-hidden": "true" }, deck.map(function (_, k) {
        return el("span", { class: k < results.length ? (results[k] ? "ok" : "bad") : (k === i ? "cur" : "") });
      }));
    }
    function show() {
      renderStats();
      stage.innerHTML = "";
      if (i >= deck.length) {
        stage.appendChild(el("div", { class: "game__done" }, [el("span", { text: "Kết thúc! Đúng " + right + "/" + deck.length + ", chuỗi dài nhất: " + best + "." })]));
        complete("game-needos");
        return;
      }
      var it = deck[i];
      var fb = el("div", { "aria-live": "polite" });
      var yes = el("button", { class: "btn", type: "button", text: "Cần hệ điều hành" });
      var no = el("button", { class: "btn btn--ghost", type: "button", text: "Không cần" });
      function answer(v) {
        yes.disabled = no.disabled = true;
        var ok = v === it.needs;
        results.push(ok);
        if (ok) { right++; streak++; best = Math.max(best, streak); } else streak = 0;
        renderStats();
        fb.innerHTML = "";
        fb.appendChild(el("div", { class: "deck__fb " + (ok ? "ok" : "bad"), text: (ok ? "Đúng! " : "Chưa đúng. ") + it.why }));
        var next = el("button", { class: "btn btn--small", type: "button", style: "margin-top:12px", text: i + 1 < deck.length ? "Thiết bị tiếp theo →" : "Xem kết quả", onclick: function () { i++; show(); } });
        fb.appendChild(next); next.focus();
        stage.querySelector(".dots").replaceWith(dots());
      }
      yes.addEventListener("click", function () { answer(true); });
      no.addEventListener("click", function () { answer(false); });
      stage.appendChild(el("div", { class: "deck" }, [
        el("div", { class: "deck__img" }, [el("img", { src: it.img, alt: it.name })]),
        el("div", null, [
          el("p", { class: "kicker", text: "Thiết bị " + (i + 1) + "/" + deck.length }),
          el("p", { class: "deck__name", text: it.name }),
          el("div", { class: "deck__btns" }, [yes, no]),
          fb, dots()
        ])
      ]));
    }
    show();
  }

  gameSort(document.querySelector('[data-game="sort"]'));
  gameTimeline(document.querySelector('[data-game="timeline"]'));
  gameMatch(document.querySelector('[data-game="match"]'));
  gameNeedOs(document.querySelector('[data-game="needos"]'));

  window.App = { toast: toast };
})();
