// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import { IStrategy } from '~src/redux/rooms/@types';
import AssetTypeDropdown from './AssetTypeDropdown';
import AssetDropdown from './AssetDropdown';
import { chains } from '~src/onchain-data/networkConstants';
import Contract from './Contract';

interface IAssetsProps {
    isDisabled?: boolean;
    strategy: IStrategy;
    className?: string;
}

const Assets: FC<IAssetsProps> = (props) => {
	const { strategy, isDisabled } = props;
	if (chains[strategy.network as keyof typeof chains]) {
		return null;
	}
	return (
		<>
			<AssetTypeDropdown
				strategy={strategy}
				isDisabled={isDisabled}
			/>
			<AssetDropdown
				strategy={strategy}
				isDisabled={isDisabled}
			/>
			<Contract
				strategy={strategy}
				isDisabled={isDisabled}
			/>
		</>
	);
};

export default Assets;