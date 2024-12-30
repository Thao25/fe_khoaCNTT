import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { AuthContext } from "../components/context/auth.context";
import {
  Layout,
  Table,
  Spin,
  message,
  Button,
  Input,
  Modal,
  Form,
  Select,
  Popconfirm,
  Upload,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "../css/course.css";
import { Link } from "react-router-dom";

// Hàm gọi API để làm mới token
const refreshToken = async () => {
  try {
    const response = await axios.post(
      " http://localhost:8080/users/refresh-token",
      {
        refresh_token: localStorage.getItem("refresh_token"), // Sử dụng refresh token đã lưu trong localStorage
      }
    );

    if (response.status === 200) {
      const { access_token } = response.data.data.access_token; // Lấy access token mới từ response
      localStorage.setItem("access_token", access_token); // Lưu access token mới vào localStorage
      return access_token; // Trả về token mới
    } else {
      throw new Error("Không thể làm mới token");
    }
  } catch (error) {
    console.error("Lỗi khi làm mới token:", error);
    message.error("Lỗi khi làm mới token");
    return null;
  }
};
const CoursePage = () => {
  const { setAuth } = useContext(AuthContext);
  const [apploading, setAppLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal duy nhất cho cả tạo và sửa
  const [currentCourse, setCurrentCourse] = useState(null); // Khóa học hiện tại đang sửa
  const [fileList, setFileList] = useState([]);
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    level: "Đại cương",
    image: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      setAppLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/courses/all");
        if (res.status === 200 && res.data.data) {
          const sortedCourses = res.data.data.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt); // Sắp xếp giảm dần
          });
          setCourses(sortedCourses);
          setFilteredData(sortedCourses);
        } else {
          message.error("Không thể tải danh sách khóa học!");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Nếu token hết hạn (401), gọi lại refreshToken
          const newToken = await refreshToken();
          if (newToken) {
            // Nếu lấy được token mới, thử lại yêu cầu cũ
            fetchCourses();
          }
        } else {
          message.error("Lỗi khi tải danh sách khóa học!");
        }
      } finally {
        setAppLoading(false);
      }
    };
    fetchCourses();
  }, [setAppLoading]);

  // Search functionality
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === "") {
      setFilteredData(courses); // Show all courses if no search term
    } else {
      const filtered = courses.filter(
        (course) =>
          (course.name &&
            course.name.toLowerCase().includes(value.toLowerCase())) ||
          (course.description &&
            course.description.toLowerCase().includes(value.toLowerCase()))
      );
      // Sắp xếp lại sau khi lọc
      const sortedFiltered = filtered.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setFilteredData(sortedFiltered); // Filter courses by name or description
    }
  };

  // Show modal (for create or edit)
  const showModal = (course = null) => {
    setCurrentCourse(course);
    if (course) {
      // Nếu có khóa học được chọn, form sẽ là form sửa
      setNewCourse({
        name: course.name,
        description: course.description,
        level: course.level,
        image: course.image, // Đảm bảo rằng ảnh được truyền vào state
      });
      // Cập nhật lại fileList với ảnh từ khóa học
      setFileList([
        {
          uid: "-1", // uid duy nhất cho file
          status: "done", // trạng thái là "done" (đã tải xong)
          url: course.image, // Đường dẫn ảnh
        },
      ]);
    } else {
      // Nếu không có khóa học, form là form tạo mới
      setNewCourse({
        name: "",
        description: "",
        level: "Đại cương",
        image: "", // Không có ảnh khi tạo mới
      });
      setFileList([]); // Đảm bảo fileList là mảng rỗng khi tạo mới
    }
    setIsModalVisible(true);
  };

  // Handle modal close
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Update new course values
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  // Hàm xử lý thay đổi khi người dùng chọn ảnh
  const handleUploadChange = (fileList) => {
    // Nếu có ảnh được chọn, cập nhật trạng thái newCourse với file đã chọn
    if (fileList.length > 0) {
      setNewCourse((prevCourse) => ({
        ...prevCourse,
        image: fileList[0].originFileObj, // Lưu file đã chọn vào state
      }));
    } else {
      setNewCourse((prevCourse) => ({
        ...prevCourse,
        image: "", // Reset ảnh nếu không có ảnh nào được chọn
      }));
    }
    setFileList(fileList); // Cập nhật lại trạng thái fileList
  };

  // Hàm xử lý khi người dùng xóa ảnh
  const handleRemoveImage = () => {
    setNewCourse((prevCourse) => ({
      ...prevCourse,
      image: "", // Reset ảnh khi người dùng xóa ảnh
    }));
  };

  // Hàm xử lý trước khi tải lên (tùy chọn nếu bạn muốn kiểm tra file trước khi tải lên)
  const handleBeforeUpload = (file) => {
    // Kiểm tra hoặc xử lý file nếu cần
    console.log("Chọn file:", file);
    return false; // Ngừng việc tải file lên server tự động
  };

  // Create new course
  const handleCreateCourse = async () => {
    const { name, description, level, image } = newCourse;
    if (!name || !description || !level) {
      message.error("Vui lòng điền đủ thông tin!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("level", level);
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:8080/courses/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        message.success("Tạo khóa học thành công!");
        const newCourse = response.data.data;
        setCourses((prevCourses) => [newCourse, ...prevCourses]);

        setNewCourse({
          name: "",
          description: "",
          level: "Đại cương",
          image: "",
        });
        setFileList([]);
        setIsModalVisible(false);
      } else {
        message.error("Lỗi khi tạo khóa học!");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Token hết hạn, gọi refreshToken và thử lại
        const newToken = await refreshToken();
        if (newToken) {
          // Lặp lại yêu cầu create course với token mới
          handleCreateCourse();
        }
      } else {
        message.error("Lỗi khi tạo khóa học!");
      }
    }
  };

  // Edit course
  const handleEditCourse = async () => {
    const { name, description, level, image } = newCourse;
    if (!name || !description || !level) {
      message.error("Vui lòng điền đủ thông tin!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("level", level);
    formData.append("image", image);

    try {
      const response = await axios.put(
        `http://localhost:8080/courses/${currentCourse._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        message.success("Cập nhật khóa học thành công!");

        // Kiểm tra xem khóa học đã thay đổi chưa
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === currentCourse._id ? response.data.data : course
          )
        );
        setFileList([]);
        setIsModalVisible(false);
      } else {
        message.error("Lỗi khi cập nhật khóa học!");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Token hết hạn, gọi refreshToken và thử lại
        const newToken = await refreshToken();
        if (newToken) {
          // Lặp lại yêu cầu edit course với token mới
          handleEditCourse();
        }
      } else {
        message.error("Lỗi khi cập nhật khóa học!");
      }
    }
  };
  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.status === 200) {
        message.success("Xóa khóa học thành công!");
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course._id !== courseId)
        ); // Cập nhật lại danh sách khóa học sau khi xóa
      } else {
        message.error("Lỗi khi xóa khóa học!");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Token hết hạn, gọi refreshToken và thử lại
        const newToken = await refreshToken();
        if (newToken) {
          // Lặp lại yêu cầu delete course với token mới
          handleDeleteCourse(courseId);
        }
      } else {
        message.error("Lỗi khi xóa khóa học!");
      }
    }
  };

  useEffect(() => {
    const filtered = courses.filter(
      (course) =>
        (course.name && course.name.includes(searchTerm)) ||
        (course.description && course.description.includes(searchTerm))
    );
    setFilteredData(filtered);
  }, [courses, searchTerm]);
  // Columns for course table
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img src={image} alt="course" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Khoá học",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to={`/course/${record._id}`}>{text}</Link>
      ),
    },
    {
      title: "Cấp độ",
      dataIndex: "level",
      key: "level",
      filters: [
        { text: "Đại cương", value: "Đại cương" },
        { text: "Cơ sở ngành", value: "Cơ sở ngành" },
        { text: "Chuyên ngành", value: "Chuyên ngành" },
      ],
      onFilter: (value, record) => record.level.includes(value),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => text.substring(0, 100) + "...",
    },

    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <span>
          <Button
            icon={<EditOutlined />}
            type="primary"
            style={{ marginRight: 5 }}
            onClick={() => showModal(record)} // Hiển thị modal sửa khóa học
          ></Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDeleteCourse(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const data = filteredData.map((course) => ({
    _id: course._id,
    image: course.image,
    name: course.name,
    level: course.level,
    description: course.description,
  }));

  return (
    <div>
      <Button type="primary" onClick={() => showModal()}>
        Tạo khóa học
      </Button>
      <Input
        placeholder="Tìm kiếm khóa học"
        value={searchTerm}
        onChange={handleSearch}
        style={{ width: 300 }}
      />
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        style={{ marginTop: 20 }}
        onChange={(pagination, filters, sorter) => {
          if (filters.level) {
            setFilteredData(
              courses.filter((course) => filters.level.includes(course.level))
            );
          } else {
            setFilteredData(courses);
          }
        }}
      />

      {/* Modal for creating or editing course */}
      <Modal
        title={currentCourse ? "Sửa khóa học" : "Tạo khóa học mới"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={currentCourse ? handleEditCourse : handleCreateCourse}
          >
            {currentCourse ? "Cập nhật khóa học" : "Tạo khóa học"}
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Tên khóa học">
            <Input
              name="name"
              value={newCourse.name}
              rules={[
                { required: true, message: "Vui lòng nhập tên khóa học!" },
              ]}
              onChange={handleInputChange}
              placeholder="Nhập tên khóa học"
            />
          </Form.Item>
          <Form.Item label="Mô tả">
            <Input.TextArea
              name="description"
              value={newCourse.description}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mô tả cho khóa học!",
                },
              ]}
              onChange={handleInputChange}
              placeholder="Nhập mô tả khóa học"
              rows={4}
            />
          </Form.Item>
          <Form.Item label="Cấp độ">
            <Select
              name="level"
              value={newCourse.level}
              onChange={(value) => setNewCourse({ ...newCourse, level: value })}
            >
              <Select.Option value="Đại cương">Đại cương</Select.Option>
              <Select.Option value="Cơ sở ngành">Cơ sở ngành</Select.Option>
              <Select.Option value="Chuyên ngành">Chuyên ngành</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Ảnh">
            <Upload
              name="image"
              listType="picture"
              maxCount={1}
              fileList={
                newCourse.image
                  ? [
                      {
                        uid: "-1", // ID duy nhất cho ảnh đã tải lên
                        status: "done",
                        url: `${newCourse.image}`, // URL ảnh để hiển thị trên UI
                      },
                    ]
                  : []
              } // Chỉ hiển thị ảnh nếu nó đã được set trong state
              onChange={({ fileList }) => handleUploadChange(fileList)} // Hàm xử lý khi thay đổi file
              onRemove={() => handleRemoveImage()} // Hàm xử lý khi xóa ảnh
              beforeUpload={(file) => {
                handleBeforeUpload(file); // Hàm xử lý file trước khi tải lên
                return false; // Ngừng việc tải file lên server tự động
              }}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CoursePage;
