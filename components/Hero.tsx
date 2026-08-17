"use client";

import React, { useCallback, useEffect, useState } from "react";
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
import { Circle } from "lucide-react";

const LANGUAGES = [
  { value: "cpp", label: "C++" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "java", label: "Java" },
  { value: "python", label: "Python" },
];

export function CodeEditor() {
  const [code, setCode] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [language, setLanguage] = useState<string>("cpp")
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const createGistHandler = useCallback(async () => {
    if (!code) {
      toast.error("No code to upload");
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setLoading(true);
      const response = await createGist({
        title,
        code,
        language,
        userId: "fc3c17"
      });

      toast.success(response?.message || "Gist created successfully");
      setIsDirty(false);
    }
    catch (err) {
      console.error("Error fetching code:", err);
      toast.error("Failed to create gist. Please try again.");
    }
    finally {
      setLoading(false);
    }
  }, [code, title, language]);

  // Ctrl/Cmd + S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (!loading) createGistHandler();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [createGistHandler, loading]);

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || "");
    setIsDirty(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsDirty(true);
  };

  const lineCount = code ? code.split("\n").length : 0;
  const charCount = code.length;

  return (
    <div className="w-full h-screen flex flex-col bg-zinc-950">
      <AppBar
        createGistHandler={createGistHandler}
        loading={loading}
      />

      {/* Toolbar */}
      <div className="w-full flex flex-wrap items-center gap-3 px-5 py-3 bg-zinc-950 border-b border-zinc-800">
        <div className="flex-1 min-w-[200px] max-w-lg">
          <Input
            type="text"
            value={title}
            placeholder="Untitled gist"
            onChange={handleTitleChange}
            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-white/10 focus-visible:border-zinc-600"
          />
        </div>

        <Select onValueChange={(v) => { setLanguage(v); setIsDirty(true); }} value={language}>
          <SelectTrigger className="w-fit bg-zinc-900 border-zinc-800 text-white">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Language</SelectLabel>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1.5 text-xs text-zinc-500 ml-auto">
          {isDirty ? (
            <>
              <Circle size={7} className="fill-amber-400 text-amber-400" />
              Unsaved changes
            </>
          ) : (
            <>
              <Circle size={7} className="fill-emerald-500 text-emerald-500" />
              Saved
            </>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <MonacoEditor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          onMount={(editor) => {
            editor.onDidChangeCursorPosition((e) => {
              setCursorPos({ line: e.position.lineNumber, col: e.position.column });
            });
          }}
          options={{
            lineNumbers: "on",
            minimap: { enabled: true },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            padding: { top: 12 },
            smoothScrolling: true,
            cursorBlinking: "smooth",
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      {/* Status bar */}
      <div className="w-full flex items-center justify-between px-5 py-1.5 bg-zinc-900 border-t border-zinc-800 text-xs text-zinc-500">
        <div className="flex items-center gap-4">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span>{lineCount} lines</span>
          <span>{charCount} characters</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="uppercase tracking-wide">{language}</span>
          <span className="text-zinc-700">•</span>
          <span>⌘S to save</span>
        </div>
      </div>
    </div>
  );
}