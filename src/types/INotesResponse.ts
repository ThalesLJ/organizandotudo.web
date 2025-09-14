import INotes from "./INotes";

export default interface INotesResponse {
    data: INotes[],
    pagination: {
        page: number,
        limit: number,
        total: number,
        pages: number
    }
}
