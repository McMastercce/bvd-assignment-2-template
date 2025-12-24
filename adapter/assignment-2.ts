import assignment1 from "./assignment-1";

export type BookID = string;

export interface Book {
    id?: BookID,
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};

async function listBooks(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]>{
    return assignment1.listBooks(filters)
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
    let url = 'http://localhost:3000/books';
    let method = 'POST';

    // If book has an id, use PUT to update
    if (book.id) {
        url = `http://localhost:3000/books/${book.id}`;
        method = 'PUT';
    }

    const result = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
    });

    if (result.ok) {
        const data = await result.json() as { id: BookID };
        return data.id;
    } else {
        const errorText = await result.text();
        console.log("Failed to create/update book: ", errorText);
        throw new Error(`Failed to create/update book: ${errorText}`);
    }
}

async function removeBook(bookId: BookID): Promise<void> {
    const result = await fetch(`http://localhost:3000/books/${bookId}`, {
        method: 'DELETE',
    });

    if (!result.ok && result.status !== 204) {
        const errorText = await result.text();
        console.log("Failed to remove book: ", errorText);
        throw new Error(`Failed to remove book: ${errorText}`);
    }
}

const assignment = "assignment-2";

export default {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks
};
