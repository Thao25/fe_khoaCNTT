import React, { useState, useEffect } from "react";
import axios from "axios";
import MyEditor from "../pages/editor";
import { Upload, Button, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
const ArticleForm = ({
  menus,
  closeForm,
  article = null,
  isSubmenu = false,
  currentMenu = "",
  currentSubmenu = "",
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(currentMenu || "");
  const [selectedSubmenu, setSelectedSubmenu] = useState(currentSubmenu || "");
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content);
      // const selectedMenuItem = menus.find((menu) => menu.id === article.menu);
      // setSelectedMenu(selectedMenuItem ? selectedMenuItem.id : "");

      setSelectedMenu("");
      setSelectedSubmenu("");

      // Nếu bài viết có thuộc menu
      const selectedMenuItem = menus.find((menu) => menu.id === article.menu);

      // Nếu bài viết thuộc menu chính (không thuộc submenu nào)
      if (selectedMenuItem && !article.submenu) {
        setSelectedMenu(selectedMenuItem.id); // Chọn menu
      }

      // Kiểm tra xem bài viết có thuộc submenu không
      menus.forEach((menu) => {
        menu.submenus.forEach((submenu) => {
          if (submenu.articles.includes(article.id)) {
            // Bài viết thuộc submenu này
            setSelectedMenu(menu.id); // Chọn menu
            setSelectedSubmenu(submenu.id); // Chọn submenu
          }
        });
      });
      if (article.image && typeof article.image === "object") {
        // Nếu article.image là đối tượng, thêm vào fileList
        setFileList([
          {
            url: `http://localhost:1337${article.image.url}`,
            uid: article.image._id, // sử dụng _id làm uid
          },
        ]);
      } else {
        // Nếu không có ảnh hoặc không phải là đối tượng, reset fileList
        setFileList([]);
      }
    }
  }, [article, currentMenu, currentSubmenu, menus]);

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList); // Cập nhật fileList khi người dùng chọn ảnh
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Chọn menu hoặc submenu là target
    const target = selectedSubmenu || selectedMenu;
    if (!target) {
      alert("Hãy chọn menu hoặc submenu.");
      return;
    }

    // Cập nhật trạng thái loading
    setLoading(true);
    const formData = new FormData();
    const requestData = {
      title,
      content,
      submenus: selectedSubmenu ? [selectedSubmenu] : [],
      menu: selectedSubmenu ? selectedMenu : selectedMenu,
    };

    formData.append("data", JSON.stringify(requestData));
    // const formData = new FormData();
    // formData.append("title", title);
    // formData.append("content", content);
    // formData.append("menu", selectedSubmenu ? null : selectedMenu);
    // formData.append("submenus", selectedSubmenu ? [selectedSubmenu] : []);

    // Nếu có ảnh, thêm vào formData
    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("files.image", file.originFileObj);
      }
    });

    try {
      if (article) {
        // Nếu là sửa bài viết
        await axios.put(
          `http://localhost:1337/articles/${article.id}`,
          // requestData
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Cập nhật thành công!");
      } else {
        // Nếu là tạo bài viết mới
        await axios.post("http://localhost:1337/articles", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Tạo thành công!");
      }

      // Reset form sau khi thành công
      setTitle("");
      setContent("");
      setSelectedMenu("");
      setSelectedSubmenu("");
      setFileList([]);
      closeForm();
    } catch (error) {
      console.error("Error creating/updating article:", error);
      alert("Error creating/updating article: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    width: "950px",
    padding: "20px",
    backgroundColor: "#edf1fd",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    margin: "0 auto",
  };

  const inputStyle = {
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
  };

  const selectStyle = {
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
  };

  const buttonStyle = {
    padding: "10px 15px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: "#45a049", // Color khi hover
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div>
        <label htmlFor="title">Tiêu đề </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="content">Nội dung </label>
        <MyEditor
          value={content}
          onChange={(newContent) => setContent(newContent)}
          style={{ marginBottom: "10px" }}
        />
      </div>

      <div>
        <label htmlFor="menu">Menu </label>
        <select
          id="menu"
          value={selectedMenu}
          onChange={(e) => {
            setSelectedMenu(e.target.value);
            setSelectedSubmenu("");
          }}
          required
          style={selectStyle}
        >
          <option value="">Chọn menu</option>
          {menus.map((menu) => (
            <option key={menu.id} value={menu.id}>
              {menu.menu}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="submenu">Submenu </label>
        <select
          id="submenu"
          value={selectedSubmenu}
          onChange={(e) => setSelectedSubmenu(e.target.value)}
          style={selectStyle}
        >
          <option value="">Chọn submenu</option>
          {selectedMenu &&
            menus
              .find((menu) => menu.id === selectedMenu)
              ?.submenus.map((submenu) => (
                <option key={submenu.id} value={submenu.id}>
                  {submenu.subMenu}
                </option>
              ))}
        </select>
      </div>
      <div>
        <label htmlFor="image">Chọn ảnh</label>
        <Upload
          listType="picture"
          fileList={fileList}
          onChange={handleImageChange}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
      </div>
      <button
        type="submit"
        style={buttonStyle}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
        disabled={loading}
      >
        {loading ? "Đang tạo..." : article ? "Cập nhật" : "Tạo"}
      </button>
    </form>
  );
};

export default ArticleForm;
