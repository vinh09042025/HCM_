# Exterior courtyard additions

The trees and flagpoles are lightweight procedural Three.js geometry created in `script.js`; no external model is bundled.

The flag motifs follow these openly documented Wikimedia Commons references:

- National flag of Vietnam: https://commons.wikimedia.org/wiki/File:Flag_of_Vietnam.svg
- Flag of the Communist Party of Vietnam: https://commons.wikimedia.org/wiki/File:Flag_of_the_Communist_Party_of_Vietnam.svg

The project renders simplified local CanvasTexture versions of these flag designs to keep the courtyard offline-friendly and lightweight.

## Nâng cấp cảnh quan (2026)

Toàn bộ phần mới đều dựng bằng hình khối Three.js và CanvasTexture trong `script.js`, không dùng ảnh hay mô hình bên ngoài:

- Bầu trời shader (mây trôi, nắng; ban đêm có sao và trăng), đồi xa trong sương.
- Mặt tiền: tường ốp đá, hàng 8 cột trắng + 2 trụ góc, diềm mái, tầng mái mang bảng tên và ngôi sao vàng, cửa sổ kính sáng ấm về đêm.
- Đài tưởng niệm: bia granite với phù điêu chân dung tông đồng, được xử lý trực tiếp trên trình duyệt từ ảnh `../exhibits/room6-ho-chi-minh-portrait-1950s.jpg` (nguồn ở `../exhibits/SOURCES.md`), thay cho khối tượng giản lược cũ.
- Cây mai vàng, cây hoa ban, cây phượng, khóm tre, hoa giấy, chậu cau cảnh; bóng nắng tĩnh (tính một lần).
