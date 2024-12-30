import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spin, Layout, Row, Col, Typography, Space } from "antd";
import {
  FacebookOutlined,
  GlobalOutlined,
  MailTwoTone,
  PhoneTwoTone,
  EnvironmentTwoTone,
} from "@ant-design/icons";

const { Text } = Typography;
const { Footer: AntFooter } = Layout;

const Footer = () => {
  const [footerData, setFooterData] = useState(null);

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
  }, []);

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
        background: "linear-gradient(to right, #2c3e50,#001529)", // Tông màu xanh đậm
        color: "#fff",
        padding: "40px 0",
        borderTop: "4px solid #ffd700", // Viền vàng nhẹ
      }}
    >
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
                  color: "#b0b0b0",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transform: "scale(1.1)",
                }}
              >
                <PhoneTwoTone
                  style={{ color: "#28a745", marginLeft: "30px" }}
                />
                SĐT: {footerData.phone}
              </Text>
              <Text
                style={{
                  color: "#b0b0b0",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transform: "scale(1.1)",
                }}
              >
                <MailTwoTone style={{ color: "#28a745", marginLeft: "30px" }} />
                Email: {footerData.email}
              </Text>
              <Text
                style={{
                  color: "#b0b0b0",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  transform: "scale(1.1)",
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
                  color: "#b0b0b0",
                  textDecoration: "none",
                  fontSize: "16px",
                  hover: { color: "#28a745", transform: "scale(1.1)" },

                  display: "flex",
                  marginLeft: "30px",
                }}
              >
                Giới thiệu
              </a>
              <a
                href={footerData.program_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#b0b0b0",
                  textDecoration: "none",
                  fontSize: "16px",
                  hover: { color: "#28a745", transform: "scale(1.1)" },

                  display: "flex",
                  marginLeft: "30px",
                }}
              >
                Chương trình đào tạo
              </a>
              <a
                href="https://moet.gov.vn/Pages/home.aspx"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#b0b0b0",
                  textDecoration: "none",
                  fontSize: "16px",
                  hover: { color: "#28a745", transform: "scale(1.1)" },

                  display: "flex",
                  marginLeft: "30px",
                }}
              >
                Bộ Giáo dục và Đào tạo
              </a>
              <a
                href="http://thuvienso.actvn.edu.vn/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#b0b0b0",
                  textDecoration: "none",
                  fontSize: "16px",
                  hover: { color: "#28a745", transform: "scale(1.1)" },

                  display: "flex",
                  marginLeft: "30px",
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
                  color: "#b0b0b0",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FacebookOutlined style={{ color: "#4267B2" }} />
                Facebook
              </a>
              <a
                href={footerData.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#b0b0b0",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <GlobalOutlined style={{ color: "#6c757d" }} />
                Website
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
                height="150px"
                src={footerData.video_link}
                title="Video Giới thiệu"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
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
            marginTop: "30px",
            borderTop: "1px solid #ffd700",
            paddingTop: "20px",
          }}
        >
          <Text style={{ color: "#b0b0b0" }}>
            &copy; 2024 Khoa Công nghệ Thông tin. Tất cả quyền được bảo vệ.
          </Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
