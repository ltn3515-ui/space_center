/**
 * 테마 스왑 함수 (일반 관제 모드 ↔ 키즈 모드)
 */
function switchTheme(targetTheme) {
  const body = document.body;
  const proView = document.getElementById('view-pro');
  const kidsView = document.getElementById('view-kids');
  const warpOverlay = document.getElementById('warpOverlay');

  if (warpOverlay) {
    // 1. [0.00s] 즉시 워프 오버레이 활성화 (블러 및 속도선 연출)
    warpOverlay.classList.add('warping');

    // 2. [0.15s] 워프 정점 단계에서 테마 및 뷰 스왑 실행, 최상단 스크롤 리셋
    setTimeout(() => {
      if (targetTheme === 'kids') {
        if (proView) proView.classList.remove('active');
        body.classList.remove('theme-default');
        body.classList.add('theme-kids');
        if (kidsView) kidsView.classList.add('active');
      } else if (targetTheme === 'pro') {
        if (kidsView) kidsView.classList.remove('active');
        body.classList.remove('theme-kids');
        body.classList.add('theme-default');
        if (proView) proView.classList.add('active');
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 150);

    // 3. [0.35s] 오버레이 비활성화 (페이드아웃 시작)
    setTimeout(() => {
      warpOverlay.classList.remove('warping');
    }, 350);
  } else {
    // 폴백 코드 (오버레이가 존재하지 않는 경우)
    if (targetTheme === 'kids') {
      if (proView) proView.classList.remove('active');
      body.classList.remove('theme-default');
      body.classList.add('theme-kids');
      if (kidsView) kidsView.classList.add('active');
    } else if (targetTheme === 'pro') {
      if (kidsView) kidsView.classList.remove('active');
      body.classList.remove('theme-kids');
      body.classList.add('theme-default');
      if (proView) proView.classList.add('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

let installedPartsCount = 0;
const installedPartsMap = {
  booster: false,
  tank: false,
  payload: false,
  fairing: false
};

/**
 * 키즈 모드 3D 로켓 연구소 부품 선택 & 결합 인터랙션
 */
function addRocketPart(partType, btnEl) {
  if (installedPartsMap[partType]) return;

  // 조립 순서 검증 (부스터 -> 연료탱크 -> 페이로드 -> 페어링)
  const correctOrder = ['booster', 'tank', 'payload', 'fairing'];
  const expectedPart = correctOrder[installedPartsCount];

  if (partType !== expectedPart) {
    showKidsAlertModal(
      "조립 순서가 맞지 않아요! 💡",
      "로켓은 아래에서부터 차례대로 쌓아 올려야 튼튼하게 결합돼요!<br><br><b>부스터 (하단) ➔ 연료 탱크 ➔ 페이로드 ➔ 페어링 (상단)</b><br>순서대로 다시 조립해 볼까요?"
    );
    return;
  }

  const targetSlot = document.getElementById(`slot-${partType}`);
  const statusText = document.getElementById('stageStatusText');
  const progressBadge = document.getElementById('buildProgressBadge');
  const doneBtn = document.getElementById('buildDoneBtn');

  if (targetSlot) {
    installedPartsMap[partType] = true;
    installedPartsCount++;

    // 슬롯 결합 스냅인 애니메이션
    targetSlot.classList.remove('empty');
    targetSlot.classList.add('installed');

    // 버튼 장착 완료 상태 전환
    if (btnEl) {
      btnEl.classList.add('installed');
      btnEl.disabled = true;
      btnEl.innerHTML = `<span class="part-icon">✓</span> 장착 완료!`;
    }

    // 진행률 뱃지 업데이트
    if (progressBadge) {
      progressBadge.textContent = `조립 진행률: ${installedPartsCount} / 4`;
    }

    const partNames = {
      fairing: '헤드 페어링 (파사포트 Y)',
      payload: '위성 페이로드 X',
      tank: '연료 탱크 A',
      booster: '부스터 1 엔진'
    };

    if (statusText) {
      statusText.innerHTML = `✨ [${partNames[partType]}] 결합 완료! (${installedPartsCount}/4)`;
      statusText.style.color = '#00cec9';
    }

    // 4개 부품 모두 결합 완료 시! (💥 펑! 변신 파티클 폭발 후 로켓으로 합체되어 발사!)
    if (installedPartsCount === 4) {
      const slotsWrapper = document.getElementById('partsSlotsWrapper');
      const powOverlay = document.getElementById('powExplosionOverlay');
      const superRocket = document.getElementById('superMasterRocket');

      if (doneBtn) {
        doneBtn.classList.add('ready');
        doneBtn.innerHTML = '✨ 로켓 변신 완료! 우주 발사! 🚀';
      }

      if (statusText) {
        statusText.innerHTML = '💥 펑! 부품들이 하나로 합쳐져 멋진 3D 로켓으로 변신했습니다!';
        statusText.style.color = '#ff7675';
      }

      // 1. POW 이펙트 폭발 & 부품 합체 변신
      if (powOverlay) powOverlay.classList.add('pow-burst');
      if (slotsWrapper) slotsWrapper.classList.add('hidden-fused');
      if (superRocket) superRocket.classList.add('transformed');

      // 2. 0.6초 후 수직 상공 발사 애니메이션 시작!
      setTimeout(() => {
        launchAssembledRocketUpward();
      }, 600);
    }
  }
}

/**
 * 로켓 조립 완성 후 수직 상승 발사 애니메이션 (Upward Launch Sequence)
 */
function launchAssembledRocketUpward() {
  const tower = document.getElementById('assembledTower');
  const statusText = document.getElementById('stageStatusText');
  const doneBtn = document.getElementById('buildDoneBtn');
  const toast = document.getElementById('launchToastBanner');
  const slotsWrapper = document.getElementById('partsSlotsWrapper');
  const powOverlay = document.getElementById('powExplosionOverlay');
  const superRocket = document.getElementById('superMasterRocket');

  if (!tower || tower.classList.contains('blasting-off')) return;

  // 1. 엔진 화염 및 진동 카운트다운 (0.5s Vibration Shake)
  tower.classList.add('shaking-launch');
  if (statusText) {
    statusText.innerHTML = '🔥 3.. 2.. 1.. 엔진 점화! 우주로 무사히 발사!';
    statusText.style.color = '#e17055';
  }

  setTimeout(() => {
    // 2. 수직 상공 쾌속 비행 발사 (Blasting Off Upward Out of View)
    tower.classList.remove('shaking-launch');
    tower.classList.add('blasting-off');

    if (statusText) {
      statusText.innerHTML = '🚀 슝~! 3D 로켓이 우주 하늘 높이 솟구쳐 발사되었습니다!';
      statusText.style.color = '#00cec9';
    }

    // 3. 1.2초 후 축하 뱃지 모달 토스트 띄우기
    setTimeout(() => {
      if (toast) toast.classList.add('show');
    }, 1200);

    // 4. 3.7초 후 페이드아웃 시작 (탑에서 2.7초간 대기 후 0.5초간 투명화)
    setTimeout(() => {
      tower.style.transition = 'opacity 0.5s ease';
      tower.style.opacity = '0';
    }, 3700);

    // 5. 4.2초 후 자동 스테이지 리셋 (Replay Ready)
    setTimeout(() => {
      if (toast) toast.classList.remove('show');

      tower.style.transition = 'none';
      tower.classList.remove('blasting-off', 'complete-built', 'shaking-launch');
      tower.style.transform = 'none';
      tower.style.opacity = '0';

      if (slotsWrapper) slotsWrapper.classList.remove('hidden-fused');
      if (superRocket) superRocket.classList.remove('transformed');
      if (powOverlay) powOverlay.classList.remove('pow-burst');

      installedPartsCount = 0;
      Object.keys(installedPartsMap).forEach(k => installedPartsMap[k] = false);

      const slots = document.querySelectorAll('.rocket-part-block');
      slots.forEach(slot => {
        slot.classList.add('empty');
        slot.classList.remove('installed');
      });

      const btnConfig = [
        { id: 'btn-booster', icon: '🚀', text: '부스터 1 장착' },
        { id: 'btn-tank', icon: '⛽', text: '연료 탱크 A' },
        { id: 'btn-payload', icon: '📡', text: '페이로드 X' },
        { id: 'btn-fairing', icon: '🔺', text: '파사포트 Y' }
      ];

      btnConfig.forEach(item => {
        const btn = document.getElementById(item.id);
        if (btn) {
          btn.classList.remove('installed');
          btn.disabled = false;
          btn.innerHTML = `<span class="part-icon">${item.icon}</span> ${item.text}`;
        }
      });

      if (doneBtn) {
        doneBtn.classList.remove('ready');
        doneBtn.innerHTML = '조립 완료! 🚀';
      }

      const progressBadge = document.getElementById('buildProgressBadge');
      if (progressBadge) progressBadge.textContent = '조립 진행률: 0 / 4';

      if (statusText) {
        statusText.innerHTML = '부품을 터치해서 3D 로켓을 조립하세요!';
        statusText.style.color = '#0984e3';
      }

      setTimeout(() => {
        tower.style.transition = 'transform 1.0s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease';
        tower.style.opacity = '1';
      }, 60);

    }, 4200);

  }, 500);
}

/**
 * [조립 완료! 🚀] 버튼 클릭 수직 발사 트리거
 */
function finishRocketAssembly() {
  if (installedPartsCount < 4) {
    alert(`아직 로켓 부품이 남았어요! (${installedPartsCount}/4)\n4개 부품(부스터, 연료탱크, 페이로드, 파사포트)을 모두 결합해 주세요! 🚀`);
    return;
  }
  launchAssembledRocketUpward();
}

/**
 * GNB 메인 메뉴 하단 드롭다운 인터랙션 (한국항공우주연구원 스타일)
 */
document.addEventListener('DOMContentLoaded', () => {
  const proHeader = document.querySelector('.pro-header');
  const navLinks = document.querySelectorAll('.pro-nav a');
  const megaColumns = document.querySelectorAll('.mega-column');
  const megaPanel = document.querySelector('.mega-menu-panel');

  if (!proHeader || !megaPanel) return;

  let closeTimer = null;

  const openDropdown = () => {
    if (closeTimer) clearTimeout(closeTimer);
    proHeader.classList.add('is-dropdown-open');
  };

  const closeDropdown = () => {
    closeTimer = setTimeout(() => {
      proHeader.classList.remove('is-dropdown-open');
      navLinks.forEach(link => link.classList.remove('active'));
      megaColumns.forEach(col => col.classList.remove('highlighted'));
    }, 120);
  };

  // Header mouse enter / leave for overall dropdown visibility
  proHeader.addEventListener('mouseenter', openDropdown);
  proHeader.addEventListener('mouseleave', closeDropdown);

  // Link specific hover highlights
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      openDropdown();
      const menuIndex = link.getAttribute('data-menu');

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      megaColumns.forEach(col => {
        if (col.getAttribute('data-index') === menuIndex) {
          col.classList.add('highlighted');
        } else {
          col.classList.remove('highlighted');
        }
      });
    });
  });

  // Column specific hover highlights syncing back to main nav
  megaColumns.forEach(col => {
    col.addEventListener('mouseenter', () => {
      openDropdown();
      const colIndex = col.getAttribute('data-index');

      navLinks.forEach(link => {
        if (link.getAttribute('data-menu') === colIndex) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      megaColumns.forEach(c => c.classList.remove('highlighted'));
      col.classList.add('highlighted');
    });
  });
});

/**
 * 한국항공우주연구원(KARI) 메인 R&D 쇼케이스 캐러셀 제어
 */
const showcaseData = [
  {
    index: 1,
    titleKo: "발사체",
    titleEn: "Space Launch Vehicle",
    desc: "한국항공우주연구원은 KSR-I(1993), KSR-II(1998), KSR-III(2002)을 통해 로켓 설계 및 제작 능력을 확보하였으며, 러시아와 국제협력으로 나로호 개발에 성공하여 우주발사체 기술과 경험을 축적했다. 이를 토대로 1.5톤급 실용위성을 발사할 수 있는 3단형 한국형발사체 누리호를 독자 개발하여, 2027년까지 반복 발사와 기술 민간 이전을 추진할 계획이며, 2032년 달 착륙선을 발사할 차세대발사체를 개발중에 있다."
  },
  {
    index: 2,
    titleKo: "인공위성",
    titleEn: "Satellite System",
    desc: "다목적실용위성(아리랑) 시리즈, 정지궤도복합위성(천리안 1호, 2A/2B호), 차세대중형위성 및 초소형위성군을 독자 개발하여 국토 관리, 기상·해양·환경 관측 및 국가 안보 필수 정보를 24시간 실시간 제공하고 있습니다."
  },
  {
    index: 3,
    titleKo: "우주탐사",
    titleEn: "Deep Space Exploration",
    desc: "대한민국 최초의 달 궤도선 다누리(KPLO)를 성공적으로 달 궤도에 안착시켜 심우주 항법과 통신 기술을 세계적으로 검증받았으며, 2030년대 독자 달 착륙선 및 심우주 탐사선을 통한 우주 영토 확장에 나섭니다."
  },
  {
    index: 4,
    titleKo: "항공기 & AAM",
    titleEn: "Aviation Technology",
    desc: "친환경 전기추진 수직이착륙 비행체(OPPAV), 고고도 장기체류 성층권 무인기, 스마트 틸트로터 무인기 등 차세대 미래 항공 모빌리티 및 국가 미래 항공 산업 핵심 기술을 선도합니다."
  },
  {
    index: 5,
    titleKo: "위성항법",
    titleEn: "KPS Navigation System",
    desc: "한반도 및 주변 영역에 초정밀 위치·시각 정보를 24시간 끊김없이 제공하기 위한 한국형 위성항법시스템(KPS) 인프라 구축과 차세대 PNT 기술 자립화를 추진하고 있습니다."
  },
  {
    index: 6,
    titleKo: "기술사업화 & 인프라",
    titleEn: "Tech Transfer & Infra",
    desc: "국가종합비행성능시험장 및 나로우주센터 등 세계적 수준의 연구장비와 우주 인프라를 민간에 개방하고, 항공우주 핵심 특허 기술이전을 통해 국내 우주항공 산업 생태계 경쟁력을 강화합니다."
  }
];

let currentShowcaseIndex = 0;
let showcaseAutoPlayTimer = null;
let isShowcasePlaying = true;

/* 3D WebGL Three.js Photorealistic Space Simulator Variables */
let scene, camera, renderer, animationFrameId;
let earthMesh, atmosphereMesh, satelliteSprite, pingLine, pingPulseMesh, starParticles;
let antennaMesh, vesselMesh, aircraftMesh;
let is3DSceneInitialized = false;
let orbitTime = 0;

/**
 * 핀포인트 스타필드 파티클용 원형 Alpha 텍스처
 */
function createStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.35, 'rgba(56, 189, 248, 0.7)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(32, 32, 32, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

/**
 * Three.js WebGL 3D 씬 초기화 (실사 우주 시뮬레이터 수준)
 */
function initKPS3DScene() {
  const canvas = document.getElementById('kps-3d-canvas');
  const container = document.querySelector('.kari-showcase-section');
  if (!canvas || !container || typeof THREE === 'undefined') return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // 1. Scene, Camera & Renderer (Extreme Sharpness: window.devicePixelRatio)
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 11);

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio); // 4. 극대화된 선명도 (Sharpness)

  const textureLoader = new THREE.TextureLoader();

  // 조명 설정
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0x00f5d4, 1.3);
  sunLight.position.set(12, 10, 10);
  scene.add(sunLight);

  const blueLight = new THREE.PointLight(0x38bdf8, 1.6, 40);
  blueLight.position.set(-6, -4, 6);
  scene.add(blueLight);

  // 3. 심우주 배경 (Pinpoint Starfield - 3,000개 미세 3D 별빛 파티클)
  const starCount = 3000;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 90;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({
    size: 0.08,
    map: createStarTexture(),
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  starParticles = new THREE.Points(starGeo, starMat);
  scene.add(starParticles);

  // 1. 지구(Earth) 실사 텍스처 맵 매핑 ('img/earth02.jpg' 로드)
  const earthRadius = 3.6;
  const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
  const earthTexture = textureLoader.load('img/earth02.jpg');
  const earthMat = new THREE.MeshStandardMaterial({
    map: earthTexture,
    roughness: 0.8,
    metalness: 0.1
  });
  earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthMesh.position.set(-3.2, -2.2, -1.0);
  earthMesh.rotation.x = 0.35;
  scene.add(earthMesh);

  // 지구 외곽 은은한 사이언 블루(#00F5D4) 대기광 림 라이트 (Atmosphere Glow)
  const atmosGeo = new THREE.SphereGeometry(earthRadius * 1.04, 64, 64);
  const atmosMat = new THREE.MeshBasicMaterial({
    color: 0x00f5d4,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending
  });
  atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
  earthMesh.add(atmosphereMesh);

  // 3. 궤도선 (매끄러운 3D 타원 곡선: LineBasicMaterial, color: #00F5D4, opacity: 0.35)
  const ellipseCurveMain = new THREE.EllipseCurve(-1.5, -0.8, 5.6, 3.4, 0, 2 * Math.PI, false, 0);
  const mainPoints = ellipseCurveMain.getPoints(160);
  const mainOrbitGeo = new THREE.BufferGeometry().setFromPoints(mainPoints.map(p => new THREE.Vector3(p.x, p.y, 0)));
  const mainOrbitMat = new THREE.LineBasicMaterial({
    color: 0x00f5d4,
    transparent: true,
    opacity: 0.35
  });
  const mainOrbitLine = new THREE.Line(mainOrbitGeo, mainOrbitMat);
  mainOrbitLine.rotation.x = Math.PI / 4;
  mainOrbitLine.rotation.y = -Math.PI / 8;
  scene.add(mainOrbitLine);

  // 2. 인공위성 렌더링 방식 전면 교체 (THREE.Sprite & THREE.SpriteMaterial 빌보딩)
  const satTexture = textureLoader.load('img/satellite.png');
  const satSpriteMat = new THREE.SpriteMaterial({
    map: satTexture,
    transparent: true,
    depthWrite: false
  });
  satelliteSprite = new THREE.Sprite(satSpriteMat);
  satelliteSprite.scale.set(1.4, 1.4, 1);
  scene.add(satelliteSprite);

  // 지상국 & 모빌리티 네온 와이어프레임 아이콘 (안테나, 선박, 항공기)
  const antennaGeo = new THREE.ConeGeometry(0.14, 0.25, 6);
  const antennaMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4, wireframe: true });
  antennaMesh = new THREE.Mesh(antennaGeo, antennaMat);
  antennaMesh.position.set(-1.8, -0.6, 1.8);
  scene.add(antennaMesh);

  const vesselGeo = new THREE.BoxGeometry(0.2, 0.08, 0.1);
  const vesselMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
  vesselMesh = new THREE.Mesh(vesselGeo, vesselMat);
  vesselMesh.position.set(-0.8, -2.4, 2.2);
  scene.add(vesselMesh);

  const aircraftGeo = new THREE.ConeGeometry(0.12, 0.3, 4);
  const aircraftMat = new THREE.MeshBasicMaterial({ color: 0xffb703, wireframe: true });
  aircraftMesh = new THREE.Mesh(aircraftGeo, aircraftMat);
  aircraftMesh.position.set(-3.5, 0.4, 2.0);
  aircraftMesh.rotation.z = -Math.PI / 4;
  scene.add(aircraftMesh);

  // 3. 한반도 지상국 ↔ 위성 점선 통신 핑(Ping Line) 애니메이션
  const pingLineGeo = new THREE.BufferGeometry();
  const pingLineMat = new THREE.LineDashedMaterial({
    color: 0x00f5d4,
    dashSize: 0.25,
    gapSize: 0.15,
    transparent: true,
    opacity: 0.8
  });
  pingLine = new THREE.Line(pingLineGeo, pingLineMat);
  scene.add(pingLine);

  // 펄스 이동 파티클 구체
  const pulseGeo = new THREE.SphereGeometry(0.09, 16, 16);
  const pulseMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4 });
  pingPulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
  scene.add(pingPulseMesh);

  // 렌더링 애니메이션 루프
  let pulseProgress = 0;

  function renderLoop() {
    animationFrameId = requestAnimationFrame(renderLoop);

    // 1. 지구 자전 (Y축 rotation.y += 0.001)
    if (earthMesh) {
      earthMesh.rotation.y += 0.001;
    }

    // 핀포인트 우주 별자리 미동
    if (starParticles) {
      starParticles.rotation.y += 0.0002;
    }

    // 2. 궤도를 따라 이동하는 위성 위치 & 원근감 원근 scale 조절
    orbitTime += 0.0042;
    const t = (orbitTime % (2 * Math.PI));
    const pointOnCurve = ellipseCurveMain.getPoint(t / (2 * Math.PI));

    const satPos = new THREE.Vector3(pointOnCurve.x, pointOnCurve.y, 0);
    satPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 4);
    satPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 8);

    if (satelliteSprite) {
      satelliteSprite.position.copy(satPos);
      // 원근감(Perspective Distance)에 따른 자율 Scale 조절
      const perspectiveScale = 1.35 + (satPos.z * 0.14);
      satelliteSprite.scale.set(perspectiveScale, perspectiveScale, 1);
    }

    // 3. 지상국 좌표 ↔ 위성 점선 통신 핑 연동
    const koreaBasePos = new THREE.Vector3(-1.8, -0.6, 1.8);

    if (pingLine && satelliteSprite) {
      const positions = new Float32Array([
        koreaBasePos.x, koreaBasePos.y, koreaBasePos.z,
        satelliteSprite.position.x, satelliteSprite.position.y, satelliteSprite.position.z
      ]);
      pingLine.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      pingLine.geometry.attributes.position.needsUpdate = true;
    }

    // 펄스 이동 파티클
    pulseProgress = (pulseProgress + 0.016) % 1;
    if (pingPulseMesh && satelliteSprite) {
      pingPulseMesh.position.lerpVectors(koreaBasePos, satelliteSprite.position, pulseProgress);
    }

    renderer.render(scene, camera);
  }

  renderLoop();
  is3DSceneInitialized = true;

  window.addEventListener('resize', handleResize);
}

