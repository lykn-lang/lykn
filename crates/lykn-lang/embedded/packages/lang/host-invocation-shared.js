export const REFLECT_APPLY_ID = Symbol('Reflect.apply');
export const INLINE_APPLY_MODULE = 'data:text/javascript,export%20function%20apply(fn%2Creceiver%2Cargv)%7Breturn%20Reflect.apply(fn%2Creceiver%2Cargv)%7D';

export function validateAnchor(node) {
  if (node.type !== 'list' || node.values.length !== 3) {
    throw new Error('host invocation request must anchor an exact three-part call');
  }
  for (const [index, operand] of node.values.entries()) {
    if (operand.type !== 'atom') {
      throw new Error('host invocation operands must be stable atom references');
    }
    const name = operand.value;
    if (name.length === 0 || name.includes(':') ||
        ['this', 'super', 'true', 'false', 'null'].includes(name) ||
        (name === 'undefined' && index !== 1)) {
      throw new Error('host invocation operands must be stable atom references');
    }
  }
}
