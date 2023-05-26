export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const paramsWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')

  // (?<query>\\?) ? é opcional, passo adicionar ou não.
  // (.*))?$ termina com($) ?
  // (.*) . qualquer caracter inumeros vezes, * todos
  const pathRegex = new RegExp(`^${paramsWithParams}(?<query>\\?(.*))?$`)

  return pathRegex
}