function handleResize() {
  const container = document.querySelector('.kari-showcase-section');
  if (!container || !renderer || !camera) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function updateShowcaseUI(index) {
  const slides = document.querySelectorAll('.showcase-slide');
  const counterEl = document.getElementById('showcaseCurIndex');
  const hudContentEl = document.getElementById('hudCardContent');
  const showcaseSec = document.querySelector('.kari-showcase-section');

  if (!slides.length || !hudContentEl) return;

  slides.forEach((s, idx) => {
    if (idx === index) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });

  if (counterEl) {
    counterEl.textContent = index + 1;
  }

  // 3D/시네마틱 씬 전환 연동 (위성항법 Slide 5: index 4)
  if (showcaseSec) {
    if (index === 4) { // 위성항법 KPS
      showcaseSec.classList.add('mode-3d');
      const cinematicVid = document.getElementById('kps-cinematic-video');
      if (cinematicVid) {
        cinematicVid.currentTime = 0;
        cinematicVid.play().catch(e => console.log('Autoplay prevented:', e));
      }
    } else {
      showcaseSec.classList.remove('mode-3d');
    }
  }

  const data = showcaseData[index];
  if (data) {
    hudContentEl.style.opacity = '0';
    setTimeout(() => {
      hudContentEl.innerHTML = `
        <h3 class="hud-title">
          <span class="hud-ko">${data.titleKo}</span>
          <span class="hud-en">${data.titleEn}</span>
        </h3>
        <p class="hud-desc">${data.desc}</p>
      `;
      hudContentEl.style.opacity = '1';
    }, 150);
  }
}

function moveShowcaseSlide(direction) {
  currentShowcaseIndex = (currentShowcaseIndex + direction + showcaseData.length) % showcaseData.length;
  updateShowcaseUI(currentShowcaseIndex);
  resetShowcaseAutoPlay();
}

function toggleShowcaseAutoPlay() {
  const btn = document.getElementById('showcasePlayPauseBtn');
  if (isShowcasePlaying) {
    if (showcaseAutoPlayTimer) clearInterval(showcaseAutoPlayTimer);
    isShowcasePlaying = false;
    if (btn) btn.textContent = '▶';
  } else {
    startShowcaseAutoPlay();
    isShowcasePlaying = true;
    if (btn) btn.textContent = '||';
  }
}

function startShowcaseAutoPlay() {
  if (showcaseAutoPlayTimer) clearInterval(showcaseAutoPlayTimer);
  showcaseAutoPlayTimer = setInterval(() => {
    moveShowcaseSlide(1);
  }, 5000);
}

function resetShowcaseAutoPlay() {
  if (isShowcasePlaying) {
    startShowcaseAutoPlay();
  }
}

// Auto banner scroll logic
let bannerInterval = null;
let isBannerPlaying = true;

function initBannerSlider() {
  const track = document.querySelector('.banner-track');
  const btnPrev = document.querySelector('.banner-ctrl-btn.btn-prev');
  const btnNext = document.querySelector('.banner-ctrl-btn.btn-next');
  const btnPlay = document.querySelector('.banner-ctrl-btn.btn-play-pause');
  
  if (!track) return;
  
  // Clone original items to prevent empty gaps and ensure continuous loop
  const originalItems = Array.from(track.children);
  if (originalItems.length === 0) return;
  
  // Clear and replicate 5 times (enough to fill any desktop screen)
  track.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    originalItems.forEach(item => {
      track.appendChild(item.cloneNode(true));
    });
  }
  
  let isTransitioning = false;
  
  function getItemWidth(item) {
    const trackStyle = window.getComputedStyle(track);
    const gap = parseInt(trackStyle.gap) || 40;
    return item.offsetWidth + gap;
  }
  
  function moveNext() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    track.style.transition = 'transform 0.4s ease-in-out';
    const firstItem = track.firstElementChild;
    if (!firstItem) {
      isTransitioning = false;
      return;
    }
    const itemWidth = getItemWidth(firstItem);
    track.style.transform = `translateX(-${itemWidth}px)`;
    
    track.addEventListener('transitionend', function onTransitionEnd() {
      track.style.transition = 'none';
      track.appendChild(firstItem);
      track.style.transform = 'translateX(0)';
      isTransitioning = false;
      track.removeEventListener('transitionend', onTransitionEnd);
    }, { once: true });
  }
  
  function movePrev() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    track.style.transition = 'none';
    const lastItem = track.lastElementChild;
    if (!lastItem) {
      isTransitioning = false;
      return;
    }
    const itemWidth = getItemWidth(lastItem);
    track.insertBefore(lastItem, track.firstElementChild);
    track.style.transform = `translateX(-${itemWidth}px)`;
    
    // Trigger layout reflow
    track.offsetHeight;
    
    track.style.transition = 'transform 0.4s ease-in-out';
    track.style.transform = 'translateX(0)';
    
    track.addEventListener('transitionend', function onTransitionEnd() {
      isTransitioning = false;
      track.removeEventListener('transitionend', onTransitionEnd);
    }, { once: true });
  }
  
  function startAuto() {
    if (bannerInterval) clearInterval(bannerInterval);
    bannerInterval = setInterval(moveNext, 3000);
  }
  
  function stopAuto() {
    if (bannerInterval) clearInterval(bannerInterval);
  }
  
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      moveNext();
      if (isBannerPlaying) {
        startAuto();
      }
    });
  }
  
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      movePrev();
      if (isBannerPlaying) {
        startAuto();
      }
    });
  }
  
  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      if (isBannerPlaying) {
        stopAuto();
        isBannerPlaying = false;
        btnPlay.textContent = '▶';
        btnPlay.setAttribute('aria-label', '재생');
      } else {
        isBannerPlaying = true;
        startAuto();
        btnPlay.textContent = '⏸';
        btnPlay.setAttribute('aria-label', '정지');
      }
    });
  }
  
  if (isBannerPlaying) {
    startAuto();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  startShowcaseAutoPlay();
  initBannerSlider();
});

