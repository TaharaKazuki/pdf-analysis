import { prisma } from '@/lib/prisma';

export async function getContacts() {
  const contacts = await prisma.contact.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return contacts;
}

export async function getContact() {
  const contact = await prisma.contact.findFirst({
    select: { name: true, email: true },
  });
  return contact;
}
