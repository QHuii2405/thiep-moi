# 💌 Thiệp Mời Online Chuẩn Phong Cách IvyInvi (Deploy Miễn Phí Trên GitHub Pages)

Dự án thiệp mời điện tử trực tuyến (tốt nghiệp, đám cưới, sinh nhật, thôi nôi, sự kiện) được thiết kế tỉ mỉ theo phong cách **Polaroid - Beige Scrapbook Vintage** của IvyInvi (giống mẫu `quang-huy-5d6f11`).

### ✨ Ưu điểm vượt trội so với IvyInvi trả phí:
- **100% Miễn phí & Vĩnh viễn**: Không tốn phí duy trì hàng tháng.
- **Không giới hạn người xem**: Bao nhiêu khách mời truy cập cùng lúc cũng mượt mà.
- **Có sẵn Trình chỉnh sửa trực quan (Visual Editor)**: Tùy biến văn bản, tải ảnh từ máy, chọn bài nhạc MP3 yêu thích, chọn ngân hàng tạo mã VietQR... ngay trên giao diện web.
- **Triển khai cực dễ trên GitHub Pages**: Chỉ cần kéo thả file lên GitHub là có ngay trang web hoạt động toàn cầu.
- **Tạo link cá nhân hóa cho từng khách mời**: Hỗ trợ định dạng `?to=Tên_Khách` (Ví dụ: `https://.../?to=Anh+Tuấn`) để in tên riêng của khách lên bì thư trước khi mở thiệp!

---

## 🎨 Các tính năng nổi bật
1. **Màn hình mở bì thư (Envelope Screen)**:
   - Phong bì vintage với con dấu sáp đỏ hình trái tim `❤️`, vệt băng keo washi tape và hiệu ứng lấp lánh `✨`.
   - Nút **"Mở thiệp"** bung tỏa pháo hoa giấy (confetti) và tự động phát bài nhạc nền du dương.
   - Tag tên khách mời cá nhân hóa (`Thân mời bạn / Thân mời: Anh Tuấn`).
2. **Khung thiệp Polaroid & Craft Paper**:
   - Tông màu giấy vintage ấm áp `#FAF6EE`, họa tiết chấm hạt craft nhẹ nhàng, viền rách scrapbook, họa tiết mũ cử nhân / nhẫn cưới.
   - Khung ảnh Polaroid nghiêng góc tự nhiên, có chân ảnh và chữ viết tay lãng mạn.
3. **Thông tin sự kiện & Lịch mini thông minh**:
   - Hộp hiển thị ngày giờ chuẩn tiếng Việt (`Thứ Bảy, 08.08.2026 - Vào lúc: 08:00`).
   - Lịch mini tự động tạo lịch tháng tương ứng và đánh dấu ngày tổ chức bằng hình tròn màu đất nung `★`.
   - Đồng hồ đếm ngược thời gian thực (Ngày : Giờ : Phút : Giây).
   - Nút **"Xem chỉ đường trên Google Maps"** mở nhanh vị trí trên bản đồ.
   - Nút popup liên hệ nhanh qua **Zalo / Gọi điện thoại / Facebook**.
4. **Album ảnh kỷ niệm (Photo Gallery)**:
   - Hỗ trợ 2 chế độ hiển thị: **Ghép ảnh Polaroid (Collage Grid)** hoặc **Slide 3D xoay vòng (Interactive 3D Carousel)**.
   - Nhấp vào bất kỳ ảnh nào để mở chế độ xem toàn màn hình (Lightbox phóng to).
5. **Sổ lưu bút & Gợi ý lời chúc**:
   - Nhập tên và lời chúc (đếm ký tự `0/500`).
   - Nút **"💡 Gợi ý lời chúc"** mở danh sách các lời chúc tốt nghiệp / đám cưới / sinh nhật cảm động, bấm 1 chạm là tự điền vào khung.
   - Danh sách lời chúc hiển thị theo thời gian thực với avatar chữ cái và nút thả tim `❤️`.
6. **Xác nhận tham dự (RSVP)**:
   - Khách có thể chọn `Tôi sẽ tham dự` (kèm bộ đếm số người đi cùng `[-] 1 [+]`) hoặc `Rất tiếc, bận rồi`.
   - Có thể tích hợp lưu trực tiếp vào **Google Sheets** miễn phí qua Google Apps Script Webhook.
