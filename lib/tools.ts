export const genRandomDigits = () => {
    
}

export const calculateNextCidrBlock = (existingCidrs: string[]): string => {
    // This is a simplified example that assumes /24 CIDR blocks and increments by 1
    // In a real-world scenario, you should implement robust logic to handle various CIDR block sizes and avoid overlaps
    const baseCidr = '10.0.0.0/16';
    const cidrParts = baseCidr.split('/');
    const baseIp = cidrParts[0].split('.').map(Number);
    const baseSize = parseInt(cidrParts[1], 10);

    let maxSubnet = 0;
    console.log(`existingCidrs====>${existingCidrs}`)
    existingCidrs.forEach((cidr:string) => {
      const subnetParts = cidr.split('/')[0].split('.').map(Number);
      const subnetSize = parseInt(cidr.split('/')[1], 10);
      if (subnetSize === 24) {
        const subnetNum = subnetParts[2];
        if (subnetNum > maxSubnet) {
          maxSubnet = subnetNum;
        }
      }
    });

    // Increment the last octet of the base IP address
    const nextSubnet = maxSubnet + 1;
    if (nextSubnet >= 256) {
      throw new Error('Exceeded available CIDR blocks');
    }
    return `${baseIp[0]}.${baseIp[1]}.${nextSubnet}.0/24`;
}