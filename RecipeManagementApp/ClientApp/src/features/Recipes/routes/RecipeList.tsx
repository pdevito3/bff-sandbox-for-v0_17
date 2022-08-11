import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { useRecipes } from "../api";
import { RecipeDto } from "../types";

function RecipeList() {
	const { data: recipeResponse, isLoading } = useRecipes({});
	const recipeData = recipeResponse?.data;
	// const recipePagination = recipeResponse?.pagination;

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

	const table = useReactTable({
		data: recipeData ?? ([] as RecipeDto[]),
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	if (isLoading) return <div>Loading...</div>;
	return (
		<>
			<>
				{recipeData && recipeData.length > 0 ? (
					<table>
						<thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<th key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody>
							{table.getRowModel().rows.map((row) => (
								<tr key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<div>No Recipes Found</div>
				)}
			</>
		</>
	);
}

export { RecipeList };
