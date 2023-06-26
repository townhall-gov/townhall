// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import { IStrategy } from '~src/redux/rooms/@types';

interface ITokenInfoProps {
    isDisabled?: boolean;
    strategy: IStrategy;
    className?: string;
}

const TokenInfo: FC<ITokenInfoProps> = (props) => {
	const { strategy } = props;
	const token_metadata = strategy.token_metadata[strategy.asset_type];
	if (!token_metadata) {
		return null;
	}
	return (
		<div className='flex-1 grid grid-cols-2 gap-x-3'>
			<article className='col-span-1'>
				<h5>Symbol</h5>
				<p className='px-[18.5px] py-[21.5px] border border-solid border-blue_primary rounded-2xl text-white font-medium text-base leading-none'>
					{token_metadata.symbol}
				</p>
			</article>
			<article className='col-span-1'>
				<h5>Decimals</h5>
				<p className='px-[18.5px] py-[21.5px] border border-solid border-blue_primary rounded-2xl text-white font-medium text-base leading-none'>
					{token_metadata.decimals}
				</p>
			</article>
		</div>
	);
};

export default TokenInfo;