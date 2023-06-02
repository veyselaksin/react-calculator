import { useReducer } from 'react'
import './App.css'
import { ACTIONS } from './Enums/Actions'
import DigitButton from './Components/DigitButton'
import OperationButton from './Components/OperationButton'

function reducer(state, { type, payload }) {
    switch (type) {
        case ACTIONS.ADD_DIGIT:
            if (state.override) {
                return {
                    ...state,
                    currentOperand: payload.digit,
                    override: false
                }
            }
            if (payload.digit === '0' && state.currentOperand === '0') return state
            if (payload.digit === '.' && state.currentOperand.includes('.')) return state
            return {
                ...state,
                currentOperand: `${state.currentOperand || ''}${payload.digit}`
            }

        case ACTIONS.CHOOSE_OPERATION:
            if (state.currentOperand == null && state.previousOperand == null) return state
            if (state.currentOperand == null) {
                return {
                    ...state,
                    operation: payload.operation
                }
            }
            if (state.previousOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                    previousOperand: state.currentOperand,
                    currentOperand: null
                }
            }

            return {
                ...state,
                operation: payload.operation,
                previousOperand: evaluate(state),
                currentOperand: ''
            }

        case ACTIONS.EVALUATE:
            if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
                return state
            }

            return {
                ...state,
                override: true,
                operation: null,
                previousOperand: null,
                currentOperand: evaluate(state)
            }

        case ACTIONS.DELETE_DIGIT:
            if (state.override) {
                return {
                    ...state,
                    currentOperand: null,
                    override: false
                }
            }
            if (state.currentOperand == null) return state

            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1)
            }

        case ACTIONS.CLEAR:
            return {}
    }
}

function evaluate({ currentOperand, previousOperand, operation }) {
    const prev = parseFloat(previousOperand)
    const current = parseFloat(currentOperand)

    if (isNaN(prev) || isNaN(current)) return ''

    switch (operation) {
        case '+':
            return (prev + current).toString()

        case '-':
            return (prev - current).toString()

        case '*':
            return (prev * current).toString()

        case '÷':
            return (prev / current).toString()
        default:
            return ''
    }
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
    maximumFractionDigits: 0
})
function formatOperand(operand) {
    if (operand == null) return
    const [integer, decimal] = operand.split('.')
    if (decimal == null) return INTEGER_FORMATTER.format(integer)
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

export default function App() {
    const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})
    return (
        <div className='App'>
            <div className='calculator-grid'>
                <div className='output'>
                    <div className='previous-operand'>
                        {formatOperand(previousOperand)} {operation}
                    </div>
                    <div className='current-operand'>{formatOperand(currentOperand)}</div>
                </div>
                <button className='span-two' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>
                    AC
                </button>
                <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
                <OperationButton operation='÷' dispatch={dispatch} />
                <DigitButton digit='1' dispatch={dispatch} />
                <DigitButton digit='2' dispatch={dispatch} />
                <DigitButton digit='3' dispatch={dispatch} />
                <OperationButton operation='*' dispatch={dispatch} />
                <DigitButton digit='4' dispatch={dispatch} />
                <DigitButton digit='5' dispatch={dispatch} />
                <DigitButton digit='6' dispatch={dispatch} />
                <OperationButton operation='+' dispatch={dispatch} />
                <DigitButton digit='7' dispatch={dispatch} />
                <DigitButton digit='8' dispatch={dispatch} />
                <DigitButton digit='9' dispatch={dispatch} />
                <OperationButton operation='-' dispatch={dispatch} />
                <DigitButton digit='.' dispatch={dispatch} />
                <DigitButton digit='0' dispatch={dispatch} />
                <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>
                    =
                </button>
            </div>
        </div>
    )
}
