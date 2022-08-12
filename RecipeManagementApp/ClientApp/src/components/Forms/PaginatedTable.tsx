import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import React, { PropsWithChildren, useEffect } from "react";
import { Pagination } from "../../types/api/index";

interface PaginatedTableContextResponse {
	setPageNumber: React.Dispatch<React.SetStateAction<number>>;
	pageNumber: number;
	pageSize: number;
	setPageSize: React.Dispatch<React.SetStateAction<number>>;
	sorting: SortingState;
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
	initialPageSize: number;
}

const PaginatedTableContext = React.createContext<PaginatedTableContextResponse>(
	{} as PaginatedTableContextResponse,
);

const PageSizeOptions = [1, 10, 20, 30, 40, 50] as const;
export type PageSizeNumber = typeof PageSizeOptions[number];
interface PaginatedTableProviderProps {
	initialPageSize?: PageSizeNumber;
	children: React.ReactNode;
	props?: any;
}

function PaginatedTableProvider({
	initialPageSize = 10,
	props,
	children,
}: PaginatedTableProviderProps) {
	const [sorting, setSorting] = React.useState<SortingState>();
	const [pageSize, setPageSize] = React.useState<number>(initialPageSize);
	const [pageNumber, setPageNumber] = React.useState<number>(1);
	const value = {
		sorting,
		setSorting,
		pageSize,
		setPageSize,
		pageNumber,
		setPageNumber,
		initialPageSize,
	};

	return (
		<PaginatedTableContext.Provider value={value} {...props}>
			{children}
		</PaginatedTableContext.Provider>
	);
}

function usePaginatedTableContext() {
	const context = React.useContext(PaginatedTableContext);
	if (Object.keys(context).length === 0)
		throw new Error("usePaginatedTableContext must be used within a PaginatedTableProvider");
	return context;
}

interface PaginatedTableProps {
	data: any[] | undefined;
	columns: ColumnDef<any, any>[];
	apiPagination: Pagination | undefined;
	entityPlural: string;
}

function PaginatedTable({ data = [], columns, apiPagination, entityPlural }: PaginatedTableProps) {
	const { sorting, setSorting, pageSize, setPageSize, pageNumber, setPageNumber, initialPageSize } =
		usePaginatedTableContext();

	const table = useReactTable({
		data: data ?? ([] as any[]),
		columns,
		state: {
			sorting,
		},
		initialState: {
			pagination: {
				pageSize: initialPageSize,
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
				<div className="flex flex-col">
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
												setPageNumber(1);
											}}
										>
											{PageSizeOptions.map((selectedPageSize) => (
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

export { PaginatedTable, usePaginatedTableContext, PaginatedTableProvider };
