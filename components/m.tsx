"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
squareSize?: number;
gridGap?: number;
flickerChance?: number;
color?: string;
width?: number;
height?: number;
className?: string;
maxOpacity?: number;
startImmediately?: boolean;
}

const FlickeringGrid = ({
squareSize = 4,
gridGap = 6,
flickerChance = 0.3,
color = "rgb(0, 0, 0)",
width,
height,
className,
maxOpacity = 0.3,
startImmediately = false,
...props
}: FlickeringGridProps) => {
const canvasRef = useRef<HTMLCanvasElement>(null);
const containerRef = useRef<HTMLDivElement>(null);
const [isInView, setIsInView] = useState(false);

const gridStateRef = useRef<{
squares: Float32Array;
cols: number;
rows: number;
dpr: number;
lastMaxOpacity: number;
}>({
squares: new Float32Array(0),
cols: 0,
rows: 0,
dpr: 1,
lastMaxOpacity: maxOpacity,
});

const memoizedColor = useMemo(() => {
const toRGBA = (colorValue: string) => {
if (typeof window === "undefined") return `rgba(0,0,0,`;
if (typeof document === "undefined") return `rgba(0,0,0,`;
const tempCanvas = document.createElement("canvas");
tempCanvas.width = tempCanvas.height = 1;
const ctx = tempCanvas.getContext("2d");
if (!ctx) return `rgba(0,0,0,`;
ctx.fillStyle = colorValue;
ctx.fillRect(0, 0, 1, 1);
const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
return `rgba(${r},${g},${b},`;
};
return toRGBA(color);
}, [color]);

useEffect(() => {
const canvas = canvasRef.current;
const container = containerRef.current;
if (!canvas || !container) return;

const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
gridStateRef.current.dpr = dpr;

const updateGridStructure = () => {
const currentWidth = width || container.clientWidth;
const currentHeight = height || container.clientHeight;

if (
canvas.width !== currentWidth * dpr ||
canvas.height !== currentHeight * dpr
) {
canvas.width = currentWidth * dpr;
canvas.height = currentHeight * dpr;
canvas.style.width = `${currentWidth}px`;
canvas.style.height = `${currentHeight}px`;
}

const newCols = Math.ceil(currentWidth / (squareSize + gridGap));
const newRows = Math.ceil(currentHeight / (squareSize + gridGap));

if (
newCols !== gridStateRef.current.cols ||
newRows !== gridStateRef.current.rows ||
maxOpacity !== gridStateRef.current.lastMaxOpacity
) {
gridStateRef.current.cols = newCols;
gridStateRef.current.rows = newRows;
gridStateRef.current.squares = new Float32Array(newCols * newRows);
if (typeof window !== "undefined") {
for (let i = 0; i < gridStateRef.current.squares.length; i++) {
gridStateRef.current.squares[i] = Math.random() * maxOpacity;
}
}
gridStateRef.current.lastMaxOpacity = maxOpacity;
}
};

updateGridStructure();
const resizeObserver = new ResizeObserver(updateGridStructure);
resizeObserver.observe(container);
return () => resizeObserver.disconnect();
}, [width, height, squareSize, gridGap, maxOpacity]);

useEffect(() => {
const canvas = canvasRef.current;
if (!canvas || !isInView) return;
const ctx = canvas.getContext("2d");
if (!ctx) return;

let animationFrameId: number;
let lastTime = typeof performance !== "undefined" ? performance.now() : Date.now();

const animate = (time: number) => {
const deltaTime = (time - lastTime) / 1000;
lastTime = time;
const { squares, cols, rows, dpr } = gridStateRef.current;

for (let i = 0; i < squares.length; i++) {
if (Math.random() < flickerChance * deltaTime) {
squares[i] = Math.random() * maxOpacity;
}
squares[i] = Math.min(squares[i] || 0, maxOpacity);
}

ctx.clearRect(0, 0, canvas.width, canvas.height);
for (let i = 0; i < cols; i++) {
for (let j = 0; j < rows; j++) {
const index = i * rows + j; 
if (index < squares.length) {
const currentOpacity = squares[index];
ctx.fillStyle = `${memoizedColor}${currentOpacity})`;
ctx.fillRect(
i * (squareSize + gridGap) * dpr,
j * (squareSize + gridGap) * dpr,
squareSize * dpr,
squareSize * dpr
);
}
}
}
animationFrameId = requestAnimationFrame(animate);
};
animationFrameId = requestAnimationFrame(animate);
return () => cancelAnimationFrame(animationFrameId);
}, [isInView, memoizedColor, flickerChance, maxOpacity, squareSize, gridGap]);

useEffect(() => {
if (startImmediately && !isInView) {
setIsInView(true);
}
if (startImmediately) return;
const canvas = canvasRef.current;
if (!canvas) return;
const observer = new IntersectionObserver(
([entry]) => {
if (entry) setIsInView(entry.isIntersecting);
},
{ threshold: 0.01 }
);
observer.observe(canvas);
return () => {
observer.disconnect();
};
}, [startImmediately, isInView]);

return (
<div
ref={containerRef}
className={cn("h-full w-full", className)}
{...props}
>
<canvas ref={canvasRef} className="pointer-events-none" />
</div>
);
};


