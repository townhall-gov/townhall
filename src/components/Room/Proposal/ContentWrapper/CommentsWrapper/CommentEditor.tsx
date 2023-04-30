// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React, { FC } from 'react';
import TextEditor from '~src/ui-components/TextEditor';

interface ICommentEditorProps {
    disabled: boolean;
    onComment: () => Promise<void>;
    onSentiment: () => Promise<void>;
    value: string;
    initialValue: string;
    onChange: (v: string) => void;
    localStorageKey: string;
    onCancel: () => void;
}

const CommentEditor: FC<ICommentEditorProps> = (props) => {
	const { disabled, onComment, onSentiment, onChange, value, initialValue, localStorageKey, onCancel } = props;
	return (
		<div className=' flex flex-col gap-y-[13px]'>
			<TextEditor
				initialValue={initialValue}
				isDisabled={disabled}
				height={225}
				value={value}
				localStorageKey={localStorageKey}
				onChange={onChange}
			/>
			<div className='flex items-center justify-end gap-x-3'>
				<button
					disabled={disabled}
					onClick={onCancel}
					className={classNames('border border-solid border-blue_primary text-blue_primary py-1 px-6 rounded-md text-base font-medium bg-transparent flex items-center justify-center', {
						'cursor-not-allowed': disabled,
						'cursor-pointer': !disabled
					})}
				>
                    Cancel
				</button>
				<button
					disabled={disabled}
					onClick={onSentiment}
					className={classNames('border border-solid border-blue_primary text-blue_primary py-1 px-6 rounded-md text-base font-medium bg-transparent flex items-center justify-center', {
						'cursor-not-allowed': disabled,
						'cursor-pointer': !disabled
					})}
				>
                    Sentiment
				</button>
				<button
					disabled={disabled}
					onClick={onComment}
					className={classNames('border border-solid border-blue_primary text-blue_primary py-1 px-6 rounded-md text-base font-medium bg-transparent flex items-center justify-center', {
						'cursor-not-allowed': disabled,
						'cursor-pointer': !disabled
					})}
				>
                    Comment
				</button>
			</div>

		</div>
	);
};

export default CommentEditor;