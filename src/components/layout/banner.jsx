import React, { useState, useContext } from "react";
import { Avatar, Button, Space, Menu } from "antd";
import {
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const Banner = () => {
  const { auth, setAuth, hasRole } = useContext(AuthContext);

  const navigate = useNavigate();

  // Hàm đăng xuất
  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      user: {
        fullName: "",
        email: "",
        role: "",
        profileImage: "", // Reset ảnh đại diện khi đăng xuất
      },
    });
    localStorage.clear("access_token");
    localStorage.clear("refresh_token");
    navigate("/");
  };

  // Cấu hình các mục trong menu đăng nhập
  const items = [
    ...(auth.isAuthenticated
      ? [
          {
            label: (
              <Space size="middle">
                <Avatar
                  src={
                    auth.user.profileImage || "https://via.placeholder.com/40"
                  }
                />
                <Link to="/profile"> {auth.user.fullName}</Link>
              </Space>
            ),
            key: "account",
            children: [
              {
                label: <Link to="/setting">Cài đặt</Link>,
                key: "setting",
                icon: <SettingOutlined />,
              },
              ...(hasRole(["admin", "lecturer"]) && auth.isAuthenticated
                ? [
                    {
                      label: <Link to="/admin">Trang quản trị</Link>,
                      key: "admin",
                    },
                  ]
                : []),

              {
                label: (
                  <span
                    onClick={handleLogout}
                    style={{ cursor: "pointer", color: "red" }}
                  >
                    Đăng xuất
                  </span>
                ),
                key: "logout",
                icon: <LogoutOutlined />,
              },
            ],
          },
        ]
      : [
          {
            label: <Link to="/login">Đăng nhập</Link>,
            key: "login",
            icon: <LoginOutlined />,
          },
        ]),
  ];

  return (
    <div style={styles.bannerContainer}>
      {/* Bên trái: Logo trường */}
      <div style={styles.left}>
        <img
          src="https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-Hoc-Vien-Ky-Thuat-Mat-Ma-ACTVN-1.png" // Placeholder logo
          alt="Logo"
          style={styles.logo}
        />
      </div>

      {/* Giữa: Tên khoa và học viện */}
      <div style={styles.center}>
        <h1 style={styles.title}>Khoa Công Nghệ Thông Tin</h1>
        <p style={styles.subtitle}>Học Viện Kỹ Thuật Mật Mã</p>
      </div>

      {/* Bên phải: Logic đăng nhập */}
      <div style={styles.right}>
        <Menu
          mode="horizontal"
          items={items}
          theme="light"
          style={styles.menuStyle}
        />
      </div>
    </div>
  );
};

// Styles cho Banner
const styles = {
  bannerContainer: {
    width: "100%",
    height: "100px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    background: "linear-gradient(to right,rgb(72, 93, 115),#001529)", // Màu nền banner
    color: "white",
    fontWeight: "bold",
    fontSize: "24px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  },

  logo: {
    width: "70px",
    height: "70px",
  },
  center: {
    marginLeft: "30px",
    flex: 5,
    textAlign: "start",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#d32f2f",
    margin: 0,
    textAlign: "start",
  },
  subtitle: {
    fontSize: "16px",
    margin: 0,
    textAlign: "start",
  },
  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  menuStyle: {
    backgroundColor: "transparent", // Làm cho nền của menu trong suốt
    color: "white", // Màu chữ trắng giống banner
    border: "none", // Bỏ border nếu có
  },

  menuItemStyle: {
    color: "white", // Màu chữ trắng
  },
  menuSubItemStyle: {
    color: "white", // Màu chữ trắng cho các item con
  },
};

export default Banner;
