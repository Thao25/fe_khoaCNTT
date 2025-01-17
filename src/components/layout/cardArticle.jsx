import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col } from "antd";
import { Link } from "react-router-dom";
import "../../css/cardArticle.css";

const FeaturedArticles = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);

  useEffect(() => {
    // Lấy các bài viết có isFeatured = true
    axios
      .get("http://localhost:1337/articles?isFeatured=true&_limit=2")
      .then((response) => {
        setFeaturedArticles(response.data);
      })
      .catch((error) => {
        console.error("Có lỗi khi lấy bài viết nổi bật:", error);
      });
  }, []);
  const removeImagesFromContent = (content) => {
    // Dùng regex để tìm và loại bỏ tất cả thẻ <img>
    const contentWithoutImages = content.replace(/<img[^>]*>/g, "");
    return contentWithoutImages;
  };
  return (
    <div className="featured-container">
      <h2 className="title">
        <span className="line">|</span>Bài viết nổi bật
        <span className="line">|</span>
      </h2>
      <div className="featured-articles">
        <Row gutter={12}>
          {featuredArticles.map((article) => (
            <Col span={12} key={article.id}>
              <Card
                hoverable
                cover={
                  <img
                    src={
                      article.image?.url
                        ? `http://localhost:1337${article.image.url}`
                        : "https://tuyensinh.actvn.edu.vn/wp-content/uploads/2024/03/42.jpg"
                    }
                    alt={article.title}
                    className="article-image"
                  />
                }
              >
                <Card.Meta
                  title={
                    <Link to={`/${article.menu.menuSlug}/${article.id}`}>
                      {article.title.length > 30
                        ? article.title.substring(0, 30) + "..."
                        : article.title}
                    </Link>
                  }
                />
                <div
                  dangerouslySetInnerHTML={{
                    __html: removeImagesFromContent(
                      article.content.length > 100
                        ? `${article.content.substring(0, 100)}...`
                        : article.content
                    ),
                  }}
                  className="article-preview"
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default FeaturedArticles;
