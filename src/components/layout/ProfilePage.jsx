import React, { useContext, useState, useEffect } from "react";
import { Card, Avatar, Button, Space, Row, Col } from "antd";
import { AuthContext } from "../context/auth.context"; // Giả sử bạn có AuthContext để lấy thông tin người dùng
import { EditOutlined } from "@ant-design/icons"; // Dùng để thêm biểu tượng chỉnh sửa
import EditProfileModal from "./EditProfileModal"; // Đảm bảo bạn đã tạo file EditProfileModal
import moment from "moment";
import "../profile.css";

const ProfilePage = () => {
  const { auth, setAuth } = useContext(AuthContext); // Lấy thông tin người dùng từ context
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Trạng thái mở Modal chỉnh sửa

  useEffect(() => {
    if (auth.user) {
      setUser(auth.user);
    }
  }, [auth]);

  const handleEditClick = () => {
    setModalVisible(true); // Mở Modal khi người dùng nhấn "Chỉnh sửa"
  };

  const handleModalCancel = () => {
    setModalVisible(false); // Đóng Modal khi nhấn hủy
  };

  const handleSaveChanges = (updatedUser) => {
    setUser(updatedUser); // Cập nhật thông tin người dùng sau khi lưu
    setAuth((prevAuth) => ({
      ...prevAuth,
      user: updatedUser, // Cập nhật lại thông tin người dùng trong context
    }));
    setModalVisible(false); // Đóng modal sau khi lưu
  };

  if (!user) {
    return <div>Loading...</div>;
  }
  const renderRoleText = (role) => {
    switch (role) {
      case "student":
        return "Sinh viên";
      case "lecturer":
        return "Giảng viên";
      default:
        return role;
    }
  };

  return (
    <div className="profile-page">
      <Card className="profile-card">
        <Row gutter={[16, 16]}>
          {/* Cột ảnh đại diện */}
          <Col span={6} className="profile-avatar-col">
            <img
              src={user.profileImage || "https://via.placeholder.com/150x200"}
              alt="User Avatar"
              className="profile-avatar"
            />
          </Col>

          {/* Cột thông tin người dùng */}
          <Col span={18}>
            <Row gutter={[16, 16]}>
              <Col
                span={18}
                style={{
                  borderBottom: "3px solid#BE0F0F",
                  fontWeight: "bold",
                  fontSize: "24px",
                  color: "#223771",
                }}
              >
                <strong>Thông tin cá nhân</strong>
              </Col>
              <Col
                span={6}
                className="edit-button"
                style={{
                  borderBottom: "3px solid #BE0F0F",
                  paddingBottom: "15px",
                }}
              >
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEditClick}
                >
                  Chỉnh sửa
                </Button>
              </Col>
              <Col span={12}>
                <strong>Họ và tên:</strong> {user.fullName}
              </Col>
              {user.role === "student" && (
                <Col span={12}>
                  <strong>MSV:</strong> {user.MSV}
                </Col>
              )}
              {user.role === "student" && (
                <Col span={12}>
                  <strong>Lớp:</strong> {user.class}
                </Col>
              )}

              <Col span={12}>
                <strong>Email:</strong> {user.email}
              </Col>
              <Col span={12}>
                <strong>Giới tính:</strong> {user.gender}
              </Col>
              <Col span={12}>
                <strong>Ngày sinh:</strong>{" "}
                {moment(user.dateOfBirth).format("DD/MM/YYYY")}
              </Col>
              <Col span={12}>
                <strong>Số điện thoại:</strong> {user.phoneNumber}
              </Col>
              <Col span={12}>
                <strong>Địa chỉ:</strong> {user.address}
              </Col>
              <Col span={12}>
                <strong>Chức vụ:</strong> {renderRoleText(user.role)}
              </Col>
              <Col span={12}>
                <strong>Trạng thái:</strong>{" "}
                {user.isActive ? "Đang hoạt động" : "Không hoạt động"}
              </Col>

              {user.role === "lecturer" && (
                <Col span={24}>
                  <strong>Mô tả:</strong> {user.description}
                </Col>
              )}
            </Row>
          </Col>
          <Col
            span={24}
            style={{
              borderTop: "3px solid #BE0F0F",
              fontWeight: "bold",
              fontSize: "24px",
              color: "#223771",
            }}
          ></Col>
        </Row>
      </Card>

      {/* Modal chỉnh sửa thông tin */}
      <EditProfileModal
        visible={modalVisible}
        onCancel={handleModalCancel}
        user={user}
        onSave={handleSaveChanges}
      />
    </div>
  );
};

export default ProfilePage;
