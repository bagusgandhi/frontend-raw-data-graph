"use client"
import { useEffect, useState } from 'react';
import { Button, DatePicker, Divider, notification, Space } from 'antd';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link'
import { NumericInput } from '../../Input/NumericInput';
import dayjs, { Dayjs } from 'dayjs';
import dynamic from 'next/dynamic';
import { fetchData } from '@/utils/api';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const { RangePicker } = DatePicker;
type RangeValue = [Dayjs | null, Dayjs | null] | null;

export function GraphPage() {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [enodebId, setEnodebId] = useState<string | null>('1041003');
    const [cellId, setCellId] = useState<string | null>('22');
    const [date, setDate] = useState<RangeValue>(null);
    const [api, contextHolder] = notification.useNotification();
    const [options, setOptions] = useState<any>({
        chart: {
            id: 'graph'
        },
        xaxis: {
            type: 'datetime',
            categories: series.map((item: any) => item.resultTime) || []
        },
        dataLabels: {
            enabled: false
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
        }
    });

    const [seriesChart, setSeriesChart] = useState<Array<any>>([{
        name: 'availability',
        data: series ? series.map((item: any) => item.availability) : []
    }]);

    useEffect(() => {
        const defaultStartDate = dayjs('2022-07-22').startOf('day');
        const defaultEndDate = dayjs('2022-07-22').endOf('day');

        setDate([defaultStartDate, defaultEndDate]);

        handleFetchGraph();

    }, []);

    useEffect(() => {
        setOptions({
            ...options,
            xaxis: {
                ...options.xaxis,
                categories: series.map((item: any) => item.resultTime) || []
            }
        })

        setSeriesChart([
            ...seriesChart.map((seriesItem, index) => {
                if (index === 0) {
                    return {
                        ...seriesItem,
                        data: series ? series.map((item: any) => item.availability) : [],
                    };
                }
                return seriesItem;
            }),
        ]);

    }, [series])

    const handleRangePicker = (value: any) => {
        if (value) {

            const startOfDay = dayjs(value[0]).startOf('day');
            const endOfDay = dayjs(value[1]).endOf('day');

            console.log([startOfDay, endOfDay]);
            setDate([startOfDay, endOfDay]);
        }
    };


    const handleFetchGraph = async () => {
        try {
            setLoading(true);
            const params = {
                enodebId: enodebId ?? undefined,
                cellId: cellId ?? undefined,
                startDate: date && date[0]?.format('YYYY-MM-DD HH:mm:ss') || undefined,
                endDate: date && date[1]?.format('YYYY-MM-DD HH:mm:ss') || undefined
            }

            const { data } = await fetchData('raw-data/graph', params);

            setSeries(data);

        } catch (error: any) {
            console.log(error.response.data.message)
            api.error({
                message: `Error`,
                description: error.response.data.message,
                placement: "top",
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {contextHolder}
            <div className='flex justify-between items-center'>
                <p className="">Graph</p>
                <Link href={'/graph/upload'}>
                    <button className='flex gap-2 !cursor-pointer font-bold items-center hover:bg-blue-100 p-4 rounded-md'>
                        <PlusCircleOutlined sizes={"large"} />
                        <span>Upload Data</span>
                    </button>
                </Link>
            </div>
            <div className='bg-white mt-14 px-4 py-6 rounded'>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-4 flex-col lg:flex-row items-end'>
                        <div className='flex flex-col w-full md:w-1/4'>
                            <span className='text-sm pl-2 pb-2 text-slate-400'>enodebId</span>
                            <NumericInput value={enodebId!} onChange={setEnodebId} placeholder="input enodebId" />
                        </div>
                        <div className='flex flex-col w-full md:w-1/4'>
                            <span className='text-sm pl-2 pb-2 text-slate-400'>cellId</span>
                            <NumericInput value={cellId!} onChange={setCellId} placeholder="input cellId" />
                        </div>
                        <div className='flex flex-col w-full md:w-1/3'>
                            <span className='text-sm pl-2 pb-2 text-slate-400'>Date</span>
                            <RangePicker onChange={handleRangePicker} value={date} />
                        </div>
                        <Button loading={loading} onClick={() => handleFetchGraph()} className="bg-blue-500" type="primary" size='large' icon={<SearchOutlined />}>
                            show
                        </Button>
                    </div>
                </div>

                {/* chart */}
                <div className='pt-8'>
                    <ApexCharts type='bar' options={options} series={seriesChart} height={300} width={"100%"} />
                </div>
            </div>
        </>
    );
}