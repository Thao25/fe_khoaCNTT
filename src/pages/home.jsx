import AutoSlideCarousel from "../components/layout/autoSlide";
import FeaturedArticles from "../components/layout/cardArticle";
import CourseCarousel from "../components/layout/cardCourse";
import LatestPostsPage from "../components/layout/LatestPostsPage";

import React from "react";
import StaticContent from "../components/layout/StaticContent";
import AboutUs from "../components/layout/AboutUs";

const HomePage = () => {
  return (
    <div className="home-page">
      <AutoSlideCarousel />

      <FeaturedArticles />
      <AboutUs />
      <LatestPostsPage />
      <StaticContent />
      <CourseCarousel />
    </div>
  );
};
export default HomePage;
