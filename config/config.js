// utils/config.js
import 'dotenv/config';

export const TOOLS_BASE_URL = process.env.TOOLS_BASE_URL;
// export const INTERNAL_TOOL_SECRET= process.env.INTERNAL_TOOL_SECRET;
export const ERP_API_BASE_URL = process.env.ERP_API_BASE_URL;
export const CREATE_LOG_CALL_REQUEST_LOGGER = process.env.CREATE_LOG_CALL_REQUEST_LOGGER;
export const IBOB_SERVER_KEY=process.env.IBOB_SERVER_KEY;

export const UV= process.env.UV;
export const ULTRAVOX_API_URL= process.env.ULTRAVOX_API_URL;
export const E_ADMIN_API_KEY = process.env.E_ADMIN_API_KEY;
export const E_ADMIN_API_SECRET = process.env.E_ADMIN_API_SECRET;
export const ERP_SESSION_LOG_URL = process.env.ERP_SESSION_LOG_URL;
export const INBOUND_SERVER_LOG_ENABLED = process.env.INBOUND_SERVER_LOG_ENABLED;

export const PORT = process.env.PORT || 3000;