interface GeneratedGridSettings {
color: string;
maxOpacity: number;
flickerChance: number;
squareSize: number;
gridGap: number;
}

const svgDataUrlForEffect: string | null = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAxIiBoZWlnaHQ9IjkzIiB2aWV3Qm94PSIwIDAgMTAxIDkzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMzkuNTg5NSA5MS43MkMzOS4xNjI4IDkxLjcyIDM4Ljc3ODggOTEuNTkyIDM4LjQzNzUgOTEuMzM2QzM4LjA5NjIgOTEuMDggMzcuOTI1NSA5MC41MjUzIDM3LjkyNTUgODkuNjcyTDM2LjY0NTUgMTEuNTkyQzM2LjY0NTUgMTAuOTk0NyAzNi40MzIyIDEwLjY5NiAzNi4wMDU1IDEwLjY5NkMzNS42NjQyIDEwLjY5NiAzNS40MDgyIDEwLjk1MiAzNS4yMzc1IDExLjQ2NEwxNi40MjE1IDgxLjk5MkMxNS44MjQyIDg0LjM4MTMgMTUuNzgxNSA4Ni4yMTYgMTYuMjkzNSA4Ny40OTZDMTYuODkwOCA4OC42OTA3IDE4LjIxMzUgODkuNDU4NyAyMC4yNjE1IDg5LjhMMjEuNzk3NSA5MC4wNTZDMjIuODIxNSA5MC4xNDEzIDIzLjMzMzUgOTAuNjEwNyAyMy4zMzM1IDkxLjQ2NEMyMy4zMzM1IDkyLjQ4OCAyMi41MjI4IDkzIDIwLjkwMTUgOTNIMi44NTM1QzEuNTczNSA5MyAwLjkzMzUgOTIuNTczMyAwLjkzMzUgOTEuNzJDMC45MzM1IDkwLjc4MTMgMS42MTYxNyA5MC4yMjY3IDIuOTgxNSA5MC4wNTZMNC43NzM1IDg5LjhDNy4wNzc1IDg5LjQ1ODcgOC43ODQxNyA4OC42OTA3IDkuODkzNSA4Ny40OTZDMTEuMDAyOCA4Ni4yMTYgMTEuODU2MiA4NC4zODEzIDEyLjQ1MzUgODEuOTkyTDMxLjc4MTUgOS4yODc5OUMzMi4yMDgyIDcuNDk2IDMyLjIwODIgNi4zMDEzMyAzMS43ODE1IDUuNzAzOTlDMzEuMzU0OCA1LjEwNjY2IDMwLjIwMjggNC42MzczMyAyOC4zMjU1IDQuMjk2TDI2LjE0OTUgMy45MTE5OUMyNC43ODQyIDMuNjU1OTkgMjQuMTAxNSAzLjEwMTMzIDI0LjEwMTUgMi4yNDc5OUMyNC4xMDE1IDEuMzA5MzMgMjQuODY5NSAwLjgzOTk5NiAyNi40MDU1IDAuODM5OTk2SDQxLjc2NTVDNDQuMjQwMiAwLjgzOTk5NiA0NS40Nzc1IDIuMTIgNDUuNDc3NSA0LjY3OTk5TDQ2LjI0NTUgNjguMjk2QzQ2LjI0NTUgNjguODkzMyA0Ni40MTYyIDY5LjIzNDcgNDYuNzU3NSA2OS4zMkM0Ny4xODQyIDY5LjMyIDQ3LjUyNTUgNjkuMDY0IDQ3Ljc4MTUgNjguNTUyTDc4Ljc1NzUgNC4wMzk5OUM3OS43ODE1IDEuOTA2NjYgODEuNDAyOCAwLjgzOTk5NiA4My42MjE1IDAuODM5OTk2SDk5LjEwOTVDMTAwLjEzNCAwLjgzOTk5NiAxMDAuNjQ2IDEuMjY2NjYgMTAwLjY0NiAyLjEyQzEwMC42NDYgMi45NzMzMyA5OS45MjAyIDMuNTI3OTkgOTguNDY5NSAzLjc4NEw5NS4zOTc1IDQuMjk2QzkzLjUyMDIgNC42MzczMyA5Mi4yNDAyIDUuMTA2NjYgOTEuNTU3NSA1LjcwMzk5QzkwLjg3NDggNi4zMDEzMyA5MC4zMjAyIDcuNDk2IDg5Ljg5MzUgOS4yODc5OUw3NS4wNDU1IDg0LjU1MkM3NC43MDQyIDg2LjM0NCA3NC43MDQyIDg3LjUzODcgNzUuMDQ1NSA4OC4xMzZDNzUuNDcyMiA4OC43MzMzIDc2LjUzODggODkuMjAyNyA3OC4yNDU1IDg5LjU0NEw4MC40MjE1IDg5LjkyOEM4MS4yNzQ4IDkwLjAxMzMgODEuODI5NSA5MC4yMjY3IDgyLjA4NTUgOTAuNTY4QzgyLjM0MTUgOTAuODI0IDgyLjQ2OTUgOTEuMTIyNyA4Mi40Njk1IDkxLjQ2NEM4Mi40Njk1IDkyLjQ4OCA4MS43MDE1IDkzIDgwLjE2NTUgOTNINTcuMzgxNUM1Ni4xODY4IDkzIDU1LjU4OTUgOTIuNTczMyA1NS41ODk1IDkxLjcyQzU1LjU4OTUgOTAuODY2NyA1Ni4yNzIyIDkwLjMxMiA1Ny42Mzc1IDkwLjA1Nkw2MC43MDk1IDg5LjU0NEM2Mi41ODY4IDg5LjIwMjcgNjMuODY2OCA4OC43MzMzIDY0LjU0OTUgODguMTM2QzY1LjMxNzUgODcuNTM4NyA2NS44NzIyIDg2LjM0NCA2Ni4yMTM1IDg0LjU1Mkw4MC42Nzc1IDExLjk3NkM4MC44NDgyIDExLjM3ODcgODAuNzIwMiAxMS4wMzczIDgwLjI5MzUgMTAuOTUyQzc5Ljg2NjggMTAuNzgxMyA3OS41MjU1IDEwLjk1MiA3OS4yNjk1IDExLjQ2NEw0MS44OTM1IDg5LjY3MkM0MS41NTIyIDkwLjUyNTMgNDEuMTY4MiA5MS4wOCA0MC43NDE1IDkxLjMzNkM0MC40MDAyIDkxLjU5MiA0MC4wMTYyIDkxLjcyIDM5LjU4OTUgOTEuNzJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K`;
const svgMaskGridSettingsForEffect: GeneratedGridSettings = {
  "color": "#00d9ff",
  "maxOpacity": 1,
  "flickerChance": 0.3,
  "squareSize": 3,
  "gridGap": 3
};
const backgroundGridSettingsForEffect: GeneratedGridSettings = {
  "color": "#00001e",
  "maxOpacity": 0.4,
  "flickerChance": 0.45,
  "squareSize": 3,
  "gridGap": 4
};

const GeneratedFlickerEffect = () => {
const maskStyle: React.CSSProperties | undefined = svgDataUrlForEffect
? {
WebkitMaskImage: `url('${svgDataUrlForEffect}')`,
WebkitMaskSize: "contain",
WebkitMaskPosition: "center",
WebkitMaskRepeat: "no-repeat",
maskImage: `url('${svgDataUrlForEffect}')`,
maskSize: "contain",
maskPosition: "center",
maskRepeat: "no-repeat",
}
: undefined;

return (
<div className="relative w-full h-screen bg-black overflow-hidden px-8">
<FlickeringGrid
className="absolute inset-0 z-0"
{...backgroundGridSettingsForEffect}
startImmediately={true}
/>
{maskStyle && (
<div className="absolute inset-0 z-10" style={maskStyle}>
<FlickeringGrid {...svgMaskGridSettingsForEffect} startImmediately={true} />
</div>
)}
</div>
);
};

export default GeneratedFlickerEffect;