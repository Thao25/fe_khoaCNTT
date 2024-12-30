import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spin, Pagination } from "antd";
import { Link } from "react-router-dom";
import styles from "../css/notification.module.css"; // Import CSS Modules

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;

  useEffect(() => {
    axios
      .get("http://localhost:1337/notifications")
      .then((response) => {
        const sortedNotifications = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sortedNotifications);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông báo:", error);
        setLoading(false);
      });
  }, []);

  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification =
    indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications.slice(
    indexOfFirstNotification,
    indexOfLastNotification
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const removeImagesFromContent = (content) => {
    // Dùng regex để tìm và loại bỏ tất cả thẻ <img>
    const contentWithoutImages = content.replace(/<img[^>]*>/g, "");
    return contentWithoutImages;
  };
  return (
    <div className={styles.notificationsContainer}>
      {/* Phần bên trái: Danh sách thông báo */}
      <div className={styles.main}>
        <h2 className={styles.sectionTitle}>Danh sách thông báo</h2>
        {loading ? (
          <Spin />
        ) : (
          currentNotifications.map((notification) => (
            <div key={notification._id} className={styles.notificationItem}>
              <Link to={`/notification/${notification._id}`}>
                <h3 className={styles.notificationTitle}>
                  {notification.Title}
                </h3>
              </Link>
              <p className={styles.notificationText}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: removeImagesFromContent(
                      notification.Content.length > 200
                        ? `${notification.Content.substring(0, 200)}...`
                        : notification.Content
                    ),
                  }}
                />
              </p>

              <p className={styles.notificationDate}>
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
        <Pagination
          current={currentPage}
          total={notifications.length}
          pageSize={notificationsPerPage}
          onChange={onPageChange}
          showSizeChanger={false}
        />
      </div>

      {/* Phần bên phải: Tin mới nhất */}
      <div className={styles.right}>
        <h2 className={styles.sectionTitle}>Thông báo mới nhất</h2>
        {loading ? (
          <Spin />
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <div
              key={notification._id}
              className={styles.latestNotificationItem}
            >
              <Link to={`/notification/${notification._id}`}>
                <h3>{notification.Title}</h3>
              </Link>
              <p>{new Date(notification.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
