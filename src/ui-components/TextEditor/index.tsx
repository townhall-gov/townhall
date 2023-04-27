// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import styled from 'styled-components';
import classNames from 'classnames';

interface ITextEditorProps {
    className?: string;
    height?: number | string;
    initialValue: string;
    value?: string;
    onChange: (value: string) => void;
    localStorageKey?: string;
}

const TextEditor: FC<ITextEditorProps> = (props) => {
	const { className, height, onChange, localStorageKey, value } = props;
	const initialValue = useRef(props.initialValue || (localStorageKey? (localStorage.getItem(localStorageKey) || ''): ''));
	useEffect(() => {
		if (value !== initialValue.current) {
			onChange(initialValue.current);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className={classNames('flex-1 w-full', className)}>
			<Editor
				initialValue={initialValue.current}
				onEditorChange={(v) => {
					onChange(v);
					if (localStorageKey) {
						localStorage.setItem(localStorageKey, v);
					}
				}}
				apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
				init={{
					content_css: 'dark',
					content_style: 'body { font-family: Montserrat, sans-serif; font-size: 14px; letter-spacing: 1px; line-height: 1.5; }',
					height: height || 300,
					menubar: 'file edit view insert format tools table tc help',
					plugins: [
						'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
						'searchreplace', 'visualblocks', 'code', 'fullscreen',
						'insertdatetime', 'media', 'table'
					],
					skin: 'oxide-dark',
					toolbar: 'undo redo | ' +
						'bold italic backcolor | alignleft aligncenter ' +
						'alignright alignjustify | bullist numlist outdent indent | ' +
						'removeformat | table help '
				}}
			/>
		</div>
	);
};

export default styled(TextEditor)``;