/**
 * 키즈 모드 히어로 섹션 '출발하기 🚀' 발사 인터랙션 (Launch Sequence)
 */
function launchKidsRocket() {
  const btn = document.getElementById('kidsLaunchBtn');
  const rocketWrapper = document.getElementById('kidsRocketWrapper');
  const heroFrame = document.getElementById('kidsHeroFrame');
  const storySection = document.getElementById('kidsStorySection');

  if (!rocketWrapper || rocketWrapper.classList.contains('launching')) return;

  // 1. 버튼 누름 효과 (Click Bounce)
  if (btn) {
    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 350);
  }

  // 1-2. 로켓 카운트다운 진동 (Shake 0.5s)
  rocketWrapper.classList.add('shaking');

  setTimeout(() => {
    // 2. 발사 비행 애니메이션 (Fly Off Screen to Top-Right)
    rocketWrapper.classList.remove('shaking');
    rocketWrapper.classList.add('launching');
    if (heroFrame) heroFrame.classList.add('launching');

    // 3. 콘텐츠 뷰 자동 스크롤 (0.8초 딜레이 후 #kidsStorySection 스크롤)
    setTimeout(() => {
      if (storySection) {
        storySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 800);

    // 4. 2.0초 후 페이드아웃 시작 (탑에서 1.0초간 대기 후 0.5초간 투명화)
    setTimeout(() => {
      rocketWrapper.style.transition = 'opacity 0.5s ease';
      rocketWrapper.style.opacity = '0';
    }, 2000);

    // 5. 로켓 원래 위치로 부드럽게 페이드인 복귀 (Reset after 2.5s)
    setTimeout(() => {
      rocketWrapper.style.transition = 'none';
      rocketWrapper.classList.remove('launching');
      if (heroFrame) heroFrame.classList.remove('launching');

      setTimeout(() => {
        rocketWrapper.style.transition = 'transform 1.0s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease';
        rocketWrapper.style.opacity = '1';
      }, 60);
    }, 2500);

  }, 500);
}

// Custom SF HUD Target Cursor Interaction
document.addEventListener('DOMContentLoaded', () => {
  const dot = document.getElementById('hudCursorDot');
  const ring = document.getElementById('hudCursorRing');

  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let isMouseMoved = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isMouseMoved) {
      isMouseMoved = true;
      dot.style.display = 'block';
      ring.style.display = 'flex';
    }

    // Move the dot instantly (hardware accelerated transform)
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate3d(-50%, -50%, 0)`;
  });

  // Smooth lag for the outer ring using requestAnimationFrame
  function animateRing() {
    // Linear interpolation (lerp) for smooth lag trailing effect
    const dx = mouseX - ringX;
    const dy = mouseY - ringY;
    ringX += dx * 0.15;
    ringY += dy * 0.15;

    const isHovered = ring.classList.contains('hovered');
    const scale = isHovered ? 1.5 : 1.0;
    
    // Slow circular rotation speed (time-based)
    const angle = (Date.now() / 16) % 360;

    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate3d(-50%, -50%, 0) scale(${scale}) rotate(${angle}deg)`;

    requestAnimationFrame(animateRing);
  }
  requestAnimationFrame(animateRing);

  // Global hover listener to scale outer ring on interactive elements
  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    // Hover targeting links, buttons, selects, bento sub cards, custom control buttons, or clickable pills
    const isInteractive = target.closest('a, button, select, .bento-sub-card, .clickable, .showcase-ctrl-btn, .banner-ctrl-btn, [role="button"]');
    if (isInteractive) {
      ring.classList.add('hovered');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target;
    const isInteractive = target.closest('a, button, select, .bento-sub-card, .clickable, .showcase-ctrl-btn, .banner-ctrl-btn, [role="button"]');
    if (isInteractive) {
      ring.classList.remove('hovered');
    }
  });
});

