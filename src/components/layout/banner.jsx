import React, { useState, useContext } from "react";
import { Avatar, Button, Space, Dropdown, Menu, Input } from "antd";
import { KeyOutlined, LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { max } from "moment/moment";

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
  const accountMenu = (
    <Menu>
      <Menu.Item
        key="account"
        style={{
          backgroundColor: "#EDF1FD",
          height: "60px",
          padding: 0,
          margin: 0,
        }}
      >
        <Space size="middle">
          <Avatar
            src={auth.user.profileImage || "https://via.placeholder.com/40"}
            style={styles.avatar}
          />
          <Link to="/profile" style={styles.menuname}>
            {auth.user.fullName}
          </Link>
        </Space>
      </Menu.Item>
      <Menu.Item key="password" style={styles.menuItem}>
        <Link to="/password" style={styles.menuLink}>
          Thay đổi mật khẩu
        </Link>
      </Menu.Item>
      {hasRole(["admin", "lecturer"]) && auth.isAuthenticated && (
        <Menu.Item key="admin" style={styles.menuItem}>
          <Link to="/admin" style={styles.menuLink}>
            Trang quản trị
          </Link>
        </Menu.Item>
      )}
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        style={{ ...styles.menuItem, color: "red" }}
      >
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  // const guestMenu = (
  //   <Menu>
  //     <Menu.Item key="login" icon={<LoginOutlined />} style={styles.menuItem}>
  //       <Link to="/login" style={styles.menuLink}>
  //         Đăng nhập
  //       </Link>
  //     </Menu.Item>
  //   </Menu>
  // );

  return (
    <div style={styles.bannerContainer}>
      {/* Bên trái: Logo trường */}
      <div style={styles.left}>
        <img
          src="https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-Hoc-Vien-Ky-Thuat-Mat-Ma-ACTVN-1.png" // Placeholder logo
          alt="Logo"
          style={styles.logo}
        />
        <div>
          <h1 style={styles.KMA}>KMA</h1>
        </div>
      </div>

      {/* Giữa: Tên khoa và học viện */}
      <div style={styles.center}>
        <h2 style={styles.title}>Khoa Công Nghệ Thông Tin</h2>
        <p style={styles.subtitle}>Học Viện Kỹ Thuật Mật Mã</p>
      </div>

      {/* Bên phải: Logic đăng nhập */}
      <div style={styles.right}>
        {auth.isAuthenticated ? (
          <div
            style={{
              padding: "10px",

              borderRadias: "8px",
            }}
          >
            <Input placeholder="Tìm kiếm..." style={styles.searchBar} />
            <Dropdown overlay={accountMenu} trigger={["click"]}>
              <Button
                type="text"
                icon={
                  <Avatar
                    src={
                      auth.user.profileImage || "https://via.placeholder.com/40"
                    }
                  />
                }
                style={styles.buttonAvatar}
              />
            </Dropdown>
          </div>
        ) : (
          // <Dropdown
          //   overlay={guestMenu}
          //   trigger={["click"]}
          //   placement="bottomCenter"
          // >
          <Button
            type="text"
            icon={<LoginOutlined />}
            style={styles.buttonLogin}
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </Button>
          // </Dropdown>
        )}
      </div>

      {/* Thêm style cho keyframes */}
      <style>{`
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
      `}</style>
    </div>
  );
};

// Styles cho Banner
const styles = {
  bannerContainer: {
    height: "70px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0 auto",
    padding: "20px",
    background:
      "linear-gradient(to right,rgb(241, 242, 248),rgb(213, 230, 243))",
    color: "white",
    fontWeight: "bold",
    fontSize: "24px",
    maxWith: "1400px",
    borderRadius: "10px",
    transition: "background-color 0.3s ease-in-out",
  },
  logo: {
    width: "60px",
    height: "60px",
    marginLeft: "30px",
    marginTop: "20px",
    transition: "transform 0.3s ease",
  },
  left: {
    flex: 1,
    display: "flex",
  },
  center: {
    flex: 4,
    textAlign: "center",
    position: "relative",
  },
  KMA: {
    flex: 1,
    fontFamily: "Arial, sans-serif",
    fontSize: "52px",
    fontWeight: "bold",
    color: "red",
    margin: "20px 20px",
    textAlign: "center",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  },

  title: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "red",
    margin: "0",
    textAlign: "center",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
    animation: "pulse 2.5s ease-in-out infinite", // Áp dụng animation di chuyển
  },
  subtitle: {
    fontSize: "14px",
    margin: "0",
    color: "#363636",
    textAlign: "center",
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
    animation: "pulse 2.5s ease-in-out infinite", // Áp dụng animation di chuyển
  },
  right: {
    flex: 1.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonAvatar: {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",

    marginRight: "20px",
    transition: "transform 0.3s ease-in-out",
  },
  buttonLogin: {
    backgroundColor: "#fff",
    color: "#223771",
    border: "none",
    fontSize: "18px",
    padding: "10px 10px",
    borderRadius: "30px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease-in-out",
  },
  menuItem: {
    padding: "10px 20px",
    transition: "background-color 0.3s ease-in-out",
  },
  menuLink: {
    color: "#333",
    textDecoration: "none",
    transition: "color 0.3s ease",
  },
  avatar: {
    borderRadius: "50%",
  },
  searchBar: {
    width: "170px",
    marginRight: "10px",
    borderRadius: "20px",
    padding: "5px",
    backgroundColor: "#fff",
  },
};

export default Banner;
