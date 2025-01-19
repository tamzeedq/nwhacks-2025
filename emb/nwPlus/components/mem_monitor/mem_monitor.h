#pragma once

#ifdef __cplusplus
extern "C" {
#endif

// Starts a task that periodically prints free heap
void mem_monitor_start(void);

#ifdef __cplusplus
}
#endif
