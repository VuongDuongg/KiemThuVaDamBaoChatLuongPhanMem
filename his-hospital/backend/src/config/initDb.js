import pool from "./db.js";

const createTablesSQL = `
-- 1. Bảng Roles & Departments & Users
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL,
    dept_type VARCHAR(20) NOT NULL,
    max_patients_per_day INT DEFAULT 100
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role_id INT REFERENCES roles(id),
    department_id INT REFERENCES departments(id),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Patients & Encounters
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    patient_code VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    identity_card VARCHAR(20) UNIQUE,
    phone VARCHAR(15),
    dob DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    address TEXT,
    insurance_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS encounters (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id),
    department_id INT REFERENCES departments(id),
    doctor_id INT REFERENCES users(id),
    queue_number INT NOT NULL,
    priority BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) NOT NULL DEFAULT 'WAITING_PAYMENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng Medicines & Invoices
CREATE TABLE IF NOT EXISTS medicines (
    id SERIAL PRIMARY KEY,
    medicine_code VARCHAR(50) UNIQUE NOT NULL,
    medicine_name VARCHAR(150) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    expiry_date DATE
);

CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    invoice_code VARCHAR(30) UNIQUE NOT NULL,
    patient_id INT REFERENCES patients(id),
    cashier_id INT REFERENCES users(id),
    total_amount DECIMAL(12, 2) NOT NULL,
    insurance_discount DECIMAL(12, 2) DEFAULT 0,
    patient_pay DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(20),
    status VARCHAR(20) DEFAULT 'UNPAID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(id) ON DELETE CASCADE,
    item_type VARCHAR(30) NOT NULL,
    reference_id INT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL
);

-- 4. Bảng Medical Records & Prescriptions
CREATE TABLE IF NOT EXISTS medical_records (
    id SERIAL PRIMARY KEY,
    encounter_id INT UNIQUE REFERENCES encounters(id),
    doctor_id INT REFERENCES users(id),
    symptoms TEXT,
    icd10_code VARCHAR(20) NOT NULL,
    icd10_name VARCHAR(255) NOT NULL,
    doctor_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prescriptions (
    id SERIAL PRIMARY KEY,
    medical_record_id INT REFERENCES medical_records(id),
    doctor_id INT REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'UNPAID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prescription_items (
    id SERIAL PRIMARY KEY,
    prescription_id INT REFERENCES prescriptions(id) ON DELETE CASCADE,
    medicine_id INT REFERENCES medicines(id),
    quantity INT NOT NULL,
    dosage VARCHAR(255) NOT NULL
);

-- 5. Bảng Lab Orders & Results
CREATE TABLE IF NOT EXISTS lab_orders (
    id SERIAL PRIMARY KEY,
    medical_record_id INT REFERENCES medical_records(id),
    doctor_id INT REFERENCES users(id),
    lab_type VARCHAR(30) NOT NULL,
    status VARCHAR(20) DEFAULT 'UNPAID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lab_results (
    id SERIAL PRIMARY KEY,
    lab_order_id INT REFERENCES lab_orders(id),
    technician_id INT REFERENCES users(id),
    result_data JSONB,
    image_url VARCHAR(500),
    conclusion TEXT,
    approved_at TIMESTAMP
);

-- Index tra cứu
CREATE INDEX IF NOT EXISTS idx_patients_identity ON patients(identity_card);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_encounters_status ON encounters(status, department_id);
`;

export const initDatabase = async () => {
  try {
    await pool.query(createTablesSQL);
    console.log("✅ Khoi tao tat ca cac bang Database HIS thanh cong!");
  } catch (error) {
    console.error("❌ Loi khi khoi tao Database:", error.message);
  }
};
