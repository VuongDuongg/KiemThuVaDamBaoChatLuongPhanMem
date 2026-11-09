import docx
from docx.oxml.text.paragraph import CT_P
from docx.oxml.table import CT_Tbl
from docx.text.paragraph import Paragraph
from docx.table import Table
import re
import os

doc = docx.Document('N1_Hospital.docx')
body = list(doc.element.body)

def flatten_element(el):
    tag = el.tag.split('}')[-1]
    if tag == 'p':
        return [('p', el)]
    elif tag == 'tbl':
        return [('tbl', el)]
    elif tag == 'sdt':
        sdt_content = el.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}sdtContent')
        target = sdt_content if sdt_content is not None else el
        res = []
        for child in target:
            res.extend(flatten_element(child))
        return res
    return []

flat_list = []
for el in body:
    flat_list.extend(flatten_element(el))

print(f'Total flattened elements: {len(flat_list)}')

def table_to_md(tbl):
    rows_data = []
    for row in tbl.rows:
        row_vals = []
        for cell in row.cells:
            c_text = cell.text.strip().replace('\n', '<br>').replace('|', '\\|')
            row_vals.append(c_text)
        rows_data.append(row_vals)
    if not rows_data:
        return ''
    header = rows_data[0]
    num_cols = len(header)
    res = ['| ' + ' | '.join(header) + ' |']
    res.append('| ' + ' | '.join(['---'] * num_cols) + ' |')
    for r in rows_data[1:]:
        if len(r) < num_cols:
            r = r + [''] * (num_cols - len(r))
        elif len(r) > num_cols:
            r = r[:num_cols]
        res.append('| ' + ' | '.join(r) + ' |')
    return '\n'.join(res)

def extract_elements_md(start_idx, end_idx, base_heading_level=4):
    lines = []
    in_code_mode = False
    code_lines = []

    def flush_code():
        nonlocal in_code_mode, code_lines
        if code_lines:
            lines.append('\n```javascript')
            lines.extend(code_lines)
            lines.append('```\n')
            code_lines = []
        in_code_mode = False

    for i in range(start_idx, end_idx + 1):
        el_type, el = flat_list[i]
        if el_type == 'tbl':
            flush_code()
            tbl = Table(el, doc)
            md_tbl = table_to_md(tbl)
            if md_tbl:
                lines.append(md_tbl)
                lines.append('')
        elif el_type == 'p':
            p = Paragraph(el, doc)
            text = p.text.strip()
            if not text:
                continue
            
            style = p.style.name
            
            # Start of a code listing section
            if any(k in text.upper() for k in ['ĐÁNH SỐ DÒNG MÃ NGUỒN', 'HÀM KIỂM TRA BIẾN ĐẦU VÀO', 'HÀM KIỂM THỬ']):
                flush_code()
                h_prefix = '#' * base_heading_level
                lines.append(f'\n{h_prefix} {text}\n')
                in_code_mode = True
                continue
            
            # Check if this paragraph is a formal heading
            is_formal_heading = (
                style.startswith('Heading') or 
                bool(re.match(r'^\d+\.\d+(\.\d+)?\s+[A-ZÀ-Ỹ]', text)) or
                bool(re.match(r'^[A-Z]\.\s+CHỨC NĂNG', text))
            )
            
            if is_formal_heading:
                flush_code()
                if (i == start_idx) and (style.startswith('Heading 2') or style.startswith('Heading 3')):
                    continue
                h_prefix = '#' * base_heading_level
                lines.append(f'\n{h_prefix} {text}\n')
                continue
            
            if in_code_mode:
                # If we encounter regular Vietnamese text that signals end of code block (e.g. "Mục tiêu C1:", "Đồ thị", etc.)
                if any(text.startswith(prefix) for prefix in ['1.2.', '2.2.', '3.2.', '4.2.', 'Mục tiêu ', 'Theo Định nghĩa', 'Trên đồ thị', 'Tỷ lệ bao phủ']):
                    flush_code()
                    lines.append(text)
                    continue
                else:
                    code_lines.append(text)
                    continue
            
            # Detect standalone code lines
            is_code_line = bool(
                re.match(r'^(import|export|describe\(|test\(|assert\.)', text) or
                re.match(r'^\d+\.\s+(const|let|var|if|return|throw|try|catch|async|await|function)', text)
            )
            if is_code_line:
                code_lines.append(text)
                in_code_mode = True
                continue

            if re.match(r'^[a-z]\)\s+', text):
                lines.append(f'\n**{text}**\n')
            elif text.startswith(('Bước ', 'Mã rẽ nhánh ', 'Mã ngoại lệ ', '- ', '• ')):
                if not text.startswith(('-', '• ')):
                    lines.append(f'- **{text}**')
                else:
                    lines.append(text)
            else:
                lines.append(text)
    flush_code()
    return '\n'.join(lines)

