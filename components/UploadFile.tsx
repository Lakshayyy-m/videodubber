"use client";
import { FileContext, useFile } from "@/context/FileContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";

// let t = false;
const options = {
  apiKey: "public_12a1yxi7DjMArvJFKczDC2Yv3HTb", // This is your API key.
  maxFileCount: 1,
  showFinishButton: true, // Note: You must use 'onUpdate' if you set 'showFinishButton: false' (default).
  styles: {
    colors: {
      primary: "#377dff",
    },
  },
};

const UploadFile = () => {
  const router = useRouter();
  const inputFile = useRef(null);
  const { fileURL, setFileURL } = useFile();
  const [file, setFile] = useState("");

  useEffect(() => {
    // if (!t) {
    //   t = true;
    //   return;
    // }
    if (file) {
      setFileURL(file);
      router.push("/edit");
    }
  }, [file, router, setFileURL]);

  const handleButtonClick = () => {
    inputFile.current?.click();
  };

  const handleFileUpload = (e: any) => {
    // console.log(file);
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-5">
      <h1 className="text-5xl font-bold">Upload your audio file here</h1>
      <button
        className="bg-red-600 py-4 px-6 rounded-xl"
        onClick={handleButtonClick}
      >
        Upload
      </button>
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: "none" }}
        accept="audio/*"
        onChange={handleFileUpload}
      />
      
    </div>
  );
};

export default UploadFile;
