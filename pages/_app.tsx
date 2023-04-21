// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Montserrat } from 'next/font/google';
import AppLayout from '~src/components/AppLayout';
import '~styles/globals.css';
import type { AppProps } from 'next/app';

export const montserrat = Montserrat({
	display: 'swap',
	style: ['italic', 'normal'],
	subsets: ['latin'],
	variable: '--font-montserrat',
	weight: ['200', '300', '400', '500', '600', '700']
});

import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { FC } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';
import { wrapper } from '~src/redux/store';

const App: FC<AppProps> = ({ Component, pageProps }) => {
	const store: any = useStore();
	return <>
		<PersistGate persistor={store.__persistor}>
			<ConfigProvider>
				<main
					className={classNames(
						montserrat.variable, montserrat.className, 'bg-app_background min-h-[100vh] min-w-[100vw]'
					)}
				>
					<AppLayout Component={Component} {...pageProps} />
				</main>
			</ConfigProvider>
		</PersistGate>
	</>;
};
export default wrapper.withRedux(App);