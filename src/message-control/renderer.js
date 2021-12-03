import concurrentize from "../concurrentize";

const send = (channel, message) => {
  if (!window[channel]) {
    throw new Error("Cannot send to this channel");
  }

  return concurrentize(() => {
    return new Promise((resolve) => {
      window[channel].receive((result) => {
        resolve(result);
      });
      window[channel].send(message);
    });
  })
}

export default send;
