import axios from 'axios'
import { Question } from 'src/types/types'

let BASE_URL = ''

if (process.env.PROD) {
  console.log('I am on a production  build!')
  BASE_URL = 'ADD PRODUCTION URL'
} else {
  BASE_URL = String(process.env.API_URL)
}

export default {

  async getAllQuestions () {
    try {
      const response = await axios.get(`${BASE_URL}/questions`)
      return response
    } catch (error) {
      console.error(error)
    }
  },
  async postQuestion (newQuestion: Question) {
    try {
      const response = await axios.post(`${BASE_URL}/questions`, newQuestion, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response
    } catch (error) {
      console.error(error)
    }
  }
}
