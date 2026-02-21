"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "@/components/locale-provider";

type IntroOverlayProps = {
  ownerNameEn: string;
  ownerNameAr: string;
  roleEn: string;
  roleAr: string;
  audioSrc?: string | null;
};

export function IntroOverlay({
  ownerNameEn,
  ownerNameAr,
  roleEn,
  roleAr,
  audioSrc
}: IntroOverlayProps) {
  const { locale } = useLocale();
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const introText = useMemo(() => {
    return locale === "ar"
      ? { name: ownerNameAr, role: roleAr, tapHint: "يلا نبلش" }
      : { name: ownerNameEn, role: roleEn, tapHint: "WE GO?!" };
  }, [locale, ownerNameAr, ownerNameEn, roleAr, roleEn]);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => setIsVisible(false), 2500);
    return () => window.clearTimeout(hideTimer);
  }, []);

  useEffect(() => {
    const enableAudio = () => {
      setHasInteracted(true);
      if (!audioRef.current || isMuted || !audioSrc) {
        return;
      }
      void audioRef.current.play().catch(() => {
        // Ignore blocked autoplay attempts.
      });
    };

    window.addEventListener("pointerdown", enableAudio, { once: true });
    return () => window.removeEventListener("pointerdown", enableAudio);
  }, [audioSrc, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.muted = isMuted;
  }, [isMuted]);

  return (
    <AnimatePresence mode="wait">
      {isVisible ? (
        <motion.div
          key="intro"
          className="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45 } }}
        >
          {audioSrc ? <audio ref={audioRef} src={audioSrc} preload="auto" /> : null}
          <button
            type="button"
            className="intro-mute"
            onClick={() => setIsMuted((value) => !value)}
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>

          <motion.p
            className="intro-kicker"
            initial={{ y: 22, opacity: 0 }}
            animate={{ y: 0, opacity: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            {introText.role}
          </motion.p>
          <motion.h1
            className="intro-name"
            initial={{ y: 35, opacity: 0, letterSpacing: "0.35em" }}
            animate={{ y: 0, opacity: 1, letterSpacing: "0.08em" }}
            transition={{ duration: 0.75, delay: 0.15 }}
          >
            {introText.name}
          </motion.h1>
          {!hasInteracted && audioSrc ? (
            <motion.p
              className="intro-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              {introText.tapHint}
            </motion.p>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
