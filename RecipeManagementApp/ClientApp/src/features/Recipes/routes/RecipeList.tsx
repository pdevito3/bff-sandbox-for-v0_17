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

function RecipeList() {
	const [pageSize, setPageSize] = React.useState<number>(1);
	const [pageNumber, setPageNumber] = React.useState<number>(1);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	/* TODO 

		Want to have the recipe hook and columns in the list page and feed just that to the table and the table cant take care of the rest

		*Problem*: The recipe hook needs the sort order and page size to work properly, but the table should be owning that.
		*Solution*: Take another look at KCD context to see if i can make a context wrapper with the data

	*/

	// THIS...
	const { data: recipeResponse, isLoading } = useRecipes({
		sortOrder: sorting,
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
	// ... TO THIS would be on the list, the rest will be in the table component... maybe add some props for something like starting page size

	if (isLoading) return <div>Loading...</div>;
	return (
		<>
			<h1>Recipes Table</h1>
			<PaginationTable
				data={recipeData}
				columns={columns}
				apiPagination={recipePagination}
				setPageNumber={setPageNumber}
				pageNumber={pageNumber}
				pageSize={pageSize}
				setPageSize={setPageSize}
				sorting={sorting}
				setSorting={setSorting}
				entityPlural="Recipes"
			/>
		</>
	);
}

interface PaginationTableProps {
	data: any[] | undefined;
	columns: ColumnDef<any, any>[];
	apiPagination: Pagination | undefined;
	setPageNumber: React.Dispatch<React.SetStateAction<number>>;
	pageNumber: number;
	pageSize: number;
	setPageSize: React.Dispatch<React.SetStateAction<number>>;
	sorting: SortingState;
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
	entityPlural: string;
}

function PaginationTable({
	data = [],
	columns,
	apiPagination,
	setPageNumber,
	pageNumber,
	pageSize,
	setPageSize,
	sorting,
	setSorting,
	entityPlural,
}: PaginationTableProps) {
	const table = useReactTable({
		data: data ?? ([] as any[]),
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

	return (
		<div className="">
			{data && data.length > 0 ? (
				<div className="flex flex-col mt-8">
					<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
							<div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
								<table className="min-w-full">
									<thead>
										{table.getHeaderGroups().map((headerGroup) => (
											<tr key={headerGroup.id}>
												{headerGroup.headers.map((header) => (
													<th key={header.id} colSpan={header.colSpan} className="text-left">
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

								<div className="px-3 py-2">
									<div className="flex items-center gap-2">
										<button
											className={clsx(
												"w-12 rounded-md border bg-gray-100 p-1 text-gray-800",
												!apiPagination?.hasPrevious
													? "cursor-not-allowed opacity-50 transition-opacity duration-500"
													: "",
											)}
											onClick={() => setPageNumber(1)}
											disabled={!apiPagination?.hasPrevious}
										>
											{"⏪"}
										</button>
										<button
											className={clsx(
												"w-12 rounded-md border bg-gray-100 p-1 text-gray-800",
												!apiPagination?.hasPrevious
													? "cursor-not-allowed opacity-50 transition-opacity duration-500"
													: "",
											)}
											onClick={() =>
												setPageNumber(apiPagination?.pageNumber ? apiPagination?.pageNumber - 1 : 1)
											}
											disabled={!apiPagination?.hasPrevious}
										>
											{"◀️"}
										</button>
										<button
											className={clsx(
												"w-12 rounded-md border bg-gray-100 p-1 text-gray-800",
												!apiPagination?.hasNext
													? "cursor-not-allowed opacity-50 transition-opacity duration-500"
													: "",
											)}
											onClick={() =>
												setPageNumber(apiPagination?.pageNumber ? apiPagination?.pageNumber + 1 : 1)
											}
											disabled={!apiPagination?.hasNext}
										>
											{"▶️"}
										</button>
										<button
											className={clsx(
												"w-12 rounded-md border bg-gray-100 p-1 text-gray-800",
												!apiPagination?.hasNext
													? "cursor-not-allowed opacity-50 transition-opacity duration-500"
													: "",
											)}
											onClick={() =>
												setPageNumber(apiPagination?.totalPages ? apiPagination?.totalPages : 1)
											}
											disabled={!apiPagination?.hasNext}
										>
											{"⏩"}
										</button>
										<span className="flex items-center gap-1">
											<div>Page</div>
											<strong>
												{pageNumber} of {apiPagination?.totalPages}
											</strong>
										</span>
										<span className="flex items-center gap-1">
											| Go to page:
											<input
												type="number"
												// defaultValue={apiPagination?.pageNumber ? apiPagination?.pageNumber : 1}
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
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div>No {entityPlural} Found</div>
			)}
		</div>
	);
}

export { RecipeList };
