interface Book {
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};

async function listBooks(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]>{
    let query = filters?.map(({from, to}, index) => {
        let result = "";
        if (from) {
            result += `&filter[${index}][from]=${from}`;
        }
        if (to) {
            result += `&filter[${index}][to]=${to}`
        }
        return result;
    }).join("&") ?? "";
    let result = await fetch(`http://localhost:3000/books?${query}`);
    if (result.ok) {
        return await result.json();
    } else {
        throw new Error("Failed to fetch books");
    }
}

const assignment = "assignment-1";

export default {
    assignment,
    listBooks
};