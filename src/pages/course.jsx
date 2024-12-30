import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../components/context/auth.context";
import { Layout, Card, List, Spin, message, Button } from "antd";
import "../css/course.css";
import { Link } from "react-router-dom";
const { Content } = Layout;

const CoursePage = () => {
  const { setAuth } = useContext(AuthContext);
  const [apploading, setAppLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [expandedLevels, setExpandedLevels] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      setAppLoading(true);

      try {
        const res = await axios.get("http://localhost:8080/courses/all");
        if (res.status === 200 && res.data.data) {
          setCourses(res.data.data);
        } else {
          message.error("Không thể tải danh sách khóa học!");
        }
      } catch (error) {
        message.error("Lỗi khi tải danh sách khóa học!");
      } finally {
        setAppLoading(false);
      }
    };

    fetchCourses();
  }, [setAppLoading]);
  if (apploading) {
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
  const groupedCourses = courses.reduce((acc, course) => {
    const { level } = course;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(course);
    return acc;
  }, {});

  const toggleLevel = (level) => {
    setExpandedLevels((prevState) => ({
      ...prevState,
      [level]: !prevState[level],
    }));
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Hiệu ứng cuộn mượt mà
    });
  };

  /* CSS cho khi người dùng cuộn xuống */
  window.addEventListener("scroll", function () {
    const btn = document.querySelector(".scroll-to-top-btn");

    // Kiểm tra xem nút có tồn tại trong DOM không
    if (btn) {
      if (window.scrollY > 100) {
        // Thêm class 'show' khi cuộn xuống
        btn.classList.add("show");
      } else {
        // Loại bỏ class 'show' khi cuộn lên
        btn.classList.remove("show");
      }
    }
  });
  return (
    <Layout>
      <Content className="layout-content">
        <>
          {Object.keys(groupedCourses).map((level) => (
            <div key={level}>
              <div className="level-header">
                <h3>{level}</h3>
                {groupedCourses[level].length > 3 && (
                  <Button type="link" onClick={() => toggleLevel(level)}>
                    {expandedLevels[level] ? "Ẩn bớt" : "Hiển thị tất cả"}
                  </Button>
                )}
              </div>
              {groupedCourses[level].length === 0 ? (
                <p>Không có khóa học nào ở cấp độ này.</p>
              ) : (
                <>
                  <List
                    grid={{ gutter: 16, column: 3 }}
                    className={expandedLevels[level] ? "" : "list-item-limited"}
                    dataSource={
                      expandedLevels[level]
                        ? groupedCourses[level]
                        : groupedCourses[level].slice(0, 3)
                    }
                    renderItem={(course) => (
                      <List.Item key={course._id}>
                        <Card
                          cover={<img alt={course.name} src={course.image} />}
                          title={course.name}
                        >
                          <p className="card-description">
                            {course.description}
                          </p>
                          <Link to={`/course/${course._id}`}>Chi tiết</Link>
                        </Card>
                      </List.Item>
                    )}
                  />
                </>
              )}
              <button onClick={scrollToTop} className="scroll-to-top-btn">
                ↑
              </button>
            </div>
          ))}
        </>
      </Content>
    </Layout>
  );
};

export default CoursePage;
