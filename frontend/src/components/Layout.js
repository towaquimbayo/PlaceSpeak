import React from "react";
import { Helmet } from "react-helmet";

export default function Layout({ title, isLandingPage = false, children }) {
  if (title && typeof document !== "undefined") {
    document.title = isLandingPage ? "PlaceSpeak" : `${title} | PlaceSpeak`;
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{isLandingPage ? "PlaceSpeak" : `${title} | PlaceSpeak`}</title>
      </Helmet>
      <div id="wrapper">{children}</div>
    </>
  );
}
