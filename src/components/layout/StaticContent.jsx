import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { LaptopOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import "../../css/StaticContent.css";

const { Title, Paragraph } = Typography;

const StaticContent = () => {
  return (
    <div className="static-content-container">
      <div className="background-overlay"></div>
      <Row gutter={[16, 24]} justify="center" className="content-row">
        <Col xs={24} sm={12} md={10}>
          <Card
            className="static-card"
            title={
              <span style={{ color: "white" }}>
                Chào mừng đến với Khoa CNTT
              </span>
            }
            bordered={false}
            cover={
              <LaptopOutlined
                style={{
                  fontSize: "48px",
                  color: "#1890ff",
                  marginTop: "10px",
                }}
              />
            }
          >
            <Title level={4}>Giới thiệu chung</Title>
            <Paragraph>
              Khoa Công nghệ Thông tin của chúng tôi cung cấp các chương trình
              đào tạo chất lượng cao, giúp sinh viên chuẩn bị cho sự nghiệp
              trong lĩnh vực công nghệ đầy tiềm năng.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={10}>
          <Card
            className="static-card"
            title={<span style={{ color: "white" }}>Tầm nhìn và sứ mệnh</span>}
            bordered={false}
            cover={
              <UsergroupAddOutlined
                style={{
                  fontSize: "48px",
                  color: "#1890ff",
                  marginTop: "10px",
                }}
              />
            }
          >
            <Title level={4}>Chúng tôi cam kết</Title>
            <Paragraph>
              Đào tạo những kỹ sư công nghệ thông tin xuất sắc, với kiến thức
              vững vàng và khả năng giải quyết vấn đề sáng tạo, góp phần thúc
              đẩy sự phát triển của xã hội.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StaticContent;
