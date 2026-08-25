// ==========================================
// 1. DATA DEFINITIONS (KARI 5 PROJECTS)
// ==========================================
const projects = [
  {
    num: "01",
    title: "LIFTOFF KOREA",
    subYouth: "KSLV-II NURI YOUTH SPACE LAB",
    subPro: "KSLV-II NURI PROPULSION R&D LAB",
    descYouth: "🚀 75톤급 액체엔진 4개가 뿜어내는 300톤의 강력한 우주 추진력 3D 시뮬레이션",
    descPro: "📊 75톤급 액체연소 로켓엔진 클러스터링 추진체계 및 700km 태양동기궤도 텔레메트리",
    coord: "LAT 34.43° N / LON 127.52° E",
    orbit: "ORBIT: 700KM SUN-SYNC",
    statusYouth: "STATUS: 🚀 누리호 3D 가상 발사 준비 완료",
    statusPro: "STATUS: ⚡ 75T ENGINE CLUSTERING TELEMETRY ACTIVE",
    youthAction: "🚀 누리호 3D 가상 발사 시뮬레이션 시작",
    proAction: "📊 75톤 액체엔진 추진체 기술 사양 검증",
    modalYouth: "modal-rocket",
    modalPro: "modal-orbit"
  },
  {
    num: "02",
    title: "LUNAR HORIZON",
    subYouth: "DANURI 380,000KM LUNAR EXPLORER",
    subPro: "DANURI DEEP SPACE TELEMETRY ARCHIVE",
    descYouth: "🌕 38만 km 우주를 넘어 달 상공 100km 크레이터와 월면 지형 입체 탐색",
    descPro: "🛰 탄도 달 전이(BLT) 정밀 항행 궤적 및 LUTI 고해상도 달 원천 데이터셋",
    coord: "DIST: 384,400 KM / LUNAR 100KM",
    orbit: "ORBIT: POLAR CIRCULAR",
    statusYouth: "STATUS: 🌕 다누리 달 궤도 실시간 통신 연결",
    statusPro: "STATUS: 📡 BLT DEEP SPACE TELEMETRY ACTIVE",
    youthAction: "🌕 다누리 달 100km 상공 3D 크레이터 탐색",
    proAction: "🛰 달 궤도 전이(BLT) 정밀 항행 데이터 확인",
    modalYouth: "modal-rocket",
    modalPro: "modal-orbit"
  },
  {
    num: "03",
    title: "EARTH EYE 24/7",
    subYouth: "GEO-KOMPSAT WEATHER WATCH",
    subPro: "GEO-KOMPSAT & KOMPSAT OPEN DATA",
    descYouth: "🌍 지구 위 36,000km 정지궤도에서 24시간 실시간 한반도 날씨와 구름 관측",
    descPro: "📡 GEO-KOMPSAT 2A/2B 및 KOMPSAT 정밀 광학/SAR 관측 데이터 개방 플랫폼",
    coord: "LON 128.2° E / GEOSTATIONARY",
    orbit: "ORBIT: 35,786KM GEO-SYNC",
    statusYouth: "STATUS: 🌍 실시간 한반도 기상 스트리밍중",
    statusPro: "STATUS: 📡 OPEN KARI API DATA PIPELINE ONLINE",
    youthAction: "🌍 우주에서 보는 실시간 한반도 날씨 뷰어",
    proAction: "📡 OPEN KARI 위성 원천 관측 데이터셋 다운로드",
    modalYouth: "modal-quiz",
    modalPro: "modal-data"
  },
  {
    num: "04",
    title: "NEXT MOBILITY",
    subYouth: "FUTURE AIR TAXI COCKPIT",
    subPro: "OPPAV AAM DISTRIBUTED PROPULSION",
    descYouth: "🚁 도심 하늘을 자유롭게 날아다니는 미래형 친환경 에어택시 가상 조종 체험",
    descPro: "⚡ 자율비행 OPPAV 분산전기추진(DEP) 아키텍처 및 3,000m AGL 비행 스펙",
    coord: "LAT 34.61° N / LON 127.20° E",
    orbit: "ALTITUDE: 3,000M AGL",
    statusYouth: "STATUS: 🚁 미래 에어택시 가상 조종석 준비 완료",
    statusPro: "STATUS: ⚡ OPPAV AUTONOMOUS FLIGHT TESTBED ACTIVE",
    youthAction: "🚁 미래형 에어택시 가상 조종석 체험",
    proAction: "⚡ 친환경 분산전기추진 항공 아키텍처 스펙",
    modalYouth: "modal-quiz",
    modalPro: "modal-facility"
  },
  {
    num: "05",
    title: "BEYOND MARS",
    subYouth: "FUTURE SPACE SCIENTIST QUIZ",
    subPro: "REUSABLE LAUNCHER & TESTBED INFRA",
    descYouth: "🧑‍🚀 우주 탐사선 연구원의 꿈! KARI AI 적성 진로 퀴즈 풀고 우주 과학자 도전",
    descPro: "🏢 대형 열진공 챔버(TVC) 및 민간 우주산업(New Space) 시험 인프라 예약",
    coord: "VECTOR: MARS TRANSFER WINDOW",
    orbit: "ORBIT: HELIOCENTRIC",
    statusYouth: "STATUS: 🧑‍🚀 KARI AI 우주 진로 적성 테스트 대기중",
    statusPro: "STATUS: 🏢 NATIONAL SPACE TESTBED RESERVATION OPEN",
    youthAction: "🧑‍🚀 미래 우주 연구원 적성 AI 진로 퀴즈 풀기",
    proAction: "🏢 대형 열진공 챔버 및 우주환경 시험시설 예약",
    modalYouth: "modal-quiz",
    modalPro: "modal-facility"
  }
];

