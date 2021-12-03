
let masterPromise = Promise.resolve();

const concurrentize = async (asyncFunc, ...args) => {

  await masterPromise;

  masterPromise = masterPromise.then(() => {
    return asyncFunc(...args);
  });

  return masterPromise;
}

export default concurrentize;
