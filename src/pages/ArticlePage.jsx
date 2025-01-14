import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import "../css/article.css";
const ArticlePage = () => {
  const { menuSlug, subMenuSlug, id } = useParams(); // Lấy menuSlug, subMenuSlug và id từ URL
  const [articleData, setArticleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        // Gọi API lấy bài viết theo id
        const response = await axios.get(
          `http://localhost:1337/articles/${id}`
        );

        if (response.data) {
          setArticleData(response.data);
        } else {
          console.error("Article not found");
        }
      } catch (error) {
        console.error("Error fetching article data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [id]);

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

  if (!articleData) {
    return null;
  }

  return (
    <div className="article-container">
      <div className="article-page">
        <div className="article-title">{articleData.title}</div>
        <div
          dangerouslySetInnerHTML={{ __html: articleData.content }}
          className="article-content"
        />
      </div>
    </div>
  );
};

export default ArticlePage;
