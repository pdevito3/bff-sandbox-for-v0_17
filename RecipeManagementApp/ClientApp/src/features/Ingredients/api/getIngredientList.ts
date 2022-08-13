import { api } from '@/lib/axios';
import { useQuery } from 'react-query';
import { IngredientKeys } from './ingredient.keys';
import queryString from 'query-string'
import { QueryParams, IngredientDto } from '../types';
import {PagedResponse, Pagination} from '@/types/api';
import {AxiosResponse} from 'axios';

interface delayProps { 
	hasArtificialDelay?: boolean;
	delayInMs?: number;
}

interface ingredientListApiProps extends delayProps {
	queryString: string
}

const getIngredients = async ({queryString, hasArtificialDelay, delayInMs} : ingredientListApiProps) => {
	queryString = queryString == '' 
		? queryString 
		: `?${queryString}`;

delayInMs = hasArtificialDelay ? delayInMs : 0;

const [json] = await Promise.all([
	api.get(`/api/ingredients${queryString}`)
	.then((response: AxiosResponse<IngredientDto[]>) => {
		return {
			data: response.data as IngredientDto[],
			pagination: JSON.parse(response.headers['x-pagination']) as Pagination
		} as PagedResponse<IngredientDto>;
	}),
	new Promise(resolve => setTimeout(resolve, delayInMs)),
])

	return json;
};


interface ingredientListHookProps extends QueryParams, delayProps {}

export const useIngredients = ({ pageNumber, pageSize, filters, sortOrder, hasArtificialDelay=false, delayInMs=450 }: ingredientListHookProps) => {
	// TODO abstract to common function for all list calls using this method	
	const sortOrderString = sortOrder && sortOrder.length > 0 
		? sortOrder?.map((s) => (s.desc ? `-${s.id}` : s.id)).join(",")
		: undefined;

		let queryParams = queryString.stringify({ pageNumber, pageSize, filters, sortOrder: sortOrderString });

	return useQuery(
		IngredientKeys.list(queryParams ?? ''),
		() => getIngredients({queryString: queryParams, hasArtificialDelay, delayInMs}),
	);
};
