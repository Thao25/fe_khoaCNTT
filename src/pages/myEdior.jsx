import React, { useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import axios from "axios";
import { message } from "antd";
import { quillTable } from "quill-table";
const Mditor = ({ value, onChange }) => {
  const quillRef = useRef(null); // Khởi tạo ref cho Quill instance

  // Modules của ReactQuill, bao gồm cả toolbar
  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ fontsize: [] }],
      {
        imageResize: {
          parchment: Quill.import("parchment"),
          modules: ["Resize", "DisplaySize", "Toolbar"],
        },
      }[{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ align: [] }],
      ["link", "image"],
      ["blockquote", "code-block"],
      ["table"],
    ],
    table: quillTable,
  };

  // Handler cho việc tải ảnh lên
  const imageHandler = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Upload file lên Strapi
      const formData = new FormData();
      formData.append("files", file);

      try {
        const response = await axios.post(
          "http://localhost:1337/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Lấy URL ảnh từ response của Strapi
        const imageUrl = response.data[0].url;

        // Kiểm tra xem URL ảnh có đầy đủ tên miền hay không
        const baseUrl = "http://localhost:1337"; // Cập nhật với địa chỉ server của bạn
        const fullImageUrl = imageUrl.startsWith("http")
          ? imageUrl
          : `${baseUrl}${imageUrl}`;

        // Chèn URL ảnh vào vị trí hiện tại trong editor
        const range = quillRef.current.getEditor().getSelection(); // Lấy vị trí hiện tại trong editor
        quillRef.current
          .getEditor()
          .insertEmbed(range.index, "image", fullImageUrl); // Chèn ảnh vào vị trí
        const image = quillRef.current
          .getEditor()
          .container.querySelector("img:last-child");
        if (image) {
          image.classList.add("small-image"); // Thêm class 'small-image' vào ảnh
        }
      } catch (err) {
        console.error("Error uploading image", err);
        message.error("Không thể tải ảnh lên.");
      }
    };
    input.click(); // Mở dialog để người dùng chọn ảnh
  };

  // Sử dụng useEffect để thêm imageHandler vào module khi component được mount
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const toolbar = editor.getModule("toolbar");
      toolbar.addHandler("image", imageHandler); // Đăng ký handler cho "image"
    }
  }, []);

  // Cập nhật content khi có thay đổi trong editor
  const handleEditorChange = (content) => {
    onChange(content); // Gọi onChange để cập nhật giá trị
  };

  return (
    <ReactQuill
      ref={quillRef} // Gán ref vào ReactQuill
      value={value}
      onChange={handleEditorChange} // Cập nhật giá trị khi thay đổi nội dung
      modules={modules}
    />
  );
};

export default Mditor;
