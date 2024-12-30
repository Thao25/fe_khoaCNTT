import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Input, Form, message, Table, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import MyEditor from "../pages/editor";
import { Link } from "react-router-dom";
const NotificationAdmin = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editNotification, setEditNotification] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:1337/notifications") // Thay đổi URL nếu cần
      .then((response) => {
        const sortedNotifications = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sortedNotifications);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông báo:", error);
        setLoading(false);
      });
  }, []);

  // Mở modal thêm thông báo mới
  const showAddModal = () => {
    setIsModalVisible(true);
    setEditNotification(null);
    form.resetFields();
  };

  // Mở modal sửa thông báo
  const showEditModal = (notification) => {
    setIsModalVisible(true);
    setEditNotification(notification);
    form.setFieldsValue({
      title: notification.Title,
      content: notification.Content,
    });
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditNotification(null);
  };

  // Xử lý thêm hoặc sửa thông báo
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const { title, content } = values;
      const newNotification = { Title: title, Content: content };

      if (editNotification) {
        // Cập nhật thông báo đã tồn tại
        axios
          .put(
            `http://localhost:1337/notifications/${editNotification._id}`,
            newNotification
          )
          .then(() => {
            message.success("Cập nhật thông báo thành công");
            setIsModalVisible(false);
            setNotifications((prevNotifications) =>
              prevNotifications.map((notif) =>
                notif._id === editNotification._id
                  ? { ...notif, ...newNotification }
                  : notif
              )
            );
          })
          .catch((error) =>
            message.error("Có lỗi xảy ra khi cập nhật thông báo")
          );
      } else {
        // Thêm mới thông báo
        axios
          .post("http://localhost:1337/notifications", newNotification)

          .then((response) => {
            message.success("Thêm thông báo thành công");
            setIsModalVisible(false);
            setNotifications((prevNotifications) => [
              response.data,
              ...prevNotifications,
            ]);
          })
          .catch((error) => message.error("Có lỗi xảy ra khi thêm thông báo"));
      }
    } catch (error) {
      console.error("Lỗi khi lưu thông báo:", error);
    }
  };

  // Xử lý xóa thông báo
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:1337/notifications/${id}`)
      .then(() => {
        message.success("Xóa thông báo thành công");
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification._id !== id)
        );
      })
      .catch((error) => message.error("Có lỗi xảy ra khi xóa thông báo"));
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Lọc thông báo theo tiêu đề và nội dung
  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.Content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cấu hình table
  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "Title",
      key: "title",
      render: (text, record) => (
        <Link to={`/notification/${record._id}`}>
          {text.substring(0, 50)}...
        </Link>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "Content",
      key: "content",
      render: (text) => {
        // Cắt chuỗi nội dung và đảm bảo cắt không phá vỡ HTML
        const truncatedText =
          text.length > 100 ? text.substring(0, 100) + "..." : text;

        return (
          <div
            dangerouslySetInnerHTML={{
              __html: truncatedText,
            }}
          />
        );
      },
    },
    {
      title: "Ngày đăng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div>
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="notification-admin-container">
      <Button
        type="primary"
        onClick={showAddModal}
        style={{ marginBottom: 20 }}
      >
        Thêm thông báo mới
      </Button>

      <Input
        placeholder="Tìm kiếm thông báo"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: 20, width: 300 }}
      />

      <Table
        columns={columns}
        dataSource={filteredNotifications}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editNotification ? "Sửa thông báo" : "Thêm thông báo mới"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1030}
      >
        <Form form={form} onFinish={handleSave}>
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề thông báo!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Nội dung"
            name="content"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung thông báo!" },
            ]}
          >
            <MyEditor
              value={form.getFieldValue("Content")}
              onChange={(value) => form.setFieldsValue({ Content: value })}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default NotificationAdmin;
