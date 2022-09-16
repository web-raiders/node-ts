import chai from 'chai';
import { describe, it } from 'mocha';

const { expect } = chai;

describe('Initial test', () => {
  it('should be equal to string', () => {
    expect('gist').to.equal('gist');
  });
});
