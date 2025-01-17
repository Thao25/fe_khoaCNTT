import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col } from "antd";
import { Link } from "react-router-dom";
import "../../css/LatestPostsPage.css";

const LatestPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:1337/posts?_sort=published_at:DESC&_limit=4")
      .then((response) => {
        setPosts(response.data);
        if (response.data.length > 0) {
          setSelectedImage(response.data[0].Image[0]?.url);
        }
      })
      .catch((error) => {
        console.error("Có lỗi khi lấy dữ liệu bài viết:", error);
      });
  }, []);
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl); // Cập nhật ảnh đã chọn
  };

  const removeImagesFromContent = (content) => {
    // Dùng regex để tìm và loại bỏ tất cả thẻ <img>
    const contentWithoutImages = content.replace(/<img[^>]*>/g, "");
    return contentWithoutImages;
  };
  return (
    <div className="latest-posts-page">
      <h2 className="title">
        <span className="line">|</span>Tin tức mới nhất
        <span className="line">|</span>
      </h2>
      <div className="latest-posts-page-content">
        {/* <div className="image-section">
          <img
            src={`http://localhost:1337${selectedImage}`}
            alt="Post Image"
            className="background-image"
          />
        </div> */}

        <div className="posts-section">
          <Row gutter={12}>
            {posts.map((post) => (
              <Col
                span={6}
                key={post.id}
                // onClick={() => handleImageClick(post.Image[0]?.url)}
              >
                <Card
                  hoverable
                  cover={
                    <img
                      alt={post.Title}
                      src={`http://localhost:1337${post.Image[0]?.url}`}
                    />
                  }
                >
                  <Card.Meta
                    title={<Link to={`/post/${post.id}`}>{post.Title}</Link>}
                  />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: removeImagesFromContent(
                        post.Content.length > 150
                          ? `${post.Content.substring(0, 150)}...`
                          : post.Content
                      ),
                    }}
                    className="post-preview"
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default LatestPostsPage;
