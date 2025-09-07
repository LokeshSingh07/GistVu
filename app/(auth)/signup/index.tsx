// "use  client"

import { signup } from "@/app/actions/user"
import { ChangeEvent, useState } from "react"
import { toast } from "react-toastify";

export default function SignupPage(){
  const [formData, setFormData] = useState({
      username: "",
      password: ""
  })



  const sendRequest = async()=>{
    try{
      const response = await signup(formData);
      
      if(!response.message){
        toast.error(response?.message)  
      }

      toast.success(response?.message);
    }
    catch(err){
      console.log(err);
    }
    
  }




  return (
    <div>

      <LabelledInput
        label="username"
        type="text"
        placeholder="Enter your username"
        onchange={(e)=>{
          setFormData({
            ...formData,
            username: e.target.value
          })
        }}
      />

      <LabelledInput
        label="Password"
        type="password"
        placeholder="Enter your password"
        onchange={(e)=>{
          setFormData((prev)=>({
            ...prev,
            password: e.target.value
          }))
        }}
      />

      <button 
        type="button"
        onClick={sendRequest}
        className="w-full mt-5 text-white bg-black hover:bg-black/85 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
      >
        Create Account
      </button>



    </div>
  )
}




interface LabelledInputProps{
    label: string,
    type?: string,
    placeholder: string,
    onchange?: (e: ChangeEvent<HTMLInputElement>)=>void
}


function LabelledInput({label, type, placeholder, onchange}: LabelledInputProps){

  return (
    <div className="flex flex-col mb-3">
      <label className='text-sm font-semibold'>{label}</label>
      <input 
        type={type || "text"} 
        placeholder={placeholder}
        onChange={onchange}
        className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 w-full'
      />
    </div>
  )
}