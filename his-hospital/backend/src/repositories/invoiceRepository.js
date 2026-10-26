import { globalData } from "../data/seedData.js";

class InvoiceRepository {
  findAll() {
    return [...globalData.invoices];
  }

  findByIdOrCode(idOrCode) {
    return globalData.invoices.find(
      (inv) => String(inv.id) === String(idOrCode) || inv.invoice_code === idOrCode
    );
  }

  findByPatientCode(patientCode) {
    return globalData.invoices.filter((inv) => inv.patient_code === patientCode);
  }

  create(invoiceEntity) {
    globalData.invoices.unshift(invoiceEntity);
    return invoiceEntity;
  }

  update(idOrCode, updateFields) {
    const index = globalData.invoices.findIndex(
      (inv) => String(inv.id) === String(idOrCode) || inv.invoice_code === idOrCode
    );
    if (index === -1) return null;

    globalData.invoices[index] = {
      ...globalData.invoices[index],
      ...updateFields
    };
    return globalData.invoices[index];
  }

  getNextId() {
    return globalData.invoices.length + 1;
  }
}

export const invoiceRepository = new InvoiceRepository();
