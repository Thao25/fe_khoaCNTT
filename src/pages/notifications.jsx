import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spin, Pagination } from "antd";
import { Link } from "react-router-dom";
import styles from "../css/notification.module.css"; // Import CSS Modules
import { ScheduleOutlined } from "@ant-design/icons";
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 8;

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
  const column1Notifications = notifications.slice(0, 4);
  const column2Notifications = notifications.slice(4, 8);
  return (
    <div className={styles.notificationsContainer}>
      {/* Phần bên trái: Danh sách thông báo */}
      <div className={styles.main}>
        {loading ? (
          <Spin />
        ) : (
          <div className={styles.leftColumns}>
            <div className={styles.leftColumn}>
              {column1Notifications.map((notification) => (
                <div key={notification._id} className={styles.notificationItem}>
                  <div className={styles.notificationImageContainer}>
                    <img
                      src="https://qldtbeta.phenikaa-uni.edu.vn/upload/ApisTinTuc/Avatar/unsave_1329b2b43a9d43e1a370e1c9342e47f9_20240522170649658.jpg"
                      alt="Notification"
                      className={styles.notificationImage}
                    />
                  </div>
                  <div className={styles.notificationContent}>
                    <Link
                      to={`/notification/${notification._id}`}
                      className={styles.notificationTitle}
                    >
                      <h3 className={styles.notificationTitle}>
                        {notification.Title.length > 45
                          ? `${notification.Title.substring(0, 45)}...`
                          : notification.Title}
                      </h3>
                    </Link>
                    <p className={styles.notificationText}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: removeImagesFromContent(
                            notification.Content.length > 50
                              ? `${notification.Content.substring(0, 50)}...`
                              : notification.Content
                          ),
                        }}
                      />
                    </p>
                    <div className={styles.notificationDateContainer}>
                      <ScheduleOutlined
                        style={{
                          fontSize: "16px",
                          marginRight: "5px",
                          paddingBottom: "11px",
                        }}
                      />
                      <span className={styles.notificationDate}>
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.leftColumn}>
              {column2Notifications.map((notification) => (
                <div key={notification._id} className={styles.notificationItem}>
                  <div className={styles.notificationImageContainer}>
                    <img
                      src="https://qldtbeta.phenikaa-uni.edu.vn/upload/ApisTinTuc/Avatar/unsave_1329b2b43a9d43e1a370e1c9342e47f9_20240522170649658.jpg"
                      alt="Notification"
                      className={styles.notificationImage}
                    />
                  </div>
                  <div className={styles.notificationContent}>
                    <Link
                      to={`/notification/${notification._id}`}
                      className={styles.notificationTitle}
                    >
                      <h3 className={styles.notificationTitle}>
                        {notification.Title.length > 45
                          ? `${notification.Title.substring(0, 45)}...`
                          : notification.Title}
                      </h3>
                    </Link>
                    <p className={styles.notificationText}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: removeImagesFromContent(
                            notification.Content.length > 50
                              ? `${notification.Content.substring(0, 50)}...`
                              : notification.Content
                          ),
                        }}
                      />
                    </p>
                    <div className={styles.notificationDateContainer}>
                      <ScheduleOutlined
                        style={{
                          fontSize: "16px",
                          marginRight: "5px",
                          paddingBottom: "11px",
                        }}
                      />
                      <span className={styles.notificationDate}>
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={styles.paginationWrapper}>
          <Pagination
            current={currentPage}
            total={notifications.length}
            pageSize={notificationsPerPage}
            onChange={onPageChange}
            showSizeChanger={false}
          />
        </div>
      </div>

      <div className={styles.right}>
        <h2 className={styles.sectionTitle}>Thông báo mới nhất</h2>
        {loading ? (
          <Spin />
        ) : (
          notifications.slice(0, 6).map((notification) => (
            <div
              key={notification._id}
              className={styles.latestNotificationItem}
            >
              <Link
                to={`/notification/${notification._id}`}
                className={styles.notificationTitle}
              >
                <h3 className={styles.notificationTitle}>
                  {notification.Title}
                </h3>
              </Link>

              <p className={styles.notificationDate}>
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
