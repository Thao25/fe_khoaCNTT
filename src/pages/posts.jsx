import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spin, Pagination } from "antd"; // Import Pagination từ antd
import { Link } from "react-router-dom";
import "../css/post.css";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const postsPerPage = 5; // Số bài viết hiển thị trên mỗi trang

  useEffect(() => {
    axios
      .get("http://localhost:1337/posts")
      .then((response) => {
        // Sắp xếp bài viết theo ngày đăng giảm dần
        const sortedPosts = response.data.sort(
          (a, b) => new Date(b.published_at) - new Date(a.published_at)
        );
        setPosts(sortedPosts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spin />;
  }

  // Tính toán các bài viết cần hiển thị trên trang hiện tại
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Hàm chuyển trang
  const onPageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  // Tính tổng số trang
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const removeImagesFromContent = (content) => {
    // Dùng regex để tìm và loại bỏ tất cả thẻ <img>
    const contentWithoutImages = content.replace(/<img[^>]*>/g, "");
    return contentWithoutImages;
  };
  return (
    <div className="posts-container">
      {/* Danh sách tất cả các bài viết (Bên trái) */}
      <div className="main">
        <h2 className="section-title">Danh sách bài viết</h2>
        {currentPosts.map((post) => (
          <div key={post.id} className="post-item">
            <div className="left">
              <div className="post-image-container">
                <Link to={`/post/${post.id}`}>
                  <img
                    src={`http://localhost:1337${post.Image[0].url}`}
                    alt={post.Title}
                    className="post-image"
                  />
                </Link>
              </div>
              <div className="post-content">
                <h3 className="post-title">
                  <Link to={`/post/${post.id}`}>{post.Title}</Link>
                </h3>
                <div className="post-date">
                  {new Date(post.createdAt).toLocaleString()}
                </div>
                <p className="post-preview">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: removeImagesFromContent(
                        post.Content.length > 200
                          ? `${post.Content.substring(0, 200)}...`
                          : post.Content
                      ),
                    }}
                  />
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Phân trang với Ant Design */}
        <Pagination
          current={currentPage} // Hiển thị trang hiện tại
          total={posts.length} // Tổng số bài viết
          pageSize={postsPerPage} // Số bài viết mỗi trang
          onChange={onPageChange} // Gọi hàm thay đổi trang khi nhấn nút
          showSizeChanger={false} // Ẩn lựa chọn số lượng bài viết trên mỗi trang
          showQuickJumper={true} // Cho phép nhảy nhanh đến trang
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        />
      </div>

      {/* Tin mới nhất (Bên phải) */}
      <div className="right">
        <h2 className="section-title">Tin mới nhất</h2>
        {posts.slice(0, 5).map((post) => (
          <div key={post.id} className="latest-post-item">
            <Link to={`/post/${post.id}`}>
              <img
                src={`http://localhost:1337${post.Image[0].url}`}
                alt={post.Title}
                className="latest-post-image"
              />
            </Link>
            <div className="latest-post-title">
              <Link to={`/post/${post.id}`}>{post.Title}</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
