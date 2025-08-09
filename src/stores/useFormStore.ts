// stores/useFormStore.ts (고급 버전)
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface FormState {
  id: string
  pwd: string
  pwd2: string
  name: string
  loc: string
  errors: Record<string, string>
  isValid: boolean
}

interface FormActions {
  updateField: (field: keyof Omit<FormState, 'errors' | 'isValid'>, value: string) => void
  resetForm: () => void
  validateForm: () => boolean
  setError: (field: string, error: string) => void
  clearErrors: () => void
}

export const initialState = {
  id: "",
  pwd: "",
  pwd2: "",
  name: "",
  loc: "",
  errors: {},
  isValid: false
}

export const useFormStore = create<FormState & FormActions>()(
  devtools(
    (set, get) => ({ // "set" substitutes a lot of setter functions for state. get is just "self" in python/
      ...initialState,
      
      updateField: (field, value) => {
        set({ [field]: value })
        // 실시간 validation
        get().validateForm()
      },
    
      resetForm: () => set(initialState),
      
      validateForm: () => {
        const state = get()
        const newErrors: Record<string, string> = {}
        
        // 각 필드 검증
        Object.entries(state).forEach(([key, value]) => {
          if (typeof value === 'string' && value.length < 2) {
            newErrors[key] = `${key} should be more than 2 characters`
          }
        })
        
        // 비밀번호 일치 검증
        if (state.pwd !== state.pwd2) {
          newErrors.pwd2 = 'Passwords do not match'
        }
        
        const isValid = Object.keys(newErrors).length === 0
        
        set({ errors: newErrors, isValid })
        return isValid
      },
      
      setError: (field, error) => 
        set((state) => ({ 
          errors: { ...state.errors, [field]: error } 
        })),
      
      clearErrors: () => set({ errors: {} }),
    }),
    { name: 'form-store' } // devtools name
  )
)