const validateIp = (host: string) => {
  return host.match(/\./g).length === 3;
};

const validatePort = (port: number) => {
  return port > 0 && port < 65536;
};

export {validateIp, validatePort};