def extract_md_section(file_path, start_pattern, end_pattern=None):
    if not os.path.exists(file_path):
        return f"File {file_path} not found"
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    start_match = re.search(start_pattern, content)
    if not start_match:
        return f"Start pattern '{start_pattern}' not found in {file_path}"
    start_idx = start_match.start()
    
    if end_pattern:
        end_match = re.search(end_pattern, content[start_idx + len(start_match.group(0)):])
        if end_match:
            end_idx = start_idx + len(start_match.group(0)) + end_match.start()
            res = content[start_idx:end_idx].strip()
        else:
            res = content[start_idx:].strip()
    else:
        res = content[start_idx:].strip()
    
    lines = []
    for line in res.split('\n'):
        if line.startswith('## '):
            lines.append(f"\n> **{line.replace('## ', '').strip()}**\n")
        elif line.startswith('### '):
            lines.append(f"\n#### {line.replace('### ', '').strip()}\n")
        elif line.startswith('#### '):
            lines.append(f"\n##### {line.replace('#### ', '').strip()}\n")
        else:
            lines.append(line)
    return '\n'.join(lines)

thai_doc = 'his-hospital/docs/thai/Kiem_Thu_Don_Vi_NUnit_3ChucNang_DangKy_KhamBenh_DieuPhoi.md'
vuong_doc = 'his-hospital/docs/vuong/Kiem_Thu_Don_Vi_NUnit_HIS_Hospital.md'
anh_doc = 'his-hospital/docs/anh/Kiem_Thu_Don_Vi_NUnit_3ChucNang_KhamBenh_CLS_KeDon.md'
khanh_doc = 'his-hospital/docs/khanh/Kiem_Thu_Don_Vi_NUnit_Validate_CLS_Lab_Pacs.md'

output_path = 'N1_Hospital_ThanhVien.md'

print('Building Markdown content with contiguous code blocks...')

md_parts = []

# Title & Overview
md_parts.append('# BÁO CÁO BÀI TẬP MÔN HỌC KIỂM THỬ VÀ ĐẢM BẢO CHẤT LƯỢNG PHẦN MỀM')
md_parts.append('**Đề tài:** Kiểm thử dự án quản lý và điều phối bệnh viện TKAV (HIS-Hospital)  ')
md_parts.append('**Giảng viên phụ trách môn học:** TS. Nguyễn Thị Phương Dung  ')
md_parts.append('**Đơn vị:** Khoa Công nghệ Thông tin - Trường Đại học Thủy Lợi  ')
md_parts.append('\n---\n')

