"use client"
import { Button } from "./button";
import { ArrowRight, Copy, Share, Code2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader } from "./Loader";

export const AppBar = ({
  copyToClipboard,
  createGistHandler,
  loading,
}: {
  copyToClipboard?: () => void,
  createGistHandler?: () => void,
  loading?: boolean,
}) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isGistPage = pathname === "/gists";

  return (
    <div className="sticky top-0 z-10 w-full flex justify-between items-center gap-3 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800 text-white px-5 h-16">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight hover:opacity-90 transition-opacity">
        <Code2 size={20} className="text-white" />
        GistVu
      </Link>

      {!isHomePage && !isGistPage && (
        <Button
          onClick={copyToClipboard}
          variant="default"
          className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white cursor-pointer transition-colors"
          title="Copy Gist Link"
        >
          <Copy size={16} />
        </Button>
      )}

      {isHomePage && (
        <div className="flex items-center gap-2">
          <Link
            href="/gists"
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-zinc-900"
          >
            View all Gists
            <ArrowRight size={15} />
          </Link>
          <Button
            onClick={createGistHandler}
            disabled={loading}
            className="flex items-center gap-1.5 bg-white text-black hover:bg-white/90 font-medium text-sm rounded-lg px-3.5 py-2 cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            title="Upload Gist"
          >
            {loading ? <Loader /> : <Share size={16} />}
          </Button>
        </div>
      )}
    </div>
  )
}