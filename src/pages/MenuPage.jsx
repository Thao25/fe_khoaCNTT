import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Spin } from "antd";

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
            // Lấy bài viết đầu tiên của menu theo ngày tạo
            const sortedArticles = menu.articles.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
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
                `http://localhost:1337/articles/${firstSubmenuArticle.id}`
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
    <div>
      <div style={{ display: "flex" }}>
        {/* Hiển thị submenu bên trái nếu có */}
        {menuData.submenus && menuData.submenus.length > 0 ? (
          <div style={{ flex: 1, padding: "20px" }}>
            <h2
              style={{
                marginBottom: "10px",
                display: "flex",
                justifyContent: "center",
                color: "#d32f2f",
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
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Link to={`/${menuSlug}/${submenu.subMenuSlug}`}>
                    {submenu.subMenu}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Hiển thị bài viết bên phải, nếu không có submenu thì chiếm toàn bộ màn hình */}
        <div
          style={{
            flex: menuData.submenus && menuData.submenus.length > 0 ? 4 : 1,
            padding: "20px",
          }}
        >
          {firstArticle ? (
            <div style={{ border: "1px solid #ccc", padding: "10px" }}>
              <h3>{firstArticle.title}</h3>
              <p>{firstArticle.content}</p>
            </div>
          ) : (
            <p>No articles available</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default MenuPage;
