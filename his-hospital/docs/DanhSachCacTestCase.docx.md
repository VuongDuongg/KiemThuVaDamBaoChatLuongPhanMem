Kiểm thử hộp đen

| Mã TC | Kỹ thuật áp dụng | Kịch bản / Dữ liệu đầu vào | Kết quả mong đợi |
| :---- | :---- | :---- | :---- |
| **TC\_F5\_01** | Giá trị biên | Nhập patient\_id \= "B" (1 ký tự \- Min), patient\_name trống. | Vượt qua validate định dạng, tiến hành truy xuất CSDL. |
| **TC\_F5\_02** | Giá trị biên | Nhập patient\_id \= "BN123456789012345678" (20 ký tự \- Max). | Vượt qua validate định dạng, tiến hành truy xuất CSDL. |
| **TC\_F5\_03** | Giá trị biên | Nhập patient\_id có **21 ký tự** (Max+). | Lỗi inline: "Mã bệnh nhân không hợp lệ...". Vô hiệu hóa tìm kiếm. |
| **TC\_F5\_04** | Phân vùng tương đương | Nhập patient\_id \= "BN-123@". | Lỗi inline: "Mã bệnh nhân không hợp lệ...". Vô hiệu hóa tìm kiếm. |
| **TC\_F5\_05** | Giá trị biên | Nhập patient\_name \= "A" (1 ký tự \- Min), patient\_id trống. | Vượt qua validate định dạng, tiến hành truy xuất CSDL. |
| **TC\_F5\_06** | Giá trị biên | Nhập patient\_name \= chuỗi đúng **50 ký tự** (Max). | Vượt qua validate định dạng, tiến hành truy xuất CSDL. |
| **TC\_F5\_07** | Giá trị biên | Nhập patient\_name \= chuỗi có **51 ký tự** (Max+). | Lỗi inline: "Họ tên bệnh nhân không hợp lệ...". Vô hiệu hóa tìm kiếm. |
| **TC\_F5\_08** | Phân vùng tương đương | Nhập patient\_name \= "Nguyen Van A123". | Lỗi inline: "Họ tên bệnh nhân không hợp lệ...". Vô hiệu hóa tìm kiếm. |
| **TC\_F5\_09** | Bảng quyết định (Q1) | Bỏ trống hoàn toàn cả patient\_id và patient\_name. | Viền đỏ ô nhập liệu, lỗi: 'Vui lòng nhập Mã bệnh nhân hoặc Họ tên để tìm kiếm'. |
| **TC\_F5\_10** | Bảng quyết định (Q2) | Nhập patient\_id hợp lệ, nhưng hồ sơ không có trong CSDL. | Hiển thị Toast/Inline: 'Không tìm thấy thông tin bệnh nhân trên hệ thống'. |
| **TC\_F5\_11** | Bảng quyết định (Q3) | Tìm đúng bệnh nhân, nhưng không có chỉ định phí nào. | Hiển thị: 'Bệnh nhân chưa có chỉ định dịch vụ hoặc yêu cầu khám nào cần thanh toán'. |
| **TC\_F5\_12** | Bảng quyết định (Q3) | Tìm đúng bệnh nhân, nhưng các dịch vụ đã thu tiền trước đó. | Hiển thị: "Các khoản chi phí này đã được thanh toán đầy đủ". Nút 'Tạo hóa đơn' bị làm mờ. |
| **TC\_F5\_13** | Bảng quyết định (Q4) | Tìm đúng BN có dịch vụ chưa thanh toán, nhưng Thu ngân bỏ tick toàn bộ danh sách selected\_services (0 khoản mục). | Lỗi: "Vui lòng chọn ít nhất một dịch vụ cần lập hóa đơn." Không thể tạo hóa đơn. |
| **TC\_F5\_14** | Bảng quyết định (Q5) | Tìm đúng BN, có dịch vụ, tick chọn ≥ 1 dịch vụ và nhấn "Tạo hóa đơn". | Hiển thị Data Grid chi phí, Summary Block tính tổng tiền, bảo hiểm và thực thu. Tạo hóa đơn thành công ở trạng thái 'Chờ thanh toán', chuyển giao diện. |

| Mã TC | Kỹ thuật áp dụng | Kịch bản / Dữ liệu đầu vào | Kết quả mong đợi |
| :---- | :---- | :---- | :---- |
| **TC\_F6\_01** | Bảng quyết định (Q1) | Gọi mã hóa đơn đã được thanh toán từ trước, Thu ngân nhấn "Xác nhận". | Hệ thống báo lỗi: "Mã hóa đơn không tồn tại hoặc đã được thanh toán trước đó". Chặn giao dịch. |
| **TC\_F6\_02** | Giá trị biên / BQ (Q2) | Hóa đơn "Chờ thanh toán", Thu ngân nhấn "Hủy", nhập cancel\_reason đúng **255 ký tự** (Max). | Giao dịch bị hủy thành công, trạng thái hóa đơn đổi thành "Đã hủy", lưu lý do hủy đầy đủ. |
| **TC\_F6\_03** | Giá trị biên | Hóa đơn "Chờ thanh toán", Thu ngân nhấn "Hủy", nhập cancel\_reason **256 ký tự** (Max+). | Báo lỗi inline: "Lý do hủy không được vượt quá 255 ký tự". Không thể hủy hóa đơn. |
| **TC\_F6\_04** | Bảng quyết định (Q3) | Hóa đơn "Chờ thanh toán", Thu ngân không tick chọn payment\_method và nhấn "Xác nhận". | Viền đỏ khối UI, báo lỗi: "Vui lòng chọn hình thức thanh toán". |
| **TC\_F6\_05** | Giá trị biên / BQ (Q4) | Chọn "Tiền mặt", tổng tiền hóa đơn là 500,000 VNĐ. Nhập amount\_received \= **499,999 VNĐ**. | Báo lỗi: "Số tiền nhận từ bệnh nhân phải lớn hơn hoặc bằng tổng số tiền thanh toán". |
| **TC\_F6\_06** | Phân vùng TĐ | Chọn "Tiền mặt", nhập amount\_received \= **\-50,000 VNĐ** (Số âm). | Hệ thống chặn nhập hoặc báo lỗi số tiền không hợp lệ. |
| **TC\_F6\_07** | Giá trị biên / BQ (Q5) | Chọn "Tiền mặt", tổng tiền hóa đơn là 500,000 VNĐ. Nhập amount\_received \= **500,000 VNĐ** (Min hợp lệ), nhấn Xác nhận. | Thanh toán thành công. Trạng thái \-\> "Đã thanh toán", in biên lai, đồng bộ Bác sĩ. |
| **TC\_F6\_08** | Giá trị biên / BQ (Q5) | Chọn "Tiền mặt", tổng tiền hóa đơn là 500,000 VNĐ. Nhập amount\_received \= **1,000,000 VNĐ** (\> Tổng tiền), nhấn Xác nhận. | Thanh toán thành công. Trạng thái \-\> "Đã thanh toán", in biên lai. (Giao diện có thể hiện số tiền thối lại). |
| **TC\_F6\_09** | Bảng quyết định (Q6) | Chọn "Quét mã QR", hệ thống sinh mã QR động. Nhấn "Xác nhận thanh toán thành công". | Thanh toán thành công. Trạng thái \-\> "Đã thanh toán", in biên lai, đồng bộ Bác sĩ. |

