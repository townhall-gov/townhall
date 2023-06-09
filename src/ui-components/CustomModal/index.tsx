// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { modalActions } from '~src/redux/modal';
import { useModalSelector } from '~src/redux/selectors';
import ModalContent from './Content';
import ModalTitle from './Title';
import ModalFooter from './Footer';

interface ICustomModalProps {}

const CustomModal: FC<ICustomModalProps> = () => {
	const dispatch = useDispatch();
	const { open, titleType, footerType, contentType } = useModalSelector();
	const onCancel = () => dispatch(modalActions.setOpen(false));
	return (
		<Modal
			open={open}
			onCancel={onCancel}
			title={
				<div className='flex items-center bg-[#04152F] justify-between gap-x-2'>
					<h3 className='m-0 text-white font-semibold text-2xl leading-[32px] '>
						<ModalTitle type={titleType} />
					</h3>
					<button onClick={onCancel} className='cursor-pointer border-none w-[10px] h-[10px] outline-none bg-transparent flex items-center justify-center text-[#66A5FF]'>
						<CloseOutlined />
					</button>
				</div>
			}
			className='p-0'
			closable={false}
			footer={<ModalFooter type={footerType} />}
		>
			<ModalContent type={contentType} />
		</Modal>
	);
};

export default CustomModal;