# Lời thuyết minh tiếng Việt

- 89 câu thuyết minh (khuôn viên, sảnh, hành lang, 6 phòng, 32 hiện vật và các câu gợi ý của hướng dẫn viên) được thu sẵn thành MP3 mono 22 kHz.
- Giọng đọc: giọng nữ tiếng Việt Piper `vi_VN-vais1000-medium`, huấn luyện từ bộ dữ liệu VAIS-1000 (giấy phép CC BY 4.0): https://ieee-dataport.org/documents/vais-1000-vietnamese-speech-synthesis-corpus
- Số, ngày tháng, năm và chữ số La Mã được chuyển thành chữ tiếng Việt trước khi đọc (xem `tools/vnnorm.py`), ví dụ "2/9/1945" → "ngày hai tháng chín năm một nghìn chín trăm bốn mươi lăm".
- Tên file là mã băm FNV-1a của câu thoại. Khi sửa câu chữ trong `script.js`, chạy lại `tools/tao-thuyet-minh.py` (hướng dẫn ở đầu file). Câu nào chưa có file sẽ dùng giọng tiếng Việt của trình duyệt nếu máy có; nếu không có, chỉ hiện phụ đề — không dùng giọng nước ngoài.
