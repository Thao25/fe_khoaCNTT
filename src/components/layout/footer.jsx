import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spin, Layout, Row, Col, Typography, Space } from "antd";
import {
  FacebookOutlined,
  GlobalOutlined,
  MailTwoTone,
  PhoneTwoTone,
  EnvironmentTwoTone,
  YoutubeOutlined,
} from "@ant-design/icons";
import { UseApp } from "../context/AppProvider";

const { Text } = Typography;
const { Footer: AntFooter } = Layout;

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const { reloadFooter, setReloadFooter } = UseApp();

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await axios.get("http://localhost:1337/footers");
        setFooterData(response.data[0]);
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };

    fetchFooterData();
    setReloadFooter(false);
  }, [reloadFooter]);

  if (!footerData) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <AntFooter
      style={{
        backgroundColor: "#333",
        color: "#fff",
        padding: "10px 0",
        borderTop: "4px solid #BE0F0F", // Viền vàng nhẹ
        position: "relative", // Để đặt ảnh nền dưới footer
        zIndex: 1,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage:
            "url('https://media.istockphoto.com/id/1390542860/video/black-pastel-colored-blank-and-empty-waving-and-animated-cloth-flag-texture-black-background.jpg?s=640x640&k=20&c=Z1qRydKbN0WVq3eksAgQEzXED-6gqfBm2wysYuuK0z0=')", // Thêm URL của tấm ảnh của bạn ở đây
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2, // Đặt độ mờ cho ảnh
          zIndex: -1, // Đảm bảo ảnh ở dưới footer
        }}
      ></div>

      <div
        style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}
      >
        <Row gutter={[32, 32]} justify="center">
          {/* Cột 1: Thông tin liên hệ */}
          <Col xs={24} sm={12} md={6}>
            <Text
              strong
              style={{
                fontSize: "20px",
                color: "#ffd700",
                marginBottom: "15px",
                display: "block",
              }}
            >
              Thông tin
            </Text>
            <Space direction="vertical" size="middle">
              <Text
                style={{
                  color: "#EEEAEE",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <PhoneTwoTone
                  style={{ color: "#28a745", marginLeft: "30px" }}
                />
                SĐT: {footerData.phone}
              </Text>
              <Text
                style={{
                  color: "#EEEAEE",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <MailTwoTone style={{ color: "#28a745", marginLeft: "30px" }} />
                Email: {footerData.email}
              </Text>
              <Text
                style={{
                  color: "#EEEAEE",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                <EnvironmentTwoTone
                  style={{ color: "#28a745", marginLeft: "30px" }}
                />
                Địa chỉ: {footerData.address}
              </Text>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Text
              strong
              style={{
                fontSize: "20px",
                color: "#ffd700",
                marginBottom: "15px",
                display: "block",
              }}
            >
              Liên kết
            </Text>
            <Space direction="vertical" size="middle">
              <a
                href={footerData.about_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#EEEAEE",
                  textDecoration: "none",
                  fontSize: "16px",
                  hover: { color: "#28a745", transform: "scale(1.1)" },

                  display: "flex",
                  marginLeft: "50px",
                }}
              >
                Giới thiệu
              </a>
              <a
                href={footerData.tuyen_sinh}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#EEEAEE",
                  textDecoration: "none",
                  fontSize: "16px",
                  hover: { color: "#28a745", transform: "scale(1.1)" },

                  display: "flex",
                  marginLeft: "50px",
                }}
              >
                Tuyển sinh
              </a>
              <a
                href={footerData.tuyen_dung}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#EEEAEE",
                  textDecoration: "none",
                  fontSize: "16px",
                  hover: { color: "#28a745", transform: "scale(1.1)" },

                  display: "flex",
                  marginLeft: "50px",
                }}
              >
                Tuyển dụng
              </a>
              <a
                href={footerData.program_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#EEEAEE",
                  textDecoration: "none",
                  fontSize: "16px",
                  hover: { color: "#28a745", transform: "scale(1.1)" },

                  display: "flex",
                  marginLeft: "50px",
                }}
              >
                Chương trình đào tạo
              </a>

              <a
                href="http://thuvienso.actvn.edu.vn/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#EEEAEE",
                  textDecoration: "none",
                  fontSize: "16px",
                  hover: { color: "#28a745", transform: "scale(1.1)" },

                  display: "flex",
                  marginLeft: "50px",
                }}
              >
                Trung tâm Thông tin Thư viện
              </a>
            </Space>
          </Col>

          {/* Cột 3: Liên hệ */}
          <Col xs={24} sm={12} md={6}>
            <Text
              strong
              style={{
                fontSize: "20px",
                color: "#ffd700",
                marginBottom: "15px",
                display: "block",
              }}
            >
              Liên hệ
            </Text>
            <Space direction="vertical" size="large">
              <a
                href={footerData.facebook}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#EEEAEE",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "16px",
                  gap: "8px",
                }}
              >
                <FacebookOutlined style={{ color: "#1DA1F2" }} />
                Facebook
              </a>
              <a
                href={footerData.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#EEEAEE",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "16px",
                  gap: "8px",
                }}
              >
                <GlobalOutlined style={{ color: "#1DA1F2" }} />
                Website
              </a>
              <a
                href={footerData.youtube}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#EEEAEE",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "16px",
                  gap: "8px",
                }}
              >
                <YoutubeOutlined style={{ color: "#1DA1F2" }} />
                Youtube
              </a>
              <a
                href="https://moet.gov.vn/Pages/home.aspx"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#EEEAEE",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "16px",
                  gap: "8px",
                }}
              >
                Bộ Giáo dục và Đào tạo
              </a>
            </Space>
          </Col>

          {/* Cột 4: Video Giới thiệu */}
          <Col xs={24} sm={12} md={6}>
            <Text
              strong
              style={{
                fontSize: "20px",
                color: "#ffd700",
                marginBottom: "15px",
                display: "block",

                marginRight: "30px",
              }}
            ></Text>
            {footerData.video_link ? (
              <iframe
                width="100%"
                height="160px"
                src={footerData.video_link}
                title="Video Giới thiệu"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  marginTop: "20px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                  borderRadius: "8px",
                  border: "2px solid #ffd700",
                }}
              />
            ) : (
              <Text style={{ color: "#b0b0b0" }}>
                Chưa có video giới thiệu.
              </Text>
            )}
          </Col>
        </Row>

        {/* Dòng bản quyền */}
        <div
          style={{
            marginTop: "20px",
            borderTop: "1px solid #BE0F0F",
            paddingTop: "10px",
          }}
        >
          <Text style={{ color: "#EEEAEE" }}>
            &copy; 2024 Khoa Công nghệ Thông tin. Tất cả quyền được bảo vệ.
          </Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
