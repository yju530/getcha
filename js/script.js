$(function () {
  /* ==========================================================================
     2. 제이쿼리 모바일 햄버거 토글 개폐 바인딩
     ========================================================================== */
  $('#slide-open').on('click', function () { $('#slide').css('right', '0'); });
  $('#slide-close, .slide-links a').on('click', function () { $('#slide').css('right', '-100%'); });

  /* ==========================================================================
     3. GSAP ScrollTrigger 플러그인 등록
     ========================================================================== */
  gsap.registerPlugin(ScrollTrigger);

  /* ==========================================================================
     4. 스마트 반응형 가로 스크롤 매칭 엔진 (PC: 가로 고정 / 모바일: 세로 자동해제)
     ========================================================================== */
  let hScrollTrigger;
  function initHorizontalScroll() {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 601px)", () => {
      const container = document.querySelector(".scroll-container");
      hScrollTrigger = gsap.to(container, {
        x: () => -(container.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: "#portfolio",
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => "+=" + (container.scrollWidth - window.innerWidth),
          invalidateOnRefresh: true
        }
      });
    });

    mm.add("(max-width: 600px)", () => {
      if (hScrollTrigger) {
        hScrollTrigger.scrollTrigger.kill();
        gsap.set(".scroll-container", { clearProps: "transform" });
      }
    });
  }

  initHorizontalScroll();

  /* ==========================================================================
     5. 우측 하단 고정 방사형 메뉴 (Radial FAB) 스프링 인터랙션
     ========================================================================== */
  let menuActive = false;
  const $mainBtn = $('.fab-main-btn');
  const $menuItems = $('.menu-items .item');

  $mainBtn.on('click', function () {
    menuActive = !menuActive;

    if (menuActive) {
      gsap.to($mainBtn, { rotation: 45, duration: 0.3, ease: "power2.out" });

      $menuItems.each(function (index) {
        const angle = (index * 45) * (Math.PI / 180);
        const radius = 90;

        gsap.to($(this), {
          opacity: 1,
          x: -Math.sin(angle) * radius,
          y: -Math.cos(angle) * radius,
          duration: 0.5,
          delay: index * 0.05,
          ease: "back.out(1.7)"
        });
      });
    } else {
      gsap.to($mainBtn, { rotation: 0, duration: 0.3, ease: "power2.out" });
      gsap.to($menuItems, {
        opacity: 0,
        x: 0,
        y: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.in"
      });
    }
  });


  /* ==========================================================================
       GNB 메뉴 클릭 시 가로/세로 섹션별 스마트 부드러운 스크롤 인터랙션
     ========================================================================== */
  $('.nav-links a, .slide-links a').on('click', function (e) {
    e.preventDefault();

    const targetId = $(this).attr('href');
    const $target = $(targetId);

    if (!$target.length) return;

    if (window.innerWidth <= 600 || targetId !== '#portfolio') {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: $target.offset().top, autoKill: false },
        ease: "power2.inOut"
      });
    }
    else if (targetId === '#portfolio') {
      const trigger = ScrollTrigger.getById("hScrollTrigger") || ScrollTrigger.create({ trigger: "#portfolio" });

      if (trigger) {
        const scrollStart = trigger.start;
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: scrollStart, autoKill: false },
          ease: "power3.inOut"
        });
      }
    }

    if ($('#slide').css('right') === '0px') {
      $('#slide').css('right', '-100%');
    }
  });

}); // 메인 레디 구문 종료


// 글자 등장 패러랙스 로직
const hide = (item) => {
  gsap.set(item, { autoAlpha: 0 });
}

const animate = (item) => {
  let x = 0;
  let y = 0;
  let delay = item.dataset.delay;

  if (item.classList.contains("reveal_LTR")) {
    x = -100, y = 0
  } else if (item.classList.contains("reveal_BTT")) {
    x = 0, y = 100
  } else if (item.classList.contains("reveal_TTB")) {
    x = 0, y = -100
  } else {
    x = 100, y = 0;
  }

  gsap.fromTo(item,
    { autoAlpha: 0, x: x, y: y },
    { autoAlpha: 1, x: 0, y: 0, delay: delay, duration: 1.25, overwrite: "auto", ease: "expo" }
  );
};

gsap.utils.toArray(".reveal").forEach(item => {
  hide(item);

  ScrollTrigger.create({
    trigger: item,
    start: "top bottom",
    end: "bottom top",
    markers: false,
    onEnter: () => { animate(item) }
  });
});

// 우측 이미지 박스 호버 시 부모 패널 배경색 변경 인터랙션
$('.right-img').on('mouseenter', function () {
  $(this).closest('.panel').addClass('active-hover');
});

