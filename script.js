/* ==========================================================================
   IvyInvi Online Invitation Platform - Guest View Logic
   ========================================================================== */

(function () {
  'use strict';

  // 1. CONFIGURATION INITIALIZATION
  // Luôn ưu tiên DEFAULT_INVITATION_CONFIG từ config.js (phiên bản chuẩn phát hành trên GitHub)
  let appConfig = {};
  if (typeof DEFAULT_INVITATION_CONFIG !== 'undefined' && DEFAULT_INVITATION_CONFIG) {
    appConfig = JSON.parse(JSON.stringify(DEFAULT_INVITATION_CONFIG));
  } else {
    try {
      const saved = localStorage.getItem('ivy_invitation_custom_config');
      if (saved) {
        appConfig = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading config from localStorage:', e);
    }
  }

  // Tự động dọn sạch các đường link nhạc hết hạn hoặc link ảnh cũ nếu còn sót lại trong cache
  if (appConfig.music && appConfig.music.audioUrl && appConfig.music.audioUrl.includes('pixabay.com')) {
    appConfig.music.audioUrl = 'assets/audio/background-music.wav';
  }
  if (appConfig.albumPhotos && appConfig.albumPhotos.length > 0) {
    if (appConfig.albumPhotos[0] && appConfig.albumPhotos[0].includes('photo-1523050854058')) {
      appConfig.albumPhotos[0] = 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=600&q=80';
    }
  }

  // 2. DOM ELEMENTS
  const elEnvelopeScreen = document.getElementById('envelope-screen');
  const btnOpenEnvelope = document.getElementById('btn-open-envelope');
  const elEnvelopeGuestName = document.getElementById('envelope-guest-name');
  const elEnvelopeEventType = document.getElementById('envelope-event-type');
  const elEnvelopeOwnerName = document.getElementById('envelope-owner-name');

  const elHeroEventType = document.getElementById('hero-event-type');
  const elHeroOwnerName = document.getElementById('hero-owner-name');
  const elHeroCoverPhoto = document.getElementById('hero-cover-photo');
  const elHeroCaption = document.getElementById('hero-caption');
  const elHeroQuote = document.getElementById('hero-quote');
  const elFooterOwnerName = document.getElementById('footer-owner-name');

  const elDisplayDateString = document.getElementById('display-date-string');
  const elDisplayTimeString = document.getElementById('display-time-string');
  const elDisplayVenueName = document.getElementById('display-venue-name');
  const elDisplayVenueAddress = document.getElementById('display-venue-address');
  const btnGoogleMaps = document.getElementById('btn-google-maps');
  const elDisplayContactBanner = document.getElementById('display-contact-banner');

  const elCalendarMonthYear = document.getElementById('calendar-month-year');
  const elCalendarGrid = document.getElementById('calendar-grid');

  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  const galleryContainer = document.getElementById('gallery-container');

  const wishForm = document.getElementById('wish-form');
  const wishAuthorInput = document.getElementById('wish-author-input');
  const wishMessageInput = document.getElementById('wish-message-input');
  const wishCharCount = document.getElementById('wish-char-count');
  const wishesListContainer = document.getElementById('wishes-list-container');

  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpOptions = document.querySelectorAll('.rsvp-option-btn');
  const rsvpNameInput = document.getElementById('rsvp-name-input');

  const vietqrImage = document.getElementById('vietqr-image');
  const displayBankName = document.getElementById('display-bank-name');
  const displayAccountNum = document.getElementById('display-account-num');
  const displayAccountHolder = document.getElementById('display-account-holder');
  const displayWishlistNote = document.getElementById('display-wishlist-note');
  const btnCopyAcc = document.getElementById('btn-copy-acc');
  const copyText = document.getElementById('copy-text');
  const bankingSection = document.getElementById('banking-section');

  const floatMusicBtn = document.getElementById('float-music-btn');
  const floatScrollBtn = document.getElementById('float-scroll-btn');
  const bgAudio = document.getElementById('bg-audio');

  const contactModal = document.getElementById('contact-modal');
  const triggerContactModal = document.getElementById('trigger-contact-modal');
  const contactLinkZalo = document.getElementById('contact-link-zalo');
  const contactLinkPhone = document.getElementById('contact-link-phone');
  const contactLinkFb = document.getElementById('contact-link-fb');

  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');

  let isAutoScrolling = false;
  let scrollInterval = null;
  let countdownTimerId = null;
  let activeRsvpStatus = 'yes';

  // 3. INITIALIZATION
  function init() {
    if (appConfig.eventType && appConfig.ownerName) {
      document.title = `${appConfig.eventType} - ${appConfig.ownerName} | HUIT`;
    }
    handleUrlParams();
    renderAll();
    setupEventListeners();
    setupAudio();
    startCountdown();
  }

  // Handle URL Query Parameters (e.g. ?to=Anh+Tuấn)
  function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const guestParam = params.get('to') || params.get('khach') || params.get('guest_name');
    if (guestParam) {
      elEnvelopeGuestName.textContent = `Thân mời: ${guestParam}`;
      if (wishAuthorInput) wishAuthorInput.value = guestParam;
      if (rsvpNameInput) rsvpNameInput.value = guestParam;
    }
  }

  // Render all UI components
  function renderAll() {
    // Envelope Info
    elEnvelopeEventType.textContent = appConfig.eventType || 'LỄ TỐT NGHIỆP';
    elEnvelopeOwnerName.textContent = appConfig.ownerName || 'QUANG HUY';

    // Hero Section
    elHeroEventType.textContent = appConfig.eventType || 'LỄ TỐT NGHIỆP';
    elHeroOwnerName.textContent = appConfig.ownerName || 'QUANG HUY';
    if (elFooterOwnerName) elFooterOwnerName.textContent = appConfig.ownerName || 'Quang Huy';
    if (appConfig.coverPhoto) {
      elHeroCoverPhoto.src = appConfig.coverPhoto;
    }
    if (appConfig.coverCaption) {
      elHeroCaption.textContent = appConfig.coverCaption;
    }
    elHeroQuote.textContent = appConfig.quote || '';

    // Date & Venue Details
    renderEventDateTime();
    renderCalendar();

    elDisplayVenueName.textContent = appConfig.venueName || '';
    elDisplayVenueAddress.textContent = appConfig.venueAddress || '';
    if (appConfig.googleMapsUrl) {
      btnGoogleMaps.href = appConfig.googleMapsUrl;
      btnGoogleMaps.style.display = 'inline-flex';
    } else {
      btnGoogleMaps.style.display = 'none';
    }

    // Contact Banner & Modal
    if (appConfig.contact) {
      if (appConfig.contact.bannerText) {
        elDisplayContactBanner.textContent = appConfig.contact.bannerText;
      } else {
        elDisplayContactBanner.textContent = `Liên hệ với ${appConfig.ownerName || 'chủ tiệc'} khi đến nơi nhé`;
      }

      const elContactOwner = document.getElementById('contact-modal-owner');
      if (elContactOwner) elContactOwner.textContent = appConfig.ownerName || 'Chủ tiệc';

      const phoneStr = appConfig.contact.phone || '';
      const zaloStr = appConfig.contact.zaloPhone || phoneStr;

      contactLinkZalo.href = `https://zalo.me/${zaloStr}`;
      const elValZalo = document.getElementById('contact-val-zalo');
      if (elValZalo) elValZalo.textContent = zaloStr || 'Liên hệ qua Zalo';

      contactLinkPhone.href = `tel:${phoneStr}`;
      const elValPhone = document.getElementById('contact-val-phone');
      if (elValPhone) elValPhone.textContent = phoneStr || 'Gọi điện thoại';
      
      if (appConfig.contact.facebookUrl) {
        contactLinkFb.href = appConfig.contact.facebookUrl;
        contactLinkFb.style.display = 'flex';
      } else {
        contactLinkFb.style.display = 'none';
      }
    }

    // Photo Gallery (Trượt ngang hoặc Để dọc)
    renderGallery();

    // Banking & VietQR
    renderBanking();

    // Wishes Feed (Không có lời chúc mẫu)
    renderWishesList();
  }

  // Format and display Vietnamese event date string
  function renderEventDateTime() {
    if (!appConfig.eventDate) return;
    try {
      const parts = appConfig.eventDate.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);

      const d = new Date(year, month - 1, day);
      const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = daysOfWeek[d.getDay()];

      const formattedDay = day < 10 ? `0${day}` : day;
      const formattedMonth = month < 10 ? `0${month}` : month;

      elDisplayDateString.textContent = `${dayName}, ${formattedDay}.${formattedMonth}.${year}`;

      let timeStr = `Vào lúc: ${appConfig.eventTime || '08:00'}`;
      if (appConfig.eventEndTime) {
        timeStr += ` - ${appConfig.eventEndTime}`;
      }
      elDisplayTimeString.innerHTML = `<i class="fa-regular fa-clock"></i> ${timeStr}`;
    } catch (e) {
      console.error(e);
    }
  }

  // Dynamic Mini Calendar Generator
  function renderCalendar() {
    if (!appConfig.eventDate) return;
    const parts = appConfig.eventDate.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const targetDay = parseInt(parts[2], 10);

    elCalendarMonthYear.textContent = `Tháng ${month} / ${year}`;
    elCalendarGrid.innerHTML = '';

    // Day headers (T2 - CN)
    const headers = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    headers.forEach(h => {
      const div = document.createElement('div');
      div.className = 'calendar-day-name';
      div.textContent = h;
      elCalendarGrid.appendChild(div);
    });

    const firstDayIndex = new Date(year, month - 1, 1).getDay(); // 0 is Sun, 1 is Mon
    const offset = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;
    const daysInMonth = new Date(year, month, 0).getDate();

    // Blank spaces before first day
    for (let i = 0; i < offset; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'calendar-day-num empty';
      elCalendarGrid.appendChild(emptyDiv);
    }

    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'calendar-day-num';
      dayDiv.textContent = d;
      if (d === targetDay) {
        dayDiv.classList.add('active-event');
        dayDiv.title = 'Ngày diễn ra sự kiện';
      }
      elCalendarGrid.appendChild(dayDiv);
    }
  }

  // Real-time Countdown Timer
  function startCountdown() {
    if (countdownTimerId) clearInterval(countdownTimerId);

    function update() {
      if (!appConfig.eventDate) return;
      const timeStr = appConfig.eventTime || '08:00';
      const targetTime = new Date(`${appConfig.eventDate}T${timeStr}:00`).getTime();
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        cdDays.textContent = '00';
        cdHours.textContent = '00';
        cdMins.textContent = '00';
        cdSecs.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      cdDays.textContent = days < 10 ? `0${days}` : days;
      cdHours.textContent = hours < 10 ? `0${hours}` : hours;
      cdMins.textContent = mins < 10 ? `0${mins}` : mins;
      cdSecs.textContent = secs < 10 ? `0${secs}` : secs;
    }

    update();
    countdownTimerId = setInterval(update, 1000);
  }

  // Render Photo Gallery (Hỗ trợ 2 kiểu: 'horizontal' - Trượt ngang & 'vertical' - Để dọc)
  function renderGallery() {
    const photos = appConfig.albumPhotos || [];
    const galleryType = appConfig.galleryType || 'horizontal';

    if (photos.length === 0) {
      document.getElementById('album-section').style.display = 'none';
      return;
    }
    document.getElementById('album-section').style.display = 'block';
    galleryContainer.innerHTML = '';

    if (galleryType === 'horizontal') {
      // 1. KIỂU TRƯỢT NGANG (HORIZONTAL SCROLL)
      const scrollBox = document.createElement('div');
      scrollBox.className = 'album-horizontal-scroll';

      photos.forEach((src, idx) => {
        const card = document.createElement('div');
        card.className = 'album-h-card';
        card.innerHTML = `
          <img src="${src}" alt="Ảnh ${idx + 1}" loading="lazy">
          <div class="album-card-caption">Kỷ niệm #${idx + 1}</div>
        `;
        card.addEventListener('click', () => openLightbox(src));
        scrollBox.appendChild(card);
      });

      galleryContainer.appendChild(scrollBox);
    } else {
      // 2. KIỂU ĐỂ DỌC (VERTICAL STACK)
      const stackBox = document.createElement('div');
      stackBox.className = 'album-vertical-stack';

      photos.forEach((src, idx) => {
        const card = document.createElement('div');
        card.className = 'album-v-card';
        card.innerHTML = `
          <div class="washi-tape washi-kraft" style="top: -12px; left: ${30 + (idx % 2 ? 15 : -10)}%; width: 80px; transform: rotate(${idx % 2 ? 3 : -3}deg);"></div>
          <img src="${src}" alt="Ảnh ${idx + 1}" loading="lazy">
          <div class="polaroid-caption">Khoảnh khắc đáng nhớ ✨</div>
        `;
        card.addEventListener('click', () => openLightbox(src));
        stackBox.appendChild(card);
      });

      galleryContainer.appendChild(stackBox);
    }
  }

  // Render Banking & Dynamic VietQR
  function renderBanking() {
    const b = appConfig.banking;
    if (!b || !b.enabled) {
      bankingSection.style.display = 'none';
      return;
    }
    bankingSection.style.display = 'block';
    displayBankName.textContent = b.bankName || b.bankCode;
    displayAccountNum.textContent = b.accountNumber;
    displayAccountHolder.textContent = b.accountHolder;
    if (b.wishlistNote) {
      displayWishlistNote.textContent = b.wishlistNote;
    }

    // Dynamic VietQR generator URL
    const qrNote = encodeURIComponent(b.qrNote || `Mung ${appConfig.ownerName || ''}`);
    const accHolder = encodeURIComponent(b.accountHolder || '');
    const qrUrl = `https://img.vietqr.io/image/${b.bankCode}-${b.accountNumber}-compact2.png?amount=0&addInfo=${qrNote}&accountName=${accHolder}`;
    vietqrImage.src = qrUrl;
    vietqrImage.style.display = 'inline-block';
  }

  // Render Wishes Stream (Không có lời chúc mẫu)
  function renderWishesList() {
    wishesListContainer.innerHTML = '';
    let storedWishes = JSON.parse(localStorage.getItem('ivy_wishes_feed') || '[]');
    // Loại bỏ hoàn toàn các lời chúc mẫu thử nghiệm trước đó nếu có
    storedWishes = storedWishes.filter(w => w.name !== 'Hoàng Yến' && w.name !== 'Minh Triết');
    localStorage.setItem('ivy_wishes_feed', JSON.stringify(storedWishes));

    if (storedWishes.length === 0) {
      wishesListContainer.innerHTML = `
        <div class="wishes-empty-state">
          <i class="fa-regular fa-comment-dots" style="font-size: 1.4rem; margin-bottom: 6px; display: block;"></i>
          Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc tốt đẹp nhé! ✨
        </div>
      `;
      return;
    }

    storedWishes.forEach((w, idx) => {
      const card = document.createElement('div');
      card.className = 'wish-card';
      const initial = (w.name || 'B').trim().charAt(0).toUpperCase();

      card.innerHTML = `
        <div class="wish-header">
          <div class="wish-author">
            <span class="author-avatar">${initial}</span>
            <span>${escapeHtml(w.name)}</span>
          </div>
          <span class="wish-time">${escapeHtml(w.time || 'Vừa xong')}</span>
        </div>
        <div class="wish-content">${escapeHtml(w.message)}</div>
        <button class="wish-like-btn ${w.liked ? 'liked' : ''}" data-idx="${idx}">
          <i class="${w.liked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          <span class="like-count">${w.likes || 0}</span>
        </button>
      `;

      card.querySelector('.wish-like-btn').addEventListener('click', function () {
        w.liked = !w.liked;
        w.likes = (w.likes || 0) + (w.liked ? 1 : -1);
        if (w.likes < 0) w.likes = 0;
        localStorage.setItem('ivy_wishes_feed', JSON.stringify(storedWishes));
        renderWishesList();
      });

      wishesListContainer.appendChild(card);
    });
  }

  // 4. AUDIO PLAYER LOGIC
  function setupAudio() {
    if (!appConfig.music || !appConfig.music.enabled) {
      floatMusicBtn.style.display = 'none';
      return;
    }
    floatMusicBtn.style.display = 'flex';
    const audioSrc = appConfig.music.audioUrl || 'assets/audio/background-music.wav';
    bgAudio.src = audioSrc;
    bgAudio.load();
  }

  function playAudio() {
    if (!appConfig.music || !appConfig.music.enabled) return;
    if (!bgAudio.src || bgAudio.src === window.location.href) {
      bgAudio.src = appConfig.music.audioUrl || 'assets/audio/background-music.wav';
      bgAudio.load();
    }
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        floatMusicBtn.classList.add('playing');
      }).catch(err => {
        console.warn('Audio play waiting for interaction or source:', err.message);
        floatMusicBtn.classList.remove('playing');
      });
    }
  }

  function toggleAudio() {
    if (bgAudio.paused) {
      playAudio();
    } else {
      bgAudio.pause();
      floatMusicBtn.classList.remove('playing');
    }
  }

  // 5. AUTO-SCROLL UTILITY (LĂN MƯỢT MÀ TỰ ĐỘNG)
  let lastAutoScrollStart = 0;

  function toggleAutoScroll() {
    if (isAutoScrolling) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  }

  function startAutoScroll() {
    if (isAutoScrolling) return;
    isAutoScrolling = true;
    lastAutoScrollStart = Date.now();
    floatScrollBtn.classList.add('active');
    if (scrollInterval) clearInterval(scrollInterval);
    scrollInterval = setInterval(() => {
      window.scrollBy(0, 1.5);
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
        stopAutoScroll();
      }
    }, 25);
  }

  function stopAutoScroll() {
    isAutoScrolling = false;
    floatScrollBtn.classList.remove('active');
    if (scrollInterval) clearInterval(scrollInterval);
  }

  // 6. MODAL, LIGHTBOX & TOAST NOTIFICATION HELPERS
  function showToast(message, icon = 'fa-heart') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3100);
  }

  function openModal(modal) {
    if (modal) modal.classList.add('open');
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove('open');
  }

  function openLightbox(src) {
    lightboxImg.src = src;
    lightboxModal.style.display = 'flex';
    setTimeout(() => {
      lightboxModal.classList.add('open');
    }, 10);
  }

  // 7. SETUP EVENT LISTENERS
  function setupEventListeners() {
    // Open Envelope Action (Tự động phát nhạc và tự động lăn từ đầu trang xuống)
    btnOpenEnvelope.addEventListener('click', () => {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
      elEnvelopeScreen.classList.add('opened');
      window.scrollTo({ top: 0, behavior: 'instant' });
      playAudio();

      // Tự động cuộn trang từ từ từ đầu trang xuống sau khi mở thiệp 1 giây
      if (appConfig.autoScrollOnOpen !== false) {
        setTimeout(() => {
          startAutoScroll();
        }, 1000);
      }
    });

    // Audio button click
    floatMusicBtn.addEventListener('click', toggleAudio);

    // Auto-scroll button click
    floatScrollBtn.addEventListener('click', toggleAutoScroll);
    ['wheel', 'touchstart'].forEach(evt => {
      window.addEventListener(evt, () => {
        // Chỉ dừng cuộn nếu người dùng chủ động chạm/cuộn sau khi tự cuộn đã chạy ít nhất 800ms
        if (isAutoScrolling && (Date.now() - lastAutoScrollStart > 800)) {
          stopAutoScroll();
        }
      }, { passive: true });
    });

    // Contact modal triggers
    triggerContactModal.addEventListener('click', () => openModal(contactModal));

    // Escape key closes modals and lightbox
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.open').forEach(m => closeModal(m));
        if (lightboxModal && lightboxModal.classList.contains('open')) {
          lightboxModal.classList.remove('open');
          setTimeout(() => {
            lightboxModal.style.display = 'none';
            lightboxImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";
          }, 300);
        }
      }
    });

    // Close buttons for modals
    document.querySelectorAll('.modal-close-btn, [data-close]').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const modalId = this.getAttribute('data-close');
        if (modalId) {
          closeModal(document.getElementById(modalId));
        } else {
          const closestModal = this.closest('.modal-backdrop');
          if (closestModal) closeModal(closestModal);
        }
      });
    });

    // Click outside modal content to close
    document.querySelectorAll('.modal-backdrop').forEach(bd => {
      bd.addEventListener('click', function (e) {
        if (e.target === this) closeModal(this);
      });
    });

    // Close lightbox on click
    lightboxModal.addEventListener('click', () => {
      lightboxModal.classList.remove('open');
      setTimeout(() => {
        lightboxModal.style.display = 'none';
        lightboxImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";
      }, 300);
    });

    // Character counter on wish textarea
    wishMessageInput.addEventListener('input', () => {
      wishCharCount.textContent = `${wishMessageInput.value.length}/500`;
    });

    // Wish form submission
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = wishAuthorInput.value.trim();
      const msg = wishMessageInput.value.trim();
      if (!author || !msg) return;

      const storedWishes = JSON.parse(localStorage.getItem('ivy_wishes_feed') || 'null') || [];
      const newWish = {
        name: author,
        message: msg,
        time: 'Vừa xong',
        likes: 1,
        liked: true
      };
      storedWishes.unshift(newWish);
      localStorage.setItem('ivy_wishes_feed', JSON.stringify(storedWishes));

      renderWishesList();
      wishMessageInput.value = '';
      wishCharCount.textContent = '0/500';

      if (typeof confetti === 'function') {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      }

      showToast('Cảm ơn bạn đã gửi lời chúc tốt đẹp!', 'fa-heart');
    });

    // RSVP Options selection (Chỉ Có / Không)
    rsvpOptions.forEach(opt => {
      opt.addEventListener('click', function () {
        rsvpOptions.forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
        activeRsvpStatus = this.getAttribute('data-status');
      });
    });

    // RSVP Form submit (Chỉ cần họ tên)
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = rsvpNameInput.value.trim();
      if (!name) return;

      const rsvpData = {
        name: name,
        status: activeRsvpStatus === 'yes' ? 'Tham dự' : 'Không thể đến',
        timestamp: new Date().toLocaleString('vi-VN')
      };

      // Post to Google Sheets webhook if configured
      if (appConfig.rsvp && appConfig.rsvp.googleSheetWebhook) {
        try {
          fetch(appConfig.rsvp.googleSheetWebhook, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rsvpData)
          });
        } catch (err) {
          console.error('Failed to post RSVP to webhook:', err);
        }
      }

      // Save locally as backup
      const rsvps = JSON.parse(localStorage.getItem('ivy_rsvp_submissions') || '[]');
      rsvps.push(rsvpData);
      localStorage.setItem('ivy_rsvp_submissions', JSON.stringify(rsvps));

      if (typeof confetti === 'function') {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.8 } });
      }

      showToast('Đã nhận xác nhận của bạn! Rất mong được gặp bạn!', 'fa-circle-check');
    });

    // Copy Account Number button
    btnCopyAcc.addEventListener('click', () => {
      if (appConfig.banking && appConfig.banking.accountNumber) {
        navigator.clipboard.writeText(appConfig.banking.accountNumber).then(() => {
          copyText.textContent = 'Đã sao chép!';
          setTimeout(() => {
            copyText.textContent = 'Sao chép số tài khoản';
          }, 2000);
        });
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
