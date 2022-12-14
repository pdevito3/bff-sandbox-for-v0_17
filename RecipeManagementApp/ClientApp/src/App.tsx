import React from "react";
import { IngredientList } from "./features/Ingredients";
import { RecipeList, NewRecipeForm, RecipeForm } from "./features/Recipes";
import { Login, useAuthUser } from "./features/Auth";
import "./custom.css";
import "react-toastify/dist/ReactToastify.min.css";
import { PrivateLayout, PublicLayout } from "./components/Layouts";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./features/Home";

function App() {
	const { isLoggedIn } = useAuthUser();

	return (
		<div className="h-full scroll-smooth antialiased [font-feature-settings:'ss01']">
			<BrowserRouter>
				<Routes>
					{/* private layout with private route children */}
					{isLoggedIn ? (
						<Route element={<PrivateLayout />}>
							<Route path="/" element={<Home />} />
							{/* route marker - remove if you don't want feature routes added by default */}
							<Route path="/ingredients" element={<IngredientList />} />
							<Route path="recipes" element={<RecipeList />} />
							<Route path="recipes/new" element={<NewRecipeForm />} />
							<Route path="recipes/:recipeId" element={<RecipeForm />} />
							{/* <Route index element={<LeagueStandings />} /> */}
						</Route>
					) : null}

					{/* public layout with public route children */}
					<Route element={<PublicLayout />}>
						{/* // TODO do this on server side */}
						{!isLoggedIn ? <Route path="/" element={<Login />} /> : null}
						<Route path="/login" element={<Login />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
