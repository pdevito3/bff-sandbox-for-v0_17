import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	Row,
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
	isLoading?: boolean;
	onRowClick?: (row: Row<any>) => void;
}

function PaginatedTable({
	data = [],
	columns,
	apiPagination,
	entityPlural,
	isLoading = true,
	onRowClick,
}: PaginatedTableProps) {
	const rowIsClickable = onRowClick !== null && onRowClick !== undefined;
	const { sorting, setSorting, pageSize, setPageSize, pageNumber, setPageNumber, initialPageSize } =
		usePaginatedTableContext();

	const skeletonRowCount = 2;

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
		manualSorting: true,

		// pipeline
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		//
	});

	return (
		<div className="relative h-[30rem] overflow-x-auto bg-gray-50 shadow-md dark:bg-gray-700 sm:rounded-lg">
			{isLoading ? (
				<div className="flex flex-col justify-between h-full divide-y">
					<table className="pl-6 animate-pulse">
						<thead>
							<tr className="">
								{Array.from({ length: columns.length }, (_, colIndex) => (
									<th key={`col${colIndex}`} className="px-6 py-3">
										<div className="mb-2.5 h-2.5 w-1/3 rounded-full bg-gray-400 dark:bg-gray-900"></div>
									</th>
								))}
							</tr>
						</thead>

						<tbody className="pt-3 ">
							{Array.from({ length: skeletonRowCount }, (_, rowIndex) => (
								<tr key={`row${rowIndex}`} className="px-6 py-3">
									{Array.from({ length: columns.length }, (_, cellIndex) => (
										<td key={`row${cellIndex}col${rowIndex}`} className="px-6 py-3">
											<div
												key={`row${cellIndex}col${rowIndex}`}
												className="w-3/4 h-2 bg-gray-200 rounded-full dark:bg-gray-800"
											></div>
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
					<span className="sr-only">{`Loading ${entityPlural} table...`}</span>
				</div>
			) : (
				<>
					{data && data.length > 0 ? (
						<div className="flex flex-col justify-between h-full divide-y">
							<table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
								<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
									{table.getHeaderGroups().map((headerGroup) => (
										<tr key={headerGroup.id}>
											{headerGroup.headers.map((header) => (
												<th
													key={header.id}
													colSpan={header.colSpan}
													className={`group cursor-pointer px-6 py-3 ${header.column.columnDef.meta?.thClassName}`}
												>
													{header.isPlaceholder ? null : (
														<div
															className={clsx(
																" inline-flex w-full",
																header.column.getCanSort() ? " select-none" : "",
															)}
															onClick={header.column.getToggleSortingHandler()}
														>
															{flexRender(header.column.columnDef.header, header.getContext())}
															<span className="w-5 ml-2">
																<span className="flex-none rounded">
																	{{
																		asc: "🔼",
																		desc: "🔽",
																	}[header.column.getIsSorted() as string] ?? null}
																</span>
																<span className="flex-none invisible rounded opacity-50 group-hover:visible">
																	{header.column.getIsSorted() || !header.column.getCanSort()
																		? null
																		: "🔼"}
																</span>
															</span>
														</div>
													)}
												</th>
											))}
										</tr>
									))}
								</thead>
								<tbody>
									{table.getRowModel().rows.map((row) => (
										<tr
											key={row.id}
											className={clsx(
												"group border-b bg-white dark:border-gray-700 dark:bg-gray-800",
												rowIsClickable
													? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
													: "",
											)}
											onClick={
												rowIsClickable ? () => onRowClick && onRowClick(row.original) : undefined
											}
										>
											{row.getVisibleCells().map((cell) => (
												<td key={cell.id} className="px-6 py-4">
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>

							<div
								className="flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-800"
								aria-label={`Table navigation for ${entityPlural} table`}
							>
								<div className="flex items-center space-x-3">
									<span className="flex text-sm font-normal text-gray-500 dark:text-gray-400">
										<div>Page</div>
										<span className="pl-1 font-semibold text-gray-900 dark:text-white">
											{pageNumber} of {apiPagination?.totalPages}
										</span>
									</span>

									{/* <span className="flex items-center gap-1">
								Go to page:
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
							</span> */}
									<select
										className="dark:text-blue-500"
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

								<div className="inline-flex items-center -space-x-[2px]">
									<button
										aria-label="First page"
										className={clsx(
											"ml-0 block rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
											!apiPagination?.hasPrevious
												? "cursor-not-allowed opacity-50 transition-opacity duration-500"
												: "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white",
										)}
										onClick={() => setPageNumber(1)}
										disabled={!apiPagination?.hasPrevious}
									>
										{"⏪"}
									</button>
									<button
										aria-label="Previous page"
										className={clsx(
											"inline border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
											!apiPagination?.hasPrevious
												? "cursor-not-allowed opacity-50 transition-opacity duration-500"
												: "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white",
										)}
										onClick={() =>
											setPageNumber(apiPagination?.pageNumber ? apiPagination?.pageNumber - 1 : 1)
										}
										disabled={!apiPagination?.hasPrevious}
									>
										{"◀️"}
									</button>
									<button
										aria-label="Next page"
										className={clsx(
											"inline border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
											!apiPagination?.hasNext
												? "cursor-not-allowed opacity-50 transition-opacity duration-500"
												: "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white",
										)}
										onClick={() =>
											setPageNumber(apiPagination?.pageNumber ? apiPagination?.pageNumber + 1 : 1)
										}
										disabled={!apiPagination?.hasNext}
									>
										{"▶️"}
									</button>
									<button
										aria-label="Last page"
										className={clsx(
											"block rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
											!apiPagination?.hasNext
												? "cursor-not-allowed opacity-50 transition-opacity duration-500"
												: "hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white",
										)}
										onClick={() =>
											setPageNumber(apiPagination?.totalPages ? apiPagination?.totalPages : 1)
										}
										disabled={!apiPagination?.hasNext}
									>
										{"⏩"}
									</button>
								</div>
							</div>
						</div>
					) : (
						<div className="p-4">
							<p className="dark:text-gray-50">No {entityPlural} Found</p>
						</div>
					)}
				</>
			)}
		</div>
	);
}

function useGlobalFilter(filter: (value: React.SetStateAction<string | undefined>) => string) {
	const [globalFilter, setGlobalFilter] = React.useState<string>();
	const [queryFilter, setQueryFilter] = React.useState<string>();

	function calculateAndSetQueryFilter(value: string) {
		value.length > 0 ? setQueryFilter(() => filter(value)) : setQueryFilter(undefined);
		setGlobalFilter(String(value));
	}

	return { globalFilter, queryFilter, calculateAndSetQueryFilter };
}

export { PaginatedTable, usePaginatedTableContext, PaginatedTableProvider, useGlobalFilter };
