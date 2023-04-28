// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';
import getErrorMessage from '~src/utils/getErrorMessage';

const PreviewBtn = () => {
	const dispatch = useDispatch();
	const onPublish = async () => {
		try {
			dispatch(roomActions.setLoading(true));
		} catch (error) {
			dispatch(roomActions.setLoading(false));
			dispatch(roomActions.setError(getErrorMessage(error)));
		}
	};
	return (
		<div className='mb-10'>
			<button
				onClick={onPublish}
				className='outline-none border border-solid border-[#66A5FF] flex items-center justify-center bg-blue_primary rounded-2xl text-white py-[11px] px-[22px] max-w-[188px] w-full text-base leading-[19px] font-normal tracking-[0.01em] cursor-pointer'
			>
                Publish
			</button>
		</div>
	);
};

export default PreviewBtn;