export enum EFormat {
  'JSON' = 'json',
  'HTML' = 'html',
  'MARKDOWN' = 'md'
}

export enum EChannel {
  PORT_FROM_WORKER = 'port_from_worker',
  SEND_MESSAGE_PORT = 'send_message_port',
  SEND_SERVER_PORT = 'send_server_port',
  EDITOR_CONTENT = 'editor_content',
  CLICK_MESSAGE = 'click_message',
  VERIFY_IMPORT = 'verify_import',
  VERIFY_IMPORT_RESULT = 'verify_import_result',
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
  PURE_REDIRECT = 'pure_redirect',
  GET_CONFIG = 'get_config',
  GET_CONFIG_RESULT = 'get_config_result',
  GET_FILE_PATH = 'get_file_path',
  GET_FILE_PATH_RESULT = 'get_file_path_result',
  UPDATE_CONFIG = 'update_config',
  UPDATE_CONFIG_RESULT = 'update_config_result',
  CLOSE_SETTINGS_WINDOW = 'close_settings_window',
  NAVIGATE_TO_HOME = 'navigate_to_home',
  OPEN_EXTERNAL_URL = 'open_external_url'
}
