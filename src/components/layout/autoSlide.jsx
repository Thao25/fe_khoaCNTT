import React, { useEffect, useState } from "react";
import { Carousel } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../css/autoSlide.css";
const AutoSlideCarousel = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:1337/posts?_sort=published_at:DESC&_limit=5")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Có lỗi khi lấy dữ liệu bài viết:", error);
      });
  }, []);
  const handleBeforeChange = () => {
    const titles = document.querySelectorAll(".carousel-slide-title h3");
    titles.forEach((title) => {
      title.classList.remove("reset-animation"); // Remove class để reset animation
      void title.offsetWidth; // Triggers reflow, forcing animation reset
      title.classList.add("reset-animation"); // Thêm lại class để chạy animation từ đầu
    });
  };
  return (
    <div className="auto-slide-container">
      <div className="auto-slide-carousel">
        <Carousel
          autoplay
          arrows
          dotPosition="bottom"
          autoplaySpeed={9000}
          beforeChange={handleBeforeChange}
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
              <div className="carousel-slide-title">
                <h3>{post.Title}</h3>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default AutoSlideCarousel;
