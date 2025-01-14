import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Spin, message } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "../../css/cardCourse.css";

const CourseCarousel = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Hàm điều khiển nút di chuyển
  const goToNext = () => {
    if (currentIndex + 3 < courses.length) {
      setCurrentIndex(currentIndex + 4);
    }
  };

  const goToPrevious = () => {
    if (currentIndex - 4 >= 0) {
      setCurrentIndex(currentIndex - 4);
    }
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
        <Spin />
      </div>
    );
  }
  const truncateDescription = (description) => {
    if (description.length > 50) {
      return description.substring(0, 50) + "...";
    }
    return description;
  };
  return (
    <div className="course-carousel-container">
      <div className="program-title">
        <span className="line">|</span>
        Chương trình đào tạo
        <span className="line">|</span>
      </div>

      <div className="course-carousel">
        <Button
          className="arrow-button btnleft"
          icon={<LeftOutlined />}
          onClick={goToPrevious}
          disabled={currentIndex === 0}
        />
        <div className="course-cards-container">
          {courses.slice(currentIndex, currentIndex + 4).map((course) => (
            <Card
              key={course._id}
              cover={<img alt={course.name} src={course.image} />}
              className="course-card"
            >
              <div className="course-card-details">
                <h4>{course.name}</h4>
                <p>{truncateDescription(course.description)}</p>
                <Link to={`/course/${course._id}`}>Chi tiết</Link>
              </div>
            </Card>
          ))}
        </div>
        <Button
          className="arrow-button btnright"
          icon={<RightOutlined />}
          onClick={goToNext}
          disabled={currentIndex + 4 >= courses.length}
        />
      </div>
    </div>
  );
};

export default CourseCarousel;
