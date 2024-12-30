import React, { useState, useContext } from "react";
import { Layout, Menu, theme } from "antd";
import PostAdmin from "../pages/postAdmin.jsx";
import User from "../pages/user.jsx";
import CoursePage from "../pages/courseAdmin.jsx";
import NotificationAdmin from "../pages/notificationAdmin.jsx";
import { AuthContext } from "../components/context/auth.context.jsx";
import AdminFooter from "./footerAdmin.jsx";
import styles from "../css/Admin.module.css"; // Import CSS Module

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
        return <h2>Quản Lý thông tin</h2>;
      case "5-1":
        return <h2>Giới thiệu</h2>;
      case "5-2":
        return <h2>Liên hệ</h2>;
      case "5-3":
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
      <Sider width={250} className={styles.sidebar}>
        <div className={styles.logo}>Khoa CNTT</div>
        <Menu
          mode="vertical "
          defaultSelectedKeys={["1"]}
          selectedKeys={[selectedMenu]} // Gắn state vào selectedKeys
          onClick={handleMenuClick} // Xử lý khi chọn mục mới
          className={styles.menu}
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
          <SubMenu
            key="5"
            title={
              <span className={styles.subMenuTitle}>Quản lý thông tin</span>
            }
          >
            <Menu.Item key="5-1" className={styles.subMenuItem}>
              Giới thiệu
            </Menu.Item>
            <Menu.Item key="5-2" className={styles.subMenuItem}>
              Liên hệ
            </Menu.Item>
            <Menu.Item key="5-3" className={styles.subMenuItem}>
              Footer
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>

      {/* Content Area */}
      <Layout
        style={{
          marginLeft: 10,
          marginTop: 0,
          paddingTop: 0,
          backgroundColor: "#f0f0f0",
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