| Mã TC | Kỹ thuật áp dụng | Kịch bản / Dữ liệu đầu vào | Kết quả mong đợi |
| :---- | :---- | :---- | :---- |
| **TC\_F9\_01** | Bảng quyết định (Q1) | Không chọn drug\_id (để trống dropdown), nhập đủ các trường khác. | Viền đỏ ô chọn thuốc, báo lỗi: "Vui lòng chọn một loại thuốc hợp lệ." |
| **TC\_F9\_02** | Giá trị biên / BQ (Q2) | added\_quantity \= **0** (Min không hợp lệ). | Viền đỏ ô Số lượng, báo lỗi: "Số lượng nhập thêm phải lớn hơn 0." Nút Lưu vô hiệu hóa. |
| **TC\_F9\_03** | Giá trị biên / BQ (Q2) | batch\_number để trống (0 ký tự). | Viền đỏ ô Số lô, báo lỗi: "Vui lòng nhập số lô của thuốc." Nút Lưu vô hiệu hóa. |
| **TC\_F9\_04** | Giá trị biên / BQ (Q2) | batch\_number nhập chuỗi dài **51 ký tự** (Max+). | Chặn nhập hoặc báo lỗi inline nếu vượt quá 50 ký tự. |
| **TC\_F9\_05** | Giá trị biên / BQ (Q2) | expiration\_date \= **Ngày hiện tại \- 1 ngày** (Hôm qua). | Viền đỏ ô Hạn SD, báo lỗi: "Hạn sử dụng không hợp lệ...". Nút Lưu vô hiệu hóa. |
| **TC\_F9\_06** | Bảng quyết định (Q3) | Dữ liệu hợp lệ toàn bộ, nhưng ngắt kết nối DB khi bấm "Lưu thông tin kho". | Hiển thị Toast đỏ: "Lỗi hệ thống khi lưu trữ thông tin kho, vui lòng thử lại sau". Tồn kho không thay đổi. |
| **TC\_F9\_07** | Giá trị biên / BQ (Q4) | expiration\_date \= **Đúng Ngày hiện tại** (Min hợp lệ). Bấm Lưu. | Cập nhật kho thành công. Hiển thị Badge màu vàng cạnh dòng thuốc (do hạn \< 30 ngày). |
| **TC\_F9\_08** | Giá trị biên / BQ (Q4) | expiration\_date \= **Ngày hiện tại \+ 29 ngày**. Bấm Lưu. | Cập nhật kho thành công. Hiển thị Badge màu vàng cảnh báo sắp hết hạn. |
| **TC\_F9\_09** | Phân vùng TĐ / BQ (Q5) | added\_quantity \= **1**, batch\_number \= chuỗi **50 ký tự**, expiration\_date \= **Ngày hiện tại \+ 6 tháng**. Bấm Lưu. | Cập nhật kho thành công, số lượng tăng thêm 1\. Hiển thị Toast "Cập nhật kho thuốc thành công". Dòng thuốc không có cảnh báo vàng. |

Kiểm thử hộp trắng

Kiểm thử dòng điều khiển  
\- Lập hóa đơn viện phí

| TT | Mã TC | Đường đi kiểm thử | Bộ dữ liệu đầu vào (payload) | Kết quả mong đợi | Câu lệnh được phủ |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | **TC\_C1\_01** | 1→2→3​ | { patient\_name: "Nguyễn Văn A", total\_amount: 100000 } (thiếu patient\_code) | Lỗi: *“Thiếu thông tin bắt buộc…”* | 1, 2, 3 |
| 2 | **TC\_C1\_02** | 1→2→4→5→6​ | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: 0 } | Lỗi: *“Tổng tiền hóa đơn phải lớn hơn 0”* | 4, 5, 6 |
| 3 | **TC\_C1\_03** | 1→2→4→5→7→8→9​ | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: 100000, insurance\_discount: \-20000 } | Lỗi: *“Mức giảm trừ bảo hiểm không được là số âm”* | 7, 8, 9 |
| 4 | **TC\_C1\_04** | 1→2→4→5→7→8→10→11​ | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: 100000, insurance\_discount: 150000 } | Lỗi: *“Mức giảm trừ bảo hiểm không hợp lệ (vượt quá tổng tiền)”* | 10, 11 |
| 5 | **TC\_C1\_05** | 1→2→4→5→7→8→10→12..16→17→18b→19..22​ | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: 100000, insurance\_discount: 80000, payment\_method: "CHUA\_THANH\_TOAN" } | Thành công: status \= "UNPAID", patient\_pay \= 20000 | 12, 13, 14, 15, 16, 17, 18b, 19, 20, 21, 22 |
| 6 | **TC\_C1\_06** | 1→2→4→5→7→8→10→12..16→17→18a→19..22​ | { patient\_code: "BN02", patient\_name: "Trần Thị B", total\_amount: 200000, insurance\_discount: 0, payment\_method: "TIEN\_MAT" } | Thành công: status \= "PAID", patient\_pay \= 200000 | 18a |

| Mã TC | Điểm QĐ phủ | Bộ dữ liệu đầu vào | Kết quả mong đợi |
| :---- | :---- | :---- | :---- |
| **TC\_C2\_01** | Đỉnh 2 (True) | { patient\_name: "Lê Văn C", total\_amount: 100000 } (thiếu patient\_code) | Lỗi HTTP 400 |
| **TC\_C2\_02** | Đỉnh 2 (False), Đỉnh 5 (False), Đỉnh 8 (False), Đỉnh 10 (False), Đỉnh 17 (False) | { patient\_code: "BN03", patient\_name: "Lê Văn C", total\_amount: 500000, insurance\_discount: 100000, payment\_method: "CHUA\_THANH\_TOAN" } | Tạo thành công hóa đơn UNPAID, patient\_pay \= 400000 |
| **TC\_C2\_03** | Đỉnh 5 (True) | { patient\_code: "BN03", patient\_name: "Lê Văn C", total\_amount: \-1000 } | Lỗi: *“Tổng tiền hóa đơn phải lớn hơn 0”* |
| **TC\_C2\_05** | Đỉnh 8 (True) | { patient\_code: "BN03", patient\_name: "Lê Văn C", total\_amount: 500000, insurance\_discount: \-1 } | Lỗi: *“Mức giảm trừ bảo hiểm không được là số âm”* |
| **TC\_C2\_07** | Đỉnh 10 (True) | { patient\_code: "BN03", patient\_name: "Lê Văn C", total\_amount: 500000, insurance\_discount: 600000 } | Lỗi: *“Mức giảm trừ bảo hiểm không hợp lệ…”* |
| **TC\_C2\_09** | Đỉnh 17 (True) | { patient\_code: "BN03", patient\_name: "Lê Văn C", total\_amount: 500000, insurance\_discount: 0, payment\_method: "VIETQR" } | Tạo thành công hóa đơn PAID, patient\_pay \= 500000 |

| Điểm QĐ | Điều kiện con | Biến cố kiểm tra | Trạng thái cần đạt | Ca kiểm thử phủ |
| :---- | :---- | :---- | :---- | :---- |
| **2** | 2a:\!patient\_code​ | patient\_code \= "" hoặc undefined | **True** / **False** | TC\_C3\_01 (True) / TC\_C3\_02 (False) |
| **2** | 2b:\!patient\_name​ | patient\_name \= "" hoặc null | **True** / **False** | TC\_C3\_02 (True) / TC\_C3\_03 (False) |
| **2** | 2c:total\_amount===undefined​ | Thuộc tính total\_amount bị bỏ qua | **True** / **False** | TC\_C3\_03 (True) / TC\_C3\_04 (False) |
| **2** | 2d:total\_amount===null​ | total\_amount \= null | **True** / **False** | TC\_C3\_04 (True) / TC\_C3\_05 (False) |
| **5** | 5a:isNaN(total)​ | total\_amount \= "abc" | **True** / **False** | TC\_C3\_05 (True) / TC\_C3\_06 (False) |
| **5** | 5b:total≤0​ | total\_amount \= 0 hoặc \-50000 | **True** / **False** | TC\_C3\_06 (True) / TC\_C3\_07 (False) |
| **8** | 8:discount\<0​ | insurance\_discount \= \-10000 | **True** / **False** | TC\_C3\_07 (True) / TC\_C3\_08 (False) |
| **10** | 10:discount\>total​ | insurance\_discount \= 200000 \> total \= 100000 | **True** / **False** | TC\_C3\_08 (True) / TC\_C3\_09 (False) |
| **17** | 17a:Boolean(payment\_method)​ | payment\_method \= "" hoặc null | **False** / **True** | TC\_C3\_10 (False) / TC\_C3\_09 (True) |
| **17** | 17b:payment\_method≠"CHUA\_THANH\_TOAN"​ | payment\_method \= "CHUA\_THANH\_TOAN" vs "TIEN\_MAT" | **False** / **True** | TC\_C3\_11 (False) / TC\_C3\_09 (True) |

**Bảng chi tiết bộ ca kiểm thử đạt C3:**

