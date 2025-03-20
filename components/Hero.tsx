"use client";

import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { AppBar } from "./ui/AppBar";
import { createGist } from "@/app/actions/gist";
import { toast } from "react-toastify";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input";



export function CodeEditor() {
  const [code, setCode] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [language, setLanguage] = useState<string>("cpp")
  const [loading, setLoading] = useState(false);


  const createGistHandler = async()=>{
    try{
      setLoading(true);
      if(!code){
        setLoading(false);
        toast.error("No code to upload")
        return;
      }
      if (!title.trim()) {
        setLoading(false);
        toast.error("Title is required");
        return;
      }
    

      const response = await createGist({
        title,
        code,
        language,
        userId: "afdfcd45-e845-4a86-affd-def1d423ad1e"
      });

      
      // setCode(response?.gist);
      toast.success(response?.message)
    }
    catch(err){
      console.error("Error fetching code:", err);
    }
    finally{
      setLoading(false);
    }
  }




  return (
    <div className="w-full h-full flex flex-col justify-between mx-auto">
      {/* Save Buttons */}
      <AppBar 
        createGistHandler={createGistHandler} 
        loading={loading}
      />

      <div className="w-full flex justify-center items-center gap-4 pb-2 px-5 bg-black border-b-10">
        <div className="w-lg">
          <Input
            type="text" 
            value={title}
            placeholder="Enter the title"
            onChange={(e)=> setTitle(e.target.value)}
          />
        </div>
        <div>
          <Select onValueChange={setLanguage} value={language}>
              <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                  <SelectGroup>
                  <SelectLabel>Language</SelectLabel>
                  <SelectItem value="cpp">cpp</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  </SelectGroup>
              </SelectContent>
          </Select>
        </div>
      </div>

      <MonacoEditor
        height={"82vh"}
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{ lineNumbers: "on" }}
      />
    </div>
  );
}
