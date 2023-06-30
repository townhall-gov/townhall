// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';

interface IModalTriggerProps {
    total: number;
}

const ModalTrigger: FC<IModalTriggerProps> = (props) => {
	const { total } = props;
	const dispatch = useDispatch();
	const handleModalTrigger = () => {
		dispatch(modalActions.setModal({
			contentType: EContentType.MULTIPLE_JOINED_ROOMS,
			footerType: EFooterType.NONE,
			open: true,
			titleType: ETitleType.MULTIPLE_JOINED_ROOMS
		}));
	};
	return (
		<button
			onClick={handleModalTrigger}
			className='border-none outline-none w-[45px] h-[45px] my-2 mb-[17px] rounded-3xl bg-white flex items-center justify-center font-normal text-base leading-[19.5px] tracking-[0.01em] text-[#0E2D59] cursor-pointer'
		>
            +{total}
		</button>
	);
};

export default ModalTrigger;