import { type Metadata } from "next";

export function metadata(): Metadata {
    return {
        title: "Graph ",
        description: "",
    };
}

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <>
        <div className="bg-blue-50 min-h-screen ">
            <div className="container mx-auto p-10 lg:w-4/6">
                {children}
            </div>
        </div>
        </>
    );
}
