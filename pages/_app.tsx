// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Montserrat } from 'next/font/google';
import AppLayout from '~src/components/AppLayout';
import type { AppProps } from 'next/app';
import Image from 'next/image';
import NextNProgress from 'nextjs-progressbar';
import { antdTheme } from '~styles/antdTheme';

export const montserrat = Montserrat({
	adjustFontFallback: false,
	display: 'swap',
	style: ['italic', 'normal'],
	subsets: ['latin'],
	variable: '--font-montserrat',
	weight: ['200', '300', '400', '500', '600', '700']
});

import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';
import { wrapper } from '~src/redux/store';
import { useRouter } from 'next/router';

import 'antd/dist/reset.css';
import '~styles/globals.css';

const App: FC<AppProps> = ({ Component, pageProps }) => {
	const store: any = useStore();
	const router = useRouter();
	const [showSplashScreen, setShowSplashScreen] = useState(true);

	useEffect(() => {
		router.isReady && setShowSplashScreen(false);
	}, [router.isReady]);

	const SplashLoader = () => <div style={{ background:'#F5F5F5', minHeight: '100vh', minWidth: '100vw' }}>
		<Image
			style={{ left:'calc(50vw - 16px)', position:'absolute', top:'calc(50vh - 16px)' }}
			width={32}
			height={32}
			src='/favicon.ico'
			alt={'Loading'}
		/>
	</div>;
	return <>
		<PersistGate persistor={store.__persistor}>
			<ConfigProvider theme={antdTheme}>
				<>
					{ showSplashScreen && <SplashLoader /> }
					<main
						className={classNames(
							montserrat.variable, montserrat.className, 'bg-app_background min-h-[100vh] min-w-[100vw]',
							{
								'block': !showSplashScreen,
								'hidden': showSplashScreen
							}
						)}
					>
						<NextNProgress color="#66A5FF" />
						<AppLayout Component={Component} pageProps={pageProps} />
					</main>
				</>
			</ConfigProvider>
		</PersistGate>
	</>;
};
export default wrapper.withRedux(App);