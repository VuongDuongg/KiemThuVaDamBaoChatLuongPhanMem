import pool from "./db.js";
import bcrypt from "bcryptjs";
import { fakerVI as faker } from "@faker-js/faker";

export const seedDatabase = async () => {
  const client = await pool.connect();

  try {
    // 1. Kiểm tra xem đã có dữ liệu chưa (tránh seed trùng lặp)
    const checkPatients = await client.query("SELECT COUNT(*) FROM patients");
    if (parseInt(checkPatients.rows[0].count) > 0) {
      console.log("✅ Database đã có sẵn dữ liệu liên kết, bỏ qua bước Seed!");
      return;
    }

    console.log("🌱 Đang khởi tạo dữ liệu chuẩn liên kết nghiệp vụ HIS...");
    await client.query("BEGIN");

    // 2. Seed Roles
    await client.query(`
      INSERT INTO roles (role_name, description) VALUES
      ('ADMIN', 'Quản trị hệ thống'), 
      ('RECEPTIONIST', 'Nhân viên tiếp đón'), 
      ('CASHIER', 'Nhân viên thu ngân'), 
      ('DOCTOR', 'Bác sĩ khám bệnh'), 
      ('LAB_TECH', 'Kỹ thuật viên xét nghiệm')
      ON CONFLICT (role_name) DO NOTHING;
    `);

    // 3. Seed Departments (Khoa / Phòng)
    const deptsRes = await client.query(`
      INSERT INTO departments (dept_name, dept_type, max_patients_per_day) VALUES
      ('Khoa Nội Tổng Hợp', 'CLINIC', 100),
      ('Khoa Ngoại Nhi', 'CLINIC', 80),
      ('Phòng Xét Nghiệm Huyết Học', 'LAB', 200),
      ('Phòng X-Quang / Siêu Âm', 'LAB', 150),
      ('Nhà Thuốc Bệnh Viện', 'PHARMACY', 300)
      RETURNING id, dept_name;
    `);

    const clinicDept = deptsRes.rows.find((d) =>
      d.dept_name.includes("Nội"),
    ).id;
    const labDept = deptsRes.rows.find((d) =>
      d.dept_name.includes("Xét Nghiệm"),
    ).id;

    // 4. Seed Users (Nhân viên gắn với Khoa/Phòng cụ thể)
    const passHash = await bcrypt.hash("123456", 10);
    const usersRes = await client.query(
      `
      INSERT INTO users (username, password_hash, full_name, role_id, department_id) VALUES
      ('admin', $1, 'System Admin', (SELECT id FROM roles WHERE role_name = 'ADMIN'), NULL),
      ('letan1', $1, 'Nguyễn Thị Lễ Tân', (SELECT id FROM roles WHERE role_name = 'RECEPTIONIST'), NULL),
      ('thungan1', $1, 'Trần Văn Thu Ngân', (SELECT id FROM roles WHERE role_name = 'CASHIER'), NULL),
      ('doctor1', $1, 'BS. Lê Hoàng Nam', (SELECT id FROM roles WHERE role_name = 'DOCTOR'), $2),
      ('ktv1', $1, 'KTV. Đặng Quốc Việt', (SELECT id FROM roles WHERE role_name = 'LAB_TECH'), $3)
      RETURNING id, username;
    `,
      [passHash, clinicDept, labDept],
    );

    const doctorId = usersRes.rows.find((u) => u.username === "doctor1").id;
    const cashierId = usersRes.rows.find((u) => u.username === "thungan1").id;
    const labTechId = usersRes.rows.find((u) => u.username === "ktv1").id;

    // 5. Seed Medicines (Danh mục thuốc chuẩn kho dược)
    const medList = [
      ["MED001", "Paracetamol 500mg", "Viên", 1500, 1000],
      ["MED002", "Amoxicillin 500mg", "Viên", 3500, 500],
      ["MED003", "Ibuprofen 400mg", "Viên", 2500, 800],
      ["MED004", "Vitamin C 1000mg", "Vién sủi", 4000, 600],
      ["MED005", "Siro Ho Astex", "Chai", 45000, 200],
      ["MED006", "Omez 20mg", "Viên", 5000, 400],
    ];

    const insertedMedicines = [];
    for (const m of medList) {
      const res = await client.query(
        `
        INSERT INTO medicines (medicine_code, medicine_name, unit, unit_price, stock_quantity, expiry_date)
        VALUES ($1, $2, $3, $4, $5, '2027-12-31') RETURNING id, unit_price;
      `,
        m,
      );
      insertedMedicines.push(res.rows[0]);
    }

    // 6. CHUỖI DỮ LIỆU LIÊN KẾT NHIỀU BẢNG CHO TỪNG BỆNH NHÂN (30 Bệnh nhân)
    for (let i = 1; i <= 30; i++) {
      // 6.1 Tạo Bệnh nhân (Patients)
      const pRes = await client.query(
        `
        INSERT INTO patients (patient_code, full_name, identity_card, phone, dob, gender, address)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
      `,
        [
          `BN2026${String(i).padStart(4, "0")}`,
          faker.person.fullName(),
          `001205${faker.string.numeric(6)}`,
          `09${faker.string.numeric(8)}`,
          faker.date.birthdate({ min: 10, max: 75, mode: "age" }),
          faker.helpers.arrayElement(["MALE", "FEMALE"]),
          `${faker.location.streetAddress()}, Hà Nội`,
        ],
      );
      const patientId = pRes.rows[0].id;

      // 6.2 Tạo Lượt khám (Encounters) - Liên kết Patient -> Department -> Doctor
      const eRes = await client.query(
        `
        INSERT INTO encounters (patient_id, department_id, doctor_id, queue_number, status)
        VALUES ($1, $2, $3, $4, 'COMPLETED') RETURNING id;
      `,
        [patientId, clinicDept, doctorId, i],
      );
      const encounterId = eRes.rows[0].id;

      // 6.3 Tạo Hóa đơn tiền khám (Invoices & Invoice Items) - Liên kết Cashier & Encounter
      const invRes = await client.query(
        `
        INSERT INTO invoices (invoice_code, patient_id, cashier_id, total_amount, patient_pay, payment_method, status)
        VALUES ($1, $2, $3, 150000, 150000, 'VIETQR', 'PAID') RETURNING id;
      `,
        [`HD2026-${String(i).padStart(4, "0")}`, patientId, cashierId],
      );

      await client.query(
        `
        INSERT INTO invoice_items (invoice_id, item_type, reference_id, amount)
        VALUES ($1, 'EXAM_FEE', $2, 150000);
      `,
        [invRes.rows[0].id, encounterId],
      );

      // 6.4 Tạo Bệnh án điện tử (Medical Records) - Liên kết trực tiếp Encounter & Doctor
      const mrRes = await client.query(
        `
        INSERT INTO medical_records (encounter_id, doctor_id, symptoms, icd10_code, icd10_name, doctor_notes)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
      `,
        [
          encounterId,
          doctorId,
          "Đau đầu, ho khan, sốt nhẹ về chiều",
          "J02.9",
          "Viêm họng cấp, không đặc hiệu",
          "Nghỉ ngơi, uống nhiều nước ấm, tái khám nếu sốt cao",
        ],
      );
      const medicalRecordId = mrRes.rows[0].id;

      // 6.5 Tạo Đơn thuốc (Prescriptions & Prescription Items) - Liên kết Medical Record & Medicines
      const presRes = await client.query(
        `
        INSERT INTO prescriptions (medical_record_id, doctor_id, status)
        VALUES ($1, $2, 'PAID') RETURNING id;
      `,
        [medicalRecordId, doctorId],
      );
      const prescriptionId = presRes.rows[0].id;

      // Lấy ngẫu nhiên 2 loại thuốc trong kho để kê vào đơn thuốc
      const randomMeds = faker.helpers.arrayElements(insertedMedicines, 2);
      let totalPrescriptionCost = 0;

      for (const med of randomMeds) {
        const qty = faker.number.int({ min: 10, max: 20 });
        totalPrescriptionCost += qty * med.unit_price;
        await client.query(
          `
          INSERT INTO prescription_items (prescription_id, medicine_id, quantity, dosage)
          VALUES ($1, $2, $3, 'Ngày uống 2 lần, mỗi lần 1 viên sau ăn');
        `,
          [prescriptionId, med.id, qty],
        );
      }

      // Tạo hóa đơn tiền thuốc tương ứng cho đơn thuốc này
      const medInvRes = await client.query(
        `
        INSERT INTO invoices (invoice_code, patient_id, cashier_id, total_amount, patient_pay, payment_method, status)
        VALUES ($1, $2, $3, $4, $4, 'CASH', 'PAID') RETURNING id;
      `,
        [
          `HDT2026-${String(i).padStart(4, "0")}`,
          patientId,
          cashierId,
          totalPrescriptionCost,
        ],
      );

      await client.query(
        `
        INSERT INTO invoice_items (invoice_id, item_type, reference_id, amount)
        VALUES ($1, 'MEDICINE', $2, $3);
      `,
        [medInvRes.rows[0].id, prescriptionId, totalPrescriptionCost],
      );

      // 6.6 Tạo Chỉ định Cận lâm sàng (Lab Orders & Results) - Liên kết Medical Record & Lab Tech
      const labOrderRes = await client.query(
        `
        INSERT INTO lab_orders (medical_record_id, doctor_id, lab_type, status)
        VALUES ($1, $2, 'BLOOD_TEST', 'COMPLETED') RETURNING id;
      `,
        [medicalRecordId, doctorId],
      );

      await client.query(
        `
        INSERT INTO lab_results (lab_order_id, technician_id, result_data, conclusion, approved_at)
        VALUES ($1, $2, $3, $4, NOW());
      `,
        [
          labOrderRes.rows[0].id,
          labTechId,
          JSON.stringify({
            WBC: "7.2 G/L",
            RBC: "4.5 T/L",
            HGB: "135 g/L",
            PLT: "250 G/L",
          }),
          "Các chỉ số huyết học trong giới hạn bình thường.",
        ],
      );
    }

    await client.query("COMMIT");
    console.log(
      "✅ Đã làm mới và liên kết toàn bộ dữ liệu 13 bảng thành công!",
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Lỗi liên kết dữ liệu Seed:", error);
  }
};
