import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { IProductDetail } from '../../entities/Product';

interface IComparisonContext {
  comparisonList: IProductDetail[];
  dispatch: React.Dispatch<ComparisonAction>;
}

type ComparisonAction =
  | { type: 'ADD_TO_COMPARISON'; product: IProductDetail }
  | { type: 'REMOVE_FROM_COMPARISON'; productId: number }
  | { type: 'SET_COMPARISON_LIST'; comparisonList: IProductDetail[] };


const ComparisonContext = createContext<IComparisonContext | undefined>(undefined);

const ComparisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [comparisonList, dispatch] = useReducer(comparisonReducer, []);

  return (
    <ComparisonContext.Provider value={{ comparisonList, dispatch }}>
      {children}
    </ComparisonContext.Provider>
  );
};

const useComparison = (): IComparisonContext => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison повинен використовуватися всередині ComparisonProvider');
  }
  return context;
};

export const comparisonReducer = (state: IProductDetail[] = [], action: ComparisonAction): IProductDetail[] => {
  switch (action.type) {
    case 'ADD_TO_COMPARISON':
      return [...state, action.product];
    case 'REMOVE_FROM_COMPARISON':
      return state.filter((item) => item.id !== action.productId);
    case 'SET_COMPARISON_LIST':
      return action.comparisonList;
    default:
      return state;
  }
};

export { ComparisonProvider, useComparison };
