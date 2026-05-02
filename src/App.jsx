import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

export default function App() {
    const posRef = useRef({ x: 300, y: 0, vy: 0 });
    const keysRef = useRef({});
    const animRef = useRef(null);
    const stageRef = useRef(null);
    const [pos, setPos] = useState({ x: 300, y: 0 });
    const [showDiv, setShowDiv] = useState(false);
    const soundRef = useRef(null);

    useEffect(() => {
        soundRef.current = new Audio("/sounds/ppt_open.wav");
        soundRef.current.volume = 0.2;
        
        const down = (e) => {
            keysRef.current[e.key] = true;
            if (e.key === "e") {
                setShowDiv(true);
                soundRef.current.currentTime = 0;
                soundRef.current.play();
            }
        };
        const up = (e) => {
            keysRef.current[e.key] = false;
        };
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => {
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
        };
    }, []);

    useEffect(() => {
        const GRAVITY = 0.4;
        const JUMP = -8;
        const SPEED = 2.5;
        const GROUND = 0;
        const RADIUS = 24;

        const loop = () => {
            const k = keysRef.current;
            const p = posRef.current;
            const stageW = stageRef.current?.offsetWidth ?? 700;

            const moving = k["ArrowLeft"] || k["a"] || k["ArrowRight"] || k["d"] || k["ArrowUp"] || k[" "] || k["w"];
            if (moving) {
                setShowDiv(false);
            }
            
            if (k["ArrowLeft"] || k["a"]) {
                p.x = Math.max(RADIUS, p.x - SPEED);  
            } 
            if (k["ArrowRight"] || k["d"]) {
                p.x = Math.min(stageW - RADIUS, p.x + SPEED);
            }

            if ((k["ArrowUp"] || k[" "] || k["w"]) && p.y >= GROUND) {
                p.vy = JUMP;
            }

            p.vy += GRAVITY;
            p.y = Math.min(GROUND, p.y + p.vy);
            if (p.y >= GROUND) { p.y = GROUND; p.vy = 0; }
            
            if (k["e"]) {
                    
            }
            
            setPos({ x: p.x, y: p.y });
            animRef.current = requestAnimationFrame(loop);
        };

        animRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animRef.current);
    }, []);
    
    const GROUND_H = 60;
    const RADIUS = 24;
    const ballBottom = GROUND_H + (-pos.y);

    return (
        <div
            ref={stageRef}
            style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                background: "#e8d9b0",
            }}
        >
            {/* Ground */}
            <div style={{
                position: "absolute",
                bottom: 0, left: 0, right: 0,
                height: `${GROUND_H}px`,
                background: "#c4a86a",
                borderTop: "2px solid #a08848",
            }} />

            {/* Player Menu */}
            {showDiv && (<div style={{
                position: "absolute",
                left: pos.x + 40,
                bottom: ballBottom + RADIUS * 2 + 8,
                width: 160,
                height: 180,
                background: "rgba(0, 0, 0, 0.4)",
                borderRadius: 6
            }} />)}
            
            {/* Stand-in for Sackboy */}
            <motion.div
                style={{
                    position: "absolute",
                    left: pos.x - RADIUS,
                    bottom: ballBottom,
                    width: RADIUS * 2,
                    height: RADIUS * 2,
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 35% 35%, #A0522D, #7B3F00)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
            />
        </div>
    );
}