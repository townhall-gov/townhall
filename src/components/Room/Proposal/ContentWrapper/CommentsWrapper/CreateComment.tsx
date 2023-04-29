// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useRef } from 'react';
import { useProfileSelector } from '~src/redux/selectors';
import Address from '~src/ui-components/Address';
import TextEditor from '~src/ui-components/TextEditor';
import CommentedUserImage from './CommentedUserImage';

const CreateComment = () => {
	const timeout = useRef<NodeJS.Timeout>();
	const { user } = useProfileSelector();
	if (!user || !user.address) {
		return null;
	}
	return (
		<section className='flex gap-x-[10px]'>
			<div className='w-10'>
				<CommentedUserImage />
			</div>
			<div className='flex-1 flex flex-col gap-y-[13px]'>
				<p className='flex items-center gap-x-2 m-0 text-base text-white font-medium leading-[20px] tracking-[0.01em]'>
					<span>By</span>
					{
						user.username?
							<span>{user.username}</span>
							: (
								<Address
									identiconSize={20}
									ethIdenticonSize={20}
									address={user.address}
								/>
							)
					}

				</p>
				<TextEditor
					initialValue={''}
					isDisabled={false}
					height={250}
					value={''}
					localStorageKey='new_proposal_comment'
					onChange={() => {
						clearTimeout(timeout.current);
						timeout.current = setTimeout(() => {
							clearTimeout(timeout.current);
						}, 1000);
					} }
				/>
				<div className='flex items-center justify-end'>
					<button
						className='border border-solid border-blue_primary text-blue_primary py-1 px-6 rounded-md text-base font-medium bg-transparent flex items-center justify-center cursor-pointer'
					>
						Comment
					</button>
				</div>
			</div>
		</section>
	);
};

export default CreateComment;