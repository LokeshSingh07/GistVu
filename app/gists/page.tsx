"use client"
import { deleteGist, getAllGist } from "@/app/actions/gist"
import { AppBar } from "@/components/ui/AppBar";
import {
  Copy, Eye, LayoutGrid, List, Trash2, Upload, FileCode2,
  Lock, Globe, Search, Plus, ArrowUpDown, Check
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react"
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

type ViewMode = "grid" | "list";
type SortMode = "newest" | "oldest" | "title";

const LANGUAGE_COLORS: Record<string, string> = {
  javascript: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  typescript: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  python: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  java: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  html: "bg-red-400/10 text-red-400 border-red-400/20",
  css: "bg-sky-400/10 text-sky-400 border-sky-400/20",
  go: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
  rust: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  default: "bg-zinc-400/10 text-zinc-400 border-zinc-400/20",
};

function getLanguageColor(lang?: string) {
  return LANGUAGE_COLORS[lang?.toLowerCase() || ""] || LANGUAGE_COLORS.default;
}

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, "y"], [2592000, "mo"], [86400, "d"], [3600, "h"], [60, "m"],
  ];
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count}${label} ago`;
  }
  return "just now";
}

export default function AllGists() {
  const [gists, setGists] = useState<Gist[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("list");
  const [sort, setSort] = useState<SortMode>("newest");
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getAllGistHandler = async () => {
    setLoading(true);
    try {
      const response = await getAllGist();
      setGists(response?.gists ?? []);
    }
    catch (err) {
      console.log(err);
      toast.error("Failed to load gists.");
    }
    setLoading(false);
  }

  const handleDeleteGist = async (id: string) => {
    setDeletingId(id);
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
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/gist/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  }

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  useEffect(() => {
    getAllGistHandler();
  }, [])

  const visibleGists = useMemo(() => {
    let result = gists;

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (g) =>
          g.title?.toLowerCase().includes(q) ||
          g.language?.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      if (sort === "title") return (a.title || "").localeCompare(b.title || "");
      const aTime = new Date(a.updatedAt).getTime();
      const bTime = new Date(b.updatedAt).getTime();
      return sort === "newest" ? bTime - aTime : aTime - bTime;
    });

    return result;
  }, [gists, query, sort]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-zinc-950">
      <AppBar />

      <div className="max-w-5xl w-full flex-1 flex flex-col mx-auto my-10 px-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Your Gists</h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              {loading ? "Loading..." : `${visibleGists.length} of ${gists.length} gist${gists.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-black bg-white hover:bg-white/90 transition-colors rounded-lg px-3.5 py-2"
          >
            <Plus size={15} />
            New Gist
          </Link>
        </div>

        {/* Toolbar */}
        {!loading && gists.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or language..."
                className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 text-sm rounded-lg pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-white/10 focus:border-zinc-600 transition-all"
              />
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortMode)}
                className="appearance-none bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg pl-8 pr-8 py-2 outline-none focus:ring-2 focus:ring-white/10 focus:border-zinc-600 cursor-pointer"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="title">Title A–Z</option>
              </select>
              <ArrowUpDown size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            </div>

            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
              <button
                onClick={() => setView("list")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  view === "list" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
                title="List view"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setView("grid")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  view === "grid" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
                title="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "flex flex-col gap-3"}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-4 animate-pulse">
                <div className="h-4 w-2/3 bg-zinc-800 rounded mb-3" />
                <div className="h-3 w-full bg-zinc-800 rounded mb-2" />
                <div className="h-3 w-1/2 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        ) : gists.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 rounded-xl">
            <FileCode2 className="text-zinc-700 mb-3" size={36} />
            <p className="text-zinc-400 font-medium">No gists yet</p>
            <p className="text-zinc-600 text-sm mt-1 mb-4">Create your first gist to see it here.</p>
            <Link
              href="/gist/new"
              className="flex items-center gap-1.5 text-sm font-medium text-black bg-white hover:bg-white/90 transition-colors rounded-lg px-4 py-2"
            >
              <Plus size={15} />
              Create a Gist
            </Link>
          </div>
        ) : visibleGists.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 rounded-xl">
            <Search className="text-zinc-700 mb-3" size={32} />
            <p className="text-zinc-400 font-medium">No matches for &ldquo;{query}&rdquo;</p>
            <p className="text-zinc-600 text-sm mt-1">Try a different search term.</p>
          </div>
        ) : (
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "flex flex-col gap-3"}>
            {visibleGists.map((gist) => (
              <div
                key={gist.id}
                className="group flex flex-col border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900 transition-colors rounded-lg p-4"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-white truncate">{gist?.title}</h2>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`flex items-center gap-1 text-xs border rounded-full px-2 py-0.5 ${getLanguageColor(gist?.language)}`}>
                        <FileCode2 size={11} />
                        {gist?.language || "text"}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-full px-2 py-0.5">
                        {gist?.visibility === "private" ? <Lock size={11} /> : <Globe size={11} />}
                        {gist?.visibility || "public"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDeleteGist(gist.id)}
                      disabled={deletingId === gist.id}
                      className="p-2 rounded-md text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete Gist"
                    >
                      <Trash2 size={15} />
                    </button>
                    <button
                      onClick={() => handleCopyLink(gist.id)}
                      className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Copy Gist Link"
                    >
                      <Upload size={15} />
                    </button>
                    <Link
                      href={`gist/${gist.id}`}
                      className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="View Gist"
                    >
                      <Eye size={15} />
                    </Link>
                    <button
                      onClick={() => handleCopyCode(gist.id, gist?.code)}
                      className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Copy Code"
                    >
                      {copiedId === gist.id ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                    </button>
                  </div>
                </div>

                <pre className="mt-3 text-xs text-zinc-500 font-mono bg-black/30 border border-zinc-800/60 rounded-md px-3 py-2 line-clamp-2 overflow-hidden">
                  {gist?.code}
                </pre>

                <div className="text-xs text-zinc-600 mt-2">
                  Updated {timeAgo(gist?.updatedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}