"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export function ReminderDialog({
  trigger,
  defaultRace,
}: {
  trigger: React.ReactNode;
  defaultRace: string;
}) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [race, setRace] = useState(defaultRace);
  const [contact, setContact] = useState("");

  useEffect(() => {
    if (!open) {
      const timeout = window.setTimeout(() => setSubmitted(false), 200);
      return () => window.clearTimeout(timeout);
    }
  }, [open]);

  const label = useMemo(() => (submitted ? "You're on the list" : "Notify Me"), [submitted]);

  return (
    <>
      <div onClick={() => setOpen(true)} className="inline-flex cursor-pointer">
        {trigger}
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 sm:items-center sm:p-6">
          <Card className="w-full max-w-xl border border-white/10 bg-[#111111] p-6 text-left shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">Reminder</p>
                <h3 className="mt-2 text-2xl font-semibold text-[#F5F5F0]">Set a race alert</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/70"
              >
                Close
              </button>
            </div>

            <p className="mt-3 text-sm text-white/70">
              Mock reminder form for the next race. No backend is connected in this prototype.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="race">Race</Label>
                <Select value={race} onValueChange={setRace}>
                  <SelectTrigger id="race" className="mt-2 bg-black/20">
                    <SelectValue placeholder="Select race" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={defaultRace}>{defaultRace}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contact">Email or phone</Label>
                <Input
                  id="contact"
                  className="mt-2 bg-black/20"
                  placeholder="you@example.com"
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={() => {
                  setSubmitted(true);
                  setContact("");
                }}
                className="bg-[#E4272A] text-[#F5F5F0] hover:bg-[#E4272A]/90"
              >
                {label}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Keep browsing
              </Button>
            </div>
            {submitted ? <p className="mt-4 text-sm text-[#D4FF3F]">Mock success state: reminder queued for review.</p> : null}
          </Card>
        </div>
      ) : null}
    </>
  );
}
