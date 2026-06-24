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
       4. 우측 하단 고정 방사형 메뉴 (Radial FAB) 애니메이션 매커니즘 교정 (툴팁 마비 버그 수정)
       ========================================================================== */
  let menuActive = false;
  const $mainBtn = $('.fab-main-btn');
  const $menuItems = $('.menu-items .item');

  $mainBtn.on('click', function (e) {
    e.preventDefault();
    e.stopPropagation(); // 부모 레이어로 클릭이 번지는 현상 차단
    menuActive = !menuActive;

    if (menuActive) {
      // + 버튼을 45도 회전시켜 X 모양으로 변경
      gsap.to($mainBtn, { rotation: 45, duration: 0.3, ease: "power2.out" });

      // 각 아이콘 버튼들을 화면 안쪽으로 사방 전개 (겹침 방지 좌표 고정)
      gsap.to($('.gift'), { opacity: 1, x: -75, y: -75, duration: 0.4, ease: "back.out(1.5)" });
      gsap.to($('.more_matcha'), { opacity: 1, x: -115, y: 0, duration: 0.4, ease: "back.out(1.5)" });
      gsap.to($('.faq'), { opacity: 1, x: 0, y: -115, duration: 0.4, ease: "back.out(1.5)" });
    } else {
      // 📌 [수정] 다시 접을 때 원위치 리셋 및 인라인 opacity 속성을 완전히 제거하여 CSS 호버 엔진이 작동하도록 복구
      gsap.to($mainBtn, { rotation: 0, duration: 0.3, ease: "power2.out" });
      gsap.to($menuItems, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.in",
        clearProps: "all" // 🔥 핵심: 인라인 스타일에 남은 opacity, transform을 완전히 삭제하여 CSS 순정 상태로 환원합니다.
      });
    }
  });

  // 여백 공간 클릭 시 열려있던 메뉴 자동으로 닫아주는 편의성 코드
  $(document).on('click', function () {
    if (menuActive) {
      menuActive = false;
      gsap.to($mainBtn, { rotation: 0, duration: 0.3, ease: "power2.out" });

      // 📌 [수정] 여기서도 접힐 때 인라인 잔여 스타일을 깨끗하게 청소해 줍니다.
      gsap.to($menuItems, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.in",
        clearProps: "all" // 🔥 핵심: 인라인 스타일에 남은 투명도 잠금을 풀어버립니다.
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
     6. 상품 섹션 우측 페이지네이션 제어 바인딩 (기능 복원 및 매칭 엔진)
     ========================================================================== */
  const $gridWrapper = $('.product-right-grid-wrapper');
  const $grids = $gridWrapper.find('.product-right-grid');
  const $pagination = $('.prod-pagination');

  $pagination.on('click', '.page-num', function () {
    if ($(this).hasClass('active')) return;

    // 1. 페이지네이션 활성화 UI 변경
    $('.prod-pagination .page-num').removeClass('active');
    $(this).addClass('active');

    // 2. 클릭한 페이지 번호 인덱스 파악 (0부터 시작)
    const pageIndex = $('.prod-pagination .page-num').index(this);

    // 3. 해당하는 상품 그리드 판넬만 스위칭
    $grids.removeClass('active');
    $grids.eq(pageIndex).addClass('active');

    console.log("선택된 상품 페이지: ", $(this).text());
  });

  // 이전(<) / 다음(>) 화살표 버튼 클릭 인터랙션 결합
  $pagination.on('click', '.page-btn', function () {
    const $currentPage = $('.prod-pagination .page-num.active');
    let $targetPage;

    if ($(this).hasClass('prev-btn')) {
      // 이전 버튼 클릭 시
      $targetPage = $currentPage.prev('.page-num');
    } else if ($(this).hasClass('next-btn')) {
      // 다음 버튼 클릭 시
      $targetPage = $currentPage.next('.page-num');
    }

    // 이동할 대상 페이지가 존재할 때만 클릭 이벤트 강제 트리거 구동
    if ($targetPage && $targetPage.length) {
      $targetPage.trigger('click');
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
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  }
});

// ==========================================================================
// 📌 겟차 상품-리뷰 멀티 마키 리스트 스위칭 엔진 (페이지네이션 방식)
// ==========================================================================
$(document).ready(function() {
  // 왼쪽 상품 뷰어에 순차적으로 바인딩할 데이터 세트
  const reviewProducts = [
    { name: "팟 말차 쿠키", img: "images/pot_cookie_sticker.png" },
    { name: "꾹 말차 그래놀라", img: "images/gguk_granola_sticker.png" },
    { name: "쏙 말차 에스프레소", img: "images/ssock_coffee_sticker.png" },
    { name: "SYUK 단백질 쉐이크", img: "images/syuk_proteinshake_front.jpeg" }
  ];

  let currentReviewIdx = 0;
  const $allMarqueeLists = $(".review-marquee-inner");

  function changeReviewProductPage(nextIdx) {
    // 인덱스가 범위를 초과하면 무한 로테이션이 되도록 배열 길이 기반 나머지 연산 처리
    currentReviewIdx = (nextIdx + reviewProducts.length) % reviewProducts.length;
    const currentProd = reviewProducts[currentReviewIdx];

    // 1. 왼쪽 상품 뷰어 컴포넌트 실시간 업데이트
    $("#render-prod-img").attr("src", currentProd.img).attr("alt", currentProd.name);
    $("#render-prod-name").text(currentProd.name);

    // 2. 오른쪽 리뷰 마키 보드 스위칭 (.active 클래스 무빙 탈부착)
    $allMarqueeLists.removeClass("active");
    $allMarqueeLists.eq(currentReviewIdx).addClass("active");
  }

  // 기존 원본 이전/다음 버튼 이벤트 중복 방지 처리 후 깔끔하게 연결
  $("#getcha-review-section .next-btn").off("click").on("click", function() {
    changeReviewProductPage(currentReviewIdx + 1);
  });

  $("#getcha-review-section .prev-btn").off("click").on("click", function() {
    changeReviewProductPage(currentReviewIdx - 1);
  });
});