import { api } from '@/lib/axios';
import { useQuery } from 'react-query';
import { IngredientKeys } from './ingredient.keys';
import queryString from 'query-string'
import { QueryParams, IngredientDto } from '../types';
import {PagedResponse, Pagination} from '@/types/api';
import {AxiosResponse} from 'axios';

const getIngredients = (queryString: string) => {
	queryString = queryString == '' 
		? queryString 
		: `?${queryString}`;

	return api.get(`/api/ingredients${queryString}`)
		.then((response: AxiosResponse<IngredientDto[]>) => {
			return {
				data: response.data as IngredientDto[],
				pagination: JSON.parse(response.headers['x-pagination']) as Pagination
			} as PagedResponse<IngredientDto>;
	});
};

export const useIngredients = ({ pageNumber, pageSize, filters, sortOrder }: QueryParams) => {
	// TODO abstract to common function for all list calls using this method	
	const sortOrderString = sortOrder && sortOrder.length > 0 
		? sortOrder?.map((s) => (s.desc ? `-${s.id}` : s.id)).join(",")
		: undefined;

		let queryParams = queryString.stringify({ pageNumber, pageSize, filters, sortOrder: sortOrderString });

	return useQuery(
		IngredientKeys.list(queryParams ?? ''),
		() => getIngredients(queryParams)
	);
};
