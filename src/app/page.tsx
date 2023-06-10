import { db } from "@/lib/db"
import { TypographyH1, TypographyUl } from "@/components/typography"

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
      <TypographyH1>Forms</TypographyH1>
      <TypographyUl>
        {forms.map((form) => (
          <li key={form.id}>{form.title}</li>
        ))}
      </TypographyUl>
    </div>
  )
}

export default Home
