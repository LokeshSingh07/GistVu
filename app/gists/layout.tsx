import React from "react"

export default function GistsLayout({children}: Readonly<{children: React.ReactNode}>){

    return (
        <div>
            {children}
        </div>
    )
}