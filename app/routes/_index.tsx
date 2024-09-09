import { Suspense } from "react";
import { useInView } from 'react-intersection-observer'

import type { HeadersFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { 
  Await, 
  defer, 
  Form, 
  isRouteErrorResponse, 
  useLoaderData, 
  useNavigate, 
  useRouteError, 
  useSubmit 
} from "@remix-run/react";

import { getAllCountries } from "~/services/api";

import { Card } from "~/components/atoms/Card";
import { Search } from "~/components/atoms/Search";
import { Select } from "~/components/atoms/Select";

import * as styles from '~/styles/home.css'
import { Country } from "~/types/country";


export const meta: MetaFunction = () => {
  return [
    { title: "Rest Countries Remix" },
    { name: "description", content: "show countries" },
  ];
};

export const headers: HeadersFunction = ({
  loaderHeaders,
}) => ({
  "Cache-Control": loaderHeaders.get("Cache-Control") ?? '',
})

export const loader = async ({ request}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  
  const region = url.searchParams.get('region') ?? '';
  const name = url.searchParams.get('name') ?? '';

  let reqUrl = '/independent?status=true'
  
  if (region && region !== 'all') {
     reqUrl = `/region/${region}`
  } else if (name) {
     reqUrl = `/name/${name}`
  }

  return defer({
    regions: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
    name,
    region,
    countries: getAllCountries(reqUrl)
  })
}

export default function Index() {
  const { regions, countries, name, region } = useLoaderData<typeof loader>();
  
  const submit = useSubmit();
  const navigate = useNavigate()
  
  return (
    <main className={styles.content}>
      <section className={styles.filterGrid}>
        <div>
          <div className={styles.seachContainer}>
            <Form 
              id="search-form" 
            >
              <Search
                id="name"
                name="name"
                defaultValue={name || ''}
                onClear={() => submit({ name: '', region: '' })}
              />
            </Form>
          </div>
        </div>
        <div>
          <div className={styles.regionContainer}>
            <Select value={region} 
              onChange={(value) => submit({ region: value === 'clear' ? '' : value})}
            >
              <Select.Option value="clear">Clear regions</Select.Option>
              {regions.map((region) => (
                <Select.Option key={region} value={region}>
                  {region}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </section>
      <section className={styles.countriesContainer}>
        <div className={styles.countriesGrid}>
          <Suspense fallback={<LoadingTemplate />}>
            <Await 
              resolve={countries}
              errorElement={<div>Oops! Something went wrong</div>}
            >
              {countries => countries.map(country => (
                <CardOnView
                  key={country.name.common}
                  country={country}
                  onClick={() => navigate(`/details/${country.name.native.toLowerCase()}`)}
                />
              ))}
            </Await>
          </Suspense>
        </div>
      </section>
    </main>
  );
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

type CardOnViewProp = {
  country: Country
  isLoading?: boolean
  onClick: () => void
}

function CardOnView({
  country,
  isLoading = false,
  onClick
}: CardOnViewProp) {
  const { ref, inView } = useInView({
    triggerOnce: true,
  })

  return (
    <div ref={ref}>
      {inView ? (
        <Card
          country={country}
          onClick={onClick}
          isLoading={isLoading}
        />
      ) : null}
    </div>
  )
}

function LoadingTemplate() {
  return (
    <>
      <Card isLoading />
      <Card isLoading />
      <Card isLoading />
      <Card isLoading />
    </>
  )
}
