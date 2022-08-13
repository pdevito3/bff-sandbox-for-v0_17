import { createColumnHelper, SortingState } from "@tanstack/react-table";
import React from "react";
import { useRecipes } from "../api";
import { RecipeDto } from "../types";
import { useIngredients } from "@/features/Ingredients/api";
import { IngredientDto } from "@/features/Ingredients/types";
import { useState } from "react";
import {
	PaginatedTableProvider,
	usePaginatedTableContext,
	PaginatedTable,
} from "@/components/Forms";
import DebouncedInput from "@/components/Forms/DebouncedInput";

function RecipeList() {
	return (
		<div className="space-y-6">
			<div className="">
				<h1>Recipes Table</h1>
				<div className="py-2">
					<PaginatedTableProvider>
						<RecipeListTable />
					</PaginatedTableProvider>
				</div>
			</div>
			<div className="">
				<h1>Ingredients Table</h1>
				<div className="py-2">
					<PaginatedTableProvider initialPageSize={1}>
						{/* // TODO put filter here as something like `PaginatedTableSearch`??? */}
						<IngredientListTable />
					</PaginatedTableProvider>
				</div>
			</div>
		</div>
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

function IngredientListTable() {
	const { sorting, pageSize, pageNumber } = usePaginatedTableContext();

	// TODO abstract to custom hook that can take in the props to filter on...
	const [globalFilter, setGlobalFilter] = React.useState<string>();
	const [queryFilter, setQueryFilter] = useState<string>();
	function calculateAndSetQueryFilter(value: string) {
		value.length > 0
			? setQueryFilter(`(name|measure|quantity)@=*${value}`)
			: setQueryFilter(undefined);
		setGlobalFilter(String(value));
	}
	// .......................

	const { data: ingredientsResponse, isLoading } = useIngredients({
		sortOrder: sorting as SortingState,
		pageSize,
		pageNumber,
		filters: queryFilter,
	});
	const ingredientsData = ingredientsResponse?.data;
	const ingredientsPagination = ingredientsResponse?.pagination;

	const columnHelper = createColumnHelper<IngredientDto>();
	const columns = [
		columnHelper.accessor((row) => row.name, {
			id: "name",
			cell: (info) => <p className="px-2 py-1">{info.getValue()}</p>,
			header: () => <span className="px-2 py-1">Name</span>,
		}),
		columnHelper.accessor((row) => row.quantity, {
			id: "quantity",
			cell: (info) => <p className="px-2 py-1">{info.getValue()}</p>,
			header: () => <span className="px-2 py-1">Quantity</span>,
		}),
		columnHelper.accessor((row) => row.measure, {
			id: "measure",
			cell: (info) => <p className="px-2 py-1">{info.getValue()}</p>,
			header: () => <span className="px-2 py-1">Measure</span>,
		}),
	];

	return (
		<>
			<DebouncedInput
				value={globalFilter ?? ""}
				onChange={(value) => calculateAndSetQueryFilter(String(value))}
				className="p-2 border rounded-lg shadow font-lg"
				placeholder="Search all columns..."
			/>
			<div className="pt-2">
				{isLoading ? (
					<div>Loading...</div>
				) : (
					<PaginatedTable
						data={ingredientsData}
						columns={columns}
						apiPagination={ingredientsPagination}
						entityPlural="Ingredients"
					/>
				)}
			</div>
		</>
	);
}

export { RecipeList };
