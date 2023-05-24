// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
'use client';

import { TApiResponse, TParams } from '~src/api/types';
import getErrorMessage from '~src/utils/getErrorMessage';
import messages from '~src/utils/messages';
import { getLocalStorageToken } from './auth.service';

const paramsKeyConvert = (str = '') => str.replace(/[A-Z]/g, ([s]) => `_${s.toLowerCase()}`);

class Api {
	endpoint: string;
	constructor() {
		this.endpoint = '';
	}
	fetch<T>(path: string, params: TParams, options?: RequestInit) {
		const endpoint = new URL(
			'/api/',
			// Only use for client side
			window.location.origin
		).href;
		if (this.endpoint !== endpoint) {
			this.endpoint = endpoint;
		}
		const url = new URL(path, this.endpoint);
		for (const key of Object.keys(params)) {
			url.searchParams.set(paramsKeyConvert(key), params[key]);
		}
		const token = getLocalStorageToken();
		options = {
			...options,
			headers: {
				...options?.headers,
				Authorization: (token ? `Bearer ${token}` : '')
			}
		};
		return new Promise<TApiResponse<T>>((resolve) =>
			fetch(url, options)
				.then((resp) => {
					resp.json().then((res) => {
						if (resp.status === 200) {
							return resolve({
								data: res as T,
								error: undefined,
								status: resp.status
							});
						} else {
							return resolve({
								data: undefined,
								error: res.error || messages.API_FETCH_ERROR,
								status: resp.status
							});
						}
					});
				})
				.catch((e) =>
					resolve({
						data: undefined,
						error: getErrorMessage(e),
						status: 500
					})
				)
		);
	}

	/** T means response type, B means body type */
	async post<T, B>(path: string, body?: B, options?: RequestInit) {
		const result = await this.fetch<T>(
			path,
			{},
			{
				body: body? JSON.stringify(body): null,
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST',
				...options
			}
		);
		return result;
	}

	/** T means response type, Q means query type */
	async get<T, Q>(path: string, params: TParams & Q, options?: RequestInit) {
		const result = await this.fetch<T>(
			path,
			params,
			{
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'GET',
				...options
			}
		);
		return result;
	}
}

const api =  (() => {
	return new Api();
})();

export default api;