---
id: api-logging
title: Logging
---

The logging module is exposed only as a named import :

```js
import {logging} from '@kazeblockchain/krypton-js'
logging.logger.setAll('info') // sets logging level of krypton-js to 'info'
const apiLogger = logging.logger.getLogger('api') // gets the logger for the api package
apiLogger.setLevel('warn') // sets logging level only on the logger for the api package
```

All logs are piped towards `stdout` and `stderr`. Each named package within `krypton-js` will have its own logger. The initial setting for all loggers is 'slient'.
