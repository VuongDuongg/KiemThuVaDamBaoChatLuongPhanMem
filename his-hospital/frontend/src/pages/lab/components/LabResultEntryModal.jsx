import React, { useEffect } from "react";
import { Modal, Form, Row, Col, Input, InputNumber, Space, Typography, Descriptions, Tag, Button } from "antd";
import { ExperimentOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function LabResultEntryModal({
  open,
  order,
  onCancel,
  onSubmit,
  confirmLoading,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (order && open) {
      if (order.results?.parameters) {
        const wbc = order.results.parameters.find((p) => p.param.includes("WBC"))?.value || 7.2;
        const rbc = order.results.parameters.find((p) => p.param.includes("RBC"))?.value || 4.5;
        const hgb = order.results.parameters.find((p) => p.param.includes("HGB") || p.param.includes("Hb"))?.value || 135;
        const plt = order.results.parameters.find((p) => p.param.includes("PLT"))?.value || 250;

        form.setFieldsValue({
          wbc: Number(wbc),
          rbc: Number(rbc),
          hgb: Number(hgb),
          plt: Number(plt),
          conclusion: order.results.conclusion || "Các chỉ số huyết học trong giới hạn bình thường.",
        });
      } else {
        form.setFieldsValue({
          wbc: 7.2,
          rbc: 4.5,
          hgb: 135,
          plt: 250,
          conclusion: "Các chỉ số huyết học trong giới hạn bình thường.",
        });
      }
    }
  }, [order, open, form]);

  if (!order) return null;

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const resultsData = {
        parameters: [
          { param: "Bạch cầu (WBC)", value: values.wbc, unit: "G/L", normal_range: "4.0 - 10.0", alert: values.wbc > 10 ? "HIGH" : values.wbc < 4 ? "LOW" : "NORMAL" },
          { param: "Hồng cầu (RBC)", value: values.rbc, unit: "T/L", normal_range: "3.8 - 5.5", alert: values.rbc > 5.5 ? "HIGH" : values.rbc < 3.8 ? "LOW" : "NORMAL" },
          { param: "Huyết sắc tố (HGB)", value: values.hgb, unit: "g/L", normal_range: "120 - 160", alert: values.hgb > 160 ? "HIGH" : values.hgb < 120 ? "LOW" : "NORMAL" },
          { param: "Tiểu cầu (PLT)", value: values.plt, unit: "G/L", normal_range: "150 - 400", alert: values.plt > 400 ? "HIGH" : values.plt < 150 ? "LOW" : "NORMAL" },
        ],
        conclusion: values.conclusion,
      };

      onSubmit(order.id || order.order_code, resultsData);
    } catch {
      // Form validation error
    }
  };

  return (
    <Modal
      title={
        <Space>
          <ExperimentOutlined style={{ color: "#722ed1", fontSize: 20 }} />
          <span style={{ fontWeight: 700, fontSize: 17 }}>
            NHẬP KẾT QUẢ XÉT NGHIỆM - PHIẾU {order.order_code}
          </span>
        </Space>
      }
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Lưu & Phê duyệt kết quả"
      cancelText="Hủy bỏ"
      confirmLoading={confirmLoading}
      width={700}
      destroyOnClose
    >
      <Descriptions bordered size="small" column={2} style={{ marginTop: 12, marginBottom: 16 }}>
        <Descriptions.Item label="Mã BN">
          <Tag color="cyan">{order.patient_code}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Tên Bệnh Nhân">
          <Text strong>{order.patient_name}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Dịch vụ xét nghiệm" span={2}>
          <Text strong style={{ color: "#722ed1" }}>{order.service_name}</Text>
        </Descriptions.Item>
      </Descriptions>

      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="wbc" label="Bạch cầu (WBC) [Chuẩn: 4.0 - 10.0 G/L]" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} step={0.1} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="rbc" label="Hồng cầu (RBC) [Chuẩn: 3.8 - 5.5 T/L]" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} step={0.1} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="hgb" label="Huyết sắc tố (HGB) [Chuẩn: 120 - 160 g/L]" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} step={1} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="plt" label="Tiểu cầu (PLT) [Chuẩn: 150 - 400 G/L]" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} step={1} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="conclusion"
          label="Kết luận của Kỹ thuật viên / Bác sĩ xét nghiệm"
          rules={[{ required: true, message: "Vui lòng nhập kết luận" }]}
        >
          <Input.TextArea rows={3} placeholder="Đánh giá chỉ số huyết học..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
