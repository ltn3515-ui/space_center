// 브라우저 새로고침 시 스크롤 위치 강제 기억 복원(Scroll Restoration) 비활성화 및 초기화
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// GSAP ScrollTrigger가 있을 경우 스크롤 메모리를 비우고 최상단에서 리프레시되도록 통제
if (typeof ScrollTrigger !== 'undefined') {
  ScrollTrigger.clearScrollMemory();
}

// 윈도우 렌더링 로드가 완전히 마무리된 시점에도 스크롤을 0으로 픽스하여 시각적 복원을 완전 차단
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});

// 단계별 데이터 배열 정의
const stagesData = [
  {
    stageNum: 1,
    tag: "STAGE 01 // IGNITION",
    title: "75톤급 클러스터링 점화",
    desc: "총 300톤급 추력으로 발사대를 이륙하는 핵심 시퀀스입니다.",
    modalTitle: "STAGE 01 // 엔진 점화 상세 제원",
    longDesc: `🚀 누리호 1단 엔진 점화 및 이륙 시퀀스

누리호 1단부에는 독자 설계된 75톤급 액체 엔진 4기가 기하학적으로 배치 및 클러스터링 결합되어 총 300톤의 추력을 발휘합니다.

- 추진제: 케로신(Jet A-1) + 액체산소(LOX)
- 연소 시간: 127.3초
- 연소실 압력: 60 bar
- 지상 연소 비추력: 292.5초

발사 수십 초 전 최종 카운트다운 완료 시점에 가스발생기 사이클 시동과 함께 터보펌프가 작동을 시작하며 엔진 점화와 이륙이 단번에 개시됩니다.`
  },
  {
    stageNum: 2,
    tag: "STAGE 02 // SEPARATION",
    title: "1단 분리 및 페어링 사출",
    desc: "고도 59km에서 1단을 분리하고 위성 덮개를 사출합니다.",
    modalTitle: "STAGE 02 // 1단 분리 및 페어링 사출 제원",
    longDesc: `🛰️ 1단 단 분리 및 보호 페어링 전개 시퀀스

대기권의 최대 공력 동압(Max-Q)을 지나 비행 고도가 59km에 다다르는 MECO 시점에 1단 결합부의 파이로볼트 결속 장치가 폭발 격리 분리됩니다.

- 단 분리 고도: 59.0 KM
- 2단 엔진 추력: 75 t (진공 환경 특화 노즐 적용)
- 위성 보호 페어링 사출 고도: 191 KM

지상 대기 밀도가 희박해지는 고도 191km에서 내부의 위성 탑재체를 보호하고 있던 덮개인 페어링 양 날개가 기하학적 궤도를 따라 우주 밖으로 안전하게 전개 및 분리 사출됩니다.`
  },
  {
    stageNum: 3,
    tag: "STAGE 03 // ORBITAL INSERTION",
    title: "3단 점화 및 위성 궤도 투입",
    desc: "최종 목표 고도 700km 저궤도에 위성을 성공적으로 사출합니다.",
    modalTitle: "STAGE 03 // 위성 사출 및 궤도 투입 제원",
    longDesc: `🔬 3단 비행 및 차세대 실용위성 사출 완수

최종 단계인 3단 7톤급 액체엔진이 진공 우주 궤도에서 약 500초간 정교하게 화력 연소 작동하여 비행 속도를 제1우주속도인 초속 7.5km까지 도달시킵니다.

- 3단 엔진 추력: 7.0 t
- 최종 도달 목표 고도: 700.0 KM
- 위성 투입 속도: 7.5 KM/S

목표 지점에 도달하면 최종적으로 스프링 가속 격리 메커니즘이 구동되어 오차 범위 0.1% 미만의 극치 정확도로 차세대 소형위성을 타겟 궤도 평면에 안착 및 사출시킵니다.`
  }
];

// ==========================================
// Magic UI Style Number Ticker Intro Animation
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('introPreloader');
  const numberTicker = document.getElementById('numberTicker');
  const progressFill = document.getElementById('introProgressFill');
  const statusText = document.getElementById('introStatusText');

  const statusLogs = [
    "ESTABLISHING GROUND STATION LINK...",
    "CALIBRATING ORBITAL TELEMETRY...",
    "INITIALIZING 3D SATELLITE ENGINE...",
    "SYSTEM CHECK: ALL NOMINAL",
    "READY FOR MISSION CONTROL"
  ];

  const tickerObj = { val: 0 };

  if (typeof gsap !== 'undefined') {
    gsap.to(tickerObj, {
      val: 100,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => {
        const currentVal = Math.floor(tickerObj.val);
        if (numberTicker) numberTicker.innerText = currentVal;
        if (progressFill) progressFill.style.width = currentVal + "%";

        if (statusText) {
          if (currentVal < 25) statusText.innerText = statusLogs[0];
          else if (currentVal < 50) statusText.innerText = statusLogs[1];
          else if (currentVal < 75) statusText.innerText = statusLogs[2];
          else if (currentVal < 100) statusText.innerText = statusLogs[3];
          else statusText.innerText = statusLogs[4];
        }
      },
      onComplete: () => {
        setTimeout(() => {
          gsap.to(preloader, {
            opacity: 0,
            scale: 1.05,
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: () => {
              if (preloader) preloader.classList.add('loaded');
              gsap.from(".hero-content > *", {
                y: 30,
                opacity: 0,
                stagger: 0.15,
                duration: 1,
                ease: "power3.out"
              });
            }
          });
        }, 300);
      }
    });
  }
});

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
    overlay.classList.add('active');
    flash.classList.remove('flash');

    if (starburstEngine) {
      starburstEngine.stop();
      starburstEngine = null;
    }

    if (targetTheme === 'kids') {
      // CASE A: 일반 ➔ 키즈 (To Kids)
      overlay.classList.remove('to-standard');
      if (subTitle) subTitle.innerText = "SYSTEM WARP INITIATED";
      if (mainTitle) mainTitle.innerText = "🚀 신나는 KARI 키즈 행성으로 도약 중!";

      starburstEngine = runWarpStarburst(canvas);

      if (countdown) countdown.innerText = "WARP IN 3";
      setTimeout(() => { if (countdown) countdown.innerText = "WARP IN 2"; }, 400);
      setTimeout(() => { if (countdown) countdown.innerText = "WARP IN 1"; }, 800);

      setTimeout(() => {
        if (countdown) countdown.innerText = "WARP SPEED!";
        flash.classList.add('flash');

        if (proView) proView.classList.remove('active');
        body.classList.remove('theme-default');
        body.classList.add('theme-kids', 'kids-mode');
        if (kidsView) kidsView.classList.add('active');

        updateChatbotTheme(targetTheme);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 1200);

      setTimeout(() => {
        overlay.classList.remove('active');
        if (starburstEngine) {
          starburstEngine.stop();
          starburstEngine = null;
        }
      }, 1500);

    } else {
      // CASE B: 키즈 ➔ 일반 (To Standard - 관제실 복귀)
      overlay.classList.add('to-standard');
      if (subTitle) subTitle.innerText = "FLIGHT TELEMETRY SYSTEM // RE-CONNECT";
      if (mainTitle) mainTitle.innerText = "KARI 메인 항공우주 관제실 복귀 중";
      if (countdown) countdown.innerText = "MISSION PROTOCOL ACTIVE";

      // 0.7초 시점에 빠른 모드 갱신
      setTimeout(() => {
        flash.classList.add('flash');

        if (kidsView) kidsView.classList.remove('active');
        body.classList.remove('theme-kids', 'kids-mode');
        body.classList.add('theme-default');
        if (proView) proView.classList.add('active');

        updateChatbotTheme(targetTheme);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 700);

      // 0.95초 시점에 오버레이 퇴출 리셋
      setTimeout(() => {
        overlay.classList.remove('active');
        overlay.classList.remove('to-standard');
      }, 950);
    }
  }
}

