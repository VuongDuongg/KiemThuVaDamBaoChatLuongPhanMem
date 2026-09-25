# 🏥 Hệ Thống Quản Lý và Điều Phối Bệnh Viện (TKAV)

> **Báo cáo Bài tập Môn học Kiểm thử và Đảm bảo Chất lượng Phần mềm**  
> **Trường Đại học Thủy Lợi — Khoa Công nghệ Thông tin**  

---

## 👥 Danh Sách Thành Viên Nhóm (N1)

| Họ và tên | Mã sinh viên | Chức năng đảm nhiệm đặc tả |
| :--- | :--- | :--- |
| **Dương Quốc Vượng** *(Nhóm trưởng)* | `2351170634` | Phân hệ Thu ngân & Kho Dược |
| **Lê Tuấn Khanh** | `2351170601` | Phân hệ Cận lâm sàng & System Core |
| **Ngô Tuấn Anh** | `2351170570` | Phân hệ Bác sĩ & Bệnh án (EMR) |
| **Nguyễn Hồng Thái** | `2351170619` | Phân hệ Tiếp đón & Hàng chờ |

---

## 🌟 Giới Thiệu Tổng Quan Đề Tài

Trong thế giới hiện đại, việc ứng dụng Công nghệ Thông tin vào quản lý y tế đóng vai trò cốt lõi nhằm nâng cao chất lượng dịch vụ và giảm thiểu thời gian chờ đợi của bệnh nhân. Hệ thống Quản lý và điều phối bệnh viện **(TKAV)** được xây dựng nhằm tự động hóa quy trình vận hành từ khâu tiếp đón, thu phí, khám chữa bệnh cho đến trả kết quả cận lâm sàng.

Hệ thống giúp đồng bộ hóa dữ liệu tập trung giữa các bộ phận, tối ưu hóa công tác quản lý bệnh án điện tử (EMR), quản lý kho dược và kiểm soát doanh thu tài chính một cách minh bạch, chính xác.

---

## 📂 Danh Sách Các Phân Hệ Chức Năng

1. **Phân hệ Tiếp đón & Hàng chờ (Lễ tân):**
   * Tìm kiếm thông tin bệnh nhân (hỗ trợ quét mã QR/CCCD).
   * Đăng ký hồ sơ bệnh nhân mới.
   * Đăng ký khám và cấp số thứ tự tự động.
   * Điều phối và gọi số khám tại sảnh chờ.

2. **Phân hệ Thu ngân & Kho dược (Thu ngân):**
   * Lập hóa đơn viện phí.
   * Thanh toán hóa đơn viện phí (Tiền mặt, QR Code, Thẻ ngân hàng).
   * Tiếp nhận đơn thuốc và Xuất kho / Cấp phát thuốc.
   * Quản lý danh mục thuốc và tồn kho (Cảnh báo hạn dùng, tồn tối thiểu).
   * Thanh toán tiền thuốc.

3. **Phân hệ Bác sĩ & Bệnh án điện tử (Bác sĩ):**
   * Tiếp nhận và gọi bệnh nhân vào khám.
   * Cập nhật thông tin bệnh án và chẩn đoán (ICD-10).
   * Chỉ định dịch vụ cận lâm sàng.
   * Kê đơn thuốc điện tử (kiểm tra tương tác thuốc/chống chỉ định).
   * Kết thúc lượt khám và in phiếu có mã vạch (Barcode).

4. **Phân hệ Cận lâm sàng & System Core (Kỹ thuật viên & Quản trị viên):**
   * Tiếp nhận chỉ định cận lâm sàng.
   * Nhập kết quả xét nghiệm (định lượng/định tính, gắn cờ cảnh báo bất thường).
   * Tải lên hình ảnh chẩn đoán (X-quang, CT/MRI, DICOM) và kết luận.
   * Duyệt và trả kết quả cận lâm sàng.
   * Đăng nhập hệ thống & Phân quyền người dùng (RBAC).

---

## 🛠️ Công Nghệ & Phương Pháp Kiểm Thử

* **Phương pháp kiểm thử:** Kiểm thử hộp đen (Black-box Testing).
* **Kỹ thuật thiết kế testcase:** 
  * Phân vùng tương đương (Equivalence Partitioning).
  * Phân tích giá trị biên (Boundary Value Analysis).
  * Bảng quyết định (Decision Table Testing).
* **Quản lý tài liệu:** Đặc tả chi tiết Use Case, luồng chính, luồng ngoại lệ và danh sách Test Case phủ kín biên nghiệp vụ.

---

## 🚀 Hướng Dẫn Sử Dụng Tài Liệu Dự Án

* Toàn bộ đặc tả chi tiết các Use Case, điều kiện đầu vào/đầu ra, bảng quyết định và danh sách ca kiểm thử chi tiết cho từng chức năng đã được nhóm nghiên cứu và tổng hợp đầy đủ trong báo cáo nguồn của đồ án môn học.
