export interface Option {
    ID: number
    description: string
    isRightAnswer: boolean
    isSelected?: boolean
}

export interface Question {
    ID?: number
    description: string
    options: Option[]
}
