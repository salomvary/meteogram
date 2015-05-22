jest.dontMock('../search-location')
jest.dontMock('debounce')

// Using require because https://github.com/babel/babel-jest/issues/16

describe('search-location', () => {
  var React
  var TestUtils
  var SearchLocation
  var SearchResults
  var search
  var searchLocation
  var onLocationChange

  beforeEach(() => {
    React = require('react/addons')
    TestUtils = React.addons.TestUtils
    SearchLocation = require('../search-location')
    SearchResults = require('../search-results')
    search = require('../search-api')
    onLocationChange = jest.genMockFunction()

    searchLocation = TestUtils.renderIntoDocument(
      <SearchLocation onLocationChange={onLocationChange}/>
    )
  })

  it('initializes with empty input', () => {
    var input = TestUtils.findRenderedDOMComponentWithTag(searchLocation, 'input')
    expect(input.getDOMNode().value).toEqual(null)
  })

  it('searches on input + enter', () => {
    search.mockReturnValue(Promise.resolve([]))

    submitSearch(searchLocation, 'Berlin')

    expect(search).lastCalledWith('Berlin')
  })

  describe('when search succeeds', () => {
    var results

    beforeEach(() => {
      results = Promise.resolve([{display_name: 'Berlin, DE'}])
      search.mockReturnValue(results)

      submitSearch(searchLocation, 'Berlin')
    })

    pit('sets the input value to the first search result', () => {
      var input = TestUtils.findRenderedDOMComponentWithTag(searchLocation, 'input')
      return results.then(() => {
        expect(input.getDOMNode().value).toEqual('Berlin, DE')
      })
    })

    pit('calls onLocationChange with the result', () => {
      return results.then(() => {
        expect(onLocationChange.mock.calls.length).toBe(1)
        expect(onLocationChange).lastCalledWith({display_name: 'Berlin, DE'})
      })
    })

    pit('setting input to empty calls onLocationChange', () => {
      return results.then(() => {
        submitSearch(searchLocation, '')

        expect(onLocationChange.mock.calls.length).toBe(2)
        expect(onLocationChange).lastCalledWith(null)
      })
    })

    pit('setting input to empty does not initiate search', () => {
      return results.then(() => {
        var before = search.mock.calls.length
        submitSearch(searchLocation, '')

        expect(search.mock.calls.length).toEqual(before)
      })
    })
  })

  describe('when search fails', () => {
    var results

    beforeEach(() => {
      results = Promise.reject()
      search.mockReturnValue(results)

      submitSearch(searchLocation, 'Berlin')
    })

    pit('does not change the input value', () => {
      var input = TestUtils.findRenderedDOMComponentWithTag(searchLocation, 'input')
      return results.then(() => {
        expect(input.getDOMNode().value).toEqual('Berlin')
      })
    })

    pit('shows an error message', () => {
      return results.then(() => {
        var input = TestUtils.findRenderedDOMComponentWithTag(searchLocation, 'p')
        expect(input.getDOMNode().innerHTML).toEqual('Search Failed :(')
      })
    })

    pit('another search attempt hides the error message', () => {
      return results.then(() => {
        submitSearch(searchLocation, 'Berlin')
        var message = TestUtils.scryRenderedDOMComponentsWithTag(searchLocation, 'p')
        expect(message.length).toEqual(0)
      })
    })
  })

  describe('suggest', () => {
    var results
    beforeEach(() => {
      results = Promise.resolve([{display_name: 'Berlin'}, {display_name: 'Budapest'}])
      search.mockReturnValue(results)
    })

    it('does not immediately start suggesting', () => {
      enterText(searchLocation, 'Berlin')
      expect(search).not.toBeCalled()
    })

    it('starts suggesting after a timeout', () => {
      enterText(searchLocation, 'Berlin')
      jest.runAllTimers()
      expect(search.mock.calls.length).toEqual(1)
    })

    pit('renders the suggestion list on success', () => {
      enterText(searchLocation, 'Berlin')
      jest.runAllTimers()
      return results.then(() => {
        expect(SearchResults).toBeCalled()
      })
    })
  })

  function enterText(searchLocation, inputValue) {
    var input = TestUtils.findRenderedDOMComponentWithTag(searchLocation, 'input')
    TestUtils.Simulate.input(input, {target: {value: inputValue}})
  }

  function submitSearch(searchLocation, inputValue) {
    enterText(searchLocation, inputValue)
    var form = TestUtils.findRenderedDOMComponentWithTag(searchLocation, 'form')
    TestUtils.Simulate.submit(form)
  }
})

