import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Collapse, message, Skeleton, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, DownOutlined } from "@ant-design/icons";
import MenuForm from "../components/MenuForm";
import SubmenuForm from "../components/SubmenuForm";
import ArticleForm from "../components/ArticleForm";
import "../css/adminheader.css";
const { Panel } = Collapse;

const AdminHeaderPage = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allArticles, setAllArticles] = useState([]);

  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showSubmenuForm, setShowSubmenuForm] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);

  const [currentMenu, setCurrentMenu] = useState(null);
  const [currentSubmenu, setCurrentSubmenu] = useState(null);
  const [currentArticle, setCurrentArticle] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get("http://localhost:1337/menus");
        console.log("menus", response.data);

        setMenus(response.data);
      } catch (error) {
        console.error("Error fetching menus", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:1337/articles");
        setAllArticles(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy bài viết", error);
      }
    };
    fetchArticles();
  }, []);

  const findArticleById = (articleId) => {
    return allArticles.find((article) => article.id === articleId);
  };
  const handleShowMenuForm = (menu = null) => {
    setCurrentMenu(menu);
    setShowMenuForm(true);
  };

  const handleShowSubmenuForm = (submenu = null) => {
    setCurrentSubmenu(submenu);
    setShowSubmenuForm(true);
  };

  const handleShowArticleForm = (
    article = null,
    currentMenu = "",
    currentSubmenu = "",
    isSubmenu = false
  ) => {
    setCurrentArticle(article);
    setCurrentMenu(currentMenu);
    setCurrentSubmenu(currentSubmenu);
    setShowArticleForm(true);
  };

  const handleCloseMenuForm = () => setShowMenuForm(false);
  const handleCloseSubmenuForm = () => setShowSubmenuForm(false);
  const handleCloseArticleForm = () => setShowArticleForm(false);
  const isValidMenus = Array.isArray(menus) && menus.length > 0;
  const handleDeleteMenu = async (menuId) => {
    try {
      await axios.delete(`http://localhost:1337/menus/${menuId}`);
      setMenus(menus.filter((menu) => menu.id !== menuId));
      message.success("Xóa thành công");
    } catch (error) {
      message.error("Xóa thất bại");
    }
  };

  const handleDeleteSubmenu = async (submenuId) => {
    try {
      await axios.delete(`http://localhost:1337/submenus/${submenuId}`);
      setMenus(
        menus.map((menu) => {
          if (menu.submenus) {
            menu.submenus = menu.submenus.filter(
              (submenu) => submenu.id !== submenuId
            );
          }
          return menu;
        })
      );
      message.success("Xóa thành công");
    } catch (error) {
      message.error("Xóa thất bại");
    }
  };

  const handleDeleteArticle = async (articleId, isSubmenu) => {
    try {
      if (isSubmenu) {
        await axios.delete(`http://localhost:1337/articles/${articleId}`);
        setMenus(
          menus.map((menu) => {
            if (menu.submenus) {
              menu.submenus.forEach((submenu) => {
                submenu.articles = submenu.articles.filter(
                  (article) => article.id !== articleId
                );
              });
            }
            return menu;
          })
        );
      } else {
        await axios.delete(`http://localhost:1337/articles/${articleId}`);
        setMenus(
          menus.map((menu) => {
            menu.articles = menu.articles.filter(
              (article) => article.id !== articleId
            );
            return menu;
          })
        );
      }
      message.success("Xóa thành công");
    } catch (error) {
      message.error("Xóa thất bại");
    }
  };

  return (
    <div className="container-admin-header">
      <h1>Quản lý thông tin</h1>

      {/* Các nút để hiển thị form */}
      <div>
        <Button
          type="primary"
          onClick={() => handleShowMenuForm()}
          className="create-menu-button"
        >
          Tạo Menu
        </Button>
        <Button
          type="primary"
          onClick={() => handleShowSubmenuForm()}
          className="create-menu-button"
        >
          Tạo Submenu
        </Button>
        <Button
          type="primary"
          onClick={() => handleShowArticleForm()}
          className="create-menu-button"
        >
          Tạo Article
        </Button>
      </div>

      {/* Hiển thị form tương ứng khi nhấn vào nút */}
      <Modal
        title={currentMenu ? "Sửa Menu" : "Tạo Menu"}
        visible={showMenuForm}
        onCancel={handleCloseMenuForm}
        footer={null}
        centered
        width={500}
      >
        <MenuForm closeForm={handleCloseMenuForm} menu={currentMenu} />
      </Modal>

      <Modal
        title={currentSubmenu ? "Sửa Submenu" : "Tạo Submenu"}
        visible={showSubmenuForm && isValidMenus}
        onCancel={handleCloseSubmenuForm}
        footer={null}
        centered
        width={500}
      >
        {isValidMenus && (
          <SubmenuForm
            closeForm={handleCloseSubmenuForm}
            submenu={currentSubmenu}
            menus={menus}
          />
        )}
      </Modal>

      <Modal
        title={currentArticle ? "Sửa Article" : "Tạo Article"}
        visible={showArticleForm && isValidMenus}
        onCancel={handleCloseArticleForm}
        footer={null}
        centered
        width={1000}
      >
        {isValidMenus && (
          <ArticleForm
            closeForm={handleCloseArticleForm}
            article={currentArticle}
            menus={menus}
          />
        )}
      </Modal>

      {loading ? (
        <Skeleton active />
      ) : (
        <ul>
          {menus.map((menu) => (
            <li key={menu.id}>
              <div>
                <h4>
                  {menu.menu}
                  <EditOutlined onClick={() => handleShowMenuForm(menu)} />
                  <Popconfirm
                    title="Bạn có chắc chắn xóa?"
                    onConfirm={() => handleDeleteMenu(menu.id)}
                    okText="Có"
                    cancelText="Không"
                  >
                    <DeleteOutlined />
                  </Popconfirm>
                </h4>

                <Collapse
                  expandIcon={({ isActive }) => (
                    <DownOutlined rotate={isActive ? 180 : 0} />
                  )}
                  bordered={false}
                  defaultActiveKey={[]}
                >
                  {menu.submenus && menu.submenus.length > 0 && (
                    <Panel header="Submenus" key="1">
                      <ul>
                        {menu.submenus.map((submenu) => (
                          <li key={submenu.id}>
                            <div>
                              {submenu.subMenu}
                              <EditOutlined
                                onClick={() => handleShowSubmenuForm(submenu)}
                              />
                              <Popconfirm
                                title="Bạn có chắc chắn xóa?"
                                onConfirm={() =>
                                  handleDeleteSubmenu(submenu.id)
                                }
                                okText="Có"
                                cancelText="Không"
                              >
                                <DeleteOutlined />
                              </Popconfirm>

                              {submenu.articles &&
                                submenu.articles.length > 0 && (
                                  <Collapse
                                    expandIcon={({ isActive }) => (
                                      <DownOutlined
                                        rotate={isActive ? 180 : 0}
                                      />
                                    )}
                                    bordered={false}
                                    defaultActiveKey={[]}
                                  >
                                    <Panel header="Articles" key="2">
                                      <ul>
                                        {submenu.articles.map((articleId) => {
                                          const article =
                                            findArticleById(articleId);
                                          return article ? (
                                            <li key={article.id}>
                                              <div>
                                                {article.title}
                                                <div>
                                                  ID: <span>{article.id}</span>
                                                </div>
                                              </div>
                                              <EditOutlined
                                                onClick={() =>
                                                  handleShowArticleForm(
                                                    article,
                                                    true
                                                  )
                                                }
                                              />
                                              <Popconfirm
                                                title="Bạn có chắc chắn xóa?"
                                                onConfirm={() =>
                                                  handleDeleteArticle(
                                                    article.id,
                                                    true
                                                  )
                                                }
                                                okText="có"
                                                cancelText="Không"
                                              >
                                                <DeleteOutlined />
                                              </Popconfirm>
                                            </li>
                                          ) : null;
                                        })}
                                      </ul>
                                    </Panel>
                                  </Collapse>
                                )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </Panel>
                  )}

                  {menu.articles && menu.articles.length > 0 && (
                    <Panel header="Articles" key="2">
                      <ul>
                        {menu.articles.map((article) => (
                          <li key={article.id}>
                            <div>
                              {article.title}
                              <div>
                                ID:
                                <span>{article.id}</span>
                              </div>
                            </div>
                            <EditOutlined
                              onClick={() =>
                                handleShowArticleForm(article, false)
                              }
                            />
                            <Popconfirm
                              title="Bạn có chắc chắn xóa?"
                              onConfirm={() =>
                                handleDeleteArticle(article.id, false)
                              }
                              okText="Có"
                              cancelText="Không"
                            >
                              <DeleteOutlined />
                            </Popconfirm>
                          </li>
                        ))}
                      </ul>
                    </Panel>
                  )}
                </Collapse>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminHeaderPage;