| Mã TC | Điều kiện con kích hoạt | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| :---- | :---- | :---- | :---- |
| **TC\_C3\_01** | 2a=True​ | { patient\_code: "", patient\_name: "Nguyễn Văn A", total\_amount: 100000 } | Quăng lỗi: Thiếu thông tin bắt buộc |
| **TC\_C3\_02** | 2a=False,2b=True​ | { patient\_code: "BN01", patient\_name: "", total\_amount: 100000 } | Quăng lỗi: Thiếu thông tin bắt buộc |
| **TC\_C3\_03** | 2a=F,2b=F,2c=True​ | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: undefined } | Quăng lỗi: Thiếu thông tin bắt buộc |
| **TC\_C3\_04** | 2a=F,2b=F,2c=F,2d=True​ | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: null } | Quăng lỗi: Thiếu thông tin bắt buộc |
| **TC\_C3\_05** | 2=False,5a=True​ | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: "KHONG\_PHAI\_SO" } | Quăng lỗi: Tổng tiền phải lớn hơn 0 |
| **TC\_C3\_06** | 2=False,5a=False,5b=True​ | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: 0 } | Quăng lỗi: Tổng tiền phải lớn hơn 0 |
| **TC\_C3\_07** | 5=False,8=True​ | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: 100000, insurance\_discount: \-5000 } | Quăng lỗi: Giảm trừ BHYT không được âm |
| **TC\_C3\_08** | 8=False,10=True​ | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: 100000, insurance\_discount: 120000 } | Quăng lỗi: Giảm trừ BHYT vượt quá tổng tiền |
| **TC\_C3\_09** | 17a=True,17b=True​ | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: 100000, insurance\_discount: 20000, payment\_method: "TIEN\_MAT" } | Tạo thành công hóa đơn PAID, patient\_pay \= 80000 |
| **TC\_C3\_10** | 17a=False (rỗng) | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: 100000, insurance\_discount: 20000, payment\_method: "" } | Tạo thành công hóa đơn UNPAID |
| **TC\_C3\_11** | 17a=True,17b=False​ | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: 100000, insurance\_discount: 20000, payment\_method: "CHUA\_THANH\_TOAN" } | Tạo thành công hóa đơn UNPAID |

- Thanh toán hóa đơn viện phí

| TT | Mã TC | Đường đi kiểm thử | Bộ dữ liệu đầu vào | Kết quả mong đợi | Câu lệnh được phủ |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | **TC\_PAY\_C1\_01** | 1→2→3​ | idOrCode: 1, paymentDetails: { payment\_method: "BITCOIN" } | Lỗi: *“Phương thức thanh toán không hợp lệ…”* | 1, 2, 3 |
| 2 | **TC\_PAY\_C1\_02** | 1→2→4→5→6​ | idOrCode: 9999 *(hóa đơn không tồn tại)*, paymentDetails: { payment\_method: "TIEN\_MAT" } | Lỗi HTTP 404: *“Không tìm thấy hóa đơn”* | 4, 5, 6 |
| 3 | **TC\_PAY\_C1\_03** | 1→2→4→5→7→8​ | idOrCode: "HD000001" *(hóa đơn đã có status \= “PAID”)*, paymentDetails: { payment\_method: "TIEN\_MAT" } | Lỗi HTTP 400: *“Hóa đơn này đã được thanh toán trước đó”* | 7, 8 |
| 4 | **TC\_PAY\_C1\_04** | 1→2→4→5→7→9→10→14→15→17→18​ | idOrCode: "HD000002" *(status \= “UNPAID”, item\_type \= “TIEN\_KHAM”, BN trạng thái “Đang khám”)*, paymentDetails: { payment\_method: "TIEN\_MAT" } | Thành công: invoice.status \= "PAID", không gọi CLS, không đổi trạng thái BN | 9, 10, 14, 15, 17, 18 |
| 5 | **TC\_PAY\_C1\_05** | 1→2→4→5→7→9→10→11→12→13→14→15→16→17→18​ | idOrCode: "HD000003" *(status \= “UNPAID”, item\_type \= “CAN\_LAM\_SANG”, reference\_id \= “CLS001” tồn tại, BN trạng thái “Chờ thanh toán”)*, paymentDetails: { payment\_method: "VIETQR" } | Thành công: invoice.status \= "PAID", labOrder.payment\_status \= "PAID", patient.status \= "Đã khám" | 11, 12, 13, 16 |

| Mã TC | Điểm QĐ phủ | Bộ dữ liệu đầu vào | Kết quả mong đợi |
| :---- | :---- | :---- | :---- |
| **TC\_PAY\_C2\_01** | Đỉnh 2 (True) | idOrCode: 1, paymentDetails: { payment\_method: "PAYPAL" } | Quăng lỗi: Phương thức thanh toán không hợp lệ |
| **TC\_PAY\_C2\_02** | Đỉnh 2 (False), Đỉnh 5 (False), Đỉnh 7 (False), Đỉnh 10 (False), Đỉnh 15 (False) | idOrCode: "HD01", { payment\_method: "TIEN\_MAT" } (Hóa đơn khám, BN có status \= "Đang khám") | Thanh toán thành công, hóa đơn chuyển PAID |
| **TC\_PAY\_C2\_03** | Đỉnh 5 (True) | idOrCode: "HD\_KHONG\_TON\_TAI", { payment\_method: "TIEN\_MAT" } | Quăng lỗi HTTP 404: Không tìm thấy hóa đơn |
| **TC\_PAY\_C2\_05** | Đỉnh 7 (True) | idOrCode: "HD\_DA\_THANH\_TOAN" (status \= "PAID"), { payment\_method: "TIEN\_MAT" } | Quăng lỗi HTTP 400: Hóa đơn đã được thanh toán trước đó |
| **TC\_PAY\_C2\_07** | Đỉnh 10 (True), Đỉnh 12 (True) | idOrCode: "HD\_CLS\_01" (item\_type \= "CAN\_LAM\_SANG", reference\_id \= "CLS01" có tồn tại trong DB), { payment\_method: "VIETQR" } | Thanh toán thành công, labOrder.payment\_status \= "PAID" |
| **TC\_PAY\_C2\_10** | Đỉnh 10 (True), Đỉnh 12 (False) | idOrCode: "HD\_CLS\_02" (item\_type \= "CAN\_LAM\_SANG", reference\_id \= "CLS\_AO" không tồn tại trong DB) | Thanh toán thành công hóa đơn, bỏ qua cập nhật phiếu CLS |
| **TC\_PAY\_C2\_11** | Đỉnh 15 (True) | idOrCode: "HD\_BN\_CHO" (Hóa đơn hợp lệ của BN có status \= "Chờ thanh toán"), { payment\_method: "THE" } | Thanh toán thành công, patient.status \= "Đã khám", phát PATIENT\_STATUS\_CHANGED |

| Mã TC | Điều kiện con kích hoạt | Dữ liệu đầu vào (idOrCode, paymentDetails) | Trạng thái Mock DB | Kết quả mong đợi |
| :---- | :---- | :---- | :---- | :---- |
| **TC\_PAY\_C3\_01** | 2a=True​ | id: 1, { payment\_method: null } | Bất kỳ | Quăng lỗi: Phương thức thanh toán không hợp lệ |
| **TC\_PAY\_C3\_02** | 2a=F,2b=True​ | id: 1, { payment\_method: "TIEN\_AO" } | Bất kỳ | Quăng lỗi: Phương thức thanh toán không hợp lệ |
| **TC\_PAY\_C3\_04** | 2=F,5=True​ | id: "HD\_999", { payment\_method: "TIEN\_MAT" } | Không có hóa đơn | Quăng lỗi HTTP 404: Không tìm thấy hóa đơn |
| **TC\_PAY\_C3\_06** | 5=F,7=True​ | id: "HD\_01", { payment\_method: "TIEN\_MAT" } | invoice.status \= "PAID" | Quăng lỗi HTTP 400: Hóa đơn đã thanh toán trước đó |
| **TC\_PAY\_C3\_07** | 7=F,10a=False​ | id: "HD\_02", { payment\_method: "TIEN\_MAT" } | Hóa đơn item\_type \= "TIEN\_KHAM" | Không gọi CLS, chuyển sang kiểm tra BN |
| **TC\_PAY\_C3\_08** | 10a=True,10b=False​ | id: "HD\_03", { payment\_method: "TIEN\_MAT" } | Hóa đơn item\_type \= "CAN\_LAM\_SANG", reference\_id \= null | Bỏ qua tìm CLS |
| **TC\_PAY\_C3\_09** | 10a=T,10b=T,12=True​ | id: "HD\_04", { payment\_method: "VIETQR" } | Hóa đơn CLS có reference\_id \= "CLS01", có labOrder | labOrder.payment\_status \= "PAID" |
| **TC\_PAY\_C3\_10** | 10a=T,10b=T,12=False​ | id: "HD\_05", { payment\_method: "VIETQR" } | Hóa đơn CLS có reference\_id \= "CLS\_AO", không thấy labOrder | Bỏ qua cập nhật CLS |
| **TC\_PAY\_C3\_11** | 15a=False​ | id: "HD\_06", { payment\_method: "THE" } | patientRepository trả về null | Không quăng lỗi, bỏ qua đổi trạng thái BN |
| **TC\_PAY\_C3\_12** | 15a=True,15b=False​ | id: "HD\_07", { payment\_method: "CHUYEN\_KHOAN" } | BN có trạng thái "Đang khám" | Giữ nguyên trạng thái BN, không phát PATIENT\_STATUS\_CHANGED |
| **TC\_PAY\_C3\_13** | 15a=True,15b=True​ | id: "HD\_08", { payment\_method: "CHUYEN\_KHOAN" } | BN có trạng thái "Chờ thanh toán" | patient.status \= "Đã khám", phát PATIENT\_STATUS\_CHANGED |

