import React, { useState, useContext } from "react";
import axios from "../../util/axios.customize";
import { AuthContext } from "../context/auth.context";
import "../ChangePasswordForm.css"; // Import file CSS bên ngoài
import { useNavigate } from "react-router-dom";
const ChangePasswordForm = () => {
  const { auth } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const email = auth.user.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    if (!email) {
      setError("Không tìm thấy thông tin người dùng.");
      return;
    }

    try {
      const response = await axios.post("users/password", {
        email,
        oldPassword,
        newPassword,
      });

      if (response.success) {
        alert("Đổi mật khẩu thành công!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");

        navigate("/login");
      } else {
        setError(response.EM || "Đã có lỗi xảy ra.");
        alert(response.EM || "Đã có lỗi xảy ra.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Đã có lỗi xảy ra.");
    }
  };

  return (
    <div className="pw-container">
      <div className="change-password-container">
        <h2>Đổi mật khẩu</h2>
        <form onSubmit={handleSubmit} className="change-password-form">
          <div className="form-group">
            <img
              src="https://qldtbeta.phenikaa-uni.edu.vn/congsinhvien/assets/images/forgot-pass.png"
              alt="logo đổi mật khẩu"
            />
          </div>
          <div className="form-group">
            <input
              placeholder="Nhập mật khẩu hiện tại"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="form-group">
            <input
              placeholder="Nhập mật khẩu mới"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="form-group">
            <input
              placeholder="Xác nhận mật khẩu mới"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-btn">
            Thay đổi
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
