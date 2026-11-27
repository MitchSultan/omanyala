"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { LoaderCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  contactCopy,
  enquiryTypes,
  type EnquiryTypeValue,
} from "@/data/contact";
import { FormField } from "./FormField";

interface ContactFormValues {
  fullName: string;
  email: string;
  phone: string;
  organisation: string;
  enquiryType: EnquiryTypeValue | "";
  message: string;
}

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;
type FormStatus = "idle" | "sending" | "success" | "error";

const initialValues: ContactFormValues = {
  fullName: "",
  email: "",
  phone: "",
  organisation: "",
  enquiryType: "",
  message: "",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEnquiryType(value: unknown): value is EnquiryTypeValue {
  return (
    typeof value === "string" &&
    enquiryTypes.some((option) => option.value === value)
  );
}

function validate(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const validation = contactCopy.validation;

  if (!values.fullName.trim()) errors.fullName = validation.fullNameRequired;
  else if (values.fullName.trim().length > 120) {
    errors.fullName = validation.fullNameTooLong;
  }

  const email = values.email.trim();
  if (!email) errors.email = validation.emailRequired;
  else if (email.length > 254) errors.email = validation.emailTooLong;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = validation.emailInvalid;
  }

  if (values.phone.trim().length > 40) {
    errors.phone = validation.phoneTooLong;
  }
  if (values.organisation.trim().length > 120) {
    errors.organisation = validation.organisationTooLong;
  }
  if (!isEnquiryType(values.enquiryType)) {
    errors.enquiryType = validation.enquiryTypeRequired;
  }

  const message = values.message.trim();
  if (!message) errors.message = validation.messageRequired;
  else if (message.length < 20) errors.message = validation.messageTooShort;
  else if (message.length > 5_000) errors.message = validation.messageTooLong;

  return errors;
}

