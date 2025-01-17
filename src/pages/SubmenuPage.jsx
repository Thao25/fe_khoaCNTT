import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Spin } from "antd";
import "../css/danh-sach-giang-vien.css";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";

const SubmenuPage = () => {
  const { menuSlug, subMenuSlug } = useParams(); // Lấy menuSlug và subMenuSlug từ URL
  const [submenu, setSubmenu] = useState(null); // Lưu submenu được chọn
  const [articles, setArticles] = useState([]); // Lưu danh sách bài viết
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const articlesPerPage = 8;

  // Lấy danh sách tất cả submenu từ API
  useEffect(() => {
    const fetchSubmenuData = async () => {
      try {
        // Gọi API để lấy tất cả submenus
        const submenuResponse = await axios.get(
          "http://localhost:1337/submenus"
        );

        // Tìm submenu theo subMenuSlug từ URL
        const foundSubmenu = submenuResponse.data.find(
          (submenu) => submenu.subMenuSlug === subMenuSlug
        );

        if (foundSubmenu) {
          setSubmenu(foundSubmenu);

          // Lấy danh sách bài viết liên kết với submenu này
          const articleIds = foundSubmenu.articles; // Đây là mảng các ID bài viết liên quan đến submenu
          if (articleIds && articleIds.length > 0) {
            // Gọi API lấy các bài viết
            const articleRequests = articleIds.map((articleId) =>
              axios.get(`http://localhost:1337/articles/${articleId.id}`)
            );

            // Chờ tất cả các yêu cầu lấy bài viết hoàn thành
            const articlesResponse = await Promise.all(articleRequests);

            const sortedArticles = articlesResponse
              .map((response) => response.data)
              .sort((a, b) => {
                // Sắp xếp theo từ mới đến cũ (mặc định)
                return new Date(b.createdAt) - new Date(a.createdAt);
              });

            setArticles(sortedArticles);
            setTotalPages(Math.ceil(sortedArticles.length / articlesPerPage));
          }
        }
      } catch (error) {
        console.error("Error fetching submenu data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmenuData();
  }, [subMenuSlug]);

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Spin />
      </div>
    );
  }

  if (!submenu) {
    return null;
  }

  const isGiangVien = subMenuSlug === "danh-sach-giang-vien";
  const isSingleArticle = articles.length === 1;
  const getCurrentArticles = () => {
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    return articles.slice(indexOfFirstArticle, indexOfLastArticle);
  };

  // Hàm điều hướng trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const removeImagesFromContent = (content) => {
    // Dùng regex để tìm và loại bỏ tất cả thẻ <img>
    const contentWithoutImages = content.replace(/<img[^>]*>/g, "");
    return contentWithoutImages;
  };
  return (
    <div className={`article-container ${isGiangVien ? "dsgv-page" : ""}`}>
      <div className="article-page">
        {isSingleArticle ? (
          // Nếu chỉ có 1 bài viết
          <div className="article">
            <div className="article-title">{articles[0].title}</div>
            <div
              dangerouslySetInnerHTML={{
                __html: articles[0].content,
              }}
              className="article-content"
            />
          </div>
        ) : (
          // Nếu có nhiều hơn 1 bài viết
          <div className="articles-list">
            {articles.map((article, index) => (
              <div
                key={article.id}
                className={`article-item ${
                  isGiangVien ? "giang-vien-item" : ""
                }`}
              >
                <div className="article-item-content">
                  <div className="article-thumbnail">
                    <img
                      src={
                        article.image?.url
                          ? `http://localhost:1337${article.image.url}`
                          : // : "https://via.placeholder.com/150"
                            "https://tuyensinh.actvn.edu.vn/wp-content/uploads/2024/03/42.jpg"
                      }
                      alt={article.title}
                      className="article-image"
                    />
                  </div>
                  <div className="article-title">
                    <Link
                      to={`/${menuSlug}/${submenu.subMenuSlug}/${article.id}`}
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <p
                        dangerouslySetInnerHTML={{
                          __html:
                            article.title.length > 45
                              ? `${article.title.substring(0, 45)}...`
                              : article.title,
                        }}
                        className="article-title"
                        style={{
                          textDecoration: "none",
                          fontSize: "14px",
                          color: " #007bff",
                          fontWeight: "bold",
                          margin: "0",
                          padding: "0",
                        }}
                      />
                    </Link>
                  </div>

                  {!isGiangVien ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: removeImagesFromContent(
                          article.content.length > 100
                            ? `${article.content.substring(0, 100)}...`
                            : article.content
                        ),
                      }}
                      className="article-content"
                      style={{
                        fontSize: "14px",
                        color: " #333",
                        fontWeight: "300",
                        margin: "0",
                        padding: "5px",
                      }}
                    />
                  ) : null}
                  {!isGiangVien ? (
                    <Link
                      to={`/${menuSlug}/${submenu.subMenuSlug}/${article.id}`}
                      className="view-detail"
                    >
                      Xem chi tiết
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
        {articles.length > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <LeftOutlined />
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <RightOutlined />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmenuPage;
