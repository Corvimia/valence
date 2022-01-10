let masterPromise: Promise<any> = Promise.resolve();

async function concurrentize<S>(asyncFunc: (...a: any[]) => Promise<any>, ...args: any[]): Promise<S> {

    await masterPromise;

    masterPromise = masterPromise.then(() => {
        return asyncFunc(...args);
    });

    return masterPromise.then(_ => _ as S);
}

export default concurrentize;
