module.exports = plop => {
  plop.load('../utility', {}, {
    helpers: true
  })

  plop.setGenerator('module', {
    description: 'generate module logic',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'generate module',
      validate (input) {
        if (isNaN(input)) {
          return true
        }
      }
    }],
    actions: [
      {
        type: 'add',
        path: '../../src/resources/{{ kebabCase name }}/controller.js',
        templateFile: './templates/controller.hbs',
        skipIfExists: false,
        force: true
      },
      {
        type: 'add',
        path: '../../src/resources/{{ kebabCase name }}/route.js',
        templateFile: './templates/route.hbs',
        skipIfExists: false,
        force: true
      },
      {
        type: 'add',
        path: '../../src/resources/{{ kebabCase name }}/service.js',
        templateFile: './templates/service.hbs',
        skipIfExists: false,
        force: true
      }
    ]
  })
}
