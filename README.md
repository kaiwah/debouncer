<p align="center">
  # Debouncer
</p>
---

Debouncer is a class that allows for functions to run on the _tailend_ of the calls such that it limits the amount of successive calls preventing too many unnecessary calls at once. 

When to Use Examples:
A. Handling Mouse Events
B. Calling Hydration Events

### How to Use
```
const Debounce = require('debouncer'),
      db = new Debounce(500, this); // 500 millisecond delay, using this context

var fizzBuzz = function(){ ...  };
db.run(fizzBuzz);
```

### Notes
* Always use variable referenced functions within the run function. Otherwise the debouncer will treat every function (regardless of functionality) as a new function due to its new assigned reference
* There is a hard-set limit to how many times a function can be restarted consecutively which is 50 times within the delay period specified

### Improvements
** Support for non-referenced functions **
We can validate a duplicate function by simply doing a string comparison between the two. However this will modify our design architecture overall for how the class ingests functions

** Utilization/Support for Promises **
We should allow for promise chaining and also return a promise once all functions have been completed
