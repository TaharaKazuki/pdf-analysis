'use client';

import type { FocusEvent } from 'react';
import { useActionState, useState } from 'react';
import { z } from 'zod';

import { submitContactForm } from '@/lib/actions/contact';
import { ContactSchema } from '@/validations/contact';

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, {
    success: false,
    errors: {},
  });

  const [clientErrors, setClientErrors] = useState({
    name: '',
    email: '',
  });

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    try {
      if (name === 'name') {
        ContactSchema.pick({ name: true }).parse({ name: value });
      } else if (name === 'email') {
        ContactSchema.pick({ email: true }).parse({ email: value });
      }
      setClientErrors((prev) => ({ ...prev, [name]: '' }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error?.errors[0].message || '';
        setClientErrors((prev) => ({ ...prev, [name]: errorMessage }));
      }
    }
  };

  return (
    <div>
      <form action={formAction}>
        <div className="py-24 text-gray-600">
          <div className="mx-auto flex flex-col bg-white p-8 shadow-md md:w-1/2">
            <h2 className="mb-2 text-lg">お問い合わせ</h2>
            <div className="mb-4">
              <label htmlFor="name" className="text-sm">
                名前
              </label>
              <input
                type="text"
                id="name"
                name="name"
                onBlur={handleBlur}
                className="w-full rounded border border-gray-300 bg-white px-3 py-1 leading-8 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              <ErrorMessage error={state.errors.name} />
              <ErrorMessage error={clientErrors.name} />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="text-sm">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onBlur={handleBlur}
                className="w-full rounded border border-gray-300 bg-white px-3 py-1 leading-8 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              <ErrorMessage error={state.errors.email} />
              <ErrorMessage error={clientErrors.email} />
            </div>
            <button
              type="submit"
              className="rounded bg-indigo-500 px-6 py-2 text-lg text-white hover:bg-indigo-600 disabled:opacity-50"
            >
              {isPending ? '送信中...' : '送信'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function ErrorMessage({ error }: { error: string | string[] | undefined }) {
  if (!error) return null;
  if (typeof error === 'string') {
    return <p className="mt-1 text-sm text-red-500">{error}</p>;
  }
  return <p className="mt-1 text-sm text-red-500">{error.join(',')}</p>;
}
