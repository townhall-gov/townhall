// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import React from 'react';

const CommentedUserImage = () => {
	return (
		<Avatar
			className='text-app_background w-10 h-10 flex items-center justify-center bg-white' icon={<UserOutlined />}
		/>
	);
};

export default CommentedUserImage;