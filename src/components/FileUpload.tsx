'use client';
import { uploadFileToS3 } from '@/lib/s3';
import { useMutation } from '@tanstack/react-query';
import { Inbox, Loader2 } from 'lucide-react';
import React, { use } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

type Props = {};

const FileUpload = (props: Props) => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post('/api/create-chat', {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      setUploading(true);
      console.log(acceptedFiles);

      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit');
        return;
      }

      try {
        const data = await uploadFileToS3(file);
        if (!data?.file_key || !data.file_name) {
          toast.error('Something went wrong');
          return;
        }

        mutate(
          {
            file_key: data.file_key,
            file_name: data.file_name,
          },
          {
            onSuccess: (data) => {
              toast.success(data.message);
              router.push(`/chat/${data.chat_id}`);
            },
            onError: (error) => {
              toast.error('Error creating chat. Please try again.');
              console.error('Error creating chat:', error);
            },
          }
        );
        console.log('File uploaded successfully:', data);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file. Please try again.');
        return;
      } finally {
        setUploading(false);
      }
    },
  });
  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps()}
        className="border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col"
      >
        <input {...getInputProps()} />
        {uploading || isPending ? (
          <>
            {/* loading state */}
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Uploading your file... Please wait.
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-400" />
            <p className="text-slate-400">Drag and drop your PDF here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