md_parts.append('## DANH SÁCH THÀNH VIÊN VÀ BẢNG PHÂN CÔNG NHIỆM VỤ')
md_parts.append("""| STT | Họ và tên | Chức năng đảm nhiệm đặc tả & kiểm thử |
| --- | --- | --- |
| 1 | **Nguyễn Hồng Thái** | 1. Đăng ký hồ sơ bệnh nhân mới<br>2. Đăng ký khám và cấp số thứ tự<br>3. Điều phối và gọi số khám |
| 2 | **Dương Quốc Vượng** | 1. Lập hóa đơn viện phí<br>2. Thanh toán hóa đơn viện phí<br>3. Quản lý danh mục thuốc và tồn kho |
| 3 | **Ngô Tuấn Anh** | 1. Cập nhật thông tin bệnh án và chẩn đoán<br>2. Chỉ định dịch vụ cận lâm sàng<br>3. Kê đơn thuốc |
| 4 | **Lê Tuấn Khanh** | 1. Tiếp nhận chỉ định cận lâm sàng<br>2. Nhập kết quả xét nghiệm định lượng<br>3. Tải lên hình ảnh chẩn đoán và kết luận PACS |
""")

md_parts.append('\n---\n')

members = [
    {
        'name': 'Nguyễn Hồng Thái',
        'functions': [
            {
                'name': 'Đăng ký hồ sơ bệnh nhân mới',
                'dac_ta': (183, 205),
                'hop_den': (250, 272),
                'hop_trang': (329, 383),
                'unit_test': extract_md_section(thai_doc, r'## 3\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 1', r'## 4\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2')
            },
            {
                'name': 'Đăng ký khám và cấp số thứ tự',
                'dac_ta': (206, 227),
                'hop_den': (273, 298),
                'hop_trang': (384, 411),
                'unit_test': extract_md_section(thai_doc, r'## 4\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2', r'## 5\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3')
            },
            {
                'name': 'Điều phối và gọi số khám',
                'dac_ta': (228, 248),
                'hop_den': (299, 327),
                'hop_trang': (412, 471),
                'unit_test': extract_md_section(thai_doc, r'## 5\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3', r'## 6\. HƯỚNG DẪN THỰC THI')
            }
        ]
    },
    {
        'name': 'Dương Quốc Vượng',
        'functions': [
            {
                'name': 'Lập hóa đơn viện phí',
                'dac_ta': (474, 496),
                'hop_den': (541, 573),
                'hop_trang': (638, 742),
                'unit_test': extract_md_section(vuong_doc, r'## 3\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 1', r'## 4\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2')
            },
            {
                'name': 'Thanh toán hóa đơn viện phí',
                'dac_ta': (497, 517),
                'hop_den': (574, 604),
                'hop_trang': (743, 849),
                'unit_test': extract_md_section(vuong_doc, r'## 4\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2', r'## 5\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3')
            },
            {
                'name': 'Quản lý danh mục thuốc và tồn kho',
                'dac_ta': (518, 539),
                'hop_den': (605, 636),
                'hop_trang': (850, 1014),
                'unit_test': extract_md_section(vuong_doc, r'## 5\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3', r'## 6\. HƯỚNG DẪN THỰC THI')
            }
        ]
    },
    {
        'name': 'Ngô Tuấn Anh',
        'functions': [
            {
                'name': 'Cập nhật thông tin bệnh án và chẩn đoán',
                'dac_ta': (1019, 1042),
                'hop_den': (1098, 1129),
                'hop_trang': (1191, 1255),
                'unit_test': extract_md_section(anh_doc, r'## 3\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 1', r'## 4\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2')
            },
            {
                'name': 'Chỉ định dịch vụ cận lâm sàng',
                'dac_ta': (1043, 1068),
                'hop_den': (1130, 1154),
                'hop_trang': (1256, 1323),
                'unit_test': extract_md_section(anh_doc, r'## 4\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2', r'## 5\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3')
            },
            {
                'name': 'Kê đơn thuốc',
                'dac_ta': (1069, 1096),
                'hop_den': (1155, 1189),
                'hop_trang': (1324, 1391),
                'unit_test': extract_md_section(anh_doc, r'## 5\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3', r'## 6\. HƯỚNG DẪN THỰC THI')
            }
        ]
    },
    {
        'name': 'Lê Tuấn Khanh',
        'functions': [
            {
                'name': 'Tiếp nhận chỉ định cận lâm sàng',
                'dac_ta': (1394, 1410),
                'hop_den': (1448, 1470),
                'hop_trang': (1532, 1629),
                'unit_test_docx_range_fn': (1798, 1826),
                'unit_test_docx_range_test': (1878, 1922),
                'unit_test_md': extract_md_section(khanh_doc, r'## 3\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 1', r'## 4\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2')
            },
            {
                'name': 'Nhập kết quả xét nghiệm định lượng',
                'dac_ta': (1411, 1429),
                'hop_den': (1471, 1496),
                'hop_trang': (1630, 1718),
                'unit_test_docx_range_fn': (1827, 1847),
                'unit_test_docx_range_test': (1923, 1967),
                'unit_test_md': extract_md_section(khanh_doc, r'## 4\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2', r'## 5\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3')
            },
            {
                'name': 'Tải lên hình ảnh chẩn đoán và kết luận PACS',
                'dac_ta': (1430, 1446),
                'hop_den': (1497, 1529),
                'hop_trang': (1719, 1795),
                'unit_test_docx_range_fn': (1848, 1877),
                'unit_test_docx_range_test': (1968, 2030),
                'unit_test_md': extract_md_section(khanh_doc, r'## 5\. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3', r'## 6\. HƯỚNG DẪN THỰC THI')
            }
        ]
    }
]

