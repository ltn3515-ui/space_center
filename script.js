// ==========================================
// Magic UI Style Number Ticker Intro Animation
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('introPreloader');
  const numberTicker = document.getElementById('numberTicker');
  const progressFill = document.getElementById('introProgressFill');
  const statusText = document.getElementById('introStatusText');

  // 상태 메시지 배열
  const statusLogs = [
    "ESTABLISHING GROUND STATION LINK...",
    "CALIBRATING ORBITAL TELEMETRY...",
    "INITIALIZING 3D SATELLITE ENGINE...",
    "SYSTEM CHECK: ALL NOMINAL",
    "READY FOR MISSION CONTROL"
  ];

  // GSAP을 이용한 0 -> 100 부드러운 카운팅
  const tickerObj = { val: 0 };

  gsap.to(tickerObj, {
    val: 100,
    duration: 2.2, // 카운팅 시간 (2.2초)
    ease: "power2.out",
    onUpdate: () => {
      const currentVal = Math.floor(tickerObj.val);
      numberTicker.innerText = currentVal;
      progressFill.style.width = currentVal + "%";

      // 진행률에 따라 상태 메시지 변경
      if (currentVal < 25) {
        statusText.innerText = statusLogs[0];
      } else if (currentVal < 50) {
        statusText.innerText = statusLogs[1];
      } else if (currentVal < 75) {
        statusText.innerText = statusLogs[2];
      } else if (currentVal < 100) {
        statusText.innerText = statusLogs[3];
      } else {
        statusText.innerText = statusLogs[4];
      }
    },
    onComplete: () => {
      // 100% 완료 후 0.3초 대기 후 페이드아웃
      setTimeout(() => {
        gsap.to(preloader, {
          opacity: 0,
          scale: 1.05,
          duration: 0.8,
          ease: "power3.inOut",
          onComplete: () => {
            preloader.classList.add('loaded');
            // 메인 화면 히어로 텍스트 및 비디오 등장 애니메이션 트리거
            if (typeof gsap !== 'undefined') {
              gsap.from(".hero-content > *", {
                y: 30,
                opacity: 0,
                stagger: 0.15,
                duration: 1,
                ease: "power3.out"
              });
            }
          }
        });
      }, 300);
    }
  });
});
/**
 * 테마 스왑 함수 (일반 관제 모드 ↔ 키즈 모드)
 * 웜홀 워프 스타버스트 캔버스 애니메이션 및 카운트다운 적용
 */
let starburstEngine = null;

