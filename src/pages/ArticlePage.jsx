import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

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
  }, [id]); // Mỗi khi id thay đổi, sẽ gọi lại API

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!articleData) {
    return <div>Article not found</div>;
  }

  return (
    <div>
      <h1>{articleData.title}</h1>
      <p>{articleData.content}</p>
    </div>
  );
};

export default ArticlePage;
