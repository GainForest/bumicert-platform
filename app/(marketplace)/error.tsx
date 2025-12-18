"use client";
import React from "react";

const ErrorPage = ({ error }: { error: Error }) => {
  return <div>Error: {error.message}</div>;
};

export default ErrorPage;
