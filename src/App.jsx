import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Shirt, Sticker, Cog, CircleHelp, MessageCircleMore, Gamepad2, BookUser, Palette, AlarmClock} from "lucide-react";

const BUTTONS = [
    Shirt, Sticker, Cog,
    CircleHelp, MessageCircleMore, Gamepad2,
    BookUser, Palette, AlarmClock,
];

export default function App() {
    const [showDiv, setShowDiv] = useState(false);
    const [popItKey, setPopItKey] = useState(0);
    const [closing, setClosing] = useState(false);
    const openSoundRef = useRef(null);
    const closeSoundRef = useRef(null);
    const selectSoundRef = useRef(null);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        openSoundRef.current = new Audio("/SackboyUI/sounds/ppt_open.wav");
        closeSoundRef.current = new Audio("/SackboyUI/sounds/ppt_close.wav");
        selectSoundRef.current = new Audio("/SackboyUI/sounds/ppt_select.wav");
        openSoundRef.current.volume = 0.2;
        closeSoundRef.current.volume = 0.2;
        selectSoundRef.current.volume = 0.2;
    }, []);

    const handleToggle = () => {
        if (showDiv) {
            setClosing(true);
            closeSoundRef.current.currentTime = 0;
            closeSoundRef.current.play();
            setTimeout(() => {
                setShowDiv(false);
                setClosing(false);
            }, 300);
        } else {
            setClosing(false);
            setPopItKey(k => k + 1);
            openSoundRef.current.currentTime = 0;
            openSoundRef.current.play();
            setShowDiv(true);
        }
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        setMenuPos({ x: e.clientX, y: e.clientY });
        handleToggle();
    };
    
    const handleClick = () => {
        if (showDiv) handleToggle();
    }
    
    return (
        <div
            onContextMenu={handleContextMenu}
            onClick={handleClick}
            style={{
                width: "100vw",
                height: "100vh",
                background: "#e8d9b0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={{ position: "relative" }}>
                {showDiv && (
                    <motion.div
                        key={popItKey}
                        onClick={e => e.stopPropagation()}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={closing ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        style={{
                            position: "fixed",
                            left: menuPos.x,
                            top: menuPos.y - 180 - 12,
                            transform: "translateX(-50%)",
                            background: `linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0)), #f521b9`,
                            borderRadius: 12,
                            padding: 16,
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 10,
                            width: 280,
                            transformOrigin: "bottom left",
                        }}
                    >
                        {BUTTONS.map((Icon, i) => (
                            <button key={i}
                                onClick={e => {
                                    e.stopPropagation()
                                    selectSoundRef.current.currentTime = 0;
                                    selectSoundRef.current.play();
                                }}
                                style={{
                                    padding: "8px 0",
                                    cursor: "pointer",
                                    background: "none",
                                    border: "none"
                                }}>
                                <Icon size={28} color="white" />
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}