import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Spin } from "antd";
import "../css/article.css";
const MenuPage = () => {
  const { menuSlug } = useParams(); // Lấy menuSlug từ URL
  const [menuData, setMenuData] = useState(null);
  const [firstArticle, setFirstArticle] = useState(null); // Lưu bài viết đầu tiên
  const [loading, setLoading] = useState(true);

  // Hàm gọi API lấy tất cả menus và tìm menu theo menuSlug
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        // Lấy danh sách tất cả menu
        const response = await axios.get(`http://localhost:1337/menus`);
        // Tìm menu có menuSlug trùng với menuSlug trong URL
        const menu = response.data.find((menu) => menu.menuSlug === menuSlug);

        if (menu) {
          setMenuData(menu); // Lưu dữ liệu menu vào state

          // Kiểm tra xem menu có Articles hay không
          if (menu.articles && menu.articles.length > 0) {
            let sortedArticles = [];
            if (menuSlug === "about") {
              // Sắp xếp từ cũ nhất đến mới nhất khi menuSlug là "lecturer"
              sortedArticles = menu.articles.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
              );
            } else {
              // Sắp xếp từ mới nhất đến cũ nhất với các menuSlug khác
              sortedArticles = menu.articles.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );
            }

            const firstArticle = sortedArticles[0]; // Bài viết đầu tiên
            const articleResponse = await axios.get(
              `http://localhost:1337/articles/${firstArticle.id}`
            );
            setFirstArticle(articleResponse.data); // Lưu bài viết vào state
          } else if (menu.submenus && menu.submenus.length > 0) {
            // Nếu menu không có Articles, lấy bài viết đầu tiên của submenu đầu tiên
            const firstSubmenu = menu.submenus[0]; // Lấy submenu đầu tiên
            if (firstSubmenu.articles && firstSubmenu.articles.length > 0) {
              const firstSubmenuArticle = firstSubmenu.articles[0]; // Bài viết đầu tiên của submenu
              const articleResponse = await axios.get(
                `http://localhost:1337/articles/${firstSubmenuArticle}`
              );
              setFirstArticle(articleResponse.data); // Lưu bài viết vào state
            }
          }
        } else {
          console.error("Menu not found");
        }
      } catch (error) {
        console.error("Error fetching menu data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [menuSlug]); // Chạy lại khi menuSlug thay đổi

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

  if (!menuData) {
    return <div>Menu not found</div>;
  }

  return (
    <div className="article-container">
      <div style={{ display: "flex" }}>
        {/* Hiển thị submenu bên trái nếu có */}
        {menuData.submenus && menuData.submenus.length > 0 ? (
          <div style={{ flex: 1, padding: "10px" }}>
            <h2
              style={{
                margin: "20px auto",
                display: "flex",
                color: "#d32f2f",
                fontSize: "22pt",
                fontWeight: "bold",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {menuData.menu}
            </h2>
            <ul>
              {menuData.submenus.map((submenu) => (
                <li
                  key={submenu.id}
                  style={{
                    marginBottom: "10px",
                    marginLeft: "10px",
                    Width: "100%",
                  }}
                >
                  <Link
                    to={`/${menuSlug}/submenu/${submenu.subMenuSlug}`}
                    style={{
                      color: "#333",
                      textDecoration: "none",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    {submenu.subMenu}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div
          style={{
            flex: menuData.submenus && menuData.submenus.length > 0 ? 4 : 1,
            Width: "900px",
            margin: "0 auto",
            backgroundColor: "aliceblue",
          }}
          className="article-container"
        >
          {firstArticle ? (
            <div className="article-page">
              <div className="article-content">
                <div className="article-title">{firstArticle.title}</div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: firstArticle.content,
                  }}
                  className="article-content"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default MenuPage;
