import {
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

function RecipeList() {
	const [sortOrder, setSortOrder] = React.useState<string>();
	const [pageSize, setPageSize] = React.useState<number>(1);
	const [pageNumber, setPageNumber] = React.useState<number>(1);

	const [sorting, setSorting] = React.useState<SortingState>([]);
	React.useEffect(() => {
		sorting.length > 0
			? setSortOrder(sorting.map((s) => (s.desc ? `-${s.id}` : s.id)).join(","))
			: setSortOrder(undefined);
	}, [sorting, setSortOrder]);

	/* TODO 

		Want to have the recipe hook and columns in the list page and feed just that to the table and the table cant take care of the rest

		*Problem*: The recipe hook needs the sort order and page size to work properly, but the table should be owning that.
		*Solution*: Take another look at KCD context to see if i can make a context wrapper with the data

	*/

	// THIS...
	const { data: recipeResponse, isLoading } = useRecipes({ sortOrder, pageSize, pageNumber });
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
	// ... TO THIS would be on the list, the rest will be in the table component... maybe add some props for something like starting page size

	const table = useReactTable({
		data: recipeData ?? ([] as RecipeDto[]),
		columns,
		state: {
			sorting,
		},
		initialState: {
			pagination: {
				pageSize: 1,
			},
		},
		onSortingChange: setSorting,
		manualPagination: true,

		// pipeline
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		//
	});

	if (isLoading) return <div>Loading...</div>;
	return (
		<>
			<>
				{recipeData && recipeData.length > 0 ? (
					<>
						<table>
							<thead>
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<th key={header.id} colSpan={header.colSpan}>
												{header.isPlaceholder ? null : (
													<div
														{...{
															className: header.column.getCanSort()
																? "cursor-pointer select-none"
																: "",
															onClick: header.column.getToggleSortingHandler(),
														}}
													>
														{flexRender(header.column.columnDef.header, header.getContext())}
														{{
															asc: " 🔼",
															desc: " 🔽",
														}[header.column.getIsSorted() as string] ?? null}
													</div>
												)}
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

						<div className="flex items-center gap-2">
							<button
								className={clsx(
									"w-12 rounded-md border bg-gray-100 p-1 text-gray-800",
									!recipePagination?.hasPrevious
										? "cursor-not-allowed opacity-50 transition-opacity duration-500"
										: "",
								)}
								onClick={() => setPageNumber(1)}
								disabled={!recipePagination?.hasPrevious}
							>
								{"⏪"}
							</button>
							<button
								className={clsx(
									"w-12 rounded-md border bg-gray-100 p-1 text-gray-800",
									!recipePagination?.hasPrevious
										? "cursor-not-allowed opacity-50 transition-opacity duration-500"
										: "",
								)}
								onClick={() =>
									setPageNumber(recipePagination?.pageNumber ? recipePagination?.pageNumber - 1 : 1)
								}
								disabled={!recipePagination?.hasPrevious}
							>
								{"◀️"}
							</button>
							<button
								className={clsx(
									"w-12 rounded-md border bg-gray-100 p-1 text-gray-800",
									!recipePagination?.hasNext
										? "cursor-not-allowed opacity-50 transition-opacity duration-500"
										: "",
								)}
								onClick={() =>
									setPageNumber(recipePagination?.pageNumber ? recipePagination?.pageNumber + 1 : 1)
								}
								disabled={!recipePagination?.hasNext}
							>
								{"▶️"}
							</button>
							<button
								className={clsx(
									"w-12 rounded-md border bg-gray-100 p-1 text-gray-800",
									!recipePagination?.hasNext
										? "cursor-not-allowed opacity-50 transition-opacity duration-500"
										: "",
								)}
								onClick={() =>
									setPageNumber(recipePagination?.totalPages ? recipePagination?.totalPages : 1)
								}
								disabled={!recipePagination?.hasNext}
							>
								{"⏩"}
							</button>
							<span className="flex items-center gap-1">
								<div>Page</div>
								<strong>
									{pageNumber} of {recipePagination?.totalPages}
								</strong>
							</span>
							<span className="flex items-center gap-1">
								| Go to page:
								<input
									type="number"
									// defaultValue={recipePagination?.pageNumber ? recipePagination?.pageNumber : 1}
									onChange={(e) => {
										const page = e.target.value ? Number(e.target.value) : 1;
										setPageNumber(page);
									}}
									value={pageNumber}
									className="w-16 p-1 border rounded"
								/>
							</span>
							<select
								value={pageSize}
								onChange={(e) => {
									setPageSize(Number(e.target.value));
								}}
							>
								{[1, 10, 20, 30, 40, 50].map((selectedPageSize) => (
									<option key={selectedPageSize} value={selectedPageSize}>
										Show {selectedPageSize}
									</option>
								))}
							</select>
						</div>
					</>
				) : (
					<div>No Recipes Found</div>
				)}
			</>
		</>
	);
}

export { RecipeList };
