import { z } from 'zod';

export const ContactSchema = z
  .object({
    name: z
      .string({ required_error: '名前は必須です' })
      .min(3, '名前は3文字以上で入力してください')
      .max(20, '名前は20文字以内で入力してください'),
    email: z
      .string({ required_error: 'メールアドレスは必須です' })
      .email('メールアドレスの形式が正しくありません'),
  })
  .required({
    name: true,
    email: true,
  });

export type ContactType = z.infer<typeof ContactSchema>;
