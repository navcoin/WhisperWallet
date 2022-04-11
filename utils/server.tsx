import isValidHostname from 'is-valid-hostname';
const validateIp = (host: string) => {
  return isValidHostname(host);
};

const validatePort = (port: number) => {
  return port > 0 && port < 65536;
};

export {validateIp, validatePort};
