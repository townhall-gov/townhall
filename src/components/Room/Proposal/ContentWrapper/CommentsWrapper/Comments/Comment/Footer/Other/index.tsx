// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps } from 'antd';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { DeleteIcon, EditIcon, FlagIcon, LinkIcon, ShareIcon } from '~src/ui-components/CustomIcons';

interface ICommentOtherActionsDropdownProps {
    comment_id: string;
}

const CommentOtherActionsDropdown: FC<ICommentOtherActionsDropdownProps> = (props) => {
	const { comment_id } = props;
	const router = useRouter();
	const handleEndpointChange: MenuProps['onClick'] = ({ key }) => {
		switch(key) {
		case 'copy-link': {
			const origin = window.location.origin;
			const query = router.query;
			const url = `${origin}/house/${query.house_id}/room/${query.room_id}/proposal/${query.proposal_id}#${comment_id}`;
			console.log(url);
			navigator.clipboard.writeText(url);
		}
		}
	};

	const items = [
		{
			key: 'share',
			label: (
				<div className='text-white flex items-center gap-x-[6px] font-normal text-xs leading-[15px]'>
					<ShareIcon />
					<span>Share</span>
				</div>
			)
		},
		{
			key: 'edit',
			label: (
				<div className='text-white flex items-center gap-x-[6px] font-normal text-xs leading-[15px]'>
					<EditIcon />
					<span>Edit</span>
				</div>
			)
		},
		{
			key: 'copy-link',
			label: (
				<div className='text-white flex items-center gap-x-[6px] font-normal text-xs leading-[15px]'>
					<LinkIcon />
					<span>Copy Link</span>
				</div>
			)
		},
		{
			key: 'delete',
			label: (
				<div className='text-white flex items-center gap-x-[6px] font-normal text-xs leading-[15px]'>
					<DeleteIcon />
					<span>Delete</span>
				</div>
			)
		},
		{
			key: 'flag',
			label: (
				<div className='text-white flex items-center gap-x-[6px] font-normal text-xs leading-[15px]'>
					<FlagIcon />
					<span>Flag</span>
				</div>
			)
		}
	];
	return (
		<div>
			<Dropdown
				trigger={['click']}
				menu={{ items, onClick: handleEndpointChange }}
			>
				<div className='outline-none border-none flex items-center justify-center text-blue_primary text-lg leading-none w-[22px] h-[22px] rounded-full bg-transparent hover:bg-[#2E3035] cursor-pointer'>
					<MoreOutlined className='rotate-90' />
				</div>
			</Dropdown>
		</div>
	);
};

export default CommentOtherActionsDropdown;