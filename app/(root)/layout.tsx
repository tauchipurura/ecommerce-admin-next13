import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
// import { redirect } from "next/dist/server/api-utils";

export default async function SetupLayout ({
    children
}:{
    children : React.ReactNode;
}) {
    const {userId} = auth();

    if (!userId){
        redirect('/sign-in')
    }

    const store = await prismadb.store.findFirst({
        where: {
            userId
        }
    });

    if (store){
        redirect(`/${store.id}`);
    }

    return (
        <>
       
        {children}
        </>
    )
}