- Quản lý danh mục thuốc và tồn kho

| TT | Mã TC | Đường đi kiểm thử | Bộ dữ liệu đầu vào (payload) | Kết quả mong đợi | Câu lệnh được phủ |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | **TC\_MED\_C1\_01** | 1→2→3​ | { medicine\_name: "   ", unit\_price: 5000 } | Lỗi HTTP 400: *“Tên thuốc là bắt buộc”* | 1, 2, 3 |
| 2 | **TC\_MED\_C1\_02** | 1→2→4→5→6​ | { medicine\_name: "Paracetamol 500mg", unit\_price: 0 } | Lỗi HTTP 400: *“Đơn giá thuốc phải lớn hơn 0”* | 4, 5, 6 |
| 3 | **TC\_MED\_C1\_03** | 1→2→4→5→7→8→9​ | { medicine\_name: "Paracetamol 500mg", unit\_price: 2000, stock\_quantity: \-5 } | Lỗi HTTP 400: *“Số lượng tồn kho không được là số âm”* | 7, 8, 9 |
| 4 | **TC\_MED\_C1\_04** | 1→2→4→5→7→8→10→11a→12..16​ | { medicine\_name: "Amoxicillin 500mg", active\_ingredient: "Amoxicillin", unit\_price: 3500, stock\_quantity: 200, unit: "Viên", category: "Kháng sinh" } | Tạo thành công: medicine\_code \= "MED001", active\_ingredient \= "Amoxicillin", phát event | 10, 11a, 12, 13, 14, 15, 16 |
| 5 | **TC\_MED\_C1\_05** | 1→2→4→5→7→8→10→11b→12..16​ | { medicine\_name: "Nước muối sinh lý 0.9%", unit\_price: 10000, stock\_quantity: 50 } *(không truyền active\_ingredient)* | Tạo thành công: active\_ingredient \= "", dùng unit \= "Viên" mặc định | 11b |

| Mã TC | Điểm QĐ phủ | Bộ dữ liệu đầu vào | Kết quả mong đợi |
| :---- | :---- | :---- | :---- |
| **TC\_MED\_C2\_01** | Đỉnh 2 (True) | { medicine\_name: "", unit\_price: 10000 } | Quăng lỗi: Tên thuốc là bắt buộc |
| **TC\_MED\_C2\_02** | Đỉnh 2 (False), Đỉnh 5 (False), Đỉnh 8 (False), Đỉnh 11 (True) | { medicine\_name: "Panadol Extra", active\_ingredient: "Paracetamol, Caffeine", unit\_price: 2500, stock\_quantity: 500 } | Tạo thành công thuốc, lưu kho và phát event |
| **TC\_MED\_C2\_03** | Đỉnh 5 (True) | { medicine\_name: "Panadol", unit\_price: \-100 } | Quăng lỗi: Đơn giá thuốc phải lớn hơn 0 |
| **TC\_MED\_C2\_05** | Đỉnh 8 (True) | { medicine\_name: "Panadol", unit\_price: 2000, stock\_quantity: \-10 } | Quăng lỗi: Số lượng tồn kho không được là số âm |
| **TC\_MED\_C2\_08** | Đỉnh 11 (False) | { medicine\_name: "Bông băng y tế", unit\_price: 5000, stock\_quantity: 100 } | Tạo thành công thuốc với active\_ingredient \= "" |

| Mã TC | Điều kiện con kích hoạt | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| :---- | :---- | :---- | :---- |
| **TC\_MED\_C3\_01** | 2a=True​ | { medicine\_name: null, unit\_price: 5000 } | Quăng lỗi HTTP 400: Tên thuốc là bắt buộc |
| **TC\_MED\_C3\_02** | 2a=False,2b=True​ | { medicine\_name: "     ", unit\_price: 5000 } | Quăng lỗi HTTP 400: Tên thuốc là bắt buộc |
| **TC\_MED\_C3\_03** | 2=False,5a=True​ | { medicine\_name: "Aspirin 81mg" } *(thiếu unit\_price)* | Quăng lỗi HTTP 400: Đơn giá thuốc phải lớn hơn 0 |
| **TC\_MED\_C3\_04** | 2=False,5a=False,5b=True​ | { medicine\_name: "Aspirin 81mg", unit\_price: "ABC" } | Quăng lỗi HTTP 400: Đơn giá thuốc phải lớn hơn 0 |
| **TC\_MED\_C3\_05** | 2=False,5a=F,5b=F,5c=True​ | { medicine\_name: "Aspirin 81mg", unit\_price: 0 } | Quăng lỗi HTTP 400: Đơn giá thuốc phải lớn hơn 0 |
| **TC\_MED\_C3\_06** | 5=False,8a=True​ | { medicine\_name: "Aspirin 81mg", unit\_price: 1500, stock\_quantity: "VO\_HAN" } | Quăng lỗi HTTP 400: Số lượng tồn kho không được là số âm |
| **TC\_MED\_C3\_07** | 5=False,8a=False,8b=True​ | { medicine\_name: "Aspirin 81mg", unit\_price: 1500, stock\_quantity: \-10 } | Quăng lỗi HTTP 400: Số lượng tồn kho không được là số âm |
| **TC\_MED\_C3\_08** | 8=False,11=True​ | { medicine\_name: "  Aspirin 81mg  ", active\_ingredient: "  Acid acetylsalicylic  ", unit\_price: "1500", stock\_quantity: 100, unit: "Vỉ" } | Tạo thành công: medicine\_name \= "Aspirin 81mg", active\_ingredient \= "Acid acetylsalicylic", stock\_quantity \= 100 |
| **TC\_MED\_C3\_09** | 8=False,11=False​ | { medicine\_name: "Băng cá nhân Urgo", unit\_price: 2000, stock\_quantity: 0 } *(không truyền active\_ingredient)* | Tạo thành công: active\_ingredient \= "", stock\_quantity \= 0, category \= "Khác", expiry\_date \= "2027-12-31" |

| Mã TC | Điểm QĐ phủ | Bộ dữ liệu đầu vào | Trạng thái Mock Data | Kết quả mong đợi | Nhánh / Câu lệnh phủ |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **TC\_UP\_01** | Đỉnh 2 (True) | id: 9999, { stock\_quantity: 50 } | Thuốc không tồn tại trong kho | Quăng lỗi HTTP 404: *“Không tìm thấy thuốc”* | C1: 1, 2, 3C2: Đỉnh 2 (True) |
| **TC\_UP\_02** | Đỉnh 2 (False), Đỉnh 8 (True) | id: 1, { stock\_quantity: 350, unit\_price: 2200 } | Có thuốc ID 1 trong kho và tìm thấy trong mảng all | Cập nhật thành công: stock\_quantity \= 350, unit\_price \= 2200, phát event | C1: 4..11 (đầy đủ)C2: Đỉnh 2 (F), Đỉnh 8 (T) |
| **TC\_UP\_03** | Đỉnh 8 (False) | id: "MED\_AO", { stock\_quantity: 100 } | findByIdOrCode trả về object nhưng all.findIndex trả về \-1 | Cập nhật đối tượng updated nhưng bỏ qua gán mảng, phát event | C2: Đỉnh 8 (False) |

