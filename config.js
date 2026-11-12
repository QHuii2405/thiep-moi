// ==========================================================================
// Cấu hình thiệp mời (Dữ liệu chuẩn IvyInvi)
// Được quản lý và chỉnh sửa riêng qua trang admin.html
// ==========================================================================

const DEFAULT_INVITATION_CONFIG = {
  // Loại sự kiện & Tiêu đề
  eventType: "LỄ TỐT NGHIỆP",
  ownerName: "QUANG HUY",
  guestGreeting: "Thân mời bạn",
  
  // Thời gian & Địa điểm
  eventDate: "2026-08-08", // YYYY-MM-DD
  eventTime: "08:00",
  eventEndTime: "11:30",
  venueName: "Hội trường A - Đại học Bách Khoa TP.HCM",
  venueAddress: "268 Lý Thường Kiệt, Phường 14, Quận 10, TP.HCM",
  googleMapsUrl: "https://maps.google.com/?q=268+Lý+Thường+Kiệt,+Phường+14,+Quận+10,+TP.HCM",
  
  // Lời nhắn gửi / Trích dẫn
  quote: "Một hành trình khép lại, một chặng đường mới mở ra. Rất mong có sự hiện diện của những người thương yêu để cùng đánh dấu cột mốc đặc biệt này 🎓",
  
  // Hình ảnh
  coverPhoto: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
  coverCaption: "Thanh xuân rực rỡ ✨",
  
  // Kiểu hiển thị Album: 'horizontal' (trượt ngang) hoặc 'vertical' (để dọc)
  galleryType: "horizontal",
  albumPhotos: [
    "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=600&q=80"
  ],
  
  // Nhạc nền (Tích hợp sẵn file âm thanh nội bộ ổn định 100%)
  music: {
    enabled: true,
    title: "Acoustic Melody - Best Day",
    audioUrl: "assets/audio/background-music.wav",
    autoPlay: true
  },
  
  // Tự động cuộn trang từ trên xuống khi bấm Mở thiệp
  autoScrollOnOpen: true,
  
  // Thông tin liên hệ (Giống hệt IvyInvi)
  contact: {
    bannerText: "Liên hệ với Quang Huy khi đến nơi nhé — Nhấn để xem thông tin liên hệ",
    phone: "0336395450",
    zaloPhone: "0336395450",
    facebookUrl: "https://facebook.com"
  },
  
  // Hộp quà mừng / Ngân hàng VietQR
  banking: {
    enabled: true,
    bankCode: "VCB",
    bankName: "Vietcombank",
    accountNumber: "1012345678",
    accountHolder: "NGUYEN QUANG HUY",
    qrNote: "Mung tot nghiep Quang Huy",
    wishlistNote: "Sự hiện diện của bạn là món quà ý nghĩa nhất đối với mình!"
  },
  
  // Xác nhận tham dự (RSVP đơn giản: Có / Không)
  rsvp: {
    enabled: true,
    googleSheetWebhook: "", // Tùy chọn: URL Google Apps Script để lưu phản hồi về Google Sheets
    deadlineDate: "2026-08-05"
  },
  
  // Lời chúc ban đầu: để trống để khách gửi lời chúc thật
  initialWishes: []
};
