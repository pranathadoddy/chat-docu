import ChatSideBar from '@/components/ChatSidebar';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params }: Props) => {
  const { userId } = await auth();

  const { chatId } = await params;
  if (!userId) {
    return redirect('/sign-in');
  }

  const _chats = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId))
    .execute();

  if (!_chats) {
    return redirect('/');
  }

  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect('/');
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        <div className="flex-[1] max-w-xs">
          <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={false} />
        </div>

        <div className="max-h-screen p-4 oveflow-scroll flex-[5]"></div>
        <div className="flex-[3] border-l-4 border-l-slate-200"></div>
      </div>
    </div>
  );
};

export default ChatPage;
