import {useRef} from 'react'
import _ from 'lodash'


export function useArgsRef<T>(args: T): T {
  const argsRef = useRef(args);
  if(!_.isEqual(argsRef.current, args)) {
    argsRef.current = args;
  }
  return argsRef.current;
}