/**
 * 키즈 모드 전용 경고 모달 창 동적 생성 및 표시
 */
function showKidsAlertModal(title, message) {
  let overlay = document.getElementById('kidsAlertModal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'kidsAlertModal';
    overlay.className = 'kids-modal-overlay';
    
    const box = document.createElement('div');
    box.className = 'kids-modal-box';
    
    const emoji = document.createElement('span');
    emoji.className = 'kids-modal-emoji';
    emoji.textContent = '⚠️';
    
    const titleEl = document.createElement('h4');
    titleEl.className = 'kids-modal-title';
    titleEl.id = 'kidsModalTitle';
    
    const descEl = document.createElement('p');
    descEl.className = 'kids-modal-desc';
    descEl.id = 'kidsModalDesc';
    
    const btn = document.createElement('button');
    btn.className = 'kids-modal-btn';
    btn.textContent = '다시 조립해 볼래요! 🛠️';
    btn.addEventListener('click', () => {
      overlay.classList.remove('show');
    });
    
    box.appendChild(emoji);
    box.appendChild(titleEl);
    box.appendChild(descEl);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }
  
  // 텍스트 매핑
  document.getElementById('kidsModalTitle').textContent = title;
  document.getElementById('kidsModalDesc').innerHTML = message;
  
  // 지연 후 모달 활성화 애니메이션 작동
  setTimeout(() => {
    overlay.classList.add('show');
  }, 20);
}

