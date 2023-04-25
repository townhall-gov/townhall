// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { timeline } from '../../utils';
import Line from './Line';
import classNames from 'classnames';

const HighlightLines = () => {
	return (
		<article className={classNames('flex items-center gap-x-3 my-[37px]')}>
			{
				timeline.map((item, index) => {
					return (
						<Line key={index} {...item}  />
					);
				})
			}
		</article>
	);
};

export default HighlightLines;