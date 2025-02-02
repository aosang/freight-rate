import {Decimal} from 'decimal.js'

// Decimal.set({precision: 2})

//封装加法
const add = (a, b) => {
  const num1 = new Decimal(a)
  const num2 = new Decimal(b)
  return Number(num1.plus(num2).toString())
}

//封装减法
const subtract = (a, b) => {
  const num1 = new Decimal(a)
  const num2 = new Decimal(b)
  return Number(num1.minus(num2).toString())
}

//封装乘法
const multiply = (a, b) => {
  const num1 = new Decimal(a)
  const num2 = new Decimal(b)
  return Number(num1.times(num2).toString())
}

// 封装除法
const divide = (a, b) => {
  const num1 = new Decimal(a)
  const num2 = new Decimal(b)
  return Number(num1.dividedBy(num2).toString())
}

export {add, subtract, multiply, divide}