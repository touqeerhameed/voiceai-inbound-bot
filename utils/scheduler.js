// scheduler.js

import { create_call_active_log } from '../api/erpcall.js';
import activeCalls from './activeCallsStore.js';
import { logMessage } from './logger.js';

export function startCallLogLoop(intervalMs, settings) {
  async function loop() {
    try {
       logMessage('Active call count:', activeCalls.size);
      

      await create_call_active_log(
        activeCalls.size,
        0,
        "INBOUND",
        settings?.no_of_job_pick_sett,
        settings?.max_active_call_count_sett
      );
    } catch (err) {
      logMessage("❌ Error in create_call_active_log:", err.message);
      console.error("❌ Error in create_call_active_log:", err.message);
    } finally {
      setTimeout(loop, intervalMs); // Schedule next only after completion
    }
  }

  loop(); // Initial trigger
}