// Global State
let currentSlide = 0;
let isAnimating = false;

// ==========================================
// 2. FALLBACK PROCEDURAL TEXTURE GENERATOR
// (에셋 로딩 전 또는 비디오 재생 지연 시 즉시 화면에 렌더링)
// ==========================================
function createFallbackTexture(index) {
  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");

  const colors = [
    ["#050814", "#1e1b4b", "#ff5722"], // 01 Nuri
    ["#02040a", "#0f172a", "#38bdf8"], // 02 Danuri
    ["#050b1a", "#0d2b45", "#00f5d4"], // 03 Cheollian
    ["#0f172a", "#1e293b", "#06b6d4"], // 04 AAM
    ["#08020f", "#2e0854", "#d946ef"]  // 05 Future Horizon
  ];

  const col = colors[index % colors.length];
  const grad = ctx.createRadialGradient(960, 540, 80, 960, 540, 950);
  grad.addColorStop(0, col[2]);
  grad.addColorStop(0.5, col[1]);
  grad.addColorStop(1, col[0]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1920, 1080);

  // Grid Lines
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x < 1920; x += 120) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1080);
    ctx.stroke();
  }
  for (let y = 0; y < 1080; y += 120) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1920, y);
    ctx.stroke();
  }

  // Giant Title Watermark
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.font = "bold 200px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(projects[index].title, 960, 600);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

// ==========================================
// 3. THREE.JS & TAO TAJIMA SHADER SETUP
// ==========================================
const container = document.getElementById("webgl-container");
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// 초기에는 안전한 Fallback 텍스처로 즉시 화면 표시
const textures = [
  createFallbackTexture(0),
  createFallbackTexture(1),
  createFallbackTexture(2),
  createFallbackTexture(3),
  createFallbackTexture(4)
];

// GLSL Shaders
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTextureCurrent;
  uniform sampler2D uTextureNext;
  uniform float uProgress;
  uniform float uDirection;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Diagonal Wave Distortion Factor
    float wave = sin((uv.x + uv.y) * 6.0 + uProgress * 3.14159265) * 0.15 * (1.0 - uProgress) * uProgress;
    
    // UV Offset with Direction
    vec2 distortedUvCurrent = vec2(uv.x + wave * uDirection, uv.y + wave);
    vec2 distortedUvNext = vec2(uv.x - wave * uDirection, uv.y - wave);

    vec4 tex1 = texture2D(uTextureCurrent, distortedUvCurrent);
    vec4 tex2 = texture2D(uTextureNext, distortedUvNext);

    vec4 finalColor = mix(tex1, tex2, uProgress);
    gl_FragColor = finalColor;
  }
