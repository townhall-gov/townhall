// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export interface INotificationStore {}

export enum ENotificationStatus {
    SUCCESS= 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info'
}

export interface ISendNotificationPayloadType {
    title: string;
    status: ENotificationStatus;
    message: string;
    duration?: number;
}