function switchTheme(targetTheme) {
  const body = document.body;
  const proView = document.getElementById('view-pro');
  const kidsView = document.getElementById('view-kids');
  const overlay = document.getElementById('modeTransitionOverlay');
  const canvas = document.getElementById('warpCanvas');
  const flash = document.getElementById('transFlashEffect');
  const subTitle = document.getElementById('transStatusSub');
  const mainTitle = document.getElementById('transStatusMain');
  const countdown = document.getElementById('transCountdown');

  if (overlay && canvas && flash) {
    // 1. 오버레이 활성화 및 텍스트 셋팅
    overlay.classList.add('active');
    flash.classList.remove('flash');

    if (targetTheme === 'kids') {
      subTitle.innerText = "SYSTEM WARP INITIATED";
      mainTitle.innerText = "🚀 신나는 KARI 키즈 행성으로 도약 중!";
    } else {
      subTitle.innerText = "TELEMETRY RETRIEVAL IN PROGRESS";
      mainTitle.innerText = "🛰️ KARI 미션 관제실 시스템 복귀 중...";
    }

    // 2. 스타버스트 워프 캔버스 구동
    if (starburstEngine) starburstEngine.stop();
    starburstEngine = runWarpStarburst(canvas);

    // 3. HUD 카운트다운 연출 (3 -> 2 -> 1 -> WARP SPEED!)
    countdown.innerText = "WARP IN 3";
    
    setTimeout(() => {
      countdown.innerText = "WARP IN 2";
    }, 400);

    setTimeout(() => {
      countdown.innerText = "WARP IN 1";
    }, 800);

    // 4. [1.2초 시점] 스타버스트 최고조 도달 후 화이트 플래시 및 실제 모드 교체
    setTimeout(() => {
      countdown.innerText = "WARP SPEED!";
      flash.classList.add('flash'); // 화이트 플래시 애니메이션 구동

      // 실제 뷰 및 바디 클래스 스왑
      if (targetTheme === 'kids') {
        if (proView) proView.classList.remove('active');
        body.classList.remove('theme-default');
        body.classList.add('theme-kids');
        body.classList.add('kids-mode'); // 키즈 테마 클래스 결합
        if (kidsView) kidsView.classList.add('active');
      } else {
        if (kidsView) kidsView.classList.remove('active');
        body.classList.remove('theme-kids');
        body.classList.remove('kids-mode');
        body.classList.add('theme-default');
        if (proView) proView.classList.add('active');
      }

      updateChatbotTheme(targetTheme); // 챗봇 아바타/UI 교체
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 1200);

    // 5. [1.5초 시점] 오버레이 페이드아웃 및 웜홀 리소스 정리
    setTimeout(() => {
      overlay.classList.remove('active');
      if (starburstEngine) {
        starburstEngine.stop();
        starburstEngine = null;
      }
    }, 1500);

  } else {
    // 폴백 코드 (오버레이가 존재하지 않는 경우 즉시 스왑)
    if (targetTheme === 'kids') {
      if (proView) proView.classList.remove('active');
      body.classList.remove('theme-default');
      body.classList.add('theme-kids');
      body.classList.add('kids-mode');
      if (kidsView) kidsView.classList.add('active');
    } else {
      if (kidsView) kidsView.classList.remove('active');
      body.classList.remove('theme-kids');
      body.classList.remove('kids-mode');
      body.classList.add('theme-default');
      if (proView) proView.classList.add('active');
    }
    updateChatbotTheme(targetTheme);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * 웜홀 스타버스트 초공간 이동 캔버스 파티클 엔진
 */
function runWarpStarburst(canvasEl) {
  const ctx = canvasEl.getContext('2d');
  let w = canvasEl.width = window.innerWidth;
  let h = canvasEl.height = window.innerHeight;

  const stars = [];
  const numStars = 300;

  // 별빛 파티클 무작위 3D 공간 배치
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: (Math.random() - 0.5) * 1000,
      y: (Math.random() - 0.5) * 1000,
      z: Math.random() * 1000,
      color: `hsl(${Math.random() * 60 + 180}, 100%, 75%)` // 사이언/아쿠아 계열
    });
  }

  let warpSpeed = 3;
  let active = true;
  let animId = null;

  function draw() {
    if (!active) return;
    animId = requestAnimationFrame(draw);

    ctx.fillStyle = 'rgba(3, 5, 12, 0.15)'; // 잔상이 길게 남도록 꼬리 연출
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    for (let i = 0; i < numStars; i++) {
      const star = stars[i];
      star.z -= warpSpeed;

      // 앞질러 화면 밖으로 벗어난 별빛 리셋
      if (star.z <= 0) {
        star.z = 1000;
        star.x = (Math.random() - 0.5) * 1000;
        star.y = (Math.random() - 0.5) * 1000;
      }

      // 원점을 기준으로 뻗어나가는 3D 투영식 변환
      const k = 128.0 / star.z;
      const px = star.x * k + cx;
      const py = star.y * k + cy;

      if (px >= 0 && px < w && py >= 0 && py < h) {
        const size = (1.5 - star.z / 1000) * 2;
        
        // 이전 좌표와 연결하여 광선 꼬리(선) 그리기
        const oldK = 128.0 / (star.z + warpSpeed);
        const ox = star.x * oldK + cx;
        const oy = star.y * oldK + cy;

        ctx.beginPath();
        ctx.strokeStyle = star.color;
        ctx.lineWidth = size;
        ctx.moveTo(ox, oy);
        ctx.lineTo(px, py);
        ctx.stroke();
      }
    }

    // 워프 가속도 증폭
    warpSpeed += 0.45;
  }

  draw();

  return {
    stop: () => {
      active = false;
      cancelAnimationFrame(animId);
    }
  };
}

/**
 * 챗봇 테마 동적 전환 (일반 ↔ 키즈)
 */
function updateChatbotTheme(theme) {
  const avatarImg = document.getElementById('botAvatarImg');
  const dialogueText = document.getElementById('botDialogueText');
  const actionBtn = document.getElementById('botActionBtn');
  const chipsContainer = document.getElementById('chatChipsContainer');

  if (theme === 'kids') {
    // 1. 아바타 이미지 kids 버전으로 교체
    if (avatarImg) {
      avatarImg.src = avatarImg.getAttribute('data-kids') || 'img/robot02.jpg';
    }
    // 2. 안내 및 버튼 문구 kids화
    if (dialogueText) dialogueText.innerText = "우주 친구야, 궁금한 게 있니? 🚀";
    if (actionBtn) actionBtn.innerText = "우주 로봇이랑 놀기 💬";
    
    // 3. 추천 퀵 칩 kids화
    if (chipsContainer) {
      chipsContainer.innerHTML = `
        <button class="quick-question-chip" onclick="sendQuickQuestion('🚀 로켓 조립해보기')">🚀 로켓 조립해보기</button>
        <button class="quick-question-chip" onclick="sendQuickQuestion('⭐ 우주 퀴즈 풀기')">⭐ 우주 퀴즈 풀기</button>
        <button class="quick-question-chip" onclick="sendQuickQuestion('👨&zwj;🚀 우주인은 밥을 어떻게 먹어?')">👨&zwj;🚀 우주인은 밥을 어떻게 먹어?</button>
      `;
    }
  } else {
    // 1. 아바타 이미지 default 버전으로 원복
    if (avatarImg) {
      avatarImg.src = avatarImg.getAttribute('data-default') || 'img/robot.jpg';
    }
    // 2. 안내 및 버튼 문구 일반화
    if (dialogueText) dialogueText.innerText = "무엇을 도와드릴까요?";
    if (actionBtn) actionBtn.innerText = "관제 AI와 대화하기 💬";
    
    // 3. 추천 퀵 칩 일반화
    if (chipsContainer) {
      chipsContainer.innerHTML = `
        <button class="quick-question-chip" onclick="sendQuickQuestion('🚀 누리호 발사 제원')">🚀 누리호 발사 제원</button>
        <button class="quick-question-chip" onclick="sendQuickQuestion('🛰️ 위성 분해 쇼룸 안내')">🛰️ 위성 분해 쇼룸 안내</button>
        <button class="quick-question-chip" onclick="sendQuickQuestion('🔬 연구개발 분야')">🔬 연구개발 분야</button>
      `;
    }
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

    // 스냅 별가루 파티클 생성
    createSparkles(targetSlot);

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
        doneBtn.classList.add('ready', 'ready-rainbow');
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
  }).catch(() => { });

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

  const satBento = document.getElementById('bento-satellite');
  if (satBento) {
    satBento.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSatelliteModal();
    });
  }

  // AI 챗봇 아바타 및 버튼 이벤트 수동 바인딩
  const aiTrigger = document.getElementById('aiBotTrigger');
  const openHeroChatBtn = document.getElementById('openHeroChatBtn');
  if (aiTrigger) {
    aiTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openKariChatModal();
    });
  }
  if (openHeroChatBtn) {
    openHeroChatBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openKariChatModal();
    });
  }
});

