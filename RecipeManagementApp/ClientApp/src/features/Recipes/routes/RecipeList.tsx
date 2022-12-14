import { createColumnHelper, SortingState } from "@tanstack/react-table";
import React from "react";
import { useDeleteRecipe, useRecipes } from "../api";
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
import { useNavigate } from "react-router-dom";
import { Notifications } from "@/components/Notifications";
import "@tanstack/react-table";

function RecipeList() {
	const navigate = useNavigate();
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
				<h1 className="max-w-4xl text-2xl font-medium tracking-tight font-display text-slate-900 dark:text-gray-50 sm:text-4xl">
					Recipes Table
				</h1>
				<div className="py-4">
					{/* prefer this. more composed approach */}
					<PaginatedTableProvider>
						<div className="flex items-center justify-between">
							{/* TODO: abstract to an input that can use the debounce input under the hood */}
							<div className="relative mt-1">
								<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
									<svg
										className="w-5 h-5 text-gray-500 dark:text-gray-400"
										aria-hidden="true"
										fill="currentColor"
										viewBox="0 0 20 20"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
											clipRule="evenodd"
										/>
									</svg>
								</div>

								<DebouncedInput
									value={globalRecipeFilter ?? ""}
									onChange={(value) => calculateAndSetQueryFilterForRecipes(String(value))}
									className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
									placeholder="Search all columns..."
								/>
							</div>

							<button
								className="px-3 py-2 border border-white rounded-md"
								onClick={() => navigate("/recipes/new")}
							>
								<p className="rotate-45">???</p>
							</button>
						</div>

						<div className="pt-2">
							<RecipeListTable queryFilter={queryFilterForRecipes} />
						</div>
					</PaginatedTableProvider>
				</div>
			</div>
			<div className="">
				<h1 className="max-w-4xl text-2xl font-medium tracking-tight font-display text-slate-900 dark:text-gray-50 sm:text-4xl">
					Ingredients Table
				</h1>
				<div className="py-4">
					<PaginatedTableProvider initialPageSize={1}>
						{/* TODO: abstract to an input that can use the debounce input under the hood */}
						<div className="relative mt-1">
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<svg
									className="w-5 h-5 text-gray-500 dark:text-gray-400"
									aria-hidden="true"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
										clipRule="evenodd"
									/>
								</svg>
							</div>

							<DebouncedInput
								value={globalIngredientFilter ?? ""}
								onChange={(value) => calculateAndSetQueryFilterForIngredients(String(value))}
								className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
								placeholder="Search all columns..."
							/>
						</div>
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
	const navigate = useNavigate();
	const { sorting, pageSize, pageNumber } = usePaginatedTableContext();

	const deleteRecipeApi = useDeleteRecipe();
	function deleteRecipe(id: string) {
		// TODO are you sure modal

		deleteRecipeApi
			.mutateAsync(id)
			.then(() => {
				Notifications.success("Recipe deleted successfully");
			})
			.catch((e) => {
				Notifications.error("There was an error deleting the recipe");
				console.error(e);
			});
	}

	const { data: recipeResponse, isLoading } = useRecipes({
		sortOrder: sorting as SortingState,
		pageSize,
		pageNumber,
		filters: queryFilter,
		hasArtificialDelay: true,
	});
	const recipeData = recipeResponse?.data;
	const recipePagination = recipeResponse?.pagination;

	const columnHelper = createColumnHelper<RecipeDto>();
	const columns = [
		columnHelper.accessor((row) => row.title, {
			id: "title",
			cell: (info) => <p className="">{info.getValue()}</p>,
			header: () => <span className="">Title</span>,
		}),
		columnHelper.accessor((row) => row.visibility, {
			id: "visibility",
			cell: (info) => <p className="">{info.getValue()}</p>,
			header: () => <span className="">Visibility</span>,
		}),
		columnHelper.accessor((row) => row.directions, {
			id: "directions",
			cell: (info) => <p className="">{info.getValue()}</p>,
			header: () => <span className="">Directions</span>,
		}),
		columnHelper.accessor((row) => row.rating, {
			id: "rating",
			cell: (info) => <p className="">{info.getValue()}</p>,
			header: () => <span className="">Rating</span>,
		}),
		columnHelper.accessor("id", {
			enableSorting: false,
			meta: { thClassName: "w-10" },
			cell: (row) => (
				<div className="flex items-center justify-center w-full">
					<button
						onClick={(e) => {
							deleteRecipe(row.getValue());
							e.stopPropagation();
						}}
						className="inline-flex items-center px-1 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-100 ease-in bg-white border border-gray-300 rounded-full shadow-sm hover:bg-red-200 hover:text-red-800 hover:outline-none dark:border-slate-900 dark:bg-slate-800 dark:text-white dark:hover:bg-red-800 dark:hover:text-red-200 dark:hover:outline-none sm:px-3 sm:py-1 sm:opacity-0 sm:group-hover:opacity-100"
					>
						????
						{/* <BsTrashFill className="w-4 h-4" /> */}
					</button>
				</div>
			),
			header: () => <span className=""></span>,
		}),
	];

	return (
		<PaginatedTable
			data={recipeData}
			columns={columns}
			apiPagination={recipePagination}
			entityPlural="Recipes"
			isLoading={isLoading}
			onRowClick={(row) => navigate(`/recipes/${row.id}`)}
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
			cell: (info) => <p className="">{info.getValue()}</p>,
			header: () => <span className="">Name</span>,
			enableMultiSort: true,
		}),
		columnHelper.accessor((row) => row.quantity, {
			id: "quantity",
			cell: (info) => <p className="">{info.getValue()}</p>,
			header: () => <span className="">Quantity</span>,
			enableMultiSort: true,
		}),
		columnHelper.accessor((row) => row.measure, {
			id: "measure",
			cell: (info) => <p className="">{info.getValue()}</p>,
			header: () => <span className="">Measure</span>,
			enableMultiSort: true,
		}),
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
