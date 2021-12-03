import concurrentize from "./index";

const delay = timer => new Promise(resolve => setTimeout(() => resolve(timer), timer));

describe("concurrentize", () => {
  it("returns result", async () => {
    const promise1 = concurrentize(delay, 50);

    await expect(promise1).resolves.toBe(50);
  });
  it("resolves 2 promises", async () => {
    const promise1 = concurrentize(delay, 50);
    const promise2 = concurrentize(delay, 50);

    await expect(promise1).resolves.toBe(50);
    await expect(promise2).resolves.toBe(50);
  });
  it("resolves promise in order", async () => {
    const promise1 = concurrentize(delay, 1000);
    const promise2 = concurrentize(delay, 500);

    const winner = await Promise.race([promise1, promise2])

    await expect(winner).toBe(1000);
  });

  it('resolves promises after they are done', async () => {
    await expect(concurrentize(delay, 500)).resolves.toBe(500);
    await expect(concurrentize(delay, 500)).resolves.toBe(500);
    await expect(concurrentize(delay, 500)).resolves.toBe(500);
  })
})