7. **Hộp mừng cưới / Quà tặng & VietQR**:
   - Tích hợp 14+ ngân hàng lớn tại Việt Nam (Vietcombank, MB, Techcombank, ACB, TPBank, BIDV, VietinBank...).
   - Tự động tạo mã **VietQR** chuẩn ngân hàng - khách chỉ cần mở app ngân hàng quét là chuyển khoản đúng số tài khoản và nội dung!
   - Nút 1 chạm "Sao chép số tài khoản".
8. **Tiện ích nổi**:
   - 🎵 Nút đĩa than xoay tròn bật/tắt nhạc nền.
   - ⏬ Nút **"Tự cuộn"** tự động lướt thiệp mượt mà từ trên xuống dưới.
   - ⚙️ Nút **"Trình chỉnh sửa"** (chỉ hiện cho chủ thiệp, tự động ẩn khi chia sẻ link chế độ khách).

---

## 🚀 Hướng dẫn chỉnh sửa & Deploy lên GitHub Pages trong 3 phút

### Cách 1: Chỉnh sửa trực tiếp trên trình duyệt rồi tải ZIP
1. Mở file `index.html` trên máy tính bằng trình duyệt bất kỳ (Chrome, Cốc Cốc, Edge).
2. Bấm vào nút ma thuật **Chỉnh sửa** (góc dưới bên phải màn hình).
3. Tùy chỉnh thông tin:
   - **Tab 1 (Thông tin)**: Sửa tên bạn, ngày giờ, địa điểm, địa chỉ, lời nhắn.
   - **Tab 2 (Ảnh & Album)**: Chọn ảnh đại diện và thêm nhiều ảnh kỷ niệm từ máy tính.
   - **Tab 3 (Nhạc nền)**: Chọn bài hát có sẵn hoặc tải file nhạc `.mp3` của riêng bạn từ máy tính.
   - **Tab 4 (Ngân hàng)**: Điền số tài khoản để tự động sinh mã VietQR.
   - **Tab 6 (Deploy GitHub)**: Bấm nút xanh **"Tải Toàn Bộ Code (ZIP) Cho GitHub Pages"**.
4. Giải nén file `.zip` bạn vừa tải về.

### Cách 2: Đẩy lên GitHub Pages
1. Đăng nhập vào tài khoản [GitHub](https://github.com).
2. Tạo một kho lưu trữ mới bằng cách bấm vào **New repository**:
   - **Repository name**: ví dụ đặt là `thiep-moi-online` (hoặc tên bạn muốn).
   - Đặt ở chế độ **Public**.
   - Bấm **Create repository**.
3. Ở trang vừa tạo, bấm **Upload an existing file** (hoặc dùng Git).
4. Kéo thả tất cả các file trong thư mục dự án (`index.html`, `style.css`, `script.js`, `config.js`) vào trang GitHub rồi bấm **Commit changes**.
5. Vào menu **Settings** của repository &rarr; bấm vào mục **Pages** ở cột danh mục bên trái.
6. Ở mục **Build and deployment**:
   - **Source**: Deploy from a branch
   - **Branch**: Chọn `main` (hoặc `master`), thư mục `/(root)` rồi bấm **Save**.
7. Chờ khoảng 1-2 phút, GitHub sẽ hiển thị đường link trang web của bạn:
   `https://<ten-tai-khoan>.github.io/thiep-moi-online/`

---

## 💌 Cách gửi link có tên riêng cho từng vị khách
Để thiệp hiển thị trang trọng và cá nhân hóa:
- Copy link GitHub Pages của bạn và thêm đuôi `?to=Tên_Khách` vào cuối:
  - `https://username.github.io/thiep-moi-online/?to=Anh+Tuấn`
  - `https://username.github.io/thiep-moi-online/?to=Bạn+Mai+Lan`
  - `https://username.github.io/thiep-moi-online/?to=Gia+đình+bác+Hùng`
- Màn hình bì thư sẽ hiển thị: **Thân mời: Bạn Mai Lan**!

## 🔒 Chế độ Khách (Ẩn nút chỉnh sửa):
Khi gửi cho bạn bè, khách mời, bạn có thể gửi kèm đuôi `?guest=1` để ẩn hoàn toàn nút bánh răng chỉnh sửa thiệp:
`https://username.github.io/thiep-moi-online/?guest=1&to=Anh+Tuấn`
