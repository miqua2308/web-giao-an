/* Ba cảnh 3D cho Bài 1 · Hệ điều hành (Three.js r147, bản UMD).
 * Mỗi cảnh: định nghĩa "parts" (nội dung giải thích, dùng được cả khi không có 3D)
 * và hàm build() dựng mô hình. Cảnh chỉ khởi tạo khi cuộn tới gần để trang tải nhanh. */
(function () {
  "use strict";
  var FONT = '"Be Vietnam Pro", system-ui, "Segoe UI", Arial, sans-serif';
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var toast = function (m) { if (window.App) window.App.toast(m); };

  function webglOK() {
    try {
      var c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch (e) { return false; }
  }
  var HAS3D = !!window.THREE && webglOK();

  /* ================= NỘI DUNG CÁC BỘ PHẬN ================= */
  var DEFS = {
    pc: {
      color: 0x2b55d6,
      parts: {
        manhinh: { title: "Màn hình", body: ["Thiết bị ra: hiển thị kết quả cho em xem.", "Hệ điều hành vẽ giao diện đồ họa lên đây: biểu tượng, cửa sổ, con trỏ chuột. Nhờ vậy em chỉ cần nhìn và bấm, không phải gõ lệnh."], tags: ["Nhóm 4: Giao tiếp với người dùng"] },
        banphim: { title: "Bàn phím", body: ["Thiết bị vào: em gõ phím để nhập chữ và ra lệnh.", "Hệ điều hành nhận từng phím bấm rồi chuyển đến đúng ứng dụng em đang dùng."], tags: ["Nhóm 1: Quản lí thiết bị"] },
        chuot: { title: "Chuột", body: ["Thiết bị vào: di chuyển con trỏ, nháy để chọn.", "Nháy đúp vào biểu tượng là mở được ứng dụng. Đó là môi trường giao tiếp do hệ điều hành tạo ra."], tags: ["Nhóm 1: Quản lí thiết bị", "Nhóm 4: Giao tiếp"] },
        cpu: { title: "CPU (bộ xử lí trung tâm)", body: ["\"Bộ não\" thực hiện các lệnh của chương trình.", "Hệ điều hành điều phối để nhiều ứng dụng cùng chạy. Khả năng đa nhiệm có từ Windows phiên bản 3."], tags: ["Nhóm 3: Môi trường chạy ứng dụng"] },
        ram: { title: "Bộ nhớ trong", body: ["Nơi chứa các chương trình đang chạy.", "Hệ điều hành sắp xếp chỗ cho từng ứng dụng để chúng không \"giẫm chân\" lên nhau."], tags: ["Nhóm 3: Môi trường chạy ứng dụng"] },
        ocung: { title: "Ổ cứng", body: ["Lưu tệp và phần mềm lâu dài, tắt máy vẫn còn.", "Hệ điều hành tổ chức dữ liệu thành tệp và thư mục để em dễ tìm."], tags: ["Nhóm 2: Quản lí lưu trữ dữ liệu"] },
        usb: { title: "USB và \"plug & play\"", body: ["Plug & play nghĩa là \"cắm là chạy\": cắm thiết bị vào, hệ điều hành tự nhận ra.", "Cơ chế này lần đầu xuất hiện ở Windows 95. Bấm nút \"Cắm USB\" để xem!"], tags: ["Nhóm 1: Quản lí thiết bị", "Khuynh hướng: Thân thiện"] }
      }
    },
    phone: {
      color: 0x0b7a61,
      parts: {
        hdh: { title: "Hệ điều hành di động", body: ["Android hoặc iOS điều khiển mọi bộ phận của điện thoại.", "Nó được thiết kế để thân thiện, kết nối mạng mọi lúc và có nhiều tiện ích cá nhân."], tags: ["Android", "iOS"] },
        manhinh: { title: "Màn hình cảm ứng", body: ["Em chạm, vuốt trực tiếp thay cho chuột và bàn phím.", "Mỗi biểu tượng là một tiện ích cá nhân: gọi điện, nhắn tin, danh bạ, máy ảnh, thư…"], tags: ["Đặc trưng 1: Nhiều tiện ích cá nhân"] },
        camera: { title: "Camera", body: ["Tiện ích chụp ảnh, quay phim.", "Điện thoại không chỉ để nghe, gọi mà còn thay được cả máy ảnh."], tags: ["Đặc trưng 1: Nhiều tiện ích cá nhân"] },
        cambien: { title: "Cảm biến", body: ["Cảm biến giúp máy nhận dạng hành vi của em. Ví dụ: em xoay ngang máy thì giao diện xoay theo.", "Nhờ đó giao diện đặc biệt thân thiện. Bấm \"Xoay ngang máy\" để thử!"], tags: ["Đặc trưng 3: Giao diện tiện lợi nhờ cảm biến"] },
        song: { title: "Kết nối không dây", body: ["Máy đi theo người nên phải vào Internet ở mọi nơi.", "Kết nối qua mạng di động 3G, 4G, 5G; hoặc wifi, bluetooth trong phạm vi hẹp."], tags: ["Đặc trưng 2: Kết nối mạng không dây"] }
      }
    },
    layers: {
      color: 0xb93d0b,
      parts: {
        user: { title: "Người dùng", body: ["Là em! Em làm việc với máy qua giao diện, không cần biết bên trong linh kiện chạy thế nào."], tags: ["Tầng trên cùng"] },
        app: { title: "Phần mềm ứng dụng", body: ["Soạn thảo, trình duyệt, trò chơi…: mỗi phần mềm làm một việc cụ thể cho em.", "Ứng dụng không điều khiển trực tiếp phần cứng mà nhờ các dịch vụ của hệ điều hành."], tags: ["Khai thác phần cứng qua hệ điều hành"] },
        os: { title: "Hệ điều hành", body: ["Tầng trung gian: cung cấp các dịch vụ sử dụng phần cứng cho ứng dụng.", "Hệ điều hành cùng phần cứng tạo ra một \"máy ảo\" có giao diện thuận lợi cho người dùng."], tags: ["Trung gian", "Môi trường chung"] },
        hw: { title: "Phần cứng", body: ["CPU, bộ nhớ, thiết bị vào/ra (bàn phím, máy in…).", "Là nền móng vật lí. Mọi việc cuối cùng đều do phần cứng thực hiện."], tags: ["Tầng dưới cùng"] }
      }
    }
  };

  /* ================= TIỆN ÍCH VẼ ================= */
  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function hex(c) { return "#" + c.toString(16).padStart(6, "0"); }
  function ease(k) { return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; }

  /* ================= KHUNG VIEWER CHUNG ================= */
  function Viewer(root, def) {
    this.root = root; this.def = def;
    this.stage = root.querySelector(".scene__stage");
    this.info = root.querySelector(".scene__info");
    this.list = root.querySelector("[data-list]");
    this.objects = {}; this.labels = {}; this.pickables = [];
    this.tweens = []; this.updaters = [];
    this.selected = null; this.busy = false;
    this.buildList();
  }
  Viewer.prototype.buildList = function () {
    var self = this;
    Object.keys(this.def.parts).forEach(function (k) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = self.def.parts[k].title.replace(/ \(.*\)/, "").replace(/ và .*/, "");
      b.dataset.part = k;
      b.addEventListener("click", function () { self.select(k); });
      var li = document.createElement("li"); li.appendChild(b); self.list.appendChild(li);
    });
  };
  Viewer.prototype.showInfo = function (title, body, tags) {
    var h = "<h4>" + title + "</h4>" + body.map(function (p) { return "<p>" + p + "</p>"; }).join("");
    if (tags && tags.length) h += "<p>" + tags.map(function (t) { return '<span class="tag">' + t + "</span>"; }).join(" ") + "</p>";
    this.info.innerHTML = h;
  };
  Viewer.prototype.select = function (k) {
    var p = this.def.parts[k];
    this.selected = k;
    this.showInfo(p.title, p.body, p.tags);
    this.list.querySelectorAll("button").forEach(function (b) { b.classList.toggle("is-on", b.dataset.part === k); });
    if (this.renderer) this.applyHighlight();
  };
  Viewer.prototype.init3D = function () {
    var T = THREE, self = this;
    var r = this.renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap;
    this.stage.appendChild(r.domElement);
    this.scene = new T.Scene();
    this.camera = new T.PerspectiveCamera(38, 1, 0.1, 100);
    this.scene.add(new T.HemisphereLight(0xffffff, 0xc9cfdc, 0.75));
    var sun = new T.DirectionalLight(0xffffff, 0.75);
    sun.position.set(4, 9, 6); sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    var sc = sun.shadow.camera; sc.left = sc.bottom = -7; sc.right = sc.top = 7; sc.near = 1; sc.far = 30;
    sun.shadow.bias = -0.0005; sun.shadow.radius = 4;
    this.scene.add(sun);
    var fill = new T.DirectionalLight(0xfff1dd, 0.25); fill.position.set(-6, 3, -2); this.scene.add(fill);
    // orbit
    this.orbit = { theta: 0.5, phi: 1.2, radius: 7, target: new T.Vector3() };
    this.goal = { theta: 0.5, phi: 1.2, radius: 7, target: new T.Vector3() };
    this.limits = { rMin: 3, rMax: 12, pMin: 0.25, pMax: 1.5 };
    this.engaged = false; this.touched = false;
    this.bindControls();
    this.raycaster = new T.Raycaster();
    // kích thước
    var resize = function () {
      var w = self.stage.clientWidth, h = self.stage.clientHeight;
      if (!w || !h) return;
      r.setSize(w, h, false); self.camera.aspect = w / h;
      // khung hẹp (điện thoại): giữ nguyên góc nhìn ngang để mô hình không bị cắt
      var REF = 1.35, vfov = 38;
      if (w / h < REF) vfov = 2 * Math.atan(Math.tan(19 * Math.PI / 180) * REF / (w / h)) * 180 / Math.PI;
      self.camera.fov = vfov;
      self.camera.updateProjectionMatrix();
    };
    resize();
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(this.stage);
    else window.addEventListener("resize", resize);
    // chỉ vẽ khi đang nhìn thấy
    this.visible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { self.visible = es[0].isIntersecting; if (self.visible) self.loop(); }, { rootMargin: "100px" }).observe(this.stage);
    }
    this.clock = new T.Clock();
  };
  Viewer.prototype.setView = function (v, instant) {
    this.home = this.home || v;
    this.goal.theta = v.theta; this.goal.phi = v.phi; this.goal.radius = v.radius; this.goal.target.copy(v.target);
    if (instant) { this.orbit.theta = v.theta; this.orbit.phi = v.phi; this.orbit.radius = v.radius; this.orbit.target.copy(v.target); }
  };
  Viewer.prototype.resetView = function () { this.setView(this.home); };
  Viewer.prototype.bindControls = function () {
    var self = this, s = this.stage, pts = {}, start = null, lastPinch = 0, moved = 0;
    s.addEventListener("pointerdown", function (e) {
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (Object.keys(pts).length === 1) { start = { x: e.clientX, y: e.clientY }; moved = 0; }
      self.engaged = true; self.touched = true;
      try { s.setPointerCapture(e.pointerId); } catch (err) {}
    });
    s.addEventListener("pointermove", function (e) {
      var p = pts[e.pointerId]; if (!p) return;
      var dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      var ids = Object.keys(pts);
      if (ids.length === 1) {
        moved += Math.abs(dx) + Math.abs(dy);
        self.goal.theta -= dx * 0.008;
        self.goal.phi = Math.min(self.limits.pMax, Math.max(self.limits.pMin, self.goal.phi - dy * 0.006));
      } else if (ids.length === 2) {
        moved = 99;
        var a = pts[ids[0]], b = pts[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (lastPinch) self.zoom(lastPinch / d);
        lastPinch = d;
      }
    });
    function up(e) {
      if (pts[e.pointerId] && Object.keys(pts).length === 1 && moved < 6 && e.type === "pointerup") self.pick(e);
      delete pts[e.pointerId]; lastPinch = 0;
    }
    s.addEventListener("pointerup", up);
    s.addEventListener("pointercancel", up);
    s.addEventListener("pointerleave", function () { self.engaged = false; });
    s.addEventListener("wheel", function (e) {
      if (!self.engaged) return; // chỉ phóng to khi em đã bấm vào khung, tránh chặn cuộn trang
      e.preventDefault(); self.zoom(e.deltaY > 0 ? 1.1 : 0.9);
    }, { passive: false });
    s.addEventListener("keydown", function (e) {
      var k = e.key, used = true;
      if (k === "ArrowLeft") self.goal.theta += 0.15;
      else if (k === "ArrowRight") self.goal.theta -= 0.15;
      else if (k === "ArrowUp") self.goal.phi = Math.max(self.limits.pMin, self.goal.phi - 0.1);
      else if (k === "ArrowDown") self.goal.phi = Math.min(self.limits.pMax, self.goal.phi + 0.1);
      else if (k === "+" || k === "=") self.zoom(0.9);
      else if (k === "-" || k === "_") self.zoom(1.1);
      else used = false;
      if (used) { e.preventDefault(); self.touched = true; }
    });
  };
  Viewer.prototype.zoom = function (f) {
    this.goal.radius = Math.min(this.limits.rMax, Math.max(this.limits.rMin, this.goal.radius * f));
  };
  Viewer.prototype.pick = function (e) {
    var rect = this.stage.getBoundingClientRect();
    var v = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(v, this.camera);
    var hits = this.raycaster.intersectObjects(this.pickables, true);
    for (var i = 0; i < hits.length; i++) {
      var o = hits[i].object;
      while (o && !(o.userData && o.userData.part)) o = o.parent;
      if (o) { this.select(o.userData.part); return; }
    }
  };
  // gắn đối tượng 3D với một bộ phận để bấm chọn và tô sáng
  Viewer.prototype.tag = function (part, obj) {
    obj.userData.part = part;
    (this.objects[part] = this.objects[part] || []).push(obj);
    this.pickables.push(obj);
    return obj;
  };
  // duyệt mọi vật liệu có thể phát sáng của một đối tượng (kể cả mảng vật liệu)
  function eachMat(obj, fn) {
    obj.traverse(function (m) {
      if (!m.material) return;
      (Array.isArray(m.material) ? m.material : [m.material]).forEach(function (mt) {
        if (!mt.emissive) return;
        if (!mt.userData.base) mt.userData.base = { c: mt.emissive.clone(), i: mt.emissiveIntensity };
        fn(mt);
      });
    });
  }
  Viewer.prototype.applyHighlight = function () {
    var self = this;
    Object.keys(this.objects).forEach(function (k) {
      if (k === self.selected) return;
      self.objects[k].forEach(function (o) {
        eachMat(o, function (mt) { mt.emissive.copy(mt.userData.base.c); mt.emissiveIntensity = mt.userData.base.i; });
      });
    });
  };
  Viewer.prototype.pulse = function (t) {
    if (!this.selected || !this.objects[this.selected]) return;
    var col = this._hl || (this._hl = new THREE.Color(this.def.color)), k = 0.25 + 0.2 * Math.sin(t * 5);
    this.objects[this.selected].forEach(function (o) {
      eachMat(o, function (mt) { mt.emissive.copy(col); mt.emissiveIntensity = k; });
    });
  };
  Viewer.prototype.tween = function (dur, fn) {
    var self = this;
    return new Promise(function (res) {
      if (REDUCED) dur = Math.min(dur, 0.15);
      self.tweens.push({ t: 0, dur: dur, fn: fn, res: res });
      self.loop();
    });
  };
  Viewer.prototype.wait = function (s) { return this.tween(REDUCED ? 0.4 : s, function () {}); };
  Viewer.prototype.loop = function () {
    if (this.running) return;
    this.running = true;
    var self = this;
    (function frame() {
      if (!self.visible && !self.tweens.length) { self.running = false; return; }
      var dt = Math.min(self.clock.getDelta(), 0.1), t = self.clock.elapsedTime;
      // tự xoay nhẹ cho tới khi em chạm vào
      if (!self.touched && !REDUCED) self.goal.theta += dt * 0.12;
      var o = self.orbit, g = self.goal, a = 1 - Math.pow(0.0015, dt);
      o.theta += (g.theta - o.theta) * a; o.phi += (g.phi - o.phi) * a; o.radius += (g.radius - o.radius) * a;
      o.target.lerp(g.target, a);
      self.camera.position.set(
        o.target.x + o.radius * Math.sin(o.phi) * Math.sin(o.theta),
        o.target.y + o.radius * Math.cos(o.phi),
        o.target.z + o.radius * Math.sin(o.phi) * Math.cos(o.theta));
      self.camera.lookAt(o.target);
      for (var i = self.tweens.length - 1; i >= 0; i--) {
        var tw = self.tweens[i]; tw.t += dt;
        var k = Math.min(1, tw.t / tw.dur); tw.fn(ease(k), k);
        if (k >= 1) { self.tweens.splice(i, 1); tw.res(); }
      }
      self.updaters.forEach(function (u) { u(t, dt); });
      self.pulse(t);
      self.renderer.render(self.scene, self.camera);
      requestAnimationFrame(frame);
    })();
  };

  /* ---------- vật liệu & hình khối ---------- */
  function mat(color, o) {
    o = o || {};
    return new THREE.MeshStandardMaterial({ color: color, roughness: o.r == null ? 0.55 : o.r, metalness: o.m || 0, transparent: !!o.opacity, opacity: o.opacity || 1, emissive: o.e || 0x000000, emissiveIntensity: o.ei || 1, side: o.side || THREE.FrontSide });
  }
  function box(w, h, d, m, x, y, z, parent) {
    var mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x || 0, y || 0, z || 0); mesh.castShadow = true; mesh.receiveShadow = true;
    if (parent) parent.add(mesh);
    return mesh;
  }
  function roundedShape(w, h, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  // tấm bo góc nằm ngang (rộng w theo x, sâu d theo z, dày h theo y)
  function slab(w, d, h, r, m) {
    var g = new THREE.ExtrudeGeometry(roundedShape(w, d, r), { depth: h - 0.08, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3, curveSegments: 10 });
    g.rotateX(-Math.PI / 2); g.center();
    var mesh = new THREE.Mesh(g, m); mesh.castShadow = true; mesh.receiveShadow = true;
    return mesh;
  }
  function shadowFloor(scene, y, size) {
    var p = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.ShadowMaterial({ opacity: 0.14 }));
    p.rotation.x = -Math.PI / 2; p.position.y = y; p.receiveShadow = true; scene.add(p);
  }
  function label(text, o) {
    o = o || {};
    var fs = 46, pad = 22, c = document.createElement("canvas"), ctx = c.getContext("2d");
    ctx.font = "700 " + fs + "px " + FONT;
    var w = Math.ceil(ctx.measureText(text).width) + pad * 2, h = Math.round(fs * 1.7);
    c.width = w; c.height = h;
    ctx.font = "700 " + fs + "px " + FONT;
    ctx.fillStyle = o.bg || "rgba(27,35,51,.92)"; rr(ctx, 0, 0, w, h, h / 2); ctx.fill();
    ctx.fillStyle = o.color || "#fff"; ctx.textBaseline = "middle"; ctx.fillText(text, pad, h / 2 + 3);
    var tex = new THREE.CanvasTexture(c); tex.anisotropy = 4; tex.minFilter = THREE.LinearFilter;
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
    var k = o.scale || 0.0055;
    s.scale.set(w * k, h * k, 1); s.renderOrder = 10;
    s.center.set(o.cx == null ? 0.5 : o.cx, 0.5);
    if (o.pos) s.position.copy(o.pos);
    return s;
  }
  function canvasTex(w, h, draw) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    var ctx = c.getContext("2d"); draw(ctx, w, h);
    var t = new THREE.CanvasTexture(c); t.anisotropy = 4;
    t.redraw = function (fn) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, w, h); fn(ctx, w, h); t.needsUpdate = true; };
    return t;
  }

  /* ================= CẢNH 1: MÁY TÍNH CÁ NHÂN ================= */
  function drawDesktop(ctx, w, h, notify) {
    var g = ctx.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#3d7be0"); g.addColorStop(1, "#173d8f");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // biểu tượng trên màn hình
    var icons = [["Thư mục", "#f5b83d"], ["Thùng rác", "#d9e1ee"], ["Soạn thảo", "#4f7cf0"], ["Trình duyệt", "#0fa37f"]];
    ctx.font = "600 22px " + FONT; ctx.textAlign = "center";
    icons.forEach(function (ic, i) {
      var x = 70, y = 50 + i * 120;
      ctx.fillStyle = ic[1]; rr(ctx, x - 34, y, 68, 60, 10); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.fillText(ic[0], x, y + 88);
    });
    // cửa sổ ứng dụng
    ctx.fillStyle = "rgba(0,0,0,.25)"; rr(ctx, 236, 66, 560, 380, 14); ctx.fill();
    ctx.fillStyle = "#ffffff"; rr(ctx, 230, 58, 560, 380, 14); ctx.fill();
    ctx.fillStyle = "#e8eefe"; rr(ctx, 230, 58, 560, 52, 14); ctx.fill(); ctx.fillRect(230, 90, 560, 20);
    ctx.textAlign = "left"; ctx.fillStyle = "#1b2333"; ctx.font = "700 24px " + FONT; ctx.fillText("Bài tập Tin học", 252, 92);
    ["#f25f5c", "#f5b83d", "#0fa37f"].forEach(function (c, i) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(740 - i * 30, 84, 9, 0, 7); ctx.fill(); });
    ctx.fillStyle = "#c9d3e6"; for (var i = 0; i < 7; i++) ctx.fillRect(256, 140 + i * 38, i % 3 === 2 ? 300 : 480, 14);
    // thanh tác vụ
    ctx.fillStyle = "rgba(15,22,38,.85)"; ctx.fillRect(0, h - 56, w, 56);
    ctx.fillStyle = "#6fa0ff"; rr(ctx, 16, h - 46, 36, 36, 6); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "600 22px " + FONT; ctx.textAlign = "right"; ctx.fillText("07:30", w - 20, h - 20);
    // con trỏ chuột
    ctx.fillStyle = "#fff"; ctx.strokeStyle = "#1b2333"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(600, 300); ctx.lineTo(600, 344); ctx.lineTo(612, 333); ctx.lineTo(622, 354); ctx.lineTo(630, 350); ctx.lineTo(620, 330); ctx.lineTo(636, 330); ctx.closePath(); ctx.fill(); ctx.stroke();
    if (notify) {
      ctx.fillStyle = "rgba(0,0,0,.3)"; rr(ctx, w - 446, h - 196, 430, 128, 14); ctx.fill();
      ctx.fillStyle = "#ffffff"; rr(ctx, w - 450, h - 200, 430, 128, 14); ctx.fill();
      ctx.fillStyle = "#2b55d6"; rr(ctx, w - 430, h - 180, 60, 88, 10); ctx.fill();
      ctx.textAlign = "left"; ctx.fillStyle = "#1b2333"; ctx.font = "700 26px " + FONT;
      ctx.fillText("Đã nhận thiết bị mới", w - 352, h - 150);
      ctx.font = "500 22px " + FONT; ctx.fillStyle = "#44506a";
      ctx.fillText("USB đã sẵn sàng sử dụng", w - 352, h - 116);
      ctx.fillText("(plug & play)", w - 352, h - 88);
    }
  }
  function buildPC(v) {
    var T = THREE, S = v.scene, D = v.def;
    shadowFloor(S, -0.13, 30);
    var desk = slab(6.4, 2.9, 0.14, 0.12, mat(0xd8b88a, { r: 0.7 })); desk.position.y = -0.07; S.add(desk);

    // màn hình
    var mon = new T.Group(); mon.position.set(-0.55, 0, -0.55); S.add(mon);
    var dark = mat(0x222834, { r: 0.4, m: 0.3 });
    box(0.95, 0.05, 0.55, dark, 0, 0.025, 0, mon);
    box(0.12, 0.75, 0.08, dark, 0, 0.42, -0.08, mon);
    var frame = box(2.7, 1.6, 0.1, dark.clone(), 0, 1.38, 0, mon);
    var screenTex = canvasTex(1024, 600, function (c, w, h) { drawDesktop(c, w, h, false); });
    var screen = new T.Mesh(new T.PlaneGeometry(2.56, 1.48), new T.MeshBasicMaterial({ map: screenTex }));
    screen.position.set(0, 1.38, 0.052); mon.add(screen);
    v.tag("manhinh", frame); v.tag("manhinh", screen);

    // thùng máy, mặt kính bên phải để thấy bên trong
    var C = new T.Group(); C.position.set(2.35, 0, -0.35); S.add(C);
    var W = 0.86, H = 1.85, DD = 1.8, th = 0.04, caseM = mat(0x2b303b, { r: 0.45, m: 0.25 });
    box(th, H, DD, caseM, -W / 2, H / 2, 0, C);
    box(W, th, DD, caseM, 0, H - th / 2, 0, C);
    box(W, th, DD, caseM, 0, th / 2, 0, C);
    box(W, H, th, caseM, 0, H / 2, -DD / 2, C);
    var front = box(W, H, th, mat(0x1f232c, { r: 0.35, m: 0.3 }), 0, H / 2, DD / 2, C);
    var glass = new T.Mesh(new T.BoxGeometry(0.015, H - 0.08, DD - 0.08), new T.MeshStandardMaterial({ color: 0xbfd4ff, transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0.1, depthWrite: false }));
    glass.position.set(W / 2, H / 2, 0); C.add(glass);
    var board = box(0.03, 1.45, 1.45, mat(0x1d6b4f, { r: 0.6 }), -W / 2 + 0.04, 1.02, -0.12, C);
    board.castShadow = false;
    // CPU + quạt
    var cpu = new T.Group(); C.add(cpu);
    box(0.06, 0.32, 0.32, mat(0xb9c0cc, { m: 0.7, r: 0.3 }), -W / 2 + 0.08, 1.28, 0.08, cpu);
    var fan = new T.Mesh(new T.CylinderGeometry(0.15, 0.15, 0.1, 24), mat(0x30343e, { r: 0.4 }));
    fan.rotation.z = Math.PI / 2; fan.position.set(-W / 2 + 0.16, 1.28, 0.08); cpu.add(fan);
    var blades = new T.Group(); blades.position.set(-W / 2 + 0.215, 1.28, 0.08); cpu.add(blades);
    for (var b = 0; b < 5; b++) { var bl = box(0.01, 0.24, 0.05, mat(0x9aa3b5), 0, 0, 0, blades); bl.geometry.translate(0, 0.07, 0); bl.rotation.x = b * (Math.PI * 2 / 5); }
    v.updaters.push(function (t, dt) { blades.rotation.x += dt * 9; });
    v.tag("cpu", cpu);
    // bộ nhớ trong
    var ram = new T.Group(); C.add(ram);
    [-0.36, -0.46].forEach(function (z) { box(0.05, 0.46, 0.06, mat(0x1e3a8a, { r: 0.5 }), -W / 2 + 0.08, 1.24, z, ram); });
    v.tag("ram", ram);
    // ổ cứng
    var hdd = box(0.5, 0.13, 0.72, mat(0xb8bec9, { m: 0.6, r: 0.35 }), 0.02, 0.2, 0.42, C);
    v.tag("ocung", hdd);
    // nút nguồn & cổng USB
    var pw = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 0.03, 20), mat(0x2b55d6, { e: 0x4f86ff, ei: 0.9 }));
    pw.rotation.x = Math.PI / 2; pw.position.set(0, 1.62, DD / 2 + 0.02); C.add(pw);
    box(0.16, 0.06, 0.03, mat(0x0d0f14), 0, 1.42, DD / 2 + 0.01, C);

    // bàn phím
    var keyTex = canvasTex(512, 160, function (c, w, h) {
      c.fillStyle = "#2a2f3a"; c.fillRect(0, 0, w, h);
      c.fillStyle = "#e9edf4";
      for (var r = 0; r < 4; r++) for (var k = 0; k < 14; k++) { if (r === 3 && k > 9) break; rr(c, 8 + k * 35.5 + (r % 2) * 8, 10 + r * 37, r === 3 && k === 4 ? 140 : 30, 30, 5); c.fill(); if (r === 3 && k === 4) k += 3; }
    });
    var kbSide = mat(0x2a2f3a, { r: 0.5 });
    var kb = new T.Mesh(new T.BoxGeometry(2.2, 0.08, 0.66), [kbSide, kbSide, new T.MeshStandardMaterial({ map: keyTex, roughness: 0.6 }), kbSide, kbSide, kbSide]);
    kb.position.set(-0.55, 0.04, 0.62); kb.castShadow = kb.receiveShadow = true; S.add(kb);
    v.tag("banphim", kb);
    // chuột
    var mouse = new T.Mesh(new T.CapsuleGeometry(0.13, 0.16, 6, 16), mat(0xeef1f6, { r: 0.35 }));
    mouse.rotation.x = Math.PI / 2; mouse.scale.set(1, 1, 0.55); mouse.position.set(0.95, 0.07, 0.66); mouse.castShadow = true; S.add(mouse);
    v.tag("chuot", mouse);

    // USB
    var usb = new T.Group(); usb.position.set(1.55, 0.035, 1.0); S.add(usb);
    var usbBody = box(0.13, 0.06, 0.32, mat(0x2b55d6, { r: 0.4 }), 0, 0, 0, usb);
    box(0.1, 0.04, 0.13, mat(0xc8ced8, { m: 0.8, r: 0.25 }), 0, 0, -0.22, usb);
    var led = box(0.03, 0.02, 0.03, mat(0x333333), 0, 0.035, 0.1, usb);
    v.tag("usb", usb);

    // nhãn
    // đèn trong thùng máy để nhìn rõ linh kiện qua mặt kính
    var inLight = new T.PointLight(0x9fc4ff, 1.1, 2.2); inLight.position.set(0.1, 1.2, 0); C.add(inLight);

    var lab = function (part, text, pos, cx) { var s = label(text, { pos: pos, cx: cx, scale: 0.0036 }); S.add(s); v.tag(part, s); };
    lab("manhinh", "Màn hình", new T.Vector3(-0.55, 2.38, -0.5));
    lab("cpu", "CPU", new T.Vector3(2.95, 1.62, 0.1), 0);
    lab("ram", "Bộ nhớ", new T.Vector3(2.95, 1.18, -0.75), 0);
    lab("ocung", "Ổ cứng", new T.Vector3(2.95, 0.3, 0.3), 0);
    lab("banphim", "Bàn phím", new T.Vector3(-1.75, 0.25, 0.95), 1);
    lab("chuot", "Chuột", new T.Vector3(0.95, 0.33, 0.7));
    lab("usb", "USB", new T.Vector3(1.55, 0.28, 1.05));

    v.setView({ theta: 0.75, phi: 1.12, radius: 7.6, target: new T.Vector3(0.8, 0.85, 0) }, true);
    v.limits.rMin = 3; v.limits.rMax = 12;

    var plugged = false;
    v.actions.usb = function (btn) {
      if (v.busy) return; v.busy = true;
      var from = usb.position.clone(), lift, to;
      if (!plugged) {
        lift = new T.Vector3(2.35, 1.42, 1.35); to = new T.Vector3(2.35, 1.42, -0.35 + DD / 2 + 0.17);
        v.select("usb");
        v.tween(0.9, function (k) { usb.position.lerpVectors(from, lift, k); usb.rotation.y = 0; })
          .then(function () { return v.tween(0.5, function (k) { usb.position.lerpVectors(lift, to, k); }); })
          .then(function () {
            led.material.emissive.set(0x22c55e); led.material.emissiveIntensity = 1.4; led.material.userData.base = null;
            screenTex.redraw(function (c, w, h) { drawDesktop(c, w, h, true); });
            toast("Hệ điều hành đã tự nhận USB: \"cắm là chạy\"!");
            plugged = true; btn.textContent = "Rút USB"; v.busy = false;
          });
      } else {
        lift = new T.Vector3(2.35, 1.42, 1.35); to = new T.Vector3(1.55, 0.035, 1.0);
        led.material.emissive.set(0x000000); led.material.userData.base = null;
        screenTex.redraw(function (c, w, h) { drawDesktop(c, w, h, false); });
        v.tween(0.4, function (k) { usb.position.lerpVectors(from, lift, k); })
          .then(function () { return v.tween(0.8, function (k) { usb.position.lerpVectors(lift, to, k); }); })
          .then(function () { plugged = false; btn.textContent = "Cắm USB (plug & play)"; v.busy = false; });
      }
    };
  }

  /* ================= CẢNH 2: ĐIỆN THOẠI ================= */
  var APPS = [["📞", "Điện thoại", "#22c55e"], ["💬", "Tin nhắn", "#3b82f6"], ["👥", "Danh bạ", "#64748b"], ["📷", "Máy ảnh", "#334155"],
    ["✉️", "Thư", "#ef4444"], ["🖼️", "Ảnh", "#f59e0b"], ["🗺️", "Bản đồ", "#10b981"], ["📅", "Lịch", "#f97316"],
    ["⏰", "Đồng hồ", "#1f2937"], ["🎵", "Nhạc", "#ec4899"], ["📝", "Ghi chú", "#eab308"], ["⚙️", "Cài đặt", "#6b7280"]];
  function drawPhone(ctx, W, H, landscape) {
    // nền bo góc
    ctx.save();
    rr(ctx, 0, 0, W, H, 56); ctx.clip();
    if (landscape) { ctx.translate(0, H); ctx.rotate(-Math.PI / 2); var t = W; W = H; H = t; }
    var g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#0b7a61"); g.addColorStop(1, "#143d6b");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // thanh trạng thái
    ctx.fillStyle = "#fff"; ctx.font = "700 30px " + FONT; ctx.textBaseline = "middle"; ctx.textAlign = "left";
    ctx.fillText("07:30", 36, 44);
    ctx.textAlign = "right"; ctx.fillText("4G", W - 132, 44);
    for (var i = 0; i < 4; i++) ctx.fillRect(W - 120 + i * 11, 54 - (i + 1) * 7, 7, (i + 1) * 7);
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; rr(ctx, W - 66, 30, 40, 26, 5); ctx.stroke(); ctx.fillRect(W - 62, 34, 26, 18);
    if (!landscape) { ctx.fillStyle = "#0d0f14"; ctx.beginPath(); ctx.arc(W / 2, 44, 14, 0, 7); ctx.fill(); }
    // lưới ứng dụng
    var cols = landscape ? 6 : 4, cell = landscape ? (W - 120) / cols : (W - 60) / cols, x0 = landscape ? 60 : 30, y0 = landscape ? 110 : 150;
    var rowH = landscape ? 190 : 200, size = landscape ? 104 : 96;
    APPS.forEach(function (a, i) {
      var cx = x0 + (i % cols) * cell + cell / 2, cy = y0 + Math.floor(i / cols) * rowH;
      ctx.fillStyle = a[2]; rr(ctx, cx - size / 2, cy, size, size, 24); ctx.fill();
      ctx.font = (landscape ? 58 : 54) + "px \"Segoe UI Emoji\", \"Apple Color Emoji\", \"Noto Color Emoji\", sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(a[0], cx, cy + size / 2 + 3);
      ctx.fillStyle = "#fff"; ctx.font = "600 24px " + FONT; ctx.fillText(a[1], cx, cy + size + 28);
    });
    if (!landscape) {
      ctx.fillStyle = "rgba(255,255,255,.18)"; rr(ctx, 30, H - 210, W - 60, 150, 36); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "600 28px " + FONT; ctx.textAlign = "center"; ctx.fillText("Chạm, vuốt để sử dụng", W / 2, H - 135);
    }
    ctx.fillStyle = "rgba(255,255,255,.75)"; rr(ctx, W / 2 - 90, H - 28, 180, 8, 4); ctx.fill();
    ctx.restore();
  }
  function buildPhone(v) {
    var T = THREE, S = v.scene;
    shadowFloor(S, -1.75, 20);
    var P = new T.Group(); S.add(P);
    var bodyM = mat(0x23272f, { r: 0.3, m: 0.5 });
    var g = new T.ExtrudeGeometry(roundedShape(1.5, 3.1, 0.24), { depth: 0.14, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035, bevelSegments: 4, curveSegments: 16 });
    g.center();
    var body = new T.Mesh(g, bodyM); body.castShadow = true; P.add(body);
    v.tag("hdh", body);
    var scrTex = canvasTex(560, 1180, function (c, w, h) { drawPhone(c, w, h, false); });
    var scr = new T.Mesh(new T.PlaneGeometry(1.4, 2.95), new T.MeshBasicMaterial({ map: scrTex, transparent: true }));
    scr.position.z = 0.107; P.add(scr);
    v.tag("manhinh", scr);
    // camera sau
    var cam = new T.Group(); P.add(cam);
    box(0.5, 0.86, 0.05, mat(0x30353f, { r: 0.3, m: 0.4 }), -0.38, 1.0, -0.12, cam);
    [1.22, 0.8].forEach(function (y) {
      var lens = new T.Mesh(new T.CylinderGeometry(0.15, 0.15, 0.06, 28), mat(0x0d0f14, { r: 0.1, m: 0.6 }));
      lens.rotation.x = Math.PI / 2; lens.position.set(-0.38, y, -0.16); cam.add(lens);
      var glassL = new T.Mesh(new T.CircleGeometry(0.09, 24), mat(0x1e3a8a, { r: 0.05, m: 0.4, e: 0x1e3a8a, ei: 0.3 }));
      glassL.rotation.y = Math.PI; glassL.position.set(-0.38, y, -0.192); cam.add(glassL);
    });
    var frontCam = new T.Mesh(new T.SphereGeometry(0.035, 12, 12), mat(0x111111)); frontCam.position.set(0, 1.365, 0.11); cam.add(frontCam);
    v.tag("camera", cam);
    // cảm biến
    var sensor = new T.Group(); P.add(sensor);
    var sens = new T.Mesh(new T.SphereGeometry(0.03, 12, 12), mat(0x3a3f4a, { e: 0x7c3aed, ei: 0.5 })); sens.position.set(0.24, 1.365, 0.11); sensor.add(sens);
    v.tag("cambien", sensor);
    // sóng không dây
    var waves = new T.Group(); waves.position.set(0.45, 1.6, 0); P.add(waves);
    var rings = [0.2, 0.36, 0.52].map(function (r) {
      var m = new T.Mesh(new T.TorusGeometry(r, 0.035, 8, 32, Math.PI / 2), new T.MeshBasicMaterial({ color: 0x0fa37f, transparent: true }));
      m.rotation.z = Math.PI / 4; waves.add(m); return m;
    });
    v.updaters.push(function (t) { rings.forEach(function (m, i) { m.material.opacity = 0.25 + 0.75 * Math.max(0, Math.sin(t * 3 - i * 0.9)); }); });
    v.tag("song", waves);
    // nhãn (con của P nên xoay theo máy)
    var lab = function (part, text, pos, cx) { var s = label(text, { pos: pos, cx: cx, scale: 0.0034 }); P.add(s); v.tag(part, s); };
    lab("manhinh", "Màn hình cảm ứng", new T.Vector3(0.95, -0.4, 0.2), 0);
    lab("camera", "Camera", new T.Vector3(-0.95, 1.05, -0.1), 1);
    lab("cambien", "Cảm biến", new T.Vector3(0.95, 1.3, 0.2), 0);
    lab("song", "Sóng 4G · wifi", new T.Vector3(1.05, 2.05, 0), 0);
    lab("hdh", "Android / iOS", new T.Vector3(-0.95, -1.0, 0.1), 1);

    v.setView({ theta: 0.55, phi: 1.38, radius: 7.4, target: new T.Vector3(0, 0.15, 0) }, true);
    v.limits.rMin = 3.2; v.limits.rMax = 11;
    v.updaters.push(function (t) { if (!v.busy) P.position.y = Math.sin(t * 1.4) * 0.05; });

    var land = false;
    v.actions.rotate = function (btn) {
      if (v.busy) return; v.busy = true;
      var a0 = P.rotation.z, a1 = land ? 0 : -Math.PI / 2, swapped = false;
      v.select("cambien");
      v.tween(1.0, function (k) {
        P.rotation.z = a0 + (a1 - a0) * k;
        if (!swapped && k > 0.5) { swapped = true; scrTex.redraw(function (c, w, h) { drawPhone(c, w, h, !land); }); }
      }).then(function () {
        land = !land; v.busy = false;
        btn.textContent = land ? "Xoay dọc máy" : "Xoay ngang máy (cảm biến)";
        toast(land ? "Cảm biến phát hiện em xoay máy, giao diện tự xoay theo!" : "Đã xoay dọc lại.");
      });
    };
  }

  /* ================= CẢNH 3: BỐN TẦNG ================= */
  function buildLayers(v) {
    var T = THREE, S = v.scene;
    shadowFloor(S, -0.2, 30);
    var COMPACT = 0.95, OPEN = 1.6;
    var spread = COMPACT, levels = {};
    function layer(key, y, color, text, o) {
      var G = new T.Group(); G.position.y = y; S.add(G);
      var s = slab(4.2, 2.7, 0.3, 0.22, mat(color, o)); G.add(s);
      var l = label(text, { pos: new T.Vector3(-2.0, 0.02, 1.45), cx: 0, scale: 0.0042 }); G.add(l);
      v.tag(key, s); v.tag(key, l);
      levels[key] = G; return G;
    }
    var hw = layer("hw", 0, 0x5b6577, "Phần cứng", { r: 0.6 });
    var os = layer("os", spread, 0xe0702e, "Hệ điều hành", { e: 0xb93d0b, ei: 0.25, r: 0.4 });
    var app = layer("app", spread * 2, 0x4f7cf0, "Phần mềm ứng dụng", { r: 0.5 });
    var user = new T.Group(); user.position.y = spread * 3; S.add(user); levels.user = user;

    // phần cứng: CPU, bộ nhớ, ổ đĩa, máy in
    var hwBits = new T.Group(); hw.add(hwBits);
    box(0.6, 0.08, 0.6, mat(0x1f232c, { r: 0.3, m: 0.4 }), -1.2, 0.2, 0.1, hwBits);
    box(0.36, 0.05, 0.36, mat(0xb9c0cc, { m: 0.7, r: 0.3 }), -1.2, 0.26, 0.1, hwBits);
    [-0.55, -0.35].forEach(function (z) { box(1.0, 0.16, 0.08, mat(0x1e3a8a), -0.05, 0.24, z, hwBits); });
    box(0.55, 0.12, 0.7, mat(0xb8bec9, { m: 0.6, r: 0.35 }), 0.1, 0.22, 0.65, hwBits);
    var printer = new T.Group(); printer.position.set(1.35, 0.15, -0.45); hw.add(printer);
    box(0.95, 0.42, 0.7, mat(0xe7e9ee, { r: 0.5 }), 0, 0.21, 0, printer);
    box(0.8, 0.04, 0.3, mat(0x9aa3b5), 0, 0.44, -0.2, printer);
    var paper = box(0.6, 0.01, 0.5, mat(0xffffff, { r: 0.9 }), 0, 0.3, 0.1, printer);
    paper.visible = false;
    v.tag("hw", hwBits); v.tag("hw", printer);
    var hwLabels = [["CPU", -1.2, 0.1], ["Bộ nhớ", -0.05, -0.45], ["Máy in", 1.35, -0.45]].map(function (a) {
      var s = label(a[0], { pos: new T.Vector3(a[1], 0.62, a[2]), scale: 0.0042, bg: "rgba(255,255,255,.95)", color: "#1b2333" }); hw.add(s); return s;
    });
    hwLabels.forEach(function (s) { v.tag("hw", s); });

    // hệ điều hành: bánh răng điều phối
    var gear = new T.Group(); gear.position.set(0, 0.24, 0); os.add(gear);
    var gm = mat(0xffd9b8, { r: 0.35, m: 0.2 });
    var hub = new T.Mesh(new T.CylinderGeometry(0.4, 0.4, 0.14, 32), gm); hub.castShadow = true; gear.add(hub);
    for (var i = 0; i < 10; i++) { var tooth = box(0.16, 0.14, 0.18, gm, 0, 0, 0, gear); var a = i / 10 * Math.PI * 2; tooth.position.set(Math.cos(a) * 0.46, 0, Math.sin(a) * 0.46); tooth.rotation.y = -a; }
    var hole = new T.Mesh(new T.CylinderGeometry(0.14, 0.14, 0.16, 20), mat(0xb93d0b)); gear.add(hole);
    v.updaters.push(function (t, dt) { gear.rotation.y += dt * 0.8; });
    v.tag("os", gear);

    // ứng dụng: 3 ô cửa sổ đứng
    function tile(text, color, x) {
      var tex = canvasTex(320, 240, function (c, w, h) {
        c.fillStyle = "#fff"; rr(c, 0, 0, w, h, 26); c.fill();
        c.fillStyle = color; rr(c, 0, 0, w, 62, 26); c.fill(); c.fillRect(0, 36, w, 26);
        c.fillStyle = "#1b2333"; c.font = "700 38px " + FONT; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(text, w / 2, 150);
      });
      var m = new T.Mesh(new T.BoxGeometry(0.9, 0.66, 0.05), [mat(0xffffff), mat(0xffffff), mat(0xffffff), mat(0xffffff), new T.MeshStandardMaterial({ map: tex, roughness: 0.6 }), mat(0xdfe5f2)]);
      m.position.set(x, 0.49, 0.1); m.castShadow = true; app.add(m); v.tag("app", m);
      return m;
    }
    var word = tile("Soạn thảo", "#4f7cf0", -1.25);
    tile("Trình duyệt", "#0fa37f", 0);
    tile("Trò chơi", "#ec4899", 1.25);

    // người dùng
    var disk = new T.Mesh(new T.CylinderGeometry(1.0, 1.0, 0.12, 40), mat(0x13a37f, { r: 0.5 })); disk.castShadow = disk.receiveShadow = true; user.add(disk);
    var person = new T.Group(); user.add(person);
    var skin = mat(0xf2c8a0, { r: 0.6 }), shirt = mat(0x2b55d6, { r: 0.6 });
    var torso = new T.Mesh(new T.CapsuleGeometry(0.24, 0.45, 6, 16), shirt); torso.position.y = 0.55; torso.castShadow = true; person.add(torso);
    var head = new T.Mesh(new T.SphereGeometry(0.22, 24, 24), skin); head.position.y = 1.12; head.castShadow = true; person.add(head);
    var ul = label("Người dùng", { pos: new T.Vector3(0.45, 0.9, 0.3), cx: 0, scale: 0.0042 }); user.add(ul);
    v.tag("user", disk); v.tag("user", person); v.tag("user", ul);

    // gói tin di chuyển
    var glowTex = canvasTex(128, 128, function (c) { var g = c.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, "rgba(255,214,90,1)"); g.addColorStop(0.35, "rgba(255,190,40,.6)"); g.addColorStop(1, "rgba(255,190,40,0)"); c.fillStyle = g; c.fillRect(0, 0, 128, 128); });
    var packet = new T.Sprite(new T.SpriteMaterial({ map: glowTex, depthTest: false, transparent: true }));
    packet.scale.set(0.7, 0.7, 1); packet.renderOrder = 20; packet.visible = false; S.add(packet);

    function setSpread(s) {
      spread = s; hw.position.y = 0; os.position.y = s; app.position.y = 2 * s; user.position.y = 3 * s;
    }
    var exploded = false;
    function viewFor(s) { return { y: s * 1.5 + 0.3, r: s > 1.2 ? 12.5 : 10.5 }; }
    function explode(on, dur) {
      var s0 = spread, s1 = on ? OPEN : COMPACT, ty0 = v.goal.target.y, r0 = v.goal.radius, end = viewFor(s1);
      exploded = on;
      return v.tween(dur || 0.9, function (k) {
        setSpread(s0 + (s1 - s0) * k);
        v.goal.target.y = ty0 + (end.y - ty0) * k;
        v.goal.radius = r0 + (end.r - r0) * k;
      });
    }
    setSpread(COMPACT);
    v.setView({ theta: 0.6, phi: 1.2, radius: 10.5, target: new T.Vector3(0, viewFor(COMPACT).y, 0) }, true);
    v.limits.rMin = 4; v.limits.rMax = 16;
    var baseReset = v.resetView.bind(v);
    v.resetView = function () { baseReset(); var e = viewFor(spread); v.goal.target.y = e.y; v.goal.radius = e.r; };

    v.actions.explode = function () { if (v.busy) return; v.busy = true; explode(!exploded).then(function () { v.busy = false; }); };

    function wp(group, x, y, z) { return function () { var p = new T.Vector3(x, y, z); group.localToWorld(p); return p; }; }
    v.actions.flow = function () {
      if (v.busy) return; v.busy = true;
      paper.visible = false; paper.position.z = 0.1;
      var steps = [
        { at: wp(person, 0.3, 0.75, 0.2), part: "user", title: "Bước 1 · Người dùng", text: "Em bấm nút \"In\" trong phần mềm soạn thảo." },
        { at: wp(word, 0, 0, 0.1), part: "app", title: "Bước 2 · Phần mềm ứng dụng", text: "Phần mềm soạn thảo không tự điều khiển máy in. Nó gửi yêu cầu in cho hệ điều hành." },
        { at: wp(gear, 0, 0.1, 0), part: "os", title: "Bước 3 · Hệ điều hành", text: "Hệ điều hành dùng dịch vụ quản lí thiết bị để điều khiển máy in thay cho ứng dụng." },
        { at: wp(printer, 0, 0.5, 0), part: "hw", title: "Bước 4 · Phần cứng", text: "Máy in (thiết bị ra) thực hiện lệnh. Trang giấy được in ra!" }
      ];
      var chain = (exploded ? Promise.resolve() : explode(true, 0.8));
      var prev = null;
      steps.forEach(function (st, i) {
        chain = chain.then(function () {
          var to = st.at(), from = prev || to.clone().add(new T.Vector3(0, 0.6, 0));
          packet.visible = true;
          v.select(st.part);
          v.showInfo(st.title, [st.text], [v.def.parts[st.part].title]);
          return v.tween(i === 0 ? 0.5 : 1.1, function (k) {
            packet.position.lerpVectors(from, to, k);
            packet.position.y += Math.sin(k * Math.PI) * 0.35;
          }).then(function () { prev = to; return v.wait(1.6); });
        });
      });
      chain.then(function () {
        paper.visible = true;
        return v.tween(0.8, function (k) { paper.position.z = 0.1 + k * 0.45; });
      }).then(function () { return v.wait(0.6); }).then(function () {
        packet.visible = false;
        v.select("os");
        v.showInfo("Kết luận", ["Ứng dụng khai thác phần cứng <b>qua các dịch vụ của hệ điều hành</b>.", "Hệ điều hành là <b>trung gian</b> và là <b>môi trường chung</b> để ứng dụng dùng phần cứng hiệu quả."], ["Hệ điều hành = trung gian"]);
        v.busy = false;
      });
    };
  }

  /* ================= KHỞI ĐỘNG CÁC CẢNH ================= */
  var BUILDERS = { pc: buildPC, phone: buildPhone, layers: buildLayers };
  function start(root) {
    var key = root.getAttribute("data-scene");
    var v = new Viewer(root, DEFS[key]);
    v.actions = {};
    var loading = root.querySelector(".scene__loading");
    root.querySelectorAll("[data-action]").forEach(function (b) {
      b.addEventListener("click", function () {
        var a = b.getAttribute("data-action");
        if (!v.renderer) return;
        if (a === "reset") { v.resetView(); return; }
        if (v.actions[a]) v.actions[a](b);
      });
    });
    if (!HAS3D) {
      loading.hidden = true;
      root.querySelector(".scene__fallback").hidden = false;
      root.querySelectorAll("[data-action]").forEach(function (b) { b.disabled = true; b.title = "Cần trình duyệt hỗ trợ 3D"; });
      return;
    }
    var go = function () {
      try {
        v.init3D();
        BUILDERS[key](v);
        v.applyHighlight();
        loading.hidden = true;
        v.loop();
      } catch (err) {
        console.warn("Không dựng được cảnh 3D:", err);
        loading.hidden = true;
        if (v.renderer && v.renderer.domElement.parentNode) v.renderer.domElement.remove();
        root.querySelector(".scene__fallback").hidden = false;
      }
    };
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { io.disconnect(); go(); }
      }, { rootMargin: "400px" });
      io.observe(root);
    } else go();
  }

  var fontsReady = (document.fonts && document.fonts.ready) ? Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 1500); })]) : Promise.resolve();
  fontsReady.then(function () {
    // nạp trước font đậm để chữ trên canvas đúng phông
    var loads = document.fonts && document.fonts.load ? Promise.all([document.fonts.load("700 46px \"Be Vietnam Pro\""), document.fonts.load("600 24px \"Be Vietnam Pro\"")]).catch(function () {}) : Promise.resolve();
    return Promise.race([loads, new Promise(function (r) { setTimeout(r, 1200); })]);
  }).then(function () {
    document.querySelectorAll("[data-scene]").forEach(start);
  });
})();
