import React, { useState, useEffect } from "react";
import axios from "axios";
import { UseApp } from "./context/AppProvider";

const MenuForm = ({ menu, closeForm }) => {
  const [menus, setMenus] = useState([]);
  const [menuName, setMenuName] = useState("");
  const [menuSlug, setMenuSlug] = useState("");
  const { setReloadHeader } = UseApp();

  useEffect(() => {
    if (menu) {
      setMenuName(menu.menu);
      setMenuSlug(menu.menuSlug);
    }
  }, [menu]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (menu) {
        // Cập nhật menu
        response = await axios.put(`http://localhost:1337/menus/${menu.id}`, {
          menu: menuName,
          menuSlug,
        });
        alert("Cập nhật thành công");
        setReloadHeader(true);
        // setMenus((prevMenus) =>
        //   prevMenus.map((item) =>
        //     item.id === menu.id ? { ...item, ...response.data } : item
        //   )
        // );
      } else {
        // Tạo mới menu
        await axios.post("http://localhost:1337/menus", {
          menu: menuName,
          menuSlug,
        });
        alert("Tạo thành công");

        // setMenus((prevMenus) => [...prevMenus, response.data]);
      }
      setMenuName("");
      setMenuSlug("");
      setReloadHeader(true);
      closeForm();
    } catch (error) {
      console.error("Error saving menu", error);
      alert("Error saving menu");
    }
  };

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

  const inputStyle = {
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
        <label htmlFor="menuName">Tên menu</label>
        <input
          id="menuName"
          type="text"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          required
          style={inputStyle}
        />
      </div>
      <div>
        <label htmlFor="menuSlug">Menu Slug</label>
        <input
          id="menuSlug"
          type="text"
          value={menuSlug}
          onChange={(e) => setMenuSlug(e.target.value)}
          required
          style={inputStyle}
        />
      </div>
      <button
        type="submit"
        style={buttonStyle}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
      >
        {menu ? "Cập nhật" : "Tạo"}
      </button>
    </form>
  );
};

export default MenuForm;
