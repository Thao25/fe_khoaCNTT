import React, { useEffect, useState } from "react";
import { Carousel } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

const AutoSlideCarousel = () => {
  const [posts, setPosts] = useState([]); // State chứa 5 bài post mới nhất

  useEffect(() => {
    // Lấy 5 bài post mới nhất
    axios
      .get("http://localhost:1337/posts?_sort=published_at:DESC&_limit=5") // API lấy bài viết
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Có lỗi khi lấy dữ liệu bài viết:", error);
      });
  }, []);

  return (
    <div className="auto-slide-carousel">
      <Carousel
        autoplay
        arrows
        // prevArrow={<LeftOutlined />}
        // nextArrow={<RightOutlined />}
        dotPosition="bottom"
        autoplaySpeed={3000} // Tốc độ tự động chuyển slide (3 giây)
      >
        {posts.map((post) => (
          <div key={post.id} className="carousel-slide">
            <Link to={`/post/${post.id}`} className="carousel-slide-link">
              <img
                src={`http://localhost:1337${post.Image[0]?.url}`}
                alt={post.Title}
                className="carousel-slide-image"
              />
            </Link>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default AutoSlideCarousel;