`;

const uniforms = {
  uTextureCurrent: { value: textures[0] },
  uTextureNext: { value: textures[1] },
  uProgress: { value: 0.0 },
  uDirection: { value: 1.0 }
};

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms
});

const geometry = new THREE.PlaneGeometry(2, 2);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// ==========================================
// 4. ASSET LOADERS (비디오 & 이미지 안전 로딩)
// ==========================================
const textureLoader = new THREE.TextureLoader();

function loadRealImage(index, src) {
  textureLoader.load(
    src,
    (loadedTex) => {
      loadedTex.minFilter = THREE.LinearFilter;
      textures[index] = loadedTex;
      if (currentSlide === index && !isAnimating) {
        uniforms.uTextureCurrent.value = loadedTex;
      }
    },
    undefined,
    (err) => console.warn(`이미지 로딩 실패 (${src}), 폴백 배경 유지:`, err)
  );
}

const videoTextureCache = new Map();

function loadRealVideo(index, elementId) {
  const video = document.getElementById(elementId);
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("muted", "");

  let vidTex = videoTextureCache.get(elementId);
  if (!vidTex) {
    vidTex = new THREE.VideoTexture(video);
    vidTex.minFilter = THREE.LinearFilter;
    vidTex.magFilter = THREE.LinearFilter;
    vidTex.format = THREE.RGBAFormat;
    videoTextureCache.set(elementId, vidTex);
  }

  textures[index] = vidTex;

  // 현재 슬라이드가 활성화된 상태라면 즉시 텍스처 적용
  if (currentSlide === index && !isAnimating) {
    uniforms.uTextureCurrent.value = vidTex;
  }

  const tryPlay = () => {
    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn(`비디오 자동재생 대기 중 (${elementId}):`, err);
        });
      }
    }
  };

  if (video.readyState >= 2) {
    tryPlay();
  } else {
    video.addEventListener("loadeddata", tryPlay, { once: true });
    video.addEventListener("canplay", tryPlay, { once: true });
  }

  tryPlay();
}

// ==========================================
// 5. INERTIA VIRTUAL SCROLL & INTERACTION
// ==========================================

// 마우스 휠 스크롤은 슬라이드 전환 대신, 하단 포털 영역으로의 자연스러운 기본 스크롤 이동만 지원하도록 휠 차단 리스너를 해제합니다.
// 화면의 빈 영역 클릭 시에만 슬라이드가 부드럽게 전환(Warp)되도록 변경합니다.
window.addEventListener("click", (e) => {
  // 헤더, 메가 메뉴, 버튼, 푸터, 포털 섹션 본문 카드 등을 클릭했을 때는 무시
  if (e.target.closest("header") || 
      e.target.closest(".mega-dropdown-panel") ||
      e.target.closest("button") || 
      e.target.closest("a") || 
      e.target.closest(".portal-section") || 
      e.target.closest("footer")) {
    return;
  }

  // 스크롤이 아래로 내려간 포털 영역에서는 클릭 슬라이드 전환 미작동
  if (window.scrollY > 50) return;

  if (!isAnimating) {
    // 01 -> 02 -> 03 -> 04 -> 05 -> 01 순환
    let nextIdx = (currentSlide + 1) % projects.length;
    transitionSlide(nextIdx, 1);
  }
});

function transitionSlide(nextIndex, direction) {
  isAnimating = true;
  uniforms.uTextureCurrent.value = textures[currentSlide];
  uniforms.uTextureNext.value = textures[nextIndex];
  uniforms.uDirection.value = direction;
  uniforms.uProgress.value = 0.0;

  // 타이포그래피 모션
  gsap.to(".text-mask > *", {
    y: direction * -35,
    opacity: 0,
    duration: 0.35,
    stagger: 0.04,
    onComplete: () => {
      updateHUD(nextIndex);
      gsap.fromTo(".text-mask > *",
        { y: direction * 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.04 }
      );
    }
  });

  // 셰이더 프로그레스 애니메이션
  gsap.to(uniforms.uProgress, {
    value: 1.0,
    duration: 1.1,
    ease: "power2.inOut",
    onComplete: () => {
      currentSlide = nextIndex;
      uniforms.uTextureCurrent.value = textures[currentSlide];
      uniforms.uProgress.value = 0.0;
      isAnimating = false;
    }
  });

  // 하단 트랙 바
  gsap.to("#track-thumb", {
    left: `${(nextIndex / (projects.length - 1)) * 80}%`,
    duration: 0.8,
    ease: "power2.out"
  });
}

let currentMode = "youth"; // "youth" | "pro"

function updateHUD(idx, animateAction = false) {
  const p = projects[idx];
  if (!p) return;

  const isYouth = currentMode === "youth";

  const currNum = document.getElementById("curr-num");
  const projTitle = document.getElementById("project-title");
  const projSub = document.getElementById("project-subtitle");
  const projDesc = document.getElementById("project-desc");
  const hudCoord = document.getElementById("hud-coord");
  const hudOrbit = document.getElementById("hud-orbit");
  const missionStatus = document.getElementById("mission-status");
  const actionBtn = document.getElementById("btn-hero-action");
  const actionText = document.getElementById("action-text");
  const hudBadge = document.getElementById("hud-mode-badge");

  if (currNum) currNum.textContent = p.num;
  if (projTitle) projTitle.textContent = p.title;
  if (projSub) projSub.textContent = isYouth ? p.subYouth : p.subPro;
  if (projDesc) projDesc.textContent = isYouth ? p.descYouth : p.descPro;
  if (hudCoord) hudCoord.textContent = p.coord;
  if (hudOrbit) hudOrbit.textContent = p.orbit;
  if (missionStatus) missionStatus.textContent = isYouth ? p.statusYouth : p.statusPro;

  if (hudBadge) {
    const iconSpan = hudBadge.querySelector(".badge-icon");
    const textSpan = hudBadge.querySelector(".badge-text");
    if (iconSpan) iconSpan.textContent = isYouth ? "🌱" : "⚡";
    if (textSpan) textSpan.textContent = isYouth ? "청소년 호기심 탐구 모드 [YOUTH EXPLORER]" : "산업·연구 R&D 데이터 모드 [RESEARCH & INDUSTRY]";
  }

  if (actionBtn && actionText) {
    const targetText = isYouth ? p.youthAction : p.proAction;
    const targetModal = isYouth ? p.modalYouth : p.modalPro;

    if (animateAction) {
      gsap.to(actionBtn, {
        scale: 0.94,
        opacity: 0.2,
        duration: 0.15,
        onComplete: () => {
          actionText.textContent = targetText;
          actionBtn.setAttribute("data-modal", targetModal);
          gsap.to(actionBtn, { scale: 1, opacity: 1, duration: 0.25 });
        }
      });
    } else {
      actionText.textContent = targetText;
      actionBtn.setAttribute("data-modal", targetModal);
    }
  }
}

// 윈도우 리사이즈
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 렌더링 루프 (비디오 텍스처 프레임 동기화 및 WebGL 렌더)
function render() {
  requestAnimationFrame(render);
  if (uniforms.uTextureCurrent.value && uniforms.uTextureCurrent.value.isVideoTexture) {
    uniforms.uTextureCurrent.value.needsUpdate = true;
  }
  if (uniforms.uTextureNext.value && uniforms.uTextureNext.value.isVideoTexture) {
    uniforms.uTextureNext.value.needsUpdate = true;
  }
  renderer.render(scene, camera);
}
render();

// ==========================================
// 6. SITEMAP & USER INTERACTION UNBLOCK
// ==========================================
const menuTrigger = document.getElementById("menu-trigger");
const menuClose = document.getElementById("menu-close");
const sitemapOverlay = document.getElementById("sitemap-overlay");
const sitemapCols = document.querySelectorAll(".sitemap-col");

menuTrigger.addEventListener("click", () => {
  sitemapOverlay.classList.add("active");
  gsap.fromTo(sitemapCols,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" }
  );
});

menuClose.addEventListener("click", () => {
  gsap.to(sitemapOverlay, {
    opacity: 0,
    duration: 0.35,
    onComplete: () => {
      sitemapOverlay.classList.remove("active");
      sitemapOverlay.style.opacity = "";
    }
  });
});

const sitemapLinks = document.querySelectorAll(".col-links a");
sitemapLinks.forEach(link => {
  link.addEventListener("click", () => {
    sitemapOverlay.classList.remove("active");
  });
});

// 사용자 첫 상호작용(클릭, 스크롤, 터치) 시 비디오 강제 언락 및 재생
function unlockVideos() {
  const vids = document.querySelectorAll("video");
  vids.forEach(v => {
    v.muted = true;
    if (v.paused) {
      v.play().catch(() => {});
    }
  });
}

// 탭 전환 후 복귀 시 재생 복구
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    unlockVideos();
  }
});

// 주기적으로 정지된 비디오 체크 및 재시작 (일부 브라우저/OS 절전 후 재생 중단 복구)
setInterval(() => {
  const vids = document.querySelectorAll("video");
  vids.forEach(v => {
    if (v.paused && !v.ended) {
      v.play().catch(() => {});
    }
  });
}, 3000);

window.addEventListener("pointerdown", unlockVideos, { once: true });
window.addEventListener("wheel", unlockVideos, { once: true });
window.addEventListener("touchstart", unlockVideos, { once: true });
// 페이지 포커스 복귀 시에도 언락
window.addEventListener("focus", unlockVideos);

// 실제 에셋 로딩 시작 (섹션 4: aircraft.mp4, 섹션 5: galuxy.mp4)
loadRealVideo(0, "video-slide-1");
loadRealVideo(1, "video-slide-2");
loadRealVideo(2, "video-slide-3");
loadRealVideo(3, "video-slide-4"); // aircraft.mp4 (AAM / Aviation)
loadRealVideo(4, "video-slide-5"); // galuxy.mp4 (Beyond Mars / Deep Space)

// ==========================================
// 7. KARI OFFICIAL MEGA DROPDOWN INTERACTION
// ==========================================
(function() {
  const hudHeader = document.querySelector(".hud-top");
  const navItems = document.querySelectorAll(".nav-item[data-mega]");
  const megaPanel = document.getElementById("mega-panel");
  const megaDisplayTitle = document.getElementById("mega-display-title");
  const megaContents = document.querySelectorAll(".mega-content");

  if (!hudHeader || !megaPanel) return;

  let leaveTimeout = null;

  function showMega(idx) {
    if (leaveTimeout) clearTimeout(leaveTimeout);
    
    // Set active header status (transforms to white theme)
    hudHeader.classList.add("mega-active");
    
    // Switch title
    const activeItem = document.querySelector(`.nav-item[data-mega="${idx}"]`);
    if (activeItem) {
      megaDisplayTitle.textContent = activeItem.textContent;
    }
    
    // Switch column contents
    megaContents.forEach(content => {
      if (content.getAttribute("data-mega-content") === String(idx)) {
        content.classList.add("active");
      } else {
        content.classList.remove("active");
      }
    });
  }

  function hideMega() {
    hudHeader.classList.remove("mega-active");
    megaContents.forEach(content => content.classList.remove("active"));
  }

  // Setup hover events for navigation triggers
  navItems.forEach(item => {
    item.addEventListener("mouseenter", () => {
      const idx = item.getAttribute("data-mega");
      showMega(idx);
    });

    item.addEventListener("mouseleave", () => {
      leaveTimeout = setTimeout(() => {
        // Only hide if cursor is not inside the dropdown panel itself or header
        if (!megaPanel.matches(':hover') && !hudHeader.matches(':hover')) {
          hideMega();
        }
      }, 100);
    });
  });

  // Setup hover events for the panel itself
  megaPanel.addEventListener("mouseenter", () => {
    if (leaveTimeout) clearTimeout(leaveTimeout);
    hudHeader.classList.add("mega-active");
  });

  megaPanel.addEventListener("mouseleave", () => {
    leaveTimeout = setTimeout(() => {
      if (!hudHeader.matches(':hover')) {
        hideMega();
      }
    }, 100);
  });

  hudHeader.addEventListener("mouseleave", () => {
    leaveTimeout = setTimeout(() => {
      if (!megaPanel.matches(':hover')) {
        hideMega();
      }
    }, 100);
  });
})();

// ==========================================
// 8. DUAL TARGET USER MODE SWITCHER & ACTION MODAL LOGIC
// ==========================================
window.currentAppMode = 'youth';

// 0.2s Cybernetic HUD Pulse (Glow) Effect
function triggerHUDPulse() {
  const pulse = document.getElementById("hud-pulse-overlay");
  if (!pulse) return;
  pulse.classList.add("active");
  setTimeout(() => {
    pulse.classList.remove("active");
  }, 220);
}

// Global window.setAppMode Function (Executable via inline onclick or JS)
window.setAppMode = function(mode) {
  window.currentAppMode = mode;
  currentMode = mode;

  const btnYouth = document.getElementById("btn-mode-youth");
  const btnPro = document.getElementById("btn-mode-pro");
  const dockYouth = document.getElementById("dock-youth");
  const dockPro = document.getElementById("dock-pro");

  // Sync button active classes
  document.querySelectorAll(".switcher-btn, .mode-btn").forEach(btn => {
    const isProBtn = (btn.id && btn.id.includes("pro")) || btn.getAttribute("data-mode") === "pro";
    if ((mode === 'pro' && isProBtn) || (mode === 'youth' && !isProBtn)) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  if (btnYouth && btnPro) {
    if (mode === 'youth') {
      btnYouth.classList.add("active");
      btnPro.classList.remove("active");
    } else {
      btnPro.classList.add("active");
      btnYouth.classList.remove("active");
    }
  }

  if (dockYouth && dockPro) {
    if (mode === 'youth') {
      dockYouth.classList.remove("hidden");
      dockPro.classList.add("hidden");
    } else {
      dockPro.classList.remove("hidden");
      dockYouth.classList.add("hidden");
    }
  }

  // Toggle Body Theme Class (Youth: #00F5D4 vs Pro: #38BDF8 & #ff5722)
  document.body.classList.toggle("mode-pro", mode === "pro");

  // Trigger 0.2s Cybernetic HUD Pulse Glow
  triggerHUDPulse();

  // Cybernetic GSAP Glitch / Masking Transition on Central Text & Action Button
  const targets = document.querySelectorAll(".center-content .text-mask > *");
  if (window.gsap && targets.length > 0) {
    const tl = gsap.timeline();
    tl.to(targets, {
      y: -18,
      skewX: 15,
      opacity: 0,
      duration: 0.14,
      stagger: 0.03,
      ease: "power2.in",
      onComplete: () => {
        updateHUD(currentSlide, false);
      }
    })
    .fromTo(targets,
      { y: 22, skewX: -15, opacity: 0 },
      {
        y: 0,
        skewX: 0,
        opacity: 1,
        duration: 0.28,
        stagger: 0.03,
        ease: "back.out(1.5)"
      }
    );
  } else if (typeof updateHUD === 'function') {
    updateHUD(currentSlide, false);
  }
};

// Event Delegation on Document (Guarantees clicks on mode buttons or action buttons work immediately)
document.addEventListener("click", (e) => {
  const modeBtn = e.target.closest(".switcher-btn, .mode-btn");
  if (modeBtn) {
    e.preventDefault();
    e.stopPropagation();
    const mode = modeBtn.getAttribute("data-mode") || (modeBtn.id && modeBtn.id.includes("pro") ? "pro" : "youth");
    if (mode) {
      window.setAppMode(mode);
    }
    return;
  }

  const heroActionBtn = e.target.closest("#btn-hero-action");
  if (heroActionBtn) {
    e.preventDefault();
    e.stopPropagation();
    const modalId = heroActionBtn.getAttribute("data-modal");
    openActionModal(modalId);
    return;
  }

  const closeBtn = e.target.closest("#modal-close-btn") || e.target.closest("#modal-backdrop");
  if (closeBtn) {
    closeActionModal();
  }
});

function openActionModal(modalId) {
  const modalOverlay = document.getElementById("action-modal-overlay");
  const modalContentArea = document.getElementById("modal-content-area");
  if (!modalOverlay || !modalContentArea) return;

  const p = projects[currentSlide];
  const isYouth = currentMode === "youth";
  let html = "";

  if (modalId === "modal-rocket") {
    html = `
      <div class="modal-badge">${isYouth ? 'YOUTH INTERACTIVE SIMULATOR' : 'ENGINEERING DATA VERIFICATION'}</div>
      <h2>${isYouth ? '🚀 누리호 / 다누리 3D 가상 발사 시뮬레이션' : '📊 75톤급 액체엔진 클러스터링 기술 검증'}</h2>
      <p class="modal-desc">${isYouth ? p.descYouth : p.descPro}</p>
      <div class="modal-spec-grid">
        <div class="spec-card"><span>엔진 구성</span><strong>75톤급 액체연소 엔진 x 4 (1단 300톤 추력)</strong></div>
        <div class="spec-card"><span>운용 궤도</span><strong>${p.orbit}</strong></div>
        <div class="spec-card"><span>발사 위치</span><strong>${p.coord}</strong></div>
        <div class="spec-card"><span>미션 상태</span><strong>${isYouth ? p.statusYouth : p.statusPro}</strong></div>
      </div>
      <div class="modal-footer-btns">
        <a href="https://www.kari.re.kr/kor/contents/95" target="_blank" class="btn-modal-action">가상 시뮬레이터 실행하기 ↗</a>
      </div>
    `;
  } else if (modalId === "modal-orbit") {
    html = `
      <div class="modal-badge">${isYouth ? 'DEEP SPACE EXPLORER' : 'BALLISTIC LUNAR TRANSFER ARCHIVE'}</div>
      <h2>${isYouth ? '🌕 다누리 달 100km 상공 3D 크레이터 탐색' : '🛰 달 궤도 전이(BLT) 정밀 항행 데이터'}</h2>
      <p class="modal-desc">${isYouth ? p.descYouth : p.descPro}</p>
      <div class="modal-spec-grid">
        <div class="spec-card"><span>항행 거리</span><strong>지구-달 384,400 km 심우주 항행</strong></div>
        <div class="spec-card"><span>임무 고도</span><strong>달 극궤도 100km 원궤도</strong></div>
        <div class="spec-card"><span>탑재 장비</span><strong>LUTI 고해상도카메라, ShadowCam, PolCam</strong></div>
        <div class="spec-card"><span>수신 레벨</span><strong>${isYouth ? p.statusYouth : p.statusPro}</strong></div>
      </div>
      <div class="modal-footer-btns">
        <a href="https://www.kari.re.kr/kor/contents/66" target="_blank" class="btn-modal-action">달 궤도 정밀 항행 데이터 열기 ↗</a>
      </div>
    `;
  } else if (modalId === "modal-quiz") {
    html = `
      <div class="modal-badge">KARI AI INTERACTIVE LAB</div>
      <h2>${isYouth ? '🧑‍🚀 미래 우주 연구원 적성 AI 진로 퀴즈' : '🌍 실시간 위성 기상/환경 관측 뷰어'}</h2>
      <p class="modal-desc">${isYouth ? p.descYouth : p.descPro}</p>
      <div class="quiz-container">
        <p class="quiz-question">Q. 대한민국 최초의 달 궤도선 '다누리'가 달로 가기 위해 선택한 특수 궤적(BLT)의 정식 명칭은?</p>
        <div class="quiz-choices">
          <button class="choice-btn" onclick="alert('정답입니다! BLT(Ballistic Lunar Transfer, 탄도 달 전이 궤적)를 통해 연료 소비를 25% 절감했습니다.')">1) 탄도 달 전이 궤적 (Ballistic Lunar Transfer)</button>
          <button class="choice-btn" onclick="alert('아쉽네요! 정답은 1번 탄도 달 전이 궤적입니다.')">2) 지구-달 직격 전이 궤적</button>
        </div>
      </div>
    `;
  } else if (modalId === "modal-data") {
    html = `
      <div class="modal-badge">OPEN KARI 위성 데이터랩</div>
      <h2>📡 OPEN KARI 위성 원천 관측 데이터셋 다운로드</h2>
      <p class="modal-desc">${isYouth ? p.descYouth : p.descPro}</p>
      <div class="modal-spec-grid">
        <div class="spec-card"><span>데이터 포맷</span><strong>GeoTIFF, HDF5, RESTful API</strong></div>
        <div class="spec-card"><span>제공 범위</span><strong>한반도 고해상도 광학, SAR, 기상/해양 데이터</strong></div>
      </div>
      <div class="modal-footer-btns">
        <a href="https://www.kari.re.kr/kor/contents/243" target="_blank" class="btn-modal-action">OPEN DATA API 신청하기 ↗</a>
      </div>
    `;
  } else {
    html = `
      <div class="modal-badge">SPACE INDUSTRY TESTBED</div>
      <h2>🏢 대형 열진공 챔버 및 우주환경 시험시설 예약</h2>
      <p class="modal-desc">${isYouth ? p.descYouth : p.descPro}</p>
      <div class="modal-spec-grid">
        <div class="spec-card"><span>시험 시설</span><strong>대형 열진공 챔버 (TVC), 음향시험실, 전자파 챔버</strong></div>
        <div class="spec-card"><span>신청 대상</span><strong>국내 우주항공 기업 및 연구기관</strong></div>
      </div>
      <div class="modal-footer-btns">
        <a href="https://www.kari.re.kr/kor/contents/153" target="_blank" class="btn-modal-action">시험시설 공동활용 신청 ↗</a>
      </div>
    `;
  }

  modalContentArea.innerHTML = html;
  modalOverlay.classList.add("active");
}

function closeActionModal() {
  const modalOverlay = document.getElementById("action-modal-overlay");
  if (modalOverlay) modalOverlay.classList.remove("active");
}

// Initial HUD sync
updateHUD(currentSlide, false);