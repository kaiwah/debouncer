/**
 * @class Debouncer
 * @params {Integer} milliseconds of debounce delay
 * @params {Object} context of the scope of where the debouncer is ran
 * @description: 
 *  Provides a wrapper to allow group together multiple of the same function runs
 */
class Debounce {
  constructor(delay, context){
    this.tids = [];
    this.queue = new WeakMap();
    this.delay = delay || 1000;
    this.context = context || this;
    this.count = 0;
  }
  /**
   * @method clear
   * @returns {null}
   * @description:
   *  Clears any running function added to this debouncer instance
   */
  clear(){
    if (this.tids.length){
      for (const timerId of this.tids){
        clearTimeout(timerId);
      }
    }
  }
  /**
   * @method add
   * @params {Object} a function to add to the queue
   * @params {Array<Any>} list of parameters to pass into invocation
   * @returns {Boolean}
   * @description
   *  Add a task to the queue
   */
  add(func, params = []){
    if (typeof func !== 'function'){
      console.error(`Invalid Function added to Debounce`);
      return false;
    }
    const timerId = setTimeout(()=>{
      func.apply(this.context, params);
      this.dequeue(func);
      --this.count;
    }, this.delay);
    this.queue.set(func, {
      id: timerId,
      lastAdded: Date.now(),
      params: [...params]
    });
    this.tids.push(timerId);
    return true;
  }
  /**
   * @method has
   * @params {Object} a function to check in the queue
   * @returns {Boolean}
   * @description
   *  Checks if a function already exists in a queue
   */
  has(func){
    return this.queue.has(func);
  }
  /**
   * @method dequeue
   * @params {Object} a function to delete in the queue
   * @returns {Boolean}
   * @description
   *  Delete a function from the queue
   */
  dequeue(func){
    const meta = this.queue.get(func),
          idx = this.tids.indexOf(meta.id);
    this.tids.splice(idx, 1);
    this.queue.delete(func);
  }
  /**
   * @method restart
   * @params {Object} a function
   * @description 
   *  Restarts the timer on a specific task
   */
  restart(func){
    const tids = this.tids,
          task = this.queue.get(func);
    // set a hard limit to prevent overflow 
    if (Date.now() - task.lastAdded < (this.delay/50)){
      return;
    }
    clearTimeout(task.id); 
    tids.splice(tids.indexOf(task.id),1);
    this.add(func, task.params);
  }
  /**
   * @method run
   * @params {Object} a function to delete in the queue
   * @params {Any} any parameters for the function to intake
   * @returns {Boolean}
   * @description
   *  Add a function to a queue and run it based on delay
   */
  run(func, params = []){
    if (this.has(func)){
      this.restart(func);
    } else {
      ++this.count;
      this.add(func, params);
    }
  }
}
module.exports = Debounce;
