import React, { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { HomeTwoTone, NotificationOutlined } from "@ant-design/icons";
import { AuthContext } from "../context/auth.context";
import axios from "axios";
import "../header.css";
import { UseApp } from "../context/AppProvider";
const Header = () => {
  const { auth } = useContext(AuthContext); // Lấy thông tin auth từ context
  const [menuItems, setMenuItems] = useState([]);
  const [current, setCurrent] = useState("home");
  const { reloadHeader, setReloadHeader } = UseApp();

  // Lấy dữ liệu menu động từ Strapi
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/menus`);
        const sortedMenuItems = response.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMenuItems(sortedMenuItems);
      } catch (error) {
        console.error("Error fetching menu items", error);
      }
    };

    fetchMenuItems();
    setReloadHeader(false);
  }, [reloadHeader]);

  const filteredMenuItems = menuItems.filter(
    (menuItem) => menuItem.menuSlug !== "notifications"
  );

  const generateSubmenu = (menu, submenus) => {
    // Chỉ tạo submenu nếu có ít nhất một submenu
    if (submenus && submenus.length > 0) {
      return submenus.map((submenu) => ({
        label: (
          <Link
            to={`/${menu.menuSlug}/submenu/${submenu.subMenuSlug}`}
            className="submenu-item-link"
          >
            {submenu.subMenu}
          </Link>
        ),
        key: submenu.subMenuSlug, // Key cần phải duy nhất, sử dụng slug của submenu
        className: "submenu-item",
      }));
    }
    return [];
  };

  const items = [
    // Các mục menu cố định
    {
      label: <Link to="/"></Link>,
      key: "home",
      icon: <HomeTwoTone />,
      className: "menu-item",
    },

    ...filteredMenuItems.map((menuItem) => {
      const submenuItems = generateSubmenu(menuItem, menuItem.submenus); // Lấy submenu nếu có

      return {
        label: (
          <Link
            to={`/${menuItem.menuSlug}`}
            className="menu-item-link"
            onClick={() => setCurrent(menuItem.menuSlug)} // Cập nhật 'current' khi chọn mục
          >
            {menuItem.menu}
          </Link>
        ),
        key: menuItem.menuSlug,
        children: submenuItems.length > 0 ? submenuItems : undefined,
        className: "menu-item",
      };
    }),

    ...(auth.isAuthenticated
      ? [
          {
            label: (
              <Link to="/notifications" className="menu-item-link">
                Thông báo
              </Link>
            ),

            key: "notification",
            className: "menu-item",
          },
        ]
      : []), // Nếu không đăng nhập, không hiển thị mục thông báo
  ];

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
      style={{
        display: "flex",
        justifyContent: "flex-start",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: "49px",
        background: "#363636",
        borderTop: "5px solid #BE0F0F",
        color: "#fff",
      }}
    />
  );
};

export default Header;
