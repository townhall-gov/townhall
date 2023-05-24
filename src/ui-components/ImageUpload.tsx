// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { message, Progress, Upload } from 'antd';
import React, { FC, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { IMG_BB_API_KEY } from '~src/global/imgAPIKey';

const beforeUpload = (file: RcFile) => {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
		message.error('You can only upload JPG/PNG file!');
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		message.error('Image must smaller than 2MB!');
	}
	return isJpgOrPng && isLt2M;
};

interface IImageUploadProps {
    imageUrl: string;
    setImageUrl: (url: string) => void;
}

const ImageUpload: FC<IImageUploadProps> = (props) => {
	const { imageUrl, setImageUrl } = props;
	const [progress, setProgress] = useState(0);
	const [loading, setLoading] = useState(false);

	const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
		if (info.file.status === 'uploading') {
			setProgress(0);
			setImageUrl('');
			setLoading(true);
		}
		if (info.file.status === 'done' && info.file.originFileObj) {
			setProgress(0);
			setImageUrl('');
			const xhr = new XMLHttpRequest();
			xhr.withCredentials = false;
			xhr.open('POST', 'https://api.imgbb.com/1/upload?key=' + IMG_BB_API_KEY);

			xhr.upload.onprogress = (e) => {
				if (loading) {
					setLoading(false);
				}
				setProgress(Number((e.loaded / e.total * 100).toFixed(1)));
			};

			xhr.onload = () => {
				setLoading(false);
				if (xhr.status === 403) {
					message.error('HTTP Error: ' + xhr.status);
					return;
				}

				if (xhr.status < 200 || xhr.status >= 300) {
					message.error('HTTP Error: ' + xhr.status);
					return;
				}

				const json = JSON.parse(xhr.responseText);

				if (!json || typeof json?.data?.display_url != 'string') {
					message.error('HTTP Error: ' + xhr.responseText);
					return;
				}

				setImageUrl(json?.data?.display_url);
			};
			xhr.onerror = () => {
				message.error('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
				setLoading(false);
			};
			const formData = new FormData();
			formData.append('image', info.file.originFileObj, `${info.file.fileName}_${new Date().valueOf()}.jpg`);
			xhr.send(formData);
		}
	};
	const uploadButton = (
		<div className='w-full'>
			{
				progress?
					<div className='flex flex-col justify-center items-center'>
						<p className='text-white'>Loading {progress}%</p>
						<Progress
							className='w-[75%] text-white'
							percent={progress}
							status="active"
							showInfo={false}
						/>
					</div>
					: loading?
						<p className='flex items-center justify-center text-blue_primary text-2xl'>
							<LoadingOutlined />
						</p>
						:<p className='flex flex-col items-center justify-center text-lg font-medium text-[#ABA3A3]'>
							<PlusOutlined />
							<span>Room logo</span>
						</p>
			}
		</div>
	);
	// eslint-disable-next-line @next/next/no-img-element
	const img = (<img src={imageUrl} alt="avatar" style={{ width: '100%' }} />);
	return (
		<div>
			<Upload
				name="avatar"
				listType="picture-card"
				className=""
				showUploadList={false}
				beforeUpload={beforeUpload}
				onChange={handleChange}
			>
				{imageUrl ? <div className='p-1'>{img}</div> : uploadButton}
			</Upload>
		</div>
	);
};

export default ImageUpload;