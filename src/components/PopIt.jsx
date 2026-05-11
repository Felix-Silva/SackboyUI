import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useSounds } from "../hooks/useSounds";

const SPRING = { type: "spring", stiffness: 400, damping: 30 };

export default function PopIt({ buttons, color = "#f521b9", onSelect }) {
    const [open, setOpen] = useState(false);
    const [popItKey, setPopItKey] = useState(0);
    const [closing, setClosing] = useState(false);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
    const [popItHeight, setPopItHeight] = useState(0);
    const [activePanel, setActivePanel] = useState(null);
    const popItRef = useRef(null);
    const { playOpen, playClose, playSelect } = useSounds();

    useEffect(() => {
        if (open && popItRef.current) {
            setPopItHeight(popItRef.current.offsetHeight);
        }
    }, [open, activePanel]);

    const handleToggle = () => {
        if (open) {
            setClosing(true);
            playClose();
            setTimeout(() => {
                setOpen(false);
                setClosing(false);
                setActivePanel(null);
            }, 300);
        } else {
            setClosing(false);
            setActivePanel(null);
            setPopItKey(k => k + 1);
            playOpen();
            setOpen(true);
        }
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        setMenuPos({ x: e.clientX, y: e.clientY });
        handleToggle();
    };

    const handleClick = () => {
        if (open) handleToggle();
    };

    const handleButtonClick = (e, item) => {
        e.stopPropagation();
        playSelect();
        setActivePanel(item);
        onSelect?.(item);
    };

    const handleBack = (e) => {
        e.stopPropagation();
        playSelect();
        setActivePanel(null);
    };

    return (
        <div
            onContextMenu={handleContextMenu}
            onClick={handleClick}
            style={{ width: "100vw", height: "100vh", position: "fixed", inset: 0 }}
        >
            {open && (
                <motion.div
                    layout
                    ref={popItRef}
                    key={popItKey}
                    onClick={e => e.stopPropagation()}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={closing ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                    transition={{
                        layout: SPRING,
                        scale: { type: "spring", stiffness: 300, damping: 18 },
                        opacity: { duration: 0.1 },
                    }}
                    style={{
                        position: "fixed",
                        left: menuPos.x,
                        top: menuPos.y - popItHeight,
                        background: `linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0)), ${color}`,
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
                                transition={{ layout: SPRING, opacity: { duration: 0.1 } }}
                                style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}
                            >
                                {buttons.map((item, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.2, opacity: 0.9 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                        onClick={(e) => handleButtonClick(e, item)}
                                        style={{ padding: "22px 0", cursor: "pointer", background: "none", border: "none" }}
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
                                transition={{ layout: SPRING, opacity: { duration: 0.1 } }}
                                style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 180 }}
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
    );
}