function runWarpStarburst(canvasEl) {
  const ctx = canvasEl.getContext('2d');
  let w = canvasEl.width = window.innerWidth;
  let h = canvasEl.height = window.innerHeight;

  const stars = [];
  const numStars = 300;

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: (Math.random() - 0.5) * 1000,
      y: (Math.random() - 0.5) * 1000,
      z: Math.random() * 1000,
      color: `hsl(${Math.random() * 60 + 180}, 100%, 75%)`
    });
  }

  let warpSpeed = 3;
  let active = true;
  let animId = null;

  function draw() {
    if (!active) return;
    animId = requestAnimationFrame(draw);

    ctx.fillStyle = 'rgba(3, 5, 12, 0.15)';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    for (let i = 0; i < numStars; i++) {
      const star = stars[i];
      star.z -= warpSpeed;

      if (star.z <= 0) {
        star.z = 1000;
        star.x = (Math.random() - 0.5) * 1000;
        star.y = (Math.random() - 0.5) * 1000;
      }

      const k = 128.0 / star.z;
      const px = star.x * k + cx;
      const py = star.y * k + cy;

      if (px >= 0 && px < w && py >= 0 && py < h) {
        const size = (1.5 - star.z / 1000) * 2;
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

function updateChatbotTheme(theme) {
  const avatarImg = document.getElementById('botAvatarImg');
  const dialogueText = document.getElementById('botDialogueText');
  const actionBtn = document.getElementById('botActionBtn');
  const chipsContainer = document.getElementById('chatChipsContainer');

  if (theme === 'kids') {
    if (avatarImg) avatarImg.src = avatarImg.getAttribute('data-kids') || 'img/robot02.jpg';
    if (dialogueText) dialogueText.innerText = "우주 친구야, 궁금한 게 있니? 🚀";
    if (actionBtn) actionBtn.innerText = "우주 로봇이랑 놀기 💬";
    if (chipsContainer) {
      chipsContainer.innerHTML = `
        <button class="quick-question-chip" onclick="sendQuickQuestion('🚀 로켓 조립해보기')">🚀 로켓 조립해보기</button>
        <button class="quick-question-chip" onclick="sendQuickQuestion('⭐ 우주 퀴즈 풀기')">⭐ 우주 퀴즈 풀기</button>
        <button class="quick-question-chip" onclick="sendQuickQuestion('👨‍🚀 우주인은 밥을 어떻게 먹어?')">👨‍🚀 우주인은 밥을 어떻게 먹어?</button>
      `;
    }
  } else {
    if (avatarImg) avatarImg.src = avatarImg.getAttribute('data-default') || 'img/researcher.jpg';
    if (dialogueText) dialogueText.innerText = "궁금한 우주 기술이 있으신가요?";
    if (actionBtn) actionBtn.innerText = "KARI 연구원과 대화하기 💬";
    if (chipsContainer) {
      chipsContainer.innerHTML = `
        <button class="quick-question-chip" onclick="sendQuickQuestion('🚀 누리호 75톤 엔진 구조')">🚀 누리호 75톤 엔진 구조</button>
        <button class="quick-question-chip" onclick="sendQuickQuestion('🛰️ 아리랑 위성 광학 제원')">🛰️ 아리랑 위성 광학 제원</button>
        <button class="quick-question-chip" onclick="sendQuickQuestion('🔬 KARI 차세대 발사체 로드맵')">🔬 KARI 차세대 발사체 로드맵</button>
      `;
    }
  }
}

function updateTelemetryVal(el, newValue) {
  if (!el) return;
  if (el.textContent !== newValue) {
    el.textContent = newValue;
    el.classList.add('updating');
    if (el.updateTimeout) clearTimeout(el.updateTimeout);
    el.updateTimeout = setTimeout(() => {
      el.classList.remove('updating');
    }, 150);
  }
}

function updateMissionTimelineDots(progress) {
  const items = document.querySelectorAll('#missionSequenceNav .seq-dot-item');
  if (!items.length) return;

  items.forEach(item => item.classList.remove('active'));

  if (progress < 0.3) items[0].classList.add('active');
  else if (progress >= 0.3 && progress < 0.7) items[1].classList.add('active');
  else items[2].classList.add('active');
}

window.scrollToMissionStage = function (ratio) {
  if (typeof ScrollTrigger === 'undefined') return;
  const trigger = ScrollTrigger.getById("heroScrollTrigger");
  if (!trigger) return;

  const targetScroll = trigger.start + (trigger.end - trigger.start) * ratio;

  if (typeof gsap !== 'undefined' && gsap.plugins && gsap.plugins.scrollTo) {
    gsap.to(window, { scrollTo: targetScroll, duration: 1.2, ease: "power2.inOut" });
  } else {
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }
};

let installedPartsCount = 0;
const installedPartsMap = { booster: false, tank: false, payload: false, fairing: false };

// 키즈 모드 조립 오류 및 실시간 안내 커스텀 모달
window.showKidsAlertModal = function(title, messageHTML) {
  let modalOverlay = document.getElementById('kidsAlertModalOverlay');
  
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'kidsAlertModalOverlay';
    modalOverlay.className = 'kids-alert-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="kids-alert-modal-card">
        <div class="kids-alert-icon">💡</div>
        <h3 id="kidsAlertTitle" class="kids-alert-title"></h3>
        <div id="kidsAlertBody" class="kids-alert-body"></div>
        <button type="button" class="kids-alert-confirm-btn" onclick="closeKidsAlertModal()">확인 / 다시 조립하기 🚀</button>
      </div>
    `;
    document.body.appendChild(modalOverlay);
  }

  const titleEl = document.getElementById('kidsAlertTitle');
  const bodyEl = document.getElementById('kidsAlertBody');

  if (titleEl) titleEl.innerHTML = title;
  if (bodyEl) bodyEl.innerHTML = messageHTML;

  // TTS 음성 안내 (어린이 가독성 및 접근성 보장)
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const cleanText = messageHTML.replace(/<[^>]*>/g, ' ');
      const alertAudio = new SpeechSynthesisUtterance(`${title}. ${cleanText}`);
      alertAudio.lang = 'ko-KR';
      alertAudio.rate = 1.0;
      alertAudio.pitch = 1.1;

      const voices = window.speechSynthesis.getVoices();
      const koVoice = voices.find(v => v.lang.startsWith('ko'));
      if (koVoice) alertAudio.voice = koVoice;

      window.speechSynthesis.speak(alertAudio);
    } catch(e) {
      console.warn("Alert TTS speech error:", e);
    }
  }

  requestAnimationFrame(() => {
    modalOverlay.classList.add('active');
  });
};

window.closeKidsAlertModal = function() {
  const modalOverlay = document.getElementById('kidsAlertModalOverlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

function addRocketPart(partType, btnEl) {
  if (installedPartsMap[partType]) return;

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

    targetSlot.classList.remove('empty');
    targetSlot.classList.add('installed');
    createSparkles(targetSlot);

    if (btnEl) {
      btnEl.classList.add('installed');
      btnEl.disabled = true;
      btnEl.innerHTML = `<span class="part-icon">✓</span> 장착 완료!`;
    }

    if (progressBadge) progressBadge.textContent = `조립 진행률: ${installedPartsCount} / 4`;

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

      if (powOverlay) powOverlay.classList.add('pow-burst');
      if (slotsWrapper) slotsWrapper.classList.add('hidden-fused');
      if (superRocket) superRocket.classList.add('transformed');

      setTimeout(() => { launchAssembledRocketUpward(); }, 600);
    }
  }
}

function launchAssembledRocketUpward() {
  const tower = document.getElementById('assembledTower');
  const statusText = document.getElementById('stageStatusText');
  const doneBtn = document.getElementById('buildDoneBtn');
  const toast = document.getElementById('launchToastBanner');
  const slotsWrapper = document.getElementById('partsSlotsWrapper');
  const powOverlay = document.getElementById('powExplosionOverlay');
  const superRocket = document.getElementById('superMasterRocket');

  if (!tower || tower.classList.contains('blasting-off')) return;

  tower.classList.add('shaking-launch');
  if (statusText) {
    statusText.innerHTML = '🔥 3.. 2.. 1.. 엔진 점화! 우주로 무사히 발사!';
    statusText.style.color = '#e17055';
  }

  setTimeout(() => {
    tower.classList.remove('shaking-launch');
    tower.classList.add('blasting-off');

    if (statusText) {
      statusText.innerHTML = '🚀 슝~! 3D 로켓이 우주 하늘 높이 솟구쳐 발사되었습니다!';
      statusText.style.color = '#00cec9';
    }

    setTimeout(() => { if (toast) toast.classList.add('show'); }, 1200);
    setTimeout(() => {
      tower.style.transition = 'opacity 0.5s ease';
      tower.style.opacity = '0';
    }, 3700);

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

function finishRocketAssembly() {
  if (installedPartsCount < 4) {
    showKidsAlertModal(
      "조립 미완료! 🚀",
      `아직 결합되지 않은 로켓 부품이 남아있어요! (${installedPartsCount}/4)<br><br><b>부스터 ➔ 연료 탱크 ➔ 페이로드 ➔ 페어링</b> 순서대로 4개 부품을 모두 완성해 주세요!`
    );
    return;
  }
  launchAssembledRocketUpward();
}

// ==========================================
// KARI Official R&D Showcase Carousel Controller (6 Slides)
// ==========================================
const showcaseData = [
  {
    slideNum: 1,
    titleKo: "발사체",
    titleEn: "Space Launch Vehicle",
    desc: "한국항공우주연구원은 KSR-I(1993), KSR-II(1998), KSR-III(2002)을 통해 로켓 설계 및 제작 능력을 확보하였으며, 러시아와 국제협력으로 나로호 개발에 성공하여 우주발사체 기술과 경험을 축적했다. 이를 토대로 1.5톤급 실용위성을 발사할 수 있는 3단형 한국형발사체 누리호를 독자 개발하여, 2027년까지 반복 발사와 기술 민간 이전을 추진할 계획이며, 2032년 달 착륙선을 발사할 차세대발사체를 개발중에 있다.",
    is3dMode: false
  },
  {
    slideNum: 2,
    titleKo: "인공위성",
    titleEn: "Satellite System",
    desc: "1992년 우리별 1호 발사를 시작으로 아리랑 위성, 천리안 위성 등 고성능 저궤도 및 정지궤도 위성을 독자 개발하여 지구관측, 기상·해양 관측, 우주환경 관측 등 다양한 국가적 임무를 성공적으로 수행하고 있습니다. 서브미터급 초고해상도 광학 탑재체와 합성개구레이더(SAR) 기술을 바탕으로 세계적 수준의 위성 개발 기술력을 보유하고 있습니다.",
    is3dMode: false
  },
  {
    slideNum: 3,
    titleKo: "우주탐사",
    titleEn: "Deep Space Exploration",
    desc: "대한민국 최초의 달 궤도선 다누리(KPLO)의 성공적 발사를 시작으로 심우주 통신, 항법, 임무 설계 기술을 성공적으로 확보하였습니다. 2032년 달 착륙선 독자 발사 및 표면 탐사를 목표로 추진 중이며, 향후 화성 탐사선 및 소행성 탐사까지 대한민국 우주 탐사 영역을 심우주로 지속 확장해 나가고 있습니다.",
    is3dMode: false
  },
  {
    slideNum: 4,
    titleKo: "항공기 & AAM",
    titleEn: "Aviation Technology",
    desc: "친환경 자율비행 미래 항공 모빌리티(AAM), 수직이착륙(VTOL) 무인기, 스마트 UAV, 고고도 장기체공 전기동력 무인기 등 차세대 첨단 항공 기술을 연구 개발하고 있습니다. 미래 도심 교통 체계의 혁신과 대한민국 항공산업의 글로벌 기술 경쟁력 강화를 선도하고 있습니다.",
    is3dMode: false
  },
  {
    slideNum: 5,
    titleKo: "우주항법",
    titleEn: "KPS Navigation System",
    desc: "한국형 위성항법시스템(KPS)은 한반도 및 인근 지역에 초정밀 위치·항법·시각(PNT) 정보를 제공하는 국가 초정밀 우주 인프라 구축 사업입니다. 자율주행, 도심항공교통(UAM), 정밀 농업, 입체 모빌리티 등 차세대 초연결 신산업의 핵심 기반 기술로 작동합니다.",
    is3dMode: true
  },
  {
    slideNum: 6,
    titleKo: "기술사업화 & 국가 인프라",
    titleEn: "Tech Transfer & Infra",
    desc: "한국항공우주연구원이 보유한 첨단 우주항공 연구 성과와 특허 기술의 민간 이전, 산학연 공동 연구개발 지원, 나로우주센터 등 국가 시험 인프라의 개방을 통해 국내 우주항공 산업 생태계를 육성하고, 민간 주도의 뉴 스페이스(New Space) 시대를 실현하고 있습니다.",
    is3dMode: false
  }
];

let currentShowcaseIdx = 0;
let showcaseAutoPlayTimer = null;
let isShowcaseAutoPlaying = true;
let isShowcaseLocked = false;

function updateShowcaseSlide() {
  const slides = document.querySelectorAll('.showcase-slide');
  const counterEl = document.getElementById('showcaseCurIndex');
  const hudContent = document.getElementById('hudCardContent');
  const section = document.querySelector('.kari-showcase-section');
  const cinematicVideo = document.getElementById('kps-cinematic-video');

  if (!slides.length) return;

  const data = showcaseData[currentShowcaseIdx];
  if (!data) return;

  slides.forEach((slide, i) => {
    if (i === currentShowcaseIdx) {
      slide.classList.add('active');
      const slideVid = slide.querySelector('video');
      if (slideVid) slideVid.play().catch(() => {});
    } else {
      slide.classList.remove('active');
    }
  });

  if (counterEl) {
    counterEl.textContent = data.slideNum;
  }

  if (hudContent) {
    hudContent.style.opacity = '0';
    hudContent.style.transform = 'translateY(6px)';
    hudContent.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

    setTimeout(() => {
      hudContent.innerHTML = `
        <h3 class="hud-title">
          <span class="hud-ko">${data.titleKo}</span>
          <span class="hud-en">${data.titleEn}</span>
        </h3>
        <p class="hud-desc">${data.desc}</p>
      `;
      hudContent.style.opacity = '1';
      hudContent.style.transform = 'translateY(0)';
    }, 200);
  }

  if (section) {
    if (data.is3dMode) {
      section.classList.add('mode-3d');
      if (cinematicVideo) {
        cinematicVideo.play().catch(() => {});
      }
    } else {
      section.classList.remove('mode-3d');
    }
  }
}

window.moveShowcaseSlide = function(dir) {
  if (isShowcaseLocked) return;

  currentShowcaseIdx = (currentShowcaseIdx + dir + showcaseData.length) % showcaseData.length;
  updateShowcaseSlide();

  if (isShowcaseAutoPlaying) {
    resetShowcaseAutoPlay();
  }
};

window.toggleShowcaseAutoPlay = function() {
  const btn = document.getElementById('showcasePlayPauseBtn');
  isShowcaseAutoPlaying = !isShowcaseAutoPlaying;

  if (isShowcaseAutoPlaying) {
    if (btn) btn.textContent = '▶';
    startShowcaseAutoPlay();
  } else {
    if (btn) btn.textContent = '⏸';
    stopShowcaseAutoPlay();
  }
};

window.toggleShowcaseLock = function() {
  const btn = document.getElementById('showcaseLockBtn');
  isShowcaseLocked = !isShowcaseLocked;

  if (btn) {
    if (isShowcaseLocked) {
      btn.textContent = '🔒';
      btn.title = '슬라이드 잠금 상태 (클릭 시 해제)';
      btn.style.color = '#ff4757';
      stopShowcaseAutoPlay();
    } else {
      btn.textContent = '🔓';
      btn.title = '슬라이드 잠금 해제 상태 (클릭 시 잠금)';
      btn.style.color = '#00f5d4';
      if (isShowcaseAutoPlaying) {
        startShowcaseAutoPlay();
      }
    }
  }
};

function startShowcaseAutoPlay() {
  stopShowcaseAutoPlay();
  if (!isShowcaseLocked) {
    showcaseAutoPlayTimer = setInterval(() => {
      currentShowcaseIdx = (currentShowcaseIdx + 1) % showcaseData.length;
      updateShowcaseSlide();
    }, 4500);
  }
}

function stopShowcaseAutoPlay() {
  if (showcaseAutoPlayTimer) {
    clearInterval(showcaseAutoPlayTimer);
    showcaseAutoPlayTimer = null;
  }
}

function resetShowcaseAutoPlay() {
  stopShowcaseAutoPlay();
  startShowcaseAutoPlay();
}

// ==========================================
// Hero Canvas Scroll Scrubbing & Hotspot 연동
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  updateShowcaseSlide();
  startShowcaseAutoPlay();
  initHeroCanvasScrubber();
  initBentoCardInteractions();
  initKidsStarTrail();
  initBentoSlideIn();
});

function initHeroCanvasScrubber() {
  const canvas = document.getElementById('heroScrubCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const statusEl = document.getElementById('heroStatusVal');
  const altEl = document.getElementById('heroAltVal');

  const frameCount = 200;
  const currentFrame = index =>
    `img/nuri_frames/ezgif-frame-${String(index + 1).padStart(3, '0')}.jpg`;

  const images = [];
  const playhead = { frame: 0 };

  function resizeCanvas() {
    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';

    renderFrame(playhead.frame);
  }

  function renderFrame(index) {
    let img = images[index];

    if (!img || !img.complete) {
      for (let i = index - 1; i >= 0; i--) {
        if (images[i] && images[i].complete) {
          img = images[i];
          break;
        }
      }
    }
    if (!img || !img.complete) img = images[0];
    if (!img || !img.complete) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    const logicalWidth = window.innerWidth;
    const logicalHeight = window.innerHeight;

    // 전체 해상도 버퍼 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasRatio = logicalWidth / logicalHeight;
    const imgRatio = img.width / img.height;
    let drawW, drawH, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawW = logicalWidth;
      drawH = logicalWidth / imgRatio;
    } else {
      drawW = logicalHeight * imgRatio;
      drawH = logicalHeight;
    }
    drawX = (logicalWidth - drawW) / 2;
    drawY = (logicalHeight - drawH) / 2;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  }

  let loadedCount = 0;
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
      loadedCount++;
      if (loadedCount === 1) resizeCanvas();
    };
    images.push(img);
  }

  window.addEventListener('resize', resizeCanvas);

  // GSAP ScrollTrigger 통합 스크러빙 & 핫스팟 제어
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(playhead, {
      frame: frameCount - 1,
      ease: "none",
      scrollTrigger: {
        id: "heroScrollTrigger",
        trigger: "#heroScrubSection",
        start: "top top",
        end: "+=4000",
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        anticipatePin: 1,
        // GSAP pin이 부모에 주입하는 overflow:hidden 제거 → 하단 섹션 스크롤바 방지
        onPin: () => {
          const pinWrapper = document.querySelector('.gsap-marker-scroller-start, [data-gsap-pin]');
          if (pinWrapper) pinWrapper.style.overflow = 'visible';
          // pin 대상 부모 체인도 클리어
          let el = document.getElementById('heroScrubSection');
          while (el && el !== document.body) {
            const style = window.getComputedStyle(el);
            if (style.overflow === 'hidden') el.style.overflowY = 'visible';
            el = el.parentElement;
          }
        },
        onUnpin: () => {
          // unpin 후 bento section 스크롤바 확실히 제거
          const research = document.getElementById('researchSection');
          if (research) {
            research.style.overflowY = 'visible';
            research.style.height = 'auto';
          }
        },
        onUpdate: (self) => {
          const progress = self.progress;

          const frameIdx = Math.min(frameCount - 1, Math.floor(playhead.frame));
          renderFrame(frameIdx);

          if (altEl) altEl.innerText = (progress * 700.0).toFixed(1) + " KM";
          const velEl = document.getElementById('heroVelVal');
          if (velEl) velEl.innerText = (progress * 7.5).toFixed(2) + " KM/S";

          // 관제실 컴퍼스 HUD Pitch 각도 실시간 동적 연동 (+0.0° -> +85.0°)
          const compassPitchVal = document.getElementById('compassPitchVal');
          if (compassPitchVal) {
            const pitchDeg = (progress * 85.0).toFixed(1);
            compassPitchVal.innerText = `PITCH: +${pitchDeg}°`;
          }

          let statusStr = "READY TO LAUNCH";
          if (progress >= 0.15 && progress < 0.45) statusStr = "STAGE 1 IGNITION";
          else if (progress >= 0.45 && progress < 0.75) statusStr = "MECO & SEPARATION";
          else if (progress >= 0.75) statusStr = "ORBITAL INSERTION";
          if (statusEl) statusEl.innerText = statusStr;

          updateMissionTimelineDots(progress);

          // 스크롤 구간별 핫스팟 노출 제어
          let activeStage = null;
          if (progress >= 0.12 && progress <= 0.38) {
            activeStage = stagesData[0];
          } else if (progress >= 0.42 && progress <= 0.68) {
            activeStage = stagesData[1];
          } else if (progress >= 0.72 && progress <= 0.98) {
            activeStage = stagesData[2];
          }

          const hotspot = document.getElementById('scrubHotspot');
          if (activeStage && hotspot) {
            document.getElementById('hotspotTag').textContent = activeStage.tag;
            document.getElementById('hotspotTitle').textContent = activeStage.title;
            document.getElementById('hotspotDesc').textContent = activeStage.desc;

            hotspot.setAttribute('data-active-index', activeStage.stageNum - 1);
            hotspot.classList.add('is-visible');
          } else if (hotspot) {
            hotspot.classList.remove('is-visible');
          }


        }
      }
    });
  }
}

function initBentoCardInteractions() {
  const cards = document.querySelectorAll('.bento-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((centerY - y) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transition = 'border-color 0.3s, box-shadow 0.3s';
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s, box-shadow 0.3s';
      card.style.transform = '';
    });
  });
}

function initKidsStarTrail() {
  const canvas = document.getElementById('kidsStarTrailCanvas');
  const container = document.getElementById('view-kids');
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class StarParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 7 + 4;
      this.speedX = (Math.random() - 0.5) * 2.2;
      this.speedY = (Math.random() - 0.5) * 2.2 - 0.8;
      this.color = `hsl(${Math.random() * 360}, 100%, 75%)`;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.015;
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

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left + container.scrollLeft;
    const y = e.clientY - rect.top + container.scrollTop;
    if (Math.random() < 0.6) particles.push(new StarParticle(x, y));
  });

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

// ==========================================
// RESEARCH FIELDS 벤토 그리드 좌우 슬라이드-인 GSAP 애니메이션
// ==========================================
function initBentoSlideIn() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const section = document.getElementById('researchSection');
  if (!section) return;

  const header   = section.querySelector('.bento-section-header');
  const mainCard = section.querySelector('.bento-main-card');
  const subCards = section.querySelectorAll('.bento-sub-card');

  if (!header && !mainCard && !subCards.length) return;

  const bentoTL = gsap.timeline({
    scrollTrigger: {
      trigger: '#researchSection',
      start: 'top 80%',
      toggleActions: 'play none none none',
      once: true
    }
  });

  if (header) {
    bentoTL.fromTo(header,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', clearProps: 'transform,opacity' }
    );
  }

  if (mainCard) {
    bentoTL.fromTo(mainCard,
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', clearProps: 'transform,opacity' },
      header ? '-=0.2' : 0
    );
  }

  if (subCards.length) {
    bentoTL.fromTo(subCards,
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out', clearProps: 'transform,opacity' },
      mainCard ? '-=0.5' : 0
    );
  }
}

function createSparkles(element) {
  const rect = element.getBoundingClientRect();
  const container = document.getElementById('view-kids');
  if (!container) return;

  for (let i = 0; i < 8; i++) {
    const star = document.createElement('span');
    star.className = 'star-sparkle-fx';
    star.innerText = ['✨', '⭐', '🎈', '🎉'][Math.floor(Math.random() * 4)];

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const centerX = rect.left + rect.width / 2 + scrollX;
    const centerY = rect.top + rect.height / 2 + scrollY;

    star.style.left = `${centerX}px`;
    star.style.top = `${centerY}px`;

    const angle = Math.random() * Math.PI * 2;
    const velocity = 40 + Math.random() * 50;
    star.style.setProperty('--tx', `${Math.cos(angle) * velocity}px`);
    star.style.setProperty('--ty', `${Math.sin(angle) * velocity}px`);

    container.appendChild(star);
    star.addEventListener('animationend', () => star.remove());
  }
}

// ==========================================
// 핫스팟 상세 제원 모달 이벤트 제어
// ==========================================
window.openStageDetailModal = function () {
  const hotspot = document.getElementById('scrubHotspot');
  const modal = document.getElementById('stageDetailModal');
  if (!hotspot || !modal) return;

  const activeIdx = parseInt(hotspot.getAttribute('data-active-index') || '0', 10);
  const data = stagesData[activeIdx];
  if (!data) return;

  document.getElementById('stageModalHeaderTitle').textContent = data.modalTitle;
  document.getElementById('stageModalBodyText').textContent = data.longDesc;

  modal.classList.add('is-open');
  const closeBtn = document.getElementById('closeStageModalBtn');
  if (closeBtn) closeBtn.focus();
};

window.closeStageDetailModal = function () {
  const modal = document.getElementById('stageDetailModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  const trigger = document.getElementById('hotspotModalOpenBtn');
  if (trigger) trigger.focus();
};

document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('hotspotModalOpenBtn');
  if (openBtn) openBtn.addEventListener('click', window.openStageDetailModal);

  const closeBtn = document.getElementById('closeStageModalBtn');
  if (closeBtn) closeBtn.addEventListener('click', window.closeStageDetailModal);

  const backdrop = document.getElementById('closeStageModalBackdrop');
  if (backdrop) backdrop.addEventListener('click', window.closeStageDetailModal);

  // Custom SF HUD Target Cursor Interaction 복원
  const dot = document.getElementById('hudCursorDot');
  const ring = document.getElementById('hudCursorRing');

  if (dot && ring) {
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

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate3d(-50%, -50%, 0)`;
    });

    function animateRing() {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      ringX += dx * 0.15;
      ringY += dy * 0.15;

      const isHovered = ring.classList.contains('hovered');
      const scale = isHovered ? 1.5 : 1.0;
      const angle = (Date.now() / 16) % 360;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate3d(-50%, -50%, 0) scale(${scale}) rotate(${angle}deg)`;

      requestAnimationFrame(animateRing);
    }
    requestAnimationFrame(animateRing);

    // 대화형 요소들에 호버 시 링 크기 확대 연출
    document.addEventListener('mouseover', (e) => {
      const target = e.target;
      const isInteractive = target.closest('a, button, select, .bento-sub-card, .clickable, .showcase-ctrl-btn, .banner-ctrl-btn, [role="button"], .btn-ctrl, .quick-question-chip');
      if (isInteractive) {
        ring.classList.add('hovered');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target;
      const isInteractive = target.closest('a, button, select, .bento-sub-card, .clickable, .showcase-ctrl-btn, .banner-ctrl-btn, [role="button"], .btn-ctrl, .quick-question-chip');
      if (isInteractive) {
        ring.classList.remove('hovered');
      }
    });


    // 인공위성 시스템 Bento Card 클릭 이벤트 복원
    const satBento = document.getElementById('bento-satellite');
    if (satBento) {
      satBento.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.openSatelliteModal();
      });
    }

    // GNB Mega Dropdown Menu Interaction
    const header = document.querySelector('.pro-header');
    const navLinks = document.querySelectorAll('.pro-nav a');
    const megaPanel = document.querySelector('.mega-menu-panel');
    const megaColumns = document.querySelectorAll('.mega-column');

    if (header && megaPanel) {
      let closeTimer = null;

      const openDropdown = () => {
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = null;
        }
        header.classList.add('is-dropdown-open');
      };

      const closeDropdown = () => {
        if (closeTimer) clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
          header.classList.remove('is-dropdown-open');
          megaColumns.forEach(col => {
            col.style.opacity = '1';
            col.style.transform = 'translateY(0)';
          });
          navLinks.forEach(link => link.classList.remove('active'));
        }, 150);
      };

      header.addEventListener('mouseenter', openDropdown);
      header.addEventListener('mouseleave', closeDropdown);

      navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
          openDropdown();
          const menuIdx = link.getAttribute('data-menu');
          
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          if (menuIdx !== null) {
            megaColumns.forEach(col => {
              const colIdx = col.getAttribute('data-index');
              if (colIdx === menuIdx) {
                col.style.opacity = '1';
                col.style.transform = 'translateY(-2px)';
                col.style.transition = 'all 0.25s ease';
              } else {
                col.style.opacity = '0.35';
                col.style.transform = 'translateY(0)';
                col.style.transition = 'all 0.25s ease';
              }
            });
          }
        });
      });

      megaColumns.forEach(col => {
        col.addEventListener('mouseenter', () => {
          openDropdown();
          const colIdx = col.getAttribute('data-index');
          
          navLinks.forEach(l => {
            if (l.getAttribute('data-menu') === colIdx) {
              l.classList.add('active');
            } else {
              l.classList.remove('active');
            }
          });

          megaColumns.forEach(c => {
            if (c === col) {
              c.style.opacity = '1';
              c.style.transform = 'translateY(-2px)';
            } else {
              c.style.opacity = '0.35';
              c.style.transform = 'translateY(0)';
            }
          });
        });
      });
    }
  }
});

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

  const dpr = Math.max(window.devicePixelRatio || 1, 2);
  const container = canvas.parentElement;
  const logicalWidth = container.clientWidth || window.innerWidth;
  const logicalHeight = container.clientHeight || window.innerHeight;

  if (canvas.width !== logicalWidth * dpr || canvas.height !== logicalHeight * dpr) {
    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    canvas.style.width = logicalWidth + 'px';
    canvas.style.height = logicalHeight + 'px';
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const canvasRatio = logicalWidth / logicalHeight;
  const imgRatio = img.width / img.height;
  let drawW, drawH, drawX, drawY;

  if (canvasRatio > imgRatio) {
    drawW = logicalWidth;
    drawH = logicalWidth / imgRatio;
  } else {
    drawW = logicalHeight * imgRatio;
    drawH = logicalHeight;
  }
  drawX = (logicalWidth - drawW) / 2;
  drawY = (logicalHeight - drawH) / 2;

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
  ctx.restore();
}

/**
 * 위성 모달 열기
 */
let satResetTimeout = null;
let isSatResetting = false;

window.openSatelliteModal = function() {
  const modal = document.getElementById('satelliteModal');
  const scrollBody = document.getElementById('satModalScrollBody');
  const stageText = document.getElementById('satStageText');
  const progressText = document.getElementById('satProgressText');
  const statusVal = document.getElementById('satStatusVal');
  const progressFill = document.getElementById('satScrubProgressFill');

  if (!modal || !scrollBody) return;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  scrollBody.scrollTop = 0;
  isSatResetting = false;

  if (statusVal) statusVal.textContent = "LOADING IMAGES...";
  if (progressText) progressText.textContent = "0%";
  if (progressFill) progressFill.style.width = '0%';

  preloadSatelliteImages(() => {
    if (statusVal) statusVal.textContent = "SYSTEM ACTIVE";
    renderSatFrame(0);
    updateSatScrub();
  });

  function updateSatScrub() {
    if (isSatResetting) return;

    const maxScroll = scrollBody.scrollHeight - scrollBody.clientHeight;
    if (maxScroll <= 0) return;

    const progress = Math.max(0, Math.min(1, scrollBody.scrollTop / maxScroll));
    const currentFrameIndex = Math.min(satFrameCount - 1, Math.floor(progress * satFrameCount));

    if (isSatImagesLoaded) {
      renderSatFrame(currentFrameIndex);
    }

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

    // 100% 완료 도달 감지 -> 자동 리플레이/처음으로 복귀 연출
    if (progress >= 0.99 && !isSatResetting) {
      isSatResetting = true;
      if (statusVal) {
        statusVal.textContent = "DISSOLUTION COMPLETED // RESTART IN 1S";
        statusVal.className = "sat-val green";
      }

      satResetTimeout = setTimeout(() => {
        if (typeof gsap !== 'undefined') {
          gsap.to(scrollBody, {
            scrollTop: 0,
            duration: 1.6,
            ease: "power2.inOut",
            onUpdate: () => {
              const currentProg = Math.max(0, Math.min(1, scrollBody.scrollTop / maxScroll));
              const frame = Math.min(satFrameCount - 1, Math.floor(currentProg * satFrameCount));
              renderSatFrame(frame);

              if (progressText) progressText.textContent = Math.floor(currentProg * 100) + "%";
              if (progressFill) progressFill.style.width = (currentProg * 100) + "%";
              if (statusVal) statusVal.textContent = "AUTO REWINDING...";
            },
            onComplete: () => {
              isSatResetting = false;
              if (statusVal) {
                statusVal.textContent = "SYSTEM ACTIVE";
                statusVal.className = "sat-val green";
              }
              if (stageText) stageText.textContent = "[STAGE 1] 전력 공급계 - 태양전지판 전개 분해";
            }
          });
        } else {
          // Fallback
          scrollBody.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => {
            isSatResetting = false;
            if (statusVal) {
              statusVal.textContent = "SYSTEM ACTIVE";
            }
          }, 1000);
        }
      }, 1000);
    }
  }

  modal.onwheel = (e) => {
    if (isSatResetting) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    scrollBody.scrollTop += e.deltaY * 0.7;
    updateSatScrub();
  };

  scrollBody.onscroll = updateSatScrub;
  window.addEventListener('resize', onSatCanvasResize);
};

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
window.closeSatelliteModal = function() {
  const modal = document.getElementById('satelliteModal');
  const scrollBody = document.getElementById('satModalScrollBody');
  if (modal) {
    modal.classList.remove('active');
    modal.onwheel = null;
  }
  if (satResetTimeout) {
    clearTimeout(satResetTimeout);
    satResetTimeout = null;
  }
  if (scrollBody && typeof gsap !== 'undefined') {
    gsap.killTweensOf(scrollBody);
  }
  isSatResetting = false;
  document.body.style.overflow = '';
  window.removeEventListener('resize', onSatCanvasResize);
};

// ESC 키로 위성 모달 닫기 바인딩
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeSatelliteModal();
  }
});

/**
 * ==========================================================================
 * KARI AI FLIGHT ASSISTANT CHATBOT INTERACTION
 * ==========================================================================
 */

window.openKariChatModal = function() {
  const modal = document.getElementById('kariChatModal');
  if (modal) {
    modal.classList.add('active');
    const input = document.getElementById('chatInputText');
    if (input) setTimeout(() => input.focus(), 100);
  }
};

window.closeKariChatModal = function() {
  const modal = document.getElementById('kariChatModal');
  if (modal) {
    modal.classList.remove('active');
  }
};

window.sendQuickQuestion = function(questionText) {
  const input = document.getElementById('chatInputText');
  if (input) {
    input.value = questionText;
    window.sendUserChatMessage();
  }
};

window.sendUserChatMessage = function() {
  const input = document.getElementById('chatInputText');
  const chatMessagesList = document.getElementById('chatMessagesList');
  if (!input || !chatMessagesList) return;

  const userText = input.value.trim();
  if (!userText) return;

  // 1. 사용자 메시지 렌더링
  const userMsgDiv = document.createElement('div');
  userMsgDiv.className = 'chat-message user-message';
  userMsgDiv.innerHTML = `
    <div class="msg-bubble">${escapeHtml(userText)}</div>
    <span class="msg-timestamp">${getFormattedTime()}</span>
  `;
  chatMessagesList.appendChild(userMsgDiv);
  input.value = '';
  scrollChatToBottom();

  // 2. AI 타이핑 인디케이터 표시
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message ai-message typing-indicator-msg';
  typingDiv.innerHTML = `
    <div class="msg-bubble">
      <div class="typing-loader">
        <span></span><span></span><span></span>
      </div>
    </div>
    <span class="msg-timestamp">ANALYZING QUERY...</span>
  `;
  chatMessagesList.appendChild(typingDiv);
  scrollChatToBottom();

  // 3. 비동기 답변 생성 (1000ms 지연)
  setTimeout(() => {
    const typingMsg = chatMessagesList.querySelector('.typing-indicator-msg');
    if (typingMsg) typingMsg.remove();

    const responseText = getAiChatbotResponse(userText);

    const aiMsgDiv = document.createElement('div');
    aiMsgDiv.className = 'chat-message ai-message';
    aiMsgDiv.innerHTML = `
      <div class="msg-bubble">${responseText}</div>
      <span class="msg-timestamp">AI ASSISTANT SYSTEM</span>
    `;
    chatMessagesList.appendChild(aiMsgDiv);
    scrollChatToBottom();
  }, 1000);
};

// 테마 변경에 따라 챗봇 외견 변경
window.updateChatbotTheme = function(themeName) {
  const botAvatarImg = document.getElementById('botAvatarImg');
  const dialogueText = document.getElementById('botDialogueText');
  const actionBtn = document.getElementById('botActionBtn');

  if (!botAvatarImg || !dialogueText || !actionBtn) return;

  if (themeName === 'kids') {
    botAvatarImg.src = botAvatarImg.getAttribute('data-kids') || 'img/robot02.jpg';
    dialogueText.textContent = "안녕! 우주봇이야 🛰️";
    actionBtn.textContent = "우주 로봇이랑 대화하기 🎈";
  } else {
    botAvatarImg.src = botAvatarImg.getAttribute('data-default') || 'img/researcher.jpg';
    dialogueText.textContent = "궁금한 우주 기술이 있으신가요?";
    actionBtn.textContent = "KARI 연구원과 대화하기 💬";
  }
};

function scrollChatToBottom() {
  const list = document.getElementById('chatMessagesList');
  if (list) {
    list.scrollTop = list.scrollHeight;
  }
}

function getFormattedTime() {
  const now = new Date();
  const hr = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${hr}:${min}`;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// 질문에 따른 AI 지식 매핑 답변 리포트
function getAiChatbotResponse(query) {
  const q = query.toLowerCase();
  const isKids = document.body.classList.contains('kids-mode');

  if (isKids) {
    if (q.includes('누리호') && q.includes('엔진')) {
      return `🚀 <strong>누리호 로켓 엔진 이야기</strong>:<br>
      - <strong>힘센 심장</strong>: 누리호 로켓 엔진은 아주아주 강력한 불꽃을 내뿜는 쇠로 만든 심장이야!<br>
      - <strong>75톤의 힘</strong>: 엔진 1개가 엄청 큰 코끼리 15마리를 한 번에 들어 올릴 만큼 아주 힘이 세단다!<br>
      - <strong>엔진 4개 합체</strong>: 로켓 맨 아래에 이 엔진 4개가 힘을 합쳐서 총 300톤의 무서운 추진력으로 하늘 높이 날아올라!`;
    }
    if (q.includes('아리랑') || q.includes('위성')) {
      return `🛰️ <strong>아리랑 인공위성 이야기</strong>:<br>
      - <strong>우주 카메라</strong>: 아리랑 위성은 지구에서 700km나 떨어진 아주 높은 우주 상공에서 지구를 찰칵찰칵 선명하게 찍는 멋쟁이 카메라야!<br>
      - <strong>태양빛 충전기</strong>: 파란색 날개처럼 생긴 태양전지판을 쫙 펴서 햇빛을 받으며 배터리를 충전한단다.`;
    }
    if (q.includes('로드맵') || q.includes('차세대')) {
      return `🔬 <strong>앞으로의 차세대 우주 탐사선 계획</strong>:<br>
      - <strong>더 튼튼한 로켓</strong>: KARI 삼촌들과 이모들은 지금보다 더 크고 더 힘이 센 새로운 로켓을 준비하고 있어!<br>
      - <strong>달나라 여행</strong>: 2032년쯤에는 우리 손으로 만든 예쁜 우주선을 달나라 표면에 착륙시켜서 탐험할 계획이란다. 정말 멋지지?`;
    }
    if (q.includes('안녕') || q.includes('반갑')) {
      return `안녕! 🚀 나는 우주봇이야! 누리호 로켓 엔진이나 인공위성에 대해 궁금한 게 있다면 아래 버튼을 누르거나 나에게 친근하게 물어봐줘!`;
    }
    return `🤖 <strong>우주봇이 알려줄게!</strong>:<br>
    - 보내준 "${escapeHtml(query)}"에 대해 우주 컴퓨터로 열심히 찾아보고 있어!<br>
    - 로켓 엔진 불꽃 놀이, 하늘을 나는 인공위성 카메라, 미래의 달나라 탐험선에 대해 질문해주면 아주 재미있게 들려줄게!`;
  }

  // 일반(프로) 모드일 때
  if (q.includes('누리호') && q.includes('엔진')) {
    return `🚀 <strong>누리호 75톤급 액체엔진 제어 스펙</strong>:<br>
    - <strong>연료/산화제</strong>: 케로신(Jet-A1) 및 액체산소(LOX) 추진 매핑<br>
    - <strong>가스발생기 사이클</strong>: 고압 터보펌프 동력구동 연소방식<br>
    - <strong>클러스터링</strong>: 1단부 75톤급 4기 정밀 연동 (총 300톤 추력 제어)<br>
    - <strong>Gimbaling</strong>: 유압식 피치/요 짐벌 서보 액추에이터 제어를 통해 비행 궤적 각도를 실시간 정밀 트래킹합니다.`;
  }
  if (q.includes('아리랑') || q.includes('위성')) {
    return `🛰️ <strong>다목적실용위성(아리랑) 관제 스펙</strong>:<br>
    - <strong>임무</strong>: 700km 서브미터급(초고해상도) 광학 관측 및 지구관측 합성개구레이더(SAR) 임무 수행<br>
    - <strong>탑재체(EOS)</strong>: 반사경 렌즈 및 고감도 CCD 센서 정밀 결합<br>
    - <strong>전력 제어</strong>: 태양 입사각 트래킹 구동계를 통해 실시간 태양전지판 전개각을 모션 보정합니다.`;
  }
  if (q.includes('로드맵') || q.includes('차세대')) {
    return `🔬 <strong>KARI 우주 개발 차세대 로드맵</strong>:<br>
    - <strong>1단계</strong>: 누리호 반복 발사를 통한 기술 신뢰성 검증<br>
    - <strong>2단계</strong>: 100톤급 다단연소사이클 다목적 액체엔진 장착 차세대 발사체 개발 착수<br>
    - <strong>3단계</strong>: 달 착륙선 독자 수송 능력 확보 및 유무선 심우주 탐사국가로의 도약.`;
  }
  if (q.includes('안녕') || q.includes('반갑')) {
    return `반갑습니다! 관제실 AI 비서입니다. KARI 누리호 발사체나 아리랑 위성에 대해 물어보시면 상세히 안내해 드립니다. 무엇이 궁금하신가요?`;
  }
  
  return `🤖 <strong>관제실 AI 비서 시스템 분석 결과</strong>:<br>
  - 문의하신 "${escapeHtml(query)}" 관련 데이터베이스를 스캔 중입니다.<br>
  - 한국항공우주연구원(KARI)은 독자적인 우주 수송 시스템 및 국가 저궤도 위성망 자립화에 매진하고 있습니다.<br>
  - 발사체 75톤 엔진 작동 구조, 위성 탑재체(EOS) 구성도, 차세대 달탐사 계획에 관해 질문해 주시면 실시간 리포트를 출력해 드릴 수 있습니다.`;
}

/**
 * ==========================================================================
 * KARI ACCESSIBILITY (A11Y) & SITE SITEMAP OVERLAY CONTROLLER
 * ==========================================================================
 */

// A11y 설정 메뉴 토글
window.toggleA11yMenu = function() {
  const modal = document.getElementById('a11ySettingsModal');
  if (modal) {
    modal.classList.toggle('active');
  }
};

// 폰트 크기 변경
window.setA11yFontSize = function(size) {
  const body = document.body;
  const kidsView = document.getElementById('view-kids');
  const btnNormal = document.getElementById('a11yTextNormal');
  const btnLarge = document.getElementById('a11yTextLarge');
  const kidsBtn = document.getElementById('kidsFontSizeBtn');

  if (size === 'large') {
    body.classList.add('a11y-text-large');
    if (kidsView) kidsView.classList.add('kids-font-large');
    kidsFontLarge = true;
    if (btnLarge) btnLarge.classList.add('active');
    if (btnNormal) btnNormal.classList.remove('active');
    if (kidsBtn) {
      kidsBtn.textContent = '글자 보통 크기 🔍';
      kidsBtn.classList.add('active');
    }
  } else {
    body.classList.remove('a11y-text-large');
    if (kidsView) kidsView.classList.remove('kids-font-large');
    kidsFontLarge = false;
    if (btnNormal) btnNormal.classList.add('active');
    if (btnLarge) btnLarge.classList.remove('active');
    if (kidsBtn) {
      kidsBtn.textContent = '글자 크게 보기 🔍';
      kidsBtn.classList.remove('active');
    }
  }
};

// 고대비 토글
window.toggleA11yHighContrast = function() {
  const body = document.body;
  const btn = document.getElementById('a11yContrastBtn');
  if (!btn) return;

  const isHC = body.classList.toggle('a11y-high-contrast');
  if (isHC) {
    btn.textContent = "고대비 ON";
    btn.classList.add('active');
  } else {
    btn.textContent = "고대비 OFF";
    btn.classList.remove('active');
  }
};

// 스크린 리더 음성 상태 토글
let isA11yVoiceActive = false;
window.toggleA11yVoiceHelp = function() {
  const btn = document.getElementById('a11yVoiceBtn');
  if (!btn) return;

  isA11yVoiceActive = !isA11yVoiceActive;
  if (isA11yVoiceActive) {
    btn.textContent = "해설 켜짐 🔊";
    btn.classList.add('active');
    const liveStatus = document.getElementById('srLiveStatus');
    if (liveStatus) {
      liveStatus.innerText = "정보 접근성 음성 해설 시스템이 작동하기 시작했습니다.";
    }
  } else {
    btn.textContent = "해설 끄기 🔇";
    btn.classList.remove('active');
  }
};

// 전체 사이트맵 모달 토글 (allMenuOverlay 연동)
window.toggleSitemapModal = function() {
  if (typeof window.toggleAllMenuOverlay === 'function') {
    window.toggleAllMenuOverlay();
  } else {
    const overlay = document.getElementById('allMenuOverlay') || document.getElementById('sitemapModal');
    if (overlay) overlay.classList.toggle('is-open');
  }
};

// DOM 로드 즉시 햄버거 메뉴 이벤트 링킹
document.addEventListener('DOMContentLoaded', () => {
  const sitemapTrigger = document.querySelector('.hamburger') || document.getElementById('menuToggleBtn');
  if (sitemapTrigger) {
    sitemapTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.toggleAllMenuOverlay();
    });
  }
});

/**
 * ==========================================================================
 * KIDS MODE ACCESSIBILITY BUTTON CONTROLLERS
 * ==========================================================================
 */

// 1. 움직임 멈추기 / 재개 토글
let kidsMotionStopped = false;
window.toggleKidsMotion = function() {
  const btn = document.getElementById('kidsMotionBtn');
  kidsMotionStopped = !kidsMotionStopped;

  if (kidsMotionStopped) {
    // CSS animation-play-state: paused 적용
    document.querySelectorAll(
      '.cartoon-rocket-art, #kidsRocket, .rocket-flame-burst, .launch-smoke, ' +
      '.orbit-planet, .kids-star, .float-ufo, .shooting-star, [class*="animate"]'
    ).forEach(el => {
      el.style.animationPlayState = 'paused';
    });
    if (btn) {
      btn.textContent = '움직임 재개 ▶️';
      btn.style.borderColor = '#ef4444';
      btn.style.color = '#ef4444';
    }
  } else {
    document.querySelectorAll(
      '.cartoon-rocket-art, #kidsRocket, .rocket-flame-burst, .launch-smoke, ' +
      '.orbit-planet, .kids-star, .float-ufo, .shooting-star, [class*="animate"]'
    ).forEach(el => {
      el.style.animationPlayState = 'running';
    });
    if (btn) {
      btn.textContent = '움직임 멈추기 ⏸️';
      btn.style.borderColor = '';
      btn.style.color = '';
    }
  }
};

// 2. 글자 크게 보기 토글 (화면 비율 맞춤형 고해상도 글자 확대)
let kidsFontLarge = false;
window.toggleKidsFontSize = function() {
  const btn = document.getElementById('kidsFontSizeBtn');
  kidsFontLarge = !kidsFontLarge;

  const kidsView = document.getElementById('view-kids');
  const body = document.body;

  if (kidsFontLarge) {
    if (kidsView) kidsView.classList.add('kids-font-large');
    body.classList.add('a11y-text-large');
    if (btn) {
      btn.textContent = '글자 보통 크기 🔍';
      btn.classList.add('active');
      btn.style.borderColor = '#0284c7';
      btn.style.color = '#0284c7';
      btn.style.background = '#e0f2fe';
    }
  } else {
    if (kidsView) kidsView.classList.remove('kids-font-large');
    body.classList.remove('a11y-text-large');
    if (btn) {
      btn.textContent = '글자 크게 보기 🔍';
      btn.classList.remove('active');
      btn.style.borderColor = '';
      btn.style.color = '';
      btn.style.background = '';
    }
  }
};

// 3. TTS(Text-to-Speech) 소리로 듣기
let kidsTTSUtterance = null;
window.playKidsTTS = function(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;

  const text = el.innerText || el.textContent;
  if (!text) return;

  // 이미 말하는 중이면 중지
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  kidsTTSUtterance = new SpeechSynthesisUtterance(text);
  kidsTTSUtterance.lang = 'ko-KR';
  kidsTTSUtterance.rate = 0.9;   // 어린이 친화적 약간 느린 속도
  kidsTTSUtterance.pitch = 1.1;  // 약간 높은 음색

  // 한국어 음성 선택 (있을 경우)
  const voices = window.speechSynthesis.getVoices();
  const koVoice = voices.find(v => v.lang.startsWith('ko'));
  if (koVoice) kidsTTSUtterance.voice = koVoice;

  window.speechSynthesis.speak(kidsTTSUtterance);
};

// 음성 목록 로드 후 재시도 보장 (일부 브라우저는 비동기 로드)
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    // voices 업데이트 시 준비 완료 상태 갱신
    window.speechSynthesis.getVoices();
  };
}

