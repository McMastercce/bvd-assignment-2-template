import express from "express";
import book_list from "./mcmasteful-book-list.json";
import { z } from "zod"
import { validateRequest } from "zod-express-middleware";
import queryType from "query-types";
import cors from "cors";

const app = express();

// Setting up to use express JSON for the body
app.use(express.json());
app.use(queryType.middleware())
app.use(cors())

app.get("/books", validateRequest({
    query: z.object({ filter: z.object({
        from: z.number().optional(),
        to: z.number().optional()
    }).array().optional()
})
}), (req, res) => {
    let filters = req.query['filter'];

    console.log("filters", filters);

    // If there are no filters we can return the list directly
    if (!filters || filters.length === 0) {
        res.json(book_list);
        return;
    }

    let filtered : Record<number, true> = {};

    for (let {from, to} of filters) {
        for (let [index, { price }] of book_list.entries()) {
            let matches = true;
            if (from && price < from) {
                matches = false;
            }
            if (to && price > to) {
                matches = false;
            }
            if (matches) {
                filtered[index] = true;
            }
        }
    }

    res.json(book_list.filter((book, index) => filtered[index] === true));
});

app.listen(3000, () => {
    console.log("listening!")
});