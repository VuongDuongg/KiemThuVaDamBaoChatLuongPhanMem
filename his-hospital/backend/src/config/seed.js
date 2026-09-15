import pool from "./db.js";
import bcrypt from "bcryptjs";
import { fakerVI as faker } from "@faker-js/faker"; // Dùng chuẩn tiếng Việt mới nhất

export const seedDatabase = async () => {
  const client = await pool.connect();

  try {
    // CHỐT CHẶN: Kiểm tra xem database đã có dữ liệu chưa. Nếu có rồi thì bỏ qua để không bị duplicate.
    const checkPatients = await client.query("SELECT COUNT(*) FROM patients");
    if (parseInt(checkPatients.rows[0].count) > 0) {
      console.log("✅ Database da co san du lieu, bo qua buoc Seed!");
      return;
    }

    console.log("🌱 Dang tu dong sinh du lieu cho 13 bang... Vui long doi...");
    await client.query("BEGIN");

    // 1. SINH ROLES & DEPARTMENTS
    await client.query(`
      INSERT INTO roles (role_name, description) VALUES
      ('ADMIN', 'Quan tri vien'), ('RECEPTIONIST', 'Le tan'), 
      ('CASHIER', 'Thu ngan'), ('DOCTOR', 'Bac si'), ('LAB_TECH', 'KTV Can lam sang')
      ON CONFLICT DO NOTHING;
    `);

    const deptsRes = await client.query(`
      INSERT INTO departments (dept_name, dept_type, max_patients_per_day) VALUES
      ('Khoa Noi', 'CLINIC', 100), ('Khoa Ngoai', 'CLINIC', 100), ('Khoa Nhi', 'CLINIC', 80),
      ('Phong Xet Nghiem', 'LAB', 200), ('Phong X-Quang', 'LAB', 150), ('Nha Thuoc', 'PHARMACY', 300)
      RETURNING id, dept_name;
    `);
    const clinicDeptId = deptsRes.rows.find(
      (d) => d.dept_name === "Khoa Noi",
    ).id;
    const labDeptId = deptsRes.rows.find(
      (d) => d.dept_name === "Phong Xet Nghiem",
    ).id;

    // 2. SINH USERS (NHÂN VIÊN)
    const passHash = await bcrypt.hash("123456", 10);
    const usersRes = await client.query(
      `
      INSERT INTO users (username, password_hash, full_name, role_id, department_id) VALUES
      ('admin', $1, 'System Admin', (SELECT id FROM roles WHERE role_name = 'ADMIN'), NULL),
      ('letan1', $1, 'Nguyen Thi Le Tan', (SELECT id FROM roles WHERE role_name = 'RECEPTIONIST'), NULL),
      ('thungan1', $1, 'Tran Van Thu Ngan', (SELECT id FROM roles WHERE role_name = 'CASHIER'), NULL),
      ('bacsi1', $1, 'BS. Le Hoang Nam', (SELECT id FROM roles WHERE role_name = 'DOCTOR'), $2),
      ('ktv1', $1, 'KTV. Dang Quoc Viet', (SELECT id FROM roles WHERE role_name = 'LAB_TECH'), $3)
      RETURNING id, username;
    `,
      [passHash, clinicDeptId, labDeptId],
    );

    const doctorId = usersRes.rows.find((u) => u.username === "bacsi1").id;
    const cashierId = usersRes.rows.find((u) => u.username === "thungan1").id;
    const labTechId = usersRes.rows.find((u) => u.username === "ktv1").id;

    // 3. SINH MEDICINES (50 LOẠI THUỐC)
    const insertedMedicines = [];
    for (let i = 1; i <= 50; i++) {
      const res = await client.query(
        `
        INSERT INTO medicines (medicine_code, medicine_name, unit, unit_price, stock_quantity, expiry_date)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
      `,
        [
          `MED${String(i).padStart(3, "0")}`,
          `Thuoc ${faker.science.chemicalElement().name} ${faker.number.int({ min: 100, max: 500 })}mg`,
          faker.helpers.arrayElement(["Vien", "Chai", "Vi", "Goi"]),
          faker.number.int({ min: 10, max: 200 }) * 1000,
          faker.number.int({ min: 100, max: 1000 }),
          faker.date.future(),
        ],
      );
      insertedMedicines.push(res.rows[0].id);
    }

    // 4. LẶP SINH HÀNG LOẠT BỆNH NHÂN & QUÁ TRÌNH KHÁM BỆNH CHUỖI
    // Chỉnh số vòng lặp ở đây (vd: 30 bệnh nhân)
    for (let i = 1; i <= 30; i++) {
      // 4.1 Tạo Patients
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
          faker.date.birthdate({ min: 5, max: 80, mode: "age" }),
          faker.helpers.arrayElement(["MALE", "FEMALE"]),
          `${faker.location.streetAddress()}, Ha Noi`,
        ],
      );
      const patientId = pRes.rows[0].id;

      // 4.2 Tạo Encounters (Lượt khám)
      const status = faker.helpers.arrayElement([
        "WAITING",
        "EXAMINING",
        "COMPLETED",
      ]);
      const eRes = await client.query(
        `
        INSERT INTO encounters (patient_id, department_id, doctor_id, queue_number, status)
        VALUES ($1, $2, $3, $4, $5) RETURNING id;
      `,
        [patientId, clinicDeptId, doctorId, i, status],
      );
      const encounterId = eRes.rows[0].id;

      // 4.3 Tạo Invoices (Hóa đơn tiền khám)
      const invRes = await client.query(
        `
        INSERT INTO invoices (invoice_code, patient_id, cashier_id, total_amount, patient_pay, payment_method, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
      `,
        [
          `HD2026-${faker.string.alphanumeric(6).toUpperCase()}`,
          patientId,
          cashierId,
          150000,
          150000,
          "CASH",
          "PAID",
        ],
      );

      await client.query(
        `
        INSERT INTO invoice_items (invoice_id, item_type, reference_id, amount)
        VALUES ($1, 'EXAM_FEE', $2, 150000);
      `,
        [invRes.rows[0].id, encounterId],
      );

      // 4.4 Nếu đã khám xong (COMPLETED) -> Tạo Medical Records, Lab, Prescriptions
      if (status === "COMPLETED") {
        const mrRes = await client.query(
          `
          INSERT INTO medical_records (encounter_id, doctor_id, symptoms, icd10_code, icd10_name, doctor_notes)
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
        `,
          [
            encounterId,
            doctorId,
            "Ho, sot, dau dau nhe",
            "J0" + faker.number.int({ min: 0, max: 6 }),
            "Viem duong ho hap tren cap tinh",
            "Uong nhieu nuoc, kieng nuoc da",
          ],
        );
        const medicalRecordId = mrRes.rows[0].id;

        // Kê đơn thuốc (Prescriptions)
        const presRes = await client.query(
          `
          INSERT INTO prescriptions (medical_record_id, doctor_id, status)
          VALUES ($1, $2, 'UNPAID') RETURNING id;
        `,
          [medicalRecordId, doctorId],
        );

        // Random 2 loại thuốc cho toa này
        for (let j = 0; j < 2; j++) {
          await client.query(
            `
            INSERT INTO prescription_items (prescription_id, medicine_id, quantity, dosage)
            VALUES ($1, $2, $3, $4);
            `,
            [
              presRes.rows[0].id,
              faker.helpers.arrayElement(insertedMedicines),
              faker.number.int({ min: 10, max: 30 }),
              "Ngay uong 2 lan, moi lan 1 vien",
            ],
          );
        }

        // Chỉ định Lab (Lab Orders & Results)
        const labRes = await client.query(
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
            labRes.rows[0].id,
            labTechId,
            JSON.stringify({
              WBC: faker.number.float({
                min: 4.0,
                max: 10.0,
                fractionDigits: 1,
              }),
              RBC: faker.number.float({
                min: 3.5,
                max: 5.5,
                fractionDigits: 1,
              }),
            }),
            "Cac chi so xet nghiem mau binh thuong.",
          ],
        );
      }
    }

    await client.query("COMMIT");
    console.log(
      "✅ Hoan tat Seed 100% (Phan quyen, NV, Thuoc, Benh nhan, Phieu kham, Benh an, Toa thuoc, KQ Xet nghiem, Hoa don)!",
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Loi trong qua trinh Seed:", error);
  } finally {
    client.release();
  }
};
