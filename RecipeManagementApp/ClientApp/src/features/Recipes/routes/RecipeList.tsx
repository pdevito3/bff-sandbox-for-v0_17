import {
	ColumnDef,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import React from "react";
import { useRecipes } from "../api";
import { RecipeDto } from "../types";
import { Pagination } from "../../../types/api/index";
import {
	PaginatedTableProvider,
	usePaginatedTableContext,
	PaginatedTable,
} from "@/components/Forms/PaginatedTable";

function RecipeList() {
	return (
		<PaginatedTableProvider>
			<h1>Recipes Table</h1>
			<RecipeListTable />
		</PaginatedTableProvider>
	);
}

function RecipeListTable() {
	const { sorting, pageSize, pageNumber } = usePaginatedTableContext();

	const { data: recipeResponse, isLoading } = useRecipes({
		sortOrder: sorting as SortingState,
		pageSize,
		pageNumber,
	});
	const recipeData = recipeResponse?.data;
	const recipePagination = recipeResponse?.pagination;

	const columnHelper = createColumnHelper<RecipeDto>();
	const columns = [
		columnHelper.accessor((row) => row.title, {
			id: "title",
			cell: (info) => <p className="px-2 py-1">{info.getValue()}</p>,
			header: () => <span className="px-2 py-1">Title</span>,
		}),
		columnHelper.accessor((row) => row.visibility, {
			id: "visibility",
			cell: (info) => <p className="px-2 py-1">{info.getValue()}</p>,
			header: () => <span className="px-2 py-1">Visibility</span>,
		}),
		columnHelper.accessor((row) => row.directions, {
			id: "directions",
			cell: (info) => <p className="px-2 py-1">{info.getValue()}</p>,
			header: () => <span className="px-2 py-1">Directions</span>,
		}),
	];

	if (isLoading) return <div>Loading...</div>;
	return (
		<PaginatedTable
			data={recipeData}
			columns={columns}
			apiPagination={recipePagination}
			entityPlural="Recipes"
		/>
	);
}

export { RecipeList };
