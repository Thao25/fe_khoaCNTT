import React from "react";
import { Row, Col, Typography, Avatar, Button } from "antd";
import { SolutionOutlined, TeamOutlined } from "@ant-design/icons";
import "../../css/AboutUs.css"; // Đảm bảo tạo file CSS riêng

const { Title, Paragraph } = Typography;

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <div className="aboutus-overlay">
        <div className="aboutus-content">
          <Paragraph className="aboutus-description">
            Khoa Công nghệ Thông tin là một trong những khoa hàng đầu, đào tạo
            ra những kỹ sư công nghệ thông tin tài năng, sáng tạo và có khả năng
            đáp ứng nhu cầu phát triển của xã hội.
          </Paragraph>
        </div>
      </div>

      {/* Sứ mệnh và Tầm nhìn section ngang hàng
      <section className="aboutus-mission-vision">
        <Row justify="center" gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12}>
            <div className="aboutus-mission-content">
              <Title
                level={3}
                className="aboutus-section-title"
                style={{
                  color: "#1890ff",
                  fontWeight: "500",
                  marginTop: "20px",
                }}
              >
                Sứ Mệnh
              </Title>
              <Paragraph className="aboutus-paragraph">
                Chúng tôi cam kết đào tạo ra các kỹ sư CNTT có kiến thức vững
                vàng, sáng tạo và có khả năng giải quyết các vấn đề thực tiễn
                trong ngành công nghệ thông tin. Đảm bảo rằng các sinh viên tốt
                nghiệp sẽ có đủ kỹ năng và sự tự tin để thành công trong thế
                giới công nghệ.
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} sm={12} md={12}>
            <div className="aboutus-vision-content">
              <Title
                level={3}
                className="aboutus-section-title"
                style={{
                  color: "#1890ff",
                  fontWeight: "500",
                  marginTop: "20px",
                }}
              >
                Tầm Nhìn
              </Title>
              <Paragraph className="aboutus-paragraph">
                Trở thành một trong những đơn vị đào tạo hàng đầu trong lĩnh vực
                công nghệ thông tin, cung cấp nguồn nhân lực chất lượng cao cho
                ngành công nghiệp công nghệ. Chúng tôi sẽ tiếp tục sáng tạo, đổi
                mới và duy trì chất lượng đào tạo xuất sắc.
              </Paragraph>
            </div>
          </Col>
        </Row>
      </section> */}
    </div>
  );
};

export default AboutUs;
