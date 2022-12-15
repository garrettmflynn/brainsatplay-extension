export default function () {
  alert("hello! (find me on src/js/popup/example.js)");
};

// Grab elements
const active = document.getElementById('active')
const inactive = document.getElementById('inactive')

// Track rules
const rules = {}

// Function to add rules to the popup page
const addRule = (rule) => {

  let id = rule.id ?? Math.random()

  const li = document.createElement('li')
  const h3 = document.createElement('h3')
  const info = document.createElement('div')
  h3.innerText = rule.name

  const conditionText = document.createElement('span')
  const componentText = document.createElement('span')
  const originText = document.createElement('span')

  const condition = document.createElement('p')
  condition.innerHTML = `<b>Condition:</b> `

  conditionText.innerText = rule.condition
  condition.appendChild(conditionText)
  info.appendChild(condition)

  const component = document.createElement('p')
  component.innerHTML = `<b>Component:</b> `

  componentText.innerText = rule.component.name
  component.appendChild(componentText)
  info.appendChild(component)

  const origin = document.createElement('p')
  origin.innerHTML = `<b>Origin:</b> `
  originText.innerText = JSON.stringify(rule.origin)
  origin.appendChild(originText)
  info.appendChild(origin)

  li.appendChild(h3)
  li.appendChild(info)

  // p.innerHTML = `When <b><span>${rule.condition}</span></b>, apply <b><span>${rule.component.name}</span></b> on <b><span>${rule.origin}</span></b>`

  
  const isAll = !rule.origin || rule.origin === '*'
  if (isAll || rule.origin === window.location.href || rule.origin.includes(window.location.href)) {
    if (isAll) originText.innerHTML = 'All'
    active.appendChild(li)
  } else {
    inactive.appendChild(li)
  }


  // Add rule to linked list
  rules[id] = li

}

// Function to remove rules to the popup page
const removeRule = (rule) => {
  if (rule.id) {
    rules[id].remove()
    delete rules[id]
  }
}

  // A callback to handle messages about rules
  window.addEventListener('message', function(event) {
    const message = event.data;

    switch(message.name) {
      case 'rule-added':
        addRule(message.rule)
      case 'rule-removed': 
        removeRule(message.rule)
    }
  });

  const reactiveElementESC = {
    __attributes: {
      onclick: () => console.log('Wow!')
    },
  }

  // Test ruleset
  addRule({
    name: 'Global Button Rule',
    origin: '*',
    condition: 'button', // Query selector input
    component: {
      name: 'escode-reactive-element',
      model: reactiveElementESC
    }
  })

  addRule({
    name: 'Rule',
    origin: '*',

    // Component properties to match
    condition: {
      __element: 'button'
    }, 

    component: {
      name: 'escode-arbitrary-response',
      model: {
        __attributes: {
          onclick: () => console.log('This is a component that is a button!')
        },
      }
    }
  })
  
  addRule({
    name: 'Scoped Button Rule',
    origin: 'https://example.com',
    condition: 'button', // Query selector input
    component: {
      name: 'reactive-element',
      model: {
        __attributes: {
          onclick: () => console.log('Scoped to this button!')
        },
      }
    }
  })
  