// 4. 키즈 히어로 로켓 발사 (출발하기 버튼 연동)
let isKidsRocketLaunching = false;
window.launchKidsRocket = function() {
  if (isKidsRocketLaunching) return;

  const heroFrame = document.getElementById('kidsHeroFrame');
  const rocketWrapper = document.getElementById('kidsRocketWrapper');
  const btn = document.getElementById('kidsLaunchBtn');

  if (!heroFrame || !rocketWrapper) return;

  isKidsRocketLaunching = true;

  // 1) 발사 준비 진동 (shaking) 및 버튼 상태 변경
  rocketWrapper.classList.add('shaking');

  if (btn) {
    btn.classList.add('clicked');
    btn.disabled = true;
    btn.innerHTML = '카운트다운... 3! 2! 1! 🚀';
    btn.style.opacity = '0.85';
  }

  // 음성 TTS 안내
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const launchAudio = new SpeechSynthesisUtterance("3, 2, 1, 카운트다운! 로켓 발사!");
      launchAudio.lang = 'ko-KR';
      launchAudio.rate = 1.0;
      launchAudio.pitch = 1.2;

      const voices = window.speechSynthesis.getVoices();
      const koVoice = voices.find(v => v.lang.startsWith('ko'));
      if (koVoice) launchAudio.voice = koVoice;

      window.speechSynthesis.speak(launchAudio);
    } catch(e) {
      console.warn("Launch TTS error:", e);
    }
  }

  // 2) 0.5초 후 화염 점화 및 상공 수직 발사 (launching)
  setTimeout(() => {
    rocketWrapper.classList.remove('shaking');
    heroFrame.classList.add('launching');
    rocketWrapper.classList.add('launching');

    if (btn) {
      btn.innerHTML = '우주로 출발 중! 🌌🚀';
    }
  }, 500);

  // 3) 3.5초 후 발사 완료 및 발사대 복귀 리셋
  setTimeout(() => {
    heroFrame.classList.remove('launching');
    rocketWrapper.classList.remove('launching');

    if (btn) {
      btn.classList.remove('clicked');
      btn.disabled = false;
      btn.innerHTML = '다시 출발하기 🚀';
      btn.style.opacity = '1';
    }
    isKidsRocketLaunching = false;
  }, 3500);
};

