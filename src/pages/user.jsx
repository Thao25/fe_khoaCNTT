import {
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Input,
  Form,
  Select,
  Spin,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
} from "../util/api";
import dayjs from "dayjs";
import {
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PauseOutlined,
} from "@ant-design/icons";
const UserPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRole, setSelectedRole] = useState("admin");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const res = await getAllUser();
      if (res) {
        const filteredUsers = res.data.filter(
          (user) => user.role === selectedRole
        );
        setDataSource(filteredUsers);
        setFilteredData(res.data);
      }
      setLoading(false);
    };
    if (selectedRole !== null) {
      fetchUsers();
    }
  }, [selectedRole]);

  useEffect(() => {
    if (selectedRole !== null) {
      setLoading(true);
      const filteredByRole = dataSource.filter(
        (user) => user.role === selectedRole
      );
      setFilteredData(filteredByRole);
      setLoading(false);
    }
  }, [selectedRole, dataSource]);

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      // Khi không có từ khóa tìm kiếm, hiển thị lại toàn bộ dữ liệu
      setFilteredData(dataSource);
    } else {
      // Nếu có từ khóa tìm kiếm, lọc dữ liệu theo từ khóa
      const filteredUsers = dataSource.filter((user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filteredUsers);
    }
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
    },
    ...(selectedRole === "student"
      ? [
          {
            title: "MSV",
            dataIndex: "MSV",
            key: "MSV",
            render: (text) => (text ? text : "-"),
          },
        ]
      : []),
    {
      title: "Giới tính",
      dataIndex: "gender",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
    },
    ...(selectedRole === "student"
      ? [
          {
            title: "Class",
            dataIndex: "studentClass",
          },
        ]
      : []),
    ...(selectedRole === "lecturer"
      ? [
          {
            title: "Description",
            dataIndex: "description",
          },
        ]
      : []),
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record)}
            style={{ display: "flex", alignItems: "center" }}
          ></Button>
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
          {selectedRole === "student" && (
            <>
              <Button
                icon={
                  record.isActive ? <PauseOutlined /> : <PlayCircleOutlined />
                }
                type="link"
                onClick={() => handleChangeStatus(record._id, !record.isActive)}
                style={{ display: "flex", alignItems: "center" }}
              >
                {record.isActive ? "Khóa" : "Kích hoạt"}
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    // Kiểm tra tính hợp lệ của dateOfBirth trước khi gọi dayjs
    const formattedDateOfBirth = user.dateOfBirth
      ? dayjs(user.dateOfBirth)
      : null;

    if (formattedDateOfBirth && formattedDateOfBirth.isValid()) {
      form.setFieldsValue({
        ...user,
        dateOfBirth: formattedDateOfBirth.format("DD/MM/YYYY"),
      });
    } else {
      form.setFieldsValue({ ...user, dateOfBirth: null });
    }

    setIsModalVisible(true);
  };

  const handleDelete = async (_id) => {
    const result = await deleteUser(_id);
    if (result !== "ok") {
      message.error("Xóa người dùng thất bại");
    } else {
      const newData = dataSource.filter((user) => user._id !== _id);
      setDataSource(newData);
      setFilteredData(newData);
      message.success("Xóa người dùng thành công");
    }
  };

  const handleCreateUser = async (values) => {
    console.log("Dữ liệu gửi lên:", values);
    const dateOfBirth = dayjs(values.dateOfBirth, "DD/MM/YYYY", true);
    if (!dateOfBirth.isValid()) {
      message.error("Ngày sinh không hợp lệ");
      return;
    }

    try {
      const newUser = await createUser(
        values.email,
        values.password,
        values.role,
        values.fullName,
        values.gender,
        values.address,
        values.phoneNumber,
        dateOfBirth.format("YYYY-MM-DD"),
        values.studentClass,
        values.description,
        values.MSV
      );
      setDataSource([...dataSource, newUser]);
      setFilteredData([...filteredData, newUser]);
      message.success("Tạo người dùng mới thành công");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(`Tạo người dùng thất bại: ${error.message || error}`);
    }
  };

  const handleUpdateUser = async (values) => {
    const dateOfBirth = dayjs(values.dateOfBirth, "DD/MM/YYYY", true);
    if (!dateOfBirth.isValid()) {
      message.error("Ngày sinh không hợp lệ");
      return;
    }

    const updatedUserData = {
      ...values,
      dateOfBirth: dateOfBirth.format("YYYY-MM-DD"),
    };

    try {
      const response = await updateUser(editingUser._id, updatedUserData);

      if (response) {
        const updatedData = dataSource.map((user) =>
          user._id === editingUser._id ? { ...user, ...updatedUserData } : user
        );
        setDataSource(updatedData);
        setFilteredData(updatedData);
        setIsModalVisible(false);
        message.success("Cập nhật người dùng thành công");
        setEditingUser(null);
        form.resetFields();
      } else {
        message.error("Cập nhật người dùng thất bại");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật người dùng");
      console.error(error);
    }
  };

  const showCreateUserModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const validateMSV = async (rule, value) => {
    // Kiểm tra định dạng của MSV (bắt đầu bằng 'CT' theo sau 6 chữ số)
    const regex = /^CT\d{6}$/;
    if (!regex.test(value)) {
      return Promise.reject("MSV phải bắt đầu bằng 'CT' theo sau là 6 chữ số");
    }

    // Nếu giá trị MSV thay đổi thì kiểm tra sự tồn tại trong dataSource
    if (!editingUser || (editingUser && editingUser.MSV !== value)) {
      const isExist = dataSource.some((user) => user.MSV === value);
      if (isExist) {
        return Promise.reject("Mã sinh viên này đã tồn tại!");
      }
    }

    // Nếu không có lỗi, trả về resolve
    return Promise.resolve();
  };
  const handleChangeStatus = async (_id, newStatus) => {
    try {
      const response = await updateUserStatus(_id, { isActive: newStatus });

      // Cập nhật trạng thái trong bảng
      if (response.message === "ok") {
        const updatedData = dataSource.map((user) =>
          user._id === _id ? { ...user, isActive: newStatus } : user
        );
        setDataSource(updatedData);
        setFilteredData(updatedData);
        message.success(`Cập nhật trạng thái thành công`);
      } else {
        message.error("Cập nhật trạng thái thất bại");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi thay đổi trạng thái");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Button
          type={selectedRole === "student" ? "primary" : "default"}
          onClick={() => handleRoleChange("student")}
          style={{ marginRight: "10px" }}
        >
          Sinh viên
        </Button>
        <Button
          type={selectedRole === "lecturer" ? "primary" : "default"}
          onClick={() => handleRoleChange("lecturer")}
          style={{ marginRight: "10px" }}
        >
          Giảng viên
        </Button>
        <Button
          type={selectedRole === "admin" ? "primary" : "default"}
          onClick={() => handleRoleChange("admin")}
        >
          Admin
        </Button>

        <Input
          placeholder="Tìm kiếm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch();
          }}
          style={{ width: 200, marginBottom: "20px", marginLeft: "250px" }}
        />
        <Button onClick={handleSearch} style={{ marginLeft: "10px" }}>
          Tìm kiếm
        </Button>
        <Button
          type="primary"
          onClick={showCreateUserModal}
          style={{ marginBottom: "20px", marginLeft: "10px" }}
        >
          Tạo
        </Button>
      </div>

      <Spin spinning={loading} tip="Đang tải dữ liệu..." size="large">
        <Table
          bordered
          dataSource={filteredData}
          columns={columns}
          pagination={true}
          rowKey="_id"
          style={{ width: "100%" }}
        />
      </Spin>
      <Modal
        title={editingUser ? "Cập nhật người dùng" : "Thêm người dùng mới"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingUser ? handleUpdateUser : handleCreateUser}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item
            label="Họ và Tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Giới tính" name="gender">
            <Select>
              <Select.Option value="Nam">Nam</Select.Option>
              <Select.Option value="Nữ">Nữ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phoneNumber">
            <Input />
          </Form.Item>
          <Form.Item label="Ngày sinh" name="dateOfBirth">
            <Input
              placeholder="DD/MM/YYYY"
              value={editingUser ? editingUser.dateOfBirth : ""}
              onChange={(e) => {
                form.setFieldsValue({ dateOfBirth: e.target.value });
              }}
            />
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select
              value={selectedRole}
              onChange={(value) => {
                form.setFieldsValue({ role: value });
                handleRoleChange(value);
              }}
            >
              <Select.Option value="student">Sinh viên</Select.Option>
              <Select.Option value="lecturer">Giảng viên</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </Form.Item>

          {selectedRole === "student" && (
            <Form.Item
              label="Lớp học"
              name="studentClass"
              rules={[{ required: true, message: "Vui lòng nhập lớp học!" }]}
            >
              <Input />
            </Form.Item>
          )}

          {selectedRole === "student" && (
            <Form.Item
              label="MSV"
              name="MSV"
              rules={[
                {
                  required: selectedRole === "student",
                  message: "Vui lòng nhập mã sinh viên!",
                },
                { validator: validateMSV },
              ]}
            >
              <Input />
            </Form.Item>
          )}
          {selectedRole === "lecturer" && (
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {editingUser ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPage;
