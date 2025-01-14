import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import styles from "../css/notificationDetail.module.css"; // Import CSS cho trang chi tiết thông báo

const NotificationDetail = () => {
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Lấy ID từ URL

  useEffect(() => {
    // Lấy thông báo chi tiết từ API dựa vào ID
    axios
      .get(`http://localhost:1337/notifications/${id}`)
      .then((response) => {
        setNotification(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông báo chi tiết:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <Spin />;
  }

  if (!notification) {
    return <div>Thông báo không tồn tại!</div>;
  }

  return (
    <div className={styles.Container}>
      <div className={styles.notificationDetailContainer}>
        <h1>{notification.Title}</h1>
        <p className={styles.notificationDate}>
          {new Date(notification.createdAt).toLocaleString()}
        </p>

        <div
          className={styles.notificationContent}
          dangerouslySetInnerHTML={{
            __html: notification.Content,
          }}
        />

        {/* Thêm liên kết trở về danh sách thông báo */}
        <Link to="/notifications" className={styles.back}>
          Quay lại
        </Link>
      </div>
    </div>
  );
};

export default NotificationDetail;
