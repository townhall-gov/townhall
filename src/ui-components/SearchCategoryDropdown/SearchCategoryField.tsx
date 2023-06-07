// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';

interface ISearchCategoryFieldProps {
    title: string;
}

const SearchCategoryField: FC<ISearchCategoryFieldProps> = (props) => {
	const { title } = props;
	return (
		<div className='flex items-center gap-x-3 text-white m-2'>
			<h5 className='m-0 p-0 text-sm leading-none'>{title}</h5>
		</div>
	);
};

export default SearchCategoryField;