import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "../css/postDetail.css";
import { Spin, Carousel } from "antd";
import { Link } from "react-router-dom";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]); // State cho tin liên quan

  useEffect(() => {
    // Lấy chi tiết bài viết
    axios
      .get(`http://localhost:1337/posts/${id}`)
      .then((response) => {
        setPost(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Có lỗi khi lấy dữ liệu bài viết:", error);
        setLoading(false);
      });

    // Lấy các bài viết liên quan (10 bài mới nhất)
    axios
      .get("http://localhost:1337/posts?_sort=published_at:DESC&_limit=10")
      .then((response) => {
        setRelatedPosts(response.data); // Cập nhật tin liên quan
      })
      .catch((error) => {
        console.error("Có lỗi khi lấy tin liên quan:", error);
      });
  }, [id]);

  if (loading) {
    return <Spin />;
  }
  if (!post) {
    return <div>Bài viết không tồn tại.</div>;
  }

  const getFullImageUrl = (content) => {
    return content.replace(
      /!\[([^\]]+)\]\((\/uploads[^)]+)\)/g,
      (match, alt, path) => {
        return `![${alt}](http://localhost:1337${path})`;
      }
    );
  };
  // Hàm để cuộn trang lên đầu
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Hiệu ứng cuộn mượt mà
    });
  };

  /* CSS cho khi người dùng cuộn xuống */
  window.addEventListener("scroll", function () {
    const btn = document.querySelector(".scroll-to-top-btn");
    if (btn) {
      if (window.scrollY > 100) {
        btn.classList.add("show"); // Hiển thị nút khi cuộn xuống 100px
      } else {
        btn.classList.remove("show"); // Ẩn nút khi ở trên cùng
      }
    }
  });
  return (
    <div className="post-detail-container">
      <div className="post-detail">
        {/* Nội dung bài viết bên trái */}
        <div className="post-content">
          <h1 className="post-title">{post.Title}</h1>
          <p className="date">
            <strong>Ngày đăng:</strong>{" "}
            {new Date(post.createdAt).toLocaleString()}
          </p>

          {/* Hiển thị hình ảnh bài viết nếu có */}
          {post.Image && post.Image.length > 0 && (
            <div className="image-container">
              <Carousel
                autoplaySpeed={2000}
                autoplay={true} // Tốc độ tự động chuyển slide
              >
                {post.Image.map((img, index) => (
                  <div key={index}>
                    <img
                      src={`http://localhost:1337${img.url}`}
                      alt={post.Title}
                      className="post-image"
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          )}
          {/* Hiển thị nội dung bài viết */}
          <p>
            <div className="post-content-p">
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {getFullImageUrl(post.Content)}
              </ReactMarkdown>
            </div>
          </p>
          <Link to="/post" className="back">
            Quay lại
          </Link>
        </div>

        {/* Tin liên quan bên phải */}
        <div className="related-posts">
          <h3>Tin liên quan</h3>
          {relatedPosts.map((relatedPost) => (
            <div key={relatedPost.id} className="related-post-item">
              <Link to={`/post/${relatedPost.id}`}>
                <img
                  src={`http://localhost:1337${relatedPost.Image[0]?.url}`}
                  alt={relatedPost.Title}
                  className="related-post-image"
                />
              </Link>
              <div className="related-post-title">
                <a href={`/post/${relatedPost.id}`}>{relatedPost.Title}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={scrollToTop} className="scroll-to-top-btn">
        ↑
      </button>
    </div>
  );
};

export default PostDetail;
