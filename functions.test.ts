const { shuffleArray } = require('./utils')
const { bots } = require('./data.js')

// Some ideas:

// check that shuffleArray returns an array
// check that it returns an array of the same length as the argument sent in
// check that all the same items are in the array
// check that the items have been shuffled around

describe('shuffleArray should', () => {
  const foo = shuffleArray(bots)

  it('return an array', () => {
    expect(foo).toEqual(expect.arrayContaining([expect.any(Object)]))
  }),
    it('return an array of the same length as the argument array', () => {
      expect(foo.length).toEqual(bots.length)
    }),
    it('have the same elemets in the return array as the argument array', () => {
      expect(new Set(foo)).toEqual(new Set(bots))
    }),
    it('not return an array that is the same as the argument array', () => {
      expect(foo).not.toEqual(bots)
    })
})
