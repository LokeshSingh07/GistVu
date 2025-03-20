"use client"
import { Button } from "./button";
import { useEffect, useState } from "react";
import { ArrowRight, Copy, Share } from "lucide-react";
import Link from "next/link";
import { Loader } from "./Loader";




export const AppBar = ({
    copyToClipboard,
    createGistHandler,
    loading,
}: {
    copyToClipboard?:()=>void,
    createGistHandler?:()=>void,
    loading?: boolean,
})=>{
    const [isHomePage, setIsHomePage] = useState(false);
    const [isGistPage, setIsGistPage] = useState(false);

    
    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsHomePage(window.location.pathname === "/");
            setIsGistPage(window.location.pathname === "/gists");
        }
    }, []);
    
 
  return (
    <div className="w-full flex justify-between items-center gap-3 bg-black text-white px-5 h-[9vh]">
        <Link href="/" className="text-xl font-semibold">
            GistVu
        </Link>

        {
            !isHomePage && !isGistPage &&  (                     
            <Button
                onClick={copyToClipboard}
                variant="default"
                className="cursor-pointer"
            >   
                <Copy size={16}/>
                {/* Copy */}
            </Button>
            )
        }

        {
            isHomePage && 
            (<div className="flex items-center justify-center gap-4">
                <Link
                    href={"/gists"}
                    className="w-full flex justify-center items-center gap-1 p-2 text-primary bg-black rounded-md cursor-pointer hover:text-blue-500 hover:underline px-4"
                >
                    View all Gists
                    <ArrowRight size={16}/>
                </Link>
                <Button
                    onClick={createGistHandler}
                    className="border border-gray-800 cursor-pointer hover:text-blue-500"
                    title="Upload Gist"
                >   
                    {
                        loading ? 
                        <Loader/>:
                        <Share />
                    }
                </Button>
            </div>)
        }
  </div>
  )
}