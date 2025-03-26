module.exports = {
  // Подключаем плагин stylelint-scss
  plugins: ['stylelint-scss'],

  // Наследуем стандартные правила для SCSS и порядок свойств
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-clean-order'
  ],

  // Пользовательские правила
  rules: {
    // Отключаем проверку убывающей специфичности (если вам это не мешает)
    'no-descending-specificity': null,

    // Отключаем паттерн для кастомных свойств (например, --variable)
    'custom-property-pattern': null,

    // Разрешаем неизвестные свойства, такие как 'composes' (для CSS-модулей)
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['composes']
      }
    ],

    // Отключаем паттерн для классов (например, если используете BEM или произвольные имена)
    'selector-class-pattern': null,

    // Разрешаем псевдокласс :global (для CSS-модулей или styled-components)
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global']
      }
    ],

    // Отключаем паттерн для имен keyframes
    'keyframes-name-pattern': null,

    // Примеры SCSS-специфичных правил из stylelint-scss (можно включить по необходимости)
    'scss/at-rule-no-unknown': true, // Проверяет неизвестные @-правила в SCSS
    'scss/dollar-variable-pattern': null, // Отключает паттерн для $переменных (если нужно)
    'scss/percent-placeholder-pattern': null // Отключает паттерн для %placeholder
  }
};