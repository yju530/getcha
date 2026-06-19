$(function () {
  /* ==========================================================================
     1. 제이쿼리 모바일 햄버거 토글 개폐 바인딩
     ========================================================================== */
  $('#slide-open').on('click', function () { $('#slide').css('right', '0'); });
  $('#slide-close, .slide-links a').on('click', function () { $('#slide').css('right', '-100%'); });

  /* ==========================================================================
     2. GSAP ScrollTrigger 플러그인 등록
     ========================================================================== */
  gsap.registerPlugin(ScrollTrigger);

  /* ==========================================================================
     3. 스마트 반응형 가로 스크롤 매칭 엔진 (PC: 가로 고정 / 모바일: 세로 자동해제)
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
     4. 우측 하단 고정 방사형 메뉴 (Radial FAB) 스프링 인터랙션
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
     5. GNB 메뉴 클릭 시 가로/세로 섹션별 스마트 부드러운 스크롤 인터랙션
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

  /* ==========================================================================
     6. 상품 섹션 우측 페이지네이션 제어 바인딩
     ========================================================================== */
  $('.prod-pagination').on('click', '.page-num', function () {
    $('.prod-pagination .page-num').removeClass('active');
    $(this).addClass('active');
    console.log("선택된 상품 페이지: ", $(this).text());
  });

  /* ==========================================================================
     ✨ [추가 반영] 상품 하단 More 버튼 클릭 동작 완전 무력화 리스너
     ========================================================================== */
  $('.text-more').on('click', function (e) {
    e.preventDefault(); // 기본 링크 튕김 현상 원천 봉쇄
    e.stopPropagation(); // 부모 엘리먼트로의 이벤트 버블링 전파 차단
    // 아무런 팝업 및 모달 로직을 수행하지 않아 온전한 공백 상태를 유지합니다.
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
// 모드 추천 팝업창 연동 제어 엔진 (기존 인트로 섹션 What's my mode? 전용)
// ==========================================================================
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
const $whatsMyModeBtn = $('.brand-intro .btn-bubble'); // 브랜드 인트로 섹션 버튼만 한정 타겟팅하여 간섭 분리

$whatsMyModeBtn.on('click', function (e) {
  e.preventDefault(); 
  $('#modal-step-result').removeClass('active');
  $('#modal-step-question').addClass('active');
  $modeModal.addClass('show');
});

$('#modal-close-btn, #mode-modal').on('click', function (e) {
  if (e.target === this) {
    $modeModal.removeClass('show');
  }
});

$('.option-btn').on('click', function () {
  const selectedModeKey = $(this).data('mode');
  const finalResult = modeDataMapping[selectedModeKey];

  if (finalResult) {
    $('#result-img').attr('src', finalResult.img);
    $('#result-title').text(finalResult.title);
    $('#result-desc').html(finalResult.desc);

    $('#modal-step-question').removeClass('active');
    $('#modal-step-result').addClass('active');
  }
});

$('#modal-retry-btn').on('click', function () {
  $('#modal-step-result').removeClass('active');
  $('#modal-step-question').addClass('active');
});


// ==========================================================================
// Custom Mouse Cursor 인터랙션
// ==========================================================================
const cursor = document.querySelector(".custom-cursor");

document.addEventListener("mousemove", e => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.15,
    ease: "power2.out"
  });
});

document.addEventListener("mousedown", () => { cursor.classList.add("active"); });
document.addEventListener("mouseup", () => { cursor.classList.remove("active"); });

const hoverTargets = document.querySelectorAll("a, button, .right-img, .intro-card, .page-num, .page-btn");

hoverTargets.forEach(item => {
  item.addEventListener("mouseenter", () => { cursor.classList.add("active"); });
  item.addEventListener("mouseleave", () => { cursor.classList.remove("active"); });
});


// ==========================================================================
// 상품 섹션 좌측 Swiper 인스턴스 초기화 보정
// ==========================================================================
var swiper = new Swiper(".mySwiper", {
  loop: true,
  speed: 800,
  centeredSlides: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  effect: "fade",
  fadeEffect: {
    crossFade: true
  }
});