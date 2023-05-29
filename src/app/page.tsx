import { db } from "@/db"

import { H1, Ul } from "@/components/typography"

const getForms = async () => {
  const forms = await db.query.forms.findMany({
    with: {
      fields: true,
    },
  })

  return forms
}

const Home = async () => {
  const forms = await getForms()
  return (
    <div>
      <H1>Forms</H1>
      <Ul>
        {forms.map((form) => (
          <li key={form.id}>{form.title}</li>
        ))}
      </Ul>
    </div>
  )
}

export default Home
