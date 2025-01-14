import React, { useState, useContext } from "react";
import { Layout, Menu, theme } from "antd";
import PostAdmin from "../pages/postAdmin.jsx";
import User from "../pages/user.jsx";
import CoursePage from "../pages/courseAdmin.jsx";
import NotificationAdmin from "../pages/notificationAdmin.jsx";
import { AuthContext } from "../components/context/auth.context.jsx";
import AdminFooter from "./footerAdmin.jsx";
import styles from "../css/Admin.module.css"; // Import CSS Module
import AdminHeaderPage from "./AdminHeaderPage.jsx";
const { SubMenu } = Menu;
const { Sider, Content } = Layout;

const Admin = () => {
  const { auth, setAuth, hasRole } = useContext(AuthContext);

  // State để theo dõi mục được chọn trong sidebar
  const [selectedMenu, setSelectedMenu] = useState("1");

  // Hàm xử lý khi chọn một mục trong sidebar
  const handleMenuClick = (e) => {
    setSelectedMenu(e.key); // Cập nhật state với key của mục được chọn
  };

  // Hàm trả về nội dung tương ứng với mục được chọn
  const renderContent = () => {
    switch (selectedMenu) {
      case "1":
        return <PostAdmin />;
      case "2":
        return <User />;
      case "3":
        return <CoursePage />;
      case "4":
        return <NotificationAdmin />;
      case "5":
        return <AdminHeaderPage />;
      case "6":
        return <AdminFooter />;
      default:
        return <PostAdmin />;
    }
  };

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        width={250}
        className={styles.sidebar}
        style={{ backgroundColor: "#333" }}
      >
        <div className={styles.logo}>Khoa CNTT</div>
        <Menu
          mode="vertical "
          defaultSelectedKeys={["1"]}
          selectedKeys={[selectedMenu]}
          onClick={handleMenuClick}
          className={styles.menu}
          style={{ backgroundColor: "#fff", borderRadius: borderRadiusLG }}
        >
          <Menu.Item key="1" className={styles.menuItem}>
            Quản lý tin tức
          </Menu.Item>
          {hasRole("admin") && auth.isAuthenticated && (
            <Menu.Item key="2" className={styles.menuItem}>
              Quản lý người dùng
            </Menu.Item>
          )}
          <Menu.Item key="3" className={styles.menuItem}>
            Quản lý khóa học
          </Menu.Item>
          <Menu.Item key="4" className={styles.menuItem}>
            Quản lý thông báo
          </Menu.Item>

          <Menu.Item key="5" className={styles.menuItem}>
            Quản lý Navbar
          </Menu.Item>
          {hasRole("admin") && auth.isAuthenticated && (
            <Menu.Item key="6" className={styles.menuItem}>
              Quản lý footer
            </Menu.Item>
          )}
        </Menu>
      </Sider>

      {/* Content Area */}
      <Layout
        style={{
          // marginLeft: 10,
          // marginTop: 0,
          // paddingTop: 0,
          backgroundColor: "aliceblue",
        }}
      >
        <Content
          className={styles.content} // Áp dụng lớp CSS cho Content
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;
