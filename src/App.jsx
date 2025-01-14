import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import Axios from "./util/axios.customize";
import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "./components/context/auth.context";
import { Spin } from "antd";
import Footer from "./components/layout/footer";
import Banner from "./components/layout/banner";

const App = () => {
  const { setAuth, apploading, setAppLoading } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);
  useEffect(() => {
    const fetchMenuItems = async () => {
      setAppLoading(true);
      try {
        const res = await axios.get(`http://localhost:1337/menus`);
        setMenuItems(res.data);
      } catch (error) {
        console.error("Error fetching menu items", error);
      }
      setAppLoading(false);
    };

    fetchMenuItems();
  }, [setAppLoading]);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      const res = await Axios.get(`/users/account`);
      if (res) {
        setAuth({
          isAuthenticated: true,
          user: res.data,
        });
      }

      setAppLoading(false);
    };

    fetchAccount();
  }, [setAuth, setAppLoading]);

  return (
    <div>
      {apploading === true ? (
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
      ) : (
        <>
          <Banner />
          {menuItems.length > 0 && <Header menuItems={menuItems} />}
          <Outlet />
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
