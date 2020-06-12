import * as React from 'react';

export type Key = React.Key;
export type GetRowKey<RecordType> = (record: RecordType, index?: number) => Key;
