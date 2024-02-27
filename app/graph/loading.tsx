import { Spin } from 'antd';

export default function Loading() {
    return (
        <>
            <div className='flex items-center justify-center h-screen'>
                <div className='flex items-center text-sm gap-2'>
                    <Spin />
                    <p>Loading</p>
                </div>
            </div>
        </>
    )
}