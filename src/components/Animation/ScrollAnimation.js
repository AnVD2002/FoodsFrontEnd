import React from "react";
import { useInView } from "react-intersection-observer";
import "./ScrollAnimation.css";

const ScrollAnimation = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: false, // Change to false to trigger every time
    threshold: 0.1, // Adjust threshold as needed
  });

  return (
    <div ref={ref} className={`scroll-animation ${inView ? "in-view" : ""}`}>
      {children}
    </div>
  );
};

export default ScrollAnimation;
