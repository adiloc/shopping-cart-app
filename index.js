import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'
import { getDatabase, ref, push } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js'
import data from '/data.js'

const app = initializeApp(data)
const database = getDatabase(app)

const shopItems = ref(database, 'items')

const inputFieldEl = document.getElementById('ip_field')
const addBtnEl = document.getElementById('add_btn')


addBtnEl.addEventListener('click', e => {
  let inputValue = inputFieldEl.value
  push(shopItems, inputValue)
  console.log(inputValue)
})

// console.log(data)