function describedBy(id: string, error?: string, hint?: string) {
  return [error ? `${id}-error` : "", hint ? `${id}-hint` : ""]
    .filter(Boolean)
    .join(" ") || undefined;
}

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const checkPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const handleEnquirySelection = (event: Event) => {
      const selectedType = (event as CustomEvent<unknown>).detail;
      if (!isEnquiryType(selectedType)) return;

      setValues((current) => ({
        ...current,
        enquiryType: selectedType,
      }));
      setErrors((current) => ({ ...current, enquiryType: undefined }));
      setStatus("idle");
      setServerMessage("");
      const select = document.getElementById("enquiryType");
      if (select instanceof HTMLSelectElement) {
        select.focus({ preventScroll: true });
      }
    };

    window.addEventListener("contact:select-enquiry", handleEnquirySelection);
    return () =>
      window.removeEventListener(
        "contact:select-enquiry",
        handleEnquirySelection
      );
  }, []);

  useLayoutEffect(() => {
    if (status !== "success") return;
    const formPanel = formRef.current;
    const successPanel = successRef.current;
    const checkPath = checkPathRef.current;
    if (!formPanel || !successPanel || !checkPath) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const context = gsap.context(() => {
      gsap.set(successPanel, { autoAlpha: 0, y: 18 });

      if (reducedMotion) {
        gsap.set(formPanel, { autoAlpha: 0, display: "none" });
        gsap.set(successPanel, { autoAlpha: 1, y: 0, display: "block" });
        gsap.set(checkPath, { strokeDashoffset: 0 });
        return;
      }

      const timeline = gsap.timeline({
        onComplete: () => ScrollTrigger.refresh(),
      });
      timeline
        .to(formPanel, {
          autoAlpha: 0,
          y: -16,
          duration: 0.25,
          ease: "power2.out",
        })
        .set(formPanel, { display: "none" })
        .set(successPanel, { display: "block" })
        .fromTo(
          successPanel,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: "power3.out",
          }
        )
        .fromTo(
          checkPath,
          { strokeDashoffset: 32 },
          {
            strokeDashoffset: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "<+0.12"
        );
    }, formPanel);

    return () => context.revert();
  }, [status]);

  const updateField = <K extends keyof ContactFormValues>(
    key: K,
    value: ContactFormValues[K]
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (status === "error") {
      setStatus("idle");
      setServerMessage("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setServerMessage("");

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidField = Object.keys(nextErrors)[0];
      window.requestAnimationFrame(() => {
        document.getElementById(firstInvalidField)?.focus();
      });
      return;
    }

    const formElement = event.currentTarget;
    const website = String(new FormData(formElement).get("website") ?? "");
    setStatus("sending");

    let response: Response;
    try {
      response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website }),
      });
    } catch {
      setStatus("error");
      setServerMessage(contactCopy.networkError);
      return;
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      setStatus("error");
      setServerMessage(contactCopy.networkError);
      return;
    }

    if (!isRecord(payload)) {
      setStatus("error");
      setServerMessage(contactCopy.networkError);
      return;
    }

    if (!response.ok || payload.ok !== true) {
      if (isRecord(payload.errors)) {
        const fieldKeys: (keyof ContactFormValues)[] = [
          "fullName",
          "email",
          "phone",
          "organisation",
          "enquiryType",
          "message",
        ];
        const serverErrors: ContactFormErrors = {};
        for (const key of fieldKeys) {
          const message = payload.errors[key];
          if (typeof message === "string") serverErrors[key] = message;
        }
        setErrors(serverErrors);
      }

      setStatus("error");
      setServerMessage(
        typeof payload.message === "string"
          ? payload.message
          : contactCopy.errorTitle
      );
      return;
    }

    setStatus("success");
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setServerMessage("");
    setStatus("idle");
  };

  return (
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
        {contactCopy.formEyebrow}
      </p>
      <h2
        id="contact-form-heading"
        className="mt-3 text-2xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-3xl"
      >
        {contactCopy.formTitle}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
        {contactCopy.formIntro}
      </p>

      <div className="mt-8">
        <form
          ref={formRef}
          id="contact-form"
          noValidate
          onSubmit={handleSubmit}
          className="scroll-mt-28 relative space-y-6"
          aria-hidden={status === "success"}
          inert={status === "success"}
        >
          <div
            aria-hidden="true"
            className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
          >
            <label htmlFor="website">{contactCopy.honeypotLabel}</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              id="fullName"
              label={contactCopy.fullNameLabel}
              required
              error={errors.fullName}
            >
              <Input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                maxLength={120}
                value={values.fullName}
                onChange={(event) =>
                  updateField("fullName", event.currentTarget.value)
                }
                required
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={describedBy("fullName", errors.fullName)}
                className="h-12 rounded-none border-x-0 border-t-0 border-b border-white/20 bg-transparent px-0 text-[#F5F5F0] shadow-none focus-visible:border-transparent focus-visible:ring-0"
              />
            </FormField>

            <FormField
              id="email"
              label={contactCopy.emailLabel}
              required
              error={errors.email}
            >
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={254}
                value={values.email}
                onChange={(event) =>
                  updateField("email", event.currentTarget.value)
                }
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describedBy("email", errors.email)}
                className="h-12 rounded-none border-x-0 border-t-0 border-b border-white/20 bg-transparent px-0 text-[#F5F5F0] shadow-none focus-visible:border-transparent focus-visible:ring-0"
              />
            </FormField>

            <FormField
              id="phone"
              label={contactCopy.phoneLabel}
              error={errors.phone}
            >
              <Input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={40}
                value={values.phone}
                onChange={(event) =>
                  updateField("phone", event.currentTarget.value)
                }
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={describedBy("phone", errors.phone)}
                className="h-12 rounded-none border-x-0 border-t-0 border-b border-white/20 bg-transparent px-0 text-[#F5F5F0] shadow-none focus-visible:border-transparent focus-visible:ring-0"
              />
            </FormField>

            <FormField
              id="organisation"
              label={contactCopy.organisationLabel}
              error={errors.organisation}
            >
              <Input
                id="organisation"
                name="organisation"
                type="text"
                autoComplete="organization"
                maxLength={120}
                value={values.organisation}
                onChange={(event) =>
                  updateField("organisation", event.currentTarget.value)
                }
                aria-invalid={Boolean(errors.organisation)}
                aria-describedby={describedBy(
                  "organisation",
                  errors.organisation
                )}
                className="h-12 rounded-none border-x-0 border-t-0 border-b border-white/20 bg-transparent px-0 text-[#F5F5F0] shadow-none focus-visible:border-transparent focus-visible:ring-0"
              />
            </FormField>
          </div>

          <FormField
            id="enquiryType"
            label={contactCopy.enquiryTypeLabel}
            required
            error={errors.enquiryType}
          >
            <select
              id="enquiryType"
              name="enquiryType"
              value={values.enquiryType}
              onChange={(event) => {
                const selected =
                  enquiryTypes.find(
                    (option) => option.value === event.currentTarget.value
                  )?.value ?? "";
                updateField("enquiryType", selected);
              }}
              required
              aria-invalid={Boolean(errors.enquiryType)}
              aria-describedby={describedBy(
                "enquiryType",
                errors.enquiryType
              )}
              className="h-12 w-full appearance-none rounded-none border-x-0 border-t-0 border-b border-white/20 bg-transparent px-0 text-sm text-[#F5F5F0] outline-none transition-colors focus:border-transparent"
            >
              <option value="" className="bg-[#111111]">
                {contactCopy.selectPlaceholder}
              </option>
              {enquiryTypes.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-[#111111]"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id="message"
            label={contactCopy.messageLabel}
            required
            hint={contactCopy.messageHint}
            error={errors.message}
          >
            <textarea
              id="message"
              name="message"
              rows={5}
              minLength={20}
              maxLength={5_000}
              placeholder={contactCopy.messagePlaceholder}
              value={values.message}
              onChange={(event) =>
                updateField("message", event.currentTarget.value)
              }
              required
              aria-invalid={Boolean(errors.message)}
              aria-describedby={describedBy(
                "message",
                errors.message,
                contactCopy.messageHint
              )}
              className="block min-h-32 w-full resize-y rounded-none border-x-0 border-t-0 border-b border-white/20 bg-transparent px-0 py-3 text-sm leading-6 text-[#F5F5F0] outline-none transition-colors placeholder:text-white/30 focus:border-transparent"
            />
          </FormField>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
            <Button
              type="submit"
              disabled={status === "sending"}
              className="min-h-12 w-full rounded-full bg-[#D4FF3F] px-7 text-sm font-semibold text-[#0A0A0A] transition-transform hover:scale-[1.02] hover:bg-[#D4FF3F]/90 focus-visible:ring-2 focus-visible:ring-[#D4FF3F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] disabled:hover:scale-100 sm:w-auto"
            >
              {status === "sending" ? (
                <>
                  <LoaderCircle
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  {contactCopy.sendingLabel}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {contactCopy.submitLabel}
                </>
              )}
            </Button>
          </div>
        </form>

        {status === "error" && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-[#E4272A]/30 bg-[#E4272A]/[0.06] p-5"
          >
            <p className="font-semibold text-[#F5F5F0]">
              {contactCopy.errorTitle}
            </p>
            <p className="mt-1 text-sm leading-6 text-white/60">
              {serverMessage}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStatus("idle");
                setServerMessage("");
              }}
              className="mt-3 min-h-11 rounded-full border-white/15 bg-white/[0.03] px-5 text-[#F5F5F0] hover:border-[#D4FF3F]/50 hover:text-[#D4FF3F]"
            >
              {contactCopy.retryLabel}
            </Button>
          </div>
        )}

        <div
          ref={successRef}
          hidden={status !== "success"}
          aria-hidden={status !== "success"}
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-[#D4FF3F]/25 bg-[#D4FF3F]/[0.05] p-6 sm:p-8"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#D4FF3F]/30 bg-[#D4FF3F]/10">
            <svg
              viewBox="0 0 32 32"
              className="h-6 w-6"
              fill="none"
              aria-hidden="true"
            >
              <path
                ref={checkPathRef}
                d="M7 16.5 13 22l12-13"
                pathLength="32"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#D4FF3F]"
                style={{ strokeDasharray: 32, strokeDashoffset: 32 }}
              />
            </svg>
          </span>
          <h3 className="mt-5 text-xl font-bold text-[#F5F5F0]">
            {contactCopy.successTitle}
          </h3>
          <p className="mt-2 text-sm leading-6 text-white/60">
            {contactCopy.successMessage}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            className="mt-5 min-h-11 rounded-full border-white/15 bg-white/[0.03] px-5 text-[#F5F5F0] hover:border-[#D4FF3F]/50 hover:text-[#D4FF3F]"
          >
            {contactCopy.successResetLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
