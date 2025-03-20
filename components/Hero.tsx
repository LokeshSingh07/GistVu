"use client";

import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { AppBar } from "./ui/AppBar";
import { createGist } from "@/app/actions/gist";
import { toast } from "react-toastify";



export function CodeEditor() {
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(true);


  const createGistHandler = async()=>{
    try{
      setLoading(true);
      const response = await createGist({
        title: "Title",
        code,
        language: "javascript",
        userId: "afdfcd45-e845-4a86-affd-def1d423ad1e"
      });

      
      // setCode(response?.gist);
      toast.success(response?.message)
    }
    catch(err){
      console.error("Error fetching code:", err);
    }
    setLoading(false);
  }




  return (
    <div className="w-full h-full flex flex-col justify-between mx-auto">
      {/* Save Buttons */}
      <AppBar createGistHandler={createGistHandler}/>

      <MonacoEditor
        height={"91vh"}
        language="javascript"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{ lineNumbers: "on" }}
      />
    </div>
  );
}
