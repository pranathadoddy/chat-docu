'use client';
import { Inbox } from 'lucide-react';
import React, { use } from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {};

const FileUpload = (props: Props) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
    },
  });
  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps()}
        className="border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col"
      >
        <input {...getInputProps()} />
        <>
          <Inbox className="w-10 h-10 text-blue-400" />
          <p className="text-slate-400">Drag and drop your PDF here</p>
        </>
      </div>
    </div>
  );
};

export default FileUpload;
