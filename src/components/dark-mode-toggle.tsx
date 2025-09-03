"use client";

import { useEffect, useState } from "react";

export default function DarkModeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const totalFrames = 9;
    const animationMs = 220;

    useEffect(() => {
        const dark = localStorage.getItem("theme") === "dark";
        setIsDark(dark);
        document.documentElement.classList.toggle("dark", dark);
    }, []);

    const toggle = () => {
        if (isAnimating) return; //ignore spam clicks

        setIsAnimating(true);
        setIsDark((prev) => {
            const next = !prev;
            document.documentElement.classList.toggle("dark", next);
            localStorage.setItem("theme", next ? "dark" : "light");
            return next;
        });
        setTimeout(() => setIsAnimating(false), animationMs);
    };

    return (
        <button
            onClick={toggle}
            disabled={isAnimating}
            className="relative inline-block w-16 h-8 cursor-pointer outline-none focus-visible:ring ring-offset-2 ring-foreground/40"
            style={{
                backgroundImage: 'url("/toggle.png")',
                backgroundRepeat: "no-repeat",
                backgroundSize: `${totalFrames * 100}% 100%`,
                backgroundPosition: isDark ? "100% 0" : "0 0",
                transition: `background-position ${animationMs}ms steps(${totalFrames - 1})`,
                imageRendering: "pixelated",
            }}
        />
    );
}
