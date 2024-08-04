export enum EFormat {
    'JSON' = 'json',
    'HTML' = 'html',
    'MARKDOWN' = 'md',
}

export enum EChannel {
    PORT_FROM_WORKER = 'port_from_worker',
    SEND_SERVER_PORT = 'send_server_port',
    IMPORT_DIARY = 'import_diary',
    IMPORT_ALL_DIARY = 'import_all_diary',
    IMPORT_DIARY_VALUE = 'import_diary_value',
    IMPORT_ALL_DIARY_VALUE = 'import_all_diary_value',
    EXPORT_DIARY = 'export_diary',
    EXPORT_ALL_DIARY = 'export_all_diary',
    EXPORT_DIARY_VALUE = 'export_diary_value',
    EXPORT_ALL_DIARY_VALUE = 'export_all_diary_value',
    NOTIFY_SUCCESS = 'notify_success',
    NOTIFY_ERROR = 'notify_error',
}
