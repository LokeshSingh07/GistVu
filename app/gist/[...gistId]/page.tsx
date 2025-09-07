"use client";

import React, { useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { AppBar } from "@/components/ui/AppBar";
import { useParams } from "next/navigation";
import { getSingleGist } from "@/app/actions/gist";
import { toast } from "react-toastify";




export default function Gist() {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("")
  const [loading, setLoading] = useState(false);
  const params = useParams<{ gistId: string | string[] }>();
  const gistId = Array.isArray(params.gistId) ? params.gistId[0] : params.gistId;



  const copyToClipboard = () => {
    if (!code) return;
    
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard!");
    }
    else{
      toast.error("Clipboard API not supported in this browser.");
    }
  };
  



  
  useEffect(() => {
    const fetchData = async()=>{
      try{
        setLoading(true);
        // gistId = gistId[0];
        const response = await getSingleGist({gistId});
        // console.log("repsonse : ", response)
        
        if(!response?.gist?.code){
          toast.error("Failed to load gist content.");
          return;
        }
  
        setCode(response?.gist?.code);
        setLanguage(response?.gist?.language)
      }
      catch(err){
        console.error("Error fetching code:", err);
        toast.error("Error fetching gist. Please try again later.");
      }
      finally{
        setLoading(false);
      }
    }

    if(gistId) fetchData();

  }, [gistId]);



  if(loading){
    return (
      <div className="w-full h-screen flex justify-center items-center"> Loading...</div>
    )
  }




  return (
    <div className="w-full h-full flex flex-col justify-between mx-auto">
        <AppBar copyToClipboard={copyToClipboard}/>
        
        <MonacoEditor
            height={"91vh"}
            language={language}
            theme="vs-dark"
            value={code}
            options={{ lineNumbers: "on", readOnly: true }}
        />
    </div>
  );
}