import Description from '../../src/SecureByDesign/Description';

describe('Secure By Design > Task', () => {
  it('should throw error when description is empty', () => {
    expect(() => new Description('')).toThrow('Description cannot be empty');
  });

  it('should throw error when description exceeds 100 characters', () => {
    const longDescription = 'a'.repeat(101);
    expect(() => new Description(longDescription)).toThrow('Description cannot exceed 100 characters');
  });

  it('should create Task when description is valid', () => {
    const description = new Description('Make ToDo List');
    expect(description.text).toBe('Make ToDo List');
  });
});