"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import type { RaceVideo } from "@/data/about";

interface VideoModalProps {
  race: RaceVideo | null;
  onClose: () => void;
}

/**
 * Accessible video lightbox powered by native <dialog> + showModal().
 * Browser handles top-layer rendering, inert page, focus containment,
 * Esc dismissal, and focus restoration to the invoking card button.
 * Video/iframe is mounted only while open (lazy-loaded on demand).
 */
export function VideoModal({ race, onClose }: VideoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (race) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [race]);

  // Progressive enhancement fallback for browsers without native closedby="any" (e.g. Safari)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if ("closedBy" in HTMLDialogElement.prototype) return;

    let pressedOutside = false;
    const isOutside = (e: PointerEvent) => {
      const rect = dialog.getBoundingClientRect();
      return (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      );
    };

    const onPointerDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e);
    };
    const onPointerUp = (e: PointerEvent) => {
      if (pressedOutside && isOutside(e)) {
        dialog.close();
      }
      pressedOutside = false;
    };

    dialog.addEventListener("pointerdown", onPointerDown);
    dialog.addEventListener("pointerup", onPointerUp);
    return () => {
      dialog.removeEventListener("pointerdown", onPointerDown);
      dialog.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  const handleClose = () => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.returnValue = "";
    }
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={handleClose}
      {...({ closedby: "any" } as Record<string, string>)}
      className="m-auto w-[min(92vw,60rem)] rounded-[1.75rem] border border-white/15 bg-[#111111] p-0 text-[#F5F5F0] shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-md open:flex open:flex-col"
    >
      {race && (
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#D4FF3F]">
                {race.result} · {race.date}
              </p>
              <h1
                id={titleId}
                className="mt-1 text-lg font-bold tracking-[-0.02em] text-[#F5F5F0] sm:text-xl"
              >
                {race.title}
              </h1>
              <p className="text-xs text-white/50">{race.venue}</p>
            </div>

            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              aria-label="Close race video"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:border-[#D4FF3F] hover:text-[#D4FF3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Media container — mounted only when open */}
          <div className="relative aspect-video w-full bg-black">
            {race.type === "youtube" ? (
              <iframe
                src={`${race.videoUrl}${race.videoUrl.includes("?") ? "&" : "?"}autoplay=1&rel=0`}
                title={`${race.title} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            ) : (
              <video
                src={race.videoUrl}
                poster={race.thumbnail}
                controls
                autoPlay
                playsInline
                className="h-full w-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