// ESC 키 입력 시 모달 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeNurihoSimModal();
    closeSatelliteModal();
    closeKariChatModal();
  }
});
// ==========================================
// Hero Canvas Scroll Scrubbing
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvasScrubber();
  initBentoCardInteractions();
  initKidsStarTrail();
});

function initHeroCanvasScrubber() {
  const canvas = document.getElementById('heroScrubCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const statusEl = document.getElementById('heroStatusVal');
  const altEl = document.getElementById('heroAltVal');

  // 추출한 이미지 총 장수 (200장 기준)
  const frameCount = 200;

  // 이미지 파일 경로 매핑
  const currentFrame = index =>
    `img/nuri_frames/ezgif-frame-${String(index + 1).padStart(3, '0')}.jpg`;

  const images = [];
  const playhead = { frame: 0 };

  // 캔버스 크기 브라우저 화면에 맞추기 (DPR 대응 고해상도 적용)
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    
    // context 배율 적용
    ctx.scale(dpr, dpr);
    
    // 이미지 스무딩 품질 최상으로 보정
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    renderFrame(playhead.frame);
  }

  // 캔버스에 이미지 그리기 (화면 꽉 차게 비율 유지)
  function renderFrame(index) {
    let img = images[index];

    // 만약 현재 프레임 이미지가 로드되지 않았다면 이전 프레임 중 로드된 가장 가까운 이미지 사용
    if (!img || !img.complete) {
      for (let i = index - 1; i >= 0; i--) {
        if (images[i] && images[i].complete) {
          img = images[i];
          break;
        }
      }
    }

    // 이전 프레임도 없다면 첫 번째 프레임 사용
    if (!img || !img.complete) {
      img = images[0];
    }

    // 첫 프레임조차도 로드가 안 되었으면 그리지 않고 리턴
    if (!img || !img.complete) return;

    // scale(dpr, dpr) 상태이므로, 클리어와 그리기 크기는 스타일(논리) 영역 기준 크기로 수행
    const logicalWidth = window.innerWidth;
    const logicalHeight = window.innerHeight;
    ctx.clearRect(0, 0, logicalWidth, logicalHeight);

    const canvasRatio = logicalWidth / logicalHeight;
    const imgRatio = img.width / img.height;
    let drawW, drawH, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawW = logicalWidth * 1.06; // 6% 오버스캔 (생성형 AI 워터마크 크롭 숨김)
      drawH = (logicalWidth / imgRatio) * 1.06;
      drawX = (logicalWidth - drawW) / 2;
      drawY = (logicalHeight - drawH) / 2;
    } else {
      drawW = (logicalHeight * imgRatio) * 1.06;
      drawH = logicalHeight * 1.06;
      drawX = (logicalWidth - drawW) / 2;
      drawY = (logicalHeight - drawH) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  // 이미지 150장 메모리에 미리 불러오기 (Preload)
  let loadedCount = 0;
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
      loadedCount++;
      if (loadedCount === 1) {
        resizeCanvas(); // 첫 프레임 즉시 표시
      }
    };
    images.push(img);
  }

  window.addEventListener('resize', resizeCanvas);

  // GSAP 스크롤 연동
  // GSAP ScrollTrigger 완전 고정 및 자연스러운 전환 설정
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // 1. playhead 프레임 제어 트윈
    gsap.to(playhead, {
      frame: frameCount - 1,
      ease: "none",
      scrollTrigger: {
        trigger: "#heroScrubSection",
        start: "top top",         // 섹션 상단이 뷰포트 천장에 닿는 순간 고정 시작
        end: "+=5000",             // 스크롤 가상 거리 (5000px 동안 화면을 완벽 고정)
        pin: true,                 // 화면 고정 (아래 콘텐츠가 올라오지 못하게 잠금)
        pinSpacing: true,          // 고정된 거리만큼의 여백을 생성해 다음 섹션과 겹침 방지
        scrub: 1.2,                // 스크롤 반응 민첩도 (체감 속도를 묵직하고 부드럽게 보간)
        anticipatePin: 1,          // 핀 고정 시 덜컹거림/밀림 현상 완벽 방지
        onUpdate: (self) => {
          // 소수점 버림 처리로 정확한 프레임 렌더링
          const frameIdx = Math.min(frameCount - 1, Math.floor(playhead.frame));
          renderFrame(frameIdx);

          // 스크롤 진행도(0.0 ~ 1.0)에 따른 텍스트 HUD 업데이트
          const progress = self.progress;
          if (altEl) {
            altEl.innerText = (progress * 45.8).toFixed(1) + " KM";
          }
          if (statusEl) {
            if (progress < 0.2) statusEl.innerText = "READY TO LAUNCH";
            else if (progress < 0.5) statusEl.innerText = "STAGE 1 IGNITION";
            else if (progress < 0.85) statusEl.innerText = "MAX-Q ACCELERATION";
            else statusEl.innerText = "MECO & STAGE SEPARATION";
          }
        }
      }
    });
  }
}

