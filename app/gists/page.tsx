"use client"
import { deleteGist, getAllGist } from "@/app/actions/gist"
import { AppBar } from "@/components/ui/AppBar";
import { Copy, Eye, Pencil, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";



interface Gist {
  id: string;
  title: string;
  code: string;
  language: string;
  visibility: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function AllGists(){
  const [gists, setGists] = useState<Gist[]>([]);
  const [loading, setLoading] = useState(true);
  const router =  useRouter();

  const getAllGistHandler = async()=>{
    setLoading(true);
    try{
        const response = await getAllGist();
        // console.log("response : ", response);
        setGists(response?.gists ?? []);
    }
    catch(err){
        console.log(err);
    }
    setLoading(false);
  }


  const handleDeleteGist = async (id: string) => {
    try {
      const response = await deleteGist({ gistId: id });
      if (response?.success) {
        toast.success(response?.message || "Gist deleted successfully.");
        setGists((prev) => prev.filter((gist) => gist.id !== id));
      } else {
        toast.error(response?.message || "Failed to delete gist.");
      }
    } catch (err) {
      toast.error("An error occurred while deleting the gist.");
      console.error(err);
    }
  };



  useEffect(()=>{
      getAllGistHandler();
  },[])




  if(loading){
    return (
      <div className="w-full h-screen flex justify-center items-center"> Loading...</div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col justify-between mx-auto">
      {/* header */}
      <AppBar/>

      <div className="max-w-5xl w-full h-full flex flex-col justify-between mx-auto m-10 px-2">
        {/* <h1 className="text-center font-semibold text-xl">All Gists</h1> */}
        
        {gists.length > 0 ? 
          (<div className="flex flex-wrap gap-6">
            {
              gists.map((gist)=>(
                <div key={gist.id} className="w-full max-w-5xl flex flex-col space-y-2 border border-gray-700 px-2 py-3 lg:px-6 lg:py-4 rounded-sm">
                  <div className="flex justify-between items-center">
                    <h1 className="font-semibold text-xl text-clamp-1 truncate">{gist?.title}</h1>
                    <div className="flex justify-center items-center gap-2">
                      {/* <button 
                        onClick={()=> { }} 
                        className="border border-gray-700 rounded-sm p-2 cursor-not-allowed"
                        title="Edit Gist"
                        disabled 
                      > 
                        <Pencil size={16} color="gray"/> 
                      </button> */}
                      <button 
                        onClick={()=> { handleDeleteGist(gist.id)}} 
                        className="border border-gray-700 rounded-sm p-2 hover:text-blue-500 cursor-pointer"
                        title="Delete Gist"
                      >
                        <Trash2 size={16}/>
                      </button>
                      <button 
                        onClick={()=> {
                          const url = `${window.location.origin}/gist/${gist.id}`;
                          navigator.clipboard.writeText(url);
                          toast.success("Link copied to clipboard!");
                        }}   
                        className="border border-gray-700 rounded-sm p-2 hover:text-blue-500 cursor-pointer"
                        title="Copy Gist Link"
                      >
                        <Upload size={16}/>
                      </button>
                      <Link href={`gist/${gist.id}`} 
                        className="border border-gray-700 rounded-sm p-2 hover:text-blue-500"
                        title="View Gist"
                      >
                        <Eye size={16}/>
                      </Link>
                      <button onClick={()=> { 
                          navigator.clipboard.writeText(gist?.code) 
                          toast.success("code copied")
                        }} 
                        className="border border-gray-700 rounded-sm p-2 hover:text-blue-500 cursor-pointer"
                        title="Copy Code"
                      >
                        <Copy size={16}/>
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex-5 line line-clamp-2 text-slate-200">{gist?.code}</div>
                    <div className="flex-2 flex flex-col justify-center items-end">
                      <div className="text-muted-foreground text-xs md:text-md">
                        {new Date(gist?.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="w-fit text-sm md:text-md text-green-600 border border-gray-700 rounded-sm mt-1 px-2 p-1">Code</div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>) : 
          (<p>No gists available.</p>)
        }
        
        
      </div>
    </div>
  )
}