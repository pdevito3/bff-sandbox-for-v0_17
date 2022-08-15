import React, { MutableRefObject, PropsWithChildren, useLayoutEffect, useRef } from "react";
import { useTextField } from "react-aria";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useNavigate } from "react-router-dom";
import { useAddRecipe } from "../api";
import { RecipeForCreationDto } from "../types/index";
import { Notifications } from "@/components/Notifications";
import { useAutofocus } from "@/hooks/useAutofocus";

function NewRecipeForm() {
	const navigate = useNavigate();
	const autofocusRef = useAutofocus();
	const {
		register,
		handleSubmit,
		watch,
		reset,
		control,
		formState: { errors },
	} = useForm<RecipeForCreationDto>({
		defaultValues: {
			visibility: "public",
		},
	});

	const createRecipeApi = useAddRecipe();
	const onSubmit: SubmitHandler<RecipeForCreationDto> = (data) => createRecipe(data);
	function createRecipe(data: RecipeForCreationDto) {
		createRecipeApi
			.mutateAsync(data)
			.then(() => {
				Notifications.success("Recipe created successfully");
			})
			.then(() => {
				reset();
			})
			.catch((e) => {
				Notifications.error("There was an error creating the recipe");
				console.error(e);
			});
	}

	return (
		<div className="space-y-6">
			<button
				className="px-3 py-2 border rounded-md border-slate-700 dark:border-white"
				onClick={() => navigate(-1)}
			>
				Back
			</button>
			<div className="">
				<h1 className="max-w-4xl text-2xl font-medium tracking-tight font-display text-slate-900 dark:text-gray-50 sm:text-4xl">
					Add a Recipe
				</h1>
				<form className="py-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
					<input
						{...register("title")}
						className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						placeholder="Title..."
						ref={autofocusRef}
					/>
					<input
						{...register("visibility")}
						className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						placeholder="Visible..."
					/>
					<input
						{...register("directions")}
						className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						placeholder="Directions..."
					/>
					<input
						{...register("rating")}
						className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						placeholder="Rating..."
					/>

					<div className="">
						<input
							type="submit"
							className="px-3 py-2 text-white border rounded-md shadow cursor-pointer border-slate-violet-800 bg-violet-500 dark:border-violet-500 dark:bg-transparent dark:shadow-violet-500"
							value="Submit"
						/>
					</div>
				</form>
				<DevTool control={control} placement={"bottom-right"} />
			</div>
		</div>
	);
}

export { NewRecipeForm };
