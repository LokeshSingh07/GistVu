"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ToastWrapper() {

  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      theme={"dark"}
      toastClassName={() =>
        "min-w-[250px] bg-black text-white shadow-lg rounded-lg p-4"
      }
      progressClassName="bg-primary"
    />
  );
}
