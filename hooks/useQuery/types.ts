export interface Pagination {
	totalPages: number;
	total: number;
	searchTerm?: string;
	page: number;
	limit: number;
}
