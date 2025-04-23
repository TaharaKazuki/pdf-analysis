'use server';

import { redirect } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { ContactSchema } from '@/validations/contact';

type ActionState = {
  success: boolean;
  errors: {
    name?: string[];
    email?: string[];
  };
  serverError?: string;
};

export async function submitContactForm(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  const validationResult = ContactSchema.safeParse({
    name,
    email,
  });

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors;

    return {
      success: false,
      errors: {
        name: errors.name || [],
        email: errors.email || [],
      },
    };
  }

  const existingRecord = await prisma.contact.findUnique({
    where: { email: email },
  });

  if (existingRecord) {
    return {
      success: false,
      errors: { name: [], email: ['このメールアドレスは既に登録されています'] },
    };
  }

  await prisma.contact.create({
    data: {
      name: name,
      email: email,
    },
  });

  redirect('/contacts/complete');
}
