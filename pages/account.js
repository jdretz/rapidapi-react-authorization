import Head from 'next/head'
import styles from '../styles/Home.module.css'
import api from '../api'
import { useRouter } from 'next/router'
import useSWR from 'swr'

const fetcher = async (url) => api.get(url)

const Github = ({ data }) => {
  return (
      <div className={styles.github}>
          {!data ?
              <a href={`https://github.com/login/oauth/authorize?client_id=clientId`}>Authorize Github</a> :
              <div>
                  <pre>
                      <code>
                          {JSON.stringify(data, null, 4)}
                      </code>
                  </pre>
              </div>
          }
      </div>
  )
}

export default function Account({ query }) {
  const router = useRouter();

  let { code } = router.query;

  let [githubData, setGithubData] = React.useState('')

  React.useEffect(() => {
    if (code) {
      api.get(`/api/github?code=${code}`)
      .then((res) => {
        setGithubData(res.data)
      })
      .catch((e) => {
        console.log(e)
      })
      .finally(() => {
        code = ''
      })
    }
  }, [code, api])

  
  const { data, error } = useSWR('/api/user', fetcher)

  if (error) {
    router.push('/')
  }
    
  if (!data) {
    return <div>Loading...</div>
  }

  const logout = () => {
    api.get('/api/logout').then(() => {
      router.push('/')
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button className={styles.button} style={{ background: 'red', margin: 'none' }} onClick={() => logout()}>&larr; Logout</button>

      <main className={styles.main}>
        <h1>Authenticated Account Page</h1>
        <section className={styles.data}>
              <h2>Basic User Information</h2>
              <small>Since we know it's you.. here's your information!</small>

              <p><b>Name:</b> {data && data.data && data.data.name}</p>
              <p><b>Email:</b> {data && data.data && data.data.email}</p>

        </section>
        <section className={styles.data}>
          <h2>Github OAuth</h2>
          <small>Authorize this application to acces your Github information.</small>

          {/* Add Github component */}
          <Github data={githubData} />

        </section>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