/**
 * RESEARCH FIELDS Bento Cards 3D 틸트, 스포트라이트, ScrollTrigger 애니메이션 구현
 */
function initBentoCardInteractions() {
  const cards = document.querySelectorAll('.bento-card');
  
  cards.forEach(card => {
    // 3D 틸트 및 스포트라이트 좌표 계산
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // CSS 변수 갱신으로 스포트라이트 마스크 광원 추적
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      // 마우스가 카드 중앙에서부터 얼마나 떨어져 있는지에 따라 3D 회전 각도 산출 (최대 8도)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((centerY - y) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      // 마우스 오버 이동 시에는 지연(transition)을 제거하여 반응성 극대화
      card.style.transition = 'border-color 0.3s, box-shadow 0.3s';
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    // 마우스가 카드를 벗어날 때 부드럽게 원래 위치로 리셋
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s, box-shadow 0.3s';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // GSAP ScrollTrigger를 사용한 순차적 솟아오름 & 페이드인 효과
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".bento-card", {
      scrollTrigger: {
        trigger: ".bento-grid",
        start: "top 85%",
        toggleActions: "play none none none"
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    });
  }
}

/**
 * 1. 키즈 히어로 로켓 발사 연출 & 아래 우주 이야기로 스크롤 이동
 */
function launchKidsRocket() {
  const rocket = document.getElementById('kidsRocketWrapper');
  const targetSection = document.getElementById('kidsStorySection');
  const launchBtn = document.getElementById('kidsLaunchBtn');
  
  if (!rocket || rocket.classList.contains('launching')) return;

  // 1. 발사 상태 활성화 (불꽃 뿜으며 하늘 위로 솟아오름)
  rocket.classList.add('launching');
  if (launchBtn) launchBtn.disabled = true;

  // 2. 1.0초 후 스토리 섹션으로 부드럽게 스크롤
  setTimeout(() => {
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 1000);

  // 3. 2.8초 후 화면 밖 로켓을 원래 조용한 상태로 부드럽게 리셋하여 제자리 복귀
  setTimeout(() => {
    rocket.style.transition = 'none'; // 연출 리셋 시 순간이동
    rocket.style.transform = 'translateY(500px) scale(0.5)'; // 화면 아래에서 대기
    
    setTimeout(() => {
      rocket.classList.remove('launching');
      rocket.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)'; // 복귀 시 슬며시 위로 제자리 안착
      rocket.style.transform = 'translateY(0) scale(1)';
      
      if (launchBtn) launchBtn.disabled = false;
    }, 150);
  }, 2800);
}

/**
 * 3. 조립 부품 스냅 별가루 파티클 요소 생성
 */
function createSparkles(element) {
  const rect = element.getBoundingClientRect();
  const container = document.getElementById('view-kids');
  if (!container) return;

  // 8개의 별가루 사방 비산 생성
  for (let i = 0; i < 8; i++) {
    const star = document.createElement('span');
    star.className = 'star-sparkle-fx';
    star.innerText = ['✨', '⭐', '🎈', '🎉'][Math.floor(Math.random() * 4)];
    
    // 스크롤 및 창 위치 보정하여 절대 좌표 획득
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const centerX = rect.left + rect.width / 2 + scrollX;
    const centerY = rect.top + rect.height / 2 + scrollY;

    star.style.left = `${centerX}px`;
    star.style.top = `${centerY}px`;

    // 사방으로 튕겨 나갈 랜덤 각도와 세기
    const angle = Math.random() * Math.PI * 2;
    const velocity = 40 + Math.random() * 50;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    star.style.setProperty('--tx', `${tx}px`);
    star.style.setProperty('--ty', `${ty}px`);

    container.appendChild(star);

    // 애니메이션이 완료되는 0.8초 후 요소 삭제
    star.addEventListener('animationend', () => star.remove());
  }
}

/**
 * 4. 키즈 모드 캔버스 별가루 마우스 트레일 구현
 */
function initKidsStarTrail() {
  const canvas = document.getElementById('kidsStarTrailCanvas');
  const container = document.getElementById('view-kids');
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');
  let particles = [];

  // 컨테이너 레이아웃 스크롤 높이까지 커버하도록 캔버스 동적 해상도 지정
  function resizeCanvas() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => resizeCanvas());
    ro.observe(container);
  }

  // 별 파티클 클래스
  class StarParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 7 + 4;
      this.speedX = (Math.random() - 0.5) * 2.2;
      this.speedY = (Math.random() - 0.5) * 2.2 - 0.8; // 중력 역행하여 은은하게 상승
      this.color = `hsl(${Math.random() * 360}, 100%, 75%)`; // 다채로운 파스텔 무지개 HSL
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.015; // 자연스러운 소멸 속도
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.08;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= this.decay;
      this.angle += this.spin;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      
      // 5각 별 그리기 공식
      ctx.beginPath();
      const spikes = 5;
      const outerRadius = this.size;
      const innerRadius = this.size / 2.2;
      let rot = Math.PI / 2 * 3;
      let x = 0;
      let y = 0;
      const step = Math.PI / spikes;

      for (let i = 0; i < spikes; i++) {
        x = Math.cos(rot) * outerRadius;
        y = Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = Math.cos(rot) * innerRadius;
        y = Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(0, -outerRadius);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  // 마우스 이동 시 별 생성 등록
  container.addEventListener('mousemove', (e) => {
    // 뷰포트 상대좌표를 컨테이너 영역 크기로 보정
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left + container.scrollLeft;
    const y = e.clientY - rect.top + container.scrollTop;
    
    // 너무 과도한 파티클 생성 제한
    if (Math.random() < 0.6) {
      particles.push(new StarParticle(x, y));
    }
  });

  // 모바일/태블릿 터치 이동 시 별 생성 등록
  container.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = container.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left + container.scrollLeft;
      const y = e.touches[0].clientY - rect.top + container.scrollTop;
      particles.push(new StarParticle(x, y));
    }
  }, { passive: true });

  // 루프 드로잉 함수
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles = particles.filter(p => p.alpha > 0);
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

