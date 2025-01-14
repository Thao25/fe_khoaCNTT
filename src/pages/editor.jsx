import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { message } from "antd";
import axios from "axios";

const MyEditor = ({ value, onChange }) => {
  const [editorContent, setEditorContent] = useState(value || "");
  const editorRef = useRef(null);

  // Xử lý sự kiện thay đổi nội dung của editor
  const handleEditorChange = (content) => {
    setEditorContent(content);
    onChange(content);
  };

  // Cấu hình TinyMCE
  const tinymceConfig = {
    apiKey: "3szrivu51iezjw4mluiqf0utbl8dezfyofk0jsh52b5ddevk",
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
    image_title: true,
    automatic_uploads: true,
    file_picker_types: "image media link file", // Chấp nhận thêm các tệp tin (Word, PDF, Excel, link)
    file_picker_callback: async (callback, value, meta) => {
      // Kiểm tra loại file được chọn
      if (meta.filetype === "image") {
        // Xử lý tải ảnh
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async function () {
          const file = input.files[0];
          if (file) {
            const formData = new FormData();
            formData.append("files", file);

            try {
              // Tải ảnh lên server
              const response = await axios.post(
                "http://localhost:1337/upload",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
              );

              if (response.data && response.data[0] && response.data[0].url) {
                const imageUrl = `http://localhost:1337${response.data[0].url}`;

                // Gọi callback để chèn ảnh vào editor
                callback(imageUrl, { alt: "Uploaded Image" });
              } else {
                message.error("Không thể tải ảnh lên.");
              }
            } catch (error) {
              console.error("Error uploading image", error);
              message.error("Không thể tải ảnh lên.");
            }
          }
        };
        input.click(); // Mở hộp thoại chọn file
      } else if (meta.filetype === "file") {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".pdf,.doc,.docx,.xls,.xlsx";
        input.onchange = async function () {
          const file = input.files[0];
          if (file) {
            const formData = new FormData();
            formData.append("files", file);

            try {
              // Tải tệp tin lên server
              const response = await axios.post(
                "http://localhost:1337/upload",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
              );

              if (response.data && response.data[0] && response.data[0].url) {
                const fileUrl = `http://localhost:1337${response.data[0].url}`;

                // Gọi callback để chèn tệp tin vào editor
                callback(fileUrl, { text: file.name });
              } else {
                message.error("Không thể tải tệp tin lên.");
              }
            } catch (error) {
              console.error("Error uploading file", error);
              message.error("Không thể tải tệp tin lên.");
            }
          }
        };
        input.click(); // Mở hộp thoại chọn file
      } else if (meta.filetype === "link") {
        // Xử lý liên kết (URL)
        const url = prompt("Nhập URL của liên kết:");
        if (url) {
          // Gọi callback để chèn URL vào editor
          callback(url);
        }
      }
    },
    value: editorContent, // Cập nhật nội dung editor
  };

  // Kiểm tra khi gửi form xem người dùng đã nhập nội dung chưa
  useEffect(() => {
    setEditorContent(value);
  }, [value]);

  return (
    <div>
      <Editor
        onEditorChange={handleEditorChange}
        value={editorContent}
        init={tinymceConfig}
        apiKey="3szrivu51iezjw4mluiqf0utbl8dezfyofk0jsh52b5ddevk"
        ref={editorRef}
      />
    </div>
  );
};

export default MyEditor;
