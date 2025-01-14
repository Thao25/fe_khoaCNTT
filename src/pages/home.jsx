import AutoSlideCarousel from "../components/layout/autoSlide";
import CourseCarousel from "../components/layout/cardCourse";
import LatestPostsPage from "../components/layout/LatestPostsPage";

import React from "react";

const HomePage = () => {
  return (
    <div className="home-page">
      <AutoSlideCarousel />
      <LatestPostsPage />
      <CourseCarousel />
    </div>
  );
};
export default HomePage;
