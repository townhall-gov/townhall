// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FC } from 'react';
import RoomCreate from '~src/components/RoomCreate';

interface IRoomCreationServerProps {}
interface IRoomCreationClientProps extends IRoomCreationServerProps {}

const RoomCreation: FC<IRoomCreationClientProps> = () => {
	return (
		<div>
			<RoomCreate />
		</div>
	);
};

export default RoomCreation;