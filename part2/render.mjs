import { Liquid } from 'liquidjs'
import { readFile, writeFile } from 'node:fs/promises'

const engine = new Liquid({
  root: './part2',
  extname: '.liquid',
})

engine.registerFilter('number_with_commas', (value) => {
  const number = Number(value)

  if (!Number.isFinite(number)) {
    return value
  }

  return number.toLocaleString('en-US')
})

const customer = JSON.parse(
  await readFile('./part2/customer.json', 'utf8')
)

const offers = JSON.parse(
  await readFile('./part2/offers.json', 'utf8')
)

const config = JSON.parse(
  await readFile('./part2/config.json', 'utf8')
)

const html = await engine.renderFile('newsletter', {
  customer,
  offers,
  config,
})

await writeFile('./part2/preview.html', html)

console.log('Preview generated: part2/preview.html')
