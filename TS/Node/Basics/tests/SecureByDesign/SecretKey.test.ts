import SecretKey from '../../src/SecureByDesign/SecretKey';

describe('SecretKey', () => {
  it('should return the key value once and invalidate it afterwards', () => {
    const secret = new SecretKey('my-secret-key');
    expect(secret.getValue()).toBe('my-secret-key');
    expect(() => secret.getValue()).toThrow('Secret key has already been consumed.');
  });

  it('should have a safe string representation', () => {
    const secret = new SecretKey('my-secret-key');
    expect(secret.toString()).toBe('[SecretKey: ****]');
  });
});
