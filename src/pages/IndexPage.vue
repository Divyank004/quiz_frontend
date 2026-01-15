<template>
  <q-page class="column" style="background: radial-gradient(circle, #5d7971 0%, #014a88 100%)">
    <q-card
      v-if="showTakeOrMakeQuiz"
      class="column take-make-card text-white absolute-center justify-evenly"
      style="background: radial-gradient(circle, #35a2ff 5%, #014a88 100%)"
    >
      <q-card-section class="q-ma-none column">
        <div class="row">
          <q-icon name="security" size="45px" class="col-2 q-ma-md"/>
          <p class="col-8 text-h6 q-mt-md">Test your cybersecurity knowledge and become a cyber defense expert!
          </p>
        </div>
        <q-btn color="teal" class="q-ma-md" @click="startQuiz()">
          <div class="text-h6 text-center q-ma-md">Start Quiz
            <q-icon name="play_arrow" class="q-ml-md"/>
          </div>
        </q-btn>
        <q-btn color="teal" class="q-ma-md" @click="showAddQuestionPage()">
          <div class="text-h6 text-center q-ma-md">Add New Quiz Card
            <q-icon name="post_add" class="q-ml-md"/>
          </div>
        </q-btn>
      </q-card-section>
    </q-card>

    <q-card
      v-if="showMakeQuiz"
      class="make-quiz-card absolute-center"
    >
      <q-card-section class="column" style="background: radial-gradient(circle, #35a2ff 5%, #014a88 100%)">
        <p class="text-h5 q-ma-none text-white text-center">Add Question</p>
        <q-btn
          flat
          round
          color="white"
          icon="close"
          class="cursor-pointer q-ma-sm absolute-top-right"
          @click="closeCurrentCard()">
        </q-btn>
      </q-card-section>
      <q-card-section class="column">
        <q-input
          v-model="questionDescription"
          label="Description"
          outlined
          class="q-ma-md"
        />
        <div class="row"
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
      <q-card-section class="row justify-between absolute-bottom q-mb-md">
        <q-btn
          class="q-ma-md"
          @click="addOption()"
          style="background: #014a88"
        >
          <div class="text-subtitle text-center text-white">Add options</div>
        </q-btn>
        <q-btn
          class="q-ma-md"
          @click="submitQuestion()"
          style="background: #014a88"
        >
          <div class="text-subtitle text-center text-white">Submit Question</div>
        </q-btn>
      </q-card-section>
      <p class="q-ml-md fixed-bottom">Total number of questions in the repository: {{ totalNoOfQuestionsInRepo }}</p>
    </q-card>

    <q-card
      class="points-card shadow-24 absolute-top-right q-ma-lg bg-blue-7 text-white"
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
      class="take-quiz-card absolute-center shadow-24"
    >
      <q-linear-progress :value="quizProgress" size="7px" rounded color="secondary"/>
      <q-card-section class="column">
        <div class="row">
          <p class=" text-h6"><b>{{ currentQuestionCount }}</b> of <b>{{ numberOfQuestionsInQuiz }}</b></p>
          <q-btn
            flat
            round
            color="primary"
            icon="close"
            class=" cursor-pointer q-ma-sm absolute-top-right" @click="closeCurrentCard()">
          </q-btn>
        </div>
        <p class="text-h6 q-ma-sm">{{ currentQuestion?.description }}</p>
        <div
          class="row"
          v-for="option in currentQuestion?.options"
          :key="option.ID">
            <q-checkbox
              v-model="option.isSelected"
              dense
              class="q-ma-md"
            />
            <p class="q-ma-md text-subtitle1">
              {{ option.description }}
            </p>
        </div>
      </q-card-section>
      <q-card-section class="row absolute-bottom-left">
        <q-btn color="teal" class="q-ma-md" @click="submitAnswer()">
          <div class="text-subtitle text-center">Submit Answer</div>
        </q-btn>
      </q-card-section>
    </q-card>

    <q-card
      v-if="showQuizCompletedCard"
      class="quiz-completed-card absolute-center shadow-24"
    >
      <q-card-section class="column text-white text-center bg-teal-5">
        <p class="text-h5 q-mt-sm">Quiz Completed</p>
        <q-btn flat round color="white" icon="close" class="cursor-pointer q-ma-md absolute-top-right" @click="closeCurrentCard()">
        </q-btn>
      </q-card-section>
      <q-card-section class="column absolute-center text-center">
        <p class="text-h6 col">Your Score</p>
        <div class="text-h6 col">
          {{ totalPointsScored }} / 10
        </div>
      </q-card-section>
      <q-card-section class="column absolute-bottom">
        <q-btn color="teal" class="q-ma-md q-pa-md" @click="startQuiz()">
          <div class="text-subtitle1 text-center">Play Again</div>
        </q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { Question, Option } from '../types/types'
import api from '../api/api'

defineOptions({
  name: 'IndexPage'
})

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

onMounted(() => {
  pullData()
})

async function pullData () {
  await api.getAllQuestions()
    .then(response => {
      allQuestions.value = response?.data.filter((question: Question) => question.options.length > 0)
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
  if (options.value.length === 4) {
    $q.notify({
      color: 'warning',
      position: 'center',
      message: 'Maximum only 4 options are allowed',
      icon: 'warning'
    })
    return
  }
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
  } else if (options.value.filter((option: Option) => option.isRightAnswer).length < 1) {
    console.log('Please select atleast 1 right answer')
    $q.notify({
      color: 'warning',
      position: 'center',
      message: 'Select atleast 1 right answer',
      icon: 'warning'
    })
  } else {
    const newQuestion: Question = {
      description: questionDescription.value,
      options: options.value
    }
    try {
      const response = await api.postQuestion(newQuestion)
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
      pullData()
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
  options.value = [{
    ID: 1,
    description: '',
    isRightAnswer: false
  }]
}

function startQuiz () {
  pullData()
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
    currentQuestion.value?.options.forEach((option: Option) => {
      option.isSelected = false
    })
  }
  showQuizCompletedCard.value = false
  showTakeQuiz.value = true
}

function submitAnswer () {
  if (currentQuestion.value) {
    const selectedOptions = currentQuestion.value.options.filter((option:Option) => option.isSelected)
    if (selectedOptions.length === 0) {
      $q.notify({
        color: 'warning',
        position: 'center',
        message: 'Please select atleast 1 option',
        icon: 'warning'
      })
    } else {
      quizProgress.value = quizProgress.value + Number((1 / numberOfQuestionsInQuiz.value).toFixed(1))
      currentQuestionCount.value++
      const isRightAnswer = selectedOptions.every((option:Option) => option.isRightAnswer)
      if (isRightAnswer) {
        totalPointsScored.value++
      }
      if (questionsInQuiz.value.length > 0) {
        currentQuestion.value = questionsInQuiz.value.pop() ?? null
        currentQuestion.value?.options.forEach((option:Option) => {
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
  max-width: 600px
  height: 400px

.make-quiz-card
  width: 100%
  max-width: 600px
  height: 540px

.take-quiz-card
  width: 100%
  max-width: 600px
  height: 520px

.quiz-completed-card
  width: 100%
  max-width: 600px
  height: 400px

.points-card
  width: 100%
  max-width: 150px
  font-size: 20px
  font-weight: bold
  text-align: center
  padding: 5px
</style>
