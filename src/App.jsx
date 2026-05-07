import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shirt, Sticker, Cog, CircleHelp, MessageCircleMore, Gamepad2, BookUser, Paintbrush, AlarmClock, ArrowLeft } from "lucide-react";

const BUTTONS = [
    { icon: Shirt, label: "Costume" },
    { icon: Sticker, label: "Stickers" },
    { icon: Cog, label: "Settings" },
    { icon: CircleHelp, label: "Help" },
    { icon: MessageCircleMore, label: "Messages" },
    { icon: Gamepad2, label: "Controls" },
    { icon: BookUser, label: "Profile" },
    { icon: Paintbrush, label: "Create" },
    { icon: AlarmClock, label: "History" },
];

export default function App() {
    const [showDiv, setShowDiv] = useState(false);
    const [popItKey, setPopItKey] = useState(0);
    const [closing, setClosing] = useState(false);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
    const [popItHeight, setPopItHeight] = useState(0);
    const [activePanel, setActivePanel] = useState(null);
    const openSoundRef = useRef(null);
    const closeSoundRef = useRef(null);
    const selectSoundRef = useRef(null);
    const popItRef = useRef(null);

    useEffect(() => {
        openSoundRef.current = new Audio("/SackboyUI/sounds/ppt_open.wav");
        closeSoundRef.current = new Audio("/SackboyUI/sounds/ppt_close.wav");
        selectSoundRef.current = new Audio("/SackboyUI/sounds/ppt_select.wav");
        openSoundRef.current.volume = 0.2;
        closeSoundRef.current.volume = 0.2;
        selectSoundRef.current.volume = 0.2;
    }, []);

    useEffect(() => {
        if (showDiv && popItRef.current) {
            setPopItHeight(popItRef.current.offsetHeight);
        }
    }, [showDiv, activePanel]);

    const handleToggle = () => {
        if (showDiv) {
            setClosing(true);
            closeSoundRef.current.currentTime = 0;
            closeSoundRef.current.play();
            setTimeout(() => {
                setShowDiv(false);
                setClosing(false);
                setActivePanel(null);
            }, 300);
        } else {
            setClosing(false);
            setActivePanel(null);
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
    };

    const handleButtonClick = (e, item) => {
        e.stopPropagation();
        selectSoundRef.current.currentTime = 0;
        selectSoundRef.current.play();
        setActivePanel(item);
    };

    const handleBack = (e) => {
        e.stopPropagation();
        selectSoundRef.current.currentTime = 0;
        selectSoundRef.current.play();
        setActivePanel(null);
    };

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
                        layout
                        ref={popItRef}
                        key={popItKey}
                        onClick={e => e.stopPropagation()}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={closing ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                        transition={{
                            layout: { type: "spring", stiffness: 400, damping: 30 },
                            scale: { type: "spring", stiffness: 300, damping: 18 },
                            opacity: { duration: 0.1 },
                        }}
                        style={{
                            position: "fixed",
                            left: menuPos.x,
                            top: menuPos.y - popItHeight,
                            background: `linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0)), #f521b9`,
                            borderRadius: 12,
                            padding: 16,
                            width: 280,
                            transformOrigin: "bottom left",
                            overflow: "hidden",
                        }}
                    >
                        <AnimatePresence mode="popLayout">
                            {!activePanel ? (
                                <motion.div
                                    key="grid"
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        layout: { type: "spring", stiffness: 400, damping: 30 },
                                        opacity: { duration: 0.1 },
                                    }}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(3, 1fr)",
                                        gap: 10,
                                    }}
                                >
                                    {BUTTONS.map((item, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ scale: 1.2, opacity: 0.9 }}
                                            transition={{ type: "spring", stiffness: 200 }}
                                            onClick={(e) => handleButtonClick(e, item)}
                                            style={{
                                                padding: "22px 0",
                                                cursor: "pointer",
                                                background: "none",
                                                border: "none",
                                            }}
                                        >
                                            <item.icon size={38} color="white" />
                                        </motion.button>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="subpanel"
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        layout: { type: "spring", stiffness: 400, damping: 30 },
                                        opacity: { duration: 0.1 },
                                    }}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 12,
                                        minHeight: 180,
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <motion.button
                                            whileHover={{ scale: 1.15 }}
                                            onClick={handleBack}
                                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                                        >
                                            <ArrowLeft size={22} color="white" />
                                        </motion.button>
                                        <activePanel.icon size={22} color="white" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}