import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Spin } from "antd";

const SubmenuPage = () => {
  const { menuSlug, subMenuSlug } = useParams(); // Lấy menuSlug và subMenuSlug từ URL
  const [submenu, setSubmenu] = useState(null); // Lưu submenu được chọn
  const [firstArticle, setFirstArticle] = useState(null); // Lưu bài viết đầu tiên
  const [loading, setLoading] = useState(true);

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
          if (articleIds.length > 0) {
            // Gọi API lấy các bài viết
            const articleRequests = articleIds.map((articleId) =>
              axios.get(`http://localhost:1337/articles/${articleId.id}`)
            );

            // Chờ tất cả các yêu cầu lấy bài viết hoàn thành
            const articlesResponse = await Promise.all(articleRequests);

            // Sắp xếp bài viết theo ngày tạo (giảm dần)
            const sortedArticles = articlesResponse
              .map((response) => response.data)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Lấy bài viết đầu tiên
            setFirstArticle(sortedArticles[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching submenu data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmenuData();
  }, [subMenuSlug]); // Chạy lại khi subMenuSlug thay đổi

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
    return <div>Submenu not found</div>;
  }

  if (!firstArticle) {
    return <div>No articles found for this submenu</div>;
  }

  return (
    <div>
      <h2 style={{ textAlign: "center", margin: "20px 20px" }}>
        {firstArticle.title}
      </h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          margin: "20px 20px",
        }}
      >
        <p>{firstArticle.content}</p>
      </div>
    </div>
  );
};

export default SubmenuPage;
