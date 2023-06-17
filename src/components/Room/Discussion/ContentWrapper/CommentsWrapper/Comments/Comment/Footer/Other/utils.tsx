// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useProfileSelector } from '~src/redux/selectors';
import { DeleteIcon, EditIcon, FlagIcon, LinkIcon, ShareIcon } from '~src/ui-components/CustomIcons';
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

const useCommentOtherActionItems = (address: string) => {
	const { user } = useProfileSelector();
	if (user && user.address && user.address === address) {
		return items;
	}
	return items.filter((item) => !['edit', 'delete'].includes(item.key));
};

export default useCommentOtherActionItems;