| Mã TC | Điều kiện con kích hoạt | Dữ liệu đầu vào (idOrCode) | Kết quả mong đợi |
| :---- | :---- | :---- | :---- |
| **TC\_UP\_C3\_01** | 7a=True (Khớp theo ID số) | idOrCode: 1 hoặc "1" | Khớp ngay tại 7a, tìm thấy idx \= 0 |
| **TC\_UP\_C3\_02** | 7a=False,7b=True (Khớp theo mã thuốc) | idOrCode: "MED001" | 7a False, nhảy sang 7b True  tìm thấy idx \= 0 |
| **TC\_UP\_C3\_03** | 7a=False,7b=False​ | idOrCode: "KHONG\_TRUNG" | Cả 2 False  idx \= \-1 |

* 

| Mã TC | Điểm QĐ phủ | Dữ liệu đầu vào | Kết quả mong đợi |
| :---- | :---- | :---- | :---- |
| **TC\_DEL\_01** | Đỉnh 2 (True) | id: 9999 *(không tồn tại)* | Quăng lỗi HTTP 404: *“Không tìm thấy thuốc”* |
| **TC\_DEL\_02** | Đỉnh 2 (False) | id: 1 *(tồn tại trong kho)* | Xóa thành công thuốc khỏi kho và trả về đối tượng deleted |

Kiểm thử dòng dữ liệu  
\-  Lập hóa đơn viện phí

| Mã TC | Biến & Cặp def \-\> c-use được phủ | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| :---- | :---- | :---- | :---- |
| **TC\_CUSE\_01** | total\_amount (N1N3), insurance\_discount (N1N5), total (N3N8), discount (N5N8), patientPay (N8N8,N11), invoiceStatus (N10N11), newInvoice (N11N12) | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: 500000, insurance\_discount: 100000, payment\_method: "CHUA\_THANH\_TOAN" } | Hóa đơn được tạo thành công:- total \= 500000- discount \= 100000- patient\_pay \= 400000- status \= "UNPAID" |
| **TC\_CUSE\_02** | invoiceStatus (N9N11), item\_type (N1N8), description (N1N8), newInvoice (N11N12) | { patient\_code: "BN02", patient\_name: "Trần Thị B", item\_type: "CAN\_LAM\_SANG", description: "Siêu âm tổng quát", total\_amount: 300000, insurance\_discount: 0, payment\_method: "TIEN\_MAT" } | Hóa đơn được tạo thành công:- status \= "PAID"- item\_type \= "CAN\_LAM\_SANG"- description \= "Siêu âm tổng quát"- patient\_pay \= 300000 |
| **TC\_CUSE\_03** | Fallback của item\_type, description và insurance\_discount (N1N5,N8) | { patient\_code: "BN03", patient\_name: "Lê Văn C", total\_amount: 150000 } *(không truyền item\_type, description, insurance\_discount)* | Hóa đơn được tạo với giá trị fallback:- discount \= 0- patient\_pay \= 150000- item\_type \= "TIEN\_KHAM"- description \= "Thanh toán viện phí" |

| Mã TC | Biến & Cạnh p-use được phủ | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| :---- | :---- | :---- | :---- |
| **TC\_PUSE\_01** | patient\_code trên (N1,N2) | { patient\_code: "", patient\_name: "Nguyễn Văn A", total\_amount: 100000 } | Quăng lỗi HTTP 400: Thiếu thông tin bắt buộc |
| **TC\_PUSE\_02** | patient\_name trên (N1,N2) | { patient\_code: "BN01", patient\_name: "", total\_amount: 100000 } | Quăng lỗi HTTP 400: Thiếu thông tin bắt buộc |
| **TC\_PUSE\_03** | total\_amount trên (N1,N2) | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: null } | Quăng lỗi HTTP 400: Thiếu thông tin bắt buộc |
| **TC\_PUSE\_04** | total trên (N3,N4) | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: \-50000 } | Quăng lỗi: Tổng tiền hóa đơn phải lớn hơn 0 |
| **TC\_PUSE\_05** | discount trên (N5,N6) | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: 200000, insurance\_discount: \-10000 } | Quăng lỗi: Mức giảm trừ bảo hiểm không được là số âm |
| **TC\_PUSE\_06** | total, discount trên (N5,N7) | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: 200000, insurance\_discount: 300000 } | Quăng lỗi: Mức giảm trừ bảo hiểm không hợp lệ (vượt quá tổng tiền) |
| **TC\_PUSE\_07** | payment\_method trên (N8,N9) kèm các cạnh hợp lệ (N1,N3),(N3,N5),(N5,N8) | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: 200000, insurance\_discount: 50000, payment\_method: "VIETQR" } | Tạo thành công hóa đơn PAID, patient\_pay \= 150000 |
| **TC\_PUSE\_08** | payment\_method trên (N8,N10) kèm các cạnh hợp lệ (N1,N3),(N3,N5),(N5,N8) | { patient\_code: "BN01", patient\_name: "Nguyễn Văn A", total\_amount: 200000, insurance\_discount: 50000, payment\_method: "CHUA\_THANH\_TOAN" } | Tạo thành công hóa đơn UNPAID, patient\_pay \= 150000 |

\- Thanh toán hóa đơn viẹn phí

| Mã TC | Biến & Cặp def \-\> c-use được phủ | Dữ liệu đầu vào (idOrCode, paymentDetails) | Trạng thái Mock Data | Kết quả mong đợi |
| :---- | :---- | :---- | :---- | :---- |
| **TC\_PAY\_CUSE\_01** | payment\_method, cashier, invoice (N4N9,N14,N17,N18), patient (N14N16) | id: 101, { payment\_method: "TIEN\_MAT", cashier: "Nguyễn Thu Ngân" } | Hóa đơn khám bệnh, BN có status \= "Chờ thanh toán" | Hóa đơn chuyển PAID, thu ngân được cập nhật, BN chuyển Đã khám, trả về invoice. |
| **TC\_PAY\_CUSE\_02** | invoice (N4N11), labOrder (N11N13) | id: 102, { payment\_method: "VIETQR" } | Hóa đơn CLS có reference\_id \= "CLS\_102", BN có status \= "Đã khám" | labOrder.payment\_status \= "PAID", hóa đơn chuyển PAID. |
| **TC\_PAY\_CUSE\_03** | Fallback của payment\_method & cashier (N1N9,N17) | id: 103 *(không truyền paymentDetails)* | Hóa đơn hợp lệ | Dùng giá trị mặc định: payment\_method \= "TIEN\_MAT", cashier \= "Trần Văn Thu Ngân". |

| Mã TC | Biến & Cạnh p-use được phủ | Dữ liệu đầu vào (idOrCode, paymentDetails) | Trạng thái Mock Data | Kết quả mong đợi |
| :---- | :---- | :---- | :---- | :---- |
| **TC\_PAY\_PUSE\_01** | payment\_method trên (N2,N3) | id: 1, { payment\_method: "VNPAY" } | Bất kỳ | Quăng lỗi: Phương thức thanh toán không hợp lệ |
| **TC\_PAY\_PUSE\_02** | payment\_method trên (N2,N4), invoice trên (N5,N6) | id: "HD\_KHONG\_CO", { payment\_method: "TIEN\_MAT" } | Không có hóa đơn | Quăng lỗi HTTP 404: Không tìm thấy hóa đơn |
| **TC\_PAY\_PUSE\_03** | invoice trên (N5,N7) và (N7,N8) | id: "HD\_DA\_TRA", { payment\_method: "TIEN\_MAT" } | invoice.status \= "PAID" | Quăng lỗi HTTP 400: Hóa đơn này đã được thanh toán trước đó |
| **TC\_PAY\_PUSE\_04** | invoice trên (N7,N9) và (N10,N14), patient trên (N15,N17) | id: "HD\_TIEN\_KHAM", { payment\_method: "TIEN\_MAT" } | Hóa đơn khám, BN có status \= "Đã khám" | Bỏ qua CLS, bỏ qua đổi trạng thái BN, hoàn tất thành công |
| **TC\_PAY\_PUSE\_05** | invoice trên (N10,N11), labOrder trên (N12,N13) | id: "HD\_CLS\_HOP\_LE", { payment\_method: "VIETQR" } | Hóa đơn CLS có reference\_id \= "CLS01" có trong DB | labOrder.payment\_status \= "PAID" |
| **TC\_PAY\_PUSE\_06** | labOrder trên (N12,N14) | id: "HD\_CLS\_AO", { payment\_method: "VIETQR" } | Hóa đơn CLS có reference\_id \= "CLS\_AO" không có trong DB | Bỏ qua gán labOrder, hoàn tất thành công |
| **TC\_PAY\_PUSE\_07** | patient trên (N15,N16) | id: "HD\_CHO\_TT", { payment\_method: "THE" } | BN có status \= "Chờ thanh toán" | patient.status \= "Đã khám", phát PATIENT\_STATUS\_CHANGED |

