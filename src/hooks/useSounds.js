import { useRef, useEffect } from "react";

const BASE = import.meta.env.BASE_URL;

export function useSounds() {
    const open = useRef(null);
    const close = useRef(null);
    const select = useRef(null);

    useEffect(() => {
        open.current = new Audio(`${BASE}sounds/ppt_open.wav`);
        close.current = new Audio(`${BASE}sounds/ppt_close.wav`);
        select.current = new Audio(`${BASE}sounds/ppt_select.wav`);
        open.current.volume = 0.2;
        close.current.volume = 0.2;
        select.current.volume = 0.2;
    }, []);

    const play = (ref) => {
        ref.current.currentTime = 0;
        ref.current.play();
    };

    return {
        playOpen: () => play(open),
        playClose: () => play(close),
        playSelect: () => play(select),
    };
}
