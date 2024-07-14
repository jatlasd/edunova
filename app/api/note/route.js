import Note from "@models/note";
import { connectToDB } from "@lib/database";

export const POST = async ( request ) => {
    try {
        const noteData = await request.json();
        await connectToDB();

        const note = new Note( noteData );
        await note.save();

        return new Response( JSON.stringify( note ), { status: 201 } );
    } catch ( error ) {
        console.error( 'Error creating note:', error );
        return new Response( 'Failed to create new note', { status: 500 } );
    }
}

export const GET = async ( request ) => {
    await connectToDB();
    try {
        const notes = await Note.find()
        return new Response( JSON.stringify( notes ), { status: 200 } )
    } catch ( error ) {
        return new Response( 'Failed to fetch notes', { status: 500 } )
    }
}