for m_idx, m in enumerate(members, 1):
    m_name = m['name']
    print(f'Processing Member {m_idx}: {m_name}...')
    md_parts.append(f'# {m_name}\n')
    
    for f_idx, fn in enumerate(m['functions'], 1):
        fn_name = fn['name']
        print(f'  -> Function {f_idx}: {fn_name}')
        md_parts.append(f'## Chức năng {f_idx}: {fn_name}\n')
        
        # 1. Đặc tả
        md_parts.append('### 1. Đặc tả\n')
        dac_ta_text = extract_elements_md(fn['dac_ta'][0], fn['dac_ta'][1])
        md_parts.append(dac_ta_text)
        md_parts.append('\n')
        
        # 2. Kiểm thử hộp đen
        md_parts.append('### 2. Kiểm thử hộp đen\n')
        hop_den_text = extract_elements_md(fn['hop_den'][0], fn['hop_den'][1])
        md_parts.append(hop_den_text)
        md_parts.append('\n')
        
        # 3. Kiểm thử hộp trắng
        md_parts.append('### 3. Kiểm thử hộp trắng\n')
        hop_trang_text = extract_elements_md(fn['hop_trang'][0], fn['hop_trang'][1])
        md_parts.append(hop_trang_text)
        md_parts.append('\n')
        
        # 4. Kiểm thử đơn vị
        md_parts.append('### 4. Kiểm thử đơn vị\n')
        if 'unit_test' in fn:
            md_parts.append(fn['unit_test'])
        else:
            if 'unit_test_md' in fn:
                md_parts.append(fn['unit_test_md'])
                md_parts.append('\n')
            if 'unit_test_docx_range_fn' in fn:
                md_parts.append('#### Mã nguồn hàm kiểm tra hợp lệ (Validator Implementation):')
                fn_code = extract_elements_md(fn['unit_test_docx_range_fn'][0], fn['unit_test_docx_range_fn'][1])
                md_parts.append(fn_code)
                md_parts.append('\n')
            if 'unit_test_docx_range_test' in fn:
                md_parts.append('#### Mã nguồn ca kiểm thử đơn vị tự động (Test Implementation):')
                test_code = extract_elements_md(fn['unit_test_docx_range_test'][0], fn['unit_test_docx_range_test'][1])
                md_parts.append(test_code)
        md_parts.append('\n---\n')

full_md_content = '\n'.join(md_parts)

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(full_md_content)

print(f'Successfully re-generated full report to {output_path}!')
print(f'Total characters: {len(full_md_content)}, Total lines: {len(full_md_content.splitlines())}')
