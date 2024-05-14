import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "./Navbar";
import "../css/dashboard.css";

export default function Layout({
  title,
  isAuthPage = false,
  isLandingPage = false,
  children,
}) {
  if (title && typeof document !== "undefined") {
    document.title = isLandingPage ? "PlaceSpeak" : `${title} | PlaceSpeak`;
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{isLandingPage ? "PlaceSpeak" : `${title} | PlaceSpeak`}</title>
      </Helmet>
      {isAuthPage ? (
        children
      ) : (
        <>
          <Navbar />
          <div id="wrapper">{children}</div>
        </>
      )}
    </>
  );
}
