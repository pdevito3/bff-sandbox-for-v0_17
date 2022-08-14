import { useAuthUser } from "@/features/Auth";
import React from "react";
import { Outlet } from "react-router";
import { PrivateHeader } from "../Headers";
import { PrivateSideNav } from "../Navigation";

function PrivateLayout() {
	const { username } = useAuthUser();

	return (
		<div className="flex w-full h-full">
			<PrivateSideNav />
			<div className="flex-1 h-screen-minus-private-header">
				<PrivateHeader />
				{/* this div covers the bg for main bodies that don't have a full height */}
				<div className="flex-1 h-full bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white">
					<div className="w-full h-full">
						<main className="px-4 py-2 bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white sm:px-6 md:py-4 md:px-8">
							{!username ? (
								<a
									href="/bff/login?returnUrl=/"
									className="inline-block px-4 py-2 text-base font-medium text-center text-white bg-blue-500 border border-transparent rounded-md hover:bg-opacity-75"
								>
									Login
								</a>
							) : null}
							<Outlet />
						</main>
					</div>
				</div>
			</div>
		</div>
	);
}

export { PrivateLayout };
