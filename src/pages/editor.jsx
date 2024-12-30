import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { message } from "antd";
import axios from "axios";

const MyEditor = ({ value, onChange }) => {
  const [editorContent, setEditorContent] = useState(value || ""); // Trạng thái lưu trữ nội dung editor
  const editorRef = useRef(null);

  // Xử lý sự kiện thay đổi nội dung của editor
  const handleEditorChange = (content) => {
    setEditorContent(content); // Cập nhật nội dung vào state
    onChange(content); // Cập nhật giá trị cho parent component (nếu cần)
  };

  // Xử lý việc tải ảnh lên
  const imageHandler = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*"; // Chỉ cho phép chọn ảnh
    input.onchange = async (e) => {
      const file = e.target.files[0]; // Lấy tệp người dùng chọn
      if (!file) return;

      const formData = new FormData();
      formData.append("files", file); // Thêm tệp vào FormData

      try {
        // Gửi tệp lên server
        const response = await axios.post(
          "http://localhost:1337/upload", // Đảm bảo URL đúng với backend của bạn
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        // Kiểm tra xem phản hồi có chứa URL ảnh hợp lệ không
        if (response.data && response.data[0] && response.data[0].url) {
          const imageUrl = response.data[0].url;
          const fullImageUrl = `http://localhost:1337${imageUrl}`; // Thêm URL đầy đủ

          // Chèn ảnh vào TinyMCE
          if (editorRef.current) {
            editorRef.current.editor.insertContent(
              `<img src="${fullImageUrl}" alt="Uploaded Image" />`
            );
          }
        } else {
          message.error("Không thể lấy URL ảnh từ server.");
        }
      } catch (err) {
        console.error("Error uploading image", err);
        message.error("Không thể tải ảnh lên.");
      }
    };
    input.click(); // Mở hộp thoại chọn file
  };

  // Cấu hình TinyMCE
  const tinymceConfig = {
    apiKey: "3szrivu51iezjw4mluiqf0utbl8dezfyofk0jsh52b5ddevk", // Thêm API key nếu cần thiết
    toolbar: [
      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
    ],
    plugins: [
      "anchor",
      "autolink",
      "charmap",
      "codesample",
      "emoticons",
      "image",
      "link",
      "lists",
      "media",
      "searchreplace",
      "table",
      "visualblocks",
      "wordcount",
    ], // Các plugin yêu cầu
    menubar: true,
    setup: (editor) => {
      editor.ui.registry.addButton("customImageButton", {
        text: "Insert Image", // Tạo nút chèn ảnh
        onAction: imageHandler, // Đăng ký hàm tải ảnh lên
      });
    },
    value: editorContent, // Cập nhật nội dung editor
  };

  // Kiểm tra khi gửi form xem người dùng đã nhập nội dung chưa

  useEffect(() => {
    setEditorContent(value); // Cập nhật lại khi prop 'value' thay đổi từ parent component
  }, [value]);

  return (
    <div>
      <Editor
        onEditorChange={handleEditorChange}
        value={editorContent}
        init={tinymceConfig}
        apiKey="3szrivu51iezjw4mluiqf0utbl8dezfyofk0jsh52b5ddevk" // Nếu sử dụng TinyMCE Cloud
        ref={editorRef}
      />
    </div>
  );
};

export default MyEditor;
