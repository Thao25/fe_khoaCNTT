import React, { useState, useEffect } from "react";
import axios from "axios";

import { Spin, Button, Input, Modal, Form, message, Table, Upload } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import MyEditor from "../pages/editor";
const PostAdmin = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // Lấy danh sách bài viết từ Strapi và sắp xếp theo ngày đăng mới nhất
  useEffect(() => {
    axios
      .get("http://localhost:1337/posts")
      .then((response) => {
        // Sắp xếp bài viết theo ngày đăng giảm dần
        const sortedPosts = response.data.sort(
          (a, b) => new Date(b.published_at) - new Date(a.published_at)
        );
        setPosts(sortedPosts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, []);

  // Tìm kiếm bài viết
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Hiển thị form thêm/sửa bài viết
  const handleAddEditPost = (post = null) => {
    setSelectedPost(post);
    form.setFieldsValue({
      Title: post ? post.Title : "",
      Content: post ? post.Content : "",
      published: post ? post.published : true,
    });
    // Kiểm tra xem post có ảnh hay không và cập nhật fileList với tất cả ảnh
    if (
      post &&
      post.Image &&
      Array.isArray(post.Image) &&
      post.Image.length > 0
    ) {
      const updatedFileList = post.Image.map((image) => ({
        url: `http://localhost:1337${image.url}`, // Đảm bảo URL của ảnh đúng
        uid: image._id, // Dùng _id của ảnh làm uid
      }));

      setFileList(updatedFileList); // Cập nhật fileList với tất cả ảnh
    } else {
      setFileList([]); // Nếu không có ảnh, đảm bảo fileList trống
    }

    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPost(null);
    setFileList([]);
  };

  // Gửi form thêm/sửa bài viết
  const handleSubmit = (values) => {
    const formData = new FormData();

    formData.append(
      "data",
      JSON.stringify({
        Title: values.Title,
        Content: values.Content,
        published: values.published,
      })
    );

    // Đính kèm tệp ảnh nếu có
    if (fileList.length > 0) {
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("files.Image", file.originFileObj);
        }
      });
    }
    if (selectedPost) {
      // Cập nhật bài viết
      axios
        .put(`http://localhost:1337/posts/${selectedPost.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === selectedPost.id ? response.data : post
            )
          );
          handleCancel();
        })
        .catch((error) => {
          console.error(
            "Error updating post:",
            error.response ? error.response.data : error.message
          );
        });
    } else {
      // Thêm bài viết mới
      axios
        .post("http://localhost:1337/posts", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          // Thêm bài viết mới vào đầu mảng
          setPosts([response.data, ...posts]);
          handleCancel();
        })
        .catch((error) => {
          console.error("Error creating post:", error);
        });
    }
  };

  const handleDelete = (postId) => {
    Modal.confirm({
      title: "Xác nhận xóa bài viết",
      content: "Bạn có chắc chắn muốn xóa bài viết này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        // Tiến hành xóa bài viết khi người dùng nhấn "Xóa"
        axios
          .delete(`http://localhost:1337/posts/${postId}`) // DELETE API với ID bài viết
          .then(() => {
            setPosts(posts.filter((post) => post.id !== postId)); // Xóa bài viết khỏi danh sách
            message.success("Xóa bài viết thành công");
          })
          .catch((error) => {
            console.error("Error deleting post:", error);
            message.error("Có lỗi xảy ra khi xóa bài viết");
          });
      },
    });
  };

  // Xử lý upload file (ảnh)
  const handleAddFile = ({ fileList }) => {
    setFileList(fileList);
  };

  // Xử lý xóa ảnh
  const handleRemoveFile = (file) => {
    // Xóa ảnh khỏi danh sách fileList trong state
    setFileList((prevFileList) =>
      prevFileList.filter((item) => item.uid !== file.uid)
    );

    // Kiểm tra nếu có post và có ảnh cần xóa
    if (selectedPost && selectedPost.Image) {
      // Tìm ảnh trong Image của selectedPost để xác định xem ảnh này có cần xóa trên server không
      const imageToRemove = selectedPost.Image.find(
        (image) => image.id === file.uid
      );

      if (imageToRemove) {
        // Gửi yêu cầu xóa ảnh khỏi server Strapi
        axios
          .delete(`http://localhost:1337/upload/files/${file.uid}`)
          .then(() => {})
          .catch((err) => {
            console.error("Lỗi xóa ảnh:", err);
          });
      }
    }
  };
  // Tìm kiếm bài viết theo từ khóa
  const filteredPosts = posts.filter((post) =>
    post.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      render: (_, __, index) => index + 1, // Hiển thị số thứ tự
    },
    {
      title: "Title",
      render: (text, post) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {post.Image && (
            <Link to={`/post/${post.id}`}>
              <img
                src={`http://localhost:1337${post.Image[0].url}`}
                alt={post.Title}
                className="post-image"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  marginRight: 10,
                }}
              />
            </Link>
          )}
          <span>
            <Link to={`/post/${post.id}`}>{post.Title}</Link>
          </span>
        </div>
      ),
    },

    {
      title: "Ngày đăng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString(),
    },

    {
      title: "Hành động",
      render: (text, post) => (
        <div>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleAddEditPost(post)}
            style={{ marginRight: 10 }}
          ></Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(post.id)}
            style={{ marginRight: 10 }}
          ></Button>
        </div>
      ),
    },
  ];

  // Hiển thị loading khi đang tải dữ liệu
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

  return (
    <div className="posts-container">
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          style={{ marginRight: "10px" }}
          type="primary"
          onClick={() => handleAddEditPost()}
        >
          Thêm Bài Viết
        </Button>

        <Input
          placeholder="Tìm kiếm bài viết..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: 300 }}
        />
      </div>

      {filteredPosts.length === 0 ? (
        <p>Không có bài viết nào.</p>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredPosts}
          rowKey="id"
          pagination={false}
        />
      )}

      {/* Modal thêm/sửa bài viết */}
      <Modal
        title={selectedPost ? "Chỉnh sửa bài viết" : "Thêm bài viết"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1030}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Tiêu đề"
            name="Title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Nội dung"
            name="Content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <MyEditor
              value={form.getFieldValue("Content")}
              onChange={(value) => form.setFieldsValue({ Content: value })}
            />
          </Form.Item>
          <Form.Item
            label="Ảnh"
            rules={[{ required: true, message: "Vui lòng chọn ảnh!" }]}
          >
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleAddFile}
              onRemove={handleRemoveFile}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {selectedPost ? "Cập nhật bài viết" : "Thêm bài viết"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PostAdmin;