/**
 * GSAP ScrollTrigger 메인 섹션 누리호 비디오 연속 반복 재생 & 핀(pin: true) 스크롤 확대 연출
 */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const heroSection = document.querySelector('.pro-hero');
    const heroVideo = document.querySelector('#heroNurihoVideo') || document.querySelector('.hero-bg-video');
    const heroContent = document.querySelector('.hero-content');

    if (heroSection && heroVideo) {
      // 1. 동영상 무한 연속 반복 재생 (Continuous Loop Playback)
      heroVideo.muted = true;
      heroVideo.loop = true;
      heroVideo.playsInline = true;

      const startVideoLoop = () => {
        heroVideo.muted = true;
        heroVideo.play().catch(err => {
          console.log("Autoplay unblock attempt:", err);
        });
      };
      startVideoLoop();
      document.addEventListener('click', startVideoLoop, { once: true });
      document.addEventListener('scroll', startVideoLoop, { once: true });
      document.addEventListener('touchstart', startVideoLoop, { once: true });

      // 2. GSAP ScrollTrigger Pin & Scrub Zoom 애니메이션 (동영상 연속 재생 중 스크롤 시 화면 확대)
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: true, // 스크롤 양에 맞춰 화면 확대
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      // 스크롤 양에 맞춰 연속 재생 중인 비디오 화면 확대 (scale 1.0 -> 1.85)
      heroTl.to(heroVideo, {
        scale: 1.85,
        ease: 'none',
      }, 0);

      // 메인 히어로 텍스트 카드 시각적 연출 (페이드 & 미세 상승)
      if (heroContent) {
        heroTl.to(heroContent, {
          opacity: 0.25,
          y: -40,
          scale: 0.95,
          ease: 'none',
        }, 0);
      }
    }
  }
});

