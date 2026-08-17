"use client"

import { signin } from "@/app/actions/user"
import { ChangeEvent, useState } from "react"
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import Link from "next/link";

export default function SigninPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendRequest = async () => {
    if (!formData.username || !formData.password) {
      toast.error("Username and password are required");
      return;
    }

    setLoading(true);
    try {
      const response = await signin(formData);

      if (!response?.success) {
        toast.error(response?.message || "Signin failed");
        return;
      }

      toast.success(response?.message || "Login successful");
      router.push("/");
    }
    catch (err) {
      console.log(err);
      toast.error("Something went wrong. Please try again later.");
    }
    finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendRequest();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm bg-zinc-900 rounded-2xl shadow-lg shadow-black/40 border border-zinc-800 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-zinc-400 mt-1">Sign in to your account to continue</p>
        </div>

        <div onKeyDown={handleKeyDown}>
          <LabelledInput
            label="Username"
            type="text"
            placeholder="Enter your username"
            icon={<User className="w-4 h-4 text-zinc-500" />}
            value={formData.username}
            onchange={(e) => {
              setFormData((prev) => ({
                ...prev,
                username: e.target.value
              }))
            }}
          />

          <LabelledInput
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            icon={<Lock className="w-4 h-4 text-zinc-500" />}
            value={formData.password}
            onchange={(e) => {
              setFormData((prev) => ({
                ...prev,
                password: e.target.value
              }))
            }}
            rightElement={
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((s) => !s)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          <button
            type="button"
            onClick={sendRequest}
            disabled={loading}
            className="w-full mt-2 text-black bg-white hover:bg-white/85 active:bg-white/90 focus:ring-4 focus:ring-zinc-700 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            )}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <p className="text-center text-sm text-zinc-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-white font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

interface LabelledInputProps {
  label: string,
  type?: string,
  placeholder: string,
  value?: string,
  icon?: React.ReactNode,
  rightElement?: React.ReactNode,
  onchange?: (e: ChangeEvent<HTMLInputElement>) => void
}

function LabelledInput({ label, type, placeholder, value, icon, rightElement, onchange }: LabelledInputProps) {
  return (
    <div className="flex flex-col mb-4">
      <label className="text-sm font-medium text-zinc-300 mb-1.5">{label}</label>
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 flex items-center pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={type || "text"}
          placeholder={placeholder}
          value={value}
          onChange={onchange}
          className={`bg-zinc-800/70 border border-zinc-700 text-white placeholder:text-zinc-500 text-sm rounded-lg p-2.5 outline-none transition-all focus:ring-2 focus:ring-white/20 focus:border-zinc-500 w-full ${icon ? "pl-9" : ""} ${rightElement ? "pr-10" : ""}`}
        />
        {rightElement && (
          <span className="absolute right-3 flex items-center">
            {rightElement}
          </span>
        )}
      </div>
    </div>
  )
}