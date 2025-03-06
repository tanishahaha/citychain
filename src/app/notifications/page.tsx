import { createClient } from '@/utils/supabase/server';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { BsStars } from 'react-icons/bs';

export default async function NotificationsPage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  const notificationList = await db
    .select()
    .from(notifications)
    .orderBy(desc(notifications.created_at));

  return (
    <main className='ml-[275px] py-4 px-6 border-l  border-black/10 h-full w-full min-h-screen'>
      <div className='flex w-full items-center justify-between text-xl border-b border-black/10 py-4'>
              <h1 className=''>Notifications</h1>
              <BsStars size={24}/>

        

      </div>
      <ul>
        {notificationList.map((notification) => (
          <li key={notification.id} className="border-b py-2 cursor-pointer bg-slate-50 p-4 my-2">
            <p>{notification.message}</p>
            <span className="text-sm text-gray-500">
              {notification.created_at
                ? new Date(notification.created_at).toLocaleString()
                : 'Date not available'}
            </span>
          </li>
        ))}
      </ul>
      
    </main>
  );
}