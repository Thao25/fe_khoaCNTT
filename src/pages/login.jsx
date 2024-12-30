import React from "react";
import { Button, Checkbox, Form, Input, notification } from "antd";
import { loginApi } from "../util/api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";
import { useContext, useEffect } from "react";
import "../css/login.css"; // Đảm bảo bạn đã tạo file CSS và import vào

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [form] = Form.useForm();
  useEffect(() => {
    // Kiểm tra xem email và mật khẩu đã được lưu chưa
    const rememberEmail = localStorage.getItem("remember_email");
    const rememberPassword = localStorage.getItem("remember_password");

    if (rememberEmail) {
      form.setFieldsValue({
        email: rememberEmail,
        password: rememberPassword || "", // Nếu không có mật khẩu, chỉ điền email
        remember: true, // Đánh dấu checkbox "Ghi nhớ"
      });
    }
  }, [form]);

  const onFinish = async (values) => {
    const { email, password, remember } = values;
    const res = await loginApi(email, password);

    if (res && res.data.EC === 0) {
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      if (remember) {
        // Nếu "remember me" được chọn, lưu thông tin người dùng vào localStorage hoặc sessionStorage
        localStorage.setItem("remember_email", email);
        localStorage.setItem("remember_password", password);
      }

      notification.success({
        message: "Đăng nhập",
        description: "Thành công!",
      });

      setAuth({
        isAuthenticated: true,
        user: {
          email: res?.data?.user?.email ?? "",
          role: res?.data?.user?.role ?? "",
          fullName: res?.data?.user?.fullName ?? "",
          profileImage: res?.data?.user?.profileImage ?? "",
          gender: res?.data?.user?.gender ?? "",
          address: res?.data?.user?.address ?? "",
          phoneNumber: res?.data?.user?.phoneNumber ?? "",
          dateOfBirth: res?.data?.user?.dateOfBirth ?? "",
          studentClass: res?.data?.user?.studentClass ?? "",
          description: res?.data?.user?.description ?? "",
        },
      });

      navigate("/");
    } else {
      notification.error({
        message: "Đăng nhập thất bại!",
        description: res?.EM ?? "Lỗi xảy ra",
      });
      console.log(res);
      return;
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-container">
      <Form
        form={form}
        name="basic"
        className="login-form"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
      >
        <h1>Đăng nhập</h1>
        <img
          src="https://actvn.edu.vn/Images/actvn_big_icon.png"
          alt="Logo"
          className="logo"
          style={{
            marginBottom: "20px",
            width: "100px",
            height: "100px",
            display: "block",
            margin: "0 auto",
            textAlign: "center",
          }}
        />

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Hãy nhập email!",
            },
          ]}
          style={{
            marginBottom: "20px",
            textAlign: "center",
            display: "block",
            margin: "0 auto",
          }}
        >
          <Input style={{ width: "300px", margin: "0 auto" }} />
        </Form.Item>
        <Form.Item
          label="mật khẩu"
          name="password"
          rules={[
            {
              required: true,
              message: "Hãy nhập mật khẩu!",
            },
          ]}
          style={{
            marginBottom: "20px",
            textAlign: "center",
            display: "block",
            margin: "0 auto",
          }}
        >
          <Input.Password style={{ width: "300px", margin: "0 auto" }} />
        </Form.Item>
        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
          style={{ textAlign: "center" }}
        >
          <Checkbox>Ghi nhớ</Checkbox>
        </Form.Item>
        <Form.Item
          style={{
            textAlign: "center",
            width: "150px",
            display: "block",
            margin: "10px auto",
          }}
        >
          <Button type="primary" htmlType="submit">
            Đăng nhập
          </Button>
        </Form.Item>
        <Form.Item>
          <Link to="/">Quay lại Trang chủ</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
