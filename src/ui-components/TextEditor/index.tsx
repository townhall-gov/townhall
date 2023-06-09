// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { LoadingOutlined } from '@ant-design/icons';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Spin } from 'antd';
import { IMG_BB_API_KEY } from '~src/global/imgAPIKey';
import { useEditorSelector } from '~src/redux/selectors';
import { useDispatch } from 'react-redux';
import { editorActions } from '~src/redux/editor';

interface ITextEditorProps {
    className?: string;
	spinClassName?: string;
    height?: number | string;
    initialValue: string;
    value?: string;
    onChange: (value: string) => void;
    localStorageKey?: string;
	isDisabled?: boolean;
	imageNamePrefix: string;
}

const TextEditor: FC<ITextEditorProps> = (props) => {
	const { className, spinClassName, height, onChange, localStorageKey, value, isDisabled, imageNamePrefix } = props;
	const initialValue = useRef(props.initialValue || (localStorageKey? (localStorage.getItem(localStorageKey) || ''): ''));
	const [spin, setSpin] = useState(true);
	const ref = useRef<Editor>(null!);
	const { isClean } = useEditorSelector();
	const dispatch = useDispatch();

	useEffect(() => {
		if (value !== initialValue.current) {
			onChange(initialValue.current);
		}
		const timeout = setTimeout(() => {
			setSpin(false);
		}, 1000);
		return () => {
			clearTimeout(timeout);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (isClean) {
			ref.current.editor?.setContent('');
			dispatch(editorActions.setIsClean(false));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isClean]);

	useEffect(() => {
		ref.current.editor?.setContent(props.initialValue);
		initialValue.current = props.initialValue;
	}, [props.initialValue]);

	return (
		<div style={{
			minHeight: `${height || 300}px`
		}} className={classNames('flex-1 w-full', className)}>
			<Spin className={classNames('bg-app_background', spinClassName)} spinning={spin} indicator={<LoadingOutlined />}>
				<Editor
					ref={ref}
					disabled={isDisabled}
					initialValue={initialValue.current}
					onEditorChange={(v) => {
						onChange(v);
						if (localStorageKey && !v.includes('src="data:image')) {
							localStorage.setItem(localStorageKey, v);
						}
					}}
					// apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
					init={{
						block_unsupported_drop: false,
						branding: false,
						content_css: 'dark',
						content_style: 'body { font-family: Montserrat, sans-serif; font-size: 14px; letter-spacing: 1px; line-height: 1.5; }',
						height: height || 300,
						images_file_types: 'jpg,png,jpeg,svg,gif',
						images_upload_handler: (blobInfo, progress) => {
							return new Promise<string>((resolve, reject) => {
								const xhr = new XMLHttpRequest();
								xhr.withCredentials = false;
								xhr.open('POST', 'https://api.imgbb.com/1/upload?key=' + IMG_BB_API_KEY);

								xhr.upload.onprogress = (e) => {
									progress(Number((e.loaded / e.total * 100).toPrecision(2)));
								};

								xhr.onload = () => {
									if (xhr.status === 403) {
										reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
										return;
									}

									if (xhr.status < 200 || xhr.status >= 300) {
										reject('HTTP Error: ' + xhr.status);
										return;
									}

									const json = JSON.parse(xhr.responseText);

									if (!json || typeof json?.data?.display_url != 'string') {
										reject('Invalid JSON: ' + xhr.responseText);
										return;
									}

									resolve(json?.data?.display_url);
								};
								xhr.onerror = () => {
									reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
								};
								const formData = new FormData();
								formData.append('image', blobInfo.blob(), `${imageNamePrefix}_${blobInfo.filename()}`);
								xhr.send(formData);
							});
						},
						menubar: false,
						paste_data_images: true,
						plugins: [
							'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
							'searchreplace', 'visualblocks', 'code', 'fullscreen',
							'insertdatetime', 'media', 'table'
						],
						skin: 'oxide-dark',
						toolbar: 'undo redo preview | ' +
							'bold italic backcolor | ' +
							'bullist numlist table | ' +
							'removeformat link image code',
						xss_sanitization: true
					}}
				/>
			</Spin>
		</div>
	);
};

export default styled(TextEditor)``;