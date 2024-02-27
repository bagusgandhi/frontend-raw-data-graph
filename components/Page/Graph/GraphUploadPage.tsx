"use client"
import Link from "next/link";
import { ArrowLeftOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';

const { Dragger } = Upload;

const props: UploadProps = {
    name: 'files',
    multiple: false,
    action: `${process.env.NEXT_PUBLIC_API_URL}/raw-data/upload`,
    beforeUpload: (file) => {
        const isSupported = file.type === 'text/csv' || file.type === 'application/zip' || file.type === 'application/gzip';

        if (!isSupported) {
            message.error(`${file.name} is not a supported file`);
        }

        return isSupported || Upload.LIST_IGNORE;
    },
    onChange(info) {
        const { status } = info.file;
        
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);

        } else if (status === 'error') {
            message.error(`${info.file.response.message}`);

        }
    },

};

export function GraphUploadPage() {
    return (
        <>
            <div className='flex justify-between items-center'>
                <p className="">Upload</p>
                <Link href={'/graph'}>
                    <button className='cursor-pointer flex gap-2 font-bold items-center hover:bg-blue-100 p-4 rounded-md'>
                        <ArrowLeftOutlined sizes={"large"} />
                        <span>Back to Graph Page</span>
                    </button>
                </Link>
            </div>
            <div className='bg-white mt-14 px-4 py-6 rounded'>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        file format support only .csv, .zip and .cvs.gz.
                    </p>
                </Dragger>
            </div>
        </>
    );
}