\- Quản lý danh mục thuốc và tồn kho

| Mã TC | Biến & Cặp def \-\> c-use được phủ | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| :---- | :---- | :---- | :---- |
| **TC\_MED\_CUSE\_01** | medicine\_name, numPrice, numStock, active\_ingredient (N1N11a), trimmedActive (N11aN13), expiry\_date, nextId, newMed | { medicine\_name: "  Paracetamol 500mg ", active\_ingredient: "  Paracetamol ", unit: "Viên", unit\_price: "2000", stock\_quantity: 500, category: "Giảm đau", expiry\_date: "2028-06-30" } | Thuốc được tạo thành công:- medicine\_name \= "Paracetamol 500mg"- active\_ingredient \= "Paracetamol"- unit\_price \= 2000- stock\_quantity \= 500- expiry\_date \= "2028-06-30" |
| **TC\_MED\_CUSE\_02** | trimmedActive (N11bN13), fallback expiry\_date (N12N13), fallback unit, fallback category | { medicine\_name: "Oresol 245", unit\_price: 5000, stock\_quantity: 100 } *(không truyền active\_ingredient, unit, category, expiry\_date)* | Thuốc được tạo thành công với giá trị fallback:- active\_ingredient \= "" (từ N11b)- unit \= "Viên"- category \= "Khác"- expiry\_date \= "2027-12-31" |
| **TC\_MED\_CUSE\_03** | Fallback stock\_quantity \= 0 (N1N7N13) | { medicine\_name: "Cồn đỏ Povidine 10%", unit\_price: 15000 } *(không truyền stock\_quantity)* | Thuốc được tạo thành công với stock\_quantity \= 0\. |

| Mã TC | Biến & Cạnh p-use được phủ | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| :---- | :---- | :---- | :---- |
| **TC\_MED\_PUSE\_01** | medicine\_name trên (N2,N3) | { medicine\_name: "", unit\_price: 5000 } | Quăng lỗi HTTP 400: Tên thuốc là bắt buộc |
| **TC\_MED\_PUSE\_02** | unit\_price trên (N5,N6) | { medicine\_name: "Klacid 500mg" } *(thiếu unit\_price)* | Quăng lỗi HTTP 400: Đơn giá thuốc phải lớn hơn 0 |
| **TC\_MED\_PUSE\_03** | numPrice trên (N5,N6) | { medicine\_name: "Klacid 500mg", unit\_price: \-500 } | Quăng lỗi HTTP 400: Đơn giá thuốc phải lớn hơn 0 |
| **TC\_MED\_PUSE\_04** | numStock trên (N8,N9) | { medicine\_name: "Klacid 500mg", unit\_price: 25000, stock\_quantity: \-1 } | Quăng lỗi HTTP 400: Số lượng tồn kho không được là số âm |
| **TC\_MED\_PUSE\_05** | active\_ingredient trên (N11,N11a) kèm các cạnh hợp lệ (N2,N4),(N5,N7),(N8,N10) | { medicine\_name: "Klacid 500mg", active\_ingredient: "Clarithromycin", unit\_price: 25000, stock\_quantity: 100 } | Tạo thành công: medicine\_code \= "MED001", active\_ingredient \= "Clarithromycin" |
| **TC\_MED\_PUSE\_06** | active\_ingredient trên (N11,N11b) kèm các cạnh hợp lệ (N2,N4),(N5,N7),(N8,N10) | { medicine\_name: "Bông cồn sát trùng", active\_ingredient: null, unit\_price: 15000, stock\_quantity: 50 } | Tạo thành công: active\_ingredient \= "" |

| Mã TC | Biến & Cặp def \-\> use được phủ | Dữ liệu kiểm thử | Kết quả mong đợi |
| :---- | :---- | :---- | :---- |
| **TC\_UP\_DF\_01** | existing (1→5), stock\_quantity (4→5), updated (5→9,10,11), idx (7→8,9) | id: 1, { stock\_quantity: 120 } | Cập nhật số lượng tồn kho lên 120, gán vào mảng và phát event |
| **TC\_UP\_DF\_02** | unit\_price (4→5), active\_ingredient (4→5), medicine\_name (4→5) | id: 1, { medicine\_name: "Panadol Extra Mới", active\_ingredient: "Paracetamol 650mg", unit\_price: 3000 } | Cập nhật tên, hoạt chất và đơn giá thành công |
| **TC\_UP\_DF\_03** | existing trên rẽ nhánh (2,3) | id: 8888 (không có trong DB) | Quăng lỗi HTTP 404: Không tìm thấy thuốc |

---

# Kiểm thử đơn vị (Unit Testing) tự động

## I. Tìm hiểu và trình bày về Kiểm thử đơn vị
*(Theo bài giảng "Kiểm thử đơn vị - sd NUnit", ThS. Nguyễn Thị Phương Dung - ĐH Thủy Lợi)*

### 1.1 Khái niệm & Mục tiêu
* **Khái niệm:** Kiểm thử đơn vị (Unit Testing) là mức độ kiểm thử phần mềm ở cấp độ nhỏ nhất có thể cô lập được (hàm, phương thức, lớp đối tượng).
* **Mục tiêu:** Kiểm tra một đơn vị công việc độc lập so với một **kết quả giả định (Expected)**. Nếu kết quả thực tế (**Actual**) khác với kết quả giả định, đơn vị kiểm thử được coi là thất bại (**Fail**).
* **Vị trí trong chu trình:** Được thực hiện sớm nhất trong vòng đời phát triển phần mềm, giúp cô lập nguyên nhân gây lỗi và tiết kiệm chi phí bảo trì.

### 1.2 Năm đặc điểm sống còn của Unit Test (Slide 3)
1. **Ngắn gọn, dễ đọc, dễ hiểu:** Ca kiểm thử chỉ tập trung kiểm tra một hành vi duy nhất.
2. **Độc lập tuyệt đối (Isolated):** Không phụ thuộc vào kết quả hay thứ tự chạy của các ca kiểm thử khác.
3. **Quy chuẩn đặt tên hàm rõ ràng:**
   $$\text{Test\_<TênHàm>\_<KịchBản/ĐiềuKiện>\_<KếtQuảMongĐợi>}$$
4. **Tốc độ thực thi siêu nhanh:** Không gọi I/O, mạng hoặc database thật; tận dụng In-Memory Fake/Mock Repository.
5. **Cô lập đối tượng kiểm thử:** Tách biệt hoàn toàn lớp nghiệp vụ (*Business Logic*) khỏi tầng truy xuất dữ liệu (*Data Access*).

### 1.3 Cấu trúc Suite và Lớp Assert
* **Annotation/Attributes:**
  * `[TestFixture]`: Đánh dấu Suite chứa các ca kiểm thử.
  * `[Test]`: Đánh dấu phương thức kiểm thử cụ thể.
  * `[SetUp]` / `[TearDown]`: Khởi tạo và dọn dẹp môi trường trước/sau mỗi test.
