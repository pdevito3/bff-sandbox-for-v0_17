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
			<div className="w-full h-full">
				<PrivateHeader />
				<main className="flex-1 h-full p-4 bg-gray-50 dark:bg-gray-900">
					<div className="">
						{!username ? (
							<a
								href="/bff/login?returnUrl=/"
								className="inline-block px-4 py-2 text-base font-medium text-center text-white bg-blue-500 border border-transparent rounded-md hover:bg-opacity-75"
							>
								Login
							</a>
						) : null}
					</div>
					<Outlet />
				</main>
			</div>
		</div>
	);
}

export { PrivateLayout };
