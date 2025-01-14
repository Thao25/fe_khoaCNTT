import React, { useState, useEffect } from "react";
import axios from "axios";
import { UseApp } from "./context/AppProvider";
const SubmenuForm = ({ menus, closeForm, submenu }) => {
  // Các state để lưu thông tin submenu
  const [subMenu, setSubMenu] = useState(""); // Tên submenu
  const [subMenuSlug, setSubMenuSlug] = useState(""); // Slug của submenu
  const [selectedMenu, setSelectedMenu] = useState(""); // Menu đã chọn
  const [loading, setLoading] = useState(false); // Biến loading để hiển thị trạng thái tạo submenu
  const { setReloadHeader } = UseApp();
  // Nếu đang chỉnh sửa submenu, điền thông tin vào các trường
  useEffect(() => {
    if (submenu) {
      setSubMenu(submenu.subMenu);
      setSubMenuSlug(submenu.subMenuSlug);

      const foundMenu = menus.find((menu) => menus.includes(menu.id));

      // Nếu tìm thấy menu liên quan, chọn menu đó
      if (foundMenu) {
        setSelectedMenu(foundMenu.id);
      } else {
        setSelectedMenu("");
      }
    }
  }, [submenu, menus]);
  useEffect(() => {
    if (submenu && menus.length > 0) {
      setSelectedMenu(submenu.menus?.[0]?.id || ""); // Cập nhật selectedMenu khi menus được tải
    }
  }, [menus, submenu]);
  // Xử lý sự kiện submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường đầu vào
    if (!selectedMenu || !subMenu || !subMenuSlug) {
      alert("Vui lòng điền đủ thông tin.");
      return;
    }

    setLoading(true); // Đặt trạng thái loading là true khi bắt đầu tạo submenu

    try {
      const data = {
        subMenu,
        subMenuSlug,
        menus: [selectedMenu], // Liên kết với menu đã chọn (ID menu dưới dạng mảng)
      };

      // Nếu submenu đã có (đang chỉnh sửa), gửi yêu cầu PUT
      if (submenu) {
        const response = await axios.put(
          `http://localhost:1337/submenus/${submenu.id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json", // Đảm bảo gửi dưới dạng JSON
            },
          }
        );
        alert("Cập nhật thành công");
        // setSubMenu((prevSubmenus) =>
        //   prevSubmenus.map((item) =>
        //     item.id === submenu.id ? { ...item, ...response.data } : item
        //   )
        // );
        setReloadHeader(true);
      } else {
        // Nếu không có submenu (tạo mới), gửi yêu cầu POST
        const response = await axios.post(
          "http://localhost:1337/submenus",
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        alert("Tạo thành công");
        setReloadHeader(true);
        // setSubMenu((prevSubmenus) => [...prevSubmenus, response.data]);
      }

      // Reset form sau khi thành công
      setSubMenu("");
      setSubMenuSlug("");
      setSelectedMenu("");
      closeForm(); // Đóng form sau khi hoàn thành
    } catch (error) {
      console.error("Error saving submenu", error);
      alert(
        "Error saving submenu: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false); // Đặt trạng thái loading về false khi đã hoàn thành
    }
  };
  // Style cho form
  const formStyle = {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    padding: "20px",
    backgroundColor: "#edf1fd",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    margin: "0 auto",
  };

  // Style cho input
  const inputStyle = {
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
  };

  // Style cho select (menu)
  const selectStyle = {
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
  };

  // Style cho button
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
    <div>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label htmlFor="subMenu">Tên Submenu</label>
          <input
            id="subMenu"
            type="text"
            value={subMenu}
            onChange={(e) => setSubMenu(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="subMenuSlug">Submenu Slug</label>
          <input
            id="subMenuSlug"
            type="text"
            value={subMenuSlug}
            onChange={(e) => setSubMenuSlug(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="menuSelect">Menu </label>
          <select
            id="menuSelect"
            value={selectedMenu}
            onChange={(e) => setSelectedMenu(e.target.value)}
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
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
        >
          {loading ? "Đang tạo..." : submenu ? "Cập nhật" : "Tạo"}
        </button>
      </form>
    </div>
  );
};

export default SubmenuForm;
