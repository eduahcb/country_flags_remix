import { getCountryInfos } from "~/utils"

export async function getAllCountries(url: string) {
  const response = await fetch(`https://restcountries.com/v3.1${url}`)

  if (!response.ok && response.status === 404) {
    throw new Response('not found', { status: 404 })
  } else if (!response.ok) {
    throw new Response('internal server error', { status: 500 })
  }

  const data = await response.json()

  const countries = Array.isArray(data) ? data.map(getCountryInfos) : []

  return countries
}

export async function getCountry(name: string) {
  const response = await fetch(`https://restcountries.com/v3.1/name/${name}`)

  if (!response.ok && response.status === 404) {
    throw new Response('not found', { status: 404 })
  } else if (!response.ok) {
    throw new Response('internal server error', { status: 500 })
  }

  const data = await response.json()

  const countries = Array.isArray(data) ? getCountryInfos(data[0]) : undefined

  return countries
}
