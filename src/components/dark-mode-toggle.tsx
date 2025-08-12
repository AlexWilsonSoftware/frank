'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(false)

    // Load theme from localStorage
    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark'
        setDarkMode(isDark)
        document.documentElement.classList.toggle('dark', isDark)
    }, [])

    const toggleTheme = () => {
        const newMode = !darkMode
        setDarkMode(newMode)
        localStorage.setItem('theme', newMode ? 'dark' : 'light')
        document.documentElement.classList.toggle('dark', newMode)
    }

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center gap-2 p-2 rounded text-gray-800 dark:text-gray-200 hover:bg-sidebar-accent transition cursor-pointer"
        >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>
    )

}