import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Button, Form, Space, Typography, message, Spin } from "antd";
import { UseApp } from "../components/context/AppProvider";
const { Text } = Typography;
// import { useFooter } from "../components/context/FooterContext";

const AdminFooter = () => {
  const [footerData, setFooterData] = useState(null);
  const { reloadFooter, setReloadFooter } = UseApp();
  const [loading, setLoading] = useState(false);
  // const { footerData, loading, updateFooterData } = useFooter();
  useEffect(() => {
    // Lấy thông tin footer hiện tại
    const fetchFooterData = async () => {
      try {
        const response = await axios.get("http://localhost:1337/footers");
        setFooterData(response.data[0]);
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };

    fetchFooterData();
  }, []);

  // Hàm cập nhật dữ liệu footer
  const handleSave = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:1337/footers/676ca032269f0942403fca39",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ); // Cập nhật footer với ID 1
      message.success("Cập nhật thành công!");
      setReloadFooter(true);
    } catch (error) {
      console.error("Error saving footer data:", error);
      message.error("Có lỗi xảy ra. Thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // const handleSave = async (values) => {
  //   await updateFooterData(values); // Cập nhật dữ liệu footer qua context
  //   message.success("Cập nhật thành công!");
  // };

  if (!footerData) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", background: "#f4f4f4" }}>
      <Text strong style={{ fontSize: "24px", color: "#3b8d99" }}>
        Chỉnh sửa Footer
      </Text>
      <Form
        initialValues={footerData}
        onFinish={handleSave}
        style={{ maxWidth: 600, margin: "20px auto" }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giới thiệu"
          name="about_url"
          rules={[{ required: true, message: "Vui nhập link bài giới thiệu!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Tuyển sinh"
          name="tuyen_sinh"
          rules={[
            {
              required: true,
              message: "Vui nhập link bài liên kết bài tuyển sinh!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Tuyển dụng"
          name="tuyen_dung"
          rules={[
            {
              required: true,
              message: "Vui nhập link bài liên kết bài tuyển dụng!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Chương trình đào tạo"
          name="program_url"
          rules={[
            {
              required: true,
              message: "Vui nhập link bài viết về chương trình đào tạo!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Liên kết Facebook"
          name="facebook"
          rules={[{ required: true, message: "Vui lòng nhập link Facebook!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Website"
          name="website"
          rules={[{ required: true, message: "Vui nhập link website!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Youtube"
          name="youtube"
          rules={[{ required: true, message: "Vui nhập link youtube!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Link Video Giới thiệu"
          name="video_link"
          rules={[{ required: true, message: "Vui nhập link video!" }]}
        >
          <Input />
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default AdminFooter;