* **Bộ Assertion NUnit chuẩn hóa:**
  * `Assert.AreEqual(expected, actual)`: So sánh bằng giá trị.
  * `Assert.Less(x, y)` / `Assert.Greater(x, y)`: So sánh quan hệ toán học.
  * `Assert.IsNull(obj)` / `Assert.IsNotNull(obj)`: Kiểm tra đối tượng rỗng.
  * `Assert.IsTrue(bool)` / `Assert.IsFalse(bool)`: Kiểm tra biểu thức chân lý.
  * `Assert.Throws(action)`: Kiểm tra ngoại lệ ném ra khi vi phạm nghiệp vụ.

---

## II. Hướng dẫn cách cài đặt và sử dụng công cụ tương ứng cho dự án

### 2.1 Lựa chọn công cụ cho dự án Node.js (ES Modules)
Dự án HIS-Hospital sử dụng **Node.js (JavaScript ES Modules) và React 19/Vite**. Nhóm triển khai giải pháp kết hợp hai công cụ:
* **Node.js Native Test Runner (`node:test`):** Có sẵn trong Node.js v18+, tốc độ tức thì (~100ms), 0 dependencies.
* **Vitest (`vitest` + `@vitest/ui`):** Tương thích hoàn hảo với hệ sinh thái Vite, cung cấp giao diện Web Dashboard tương tự Test Explorer của NUnit trong Visual Studio.

### 2.2 Cài đặt thư viện
Tại thư mục `backend/`:
```bash
npm install -D vitest @vitest/ui @vitest/coverage-v8
```

### 2.3 Cấu hình thực thi
* **File `backend/vitest.config.js`:**
```javascript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/unitTest_NUnitStyle_3ChucNang.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "src/services/invoiceService.js",
        "src/services/medicineService.js",
        "src/patterns/strategy/billingStrategy.js",
        "src/patterns/state/invoiceState.js"
      ]
    }
  }
});
```

* **Scripts trong `backend/package.json`:**
```json
"scripts": {
  "test:unit": "node --test test/unitTest_NUnitStyle_3ChucNang.test.js",
  "test:vitest": "vitest run",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage"
}
```

### 2.4 Lớp bọc Assert Adapter và Test Bridge
* **`backend/test/helpers/nunitAssert.js`:** Cung cấp đầy đủ các phương thức `Assert.AreEqual`, `Assert.Less`, `Assert.Greater`, `Assert.IsTrue`, `Assert.Throws`... chuẩn NUnit.
* **`backend/test/helpers/testBridge.js`:** Đảm bảo test chạy thông suốt trên cả `node --test` lẫn `vitest`.

### 2.5 Hướng dẫn chạy kiểm thử
1. **Chạy kiểm thử đơn vị dòng lệnh:**
   ```bash
   npm run test:unit
   # hoặc
   npm run test:vitest
   ```
2. **Xem báo cáo độ bao phủ mã nguồn (Coverage):**
   ```bash
   npm run test:coverage
   ```
3. **Mở giao diện Web Dashboard tương tác (Test Explorer):**
   ```bash
   npm run test:ui
   ```

---

## III. Thực hiện kiểm thử các đơn vị trong chức năng đảm nhiệm