// ==========================================
// KARI 2-DEPTH FULL SITEMAP OVERLAY CONTROLLER
// ==========================================
let allMenuLastFocusedElement = null;

window.toggleAllMenuOverlay = function() {
  const overlay = document.getElementById('allMenuOverlay');
  if (!overlay) return;

  if (overlay.classList.contains('is-open')) {
    closeAllMenuOverlay();
  } else {
    openAllMenuOverlay();
  }
};

window.openAllMenuOverlay = function() {
  const overlay = document.getElementById('allMenuOverlay');
  if (!overlay) return;

  allMenuLastFocusedElement = document.activeElement;
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // 첫 번째 포커스 가능 요소로 접근성 초점 이동
  const firstFocusable = overlay.querySelector('.all-menu-close-btn, .sub-menu-list a');
  if (firstFocusable) {
    setTimeout(() => firstFocusable.focus(), 80);
  }
};

window.closeAllMenuOverlay = function() {
  const overlay = document.getElementById('allMenuOverlay');
  if (!overlay) return;

  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (allMenuLastFocusedElement && typeof allMenuLastFocusedElement.focus === 'function') {
    allMenuLastFocusedElement.focus();
  } else {
    const hamburger = document.getElementById('menuToggleBtn');
    if (hamburger) hamburger.focus();
  }
};

