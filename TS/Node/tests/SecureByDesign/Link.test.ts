import Link from "../../src/SecureByDesign/Link";

describe('Secure By Design > Link', () => {
  it('should throw error when link is empty', () => {
    expect(() => new Link('')).toThrow('Link must be a valid link');
  });

  it('should throw error when link exceeds 500 characters', () => {
    const longLink = 'a'.repeat(501);
    expect(() => new Link(longLink)).toThrow('Link cannot exceed 500 characters');
  });

  const validLinksDataSet = [
    ['https://google.com'],
    ['https://www.google.com/search?q=test&oq=test&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiPAjIHCAIQABiPAjIHCAMQABiPAjIGCAQQRRg8MgYIBRBFGEEyBggGEEUYQdIBBzM4MmowajeoAgCwAgA&sourceid=chrome&ie=UTF-8'],
    ['https://github.com/LHofman/sandbox'],
  ];

  it.each(validLinksDataSet)('should create Link when link is valid', (url) => {
    try {
      const link = new Link(url);
      expect(link.text).toBe(url);
    } catch (error) {
      throw new Error('Valid link is seen as invalid: ' + url);
    }
  });

  // 8.2.3 Testing boundary behavior
  const invalidLinksDataSet = [
    [''],
    ['.com'],
    ['https://googlecom'],
    ['https://google.'],
    ['https://google . com'],
    ['https://google.#com'],
    ['https://google.abcdefg'],
    // 8.2.4 Testing with invalid input
    ['https://<>google.com'],
    ['https://\ngoogle.com'],
    ['https://\tgoogle.com'],
    ['https://@google.com'],
  ];

  it.each(invalidLinksDataSet)('should throw error when link is invalid', (url) => {
    try {
      expect(() => new Link(url)).toThrow('Link must be a valid link');
    } catch (error) {
      throw new Error('Invalid link is seen as valid: ' + url);
    }
  });
});