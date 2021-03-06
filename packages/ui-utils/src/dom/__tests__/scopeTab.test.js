import scopeTab from '../scopeTab'

describe('scopeTab', () => {
  let container
  const MOCK_EVENT = {
    shiftKey: false,
    preventDefault: () => {}
  }

  beforeEach(() => {
    container = document.createElement('div')
    container.innerHTML = `
      <div class="scopeTab--NESTED">
        <input class="scopeTab--ONE" />
        <input class="scopeTab--TWO" />
      </div>
      <input class="scopeTab--THREE" />
    `

    document.body.appendChild(container)
  })

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })

  it('should scope tab within container', () => {
    const nested = document.querySelector('.scopeTab--NESTED')
    const one = document.querySelector('.scopeTab--ONE')
    const two = document.querySelector('.scopeTab--TWO')

    two.focus()

    scopeTab(nested, MOCK_EVENT)

    expect(document.activeElement).to.equal(one)
  })

  it('should not attempt scoping when no tabbable children', () => {
    const node = document.createElement('div')
    const two = document.querySelector('.scopeTab--TWO')

    two.focus()

    scopeTab(node, MOCK_EVENT)

    expect(document.activeElement).to.equal(two)
  })
})
