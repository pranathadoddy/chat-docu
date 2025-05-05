import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { loadS3IntoPinecone } from '@/lib/pinecone';
import { getS3Url } from '@/lib/s3';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
      },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    console.log({ file_key, file_name });
    await loadS3IntoPinecone(file_key);
    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        documentName: file_name,
        documentUrl: getS3Url(file_key),
        userId: userId,
      })
      .returning({
        inserted_id: chats.id,
      });

    return NextResponse.json(
      {
        message: 'Successfully loaded file',
        chat_id: chat_id[0].inserted_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error loading file:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