/**
 * ==========================================================================
 * KOMPSAT ARIRANG Exploded View 220 Frames Interactive Scrubber Modal
 * ==========================================================================
 */
let satImages = [];
let isSatImagesLoaded = false;
const satFrameCount = 220;

// 위성 이미지 경로 매핑 함수
const getSatFramePath = (index) =>
  `img/sat_frames/ezgif-frame-${String(index + 1).padStart(3, '0')}.jpg`;

/**
 * 인공위성 이미지 220장 프리로딩
 */
function preloadSatelliteImages(callback) {
  if (isSatImagesLoaded) {
    if (callback) callback();
    return;
  }

  let loadedCount = 0;
  for (let i = 0; i < satFrameCount; i++) {
    const img = new Image();
    img.src = getSatFramePath(i);
    img.onload = () => {
      loadedCount++;
      if (loadedCount === satFrameCount) {
        isSatImagesLoaded = true;
        if (callback) callback();
      }
    };
    img.onerror = () => {
      loadedCount++;
      if (loadedCount === satFrameCount) {
        isSatImagesLoaded = true;
        if (callback) callback();
      }
    };
    satImages.push(img);
  }
}

/**
 * 위성 프레임 렌더링 (DPR 대응 고해상도 렌더링)
 */
function renderSatFrame(index) {
  const canvas = document.getElementById('satScrubCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let img = satImages[index];

  // 프리로드가 완료되지 않은 경우에 대한 Fallback (가장 가까운 완료된 이미지 찾기)
  if (!img || !img.complete) {
    for (let i = index - 1; i >= 0; i--) {
      if (satImages[i] && satImages[i].complete) {
        img = satImages[i];
        break;
      }
    }
  }
  if (!img || !img.complete) {
    img = satImages[0];
  }
  if (!img || !img.complete) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const container = canvas.parentElement;
  const logicalWidth = container.clientWidth || window.innerWidth;
  const logicalHeight = container.clientHeight || window.innerHeight;

  // 캔버스 크기 스케일링 설정
  if (canvas.width !== logicalWidth * dpr || canvas.height !== logicalHeight * dpr) {
    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    canvas.style.width = logicalWidth + 'px';
    canvas.style.height = logicalHeight + 'px';
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }

  // 캔버스 클리어 및 그리기
  ctx.clearRect(0, 0, logicalWidth, logicalHeight);

  const canvasRatio = logicalWidth / logicalHeight;
  const imgRatio = img.width / img.height;
  let drawW, drawH, drawX, drawY;

  if (canvasRatio > imgRatio) {
    drawW = logicalWidth * 1.06; // 6% 오버스캔 (생성형 AI 워터마크 크롭 숨김)
    drawH = (logicalWidth / imgRatio) * 1.06;
    drawX = (logicalWidth - drawW) / 2;
    drawY = (logicalHeight - drawH) / 2;
  } else {
    drawW = (logicalHeight * imgRatio) * 1.06;
    drawH = logicalHeight * 1.06;
    drawX = (logicalWidth - drawW) / 2;
    drawY = (logicalHeight - drawH) / 2;
  }

  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

/**
 * 위성 모달 열기
 */
function openSatelliteModal() {
  const modal = document.getElementById('satelliteModal');
  const scrollBody = document.getElementById('satModalScrollBody');
  const stageText = document.getElementById('satStageText');
  const progressText = document.getElementById('satProgressText');
  const statusVal = document.getElementById('satStatusVal');
  const progressFill = document.getElementById('satScrubProgressFill');

  if (!modal || !scrollBody) return;

  // 1. 모달 활성화 및 바디 스크롤 락
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  scrollBody.scrollTop = 0;

  // 2. HUD 초기화
  if (statusVal) statusVal.textContent = "LOADING IMAGES...";
  if (progressText) progressText.textContent = "0%";
  if (progressFill) progressFill.style.width = '0%';

  // 3. 이미지 프리로딩 완료 후 최초 렌더링 및 스크롤 연동 활성화
  preloadSatelliteImages(() => {
    if (statusVal) statusVal.textContent = "SYSTEM ACTIVE";
    renderSatFrame(0);
    updateSatScrub();
  });

  const updateSatScrub = () => {
    const maxScroll = scrollBody.scrollHeight - scrollBody.clientHeight;
    if (maxScroll <= 0) return;

    const progress = Math.max(0, Math.min(1, scrollBody.scrollTop / maxScroll));
    const currentFrameIndex = Math.min(satFrameCount - 1, Math.floor(progress * satFrameCount));

    // 1:1 이미지 렌더링
    if (isSatImagesLoaded) {
      renderSatFrame(currentFrameIndex);
    }

    // HUD 업데이트
    if (progressText) {
      progressText.textContent = Math.floor(progress * 100) + "%";
    }
    if (progressFill) {
      progressFill.style.width = (progress * 100) + "%";
    }

    if (stageText && statusVal) {
      if (progress < 0.25) {
        stageText.textContent = "[STAGE 1] 전력 공급계 - 태양전지판 전개 분해";
        statusVal.textContent = "STAGE 1 DISASSEMBLING";
        statusVal.className = "sat-val cyan";
      } else if (progress < 0.6) {
        stageText.textContent = "[STAGE 2] 광학 탑재체(EOS) 및 대구경 렌즈 분해";
        statusVal.textContent = "STAGE 2 DISASSEMBLING";
        statusVal.className = "sat-val sky";
      } else {
        stageText.textContent = "[STAGE 3] 추력기 시스템 및 추진제 탱크 분해 완료";
        statusVal.textContent = "DISSOLUTION COMPLETE";
        statusVal.className = "sat-val green";
      }
    }
  };

  // 모달 영역 내 마우스 휠 스크롤 감지 및 1:1 스크러빙
  modal.onwheel = (e) => {
    e.preventDefault();
    scrollBody.scrollTop += e.deltaY * 0.7;
    updateSatScrub();
  };

  // 스크롤바 이동 시 바인딩
  scrollBody.onscroll = updateSatScrub;
  
  // 브라우저 리사이즈 시 대응
  window.addEventListener('resize', onSatCanvasResize);
}

function onSatCanvasResize() {
  const modal = document.getElementById('satelliteModal');
  const scrollBody = document.getElementById('satModalScrollBody');
  if (modal && modal.classList.contains('active') && scrollBody) {
    const maxScroll = scrollBody.scrollHeight - scrollBody.clientHeight;
    const progress = Math.max(0, Math.min(1, scrollBody.scrollTop / maxScroll));
    const currentFrameIndex = Math.min(satFrameCount - 1, Math.floor(progress * satFrameCount));
    renderSatFrame(currentFrameIndex);
  }
}

/**
 * 위성 모달 닫기
 */
function closeSatelliteModal() {
  const modal = document.getElementById('satelliteModal');
  if (modal) {
    modal.classList.remove('active');
    modal.onwheel = null;
  }
  document.body.style.overflow = '';
  window.removeEventListener('resize', onSatCanvasResize);
}

// 전역 window 노출
window.openSatelliteModal = openSatelliteModal;
window.closeSatelliteModal = closeSatelliteModal;

/**
 * ==========================================================================
 * KARI Flight AI Chatbot System (Image-based Avatar Setup)
 * ==========================================================================
 */

/**
 * 챗봇 모달 제어
 */
function openKariChatModal() {
  const modal = document.getElementById('kariChatModal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeKariChatModal() {
  const modal = document.getElementById('kariChatModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// 퀵 질문 칩 클릭 처리
function sendQuickQuestion(questionText) {
  const input = document.getElementById('chatInputText');
  if (input) {
    input.value = questionText;
    sendUserChatMessage();
  }
}

// 유저 메시지 전송 및 AI 응답 처리
function sendUserChatMessage() {
  const input = document.getElementById('chatInputText');
  const chatList = document.getElementById('chatMessagesList');
  if (!input || !chatList) return;

  const text = input.value.trim();
  if (text === '') return;

  // 1. 유저 메시지 말풍선 렌더링
  appendChatMessage('user', text);
  input.value = '';

  // 2. 가짜 통신 딜레이 연출 (600ms) 후 AI 관제관 응답 출력
  setTimeout(() => {
    const aiResponse = getKariAIResponse(text);
    appendChatMessage('ai', aiResponse);
  }, 600);
}

// 말풍선 DOM 동적 렌더링 (AI 응답 시 타이핑 효과 적용)
function appendChatMessage(sender, messageText) {
  const chatList = document.getElementById('chatMessagesList');
  if (!chatList) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${sender}-message`;

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  
  // 마크다운 형태의 볼드 등 태그 일부 파싱 지원
  let formattedText = messageText.replace(/\n/g, '<br>');
  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');

  const timestamp = document.createElement('span');
  timestamp.className = 'msg-timestamp';
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  timestamp.textContent = sender === 'ai' ? `FLIGHT AI // ${timeStr}` : `USER // ${timeStr}`;

  msgDiv.appendChild(bubble);
  msgDiv.appendChild(timestamp);
  chatList.appendChild(msgDiv);

  if (sender === 'ai') {
    bubble.innerHTML = '';
    
    // HTML 태그 파서 토큰화하여 순차 타이핑 처리 (태그 깨짐 방지)
    const tokens = [];
    let i = 0;
    while (i < formattedText.length) {
      if (formattedText[i] === '<') {
        let tag = '';
        while (i < formattedText.length && formattedText[i] !== '>') {
          tag += formattedText[i];
          i++;
        }
        tag += '>';
        i++;
        tokens.push({ type: 'tag', value: tag });
      } else {
        tokens.push({ type: 'text', value: formattedText[i] });
        i++;
      }
    }

    let tokenIndex = 0;
    const typingSpeed = 12; // 타이핑 속도(ms)
    
    function typeToken() {
      if (tokenIndex < tokens.length) {
        const token = tokens[tokenIndex];
        bubble.innerHTML += token.value;
        tokenIndex++;
        chatList.scrollTop = chatList.scrollHeight;
        setTimeout(typeToken, token.type === 'tag' ? 0 : typingSpeed);
      }
    }
    typeToken();
  } else {
    bubble.innerHTML = formattedText;
  }

  // 채팅 리스트 자동 스크롤
  chatList.scrollTop = chatList.scrollHeight;
}

// 규칙 기반 시나리오 룰셋 응답 엔진
function getKariAIResponse(userText) {
  const text = userText.toLowerCase();

  // 1. 누리호 제원 데이터
  if (text.includes('누리호') || text.includes('제원') || text.includes('nuri')) {
    return `🚀 **KSLV-II 누리호 주요 제원 안내**\n
- **구분**: 3단형 액체엔진 우주발사체 (대한민국 독자 개발)\n
- **전체 길이**: 47.2 m / 최대 직경: 3.5 m\n
- **총 중량**: 200 t\n
- **탑재체 성능**: 1.5톤급 실용위성을 600~800km 저궤도에 안착 가능\n
- **엔진 구성**: 1단 75톤급 액체엔진 4기 클러스터링(300톤 추력), 2단 75톤급 액체엔진 1기, 3단 7톤급 액체엔진 1기입니다.\n\n
*메인 화면을 스크롤하시면 1단계부터 3단계까지의 웅장한 가상 발사 시뮬레이션을 제어해 감상하실 수 있습니다!*`;
  }

  // 2. 인공위성 시스템 쇼룸
  if (text.includes('위성') || text.includes('인공위성') || text.includes('쇼룸') || text.includes('분해') || text.includes('arirang') || text.includes('kompsat')) {
    return `🛰️ **KOMPSAT 아리랑 인공위성 시스템 안내**\n
- **대상 모델**: 다목적 실용위성(아리랑 7호 / KOMPSAT-7) 기체\n
- **미션**: 초고해상도 광학 탑재체(EOS) 및 대구경 렌즈를 활용한 정밀 지구 관측\n
- **조작 안내**: RESEARCH FIELDS 벤토 그리드 우측의 **'인공위성 시스템'** 카드를 터치하시면, 220프레임에 달하는 실시간 '3D 분해 및 정밀 조립 가상 쇼룸'이 열립니다. 스크롤 휠로 내부 전력 공급계, 렌즈계, 추력기 시스템을 정밀 분해해 보실 수 있습니다!`;
  }

  // 3. 발사 시퀀스
  if (text.includes('발사') || text.includes('시퀀스') || text.includes('이륙') || text.includes('카운트다운') || text.includes('sim')) {
    return `🔥 **KARI 발사 관제 자동 시퀀스 안내**\n
- **준비 단계(PLD)**: 발사체 기립 및 최종 내부 시스템 자가 검사 수행\n
- **자동 점화(PLOS)**: 카운트다운 10초 전 지상 관제 시스템에 의한 점화 명령 발송\n
- **리프트오프(LIFTOFF)**: 75톤급 엔진 클러스터링 총 추력이 300톤을 돌파하는 시점에 고정장치(Hold-down) 락이 해제되며 하늘로 솟구쳐 오릅니다.\n\n
*GNB 우측의 [시뮬레이터 시작 🚀] 버튼을 눌러 비행 과정을 실시간 입체적으로 모니터링해 보세요.*`;
  }

  // 4. KARI 항우연
  if (text.includes('kari') || text.includes('항공우주연구원') || text.includes('항우연')) {
    return `🏢 **KARI (한국항공우주연구원) 소개**\n
- **KARI**는 대한민국의 항공우주 과학기술 개발을 전담하는 정부출연 연구기관입니다.\n
- 독자적인 우주 발사체 기술(누리호), 세계 최고 수준의 저궤도 정밀 지구 관측 위성(아리랑/천리안 시리즈), 그리고 한국 최초의 달 궤도선(다누리)을 성공적으로 쏘아 올린 대한민국 과학기술의 심장부입니다.`;
  }

  // 4-2. 연구개발 분야
  if (text.includes('연구') || text.includes('개발') || text.includes('분야') || text.includes('r&d')) {
    return `🔬 **KARI 우주항공 연구개발(R&D) 핵심 영역 안내**\n
- **우주 발사체**: 한국형 발사체 고도화 및 차세대 발사체 개발을 통한 완전한 우주 수송 능력 확보\n
- **인공위성**: 다목적 실용위성(아리랑), 차세대 중형위성, 천리안 복합위성 등의 독자적 탑재체 및 본체 국산화 연구\n
- **우주 탐사**: 최초의 달 궤도선 다누리에 이어 향후 달 착륙선 및 독자 행성 탐사 프로젝트 선행 개발 선도\n
- **항공 혁신**: 친환경 미래 도심항공 교통(UAM), 무인 항공기 시스템 및 고고도 장기체공 태양광 무인기 원천 기술 개발\n\n
*항우연은 최첨단 우주 영토 확장을 위해 다각도의 기초 핵심 R&D 분야를 전방위 육성하고 있습니다.*`;
  }

  // 5. 기본 환영 인사
  if (text.includes('안녕') || text.includes('하이') || text.includes('반갑') || text.includes('hello')) {
    return `👋 반갑습니다! KARI 비행 관제실의 비행 통제 지원 AI입니다. 무엇을 도와드릴까요?\n
발사체 제원, 위성 쇼룸 정보, 또는 발사 통제 시스템에 대해 물어보시면 상세히 안내해 드리겠습니다.`;
  }

  // 6. 키즈 모드 칩 1: 로켓 조립해보기
  if (text.includes('로켓 조립') || text.includes('조립해보기') || text.includes('조립 놀이')) {
    return `🚀 **재미있는 로켓 조립 놀이!**\n
키즈 모드 메인 화면 상단으로 가시면 **'3D 로켓 조립 연구소'**가 있답니다!\n
1단계 **부스터(불꽃 엔진)** ➔ 2단계 **연료 탱크** ➔ 3단계 **페이로드(기계장치)** ➔ 4단계 **페어링(머리 부분)** 순서대로 하나씩 콕콕 눌러 결합해 보아요! 완성한 후 **[로켓 발사! 🚀]** 버튼을 누르면 하늘 높이 로켓이 날아간답니다!`;
  }

  // 7. 키즈 모드 칩 2: 우주 퀴즈 풀기
  if (text.includes('우주 퀴즈') || text.includes('퀴즈 풀기') || text.includes('퀴즈')) {
    return `⭐ **반짝반짝 우주 상식 퀴즈!**\n
우주에서 가장 뜨거운 별은 태양일까요? 아니면 지구일까요?\n
*정답은 당연히 활활 타오르는 **'태양'**이랍니다! 생각한 답을 채팅창에 적어 보거나, 아래 '재미있는 우주 이야기' 카드를 눌러 우주 상식을 더 넓혀 보세요!*`;
  }

  // 8. 키즈 모드 칩 3: 우주인은 밥을 어떻게 먹어?
  if (text.includes('우주인') && (text.includes('밥') || text.includes('먹어') || text.includes('식사'))) {
    return `👨‍🚀 **우주 비행사들의 신기한 밥 먹기!**\n
우주선 안은 중력이 없어서(둥둥 뜨는 상태) 음식이나 물이 사방으로 날아다녀요!\n
그래서 우주인들은 국물이나 밥을 숟가락으로 떠먹는 대신, **빨대가 달린 특수 튜브**에 든 퓨레를 짜 먹거나 한입에 쏙 들어가는 **건조 식량**을 물에 불려 먹는답니다. 물방울이 동동 떠다니면 손으로 쏙 잡아서 먹기도 해요! 신기하지 않나요?`;
  }

  // 기본 폴백 응답
  return `🤖 **KARI Telemetry Database 원격 전송 완료**\n
질문하신 내용과 연동된 최신 원격 데이터를 로드해 분석 중입니다.\n
현재 관제실의 비행 시뮬레이터 시스템이 정상 가동 중입니다. 대한민국 우주 개발의 심장인 **누리호의 제원 정보, 위성 3D 분해 쇼룸 조작법, 발사 카운트다운 절차**에 대해 추가 질문해 주시면 성실히 지원해 드리겠습니다!`;
}

// 전역 window 객체 노출
window.openSatelliteModal = openSatelliteModal;
window.closeSatelliteModal = closeSatelliteModal;
window.openKariChatModal = openKariChatModal;
window.closeKariChatModal = closeKariChatModal;
window.sendQuickQuestion = sendQuickQuestion;
window.sendUserChatMessage = sendUserChatMessage;