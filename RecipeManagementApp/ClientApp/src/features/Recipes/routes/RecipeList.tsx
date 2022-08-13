import { createColumnHelper, SortingState } from "@tanstack/react-table";
import React from "react";
import { useRecipes } from "../api";
import { RecipeDto } from "../types";
import { useIngredients } from "@/features/Ingredients/api";
import { IngredientDto } from "@/features/Ingredients/types";
import {
	PaginatedTableProvider,
	usePaginatedTableContext,
	PaginatedTable,
	useGlobalFilter,
} from "@/components/Forms";
import DebouncedInput from "@/components/Forms/DebouncedInput";
import queryString from "query-string";

function RecipeList() {
	const {
		globalFilter: globalRecipeFilter,
		queryFilter: queryFilterForRecipes,
		calculateAndSetQueryFilter: calculateAndSetQueryFilterForRecipes,
	} = useGlobalFilter((value) => `(title|visibility|directions)@=*${value}`);
	const {
		globalFilter: globalIngredientFilter,
		queryFilter: queryFilterForIngredients,
		calculateAndSetQueryFilter: calculateAndSetQueryFilterForIngredients,
	} = useGlobalFilter((value) => `(name|measure|quantity)@=*${value}`);

	return (
		<div className="space-y-6">
			<div className="">
				<h1>Recipes Table</h1>
				<div className="py-2">
					<PaginatedTableProvider>
						{/* prefer this. more composed approach */}
						<DebouncedInput
							value={globalRecipeFilter ?? ""}
							onChange={(value) => calculateAndSetQueryFilterForRecipes(String(value))}
							className="p-2 border rounded-lg shadow font-lg"
							placeholder="Search all columns..."
						/>
						<div className="pt-2">
							<RecipeListTable queryFilter={queryFilterForRecipes} />
						</div>
					</PaginatedTableProvider>
				</div>
			</div>
			<div className="">
				<h1>Ingredients Table</h1>
				<div className="py-2">
					<PaginatedTableProvider initialPageSize={1}>
						<DebouncedInput
							value={globalIngredientFilter ?? ""}
							onChange={(value) => calculateAndSetQueryFilterForIngredients(String(value))}
							className="p-2 border rounded-lg shadow font-lg"
							placeholder="Search all columns..."
						/>
						<div className="pt-2">
							<IngredientListTable queryFilter={queryFilterForIngredients} />
						</div>
					</PaginatedTableProvider>
				</div>
			</div>
		</div>
	);
}

interface RecipeListTableProps {
	queryFilter?: string | undefined;
}

function RecipeListTable({ queryFilter }: RecipeListTableProps) {
	const { sorting, pageSize, pageNumber } = usePaginatedTableContext();

	const { data: recipeResponse, isLoading } = useRecipes({
		sortOrder: sorting as SortingState,
		pageSize,
		pageNumber,
		filters: queryFilter,
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

	return (
		<PaginatedTable
			data={recipeData}
			columns={columns}
			apiPagination={recipePagination}
			entityPlural="Recipes"
			isLoading={isLoading}
		/>
	);
}

interface IngredientListTableProps {
	queryFilter?: string | undefined;
}
function IngredientListTable({ queryFilter }: IngredientListTableProps) {
	const { sorting, pageSize, pageNumber } = usePaginatedTableContext();
	const { data: ingredientsResponse, isLoading } = useIngredients({
		sortOrder: sorting as SortingState,
		pageSize,
		pageNumber,
		filters: queryFilter,
		hasArtificialDelay: true,
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
		// columnHelper.accessor((row) => row.measure, {
		// 	id: "measure",
		// 	cell: (info) => <p className="px-2 py-1">{info.getValue()}</p>,
		// 	header: () => <span className="px-2 py-1">Measure</span>,
		// }),
	];

	return (
		<>
			<PaginatedTable
				data={ingredientsData}
				columns={columns}
				apiPagination={ingredientsPagination}
				entityPlural="Ingredients"
				isLoading={isLoading}
			/>
		</>
	);
}

export { RecipeList };
