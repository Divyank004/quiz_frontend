<template>
  <q-page class="column">
    <q-card
      v-if="showTakeOrMakeQuiz"
      class="take-make-card text-white absolute-center"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
    >
      <q-card-section class="column">
        <q-btn color="teal" class="q-ma-md" @click="showAddQuestionPage()">
          <div class="text-h6 text-center q-ma-md">Add New Quiz Card</div>
        </q-btn>
        <q-btn color="teal" class="q-ma-md" @click="startQuiz()">
          <div class="text-h6 text-center q-ma-md">Take Quiz</div>
        </q-btn>
      </q-card-section>
    </q-card>

    <q-card
      v-if="showMakeQuiz"
      class="make-quiz-card absolute-center"
    >
      <q-card-section class="column">
        <p class="text-h5">Add Question</p>
        <q-btn flat round color="primary" icon="close" class="cursor-pointer q-ma-md absolute-top-right" @click="closeCurrentCard()">
        </q-btn>
        <q-input
          v-model="questionDescription"
          label="Description"
          outlined
          class="q-ma-md"
        />
        <div
          class="row"
          v-for="option in options"
          :key="option.ID">
            <q-input
              :label = "`Option ${option.ID}`"
              outlined
              dense
              v-model = "option.description"
              class="q-ma-md"
            />
            <q-checkbox
              v-model="option.isRightAnswer"
              dense
              label="Right Answer"
              class="q-ma-md"
            />
        </div>
      </q-card-section>
      <q-card-section class="row justify-between">
        <q-btn color="teal" class="q-ma-md" @click="addOption()">
          <div class="text-subtitle text-center">Add options</div>
        </q-btn>
        <q-btn color="teal" class="q-ma-md" @click="submitQuestion()">
          <div class="text-subtitle text-center">Submit Question</div>
        </q-btn>
      </q-card-section>
      <p class="q-ml-md">Total number of questions in the repository: {{ totalNoOfQuestionsInRepo }}</p>
    </q-card>

    <q-card
      class="points-card"
      v-if="showTakeQuiz"
    >
      <q-card-section class="column">
        <p>Points</p>
        <div>
          {{ totalPointsScored }} / 10
        </div>
      </q-card-section>
    </q-card>

    <q-card
      v-if="showTakeQuiz"
      class="take-quiz-card absolute-center"
    >
      <q-linear-progress :value="quizProgress" color="secondary"/>
      <q-card-section class="column">
        <p class="text-h5">Question {{ currentQuestionCount }}</p>
        <q-btn flat round color="primary" icon="close" class="cursor-pointer q-ma-md absolute-top-right" @click="closeCurrentCard()">
        </q-btn>
        <p>{{ currentQuestion?.description }}</p>
        <div
          class="row"
          v-for="option in currentQuestion?.options"
          :key="option.ID">
            <q-checkbox
              v-model="option.isSelected"
              dense
              class="q-ma-md"
            />
            <p class="q-ma-md">
              {{ option.description }}
            </p>
        </div>
      </q-card-section>
      <q-card-section class="row">
        <q-btn color="teal" class="q-ma-md" @click="submitAnswer()">
          <div class="text-subtitle text-center">Submit Answer</div>
        </q-btn>
      </q-card-section>
    </q-card>

    <q-card
      v-if="showQuizCompletedCard"
      class="take-quiz-card absolute-center"
    >
      <q-card-section class="column">
        <p class="text-h5">Quiz Completed</p>
        <q-btn flat round color="primary" icon="close" class="cursor-pointer q-ma-md absolute-top-right" @click="closeCurrentCard()">
        </q-btn>
        <p>You scored</p>
        <div>
          {{ totalPointsScored }} Points out of 10
        </div>
      </q-card-section>
      <q-card-section class="row">
        <q-btn color="teal" class="q-ma-md" @click="startQuiz()">
          <div class="text-subtitle text-center">Play Again</div>
        </q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

defineOptions({
  name: 'IndexPage'
})

interface Option {
  ID: number
  description: string
  isRightAnswer: boolean
  isSelected?: boolean
}
interface Question {
  ID: number
  description: string
  options: Option[]
}

const $q = useQuasar()
const showTakeOrMakeQuiz = ref(true)
const showMakeQuiz = ref(false)
const showTakeQuiz = ref(false)
const showQuizCompletedCard = ref(false)
const questionDescription = ref(null)
const options = ref<Option[]>([{
  ID: 1,
  description: '',
  isRightAnswer: false
}])
const allQuestions = ref<Question[]>([])
const questionsInQuiz = ref<Question[]>([])
const totalNoOfQuestionsInRepo = ref(0)
const currentQuestion = ref<Question | null>(null)
const totalPointsScored = ref(0)
const quizProgress = ref(0)
const currentQuestionCount = ref(1)
const numberOfQuestionsInQuiz = ref(0)
const BASE_URL = 'http://localhost:3000'

