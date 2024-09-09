import invariant from 'tiny-invariant';

import { LoaderFunctionArgs } from '@remix-run/node';

import { 
  isRouteErrorResponse, 
  json, 
  MetaFunction, 
  useLoaderData, 
  useNavigate, 
  useRouteError 
} from '@remix-run/react'

import * as styles from '~/styles/details.css'

import ArrowLeft from '~/assets/arrow-left.svg?react'

import { getCountry } from '~/services/api';

export const meta: MetaFunction = () => {
  return [
    { title: "Details" },
    { name: "description", content: "show details of country" },
  ];
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.name, 'Missing name param')

  const country = await getCountry(params.name)

  return json({
    country 
  })   
}

export default function Page() {
  const { country } = useLoaderData<typeof loader>()
  
  const navigate = useNavigate()

  return (
    <main className={styles.content}>
      <section>
        <button
          aria-label="back"
          className={styles.iconButton}
          onClick={() => navigate('/')}
        >
          <ArrowLeft className={styles.arrowLeft} />
          back
        </button>
      </section>

      <section className={styles.countrySection}>
        <div className={styles.grid}>
          <div className={styles.flagContainer}>
            <img
              className={styles.flag}
              src={country?.flag?.src}
              alt={country?.flag?.alt}
            />
          </div>
        </div>
        <div className={styles.grid}>
          <div className={styles.countryContainer}>
            <h2 className={styles.title}>{country?.name?.common}</h2>
            <div className={styles.countryInfoContainer}>
              <div>
                <p className={styles.countryDetail}>
                  <strong className={styles.topic}>Population:</strong>
                  {country?.population}
                </p>
                <p className={styles.countryDetail}>
                  <strong className={styles.topic}>Region:</strong>
                  {country?.region}
                </p>
                <p className={styles.countryDetail}>
                  <strong className={styles.topic}>Sub Region:</strong>
                  {country?.subregion}
                </p>
                <p className={styles.countryDetail}>
                  <strong className={styles.topic}>Capital:</strong>
                  {country?.capital}
                </p>
              </div>
              <div>
                <p className={styles.countryDetail}>
                  <strong className={styles.topic}>Top Level Domain:</strong>
                  {country?.tld.join(', ')}
                </p>
                <p className={styles.countryDetail}>
                  <strong className={styles.topic}>Currencies:</strong>
                  {country?.currencies.join(', ')}
                </p>
                <p className={styles.countryDetail}>
                  <strong className={styles.topic}>Languages:</strong>
                  {country?.currencies.join(', ')}
                </p>
              </div>
            </div>
            <div>
              <p className={styles.countryDetail}>
                <strong className={styles.topic}>Borders:</strong>
                {country?.borders.map((border) => (
                  <span className={styles.border} key={border}>
                    {border}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export function ErrorBoundary() {
  const error = useRouteError();

  if(isRouteErrorResponse(error)) {
    switch(error.status) {
      case 404:
        return <div>Not Found</div>
      default:
        return <div>Oops! Something went wrong</div>
    }
  }
  else {
    return <div>oops! something went wrong</div>
  }
}
