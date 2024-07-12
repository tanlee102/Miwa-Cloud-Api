import { NextResponse } from 'next/server'
import { getStore } from "@netlify/blobs";

export async function DELETE(request, context) {

    try {

        const blob = String(request.nextUrl.searchParams.get("blob"));

        try {
            const store = getStore({
                name: blob,
                siteID: process.env.siteID,
                token: process.env.token,
            });

            const { blobs } = await store.list()

            for(let i = 0; i < blobs.length; i++){
                await store.delete(blobs[i].key); 
            }
            
            return NextResponse.json({ message: 'success' }, { status: 200 });

        } catch (error) {
            return NextResponse.json({ error: error }, { status: 400 });
        }

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

}