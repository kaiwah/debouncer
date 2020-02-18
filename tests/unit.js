'use strict';
const Debounce = require('../debouncer'),
      db = new Debounce(200, this);

/** Test: Single fn Run **/
const Test1 = function(){
  return new Promise((res,rej)=>{
    var cnt = 0,
        f1 = ()=>{ ++cnt; if (cnt === 1){ console.log('PASSED: Same fn ran only once in multiple successions'); res(); } },
        flag = false;
    for (let i = 0; i < 100; ++i){
      db.run(f1);
      if (db.count !== 1){
        console.error('FAILED: Same fn ran in multiple successions');
        return;
      }
    }
  });
};

/** Test: Multiple fn Runs **/
const Test2 = function(){
  return new Promise((res, rej)=>{
    var cnt = 0, flag = false;
    const success = ()=>{ console.log('PASSED: Multiple fn ran only once in multiple successions'); res(); },
          f1 = ()=>{ ++cnt; if (cnt===3) { success(); }},
          f2 = ()=>{ ++cnt; if (cnt===3) { success(); }},
          f3 = ()=>{ ++cnt; if (cnt===3) { success(); }};
    for (let i = 0; i < 100; ++i){
      db.run(f1);
      for (let k = 0; k < 200; ++k){
        db.run(f2);
        for (let m = 0; m < 300; ++m){
          db.run(f3);
          if (db.count !== 3)
            flag = true;
        }
          
      }
    }
    if (flag)
      console.error('FAILED: Multiple fn ran more than once on multiple successions');
  });
};

/** Test Executions **/
Test1()
  .then(Test2)
