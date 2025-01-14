import React, { useState, useContext, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "../../util/axios.customize";
import { AuthContext } from "../context/auth.context";
import { Select, DatePicker } from "antd";

const EditProfileModal = ({ visible, onCancel, user, onSave }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);

  useEffect(() => {
    if (auth.user && visible) {
      form.setFieldsValue(auth.user);

      if (auth.user.profileImage) {
        setFileList([
          {
            uid: "-1",
            name: "profile-image",
            status: "done",
            url: auth.user.profileImage,
          },
        ]);
      }
      if (auth.user.dateOfBirth) {
        const formattedDate = formatDateToDDMMYYYY(auth.user.dateOfBirth);
        form.setFieldsValue({ ...auth.user, dateOfBirth: formattedDate });
      }
    }
  }, [auth.user, visible, form]);
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSave = async () => {
    setLoading(true); // Bắt đầu quá trình tải lên

    // Kiểm tra nếu có ảnh được chọn
    const formData = new FormData();
    formData.append("fullName", form.getFieldValue("fullName"));
    formData.append("phoneNumber", form.getFieldValue("phoneNumber"));
    formData.append("address", form.getFieldValue("address"));
    const dateOfBirth = form.getFieldValue("dateOfBirth");
    if (dateOfBirth) {
      // Kiểm tra định dạng ngày tháng
      const isValidDate =
        /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(dateOfBirth);
      if (!isValidDate) {
        message.error("Vui lòng nhập ngày sinh theo định dạng DD/MM/YYYY!");
        setLoading(false);
        return;
      }
      const [day, month, year] = dateOfBirth.split("/");
      formData.append("dateOfBirth", `${year}-${month}-${day}`); // Định dạng chuẩn là YYYY-MM-DD
    }

    // Nếu có ảnh hồ sơ được chọn, thêm vào FormData
    if (fileList.length > 0) {
      formData.append("profileImage", fileList[0].originFileObj); // Thêm ảnh vào FormData
    }

    try {
      // Gửi yêu cầu PUT với userId để cập nhật thông tin
      const response = await axios.put(
        `http://localhost:8080/users/${user.email}`, // Sử dụng userId lấy được
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        message.success("Cập nhật thông tin cá nhân thành công!");
        const updatedUser = { ...auth.user, ...response.data };
        if (response.data.profileImage) {
          setFileList([
            {
              uid: "-1", // uid mặc định cho ảnh mới
              name: "profile-image", // Tên ảnh
              status: "done", // Đánh dấu ảnh đã tải xong
              url: response.data.profileImage, // URL ảnh mới từ server
            },
          ]);
        } else {
          // Nếu không thay đổi ảnh, sử dụng ảnh cũ từ auth.user
          setFileList([
            {
              uid: "-1",
              name: "profile-image",
              status: "done",
              url: auth.user.profileImage, // Sử dụng ảnh hiện tại trong context
            },
          ]);
        }

        setAuth({ ...auth, user: updatedUser });
        form.setFieldsValue(updatedUser);

        onSave(updatedUser);
        // onSave({ ...user, profileImage: response.data.profileImageUrl }); // Cập nhật ảnh trong user
      } else {
        message.error("Có lỗi xảy ra khi tải ảnh lên.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin cá nhân:", error);
      message.error("Có lỗi xảy ra khi cập nhật thông tin.");
    }

    setLoading(false); // Kết thúc quá trình tải lên
  };
  const formatDateToDDMMYYYY = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return (
    <Modal
      visible={visible}
      title="Chỉnh sửa thông tin cá nhân"
      onCancel={onCancel}
      onOk={handleSave}
      confirmLoading={loading}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" initialValues={user}>
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Số điện thoại" name="phoneNumber">
          <Input />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>
        {/* Thêm trường giới tính */}
        <Form.Item label="Giới tính" name="gender">
          <Select>
            <Select.Option value="male">Nam</Select.Option>
            <Select.Option value="female">Nữ</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Ngày sinh"
          palaceholder="DD/MM/YYYY"
          name="dateOfBirth"
          rules={[
            {
              pattern: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
              message: "Vui lòng nhập ngày sinh theo định dạng DD/MM/YYYY",
            },
          ]}
        >
          <Input placeholder="DD/MM/YYYY" />
        </Form.Item>

        {/* Upload avatar */}
        <Form.Item label="Ảnh hồ sơ">
          <Upload
            accept="image/*"
            listType="picture-card"
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
          >
            {fileList.length < 1 && "+ Tải ảnh lên"}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
