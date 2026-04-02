"use client";

import { useState, useCallback } from "react";

/**
 * Lightweight form state hook for auth forms.
 * Manages field values, field-level errors, form-level messages, and loading state.
 */

export interface FormMessage {
  type: "success" | "error";
  text: string;
}

export interface UseFormStateOptions<T extends Record<string, string>> {
  initialValues: T;
  validate: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void>;
}

export function useFormState<T extends Record<string, string>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormStateOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [message, setMessage] = useState<FormMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  /** Update a single field value and clear its error */
  const setField = useCallback(
    (field: keyof T, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      // Clear field error on change
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
      // Clear form-level error message on any change
      if (message?.type === "error") setMessage(null);
    },
    [message]
  );

  /** Mark a field as touched (for blur validation) */
  const touchField = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  /** Validate a single field on blur */
  const validateField = useCallback(
    (field: keyof T) => {
      const fieldErrors = validate(values);
      if (fieldErrors[field]) {
        setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
      }
    },
    [values, validate]
  );

  /** Handle blur — mark touched + validate */
  const handleBlur = useCallback(
    (field: keyof T) => {
      touchField(field);
      validateField(field);
    },
    [touchField, validateField]
  );

  /** Submit handler — validates all, then calls onSubmit */
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      setMessage(null);

      // Validate all fields
      const allErrors = validate(values);
      setErrors(allErrors);
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>
      );
      setTouched(allTouched);

      if (Object.keys(allErrors).length > 0) return;

      setIsLoading(true);
      try {
        await onSubmit(values);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Something went wrong. Please try again.";
        setMessage({ type: "error", text: errorMsg });
      } finally {
        setIsLoading(false);
      }
    },
    [values, validate, onSubmit]
  );

  /** Reset form to initial state */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setMessage(null);
    setTouched({});
    setIsLoading(false);
  }, [initialValues]);

  return {
    values,
    errors,
    message,
    isLoading,
    touched,
    setField,
    setMessage,
    handleBlur,
    handleSubmit,
    reset,
  };
}