/**
 * 누리호 3D 가상 발사 시뮬레이션 모달 열기 & 스크롤-스크러빙(Scroll Scrubbing) 프레임 제어
 */
function openNurihoSimModal() {
  const modal = document.getElementById('nurihoSimModal');
  const video = document.getElementById('modalNurihoVideo');
  const scrollBody = document.getElementById('nurihoModalScrollBody');
  const scrubTrack = document.getElementById('scrubProgressTrack');

  if (!modal || !video || !scrollBody) return;

  // 1. 모달 활성화 및 바디 스크롤 락
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  scrollBody.scrollTop = 0;

  // 2. 비디오 준비 및 디코더 락 해제 (Audio Muted & Prime)
  video.muted = true;
  video.pause();
  video.play().then(() => {
    video.pause();
    updateModalScrub();
  }).catch(() => {});

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00.00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  const updateModalScrub = () => {
    const maxScroll = scrollBody.scrollHeight - scrollBody.clientHeight;
    if (maxScroll <= 0) return;

    const progress = Math.max(0, Math.min(1, scrollBody.scrollTop / maxScroll));
    const duration = video.duration || 10;

    // 프레임 단위 비디오 타임 실시간 제어
    if (video.duration && !isNaN(video.duration)) {
      video.currentTime = progress * duration;
    }

    // 프로그레스 바 & 타임 텍스트 업데이트
    const fill = document.getElementById('scrubProgressFill');
    if (fill) fill.style.width = (progress * 100) + '%';

    const curTimeEl = document.getElementById('scrubTimeCur');
    const totalTimeEl = document.getElementById('scrubTimeTotal');
    if (curTimeEl) curTimeEl.textContent = formatTime(progress * duration);
    if (totalTimeEl) totalTimeEl.textContent = formatTime(duration);

    // 텔레메트리 HUD 실시간 연동 (고도, 속도, 비행단계)
    const altEl = document.getElementById('nurihoAltVal');
    const velEl = document.getElementById('nurihoVelVal');
    const stageEl = document.getElementById('nurihoStageVal');

    if (altEl) altEl.textContent = (progress * 700).toFixed(1) + ' KM';
    if (velEl) velEl.textContent = (progress * 7.5).toFixed(2) + ' KM/S';

    if (stageEl) {
      if (progress < 0.25) {
        stageEl.textContent = "1단 클러스터링 엔진 점화 및 대기권 상승";
        stageEl.className = "val cyan";
      } else if (progress < 0.45) {
        stageEl.textContent = "1단 분리 & 2단 엔진 점화 (고도 60km)";
        stageEl.className = "val sky";
      } else if (progress < 0.65) {
        stageEl.textContent = "위성 페어링 분리 & 음속 돌파";
        stageEl.className = "val green";
      } else if (progress < 0.85) {
        stageEl.textContent = "2단 분리 & 3단 엔진 점화 (우주 궤도 진입)";
        stageEl.className = "val sky";
      } else {
        stageEl.textContent = "차세대 소형위성 2호 궤도 사출 완수 ✨";
        stageEl.className = "val cyan";
      }
    }
  };

  // 모달 영역 내 마우스 휠 스크롤 감지 및 프레임 스크러빙 1:1 연동 (세밀한 스크럽 구간 확대)
  modal.onwheel = (e) => {
    e.preventDefault();
    scrollBody.scrollTop += e.deltaY * 0.7;
    updateModalScrub();
  };

  // 스크롤 바 직접 탐색 시 이벤트 연결
  scrollBody.onscroll = updateModalScrub;

  // 프로그레스 트랙 직접 클릭 시 해당 프레임으로 가속 이동
  if (scrubTrack) {
    scrubTrack.onclick = (e) => {
      const rect = scrubTrack.getBoundingClientRect();
      const clickRatio = (e.clientX - rect.left) / rect.width;
      const maxScroll = scrollBody.scrollHeight - scrollBody.clientHeight;
      scrollBody.scrollTop = clickRatio * maxScroll;
      updateModalScrub();
    };
  }

  // 초기 1회 프레임 업데이트
  if (video.readyState >= 1) {
    updateModalScrub();
  } else {
    video.onloadedmetadata = updateModalScrub;
  }
}

/**
 * 누리호 3D 가상 발사 시뮬레이션 모달 닫기
 */
function closeNurihoSimModal() {
  const modal = document.getElementById('nurihoSimModal');
  const video = document.getElementById('modalNurihoVideo');

  if (modal) {
    modal.classList.remove('active');
    modal.onwheel = null;
  }
  if (video) video.pause();
  document.body.style.overflow = '';
}

// 전역 window 객체 노출 (HTML onclick 핸들러 접근성 보장)
window.openNurihoSimModal = openNurihoSimModal;
window.closeNurihoSimModal = closeNurihoSimModal;

// DOM 로드 완료 후 버튼 클릭 이벤트 리스너 자동바인딩
document.addEventListener('DOMContentLoaded', () => {
  const ctaBtns = document.querySelectorAll('.pro-cta-btn');
  ctaBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openNurihoSimModal();
    });
  });
});

// ESC 키 입력 시 모달 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeNurihoSimModal();
  }
});