import React, { useState, useContext } from "react";
import {
  SettingOutlined,
  UserOutlined,
  ContactsTwoTone,
  HomeTwoTone,
  NotificationOutlined,
  ScheduleTwoTone,
  ReadFilled,
  ContainerTwoTone,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { Menu, Avatar, Space } from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const Hader = () => {
  const { auth, setAuth, hasRole } = useContext(AuthContext);
  console.log(">>>Check auth : ", auth);

  const navigate = useNavigate();

  console.log(">>>Check auth : ", auth);
  const items = [
    {
      label: <Link to="/">Trang chủ</Link>,
      key: "home",
      icon: <HomeTwoTone />,
    },
    {
      label: <Link to="/about">Giới thiệu</Link>,
      key: "about",
      icon: <ReadFilled />,
    },

    {
      label: <Link to="/course">Chương trình đào tạo</Link>,
      key: "course",
      icon: <ScheduleTwoTone />,
    },
    {
      label: <Link to="/post">Tin tức</Link>,
      key: "post",
      icon: <ContainerTwoTone />,
    },

    ...(auth.isAuthenticated
      ? [
          {
            label: <Link to="/notifications">Thông báo</Link>,
            key: "notification",
            icon: <NotificationOutlined />,
          },
        ]
      : []),
  ];

  const [current, setCurrent] = useState("mail");
  const onClick = (e) => {
    console.log("click ", e);
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
export default Hader;