// 기존 햄버거/사이트맵 호출 호환성 유지
window.toggleSitemapModal = function() {
  window.toggleAllMenuOverlay();
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('allMenuOverlay');
    if (overlay && overlay.classList.contains('is-open')) {
      closeAllMenuOverlay();
    }
  }
});

// ==========================================
// KARI NEWSROOM TAB CONTROLLER
// ==========================================
const kariNewsData = {
  notice: [
    { title: "[공고] 2026년도 차세대 다목적 정지궤도 위성 지상체 개발 공모", date: "2026.08.28" },
    { title: "국가연구소 보유 미래 모빌리티 특허 기술이전 안내 설명회", date: "2026.08.15" },
    { title: "한국항공우주연구원 개방형 우주 데이터 활용 공모전 본선 결과", date: "2026.08.10" },
    { title: "대덕특구 산학연동 연구장비 공동활용 지원사업 마감 안내", date: "2026.08.05" }
  ],
  press: [
    { title: "[보도자료] 누리호 4차 발사용 75톤급 기체 종합 연소시험 성공 완료", date: "2026.08.26" },
    { title: "[보도자료] 다누리 달 궤도선, 달 뒷면 고해상도 지형 데이터 추가 공개", date: "2026.08.18" },
    { title: "[보도자료] KARI-우주항공청, 차세대 중형위성 3호 탑재체 최종 점검 완료", date: "2026.08.08" },
    { title: "[보도자료] 한국형 위성항법시스템(KPS) 지상국 인프라 기공식 개최", date: "2026.07.29" }
  ],
  recruit: [
    { title: "[채용] 2026년도 하반기 KARI 정규직 연구원 및 정규직 기술원 공개채용", date: "2026.08.25" },
    { title: "[채용] 우주발사체연구소 전문임기제 연구원 채용 공고", date: "2026.08.14" },
    { title: "[채용] 위성우주탐사시험센터 포스닥(Post-Doc) 신규 연구원 모집", date: "2026.08.02" },
    { title: "[채용] 2026년도 KARI 체험형 청년인턴 모집 공고", date: "2026.07.20" }
  ]
};

window.switchNewsTab = function(category, btnElement) {
  const tabBtns = document.querySelectorAll('.news-tabs .tab-btn');
  tabBtns.forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  const container = document.getElementById('newsListContainer');
  if (!container || !kariNewsData[category]) return;

  container.style.opacity = '0';
  setTimeout(() => {
    const listHtml = kariNewsData[category].map(item => `
      <li>
        <span class="news-text">${item.title}</span>
        <span class="news-date">${item.date}</span>
      </li>
    `).join('');
    container.innerHTML = listHtml;
    container.style.opacity = '1';
  }, 150);
};