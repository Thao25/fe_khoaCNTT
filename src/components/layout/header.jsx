import React, { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import {
  HomeTwoTone,
  NotificationOutlined,
  ContainerTwoTone,
} from "@ant-design/icons";
import { AuthContext } from "../context/auth.context";
import axios from "axios"; // Dùng axios để gọi API

const Header = () => {
  const { auth } = useContext(AuthContext); // Lấy thông tin auth từ context
  const [menuItems, setMenuItems] = useState([]);

  // Lấy dữ liệu menu động từ Strapi
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/menus`);
        const sortedMenuItems = response.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        ); // Sắp xếp theo thời gian tạo
        setMenuItems(sortedMenuItems);
      } catch (error) {
        console.error("Error fetching menu items", error);
      }
    };

    fetchMenuItems();
  }, []);
  const filteredMenuItems = menuItems.filter(
    (menuItem) => menuItem.menuSlug !== "notifications"
  );
  const generateSubmenu = (menu, submenus) => {
    // Chỉ tạo submenu nếu có ít nhất một submenu
    if (submenus && submenus.length > 0) {
      return submenus.map((submenu) => ({
        label: (
          <Link to={`/${menu.menuSlug}/${submenu.subMenuSlug}`}>
            {submenu.subMenu}
          </Link>
        ),
        key: submenu.subMenuSlug, // Key cần phải duy nhất, sử dụng slug của submenu
      }));
    }
    return [];
  };

  const items = [
    // Các mục menu cố định
    {
      label: <Link to="/">Trang chủ</Link>,
      key: "home",
      icon: <HomeTwoTone />,
    },

    ...filteredMenuItems.map((menuItem) => {
      const submenuItems = generateSubmenu(menuItem, menuItem.submenus); // Lấy submenu nếu có
      return {
        label: <Link to={`/${menuItem.menuSlug}`}>{menuItem.menu}</Link>, // Link đến trang menu với menuSlug
        key: menuItem.menuSlug,
        icon: <ContainerTwoTone />,
        children: submenuItems.length > 0 ? submenuItems : undefined, // Nếu có submenu thì hiển thị, không có thì không có children
      };
    }),

    // Chỉ thêm mục "Thông báo" nếu người dùng đã đăng nhập và nó chưa có trong menu động
    ...(auth.isAuthenticated
      ? [
          {
            label: <Link to="/notifications">Thông báo</Link>, // Hiển thị mục thông báo nếu người dùng đã đăng nhập
            key: "notification",
            icon: <NotificationOutlined />,
          },
        ]
      : []), // Nếu không đăng nhập, không hiển thị mục thông báo
  ];

  const [current, setCurrent] = useState("home");

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default Header;