Toàn bộ **63 test cases** (kết hợp các ca Hộp đen cấp độ hàm và Hộp trắng CFG C1/C2/C3, DFG All c-use/All p-use từ danh sách trên) được hiện thực hóa trong file [`backend/test/unitTest_NUnitStyle_3ChucNang.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/unitTest_NUnitStyle_3ChucNang.test.js) mà **tuyệt đối không can thiệp hay sửa đổi bất kỳ dòng code nghiệp vụ nào trong `backend/src/`**.

### 3.1 Ma trận hiện thực hóa 63 Test Cases tự động

#### A. Chức năng 1: Lập hóa đơn viện phí (30 Test Cases)
| STT | Mã TC | Phương thức kiểm thử | Bộ dữ liệu đầu vào | Kết quả mong đợi | Assert NUnit |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | **TC_F5_01** | `validateInvoiceCreationInput` | `patient_id: "B"` (1 ký tự) | `isValid: true` | `Assert.IsTrue` |
| 2 | **TC_F5_02** | `validateInvoiceCreationInput` | `patient_id: 20 ký tự` | `isValid: true` | `Assert.IsTrue` |
| 3 | **TC_F5_03** | `validateInvoiceCreationInput` | `patient_id: 21 ký tự` (Max+) | `isValid: false`, lỗi độ dài | `Assert.IsFalse` |
| 4 | **TC_F5_04** | `validateInvoiceCreationInput` | `patient_id: "BN-123@"` (Ký tự đặc biệt) | `isValid: false` | `Assert.IsFalse` |
| 5 | **TC_F5_05** | `validateInvoiceCreationInput` | `patient_name: "A"` (1 ký tự) | `isValid: true` | `Assert.IsTrue` |
| 6 | **TC_F5_06** | `validateInvoiceCreationInput` | `patient_name: 50 ký tự` | `isValid: true` | `Assert.IsTrue` |
| 7 | **TC_F5_07** | `validateInvoiceCreationInput` | `patient_name: 51 ký tự` (Max+) | `isValid: false` | `Assert.IsFalse` |
| 8 | **TC_F5_08** | `validateInvoiceCreationInput` | `patient_name: "Nguyen Van A123"` | `isValid: false` | `Assert.IsFalse` |
| 9 | **TC_F5_09** | `validateInvoiceCreationInput` | `{}` (Bỏ trống cả mã và tên) | `isValid: false, errorCode: "E1.1"` | `Assert.AreEqual` |
| 10 | **TC_F5_10** | `getPendingCharges` | `patient_id: "BN999999"` | Quăng lỗi HTTP 404 | `Assert.Throws` |
| 11 | **TC_F5_11/15** | `getPendingCharges` | BN có phiếu khám 150,000đ | `can_create_invoice: true`, tính đúng BHYT | `Assert.IsTrue` |
| 12 | **TC_F5_12** | `getPendingCharges` | Hóa đơn tiền khám đã thanh toán (PAID) | `can_create_invoice: false` | `Assert.IsFalse` |
| 13 | **TC_F5_13** | `createInvoice` | `total_amount: 0` | Lỗi: Tổng tiền phải lớn hơn 0 | `Assert.Throws` |
| 14 | **TC_F5_14** | `createInvoice` | `total: 300000, discount: 60000` | Tạo thành công hóa đơn UNPAID | `Assert.AreEqual` |
| 15 | **TC_C1_01** | `createInvoice` | `{ total_amount: 100000 }` (thiếu mã BN) | Lỗi HTTP 400: Thiếu thông tin | `Assert.Throws` |
| 16 | **TC_C1_02** | `createInvoice` | `total_amount: 0` | Lỗi: Tổng tiền phải lớn hơn 0 | `Assert.Throws` |
| 17 | **TC_C1_03** | `createInvoice` | `insurance_discount: -20000` | Lỗi: Giảm trừ không được âm | `Assert.Throws` |
| 18 | **TC_C1_04** | `createInvoice` | `total: 100000, discount: 150000` | Lỗi: Vượt quá tổng tiền | `Assert.Throws` |
| 19 | **TC_C1_05** | `createInvoice` | `method: "CHUA_THANH_TOAN"` | `status = "UNPAID", patient_pay = 20000` | `Assert.AreEqual` |
| 20 | **TC_C1_06** | `createInvoice` | `method: "TIEN_MAT"` | `status = "PAID", patient_pay = 200000` | `Assert.AreEqual` |
| 21 | **TC_C2_03** | `createInvoice` | `total_amount: -1000` | Lỗi: Tổng tiền phải lớn hơn 0 | `Assert.Throws` |
| 22 | **TC_C2_09** | `createInvoice` | `method: "VIETQR"` | `status = "PAID", patient_pay = 500000` | `Assert.AreEqual` |
| 23 | **TC_C3_02** | `createInvoice` | `patient_name: ""` | Lỗi: Thiếu thông tin bắt buộc | `Assert.Throws` |
| 24 | **TC_C3_03** | `createInvoice` | `total_amount: undefined` | Lỗi: Thiếu thông tin bắt buộc | `Assert.Throws` |
| 25 | **TC_C3_04** | `createInvoice` | `total_amount: null` | Lỗi: Thiếu thông tin bắt buộc | `Assert.Throws` |
| 26 | **TC_C3_05** | `createInvoice` | `total_amount: "KHONG_PHAI_SO"` | Lỗi: Tổng tiền phải lớn hơn 0 | `Assert.Throws` |
| 27 | **TC_C3_10** | `createInvoice` | `payment_method: ""` | Tạo thành công hóa đơn UNPAID | `Assert.AreEqual` |
| 28 | **TC_CUSE_01** | `createInvoice` | `total: 500000, discount: 100000` | `patient_pay = 400000` | `Assert.AreEqual` |
| 29 | **TC_CUSE_02** | `createInvoice` | `item_type: "CAN_LAM_SANG"` | `status = "PAID"`, đúng dịch vụ | `Assert.AreEqual` |
| 30 | **TC_CUSE_03** | `createInvoice` | Bỏ trống type/discount | `discount = 0`, `item_type = "TIEN_KHAM"` | `Assert.AreEqual` |

#### B. Chức năng 2: Thanh toán hóa đơn viện phí (16 Test Cases)
| STT | Mã TC | Phương thức kiểm thử | Bộ dữ liệu đầu vào | Kết quả mong đợi | Assert NUnit |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 31 | **TC_F6_01** | `processPayment` | Hóa đơn có `status = "PAID"` | Lỗi HTTP 400: Đã được thanh toán | `Assert.Throws` |
| 32 | **TC_F6_04** | `processPayment` | `payment_method: ""` | Lỗi: Phương thức không hợp lệ | `Assert.Throws` |
| 33 | **TC_F6_07** | `processPayment` | `payment_method: "TIEN_MAT"` | `status = "PAID"`, `paid_at` khác null | `Assert.AreEqual` |
| 34 | **TC_F6_09** | `processPayment` | `payment_method: "VIETQR"` | Đồng bộ CLS -> PAID, BN -> Đã khám | `Assert.AreEqual` |
| 35 | **TC_PAY_C1_01** | `processPayment` | `payment_method: "BITCOIN"` | Lỗi: Phương thức không hợp lệ | `Assert.Throws` |
| 36 | **TC_PAY_C1_02** | `processPayment` | `id: 9999` (Không có trong DB) | Lỗi HTTP 404: Không tìm thấy hóa đơn | `Assert.Throws` |
| 37 | **TC_PAY_C2_10** | `processPayment` | `reference_id: "CLS_AO"` | Hoàn tất thanh toán, bỏ qua cập nhật CLS | `Assert.AreEqual` |
| 38 | **TC_PAY_C2_11** | `processPayment` | BN có status `"Chờ thanh toán"` | BN -> `"Đã khám"`, phát `PATIENT_STATUS_CHANGED` | `Assert.AreEqual` |
| 39 | **TC_PAY_C3_07** | `processPayment` | `item_type: "TIEN_KHAM"` | Bỏ qua cập nhật CLS | `Assert.AreEqual` |
| 40 | **TC_PAY_C3_08** | `processPayment` | `reference_id: null` | Bỏ qua cập nhật CLS | `Assert.AreEqual` |
| 41 | **TC_PAY_C3_11** | `processPayment` | `patientRepository` trả về null | Bỏ qua cập nhật BN, hoàn tất thành công | `Assert.AreEqual` |
| 42 | **TC_PAY_C3_12** | `processPayment` | BN có status `"Đang khám"` | Giữ nguyên trạng thái BN | `Assert.AreEqual` |
| 43 | **TC_PAY_CUSE_01**| `processPayment` | Thanh toán TIEN_MAT có cashier | Cập nhật đủ thu ngân, thời gian, trạng thái | `Assert.AreEqual` |
| 44 | **TC_PAY_CUSE_02**| `processPayment` | Hóa đơn CLS hợp lệ | Phiếu CLS chuyển `payment_status = "PAID"` | `Assert.AreEqual` |
| 45 | **TC_PAY_CUSE_03**| `processPayment` | Không truyền paymentDetails | Mặc định `"TIEN_MAT"`, `"Trần Văn Thu Ngân"` | `Assert.AreEqual` |
| 46 | **TC_PAY_PUSE_01**| `processPayment` | `payment_method: "VNPAY"` | Lỗi: Phương thức không hợp lệ | `Assert.Throws` |

#### C. Chức năng 3: Quản lý danh mục thuốc và tồn kho (17 Test Cases)
| STT | Mã TC | Phương thức kiểm thử | Bộ dữ liệu đầu vào | Kết quả mong đợi | Assert NUnit |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 47 | **TC_F9_02** | `createMedicine` | `unit_price: 0` | Lỗi HTTP 400: Đơn giá phải lớn hơn 0 | `Assert.Throws` |
| 48 | **TC_MED_C1_01** | `createMedicine` | `medicine_name: "   "` | Lỗi HTTP 400: Tên thuốc là bắt buộc | `Assert.Throws` |
| 49 | **TC_MED_C1_03** | `createMedicine` | `stock_quantity: -5` | Lỗi HTTP 400: Tồn kho không được âm | `Assert.Throws` |
| 50 | **TC_MED_C1_04** | `createMedicine` | Dữ liệu hợp lệ đầy đủ | Sinh mã `MED011`, trim tên, phát event | `Assert.AreEqual` |
| 51 | **TC_MED_C1_05** | `createMedicine` | Thiếu ingredient, unit, category | Fallback `active_ingredient="", unit="Viên"` | `Assert.AreEqual` |
| 52 | **TC_MED_C2_03** | `createMedicine` | `unit_price: -100` | Lỗi HTTP 400: Đơn giá phải lớn hơn 0 | `Assert.Throws` |
| 53 | **TC_MED_C3_03** | `createMedicine` | Không truyền `unit_price` | Lỗi HTTP 400: Đơn giá phải lớn hơn 0 | `Assert.Throws` |
| 54 | **TC_MED_C3_04** | `createMedicine` | `unit_price: "ABC"` | Lỗi HTTP 400: Đơn giá phải lớn hơn 0 | `Assert.Throws` |
| 55 | **TC_MED_C3_06** | `createMedicine` | `stock_quantity: "VO_HAN"` | Lỗi HTTP 400: Tồn kho không được âm | `Assert.Throws` |
| 56 | **TC_MED_CUSE_03**| `createMedicine` | Không truyền `stock_quantity` | Fallback `stock_quantity = 0` | `Assert.AreEqual` |
| 57 | **TC_UP_01** | `updateMedicine` | `id: 9999` (Không có trong kho) | Lỗi HTTP 404: Không tìm thấy thuốc | `Assert.Throws` |
| 58 | **TC_UP_02** | `updateMedicine` | `id: 1, { stock: 350, price: 2200 }`| Cập nhật thành công, phát event | `Assert.AreEqual` |
| 59 | **TC_UP_03** | `updateMedicine` | `code: "MED002", { name: " Amox " }`| Cập nhật theo code, trim tên thành công | `Assert.AreEqual` |
| 60 | **TC_UP_C3_01** | `updateMedicine` | `idOrCode: 1, { unit: "Hộp" }` | Cập nhật đơn vị tính `unit = "Hộp"` | `Assert.AreEqual` |
| 61 | **TC_UP_DF_02** | `updateMedicine` | Đổi tên, hoạt chất và đơn giá | Cập nhật đầy đủ 3 trường | `Assert.AreEqual` |
| 62 | **TC_DEL_01** | `deleteMedicine` | `id: 9999` (Không có trong kho) | Lỗi HTTP 404: Không tìm thấy thuốc | `Assert.Throws` |
| 63 | **TC_DEL_02** | `deleteMedicine` | `id: 1` | Xóa thành công, kho giảm 1 | `Assert.IsNotNull` |

---

### 3.2 Kết quả thực thi kiểm thử và Độ bao phủ (Coverage)

* **Kết quả kiểm thử tự động:**
  * **Tổng số ca kiểm thử:** 63 / 63 Passed (100%)
  * **Thời gian thực thi:** 125ms (Node Test Runner) / 234ms (Vitest)
  * **Trạng thái:** 0 Failed, 0 Skipped
* **Độ bao phủ mã nguồn (V8 Coverage):**
  * `patterns/state/invoiceState.js`: **83.33%** lines
  * `patterns/strategy/billingStrategy.js`: **66.66%** lines
  * `services/medicineService.js`: **71.66%** lines
  * `services/invoiceService.js`: **57.97%** lines (toàn bộ các nhánh lập hóa đơn và thanh toán đều được thực thi)

