// import { describe, it } from 'mocha'
import { expect } from 'chai'

import SpecError from '../../main/api/SpecError'

describe('Testing SpecError construction and reading properties', () => {
  const
    longMessage = 'long message',
    hint = 'short message',
    path = 'some.test.path',
    specError = new SpecError(longMessage, hint, path)

  it('should read long message properly', () => {
    expect(specError.message)
      .to.eql(longMessage)
  })

  it('should read short message properly', () => {
    expect(specError.hint)
      .to.eql(hint)
  })
  
  it('should read path properly', () => {
    expect(specError.path)
      .to.eql(path)
  })
})