onMounted(async () => {
  getAllQuestions()
})

async function getAllQuestions () {
  await api.get(`${BASE_URL}/questions`)
    .then(response => {
      allQuestions.value = response.data.filter((question: Question) => question.options.length > 0)
      totalNoOfQuestionsInRepo.value = allQuestions.value.length
    })
    .catch(error => {
      console.error(error)
    })
}

function showAddQuestionPage () {
  showTakeOrMakeQuiz.value = false
  showMakeQuiz.value = true
}

function addOption () {
  options.value.push({
    ID: options.value.length + 1,
    description: '',
    isRightAnswer: false
  })
}

async function submitQuestion () {
  if (!questionDescription.value) {
    console.log('Please add question description')
    $q.notify({
      color: 'warning',
      position: 'center',
      message: 'Please add question description',
      icon: 'warning'
    })
  } else if (options.value.length < 2) {
    console.log('Please add atleast 2 options')
    $q.notify({
      color: 'warning',
      position: 'center',
      message: 'Add atleast 2 options',
      icon: 'warning'
    })
  } else if (options.value.filter(option => option.isRightAnswer).length < 1) {
    console.log('Please select atleast 1 right answer')
    $q.notify({
      color: 'warning',
      position: 'center',
      message: 'Select atleast 1 right answer',
      icon: 'warning'
    })
  } else {
    const newQuestion = {
      description: questionDescription.value,
      options: options.value
    }
    try {
      const response = await api.post(`${BASE_URL}/questions`, newQuestion, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      $q.notify({
        color: 'positive',
        position: 'center',
        message: 'Question Added successfully',
        icon: 'info'
      })
      console.log('response', response)
      questionDescription.value = null
      options.value = [{
        ID: 1,
        description: '',
        isRightAnswer: false
      }]
      getAllQuestions()
    } catch (error) {
      $q.notify({
        color: 'negative',
        position: 'center',
        message: 'Adding question failed',
        icon: 'report_problem'
      })
      console.error(error)
    }
  }
}

function closeCurrentCard () {
  showMakeQuiz.value = false
  showTakeQuiz.value = false
  showQuizCompletedCard.value = false
  showTakeOrMakeQuiz.value = true
}

function startQuiz () {
  getAllQuestions()
  totalPointsScored.value = 0
  currentQuestionCount.value = 1
  showTakeOrMakeQuiz.value = false
  showMakeQuiz.value = false
  currentQuestion.value = null
  if (allQuestions.value.length > 10) {
    questionsInQuiz.value = getRandomUniqueQuestions()
  } else {
    questionsInQuiz.value = allQuestions.value
  }
  numberOfQuestionsInQuiz.value = questionsInQuiz.value.length
  quizProgress.value = 1 / numberOfQuestionsInQuiz.value
  if (questionsInQuiz.value.length > 0) {
    currentQuestion.value = questionsInQuiz.value.pop() ?? null
    currentQuestion.value?.options.forEach(option => {
      option.isSelected = false
    })
  }
  showQuizCompletedCard.value = false
  showTakeQuiz.value = true
}

function submitAnswer () {
  quizProgress.value = quizProgress.value + Number((1 / numberOfQuestionsInQuiz.value).toFixed(1))
  currentQuestionCount.value++
  if (currentQuestion.value) {
    const selectedOptions = currentQuestion.value.options.filter(option => option.isSelected)
    if (selectedOptions.length === 0) {
      $q.notify({
        color: 'warning',
        position: 'center',
        message: 'Please select atleast 1 option',
        icon: 'warning'
      })
    } else {
      const isRightAnswer = selectedOptions.every(option => option.isRightAnswer)
      if (isRightAnswer) {
        totalPointsScored.value++
      }
      if (questionsInQuiz.value.length > 0) {
        currentQuestion.value = questionsInQuiz.value.pop() ?? null
        currentQuestion.value?.options.forEach(option => {
          option.isSelected = false
        })
      } else {
        showTakeQuiz.value = false
        showQuizCompletedCard.value = true
      }
    }
  }
}

function getRandomUniqueQuestions () {
  const shuffledQuestions = [...allQuestions.value].sort(() => 0.5 - Math.random())
  return shuffledQuestions.slice(0, 10)
}
</script>

<style lang="sass" scoped>
.take-make-card
  width: 100%
  max-width: 500px

.make-quiz-card
  width: 100%
  max-width: 500px

.take-quiz-card
  width: 100%
  max-width: 500px

.points-card
  width: 100%
  max-width: 150px
  font-size: 20px
  font-weight: bold
  text-align: center
  padding: 20px
</style>
