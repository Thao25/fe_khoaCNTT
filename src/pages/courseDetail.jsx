import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Spin, message, Card, Button } from "antd";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { AuthContext } from "../components/context/auth.context.jsx";
import styles from "../css/courseDetail.module.css";
import {
  DownloadOutlined,
  EyeOutlined,
  LeftOutlined,
  RightOutlined,
  UploadOutlined,
  CloseOutlined,
} from "@ant-design/icons";

// Thiết lập workerSrc cho PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfFile, setPdfFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const { auth, setAuth, hasRole } = useContext(AuthContext);
  const [selectedFiles, setSelectedFiles] = useState([]);
  useEffect(() => {
    const fetchCourseDetail = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/courses/${id}`);
        console.log("Course data received:", res.data);
        if (res.status === 200 && res.data.data) {
          setCourse(res.data.data);
        } else {
          message.error("Không thể tải thông tin chi tiết khóa học!");
        }
      } catch (error) {
        console.error("Error fetching course detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [id]);

  const handleDownload = (fileUrl) => {
    const decodedUrl = decodeURIComponent(fileUrl);
    window.location.href = decodedUrl;
  };

  const handleFilePreview = (file) => {
    // Giải mã URL nếu có dấu %20 và các ký tự đặc biệt khác
    const decodedFile = file;

    // Kiểm tra xem file có phải là PDF không
    if (decodedFile.toLowerCase().endsWith(".pdf")) {
      setPdfFile(decodedFile); // Nếu là PDF, hiển thị file PDF
    } else {
      setPdfFile(null); // Nếu không phải là PDF, ẩn preview
    }
  };

  const getFileName = (filePath) => {
    // Lấy tên file từ chuỗi, bỏ phần mã số
    const fileName = filePath.split("-").slice(2).join("-"); // Lấy tên tài liệu sau dấu "-"
    console.log("Tên tài liệu:", fileName);
    console.log("decodedFileName", decodeURIComponent(fileName));
    return decodeURIComponent(fileName);
  };

  const getFileUrl = (filePath) => {
    // Nếu filePath đã có đầy đủ URL, chỉ cần lấy phần sau "localhost:8080/"
    const fileName = filePath.split("/uploads/courses/documents/")[1];
    console.log("fileName", fileName);
    console.log(
      "URL tài liệu:",
      `http://localhost:8080/uploads/courses/documents/${encodeURIComponent(
        fileName
      )}`
    );
    return `http://localhost:8080/uploads/courses/documents/${encodeURIComponent(
      fileName
    )}`;
  };
  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]); // Thêm các file mới vào danh sách đã chọn
  };

  const handleFileUpload = async (files, courseId) => {
    if (files.length === 0) {
      message.error("Vui lòng chọn ít nhất một tài liệu để tải lên.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const encodedFileName = encodeURIComponent(file.name); // Mã hóa tên file
      console.log("Encoded file name for upload:", encodedFileName);
      const fileWithEncodedName = new File([file], encodedFileName, {
        type: file.type,
      });
      formData.append("documents", fileWithEncodedName); // Thêm tài liệu vào formData
    }

    try {
      const res = await axios.post(
        `http://localhost:8080/courses/documents/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Đảm bảo gửi kiểu dữ liệu file

            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (res.status === 200) {
        setSelectedFiles([]);
        setCourse(res.data.course);
        message.success("Tải lên tài liệu thành công!");
      } else {
        message.error("Đã xảy ra lỗi khi tải lên tài liệu.");
      }
    } catch (error) {
      message.error("Lỗi kết nối. Vui lòng thử lại.");
    }
  };
  const handleRemoveFile = (fileToRemove) => {
    setSelectedFiles(
      (prevFiles) => prevFiles.filter((file) => file !== fileToRemove) // Lọc bỏ file đã xóa khỏi danh sách
    );
  };

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
        <Spin size="large" />
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className={styles.courseDetailContainer}>
      <div className={styles.courseImageContainer}>
        <img
          className={styles.courseImage}
          alt={course.name}
          src={course.image}
        />
      </div>

      <h1>{course.name}</h1>
      <h3
        style={{
          marginTop: "20px",
          marginLeft: "30px",
          marginRight: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Giới thiệu:
      </h3>
      <p className={styles.courseDescription}>{course.description}</p>

      {course.documents && course.documents.length > 0 && (
        <>
          <h3
            style={{
              marginTop: "20px",
              marginLeft: "30px",
              marginRight: "30px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Tài liệu:
          </h3>

          <ul>
            {course.documents.map((item, index) => {
              const fileName = getFileName(item);
              const fileUrl = getFileUrl(item);

              return (
                <li key={index}>
                  <span style={{ marginLeft: 30, fontWeight: "bold" }}>
                    {fileName}
                  </span>
                  {/* Hiển thị nút Xem trước chỉ nếu là PDF */}
                  {item.toLowerCase().endsWith(".pdf") && (
                    <Button
                      icon={<EyeOutlined />}
                      onClick={() => handleFilePreview(fileUrl)}
                      style={{
                        marginRight: 30,
                        backgroundColor: "#fff", // Màu nền xanh lá
                        color: "#f44336", // Màu chữ trắng
                        borderColor: "#f44336", // Màu viền giống màu nền
                        borderRadius: "5px", // Bo góc nếu cần
                        padding: "8px 16px", // Cân chỉnh khoảng cách giữa chữ và viền
                        fontSize: "16px", // Chỉnh kích thước chữ
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Thêm bóng cho nút
                      }}
                    >
                      Xem trước
                    </Button>
                  )}
                  {/* Hiển thị nút Tải về nếu không phải là PDF */}
                  {!item.toLowerCase().endsWith(".pdf") && (
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(fileUrl)}
                      style={{
                        marginRight: 50,
                        backgroundColor: "#4CAF50", // Màu nền xanh lá
                        color: "#fff", // Màu chữ trắng
                        borderColor: "#4CAF50", // Màu viền giống màu nền
                        borderRadius: "5px", // Bo góc nếu cần
                        padding: "8px 16px", // Cân chỉnh khoảng cách giữa chữ và viền
                        fontSize: "16px", // Chỉnh kích thước chữ
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Thêm bóng cho nút
                      }}
                    >
                      Tải về
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
      {hasRole(["admin", "lecturer"]) && auth.isAuthenticated && (
        <div
          style={{
            display: "flex", // Sử dụng Flexbox để căn chỉnh input và button sát nhau
            alignItems: "center", // Căn giữa theo chiều dọc
          }}
        >
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => handleFileUpload(selectedFiles, course.id)}
            style={{
              marginTop: "20px",
              marginBottom: "10px",
              marginLeft: "50px", // Khoảng cách nhỏ giữa nút và input
            }}
          >
            Thêm tài liệu
          </Button>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            style={{
              marginTop: "20px",
              marginBottom: "10px",
              marginLeft: "10px",
              padding: "5px",
            }}
          />
        </div>
      )}
      {selectedFiles.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {selectedFiles.map((file, index) => (
              <li
                key={index}
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  marginLeft: "50px",
                  marginRight: "50px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#f0f8ff",
                  width: 500,
                  borderRadius: "6px",
                  gap: "5px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <span style={{ marginLeft: "20px" }}>{file.name}</span>
                <Button
                  type="danger"
                  icon={<CloseOutlined />}
                  onClick={() => handleRemoveFile(file)}
                  style={{ marginLeft: "10px" }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Hiển thị phần preview PDF nếu có file pdf được chọn */}
      {pdfFile && (
        <div className={styles.pdfPreview}>
          <div className={styles.pdfControls}>
            <div className={styles.paginationControls}>
              <Button
                icon={<LeftOutlined />}
                onClick={goToPreviousPage}
                disabled={pageNumber <= 1}
              ></Button>
              <span>{`Trang ${pageNumber} của ${numPages}`}</span>
              <Button
                icon={<RightOutlined />}
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
              ></Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(pdfFile)}
                style={{ marginTop: 10, color: "#28a745" }}
              >
                Tải về
              </Button>
            </div>
            <div className={styles.pdfContainer}>
              <Document
                file={pdfFile}
                onLoadSuccess={onLoadSuccess}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              >
                <Page pageNumber={pageNumber} />
              </Document>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
