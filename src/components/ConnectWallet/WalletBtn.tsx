// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React, { FC } from 'react';
import WalletIcon from '~src/ui-components/WalletIcon';
import { EWallet } from '~src/types/enums';
interface IWalletBtnProps {
    type: EWallet;
    onClick: (type: EWallet) => void;
    title?: string;
    className?: string;
    titleClassName?: string;
    walletWrapperClassName?: string;
    walletClassName?: string;
}

const WalletBtn: FC<IWalletBtnProps> = (props) => {
	const { onClick, type, title, titleClassName, walletClassName, walletWrapperClassName } = props;
	return (
		<button onClick={() => onClick(type)} className={classNames('flex items-center justify-center gap-x-2 bg-app_background outline-0 cursor-pointer', props.className)}>
			<span className={classNames('flex items-center justify-center', walletWrapperClassName)}>
				<WalletIcon className={classNames('text-2xl', walletClassName)} type={type} />
			</span>
			{
				title?
					<p className={classNames('m-0 p-0 text-white text-lg leading-6 font-normal', titleClassName)}>{title}</p>
					: null
			}
		</button>
	);
};

export default WalletBtn;