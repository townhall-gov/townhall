// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Button } from 'antd';
import classNames from 'classnames';
import React, { FC } from 'react';
import TextEditor from '~src/ui-components/TextEditor';

interface ICommentEditorProps {
    loading: boolean;
    onComment: () => Promise<void>;
    onSentiment: () => Promise<void>;
    value: string;
    initialValue: string;
    onChange: (v: string) => void;
    localStorageKey: string;
    onCancel: () => void;
	imageNamePrefix: string;
}

const ReplyEditor: FC<ICommentEditorProps> = (props) => {
	const { loading, onComment, onSentiment, onChange, value, initialValue, localStorageKey, onCancel, imageNamePrefix } = props;
	return (
		<div className=' flex flex-col gap-y-[13px]'>
			<TextEditor
				imageNamePrefix={imageNamePrefix}
				initialValue={initialValue}
				isDisabled={loading}
				height={225}
				value={value}
				localStorageKey={localStorageKey}
				onChange={onChange}
			/>
			<div className='flex items-center justify-end gap-x-3'>
				<Button
					loading={loading}
					disabled={loading}
					onClick={onCancel}
					className={classNames('border border-solid border-blue_primary text-blue_primary py-1 px-6 rounded-md text-base font-medium bg-transparent flex items-center justify-center', {
						'cursor-not-allowed': loading,
						'cursor-pointer': !loading
					})}
				>
                    Cancel
				</Button>
				<Button
					loading={loading}
					disabled={loading}
					onClick={onSentiment}
					className={classNames('border border-solid border-blue_primary text-white py-1 px-6 rounded-md text-base font-medium bg-blue_primary flex items-center justify-center', {
						'cursor-not-allowed': loading,
						'cursor-pointer': !loading
					})}
				>
                    Sentiment
				</Button>
				<Button
					loading={loading}
					disabled={loading}
					onClick={onComment}
					className={classNames('border border-solid border-blue_primary text-white py-1 px-6 rounded-md text-base font-medium bg-blue_primary flex items-center justify-center', {
						'cursor-not-allowed': loading,
						'cursor-pointer': !loading
					})}
				>
                    Comment
				</Button>
			</div>

		</div>
	);
};

export default ReplyEditor;