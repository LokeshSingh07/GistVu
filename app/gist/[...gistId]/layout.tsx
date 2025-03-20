import React from "react"

export default function GistLayout({children}: Readonly<{children: React.ReactNode}>){

    return (
        <div>
            {children}
        </div>
    )
}