'use client';
import type React from 'react';
import { useState } from 'react';
import { EMPTY_LEAD_FORM, LeadFormData } from '@/lib/leads';

export type LeadFormChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

export function useLeadForm() {
  const [formData, setFormData] = useState<LeadFormData>(EMPTY_LEAD_FORM);

  const handleChange = (e: LeadFormChangeEvent) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return { formData, handleChange };
}
