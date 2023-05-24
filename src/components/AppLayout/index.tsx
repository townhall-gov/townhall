// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Layout } from 'antd';
import React, { FC } from 'react';
import Footer from './Footer';
import NavHeader from './NavHeader';
import { NextComponentType, NextPageContext } from 'next';
import CustomModal from '~src/ui-components/CustomModal';
import Sidebar from './Sidebar';

const { Content } = Layout;

interface IAppLayoutProps {
	Component: NextComponentType<NextPageContext<any>, any, any>;
	pageProps: any;
	className?: string;
}

const AppLayout: FC<IAppLayoutProps> = (props) => {
	const { Component, pageProps } = props;
	return (
		<Layout className='bg-app_background'>
			<NavHeader />
			<Layout className='min-h-[calc(100vh-194px-143px)] flex flex-row gap-x-6 m-0 px-6 py-6 bg-app_background relative'>
				<Sidebar />
				<Content className='bg-app_background'>
					<Component {...pageProps} />
				</Content>
			</Layout>
			<CustomModal />
			<Footer />
		</Layout>
	);
};

export default AppLayout;