/* ==========================================================================
   IvyInvi Online Invitation Platform - Admin Dashboard Logic
   ========================================================================== */

(function () {
  'use strict';

  // 1. CONFIGURATION INITIALIZATION
  let appConfig = {};
  try {
    const saved = localStorage.getItem('ivy_invitation_custom_config');
    if (saved) {
      appConfig = JSON.parse(saved);
    } else if (typeof DEFAULT_INVITATION_CONFIG !== 'undefined') {
      appConfig = JSON.parse(JSON.stringify(DEFAULT_INVITATION_CONFIG));
    }
  } catch (e) {
    console.error('Error loading config:', e);
    appConfig = typeof DEFAULT_INVITATION_CONFIG !== 'undefined' ? DEFAULT_INVITATION_CONFIG : {};
  }

  // Tự động dọn sạch link nhạc/ảnh cũ nếu còn sót lại trong cache
  if (appConfig.music && appConfig.music.audioUrl && appConfig.music.audioUrl.includes('pixabay.com')) {
    appConfig.music.audioUrl = 'assets/audio/background-music.wav';
  }
  if (appConfig.albumPhotos && appConfig.albumPhotos.length > 0) {
    if (appConfig.albumPhotos[0] && appConfig.albumPhotos[0].includes('photo-1523050854058')) {
      appConfig.albumPhotos[0] = 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=600&q=80';
    }
  }
  try {
    localStorage.setItem('ivy_invitation_custom_config', JSON.stringify(appConfig));
  } catch (err) {}

  // Ensure default structures
  if (!appConfig.music) appConfig.music = {};
  if (!appConfig.contact) appConfig.contact = {};
  if (!appConfig.banking) appConfig.banking = {};
  if (!appConfig.albumPhotos) appConfig.albumPhotos = [];

  // 2. DOM ELEMENTS
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const pageTitle = document.getElementById('page-title');
  const btnSaveHeader = document.getElementById('btn-save-header');

  const zoneCover = document.getElementById('zone-cover');
  const inputCoverFile = document.getElementById('input-cover-file');
  const zoneAlbum = document.getElementById('zone-album');
  const inputAlbumFile = document.getElementById('input-album-file');
  const albumThumbs = document.getElementById('album-thumbs');

  const presetMusicSelect = document.getElementById('preset-music-select');
  const zoneAudio = document.getElementById('zone-audio');
  const inputAudioFile = document.getElementById('input-audio-file');
  const audioSelectedName = document.getElementById('audio-selected-name');

  const btnDownloadZip = document.getElementById('btn-download-zip');
  const btnDownloadConfig = document.getElementById('btn-download-config');
  const btnCopyGuestLink = document.getElementById('btn-copy-guest-link');
  const btnClearTestData = document.getElementById('btn-clear-test-data');

  // 3. INITIALIZATION
  function init() {
    setupTabNavigation();
    populateFormFields();
    setupMediaHandlers();
    setupSaveAndExport();
    renderResponses();
  }

  // Tab Navigation Handling
  function setupTabNavigation() {
    navBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        navBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        this.classList.add('active');
        const targetId = this.getAttribute('data-target');
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add('active');

        pageTitle.textContent = this.textContent.trim();
        if (targetId === 'tab-responses') {
          renderResponses();
        }
      });
    });
  }

  // Populate form with current appConfig values
  function populateFormFields() {
    // Tab 1: Info
    document.getElementById('cfg-eventType').value = appConfig.eventType || '';
    document.getElementById('cfg-ownerName').value = appConfig.ownerName || '';
    document.getElementById('cfg-eventDate').value = appConfig.eventDate || '';
    document.getElementById('cfg-eventTime').value = appConfig.eventTime || '08:00';
    document.getElementById('cfg-eventEndTime').value = appConfig.eventEndTime || '';
    document.getElementById('cfg-venueName').value = appConfig.venueName || '';
    document.getElementById('cfg-venueAddress').value = appConfig.venueAddress || '';
    document.getElementById('cfg-googleMapsUrl').value = appConfig.googleMapsUrl || '';
    document.getElementById('cfg-quote').value = appConfig.quote || '';

    // Tab 2: Album & Cover
    document.getElementById('cfg-coverPhoto').value = appConfig.coverPhoto || '';
    document.getElementById('cfg-coverCaption').value = appConfig.coverCaption || 'Thanh xuân rực rỡ ✨';
    document.getElementById('cfg-galleryType').value = appConfig.galleryType || 'horizontal';
    renderAlbumThumbnails();

    // Tab 3: Music & Auto-Scroll
    document.getElementById('cfg-musicEnabled').checked = appConfig.music ? appConfig.music.enabled : true;
    document.getElementById('cfg-autoScrollOnOpen').checked = appConfig.autoScrollOnOpen !== false;
    document.getElementById('cfg-audioUrl').value = (appConfig.music && appConfig.music.audioUrl) || '';

    // Tab 4: Contact
    document.getElementById('cfg-contactBanner').value = appConfig.contact.bannerText || '';
    document.getElementById('cfg-contactPhone').value = appConfig.contact.phone || '';
    document.getElementById('cfg-contactZalo').value = appConfig.contact.zaloPhone || '';
    document.getElementById('cfg-contactFb').value = appConfig.contact.facebookUrl || '';

    // Tab 5: Banking
    document.getElementById('cfg-bankingEnabled').checked = appConfig.banking ? appConfig.banking.enabled : true;
    document.getElementById('cfg-bankSelect').value = appConfig.banking.bankCode || 'VCB';
    document.getElementById('cfg-bankAccount').value = appConfig.banking.accountNumber || '';
    document.getElementById('cfg-accountHolder').value = appConfig.banking.accountHolder || '';
    document.getElementById('cfg-qrNote').value = appConfig.banking.qrNote || '';
    updateAdminQrPreview();
  }

  // Read all inputs into appConfig
  function readFormInputs() {
    // Info
    appConfig.eventType = document.getElementById('cfg-eventType').value.trim();
    appConfig.ownerName = document.getElementById('cfg-ownerName').value.trim();
    appConfig.eventDate = document.getElementById('cfg-eventDate').value;
    appConfig.eventTime = document.getElementById('cfg-eventTime').value;
    appConfig.eventEndTime = document.getElementById('cfg-eventEndTime').value;
    appConfig.venueName = document.getElementById('cfg-venueName').value.trim();
    appConfig.venueAddress = document.getElementById('cfg-venueAddress').value.trim();
    appConfig.googleMapsUrl = document.getElementById('cfg-googleMapsUrl').value.trim();
    appConfig.quote = document.getElementById('cfg-quote').value.trim();

    // Media
    const coverUrl = document.getElementById('cfg-coverPhoto').value.trim();
    if (coverUrl) appConfig.coverPhoto = coverUrl;
    appConfig.coverCaption = document.getElementById('cfg-coverCaption').value.trim();
    appConfig.galleryType = document.getElementById('cfg-galleryType').value;

    // Music & Auto-Scroll
    appConfig.music.enabled = document.getElementById('cfg-musicEnabled').checked;
    appConfig.autoScrollOnOpen = document.getElementById('cfg-autoScrollOnOpen').checked;
    const aUrl = document.getElementById('cfg-audioUrl').value.trim();
    if (aUrl) appConfig.music.audioUrl = aUrl;

    // Contact
    appConfig.contact.bannerText = document.getElementById('cfg-contactBanner').value.trim();
    appConfig.contact.phone = document.getElementById('cfg-contactPhone').value.trim();
    appConfig.contact.zaloPhone = document.getElementById('cfg-contactZalo').value.trim();
    appConfig.contact.facebookUrl = document.getElementById('cfg-contactFb').value.trim();

    // Banking
    appConfig.banking.enabled = document.getElementById('cfg-bankingEnabled').checked;
    appConfig.banking.bankCode = document.getElementById('cfg-bankSelect').value;
    const sel = document.getElementById('cfg-bankSelect');
    appConfig.banking.bankName = sel.options[sel.selectedIndex].text;
    appConfig.banking.accountNumber = document.getElementById('cfg-bankAccount').value.trim();
    appConfig.banking.accountHolder = document.getElementById('cfg-accountHolder').value.trim().toUpperCase();
    appConfig.banking.qrNote = document.getElementById('cfg-qrNote').value.trim();
  }

  // Update live VietQR preview in Admin panel
  function updateAdminQrPreview() {
    const bankCode = document.getElementById('cfg-bankSelect').value;
    const accountNum = document.getElementById('cfg-bankAccount').value.trim();
    const holder = encodeURIComponent(document.getElementById('cfg-accountHolder').value.trim().toUpperCase());
    const note = encodeURIComponent(document.getElementById('cfg-qrNote').value.trim());
    const qrImg = document.getElementById('admin-vietqr-preview');

    if (bankCode && accountNum) {
      qrImg.src = `https://img.vietqr.io/image/${bankCode}-${accountNum}-compact2.png?amount=0&addInfo=${note}&accountName=${holder}`;
      qrImg.style.display = 'inline-block';
    } else {
      qrImg.style.display = 'none';
    }
  }

  // Toast Notification
  function showToast(message, icon = 'fa-check') {
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

  // Media Handlers (Upload Cover, Upload Album, Upload Audio)
  function setupMediaHandlers() {
    // Cover Photo Upload
    zoneCover.addEventListener('click', () => inputCoverFile.click());
    inputCoverFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          appConfig.coverPhoto = event.target.result;
          document.getElementById('cfg-coverPhoto').value = event.target.result;
          showToast('Đã tải ảnh chân dung thành công!', 'fa-image');
        };
        reader.readAsDataURL(file);
      }
    });

    // Album Photos Upload (Multi)
    zoneAlbum.addEventListener('click', () => inputAlbumFile.click());
    inputAlbumFile.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (!appConfig.albumPhotos) appConfig.albumPhotos = [];

      let added = 0;
      files.forEach(file => {
        if (appConfig.albumPhotos.length >= 10) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          appConfig.albumPhotos.push(event.target.result);
          renderAlbumThumbnails();
        };
        reader.readAsDataURL(file);
        added++;
      });
      if (added > 0) {
        setTimeout(renderAlbumThumbnails, 500);
      }
    });

    // Preset Music
    presetMusicSelect.addEventListener('change', function () {
      if (this.value) {
        document.getElementById('cfg-audioUrl').value = this.value;
      }
    });

    // Real-time VietQR live preview listeners
    ['cfg-bankSelect', 'cfg-bankAccount', 'cfg-accountHolder', 'cfg-qrNote'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', updateAdminQrPreview);
        el.addEventListener('change', updateAdminQrPreview);
      }
    });

    // Audio File Upload
    zoneAudio.addEventListener('click', () => inputAudioFile.click());
    inputAudioFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        audioSelectedName.textContent = `Đã chọn file nhạc: ${file.name}`;
        const reader = new FileReader();
        reader.onload = (event) => {
          document.getElementById('cfg-audioUrl').value = event.target.result;
          showToast(`Đã tải bài nhạc "${file.name}" thành công!`, 'fa-music');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Render Album Thumbnails with Delete button
  function renderAlbumThumbnails() {
    albumThumbs.innerHTML = '';
    const photos = appConfig.albumPhotos || [];

    photos.forEach((src, idx) => {
      const card = document.createElement('div');
      card.className = 'thumb-card';
      card.innerHTML = `
        <img src="${src}" alt="Ảnh ${idx + 1}">
        <span class="thumb-delete" title="Xóa ảnh này">&times;</span>
      `;
      card.querySelector('.thumb-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        appConfig.albumPhotos.splice(idx, 1);
        renderAlbumThumbnails();
      });
      albumThumbs.appendChild(card);
    });
  }

  // Render Responses (RSVP and Wishes)
  function renderResponses() {
    // 1. RSVPs
    const rsvpContainer = document.getElementById('rsvp-table-container');
    const rsvps = JSON.parse(localStorage.getItem('ivy_rsvp_submissions') || '[]');
    if (rsvps.length === 0) {
      rsvpContainer.innerHTML = '<p style="font-size: 0.88rem; color: var(--text-muted); padding: 12px 0;">Chưa có phản hồi nào.</p>';
    } else {
      let html = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Họ và tên</th>
              <th>Xác nhận</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
      `;
      rsvps.forEach(r => {
        const badgeColor = r.status === 'Tham dự' ? '#10B981' : '#EF4444';
        html += `
          <tr>
            <td><strong>${escapeHtml(r.name)}</strong></td>
            <td><span style="color: ${badgeColor}; font-weight: 700;">${escapeHtml(r.status)}</span></td>
            <td style="color: var(--text-muted); font-size: 0.8rem;">${escapeHtml(r.timestamp || '')}</td>
          </tr>
        `;
      });
      html += '</tbody></table>';
      rsvpContainer.innerHTML = html;
    }

    // 2. Wishes
    const wishesContainer = document.getElementById('wishes-table-container');
    let wishes = JSON.parse(localStorage.getItem('ivy_wishes_feed') || '[]');
    wishes = wishes.filter(w => w.name !== 'Hoàng Yến' && w.name !== 'Minh Triết');
    if (wishes.length === 0) {
      wishesContainer.innerHTML = '<p style="font-size: 0.88rem; color: var(--text-muted); padding: 12px 0;">Chưa có lời chúc nào.</p>';
    } else {
      let html = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Người gửi</th>
              <th>Nội dung lời chúc</th>
              <th>Thả tim</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
      `;
      wishes.forEach(w => {
        html += `
          <tr>
            <td><strong>${escapeHtml(w.name)}</strong></td>
            <td>${escapeHtml(w.message)}</td>
            <td>❤️ ${w.likes || 0}</td>
            <td style="color: var(--text-muted); font-size: 0.8rem;">${escapeHtml(w.time || '')}</td>
          </tr>
        `;
      });
      html += '</tbody></table>';
      wishesContainer.innerHTML = html;
    }
  }

  // Setup Save & Export
  function setupSaveAndExport() {
    btnSaveHeader.addEventListener('click', saveAll);

    // Download Config
    btnDownloadConfig.addEventListener('click', () => {
      readFormInputs();
      const content = `// Cấu hình thiệp mời trực tuyến IvyInvi\nconst DEFAULT_INVITATION_CONFIG = ${JSON.stringify(appConfig, null, 2)};\n`;
      const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
      saveAs(blob, 'config.js');
    });

    // Copy Config Code directly to clipboard
    const btnCopyConfigCode = document.getElementById('btn-copy-config-code');
    if (btnCopyConfigCode) {
      btnCopyConfigCode.addEventListener('click', () => {
        readFormInputs();
        const content = `// Cấu hình thiệp mời trực tuyến IvyInvi\nconst DEFAULT_INVITATION_CONFIG = ${JSON.stringify(appConfig, null, 2)};\n`;
        navigator.clipboard.writeText(content).then(() => {
          showToast('Đã sao chép! Hãy bấm nút "2. Mở GitHub Dán Đè" để lưu nhé!', 'fa-copy');
        });
      });
    }

    // Copy Guest Link
    btnCopyGuestLink.addEventListener('click', () => {
      const url = `${window.location.origin}${window.location.pathname.replace('admin.html', 'index.html')}?to=Bạn`;
      navigator.clipboard.writeText(url).then(() => {
        showToast('Đã sao chép link thiệp mời vào bộ nhớ tạm!', 'fa-link');
      });
    });

    // Clear Test Data
    btnClearTestData.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu phản hồi RSVP và Lời chúc thử nghiệm không?')) {
        localStorage.removeItem('ivy_rsvp_submissions');
        localStorage.removeItem('ivy_wishes_feed');
        renderResponses();
        showToast('Đã dọn sạch dữ liệu thử nghiệm!', 'fa-trash');
      }
    });

    // Export Complete ZIP Package for GitHub Pages
    btnDownloadZip.addEventListener('click', exportCompleteZip);
  }

  function saveAll() {
    readFormInputs();
    localStorage.setItem('ivy_invitation_custom_config', JSON.stringify(appConfig));
    showToast('Đã lưu tất cả thay đổi thành công!', 'fa-floppy-disk');
  }

  async function exportCompleteZip() {
    saveAll();
    if (typeof JSZip === 'undefined' || typeof saveAs === 'undefined') {
      showToast('Đang nạp thư viện nén file, vui lòng thử lại sau 2 giây.', 'fa-circle-notch');
      return;
    }

    try {
      const zip = new JSZip();

      // Fetch index.html, style.css, script.js, admin.html, admin.js
      const htmlContent = await fetch('index.html').then(r => r.text());
      const cssContent = await fetch('style.css').then(r => r.text());
      const jsContent = await fetch('script.js').then(r => r.text());
      const adminHtmlContent = await fetch('admin.html').then(r => r.text());
      const adminJsContent = await fetch('admin.js').then(r => r.text());

      // Config containing user's exact customized settings
      const configJsContent = `// File cấu hình thiệp mời được tùy chỉnh\nconst DEFAULT_INVITATION_CONFIG = ${JSON.stringify(appConfig, null, 2)};\n`;

      const readmeContent = `# Thiệp Mời Online - IvyInvi Style
Dự án thiệp mời trực tuyến miễn phí, triển khai bằng GitHub Pages.

## Cách deploy lên GitHub Pages trong 3 phút:
1. Đăng nhập vào GitHub.com và bấm **New repository** (đặt tên ví dụ: \`thiep-moi\`, chọn Public).
2. Kéo thả tất cả các file trong thư mục này (\`index.html\`, \`style.css\`, \`script.js\`, \`config.js\`, \`admin.html\`, \`admin.js\`) vào repository rồi bấm **Commit changes**.
3. Vào tab **Settings** của repository -> Chọn menu **Pages** ở cột bên trái.
4. Ở mục **Build and deployment -> Branch**, chọn branch \`main\` (hoặc \`master\`), thư mục \`/(root)\` rồi bấm **Save**.
5. Sau 1 phút, GitHub Pages sẽ cấp link trang web hoạt động vĩnh viễn:
   - Link thiệp cho khách: \`https://username.github.io/thiep-moi/?to=Anh+Tuấn\`
   - Link trang quản trị của riêng bạn: \`https://username.github.io/thiep-moi/admin.html\`
`;

      zip.file('index.html', htmlContent);
      zip.file('style.css', cssContent);
      zip.file('script.js', jsContent);
      zip.file('admin.html', adminHtmlContent);
      zip.file('admin.js', adminJsContent);
      zip.file('config.js', configJsContent);
      zip.file('README.md', readmeContent);

      // Đóng gói luôn file nhạc nền nội bộ
      try {
        const audioBlob = await fetch('assets/audio/background-music.wav').then(r => r.blob());
        zip.file('assets/audio/background-music.wav', audioBlob);
      } catch (err) {
        console.log('Chưa có file audio local, bỏ qua:', err);
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'thiep-moi-online-github-pages.zip');
      showToast('Đã tải thành công file zip mã nguồn!', 'fa-file-zipper');
    } catch (err) {
      console.error(err);
      btnDownloadConfig.click();
    }
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
