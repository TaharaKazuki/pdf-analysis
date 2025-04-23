import { getContact, getContacts } from '@/lib/contact';

export default async function ListPage() {
  const contacts = await getContacts();
  const firstContact = await getContact();

  return (
    <div>
      複数
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.name} : {contact.email}
          </li>
        ))}
      </ul>
      1件
      <div>
        <div>{firstContact ? firstContact.name : '登録されていません'}</div>
      </div>
    </div>
  );
}
