// ==========================================
// 1. DATA DEFINITIONS (KARI 5 PROJECTS)
// ==========================================
const projects = [
  {
    num: "01",
    title: "NURI",
    sub: "KSLV-II SPACE LAUNCH VEHICLE",
    desc: "독자 개발 75톤급 액체엔진 클러스터링 기반 우주 수송 플랫폼",
    coord: "LAT 34.43° N / LON 127.52° E",
    orbit: "ORBIT: 700KM SUN-SYNC",
    status: "STATUS: STANDBY ON PAD / READY"
  },
  {
    num: "02",
    title: "DANURI",
    sub: "KOREA PATHFINDER LUNAR ORBITER",
    desc: "BLT 궤적을 통한 대한민국 최초 달 탐사 및 고해상도 지형 관측",
    coord: "DIST: 384,400 KM / LUNAR 100KM",
    orbit: "ORBIT: POLAR CIRCULAR",
    status: "STATUS: DEEP SPACE TELEMETRY LINKED"
  },
  {
    num: "03",
    title: "GEO-KOMPSAT",
    sub: "GEOSTATIONARY SATELLITE 2A/2B",
    desc: "한반도 기상/해양/환경 24시간 실시간 정지궤도 감시망",
    coord: "LON 128.2° E / GEOSTATIONARY",
    orbit: "ORBIT: 35,786KM GEO",
    status: "STATUS: 24/7 WEATHER STREAMING"
  },
  {
    num: "04",
    title: "AAM / AVIATION",
    sub: "ADVANCED AIR MOBILITY & SYSTEM",
    desc: "도심항공교통 미래 비행체 및 친환경 항공 추진 체계 시뮬레이션",
    coord: "LAT 34.61° N / LON 127.20° E",
    orbit: "SERVICE CEILING: 3,000M AGL",
    status: "STATUS: AUTONOMOUS TEST FLYING"
  },
  {
    num: "05",
    title: "FUTURE HORIZON",
    sub: "DEEP SPACE & REUSABLE SYSTEM",
    desc: "차세대 다단연소 발사체 및 소행성·화성 무인 탐사 로드맵",
    coord: "VECTOR: MARS TRANSFER WINDOW",
    orbit: "ORBIT: HELIOCENTRIC",
    status: "STATUS: R&D ARCHITECTURE V2"
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

function loadRealVideo(index, elementId) {
  const video = document.getElementById(elementId);
  if (!video) return;

  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  const startVideoTexture = () => {
    const vidTex = new THREE.VideoTexture(video);
    vidTex.minFilter = THREE.LinearFilter;
    vidTex.magFilter = THREE.LinearFilter;
    vidTex.format = THREE.RGBAFormat;

    textures[index] = vidTex;

    // 현재 슬라이드가 활성화된 상태라면 즉시 교체
    if (currentSlide === index && !isAnimating) {
      uniforms.uTextureCurrent.value = vidTex;
    }
  };

  // 이미 준비 완료되었는지 확인 후 텍스처 생성
  if (video.readyState >= 2) {
    startVideoTexture();
  } else {
    video.addEventListener("loadeddata", startVideoTexture, { once: true });
  }

  // 자동재생 시도
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      console.warn(`비디오 자동재생 대기 중 (${elementId}):`, err);
      video.addEventListener("playing", startVideoTexture, { once: true });
    });
  }
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

function updateHUD(idx) {
  const p = projects[idx];
  document.getElementById("curr-num").textContent = p.num;
  document.getElementById("project-title").textContent = p.title;
  document.getElementById("project-subtitle").textContent = p.sub;
  document.getElementById("project-desc").textContent = p.desc;
  document.getElementById("hud-coord").textContent = p.coord;
  document.getElementById("hud-orbit").textContent = p.orbit;
  document.getElementById("mission-status").textContent = p.status;
}

// 윈도우 리사이즈
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 렌더링 루프
function render() {
  requestAnimationFrame(render);
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

// 사용자 첫 상호작용(클릭, 스크롤, 터치) 시 비디오 강제 언락 및 텍스처 재생
function unlockVideos() {
  const vids = document.querySelectorAll("video");
  vids.forEach(v => {
    v.play().then(() => {
      if (v.id === "video-slide-1") loadRealVideo(0, "video-slide-1");
      if (v.id === "video-slide-2") loadRealVideo(1, "video-slide-2");
      if (v.id === "video-slide-3") loadRealVideo(2, "video-slide-3");
      if (v.id === "video-slide-4") loadRealVideo(3, "video-slide-4");
    }).catch(() => { });
  });
  window.removeEventListener("pointerdown", unlockVideos);
  window.removeEventListener("wheel", unlockVideos);
  window.removeEventListener("touchstart", unlockVideos);
}

window.addEventListener("pointerdown", unlockVideos);
window.addEventListener("wheel", unlockVideos);
window.addEventListener("touchstart", unlockVideos);

// 실제 에셋 로딩 시작
loadRealVideo(0, "video-slide-1");
loadRealVideo(1, "video-slide-2"); // Dron01.mp4 비디오 텍스처 로딩
loadRealVideo(2, "video-slide-3");
loadRealVideo(3, "video-slide-4"); // satellite_space.mp4 비디오 텍스처 로딩
loadRealImage(4, "img/setellite04.jpg");

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