$('.right-img').on('mouseleave', function () {
  $(this).closest('.panel').removeClass('active-hover');
});

// ==========================================================================
// 5. ✨ [정상 교정] 모드 추천 팝업창 연동 제어 엔진 (HTML 버블 클래스 원형 보존)
// ==========================================================================

// 설명(desc) 데이터에 문단 나누기를 위한 <br> 태그 반영 수립
const modeDataMapping = {
  ssock: {
    title: "쏙 모드 (SSOCK)",
    desc: "생각은 줄이고, 몰입은 쏙!<br>깊게 빠지고 싶은 순간 최적의 집중 루틴을 시작해보세요.",
    img: "images/Ssock02.png"
  },
  gguk: {
    title: "꾹 모드 (GGUK)",
    desc: "흔들리는 하루를 꾹 눌러 안정 ON.<br>흐트러진 마음을 차분하게 정리하고 싶을 때.",
    img: "images/Gguk02.png"
  },
  pot: {
    title: "팟 모드 (POT)",
    desc: "멈춘 머릿속에 아이디어 팟!<br>새로운 시작과 영감이 필요한 리프레시 타임에 완벽해요.",
    img: "images/Pot02.png"
  },
  syuk: {
    title: "슉 모드 (SYUK)",
    desc: "고민은 짧게, 실행은 슉!<br>망설임 없이 바로 움직이고 싶을 때 강력한 생산성을 선사합니다.",
    img: "images/Syuk02.png"
  }
};

const $modeModal = $('#mode-modal');
const $whatsMyModeBtn = $('.btn-bubble'); // 기존 인트로 하단 무변형 버튼 타겟팅

// [A] "What's my mode?" 버튼 클릭 시 팝업 액티브 활성화
$whatsMyModeBtn.on('click', function (e) {
  e.preventDefault(); // 상단 튕김 현상 억제
  $('#modal-step-result').removeClass('active');
  $('#modal-step-question').addClass('active');
  $modeModal.addClass('show');
});

// [B] X 단추 및 바깥 여백 오버레이 클릭 시 모달 감추기
$('#modal-close-btn, #mode-modal').on('click', function (e) {
  if (e.target === this) {
    $modeModal.removeClass('show');
  }
});

// [C] 4개 선택지 문항 클릭 핸들러 (html 메서드 보정 처리 적용)
$('.option-btn').on('click', function () {
  const selectedModeKey = $(this).data('mode');
  const finalResult = modeDataMapping[selectedModeKey];

  if (finalResult) {
    // 결과 컨포넌트에 알맞은 이미지 주입
    $('#result-img').attr('src', finalResult.img);
    $('#result-title').text(finalResult.title);

    // 📌 핵심: .text()를 .html()로 변경하여 <br> 문단 쪼개기 효과 강제 활성화
    $('#result-desc').html(finalResult.desc);

    // 질문 노드를 가리고 결과 보기 노드 오픈 스위칭
    $('#modal-step-question').removeClass('active');
    $('#modal-step-result').addClass('active');
  }
});

// [D] 테스트 리트라이 돌려놓기 버튼
$('#modal-retry-btn').on('click', function () {
  $('#modal-step-result').removeClass('active');
  $('#modal-step-question').addClass('active');
});

// =================================
// Custom Mouse Cursor
// =================================

const cursor = document.querySelector(".custom-cursor");


document.addEventListener("mousemove", e => {

  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.15,
    ease: "power2.out"
  });

});


// 클릭 시 이미지 변경
document.addEventListener("mousedown", () => {

  cursor.classList.add("active");

});


document.addEventListener("mouseup", () => {

  cursor.classList.remove("active");

});
const hoverTargets = document.querySelectorAll(
  "a, button, .right-img, .intro-card"
);


hoverTargets.forEach(item => {


  item.addEventListener("mouseenter", () => {

    cursor.classList.add("active");

  });


  item.addEventListener("mouseleave", () => {

    cursor.classList.remove("active");

  });


});

// ==========================================================================
// 상품 섹션 좌측 Swiper 인스턴스 초기화 보정
// ==========================================================================
var swiper = new Swiper(".mySwiper", {
  loop: true,               /* 📌 무한 슬라이드 활성화 */
  speed: 800,               /* 슬라이드 전환 속도 (밀리초) */
  centeredSlides: true,
  autoplay: {
    delay: 3000,            /* 3초마다 자동 롤링 */
    disableOnInteraction: false, /* 유저가 터치하더라도 오토플레이 멈춤 방지 */
  },
  effect: "fade",           /* 💡 슬라이드 대신 페이드 효과를 주면 룩북 느낌이 한층 살아납니다 (원치 않으시면 이 줄을 지우세요) */
  fadeEffect: {
    crossFade: true
  }
});